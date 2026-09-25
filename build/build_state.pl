#!/usr/bin/perl
# build_state.pl — merge this run's raw pages into the rolling store (./state) and write site/data.json.
#   RAW_DIR   (default build/raw)   pages fetched by collect_incremental.sh or collect.sh
#   STATE_DIR (default ./state)     rolling store: updates.json (all), listings.json (12 h), completed.json (60 d), profiles.json, items.json, meta.json
#   OUT       (default site/data.json)  ships 6 h of listings and 30 d of completed trades
#   FORCE_RESET=1                   allow the store to shrink by more than half (otherwise the script refuses and exits 3)
# Exit codes: 0 ok, 2 corrupt store file, 3 merged store much smaller than before (refused), 4 nothing usable fetched and no store
use strict; use warnings; use JSON::PP; use POSIX qw(strftime);
my $dir = $0; $dir =~ s{[/\\][^/\\]+$}{}; $dir = '.' if $dir eq $0;
my $root = "$dir/.."; my $raw = $ENV{RAW_DIR} || "$dir/raw"; my $state = $ENV{STATE_DIR} || "$root/state"; my $out = $ARGV[0] || $ENV{OUT} || "$root/site/data.json";
my $LISTING_WINDOW_H = $ENV{LISTING_WINDOW_H} || 12; my $COMPLETED_WINDOW_D = $ENV{COMPLETED_WINDOW_D} || 60;
my $DATA_LISTING_H = $ENV{DATA_LISTING_HOURS} || 6; my $DATA_COMPLETED_D = $ENV{DATA_COMPLETED_DAYS} || 30;
mkdir $state unless -d $state;
my $J = JSON::PP->new->canonical; my $now = time; my $nowIso = strftime('%Y-%m-%dT%H:%M:%SZ', gmtime($now));
my @warnings;
sub note { my $m = shift; push @warnings, $m; print STDERR "warning: $m\n" }
sub slurp { my $f = shift; open(my $h, '<:raw', $f) or return undef; local $/; my $s = <$h>; close $h; $s }
sub load_store { # missing file -> undef (fine); unreadable/corrupt file -> die (never treat as empty)
    my $f = shift; return undef unless -e $f; my $s = slurp($f); die "corrupt store file $f (unreadable)\n" unless defined $s;
    my $d = eval { $J->decode($s) }; die "corrupt store file $f: " . ($@ || 'not JSON') . "\n" unless defined $d; $d }
