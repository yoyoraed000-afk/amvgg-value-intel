# AMVGG Value Intelligence â morning report, Friday 25 September 2026

> AMVGG Value Intelligence, morning report for Fri 25 Sep 2026: dashboard live and every run green; on the 11:04 UTC snapshot the model makes 414 raise and 7 lower calls with calibrated odds capped at 74%; overnight review fixes are on GitHub, round 2 goes public on the next run

## 1. What is live now

Dashboard: https://yoyoraed000-afk.github.io/amvgg-value-intel/ (responded 200 OK at check time, last modified 11:06:24 UTC today). Repo: https://github.com/yoyoraed000-afk/amvgg-value-intel (main = 0d0bf63). The page builds the model in your browser from data.json in 3-5 seconds; Explorer deep links (#explorer/Name/tier) work.

Which code the public page is running: the run that built it (36125578051, manual deep pass 10:44-11:06 UTC) checked out commit a0f703d. That includes the overnight round-1 fixes (ed3e89c) but not this morning's round-2 fixes (0d0bf63, pushed to main at 11:34 UTC). The workflow triggers only on the hourly cron (minute 7) and on manual dispatch, never on push, so round 2 goes live on the next run GitHub actually starts, or as soon as you dispatch one. All numbers in sections 4-6 come from the round-2 engine on the same 11:04 UTC snapshot (run locally); until that run happens the public page still shows the round-1 numbers (454 raise / 24 lower).

Data behind the page (snapshot collected 11:04:50 UTC): 1,572 items; 10,893 Value Board update rows (2 Jun - 24 Sep, 115 days, 86 synthetic closing rows, 0 log gaps); 15,598 listings in the 6-hour page window (store keeps 12 h; 0 listing gaps; boundary reached); 18,092 completed trades in the 30-day page window (store keeps 60 d); 2,309 trader profiles, 1,583 of them with stats (69%); not degraded; 0 failed fetches. This run added 1,716 listings, 5,668 completed trades and 593 profiles; 0 new board updates (the board had not posted yet).

- Workflow runs since yesterday evening, all green: 19:58 UTC manual deep pass (33 min); scheduled 23:10 (14 min), 04:48 (12 min), 08:55 deep (30 min), 10:08 (10 min); 10:44 manual deep (22 min).
- GitHub started only 4 of the 16 hourly slots between 20:07 UTC yesterday and 11:07 today. This is the known limitation of free scheduled workflows; the job's own 'deep pass every ~20 h' logic is not affected by skipped slots.
- Two overnight runs hit the old 140-page listing cap; the cap is now 400 pages with a time budget, and any hole in listing coverage is recorded and shown as 'listing gaps' on the Overview (currently 0).

## 2. Market right now

Source: the market analyst's pass over the Sep 24 evening store (13,656 completed trades from 1,472 traders, 26 Jul - 24 Sep; 16,909 listings from 5,361 posters, but only 3.2 hours of them: Thu 24 Sep 16:29-19:41 UTC). Live engine numbers from the 11:04 UTC snapshot are added where they confirm the picture.

The market is priced in potions. Ride-A-Pet Potion appears in 27% of all completed trades (3,664 of 13,656) and 36% of trades contain some potion. The list says 0.006; when a Ride-A-Pet is alone on one side of a trade the other side is worth a median 0.009 (1.46x, 1,161 sides), and across 1,912 sides where it dominates it clears 1.23x list. Fly-A-Pet clears 1.05-1.11x; the live engine puts it at 0.014 vs 0.0125 listed (+13.6% on 1,638 trades from 1,079 traders, +12.3% counting only traders with a track record). Any 'overpaid' reading on a potion-paid trade is partly the potion's own premium.

List vs realised prices: for the pets the list actually prices, the list is a good predictor. Where a side is exactly one variant, the other side's value sits within 1% of list for the big legendaries (Frost Dragon FR 1.735 vs 1.725 on 206 sides, Owl 1.352 vs 1.340, Bat Dragon 5.141 vs 5.125, Shadow Dragon 3.735 vs 3.720, Giraffe 2.543 vs 2.550). Strictly priced trades: median ratio 1.000, 67% within +/-10%, 86% within +/-25%. Overpaying is a small-trade thing (bundles of 2-4+ small things for one target clear 3.6% over list; 1-for-1 at parity). Consistently above list: Cryptid FR 1.08x (n=187), Kangaroo 1.05x, Evil Unicorn 1.04x, Frostbite Bear MFR 1.07x. Below list: Chocolate Chip Bat Dragon FR 0.94x (n=73) and Fairy Bat Dragon FR 0.97x (n=90); the whole 2025-26 bat dragon family clears 0.94-0.98x across FR/NFR/MFR while being the most offered pets on the board.

