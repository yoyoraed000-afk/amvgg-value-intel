# AMVGG Value Board analysis: 5,275 updates, 2 Jun – 24 Sep 2026

_Computed by an analysis agent on 2026-09-24/25 from the rolling store. Numbers are from that snapshot; the live dashboard is newer._

The public update log holds 5,275 records (10,827 tier value changes + 916 demand changes) covering 815 distinct items (325 pets, 490 non-pets) across 114 of 115 days. It is a pet-centric, momentum-driven board: 74% of pet tier moves are raises, the next move on the same item/tier repeats the previous direction 93-94% of the time, 126 item-tier series ran 20+ consecutive raises, and a Regular raise is undone within 30 days only 31% of the time. Updates are entered in short batches at 11:00-15:00 UTC (96% between 10:00 and 17:59, 89% of consecutive records less than 2 minutes apart), with a weekly Friday "bump session" that carries 30-50% of the week's raises. Neon and Mega move with Regular on the same day 90-93% of the time and in the same direction 99% of the time, at nearly identical percentage sizes. Three regimes are visible: a June recalibration (53% drops; 14 Jun 451 pet drops in two hours, 16 Jun 372 non-pet drops at median -25%), a July-August expansion (18-21% drops, pace peaking at 134 value rows/day in mid-August), and a September cooling (25% drops, pace down 46%, and the summer leaders Jekyll Hydra/Undead Jousting Horse/Cryptid rolling over in the last 7 days). 48% of catalogue items (58% of pets, nearly all with FR below 0.05) never appear in the log; the 325 logged pets carry 94% of total FR value. Non-pets behave differently: 66% of item moves are drops with a median size of 18.8%, versus 3-5% for pets.

## 1. Dataset at a glance

- Source: state/updates.json (5,275 records, ids unique, every record has both previous and new fields, all values numeric, none zero) and state/items.json (1,571 items: 781 Pets, 236 PetWear, 198 Vehicles, 87 Toys, 71 Stickers, 51 Food, 44 Eggs, 36 Houses, 35 Strollers, 32 Gifts).
- Window: 2026-06-02T12:03Z to 2026-09-24T15:28Z = 115 calendar days, 114 active (only one day with no update). Mean 46.3 records per active day, 94.1 tier value rows per calendar day.
- Expanded rows: 10,827 tier value changes (Regular 2,705, Neon 3,351, Mega 3,939, Item 832) of which 7,709 raises, 3,098 drops, 20 flat; plus 916 demand rows. meta.json's 11,743 = 10,827 + 916.
- Record kinds: 4,752 value-only, 319 value+demand, 202 demand-only, 2 with neither (Dragon 2026-08-17, Teleportation Potion 2026-08-20).
- Pet records by tiers changed together: 2,387 change all three tiers, 982 two, 1,702 one, 204 none (demand-only).
- Items touched: 815 of 1,571 (52%). Pets: 325 of 781. Updates per touched item: 513 once, 69 twice, 51 three-four, 47 five-nine, 135 ten-plus (median 1, p90 19).

## 2. Volume over time: weekly totals (ISO weeks, Monday start, UTC)

- Two June spikes are single-day events: week of 8 Jun (785 rows, 67% drops) is the 14 Jun pet devaluation; week of 15 Jun (864 rows, 489 items) is the 16 Jun non-pet recalibration.
- Volume builds through August: weeks of 10, 17 and 24 Aug are the three largest by value rows (940, 932, 1,127) with only 11-26% drops.
- September is cooling: 653 -> 569 -> 453 rows per week, drop share back up to 20-31%. The week of 21 Sep is partial (4 days).
- Value points moved over the whole window (sum of |new - prev|): Regular +14.11 raised / -4.14 dropped (net +9.97); Neon +44.73 / -13.71; Mega +191.70 / -72.74 (net +118.96); Item +15.91 / -12.85 (net +3.06).

| week_start | records | value_rows | raises | drops | drop_share% | demand_rows | distinct_items | active_days | busiest_day (records) |
|---|---|---|---|---|---|---|---|---|---|
| 2026-06-01 | 151 | 278 | 203 | 75 | 27 | 23 | 83 | 6 | 06-06 (35) |
| 2026-06-08 | 334 | 785 | 262 | 522 | 67 | 33 | 227 | 7 | 06-14 (180) |
| 2026-06-15 | 631 | 864 | 368 | 495 | 57 | 144 | 489 | 7 | 06-16 (422) |
| 2026-06-22 | 303 | 630 | 344 | 285 | 45 | 50 | 102 | 7 | 06-25 (62) |
| 2026-06-29 | 256 | 538 | 345 | 191 | 36 | 28 | 75 | 7 | 07-01 (51) |
| 2026-07-06 | 224 | 474 | 331 | 143 | 30 | 29 | 69 | 7 | 07-10 (44) |
| 2026-07-13 | 238 | 534 | 462 | 69 | 13 | 47 | 88 | 6 | 07-17 (67) |
| 2026-07-20 | 319 | 618 | 501 | 115 | 19 | 83 | 108 | 7 | 07-24 (72) |
| 2026-07-27 | 258 | 548 | 504 | 44 | 8 | 38 | 107 | 7 | 08-01 (97) |
| 2026-08-03 | 326 | 626 | 522 | 103 | 16 | 49 | 133 | 7 | 08-07 (120) |
| 2026-08-10 | 444 | 940 | 836 | 101 | 11 | 67 | 135 | 7 | 08-13 (152) |
| 2026-08-17 | 409 | 932 | 687 | 241 | 26 | 97 | 123 | 7 | 08-20 (68) |
| 2026-08-24 | 465 | 1127 | 901 | 226 | 20 | 32 | 154 | 7 | 08-28 (110) |
| 2026-08-31 | 292 | 653 | 470 | 181 | 28 | 66 | 79 | 7 | 09-01 (52) |
| 2026-09-07 | 285 | 569 | 453 | 116 | 20 | 63 | 141 | 7 | 09-11 (99) |
| 2026-09-14 | 214 | 453 | 342 | 111 | 25 | 44 | 89 | 7 | 09-19 (68) |
| 2026-09-21 (partial, 4d) | 126 | 258 | 178 | 80 | 31 | 23 | 69 | 4 | 09-22 (58) |

## 3. Monthly totals and pace by two-week block

- June: 1,490 records, 2,708 rows, 53% drops, 694 distinct items (the recalibration month). July: 1,101 records, 21% drops, only 142 items. August: 1,814 records, 4,003 rows, 18% drops, 221 items. September (to the 24th): 870 records, 25% drops, 190 items.
- Pace peaked at 134 value rows/day (108 raises/day) in 11-24 Aug and fell to 72 rows/day in 8-21 Sep (-46%). Distinct items per day fell from 37 (mid-June, driven by the mass events) to 6-13 thereafter: the board concentrates daily work on a small hot list.

