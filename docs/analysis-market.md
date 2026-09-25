# AMVGG market analysis: 60 days of completed trades, a 3.2 h listings snapshot, and the value list

_Computed by an analysis agent on 2026-09-24/25 from the rolling store. Numbers are from that snapshot; the live dashboard is newer._

Analysed state/completed.json (13,656 completed trades, 1,472 traders, 2026-07-26 to 2026-09-24), state/listings.json (16,909 listings from 5,361 posters, but only a 3.21 h window on Thu 2026-09-24 16:29-19:41 UTC, ~5,260/h) and state/items.json (1,571 items, 781 pets) with a perl/JSON::PP script (scratchpad market.pl; full markdown report at C:\Users\yoyo\AppData\Local\Temp\claude\C--Users-yoyo-Downloads\a735b072-2ce6-4e03-b2f0-29ebdec24b8a\scratchpad\report.md). Headline findings: the market is potion-denominated (Ride-A-Pet Potion appears 7,755 times, in 27% of all completed trades; 36% of completed trades contain a potion) and the list under-prices potions (Ride-A-Pet fetches a median 1.46x list when alone on a side, n=1,161). Only 29 of 781 pets carry NP/F/R/N/M sub-state values, so strict list pricing covers just 34% of completed trades; with a fallback (reference tier x median state ratio) 96% are priceable. Realised prices track the list tightly for high-value pets (median offering/lookingFor ratio 1.00, 67% of strictly-priced trades within +/-10%), but cheap items and eggs trade far above list (Retired Egg ~15x, Paint Sealer ~8x, Fairytale Egg 2.2x, Crystal Egg 1.4x), i.e. the list's floor values (0.0001-0.0004) are wrong by an order of magnitude. Listings peak 16-19 UTC (rate ramps from ~3,900/h at 16:30 to ~9,700/h at 19:30), completed trades peak 16-18 UTC with a 3.5x day/night swing; Friday is the quietest weekday (9.8%). Posting is not concentrated (top 1% of posters = 8.7% of listings, Gini 0.45). 32.6% of listings use a sign (Add 3,681, Upgrade 1,400), all signs are on the lookingFor side. 55% of pets sit on one of ~15 placeholder FR/NFR/MFR triples, and demand tags are visibly stale (Fairytale Egg tagged Low with 2,126 completed mentions).

## 0. Dataset overview and coverage

- completed.json: 13,656 trades (meta.json still says 12,161; the file is newer), 72,434 item entries, 1,472 distinct uids, 2026-07-26T21:09Z .. 2026-09-24T19:43Z. All 71,802 named entries resolve to items.json (0 unknown names).
- listings.json: 16,909 rows, 91,187 entries, 5,361 distinct authorRobloxId, but the window is only 3.21 h (16:29-19:41 UTC on Thu 2026-09-24), NOT 12 h: 5,262 listings/hour observed.
- Strict pricing (exact list value for every entry) makes only 4,632 completed trades (33.9%) and 4,646 listings (27.5%) fully priceable, because 11,948 no-potion pet entries, 3,484 R, 2,361 N, 1,914 M, 1,129 NR and 814 MR entries hit pets whose items.json state value is null.
- Fallback pricing (missing state = reference tier value x median state ratio: np/fr 0.992, f/fr 0.994, r/fr 0.994, n/nfr 1.044, nf/nfr 1.000, nr/nfr 1.000, m/mfr 1.281, mf/mfr 1.014, mr/mfr 1.014) raises coverage to 13,127 completed trades (96.1%) and 11,404 listings (67.4%; the rest contain signs).
- Completed-trade volume per week is a collection artefact, not market growth: completed trades come from profile pages and each profile shows ~12 recent trades (median 11 per uid, P90 12, max 21), so 5,814 of 13,656 trades (43%) fall in the week starting 09-17 and only 109 in the week of 07-23.
- 1,373 of 1,571 catalogue items (87.4%) appear in at least one completed trade; 1,389 (88.4%) appear in the 3.2 h listing snapshot.

| Week starting (UTC) | Completed trades in sample |
|---|---|
| 2026-07-23 | 109 |
| 2026-07-30 | 216 |
| 2026-08-06 | 238 |
| 2026-08-13 | 427 |
| 2026-08-20 | 610 |
| 2026-08-27 | 1066 |
| 2026-09-03 | 1513 |
| 2026-09-10 | 2534 |
| 2026-09-17 | 5814 |
| 2026-09-24 (partial) | 1129 |

## 1. The 25 most traded items in completed trades (mentions across both sides, 60 d)

- 71,802 item mentions across 1,373 distinct items; just 40 items account for 50% of all mentions.
- Potions are the currency: Ride-A-Pet Potion 7,755 mentions in 3,664 distinct trades (26.8% of all completed trades), Fly-A-Pet 4,291 in 2,106 trades. 4,930 completed trades (36.1%) include a potion.
- Eggs are the small change: Crystal Egg 2,279 mentions but only 212 trades (10.7 per trade), Fairytale Egg 2,126 in 218 trades, Retired Egg 836 in 129 trades, Admin Abuse Egg 549 in 86 trades - they are stacked up to the 18-slot cap.
- By exact variant the top pet variants are Cow [FR] 692, Strawberry Shortcake Bat Dragon [FR] 581, Turtle [FR] 555, Cattuccino [NP] 518, Cryptid [FR] 467, Frost Dragon [FR] 458, Owl [FR] 416, Fairy Bat Dragon [FR] 378, Kangaroo [FR] 370, Mochi Meow [NP] 355, Huntsman Robin [NP] 347, Chocolate Chip Bat Dragon [FR] 345.
- 'Wanted share' > 50% marks items people chase rather than dump: Kitty Biscuit 62.8%, Frost Dragon 56.2%, Crystal Egg 54.3%, Owl 52.7%, Paint Sealer 50.7%. Lowest: Kangaroo 31.9%, Siamese Cat 31.9%, Pet Handler Pro Certificate 32.2%.

| Item | Cat | Mentions | Offered | Wanted | Distinct trades | Wanted share | Top variant | List value (FR / v) |
|---|---|---|---|---|---|---|---|---|
| Ride-A-Pet Potion | Food | 7755 | 4346 | 3409 | 3664 | 44.0% | item | 0.006 |
| Fly-A-Pet Potion | Food | 4291 | 2659 | 1632 | 2106 | 38.0% | item | 0.013 |
| Crystal Egg | Eggs | 2279 | 1041 | 1238 | 212 | 54.3% | item | 0.0004 |
| Fairytale Egg | Eggs | 2126 | 1146 | 980 | 218 | 46.1% | item | 0.0002 |
| Cow | Pets | 1166 | 751 | 415 | 968 | 35.6% | FR (692) | 0.210 |
| Strawberry Shortcake Bat Dragon | Pets | 858 | 494 | 364 | 743 | 42.4% | FR (581) | 0.250 |
| Retired Egg | Eggs | 836 | 504 | 332 | 129 | 39.7% | item | 0.0002 |
| Turtle | Pets | 829 | 551 | 278 | 679 | 33.5% | FR (555) | 0.150 |
| Pet Handler Pro Certificate | Gifts | 757 | 513 | 244 | 524 | 32.2% | item | 0.012 |
| Cryptid | Pets | 719 | 386 | 333 | 618 | 46.3% | FR (467) | 0.865 |
| Kitty Biscuit | Food | 712 | 265 | 447 | 231 | 62.8% | item | 0.006 |
| Fairy Bat Dragon | Pets | 650 | 384 | 266 | 537 | 40.9% | FR (378) | 0.175 |
| Paint Sealer | Toys | 607 | 299 | 308 | 133 | 50.7% | item | 0.001 |
| Cattuccino | Pets | 603 | 347 | 256 | 228 | 42.5% | NP (518) | 0.006 |
| Frostbite Bear | Pets | 603 | 325 | 278 | 403 | 46.1% | NP (235) | 0.285 |
| Kangaroo | Pets | 589 | 401 | 188 | 522 | 31.9% | FR (370) | 0.115 |
| Frost Dragon | Pets | 580 | 254 | 326 | 509 | 56.2% | FR (458) | 1.725 |
| Admin Abuse Egg | Eggs | 549 | 367 | 182 | 86 | 33.2% | item | 0.0004 |
| Owl | Pets | 546 | 258 | 288 | 499 | 52.7% | FR (416) | 1.340 |
| Chocolate Chip Bat Dragon | Pets | 515 | 314 | 201 | 462 | 39.0% | FR (345) | 0.245 |
| Unicorn Horn | PetWear | 512 | 310 | 202 | 447 | 39.5% | item | 0.130 |
| Goose | Pets | 506 | 330 | 176 | 470 | 34.8% | FR (190) | 0.217 |
| Siamese Cat | Pets | 501 | 341 | 160 | 471 | 31.9% | FR (111) | 0.135 |
| Candicorn | Pets | 438 | 285 | 153 | 387 | 34.9% | NP (114) | 0.070 |
| Munchkin Cat | Pets | 431 | 267 | 164 | 394 | 38.1% | NP (127) | 0.065 |