Eggs and cheap consumables are where the list is wrong by an order of magnitude, and they are stacked up to the 18-slot cap (Crystal Egg: 2,279 mentions in 212 trades, 10.7 per trade; eggs are 12.4% of what completed trades ask for). Only 29 of 781 pets carry no-potion / fly / ride / neon / mega state values, so strict list pricing covers just 34% of completed trades; the fallback (tier value x median state ratio) covers 96%.

Timing: completed trades peak 16-18 UTC (the 17:00 hour alone is 7.2% of the day), trough at 03:00 (2.1%), a 3.5x day/night swing; 12-20 UTC carries 56% of trades. Listing rate ramps from ~3,900/h at 16:30 to ~9,700/h at 19:30 UTC (US after-school). Thursday is the busiest weekday (16.1%), Friday the quietest (9.8%). Board updates land 10:00-17:00 UTC, i.e. before the trading peak.

Poster concentration: broad, not a whale market. Top 1% of listing posters (54 accounts) post 8.7% of listings, top 10% post 34.6%; the single biggest poster had 127 listings in 3.2 h (0.8%); median 2 listings per poster; Gini 0.45. Exact reposts are 1.3% of listings. Completed trades look even flatter (top 1% = 1.6%) but that is an artefact: profile pages expose about the last 12 completed trades per trader. 44% of profiled traders joined in the last two months.

Signs: 32.6% of listings use one (Add 3,681, Upgrade 1,400, Exotics 608, Megas 580, SmallAdd 442, Downgrade 365), always on the wanted side; only 3.9% of completed trades contain a sign, so sign-based asks convert far less than concrete asks. Upgrade requests outnumber Downgrade 3.8 to 1.

Demand tags are visibly stale: Fairytale Egg is tagged Low with 2,126 completed mentions; Manta Ray (25 wanted / 1 offered), Rhino Beetle (40/2), Garden Egg (44/4), Otter, Rainbow Trout and Candy Cane Snail are all tagged Low with the strongest want/offer imbalances on the board; Golden Egg and Peahen are tagged Medium with zero wants. Overall only 107 of 568 items with 20+ listing mentions are net-wanted; the big names being dumped are Fairy Bat Dragon (1,359 offered vs 462 wanted), Cow (860/284), Owl (611/238), Turtle (605/268). Cryptid is the most wanted pet (want/offer 1.60). 55% of pets sit on one of ~15 placeholder FR/NFR/MFR triples with NFR/FR exactly 2.00.

| Item | List value | What it clears at | Ratio | Evidence |
|---|---|---|---|---|
| Ride-A-Pet Potion | 0.006 | 0.009 (alone on a side) | 1.46x | 1,161 single-potion sides; 1.23x across 1,912 sides |
| Fly-A-Pet Potion | 0.0125 | 0.014 | 1.11x (live +13.6%) | 505 sides; live: 1,638 trades from 1,079 traders |
| Retired Egg | 0.0002 | ~0.003 (alone on a side) | 15x | 100 sides |
| Paint Sealer | 0.001 | ~0.004 (alone) | 8x | 97 sides |
| Fairytale Egg | 0.0002 | 0.0004 | 2.2x | 158 sides |
| Crystal Egg | 0.0004 | 0.0006 | 1.4x | 180 sides |
| Pet Handler Pro Certificate | 0.012 | 0.013 (live implied 0.0149) | 1.08x (live +23%) | 178 sides; live: 466 trades, 242 traders with a track record |
| Frost Dragon FR | 1.725 | 1.735 | 1.01x | 206 sides |
| Cryptid FR | 0.865 | 0.937 | 1.08x | 187 sides |
| Silverback Gorilla FR | 0.075 | 0.128 | 1.71x | 22 sides (18 as the wanted item) |
| Diamond Unicorn MFR | 0.10 | 0.150 | 1.50x | 16 sides |
| Chocolate Chip Bat Dragon FR | 0.245 | 0.232 | 0.94x | 73 sides |
| Fairy Bat Dragon FR | 0.175 | 0.170 | 0.97x | 90 sides |
| Mochi Meow Mega | 0.025 | 0.013 | 0.50x | 17 sides |
| Cattuccino FR | 0.006 | 0.0039 (live) | 0.65x | live: 118 trades, 97 traders, 58 with a track record |

## 3. What the Value Board has been doing

