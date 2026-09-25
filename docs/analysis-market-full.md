# AMVGG market analysis (state snapshot, generated Thu Sep 24 20:26:55 2026 UTC)

## 0. Dataset overview

| Dataset | Rows | Distinct posters | Time range (UTC) | Entries | Priceable entries (strict) | Fully priceable trades (strict) | Priceable entries (fallback) | Fully priceable trades (fallback) |
|---|---|---|---|---|---|---|---|---|
| completed.json | 13656 | 1472 | 2026-07-26T21:09:05.983Z .. 2026-09-24T19:43:14.232Z | 72434 | 50036 (69.1%) | 4632 (33.9%) | 71802 (99.1%) | 13127 (96.1%) |
| listings.json | 16909 | 5361 | 2026-09-24T16:29:01.858Z .. 2026-09-24T19:41:49.006Z (3.21 h) | 91187 | 58641 (64.3%) | 4646 (27.5%) | 82889 (90.9%) | 11404 (67.4%) |
| items.json | 1571 | - | - | - | - | - | - | - |
| profiles.json | 1569 | - | - | - | - | - | - | - |

Pricing note: only 29 of 781 pets carry NP/F/R/N/NF/NR/M/MF/MR values in items.json (the rest have FR, NFR, MFR only), so STRICT pricing drops any trade with e.g. a no-potion pet that has no NP value. FALLBACK pricing estimates a missing state as reference-tier value x median state ratio (f/fr=0.994, m/mfr=1.281, mf/mfr=1.014, mr/mfr=1.014, n/nfr=1.044, nf/nfr=1.000, np/fr=0.992, nr/nfr=1.000, r/fr=0.994).

Listings observed rate: 5262 listings/hour over the 3.21 h window.

| Week starting (UTC) | Completed trades |
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
| 2026-09-24 | 1129 |

## 1. Most traded items in completed trades (60 d)

| Item | Cat | Mentions | Offered | Wanted | Distinct trades | Wanted share | Top variant | List value (FR/v) |
|---|---|---|---|---|---|---|---|---|
| Ride-A-Pet Potion | Food | 7755 | 4346 | 3409 | 3664 | 44.0% | item (7755) | 0.0065 |
| Fly-A-Pet Potion | Food | 4291 | 2659 | 1632 | 2106 | 38.0% | item (4291) | 0.013 |
| Crystal Egg | Eggs | 2279 | 1041 | 1238 | 212 | 54.3% | item (2279) | 0.0004 |
| Fairytale Egg | Eggs | 2126 | 1146 | 980 | 218 | 46.1% | item (2126) | 0.0002 |
| Cow | Pets | 1166 | 751 | 415 | 968 | 35.6% | FR (692) | 0.210 |
| Strawberry Shortcake Bat Dragon | Pets | 858 | 494 | 364 | 743 | 42.4% | FR (581) | 0.250 |
| Retired Egg | Eggs | 836 | 504 | 332 | 129 | 39.7% | item (836) | 0.0002 |
| Turtle | Pets | 829 | 551 | 278 | 679 | 33.5% | FR (555) | 0.150 |
| Pet Handler Pro Certificate | Gifts | 757 | 513 | 244 | 524 | 32.2% | item (757) | 0.012 |
| Cryptid | Pets | 719 | 386 | 333 | 618 | 46.3% | FR (467) | 0.865 |
| Kitty Biscuit | Food | 712 | 265 | 447 | 231 | 62.8% | item (712) | 0.0065 |
| Fairy Bat Dragon | Pets | 650 | 384 | 266 | 537 | 40.9% | FR (378) | 0.175 |
| Paint Sealer | Toys | 607 | 299 | 308 | 133 | 50.7% | item (607) | 0.00055 |
| Cattuccino | Pets | 603 | 347 | 256 | 228 | 42.5% | NP (518) | 0.006 |
| Frostbite Bear | Pets | 603 | 325 | 278 | 403 | 46.1% | NP (235) | 0.285 |
| Kangaroo | Pets | 589 | 401 | 188 | 522 | 31.9% | FR (370) | 0.115 |
| Frost Dragon | Pets | 580 | 254 | 326 | 509 | 56.2% | FR (458) | 1.725 |
| Admin Abuse Egg | Eggs | 549 | 367 | 182 | 86 | 33.2% | item (549) | 0.0004 |
| Owl | Pets | 546 | 258 | 288 | 499 | 52.7% | FR (416) | 1.340 |
| Chocolate Chip Bat Dragon | Pets | 515 | 314 | 201 | 462 | 39.0% | FR (345) | 0.245 |
| Unicorn Horn | PetWear | 512 | 310 | 202 | 447 | 39.5% | item (512) | 0.130 |
| Goose | Pets | 506 | 330 | 176 | 470 | 34.8% | FR (190) | 0.217 |
| Siamese Cat | Pets | 501 | 341 | 160 | 471 | 31.9% | NP (111) | 0.135 |
| Candicorn | Pets | 438 | 285 | 153 | 387 | 34.9% | NP (114) | 0.070 |
| Munchkin Cat | Pets | 431 | 267 | 164 | 394 | 38.1% | NP (127) | 0.065 |

Top 25 by exact variant (name + potion state):

| Variant | Mentions |
|---|---|
| Ride-A-Pet Potion | 7755 |
| Fly-A-Pet Potion | 4291 |
| Crystal Egg | 2279 |
| Fairytale Egg | 2126 |
| Retired Egg | 836 |
| Pet Handler Pro Certificate | 757 |
| Kitty Biscuit | 712 |
| Cow [FR] | 692 |
| Paint Sealer | 607 |
| Strawberry Shortcake Bat Dragon [FR] | 581 |
| Turtle [FR] | 555 |
| Admin Abuse Egg | 549 |
| Cattuccino [NP] | 518 |
| Unicorn Horn | 512 |
| Cryptid [FR] | 467 |
| Frost Dragon [FR] | 458 |
| Throwback Egg | 426 |
| Owl [FR] | 416 |
| Spring Bunny Hood | 388 |
| Fairy Bat Dragon [FR] | 378 |
| Endangered Egg | 375 |
| Kangaroo [FR] | 370 |
| Mochi Meow [NP] | 355 |
| Huntsman Robin [NP] | 347 |
| Chocolate Chip Bat Dragon [FR] | 345 |

Total item mentions: 71802 across 1373 distinct items; 40 items make up 50% of all mentions.

## 2. Listings: most wanted vs most offered (live snapshot)

Most WANTED (lookingFor side):

| Item | Cat | Wanted mentions | Distinct listings | Offered mentions | Want/Offer | List value (FR/v) |
|---|---|---|---|---|---|---|
| Ride-A-Pet Potion | Food | 2609 | 916 | 3519 | 0.74 | 0.0065 |
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
| Cow | Pets | 284 | 229 | 860 | 0.33 | 0.210 |
| Dalmatian | Pets | 284 | 245 | 258 | 1.10 | 0.350 |
| Evil Unicorn | Pets | 276 | 231 | 193 | 1.43 | 0.615 |
| Turtle | Pets | 268 | 187 | 605 | 0.44 | 0.150 |
| Cabbit | Pets | 262 | 244 | 299 | 0.88 | 0.170 |
| Hedgehog | Pets | 257 | 237 | 208 | 1.24 | 0.407 |
| Kitty Bat | Pets | 252 | 136 | 64 | 3.94 | 0.0065 |
| Balloon Unicorn | Pets | 248 | 229 | 399 | 0.62 | 0.925 |
| Owl | Pets | 238 | 219 | 611 | 0.39 | 1.340 |
| Bat Dragon | Pets | 238 | 217 | 195 | 1.22 | 5.125 |
| Cattuccino | Pets | 226 | 72 | 306 | 0.74 | 0.006 |
| Fairytale Egg | Eggs | 222 | 20 | 886 | 0.25 | 0.0002 |
| Munchkin Cat | Pets | 219 | 209 | 346 | 0.63 | 0.065 |

Most OFFERED (offering side):

| Item | Cat | Offered mentions | Distinct listings | Wanted mentions | Want/Offer | List value (FR/v) |
|---|---|---|---|---|---|---|
| Ride-A-Pet Potion | Food | 3519 | 1659 | 2609 | 0.74 | 0.0065 |
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
| Kitty Biscuit | Food | 493 | 143 | 173 | 0.35 | 0.0065 |
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

## 3. Want/Offer ratio leaders and laggards (min 20 total mentions in listings)

Leaders (demand >> supply):