| 2-week block start | records/day | value rows/day | raises/day | drops/day | distinct items/day |
|---|---|---|---|---|---|
| 2026-06-02 | 37.9 | 82.6 | 38.1 | 44.4 | 18.5 |
| 2026-06-16 | 65.6 | 104.6 | 48.7 | 55.8 | 36.9 |
| 2026-06-30 | 34.3 | 72.6 | 48.3 | 24.2 | 6.4 |
| 2026-07-14 | 39.7 | 81.2 | 69.4 | 11.5 | 8.8 |
| 2026-07-28 | 45.4 | 91.0 | 79.4 | 11.5 | 10.0 |
| 2026-08-11 | 59.7 | 134.0 | 107.9 | 25.6 | 12.9 |
| 2026-08-25 | 51.9 | 120.4 | 93.3 | 26.9 | 11.1 |
| 2026-09-08 | 35.0 | 72.1 | 55.4 | 16.8 | 11.4 |
| 2026-09-22 (2 days) | 47.6 | 96.2 | 66.8 | 29.4 | 30.3 |

## 4. Hour-of-day pattern (UTC)

- 96.1% of records land 10:00-17:59 UTC; 66.2% in 12:00-15:59; the 13:00 hour alone carries 29.5%. Only 0.5% of records fall 00:00-08:59.
- Per active day the first update lands at a median 12.8h UTC (p10 11.1, p90 14.7) and the last at 13.9h (p10 11.9, p90 18.5). Session length is short: median 0.6h, p90 6.2h.
- Entries are batched: the gap between consecutive records on the same day is median 0.4 min, p90 2.1 min; 89% are 2 minutes or less apart.
- Direction by hour is not uniform even after removing the two June mass-drop days: the 10:00 hour is drop-heavy (41% drops of 347 rows), 11:00 is the raise session (15% drops of 1,906 rows, this is where the Friday bump lands), 12:00-15:00 run 22-25% drops, and the rare 21:00-22:00 evening sessions are 96% raises (269 rows).
- The 16:00-17:00 drop shares in the raw table (87-96%) are almost entirely 16 Jun (non-pet recalibration entered 16:00-17:59) and 14 Jun (pets entered 09:00-10:59).

| hour UTC | records | share% | raises | drops | drop_share% (raw) |
|---|---|---|---|---|---|
| 09 | 55 | 1.0 | 32 | 114 | 78 |
| 10 | 292 | 5.5 | 203 | 481 | 70 |
| 11 | 881 | 16.7 | 1616 | 290 | 15 |
| 12 | 952 | 18.0 | 1461 | 466 | 24 |
| 13 | 1558 | 29.5 | 2467 | 823 | 25 |
| 14 | 636 | 12.1 | 1041 | 339 | 25 |
| 15 | 346 | 6.6 | 565 | 161 | 22 |
| 16 | 153 | 2.9 | 18 | 124 | 87 |
| 17 | 253 | 4.8 | 11 | 244 | 96 |
| 21 | 24 | 0.5 | 61 | 3 | 5 |
| 22 | 88 | 1.7 | 196 | 9 | 4 |
| all other hours | 38 | 0.7 | 38 | 44 | - |

## 5. Weekday pattern and the weekly 'bump day'

- Tuesday (19.7%) and Friday (16.9%) are the heaviest weekdays; Monday and Wednesday the lightest (35 and 34 records per calendar day). Tuesday's 45% drop share and Sunday's 48% are inflated by 16 Jun (Tue) and 14 Jun (Sun); excluding those, Friday is the clear raise day (10% drops).
- Each week has one dominant raise session that carries 17-49% of the week's raises: it fell on Friday in 9 of 17 weeks (Thu 2, Tue 2, Sat 2, Wed 1, Sun 1). The largest: 13 Aug (Thu) 338 raises, 7 Aug (Fri) 258, 28 Aug (Fri) 223, 1 Aug (Sat) 215, 11 Sep (Fri) 190, 24 Jul (Fri) 172, 17 Jul (Fri) 166. Eight of these sessions had zero or one drop.
- Bump sessions are entered in a single hour (typically 11:00-12:00 UTC) and touch 44-120 distinct items.

| weekday | records | share% | records per calendar day | raises | drops | drop_share% |
|---|---|---|---|---|---|---|
| Mon | 559 | 10.6 | 34.9 | 857 | 320 | 27 |
| Tue | 1038 | 19.7 | 61.1 | 937 | 753 | 45 (16 Jun effect) |
| Wed | 581 | 11.0 | 34.2 | 840 | 344 | 29 |
| Thu | 690 | 13.1 | 40.6 | 1222 | 316 | 21 |
| Fri | 894 | 16.9 | 55.9 | 1832 | 199 | 10 |
| Sat | 754 | 14.3 | 47.1 | 1151 | 367 | 24 |
| Sun | 759 | 14.4 | 47.4 | 870 | 799 | 48 (14 Jun effect) |

## 6. Raises vs drops by category and by tier

- Pets are raised 74% of the time in every tier (Regular 74.9%, Neon 74.6%, Mega 73.6%); non-pet items are dropped 66% of the time.
- Non-pet drop dominance is mostly the 16 Jun recalibration: Vehicles 97% drops in June vs 0% in Jul-Aug; Toys 94% in June vs 0% in July; Stickers 100% in June. After June, PetWear stays mixed (40-47% drops) while Strollers/Food/Houses are almost only ever cut.
- Drop share by tier and month (non-flat rows): Regular 48% (Jun) -> 20% (Jul) -> 16% (Aug) -> 21% (Sep); Neon 48/22/14/25; Mega 43/22/18/28; Item 88/20/42/41.

| category / tier | rows | raises | drops | flat | raise% | drop% | items touched |
|---|---|---|---|---|---|---|---|
| Pets | 9995 | 7427 | 2549 | 19 | 74.3 | 25.5 | 317 |
| PetWear | 376 | 171 | 205 | 0 | 45.5 | 54.5 | 133 |
| Vehicles | 136 | 16 | 120 | 0 | 11.8 | 88.2 | 122 |
| Toys | 111 | 45 | 66 | 0 | 40.5 | 59.5 | 52 |
| Eggs | 49 | 33 | 16 | 0 | 67.3 | 32.7 | 21 |
| Stickers | 44 | 5 | 39 | 0 | 11.4 | 88.6 | 44 |
| Food | 38 | 4 | 34 | 0 | 10.5 | 89.5 | 31 |
| Strollers | 34 | 0 | 33 | 1 | 0.0 | 97.1 | 26 |
| Houses | 31 | 2 | 29 | 0 | 6.5 | 93.5 | 31 |
| Gifts | 13 | 6 | 7 | 0 | 46.2 | 53.8 | 11 |
| tier: Regular (FR) | 2705 | 2027 | 664 | 14 | 74.9 | 24.5 | - |
| tier: Neon (NFR) | 3351 | 2499 | 847 | 5 | 74.6 | 25.3 | - |
| tier: Mega (MFR) | 3939 | 2901 | 1038 | 0 | 73.6 | 26.4 | - |
| tier: Item (v) | 832 | 282 | 549 | 1 | 33.9 | 66.0 | - |

