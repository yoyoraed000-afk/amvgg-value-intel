#!/usr/bin/env bash
# Incremental collector for scheduled runs (GitHub Actions, cron, Task Scheduler).
# Fetches only what is newer than the rolling store in ./state (see build_state.pl), politely (~1 API call / 2.5 s, backs off on 429).
#   FULL=1              deeper pass (more update/listing pages, more profiles) – run once a day
#   PROFILES_PER_RUN    trader profiles to refresh per run (default 120; FULL: 800)
#   MAX_TRADE_PAGES     listing pages per run (50 listings each; default 140 ≈ 1 hour of listings)
set -u
BASE="https://amvgg.com"
UA="AMVGG-ValueIntel/1.0 (site owner tooling)"
DIR="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(cd "$DIR/.." && pwd)"
RAW="${RAW_DIR:-$DIR/raw}"; STATE="${STATE_DIR:-$ROOT/state}"
rm -rf "$RAW"; mkdir -p "$RAW/vu" "$RAW/trades" "$RAW/values" "$RAW/profiles" "$STATE"
LOG="$RAW/collect.log"; : > "$LOG"
FULL="${FULL:-0}"
MAX_TRADE_PAGES="${MAX_TRADE_PAGES:-140}"; MAX_UPDATE_PAGES="${MAX_UPDATE_PAGES:-30}"
PROFILES_PER_RUN="${PROFILES_PER_RUN:-120}"; PROFILE_MAX_AGE_H="${PROFILE_MAX_AGE_H:-24}"
API_SLEEP="${API_SLEEP:-2.5}"; HTML_SLEEP="${HTML_SLEEP:-0.7}"
if [ "$FULL" = "1" ]; then MAX_TRADE_PAGES="${MAX_TRADE_PAGES_FULL:-200}"; MAX_UPDATE_PAGES=200; PROFILES_PER_RUN="${PROFILES_PER_RUN_FULL:-800}"; PROFILE_MAX_AGE_H=12; fi
log() { echo "$(date -u +%T) $*" >> "$LOG"; }
get() { # url out sleep
  local url="$1" out="$2" pause="$3" code try
  for try in 1 2 3 4 5; do
    code=$(curl -s -m 40 -A "$UA" -L -o "$out" -w "%{http_code}" "$url")
    if [ "$code" = "200" ] && ! grep -q '"error":"Rate limit' "$out" 2>/dev/null; then log "200 $url"; sleep "$pause"; return 0; fi
    log "$code (try $try) $url"; rm -f "$out"; sleep $((try * 40))
  done
  return 1
}
jq_() { perl -MJSON::PP -e '$/=undef; my $j=eval{decode_json(<STDIN>)}; exit 1 unless $j; my $c=$ARGV[0]; eval $c; die $@ if $@;' "$1" < "$2"; }

newest_update=$(perl -MJSON::PP -e '$/=undef; my $j=eval{decode_json(<STDIN>)}; print $j->{newestUpdateAt}//""' < "$STATE/meta.json" 2>/dev/null || true)
newest_listing=$(perl -MJSON::PP -e '$/=undef; my $j=eval{decode_json(<STDIN>)}; print $j->{newestListingAt}//""' < "$STATE/meta.json" 2>/dev/null || true)
log "=== run start FULL=$FULL newestUpdate=${newest_update:-none} newestListing=${newest_listing:-none}"

echo "[1/4] value lists"
for cat in pets eggs petwear toys food vehicles gifts stickers houses strollers; do
  get "$BASE/values/$cat" "$RAW/values/$cat.html" "$HTML_SLEEP" || echo "FAILED values/$cat" | tee -a "$LOG"
done

echo "[2/4] value updates (newer than ${newest_update:-the beginning})"
off=0; pages=0
while [ "$pages" -lt "$MAX_UPDATE_PAGES" ]; do
  f="$RAW/vu/$(printf '%06d' "$off").json"
  get "$BASE/api/value-updates?limit=100&offset=$off" "$f" "$API_SLEEP" || { echo "FAILED vu offset $off" | tee -a "$LOG"; break; }
  read -r n oldest < <(jq_ 'my $d=$j->{data}||[]; print scalar(@$d)." ".(@$d ? $d->[-1]{updatedAt} : "")."\n"' "$f")
  pages=$((pages+1)); off=$((off+100))
  [ "$n" -lt 100 ] && break
  if [ -n "$newest_update" ] && [ -n "$oldest" ] && [[ "$oldest" < "$newest_update" ]]; then break; fi
done

echo "[3/4] listings (newer than ${newest_listing:-the beginning}, max $MAX_TRADE_PAGES pages)"
cursor=""; page=0
while [ "$page" -lt "$MAX_TRADE_PAGES" ]; do
  f="$RAW/trades/$(printf '%04d' "$page").json"
  if [ -z "$cursor" ]; then url="$BASE/api/trades?"; else url="$BASE/api/trades?cursor=$cursor"; fi
  get "$url" "$f" "$API_SLEEP" || { echo "FAILED trades page $page" | tee -a "$LOG"; break; }
  read -r more cursor oldest < <(jq_ 'my $p=$j->{pagination}||{}; my $d=$j->{trades}||[]; print(($p->{hasMore}?1:0)." ".($p->{nextCursor}//"-")." ".(@$d ? $d->[-1]{publishedAt} : "")."\n")' "$f")
  page=$((page+1))
  [ "$more" = "1" ] && [ "$cursor" != "-" ] || break
  if [ -n "$newest_listing" ] && [ -n "$oldest" ] && [[ "$oldest" < "$newest_listing" ]]; then break; fi
done

echo "[4/4] trader profiles (up to $PROFILES_PER_RUN not refreshed in ${PROFILE_MAX_AGE_H}h)"
perl -MJSON::PP -e '
  my ($state, $max_age_h, $raw) = @ARGV; my %c; my %fresh;
  if (open my $s, "<", "$state/profiles.json") { local $/; my $p = eval { decode_json(<$s>) } || {}; my $cut = time - $max_age_h * 3600;
    for my $uid (keys %$p) { $fresh{$uid} = 1 if ($p->{$uid}{fetchedAt} // 0) >= $cut } }
  for my $f (glob("$raw/trades/*.json")) { open my $h, "<", $f or next; local $/; my $j = eval { decode_json(<$h>) } or next;
    for my $t (@{$j->{trades}||[]}) { $c{$t->{authorRobloxId}}++ if $t->{authorRobloxId} && !$fresh{$t->{authorRobloxId}} } }
  print "$_\n" for sort { $c{$b} <=> $c{$a} || $a <=> $b } keys %c;' "$STATE" "$PROFILE_MAX_AGE_H" "$RAW" > "$RAW/authors.txt"
i=0
while read -r uid; do
  [ -z "$uid" ] && continue
  i=$((i+1)); [ "$i" -gt "$PROFILES_PER_RUN" ] && break
  get "$BASE/profile/$uid" "$RAW/profiles/$uid.html" "$HTML_SLEEP" || echo "FAILED profile $uid" | tee -a "$LOG"
done < "$RAW/authors.txt"
echo "DONE $(date -u +%FT%TZ) updates_pages=$pages listing_pages=$page profiles=$((i>PROFILES_PER_RUN?PROFILES_PER_RUN:i))" | tee -a "$LOG"