| Item | Cat | Wanted | Offered | Want/Offer (smoothed +0.5) | Demand tag | List value |
|---|---|---|---|---|---|---|
| Manta Ray | Pets | 25 | 1 | 17.00 | Low | 0.00475 |
| Rhino Beetle | Pets | 40 | 2 | 16.20 | Low | 0.004 |
| Garden Egg | Eggs | 44 | 4 | 9.89 | Low | 0.00065 |
| Otter | Pets | 18 | 2 | 7.40 | Low | 0.003 |
| Rainbow Trout | Pets | 34 | 5 | 6.27 | Low | 0.0031 |
| Candy Cane Snail | Pets | 43 | 7 | 5.80 | Low | 0.0065 |
| Crystal Egg | Eggs | 809 | 161 | 5.01 | Medium | 0.0004 |
| Ankylosaurus | Pets | 20 | 4 | 4.56 | Low | 0.005 |
| Influencer Gibbon | Pets | 40 | 9 | 4.26 | Low | 0.009 |
| Jumping Spider | Pets | 25 | 6 | 3.92 | Low | 0.0035 |
| Kitty Bat | Pets | 252 | 64 | 3.91 | Medium | 0.0065 |
| Kage Crow | Pets | 42 | 11 | 3.70 | Low | 0.006 |
| Flaming Zebra | Pets | 16 | 4 | 3.67 | Low | 0.00675 |
| Royal Mistletroll | Pets | 121 | 33 | 3.63 | High | 0.160 |
| River Otter | Pets | 37 | 10 | 3.57 | Low | 0.0031 |
| Naughty Mistletroll | Pets | 73 | 21 | 3.42 | Medium | 0.018 |
| Chicken | Pets | 49 | 14 | 3.41 | Medium | 0.011 |
| Patchy Bear | Pets | 37 | 12 | 3.00 | Low | 0.0031 |
| Evil Rock | Pets | 22 | 7 | 3.00 | Medium | 0.008 |
| Bunny | Pets | 27 | 9 | 2.89 | Low | 0.0031 |

Laggards (supply >> demand):

| Item | Cat | Wanted | Offered | Want/Offer (smoothed +0.5) | Demand tag | List value |
|---|---|---|---|---|---|---|
| Admin Abuse Box | Gifts | 0 | 112 | 0.00 | Low | 0.0003 |
| Festive Wagon | Vehicles | 0 | 75 | 0.01 | Low | 0.003 |
| Ant | Pets | 0 | 56 | 0.01 | Low | 0.003 |
| Squid | Pets | 0 | 55 | 0.01 | Low | 0.008 |
| Ratatoskr | Pets | 0 | 48 | 0.01 | Low | 0.0035 |
| Toucan | Pets | 0 | 45 | 0.01 | Low | 0.0035 |
| Black Rhino | Pets | 0 | 45 | 0.01 | Low | 0.0031 |
| Sasquatch | Pets | 0 | 42 | 0.01 | Low | 0.0055 |
| Golden Egg | Eggs | 0 | 41 | 0.01 | Medium | 0.002 |
| Starfish | Pets | 0 | 41 | 0.01 | Low | 0.0035 |
| Purple Heart Glasses | PetWear | 0 | 40 | 0.01 | Low | 0.0025 |
| Budgie Witch | Pets | 0 | 39 | 0.01 | Low | 0.0031 |
| Grinmoire | Pets | 0 | 36 | 0.01 | Low | 0.0031 |
| Muskrat | Pets | 0 | 36 | 0.01 | Low | 0.0031 |
| Love Letter | PetWear | 0 | 35 | 0.01 | Low | 0.0015 |
| Endangered Egg | Eggs | 2 | 171 | 0.01 | Low | 0.0002 |
| Peahen | Pets | 0 | 33 | 0.01 | Medium | 0.011 |
| Zodiac Minion Chick | Pets | 0 | 33 | 0.01 | Low | 0.006 |
| Zebra | Pets | 0 | 33 | 0.01 | Low | 0.0031 |
| Rubber Ducky | Pets | 1 | 99 | 0.02 | Low | 0.0031 |

Median want/offer ratio by the site's demand tag (items with >=20 mentions):

| Demand tag | Items | Median W/O | Mean W/O |
|---|---|---|---|
| High | 80 | 0.59 | 0.72 |
| Low | 242 | 0.31 | 0.87 |
| Medium | 246 | 0.43 | 0.62 |

568 items have >=20 mentions; 107 (18.8%) are net-wanted (W/O > 1).

## 4. Potion-state value ratios (from items.json, pets only)

| Ratio | Pets | Median | Mean | P25 | P75 | P10 | Ratio > 1 (state worth MORE than reference) | Ratio == 1 |
|---|---|---|---|---|---|---|---|---|
| Regular: np / fr | 28 | 0.991 | 0.995 | 0.964 | 1.015 | 0.777 | 11 (39.3%) | 2 (7.1%) |
| Regular: f / fr | 28 | 0.994 | 1.053 | 0.982 | 1.000 | 0.946 | 4 (14.3%) | 4 (14.3%) |
| Regular: r / fr | 28 | 0.994 | 1.037 | 0.981 | 1.000 | 0.931 | 3 (10.7%) | 5 (17.9%) |
| Neon: n / nfr | 28 | 1.044 | 1.205 | 1.010 | 1.212 | 0.925 | 24 (85.7%) | 1 (3.6%) |
| Neon: nf / nfr | 28 | 1.000 | 1.161 | 1.000 | 1.022 | 0.981 | 13 (46.4%) | 9 (32.1%) |
| Neon: nr / nfr | 28 | 1.000 | 1.151 | 1.000 | 1.015 | 0.981 | 12 (42.9%) | 10 (35.7%) |
| Mega: m / mfr | 28 | 1.307 | 1.399 | 1.050 | 1.547 | 1.008 | 25 (89.3%) | 1 (3.6%) |
| Mega: mf / mfr | 28 | 1.014 | 1.199 | 1.004 | 1.046 | 1.000 | 22 (78.6%) | 4 (14.3%) |
| Mega: mr / mfr | 28 | 1.014 | 1.178 | 1.004 | 1.042 | 1.000 | 22 (78.6%) | 4 (14.3%) |

Pets where no-potion is valued ABOVE fly-ride (largest inversions):

| Pet | NP/FR | FR value | NP value |
|---|---|---|---|
| Diamond Hummingbird | 2.087 | 0.058 | 0.120 |
| Monkey King | 1.667 | 0.210 | 0.350 |
| Flamingo | 1.224 | 0.122 | 0.150 |
| Shadow Dragon | 1.183 | 3.720 | 4.400 |
| Coconut Friend | 1.077 | 0.0065 | 0.007 |
| Giraffe | 1.031 | 2.550 | 2.630 |
| Frost Dragon | 1.029 | 1.725 | 1.775 |
| Crow | 1.010 | 0.965 | 0.975 |
| Bat Dragon | 1.010 | 5.125 | 5.175 |
| Parrot | 1.009 | 1.070 | 1.080 |
| Owl | 1.007 | 1.340 | 1.350 |
| Evil Unicorn | 1.000 | 0.615 | 0.615 |
| Arctic Reindeer | 1.000 | 0.287 | 0.287 |
| Giant Panda | 0.992 | 1.200 | 1.190 |
| Blazing Lion | 0.991 | 1.100 | 1.090 |

NP/FR ratio by FR value tier (how much the potions add, by price band):

| FR tier | Pets | Median NP/FR | Median F/FR | Median R/FR | NP > FR |
|---|---|---|---|---|---|
| <0.05 | 5 | 0.550 | 0.988 | 0.875 | 1 (20.0%) |
| 0.05-0.2 | 5 | 0.913 | 0.978 | 0.957 | 2 (40.0%) |
| 0.2-0.5 | 6 | 0.976 | 0.984 | 0.984 | 1 (16.7%) |
| 0.5-1 | 5 | 0.989 | 0.994 | 0.994 | 1 (20.0%) |
| 1-3 | 6 | 1.008 | 0.996 | 0.996 | 4 (66.7%) |
| 3-10 | 2 | 1.096 | 1.000 | 1.000 | 2 (100.0%) |

All pets that carry full potion-state values (the only ones the site prices per state):