## 7. Typical move sizes (median / p90) by tier

- Pet raises are small and granular: median +3.2% Regular, +2.4% Neon, +2.2% Mega; 73-84% of pet raises are 5% or less. Drops are larger: median -5.0% / -4.3% / -3.7%, p90 -10%.
- Item (non-pet) moves are a different animal: raise median +2.9% but p90 +25%; drop median -18.8%, p75 -30%, p90 -40%, and 42% of item drops exceed 20%.
- Size scales inversely with value (pet FR): prev value below 0.05 -> raise median +5.56%, drop -5.88%, 36% of moves are drops; 0.05-0.2 -> +3.13% / -4.00%, 20% drops; 0.2-1 -> +1.59% / -3.03%, 10% drops; 1-5 -> +1.38% / -1.87%, 16% drops; 5+ (15 moves) -> +0.59% / -1.43%.
- The 30 most-updated pets move in finer steps (median |FR step| 2.63%) than everything else (5.00%).
- Size buckets across all 10,807 non-flat rows: 0-2.5%: 3,927 raises / 629 drops; 2.5-5%: 2,222 / 897; 5-10%: 1,139 / 868; 10-20%: 289 / 422; 20-50%: 107 / 263; over 50%: 25 / 19.
- Non-pet categories: PetWear raise median 2.5% (p90 17.9%), drop 12.5% (p90 33%); Vehicles drop 25% (p90 45%); Toys drop 22% (p90 47%); Houses drop 37.5% (p90 65%); Food drop 25%; Stickers drop 20%; Strollers drop 13.3%.

| tier | dir | n | median % | p75 % | p90 % | max % | median abs (points) | p90 abs | max abs | share <= 5% | share > 20% |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Regular | up | 2027 | 3.2 | 5.3 | 8.0 | 85 | 0.0025 | 0.015 | 0.325 | 73% | 2% |
| Regular | down | 664 | 5.0 | 6.7 | 10.0 | 41 | 0.0025 | 0.010 | 0.275 | 50% | 2% |
| Neon | up | 2499 | 2.4 | 4.3 | 7.1 | 100 | 0.0075 | 0.040 | 0.70 | 82% | 1% |
| Neon | down | 847 | 4.3 | 7.1 | 10.0 | 43 | 0.005 | 0.035 | 0.60 | 57% | 2% |
| Mega | up | 2901 | 2.2 | 3.8 | 6.7 | 100 | 0.025 | 0.15 | 1.6 | 84% | 1% |
| Mega | down | 1038 | 3.7 | 6.5 | 10.0 | 43 | 0.025 | 0.20 | 1.4 | 64% | 2% |
| Item | up | 282 | 2.9 | 7.7 | 25.0 | 100 | 0.005 | 0.075 | 3.0 | 66% | 12% |
| Item | down | 549 | 18.8 | 30.0 | 40.0 | 78 | 0.002 | 0.025 | 1.6 | 10% | 42% |

## 8. Most-updated items

- The hot list is updated almost daily: Cryptid was touched on 91 of 114 active days, Jekyll Hydra and Werewolf on 84, Giant Panda 81. Longest runs of consecutive calendar days with an update: Cryptid 33 days (from 20 Aug), Bat Dragon 32 (from 8 Jun), Fairy Bat Dragon 29, Peppermint Penguin 29, Sugar Axolotl 25, Undead Jousting Horse 24, Blazing Lion 24, Giraffe 24. 186 of 815 touched items were updated on 2+ consecutive days at least once.
- Two pets have never been dropped in 118 tier moves each: Chocolate Chip Bat Dragon (0.14 -> 0.245) and Strawberry Shortcake Bat Dragon (0.155 -> 0.25). Silverback Gorilla is the only top-25 pet with more drops than raises (94 vs 68).
- Most-updated non-pets: Candy Cannon (Toys) 43 records (27 up / 15 down, now 1.3), Strawberry Cupcake Shoes 23, SSBD Sunnies 22, Strawberry Plushie Rider 19, Panda Cap 18 (now 7.0), Queen Bee Slippers 18 (5 up / 13 down), Angel Wings 17 (all raises), Hive Backpack 15 (all drops), Halo 15 (all raises), Buzzing Honeypot Hat 15 (all drops), Rainbow Maker 12 (all raises), Neon Black Scooter (Vehicles) 10 (all raises, now 1.8).

| pet | records | tier value rows | distinct days | raises | drops | first | last | FR at first prev | FR now |
|---|---|---|---|---|---|---|---|---|---|
| Cryptid | 92 | 181 | 91 | 141 | 40 | 06-05 | 09-24 | 0.56 | 0.865 |
| Jekyll Hydra | 85 | 180 | 84 | 161 | 19 | 06-06 | 09-24 | 0.20 | 0.50 |
| Werewolf | 85 | 171 | 84 | 141 | 30 | 06-02 | 09-22 | 0.0675 | 0.1975 |
| Giant Panda | 83 | 180 | 81 | 160 | 20 | 06-04 | 09-11 | 0.61 | 1.20 |
| Blazing Lion | 82 | 167 | 77 | 162 | 5 | 06-02 | 09-24 | 0.415 | 1.10 |
| Undead Jousting Horse | 79 | 170 | 78 | 149 | 21 | 06-09 | 09-24 | 0.115 | 0.595 |
| Haetae | 78 | 153 | 77 | 140 | 13 | 06-05 | 09-23 | 0.565 | 0.83 |
| Shadow Dragon | 75 | 152 | 72 | 112 | 40 | 06-02 | 09-11 | 2.56 | 3.72 |
| Giraffe | 74 | 119 | 73 | 101 | 18 | 06-05 | 09-11 | 1.76 | 2.55 |
| Bat Dragon | 67 | 149 | 66 | 103 | 46 | 06-02 | 09-11 | 4.425 | 5.125 |
| Tortoiseshell Guinea Pig | 63 | 175 | 63 | 134 | 40 | 06-02 | 09-13 | 0.0825 | 0.1375 |
| Orchid Butterfly | 63 | 141 | 63 | 121 | 20 | 06-05 | 09-12 | 0.305 | 0.67 |
| Peppermint Penguin | 61 | 148 | 61 | 133 | 15 | 06-19 | 09-23 | 0.1175 | 0.2025 |
| Silverback Gorilla | 60 | 162 | 57 | 68 | 94 | 06-20 | 09-24 | 0.03 | 0.075 |
| African Wild Dog | 59 | 92 | 58 | 87 | 5 | 06-02 | 09-11 | 0.69 | 0.865 |
| Chocolate Chip Bat Dragon | 58 | 118 | 57 | 118 | 0 | 06-02 | 09-24 | 0.14 | 0.245 |
| Jousting Horse | 57 | 147 | 55 | 120 | 27 | 06-18 | 09-22 | 0.0135 | 0.0475 |
| Frostbite Bear | 56 | 157 | 55 | 100 | 57 | 06-02 | 09-24 | 0.0425 | 0.285 |
| Pirate Ghost Capuchin Monkey | 55 | 150 | 53 | 112 | 36 | 06-25 | 09-11 | 0.035 | 0.095 |
| Royal Mistletroll | 55 | 142 | 55 | 118 | 24 | 06-21 | 09-24 | 0.03 | 0.16 |

