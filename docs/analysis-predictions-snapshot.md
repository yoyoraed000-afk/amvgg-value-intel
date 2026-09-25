# AMVGG Value Intelligence — Prediction Analyst Report (snapshot 2026-09-24T20:14:15Z)

_Computed by an analysis agent on 2026-09-24/25 from the rolling store. Numbers are from that snapshot; the live dashboard is newer._

Built the model in-browser (AMVGGEngine.build, 2,853 ms) on the live snapshot: 1,571 items, 11,743 updates (2026-06-02 → 2026-09-24, 114 days), 16,909 listings (6h window, 11,656 priced), 12,161 completed trades (11,762 priced), 1,569 profiles. Output: 3,133 prediction rows (781 Regular / 781 Neon / 781 Mega / 790 Item) → 597 raise calls, 153 lower calls, 2,383 flat. Backtest: 25,064 rows over 8 weekly as-of dates (2026-07-02 → 2026-08-20), split 2026-08-13 (train 18,798 / test 6,266). Accuracy 90.60% vs majority-flat 84.65% and momentum 90.82% (model does not beat momentum on raw accuracy); macro-F1 0.589, F1-up 0.689, F1-down 0.125; top-50 up precision 72%, top-100 up 76%, top-50 down 58%. The model is overconfident when it says 'up' (0.8–1.0 bin: mean P 92.2% vs 78.1% observed). Strongest, best-evidenced raise calls: Phantom Dragon FR (0.0625→0.0725, P(up) 95.8%, implied +13.2% on 46 trades), Vampire Dragon FR (0.08→0.0895, 97.1%), Diamond Unicorn Mega (0.1→0.12, implied +36.2% on 25 trades), Cryptid FR (0.865→0.93, 389 trades). Strongest lower calls are low-tier cats/dogs the market already prices 18–39% under list (Cattuccino 508 trades at −39.2%, Chihuahua, Kiwi Kiwi, Catte). Biggest history/market conflicts are high-tier pets with P(up) ≈ 99% from the bull-run history but −6% to −12% market-implied gaps on 50–400 trades (Fairy Bat Dragon, Peppermint Penguin, Strawberry Shortcake Bat Dragon, Giraffe, Shadow Dragon, Frost Dragon, Owl, Parrot).

## Model snapshot and how a call is made

- Snapshot meta: collectedAt 2026-09-24T20:14:15Z; updatesFrom 2026-06-02T12:03:58.700Z, updatesTo 2026-09-24T15:28:15.297Z; listingWindowHours 6; completedWindowDays 30; store keeps listings 12h / completed 60d.
- Summary: items 1,571; updateRows 10,827 (of 11,743 raw); listings 16,909 (pricedListings 11,656); completed 12,161 (pricedCompleted 11,762); itemsWithMarket 1,489; impliedKeys 1,775 (902 of them with ≥ 8 trades); predictionRows 3,133; raise 597; lower 153; nameCollisions 0; unknownNames 0; buildMs 2,853.
- Blend per row: expectedMove e = (1 − wM)·eHist + wM·eMarket, with wM = 0.55 × marketConfidence (so a fully-evidenced item gets ~54.5% weight on the market layer). eHist = P(up)·medianUp(tier) + P(down)·medianDown(tier). eMarket = clamp(impliedGap, ±30%) × n/(n+4) when ≥ 3 trades, else listing pressure × 0.03.
- A row becomes 'up' only if e > +2% AND (P(up) ≥ 50% OR strong implied gap [≥ 5 trades, |gap| ≥ 5%] OR P(up) ≥ 35% with confidence ≥ 0.4); mirror rule for 'down'. Predictions are sorted by score = |e| × (0.5 + 0.5·P(dir)) × (0.6 + 0.4·conf).
- flipScore = max(0,e) × (0.4 + 0.6·P(up)) × demandFactor(High 1 / Medium 0.8 / Low 0.55) × (1 + min(liquidity,40)/40) × (0.7 + 0.3·conf); the 'Pets to invest in' tab filters cat = Pets and direction = up (defaults: value ≥ 0.01, P(up) ≥ 50%, demand Medium+).
- Tier bands (tierOf): high ≥ 0.45, highmid ≥ 0.1, mid ≥ 0.03, low ≥ 0.01, insignificant < 0.01. Class threshold for the backtest: a 30-day log-move beyond ±ln(1.02) (≈ ±2%).

## Top 30 raise calls (ranked by model score)

- Columns: value → predicted (30d), blended move, P(up)/P(down) from the history model, eHist / eMarket (the two layers before blending), market confidence, implied gap (trades), offered/wanted in the last 6h, and the observed evidence the engine attached.
- The list splits into three kinds: (a) mid/low-tier pets with long raise streaks AND a market premium (Scarebear, Phantom Dragon, Ghost Bunny, Vampire Dragon, Sugar Axolotl, Zombie Wolf); (b) cheap eggs/items where P(up) ≈ 0% but the market pays 30–100% over list on hundreds of trades (Fairytale Egg 1,943 trades, Retired Egg 591, Paint Sealer 429, Admin Abuse Egg 385, Throwback Egg 333); (c) high-demand mid tiers riding the bull run with only mild market confirmation (Frost Fury, Jellyfish, Pig Neon).
- Only 284 of the 597 raise calls have a value update in the last 30 days; 88 raise calls sit on a negative streak (e.g. Diamond Unicorn Mega: 6 consecutive drops yet implied +36.2%).