| Pet | Origin | FR | NP | F | R | NP/FR | NFR | N | N/NFR | MFR | M | M/MFR |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Bat Dragon | Halloween Event (2019) | 5.125 | 5.175 | 5.125 | 5.125 | 1.01 | 12.050 | 12.650 | 1.05 | 37.250 | 40.000 | 1.07 |
| Shadow Dragon | Halloween Event (2019) | 3.720 | 4.400 | 3.720 | 3.720 | 1.18 | 7.425 | 10.000 | 1.35 | 18.200 | 28.750 | 1.58 |
| Giraffe | Safari Egg | 2.550 | 2.630 | 2.550 | 2.550 | 1.03 | 5.050 | 6.100 | 1.21 | 15.950 | 24.500 | 1.54 |
| Frost Dragon | Christmas Event (2019) | 1.725 | 1.775 | 1.725 | 1.725 | 1.03 | 3.030 | 3.450 | 1.14 | 7.700 | 13.750 | 1.79 |
| Owl | Farm Egg | 1.340 | 1.350 | 1.335 | 1.335 | 1.01 | 3.320 | 3.475 | 1.05 | 10.150 | 13.000 | 1.28 |
| Giant Panda | Crystal/Basic Egg | 1.200 | 1.190 | 1.195 | 1.195 | 0.99 | 4.700 | 4.725 | 1.01 | 18.650 | 18.850 | 1.01 |
| Blazing Lion | Campfire Cookie Lure | 1.100 | 1.090 | 1.095 | 1.095 | 0.99 | 4.350 | 4.375 | 1.01 | 17.200 | 17.700 | 1.03 |
| Parrot | Jungle Egg | 1.070 | 1.080 | 1.065 | 1.065 | 1.01 | 2.180 | 2.650 | 1.22 | 5.625 | 10.600 | 1.88 |
| Crow | Farm Egg | 0.965 | 0.975 | 0.960 | 0.960 | 1.01 | 2.200 | 2.425 | 1.10 | 6.700 | 9.750 | 1.46 |
| Balloon Unicorn | Summer State Fair (2024) | 0.925 | 0.915 | 0.920 | 0.920 | 0.99 | 3.100 | 3.150 | 1.02 | 11.500 | 12.100 | 1.05 |
| African Wild Dog | UGC Event | 0.865 | 0.855 | 0.860 | 0.860 | 0.99 | 3.075 | 3.100 | 1.01 | 11.650 | 12.150 | 1.04 |
| Cryptid | Halloween Event (2025) | 0.865 | 0.855 | 0.860 | 0.860 | 0.99 | 2.350 | 2.375 | 1.01 | 7.900 | 8.100 | 1.03 |
| Evil Unicorn | Halloween Event (2019) | 0.615 | 0.615 | 0.610 | 0.610 | 1.00 | 1.135 | 1.375 | 1.21 | 3.950 | 5.600 | 1.42 |
| Diamond Butterfly | Butterfly Sanctuary | 0.410 | 0.400 | 0.405 | 0.405 | 0.98 | 1.550 | 1.575 | 1.02 | 6.000 | 6.500 | 1.08 |
| Hedgehog | Christmas Event (2019) | 0.407 | 0.398 | 0.403 | 0.403 | 0.98 | 1.550 | 1.575 | 1.02 | 6.100 | 6.500 | 1.07 |
| Dalmatian | Christmas Event (2019) | 0.350 | 0.340 | 0.345 | 0.345 | 0.97 | 1.260 | 1.285 | 1.02 | 4.750 | 5.100 | 1.07 |
| Arctic Reindeer | Christmas Event (2019) | 0.287 | 0.287 | 0.282 | 0.282 | 1.00 | 0.570 | 0.700 | 1.23 | 2.075 | 2.900 | 1.40 |
| Monkey King | Monkey Fairground | 0.210 | 0.350 | 0.205 | 0.205 | 1.67 | 0.835 | 1.500 | 1.80 | 3.340 | 6.400 | 1.92 |
| Cow | Farm Egg | 0.210 | 0.198 | 0.205 | 0.203 | 0.94 | 0.445 | 0.455 | 1.02 | 1.240 | 1.500 | 1.21 |
| Turtle | Aussie Egg | 0.150 | 0.135 | 0.142 | 0.140 | 0.90 | 0.302 | 0.315 | 1.04 | 0.675 | 1.075 | 1.59 |
| Flamingo | Safari Egg | 0.122 | 0.150 | 0.150 | 0.150 | 1.22 | 0.400 | 0.625 | 1.56 | 1.575 | 2.350 | 1.49 |
| Kangaroo | Aussie Egg | 0.115 | 0.105 | 0.113 | 0.110 | 0.91 | 0.225 | 0.225 | 1.00 | 0.525 | 0.700 | 1.33 |
| Albino Monkey | Monkey Fairground | 0.100 | 0.087 | 0.093 | 0.092 | 0.87 | 0.280 | 0.335 | 1.20 | 1.050 | 1.400 | 1.33 |
| Diamond Hummingbird | Pets Plus Subscription | 0.058 | 0.120 | 0.122 | 0.122 | 2.09 | 0.230 | 0.520 | 2.26 | 0.950 | 2.125 | 2.24 |
| Glacier Kitsune | Winter Festival (2023) | 0.036 | 0.036 | - | - | 1.00 | 0.145 | - | - | 0.600 | - | - |
| Unicorn | Cracked Egg/Pet Egg/Royal Egg | 0.010 | 0.0055 | 0.0085 | 0.0075 | 0.55 | 0.030 | 0.022 | 0.73 | 0.085 | 0.066 | 0.78 |
| Coconut Friend | Summer Festival (2025) | 0.0065 | 0.007 | 0.011 | 0.010 | 1.08 | 0.015 | 0.048 | 3.17 | 0.060 | 0.225 | 3.75 |
| Christmas Spirit | Winter Event (2025) | 0.0055 | 0.00125 | 0.0045 | 0.004 | 0.23 | 0.011 | 0.00625 | 0.57 | 0.040 | 0.030 | 0.75 |
| Mochi Meow | Sugar Festival (2026) | 0.004 | 0.001 | 0.0045 | 0.004 | 0.25 | 0.008 | 0.006 | 0.75 | 0.025 | 0.025 | 1.00 |

## 5. Neon/Regular and Mega/Neon multipliers by tier (items.json)

| FR tier | Pets | Median NFR/FR | P25 | P75 | Median MFR/NFR | P25 | P75 | Median MFR/FR |
|---|---|---|---|---|---|---|---|---|
| <0.05 | 697 | 2.00 | 2.00 | 3.12 | 3.64 | 3.12 | 4.00 | 7.27 |
| 0.05-0.2 | 52 | 3.86 | 2.95 | 4.06 | 4.00 | 3.92 | 4.06 | 15.34 |
| 0.2-0.5 | 15 | 3.22 | 2.80 | 3.82 | 3.94 | 3.60 | 3.97 | 12.86 |
| 0.5-1 | 9 | 2.72 | 2.50 | 3.55 | 3.66 | 3.43 | 3.79 | 9.50 |
| 1-3 | 6 | 2.26 | 1.99 | 3.56 | 3.11 | 2.70 | 3.76 | 6.91 |
| 3-10 | 2 | 2.17 | 2.08 | 2.26 | 2.77 | 2.61 | 2.93 | 6.08 |
| ALL | 781 | 2.00 | 2.00 | 3.42 | 3.75 | 3.12 | 4.00 | 7.50 |

Neon = 4 regulars in-game: NFR/FR < 4 for 644 pets (82.5%), > 4 for 94 (12.0%). Mega = 4 neons: MFR/NFR < 4 for 435 (55.7%), > 4 for 89 (11.4%).

By FR demand tag:

| FR demand | Pets | Median NFR/FR | Median MFR/NFR |
|---|---|---|---|
| High | 61 | 3.07 | 3.79 |
| Low | 499 | 2.00 | 3.42 |
| Medium | 221 | 4.00 | 4.00 |

Extremes: lowest and highest NFR/FR (pets with FR >= 0.1):

| Lowest NFR/FR | ratio | FR | NFR | Highest NFR/FR | ratio | FR | NFR |
|---|---|---|---|---|---|---|---|
| Frost Dragon | 1.76 | 1.725 | 3.030 | Strawberry Tortle | 4.29 | 0.140 | 0.600 |
| Evil Unicorn | 1.85 | 0.615 | 1.135 | Tortoiseshell Guinea Pig | 4.18 | 0.138 | 0.575 |
| Kangaroo | 1.96 | 0.115 | 0.225 | Black-Chested Pheasant | 4.15 | 0.102 | 0.425 |
| Giraffe | 1.98 | 2.550 | 5.050 | Mechapup | 4.09 | 0.107 | 0.440 |
| Arctic Reindeer | 1.98 | 0.287 | 0.570 | Tio De Nadal | 4.09 | 0.115 | 0.470 |
| Shadow Dragon | 2.00 | 3.720 | 7.425 | Royal Mistletroll | 4.06 | 0.160 | 0.650 |
| Turtle | 2.02 | 0.150 | 0.302 | Caterpillar | 4.05 | 0.110 | 0.445 |
| Siamese Cat | 2.02 | 0.135 | 0.273 | Pelican | 4.02 | 0.210 | 0.845 |
| Parrot | 2.04 | 1.070 | 2.180 | Monkey King | 3.98 | 0.210 | 0.835 |
| Cow | 2.12 | 0.210 | 0.445 | Orchid Butterfly | 3.96 | 0.670 | 2.650 |

Extremes: lowest and highest MFR/NFR (pets with FR >= 0.1):

| Lowest MFR/NFR | ratio | NFR | MFR | Highest MFR/NFR | ratio | NFR | MFR |
|---|---|---|---|---|---|---|---|
| Turtle | 2.23 | 0.302 | 0.675 | Strawberry Tortle | 4.21 | 0.600 | 2.525 |
| Kangaroo | 2.33 | 0.225 | 0.525 | Tortoiseshell Guinea Pig | 4.13 | 0.575 | 2.375 |
| Shadow Dragon | 2.45 | 7.425 | 18.200 | Black-Chested Pheasant | 4.06 | 0.425 | 1.725 |
| Frost Dragon | 2.54 | 3.030 | 7.700 | Tio De Nadal | 4.04 | 0.470 | 1.900 |
| Parrot | 2.58 | 2.180 | 5.625 | Royal Mistletroll | 4.04 | 0.650 | 2.625 |
| Cow | 2.79 | 0.445 | 1.240 | Mechapup | 4.03 | 0.440 | 1.775 |
| Siamese Cat | 2.94 | 0.273 | 0.800 | Caterpillar | 4.00 | 0.445 | 1.780 |
| Crow | 3.05 | 2.200 | 6.700 | Monkey King | 4.00 | 0.835 | 3.340 |
| Owl | 3.06 | 3.320 | 10.150 | Pelican | 4.00 | 0.845 | 3.380 |
| Bat Dragon | 3.09 | 12.050 | 37.250 | Chocolate Chip Bat Dragon | 3.99 | 0.790 | 3.150 |

## 6. Overpays and underpays in completed trades (priced with items.json)

Ratio R = offering value / lookingFor value (the poster GIVES the offering side and RECEIVES the lookingFor side; R > 1 means the poster overpaid vs the list).