## 9. Streaks and momentum

- Up-streaks are extraordinarily long: 126 of 751 up-streaks (17%) ran 20+ consecutive raises; only 105 (14%) were single raises. Down-streaks are short: 805 of 1,247 (65%) are a single drop and only 5 exceed 15.
- Momentum per next move (same item and tier): P(raise after raise) 97% Regular/Neon, 96% Mega, 95% Item; P(drop after drop) 83-84% pets, 93% items; overall direction persistence 93-94%. Median spacing between moves is 1 day for pets, 4 days for items.
- Continuation within a horizon (moves in the last 30 days excluded): a Regular raise is followed by another raise within 7 days 79% of the time and within 30 days 95% (Neon 86% / 96%, Mega 89% / 96%, Item 55% / 75%). A Regular drop is followed by another drop within 30 days 64% (Neon 65%, Mega 70%, Item 20%).
- Reversal within a horizon: a Regular raise sees at least one opposite move within 7/14/30 days 13% / 21% / 31% (Neon 13/23/36%, Mega 15/29/47%, Item 8/21/30%). Drops are stickier: Regular 5/11/20%, Neon 6/11/25%, Mega 12/18/31%, Item 0/3/8%. Mega is the noisiest tier (nearly half of Mega raises get some counter-move within 30 days, usually a small trim).
- Longest up-streaks: Jekyll Hydra Neon 50 raises (0.58 -> 1.425, 12 Jun - 12 Sep), Undead Jousting Horse Neon 47 (0.45 -> 1.775) and Regular 45 (0.115 -> 0.67, +483%), Sugar Axolotl Mega 46 (0.45 -> 1.525, still active), Blazing Lion Neon 46 (1.425 -> 4.125), Chocolate Chip Bat Dragon Mega 46 (1.3 -> 3.15, active), Strawberry Shortcake Bat Dragon Mega 46 (1.325 -> 2.8, active), Jousting Horse Mega 45 (0.22 -> 1.1, +400%), Blazing Lion Regular 45 (0.415 -> 1.1, active), Blazing Lion Mega 44 (6.4 -> 16.4 in 56 days), Fairy Bat Dragon Mega 42 (0.725 -> 2.0, active).
- Longest down-streaks: Sushi Penguin Mega and Neon 26 drops each (0.55 -> 0.14, 0.1325 -> 0.035, 8 Jun - 23 Jul, -74%), Regular 21 (0.0325 -> 0.009); Velocirooster Neon/Mega 16 (-41%); Mermicorn Mega 16 (2.175 -> 1.675); Buzzing Honeypot Hat 15 (3.5 -> 0.73, 9-21 Aug), Hive Backpack 15 (1.3 -> 0.36), Candy Cannon 15 (1.975 -> 1.3); Tri-horned Treehopper all tiers 14 (-62%, 16 Aug - 9 Sep); Tortoiseshell Guinea Pig Mega/Neon 14 (-42%, 6 Aug - 1 Sep).

| tier | move pairs | P(up after up) | P(down after down) | P(same direction) | median days between moves | raise reversed within 30d | drop reversed within 30d |
|---|---|---|---|---|---|---|---|
| Regular | 2415 | 97% (n=1892) | 83% (n=523) | 94% | 1.1 | 31% | 20% |
| Neon | 3034 | 97% (n=2363) | 84% (n=671) | 94% | 1.0 | 36% | 25% |
| Mega | 3625 | 96% (n=2768) | 83% (n=857) | 93% | 1.0 | 47% | 31% |
| Item | 361 | 95% (n=212) | 93% (n=149) | 94% | 4.1 | 30% | 8% |

## 10. Biggest movers: 7-day window (17-24 Sep), FR for pets / v for items

- 85 series changed net in the last 7 days: 64 up, 21 down. Aggregate +0.52 FR/value points raised vs -0.26 dropped; median net move of changed series +2.7% (p10 -9.5%, p90 +13.3%).
- Notable: the summer leaders are rolling over. Jekyll Hydra (-11.5%), Undead Jousting Horse (-11.2%), Cryptid (-8.0%) and Jousting Horse (-9.5%) all posted their first net weekly declines after 40-50-move up-streaks.
- Tiny-value pets excluded from the % table (start below 0.05) but worth noting: 2D Doggy 0.028 -> 0.02 (-28.6%), Ballet Swan 0.045 -> 0.0375 (-16.7%), Spring Bunny Feet (PetWear) 0.013 -> 0.011 (-15.4%), Unicorn Plush (Toys) 0.0175 -> 0.015 (-14.3%).