## 2. The 25 most WANTED items in live listings (lookingFor side, 3.2 h snapshot)

- Mentions count every slot; 'distinct listings' counts each listing once. Eggs and potions are stacked (Crystal Egg: 809 mentions in only 68 listings), pets are mostly one per listing.
- Cryptid is the most wanted pet (823 mentions, 731 listings) and is net-wanted (want/offer 1.60); Kitty Bat has the highest want/offer among big names (3.94, list value only 0.006).
- Big-name pets that are wanted far less than they are offered right now: Fairy Bat Dragon 0.34, Cow 0.33, Owl 0.39, Turtle 0.44, Fly-A-Pet Potion 0.55.

| Item | Cat | Wanted mentions | Distinct listings | Offered mentions | Want/Offer | List value |
|---|---|---|---|---|---|---|
| Ride-A-Pet Potion | Food | 2609 | 916 | 3519 | 0.74 | 0.006 |
| Fly-A-Pet Potion | Food | 1311 | 434 | 2391 | 0.55 | 0.013 |
| Cryptid | Pets | 823 | 731 | 513 | 1.60 | 0.865 |
| Crystal Egg | Eggs | 809 | 68 | 161 | 5.02 | 0.0004 |
| Strawberry Shortcake Bat Dragon | Pets | 731 | 581 | 1072 | 0.68 | 0.250 |
| Chocolate Chip Bat Dragon | Pets | 505 | 425 | 622 | 0.81 | 0.245 |
| Fairy Bat Dragon | Pets | 462 | 319 | 1359 | 0.34 | 0.175 |
| Frost Dragon | Pets | 417 | 352 | 548 | 0.76 | 1.725 |
| Gemstone Egg | Eggs | 391 | 70 | 561 | 0.70 | 0.013 |
| Arctic Reindeer | Pets | 347 | 306 | 323 | 1.07 | 0.287 |
| Crow | Pets | 320 | 292 | 283 | 1.13 | 0.965 |
| Candicorn | Pets | 307 | 234 | 327 | 0.94 | 0.070 |
| Dalmatian | Pets | 284 | 245 | 258 | 1.10 | 0.350 |
| Cow | Pets | 284 | 229 | 860 | 0.33 | 0.210 |
| Evil Unicorn | Pets | 276 | 231 | 193 | 1.43 | 0.615 |
| Turtle | Pets | 268 | 187 | 605 | 0.44 | 0.150 |
| Cabbit | Pets | 262 | 244 | 299 | 0.88 | 0.170 |
| Hedgehog | Pets | 257 | 237 | 208 | 1.24 | 0.407 |
| Kitty Bat | Pets | 252 | 136 | 64 | 3.94 | 0.006 |
| Balloon Unicorn | Pets | 248 | 229 | 399 | 0.62 | 0.925 |
| Owl | Pets | 238 | 219 | 611 | 0.39 | 1.340 |
| Bat Dragon | Pets | 238 | 217 | 195 | 1.22 | 5.125 |
| Cattuccino | Pets | 226 | 72 | 306 | 0.74 | 0.006 |
| Fairytale Egg | Eggs | 222 | 20 | 886 | 0.25 | 0.0002 |
| Munchkin Cat | Pets | 219 | 209 | 346 | 0.63 | 0.065 |

## 3. The 25 most OFFERED items in live listings (offering side)

- Fairy Bat Dragon is the most dumped pet (1,359 offered in 908 listings vs 462 wanted, W/O 0.34), followed by Strawberry Shortcake Bat Dragon (1,072) and Cow (860).
- Retired Egg (945 offered, 111 listings), Fairytale Egg (886) and Throwback Egg (433 offered vs 24 wanted, W/O 0.06) are pure filler on the offering side.
- Spring Bunny Hood (364 offered, 68 wanted, W/O 0.19) and Unicorn Horn (385 vs 131) are the most oversupplied pet-wear.

| Item | Cat | Offered mentions | Distinct listings | Wanted mentions | Want/Offer | List value |
|---|---|---|---|---|---|---|
| Ride-A-Pet Potion | Food | 3519 | 1659 | 2609 | 0.74 | 0.006 |
| Fly-A-Pet Potion | Food | 2391 | 1260 | 1311 | 0.55 | 0.013 |
| Fairy Bat Dragon | Pets | 1359 | 908 | 462 | 0.34 | 0.175 |
| Strawberry Shortcake Bat Dragon | Pets | 1072 | 888 | 731 | 0.68 | 0.250 |
| Retired Egg | Eggs | 945 | 111 | 155 | 0.16 | 0.0002 |
| Fairytale Egg | Eggs | 886 | 95 | 222 | 0.25 | 0.0002 |
| Cow | Pets | 860 | 728 | 284 | 0.33 | 0.210 |
| Chocolate Chip Bat Dragon | Pets | 622 | 493 | 505 | 0.81 | 0.245 |
| Owl | Pets | 611 | 545 | 238 | 0.39 | 1.340 |
| Turtle | Pets | 605 | 514 | 268 | 0.44 | 0.150 |
| Gemstone Egg | Eggs | 561 | 383 | 391 | 0.70 | 0.013 |
| Frost Dragon | Pets | 548 | 492 | 417 | 0.76 | 1.725 |
| Cryptid | Pets | 513 | 428 | 823 | 1.60 | 0.865 |
| Kitty Biscuit | Food | 493 | 143 | 173 | 0.35 | 0.006 |
| Frostbite Bear | Pets | 486 | 299 | 184 | 0.38 | 0.285 |
| Parrot | Pets | 465 | 441 | 183 | 0.39 | 1.070 |
| Kangaroo | Pets | 449 | 408 | 170 | 0.38 | 0.115 |
| Throwback Egg | Eggs | 433 | 37 | 24 | 0.06 | 0.0001 |
| Goose | Pets | 425 | 363 | 180 | 0.42 | 0.217 |
| Peppermint Penguin | Pets | 416 | 348 | 194 | 0.47 | 0.203 |
| Siamese Cat | Pets | 402 | 382 | 214 | 0.53 | 0.135 |
| Balloon Unicorn | Pets | 399 | 374 | 248 | 0.62 | 0.925 |
| Unicorn Horn | PetWear | 385 | 337 | 131 | 0.34 | 0.130 |
| Spring Bunny Hood | PetWear | 364 | 323 | 68 | 0.19 | 0.031 |
| Werewolf | Pets | 350 | 307 | 148 | 0.42 | 0.198 |

## 4a. Want/Offer ratio LEADERS (demand >> supply; min 20 listing mentions; ratio smoothed as (want+0.5)/(offer+0.5))

- 568 items have >=20 mentions; only 107 (18.8%) are net-wanted (W/O > 1). The listing market is structurally supply-heavy: median W/O is 0.31 for Low-tagged, 0.43 for Medium-tagged and 0.59 for High-tagged items.
- The strongest demand/supply imbalances are almost all cheap pets the site tags LOW demand: Manta Ray (25 wanted / 1 offered), Rhino Beetle (40/2), Garden Egg (44/4), Otter (18/2), Rainbow Trout (34/5), Candy Cane Snail (43/7). These are candidates for a demand-tag and value bump.
- Royal Mistletroll (121 wanted / 33 offered, W/O 3.63, list 0.160) is the highest-value item in the leader list and is the only one already tagged High.

