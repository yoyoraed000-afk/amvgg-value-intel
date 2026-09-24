#!/usr/bin/perl
# build_data.pl  -> writes data.json (the dataset the prediction engine consumes)
use strict; use warnings; use JSON::PP; use POSIX qw(strftime);
my $dir = $0; $dir =~ s{[/\\][^/\\]+$}{}; $dir = '.' if $dir eq $0;
my $raw = "$dir/raw"; my $out = $ARGV[0] || "$dir/data.json";
my $J = JSON::PP->new->canonical;
sub slurp { my $f = shift; open(my $h, '<:raw', $f) or return undef; local $/; my $s = <$h>; close $h; $s }
sub rsc { my ($file, $mode, $key) = @_; $key //= ''; my $s = `perl "$dir/rsc_extract.pl" "$file" $mode $key 2>/dev/null`; return $s ? eval { $J->decode($s) } : undef }
sub num { my $v = shift; return undef unless defined $v && $v ne '' && $v ne 'null'; return $v + 0 }

# ---------- items ----------
my @items; my %cat_of;
my %pages = (pets=>'Pets', eggs=>'Eggs', petwear=>'PetWear', toys=>'Toys', food=>'Food', vehicles=>'Vehicles', gifts=>'Gifts', stickers=>'Stickers', houses=>'Houses', strollers=>'Strollers');
for my $p (sort keys %pages) {
    my $arr = rsc("$raw/values/$p.html", 'items') or do { warn "no items for $p\n"; next };
    for my $it (@$arr) {
        my %rec = (id => $it->{id}, name => $it->{name}, cat => $pages{$p}, origin => $it->{origin}, lastUpdatedAt => $it->{lastUpdatedAt});
        if ($p eq 'pets') {
            $rec{values} = { fr=>num($it->{regularValue}), r=>num($it->{rValue}), f=>num($it->{fValue}), np=>num($it->{npRegularValue}),
                             nfr=>num($it->{neonValue}), nr=>num($it->{nrValue}), nf=>num($it->{nfValue}), n=>num($it->{npNeonValue}),
                             mfr=>num($it->{megaValue}), mr=>num($it->{mrValue}), mf=>num($it->{mfValue}), m=>num($it->{npMegaValue}) };
            $rec{demand} = { fr=>$it->{regularDemand}, nfr=>$it->{neonDemand}, mfr=>$it->{megaDemand} };
        } else {
            $rec{values} = { v => num($it->{value}) };
            $rec{demand} = { v => $it->{demand} };
        }
        push @items, \%rec; $cat_of{$it->{name}} = $pages{$p};
    }
}

# ---------- value updates ----------
my @updates; my %seen_u;
for my $f (sort glob("$raw/vu/*.json")) {
    my $j = eval { $J->decode(slurp($f)) } or next;
    for my $u (@{$j->{data} || []}) {
        next if $seen_u{$u->{id}}++;
        my $base = { t => $u->{updatedAt}, item => $u->{itemName}, cat => $u->{itemCategory} };
        my @pairs = (['v','previousRegularValue','newRegularValue'], ['v','previousItemValue','newItemValue'], ['v','previousValue','newValue'],
                     ['nfr','previousNeonValue','newNeonValue'], ['mfr','previousMegaValue','newMegaValue']);
        for my $pr (@pairs) {
            my ($var, $pk, $nk) = @$pr;
            next unless defined $u->{$pk} || defined $u->{$nk};
            push @updates, { %$base, var => $var, prev => num($u->{$pk}), new => num($u->{$nk}) };
        }
        for my $pr (['v','previousRegularDemand','newRegularDemand'], ['v','previousItemDemand','newItemDemand'], ['v','previousDemand','newDemand'], ['nfr','previousNeonDemand','newNeonDemand'], ['mfr','previousMegaDemand','newMegaDemand']) {
            my ($var, $pk, $nk) = @$pr;
            next unless defined $u->{$pk} || defined $u->{$nk};
            push @updates, { %$base, var => $var, prevDemand => $u->{$pk}, newDemand => $u->{$nk} };
        }
    }
}
@updates = sort { $a->{t} cmp $b->{t} } @updates;

# ---------- listings ----------
sub norm_side { my $arr = shift; my @o;
    for my $x (@{$arr || []}) {
        if (defined $x->{name}) { push @o, { name => $x->{name}, (defined $x->{type} && $x->{type} ne '' ? (type => $x->{type}) : ()) } }
        elsif (defined $x->{sign}) { my ($s) = $x->{sign} =~ m{/([A-Za-z]+)\.webp$}; push @o, { sign => $s // $x->{sign}, (defined $x->{signValue} ? (signValue => num($x->{signValue})) : ()) } }
    }
    \@o }
my @listings; my %seen_l;
for my $f (sort glob("$raw/trades/*.json")) {
    my $j = eval { $J->decode(slurp($f)) } or next;
    for my $t (@{$j->{trades} || []}) {
        next if $seen_l{$t->{id}}++;
        push @listings, { id => $t->{id}, t => $t->{publishedAt}, uid => $t->{authorRobloxId}, user => $t->{authorName},
                          offering => norm_side($t->{offering}), lookingFor => norm_side($t->{lookingFor}) };
    }
}

# ---------- profiles: completed trades + reputation ----------
my @completed; my %seen_c; my %profiles;
for my $f (sort glob("$raw/profiles/*.html")) {
    my ($uid) = $f =~ m{/(\d+)\.html$}; next unless $uid;
    my $html = slurp($f) or next;
    my $text = $html; $text =~ s/<script.*?<\/script>//gs; $text =~ s/<[^>]+>/ /g; $text =~ s/&#x27;/'/g; $text =~ s/\s+/ /g;
    my %p = (uid => $uid);
    if ($text =~ /Joined ([A-Za-z]+ \d+, \d{4}) (\d+) Posted (\d+) Accepted (\d+) Completed (\d+) Failed/) {
        @p{qw(joined posted accepted completed failed)} = ($1, $2+0, $3+0, $4+0, $5+0);
    }
    ($p{name}) = $text =~ /^\s*(\S+) User View on Roblox/;
    $profiles{$uid} = \%p;
    my $ct = rsc($f, 'key', 'completedTrades') || [];
    for my $t (@$ct) {
        next unless $t->{completed};
        next if $seen_c{$t->{id}}++;
        push @completed, { id => $t->{id}, t => $t->{publishedAt}, uid => $uid, offering => norm_side($t->{offering}), lookingFor => norm_side($t->{lookingFor}) };
    }
}
@completed = sort { $a->{t} cmp $b->{t} } @completed;

my $data = { meta => { collectedAt => strftime('%Y-%m-%dT%H:%M:%SZ', gmtime),
                       counts => { items => scalar(@items), updates => scalar(@updates), listings => scalar(@listings), completed => scalar(@completed), profiles => scalar(keys %profiles) },
                       updatesFrom => (@updates ? $updates[0]{t} : undef), updatesTo => (@updates ? $updates[-1]{t} : undef) },
             items => \@items, updates => \@updates, listings => \@listings, completed => \@completed, profiles => \%profiles };
open(my $o, '>:raw', $out) or die; print $o $J->encode($data); close $o;
printf "wrote %s: items=%d updates=%d listings=%d completed=%d profiles=%d (updates %s .. %s)\n", $out, scalar(@items), scalar(@updates), scalar(@listings), scalar(@completed), scalar(keys %profiles), $data->{meta}{updatesFrom}//'-', $data->{meta}{updatesTo}//'-';
