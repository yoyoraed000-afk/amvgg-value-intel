#!/usr/bin/env bash
# Incremental collector for scheduled runs (GitHub Actions, cron, Task Scheduler).
# Operated by the owner of amvgg.com. Running this against amvgg.com without the owner's written permission violates the site's Terms of Service.
# Fetches only what is newer than the rolling store in ./state (see build_state.pl), politely (~1 API call / 2.5 s), and bounds its own retries
# so a blocked or dead site cannot eat the whole job. Writes $RAW/run.json describing coverage for build_state.pl.
#   FULL=1              deeper pass (more update/listing pages, more profiles) – once a day
#   PROFILES_PER_RUN    trader profiles to refresh per run (default 120; FULL: 800)
#   MAX_TRADE_PAGES     listing pages per run (50 listings each; default 400 ≈ 3-4 hours of listings, early-stopped at the boundary)
#   LISTING_MINUTES     wall-clock budget for the listings phase (default 25)
#   RETRY_BUDGET_S      total seconds the run may spend sleeping on failed requests before it stops retrying (default 300)
set -u
BASE="https://amvgg.com"
UA="AMVGG-ValueIntel/1.0 (site owner tooling; +https://github.com/yoyoraed000-afk/amvgg-value-intel)"
DIR="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(cd "$DIR/.." && pwd)"
RAW="${RAW_DIR:-$DIR/raw}"; STATE="${STATE_DIR:-$ROOT/state}"
rm -rf "$RAW"; mkdir -p "$RAW/vu" "$RAW/trades" "$RAW/values" "$RAW/profiles" "$STATE"
LOG="$RAW/collect.log"; : > "$LOG"
FULL="${FULL:-0}"
MAX_TRADE_PAGES="${MAX_TRADE_PAGES:-400}"; MAX_UPDATE_PAGES="${MAX_UPDATE_PAGES:-30}"; LISTING_MINUTES="${LISTING_MINUTES:-25}"
PROFILES_PER_RUN="${PROFILES_PER_RUN:-120}"; PROFILE_MAX_AGE_H="${PROFILE_MAX_AGE_H:-24}"
API_SLEEP="${API_SLEEP:-2.5}"; HTML_SLEEP="${HTML_SLEEP:-0.7}"; RETRY_BUDGET_S="${RETRY_BUDGET_S:-300}"
if [ "$FULL" = "1" ]; then MAX_TRADE_PAGES="${MAX_TRADE_PAGES_FULL:-500}"; MAX_UPDATE_PAGES=200; PROFILES_PER_RUN="${PROFILES_PER_RUN_FULL:-800}"; PROFILE_MAX_AGE_H=12; LISTING_MINUTES="${LISTING_MINUTES_FULL:-30}"; fi
FAILED=0; RETRY_SPENT=0; DEGRADED=0
log() { echo "$(date -u +%T) $*" >> "$LOG"; }
valid() { # file kind -> 0 if the body is a complete page of the expected kind
  local f="$1" kind="$2"
  [ -s "$f" ] || return 1
  grep -q '"error":"Rate limit' "$f" 2>/dev/null && return 1
  case "$kind" in
    json) perl -MJSON::PP -e '$/=undef; my $j=eval{decode_json(<STDIN>)}; exit($j ? 0 : 1)' < "$f" ;;
    html) [ "$(wc -c < "$f")" -gt 30000 ] && grep -q 'self.__next_f' "$f" ;;
  esac
}
get() { # url out sleep kind -> 0 on a complete, valid body. Retries are bounded by a per-run budget; 429 waits longer than hard errors.
  local url="$1" out="$2" pause="$3" kind="${4:-json}" code rc try wait
  for try in 1 2 3; do
    code=$(curl -s -m 40 -A "$UA" -L -o "$out" -w "%{http_code}" "$url"); rc=$?
    if [ $rc -eq 0 ] && [ "$code" = "200" ] && valid "$out" "$kind"; then log "200 $url"; sleep "$pause"; return 0; fi
    log "$code rc=$rc (try $try) $url"; rm -f "$out"
    case "$code" in 429) wait=$((try * 45));; 403|404|410) wait=15;; *) wait=$((try * 20));; esac
    if [ "$RETRY_SPENT" -ge "$RETRY_BUDGET_S" ]; then log "retry budget exhausted; giving up on $url"; DEGRADED=1; break; fi
    RETRY_SPENT=$((RETRY_SPENT + wait)); sleep "$wait"
  done
  FAILED=$((FAILED + 1)); return 1
}
jq_() { perl -MJSON::PP -e '$/=undef; my $j=eval{decode_json(<STDIN>)}; exit 1 unless $j; my $c=$ARGV[0]; eval $c; die $@ if $@;' "$1" < "$2"; }
finish() { # write run.json and exit with the given status
  perl -e 'printf "{\"listingBoundaryReached\":%s,\"oldestListingFetched\":%s,\"newestListingFetched\":%s,\"failed\":%d,\"degraded\":%s,\"retrySeconds\":%d,\"finishedAt\":\"%s\"}\n", $ARGV[0]?"true":"false", ($ARGV[1] ne ""?"\"$ARGV[1]\"":"null"), ($ARGV[2] ne ""?"\"$ARGV[2]\"":"null"), $ARGV[3], $ARGV[4]?"true":"false", $ARGV[5], $ARGV[6]' "$REACHED" "$OLDEST" "$NEWEST" "$FAILED" "$DEGRADED" "$RETRY_SPENT" "$(date -u +%FT%TZ)" > "$RAW/run.json"
  echo "DONE $(date -u +%FT%TZ) updates_pages=$UPAGES listing_pages=$LPAGES profiles=$PROFILES_DONE failed=$FAILED degraded=$DEGRADED boundary_reached=$REACHED" | tee -a "$LOG"
  exit "$1"
}
REACHED=1; OLDEST=""; NEWEST=""; UPAGES=0; LPAGES=0; PROFILES_DONE=0
newest_update=$(perl -MJSON::PP -e '$/=undef; my $j=eval{decode_json(<STDIN>)}; print $j->{newestUpdateAt}//""' < "$STATE/meta.json" 2>/dev/null || true)
newest_listing=$(perl -MJSON::PP -e '$/=undef; my $j=eval{decode_json(<STDIN>)}; print $j->{newestListingAt}//""' < "$STATE/meta.json" 2>/dev/null || true)
log "=== run start FULL=$FULL newestUpdate=${newest_update:-none} newestListing=${newest_listing:-none} maxTradePages=$MAX_TRADE_PAGES listingMinutes=$LISTING_MINUTES"

