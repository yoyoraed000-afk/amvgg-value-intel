# AMVGG Value Intelligence

Predicts 30-day value moves for every pet and item on amvgg.com, from three evidence layers:

1. **History layer** – the site's own value-update log, replayed into daily values, turned into weekly features per item and fitted with a three-class softmax model (raise / lower / hold in the next 30 days). Backtested on held-out weeks.
2. **Market layer** – live listings and completed trades, priced variant-by-variant with today's values. Overpay premiums, want-to-offer ratios and asking premiums become a pressure score with a confidence level. Reputation-weighted, age-decayed, capped per trader.
3. **Implied values** – completed trades solved jointly (Huber loss, ridge-anchored to the listed values) to get the value each item would need for its trades to balance.

The dashboard (`site/index.html`) blends the layers into a call per item, ranks alerts, explains each call, and shows the backtest.

Pets get three predictions each, Regular (FR), Neon (NFR) and Mega (MFR), from their own update series and trade evidence. Every potion state inside a tier (no potion, F, R, FR and the N/M equivalents) is priced from today's value and moves with its tier. Items get one.

## Layout

```
site/        index.html  – dashboard (no build step, no framework)
             engine.js   – the whole model; AMVGGEngine.build(data) in browser or Node
             data.json   – snapshot the dashboard runs on
build/       collect.sh      – pulls values, the full update log, active listings and trader profiles (rate-limited, resumable)
             rsc_extract.pl  – decodes the Next.js RSC payload embedded in the site's pages
             build_data.pl   – merges raw pages into data.json
serve.ps1    tiny static server for local viewing (PowerShell, no dependencies)
```

## Refresh the snapshot

Requires Git Bash (curl + perl, both ship with Git for Windows).

```bash
cd build
bash collect.sh                  # ~20 min; one API call per 2.5 s, backs off on 429, resumable
perl build_data.pl ../site/data.json
```

Then view locally:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
# open http://localhost:8765/
```

## Run it inside the Next.js app instead

`engine.js` has no dependencies and exports `build(data)`. Feed it straight from the database in a cron route (see the **Integrate** tab of the dashboard for the exact shapes) and store `model.predictions` for the Value Board dashboard or a public "trend" badge on pet pages.

## Honest limits

- Only the history layer is backtested; the market layer needs daily snapshots before it can be.
- Demand is today's demand, not historical.
- The public update log only reaches back to 2 June 2026 (about 16 weeks), so the backtest holds out just the last few weeks.
- Completed trades come from the profiles of recent posters, which favours active traders.