| Item | Cat | Wanted | Offered | W/O | Site demand tag | List value |
|---|---|---|---|---|---|---|
| Manta Ray | Pets | 25 | 1 | 17.00 | Low | 0.005 |
| Rhino Beetle | Pets | 40 | 2 | 16.20 | Low | 0.004 |
| Garden Egg | Eggs | 44 | 4 | 9.89 | Low | 0.00065 |
| Otter | Pets | 18 | 2 | 7.40 | Low | 0.003 |
| Rainbow Trout | Pets | 34 | 5 | 6.27 | Low | 0.003 |
| Candy Cane Snail | Pets | 43 | 7 | 5.80 | Low | 0.006 |
| Crystal Egg | Eggs | 809 | 161 | 5.01 | Medium | 0.0004 |
| Ankylosaurus | Pets | 20 | 4 | 4.56 | Low | 0.005 |
| Influencer Gibbon | Pets | 40 | 9 | 4.26 | Low | 0.009 |
| Jumping Spider | Pets | 25 | 6 | 3.92 | Low | 0.004 |
| Kitty Bat | Pets | 252 | 64 | 3.91 | Medium | 0.006 |
| Kage Crow | Pets | 42 | 11 | 3.70 | Low | 0.006 |
| Flaming Zebra | Pets | 16 | 4 | 3.67 | Low | 0.007 |
| Royal Mistletroll | Pets | 121 | 33 | 3.63 | High | 0.160 |
| River Otter | Pets | 37 | 10 | 3.57 | Low | 0.003 |
| Naughty Mistletroll | Pets | 73 | 21 | 3.42 | Medium | 0.018 |
| Chicken | Pets | 49 | 14 | 3.41 | Medium | 0.011 |
| Evil Rock | Pets | 22 | 7 | 3.00 | Medium | 0.008 |
| Patchy Bear | Pets | 37 | 12 | 3.00 | Low | 0.003 |
| Bunny | Pets | 27 | 9 | 2.89 | Low | 0.003 |

## 4b. Want/Offer ratio LAGGARDS (supply >> demand; min 20 listing mentions)

- The laggards are items nobody asks for at all: Admin Abuse Box 0 wanted / 112 offered, Festive Wagon 0/75, Ant 0/56, Squid 0/55, Endangered Egg 2/171, Rubber Ducky 1/99.
- Almost all laggards already carry a Low tag; Golden Egg (0/41) and Peahen (0/33) are tagged Medium despite zero demand.

| Item | Cat | Wanted | Offered | W/O | Site demand tag | List value |
|---|---|---|---|---|---|---|
| Admin Abuse Box | Gifts | 0 | 112 | 0.00 | Low | 0.0004 |
| Festive Wagon | Vehicles | 0 | 75 | 0.01 | Low | 0.003 |
| Ant | Pets | 0 | 56 | 0.01 | Low | 0.003 |
| Squid | Pets | 0 | 55 | 0.01 | Low | 0.008 |
| Ratatoskr | Pets | 0 | 48 | 0.01 | Low | 0.004 |
| Black Rhino | Pets | 0 | 45 | 0.01 | Low | 0.003 |
| Toucan | Pets | 0 | 45 | 0.01 | Low | 0.004 |
| Sasquatch | Pets | 0 | 42 | 0.01 | Low | 0.005 |
| Starfish | Pets | 0 | 41 | 0.01 | Low | 0.004 |
| Golden Egg | Eggs | 0 | 41 | 0.01 | Medium | 0.002 |
| Purple Heart Glasses | PetWear | 0 | 40 | 0.01 | Low | 0.003 |
| Budgie Witch | Pets | 0 | 39 | 0.01 | Low | 0.003 |
| Grinmoire | Pets | 0 | 36 | 0.01 | Low | 0.003 |
| Muskrat | Pets | 0 | 36 | 0.01 | Low | 0.003 |
| Love Letter | PetWear | 0 | 35 | 0.01 | Low | 0.002 |
| Endangered Egg | Eggs | 2 | 171 | 0.01 | Low | 0.0002 |
| Peahen | Pets | 0 | 33 | 0.01 | Medium | 0.011 |
| Zebra | Pets | 0 | 33 | 0.01 | Low | 0.003 |
| Zodiac Minion Chick | Pets | 0 | 33 | 0.01 | Low | 0.006 |
| Rubber Ducky | Pets | 1 | 99 | 0.02 | Low | 0.003 |

## 5. Potion-state premiums (items.json; only 29 of 781 pets carry NP/F/R/N/NF/NR/M/MF/MR values)

- Regular tier: potions add almost nothing on the list. Median NP/FR = 0.991, F/FR = 0.994, R/FR = 0.994 across the 28 pets with all four values. 11 of 28 (39%) price NO-POTION ABOVE fly-ride.
- Biggest NP > FR inversions: Diamond Hummingbird NP/FR 2.09 (0.120 vs 0.058), Monkey King 1.67 (0.350 vs 0.210), Flamingo 1.22, Shadow Dragon 1.18 (4.40 vs 3.72), Coconut Friend 1.08, Giraffe 1.03, Frost Dragon 1.03 (1.775 vs 1.725), Bat Dragon 1.01. Inversions are concentrated in the 1-10 value band (6 of 8 pets there have NP >= FR); for new cheap pets NP is a steep discount (Mochi Meow NP/FR 0.25, Christmas Spirit 0.23, Unicorn 0.55).
- Neon tier: no-potion NEON is worth MORE than NFR for 24 of 28 pets (median N/NFR 1.044, P75 1.21; Shadow Dragon 1.35, Monkey King 1.80, Diamond Hummingbird 2.26, Coconut Friend 3.17). NF/NFR and NR/NFR medians are exactly 1.000.
- Mega tier: the effect is strongest. Median M/MFR = 1.307 (P25 1.05, P75 1.55); 25 of 28 pets price no-potion mega above MFR (Coconut Friend 3.75, Diamond Hummingbird 2.24, Monkey King 1.92, Parrot 1.88, Frost Dragon 1.79, Turtle 1.59, Shadow Dragon 1.58, Giraffe 1.54). MF/MFR and MR/MFR medians 1.014.
- Implication for the engine: 'FR is the reference' is fine for regulars, but any per-state prediction for neon/mega must treat no-potion as a premium state, not a discount, for the 2019-2020 legendaries; and for 752 pets there is simply no state value to predict from (fallback needed).

| Ratio | Pets | Median | Mean | P25 | P75 | P10 | Ratio > 1 | Ratio == 1 |
|---|---|---|---|---|---|---|---|---|
| Regular NP/FR | 28 | 0.991 | 0.995 | 0.964 | 1.015 | 0.777 | 11 (39.3%) | 2 |
| Regular F/FR | 28 | 0.994 | 1.053 | 0.982 | 1.000 | 0.946 | 4 (14.3%) | 4 |
| Regular R/FR | 28 | 0.994 | 1.037 | 0.981 | 1.000 | 0.931 | 3 (10.7%) | 5 |
| Neon N/NFR | 28 | 1.044 | 1.205 | 1.010 | 1.212 | 0.925 | 24 (85.7%) | 1 |
| Neon NF/NFR | 28 | 1.000 | 1.161 | 1.000 | 1.022 | 0.981 | 13 (46.4%) | 9 |
| Neon NR/NFR | 28 | 1.000 | 1.151 | 1.000 | 1.015 | 0.981 | 12 (42.9%) | 10 |
| Mega M/MFR | 28 | 1.307 | 1.399 | 1.050 | 1.547 | 1.008 | 25 (89.3%) | 1 |
| Mega MF/MFR | 28 | 1.014 | 1.199 | 1.004 | 1.046 | 1.000 | 22 (78.6%) | 4 |
| Mega MR/MFR | 28 | 1.014 | 1.178 | 1.004 | 1.042 | 1.000 | 22 (78.6%) | 4 |

## 6. Neon/Regular and Mega/Neon value multipliers by FR value tier (all 781 pets)