echo "[1/4] value lists"
vfail=0
for cat in pets eggs petwear toys food vehicles gifts stickers houses strollers; do
  get "$BASE/values/$cat" "$RAW/values/$cat.html" "$HTML_SLEEP" html || { echo "FAILED values/$cat" | tee -a "$LOG"; vfail=$((vfail+1)); }
done

echo "[2/4] value updates (newer than ${newest_update:-the beginning})"
off=0
while [ "$UPAGES" -lt "$MAX_UPDATE_PAGES" ]; do
  f="$RAW/vu/$(printf '%06d' "$off").json"
  get "$BASE/api/value-updates?limit=100&offset=$off" "$f" "$API_SLEEP" json || { echo "FAILED vu offset $off" | tee -a "$LOG"; break; }
  read -r n oldest < <(jq_ 'my $d=$j->{data}||[]; print scalar(@$d)." ".(@$d ? $d->[-1]{updatedAt} : "")."\n"' "$f")
  [ -z "${n:-}" ] && { echo "unparsable vu page offset $off" | tee -a "$LOG"; rm -f "$f"; break; }
  UPAGES=$((UPAGES+1)); off=$((off+100))
  [ "$n" -lt 100 ] && break
  if [ -n "$newest_update" ] && [ -n "$oldest" ] && [[ "$oldest" < "$newest_update" ]]; then break; fi
done