| # | Name | Variant | Tier / Demand | Value → 30d | Move | P(up) | P(down) | eHist | eMarket | Conf | Implied gap (trades) | Off/Want 6h | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Diamond Unicorn | Mega | highmid / Medium | 0.1 → 0.12 | +17.976% | 70.67% | 7.319% | +8.992% | +25.862% | 0.968 | +36.224% (25) | 8/1 | Mega updated 10× in 30d (+150%); 6 consecutive drops; overpaid +1.9% across 153 sides; asks −2.7% below value; implied 0.135 vs 0.1 |
| 2 | Scarebear | Regular | low / Medium | 0.014 → 0.0165 | +16.765% | 72.942% | 2.723% | +15.99% | +17.491% | 0.939 | +19.382% (37) | 23/45 | 8 updates in 30d (+47.4%); 11 consecutive raises; 90d +75%; overpaid +4.6% (53 sides); wanted 45 vs offered 23 |
| 3 | Phantom Dragon | Regular | mid / High | 0.0625 → 0.0725 | +14.65% | 95.839% | 0.708% | +17.385% | +12.173% | 0.954 | +13.231% (46) | 58/61 | 3 updates (+13.6%); 11 consecutive raises; 90d +56.3%; overpaid +6.8% (76 sides); implied 0.071 |
| 4 | Ghost Bunny | Regular | low / Medium | 0.0185 → 0.021 | +13.844% | 81.405% | 4.274% | +17.715% | +10.427% | 0.966 | +10.936% (82) | 40/34 | 12 updates (+68.2%); 18 consecutive raises; 90d +131.3%; overpaid +7.3% (118 sides) |
| 5 | Vampire Dragon | Regular | mid / High | 0.08 → 0.0895 | +11.385% | 97.115% | 0.817% | +17.604% | +5.731% | 0.952 | +6.148% (55) | 59/56 | 5 updates (+18.5%); 14 consecutive raises; 90d +77.8%; overpaid +2.4% (72 sides) |
| 6 | Glacier Kitsune | Regular | mid / Medium | 0.036 → 0.0405 | +11.938% | 87.374% | 2.893% | +15.568% | +8.264% | 0.904 | +11.269% (11) | 39/4 | 8 updates (+40%); 11 consecutive raises; 90d +52.2%; underpaid −4.0% (35 sides); offered 39 vs wanted 4 |
| 7 | Sugar Axolotl | Regular | mid / Medium | 0.0925 → 0.1025 | +11.313% | 84.141% | 2.364% | +15.045% | +7.577% | 0.909 | +8.84% (24) | 25/10 | 6 updates (+19.4%); 24 consecutive raises; 90d +236.4%; overpaid +6.4% (39 sides) |
| 8 | Golden Chow-Chow | Regular | low / Medium | 0.014 → 0.0165 | +15.184% | 44.715% | 1.508% | +9.819% | +22.5% | 0.769 | +36.375% (12) | 1/0 | No change for 39 days; overpaid +21.7% (14 sides); offers +11.7% above value; implied 0.019 |
| 9 | Unicorn | Regular | low / High | 0.01 → 0.011 | +11.241% | 77.982% | 1.352% | +17.259% | +6.041% | 0.975 | +9.493% (7) | 55/79 | 2 updates (+11.1%); wanted 79 vs offered 55; offers +3.4% above value |
| 10 | Zombie Wolf | Regular | low / Medium | 0.019 → 0.021 | +10.697% | 77.186% | 4.042% | +16.798% | +5.443% | 0.977 | +5.615% (126) | 74/87 | 11 updates (+52%); 19 consecutive raises; 90d +137.5%; overpaid +3.8% (168 sides) |
| 11 | Frost Fury | Regular | mid / High | 0.0375 → 0.041 | +9.45% | 94.497% | 0.737% | +17.137% | +2.78% | 0.973 | +2.853% (152) | 99/45 | 2 updates (+7.1%); 3 raises; 90d +15.4%; overpaid +0.5% (168 sides); offered 99 vs wanted 45 |
| 12 | Gaelic Fae | Regular | low / Medium | 0.0135 → 0.015 | +10.624% | 74.669% | 2.294% | +16.42% | +3.258% | 0.801 | +4.887% (8) | 11/7 | 7 updates (+50%); 7 consecutive raises; underpaid −3.2% (13 sides) |
| 13 | Dancing Dragon | Regular | low / Medium | 0.023 → 0.0255 | +11.152% | 62.599% | 1.406% | +13.821% | +7.943% | 0.826 | +10.387% (13) | 6/5 | 1 update (+2.2%); 4 raises; 90d +15%; overpaid +3.8% (20 sides) |
| 14 | Caelum Cervi | Regular | mid / Medium | 0.0375 → 0.041 | +9.466% | 82.676% | 5.589% | +14.374% | +4.457% | 0.9 | +6.438% (9) | 12/26 | 8 updates (+36.4%); 9 raises; wanted 26 vs offered 12; asks −6.9% below value |
| 15 | Ice Wolf | Regular | low / Medium | 0.0185 → 0.0205 | +10.463% | 68.307% | 2.287% | +15.001% | +5.184% | 0.84 | +7.258% (10) | 15/8 | 6 updates (+23.3%); 11 raises; 90d +68.2% |
| 16 | Fairytale Egg | Item (Eggs) | insignificant / Low | 0.0002 → 0.00025 | +16.314% | 0% | 0.006% | 0% | +29.938% | 0.991 | +63.442% (1943) | 886/222 | No change 180+ days; overpaid +3.1% (313 sides); implied 0.00035 vs 0.0002 — market layer only |
| 17 | Pig | Neon | highmid / High | 0.1325 → 0.145 | +8.429% | 94.037% | 0.706% | +13.057% | +4.496% | 0.983 | +5.352% (21) | 16/12 | 2 updates (+6%); 4 raises; 90d +15.2%; underpaid −3.2% (256 sides all tiers) |
| 18 | Retired Egg | Item (Eggs) | insignificant / Low | 0.0002 → 0.00025 | +16.178% | 0% | 0.01% | −0.001% | +29.798% | 0.987 | +44.121% (591) | 945/155 | No change 94 days; overpaid +1.7% (130 sides); implied 0.0003 |
| 19 | Goat | Regular | mid / Medium | 0.0425 → 0.0465 | +9.379% | 74.429% | 1.86% | +13.337% | +5.828% | 0.958 | +6.259% (54) | 31/63 | No change 33 days; 90d +6.3%; wanted 63 vs offered 31; overpaid +3.2% (91 sides) |
| 20 | Bald Eagle | Regular | mid / Medium | 0.0825 → 0.091 | +9.717% | 88.827% | 1.989% | +15.946% | −0.996% | 0.669 | −1.661% (6) | 7/1 | 5 updates (+22.2%); 14 consecutive raises; 90d +106.3%; thin market (7 sides) |
| 21 | Paint Sealer | Item (Toys) | insignificant / Medium | 0.00055 → 0.00065 | +15.972% | 0.019% | 0.093% | −0.003% | +29.723% | 0.977 | +52.596% (429) | 291/59 | 1 update (−14.3%); overpaid +9.2% (151 sides); implied 0.00085 |
| 22 | Glormy Leo | Regular | low / Medium | 0.028 → 0.031 | +9.963% | 63.192% | 1.24% | +13.97% | +6.015% | 0.916 | +7.109% (22) | 18/17 | 8 consecutive raises; 90d +40%; overpaid +7.6% (44 sides) |
| 23 | Admin Abuse Egg | Item (Eggs) | insignificant / Medium | 0.0004 → 0.00045 | +15.868% | 0.007% | 0.049% | −0.002% | +29.692% | 0.972 | +31.552% (385) | 242/56 | No change 92 days; overpaid +2.5% (117 sides); implied 0.00055 |
| 24 | Throwback Egg | Item (Eggs) | insignificant / Low | 0.0001 → 0.0001 | +15.838% | 0% | 0.002% | 0% | +29.644% | 0.971 | +100.885% (333) | 433/24 | No change 180+ days; implied 0.0002 vs 0.0001 (rounding keeps predicted at 0.0001) |
| 25 | Little Lamb | Regular | insignificant / Low | 0.0035 → 0.0041 | +15.469% | 0.559% | 0.362% | +0.072% | +29.167% | 0.962 | +81.733% (140) | 40/21 | No change 180+ days; overpaid +17.1% (118 sides); implied 0.00635 |
| 26 | Unicorn | Neon | mid / High | 0.03 → 0.0325 | +8.678% | 78.071% | 1.534% | +14.042% | +4.044% | 0.975 | +4.52% (34) | 59/61 | 2 updates (+20%); 2 raises; 90d +11.1% |
| 27 | Endangered Egg | Item (Eggs) | insignificant / Low | 0.0002 → 0.00025 | +15.551% | 0% | 0.01% | −0.001% | +29.601% | 0.955 | +40.644% (297) | 171/2 | No change 94 days; implied 0.0003 |
| 28 | Ghost Bunny | Neon | mid / Medium | 0.075 → 0.0815 | +8.411% | 81.794% | 4.111% | +14.398% | +3.126% | 0.966 | +4.019% (14) | 31/11 | 12 updates (+66.7%); 21 consecutive raises; 90d +200% |
| 29 | Jellyfish | Regular | mid / High | 0.065 → 0.0705 | +7.806% | 96.177% | 0.766% | +17.439% | −1.173% | 0.941 | −1.324% (31) | 25/40 | 4 updates (+18.2%); 4 raises; 90d +30%; market slightly below list |
| 30 | Silly Duck | Regular | low / Medium | 0.0125 → 0.0145 | +13.8% | 12.942% | 3.012% | +2.571% | +25.385% | 0.895 | +60.6% (22) | 10/14 | No change 102 days; overpaid +20.7% (34 sides); implied 0.02 — market layer only |

## Top 20 lower calls (ranked by model score)

- Every lower call in the top 20 is driven by the market layer (eMarket −16% to −30%) rather than history: for most, P(down) is under 3% because the softmax almost never learns 'down' (only 3.0% of training rows).
- The pattern is unmistakable: cheap Regular cats/dogs/fish that sit unchanged on the board for 180+ days while traders consistently give them away at 18–39% under list, with heavy offer-side listings (Catte offered 256× vs wanted 9×; Kiwi Kiwi 23× vs 1×; Puffer Fish 29× vs 1×).
- Only 4 of the 153 lower calls are above 0.03 in value (see 'Sell / avoid' list below for the higher-value dump candidates ranked by dumpScore).