- Overall median NFR/FR = 2.00 and MFR/NFR = 3.75 (MFR/FR 7.50): the list prices a neon at HALF the 4 regulars it costs to make (NFR/FR < 4 for 644 pets, 82.5%; > 4 for only 94) and a mega slightly below 4 neons (MFR/NFR < 4 for 55.7%).
- Multipliers peak in the 0.05-0.2 FR band (median NFR/FR 3.86, MFR/NFR 4.00) and collapse at the top: 1-3 band NFR/FR 2.26, 3-10 band 2.17 and MFR/NFR 2.77. Frost Dragon NFR/FR is 1.76 (1.725 -> 3.03), Evil Unicorn 1.85, Giraffe 1.98, Shadow Dragon 2.00; Turtle MFR/NFR 2.23, Kangaroo 2.33, Shadow Dragon 2.45, Frost Dragon 2.54.
- Highest multipliers (FR >= 0.1) are all mid-value newer pets at almost exactly 4x: Strawberry Tortle 4.29, Tortoiseshell Guinea Pig 4.18, Black-Chested Pheasant 4.15, Mechapup 4.09, Tio De Nadal 4.09, Royal Mistletroll 4.06; same names top MFR/NFR (4.21, 4.13, 4.06 ...).
- By demand tag: Medium-demand pets sit at exactly 4.00 / 4.00 (formulaic), High-demand at 3.07 / 3.79, Low-demand at 2.00 / 3.42 (formulaic floor values, see section 13).
- The <0.05 band (697 pets, 89% of the catalogue) has median NFR/FR exactly 2.00 with P25 = 2.00, a sign that these are template values rather than observed prices.

| FR tier | Pets | Median NFR/FR | P25 | P75 | Median MFR/NFR | P25 | P75 | Median MFR/FR |
|---|---|---|---|---|---|---|---|---|
| <0.05 | 697 | 2.00 | 2.00 | 3.12 | 3.64 | 3.12 | 4.00 | 7.27 |
| 0.05-0.2 | 52 | 3.86 | 2.95 | 4.06 | 4.00 | 3.92 | 4.06 | 15.34 |
| 0.2-0.5 | 15 | 3.22 | 2.80 | 3.82 | 3.94 | 3.60 | 3.97 | 12.86 |
| 0.5-1 | 9 | 2.72 | 2.50 | 3.55 | 3.66 | 3.43 | 3.79 | 9.50 |
| 1-3 | 6 | 2.26 | 1.99 | 3.56 | 3.11 | 2.70 | 3.76 | 6.91 |
| 3-10 | 2 | 2.17 | 2.08 | 2.26 | 2.77 | 2.61 | 2.93 | 6.08 |
| ALL | 781 | 2.00 | 2.00 | 3.42 | 3.75 | 3.12 | 4.00 | 7.50 |

## 7. Overpay / underpay in completed trades: how far realised trades sit from the list

- R = offering value / lookingFor value. The poster GIVES the offering side and RECEIVES the lookingFor side, so R > 1 = poster overpaid vs the list.
- Strict pricing (4,632 trades): median R 1.000, geo-mean 1.003, P10 0.846 / P90 1.225; 67.1% within +/-10% and 85.7% within +/-25%; 18.6% of posters overpay >10%, 14.1% underpay >10%; only 1.2% give >= 2x. For the pets the list actually prices, the list is a very good predictor of what clears.
- Fallback pricing (13,127 trades) widens the spread (median 1.019, geo-mean 1.082, P90 1.734, 8.0% give >= 2x) because it pulls in cheap NP pets and egg/potion bundles where the list is off by multiples.
- Overpaying is a small-trade phenomenon: lookingFor value < 0.5 -> median R 1.037 and 38.8% overpay >10%; 0.5-2 -> 1.009 / 16.5%; 2-5 -> 1.006 / 12.4%; 5-15 -> 1.002 / 8.3%; 15-50 -> 1.000 / 8.5%.
- Bundles are where posters overpay: 'many(4+) for 1' (3,399 trades) median R 1.036, '2 for 1' 1.036, '3 for 1' 1.036 with 34-37% overpaying >10%; '1 for many' 0.994, '1 for 2' 0.993, '1 for 3' 0.999 (poster gets a small discount when breaking a big item into pieces).
- Live listings (11,404 fallback-priceable): median ask ratio O/L 0.989 (P25 0.889, P75 1.047); 27.8% ask >10% more than they offer, 18.8% offer >10% more than they ask, i.e. asks are anchored to the list but skew slightly greedy, and completed trades end up at parity.

| Pricing mode | Priceable trades | Median R | Geo-mean R | P10 / P25 / P75 / P90 | Within +/-10% | Within +/-25% | Poster overpays >10% | Poster underpays >10% | Gives >= 2x | Gives <= 0.5x |
|---|---|---|---|---|---|---|---|---|---|---|
| strict | 4632 (33.9%) | 1.000 | 1.003 | 0.846 / 0.960 / 1.059 / 1.225 | 67.1% | 85.7% | 18.6% | 14.1% | 1.2% | 1.5% |
| fallback | 13127 (96.1%) | 1.019 | 1.082 | 0.765 / 0.948 / 1.182 / 1.734 | 49.1% | 70.1% | 32.3% | 18.5% | 8.0% | 3.8% |

## 8. Biggest average OVERPAYS by variant (market pays more than the list; min 8 trade sides)

- Method: for every completed-trade side where the variant is >= 50% of that side's (fallback-priced) list value, premium = other side value / this side value. The variant's own value must be an exact list value. >1 means people give more than list to get it (or accept more than list when selling it).
- Eggs and consumables are the big miss: Throwback Egg trades at 3.8x list (0.0001), Retired Egg 3.4x (n=100), Fairytale Egg 2.2x (n=158), Admin Abuse Egg 1.7x, Crystal Egg 1.4x (n=180), Paint Sealer 1.8x (n=97). On single-item sides the gap is even bigger: Retired Egg 15.4x (median other side 0.003 vs list 0.0002), Paint Sealer 8.1x, Magic House Door 3.1x.
- Ride-A-Pet Potion, the market's unit of account, clears at 1.23x list (1,912 sides; 1.46x when alone on a side, n=1,161, median 0.009 vs list 0.006). Fly-A-Pet at 1.05x / 1.11x. Pet Handler Pro Certificate 1.08x (n=237).
- Pets the list under-prices: Silverback Gorilla FR 1.71x (0.075 -> implied 0.128; 1.86x on 20 single sides), Silverback Gorilla NFR 1.55x, MFR 1.23x; Diamond Unicorn MFR 1.50x (0.100 -> 0.150, 15 single sides); Ballet Swan FR 1.27x / NFR 1.21x; Frostbite Bear NFR 1.20x (1.12 -> 1.34, 20 single sides); Chihuahua MFR 1.46x; Jousting Horse MFR 1.25x; Latte Kitsune FR 1.23x; Cryptid FR 1.07x (n=352, implied 0.925 vs 0.865).