| rank | up by % (start >= 0.05) | up by absolute points | down by % (start >= 0.05) | down by absolute points |
|---|---|---|---|---|
| 1 | Frost Unicorn 0.095 -> 0.1225 (+28.9%, 5 upd) | Neon Black Scooter (Vehicles) 1.75 -> 1.8 (+0.05) | Jekyll Hydra 0.565 -> 0.5 (-11.5%) | Undead Jousting Horse 0.67 -> 0.595 (-0.075) |
| 2 | Fairy Bat Dragon 0.145 -> 0.175 (+20.7%, 7 upd) | Frostbite Bear 0.2475 -> 0.285 (+0.0375) | Undead Jousting Horse 0.67 -> 0.595 (-11.2%) | Cryptid 0.94 -> 0.865 (-0.075) |
| 3 | Royal Mistletroll 0.135 -> 0.16 (+18.5%, 7 upd) | Fairy Bat Dragon (+0.03) | Jousting Horse 0.0525 -> 0.0475 (-9.5%) | Jekyll Hydra (-0.065) |
| 4 | Frostbite Bear 0.2475 -> 0.285 (+15.2%) | Frost Unicorn (+0.0275) | Silverback Gorilla 0.0825 -> 0.075 (-9.1%) | 2D Doggy 0.028 -> 0.02 (-0.008) |
| 5 | Sea Slug 0.0575 -> 0.065 (+13.0%) | Royal Mistletroll (+0.025) | Cryptid 0.94 -> 0.865 (-8.0%) | Silverback Gorilla (-0.0075) |
| 6 | Candicorn 0.0625 -> 0.07 (+12.0%) | Strawberry Shortcake Bat Dragon 0.2275 -> 0.25 (+0.0225) | Cherry-On-Top (PetWear) 0.1975 -> 0.195 (-1.3%) | Ballet Swan 0.045 -> 0.0375 (-0.0075) |
| 7 | Border Collie 0.0625 -> 0.07 (+12.0%) | Chocolate Chip Bat Dragon 0.2225 -> 0.245 (+0.0225) | - | Jousting Horse (-0.005) |
| 8 | Chocolate Chip Bat Dragon (+10.1%) | Peppermint Penguin 0.1875 -> 0.2025 (+0.015) | - | Unicorn Plush (Toys) 0.0175 -> 0.015 (-0.0025) |

## 11. Biggest movers: 30-day window (25 Aug - 24 Sep)

- 194 series changed net: 134 up, 60 down. Aggregate +5.88 points raised vs -0.66 dropped; median net move +6.3% (p10 -25.0%, p90 +45.5%). 92 tiny-value series (start below 0.05) are excluded from the % columns.
- Mega tier, 30 days, by absolute points: up Orchid Butterfly 8.65 -> 10.5 (+1.85), Royal Mistletroll 1.4 -> 2.625 (+1.225, +87.5%), Blazing Lion 16 -> 17.2 (+1.2), Haetae 10.1 -> 11.2 (+1.1), Fairy Bat Dragon 0.95 -> 2.0 (+1.05, +110%); down Giant Panda 20 -> 18.65 (-1.35), Silverback Gorilla 2.15 -> 1.08 (-1.07, -49.8%), Strawberry Tortle 3.45 -> 2.525 (-0.925), Giraffe 16.8 -> 15.95 (-0.85), Shadow Dragon 19 -> 18.2 (-0.8).

| rank | up by % (start >= 0.05) | up by absolute points | down by % (start >= 0.05) | down by absolute points |
|---|---|---|---|---|
| 1 | Fairy Bat Dragon 0.0925 -> 0.175 (+89.2%, 25 upd) | Panda Cap (PetWear) 4.5 -> 7.0 (+2.5) | Silverback Gorilla 0.16 -> 0.075 (-53.1%, 16 upd) | Candy Cannon (Toys) 1.45 -> 1.3 (-0.15) |
| 2 | Royal Mistletroll 0.085 -> 0.16 (+88.2%, 18 upd) | Neon Black Scooter (Vehicles) 1.35 -> 1.8 (+0.45) | Tri-horned Treehopper 0.095 -> 0.055 (-42.1%) | Silverback Gorilla (-0.085) |
| 3 | Undead Jousting Horse 0.35 -> 0.595 (+70.0%, 23 upd) | Undead Jousting Horse (+0.245) | Strawberry Tortle 0.2 -> 0.14 (-30.0%) | Giant Panda 1.26 -> 1.2 (-0.06) |
| 4 | Panda Cap (PetWear) 4.5 -> 7.0 (+55.6%) | Haetae 0.65 -> 0.83 (+0.18) | Emperor Gorilla 0.1375 -> 0.0975 (-29.1%, 17 upd) | Strawberry Tortle (-0.06) |
| 5 | Werewolf 0.13 -> 0.1975 (+51.9%, 21 upd) | Jekyll Hydra 0.335 -> 0.5 (+0.165) | Moonbeam Peacock 0.1 -> 0.075 (-25.0%) | Emperor Gorilla (-0.04) |
| 6 | Jekyll Hydra 0.335 -> 0.5 (+49.3%, 22 upd) | Cryptid 0.73 -> 0.865 (+0.135) | Pirate Ghost Capuchin Monkey 0.1225 -> 0.095 (-22.4%) | Tri-horned Treehopper (-0.04) |
| 7 | Grim Dragon 0.145 -> 0.21 (+44.8%) | Orchid Butterfly 0.57 -> 0.67 (+0.1) | Tortoiseshell Guinea Pig 0.16 -> 0.1375 (-14.1%) | Pirate Ghost Capuchin Monkey (-0.0275) |
| 8 | Frost Unicorn 0.0875 -> 0.1225 (+40.0%) | Blazing Lion 1.015 -> 1.1 (+0.085) | Candy Cannon (Toys) 1.45 -> 1.3 (-10.3%) | Moonbeam Peacock (-0.025) |
| 9 | Chocolate Chip Bat Dragon 0.1775 -> 0.245 (+38.0%) | Fairy Bat Dragon (+0.0825) | Quad Stroller 0.05 -> 0.045 (-10.0%) | 2D Doggy 0.0425 -> 0.02 (-0.0225) |
| 10 | Strawberry Shortcake Bat Dragon 0.1825 -> 0.25 (+37.0%) | Bat Dragon 5.05 -> 5.125 (+0.075) | Jousting Horse 0.05 -> 0.0475 (-5.0%) | Tortoiseshell Guinea Pig (-0.0225) |

## 12. Biggest movers: 90-day window (26 Jun - 24 Sep)

- 272 series changed net: 198 up, 74 down, 3 round trips. Aggregate +15.94 points raised vs -5.32 dropped; median net move +15.4% (p10 -22.2%, p90 +100%). Note this window starts after the 14/16 June mass drops, so it shows the expansion regime only.
- Mega tier, 90 days, by absolute points: up Blazing Lion 6.4 -> 17.2 (+10.8, +169%), Giant Panda 9.9 -> 18.65 (+8.75), Haetae 6.95 -> 11.2 (+4.25), Orchid Butterfly 6.4 -> 10.5 (+4.1), Frostbite Bear 0.6 -> 4.45 (+3.85, +642%); down Strawberry Tortle 6.0 -> 2.525 (-3.475, -58%), Kiwi Kiwi 1.05 -> 0.18 (-0.87, -83%), 2D Doggy 0.8 -> 0.325 (-0.475), Mermicorn 2.175 -> 1.725 (-0.45), Bat Dragon 37.6 -> 37.25 (-0.35).
- The big non-pet losers are one event: the three 'Bee' PetWear items (Buzzing Honeypot Hat, Hive Backpack, Queen Bee Slippers) were cut in 15-18 steps between 9 and 21 Aug (-66% to -79%).