echo "[3/4] listings (back to ${newest_listing:-the beginning}; max $MAX_TRADE_PAGES pages / $LISTING_MINUTES min)"
cursor=""; deadline=$(( $(date +%s) + LISTING_MINUTES * 60 )); [ -n "$newest_listing" ] && REACHED=0
while [ "$LPAGES" -lt "$MAX_TRADE_PAGES" ]; do
  if [ "$(date +%s)" -ge "$deadline" ]; then echo "listing time budget reached after $LPAGES pages" | tee -a "$LOG"; break; fi
  f="$RAW/trades/$(printf '%04d' "$LPAGES").json"
  if [ -z "$cursor" ]; then url="$BASE/api/trades?"; else url="$BASE/api/trades?cursor=$cursor"; fi
  get "$url" "$f" "$API_SLEEP" json || { echo "FAILED trades page $LPAGES" | tee -a "$LOG"; break; }
  read -r more cursor oldest newest < <(jq_ 'my $p=$j->{pagination}||{}; my $d=$j->{trades}||[]; print(($p->{hasMore}?1:0)." ".($p->{nextCursor}//"-")." ".(@$d ? $d->[-1]{publishedAt} : "-")." ".(@$d ? $d->[0]{publishedAt} : "-")."\n")' "$f")
  [ -z "${more:-}" ] && { echo "unparsable trades page $LPAGES" | tee -a "$LOG"; rm -f "$f"; break; }
  LPAGES=$((LPAGES+1)); [ "$oldest" != "-" ] && OLDEST="$oldest"; [ -z "$NEWEST" ] && [ "$newest" != "-" ] && NEWEST="$newest"
  if [ -n "$newest_listing" ] && [ "$oldest" != "-" ] && [[ "$oldest" < "$newest_listing" ]]; then REACHED=1; break; fi
  [ "$more" = "1" ] && [ "$cursor" != "-" ] || { REACHED=1; break; }
done
[ "$LPAGES" -eq 0 ] && REACHED=0

echo "[4/4] trader profiles (up to $PROFILES_PER_RUN not refreshed in ${PROFILE_MAX_AGE_H}h)"
perl -MJSON::PP -e '
  my ($state, $max_age_h, $raw) = @ARGV; my %c; my %fresh;
  if (open my $s, "<", "$state/profiles.json") { local $/; my $p = eval { decode_json(<$s>) } || {}; my $cut = time - $max_age_h * 3600;
    for my $uid (keys %$p) { $fresh{$uid} = 1 if ($p->{$uid}{fetchedAt} // 0) >= $cut && defined $p->{$uid}{accepted} } }
  for my $f (glob("$raw/trades/*.json")) { open my $h, "<", $f or next; local $/; my $j = eval { decode_json(<$h>) } or next;
    for my $t (@{$j->{trades}||[]}) { $c{$t->{authorRobloxId}}++ if $t->{authorRobloxId} && !$fresh{$t->{authorRobloxId}} } }
  print "$_\n" for sort { $c{$b} <=> $c{$a} || $a <=> $b } keys %c;' "$STATE" "$PROFILE_MAX_AGE_H" "$RAW" > "$RAW/authors.txt"
while read -r uid; do
  [ -z "$uid" ] && continue
  [ "$PROFILES_DONE" -ge "$PROFILES_PER_RUN" ] && break
  [ "$DEGRADED" = "1" ] && [ "$FAILED" -ge 5 ] && { echo "skipping remaining profiles (degraded run)" | tee -a "$LOG"; break; }
  get "$BASE/profile/$uid" "$RAW/profiles/$uid.html" "$HTML_SLEEP" html && PROFILES_DONE=$((PROFILES_DONE+1)) || echo "FAILED profile $uid" | tee -a "$LOG"
done < "$RAW/authors.txt"

# exit 2 only when nothing usable came back at all (the workflow then keeps the previous site); partial runs exit 0 with run.json describing the damage
if [ "$vfail" -ge 10 ] && [ "$UPAGES" -eq 0 ] && [ "$LPAGES" -eq 0 ]; then finish 2; fi
finish 0