| Variant | Sides (as wanted / as offered) | Median premium | Geo-mean | P25 | P75 | List value | Implied value |
|---|---|---|---|---|---|---|---|
| Throwback Egg | 26 (15 / 11) | 3.79 | 4.69 | 2.52 | 9.14 | 0.0001 | 0.0004 |
| Retired Egg | 100 (34 / 66) | 3.42 | 3.19 | 1.25 | 6.61 | 0.0002 | 0.0007 |
| Unfortunate Eyelashes | 11 (4 / 7) | 2.60 | 2.15 | 1.30 | 2.64 | 0.003 | 0.006 |
| Royal Fairytale Egg | 9 (3 / 6) | 2.58 | 3.25 | 2.17 | 4.17 | 0.003 | 0.008 |
| Royal Egg | 10 (1 / 9) | 2.44 | 2.35 | 1.38 | 3.31 | 0.0003 | 0.0007 |
| Fairytale Egg | 158 (76 / 82) | 2.20 | 2.51 | 1.38 | 3.95 | 0.0002 | 0.0004 |
| Fairytale Castle | 14 (6 / 8) | 1.87 | 1.77 | 1.26 | 2.37 | 0.003 | 0.006 |
| Paint Sealer | 97 (52 / 45) | 1.82 | 2.74 | 1.18 | 6.31 | 0.001 | 0.001 |
| Endangered Egg | 21 (3 / 18) | 1.81 | 1.92 | 1.00 | 3.31 | 0.0002 | 0.0004 |
| Admin Abuse Egg | 48 (21 / 27) | 1.74 | 2.36 | 1.08 | 5.19 | 0.0004 | 0.0007 |
| Silverback Gorilla [FR] | 22 (18 / 4) | 1.71 | 2.00 | 1.41 | 2.85 | 0.075 | 0.128 |
| Rose Quartz Glow Mega Neon Paint | 11 (7 / 4) | 1.62 | 1.42 | 1.06 | 1.65 | 0.004 | 0.007 |
| Garden Egg | 8 (8 / 0) | 1.56 | 1.62 | 1.05 | 2.37 | 0.00065 | 0.001 |
| Silverback Gorilla [NFR] | 18 (6 / 12) | 1.55 | 1.76 | 0.97 | 3.89 | 0.275 | 0.427 |
| Diamond Unicorn [MFR] | 16 (12 / 4) | 1.50 | 1.42 | 1.44 | 1.69 | 0.100 | 0.150 |
| Crystal Egg | 180 (94 / 86) | 1.39 | 1.76 | 0.94 | 2.68 | 0.0004 | 0.0006 |
| Candyfloss Mega Neon Paint | 15 (7 / 8) | 1.30 | 1.45 | 0.91 | 1.96 | 0.005 | 0.006 |
| Magic House Door | 14 (7 / 7) | 1.30 | 1.69 | 0.79 | 3.23 | 0.005 | 0.006 |
| Diamond Egg | 13 (4 / 9) | 1.30 | 1.17 | 0.93 | 1.59 | 0.005 | 0.006 |
| Ballet Swan [FR] | 25 (19 / 6) | 1.27 | 1.35 | 1.13 | 1.47 | 0.037 | 0.048 |
| Rainbow Stroller | 9 (4 / 5) | 1.24 | 1.08 | 0.78 | 1.39 | 0.010 | 0.012 |
| Ride-A-Pet Potion | 1912 (1235 / 677) | 1.23 | 1.46 | 1.00 | 1.85 | 0.006 | 0.008 |
| Silverback Gorilla [MFR] | 27 (14 / 13) | 1.23 | 1.30 | 1.00 | 1.65 | 1.080 | 1.325 |
| Ballet Swan [NFR] | 24 (11 / 13) | 1.21 | 1.21 | 1.13 | 1.31 | 0.150 | 0.182 |
| Frostbite Bear [NFR] | 35 (23 / 12) | 1.20 | 1.09 | 1.04 | 1.24 | 1.120 | 1.340 |

## 9. Biggest average UNDERPAYS by variant (market pays less than the list; min 8 sides)

- Underpays are rare and shallow: of 225 variants with >= 8 single-variant sides, 33 (14.7%) clear >10% above list but only 4 (1.8%) clear >10% below; median implied/list = 1.023. The list errs on the low side, almost never on the high side.
- Clear over-valuations: Mochi Meow [M] trades at 0.50x list (0.025 -> 0.013, 17 sides, tight P25-P75 0.50-0.57), Mochi Meow [NP] 0.72x, Peppermint Penguin FR 0.92x (n=41; 0.91x on 26 single sides), Fairy Bat Dragon FR 0.97x (n=161; NFR 0.92x on 32 single sides), Chocolate Chip Bat Dragon FR 0.97x (n=138; 0.94x on 73 single sides), Banana Hat 0.80x, Classic Trade Stand 0.81x.
- The 2025-2026 bat dragons (Fairy, Chocolate Chip, Strawberry Shortcake) all sit at 0.94-0.98x across FR/NFR/MFR - the list is 2-6% high on the whole family while they are being dumped (Fairy Bat Dragon is the most offered pet in listings).

| Variant | Sides (as wanted / as offered) | Median premium | Geo-mean | P25 | P75 | List value | Implied value |
|---|---|---|---|---|---|---|---|
| Mochi Meow [M] | 17 (12 / 5) | 0.50 | 0.53 | 0.50 | 0.57 | 0.025 | 0.013 |
| Mochi Meow [NP] | 41 (25 / 16) | 0.72 | 1.06 | 0.65 | 0.93 | 0.001 | 0.0007 |
| Mule Baskets | 8 (1 / 7) | 0.72 | 0.82 | 0.72 | 1.01 | 0.003 | 0.002 |
| Jekyll Hydra Animated Sticker | 8 (5 / 3) | 0.80 | 0.77 | 0.50 | 1.07 | 0.025 | 0.020 |
| Banana Hat | 11 (7 / 4) | 0.80 | 0.90 | 0.72 | 1.07 | 0.010 | 0.008 |
| Classic Trade Stand | 18 (7 / 11) | 0.81 | 0.86 | 0.62 | 1.06 | 0.004 | 0.003 |
| Peppermint Penguin [FR] | 41 (21 / 20) | 0.92 | 0.88 | 0.84 | 1.01 | 0.203 | 0.187 |
| Rain Boots | 10 (3 / 7) | 0.93 | 0.96 | 0.82 | 1.13 | 0.015 | 0.014 |
| Tuxedo Cat [MFR] | 10 (3 / 7) | 0.95 | 0.90 | 0.85 | 1.14 | 0.170 | 0.161 |
| Bewitched Hat | 8 (2 / 6) | 0.96 | 1.02 | 0.87 | 1.05 | 0.004 | 0.004 |
| Fairy Bat Dragon [FR] | 161 (103 / 58) | 0.97 | 0.91 | 0.83 | 1.02 | 0.175 | 0.169 |
| Polar Bear [MFR] | 8 (1 / 7) | 0.97 | 0.95 | 0.93 | 1.01 | 0.330 | 0.319 |
| Chocolate Chip Bat Dragon [FR] | 138 (79 / 59) | 0.97 | 0.92 | 0.86 | 1.01 | 0.245 | 0.238 |
| Unicorn [MFR] | 18 (14 / 4) | 0.97 | 0.98 | 0.94 | 1.02 | 0.085 | 0.083 |
| Fairy Bat Dragon [MFR] | 45 (20 / 25) | 0.97 | 0.90 | 0.81 | 1.01 | 2.000 | 1.943 |
| Elephant [NFR] | 9 (5 / 4) | 0.97 | 0.90 | 0.96 | 1.09 | 0.280 | 0.273 |
| Dalmatian [NFR] | 24 (15 / 9) | 0.98 | 0.95 | 0.90 | 1.02 | 1.260 | 1.229 |
| Strawberry Shortcake Bat Dragon [NFR] | 74 (40 / 34) | 0.98 | 0.95 | 0.89 | 1.01 | 0.705 | 0.689 |
| Chocolate Chip Bat Dragon [MFR] | 28 (13 / 15) | 0.98 | 0.96 | 0.89 | 1.02 | 3.150 | 3.081 |
| Haetae [FR] | 83 (42 / 41) | 0.98 | 0.94 | 0.93 | 1.02 | 0.830 | 0.812 |
| Strawberry Shortcake Bat Dragon [FR] | 273 (150 / 123) | 0.98 | 0.94 | 0.87 | 1.05 | 0.250 | 0.245 |
| Peppermint Penguin [NFR] | 37 (21 / 16) | 0.98 | 0.91 | 0.84 | 1.00 | 0.775 | 0.760 |

## 10. Realised price vs list for the most-traded variants (sides consisting of exactly one variant)

- This is the cleanest market read: when a side is a single variant, the other side's list value IS the market price. Values below are medians of that other side.
- High-value legendaries clear within 1% of list with tight interquartile ranges: Frost Dragon FR 1.735 vs 1.725 (n=206, P25-P75 1.704-1.775), Owl 1.352 vs 1.340, Bat Dragon 5.141 vs 5.125, Shadow Dragon 3.735 vs 3.720, Giraffe 2.543 vs 2.550, Giant Panda 1.205 vs 1.200, Parrot 1.079 vs 1.070, Balloon Unicorn 0.941 vs 0.925, Crow 0.985 vs 0.965.
- Consistently slightly ABOVE list (3-8%): Cryptid FR 1.08x (0.937 vs 0.865, n=187), Kangaroo 1.05x, Evil Unicorn 1.04x, Unicorn Horn 1.04x, Tiny Wings 1.04x, Arctic Reindeer 1.03x, Dalmatian 1.03x, Hedgehog 1.03x, Frostbite Bear MFR 1.07x (4.755 vs 4.450), Spring Bunny Hood 1.16x (Medium-tagged).
- Consistently BELOW list: Chocolate Chip Bat Dragon FR 0.94x (n=73), Fairy Bat Dragon FR 0.97x (n=90).

