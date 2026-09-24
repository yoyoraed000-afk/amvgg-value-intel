#!/usr/bin/perl
# build_state.pl — merge this run's raw pages into the rolling store (./state) and write site/data.json.
#   RAW_DIR   (default build/raw)   pages fetched by collect_incremental.sh or collect.sh
#   STATE_DIR (default ./state)     rolling store: updates.json (all), listings.json (48 h), completed.json (60 d), profiles.json, items.json, meta.json
#   OUT       (default site/data.json)
use strict; use warnings; use JSON::PP; use POSIX qw(strftime);
my $dir = $0; $dir =~ s{[/\\][^/\\]+$}{}; $dir = '.' if $dir eq $0;
my $root = "$dir/.."; my $raw = $ENV{RAW_DIR} || "$dir/raw"; my $state = $ENV{STATE_DIR} || "$root/state"; my $out = $ARGV[0] || $ENV{OUT} || "$root/site/data.json";
# store windows (what the data branch keeps) and page windows (what site/data.json ships; the site posts ~6,400 listings an hour)
my $LISTING_WINDOW_H = $ENV{LISTING_WINDOW_H} || 12; my $COMPLETED_WINDOW_D = $ENV{COMPLETED_WINDOW_D} || 60;
my $DATA_LISTING_H = $ENV{DATA_LISTING_HOURS} || 6; my $DATA_COMPLETED_D = $ENV{DATA_COMPLETED_DAYS} || 30;
mkdir $state unless -d $state;
my $J = JSON::PP->new->canonical; my $now = time; my $nowIso = strftime('%Y-%m-%dT%H:%M:%SZ', gmtime($now));
sub slurp { my $f = shift; open(my $h, '<:raw', $f) or return undef; local $/; my $s = <$h>; close $h; $s }
sub load { my $f = shift; my $s = slurp($f); return undef unless defined $s; eval { $J->decode($s) } }
sub save { my ($f, $d) = @_; open(my $h, '>:raw', $f) or die "write $f: $!"; print $h $J->encode($d); close $h }
sub rsc { my ($file, $mode, $key) = @_; $key //= ''; my $s = `perl "$dir/rsc_extract.pl" "$file" $mode $key 2>/dev/null`; return $s ? eval { $J->decode($s) } : undef }
sub num { my $v = shift; return undef unless defined $v && $v ne '' && $v ne 'null'; return $v + 0 }
sub iso_ago { my $sec = shift; strftime('%Y-%m-%dT%H:%M:%SZ', gmtime($now - $sec)) }

# ---------- items (from this run's value pages, else last known) ----------
my @items; my %pages = (pets=>'Pets', eggs=>'Eggs', petwear=>'PetWear', toys=>'Toys', food=>'Food', vehicles=>'Vehicles', gifts=>'Gifts', stickers=>'Stickers', houses=>'Houses', strollers=>'Strollers');
for my $p (sort keys %pages) {
    my $arr = rsc("$raw/values/$p.html", 'items') or next;
    for my $it (@$arr) {
        my %rec = (id => $it->{id}, name => $it->{name}, cat => $pages{$p}, origin => $it->{origin}, lastUpdatedAt => $it->{lastUpdatedAt});
        if ($p eq 'pets') {
            $rec{values} = { fr=>num($it->{regularValue}), r=>num($it->{rValue}), f=>num($it->{fValue}), np=>num($it->{npRegularValue}),
                             nfr=>num($it->{neonValue}), nr=>num($it->{nrValue}), nf=>num($it->{nfValue}), n=>num($it->{npNeonValue}),
                             mfr=>num($it->{megaValue}), mr=>num($it->{mrValue}), mf=>num($it->{mfValue}), m=>num($it->{npMegaValue}) };
            $rec{demand} = { fr=>$it->{regularDemand}, nfr=>$it->{neonDemand}, mfr=>$it->{megaDemand} };
        } else { $rec{values} = { v => num($it->{value}) }; $rec{demand} = { v => $it->{demand} }; }
        push @items, \%rec;
    }
}
if (@items >= 1000) { save("$state/items.json", \@items) } else { my $prev = load("$state/items.json"); if ($prev && @$prev) { warn sprintf("only %d items parsed this run; using last known %d\n", scalar(@items), scalar(@$prev)); @items = @$prev } }

# ---------- updates: merge raw records by id ----------
my %upd; my $prevU = load("$state/updates.json") || []; $upd{$_->{id}} = $_ for @$prevU;
for my $f (sort glob("$raw/vu/*.json")) { my $j = load($f) or next; $upd{$_->{id}} = $_ for @{$j->{data} || []} }
my @updRaw = sort { $b->{updatedAt} cmp $a->{updatedAt} } values %upd; save("$state/updates.json", \@updRaw);

# ---------- listings: merge by id, keep the rolling window ----------
my %lst; my $prevL = load("$state/listings.json") || []; $lst{$_->{id}} = $_ for @$prevL;
for my $f (sort glob("$raw/trades/*.json")) { my $j = load($f) or next; $lst{$_->{id}} = $_ for @{$j->{trades} || []} }
my $lcut = iso_ago($LISTING_WINDOW_H * 3600);
my @lstRaw = sort { $b->{publishedAt} cmp $a->{publishedAt} } grep { ($_->{publishedAt} // '') ge $lcut } values %lst; save("$state/listings.json", \@lstRaw);

# ---------- profiles & completed trades ----------
my $profiles = load("$state/profiles.json") || {}; my %cmp; my $prevC = load("$state/completed.json") || []; $cmp{$_->{id}} = $_ for @$prevC;
for my $f (sort glob("$raw/profiles/*.html")) {
    my ($uid) = $f =~ m{/(\d+)\.html$}; next unless $uid;
    my $html = slurp($f) or next; next if length($html) < 20000;
    my $text = $html; $text =~ s/<script.*?<\/script>//gs; $text =~ s/<[^>]+>/ /g; $text =~ s/&#x27;/'/g; $text =~ s/\s+/ /g;
    my %p = (uid => $uid, fetchedAt => $now);
    if ($text =~ /Joined ([A-Za-z]+ \d+, \d{4}) (\d+) Posted (\d+) Accepted (\d+) Completed (\d+) Failed/) { @p{qw(joined posted accepted completed failed)} = ($1, $2+0, $3+0, $4+0, $5+0) }
    ($p{name}) = $text =~ /^\s*(\S+) User View on Roblox/;
    $profiles->{$uid} = \%p;
    for my $t (@{ rsc($f, 'key', 'completedTrades') || [] }) { next unless $t->{completed}; $cmp{$t->{id}} = { id => $t->{id}, uid => $uid, publishedAt => $t->{publishedAt}, offering => $t->{offering}, lookingFor => $t->{lookingFor} } }
}
save("$state/profiles.json", $profiles);
my $ccut = iso_ago($COMPLETED_WINDOW_D * 86400);
my @cmpRaw = sort { $a->{publishedAt} cmp $b->{publishedAt} } grep { ($_->{publishedAt} // '') ge $ccut } values %cmp; save("$state/completed.json", \@cmpRaw);

# ---------- data.json for the engine ----------
sub norm_side { my $arr = shift; my @o;
    for my $x (@{$arr || []}) {
        if (defined $x->{name}) { push @o, { name => $x->{name}, (defined $x->{type} && $x->{type} ne '' ? (type => $x->{type}) : ()) } }
        elsif (defined $x->{sign}) { my ($s) = ($x->{sign} // '') =~ m{/([A-Za-z]+)\.webp$}; push @o, { sign => $s // $x->{sign}, (defined $x->{signValue} ? (signValue => num($x->{signValue})) : ()) } }
    } \@o }
my @updates;
for my $u (@updRaw) {
    my $base = { t => $u->{updatedAt}, item => $u->{itemName}, cat => $u->{itemCategory} };
    for my $pr (['v','previousRegularValue','newRegularValue'], ['v','previousItemValue','newItemValue'], ['v','previousValue','newValue'], ['nfr','previousNeonValue','newNeonValue'], ['mfr','previousMegaValue','newMegaValue']) {
        my ($var, $pk, $nk) = @$pr; next unless defined $u->{$pk} || defined $u->{$nk};
        push @updates, { %$base, var => $var, prev => num($u->{$pk}), new => num($u->{$nk}) };
    }
    for my $pr (['v','previousRegularDemand','newRegularDemand'], ['v','previousItemDemand','newItemDemand'], ['v','previousDemand','newDemand'], ['nfr','previousNeonDemand','newNeonDemand'], ['mfr','previousMegaDemand','newMegaDemand']) {
        my ($var, $pk, $nk) = @$pr; next unless defined $u->{$pk} || defined $u->{$nk};
        push @updates, { %$base, var => $var, prevDemand => $u->{$pk}, newDemand => $u->{$nk} };
    }
}
@updates = sort { $a->{t} cmp $b->{t} } @updates;
my $dlcut = iso_ago($DATA_LISTING_H * 3600); my $dccut = iso_ago($DATA_COMPLETED_D * 86400);
my @listings = map { { id => $_->{id}, t => $_->{publishedAt}, uid => $_->{authorRobloxId}, offering => norm_side($_->{offering}), lookingFor => norm_side($_->{lookingFor}) } } grep { ($_->{publishedAt} // '') ge $dlcut } @lstRaw;
my @completed = map { { id => $_->{id}, t => $_->{publishedAt}, uid => $_->{uid}, offering => norm_side($_->{offering}), lookingFor => norm_side($_->{lookingFor}) } } grep { ($_->{publishedAt} // '') ge $dccut } @cmpRaw;
my %prof = map { $_ => { map { $_ => $profiles->{$_}{$_} } grep { $_ ne 'fetchedAt' } keys %{$profiles->{$_}} } } keys %$profiles;
my $meta = { collectedAt => $nowIso, listingWindowHours => $DATA_LISTING_H, completedWindowDays => $DATA_COMPLETED_D, storeListingHours => $LISTING_WINDOW_H, storeCompletedDays => $COMPLETED_WINDOW_D,
             counts => { items => scalar(@items), updates => scalar(@updates), listings => scalar(@listings), completed => scalar(@completed), profiles => scalar(keys %prof) },
             updatesFrom => (@updates ? $updates[0]{t} : undef), updatesTo => (@updates ? $updates[-1]{t} : undef) };
save($out, { meta => $meta, items => \@items, updates => \@updates, listings => \@listings, completed => \@completed, profiles => \%prof });
save("$state/meta.json", { lastRun => $nowIso, newestUpdateAt => (@updRaw ? $updRaw[0]{updatedAt} : undef), newestListingAt => (@lstRaw ? $lstRaw[0]{publishedAt} : undef), counts => $meta->{counts} });
printf "state: %d update records, %d listings (%dh), %d completed (%dd), %d profiles | data.json: items=%d updates=%d listings=%d completed=%d\n", scalar(@updRaw), scalar(@lstRaw), $LISTING_WINDOW_H, scalar(@cmpRaw), $COMPLETED_WINDOW_D, scalar(keys %$profiles), scalar(@items), scalar(@updates), scalar(@listings), scalar(@completed);