| Mode | Priceable trades | Median R | Geo-mean R | P10 / P25 / P75 / P90 | Within +/-10% | Within +/-25% | Poster overpays >10% | Poster underpays >10% | Gives >= 2x | Gives <= 0.5x |
|---|---|---|---|---|---|---|---|---|---|---|
| strict pricing | 4632 (33.9%) | 1.000 | 1.003 | 0.846 / 0.960 / 1.059 / 1.225 | 67.1% | 85.7% | 18.6% | 14.1% | 1.2% | 1.5% |
| fallback pricing | 13127 (96.1%) | 1.019 | 1.082 | 0.765 / 0.948 / 1.182 / 1.734 | 49.1% | 70.1% | 32.3% | 18.5% | 8.0% | 3.8% |

The tables below use FALLBACK-priced sides (more coverage); every per-variant figure still requires that variant's own EXACT list value.

R by trade shape (offering count for lookingFor count):

| Shape | Trades | Median R | P25 | P75 | Share R>1.1 |
|---|---|---|---|---|---|
| many(4+) for 1 | 3399 | 1.036 | 0.986 | 1.187 | 34.2% |
| 1 for 1 | 2779 | 1.000 | 0.878 | 1.220 | 32.6% |
| 2 for 1 | 2056 | 1.036 | 0.972 | 1.222 | 36.7% |
| 3 for 1 | 1389 | 1.036 | 0.981 | 1.225 | 36.6% |
| 1 for many(4+) | 919 | 0.994 | 0.879 | 1.146 | 28.8% |
| 1 for 2 | 710 | 0.993 | 0.909 | 1.128 | 27.7% |
| 1 for 3 | 374 | 0.999 | 0.893 | 1.122 | 26.2% |
| 2 for 2 | 326 | 1.008 | 0.960 | 1.099 | 24.8% |
| many(4+) for 2 | 223 | 1.013 | 0.991 | 1.081 | 22.9% |
| many(4+) for many(4+) | 192 | 1.002 | 0.956 | 1.173 | 27.1% |
| 2 for many(4+) | 186 | 0.987 | 0.928 | 1.041 | 21.5% |
| 2 for 3 | 160 | 1.003 | 0.973 | 1.069 | 20.6% |
| 3 for 2 | 141 | 1.007 | 0.978 | 1.046 | 16.3% |
| 3 for many(4+) | 103 | 1.000 | 0.929 | 1.135 | 28.2% |
| many(4+) for 3 | 93 | 1.006 | 0.976 | 1.096 | 24.7% |
| 3 for 3 | 77 | 0.997 | 0.963 | 1.051 | 20.8% |

R by lookingFor value band:

| L value band | Trades | Median R | P25 | P75 | Share R>1.1 | Share R<0.9 |
|---|---|---|---|---|---|---|
| <0.5 | 9576 | 1.037 | 0.923 | 1.282 | 38.8% | 21.7% |
| 0.5-2 | 2527 | 1.009 | 0.975 | 1.053 | 16.5% | 10.1% |
| 2-5 | 662 | 1.006 | 0.978 | 1.036 | 12.4% | 10.6% |
| 5-15 | 315 | 1.002 | 0.983 | 1.024 | 8.3% | 10.2% |
| 15-50 | 47 | 1.000 | 0.988 | 1.018 | 8.5% | 4.3% |

Per-variant market premium: for every trade side where the variant is >=50% of that side's list value, premium = other side value / this side value (so >1 = market pays MORE than the list for that variant, i.e. buyers overpay for it; <1 = it goes for less than list). Min 8 sides.

Biggest OVERPAYS (market > list):

| Variant | Sides (as wanted / as offered) | Median premium | Geo-mean | P25 | P75 | List value | Implied value (median x list) |
|---|---|---|---|---|---|---|---|
| Throwback Egg | 26 (15 / 11) | 3.79 | 4.69 | 2.52 | 9.14 | 0.0001 | 0.0003788 |
| Retired Egg | 100 (34 / 66) | 3.42 | 3.19 | 1.25 | 6.61 | 0.0002 | 0.0006847 |
| Unfortunate Eyelashes | 11 (4 / 7) | 2.60 | 2.15 | 1.30 | 2.64 | 0.0025 | 0.0065 |
| Royal Fairytale Egg | 9 (3 / 6) | 2.58 | 3.25 | 2.17 | 4.17 | 0.003 | 0.00775 |
| Royal Egg | 10 (1 / 9) | 2.44 | 2.35 | 1.38 | 3.31 | 0.0003 | 0.0007317 |
| Fairytale Egg | 158 (76 / 82) | 2.20 | 2.51 | 1.38 | 3.95 | 0.0002 | 0.0004407 |
| Fairytale Castle | 14 (6 / 8) | 1.87 | 1.77 | 1.26 | 2.37 | 0.003 | 0.005624 |
| Paint Sealer | 97 (52 / 45) | 1.82 | 2.74 | 1.18 | 6.31 | 0.00055 | 0.001 |
| Endangered Egg | 21 (3 / 18) | 1.81 | 1.92 | 1.00 | 3.31 | 0.0002 | 0.0003611 |
| Admin Abuse Egg | 48 (21 / 27) | 1.74 | 2.36 | 1.08 | 5.19 | 0.0004 | 0.0006961 |
| Silverback Gorilla [FR] | 22 (18 / 4) | 1.71 | 2.00 | 1.41 | 2.85 | 0.075 | 0.128 |
| Rose Quartz Glow Mega Neon Paint | 11 (7 / 4) | 1.62 | 1.42 | 1.06 | 1.65 | 0.004 | 0.0065 |
| Garden Egg | 8 (8 / 0) | 1.56 | 1.62 | 1.05 | 2.37 | 0.00065 | 0.001014 |
| Silverback Gorilla [NFR] | 18 (6 / 12) | 1.55 | 1.76 | 0.97 | 3.89 | 0.275 | 0.427 |
| Diamond Unicorn [MFR] | 16 (12 / 4) | 1.50 | 1.42 | 1.44 | 1.69 | 0.100 | 0.150 |
| Crystal Egg | 180 (94 / 86) | 1.39 | 1.76 | 0.94 | 2.68 | 0.0004 | 0.0005551 |
| Diamond Egg | 13 (4 / 9) | 1.30 | 1.17 | 0.93 | 1.59 | 0.005 | 0.0065 |
| Magic House Door | 14 (7 / 7) | 1.30 | 1.69 | 0.79 | 3.23 | 0.005 | 0.0065 |
| Candyfloss Mega Neon Paint | 15 (7 / 8) | 1.30 | 1.45 | 0.91 | 1.96 | 0.005 | 0.0065 |
| Ballet Swan [FR] | 25 (19 / 6) | 1.27 | 1.35 | 1.13 | 1.47 | 0.037 | 0.048 |
| Rainbow Stroller | 9 (4 / 5) | 1.24 | 1.08 | 0.78 | 1.39 | 0.010 | 0.012 |
| Ride-A-Pet Potion | 1912 (1235 / 677) | 1.23 | 1.46 | 1.00 | 1.85 | 0.0065 | 0.008 |
| Silverback Gorilla [MFR] | 27 (14 / 13) | 1.23 | 1.30 | 1.00 | 1.65 | 1.080 | 1.325 |
| Ballet Swan [NFR] | 24 (11 / 13) | 1.21 | 1.21 | 1.13 | 1.31 | 0.150 | 0.182 |
| Frostbite Bear [NFR] | 35 (23 / 12) | 1.20 | 1.09 | 1.04 | 1.24 | 1.120 | 1.340 |

Biggest UNDERPAYS (market < list):

