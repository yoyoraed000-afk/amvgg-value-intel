#!/usr/bin/perl
# rsc_extract.pl <file.html> <mode> [key]
# Decodes the Next.js RSC payload (self.__next_f.push([1,"..."])) embedded in a page and
# prints the JSON array found under a key.  mode:
#   key <name>   -> the first `"<name>":[ ... ]` array
#   items        -> the first array of objects that carry "lastUpdatedAt" (value-list pages)
#   text         -> the decoded payload (debugging)
use strict; use warnings; use JSON::PP;
my ($file, $mode, $key) = @ARGV;
open(my $fh, '<:raw', $file) or die "open $file: $!";
local $/; my $html = <$fh>; close $fh;
my $payload = '';
while ($html =~ /self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g) {
    my $s = eval { JSON::PP->new->decode("[$1]")->[0] };
    $payload .= $s if defined $s;
}
$payload =~ s/"\$D(\d{4}-\d\d-\d\dT[^"]*)"/"$1"/g;   # React date wrapper
if ($mode eq 'text') { print $payload; exit }
my $start;
if ($mode eq 'key') {
    my $idx = index($payload, "\"$key\":[");
    die "key $key not found\n" if $idx < 0;
    $start = $idx + length("\"$key\":");
} else {
    while ($payload =~ /\[\{"id":"[0-9a-f]{24}","name":"/g) {
        my $p = pos($payload) - length($&);
        if (substr($payload, $p, 3000) =~ /lastUpdatedAt/) { $start = $p; last }
    }
    die "no item array found\n" unless defined $start;
}
# bracket-match respecting strings
my ($depth, $i, $instr, $esc) = (0, $start, 0, 0);
my $len = length($payload);
for (; $i < $len; $i++) {
    my $c = substr($payload, $i, 1);
    if ($instr) { if ($esc) { $esc = 0 } elsif ($c eq '\\') { $esc = 1 } elsif ($c eq '"') { $instr = 0 } next }
    if ($c eq '"') { $instr = 1 }
    elsif ($c eq '[' || $c eq '{') { $depth++ }
    elsif ($c eq ']' || $c eq '}') { $depth--; if ($depth == 0) { $i++; last } }
}
my $json = substr($payload, $start, $i - $start);
my $arr = JSON::PP->new->decode($json);   # validate
print JSON::PP->new->canonical->encode($arr);