| rank | up by % (start >= 0.05) | up by absolute points | down by % (start >= 0.05) | down by absolute points |
|---|---|---|---|---|
| 1 | Royal Mistletroll 0.0525 -> 0.16 (+204.8%, 34 upd) | Panda Cap (PetWear) 3.75 -> 7.0 (+3.25) | Kiwi Kiwi 0.06 -> 0.011 (-81.7%, 12 upd) | Buzzing Honeypot Hat (PetWear) 3.5 -> 0.73 (-2.77) |
| 2 | Undead Jousting Horse 0.215 -> 0.595 (+176.7%, 39 upd) | Rainbow Rattle (Toys) 8.1 -> 10.15 (+2.05) | Buzzing Honeypot Hat 3.5 -> 0.73 (-79.1%, 15 upd) | Hive Backpack (PetWear) 1.3 -> 0.36 (-0.94) |
| 3 | Grim Dragon 0.085 -> 0.21 (+147.1%, 34 upd) | Neon Black Scooter (Vehicles) 1.125 -> 1.8 (+0.675) | Hive Backpack 1.3 -> 0.36 (-72.3%) | Queen Bee Slippers (PetWear) 1.3 -> 0.44 (-0.86) |
| 4 | Fairy Bat Dragon 0.0725 -> 0.175 (+141.4%, 32 upd) | Blazing Lion 0.465 -> 1.1 (+0.635) | Queen Bee Slippers 1.3 -> 0.44 (-66.2%, 18 upd) | Bat Dragon 5.35 -> 5.125 (-0.225) |
| 5 | Blazing Lion 0.465 -> 1.1 (+136.6%, 38 upd) | Shadow Dragon 3.15 -> 3.72 (+0.57) | Strawberry Tortle 0.35 -> 0.14 (-60.0%) | Strawberry Tortle (-0.21) |
| 6 | Strawberry Cupcake Shoes (PetWear) 0.41 -> 0.95 (+131.7%) | Strawberry Cupcake Shoes (+0.54) | Mermicorn 0.185 -> 0.155 (-16.2%) | Kiwi Kiwi (-0.049) |
| 7 | Jekyll Hydra 0.245 -> 0.5 (+104.1%, 38 upd) | Giant Panda 0.66 -> 1.2 (+0.54) | Quad Stroller 0.05 -> 0.045 (-10.0%) | Mermicorn (-0.03) |
| 8 | SSBD Sunnies (PetWear) 0.41 -> 0.81 (+97.6%) | Candy Cannon (Toys) 0.875 -> 1.3 (+0.425) | Magic Girl Wings (PetWear) 0.15 -> 0.14 (-6.7%) | 2D Doggy 0.0475 -> 0.02 (-0.0275) |
| 9 | Black-Chested Pheasant 0.0525 -> 0.1025 (+95.2%) | SSBD Sunnies (+0.4) | Bat Dragon 5.35 -> 5.125 (-4.2%, 24 upd) | Sushi Penguin 0.0225 -> 0.009 (-0.0135) |
| 10 | Monkey King 0.11 -> 0.21 (+90.9%) | Giraffe 2.16 -> 2.55 (+0.39) | Water Walking Potion (Food) 0.25 -> 0.24 (-4.0%) | Mono-Moped (Vehicles) 0.0325 -> 0.02 (-0.0125) |

## 13. How Neon and Mega move with Regular (pets, unit = pet-day)

- 4,167 pet-days had at least one tier move. All three tiers moved together on 56.6% of them; Neon+Mega without Regular 19.6%; Mega alone 16.2%; Regular alone 3.7%; Regular+Neon 2.6%; Regular+Mega 0.9%; Neon alone 0.4%.
- Conditional on Regular moving, Neon moved the same day 93% (2,467 of 2,659) and Mega 90%. Conditional on Mega moving, Regular moved only 62% and Neon 82%: Mega is adjusted more often on its own.
- Direction agreement when both moved: Neon vs Regular 99.8%, Mega vs Regular 98.8%, Mega vs Neon 99.4%. Percentage sizes are near-identical: Neon%/Regular% median 0.98 (p25 0.71, p75 1.24); Mega%/Regular% median 0.96 (p25 0.61, p75 1.25).
- Current multiples across 781 pets: NFR/FR median 2.00 (p10 1.93, p90 4.03); MFR/FR median 7.5 (p10 4.0, p90 16.25); MFR/NFR median 3.75 (p10 2.0, p90 4.05).
- Lead/lag: after a Mega-only day (674 cases) Regular moved within 7/14/30 days 69% / 84% / 90%, but only 77% of those follow-ups were in the same direction, and the 30-day base rate for any pet-day is already 87%, so a lone Mega move is a weak lead. After Neon+Mega without Regular (817 cases): 73% / 80% / 86%, 94% same direction. After a Regular-only day (153 cases) Neon or Mega followed within 7/14/30 days only 39% / 51% / 58%.

| given tier A moved | pet-days | Regular moved too | Neon moved too | Mega moved too |
|---|---|---|---|---|
| Regular | 2659 | - | 93% (2467) | 90% (2396) |
| Neon | 3301 | 75% (2467) | - | 96% (3174) |
| Mega | 3887 | 62% (2396) | 82% (3174) | - |

## 14. Demand changes over time

- 916 demand rows in 521 records; 319 records changed value and demand together, 202 were demand-only. Where value and demand changed in the same record and tier (481 cases) the directions agree 96%: demand upgrades coincide with raises rather than lead them.
- Net direction by month: June -124 (62 up / 186 down; 121 of the 253 rows were Item demand cuts on 16 Jun), July +21, August +10, September -26 (81 up / 107 down).
- Transitions: High -> Medium 390 (42.6%), Medium -> High 353 (38.5%), Medium -> Low 124 (13.5%), Low -> Medium 42 (4.6%), Low -> High 1, plus 5 no-op rows (Low -> Low 3, High -> High 2) and one 'Hig' typo. Pet tiers are balanced (Regular 109 up / 109 down, Neon 131/132, Mega 143/141); Items are 13 up / 133 down.
- Most demand-flipped: Frostbite Bear 30 changes, Frost Unicorn 23, Royal Mistletroll 21, Silverback Gorilla 21, Pirate Ghost Capuchin Monkey 18, Christmas Pudding Pup 18, Emperor Gorilla 15, Grim Dragon 14, Undead Jousting Horse 14, Winged Tiger 12.
- Current labels (items.json): pets FR Low 499 / Medium 221 / High 61; NFR 463 / 276 / 42; MFR 336 / 408 / 37. Vehicles 164 Low / 34 Medium / 0 High; PetWear 128 / 95 / 13; Toys 49 / 28 / 10; Stickers 36 / 35 / 0.
- Raise share of the last-90-day moves by the item's CURRENT demand label: High 89% raises (3,922 moves), Medium 66% (6,368), Low 3% (517). Strong separation, but the label is today's, so it partly encodes the outcome (leaky as a backtest feature).