sub load_raw { my $f = shift; my $s = slurp($f); return undef unless defined $s; eval { $J->decode($s) } }
sub save { my ($f, $d) = @_; my $tmp = "$f.tmp"; open(my $h, '>:raw', $tmp) or die "write $tmp: $!"; print $h $J->encode($d); close $h or die "close $tmp: $!"; rename($tmp, $f) or die "rename $tmp -> $f: $!" }
sub rsc { my ($file, $mode, $key) = @_; $key //= ''; my $s = `perl "$dir/rsc_extract.pl" "$file" $mode $key 2>/dev/null`; return $s ? eval { $J->decode($s) } : undef }
sub num { my $v = shift; return undef unless defined $v && $v ne '' && $v ne 'null'; return $v + 0 }
sub iso_ago { my $sec = shift; strftime('%Y-%m-%dT%H:%M:%SZ', gmtime($now - $sec)) }

my $prevMeta = load_store("$state/meta.json") || {};
my $firstRun = !%$prevMeta;
my $run = load_raw("$raw/run.json") || {};   # written by collect_incremental.sh: {listingBoundaryReached, oldestListingFetched, failed, degraded}

# ---------- items: per-category fallback to the last known catalogue ----------
my %pages = (pets=>'Pets', eggs=>'Eggs', petwear=>'PetWear', toys=>'Toys', food=>'Food', vehicles=>'Vehicles', gifts=>'Gifts', stickers=>'Stickers', houses=>'Houses', strollers=>'Strollers');
my $prevItems = load_store("$state/items.json") || []; my %prevByCat; push @{$prevByCat{$_->{cat}}}, $_ for @$prevItems;
my @items; my @itemFallback;
for my $p (sort keys %pages) {
    my $cat = $pages{$p}; my $arr = rsc("$raw/values/$p.html", 'items'); my @recs;
    for my $it (@{$arr || []}) {
        my %rec = (id => $it->{id}, name => $it->{name}, cat => $cat, origin => $it->{origin}, lastUpdatedAt => $it->{lastUpdatedAt});
        if ($p eq 'pets') {
            $rec{values} = { fr=>num($it->{regularValue}), r=>num($it->{rValue}), f=>num($it->{fValue}), np=>num($it->{npRegularValue}),
                             nfr=>num($it->{neonValue}), nr=>num($it->{nrValue}), nf=>num($it->{nfValue}), n=>num($it->{npNeonValue}),
                             mfr=>num($it->{megaValue}), mr=>num($it->{mrValue}), mf=>num($it->{mfValue}), m=>num($it->{npMegaValue}) };
            $rec{demand} = { fr=>$it->{regularDemand}, nfr=>$it->{neonDemand}, mfr=>$it->{megaDemand} };
        } else { $rec{values} = { v => num($it->{value}) }; $rec{demand} = { v => $it->{demand} }; }
        push @recs, \%rec;
    }
    my $prevN = scalar(@{$prevByCat{$cat} || []});
    if (@recs && (!$prevN || @recs >= 0.8 * $prevN)) { push @items, @recs }
    elsif ($prevN) { push @items, @{$prevByCat{$cat}}; push @itemFallback, $cat; note(sprintf("%s: page gave %d items (had %d); kept last known", $cat, scalar(@recs), $prevN)) }
    else { note("$cat: no items parsed and nothing known") }
}
die "no items at all and no store: nothing usable was fetched\n" if !@items && $firstRun;
exit 4 if !@items;
save("$state/items.json", \@items);
my %itemByName = map { $_->{name} => $_ } @items;

# ---------- updates: merge raw records by id (drop rows that carry neither a value nor a demand change) ----------
my %upd; my $prevU = load_store("$state/updates.json") || []; $upd{$_->{id}} = $_ for @$prevU;
my $newU = 0;
for my $f (sort glob("$raw/vu/*.json")) { my $j = load_raw($f) or next; for my $u (@{$j->{data} || []}) { next unless grep { /^(new|previous)/ && defined $u->{$_} } keys %$u; $newU++ unless $upd{$u->{id}}; $upd{$u->{id}} = $u } }
my @updRaw = sort { $b->{updatedAt} cmp $a->{updatedAt} } values %upd;

# ---------- listings: merge by id, strip usernames, keep the rolling window ----------
my %lst; my $prevL = load_store("$state/listings.json") || []; $lst{$_->{id}} = $_ for @$prevL;
my $newL = 0; my ($runOldest, $runNewest);
for my $f (sort glob("$raw/trades/*.json")) { my $j = load_raw($f) or next; for my $t (@{$j->{trades} || []}) { delete $t->{authorName}; $newL++ unless $lst{$t->{id}}; $lst{$t->{id}} = $t; my $p = $t->{publishedAt} // ''; $runOldest = $p if !defined $runOldest || $p lt $runOldest; $runNewest = $p if !defined $runNewest || $p gt $runNewest } }
my $lcut = iso_ago($LISTING_WINDOW_H * 3600);
my @lstRaw = sort { $b->{publishedAt} cmp $a->{publishedAt} } grep { ($_->{publishedAt} // '') ge $lcut } values %lst;

# ---------- profiles & completed trades ----------
my $profiles = load_store("$state/profiles.json") || {}; my %cmp; my $prevC = load_store("$state/completed.json") || []; $cmp{$_->{id}} = $_ for @$prevC;
my ($newP, $newC, $statsOk, $statsMiss) = (0, 0, 0, 0);
for my $f (sort glob("$raw/profiles/*.html")) {
    my ($uid) = $f =~ m{/(\d+)\.html$}; next unless $uid;
    my $html = slurp($f) or next; next if length($html) < 20000;
    my $text = $html; $text =~ s/<script.*?<\/script>//gs; $text =~ s/<[^>]+>/ /g; $text =~ s/&#x27;/'/g; $text =~ s/&amp;/&/g; $text =~ s/\s+/ /g;
    my %p = (uid => $uid, fetchedAt => $now);
    # the counters are separated from 'Joined <date>' by an optional bio, so parse each fact on its own
    ($p{joined}) = $text =~ /Joined ([A-Za-z]+ \d{1,2}, \d{4})/;
    my @c = $text =~ /(\d+) Posted (\d+) Accepted (\d+) Completed (\d+) Failed/;
    if (@c == 4) { @p{qw(posted accepted completed failed)} = map { $_ + 0 } @c; $statsOk++ } else { $statsMiss++ }
    ($p{name}) = $html =~ /<title>([^<]+?)(?:&#x27;|')s Profile - Adopt Me Values/;
    ($p{completedTotal}) = $html =~ /completedTradesPagination\\?"?:\\?\{[^}]*?totalItems\\?"?:(\d+)/;
    $p{completedTotal} += 0 if defined $p{completedTotal};
    $newP++ unless $profiles->{$uid};
    $profiles->{$uid} = \%p;
    for my $t (@{ rsc($f, 'key', 'completedTrades') || [] }) { next unless $t->{completed}; $newC++ unless $cmp{$t->{id}}; $cmp{$t->{id}} = { id => $t->{id}, uid => $uid, publishedAt => $t->{publishedAt}, offering => $t->{offering}, lookingFor => $t->{lookingFor} } }
}
note("profile stats parsed for $statsOk of " . ($statsOk + $statsMiss) . " fetched profiles") if $statsMiss > $statsOk;
my $ccut = iso_ago($COMPLETED_WINDOW_D * 86400);
my @cmpRaw = sort { $a->{publishedAt} cmp $b->{publishedAt} } grep { ($_->{publishedAt} // '') ge $ccut } values %cmp;
# prune profiles nobody references any more (no completed trade in the window and not fetched for a window's length)
my %referenced = map { $_->{uid} => 1 } @cmpRaw; $referenced{$_->{authorRobloxId}} = 1 for @lstRaw;
for my $uid (keys %$profiles) { delete $profiles->{$uid} if !$referenced{$uid} && ($profiles->{$uid}{fetchedAt} // 0) < $now - $COMPLETED_WINDOW_D * 86400 }

# ---------- refuse to shrink the store silently ----------
my %counts = (updates => scalar(@updRaw), listings => scalar(@lstRaw), completed => scalar(@cmpRaw), profiles => scalar(keys %$profiles), items => scalar(@items));
if (!$firstRun && !$ENV{FORCE_RESET}) {
    my $pc = $prevMeta->{storeCounts} || {};
    for my $k (qw(updates completed profiles items)) { # listings legitimately shrink when a window empties; the others only grow
        next unless ($pc->{$k} // 0) >= 100;
        if ($counts{$k} < 0.5 * $pc->{$k}) { print STDERR "refusing to save: $k shrank from $pc->{$k} to $counts{$k} (set FORCE_RESET=1 to allow)\n"; exit 3 }
    }
}
save("$state/updates.json", \@updRaw); save("$state/listings.json", \@lstRaw); save("$state/profiles.json", $profiles); save("$state/completed.json", \@cmpRaw);

# ---------- data.json for the engine ----------
sub norm_side { my $arr = shift; my @o;
    for my $x (@{$arr || []}) {
        if (defined $x->{name}) { push @o, { name => $x->{name}, (defined $x->{type} && $x->{type} ne '' ? (type => $x->{type}) : ()) } }
        elsif (defined $x->{sign}) { my ($s) = ($x->{sign} // '') =~ m{/([A-Za-z]+)\.webp$}; push @o, { sign => $s // $x->{sign}, (defined $x->{signValue} ? (signValue => num($x->{signValue})) : ()) } }
    } \@o }
my @updates; my %lastLogged; # name|var -> [t, new] of the newest logged value change
for my $u (@updRaw) {
    my $base = { t => $u->{updatedAt}, item => $u->{itemName}, cat => $u->{itemCategory} };
    for my $pr (['v','previousRegularValue','newRegularValue'], ['v','previousItemValue','newItemValue'], ['v','previousValue','newValue'], ['nfr','previousNeonValue','newNeonValue'], ['mfr','previousMegaValue','newMegaValue']) {
        my ($var, $pk, $nk) = @$pr; next unless defined $u->{$pk} || defined $u->{$nk};
        my ($pv, $nv) = (num($u->{$pk}), num($u->{$nk})); next if defined $pv && defined $nv && $pv == $nv;
        push @updates, { %$base, var => $var, prev => $pv, new => $nv };
        my $k = "$u->{itemName}|$var"; $lastLogged{$k} = [$u->{updatedAt}, $nv] if defined $nv && (!$lastLogged{$k} || $u->{updatedAt} gt $lastLogged{$k}[0]);
    }
    for my $pr (['v','previousRegularDemand','newRegularDemand'], ['v','previousItemDemand','newItemDemand'], ['v','previousDemand','newDemand'], ['nfr','previousNeonDemand','newNeonDemand'], ['mfr','previousMegaDemand','newMegaDemand']) {
        my ($var, $pk, $nk) = @$pr; next unless defined $u->{$pk} || defined $u->{$nk};
        push @updates, { %$base, var => $var, prevDemand => $u->{$pk}, newDemand => $u->{$nk} };
    }
}
# the public log misses some changes: close every series on today's listed value so history and catalogue agree
my $synthetic = 0;
for my $it (@items) {
    my @tiers = $it->{cat} eq 'Pets' ? (['v','fr'], ['nfr','nfr'], ['mfr','mfr']) : (['v','v']);
    for my $tv (@tiers) { my ($var, $field) = @$tv; my $cur = $it->{values}{$field}; next unless defined $cur && $cur > 0;
        my $ll = $lastLogged{"$it->{name}|$var"}; next unless $ll && defined $ll->[1] && $ll->[1] > 0; next if abs($ll->[1] - $cur) / $cur < 0.001;
        my $t = ($it->{lastUpdatedAt} // '') gt $ll->[0] ? $it->{lastUpdatedAt} : $nowIso;
        push @updates, { t => $t, item => $it->{name}, cat => $it->{cat}, var => $var, prev => $ll->[1], new => $cur, synthetic => JSON::PP::true }; $synthetic++ }
}
@updates = sort { $a->{t} cmp $b->{t} } @updates;
my $dlcut = iso_ago($DATA_LISTING_H * 3600); my $dccut = iso_ago($DATA_COMPLETED_D * 86400);
my @listings = map { { id => $_->{id}, t => $_->{publishedAt}, uid => $_->{authorRobloxId}, offering => norm_side($_->{offering}), lookingFor => norm_side($_->{lookingFor}) } } grep { ($_->{publishedAt} // '') ge $dlcut } @lstRaw;
my @completed = map { { id => $_->{id}, t => $_->{publishedAt}, uid => $_->{uid}, offering => norm_side($_->{offering}), lookingFor => norm_side($_->{lookingFor}) } } grep { ($_->{publishedAt} // '') ge $dccut } @cmpRaw;
my %ship = map { $_->{uid} => 1 } @completed; $ship{$_->{uid}} = 1 for @listings;
my %prof; my $profStats = 0;
for my $u (grep { $ship{$_} } keys %$profiles) { my $p = $profiles->{$u}; $prof{$u} = { map { my $k = $_; ($k => $p->{$k}) } grep { $_ ne 'fetchedAt' } keys %$p }; $profStats++ if defined $p->{completed} }
die "profile export produced no stats although " . scalar(keys %prof) . " profiles were exported\n" if keys(%prof) >= 50 && $profStats == 0;

# listing coverage: only advance the boundary when this run actually reached the previous one (or this is the first run)
my $prevBoundary = $prevMeta->{newestListingAt};
my $reached = $firstRun || !$prevBoundary || ($run->{listingBoundaryReached} // 1) ? 1 : 0;
my $newestListingAt = $reached ? ($runNewest // $prevBoundary) : $prevBoundary;
my @gaps = @{$prevMeta->{listingGaps} || []};
push @gaps, { from => $prevBoundary, to => $runOldest, run => $nowIso } if !$reached && defined $runOldest;
@gaps = grep { ($_->{to} // '') ge $lcut } @gaps;

my $meta = { collectedAt => $nowIso, listingWindowHours => $DATA_LISTING_H, completedWindowDays => $DATA_COMPLETED_D, storeListingHours => $LISTING_WINDOW_H, storeCompletedDays => $COMPLETED_WINDOW_D,
             counts => { items => scalar(@items), updates => scalar(@updates), listings => scalar(@listings), completed => scalar(@completed), profiles => scalar(keys %prof), profilesWithStats => $profStats, syntheticUpdates => $synthetic },
             updatesFrom => (@updates ? $updates[0]{t} : undef), updatesTo => (@updates ? $updates[-1]{t} : undef),
             run => { newUpdates => $newU, newListings => $newL, newCompleted => $newC, newProfiles => $newP, itemFallback => \@itemFallback, listingBoundaryReached => $reached, degraded => ($run->{degraded} ? JSON::PP::true : JSON::PP::false), failedFetches => ($run->{failed} // 0) + 0, warnings => \@warnings },
             listingGaps => \@gaps };
save($out, { meta => $meta, items => \@items, updates => \@updates, listings => \@listings, completed => \@completed, profiles => \%prof });
save("$state/meta.json", { lastRun => $nowIso, newestUpdateAt => (@updRaw ? $updRaw[0]{updatedAt} : $prevMeta->{newestUpdateAt}), newestListingAt => $newestListingAt, listingGaps => \@gaps, storeCounts => \%counts, lastDeepRun => ($ENV{FULL} && $ENV{FULL} eq '1') ? $nowIso : $prevMeta->{lastDeepRun} });
printf "store: %d update records (+%d), %d listings (%dh, +%d), %d completed (%dd, +%d), %d profiles (+%d, stats for %d) | data.json: items=%d updates=%d (%d synthetic) listings=%d completed=%d profiles=%d | boundary %s%s%s\n",
    scalar(@updRaw), $newU, scalar(@lstRaw), $LISTING_WINDOW_H, $newL, scalar(@cmpRaw), $COMPLETED_WINDOW_D, $newC, scalar(keys %$profiles), $newP, $statsOk, scalar(@items), scalar(@updates), $synthetic, scalar(@listings), scalar(@completed), scalar(keys %prof), ($reached ? 'reached' : 'NOT reached (gap recorded)'), (@itemFallback ? ' | item fallback: ' . join(',', @itemFallback) : ''), ($run->{degraded} ? ' | DEGRADED run' : '');