The public update log holds 5,275 records = 10,827 tier value changes + 916 demand changes, on 815 items (325 pets, 490 non-pets), on 114 of 115 days since 2 Jun. It is a pet-centric momentum board: 74% of pet tier moves are raises in every tier; the next move on the same item and tier repeats the previous direction 93-94% of the time; a raise is followed by another raise within 30 days 95-96% of the time; 126 item-tier series ran 20+ consecutive raises; a Regular raise is undone within 30 days only 31% of the time (Mega 47%, the noisiest tier). Pet raises are small (median +3.2% Regular, +2.4% Neon, +2.2% Mega; 73-84% of raises are 5% or less), drops larger (median -5.0% / -4.3% / -3.7%). Non-pets are the opposite: 66% drops with a median size of -18.8%, mostly from one day.

Working rhythm: 96% of records land 10:00-17:59 UTC and the 13:00 hour alone carries 29.5%; entries are batched (89% of consecutive records less than 2 minutes apart). Each week has one dominant raise session, on Friday in 9 of 17 weeks, usually 11:00-12:00 UTC, carrying 17-49% of the week's raises (largest: Thu 13 Aug 338 raises, Fri 7 Aug 258, Fri 28 Aug 223, Fri 11 Sep 190). Today is Friday: the 11:04 snapshot predates this week's session. Neon and Mega move with Regular the same day 93% / 90% of the time, in the same direction 99% of the time, at near-identical percentage sizes; a Mega-only move is a weak lead.

Three regimes: June recalibration (53% drops; Sun 14 Jun 451 pet drops in two hours; Tue 16 Jun 372 non-pet drops at median -25% plus 121 demand downgrades). July-August expansion (18-21% drops, pace peaking at 134 value rows/day in mid-August, weekly bump sessions with zero drops). September cooling (25% drops, pace down 46% to 72 rows/day, Mega net points only +1.2 to +4.3 per week vs +8 to +14 in August), and in the last 7 days the summer leaders rolled over: Jekyll Hydra 0.565 -> 0.5 (-11.5%), Undead Jousting Horse 0.67 -> 0.595 (-11.2%), Jousting Horse -9.5%, Silverback Gorilla -9.1%, Cryptid 0.94 -> 0.865 (-8.0%), each after a 40-50-move raise streak. Seven-day gainers: Frost Unicorn +28.9%, Fairy Bat Dragon +20.7%, Royal Mistletroll +18.5%, Frostbite Bear +15.2%.

Coverage and staleness: 756 of 1,571 items (48%) never appear in the log, including 456 of 781 pets (58%), almost all with FR below 0.05; the 325 logged pets carry 94% of total FR value. Median time since last update is 50 days for the catalogue, 33 days for pets; Gifts and Stickers are dead (0% updated in 30 days). The hot list is worked daily: Cryptid on 91 of 114 days (0.56 -> 0.865), Jekyll Hydra 84 (0.20 -> 0.50), Werewolf 84, Giant Panda 81, Blazing Lion 77 (0.415 -> 1.10). Chocolate Chip and Strawberry Shortcake Bat Dragon have never been dropped in 118 moves each; Silverback Gorilla is the only top-25 pet with more drops than raises (94 vs 68). Demand labels separate outcomes (89% raises for High vs 3% for Low over 90 days) but demand changes coincide with value changes 96% of the time, so the tag is a concurrent indicator, not a leading one.

| Direction | Pet (FR) | 25 Aug -> 24 Sep | Change | Board updates in 30 d |
|---|---|---|---|---|
| Up | Fairy Bat Dragon | 0.0925 -> 0.175 | +89% | 25 |
| Up | Royal Mistletroll | 0.085 -> 0.16 | +88% | 18 |
| Up | Undead Jousting Horse | 0.35 -> 0.595 | +70% | 23 |
| Up | Werewolf | 0.13 -> 0.1975 | +52% | 21 |
| Up | Jekyll Hydra | 0.335 -> 0.5 | +49% | 22 |
| Up | Grim Dragon | 0.145 -> 0.21 | +45% | - |
| Up | Chocolate Chip Bat Dragon | 0.1775 -> 0.245 | +38% | - |
| Down | Silverback Gorilla | 0.16 -> 0.075 | -53% | 16 |
| Down | Tri-horned Treehopper | 0.095 -> 0.055 | -42% | - |
| Down | Strawberry Tortle | 0.2 -> 0.14 | -30% | - |
| Down | Emperor Gorilla | 0.1375 -> 0.0975 | -29% | 17 |
| Down | Moonbeam Peacock | 0.1 -> 0.075 | -25% | - |
| Down | Pirate Ghost Capuchin Monkey | 0.1225 -> 0.095 | -22% | - |

## 4. The model's calls for the next 30 days (live dashboard, round-2 engine, 11:04 UTC snapshot)

