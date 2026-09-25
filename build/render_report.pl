#!/usr/bin/perl
# render_report.pl <report.json> <out.html> [--bare]
# Renders a morning report (the JSON written next to it in docs/) as a static page in the dashboard's visual identity.
# --bare omits the doctype/html/head/body wrapper (for hosts that add their own).
use strict; use warnings; use JSON::PP;
my ($in, $out, $bare) = @ARGV; die "usage: render_report.pl report.json out.html [--bare]\n" unless $in && $out;
$bare = ($bare // '') eq '--bare';
open(my $fh, '<:raw', $in) or die "read $in: $!"; local $/; my $J = decode_json(<$fh>); close $fh;
my $R = $J->{report}; my $F = $J->{fix} || {}; my $C = $J->{checks} || [];
sub esc { my $s = shift // ''; $s =~ s/&/&amp;/g; $s =~ s/</&lt;/g; $s =~ s/>/&gt;/g; $s =~ s/"/&quot;/g; $s }
sub rich { # escape, then link URLs, mark arrows and signed moves
    my $s = esc(shift);
    $s =~ s{(https?://[^\s<)]+[^\s<).,;])}{<a href="$1">$1</a>}g;
    $s =~ s/ -&gt; /<span class="arr">\x{2192}<\/span>/g; $s =~ s/-&gt;/\x{2192}/g;
    $s =~ s/(?<![\w.])(\+\d[\d.,]*%)/<span class="up">$1<\/span>/g; $s =~ s/(?<![\w.])(-\d[\d.,]*%)/<span class="down">$1<\/span>/g;
    $s }
sub slug { my $s = lc(shift // ''); $s =~ s/^\d+[a-z]?\.\s*//; $s =~ s/[^a-z0-9]+/-/g; $s =~ s/^-|-$//g; $s }
sub isnum { my $c = shift // ''; $c =~ /^[+\-\x{2212}]?\s*[\d.,]+\s*(%|x|×)?$/ || $c =~ /^\d[\d.,]*\s*(->|\x{2192})\s*\d[\d.,]*$/ }
my @secs = @{$R->{sections}};
my $toc = join('', map { my $h = $_->{heading}; my ($n, $t) = $h =~ /^(\d+[a-z]?)\.\s*(.*)$/; '<a href="#' . slug($h) . '">' . ($n ? '<b>' . esc($n) . '</b> ' : '') . esc($t // $h) . '</a>' } @secs);
my $applied = scalar(@{$F->{applied} || []}); my $skipped = scalar(@{$F->{skipped} || []});
my $verified = 0; my $remaining = 0; for my $c (@$C) { $verified += $c->{ok} || 0; $remaining += scalar(@{$c->{remaining} || []}) }
my $body = '';
$body .= '<header class="masthead"><div class="wordmark">AMVGG.COM <span class="dot"></span><span class="sub">Value Intelligence</span></div><p class="kicker">Morning report &middot; Friday 25 September 2026 &middot; snapshot 11:04 UTC</p><h1>' . rich($R->{headline}) . '</h1></header>';
$body .= '<section class="glance" aria-label="At a glance"><div class="tile"><div class="label">Raise calls</div><div class="num">414</div><div class="hint">of 3,136 pet tiers and items</div></div><div class="tile"><div class="label">Lower calls</div><div class="num">7</div><div class="hint">history rarely learns drops</div></div><div class="tile"><div class="label">Odds ceiling</div><div class="num">74%</div><div class="hint">calibrated: what the most confident calls actually hit</div></div><div class="tile"><div class="label">Backtest</div><div class="num">90%</div><div class="hint">vs 84% always-hold, embargoed</div></div><div class="tile"><div class="label">Runs since last night</div><div class="num">6 / 6</div><div class="hint">all green; deep pass auto-detected</div></div><div class="tile"><div class="label">Review</div><div class="num">70</div><div class="hint">findings filed; ' . $applied . ' round-2 fixes applied, ' . $skipped . ' documented open</div></div></section>';
$body .= '<nav class="toc" aria-label="Sections">' . $toc . '</nav>';
for my $s (@secs) {
    my $h = $s->{heading}; my ($n, $t) = $h =~ /^(\d+[a-z]?)\.\s*(.*)$/;
    $body .= '<section class="sec" id="' . slug($h) . '"><h2>' . ($n ? '<span class="n">' . esc($n) . '</span>' : '') . esc($t // $h) . '</h2>';
    $body .= '<p>' . rich($_) . '</p>' for @{$s->{paragraphs} || []};
    if ($s->{table} && $s->{table}{columns}) {
        my $cols = $s->{table}{columns};
        $body .= '<div class="twrap"><table><thead><tr>' . join('', map { '<th scope="col">' . esc($_) . '</th>' } @$cols) . '</tr></thead><tbody>';
        for my $row (@{$s->{table}{rows} || []}) { $body .= '<tr>' . join('', map { my $c = $row->[$_] // ''; '<td' . (isnum($c) ? ' class="num"' : '') . ($_ == 0 ? ' class="first"' : '') . '>' . rich($c) . '</td>' } 0 .. $#$cols) . '</tr>' }
        $body .= '</tbody></table></div>';
    }
    if ($s->{bullets} && @{$s->{bullets}}) {
        my $ordered = $s->{bullets}[0] =~ /^\d+\.\s/;
        $body .= $ordered ? '<ol class="steps">' : '<ul class="pts">';
        for my $b (@{$s->{bullets}}) { my $x = $b; $x =~ s/^\d+\.\s+// if $ordered; $body .= '<li>' . rich($x) . '</li>' }
        $body .= $ordered ? '</ol>' : '</ul>';
    }
    $body .= '</section>';
}
$body .= '<section class="sec" id="what-changed-in-round-2"><h2><span class="n">A</span>Appendix: round-2 fixes and what stayed open</h2><p>Applied this morning in commit 0d0bf63 after five independent checkers re-verified the overnight fixes (' . $verified . ' items verified, ' . $remaining . ' raised, ' . $applied . ' addressed).</p><ul class="pts">' . join('', map { '<li><b>' . esc($_->{title}) . '.</b> ' . rich($_->{what}) . '</li>' } @{$F->{applied} || []}) . '</ul><h3>Left open on purpose</h3><ul class="pts">' . join('', map { '<li><b>' . esc($_->{title}) . '.</b> ' . rich($_->{reason}) . '</li>' } @{$F->{skipped} || []}) . '</ul></section>';
$body .= '<footer class="foot">Dashboard: <a href="https://yoyoraed000-afk.github.io/amvgg-value-intel/">yoyoraed000-afk.github.io/amvgg-value-intel</a> &middot; Repo: <a href="https://github.com/yoyoraed000-afk/amvgg-value-intel">github.com/yoyoraed000-afk/amvgg-value-intel</a> &middot; This report, the three analyst studies and the fix log are in the repo under docs/. Predictions are estimates from public site data, not advice.</footer>';
my $css = <<'CSS';
  :root {
    color-scheme: light;
    --page: #f4f4f1; --surface: #ffffff; --raised: #ecece8; --line: rgba(20,20,20,0.10); --line-strong: rgba(20,20,20,0.22);
    --ink: #1b1b1b; --ink-2: #4f4f4b; --ink-3: #666660;
    --accent: #0a75a2; --accent-ink: #063a52; --accent-soft: rgba(10,117,162,0.10); --brand: #fb0279;
    --rise: #3f7410; --fall: #b93535;
    --font-display: "Baloo 2", "Segoe UI", system-ui, sans-serif; --font-body: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif; --font-mono: "IBM Plex Mono", Consolas, monospace;
  }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { color-scheme: dark; --page: #1b1b1b; --surface: #242424; --raised: #2e2e2e; --line: rgba(255,255,255,0.09); --line-strong: rgba(255,255,255,0.18); --ink: #f2f2f2; --ink-2: #b9b9b3; --ink-3: #9a9a95; --accent: #039ad6; --accent-ink: #9ad9f5; --accent-soft: rgba(3,154,214,0.16); --rise: #8dc53e; --fall: #f28584; } }
  :root[data-theme="dark"] { color-scheme: dark; --page: #1b1b1b; --surface: #242424; --raised: #2e2e2e; --line: rgba(255,255,255,0.09); --line-strong: rgba(255,255,255,0.18); --ink: #f2f2f2; --ink-2: #b9b9b3; --ink-3: #9a9a95; --accent: #039ad6; --accent-ink: #9ad9f5; --accent-soft: rgba(3,154,214,0.16); --rise: #8dc53e; --fall: #f28584; }
  * { box-sizing: border-box; }
  html { scroll-padding-top: 16px; }
  body { margin: 0; background: var(--page); color: var(--ink); font-family: var(--font-body); font-size: 15px; line-height: 1.55; padding: 0 20px 48px; }
  a { color: var(--accent); }
  .masthead { max-width: 900px; margin: 0 auto; padding: 28px 0 8px; }
  .wordmark { font-family: var(--font-display); font-weight: 800; font-size: 20px; display: flex; align-items: baseline; gap: 8px; }
  .wordmark .sub { font-family: var(--font-body); font-weight: 500; font-size: 12px; color: var(--ink-2); letter-spacing: 0.08em; text-transform: uppercase; }
  .wordmark .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--brand); display: inline-block; transform: translateY(-1px); }
  .kicker { color: var(--ink-3); font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; margin: 14px 0 6px; }
  h1 { font-family: var(--font-display); font-weight: 700; font-size: 26px; line-height: 1.25; margin: 0; text-wrap: balance; max-width: 60ch; }
  .glance { max-width: 900px; margin: 22px auto 6px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
  .tile { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 12px 14px; }
  .tile .label { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-2); }
  .tile .num { font-family: var(--font-display); font-weight: 700; font-size: 26px; line-height: 1.1; margin-top: 4px; }
  .tile .hint { font-size: 12px; color: var(--ink-2); margin-top: 2px; }
  .toc { max-width: 900px; margin: 14px auto 0; display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 13px; padding: 10px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .toc a { text-decoration: none; color: var(--ink-2); } .toc a:hover { color: var(--accent); } .toc a b { color: var(--accent); font-family: var(--font-mono); font-weight: 500; }
  .sec { max-width: 900px; margin: 0 auto; padding: 26px 0 6px; border-bottom: 1px solid var(--line); }
  .sec h2 { font-family: var(--font-display); font-weight: 700; font-size: 21px; line-height: 1.2; margin: 0 0 10px; text-wrap: balance; }
  .sec h2 .n { display: inline-block; min-width: 2.1em; color: var(--accent); font-family: var(--font-mono); font-weight: 500; font-size: 15px; }
  .sec h3 { font-family: var(--font-display); font-size: 16px; margin: 18px 0 6px; }
  .sec p { max-width: 72ch; margin: 0 0 12px; }
  .pts, .steps { max-width: 72ch; padding-left: 22px; margin: 0 0 12px; } .pts li, .steps li { margin: 6px 0; }
  .steps li::marker { color: var(--accent); font-family: var(--font-mono); font-weight: 500; }
  .twrap { overflow-x: auto; margin: 6px 0 16px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
  table { border-collapse: collapse; width: 100%; font-size: 13.5px; font-variant-numeric: tabular-nums; }
  th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: top; }
  th { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-2); font-weight: 600; white-space: nowrap; background: var(--raised); position: sticky; top: 0; }
  td.num { text-align: right; white-space: nowrap; font-family: var(--font-mono); font-size: 13px; } td.first { font-weight: 500; }
  tr:last-child td { border-bottom: 0; }
  .up { color: var(--rise); font-weight: 600; } .down { color: var(--fall); font-weight: 600; } .arr { color: var(--ink-3); padding: 0 2px; }
  .foot { max-width: 900px; margin: 26px auto 0; color: var(--ink-3); font-size: 12.5px; }
  @media (max-width: 600px) { body { padding: 0 12px 32px; } h1 { font-size: 22px; } .sec h2 { font-size: 19px; } }
CSS
my $head = '<title>AMVGG Morning Report</title>' . "\n" . '<meta name="viewport" content="width=device-width, initial-scale=1">' . "\n" . '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">' . "\n<style>\n" . $css . "</style>\n";
my $html = $bare ? $head . $body . "\n" : "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n" . $head . "</head>\n<body>\n" . $body . "\n</body>\n</html>\n";
open(my $o, '>:utf8', $out) or die "write $out: $!"; print $o $html; close $o;
printf "wrote %s (%d bytes, %d sections)\n", $out, length($html), scalar(@secs);