| # | Name | Variant | Tier / Demand | Value → 30d | Move | P(up) | P(down) | eMarket | Conf | Implied gap (trades) | Off/Want 6h | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Cattuccino | Regular | insignificant / Medium | 0.006 → 0.00515 | −15.718% | 5.781% | 1.102% | −29.766% | 0.986 | −39.156% (508) | 181/175 | No change 180+ d; underpaid −7.8% (258 sides); asks −2.0%; implied 0.00365 |
| 2 | Chihuahua | Regular | insignificant / Low | 0.00675 → 0.0059 | −13.708% | 1.47% | 2.082% | −25.486% | 0.982 | −25.861% (272) | 105/53 | 2 updates (−10%); 6 consecutive drops; 90d −46%; underpaid −9.6% (237 sides); asks −5.3% |
| 3 | Kiwi Kiwi | Regular | low / Medium | 0.011 → 0.0097 | −12.653% | 4.342% | 10.761% | −24.757% | 0.923 | −26.494% (57) | 23/1 | 8 updates (−63.3%); 12 consecutive drops; 90d −81.7%; underpaid −14.1% (56 sides) |
| 4 | Princess Mare | Regular | insignificant / Low | 0.0031 → 0.00275 | −11.963% | 0.465% | 0.315% | −23.808% | 0.916 | −25.229% (67) | 4/1 | No change 180+ d; underpaid −12.6% (53 sides) |
| 5 | Koi Carp | Regular | insignificant / Low | 0.0065 → 0.00575 | −11.919% | 1.37% | 0.711% | −25.385% | 0.861 | −34.512% (22) | 11/3 | No change 180+ d; underpaid −19.4% (20 sides) |
| 6 | Catte | Regular | low / Medium | 0.021 → 0.019 | −10.128% | 23.439% | 3.078% | −23.197% | 0.973 | −23.922% (128) | 256/9 | No change 180+ d; underpaid −9.0% (114 sides); offered 256× vs wanted 9× |
| 7 | Classic Trade Stand | Item (Toys) | insignificant / Medium | 0.004 → 0.0036 | −10.522% | 0.397% | 1.038% | −21.296% | 0.898 | −22.934% (52) | 52/8 | 1 update (−20%); 2 drops; underpaid −9.4% (35 sides) |
| 8 | Mr. Whiskerpips | Regular | insignificant / Medium | 0.00675 → 0.0061 | −10.414% | 6.747% | 1.236% | −21.709% | 0.917 | −24.34% (33) | 11/3 | No change 180+ d; underpaid −7.7% (41 sides) |
| 9 | Gecko | Regular | insignificant / Low | 0.00675 → 0.0061 | −10.145% | 1.443% | 0.739% | −21.015% | 0.887 | −24.128% (27) | 6/2 | No change 180+ d; underpaid −9.1% (31 sides) |
| 10 | Purrowl | Regular | insignificant / Low | 0.004 → 0.00365 | −9.698% | 0.683% | 0.42% | −18.359% | 0.965 | −18.919% (131) | 72/39 | No change 180+ d; underpaid −7.1% (113 sides) |
| 11 | Clownfish | Regular | insignificant / Low | 0.00625 → 0.00565 | −9.813% | 1.297% | 0.682% | −20.234% | 0.89 | −21.761% (53) | 8/1 | No change 180+ d; underpaid −11.5% (38 sides) |
| 12 | Tuxedo Cat | Regular | low / Medium | 0.0105 → 0.00965 | −8.365% | 10.717% | 10.91% | −16.992% | 0.958 | −17.634% (106) | 61/6 | 6 updates (−30%); 7 consecutive drops; 90d −32.3%; offered 61× vs wanted 6× |
| 13 | 2D Kitty | Regular | low / Medium | 0.011 → 0.01 | −8.278% | 17.399% | 6.061% | −20.17% | 0.895 | −23.052% (28) | 27/10 | 3 updates (−15.4%); 4 consecutive drops; underpaid −11.4% (36 sides) |
| 14 | Blue Whale | Regular | insignificant / Low | 0.004 → 0.00365 | −8.837% | 0.683% | 0.42% | −20.691% | 0.781 | −27.588% (12) | 9/7 | No change 180+ d; underpaid −34.4% (13 sides) |
| 15 | General Sheepdog | Regular | insignificant / Low | 0.007 → 0.00645 | −8.036% | 2.025% | 1.614% | −16.544% | 0.897 | −17.952% (47) | 30/2 | 1 update (−6.7%); 2 drops; 90d −12.5%; underpaid −12.7% (31 sides) |
| 16 | Puffer Fish | Regular | insignificant / Medium | 0.0095 → 0.0088 | −7.814% | 10.304% | 1.692% | −16.684% | 0.939 | −18.167% (45) | 29/1 | No change 180+ d; underpaid −5.7% (67 sides); offered 29× vs wanted 1× |
| 17 | Leopard Cat | Regular | insignificant / Low | 0.0065 → 0.006 | −7.653% | 1.37% | 0.711% | −15.543% | 0.906 | −17.427% (33) | 16/2 | No change 180+ d; underpaid −2.9% (40 sides) |
| 18 | Golden Griffin | Regular | insignificant / Low | 0.00425 → 0.00395 | −7.538% | 0.747% | 0.45% | −17.455% | 0.791 | −21.819% (16) | 12/1 | No change 180+ d; underpaid −14.4% (17 sides) |
| 19 | Chocolate Chow-Chow | Regular | insignificant / Low | 0.0075 → 0.00695 | −7.462% | 1.525% | 1.161% | −18.513% | 0.744 | −25.918% (10) | 8/0 | No change 102 d; underpaid −17.2% (15 sides) |
| 20 | Cat | Regular | insignificant / Low | 0.003 → 0.0028 | −7.247% | 0.442% | 0.303% | −16.701% | 0.792 | −21.472% (14) | 21/1 | No change 180+ d; underpaid −12.7% (13 sides) |

## Pets to invest in — top 20 by flipScore, value ≥ 0.03 (mid tier and up)