3,136 rows (781 pets x Regular/Neon/Mega + 793 items): 414 raise calls, 7 lower calls, 2,715 flat. Raise calls by tier: Regular 129, Neon 133, Mega 120, items 32; 382 are pets; 367 of the 414 rest on at least 4 distinct traders. Odds are now calibrated and capped at 74%, the observed hit rate of the most confident test rows: 76 raise calls sit at 74%, 144 at 70-74%, 95 at 60-70%, 48 at 50-60%, 51 below 50%. Every raise call in the top 15 by flip score is a High-demand pet where the board is on a raise streak and traders with a track record pay above list (Orchid Butterfly Neon is the exception: only 4 traders, market neutral).

Last night's snapshot (20:14 UTC Sep 24, before any fixes) showed 597 raise / 153 lower calls, with Phantom Dragon FR (P(up) 95.8%, implied +13.2% on 46 trades), Vampire Dragon FR (97.1%), Diamond Unicorn Mega (implied +36.2% on 25 trades) and Cryptid FR as the strongest raises, and a lower list of cheap cats and dogs trading 18-39% under list (Cattuccino -39% on 508 trades, Chihuahua, Kiwi Kiwi, Catte). The live calls now differ because (a) odds are calibrated (raw 94-99% shows as 74%), (b) potion states are priced per tier, (c) the implied gap a call may rest on counts only traders with a track record (3+ accepted trades, 14+ day account), needs at least 2 of them and must survive leaving any one out, and (d) a call on market evidence alone needs at least 12% history odds of a rise or 4% of a drop. So Vampire Dragon FR is now #1; Phantom Dragon FR is still 'up' (0.0625 -> 0.068, 74%) but its robust gap is only +1.0% on 24 known traders, so it fell out of the top 15; Diamond Unicorn Mega is still 'up' (0.1 -> 0.11, 69%; established traders pay +18.5% on 20 trades) but with 9 offered per 1 wanted and 6 consecutive board cuts. The cheap cats and dogs no longer get a lower call: Cattuccino still clears -33% on 58 known traders, Chihuahua -23%, Purrowl -23%, but the history layer gives them 1-2% odds of a drop, below the 4% floor, so they show in the Market and Opportunities tabs as implied gaps rather than as calls.

- Lower calls (all Regular tier, value >= 0.01): Tuxedo Cat 0.0105 -> 0.0098 (-7.0%; calibrated odds of drop 12%; 77 trades from 64 traders; robust gap -13.9%; 7 consecutive board cuts, -30% in 30 d). 2D Kitty 0.011 -> 0.0105 (-4.7%; 9.5%; 26/24; -14.4%; 4 consecutive cuts). Moose Calf 0.0215 -> 0.021 (-2.5%; 7%; 41/38; -8.9%; 22 offered vs 5 wanted). Hare 0.0215 -> 0.021 (-2.3%; 6%; 79/66; -6.4%).
- Lower calls below 0.01: Sushi Penguin 0.009 -> 0.0087, Cake Friend 0.008 -> 0.00775, Burger Bear 0.0075 -> 0.0073. That is the whole lower list (7 rows): the history model almost never learns 'down' (3.6% of training rows) and the new gate will not flip a pet on market evidence from unknown accounts.

| # | Pet (tier) | Now -> 30-day target | Expected move | Odds of rise (model -> calibrated) | Demand | Trades / traders (this tier, 30 d) | Market-implied gap (known traders, robust) |
|---|---|---|---|---|---|---|---|
| 1 | Vampire Dragon (Regular) | 0.08 -> 0.0915 | +13.2% | 95% -> 74% | High | 84 / 69 | +11.9% |
| 2 | Cryptid (Regular) | 0.865 -> 0.965 | +11.0% | 92% -> 74% | High | 459 / 337 | +9.5% |
| 3 | Zombie Buffalo (Regular) | 0.075 -> 0.0835 | +10.5% | 93% -> 74% | High | 61 / 54 | +6.2% |
| 4 | Jellyfish (Regular) | 0.065 -> 0.072 | +10.6% | 92% -> 74% | High | 40 / 36 | +6.5% |
| 5 | Cupid Dragon (Regular) | 0.0425 -> 0.047 | +9.9% | 83% -> 71% | High | 62 / 52 | +7.1% |
| 6 | Werewolf (Neon) | 0.57 -> 0.625 | +9.1% | 96% -> 74% | High | 52 / 45 | +4.4% |
| 7 | Arctic Reindeer (Neon) | 0.57 -> 0.6225 | +9.0% | 94% -> 74% | High | 67 / 55 | +4.6% |
| 8 | Orchid Butterfly (Neon) | 2.65 -> 2.93 | +10.0% | 96% -> 74% | High | 6 / 4 | -0.3% (thin market) |
| 9 | Alpaca (Neon) | 0.49 -> 0.535 | +8.9% | 95% -> 74% | High | 49 / 38 | +4.3% |
| 10 | Evil Unicorn (Regular) | 0.615 -> 0.67 | +8.5% | 98% -> 74% | High | 267 / 204 | +3.4% |
| 11 | Grim Dragon (Neon) | 0.66 -> 0.72 | +8.8% | 95% -> 74% | High | 41 / 34 | +3.4% |
| 12 | Pink Cat (Regular) | 0.0525 -> 0.0575 | +8.9% | 91% -> 74% | High | 33 / 29 | +2.6% |
| 13 | Kangaroo (Regular) | 0.115 -> 0.125 | +8.4% | 95% -> 74% | High | 475 / 355 | +5.9% |
| 14 | Goose (Neon) | 0.545 -> 0.5925 | +8.6% | 93% -> 74% | High | 61 / 47 | +3.7% |
| 15 | Balloon Unicorn (Neon) | 3.1 -> 3.365 | +8.3% | 95% -> 74% | High | 47 / 35 | +2.7% |