| Variant | Sides (as wanted / as offered) | Median premium | Geo-mean | P25 | P75 | List value | Implied value (median x list) |
|---|---|---|---|---|---|---|---|
| Mochi Meow [M] | 17 (12 / 5) | 0.50 | 0.53 | 0.50 | 0.57 | 0.025 | 0.013 |
| Mule Baskets | 8 (1 / 7) | 0.72 | 0.82 | 0.72 | 1.01 | 0.003 | 0.002167 |
| Mochi Meow [NP] | 41 (25 / 16) | 0.72 | 1.06 | 0.65 | 0.93 | 0.001 | 0.0007222 |
| Jekyll Hydra Animated Sticker | 8 (5 / 3) | 0.80 | 0.77 | 0.50 | 1.07 | 0.025 | 0.020 |
| Banana Hat | 11 (7 / 4) | 0.80 | 0.90 | 0.72 | 1.07 | 0.010 | 0.008 |
| Classic Trade Stand | 18 (7 / 11) | 0.81 | 0.86 | 0.62 | 1.06 | 0.004 | 0.00325 |
| Peppermint Penguin [FR] | 41 (21 / 20) | 0.92 | 0.88 | 0.84 | 1.01 | 0.203 | 0.187 |
| Rain Boots | 10 (3 / 7) | 0.93 | 0.96 | 0.82 | 1.13 | 0.015 | 0.014 |
| Tuxedo Cat [MFR] | 10 (3 / 7) | 0.95 | 0.90 | 0.85 | 1.14 | 0.170 | 0.161 |
| Bewitched Hat | 8 (2 / 6) | 0.96 | 1.02 | 0.87 | 1.05 | 0.0045 | 0.004339 |
| Fairy Bat Dragon [FR] | 161 (103 / 58) | 0.97 | 0.91 | 0.83 | 1.02 | 0.175 | 0.169 |
| Polar Bear [MFR] | 8 (1 / 7) | 0.97 | 0.95 | 0.93 | 1.01 | 0.330 | 0.319 |
| Chocolate Chip Bat Dragon [FR] | 138 (79 / 59) | 0.97 | 0.92 | 0.86 | 1.01 | 0.245 | 0.238 |
| Unicorn [MFR] | 18 (14 / 4) | 0.97 | 0.98 | 0.94 | 1.02 | 0.085 | 0.083 |
| Fairy Bat Dragon [MFR] | 45 (20 / 25) | 0.97 | 0.90 | 0.81 | 1.01 | 2.000 | 1.943 |
| Cracked Egg | 10 (1 / 9) | 0.97 | 2.46 | 0.90 | 1.00 | 0.0001 | 9.722e-05 |
| Elephant [NFR] | 9 (5 / 4) | 0.97 | 0.90 | 0.96 | 1.09 | 0.280 | 0.273 |
| Moose Calf [MFR] | 8 (3 / 5) | 0.97 | 1.01 | 0.97 | 1.12 | 0.350 | 0.341 |
| Dalmatian [NFR] | 24 (15 / 9) | 0.98 | 0.95 | 0.90 | 1.02 | 1.260 | 1.229 |
| Strawberry Shortcake Bat Dragon [NFR] | 74 (40 / 34) | 0.98 | 0.95 | 0.89 | 1.01 | 0.705 | 0.689 |
| Chocolate Chip Bat Dragon [MFR] | 28 (13 / 15) | 0.98 | 0.96 | 0.89 | 1.02 | 3.150 | 3.081 |
| Haetae [FR] | 83 (42 / 41) | 0.98 | 0.94 | 0.93 | 1.02 | 0.830 | 0.812 |
| Strawberry Shortcake Bat Dragon [FR] | 273 (150 / 123) | 0.98 | 0.94 | 0.87 | 1.05 | 0.250 | 0.245 |
| Caterpillar [MFR] | 18 (5 / 13) | 0.98 | 0.97 | 0.94 | 1.01 | 1.780 | 1.745 |
| Peppermint Penguin [NFR] | 37 (21 / 16) | 0.98 | 0.91 | 0.84 | 1.00 | 0.775 | 0.760 |

Most-traded variants (>= 40 dominant sides) and their premium:

| Variant | Sides | Median premium | Geo-mean | P25 | P75 | List value | Implied value |
|---|---|---|---|---|---|---|---|
| Ride-A-Pet Potion | 1912 | 1.23 | 1.46 | 1.00 | 1.85 | 0.0065 | 0.008 |
| Fly-A-Pet Potion | 1010 | 1.05 | 1.18 | 0.96 | 1.40 | 0.013 | 0.013 |
| Cryptid [FR] | 352 | 1.07 | 1.09 | 0.98 | 1.21 | 0.865 | 0.925 |
| Frost Dragon [FR] | 327 | 1.00 | 1.00 | 0.98 | 1.02 | 1.725 | 1.728 |
| Cow [FR] | 306 | 1.00 | 1.02 | 0.96 | 1.07 | 0.210 | 0.211 |
| Owl [FR] | 300 | 1.00 | 0.98 | 0.98 | 1.03 | 1.340 | 1.344 |
| Strawberry Shortcake Bat Dragon [FR] | 273 | 0.98 | 0.94 | 0.87 | 1.05 | 0.250 | 0.245 |
| Parrot [FR] | 242 | 1.00 | 0.95 | 0.96 | 1.02 | 1.070 | 1.066 |
| Pet Handler Pro Certificate | 237 | 1.08 | 1.22 | 1.04 | 1.38 | 0.012 | 0.013 |
| Turtle [FR] | 223 | 1.01 | 1.03 | 0.97 | 1.10 | 0.150 | 0.151 |
| Balloon Unicorn [FR] | 202 | 1.00 | 1.01 | 0.98 | 1.03 | 0.925 | 0.927 |
| Kitty Biscuit | 200 | 1.02 | 1.24 | 1.00 | 1.47 | 0.0065 | 0.00665 |
| Crow [FR] | 185 | 1.01 | 0.94 | 0.98 | 1.03 | 0.965 | 0.970 |
| Crystal Egg | 180 | 1.39 | 1.76 | 0.94 | 2.68 | 0.0004 | 0.0005551 |
| Unicorn Horn | 167 | 1.03 | 1.05 | 0.98 | 1.08 | 0.130 | 0.134 |
| Fairy Bat Dragon [FR] | 161 | 0.97 | 0.91 | 0.83 | 1.02 | 0.175 | 0.169 |
| Arctic Reindeer [FR] | 161 | 1.02 | 1.02 | 0.98 | 1.08 | 0.287 | 0.293 |
| Evil Unicorn [FR] | 160 | 1.02 | 1.02 | 0.98 | 1.07 | 0.615 | 0.625 |
| Fairytale Egg | 158 | 2.20 | 2.51 | 1.38 | 3.95 | 0.0002 | 0.0004407 |
| Kangaroo [FR] | 154 | 1.01 | 0.99 | 0.96 | 1.08 | 0.115 | 0.116 |
| Giant Panda [FR] | 150 | 1.00 | 0.92 | 0.96 | 1.03 | 1.200 | 1.200 |
| Chocolate Chip Bat Dragon [FR] | 138 | 0.97 | 0.92 | 0.86 | 1.01 | 0.245 | 0.238 |
| Dalmatian [FR] | 130 | 1.01 | 1.03 | 0.98 | 1.07 | 0.350 | 0.353 |
| Rainbow Maker | 126 | 1.00 | 1.01 | 0.98 | 1.04 | 0.385 | 0.386 |
| Bat Dragon [FR] | 119 | 1.00 | 0.97 | 0.98 | 1.02 | 5.125 | 5.130 |
| Giraffe [FR] | 106 | 1.00 | 0.97 | 0.98 | 1.02 | 2.550 | 2.549 |
| Shadow Dragon [FR] | 104 | 1.00 | 0.88 | 0.97 | 1.02 | 3.720 | 3.730 |
| African Wild Dog [FR] | 103 | 1.00 | 1.02 | 0.99 | 1.03 | 0.865 | 0.868 |
| Retired Egg | 100 | 3.42 | 3.19 | 1.25 | 6.61 | 0.0002 | 0.0006847 |
| Paint Sealer | 97 | 1.82 | 2.74 | 1.18 | 6.31 | 0.00055 | 0.001 |

Cleanest signal - sides consisting of exactly ONE variant (implied value = what the other side was worth), min 8 such sides. Top 20 above list and bottom 20 below list:

| Variant (alone on its side) | Sides (as wanted / as offered) | List value | Median other side | P25 | P75 | Implied/List |
|---|---|---|---|---|---|---|
| Retired Egg | 8 (3 / 5) | 0.0002 | 0.003074 | 0.003049 | 0.003074 | 15.37 |
| Paint Sealer | 33 (16 / 17) | 0.00055 | 0.004462 | 0.0008 | 0.006148 | 8.11 |
| Magic House Door | 8 (7 / 1) | 0.005 | 0.015 | 0.008344 | 0.025 | 3.06 |
| Unfortunate Eyelashes | 10 (4 / 6) | 0.0025 | 0.0065 | 0.003625 | 0.006645 | 2.60 |
| Fairytale Castle | 10 (6 / 4) | 0.003 | 0.0065 | 0.004625 | 0.008713 | 2.17 |
| Silverback Gorilla [FR] | 20 (16 / 4) | 0.075 | 0.140 | 0.102 | 0.240 | 1.86 |
| Rose Quartz Glow Mega Neon Paint | 9 (6 / 3) | 0.004 | 0.0065 | 0.0045 | 0.006694 | 1.62 |
| Diamond Unicorn [MFR] | 15 (12 / 3) | 0.100 | 0.150 | 0.142 | 0.170 | 1.50 |
| Diamond Egg | 9 (4 / 5) | 0.005 | 0.007437 | 0.00595 | 0.007933 | 1.49 |
| Ride-A-Pet Potion | 1161 (820 / 341) | 0.0065 | 0.0095 | 0.0068 | 0.017 | 1.46 |
| Chihuahua [MFR] | 9 (8 / 1) | 0.070 | 0.102 | 0.068 | 0.141 | 1.46 |
| Candyfloss Mega Neon Paint | 12 (7 / 5) | 0.005 | 0.0065 | 0.005375 | 0.013 | 1.30 |
| Ballet Swan [FR] | 21 (18 / 3) | 0.037 | 0.048 | 0.044 | 0.060 | 1.28 |
| Jousting Horse [MFR] | 8 (8 / 0) | 0.775 | 0.970 | 0.821 | 1.139 | 1.25 |
| Chocolate Chip Bat Dragon Backpack | 10 (5 / 5) | 0.008 | 0.010 | 0.0065 | 0.010 | 1.25 |
| Latte Kitsune [FR] | 8 (6 / 2) | 0.024 | 0.029 | 0.024 | 0.033 | 1.23 |
| Ballet Swan [NFR] | 18 (10 / 8) | 0.150 | 0.181 | 0.170 | 0.193 | 1.21 |
| Frostbite Bear [NFR] | 20 (17 / 3) | 1.120 | 1.340 | 1.238 | 1.383 | 1.20 |
| Unicorn Backpack | 11 (11 / 0) | 0.028 | 0.033 | 0.029 | 0.035 | 1.19 |
| Pink Cat Ear Headphones | 9 (6 / 3) | 0.011 | 0.013 | 0.010 | 0.016 | 1.18 |
| Evil Unicorn [NFR] | 10 (8 / 2) | 1.135 | 1.115 | 1.102 | 1.150 | 0.98 |
| Alley Cat [MFR] | 14 (9 / 5) | 0.330 | 0.323 | 0.285 | 0.340 | 0.98 |
| Strawberry Shortcake Bat Dragon [NFR] | 30 (27 / 3) | 0.705 | 0.688 | 0.638 | 0.722 | 0.98 |
| Pancake Stack | 20 (11 / 9) | 0.019 | 0.018 | 0.018 | 0.025 | 0.97 |
| Elephant [NFR] | 9 (5 / 4) | 0.280 | 0.273 | 0.269 | 0.304 | 0.97 |
| Fairy Bat Dragon [FR] | 90 (75 / 15) | 0.175 | 0.170 | 0.137 | 0.182 | 0.97 |
| Winged Tiger [FR] | 9 (7 / 2) | 0.087 | 0.085 | 0.081 | 0.097 | 0.97 |
| Irish Water Spaniel [MFR] | 9 (8 / 1) | 0.875 | 0.850 | 0.825 | 0.890 | 0.97 |
| Fairy Bat Dragon [MFR] | 21 (18 / 3) | 2.000 | 1.943 | 1.620 | 2.015 | 0.97 |
| Unicorn [MFR] | 14 (11 / 3) | 0.085 | 0.083 | 0.080 | 0.087 | 0.97 |
| Toaster Hat | 25 (20 / 5) | 0.068 | 0.065 | 0.065 | 0.074 | 0.96 |
| Undead Jousting Horse [NFR] | 11 (7 / 4) | 1.575 | 1.507 | 1.435 | 1.595 | 0.96 |
| Chocolate Chip Bat Dragon [FR] | 73 (58 / 15) | 0.245 | 0.232 | 0.209 | 0.252 | 0.94 |
| Chocolate Chip Bat Dragon [MFR] | 11 (8 / 3) | 3.150 | 2.961 | 2.836 | 3.134 | 0.94 |
| Fairy Bat Dragon [NFR] | 32 (30 / 2) | 0.510 | 0.468 | 0.400 | 0.524 | 0.92 |
| Peppermint Penguin [FR] | 26 (16 / 10) | 0.203 | 0.185 | 0.170 | 0.208 | 0.91 |
| Rain Boots | 8 (3 / 5) | 0.015 | 0.013 | 0.012 | 0.016 | 0.87 |
| Banana Hat | 9 (6 / 3) | 0.010 | 0.008 | 0.0065 | 0.008 | 0.80 |
| Mochi Meow [NP] | 11 (10 / 1) | 0.001 | 0.0008 | 0.0008 | 0.005628 | 0.80 |
| Mochi Meow [M] | 15 (10 / 5) | 0.025 | 0.013 | 0.013 | 0.015 | 0.50 |

Of 225 variants with >=8 single-variant sides: 33 (14.7%) fetch >10% above list, 4 (1.8%) fetch >10% below list; median implied/list = 1.023.

Implied/List for the 30 variants with the most single-variant sides:

| Variant | Sides | List value | Median other side | P25 | P75 | Implied/List | Demand tag |
|---|---|---|---|---|---|---|---|
| Ride-A-Pet Potion | 1161 | 0.0065 | 0.0095 | 0.0068 | 0.017 | 1.46 | High |
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
| Kitty Biscuit | 96 | 0.0065 | 0.0065 | 0.0065 | 0.011 | 1.00 | High |
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
| Rainbow Maker | 63 | 0.385 | 0.393 | 0.379 | 0.414 | 1.02 | High |
| Frostbite Bear [MFR] | 63 | 4.450 | 4.755 | 4.188 | 5.468 | 1.07 | Medium |
| Shadow Dragon [FR] | 63 | 3.720 | 3.735 | 3.505 | 3.835 | 1.00 | High |
| Gemstone Egg | 62 | 0.013 | 0.013 | 0.013 | 0.019 | 1.00 | High |
| Hedgehog [FR] | 61 | 0.407 | 0.420 | 0.409 | 0.439 | 1.03 | High |
| Tiny Wings | 60 | 0.065 | 0.068 | 0.062 | 0.076 | 1.04 | High |
| Giraffe [FR] | 60 | 2.550 | 2.543 | 2.462 | 2.587 | 1.00 | High |

## 7. When trades happen (UTC)

Completed trades by hour of day (all 60 d, and since 2026-09-10):

| Hour UTC | Completed (all) | % | Completed (since 09-10) | % | Listings (window) |
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
| 16 | 968 | 7.1% | 694 | 7.3% | 2002 |
| 17 | 987 | 7.2% | 716 | 7.6% | 4670 |
| 18 | 973 | 7.1% | 727 | 7.7% | 5016 |
| 19 | 815 | 6.0% | 573 | 6.0% | 5221 |
| 20 | 751 | 5.5% | 481 | 5.1% | 0 |
| 21 | 638 | 4.7% | 390 | 4.1% | 0 |
| 22 | 497 | 3.6% | 301 | 3.2% | 0 |
| 23 | 449 | 3.3% | 288 | 3.0% | 0 |

Peak hours: 17:00 (987), 18:00 (973), 16:00 (968); quietest: 03:00 (284), 05:00 (296), 02:00 (298). Peak-to-trough ratio: 3.5x.

Completed trades by weekday:

| Weekday | Completed (all) | % | Completed (since 09-10) | % |
|---|---|---|---|---|
| Mon | 1959 | 14.3% | 1265 | 13.3% |
| Tue | 2004 | 14.7% | 1330 | 14.0% |
| Wed | 2097 | 15.4% | 1506 | 15.9% |
| Thu | 2203 | 16.1% | 1783 | 18.8% |
| Fri | 1340 | 9.8% | 862 | 9.1% |
| Sat | 1880 | 13.8% | 1261 | 13.3% |
| Sun | 2173 | 15.9% | 1470 | 15.5% |

Listings by 10-minute bucket in the captured window (all on Thu 2026-09-24):

| Bucket UTC | Listings | Rate/hour |
|---|---|---|
| 16:20 | 34 | 204 |
| 16:30 | 664 | 3984 |
| 16:40 | 647 | 3882 |
| 16:50 | 657 | 3942 |
| 17:00 | 626 | 3756 |
| 17:10 | 827 | 4962 |
| 17:20 | 755 | 4530 |
| 17:30 | 1008 | 6048 |
| 17:40 | 763 | 4578 |
| 17:50 | 691 | 4146 |
| 18:00 | 702 | 4212 |
| 18:10 | 670 | 4020 |
| 18:20 | 740 | 4440 |
| 18:30 | 905 | 5430 |
| 18:40 | 964 | 5784 |
| 18:50 | 1035 | 6210 |
| 19:00 | 1034 | 6204 |
| 19:10 | 1079 | 6474 |
| 19:20 | 1164 | 6984 |
| 19:30 | 1618 | 9708 |
| 19:40 | 326 | 1956 |

## 8. Trader concentration

listings.json (authorRobloxId): 16909 rows from 5361 posters.

| Metric | Value |
|---|---|
| Top 1% of posters (54 accounts) share | 1464 rows (8.7%) |
| Top 10% of posters (537 accounts) share | 5852 rows (34.6%) |
| Top 1 poster | 127 rows (0.8%) |
| Median rows per poster | 2 |
| Mean rows per poster | 3.15 |
| P90 rows per poster | 6 |
| Posters with exactly 1 row | 1992 (37.2%) |
| Gini coefficient of posting | 0.450 |

Top 15 posters:

| Poster | Rows | Share |
|---|---|---|
| dragotahate (10880087964) | 127 | 0.8% |
| CatNoirq11 (8821626056) | 73 | 0.4% |
| MegalozavrWarface (1499801537) | 66 | 0.4% |
| Vludik222111 (2615440063) | 54 | 0.3% |
| Lu_Wen6 (9566846808) | 44 | 0.3% |
| VlodosPoperos (11691935710) | 42 | 0.2% |
| snezzhook (5818181547) | 39 | 0.2% |
| Bozhidar_Dimov (1340370702) | 38 | 0.2% |
| mariarita2000 (148196269) | 36 | 0.2% |
| Trouble_Maker610 (113929085) | 34 | 0.2% |
| kk33kzq (10318446149) | 31 | 0.2% |
| v4lzs0 (1039729746) | 29 | 0.2% |
| XxkylaxX_Cutee (2955478828) | 28 | 0.2% |
| beearc_c (515088949) | 28 | 0.2% |
| 3mis_alttt (11610178185) | 28 | 0.2% |

completed.json (uid): 13656 rows from 1472 posters.

| Metric | Value |
|---|---|
| Top 1% of posters (15 accounts) share | 217 rows (1.6%) |
| Top 10% of posters (148 accounts) share | 1829 rows (13.4%) |
| Top 1 poster | 21 rows (0.2%) |
| Median rows per poster | 11 |
| Mean rows per poster | 9.28 |
| P90 rows per poster | 12 |
| Posters with exactly 1 row | 64 (4.3%) |
| Gini coefficient of posting | 0.204 |