| month | demand rows | upgrades | downgrades | net | Regular | Neon | Mega | Item | distinct items |
|---|---|---|---|---|---|---|---|---|---|
| 2026-06 | 253 | 62 | 186 | -124 | 33 | 49 | 50 | 121 | 163 |
| 2026-07 | 203 | 112 | 91 | +21 | 46 | 72 | 84 | 1 | 57 |
| 2026-08 | 272 | 141 | 131 | +10 | 80 | 83 | 88 | 21 | 78 |
| 2026-09 | 188 | 81 | 107 | -26 | 60 | 60 | 62 | 6 | 62 |

## 15. Time between updates and staleness

- Gaps between an item's distinct update days (4,369 gaps): median 1 day, p25 1, p75 3, p90 8; 89% within 7 days, 95% within 14, 97% within 30. This is dominated by the hot pets that are touched daily.
- Per item (299 items with 2+ update days) the median gap is 2 days (p25 1, p75 11). Pets: median 1 day (p75 2, p90 7) at every value band, from FR below 0.05 to 5+. PetWear median 3 (p75 8, p90 21); Vehicles 5 (only 20 repeat gaps); Toys 1 (p90 35); Eggs 8; Food 10; Strollers 70; Stickers and Houses were never updated twice.
- Staleness of the whole catalogue (items.json lastUpdatedAt vs 24 Sep): median 50 days, p25 13, p75 100, p90 135; 16% updated in the last 7 days, 36% in 30, 65% in 90. Pets: median 33 days, 47% within 30 days, 89% within 90. Gifts (median 130 days, 0% in 30) and Stickers (0% in 30) are the deadest categories; Houses 58% in 30 days because of a 15 Sep touch.

| category | items | items with 2+ log days | gaps n | gap median d | gap p75 | gap p90 | median days since lastUpdatedAt | share updated last 30d | last 90d |
|---|---|---|---|---|---|---|---|---|---|
| Pets | 781 | 204 | 3997 | 1 | 2 | 7 | 33 | 47% | 89% |
| PetWear | 236 | 49 | 242 | 3 | 8 | 21 | 64 | 28% | 53% |
| Vehicles | 198 | 11 | 20 | 5 | 8 | 11 | 100 | 31% | 35% |
| Toys | 87 | 11 | 63 | 1 | 7 | 35 | 100 | 22% | 25% |
| Stickers | 71 | 0 | 0 | - | - | - | 100 | 0% | 30% |
| Food | 51 | 5 | 8 | 10 | 12 | 46 | 100 | 10% | 24% |
| Eggs | 44 | 10 | 29 | 8 | 14 | 46 | 50 | 30% | 77% |
| Houses | 36 | 0 | 0 | - | - | - | 10 | 58% | 58% |
| Strollers | 35 | 7 | 8 | 70 | 75 | 85 | 100 | 23% | 23% |
| Gifts | 32 | 2 | 2 | 24 | 24 | 24 | 130 | 0% | 16% |

## 16. Share of items never updated in the window

- 756 of 1,571 items (48%) have no record in the log since 2 Jun: 456 of 781 pets (58%), 93 of 236 PetWear (39%), 74 of 198 Vehicles (37%), 31 of 87 Toys (36%), 27 of 71 Stickers (38%), 20 of 51 Food (39%), 23 of 44 Eggs (52%), 5 of 36 Houses (14%), 8 of 35 Strollers (23%), 19 of 32 Gifts (59%).
- Never-updated pets are the cheap ones: 455 of 697 pets with FR below 0.05 (65%) never appear, versus 1 of 52 in 0.05-0.2 and 0 of 32 at 0.2 or above. Coverage by band: FR 0-0.01 23% touched (132 of 571), 0.01-0.05 87% (110 of 126), 0.05-0.2 98%, 0.2+ 100%. The 325 logged pets carry 37.05 of 39.49 total FR points (94%).
- Highest-value pets never logged: Matcha Cat FR 0.055, Tortuga de la Isla 0.04, Nessie 0.0335, Meerkat 0.0325, Ring-Tailed Lemur 0.031, Happy Clam 0.0275, Platypus 0.023, Catte 0.021, Majestic Pony 0.0165, Ice Cream Hermit Crab 0.0165.
- All 815 names in the log resolve to items.json (no renamed or removed items).
- Log completeness flag: 560 of the 756 'never updated' items nonetheless have lastUpdatedAt inside the window (396 pets), clustered on bulk-touch days: 2026-08-05 (131 items vs 36 log records that day), 09-21 (80 vs 23), 09-11 (73 vs 99), 09-16 (64 vs 26), 07-28 (28), 08-06 (27). Many share the exact second (e.g. Narwhal, Ice Cube, Badger, Peachick, 2025 Birthday Butterfly all at 2026-09-22T10:17Z), and Gemstone Egg is a newly created item (24 Sep). For items that do have records, lastUpdatedAt equals the last record within an hour for 72% (588 of 815), while 222 have lastUpdatedAt more than a day after their last record (e.g. Royal Palace Spaniel last log 14 Jun, lastUpdatedAt 21 Sep). Interpretation: lastUpdatedAt is bumped by edits that do not produce a public log entry (bulk saves, item creation, metadata), so the log should be treated as complete for value changes but not as a record of every touch.

## 17. Regime shifts and unusual days