## 4b. What to do this week (8 actions)

Based on the live calls. The analyst's 10-point list from last night agrees on Vampire Dragon, Cryptid, Diamond Unicorn (dip only), the legacy high tiers (no edge at list), the cheap cats and dogs (nobody pays list) and pricing eggs/potions at market; it differs on Phantom Dragon / Frost Fury (still 'up', no longer top-ranked) and on Fairy Bat Dragon ('sell now' last night, a muted 'up' today). Its 'market ahead of the board' names (Lava Dragon, Jousting Horse, Nessie, Sheeeeep, Ballet Swan) were not re-checked under the new gate; treat them as a watch list only. Re-check the dashboard after the next run before acting on borderline calls: this week's Friday board session had not happened at 11:04 UTC.

- 1. Buy or hold Vampire Dragon FR at 0.08 (target 0.0915, odds 74%): #1 flip score; 14 straight board raises (+18.5% in 30 d, +78% in 90 d); 84 trades from 69 traders clear +4.5% over list; 46 wanted vs 31 offered in the last 6 h.
- 2. Buy Cryptid FR from sellers at or under 0.865, not from asks (target 0.965, odds 74%): the deepest book on the board (459 trades / 337 traders paying +6% over list; 243 wanted vs 151 offered), but the board trimmed it 8% last week after a 33-day daily-raise run, so it is a dip buy, not a chase.
- 3. Add Zombie Buffalo FR (0.075 -> 0.0835), Jellyfish FR (0.065 -> 0.072) and Cupid Dragon FR (0.0425 -> 0.047): High demand, 36-54 traders each paying +2.7-4.0% over list, odds 74% / 74% / 71%.
- 4. Hold the neon momentum group, Werewolf, Arctic Reindeer, Alpaca, Goose and Grim Dragon neons (0.49-0.66): 11-33 consecutive raises, 34-55 traders each paying +0.9-3.2% over list, all at the 74% ceiling with +8-9% targets. Exit on the first board cut: a broken streak is the strongest drop signal the model has.
- 5. Diamond Unicorn Mega only at or under 0.1 (target 0.11, odds 69%): established traders pay +18.5% (20 trades, 11 with a track record), but the board has cut it 6 times running and 9 are offered per 1 wanted. Same treatment for Silverback Gorilla Mega (1.08 -> 1.175, +10% overpay on 29 trades, 26 wanted vs 9 offered) after a -50% month.
- 6. Do not buy the legacy high tiers at list (Frost Dragon, Owl, Giraffe, Shadow Dragon, Parrot, Cow, Bat Dragon): their 'up' calls (+5-7%) rest on history alone; traders with a track record clear them at exactly list (robust gap 0.0% on 158 known Frost Dragon traders; 130-512 traders each). Hold what you own; there is no edge in buying at list.
- 7. Sell into strength or avoid: Tuxedo Cat and 2D Kitty (lower calls, -14% robust gaps, 7 and 4 straight cuts); the cheap cats and dogs traders discount 20-33% (Cattuccino, Chihuahua, Purrowl, Mochi Meow Mega, Little Lamb Mega); and trim Fairy Bat Dragon Neon/Mega: the model now reads them as muted 'up' (+4%), but 79 are offered vs 45 wanted (Neon) and 44 vs 17 (Mega) after +100-110% in 30 days, and established traders clear them 2-3% under list.
- 8. Price sweeteners at market, not list: Ride-A-Pet ~0.009 (list 0.006), Fly-A-Pet 0.014 (list 0.0125, +13.6% on 1,638 trades), Pet Handler Pro Certificate 0.0149 (list 0.012, +23% on 466 trades from 242 known traders), Gemstone Egg 0.0155 (list 0.013, +20%), Spring Bunny Feet 0.0136 (list 0.011), Retired / Fairytale / Throwback eggs 2-15x list. Asking for these at list gives away 13-100%; offering them at list overpays.