| Variant (alone on its side) | Sides | List value | Median other side | P25 | P75 | Implied / List | Site demand tag |
|---|---|---|---|---|---|---|---|
| Ride-A-Pet Potion | 1161 | 0.006 | 0.009 | 0.007 | 0.017 | 1.46 | High |
| Fly-A-Pet Potion | 505 | 0.013 | 0.014 | 0.012 | 0.021 | 1.11 | High |
| Frost Dragon [FR] | 206 | 1.725 | 1.735 | 1.704 | 1.775 | 1.01 | High |
| Cryptid [FR] | 187 | 0.865 | 0.937 | 0.863 | 1.077 | 1.08 | High |
| Pet Handler Pro Certificate | 178 | 0.012 | 0.013 | 0.013 | 0.019 | 1.08 | High |
| Owl [FR] | 177 | 1.340 | 1.352 | 1.314 | 1.388 | 1.01 | High |
| Cow [FR] | 176 | 0.210 | 0.215 | 0.204 | 0.234 | 1.02 | High |
| Strawberry Shortcake Bat Dragon [FR] | 162 | 0.250 | 0.250 | 0.226 | 0.264 | 1.00 | High |
| Turtle [FR] | 146 | 0.150 | 0.154 | 0.145 | 0.168 | 1.02 | High |
| Parrot [FR] | 138 | 1.070 | 1.079 | 1.014 | 1.110 | 1.01 | High |
| Arctic Reindeer [FR] | 113 | 0.287 | 0.297 | 0.283 | 0.315 | 1.03 | High |
| Crow [FR] | 109 | 0.965 | 0.985 | 0.950 | 1.028 | 1.02 | High |
| Kitty Biscuit | 96 | 0.006 | 0.006 | 0.006 | 0.011 | 1.00 | High |
| Evil Unicorn [FR] | 95 | 0.615 | 0.639 | 0.616 | 0.672 | 1.04 | High |
| Balloon Unicorn [FR] | 94 | 0.925 | 0.941 | 0.924 | 0.965 | 1.02 | High |
| Unicorn Horn | 92 | 0.130 | 0.135 | 0.128 | 0.147 | 1.04 | High |
| Fairy Bat Dragon [FR] | 90 | 0.175 | 0.170 | 0.137 | 0.182 | 0.97 | High |
| Kangaroo [FR] | 89 | 0.115 | 0.121 | 0.113 | 0.133 | 1.05 | High |
| Giant Panda [FR] | 82 | 1.200 | 1.205 | 1.092 | 1.257 | 1.00 | High |
| Dalmatian [FR] | 78 | 0.350 | 0.360 | 0.345 | 0.376 | 1.03 | High |
| Chocolate Chip Bat Dragon [FR] | 73 | 0.245 | 0.232 | 0.209 | 0.252 | 0.94 | High |
| Bat Dragon [FR] | 68 | 5.125 | 5.141 | 5.008 | 5.242 | 1.00 | High |
| Spring Bunny Hood | 65 | 0.031 | 0.036 | 0.032 | 0.045 | 1.16 | Medium |
| Shadow Dragon [FR] | 63 | 3.720 | 3.735 | 3.505 | 3.835 | 1.00 | High |
| Rainbow Maker | 63 | 0.385 | 0.393 | 0.379 | 0.414 | 1.02 | High |
| Frostbite Bear [MFR] | 63 | 4.450 | 4.755 | 4.188 | 5.468 | 1.07 | Medium |
| Gemstone Egg | 62 | 0.013 | 0.013 | 0.013 | 0.019 | 1.00 | High |
| Hedgehog [FR] | 61 | 0.407 | 0.420 | 0.409 | 0.439 | 1.03 | High |
| Tiny Wings | 60 | 0.065 | 0.068 | 0.062 | 0.076 | 1.04 | High |
| Giraffe [FR] | 60 | 2.550 | 2.543 | 2.462 | 2.587 | 1.00 | High |

## 11. Hour-of-day and weekday distribution (UTC)

- Completed trades: peak 17:00 (987, 7.2%), 18:00 (973), 16:00 (968); trough 03:00 (284, 2.1%), 05:00, 02:00. Peak-to-trough 3.5x. 16-19 UTC alone is 27.4% of the day; 12-20 UTC is 55.8%. The 'since 09-10' subset (9,552 trades) has the same shape (17:00-18:00 7.6-7.7%).
- Weekday (all): Thu 16.1%, Sun 15.9%, Wed 15.4%, Tue 14.7%, Mon 14.3%, Sat 13.8%, Fri 9.8%. Friday is reliably the quiet day (9.1% since 09-10); Thursday the busiest (18.8% since 09-10, partly because the snapshot day is a Thursday).
- Listings: the whole 16,909-row window is one Thursday 16:29-19:41 UTC, so no listing weekday/hour distribution is possible; within the window the posting rate climbs monotonically from ~3,900/h (16:30-17:00) to ~4,500/h (17:00-18:00), ~5,700/h (18:30-19:00), ~6,500/h (19:10-19:20) and 9,708/h in the 19:30 bucket - the US after-school ramp. The 'about 6,400/h' planning figure is the daytime average, not the peak; a collector budget should assume ~10k/h at 19-20 UTC.
- Value Board updates cluster 10:00-17:00 UTC per the task brief, i.e. they land BEFORE the daily trade peak; a prediction refresh at ~15:00 UTC would precede 45% of the day's completed trades.

| Hour UTC | Completed (all 60 d) | % | Completed since 09-10 | % | Listings in 3.2 h window |
|---|---|---|---|---|---|
| 00 | 360 | 2.6% | 227 | 2.4% | 0 |
| 01 | 330 | 2.4% | 219 | 2.3% | 0 |
| 02 | 298 | 2.2% | 215 | 2.3% | 0 |
| 03 | 284 | 2.1% | 205 | 2.2% | 0 |
| 04 | 305 | 2.2% | 223 | 2.4% | 0 |
| 05 | 296 | 2.2% | 196 | 2.1% | 0 |
| 06 | 317 | 2.3% | 224 | 2.4% | 0 |
| 07 | 311 | 2.3% | 219 | 2.3% | 0 |
| 08 | 419 | 3.1% | 293 | 3.1% | 0 |
| 09 | 442 | 3.2% | 289 | 3.0% | 0 |
| 10 | 512 | 3.7% | 354 | 3.7% | 0 |
| 11 | 569 | 4.2% | 404 | 4.3% | 0 |
| 12 | 643 | 4.7% | 442 | 4.7% | 0 |
| 13 | 721 | 5.3% | 499 | 5.3% | 0 |
| 14 | 839 | 6.1% | 614 | 6.5% | 0 |
| 15 | 932 | 6.8% | 684 | 7.2% | 0 |
| 16 | 968 | 7.1% | 694 | 7.3% | 2002 (from 16:29) |
| 17 | 987 | 7.2% | 716 | 7.6% | 4670 |
| 18 | 973 | 7.1% | 727 | 7.7% | 5016 |
| 19 | 815 | 6.0% | 573 | 6.0% | 5221 (to 19:41) |
| 20 | 751 | 5.5% | 481 | 5.1% | 0 |
| 21 | 638 | 4.7% | 390 | 4.1% | 0 |
| 22 | 497 | 3.6% | 301 | 3.2% | 0 |
| 23 | 449 | 3.3% | 288 | 3.0% | 0 |

## 12. Trader concentration and profile stats