- Regime 1, June recalibration (2-30 Jun): 53% drops. 14 Jun (Sun) 09:00-10:59 UTC: 180 records, 451 pet tier drops vs 32 raises across 180 pets, median -7.1% (p90 -12.5%). 16 Jun (Tue) 06:00-07:59 and 16:00-17:59: 422 records touching 406 items, 372 drops, almost all non-pets (Vehicles 115 drops, PetWear 81, Toys 45, Stickers 39, Houses 29, Food 24, Strollers 19), median -25% (p90 -45.5%), with 121 item demand downgrades the same day. Rolling 7-day drop share peaked at 65% (window ending 16 Jun) and 60% (23 Jun).
- Regime 2, expansion (July - early September): rolling drop share fell to 8-18% (window ending 4 Aug: 8%); weekly Friday bump sessions with zero drops (19 Jun 115 raises, 10 Jul 112, 17 Jul 166, 24 Jul 172, 1 Aug 215, 7 Aug 258, 13 Aug 338, 28 Aug 223); 17 consecutive days with 100+ value rows from 17 Aug to 2 Sep; Mega net +14.4 points in the week ending 4 Aug and +14.2 in the week ending 18 Aug.
- Mid-August correction inside the expansion: the week ending 11 Aug is the only one with negative Mega net points (-0.22) as the guinea pigs (Tortoiseshell, Red Dutch), Bee PetWear (Honeypot Hat, Hive Backpack, Queen Bee Slippers) and Candy Cannon were cut in 14-18 step streaks between 6 and 21 Aug; 23 Aug (Sun) was the first post-June day with 58 drops.
- Regime 3, September cooling: drop share 22-27% in every rolling week since 25 Aug (vs 8-18% before), pace down to 72 rows/day, Mega net points only +1.2 to +4.3 per week (vs +8 to +14), and in the last 7 days the leaders turned: Jekyll Hydra, Undead Jousting Horse, Cryptid, Jousting Horse and Silverback Gorilla all net down after 40-50-move up-streaks. 22 Sep (Tue) had 37 drops, the most since 29 Aug.
- Other unusual days: 25 Jun (Thu) 157 rows with 42 drops (drops mixed into a bump); 1 Jul (Wed) 122 rows; 13 Aug (Thu) bump entered over 12:00-22:00 (10 hours, the longest session); 23 Aug (Sun) 04:00-22:00 session.
- No quiet stretch of 3+ days exists anywhere in the window; the board is worked every day.

| rolling 7-day window end | non-flat rows | drop share% | pet FR net points | Mega net points |
|---|---|---|---|---|
| 2026-06-09 | 347 | 27 | +0.787 | +6.58 |
| 2026-06-16 | 809 | 65 | +0.780 | +8.22 |
| 2026-06-23 | 935 | 60 | +1.185 | +10.85 |
| 2026-06-30 | 528 | 42 | +0.172 | +7.60 |
| 2026-07-07 | 529 | 36 | -0.313 | +6.98 |
| 2026-07-14 | 486 | 31 | +1.041 | +7.45 |
| 2026-07-21 | 540 | 10 | +0.566 | +10.74 |
| 2026-07-28 | 592 | 18 | +0.642 | +11.69 |
| 2026-08-04 | 546 | 8 | +0.911 | +14.44 |
| 2026-08-11 | 727 | 16 | +0.784 | -0.22 |
| 2026-08-18 | 910 | 11 | +1.021 | +14.21 |
| 2026-08-25 | 959 | 27 | +0.191 | +4.22 |
| 2026-09-01 | 1076 | 20 | +0.585 | +8.10 |
| 2026-09-08 | 607 | 27 | +0.762 | +1.96 |
| 2026-09-15 | 550 | 22 | +0.692 | +4.32 |
| 2026-09-22 | 460 | 25 | +0.061 | +1.20 |

## 18. What this means for the prediction engine

- Momentum is the dominant signal and should be weighted heavily: 93-94% next-move direction persistence, a raise is followed by another raise within 30 days 95-96% of the time for pets, and 30-day reversal is only 20-36% for FR/NFR. Streak length and days-since-last-move (median 1 day for hot pets) are the two strongest history features available.
- Class imbalance differs by category: pets are 74% raises with small steps (median 3%) and rare 10%+ moves (7% of raises); items are 66% drops with median -19%. A single softmax across categories will be biased; at minimum use category-conditional priors and treat the 16 Jun mass drop as an outlier or regime feature in the backtest.
- Tier coupling is near-deterministic (99% direction agreement, median size ratio 0.96-0.98, same-day co-move 90-93% when Regular moves). Predict Regular and propagate to Neon/Mega rather than fitting three independent series; Mega-only moves are noise (47% of Mega raises get a counter-move within 30 days).
- Coverage: 58% of pets and 48% of all items have no history, and they are almost exclusively FR below 0.05. For those, the history layer has no evidence; the correct history-layer output is 'hold' with an explicit no-data flag, leaving the market layer to speak.
- Timing for the hourly Actions run: a day's updates are essentially complete by 16:00 UTC (last update p90 18.5h); the weekly bump is a Friday 11:00-12:00 UTC session, so any 7-day horizon spans exactly one bump and forecasts issued Thursday night have the most upside to capture.
- Demand label separates outcomes (High 89% raises vs Low 3%) but only today's label is stored and demand changes coincide with value changes 96% of the time, so it is a concurrent indicator, not a leading one; it must be lagged or excluded in the backtest.
- Regime awareness: drop share and Mega net points have deteriorated for four consecutive weeks and the summer leaders are reversing; the 30-day base rate of raises (currently 69% of changed series) is likely lower than the July-August training weeks imply.

## Caveats

- All timestamps are UTC as stored in updatedAt; weeks start Monday; the week of 21 Sep covers only 4 days (through 2026-09-24T15:28Z) so its totals are not comparable.
- Movers use the update chain (start = previousValue of the first update in the window, end = newValue of the last); items with no update in the window are treated as unchanged. The %-ranked columns exclude series whose start value is below 0.05 (26 in 7d, 92 in 30d, 171 in 90d) because tiny denominators dominate; absolute columns are unfiltered. The 90-day window starts 26 Jun and therefore excludes the 14/16 June mass drops.
- Reversal and continuation rates exclude moves from the last 30 days so every move has a full look-ahead; streaks are per item and tier with flat rows ignored.
- 'Never updated' is measured against the public log (2 Jun onward). 560 such items have items.json lastUpdatedAt inside the window, clustered on bulk-touch days and often sharing the exact second, which indicates lastUpdatedAt is bumped by non-logged edits (bulk saves, item creation). It could not be verified against the live site (collectors and amvgg.com were off-limits), so treat the log as complete for value changes but not for every touch.
- The raise-share-by-demand table uses the CURRENT demand label from items.json as a proxy for demand at the time of the move; it is not a valid backtest feature as-is.
- Data oddities: one demand label 'Hig' (treated as High), 5 no-op demand rows (Low->Low, High->High), 2 records with neither value nor demand fields, 20 flat value rows (new == prev). No zero or non-numeric values.
- Non-pet drop statistics are dominated by the single 16 Jun recalibration (372 of 549 item drops); post-June non-pet behaviour is thin (PetWear excepted).