## 5. Where history and market disagree (live data)

The engine's own tally on the live snapshot: 70 rows where both layers point the same way, 41 where they conflict, 793 where only one layer has a signal. Under the round-2 rules the market layer is muted unless several traders with a track record agree, so on the big pets the history layer usually wins and the market only dampens the size of the call. Six examples below; two more worth knowing: Red Dutch Guinea Pig FR 0.05 (history +5.9% despite 11 straight cuts; 127 trades from 110 traders clear -6.5%, 71 offered vs 8 wanted; result: flat) and Cattuccino FR 0.006 (no history at all; -33% on 58 known traders; result: flat, shown only as an implied gap).

| Pet | Now -> call | History layer says | Market layer says | What decides it |
|---|---|---|---|---|
| Fairy Bat Dragon Mega | 2.0 -> 2.075 (up, +3.6%, odds 70%) | 42 straight raises, +110% in 30 d; raw odds 78% | 68 trades from 53 traders clear -4.4% (robust -3.2%); 44 offered vs 17 wanted | History wins, muted from +10.5%; last night's engine called this 'down' |
| Fairy Bat Dragon Neon | 0.51 -> 0.5325 (up, +4.5%, odds 72%) | 36 straight raises, +100% in 30 d; raw 84% | 105 trades from 91 traders clear -3.1% (robust -2.2%); 79 offered vs 45 wanted | Same: history wins, muted; supply glut is real |
| Frost Dragon Regular (Owl, Giraffe, Shadow Dragon, Parrot, Cow behave the same) | 1.725 -> 1.845 (up, +6.7%, odds 74%) | 13 straight raises; raw 98% | 412 trades from 301 traders at -0.3%; robust gap 0.0% on 158 known traders; 166 offered vs 140 wanted | History alone; market says 'fairly priced' |
| Silverback Gorilla Regular | 0.075 -> 0.0765 (flat) | 11 straight cuts, -53% in 30 d; raw P(up) 33%, calibrated P(down) 36% | 127 trades from 103 traders pay +3.5% over list (robust +4.8%); 44 offered vs 14 wanted | Stand-off, no call (the Mega tier is 'up' 1.08 -> 1.175 at 59%: +10.1% overpay, 26 wanted vs 9 offered) |
| Munchkin Cat Regular | 0.065 -> 0.0685 (up, +5.4%, odds 74%) | 15 straight raises, +62% in 90 d; raw 92% | 246 trades from 197 traders at -3.9% (robust -3.3%); 98 offered vs 74 wanted | History wins, muted from +15.6% |
| Pet Handler Pro Certificate | 0.012 -> 0.0135 (flat) | No change in 79 d, 2 cuts; raw P(up) 2% | 466 trades from 364 posters (242 with a track record) pay +23% (robust +23%) | No call: an up call on market evidence needs >= 12% history odds; visible in Market and Opportunities only |

## 6. How much to trust it

The backtest (live, embargoed): 25,088 rows, one per pet tier or item at each of 8 weekly as-of dates (2 Jul - 20 Aug); the label is whether the list value moved more than +/-2% in the following 30 days. Train on the first 3 dates (15,680 rows), test on the last 2 (6,272 rows), split at 13 Aug, with an embargo so no training outcome window reaches into the test period. Base rates: 84.0% flat, 12.4% up, 3.6% down.

Accuracy 89.7%, against 84.0% for 'always say flat' and 90.0% for 'repeat the board's last direction'. The model does not beat plain momentum on raw accuracy; its value is in ranking (which raise calls are best) and in the market blend. Of 778 real raises in the test it caught 497 (64%); of 224 real drops it caught 11 (5%) and labelled 71 of them as raises. Precision of a shortlist: the top 100 raise calls were right 73% of the time (top 50: 72%); the top 50 drop calls 36%, top 100 26%. F1 up 0.667, down 0.089.

Calibration is why the dashboard now shows lower odds than last night. In the test the model's most confident bin averaged 93% and came true 74% of the time; the dashboard maps raw odds to that observed rate (hover any odds cell for 'model X% -> calibrated Y%'): raw 95% shows as 74%, 80% -> 71%, 60% -> 59%. So '74%' means 'about three in four calls like this came true in August-September', never better. Down odds are calibrated too but rest on only 44 test rows above 20% (two pooled points): raw 99% shows as 36%.