Top 15 posters:

| Poster | Rows | Share |
|---|---|---|
| 1618208919 | 21 | 0.2% |
| 6144804938 | 18 | 0.1% |
| 1539324931 | 15 | 0.1% |
| 11691935710 | 14 | 0.1% |
| 4860462059 | 14 | 0.1% |
| 148196269 | 14 | 0.1% |
| 1457820366 | 14 | 0.1% |
| 3601319506 | 14 | 0.1% |
| 3609002675 | 14 | 0.1% |
| 8270466828 | 14 | 0.1% |
| 10277912887 | 13 | 0.1% |
| 2326292411 | 13 | 0.1% |
| 781724399 | 13 | 0.1% |
| 9465432305 | 13 | 0.1% |
| 1523718650 | 13 | 0.1% |

Trader profiles with stats (778 of 1569 fetched profiles):

| Stat | posted | accepted | completed | failed | completed/posted |
|---|---|---|---|---|---|
| Median | 39 | 20 | 17 | 34 | 0.424 |
| Mean | 102.08 | 52.65 | 50.02 | 79.50 | 0.529 |
| P90 | 262 | 128.3 | 132.5 | 194.3 | 1.025 |
| Max | 2057 | 1806 | 1280 | 1705 | - |

Join month of profiled traders: 2026-September=172, 2026-August=170, 2026-July=73, 2026-June=55, 2026-April=50, 2026-May=42, 2026-March=37, 2026-February=36, 2025-November=34, 2026-January=31, 2025-October=30, 2025-December=24, 2025-September=15, 2025-August=9

## 9. Use of signs (Add / Upgrade / Downgrade / ...)

listings: 5505 of 16909 rows (32.6%) contain at least one sign; 3296 sides consist of signs only.

| Sign | Uses | in lookingFor | in offering | With numeric value | Median value | Mean value |
|---|---|---|---|---|---|---|
| Add | 3681 | 3681 | 0 | 280 | 0.722 | 0.622 |
| Upgrade | 1400 | 1400 | 0 | 0 | - | - |
| Exotics | 608 | 608 | 0 | 0 | - | - |
| Megas | 580 | 580 | 0 | 0 | - | - |
| SmallAdd | 442 | 442 | 0 | 75 | 0.040 | 0.039 |
| MidTiers | 432 | 432 | 0 | 0 | - | - |
| Downgrade | 365 | 365 | 0 | 0 | - | - |
| HighTiers | 266 | 266 | 0 | 0 | - | - |
| PetWears | 256 | 256 | 0 | 0 | - | - |
| AnyPotions | 120 | 120 | 0 | 0 | - | - |
| Old | 78 | 78 | 0 | 0 | - | - |
| LowTiers | 70 | 70 | 0 | 0 | - | - |

completed: 529 of 13656 rows (3.9%) contain at least one sign; 89 sides consist of signs only.

| Sign | Uses | in lookingFor | in offering | With numeric value | Median value | Mean value |
|---|---|---|---|---|---|---|
| Add | 279 | 279 | 0 | 31 | 0.500 | 0.515 |
| SmallAdd | 193 | 193 | 0 | 36 | 0.025 | 0.034 |
| Upgrade | 32 | 32 | 0 | 0 | - | - |
| Exotics | 24 | 24 | 0 | 0 | - | - |
| AnyPotions | 21 | 21 | 0 | 0 | - | - |
| Megas | 19 | 19 | 0 | 0 | - | - |
| MidTiers | 19 | 19 | 0 | 0 | - | - |
| Downgrade | 15 | 15 | 0 | 0 | - | - |
| PetWears | 14 | 14 | 0 | 0 | - | - |
| HighTiers | 10 | 10 | 0 | 0 | - | - |
| LowTiers | 5 | 5 | 0 | 0 | - | - |
| Old | 1 | 1 | 0 | 0 | - | - |

## 10. Typical trade size

listings (16909 rows):

| Metric | Offering side | LookingFor side | Both sides |
|---|---|---|---|
| Mean items | 3.19 | 2.20 | 5.39 |
| Median items | 2 | 1 | 4 |
| P90 items | 8 | 4 | 11 |
| Share with 1 item | 49.3% | 54.4% | 1-for-1: 20.7% |
| Share with 18 items (cap) | 2.6% | 0.8% | 3.3% |
| Many-for-1 (offer >1, want 1) | - | - | 33.7% |

Entry mix by category and side:

| Category | Offering entries | % | LookingFor entries | % |
|---|---|---|---|---|
| Pets:regular | 20526 | 38.0% | 14081 | 37.8% |
| Pets:mega | 8322 | 15.4% | 3831 | 10.3% |
| Food | 6486 | 12.0% | 4107 | 11.0% |
| Pets:neon | 7512 | 13.9% | 3000 | 8.1% |
| sign | 0 | 0.0% | 8298 | 22.3% |
| PetWear | 4987 | 9.2% | 1284 | 3.4% |
| Eggs | 3986 | 7.4% | 1998 | 5.4% |
| Toys | 600 | 1.1% | 184 | 0.5% |
| Gifts | 545 | 1.0% | 220 | 0.6% |
| Vehicles | 479 | 0.9% | 84 | 0.2% |
| Stickers | 312 | 0.6% | 72 | 0.2% |
| Strollers | 135 | 0.3% | 34 | 0.1% |
| Houses | 68 | 0.1% | 36 | 0.1% |

completed (13656 rows):

| Metric | Offering side | LookingFor side | Both sides |
|---|---|---|---|
| Mean items | 3.28 | 2.02 | 5.30 |
| Median items | 2 | 1 | 4 |
| P90 items | 7 | 4 | 10 |
| Share with 1 item | 37.7% | 70.9% | 1-for-1: 20.7% |
| Share with 18 items (cap) | 1.6% | 1.2% | 2.7% |
| Many-for-1 (offer >1, want 1) | - | - | 50.2% |

Entry mix by category and side:

| Category | Offering entries | % | LookingFor entries | % |
|---|---|---|---|---|
| Pets:regular | 17663 | 39.4% | 10009 | 36.2% |
| Food | 7369 | 16.5% | 5528 | 20.0% |
| Pets:mega | 4973 | 11.1% | 3002 | 10.9% |
| Eggs | 4192 | 9.4% | 3421 | 12.4% |
| Pets:neon | 5066 | 11.3% | 2410 | 8.7% |
| PetWear | 3806 | 8.5% | 1569 | 5.7% |
| Toys | 547 | 1.2% | 473 | 1.7% |
| Gifts | 670 | 1.5% | 274 | 1.0% |
| sign | 0 | 0.0% | 632 | 2.3% |
| Stickers | 217 | 0.5% | 126 | 0.5% |
| Vehicles | 143 | 0.3% | 119 | 0.4% |
| Strollers | 88 | 0.2% | 38 | 0.1% |
| Houses | 48 | 0.1% | 51 | 0.2% |

Value of fully priceable (fallback-priced) completed trades (13127), in site value units (Frost Dragon FR = 1.725):

| Stat | Offering value | LookingFor value | Larger side |
|---|---|---|---|
| Median | 0.125 | 0.120 | 0.133 |
| Mean | 0.695 | 0.683 | 0.718 |
| P10 | 0.006694 | 0.0065 | 0.008925 |
| P25 | 0.019 | 0.013 | 0.021 |
| P75 | 0.610 | 0.602 | 0.628 |
| P90 | 1.725 | 1.725 | 1.726 |
| Max | 41.055 | 39.655 | 41.055 |

| Larger-side value band | Trades | % |
|---|---|---|
| <0.1 | 6117 | 46.6% |
| 0.1-0.5 | 3375 | 25.7% |
| 0.5-1 | 1270 | 9.7% |
| 1-2 | 1302 | 9.9% |
| 2-5 | 659 | 5.0% |
| 5-10 | 298 | 2.3% |
| 10-25 | 93 | 0.7% |
| 25-100 | 13 | 0.1% |
| 100+ | 0 | 0.0% |

Live listings that are fully priceable (11404): median offering value 0.160, median lookingFor value 0.163, median ask ratio O/L 0.989 (P25 0.889, P75 1.047); share asking >10% over their own offer (L > 1.1 O): 27.8%; share offering >10% more than they ask: 18.8%.

## 11. Other observations and data-quality notes

Repost spam: 220 of 16909 listings (1.3%) are exact repeats of another listing by the same author in the 3.2-hour window (191 repeated ad groups; the most repeated single ad appears 8 times).

Identical ads posted by 5+ different accounts (possible bot rings or very common trades):

| Ad (offering | lookingFor) | Distinct authors |
|---|---|
| Gemstone Egg|Add | 50 |
| Gemstone Egg|Upgrade | 20 |
| Frost Dragon [FR]|Add | 16 |
| Strawberry Shortcake Bat Dragon [FR]|Upgrade | 16 |
| Owl [FR]|Add | 16 |
| Strawberry Shortcake Bat Dragon [FR]|Add | 15 |
| Fairy Bat Dragon [FR]|Add | 13 |
| Owl [FR]|Add,Cryptid [FR] | 13 |
| Cryptid [FR]|Add | 12 |
| Arctic Reindeer [FR]|Add | 12 |
| Ride-A-Pet Potion|Add | 12 |
| Ride-A-Pet Potion|Crystal Egg,Crystal Egg,Crystal Egg,Crystal Egg,Crystal Egg,Crystal Egg,Crystal Egg,Crystal Egg,Cry... | 11 |
| Fly-A-Pet Potion|Ride-A-Pet Potion,Ride-A-Pet Potion | 11 |
| Fairy Bat Dragon [NFR]|Add | 11 |
| Frost Dragon [FR]|Cryptid [FR],Cryptid [FR] | 10 |