- Listings (16,909 rows, 5,361 posters): the top 1% (54 accounts) post 8.7% of listings, the top 10% (537 accounts) 34.6%; the single biggest poster (dragotahate, 10880087964) has 127 listings (0.8%) in 3.2 h, then CatNoirq11 73, MegalozavrWarface 66, Vludik222111 54, Lu_Wen6 44, VlodosPoperos 42. Median 2 listings per poster, mean 3.15, P90 6; 37.2% of posters have exactly one listing. Gini 0.45 - a broad market, not a whale market.
- Completed (13,656 rows, 1,472 uids): top 1% = 1.6%, top 10% = 13.4%, median 11 per uid, P90 12, max 21, Gini 0.20. This flatness is an artefact: profile pages expose roughly the last dozen completed trades per trader, so completed.json is 'last ~12 trades x 1,472 traders', not a census.
- Profiles (778 of 1,569 fetched profiles carry stats): median posted 39, accepted 20, completed 17, failed 34; mean posted 102, completed 50; P90 posted 262; max posted 2,057 / completed 1,280. Median completed/posted = 0.42, so under half of what a typical trader posts ever completes.
- Join dates of profiled traders skew very new: Sept 2026 = 172, Aug 2026 = 170, Jul = 73, Jun = 55; only 9 joined before Sept 2025. Roughly 44% of active traders joined in the last two months.
- Repost spam is minor: 220 listings (1.3%) are exact repeats by the same author within the window (191 groups, max 8 copies). Identical ads across MANY accounts are common templates rather than bots: 'Gemstone Egg for Add' by 50 different accounts, 'Gemstone Egg for Upgrade' 20, 'Strawberry Shortcake Bat Dragon [FR] for Upgrade' 16, 'Owl [FR] for Add' 16, 'Frost Dragon [FR] for Add' 16.

| Metric | Listings (authorRobloxId) | Completed (uid) |
|---|---|---|
| Rows / posters | 16909 / 5361 | 13656 / 1472 |
| Top 1% of posters share | 1464 rows (8.7%) from 54 accounts | 217 rows (1.6%) from 15 accounts |
| Top 10% of posters share | 5852 rows (34.6%) from 537 accounts | 1829 rows (13.4%) from 148 accounts |
| Top single poster | 127 rows (0.8%) | 21 rows (0.2%) |
| Median / mean / P90 rows per poster | 2 / 3.15 / 6 | 11 / 9.28 / 12 |
| Posters with exactly 1 row | 1992 (37.2%) | 64 (4.3%) |
| Gini coefficient | 0.450 | 0.204 |

## 13. Use of signs (Add / Upgrade / Downgrade / tier wildcards)

- Signs appear ONLY on the lookingFor side in both datasets (0 uses in offering). 5,505 listings (32.6%) contain at least one sign and 3,296 listing sides are signs only ('my X for Add/Upgrade').
- Listings: Add 3,681 (280 with a numeric add value, median 0.72, mean 0.62), Upgrade 1,400, Exotics 608, Megas 580, SmallAdd 442 (75 numeric, median 0.040), MidTiers 432, Downgrade 365, HighTiers 266, PetWears 256, AnyPotions 120, Old 78, LowTiers 70. Upgrade requests outnumber Downgrade 3.8:1.
- Completed: only 529 trades (3.9%) contain a sign and 89 sides are sign-only, so sign-based asks convert far less often than concrete asks (32.6% of asks vs 3.9% of completions). Add 279 (31 numeric, median 0.50), SmallAdd 193 (36 numeric, median 0.025), Upgrade 32, Exotics 24, AnyPotions 21, MidTiers 19, Megas 19, Downgrade 15, PetWears 14, HighTiers 10, LowTiers 5, Old 1.
- signValue is stored as a string and is dirty ('.8', '1.', '.10' appear); the collector/engine should normalise it before use.
- For the engine: a listing whose lookingFor is only 'Add'/'Upgrade' is still a supply signal for the offered item, and the numeric Add values (median 0.5-0.7 value units) can be priced; the tier wildcards cannot.

| Sign | Listing uses | Listing numeric values (median) | Completed uses | Completed numeric values (median) |
|---|---|---|---|---|
| Add | 3681 | 280 (0.722) | 279 | 31 (0.500) |
| Upgrade | 1400 | 0 | 32 | 0 |
| Exotics | 608 | 0 | 24 | 0 |
| Megas | 580 | 0 | 19 | 0 |
| SmallAdd | 442 | 75 (0.040) | 193 | 36 (0.025) |
| MidTiers | 432 | 0 | 19 | 0 |
| Downgrade | 365 | 0 | 15 | 0 |
| HighTiers | 266 | 0 | 10 | 0 |
| PetWears | 256 | 0 | 14 | 0 |
| AnyPotions | 120 | 0 | 21 | 0 |
| Old | 78 | 0 | 1 | 0 |
| LowTiers | 70 | 0 | 5 | 0 |

## 14. Typical trade size (items per side, value per trade, category mix)

- Listings: mean 3.19 items offered vs 2.20 wanted (median 2 vs 1, P90 8 vs 4); 49.3% of offering sides and 54.4% of lookingFor sides hold a single item; 20.7% are 1-for-1; 33.7% are many-for-1; 3.3% hit the 18-slot cap on at least one side.
- Completed: mean 3.28 offered vs 2.02 wanted; 70.9% of completed trades have a SINGLE lookingFor item and 50.2% are many-for-1 - the dominant completed shape is 'bundle of small things for one target'. 1-for-1 is 20.7%; 2.7% hit the 18 cap.
- Value per completed trade (13,127 fallback-priced): median offering 0.125 / lookingFor 0.120 value units (about 7% of a Frost Dragon); mean 0.695; P25 0.019, P75 0.610, P90 1.725 (exactly one Frost Dragon), max 41.06. 46.6% of trades have a larger side under 0.1, 25.7% in 0.1-0.5, 9.7% in 0.5-1, 9.9% in 1-2, 5.0% in 2-5, 2.3% in 5-10, 0.7% in 10-25, 0.1% in 25-100, none above 100.
- Traded VALUE by tier (fallback-priced completed): regular pets 39.5%, mega 38.4%, neon 18.8%, non-pet items 3.2%. Megas are 11% of entries but 38% of value.
- Entry mix (listings offering / lookingFor): regular pets 38.0% / 37.8%, mega 15.4% / 10.3%, neon 13.9% / 8.1%, Food (potions) 12.0% / 11.0%, PetWear 9.2% / 3.4%, Eggs 7.4% / 5.4%, signs 0% / 22.3%. Completed lookingFor is heavier in Food (20.0%) and Eggs (12.4%) than listings, i.e. asks for potions/eggs complete more readily than asks for pets.

| Metric | Listings offering | Listings lookingFor | Completed offering | Completed lookingFor |
|---|---|---|---|---|
| Mean items | 3.19 | 2.20 | 3.28 | 2.02 |
| Median items | 2 | 1 | 2 | 1 |
| P90 items | 8 | 4 | 7 | 4 |
| Share with 1 item | 49.3% | 54.4% | 37.7% | 70.9% |
| Share with 18 items (cap) | 2.6% | 0.8% | 1.6% | 1.2% |
| 1-for-1 trades | 20.7% |  | 20.7% |  |
| Many-for-1 trades | 33.7% |  | 50.2% |  |
| Median side value (fallback-priced) | 0.160 | 0.163 | 0.125 | 0.120 |

## 15. Stale demand tags and other surprises

- Demand tags contradict volume. Items tagged LOW that are among the most traded: Fairytale Egg (2,126 completed mentions, 886 offered / 222 wanted live), Retired Egg (836), Chihuahua (426), Throwback Egg (426), Mochi Meow (407), Endangered Egg (375), Huntsman Robin (358), Purrowl (220), Basic Egg (192), Little Lamb (190). Items tagged HIGH with almost no trades: Candy Flare Mega Neon Paint (1 mention), Halloween Slime MN Paint (2), Electric Tide MN Paint (5), Campfire Stories MN Paint (6), Velvet Fuchsia (7), Tropical Surge (9), Frosty Glow (12), Royal Mistletroll (30 completed but 121 wanted live), Orchid Butterfly (41), Blue Dog (42).
- Median listing want/offer by tag is only 0.59 (High) vs 0.43 (Medium) vs 0.31 (Low): the tag has some signal but the spread is small and 80% of High-tagged items are still net-offered.
- The market's unit of account is mispriced: Ride-A-Pet Potion (list 0.006) clears at a median 0.009 when alone on a side (n=1,161) and 1.23x across 1,912 dominant sides; because potions sit in 36% of trades, any implied-value solver that trusts the potion list value will read every potion-paid pet as 'overpaid' by ~25-45%.
- Egg floor values are wrong by an order of magnitude: Retired Egg 0.0002 -> ~0.003 realised, Throwback Egg 0.0001 -> ~0.0004, Fairytale Egg 0.0002 -> ~0.0004, Crystal Egg 0.0004 -> ~0.0006, Paint Sealer 0.001 -> ~0.004. Eggs are 12.4% of completed lookingFor entries, so this is not a corner case.
- Water Walking Potion is listed at 0.240 (40x a Ride potion) but appears once in 60 days; Heart Potion 0.020 appears 3 times; Super Age-Up Potion is wanted 5 times and never offered.
- fg (full grown) is set on only 680 of 99,502 pet entries (0.7%), led by Frostbite Bear 32, Cow 20, Chocolate Chip Bat Dragon 19, Purrowl 15 - too sparse to model, safe to ignore.
- allowCounters is true on 0 of 16,909 listings although the key exists on 460 rows; either the field is always false or the RSC extractor drops it.
- 29 completed-trade ids also appear in the live listing snapshot, i.e. ~0.2% of the 3.2 h listings completed within the window - a usable 'time to fill' signal if the collector kept listing timestamps.
- Only 0.9% of pets (7) have FR >= 1 and one (Bat Dragon 5.125) is above 5; 73% of pets are priced below 0.01. The prediction problem is really about ~100 pets above 0.05.