- The test set is two weekly snapshots inside a bull run (raises were 74-82% of board changes July-September). September has cooled (25% drops, pace -46%) and the summer leaders reversed; the 'high value + High demand = up' pattern the model learned can break, and nothing in the test period tells you how it behaves then.
- It barely predicts drops (5% recall). Use it as a raise ranker; use the Market tab's implied gaps and the offer/want books for sell decisions.
- 456 of 781 pets (58%) have no board history at all (all below FR 0.05); for those only the market layer speaks, and a call needs >= 12% history odds, so most cheap pets will always read 'flat' even when the market is 20-30% away from list.
- Market evidence is a 6-hour listing snapshot plus profile-sampled completed trades (roughly the last 12 per trader, 30-day window): a sample, not a census. Potions and eggs are mispriced on the list, so 'overpaid' on a potion-paid trade is partly the potion's own premium.
- The implied-value solver prices 2,093 items from 12,043 trade equations (7,817 from traders with a track record); only 103 keys currently meet the strong-evidence bar (5+ trades, 4+ posters, 2+ known, reputation mass 1.2+, robust gap 5%+).
- Manipulation: single accounts and throwaway alts can no longer move a call (verified by replay); two or more established accounts working together still can (open item, section 7).

| Model said (P(up) bin) | Test rows | Model's average | Actually rose |
|---|---|---|---|
| 0-20% | 5,370 | 1.8% | 4.0% |
| 20-40% | 154 | 29% | 30% |
| 40-60% | 106 | 50% | 50% |
| 60-80% | 174 | 70% | 68% |
| 80-100% | 468 | 93% | 74% |

## 7. What was found and fixed overnight and this morning

Six reviewers filed 70 findings overnight (engine correctness 11, data quality 10, abuse/safety 11, dashboard UX 16, workflow YAML 11, collector robustness 11). The adversarial verification and fix stages hit the session limit. This morning commit ed3e89c (13:43 local) applied the confirmed fixes; five checkers then re-verified engine, pipeline, workflow, dashboard and manipulation resistance and listed 20 remaining items; commit 0d0bf63 (14:34 local, pushed to main) addressed 16 of them and documented the rest. ed3e89c is what the public page runs now; 0d0bf63 goes live on the next run.

- Model correctness, fixed: potion states priced per tier (Frost Dragon Mega no-potion 13.75, neon 3.45, regular 1.775; tier fallback for pets without state values); demand taken as of the prediction date instead of today's label; embargoed rolling backtest with calibrated odds on every row; per-trade and per-trader caps; distinct-poster counts; value floor in the implied solver; 86 synthetic closes so every history series ends on today's value (0 log gaps). Round 2: calibrator ends are flat (no more 98% displayed), sparse bins pooled so drop odds are calibrated too (0 rows left uncalibrated), days-since-update no longer skewed by non-value edits (0 '0 days' rows), boundary flag honours the store's 0/1. Verified: all 3,136 rows carry calibrated odds, probabilities sum to 1, no NaN or undefined anywhere, build 3.4-4.6 s.
- Manipulation resistance, fixed: history odds are untouched by any injected listing or trade (identical across 20 attack builds); a lone alt cannot flip an untraded pet; listing spam alone cannot flip a call. Round 2: the gap a call rests on counts only traders with 3+ accepted trades and a 14+ day account, needs 2+ of them, reputation mass 1.2+, and must survive leaving any single trader out; caps now keep each trader's newest trades; mirrored trade pairs and reposts count once (330 mirrored, 275 reposts in the snapshot); listing posters are distinct per tier. Replays: 4 alts on Diamond King Penguin -> flat (was up); 5 alts + 7 listings on Honey Badger -> flat both ways; one account listing under 4 potion states -> 1 poster (was 4). Effect on calls: 454 up / 24 down -> 414 / 7, 79 calls changed, 54 of the 63 lost calls due to the leave-one-out gate.
- Data pipeline, fixed: profile parsing (120/120 raw pages parse), atomic writes (tmp + rename, zero leftovers), a shrink guard (refuses to save if the store shrinks; FORCE_RESET override), corrupt-store abort before any file is touched, per-category fallback to the last known catalogue when a value page fails, usernames stripped from all listings (also previously stored rows), synthetic closes timestamped to the item's last update so they do not move hourly, the listing boundary can neither freeze nor move backwards (an expired boundary is abandoned with the hole recorded as a gap), run.json written after the listing phase and on TERM/INT, non-profile pages never overwrite a known record (counted, with a sample uploaded as a 3-day workflow artifact), exit codes 2/4 implemented, items.json saved after the guards.
- Automation, fixed: single hourly cron with the deep pass decided inside the job (~every 20 h), fail-loud restore of the data branch, verify gate now relative to the previous store (items >= 500 and >= 85% of last run), credential-free pushes from the worktree, keepalive only from the default branch, collector timeout signals the whole process group (timeout -k 30s 42m) so an interrupted run still reports real coverage; 42-min cap fits the 58-min job. Verified live end to end (run 36125578051 green).
- Dashboard, fixed: tier-aware name links, deep links, scroll reset on tab change, tooltip positioning, header sorting (Demand High > Medium > Low), standards mode, loading states, calibrated-odds tooltips, 'raw' label whenever a class is not calibrated, WCAG AA palette in light and dark, no horizontal scroll at 375 px, no console errors on any view. Nothing open on the dashboard.

