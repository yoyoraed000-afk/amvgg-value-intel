#!/usr/bin/env bash
# Collects public data from amvgg.com into ./raw. Gentle: ~1 API call / 2.5 s, backs off on 429, resumable.
set -u
BASE="https://amvgg.com"
UA="AMVGG-ValueIntel/1.0 (site owner tooling)"
DIR="$(cd "$(dirname "$0")" && pwd)"
RAW="$DIR/raw"; mkdir -p "$RAW/vu" "$RAW/trades" "$RAW/values" "$RAW/profiles"
LOG="$RAW/collect.log"
MAX_TRADE_PAGES="${MAX_TRADE_PAGES:-160}"
MAX_PROFILES="${MAX_PROFILES:-700}"
API_SLEEP="${API_SLEEP:-2.5}"; HTML_SLEEP="${HTML_SLEEP:-0.7}"
log() { echo "$(date +%T) $*" >> "$LOG"; }
get() { # url out sleep  -> 0 on HTTP 200 with non-rate-limit body
  local url="$1" out="$2" pause="$3" code try
  for try in 1 2 3 4 5 6; do
    code=$(curl -s -m 40 -A "$UA" -L -o "$out" -w "%{http_code}" "$url")
    if [ "$code" = "200" ] && ! grep -q '"error":"Rate limit' "$out" 2>/dev/null; then log "200 $url"; sleep "$pause"; return 0; fi
    log "$code (try $try) $url"; rm -f "$out"; sleep $((try * 40))
  done
  return 1
}
json_count() { perl -MJSON::PP -e '$/=undef; my $j=eval{decode_json(<STDIN>)}; my $k=$ARGV[0]; print $j ? scalar(@{$j->{$k}||[]}) : -1' "$1" < "$2"; }

log "=== run start ==="
echo "[1/4] value lists" | tee -a "$LOG"
for cat in pets eggs petwear toys food vehicles gifts stickers houses strollers; do
  f="$RAW/values/$cat.html"; [ -s "$f" ] && [ "$(wc -c < "$f")" -gt 50000 ] && continue
  get "$BASE/values/$cat" "$f" "$HTML_SLEEP" || echo "FAILED values/$cat" | tee -a "$LOG"
done

echo "[2/4] value updates" | tee -a "$LOG"
off=0
while [ "$off" -lt 20000 ]; do
  f="$RAW/vu/$(printf '%06d' "$off").json"
  if [ -s "$f" ] && [ "$(json_count data "$f")" -eq 100 ]; then off=$((off+100)); continue; fi
  get "$BASE/api/value-updates?limit=100&offset=$off" "$f" "$API_SLEEP" || { echo "FAILED vu offset $off" | tee -a "$LOG"; break; }
  n=$(json_count data "$f"); [ "$n" -lt 100 ] && break
  off=$((off+100))
done

echo "[3/4] active trade listings" | tee -a "$LOG"
cursor=""; page=0
# resume: continue from the last valid page's nextCursor
for f in $(ls "$RAW"/trades/*.json 2>/dev/null | sort); do
  read -r more nc < <(perl -MJSON::PP -e '$/=undef; my $j=eval{decode_json(<STDIN>)}; my $p=$j?$j->{pagination}:undef; if($p){print(($p->{hasMore}?1:0)." ".($p->{nextCursor}//"")."\n")}else{print "x \n"}' < "$f")
  if [ "$more" = "x" ]; then rm -f "$f"; break; fi
  page=$((page+1)); cursor="$nc"; [ "$more" = "1" ] || page=$MAX_TRADE_PAGES
done
while [ "$page" -lt "$MAX_TRADE_PAGES" ]; do
  f="$RAW/trades/$(printf '%04d' "$page").json"
  if [ -z "$cursor" ]; then url="$BASE/api/trades?"; else url="$BASE/api/trades?cursor=$cursor"; fi
  get "$url" "$f" "$API_SLEEP" || { echo "FAILED trades page $page" | tee -a "$LOG"; break; }
  read -r more cursor < <(perl -MJSON::PP -e '$/=undef; my $j=eval{decode_json(<STDIN>)}; my $p=$j?$j->{pagination}:{}; print(($p->{hasMore}?1:0)." ".($p->{nextCursor}//"")."\n")' < "$f")
  page=$((page+1))
  [ "$more" = "1" ] && [ -n "$cursor" ] || break
done

echo "[4/4] trader profiles (completed trades)" | tee -a "$LOG"
perl -MJSON::PP -e '
  my %c; for my $f (@ARGV) { open my $h, "<", $f or next; local $/; my $j = eval { decode_json(<$h>) } or next;
    for my $t (@{$j->{trades}||[]}) { $c{$t->{authorRobloxId}}++ if $t->{authorRobloxId} } }
  print "$_\n" for sort { $c{$b} <=> $c{$a} || $a <=> $b } keys %c;' "$RAW"/trades/*.json > "$RAW/authors.txt"
echo "unique authors: $(wc -l < "$RAW/authors.txt")" | tee -a "$LOG"
i=0
while read -r uid; do
  [ -z "$uid" ] && continue
  i=$((i+1)); [ "$i" -gt "$MAX_PROFILES" ] && break
  f="$RAW/profiles/$uid.html"; [ -s "$f" ] && [ "$(wc -c < "$f")" -gt 20000 ] && continue
  get "$BASE/profile/$uid" "$f" "$HTML_SLEEP" || echo "FAILED profile $uid" | tee -a "$LOG"
done < "$RAW/authors.txt"
echo "DONE $(date -u +%FT%TZ)" | tee -a "$LOG"