| Item tagged LOW demand | Cat | Completed mentions | Live wanted | Live offered | List value |
|---|---|---|---|---|---|
| Fairytale Egg | Eggs | 2126 | 222 | 886 | 0.0002 |
| Retired Egg | Eggs | 836 | 155 | 945 | 0.0002 |
| Chihuahua | Pets | 426 | 96 | 186 | 0.007 |
| Throwback Egg | Eggs | 426 | 24 | 433 | 0.0001 |
| Mochi Meow | Pets | 407 | 151 | 148 | 0.004 |
| Endangered Egg | Eggs | 375 | 2 | 171 | 0.0002 |
| Huntsman Robin | Pets | 358 | 46 | 67 | 0.004 |
| Purrowl | Pets | 220 | 57 | 111 | 0.004 |
| Basic Egg | Eggs | 192 | 11 | 191 | 0.0001 |
| Little Lamb | Pets | 190 | 40 | 76 | 0.004 |
| Cracked Egg | Eggs | 164 | 33 | 24 | 0.0001 |
| Rubber Ducky | Pets | 150 | 1 | 99 | 0.003 |
| Pinkypillar | Pets | 135 | 3 | 50 | 0.003 |
| Ginger Cat | Pets | 133 | 44 | 67 | 0.004 |
| Princess Mare | Pets | 119 | 4 | 37 | 0.003 |

## 16. Value clustering in items.json (placeholder values)

- 781 pets share only 198 distinct (FR, NFR, MFR) triples and 433 pets (55.4%) sit on a triple shared by 10 or more pets. The five most common triples (0.005/0.01/0.035; 0.0055/0.011/0.04; 0.0045/0.009/0.03; 0.004/0.008/0.025; 0.0035/0.007/0.02) cover 228 pets and all have NFR/FR exactly 2.00.
- Non-pet items: 790 items use just 97 distinct values; 0.0065 (68 items), 0.004 (64), 0.002 (63), 0.003 (55), 0.001 (47) alone cover 38% of them.
- Pet FR distribution: 251 pets (32.1%) below 0.005, 320 (41.0%) 0.005-0.01, 126 (16.1%) 0.01-0.05, 52 (6.7%) 0.05-0.2, 24 (3.1%) 0.2-1, 7 (0.9%) 1-5, 1 (0.1%) above 5.
- Consequence for the model: for ~55% of the catalogue a 30-day 'value move' is a change of template bucket, not a continuous price; the history model should treat these as categorical steps (e.g. 0.004 -> 0.0045) and the backtest should report accuracy separately for template-priced vs individually-priced items.
- Egg values for reference (44 eggs): Safari 1.175, Jungle 0.46, Farm 0.45, Blue 0.24, Pink 0.18, Christmas 0.1025, Aussie 0.031, Gemstone 0.013 ... Crystal 0.0004, Fairytale/Endangered/Retired 0.0002, Cracked/Basic/Throwback 0.0001.

| FR / NFR / MFR triple | Pets on it | NFR/FR | MFR/NFR |
|---|---|---|---|
| 0.005 / 0.01 / 0.035 | 60 | 2.00 | 3.50 |
| 0.0055 / 0.011 / 0.04 | 44 | 2.00 | 3.64 |
| 0.0045 / 0.009 / 0.03 | 43 | 2.00 | 3.33 |
| 0.004 / 0.008 / 0.025 | 41 | 2.00 | 3.12 |
| 0.0035 / 0.007 / 0.02 | 40 | 2.00 | 2.86 |
| 0.0065 / 0.015 / 0.06 | 28 | 2.31 | 4.00 |
| 0.00625 / 0.0125 / 0.05 | 28 | 2.00 | 4.00 |
| 0.0031 / 0.0055 / 0.011 | 23 | 1.77 | 2.00 |
| 0.006 / 0.012 / 0.045 | 22 | 2.00 | 3.75 |
| 0.0031 / 0.005 / 0.01 | 18 | 1.61 | 2.00 |
| 0.008 / 0.025 / 0.1 | 18 | 3.12 | 4.00 |
| 0.0075 / 0.0225 / 0.09 | 17 | 3.00 | 4.00 |
| 0.007 / 0.02 / 0.08 | 16 | 2.86 | 4.00 |
| 0.00675 / 0.0175 / 0.07 | 14 | 2.59 | 4.00 |
| 0.00375 / 0.0075 / 0.0225 | 11 | 2.00 | 3.00 |

## 17. Recommendations for the engine and collectors (from the analyst seat, no files edited)

- Raise the internal price of Ride-A-Pet Potion to ~0.008-0.009 and Fly-A-Pet to ~0.014 before solving implied values; otherwise every potion-paid trade looks like a 25-45% overpay and the 'overpay' signal is noise.
- Floor egg/consumable values at their realised medians (Retired Egg ~0.003, Paint Sealer ~0.004, Throwback/Fairytale ~0.0004) or exclude eggs from the implied-value solver; they are 12% of completed asks.
- When pricing NP/F/R/N/M states for the 752 pets without state values, use the tier reference x these medians: np 0.992, f/r 0.994 (regular); n 1.044, nf/nr 1.000 (neon); m 1.281, mf/mr 1.014 (mega) - and flag the 2019-2020 legendaries where NP/N/M carry a premium (Shadow Dragon, Monkey King, Diamond Hummingbird, Flamingo, Frost Dragon, Giraffe, Parrot).
- Treat completed.json as 'last ~12 trades per profiled trader', so weight by trader, not by row, and do not read the week-over-week ramp as growth.
- Schedule listing collection weight toward 17-20 UTC (rate 6-10k/h) and keep the 15-call/429 budget in mind: at ~9.7k/h a 12 h window would exceed 100k rows, well above the current 16.9k.
- Surface 'want/offer leaders with Low tag' (Manta Ray, Rhino Beetle, Garden Egg, Rainbow Trout, Candy Cane Snail, Kitty Bat, Royal Mistletroll) and 'net-dumped High-tagged' (Fairy Bat Dragon, Cow, Owl, Turtle, Parrot, Kangaroo) as explicit Opportunity/Alert rows - they are the cheapest strong signals in the data.

## Caveats

- listings.json covers 3.21 h on one Thursday (16:29-19:41 UTC), not 12 h; hour-of-day and weekday statistics for listings are therefore not available and the 'most wanted / offered' lists reflect a single afternoon.
- completed.json is a profile-page sample (~12 most recent completed trades per trader, 1,472 traders); volume by week reflects when profiles were fetched, and heavy traders are under-represented (Gini 0.20).
- Only 29 of 781 pets carry per-potion-state values, so all potion-state premium statistics are based on 28 pets (mostly 2019-2020 legendaries) and may not generalise; strict list pricing covers just 34% of completed trades, fallback pricing (median state ratio x tier reference) covers 96% but is an estimate.
- Per-variant premiums attribute a whole side's ratio to the variant that makes up >= 50% of that side; with mixed bundles this is noisy, which is why the single-variant-side table (section 10) is the preferred read.
- Values were rounded for display (4 significant digits below 0.01, 3 decimals otherwise); the full report with every table is in the scratchpad file report.md and the script market.pl reproduces it in ~7 s.
- Trader names shown are the public authorName field from listings; profile names in profiles.json are all null in this snapshot.