| Area | Severity | What remains open | Why it matters / current handling |
|---|---|---|---|
| Manipulation | High | Two or more established accounts (3+ accepted trades, 14+ day age) plus two other posters can still move a call | No gate stops established traders colluding; documented, not fixed |
| Pipeline | Medium | About half of profile fetches on the runner returned non-profile pages; root cause unknown (cannot be inspected from this machine: collectors and amvgg.com are off limits) | They no longer overwrite good records; a sample page is uploaded as an artifact from the next round-2 run. The 'unparsed profiles' counter on the Overview reads 0 only because it does not exist in the run that built the public page yet. Unknown-trader weight stays at 0.2 until profile stats recover |
| Model | Low | Lower calls need >= 4% history odds of a drop; Lynx, Vanilla Penguin, Great Pyrenees and Pretty Pony pass the implied gate but sit at 3% and get no call | Threshold deliberately not retuned blind |
| Model | Low | Drop-odds calibration rests on 44 test rows above 20% (two pooled points) | 'Odds of drop' is honest but coarse |
| Automation | Low (not fixable here) | GitHub starts only ~4-6 of the 24 hourly slots on the free tier | Deep-pass logic tolerates it; hourly freshness is not guaranteed |
| Value list | n/a | Potion and egg list prices are off by 1.2-15x; demand tags stale | A Value Board decision, not an engine fix (see next steps) |

## 8. Recommended next steps (in priority order)

Short list; the first two are the ones that change what you see today.

- 1. Dispatch the workflow now (Actions -> Update predictions -> Run workflow) rather than waiting for a cron slot GitHub may skip, so round 2 (0d0bf63) reaches the public page. Then check the Overview for the 'unparsed profile pages' warning and open the run's artifact to see what the runner is actually getting from amvgg.com (rate-limit page, challenge page, or something else). Since it is your own site, whitelisting the runner or exposing a small JSON endpoint for profiles would remove the largest data-quality risk.
- 2. Value Board decisions the data supports: reprice Ride-A-Pet Potion to ~0.008-0.009 and Fly-A-Pet to ~0.014; floor Retired Egg ~0.003, Paint Sealer ~0.004, Throwback and Fairytale Egg ~0.0004; fix the stale demand tags (Fairytale Egg 'Low' with 2,126 mentions; Manta Ray, Rhino Beetle, Garden Egg 'Low' with 10-17x want/offer; Golden Egg, Peahen 'Medium' with zero wants).
- 3. Close the last high finding: add a collusion guard for established accounts (for example, require known posters from at least two join-month cohorts, or cap any single poster's share of the known-trader gap).
- 4. Retune the drop side now that drop odds are calibrated: revisit the 4% floor (the four items above) and decide whether never-updated cheap pets the market discounts 20-33% should get a 'lower' call on market evidence alone.
- 5. Widen the backtest as the log grows: 3-4 test dates instead of 2, accuracy reported separately for template-priced pets (55% sit on placeholder value triples) vs individually-priced ones, and a September-regime check so a market turn is visible in the numbers.
- 6. Scheduling: if hourly freshness matters, trigger the workflow from outside GitHub (a cron on your VPS calling 'gh workflow run' every hour) instead of relying on the free-tier scheduler; and weight listing collection toward 17-20 UTC, where posting peaks at ~10k/h.
- 7. Once profilesWithStats recovers, lower the unknown-trader reputation weight from 0.2 to ~0.1 (only the displayed implied value and the gentle pressure fallback are affected; calls are already immune).
- 8. Add two cheap, strong signal rows to Opportunities/Alerts: 'want/offer leaders tagged Low' (Manta Ray, Rhino Beetle, Garden Egg, Rainbow Trout, Candy Cane Snail, Kitty Bat, Royal Mistletroll) and 'net-dumped High-tagged' (Fairy Bat Dragon, Cow, Owl, Turtle, Parrot, Kangaroo).