Completed trade ids that also appear in the live listing snapshot: 29.

Listings flagged allowCounters=true: 0 (0.0%).

Full-grown flag (fg=true) set on 680 of 99502 pet entries (0.7%) across both datasets; most common FG pets: Frostbite Bear=32, Cow=20, Chocolate Chip Bat Dragon=19, Purrowl=15, Mochi Meow=14, Strawberry Shortcake Bat Dragon=14, Frost Dragon=13, Cryptid=13.

Potions as currency: 4930 of 13656 completed trades (36.1%) include a potion. Fly-A-Pet Potion: offered 2659, wanted 1632, value 0.013; Heart Potion: offered 3, wanted 0, value 0.020; Ride-A-Pet Potion: offered 4346, wanted 3409, value 0.0065; Sugar Skull Potion: offered 1, wanted 1, value 0.015; Super Age-Up Potion: offered 0, wanted 5, value 0.018; Water Walking Potion: offered 1, wanted 0, value 0.240.

Items with missing/zero reference value: 0.

Unpriceable completed entries by cause: zero:pet:np=11948, zero:pet:r=3484, zero:pet:n=2361, zero:pet:m=1914, zero:pet:nr=1129, zero:pet:mr=814, sign=632, zero:pet:f=98, zero:pet:nf=11, zero:pet:mf=7.

Most-traded items the site tags as LOW demand (tag looks stale):

| Item | Cat | Completed mentions | Listing wanted | Listing offered | List value |
|---|---|---|---|---|---|
| Fairytale Egg | Eggs | 2126 | 222 | 886 | 0.0002 |
| Retired Egg | Eggs | 836 | 155 | 945 | 0.0002 |
| Chihuahua | Pets | 426 | 96 | 186 | 0.00675 |
| Throwback Egg | Eggs | 426 | 24 | 433 | 0.0001 |
| Mochi Meow | Pets | 407 | 151 | 148 | 0.004 |
| Endangered Egg | Eggs | 375 | 2 | 171 | 0.0002 |
| Huntsman Robin | Pets | 358 | 46 | 67 | 0.0045 |
| Purrowl | Pets | 220 | 57 | 111 | 0.004 |
| Basic Egg | Eggs | 192 | 11 | 191 | 0.0001 |
| Little Lamb | Pets | 190 | 40 | 76 | 0.0035 |
| Cracked Egg | Eggs | 164 | 33 | 24 | 0.0001 |
| Rubber Ducky | Pets | 150 | 1 | 99 | 0.0031 |
| Pinkypillar | Pets | 135 | 3 | 50 | 0.0031 |
| Ginger Cat | Pets | 133 | 44 | 67 | 0.0035 |
| Princess Mare | Pets | 119 | 4 | 37 | 0.0031 |

Items tagged HIGH demand with the fewest completed-trade mentions:

| Item | Cat | Completed mentions | Listing wanted | Listing offered | List value |
|---|---|---|---|---|---|
| Candy Flare Mega Neon Paint | Toys | 1 | 2 | 4 | 0.004 |
| Halloween Slime Mega Neon Paint | Toys | 2 | 4 | 2 | 0.0065 |
| Electric Tide Mega Neon Paint | Toys | 5 | 1 | 3 | 0.004 |
| Campfire Stories Mega Neon Paint | Toys | 6 | 10 | 2 | 0.004 |
| Velvet Fuchsia Mega Neon Paint | Toys | 7 | 2 | 5 | 0.004 |
| Tropical Surge Mega Neon Paint | Toys | 9 | 5 | 2 | 0.004 |
| Frosty Glow Mega Neon Paint | Toys | 12 | 7 | 1 | 0.0065 |
| Rose Quartz Glow Mega Neon Paint | Toys | 18 | 8 | 2 | 0.004 |
| Candyfloss Mega Neon Paint | Toys | 20 | 14 | 1 | 0.005 |
| Amethyst Skies Mega Neon Paint | Toys | 20 | 7 | 6 | 0.004 |
| Royal Mistletroll | Pets | 30 | 121 | 33 | 0.160 |
| Orchid Butterfly | Pets | 41 | 27 | 98 | 0.670 |
| Blue Dog | Pets | 42 | 27 | 22 | 0.083 |
| 2022 Birthday Confetti Cannon | PetWear | 46 | 11 | 56 | 0.083 |
| Angel Wings | PetWear | 53 | 40 | 45 | 0.195 |

Catalog coverage: 1373 of 1571 items (87.4%) appear in any completed trade; 1389 (88.4%) appear in the 3.2 h listing snapshot.

Share of traded VALUE in priceable completed trades: regular pets 39.5%, neon 18.8%, mega 38.4%, non-pet items 3.2%.

END
## 12. Value clustering (placeholder-looking values in items.json)

Pets: 198 distinct (FR/NFR/MFR) triples across 781 pets; 433 pets (55.4%) sit on a triple shared by 10+ pets.

| FR/NFR/MFR triple | Pets | NFR/FR | MFR/NFR |
|---|---|---|---|
| 0.005/0.01/0.035 | 60 | 2.00 | 3.50 |
| 0.0055/0.011/0.04 | 44 | 2.00 | 3.64 |
| 0.0045/0.009/0.03 | 43 | 2.00 | 3.33 |
| 0.004/0.008/0.025 | 41 | 2.00 | 3.12 |
| 0.0035/0.007/0.02 | 40 | 2.00 | 2.86 |
| 0.0065/0.015/0.06 | 28 | 2.31 | 4.00 |
| 0.00625/0.0125/0.05 | 28 | 2.00 | 4.00 |
| 0.0031/0.0055/0.011 | 23 | 1.77 | 2.00 |
| 0.006/0.012/0.045 | 22 | 2.00 | 3.75 |
| 0.0031/0.005/0.01 | 18 | 1.61 | 2.00 |
| 0.008/0.025/0.1 | 18 | 3.12 | 4.00 |
| 0.0075/0.0225/0.09 | 17 | 3.00 | 4.00 |
| 0.007/0.02/0.08 | 16 | 2.86 | 4.00 |
| 0.00675/0.0175/0.07 | 14 | 2.59 | 4.00 |
| 0.00375/0.0075/0.0225 | 11 | 2.00 | 3.00 |

Non-pet items: 97 distinct values across 790 items. Most common: 0.0065 x68, 0.004 x64, 0.002 x63, 0.003 x55, 0.001 x47, 0.005 x38, 0.0035 x37, 0.0025 x34, 0.0015 x34, 0.006 x33.

Egg values (all 44): Safari Egg=1.175 (Medium), Jungle Egg=0.460 (Medium), Farm Egg=0.450 (Medium), Blue Egg=0.240 (Medium), Pink Egg=0.180 (Medium), Christmas Egg=0.102 (Medium), Aussie Egg=0.031 (High), Gemstone Egg=0.013 (High), Easter 2020 Egg=0.013 (Medium), Royal Moon Egg=0.010 (Medium), Royal Desert Egg=0.008 (Medium), Royal Aztec Egg=0.0065 (Medium), Danger Egg=0.006 (Medium), Urban Egg=0.0055 (Medium), Wrapped Doll=0.005 (Low), Fossil Egg=0.005 (Medium), Diamond Egg=0.005 (Medium), Dylan=0.004 (Low), Christmas Future Egg=0.004 (Medium), Fool Egg=0.004 (Medium), Pistachio=0.004 (Low), River=0.004 (Low), Mythic Egg=0.0035 (Medium), Woodland Egg=0.0035 (Medium), Southeast Asia Egg=0.0035 (Medium), Ocean Egg=0.0035 (Medium), Royal Fairytale Egg=0.003 (Medium), Japan Egg=0.002 (Medium), Golden Egg=0.002 (Medium), Desert Egg=0.002 (Medium), Zodiac Minion Egg=0.00175 (Low), Moon Egg=0.00065 (Low), Garden Egg=0.00065 (Low), Admin Abuse Egg=0.0004 (Medium), Crystal Egg=0.0004 (Medium), Aztec Egg=0.00035 (Low), Royal Egg=0.0003 (Low), Endangered Egg=0.0002 (Low), Fairytale Egg=0.0002 (Low), Retired Egg=0.0002 (Low), Pet Egg=0.00015 (Low), Cracked Egg=0.0001 (Low), Basic Egg=0.0001 (Low), Throwback Egg=0.0001 (Low).

Pet FR value distribution:

| FR band | Pets | % |
|---|---|---|
| <0.005 | 251 | 32.1% |
| 0.005-0.01 | 320 | 41.0% |
| 0.01-0.05 | 126 | 16.1% |
| 0.05-0.2 | 52 | 6.7% |
| 0.2-1 | 24 | 3.1% |
| 1-5 | 7 | 0.9% |
| 5+ | 1 | 0.1% |

END2