- All 20 are direction = up (matches the dashboard's tab filter). flipScore rewards expected gain × odds × demand × liquidity × evidence, so High-demand mid-tier Regulars with balanced offer/want books dominate.
- Phantom Dragon FR is the clear #1 (flipScore 0.282): 95.8% odds, +14.65% blended move, market pays +13.2% over list on 46 trades, and 58 offered vs 61 wanted in 6h. Vampire Dragon FR (0.221) and Frost Fury FR (0.181) follow with 97.1% and 94.5% odds.
- Diamond Unicorn Mega ranks #2 (0.235) purely on the +36.2% implied gap; note P(up) is only 70.7% and the board has cut it 6 times in a row.

| # | Pet | Variant | Tier / Demand | Buy at → Target 30d | Potential | Odds P(up) | flipScore | Liquidity (all sides) | Off/Want 6h | Conf | Implied gap (trades) | Value gained |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Phantom Dragon | Regular | mid / High | 0.0625 → 0.0725 | +14.65% | 95.839% | 0.282 | 199 | 58/61 | 0.954 | +13.231% (46) | +0.00986 |
| 2 | Diamond Unicorn | Mega | highmid / Medium | 0.1 → 0.12 | +17.976% | 70.67% | 0.235 | 207 | 8/1 | 0.968 | +36.224% (25) | +0.01969 |
| 3 | Vampire Dragon | Regular | mid / High | 0.08 → 0.0895 | +11.385% | 97.115% | 0.221 | 202 | 59/56 | 0.952 | +6.148% (55) | +0.00965 |
| 4 | Frost Fury | Regular | mid / High | 0.0375 → 0.041 | +9.45% | 94.497% | 0.181 | 322 | 99/45 | 0.973 | +2.853% (152) | +0.00372 |
| 5 | Glacier Kitsune | Regular | mid / Medium | 0.036 → 0.0405 | +11.938% | 87.374% | 0.171 | 79 | 39/4 | 0.904 | +11.269% (11) | +0.00457 |
| 6 | Pig | Neon | highmid / High | 0.1325 → 0.145 | +8.429% | 94.037% | 0.162 | 318 | 16/12 | 0.983 | +5.352% (21) | +0.01165 |
| 7 | Sugar Axolotl | Regular | mid / Medium | 0.0925 → 0.1025 | +11.313% | 84.141% | 0.159 | 77 | 25/10 | 0.909 | +8.84% (24) | +0.01108 |
| 8 | Jellyfish | Regular | mid / High | 0.065 → 0.0705 | +7.806% | 96.177% | 0.150 | 128 | 25/40 | 0.941 | −1.324% (31) | +0.00528 |
| 9 | Unicorn | Neon | mid / High | 0.03 → 0.0325 | +8.678% | 78.071% | 0.150 | 284 | 59/61 | 0.975 | +4.52% (34) | +0.00272 |
| 10 | Border Collie | Regular | mid / High | 0.07 → 0.0755 | +7.714% | 95.983% | 0.149 | 246 | 42/89 | 0.965 | −0.861% (65) | +0.00561 |
| 11 | Crocodile | Regular | mid / High | 0.0825 → 0.089 | +7.636% | 97.034% | 0.149 | 329 | 110/55 | 0.973 | −1.057% (132) | +0.00655 |
| 12 | Blue Dog | Regular | mid / High | 0.0825 → 0.089 | +7.799% | 96.858% | 0.148 | 74 | 12/22 | 0.901 | −2.432% (27) | +0.00669 |
| 13 | Cryptid | Regular | high / High | 0.865 → 0.93 | +7.258% | 89.517% | 0.136 | 1570 | 348/583 | 0.993 | +3.724% (389) | +0.06512 |
| 14 | Cupid Dragon | Regular | mid / High | 0.0425 → 0.0455 | +7.041% | 92.765% | 0.133 | 180 | 21/76 | 0.954 | −1.989% (50) | +0.0031 |
| 15 | Caelum Cervi | Regular | mid / Medium | 0.0375 → 0.041 | +9.466% | 82.676% | 0.132 | 67 | 12/26 | 0.9 | +6.438% (9) | +0.00372 |
| 16 | Albino Monkey | Regular | highmid / High | 0.1 → 0.1075 | +6.522% | 97.463% | 0.127 | 248 | 100/33 | 0.966 | +0.337% (65) | +0.00674 |
| 17 | Goat | Regular | mid / Medium | 0.0425 → 0.0465 | +9.379% | 74.429% | 0.125 | 192 | 31/63 | 0.958 | +6.259% (54) | +0.00418 |
| 18 | Orchid Butterfly | Neon | high / High | 2.65 → 2.825 | +6.384% | 95.884% | 0.122 | 55 | 12/2 | 0.928 | — (no implied) | +0.1747 |
| 19 | Ghost Bunny | Neon | mid / Medium | 0.075 → 0.0815 | +8.411% | 81.794% | 0.119 | 173 | 31/11 | 0.966 | +4.019% (14) | +0.00658 |
| 20 | Lion | Regular | mid / High | 0.0825 → 0.0875 | +6.085% | 97.034% | 0.117 | 173 | 66/45 | 0.939 | −5.06% (52) | +0.00518 |

## Pets to invest in — top 20 by flipScore, high tier only (value ≥ 0.45)

- 178 high-tier pet rows exist; the model calls 111 up, 7 down, 60 flat. P(up) distribution for high tier: 45 rows < 50%, 63 in 50–80%, 24 in 80–90%, 18 in 90–95%, 28 above 95%.
- Cryptid FR is the most liquid high-tier raise on the whole board (1,570 trade/listing sides; 389 completed trades imply +3.7%; 583 wanted vs 348 offered in 6h).
- Most high-tier raise calls carry a small negative implied gap (−1% to −5%) — the history layer (bull-run prior) is doing the lifting; the market layer is neutral-to-slightly-bearish. Frostbite Bear Neon (+9.4% on 43 trades) and Glacier Kitsune Mega (+5.9% on 13) are the exceptions where the market agrees.
- Largest absolute value gains in this list: Bat Dragon Mega (37.25 → 38.895, +1.643), Orchid Butterfly Mega (10.5 → 11.095, +0.594), Bat Dragon Neon (12.05 → 12.575, +0.524), African Wild Dog Mega (11.65 → 12.165, +0.513).

| # | Pet | Variant | Demand | Buy at → Target 30d | Potential | Odds P(up) | flipScore | Liquidity | Off/Want 6h | Conf | Implied gap (trades) | Value gained |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Cryptid | Regular | High | 0.865 → 0.93 | +7.258% | 89.517% | 0.136 | 1570 | 348/583 | 0.993 | +3.724% (389) | +0.06512 |
| 2 | Orchid Butterfly | Neon | High | 2.65 → 2.825 | +6.384% | 95.884% | 0.122 | 55 | 12/2 | 0.928 | — | +0.1747 |
| 3 | Glacier Kitsune | Mega | Medium | 0.6 → 0.65 | +8.151% | 85.286% | 0.115 | 52 | 11/5 | 0.904 | +5.925% (13) | +0.05096 |
| 4 | Alpaca | Neon | High | 0.49 → 0.5175 | +5.545% | 92.18% | 0.105 | 267 | 27/41 | 0.979 | −1.011% (36) | +0.02794 |
| 5 | Orchid Butterfly | Mega | High | 10.5 → 11.095 | +5.5% | 90.067% | 0.101 | 52 | 2/9 | 0.928 | −2.647% (3) | +0.59365 |
| 6 | Werewolf | Neon | High | 0.57 → 0.6 | +5.053% | 93.614% | 0.097 | 387 | 57/27 | 0.986 | −2.068% (39) | +0.02954 |
| 7 | African Wild Dog | Neon | High | 3.075 → 3.225 | +4.722% | 97.76% | 0.093 | 244 | 5/30 | 0.978 | −3.894% (16) | +0.14869 |
| 8 | African Wild Dog | Regular | High | 0.865 → 0.905 | +4.633% | 98.944% | 0.091 | 440 | 117/114 | 0.978 | −3.591% (133) | +0.04102 |
| 9 | Sugar Glider | Mega | High | 1.84 → 1.93 | +4.882% | 87.762% | 0.090 | 254 | 15/29 | 0.979 | −1.931% (20) | +0.09205 |
| 10 | Frostbite Bear | Neon | Medium | 1.12 → 1.205 | +7.233% | 63.12% | 0.090 | 638 | 50/16 | 0.989 | +9.394% (43) | +0.08401 |
| 11 | Pelican | Mega | Medium | 3.38 → 3.61 | +6.581% | 80.396% | 0.089 | 51 | 1/28 | 0.866 | — | +0.22993 |
| 12 | Arctic Reindeer | Neon | High | 0.57 → 0.5975 | +4.53% | 97.185% | 0.089 | 488 | 34/73 | 0.989 | −3.491% (54) | +0.02641 |
| 13 | Royal Mistletroll | Neon | High | 0.65 → 0.6825 | +4.784% | 91.077% | 0.088 | 45 | 4/11 | 0.923 | −5.291% (3) | +0.03186 |
| 14 | Pelican | Neon | Medium | 0.845 → 0.9025 | +6.653% | 89.489% | 0.086 | 32 | 3/7 | 0.866 | +0.334% (4) | +0.05813 |
| 15 | Orchid Butterfly | Regular | High | 0.67 → 0.7 | +4.386% | 98.676% | 0.085 | 141 | 84/16 | 0.928 | −5.364% (36) | +0.03004 |
| 16 | Bat Dragon | Neon | High | 12.05 → 12.575 | +4.257% | 96.734% | 0.083 | 256 | 43/30 | 0.978 | −4.547% (23) | +0.52403 |
| 17 | African Wild Dog | Mega | High | 11.65 → 12.165 | +4.31% | 88.102% | 0.080 | 229 | 6/14 | 0.978 | −4.218% (6) | +0.51314 |
| 18 | Bush Elephant | Neon | High | 0.49 → 0.5125 | +4.295% | 89.262% | 0.080 | 151 | 24/8 | 0.964 | −3.682% (23) | +0.0215 |
| 19 | Candyfloss Chick | Mega | High | 1.66 → 1.73 | +4.216% | 90.959% | 0.079 | 214 | 14/19 | 0.974 | −3.903% (23) | +0.07148 |
| 20 | Bat Dragon | Mega | High | 37.25 → 38.895 | +4.315% | 85.561% | 0.078 | 212 | 11/18 | 0.978 | −2.982% (10) | +1.64268 |

## Where the history layer and the market layer disagree most

- Type A — history bullish, market bearish (value ≥ 0.01, P(up) ≥ 60%, ≥ 8 trades, implied gap ≤ −5%): 105 rows qualify. These are the pets the softmax loves because of the July–September bull run (high value + High demand + recent raise) but where completed trades clear 6–15% under the list value. The blend usually still says 'up' at a muted +2–3%; for the biggest gaps (Royal Mistletroll FR, Fairy Bat Dragon Neon/Mega) the market wins and the call flips to flat/down.
- Type B — history flat, market bullish (P(up) ≤ 30%, ≥ 8 trades, gap ≥ +8%): 27 rows. Mostly low/mid Regulars the board hasn't touched in months that traders now pay 12–78% over list for (Violet Butterfly, Silly Duck, Lava Dragon, Jousting Horse). These are the earliest 'the board is behind the market' signals.
- High-tier conflict cluster (≥ 0.45): Fairy Bat Dragon Mega (P(up) 75.4%, eHist +7.9% vs market −11.4% on 64 trades → blended −2.67%, call = down; offered 253× vs wanted 27×), Fairy Bat Dragon Neon (80.7% / +9.3% vs −11.6% on 99 → −2.16%, down), Peppermint Penguin Mega (74.8% / +7.8% vs −9.8% on 51 → −1.74%, flat), Peppermint Penguin Neon (80.2% vs −9.3% on 53 → flat), Strawberry Shortcake Bat Dragon Mega (90.2% vs −8.9% on 59 → +0.68%, flat), Arctic Dusk Dragon Mega (90.3% vs −8.5% on 44 → +1.02%, flat). All of these rose 20–110% in the last 30 days on 25–46-raise streaks, i.e. the board over-ran the market.
- Low-value extreme cases (the raw largest |eHist − eMarket|): Cattuccino FR (history +0.9% vs market −29.8%), Fairytale Egg / Retired Egg / Paint Sealer / Admin Abuse Egg / Throwback Egg / Endangered Egg / Little Lamb (history ≈ 0% vs market +29.2–29.9%, i.e. the ±30% clamp). Lava Wolf FR is a clean tie: P(up) 64.1%, eHist +14.1% vs implied −19.9% on 10 trades → blended +1.6%, no call.

| Type | Name | Variant | Tier | Value → 30d | P(up) | P(down) | eHist | eMarket | Implied gap (trades) | Conf | Blended move / call | Off/Want 6h | Streak / 30d change |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | Royal Mistletroll | Regular | highmid | 0.16 → 0.16 | 94.533% | 5.035% | +12.603% | −12.766% | −15.454% (19) | 0.923 | −0.279% / flat | 28/71 | +11 raises / +88.2% |
| A | Giraffe | Regular | high | 2.55 → 2.605 | 98.877% | 0.581% | +14.079% | −8.303% | −8.589% (116) | 0.977 | +2.052% / up | 174/92 | +32 / +1.6% |
| A | Shadow Dragon | Regular | high | 3.72 → 3.805 | 98.757% | 0.624% | +14.057% | −7.94% | −8.234% (108) | 0.973 | +2.289% / up | 109/86 | +6 / +1.2% |
| A | Pink Cat | Regular | mid | 0.0525 → 0.055 | 96.838% | 0.912% | +17.542% | −8.569% | −9.888% (26) | 0.922 | +4.307% / up | 28/28 | +4 / +31.3% |
| A | Frost Dragon | Neon | high | 3.03 → 3.105 | 97.958% | 0.579% | +13.948% | −7.211% | −7.636% (68) | 0.991 | +2.409% / up | 82/62 | +12 / +0.7% |
| A | Frost Dragon | Regular | high | 1.725 → 1.775 | 99.033% | 0.499% | +14.111% | −6.34% | −6.404% (395) | 0.991 | +2.959% / up | 449/335 | +13 / +1.5% |
| A | Owl | Regular | high | 1.34 → 1.38 | 98.981% | 0.49% | +14.105% | −6.442% | −6.515% (352) | 0.991 | +2.907% / up | 478/195 | +13 / +1.1% |
| A | Parrot | Regular | high | 1.07 → 1.105 | 98.94% | 0.491% | +14.099% | −6.241% | −6.329% (283) | 0.989 | +3.037% / up | 372/152 | +13 / +1.4% |
| A | Bat Dragon | Regular | high | 5.125 → 5.3 | 98.63% | 0.698% | +14.03% | −5.876% | −6.064% (125) | 0.978 | +3.32% / up | 141/190 | +8 / +1.5% |
| A | Balloon Unicorn | Regular | high | 0.925 → 0.9575 | 98.907% | 0.54% | +14.088% | −5.645% | −5.739% (242) | 0.988 | +3.36% / up | 308/188 | +14 / +1.6% |
| A-high | Fairy Bat Dragon | Mega | high | 2 → 1.945 | 75.389% | 24.071% | +7.881% | −11.406% | −12.119% (64) | 0.994 | −2.666% / down | 253/27 | +42 / +110.5% |
| A-high | Fairy Bat Dragon | Neon | high | 0.51 → 0.5 | 80.733% | 19.006% | +9.257% | −11.615% | −12.084% (99) | 0.994 | −2.156% / down | 271/79 | +36 / +100% |
| A-high | Peppermint Penguin | Mega | high | 3.08 → 3.025 | 74.807% | 23.972% | +7.809% | −9.791% | −10.559% (51) | 0.986 | −1.74% / flat | 76/26 | +39 / +42.6% |
| A-high | Strawberry Shortcake Bat Dragon | Mega | high | 2.8 → 2.82 | 90.234% | 5.923% | +12.197% | −8.85% | −9.45% (59) | 0.995 | +0.679% / flat | 180/31 | +46 / +20.4% |
| A-high | Arctic Dusk Dragon | Mega | high | 0.61 → 0.6175 | 90.326% | 6.319% | +12.162% | −8.541% | −9.317% (44) | 0.978 | +1.022% / flat | 176/32 | +25 / +60.5% |
| B | Violet Butterfly | Regular | low | 0.015 → 0.017 | 15.119% | 4.888% | +2.859% | +23.333% | +78.344% (14) | 0.801 | +11.875% / up | 6/3 | −6 drops / −3.2% |
| B | Silly Duck | Regular | low | 0.0125 → 0.0145 | 12.942% | 3.012% | +2.571% | +25.385% | +60.6% (22) | 0.895 | +13.8% / up | 10/14 | −1 / 0% |
| B | Panda | Neon | mid | 0.03 → 0.0325 | 10.401% | 2.4% | +1.596% | +14.356% | +19.141% (12) | 0.947 | +8.24% / up | 30/6 | −1 / 0% |
| B | Spring Bunny Feet | Item | low | 0.011 → 0.012 | 1.685% | 3.552% | +0.002% | +14.919% | +15.351% (138) | 0.968 | +7.942% / up | 125/25 | −5 / −31.3% |
| B | Lava Dragon | Regular | mid | 0.0325 → 0.035 | 24.711% | 5.163% | +3.859% | +10.694% | +11.85% (37) | 0.929 | +7.352% / up | 42/10 | −4 / 0% |
| B | Jousting Horse | Neon | highmid | 0.19 → 0.195 | 19.455% | 58.925% | −4.406% | +8.896% | +11.438% (14) | 0.954 | +2.576% / up | 13/3 | −10 drops / −5% |
| B | Pet Handler Pro Certificate | Item | low | 0.012 → 0.013 | 7.398% | 4.429% | +1.184% | +11.622% | +11.693% (652) | 0.991 | +6.873% / up | 348/202 | −2 / 0% |
| B | Black Springer Spaniel | Mega | highmid | 0.12 → 0.1275 | 11.985% | 1.739% | +1.465% | +9.964% | +14.946% (8) | 0.84 | +5.393% / up | 13/6 | 0 / 0% |
| tie | Lava Wolf | Regular | low | 0.0135 → 0.0135 | 64.061% | 1.877% | +14.097% | −14.197% | −19.876% (10) | 0.803 | +1.607% / flat | 11/9 | — / — |

## Distribution of calls by tier, variant and category

- By tier: high 190 rows → 121 up / 7 down / 62 flat (64% of high-tier rows are raise calls); highmid 304 → 148 / 5 / 151; mid 534 → 109 / 6 / 419; low 683 → 64 / 19 / 600; insignificant 1,422 → 155 / 116 / 1,151. Lower calls concentrate almost entirely in the insignificant tier (116 of 153).
- By variant: Regular 781 → 235 up / 121 down / 425 flat; Neon 781 → 136 / 4 / 641; Mega 781 → 125 / 9 / 647; Item 790 → 101 / 19 / 670. The engine hardly ever calls a Neon or Mega down (13 total), because the tier feature carries a −0.904 down-weight and −1.086 up-weight (Neon/Mega values are stickier).
- By category: Pets 2,343 → 496 up / 134 down; PetWear 236 → 47 / 16; Eggs 44 → 21 / 0; Toys 87 → 14 / 1; Vehicles 198 → 3 / 0; Stickers 71 → 3 / 0; Food 51 → 3 / 0; Gifts 32 → 4 / 0; Houses 36 → 2 / 1; Strollers 35 → 4 / 1.
- Mean P(up) by tier × variant (current rows): high|Regular 90.9% (13 of 17 above 90%), highmid|Regular 89.1%, high|Neon 83.6%, mid|Regular 66.4%, highmid|Neon 61.0%, high|Mega 58.9%, low|Regular 33.7%, mid|Neon 31.2%, highmid|Mega 27.7%, mid|Item 17.3%, mid|Mega 4.4%, low|Neon 3.0%, insignificant|Regular 2.1%, everything else under 2.5%.

| Group | Rows | Up | Down | Flat | Mean P(up) | Mean P(down) | Rows with P(up) > 90% | Mean blended move |
|---|---|---|---|---|---|---|---|---|
| high | Regular | 17 | 15 | 0 | 2 | 90.855% | 8.249% | 13 | +2.937% |
| high | Neon | 42 | 33 | 2 | 7 | 83.587% | 8.735% | 23 | +2.952% |
| high | Mega | 119 | 63 | 5 | 51 | 58.937% | 7.693% | 10 | +2.144% |
| high | Item | 12 | 10 | 0 | 2 | 61.299% | 11.354% | 0 | +5.677% |
| highmid | Regular | 37 | 28 | 0 | 9 | 89.089% | 5.59% | 28 | +3.157% |
| highmid | Neon | 83 | 54 | 2 | 27 | 61.007% | 6.687% | 11 | +3.225% |
| highmid | Mega | 152 | 51 | 2 | 99 | 27.684% | 2.943% | 0 | +1.84% |
| highmid | Item | 32 | 15 | 1 | 16 | 46.407% | 9.195% | 0 | +2.654% |
| mid | Regular | 66 | 48 | 3 | 15 | 66.359% | 6.491% | 20 | +5.067% |
| mid | Neon | 123 | 46 | 0 | 77 | 31.181% | 2.964% | 0 | +3.045% |
| mid | Mega | 307 | 9 | 2 | 296 | 4.372% | 0.888% | 0 | +0.34% |
| mid | Item | 38 | 6 | 1 | 31 | 17.345% | 5.758% | 0 | +1.479% |
| low | Regular | 90 | 47 | 15 | 28 | 33.66% | 3.063% | 0 | +3.44% |
| low | Neon | 282 | 3 | 0 | 279 | 3.028% | 0.842% | 0 | +0.234% |
| low | Mega | 178 | 2 | 0 | 176 | 0.409% | 0.236% | 0 | +0.06% |
| low | Item | 133 | 12 | 4 | 117 | 2.386% | 2.515% | 0 | +0.434% |
| insignificant | Regular | 571 | 97 | 103 | 371 | 2.116% | 0.747% | 0 | +0.116% |
| insignificant | Neon | 251 | 0 | 0 | 251 | 0.423% | 0.267% | 0 | −0.026% |
| insignificant | Mega | 25 | 0 | 0 | 25 | 0.15% | 0.11% | 0 | −0.636% |
| insignificant | Item | 575 | 58 | 13 | 504 | 0.268% | 0.457% | 0 | +0.687% |

## 15 biggest implied-value gaps with ≥ 8 trades (implied solver)

- The solver fit 1,775 keys (finalLoss 160.756); 902 keys have ≥ 8 trades. Gap distribution for those 902: p5 −14.7%, p25 −6.6%, median −2.3%, p75 +4.6%, p95 +19.6%; mean |gap| 8.34%. So the typical item clears slightly under its list value, and the tails are where the money is.
- The raw top-15 by |gap| is dominated by sub-0.01 eggs/items and cheap pets (the market values Throwback Egg at 2× list on 333 trades, Little Lamb at 1.8× on 140, Fairytale Egg at 1.63× on 1,943). The only negative in the raw top 15 are Mochi Meow M (−39.4% on 18 trades) and Cattuccino FR (−39.2% on 508).
- For value ≥ 0.03, the largest positive gaps: Diamond Unicorn MFR +36.2% (25), Black Springer Spaniel MFR +14.9% (8), White Sand Dollar MFR +14.3% (8), Nessie FR +13.4% (22), Phantom Dragon FR +13.2% (46), Sheeeeep FR +12.7% (42), Jousting Horse FR +12.3% (53), Lava Dragon FR +11.9% (37), Jousting Horse NFR +11.4% (14), Glacier Kitsune FR +11.3% (11), Pupcake MFR +11.0% (18), Ballet Swan FR +9.5% (286), Jousting Horse MFR +9.5% (26), Frostbite Bear NFR +9.4% (43), Ice Cream Hermit Crab NFR +9.0% (8).
- For value ≥ 0.03, the largest negative gaps: Strawberry Shortcake Bat Dragon Backpack −15.7% (15), Royal Mistletroll FR −15.5% (19), Hero Gibbon FR −14.8% (13), Glacier Kitsune NFR −14.2% (8), Flamingo R −14.0% (21), Sea Slug FR −13.7% (14), Skele-Rex NFR −12.7% (11), Christmas Egg −12.3% (8), Puffin FR −12.1% (14), Fairy Bat Dragon MFR −12.1% (64), Fairy Bat Dragon NFR −12.1% (99), Fairy Bat Dragon FR −12.1% (425), Irish Water Spaniel FR −11.3% (23), Matcha Cat FR −11.2% (93), Shrew FR −11.1% (33).
- High tier (≥ 0.45) largest |gap|: Fairy Bat Dragon MFR −12.1% (64) and NFR −12.1% (99), Peppermint Penguin MFR −10.6% (51), Balloon Unicorn NP −10.3% (13), Peppermint Penguin NFR −10.0% (53), Jousting Horse MFR +9.5% (26), SSBD MFR −9.5% (59), Frostbite Bear NFR +9.4% (43), Arctic Dusk Dragon MFR −9.3% (44), Tri-horned Treehopper MFR −9.0% (9), SSBD NFR −9.0% (101), Mermicorn MFR −9.0% (8), Haetae NFR −8.7% (16), Giraffe FR −8.6% (116), Shadow Dragon FR −8.2% (108).

| # | Name | Variant code | Listed value | Market-implied value | Gap | Trades | Tier |
|---|---|---|---|---|---|---|---|
| 1 | Throwback Egg | v | 0.0001 | 0.00020088 | +100.885% | 333 | insignificant |
| 2 | Little Lamb | fr | 0.0035 | 0.00636066 | +81.733% | 140 | insignificant |
| 3 | Violet Butterfly | fr | 0.015 | 0.02675167 | +78.344% | 14 | low |
| 4 | Fairytale Egg | v | 0.0002 | 0.00032688 | +63.442% | 1943 | insignificant |
| 5 | Silly Duck | fr | 0.0125 | 0.02007496 | +60.6% | 22 | low |
| 6 | Ratatoskr | fr | 0.0035 | 0.00535921 | +53.12% | 21 | insignificant |
| 7 | Paint Sealer | v | 0.00055 | 0.00083928 | +52.596% | 429 | insignificant |
| 8 | Royal Fairytale Egg | v | 0.003 | 0.00456959 | +52.32% | 20 | insignificant |
| 9 | Bat | fr | 0.004 | 0.00600836 | +50.209% | 32 | insignificant |
| 10 | Retired Egg | v | 0.0002 | 0.00028824 | +44.121% | 591 | insignificant |
| 11 | Unfortunate Eyelashes | v | 0.0025 | 0.00357573 | +43.029% | 26 | insignificant |
| 12 | Royal Egg | v | 0.0003 | 0.00042453 | +41.51% | 88 | insignificant |
| 13 | Endangered Egg | v | 0.0002 | 0.00028129 | +40.644% | 297 | insignificant |
| 14 | Mochi Meow | m | 0.025 | 0.01514689 | −39.412% | 18 | low |
| 15 | Cattuccino | fr | 0.006 | 0.00365065 | −39.156% | 508 | insignificant |

## Backtest in plain words

- Setup: one row per tracked key (pet Regular/Neon/Mega, item v) per weekly as-of date, label = did the list value move more than ±2% in the next 30 days. 25,064 rows across 8 as-of dates (2026-07-02 … 2026-08-20). Time split at 2026-08-13: train = first 6 dates (18,798 rows), test = last 2 dates (6,266 rows, outcomes measured to 2026-09-12 and 2026-09-19). Live predictions use a refit on all 25,064 rows.
- Base rates: flat 84.65%, up 12.34%, down 3.02%. 'Down' is rare, which is why the model can barely learn it.
- Accuracy: model 90.60% vs 'always flat' 84.65% (+5.95 pts) vs momentum rule ('repeat the last direction if updated in ≤ 14 days') 90.82%. The softmax does NOT beat simple momentum on raw accuracy — its edge is in ranking (probabilities) and in blending with the market layer, not in 3-way classification.
- Confusion matrix (rows = truth, cols = predicted flat/up/down): flat 5,130 / 170 / 4; up 237 / 534 / 2; down 103 / 73 / 13. Read: it catches 534 of 773 real raises (69% recall, 534/777 = 69% precision), but only 13 of 189 real drops (7% recall) and mislabels 73 real drops as raises.
- F1: up 0.689, down 0.125, macro-F1 0.589.
- Top-k precision (the numbers that matter for a 'buy list'): top-50 by P(up) → 36 hits (72%, mean P 98.8%); top-100 → 76 hits (76%, mean P 98.4%). Top-50 by P(down) → 29 hits (58%, mean P 46.9%); top-100 → 32 hits (32%, mean P 29.7%). So a shortlist of ~100 raise calls is right about 3 times in 4; the down list decays fast after the first 50.
- Calibration (P(up) bins on the test set): 0–0.2: 5,135 rows, mean P 2.68% vs 2.75% observed (well calibrated); 0.2–0.4: 297 rows, 28.96% vs 24.92%; 0.4–0.6: 136 rows, 49.30% vs 38.24%; 0.6–0.8: 218 rows, 71.20% vs 60.09%; 0.8–1.0: 480 rows, 92.17% vs 78.13%. Rule of thumb: when the dashboard says 90%+ odds, expect ~78%; when it says 70%, expect ~60%.
- Feature weights, up-vs-flat (standardised, from the full refit), ranked: is pet +0.973, demand +0.959, log10 value +0.795, last direction +0.336, change 30d +0.292, updates 30d +0.214, other-tier updates 30d +0.098, streak +0.028; negative: log10 value² −1.135, tier (0 reg/1 neon/2 mega) −1.086, days since update −0.480, updates 90d −0.261, change 7d −0.101; exactly 0: change 90d and has-90d-history (constant in the training window because the log starts 2026-06-02).
- Feature weights, down-vs-flat: log10 value +0.817, updates 30d +0.531, demand +0.344, other-tier updates +0.159, is pet +0.128, change 30d +0.087, change 7d +0.083; negative: tier −0.904, log10 value² −0.716, updates 90d −0.221, streak −0.155, days since update −0.128, last direction −0.062. Translation: drops happen to frequently-updated, mid-value Regulars; long positive streaks and a recent raise make a drop less likely.
- Typical move sizes (train medians, capped at ±25%, used for eHist): high +14.3% / −12.1% (672 ups vs 88 downs), highmid +14.0% / −12.1% (786/82), mid +18.2% / −12.5% (488/61), low +22.3% / −10.5% (281/67), insignificant +17.2% / −6.7% (80/16). Mean drop sizes are much larger than medians (high −33.8%, highmid −23.8%, mid −25.9%) — a few big cuts dominate.
- Why the model is so bullish on high tier: in the update log, raises were 46.7% of changes in June (1,264 up / 1,441 down), 78.5% in July (1,793/491), 82.3% in August (3,289/706) and 74.8% so far in September (1,363/460). High tier ran 82.4% raises in June, 82.6% July, 78.4% Aug, 74.7% Sep; highmid went 45.2% → 76.1% → 85.8% → 79.8%. The training window is entirely inside this bull run, so 'high value + High demand' ≈ 'goes up' is what the data taught it.

## Market-layer notes (listings 6h + completed trades)

- 1,489 items carry a market signal; 0 unknown names. Signal confidence saturates near 0.99 for anything with a few hundred sides (Unicorn Horn: 385 offers, 131 wants, 288/179 completed sides, overpay −1.3% on 390 sides, confidence 0.989).
- Most wanted (pressure, confidence ≥ 0.8): Royal Fairytale Egg +2.081 (overpaid +27.6% on 19 sides, asks +7.3%), Silly Duck +1.966 (+20.7%), Little Lamb +1.775 (+17.1% on 118), Garden Egg +1.639 (44 wants vs 4 offers), Candy Cane Snail +1.612, Nurse Shark +1.599, Patchy Bear +1.482, Chicken +1.466 (49 wants / 14 offers), Snowball Pug +1.42 (asks +11.0%), Unfortunate Eyelashes +1.403, Magic House Door +1.384, Gemstone Egg +1.373 (561 offers / 391 wants, 631 asks at +7.6%), Ghostly Cat +1.296, Bakeneko +1.267, Crystal Egg +1.256 (809 wants vs 161 offers; 900/1050 completed sides).
- Most dumped (negative pressure): Kiwi Kiwi −1.953 (52 offers / 2 wants, underpaid −14.1%), Koi Carp −1.807, Toucan −1.764 (45/0), Granny Wolf −1.76, General Sheepdog −1.724 (66/4), Muskrat −1.603, Black Rhino −1.539 (45/0), Clownfish −1.499, Golden Egg −1.459 (41/0), Princess Mare −1.441, Rubber Ducky −1.407 (99/1), Dragonfly −1.347 (underpaid −25.8%), Zebra −1.341, Ms. Muffet −1.316, Golden Unicorn −1.288.
- Sell / avoid list above 0.03 (by dumpScore): Undead Jousting Horse Neon 1.575 → 1.51 (P(down) 64.4%, implied −5.3% on 38; dumpScore 0.063), SSBD Backpack 0.0425 → 0.0405 (−15.7% on 15), Tuxedo Cat Mega 0.17 → 0.1625 (7 drops, −10.8% on 14), Silverback Gorilla Neon 0.275 → 0.265 (−52% in 30d), Tri-horned Treehopper Regular 0.055 → 0.053 and Mega 0.9 → 0.87 (14 consecutive drops, −41% in 30d), Alley Cat Mega 0.33 → 0.315 (−10.9% on 57), Haetae Mega 11.2 → 10.93 (P(down) 59.3%), Emperor Gorilla Regular/Neon/Mega (P(down) 55–63%, −29% in 30d), Red Dutch Guinea Pig FR 0.05 → 0.048 (11 drops, offered 128× vs wanted 8×).

## What a trader should do this week — 10 actions

- 1. Buy or hold Phantom Dragon FR (0.0625), Vampire Dragon FR (0.08) and Frost Fury FR (0.0375): the three highest flip scores (0.282 / 0.221 / 0.181), 94–97% odds, High demand, balanced books (58/61, 59/56, 99/45) and completed trades already clearing +13.2%, +6.1%, +2.9% over list. Target 0.0725 / 0.0895 / 0.041 in 30 days.
- 2. Take Diamond Unicorn Mega only at or under 0.1: traders pay 0.135 for it (+36.2% on 25 trades) and the model targets 0.12, but the board has cut it 6 times in a row and 8 are offered for every 1 wanted — buy the dip from sellers, do not chase asks.
- 3. Ride the momentum names with a stop: Ghost Bunny FR (18 straight raises, +131% in 90d, target 0.021), Zombie Wolf FR (19 raises, target 0.021), Sugar Axolotl FR (24 raises, target 0.1025), Orchid Butterfly Neon/Mega (27/29 raises, 96%/90% odds). Remember the calibration: a displayed 90%+ odds has historically hit ~78%, so scale positions, and exit on the first board cut (streak break is the strongest down feature).
- 4. For high-tier capital, prefer Cryptid FR (0.865 → 0.93, 389 completed trades imply +3.7%, 583 wanted vs 348 offered — the deepest book on the board) and Frostbite Bear Neon (1.12 → 1.205, +9.4% implied on 43 trades) over the pUp-99% legacy pets; accept a 28% P(down) on Frostbite Bear as the price of the premium.
- 5. Sell Fairy Bat Dragon Neon (0.51) and Mega (2.0) now: 99 and 64 completed trades clear 12.1% under list, 271/253 are offered vs 79/27 wanted, and the model calls both down (targets 0.5 / 1.945). Same logic, slightly weaker, for Peppermint Penguin Neon/Mega (−10.0% / −10.6% implied) and Strawberry Shortcake Bat Dragon Neon/Mega (−9.0% / −9.5%) — these ran 20–110% in 30 days and the market has stopped following.
- 6. Exit Undead Jousting Horse Neon (1.575, P(down) 64.4%), Haetae Mega (11.2, P(down) 59.3%), Emperor Gorilla in all three tiers (P(down) 55–63%, −29% in 30d) and Tri-horned Treehopper Regular/Mega (14 consecutive drops, −41% in 30d): these are the few higher-value rows where history AND market both point down.
- 7. Dump low-tier cats/dogs into any bid: Cattuccino (508 trades at −39%), Chihuahua (−26%, 6 drops), Kiwi Kiwi (−26%, 12 drops), Catte (offered 256× vs wanted 9×), Tuxedo Cat (7 drops), 2D Kitty, Puffer Fish (29 offered / 1 wanted). Expect the board to trim them 8–16% and nobody to pay list in the meantime.
- 8. Use cheap eggs and items as sweeteners at their market price, not list: Fairytale Egg clears at 0.00035 (list 0.0002, 1,943 trades), Retired Egg 0.0003, Throwback Egg 0.0002 (2× list), Paint Sealer 0.00085, Admin Abuse Egg 0.00055, Little Lamb 0.00635 (1.8× list on 140 trades), Silly Duck 0.02 (1.6×), Violet Butterfly 0.0268 (1.8×). Asking for them at list value in a trade is leaving 30–100% on the table; offering them at list is overpaying.
- 9. Do not chase the pUp-99% legacy high tiers (Frost Dragon FR/Neon, Owl, Parrot, Giraffe, Shadow Dragon, Bat Dragon FR, Balloon Unicorn): they have 100–400 completed trades each clearing 6–9% under list, and the blended move is only +2–3%. Hold what you own, but buying at list here has a negative expected edge once the market discount is applied.
- 10. Watch the 'market ahead of the board' names for the next value-board session (updates cluster 10:00–17:00 UTC): Lava Dragon FR (+11.9% on 37 trades, board flat), Jousting Horse FR/NFR/MFR (+12.3% / +11.4% / +9.5%), Nessie FR (+13.4%), Sheeeeep FR (+12.7%), Ballet Swan FR (+9.5% on 286 trades), Pet Handler Pro Certificate (+11.7% on 652 trades). Buying these at list before the board catches up is the cleanest arbitrage the data shows; conversely Royal Mistletroll FR (0.16, −15.5% on 19 trades after +88% in 30d) is the one to sell before the next cut.

## Caveats

- Read-only analysis; no files edited, no collectors run, no pushes. All numbers come from AMVGGEngine.build() on site/data.json as served at http://localhost:8765/ (collectedAt 2026-09-24T20:14:15Z) and are reported as computed (3-decimal rounding on percentages/scores).
- The backtest test set is only 2 weekly snapshots (as-of 2026-08-13 and 2026-08-20) — 6,266 rows but highly correlated; the whole 114-day window sits inside a bull run (raises were 78–82% of board changes in Jul–Aug), so the 'up' bias for high-value High-demand pets may not survive a market turn.
- The model does not beat the momentum baseline on 3-way accuracy (90.60% vs 90.82%); its value is in ranking and blending. It is overconfident in the top bins (92% displayed → 78% realised) and effectively cannot predict drops (F1-down 0.125; 73 real drops labelled 'up').
- Two features ('change 90d', 'has 90d history') are constant zero in training because the update log starts 2026-06-02; their weights are exactly 0 and 'change 90d' currently equals 'change 30d' in live features.
- The market layer clamps implied gaps to ±30% and weights by n/(n+4); sub-0.01 eggs/items therefore appear in the raise list with P(up) ≈ 0% purely on market evidence, and a +100% implied gap can still round to no change (Throwback Egg 0.0001 → 0.0001).
- Listings window is 6 hours (~16.9k listings) and completed trades come from trader profile pages (30-day meta window, 60-day store) — offer/want counts are a snapshot, not a daily average.
- In the monthly update-direction count, 936 update rows were skipped (prev == new or missing values). h.rows in the built model is a count, not the row array, so per-tier test accuracy could not be recomputed without re-running the backtest.
- The 'history bullish / market bearish' and 'market bullish / history flat' filters used here (P(up) ≥ 60% or ≤ 30%, ≥ 8 trades, gap thresholds ±5% / +8%, value ≥ 0.01) are analyst choices; the engine itself does not expose a disagreement score.

