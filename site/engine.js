/* AMVGG Value Intelligence — prediction engine (pure JS, no DOM, no dependencies)
 * Input : data.json produced by build/build_state.pl (items, value-update log, active listings, completed trades, trader profiles)
 * Output: AMVGGEngine.build(data) -> model with market signals, implied values, a backtested history model and per-item predictions.
 * Portable: drop this file into the Next.js app and run build() in a cron job against the live database instead of data.json.
 */
(function (root) {
  'use strict';
  var DAY = 86400000;
  var VARIANT_FIELD = { '': 'np', fr: 'fr', r: 'r', f: 'f', n: 'n', nr: 'nr', nf: 'nf', nfr: 'nfr', m: 'm', mr: 'mr', mf: 'mf', mfr: 'mfr' };
  var VARIANT_LABEL = { np: 'No potion', fr: 'FR', r: 'R', f: 'F', n: 'N', nr: 'NR', nf: 'NF', nfr: 'NFR', m: 'M', mr: 'MR', mf: 'MF', mfr: 'MFR', v: '' };
  // every potion state belongs to one tracked tier (its FR value is the tier's reference value on the site)
  var TIER_OF = { np: 'fr', f: 'fr', r: 'fr', fr: 'fr', n: 'nfr', nf: 'nfr', nr: 'nfr', nfr: 'nfr', m: 'mfr', mf: 'mfr', mr: 'mfr', mfr: 'mfr', v: 'v' };
  var DEMAND_NUM = { High: 2, Medium: 1, Low: 0 };
  var BASELESS_START = Date.parse('2026-03-24T00:00:00Z');
  var UP_THRESH = Math.log(1.02);

  function tierOf(v) { if (v == null) return 'unknown'; if (v >= 0.45) return 'high'; if (v >= 0.1) return 'highmid'; if (v >= 0.03) return 'mid'; if (v >= 0.01) return 'low'; return 'insignificant'; }
  var TIER_ORDER = { high: 4, highmid: 3, mid: 2, low: 1, insignificant: 0, unknown: -1 };
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function mean(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return a.length ? s / a.length : 0; }
  function std(a, m) { if (a.length < 2) return 1; var s = 0; for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m); return Math.sqrt(s / (a.length - 1)) || 1; }
  function roundValue(v) { if (v == null || !isFinite(v)) return null; if (v >= 1) return Math.round(v * 200) / 200; if (v >= 0.1) return Math.round(v * 400) / 400; if (v >= 0.01) return Math.round(v * 2000) / 2000; return Math.round(v * 20000) / 20000; }
  function daysBetween(a, b) { return (b - a) / DAY; }

  /* ---------------- item index & pricing ---------------- */
  function indexItems(items) {
    var byName = new Map(), collisions = [];
    items.forEach(function (it) {
      if (byName.has(it.name)) { collisions.push(it.name); var prev = byName.get(it.name); if (prev.cat !== 'Pets' && it.cat === 'Pets') byName.set(it.name, it); }
      else byName.set(it.name, it);
    });
    return { byName: byName, collisions: collisions };
  }
  function keyOf(item, type) { if (item.cat !== 'Pets') return item.name + '|v'; var f = VARIANT_FIELD[type || ''] || 'fr'; return item.name + '|' + f; }
  function priceEntry(e, byName) {
    if (e.sign) { if (e.signValue != null && isFinite(e.signValue)) return { value: e.signValue, key: 'sign:' + e.sign, fixed: true, label: e.sign + ' (' + e.signValue + ')' }; return null; }
    var it = byName.get(e.name); if (!it) return null;
    var value, f;
    var code;
    if (it.cat === 'Pets') {
      code = VARIANT_FIELD[e.type || ''] || 'fr'; f = code; value = it.values[f];
      // most pets list only FR / NFR / MFR: a missing potion state falls back to ITS OWN tier's value, never to the regular FR
      if (value == null) { f = TIER_OF[code]; value = it.values[f]; }
      if (value == null) { f = 'fr'; value = it.values.fr; }
    } else { code = 'v'; f = 'v'; value = it.values.v; }
    if (value == null || !isFinite(value)) return null;
    return { value: value, key: it.name + '|' + f, name: it.name, variant: f, code: code, tier: TIER_OF[code] || 'v', item: it, label: it.name + (VARIANT_LABEL[code] ? ' ' + VARIANT_LABEL[code] : '') };
  }
  function priceSide(side, byName) {
    var total = 0, parts = [], ok = true;
    for (var i = 0; i < side.length; i++) { var p = priceEntry(side[i], byName); if (!p) { ok = false; parts.push({ label: side[i].name || side[i].sign || '?', value: null, unknown: true }); continue; } total += p.value; parts.push(p); }
    return { ok: ok && side.length > 0, total: total, parts: parts };
  }

  /* ---------------- value history from the update log ---------------- */
  function buildHistory(updates) {
    var series = new Map(), demandSeries = new Map(); // key -> [{t, prev, new}] sorted asc (values; demand levels 0/1/2)
    updates.forEach(function (u) {
      var key = u.item + '|' + u.var, t = Date.parse(u.t); if (!isFinite(t)) return;
      if (u.prev != null && u.new != null) {
        if (u.prev === u.new) return;
        if (!series.has(key)) series.set(key, []);
        series.get(key).push({ t: t, prev: u.prev, new: u.new, synthetic: !!u.synthetic });
      } else if (u.newDemand != null || u.prevDemand != null) {
        var pd = DEMAND_NUM[u.prevDemand], nd = DEMAND_NUM[u.newDemand]; if (pd == null && nd == null) return;
        if (!demandSeries.has(key)) demandSeries.set(key, []);
        demandSeries.get(key).push({ t: t, prev: pd == null ? nd : pd, new: nd == null ? pd : nd });
      }
    });
    series.forEach(function (arr) { arr.sort(function (a, b) { return a.t - b.t; }); });
    demandSeries.forEach(function (arr) { arr.sort(function (a, b) { return a.t - b.t; }); });
    return { series: series, demandSeries: demandSeries };
  }
  function lookupAt(arr, t) { // value in force at t for a sorted [{t, prev, new}] series (null when the series is empty)
    if (!arr || !arr.length) return null;
    if (t < arr[0].t) return arr[0].prev;
    var lo = 0, hi = arr.length - 1, ans = 0;
    while (lo <= hi) { var mid = (lo + hi) >> 1; if (arr[mid].t <= t) { ans = mid; lo = mid + 1; } else hi = mid - 1; }
    return arr[ans].new;
  }
  function makeValueAt(series, byName) {
    return function (key, t) {
      var arr = series.get(key);
      if (!arr || !arr.length) { var nm = key.split('|'), it = byName.get(nm[0]); if (!it) return null; return it.cat === 'Pets' ? it.values[nm[1] === 'v' ? 'fr' : nm[1]] : it.values.v; }
      return lookupAt(arr, t);
    };
  }
  function makeDemandAt(demandSeries, byName) { // demand level in force at t (today's demand only when nothing older is known)
    return function (key, t) {
      var nm = key.split('|'), it = byName.get(nm[0]); if (!it) return 1;
      var cur = DEMAND_NUM[it.demand[it.cat === 'Pets' ? (nm[1] === 'v' ? 'fr' : nm[1]) : 'v']]; if (cur == null) cur = 1;
      var arr = demandSeries.get(key); if (!arr || !arr.length) return cur;
      var d = lookupAt(arr, t); return d == null ? cur : d;
    };
  }

  /* ---------------- history features ---------------- */
  var FEATURE_NAMES = ['log10 value', 'log10 value²', 'change 7d', 'change 30d', 'change 90d', 'updates 30d', 'updates 90d', 'days since update', 'last direction', 'streak', 'is pet', 'demand (at the time)', 'other-tier updates 30d', 'has 90d history', 'tier (0 regular, 1 neon, 2 mega)', 'demand changes 30d'];
  // the three tracked tiers of a pet and the potion states inside each (values map field names)
  var PET_TIERS = [{ v: 'v', field: 'fr', label: 'Regular', subs: ['np', 'f', 'r', 'fr'], codes: ['', 'f', 'r', 'fr'] },
                   { v: 'nfr', field: 'nfr', label: 'Neon', subs: ['n', 'nf', 'nr', 'nfr'], codes: ['n', 'nf', 'nr', 'nfr'] },
                   { v: 'mfr', field: 'mfr', label: 'Mega', subs: ['m', 'mf', 'mr', 'mfr'], codes: ['m', 'mf', 'mr', 'mfr'] }];
  var ITEM_TIERS = [{ v: 'v', field: 'v', label: '', subs: ['v'], codes: [''] }];
  function featuresAt(key, t, ctx) {
    var v0 = ctx.valueAt(key, t); if (v0 == null || !(v0 > 0)) return null;
    var arr = ctx.series.get(key) || [];
    var name = key.split('|')[0], vkey = key.split('|')[1], it = ctx.byName.get(name);
    function chg(days) { var v1 = ctx.valueAt(key, t - days * DAY); if (v1 == null || !(v1 > 0)) return 0; if (t - days * DAY < ctx.histStart) return 0; return Math.log(v0 / v1); }
    var n30 = 0, n90 = 0, last = null, streak = 0, lastDir = 0;
    for (var i = 0; i < arr.length; i++) {
      var u = arr[i]; if (u.t > t) break; if (u.prev === u.new) continue;
      if (u.t > t - 30 * DAY) n30++; if (u.t > t - 90 * DAY) n90++;
      var d = u.new > u.prev ? 1 : -1;
      if (d === lastDir) streak += d; else { streak = d; lastDir = d; }
      last = u;
    }
    // with no logged change: the site's lastUpdatedAt moves on ANY edit (demand tag, another tier), so it only dates a value move when it
    // predates the public log; otherwise the tier has simply not changed since the log began (the same rule at training and serving time)
    var lastT = last ? last.t : NaN, sinceLog = false;
    if (!last) { var lu = it && it.lastUpdatedAt ? Date.parse(it.lastUpdatedAt) : NaN; if (isFinite(lu) && lu < ctx.histStart) lastT = lu; else sinceLog = true; }
    var daysSince = Math.min(180, sinceLog ? daysBetween(ctx.histStart, t) : (isFinite(lastT) && lastT <= t ? daysBetween(lastT, t) : 180));
    var other30 = 0;
    if (it && it.cat === 'Pets') { ['v', 'nfr', 'mfr'].forEach(function (vv) { if (vv === vkey) return; var a2 = ctx.series.get(name + '|' + vv) || []; for (var j = 0; j < a2.length; j++) { if (a2[j].t > t) break; if (a2[j].t > t - 30 * DAY && a2[j].prev !== a2[j].new) other30++; } }); }
    var dem = ctx.demandAt(key, t);
    var dchg = 0, da = ctx.demandSeries.get(key) || []; for (var q = 0; q < da.length; q++) { if (da[q].t > t) break; if (da[q].t > t - 30 * DAY && da[q].prev !== da[q].new) dchg++; }
    var tierIdx = vkey === 'nfr' ? 1 : vkey === 'mfr' ? 2 : 0;
    var lv = Math.log10(v0);
    return { v0: v0, x: [lv, lv * lv, chg(7), chg(30), chg(90), n30, n90, daysSince / 30, lastDir, clamp(streak, -5, 5), it && it.cat === 'Pets' ? 1 : 0, dem, other30, (t - 90 * DAY) >= ctx.histStart ? 1 : 0, tierIdx, Math.min(dchg, 3)], daysSince: daysSince, sinceLog: sinceLog, lastT: isFinite(lastT) ? lastT : null, n30: n30, n90: n90, lastDir: lastDir, streak: streak, chg7: chg(7), chg30: chg(30), chg90: chg(90), demand: dem };
  }

  /* ---------------- softmax regression ---------------- */
  function trainSoftmax(X, y, opts) {
    var n = X.length, p = X[0].length, K = 3, iters = opts.iters || 400, lr = opts.lr || 0.5, lambda = opts.lambda || 1e-3;
    var mu = [], sd = [];
    for (var j = 0; j < p; j++) { var col = X.map(function (r) { return r[j]; }); var m = mean(col); mu.push(m); sd.push(std(col, m)); }
    var Z = X.map(function (r) { var z = [1]; for (var j = 0; j < p; j++) z.push((r[j] - mu[j]) / sd[j]); return z; });
    var W = []; for (var k = 0; k < K; k++) { W.push(new Array(p + 1).fill(0)); }
    for (var it = 0; it < iters; it++) {
      var G = []; for (k = 0; k < K; k++) G.push(new Array(p + 1).fill(0));
      for (var i = 0; i < n; i++) {
        var z = Z[i], s = [0, 0, 0], mx = -1e9;
        for (k = 0; k < K; k++) { var d = 0; for (j = 0; j <= p; j++) d += W[k][j] * z[j]; s[k] = d; if (d > mx) mx = d; }
        var sum = 0; for (k = 0; k < K; k++) { s[k] = Math.exp(s[k] - mx); sum += s[k]; }
        for (k = 0; k < K; k++) { var e = s[k] / sum - (y[i] === k ? 1 : 0); for (j = 0; j <= p; j++) G[k][j] += e * z[j]; }
      }
      for (k = 0; k < K; k++) for (j = 0; j <= p; j++) W[k][j] -= lr * (G[k][j] / n + (j ? lambda * W[k][j] : 0));
    }
    function predict(x) { var z = [1]; for (var j = 0; j < p; j++) z.push((x[j] - mu[j]) / sd[j]); var s = [0, 0, 0], mx = -1e9; for (var k = 0; k < K; k++) { var d = 0; for (j = 0; j <= p; j++) d += W[k][j] * z[j]; s[k] = d; if (d > mx) mx = d; } var sum = 0; for (k = 0; k < K; k++) { s[k] = Math.exp(s[k] - mx); sum += s[k]; } return [s[0] / sum, s[1] / sum, s[2] / sum]; }
    return { W: W, mu: mu, sd: sd, predict: predict };
  }

  /* ---------------- history model: dataset, backtest, refit ---------------- */
  function buildHistoryModel(ctx, opts) {
    var horizon = 30, step = 7;
    var start = ctx.histStart + 30 * DAY, end = ctx.now - (horizon + 1) * DAY;
    var rows = [];
    // one training key per tracked tier: pets contribute regular (v), neon (nfr) and mega (mfr); items just v
    var keys = []; ctx.items.forEach(function (it) { (it.cat === 'Pets' ? PET_TIERS : ITEM_TIERS).forEach(function (T) { keys.push(it.name + '|' + T.v); }); });
    for (var t = start; t <= end; t += step * DAY) {
      keys.forEach(function (k) {
        var f = featuresAt(k, t, ctx); if (!f) return;
        var v1 = ctx.valueAt(k, t + horizon * DAY); if (v1 == null || !(v1 > 0)) return;
        var yv = Math.log(v1 / f.v0), cls = yv > UP_THRESH ? 1 : yv < -UP_THRESH ? 2 : 0; // 0 flat, 1 up, 2 down
        rows.push({ key: k, t: t, x: f.x, y: cls, yv: yv, tier: tierOf(f.v0), lastDir: f.lastDir, daysSince: f.daysSince });
      });
    }
    if (rows.length < 200) return { ok: false, reason: 'not enough history rows (' + rows.length + ')', rows: rows.length };
    var dates = Array.from(new Set(rows.map(function (r) { return r.t; }))).sort(function (a, b) { return a - b; });
    var nTestDates = Math.max(2, Math.round(dates.length * 0.3));
    var testDates = dates.slice(dates.length - nTestDates), splitT = testDates[0];
    // rolling-origin evaluation with an embargo: a test date D is scored by a model trained only on rows whose 30-day label window
    // closed before D, so no value change decides both a training label and a test label
    var X = function (r) { return r.x; }, Y = function (r) { return r.y; };
    var scored = [], trainDateSet = new Set(), nTrainRows = 0, embargo = true;
    testDates.forEach(function (D) {
      var tr = rows.filter(function (r) { return r.t + horizon * DAY <= D; }); if (tr.length < 200) return;
      tr.forEach(function (r) { trainDateSet.add(r.t); }); nTrainRows += tr.length;
      var mD = trainSoftmax(tr.map(X), tr.map(Y), opts);
      rows.forEach(function (r) { if (r.t === D) scored.push({ r: r, p: mD.predict(r.x) }); });
    });
    if (scored.length < 100) { // too little history for an embargoed test yet: fall back to the plain split and say so
      embargo = false; scored = []; trainDateSet = new Set(); var tr0 = rows.filter(function (r) { return r.t < splitT; }); nTrainRows = tr0.length; tr0.forEach(function (r) { trainDateSet.add(r.t); });
      var m0 = trainSoftmax(tr0.map(X), tr0.map(Y), opts); rows.forEach(function (r) { if (r.t >= splitT) scored.push({ r: r, p: m0.predict(r.x) }); });
    }
    var train = rows.filter(function (r) { return r.t + horizon * DAY <= splitT; }); if (train.length < 200) train = rows.filter(function (r) { return r.t < splitT; });
    var test = scored.map(function (s) { return s.r; });
    // evaluate
    var conf = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], correct = 0, base = [0, 0, 0];
    scored.forEach(function (s) { var p = s.p, r = s.r; var pred = p.indexOf(Math.max(p[0], p[1], p[2])); conf[r.y][pred]++; if (pred === r.y) correct++; base[r.y]++; });
    var majority = Math.max(base[0], base[1], base[2]) / test.length;
    var momOK = 0; test.forEach(function (r) { var pred = (r.daysSince <= 14 && r.lastDir === 1) ? 1 : (r.daysSince <= 14 && r.lastDir === -1) ? 2 : 0; if (pred === r.y) momOK++; });
    function precAt(cls, k) { var s = scored.slice().sort(function (a, b) { return b.p[cls] - a.p[cls]; }).slice(0, k); var hit = 0; s.forEach(function (x) { if (x.r.y === cls) hit++; }); return { k: Math.min(k, s.length), hit: hit, prec: s.length ? hit / s.length : 0, meanP: mean(s.map(function (x) { return x.p[cls]; })) }; }
    function f1(cls) { var tp = conf[cls][cls], fp = 0, fn = 0; for (var i = 0; i < 3; i++) { if (i !== cls) { fp += conf[i][cls]; fn += conf[cls][i]; } } var pr = tp + fp ? tp / (tp + fp) : 0, rc = tp + fn ? tp / (tp + fn) : 0; return pr + rc ? 2 * pr * rc / (pr + rc) : 0; }
    function calibBins(cls) { var c = []; for (var b = 0; b < 5; b++) c.push({ lo: b / 5, hi: (b + 1) / 5, n: 0, sumP: 0, hits: 0 }); scored.forEach(function (s) { var p = s.p[cls], b = Math.min(4, Math.floor(p * 5)); c[b].n++; c[b].sumP += p; if (s.r.y === cls) c[b].hits++; }); return c; }
    var calib = calibBins(1), calibDown = calibBins(2);
    // monotone (pool-adjacent-violators) piecewise-linear map from the model's probability to the share that actually moved in the test.
    // Sparse bins (the rare "down" class) are pooled with a neighbour until every point rests on >= 20 rows; beyond the outermost points
    // the map is flat, so the displayed odds never climb above the hit rate observed in the most confident bin
    function makeCalibrator(bins) {
      var pts = bins.filter(function (b) { return b.n > 0; }).map(function (b) { return { x: b.sumP / b.n, y: b.hits / b.n, w: b.n }; });
      function pool(i, j) { var a = pts[i], c = pts[j], w = a.w + c.w; pts.splice(Math.min(i, j), 2, { x: (a.x * a.w + c.x * c.w) / w, y: (a.y * a.w + c.y * c.w) / w, w: w }); }
      while (pts.length >= 2) { var k = -1; for (var q = 0; q < pts.length; q++) { if (pts[q].w < 20 && (k < 0 || pts[q].w < pts[k].w)) k = q; } if (k < 0) break; pool(k, k === 0 ? 1 : k === pts.length - 1 ? k - 1 : (pts[k - 1].w <= pts[k + 1].w ? k - 1 : k + 1)); }
      if (pts.length < 2 || pts[0].w < 20) return { fn: function (p) { return p; }, ok: false };
      var i = 0; while (i < pts.length - 1) { if (pts[i].y > pts[i + 1].y) { pool(i, i + 1); i = Math.max(0, i - 1); } else i++; }
      pts = [{ x: 0, y: pts[0].y }].concat(pts, [{ x: 1, y: pts[pts.length - 1].y }]);
      return { ok: true, fn: function (p) { for (var k = 1; k < pts.length; k++) { if (p <= pts[k].x) { var a = pts[k - 1], c = pts[k]; return c.x === a.x ? c.y : a.y + (c.y - a.y) * (p - a.x) / (c.x - a.x); } } return pts[pts.length - 1].y; } };
    }
    var calUp = makeCalibrator(calib), calDown = makeCalibrator(calibDown);
    // expected move per tier from training rows
    // typical size of a move per tier: median (robust to the handful of huge drops) and capped at ±25%
    function median(a) { if (!a.length) return null; var s = a.slice().sort(function (x, y) { return x - y; }); var m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
    var CAP = Math.log(1.25);
    var moves = {}; ['high', 'highmid', 'mid', 'low', 'insignificant'].forEach(function (tr) { var up = train.filter(function (r) { return r.tier === tr && r.y === 1; }).map(function (r) { return r.yv; }); var dn = train.filter(function (r) { return r.tier === tr && r.y === 2; }).map(function (r) { return r.yv; }); var mu = median(up), md = median(dn); moves[tr] = { up: mu == null ? 0.06 : clamp(mu, 0, CAP), down: md == null ? -0.06 : clamp(md, -CAP, 0), meanUp: up.length ? mean(up) : null, meanDown: dn.length ? mean(dn) : null, nUp: up.length, nDown: dn.length }; });
    // refit on everything for live predictions
    var full = trainSoftmax(rows.map(function (r) { return r.x; }), rows.map(function (r) { return r.y; }), opts);
    var weights = FEATURE_NAMES.map(function (nm, j) { return { feature: nm, up: full.W[1][j + 1] - full.W[0][j + 1], down: full.W[2][j + 1] - full.W[0][j + 1] }; });
    function binsOut(c) { return c.map(function (b) { return { range: b.lo.toFixed(1) + '–' + b.hi.toFixed(1), n: b.n, meanP: b.n ? b.sumP / b.n : null, observed: b.n ? b.hits / b.n : null }; }); }
    return { ok: true, horizonDays: horizon, rows: rows.length, nTrain: nTrainRows, nTrainDates: trainDateSet.size, nTest: test.length, nTestDates: testDates.length, embargo: embargo, asOfDates: dates.length, splitDate: new Date(splitT).toISOString().slice(0, 10), firstAsOf: new Date(dates[0]).toISOString().slice(0, 10), lastAsOf: new Date(dates[dates.length - 1]).toISOString().slice(0, 10),
      baseRates: { flat: base[0] / test.length, up: base[1] / test.length, down: base[2] / test.length },
      metrics: { accuracy: correct / test.length, majorityBaseline: majority, momentumBaseline: momOK / test.length, macroF1: (f1(0) + f1(1) + f1(2)) / 3, f1Up: f1(1), f1Down: f1(2), precUp50: precAt(1, 50), precDown50: precAt(2, 50), precUp100: precAt(1, 100), precDown100: precAt(2, 100) },
      confusion: conf, calibration: binsOut(calib), calibrationDown: binsOut(calibDown), calibrated: { up: calUp.ok, down: calDown.ok }, calibrate: function (cls, p) { return clamp(cls === 2 ? calDown.fn(p) : cls === 1 ? calUp.fn(p) : p, 0, 1); },
      moves: moves, weights: weights, model: full, predict: full.predict };
  }

  /* ---------------- market signals from listings & completed trades ---------------- */
  // trust in a trader's completed trades: unknown accounts get the LEAST weight (an alt whose profile was never seen is not a known newcomer);
  // known accounts earn weight slowly with accepted trades, lose it with failed ones, and need a two-week-old account
  var REP_UNKNOWN = 0.2;
  function traderStats(profiles, uid) { // parsed profile stats, or null when the profile was never seen or its page did not render
    var p = profiles[uid]; if (!p || p.accepted == null) return null;
    var acc = p.accepted || 0, fail = p.failed || 0, joined = p.joined ? Date.parse(p.joined) : NaN, ageD = isFinite(joined) ? daysBetween(joined, Date.now()) : 0;
    return { acc: acc, fail: fail, ageD: ageD, known: acc >= 3 && ageD >= 14 };
  }
  function isKnownTrader(profiles, uid) { var s = traderStats(profiles, uid); return !!(s && s.known); }
  function reputation(profiles, uid) {
    var s = traderStats(profiles, uid); if (!s || !s.known) return REP_UNKNOWN;
    var w = Math.min(1, Math.log1p(s.acc) / Math.log1p(30)) * (s.acc / (s.acc + s.fail + 1)) * Math.min(1, s.ageD / 30);
    return clamp(w, REP_UNKNOWN, 1);
  }
  // a poster's weight in the confidence head-count: an unknown account is half a poster, a well-established one up to one and a half
  function posterWeight(profiles, uid) { return clamp(reputation(profiles, uid) / 0.4, 0.5, 1.5); }
  // completed trades newest-first (so the per-trader caps keep each trader's most recent trades), with mirrored pairs folded into one
  // observation: A gives X for Y and B gives Y for X within 72 h is one real trade logged from both sides, or a wash between two accounts,
  // and either way it must not count as two trades from two posters. A trader's own identical repost within 72 h is dropped too.
  var MIRROR_H = 72;
  function sideSig(side) { return side.map(function (e) { return (e.name || ('sign:' + e.sign)) + '|' + (e.type || ''); }).sort().join(','); }
  function prepareCompleted(ctx) {
    if (ctx.completedPrepared) return ctx.completedPrepared;
    var list = ctx.completed.map(function (c) { return { c: c, t: Date.parse(c.t), uid: c.uid || 'anon', dup: false }; });
    list.sort(function (a, b) { return (isFinite(b.t) ? b.t : 0) - (isFinite(a.t) ? a.t : 0); });
    var seen = new Map(), mirrored = 0, reposts = 0;
    list.forEach(function (x) {
      var so = sideSig(x.c.offering), sl = sideSig(x.c.lookingFor), key = so + '>' + sl, m = seen.get(sl + '>' + so), s = seen.get(key);
      if (m && m.uid !== x.uid && Math.abs(m.t - x.t) <= MIRROR_H * 3600000) { x.dup = true; mirrored++; return; }
      if (s && s.uid === x.uid && Math.abs(s.t - x.t) <= MIRROR_H * 3600000) { x.dup = true; reposts++; return; }
      if (!s) seen.set(key, { t: x.t, uid: x.uid });
    });
    return (ctx.completedPrepared = { list: list, mirrored: mirrored, reposts: reposts });
  }
  var LISTING_GATE = 0.7, TRADE_GATE = 1.0, WINSOR = 0.35; // log-ratio gates: listings beyond 2x and trades beyond 2.7x are ignored; the rest is clipped at ±42%
  function buildMarket(ctx) {
    var byName = ctx.byName, sig = new Map();
    function S(name) { if (!sig.has(name)) sig.set(name, { name: name, offers: 0, wants: 0, offersRaw: 0, wantsRaw: 0, offersByVariant: {}, wantsByVariant: {}, offersByTier: {}, wantsByTier: {}, offerUsers: {}, wantUsers: {}, askUsers: {}, overpay: [], ask: [], trades: [], perUser: {}, posters: new Set(), tiers: {}, completedOffered: 0, completedWanted: 0 }); return sig.get(name); }
    var unknown = new Map(); function unk(n) { unknown.set(n, (unknown.get(n) || 0) + 1); }
    var pricedListings = 0, pricedCompleted = 0;
    // counts are DISTINCT posters (a trader spamming the same want ten times counts once), kept per potion state for display, per tier for the
    // predictions (one account listing a pet as FR, R, F and no-potion is ONE poster of that tier) and per item for the pressure score
    function tally(kind, e, uid) {
      if (!e.name) return; var it = byName.get(e.name); if (!it) { unk(e.name); return; }
      var s = S(e.name), v = e.type || '', tier = it.cat === 'Pets' ? TIER_OF[VARIANT_FIELD[v] || 'fr'] : 'v', users = s[kind + 'Users'];
      s[kind + 'sRaw']++;
      if (!users[v + '|' + uid]) { users[v + '|' + uid] = 1; s[kind + 'sByVariant'][v] = (s[kind + 'sByVariant'][v] || 0) + 1; }
      if (!users['tier:' + tier + '|' + uid]) { users['tier:' + tier + '|' + uid] = 1; s[kind + 'sByTier'][tier] = (s[kind + 'sByTier'][tier] || 0) + 1; }
      if (!users['any|' + uid]) { users['any|' + uid] = 1; s[kind + 's']++; }
    }
    ctx.listings.forEach(function (l) {
      var uid = l.uid || 'anon';
      l.offering.forEach(function (e) { tally('offer', e, uid); });
      l.lookingFor.forEach(function (e) { tally('want', e, uid); });
      var off = priceSide(l.offering, byName), lf = priceSide(l.lookingFor, byName);
      if (off.ok && lf.ok && off.total > 0 && lf.total > 0) {
        pricedListings++; var r = Math.log(off.total / lf.total); if (Math.abs(r) > LISTING_GATE) return; r = clamp(r, -WINSOR, WINSOR);
        function ask(p, sign, tot) { if (p.fixed) return; var s = S(p.name); var c = s.askUsers[uid] = (s.askUsers[uid] || 0) + 1; if (c > 2) return; s.ask.push({ r: sign * r * (p.value / tot), w: 0.3 }); }
        lf.parts.forEach(function (p) { ask(p, 1, lf.total); }); off.parts.forEach(function (p) { ask(p, -1, off.total); });
      }
    });
    var prep = prepareCompleted(ctx);
    prep.list.forEach(function (x) { // newest first: the two-per-trader-per-item cap below keeps each trader's most recent trades
      if (x.dup) return;
      var c = x.c, uid = x.uid, off = priceSide(c.offering, byName), lf = priceSide(c.lookingFor, byName);
      c.offering.forEach(function (e) { if (e.name && byName.has(e.name)) S(e.name).completedOffered++; else if (e.name) unk(e.name); });
      c.lookingFor.forEach(function (e) { if (e.name && byName.has(e.name)) S(e.name).completedWanted++; else if (e.name) unk(e.name); });
      if (!(off.ok && lf.ok && off.total > 0 && lf.total > 0)) return;
      pricedCompleted++;
      var r = Math.log(off.total / lf.total); if (Math.abs(r) > TRADE_GATE) return; var rw = clamp(r, -WINSOR, WINSOR);
      var w = reputation(ctx.profiles, uid), age = isFinite(x.t) ? daysBetween(x.t, ctx.now) : 30; w *= Math.exp(-Math.max(0, age) / 45);
      // ONE observation per (trade, item): the item's net share of the trade (wanted shares minus offered shares), so a pet on both sides nets out
      var share = new Map();
      function acc(p, sign, tot) { if (p.fixed) return; var o = share.get(p.name); if (!o) { o = { net: 0, wanted: 0, offered: 0, tiers: {} }; share.set(p.name, o); } var sh = sign * p.value / tot; o.net += sh; if (sign > 0) o.wanted++; else o.offered++; o.tiers[p.tier] = (o.tiers[p.tier] || 0) + sh; }
      lf.parts.forEach(function (p) { acc(p, 1, lf.total); }); off.parts.forEach(function (p) { acc(p, -1, off.total); });
      share.forEach(function (o, name) {
        var s = S(name); var cnt = s.perUser[uid] = (s.perUser[uid] || 0) + 1; if (cnt > 2) return; // at most two trades per trader per item count
        s.posters.add(uid); s.overpay.push({ r: rw * o.net, w: w });
        Object.keys(o.tiers).forEach(function (tf) { var tt = s.tiers[tf] || (s.tiers[tf] = { overpay: [], n: 0, posters: new Set() }); tt.overpay.push({ r: rw * o.tiers[tf], w: w }); tt.n++; tt.posters.add(uid); });
        s.trades.push({ id: c.id, t: c.t, side: o.wanted && o.offered ? 'both' : o.wanted ? 'wanted' : 'offered', r: r, w: w, offering: off.parts.map(function (q) { return q.label; }), lookingFor: lf.parts.map(function (q) { return q.label; }), offTotal: off.total, lfTotal: lf.total });
      });
    });
    // aggregate with shrinkage
    function shrink(arr, k) { var sw = 0, swr = 0; arr.forEach(function (o) { sw += o.w; swr += o.w * o.r; }); return { adj: sw ? swr / (sw + k) : 0, mean: sw ? swr / sw : null, sw: sw }; }
    var rows = [];
    sig.forEach(function (s) {
      // shrink toward zero: one or two lopsided trades should not dominate (k = 4 trade-weights of prior)
      // posters are counted by reputation mass (unknown accounts half each), so a handful of throwaway accounts cannot buy confidence
      function mass(set) { var mm = 0; set.forEach(function (uid) { mm += posterWeight(ctx.profiles, uid); }); return mm; }
      var ov = shrink(s.overpay, 4); s.overpayAdj = ov.adj; s.overpayN = s.overpay.length; s.overpayMean = ov.mean; s.postersN = s.posters.size; s.posterMass = mass(s.posters);
      var ak = shrink(s.ask, 5); s.askAdj = ak.adj; s.askN = s.ask.length;
      Object.keys(s.tiers).forEach(function (tf) { var tt = s.tiers[tf], sv = shrink(tt.overpay, 4); tt.adj = sv.adj; tt.mean = sv.mean; tt.postersN = tt.posters.size; tt.posterMass = mass(tt.posters); delete tt.posters; });
      s.wantRatio = Math.log((s.wants + 1) / (s.offers + 1));
      s.activity = s.offers + s.wants + s.completedOffered + s.completedWanted;
      delete s.offerUsers; delete s.wantUsers; delete s.askUsers; delete s.perUser; delete s.posters;
      if (s.activity > 0) rows.push(s);
    });
    function zs(field) { var vals = rows.map(function (s) { return s[field]; }); var m = mean(vals), sd = std(vals, m); rows.forEach(function (s) { s[field + 'Z'] = (s[field] - m) / sd; }); }
    zs('overpayAdj'); zs('askAdj'); zs('wantRatio');
    rows.forEach(function (s) { s.pressure = 0.45 * s.overpayAdjZ + 0.35 * s.wantRatioZ + 0.20 * s.askAdjZ; var n = s.overpayN + 0.3 * (s.offers + s.wants); s.confidence = n / (n + 6) * Math.min(1, (s.posterMass + 0.5 * Math.min(s.offers + s.wants, 6)) / 3); s.strength = s.pressure * s.confidence; });
    var unknownList = Array.from(unknown.entries()).sort(function (a, b) { return b[1] - a[1]; }).map(function (e) { return { name: e[0], count: e[1] }; });
    return { signals: sig, active: rows.length, pricedListings: pricedListings, pricedCompleted: pricedCompleted, unknownNames: unknownList, mirroredTrades: prep.mirrored, repostedTrades: prep.reposts };
  }

  /* ---------------- implied values from completed trades ---------------- */
  function solveImplied(ctx, opts) {
    var byName = ctx.byName, lambda = opts.lambda || 0.5, delta = 0.25, iters = opts.iters || 300, lr = opts.lr || 0.5;
    var eqs = [], perUid = {}, perUidKey = {};
    var VALUE_FLOOR = 0.001; // items below this (eggs, sealers, "adds") are not solved for: too cheap for their share of a trade to say anything
    // newest first: a trader's cap keeps their most recent trades and the 1/sqrt(k) decay weakens the older ones (6 equations for an unknown
    // account, up to 12 for a well-established one). An item a trader has already priced twice is not voted on by them again: the equation
    // stays, prices its other items, and is masked for that item (like the two-per-trader-per-item rule of the market layer)
    prepareCompleted(ctx).list.forEach(function (x) {
      if (x.dup) return;
      var c = x.c, uid = x.uid, off = priceSide(c.offering, byName), lf = priceSide(c.lookingFor, byName);
      if (!(off.ok && lf.ok && off.total > 0 && lf.total > 0)) return;
      if (Math.abs(Math.log(off.total / lf.total)) > TRADE_GATE) return;
      var rep = reputation(ctx.profiles, uid), cap = 6 + Math.round(6 * clamp((rep - REP_UNKNOWN) / 0.6, 0, 1));
      var k = perUid[uid] = (perUid[uid] || 0) + 1; if (k > cap) return;
      var age = isFinite(x.t) ? daysBetween(x.t, ctx.now) : 30, mask = {};
      off.parts.concat(lf.parts).forEach(function (p) { if (p.fixed || p.value < VALUE_FLOOR || mask[p.key] != null) return; var n = perUidKey[uid + '|' + p.key] = (perUidKey[uid + '|' + p.key] || 0) + 1; mask[p.key] = n > 2; });
      eqs.push({ w: rep * Math.exp(-Math.max(0, age) / 45) / Math.sqrt(k), off: off.parts, lf: lf.parts, uid: uid, known: isKnownTrader(ctx.profiles, uid), mask: mask, offTotal: off.total, lfTotal: lf.total });
    });
    // per item, for a set of equations: equations, posters and the linearised evidence the item's own trades give about it (net share x
    // clipped mismatch), split by trader so the gap can be re-estimated with any single trader left out
    function keyStats(list) {
      var stat = new Map();
      list.forEach(function (e) {
        var share = new Map();
        e.off.forEach(function (p) { if (p.fixed || p.value < VALUE_FLOOR || e.mask[p.key]) return; share.set(p.key, (share.get(p.key) || 0) - p.value / e.offTotal); });
        e.lf.forEach(function (p) { if (p.fixed || p.value < VALUE_FLOOR || e.mask[p.key]) return; share.set(p.key, (share.get(p.key) || 0) + p.value / e.lfTotal); });
        var r0 = clamp(Math.log(e.offTotal / e.lfTotal), -delta, delta);
        share.forEach(function (sh, key) {
          var st = stat.get(key); if (!st) { st = { n: 0, num: 0, den: 0, uids: new Map() }; stat.set(key, st); }
          var u = st.uids.get(e.uid); if (!u) { u = { w: 0, num: 0, den: 0 }; st.uids.set(e.uid, u); }
          st.n++; u.w += e.w; u.num += e.w * r0 * sh; u.den += e.w * sh * sh; st.num += e.w * r0 * sh; st.den += e.w * sh * sh;
        });
      });
      return stat;
    }
    var statAll = keyStats(eqs), eqsKnown = eqs.filter(function (e) { return e.known; }), statKnown = keyStats(eqsKnown);
    var keys = Array.from(statAll.keys()).filter(function (k) { var st = statAll.get(k); return st.n >= 2 && st.uids.size >= 2; }), idx = new Map(); keys.forEach(function (k, i) { idx.set(k, i); });
    var x0 = keys.map(function (k) { var nm = k.split('|'), it = byName.get(nm[0]); return Math.log(it.cat === 'Pets' ? it.values[nm[1]] : it.values.v); });
    if (!keys.length) return { keys: 0, eqs: eqs.length, eqsKnown: eqsKnown.length, results: [], finalLoss: 0, byKey: new Map() };
    // ridge-regularised Huber solve over one set of equations; a key nobody in the set trades stays at its listed value
    function solve(list) {
      var x = x0.slice(), loss = 0;
      function sideVal(parts) { var s = 0; parts.forEach(function (p) { var i = idx.get(p.key); s += (i == null) ? p.value : Math.exp(x[i]); }); return s; }
      // diagonal preconditioner: total equation weight touching each unknown, so heavily traded items take steps of the same size as rare ones
      var deg = new Array(keys.length).fill(0);
      list.forEach(function (e) { e.off.concat(e.lf).forEach(function (p) { var i = idx.get(p.key); if (i != null && !e.mask[p.key]) deg[i] += e.w; }); });
      for (var it = 0; it < iters; it++) {
        var g = new Array(keys.length).fill(0); loss = 0;
        list.forEach(function (e) {
          var so = sideVal(e.off), sl = sideVal(e.lf), r = Math.log(so / sl);
          var dr = Math.abs(r) <= delta ? r : delta * Math.sign(r); loss += e.w * (Math.abs(r) <= delta ? 0.5 * r * r : delta * (Math.abs(r) - 0.5 * delta));
          e.off.forEach(function (p) { var i = idx.get(p.key); if (i != null && !e.mask[p.key]) g[i] += e.w * dr * Math.exp(x[i]) / so; });
          e.lf.forEach(function (p) { var i = idx.get(p.key); if (i != null && !e.mask[p.key]) g[i] -= e.w * dr * Math.exp(x[i]) / sl; });
        });
        for (var i = 0; i < keys.length; i++) { g[i] += 2 * lambda * (x[i] - x0[i]); x[i] -= clamp(lr * g[i] / (deg[i] + 2 * lambda), -0.1, 0.1); x[i] = clamp(x[i], x0[i] - 0.7, x0[i] + 0.7); }
      }
      return { x: x, loss: loss };
    }
    // two solves: every trade gives the implied value that is shown; the trades of traders with a track record alone give the gap a call may
    // rest on. Unknown accounts (alts included: an account whose profile never rendered is indistinguishable from one) inform the number
    // but can never move a call in either direction.
    var all = solve(eqs), kn = solve(eqsKnown);
    var results = keys.map(function (k, i) {
      var nm = k.split('|'), st = statAll.get(k), sk = statKnown.get(k), g = all.x[i] - x0[i], gk = kn.x[i] - x0[i];
      var tot = 0, top = 0, repMass = 0; st.uids.forEach(function (u, uid) { tot += u.w; if (u.w > top) top = u.w; repMass += reputation(ctx.profiles, uid); });
      // among the known traders, the linearised gap with any single one of them left out; the call-worthy gap is the known-only solver gap
      // scaled by the share of that evidence no single trader carries (zero when their trades do not even point the way the solver moved it)
      var survive = 0;
      if (sk && sk.uids.size >= 2) {
        var lin = sk.num / (sk.den + 2 * lambda), looMin = Infinity;
        sk.uids.forEach(function (u) { var l = (sk.num - u.num) / (sk.den - u.den + 2 * lambda), m = Math.sign(l) === Math.sign(lin) ? Math.abs(l) : 0; if (m < looMin) looMin = m; });
        if (Math.abs(lin) > 0 && Math.sign(lin) === Math.sign(gk)) survive = clamp(looMin / Math.abs(lin), 0, 1);
      }
      return { key: k, name: nm[0], variant: nm[1], listed: Math.exp(x0[i]), implied: Math.exp(all.x[i]), gap: Math.exp(g) - 1, gapKnown: Math.exp(gk) - 1, gapRobust: Math.exp(gk * survive) - 1,
        n: st.n, posters: st.uids.size, nKnown: sk ? sk.n : 0, postersKnown: sk ? sk.uids.size : 0, repMass: repMass, topShare: tot ? top / tot : 0 };
    });
    results.sort(function (a, b) { return Math.abs(b.gap) * Math.log(1 + b.n) - Math.abs(a.gap) * Math.log(1 + a.n); });
    return { keys: keys.length, eqs: eqs.length, eqsKnown: eqsKnown.length, results: results, finalLoss: all.loss, byKey: new Map(results.map(function (r) { return [r.key, r]; })) };
  }

  /* ---------------- combine ---------------- */
  function fmtPct(x) { return (x >= 0 ? '+' : '') + (x * 100).toFixed(1) + '%'; }
  function buildPredictions(ctx, hist, market, implied) {
    var preds = [];
    ctx.items.forEach(function (it) {
      var isPet = it.cat === 'Pets';
      (isPet ? PET_TIERS : ITEM_TIERS).forEach(function (T) {
        var v = it.values[T.field]; if (v == null || !(v > 0)) return;
        var hk = it.name + '|' + T.v, f = featuresAt(hk, ctx.now, ctx); if (!f) return;
        var p = hist.ok ? hist.predict(f.x) : [1, 0, 0]; var tier = tierOf(v), mv = hist.ok ? hist.moves[tier] : { up: 0.08, down: -0.08 };
        var eHist = p[1] * mv.up + p[2] * mv.down;
        var s = market.signals.get(it.name), imp = implied.byKey ? implied.byKey.get(it.name + '|' + T.field) : null;
        // distinct posters of THIS tier in the listing window (one account listing FR, R, F and no-potion is one poster)
        var offeredNow = s ? (s.offersByTier[T.field] || 0) : 0, wantedNow = s ? (s.wantsByTier[T.field] || 0) : 0;
        // market evidence is judged per tier: a heavily traded Regular pet lends its Mega row only half its confidence
        var tt = s ? s.tiers[T.field] : null, nT = (tt ? tt.n : 0) + 0.3 * (offeredNow + wantedNow);
        var confTier = tt ? nT / (nT + 6) * Math.min(1, (tt.posterMass + 0.5 * Math.min(offeredNow + wantedNow, 6)) / 3) : 0;
        var conf = s ? Math.max(confTier, 0.5 * s.confidence) : 0, eMarket = 0, reasons = [];
        // implied-value evidence needs three trades from two traders, and two unknown accounts alone are not enough: one of them must have a
        // track record or a third trader must agree. The expectation rests on the known traders' gap with any one of them left out; with
        // fewer than two known traders the gentler pressure score is used instead.
        var impOK = imp && imp.n >= 3 && imp.posters >= 2 && (imp.postersKnown >= 1 || imp.posters >= 3);
        if (impOK && imp.postersKnown >= 2) eMarket = clamp(Math.log(1 + imp.gapRobust), -0.3, 0.3) * (imp.nKnown / (imp.nKnown + 4));
        else if (s) eMarket = clamp(s.pressure, -3, 3) * 0.03;
        var wM = 0.55 * conf, e = (1 - wM) * eHist + wM * eMarket;
        // reasons (only real, observed facts)
        var tl = T.label ? T.label + ' ' : '', tlo = T.label ? T.label.toLowerCase() + ' ' : '';
        if (f.n30 > 0) reasons.push(tl + (f.n30 === 1 ? 'value updated once' : 'value updated ' + f.n30 + ' times') + ' in the last 30 days (' + fmtPct(Math.exp(f.chg30) - 1) + ')');
        else if (f.sinceLog) reasons.push('No ' + tlo + 'value change since the public log began (' + Math.round(f.daysSince) + '+ days)');
        else reasons.push('No ' + tlo + 'value change for ' + (f.daysSince < 1 ? 'less than a day' : Math.round(f.daysSince) + (f.daysSince >= 180 ? '+' : '') + ' days'));
        if (Math.abs(f.streak) >= 2) reasons.push(Math.abs(f.streak) + ' consecutive ' + (f.streak > 0 ? 'raises' : 'drops'));
        if (f.chg90 && Math.abs(Math.exp(f.chg90) - 1) >= 0.05) reasons.push('90-day change ' + fmtPct(Math.exp(f.chg90) - 1));
        if (s) {
          if (tt && tt.n >= 3) reasons.push((tt.mean > 0 ? 'Overpaid' : 'Underpaid') + ' for the ' + (T.label || 'item').toLowerCase() + ' in completed trades: avg ' + fmtPct(tt.mean) + ' across ' + tt.n + ' trades from ' + tt.postersN + ' traders');
          else if (s.overpayN >= 3) reasons.push((s.overpayMean > 0 ? 'Overpaid' : 'Underpaid') + ' in completed trades (all tiers): avg ' + fmtPct(s.overpayMean) + ' across ' + s.overpayN + ' trades from ' + s.postersN + ' traders');
          if (offeredNow + wantedNow >= 5) reasons.push((T.label || 'Item') + ' wanted by ' + wantedNow + ' traders vs offered by ' + offeredNow + ' in listings (last ' + (ctx.listingWindowHours || 48) + 'h)');
          if (s.askN >= 5 && Math.abs(s.askAdj) >= 0.02) reasons.push('Traders ' + (s.askAdj > 0 ? 'offer above' : 'ask below') + ' its value when listing (' + fmtPct(s.askAdj) + ')');
        }
        if (impOK) reasons.push('Market-implied ' + tlo + 'value ' + roundValue(imp.implied) + ' vs listed ' + roundValue(imp.listed) + ' (' + fmtPct(imp.gap) + ', ' + imp.n + ' trades from ' + imp.posters + ' traders; ' + (imp.postersKnown >= 2 ? fmtPct(imp.gapRobust) + ' on the ' + imp.postersKnown + ' with a track record alone, any one of them left out' : imp.postersKnown === 1 ? 'only one with a track record' : 'none with a track record') + ')');
        // a call needs a material expected move AND either a majority probability from history or strong, multi-trader trade evidence:
        // five trades from four traders, at least two of them with a real track record (three accepted trades, two-week-old account) and
        // enough reputation between them that four throwaway accounts cannot do it, and a 5% gap that survives leaving any one trader out
        var strongImp = impOK && imp.n >= 5 && imp.posters >= 4 && imp.postersKnown >= 2 && imp.repMass >= 1.2 && Math.abs(imp.gapRobust) >= 0.05 && imp.listed >= 0.005;
        var dir = 'flat', wrz = s && s.wantRatioZ != null ? s.wantRatioZ : 0;
        // the market path needs history not to argue against it: at least the base rate of that move (raises ~12%, drops ~4% of item-weeks)
        if (e > 0.02 && (p[1] >= 0.5 || (strongImp && imp.gapRobust > 0 && p[1] >= 0.12 && wrz > -0.75) || (p[1] >= 0.35 && conf >= 0.4))) dir = 'up';
        else if (e < -0.02 && (p[2] >= 0.5 || (strongImp && imp.gapRobust < 0 && p[2] >= 0.04) || (p[2] >= 0.3 && conf >= 0.4))) dir = 'down';
        var pDir = dir === 'up' ? p[1] : dir === 'down' ? p[2] : p[0];
        var pUpCal = hist.ok ? hist.calibrate(1, p[1]) : p[1], pDownCal = hist.ok ? hist.calibrate(2, p[2]) : p[2];
        // trading opportunity scores: a rise only pays if the pet is in demand and actually changes hands
        var demand = it.demand[isPet ? T.field : 'v'];
        var liquidity = offeredNow + wantedNow + (s ? s.completedOffered + s.completedWanted : 0);
        var demandF = ({ High: 1, Medium: 0.8, Low: 0.55 })[demand] || 0.7;
        var flipScore = Math.max(0, e) * (0.4 + 0.6 * p[1]) * demandF * (1 + Math.min(liquidity, 40) / 40) * (0.7 + 0.3 * conf);
        var dumpScore = Math.max(0, -e) * (0.4 + 0.6 * p[2]) * (1 + Math.min(liquidity, 40) / 40) * (0.7 + 0.3 * conf);
        // every potion state inside this tier moves with it
        var subs = T.subs.filter(function (k) { return it.values[k] != null && it.values[k] > 0; }).map(function (k) { return { code: k, label: VARIANT_LABEL[k] || 'Value', value: it.values[k], predicted: roundValue(it.values[k] * Math.exp(e)) }; });
        preds.push({ name: it.name, cat: it.cat, origin: it.origin, variant: T.label || 'Item', variantField: T.field, variantVar: T.v, key: it.name + '|' + T.field, value: v, tier: tier, demand: demand, lastUpdatedAt: it.lastUpdatedAt, lastMovedAt: f.lastT ? new Date(f.lastT).toISOString() : null,
          pFlat: p[0], pUp: p[1], pDown: p[2], pUpCal: pUpCal, pDownCal: pDownCal, eHist: eHist, eMarket: eMarket, marketWeight: wM, expectedMove: e, predicted: roundValue(v * Math.exp(e)), direction: dir, tierTrades: tt ? tt.n : 0, tierTraders: tt ? tt.postersN : 0,
          score: Math.abs(e) * (0.5 + 0.5 * pDir) * (0.6 + 0.4 * conf), marketConfidence: conf, marketPressure: s ? s.pressure : null, implied: imp || null, reasons: reasons, feat: f,
          liquidity: liquidity, offeredNow: offeredNow, wantedNow: wantedNow, flipScore: flipScore, dumpScore: dumpScore, gainAbs: v * (Math.exp(e) - 1), subs: subs });
      });
    });
    preds.sort(function (a, b) { return b.score - a.score; });
    return preds;
  }

  /* ---------------- public build ---------------- */
  function build(data, options) {
    options = options || {};
    var t0 = Date.now();
    var idx = indexItems(data.items);
    var hs = buildHistory(data.updates), series = hs.series;
    var now = Date.parse(data.meta.collectedAt) || Date.now();
    // the public update log misses some changes: close every series on today's listed value so history and catalogue agree
    var logGaps = 0;
    data.items.forEach(function (it) { (it.cat === 'Pets' ? PET_TIERS : ITEM_TIERS).forEach(function (T) { var cur = it.values[T.field]; if (!(cur > 0)) return; var arr = series.get(it.name + '|' + T.v); if (!arr || !arr.length) return; var last = arr[arr.length - 1]; if (!(last.new > 0) || Math.abs(last.new - cur) / cur < 0.001) return; var t = Date.parse(it.lastUpdatedAt); if (!isFinite(t) || t <= last.t) t = last.t + 1; arr.push({ t: Math.min(t, now), prev: last.new, new: cur, synthetic: true }); logGaps++; }); });
    var firstT = data.updates.length ? Date.parse(data.updates[0].t) : now, lastT = data.updates.length ? Date.parse(data.updates[data.updates.length - 1].t) : now;
    var profiles = data.profiles || {}, profilesWithStats = 0; Object.keys(profiles).forEach(function (u) { if (profiles[u] && profiles[u].accepted != null) profilesWithStats++; });
    var ctx = { items: data.items, byName: idx.byName, series: series, demandSeries: hs.demandSeries, valueAt: makeValueAt(series, idx.byName), demandAt: makeDemandAt(hs.demandSeries, idx.byName), now: now, histStart: Math.max(firstT, BASELESS_START), listings: data.listings, completed: data.completed, profiles: profiles, listingWindowHours: data.meta.listingWindowHours || 48 };
    var hist = buildHistoryModel(ctx, { iters: options.iters || 400, lr: 0.5, lambda: 1e-3 });
    var market = buildMarket(ctx);
    var implied = solveImplied(ctx, {});
    var preds = buildPredictions(ctx, hist, market, implied);
    var nUpd = 0; series.forEach(function (a) { nUpd += a.length; });
    var summary = { items: data.items.length, predictionRows: preds.length, updateRows: nUpd, logGaps: logGaps, updatesFrom: new Date(firstT).toISOString().slice(0, 10), updatesTo: new Date(lastT).toISOString().slice(0, 10), historyDays: Math.round(daysBetween(ctx.histStart, now)), listings: data.listings.length, completed: data.completed.length, profiles: Object.keys(profiles).length, profilesWithStats: profilesWithStats,
      pricedListings: market.pricedListings, pricedCompleted: market.pricedCompleted, impliedKeys: implied.keys, itemsWithMarket: market.active, collectedAt: data.meta.collectedAt, buildMs: Date.now() - t0, nameCollisions: idx.collisions, unknownNames: market.unknownNames.slice(0, 40),
      // the store writes listingBoundaryReached as true/false or 1/0: anything explicitly falsy means the run did not reach the previous listings
      listingGaps: (data.meta.listingGaps || []).length, degraded: !!(data.meta.run && data.meta.run.degraded), boundaryReached: !(data.meta.run && data.meta.run.listingBoundaryReached != null && !data.meta.run.listingBoundaryReached),
      unparsedProfiles: (data.meta.run && data.meta.run.unparsedProfiles) || 0, mirroredTrades: market.mirroredTrades, repostedTrades: market.repostedTrades,
      raise: preds.filter(function (p) { return p.direction === 'up'; }).length, lower: preds.filter(function (p) { return p.direction === 'down'; }).length };
    function explorer(name) {
      var it = idx.byName.get(name); if (!it) return null;
      var isPet = it.cat === 'Pets';
      var tiers = (isPet ? PET_TIERS : ITEM_TIERS).map(function (T) {
        var hk = name + '|' + T.v, arr = series.get(hk) || [], pts = [], cur = it.values[T.field];
        if (cur == null) return null;
        if (arr.length) { pts.push({ t: ctx.histStart, v: arr[0].t >= ctx.histStart ? arr[0].prev : lookupAt(arr, ctx.histStart) }); arr.forEach(function (u) { if (u.t >= ctx.histStart) pts.push({ t: u.t, v: u.new }); }); }
        else pts.push({ t: ctx.histStart, v: cur });
        if (pts[pts.length - 1].t < now) pts.push({ t: now, v: cur });
        return { label: T.label || 'Value', field: T.field, v: T.v, series: pts, updates: arr.slice().reverse(), prediction: preds.find(function (p) { return p.name === name && p.variantField === T.field; }) || null, implied: implied.results.filter(function (r) { return r.name === name && r.variant === T.field; }) };
      }).filter(Boolean);
      if (!tiers.length) return null;
      return { item: it, tiers: tiers, series: tiers[0].series, updates: tiers[0].updates, prediction: tiers[0].prediction, market: market.signals.get(name) || null, implied: implied.results.filter(function (r) { return r.name === name; }) };
    }
    return { summary: summary, history: hist, market: market, implied: implied, predictions: preds, explorer: explorer, ctx: ctx, featureNames: FEATURE_NAMES, tierOf: tierOf, roundValue: roundValue, variantLabel: VARIANT_LABEL, petTiers: PET_TIERS };
  }

  /* ---------------- insights: descriptive statistics for the dashboard's Insights tab ---------------- */
  function median(a) { if (!a.length) return null; var s = a.slice().sort(function (x, y) { return x - y; }); var m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
  function pct(a, q) { if (!a.length) return null; var s = a.slice().sort(function (x, y) { return x - y; }); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; }
  function inc(map, k, n) { map.set(k, (map.get(k) || 0) + (n == null ? 1 : n)); }
  function top(map, n, min) { return Array.from(map.entries()).filter(function (e) { return e[1] >= (min || 0); }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, n).map(function (e) { return { name: e[0], n: e[1] }; }); }
  var WDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function buildInsights(model) {
    var ctx = model.ctx, byName = ctx.byName, now = ctx.now;
    // ---- listings (recent window)
    var posters = new Map(), offered = new Map(), wanted = new Map(), signs = new Map(), minT = Infinity, maxT = -Infinity, lHours = new Array(24).fill(0);
    ctx.listings.forEach(function (l) { inc(posters, l.uid); var t = Date.parse(l.t); if (isFinite(t)) { if (t < minT) minT = t; if (t > maxT) maxT = t; lHours[new Date(t).getUTCHours()]++; } l.offering.forEach(function (e) { if (e.name) inc(offered, e.name); }); l.lookingFor.forEach(function (e) { if (e.name) inc(wanted, e.name); else if (e.sign) inc(signs, e.sign); }); });
    var spanH = isFinite(minT) ? Math.max(0.25, (maxT - minT) / 3600000) : 1;
    var perPoster = Array.from(posters.values()).sort(function (a, b) { return b - a; }), totalL = ctx.listings.length;
    var top1 = perPoster.slice(0, Math.max(1, Math.ceil(perPoster.length * 0.01))).reduce(function (s, x) { return s + x; }, 0), top10 = perPoster.slice(0, Math.max(1, Math.ceil(perPoster.length * 0.1))).reduce(function (s, x) { return s + x; }, 0);
    var ratio = []; offered.forEach(function (o, name) { var w = wanted.get(name) || 0; if (o + w >= 20) ratio.push({ name: name, offered: o, wanted: w, ratio: (w + 1) / (o + 1) }); }); wanted.forEach(function (w, name) { if (!offered.has(name) && w >= 20) ratio.push({ name: name, offered: 0, wanted: w, ratio: (w + 1) }); });
    ratio.sort(function (a, b) { return b.ratio - a.ratio; });
    // ---- completed trades
    var traders = new Set(), sides = new Map(), itemsPerSide = [], totals = [], cHours = new Array(24).fill(0), cDays = new Array(7).fill(0), priced = 0, cMin = Infinity;
    ctx.completed.forEach(function (c) { traders.add(c.uid); var t = Date.parse(c.t); if (isFinite(t)) { cHours[new Date(t).getUTCHours()]++; cDays[new Date(t).getUTCDay()]++; if (t < cMin) cMin = t; } itemsPerSide.push(c.offering.length, c.lookingFor.length); c.offering.concat(c.lookingFor).forEach(function (e) { if (e.name) inc(sides, e.name); }); var off = priceSide(c.offering, byName), lf = priceSide(c.lookingFor, byName); if (off.ok && lf.ok) { priced++; totals.push(Math.max(off.total, lf.total)); } });
    var overpays = [], underpays = []; model.market.signals.forEach(function (s) { if (s.overpayN >= 8 && s.overpayMean != null) { (s.overpayMean > 0 ? overpays : underpays).push({ name: s.name, mean: s.overpayMean, n: s.overpayN }); } });
    overpays.sort(function (a, b) { return b.mean - a.mean; }); underpays.sort(function (a, b) { return a.mean - b.mean; });
    // ---- potion premiums and tier multipliers
    var rF = [], rR = [], rFR = [], nMul = {}, mMul = {};
    ctx.items.forEach(function (it) { if (it.cat !== 'Pets') return; var v = it.values; if (v.np > 0 && v.f > 0 && v.r > 0 && v.fr > 0) { rF.push(v.f / v.np); rR.push(v.r / v.np); rFR.push(v.fr / v.np); } var tr = tierOf(v.fr); if (v.fr > 0 && v.nfr > 0) { (nMul[tr] = nMul[tr] || []).push(v.nfr / v.fr); } if (v.nfr > 0 && v.mfr > 0) { (mMul[tr] = mMul[tr] || []).push(v.mfr / v.nfr); } });
    var tiers = ['high', 'highmid', 'mid', 'low', 'insignificant'];
    var multipliers = tiers.map(function (t) { return { tier: t, neonOverRegular: nMul[t] ? median(nMul[t]) : null, megaOverNeon: mMul[t] ? median(mMul[t]) : null, n: (nMul[t] || []).length }; });
    // ---- Value Board activity (value changes only)
    var weeks = new Map(), bHours = new Array(24).fill(0), bDays = new Array(7).fill(0), byCat = new Map(), perItem30 = new Map(), raiseSizes = {}, dropSizes = {}, lastUpd = new Map(), nUpd = 0;
    ctx.series.forEach(function (arr, key) { var nm = key.split('|'), it = byName.get(nm[0]); var cat = it ? it.cat : 'Unknown';
      arr.forEach(function (u) { if (u.t < ctx.histStart || u.prev === u.new || !(u.prev > 0)) return; nUpd++; var d = new Date(u.t); var wk = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - d.getUTCDay())).toISOString().slice(0, 10); inc(weeks, wk); bHours[d.getUTCHours()]++; bDays[d.getUTCDay()]++;
        var c = byCat.get(cat) || { cat: cat, raises: 0, drops: 0 }; if (u.new > u.prev) c.raises++; else c.drops++; byCat.set(cat, c);
        var tr = tierOf(u.prev), lr = Math.log(u.new / u.prev); (u.new > u.prev ? (raiseSizes[tr] = raiseSizes[tr] || []) : (dropSizes[tr] = dropSizes[tr] || [])).push(Math.abs(lr));
        if (u.t > now - 30 * DAY && nm[1] === 'v') inc(perItem30, nm[0]);
        if (nm[1] === 'v') { var prev = lastUpd.get(nm[0]); if (!prev || u.t > prev) lastUpd.set(nm[0], u.t); } }); });
    var weekRows = Array.from(weeks.entries()).sort().map(function (e) { return { label: e[0], v: e[1] }; });
    var stepSizes = tiers.map(function (t) { return { tier: t, raiseMedian: raiseSizes[t] ? median(raiseSizes[t]) : null, raiseP90: raiseSizes[t] ? pct(raiseSizes[t], 0.9) : null, nRaise: (raiseSizes[t] || []).length, dropMedian: dropSizes[t] ? median(dropSizes[t]) : null, dropP90: dropSizes[t] ? pct(dropSizes[t], 0.9) : null, nDrop: (dropSizes[t] || []).length }; });
    var mostUpdated = top(perItem30, 15).map(function (r) { var p = model.predictions.find(function (q) { return q.name === r.name && q.variantVar === 'v'; }); return { name: r.name, n: r.n, chg30: p ? Math.exp(p.feat.chg30) - 1 : null, value: p ? p.value : null }; });
    var regular = model.predictions.filter(function (p) { return p.variantVar === 'v' && p.value >= 0.01; });
    function movers(field, dir, n) { return regular.filter(function (p) { return p.feat[field] && (dir > 0 ? p.feat[field] > 0 : p.feat[field] < 0); }).sort(function (a, b) { return dir > 0 ? b.feat[field] - a.feat[field] : a.feat[field] - b.feat[field]; }).slice(0, n).map(function (p) { return { name: p.name, cat: p.cat, value: p.value, change: Math.exp(p.feat[field]) - 1 }; }); }
    var never = 0, stale90 = 0; ctx.items.forEach(function (it) { var t = lastUpd.get(it.name); if (!t) never++; else if (t < now - 90 * DAY) stale90++; });
    // ---- model overview
    var byTierVar = {}; model.predictions.forEach(function (p) { var k = p.tier + '|' + p.variant; var o = byTierVar[k] || (byTierVar[k] = { tier: p.tier, variant: p.variant, up: 0, down: 0, flat: 0 }); o[p.direction === 'up' ? 'up' : p.direction === 'down' ? 'down' : 'flat']++; });
    var pHist = new Array(10).fill(0); model.predictions.forEach(function (p) { pHist[Math.min(9, Math.floor(p.pUp * 10))]++; });
    // agreement is judged only where BOTH layers take a side; a neutral market is 'one-sided', not a disagreement
    var agree = 0, disagree = 0, oneSided = 0, dis = []; model.predictions.forEach(function (p) { if (p.marketConfidence < 0.3) return; var a = p.eHist > 0.02 ? 1 : p.eHist < -0.02 ? -1 : 0, b = p.eMarket > 0.02 ? 1 : p.eMarket < -0.02 ? -1 : 0; if (a === 0 && b === 0) return; if (a === 0 || b === 0) { oneSided++; return; } if (a === b) agree++; else { disagree++; if (p.marketConfidence >= 0.4) dis.push(p); } });
    dis.sort(function (a, b) { return Math.abs(b.eHist - b.eMarket) - Math.abs(a.eHist - a.eMarket); });
    // ---- coverage
    var nullCounts = { np: 0, f: 0, r: 0, n: 0, nf: 0, nr: 0, m: 0, mf: 0, mr: 0 }, pets = 0; ctx.items.forEach(function (it) { if (it.cat !== 'Pets') return; pets++; Object.keys(nullCounts).forEach(function (k) { if (it.values[k] == null) nullCounts[k]++; }); });
    return {
      listings: { count: totalL, windowHours: ctx.listingWindowHours, spanHours: spanH, perHour: totalL / spanH, posters: posters.size, medianPerPoster: median(perPoster), top1pctShare: totalL ? top1 / totalL : 0, top10pctShare: totalL ? top10 / totalL : 0, mostOffered: top(offered, 15), mostWanted: top(wanted, 15), ratioHigh: ratio.slice(0, 12), ratioLow: ratio.slice(-12).reverse(), signs: top(signs, 12), hours: lHours },
      completed: { count: ctx.completed.length, priced: priced, traders: traders.size, sinceDays: isFinite(cMin) ? Math.round((now - cMin) / DAY) : null, medianItemsPerSide: median(itemsPerSide), medianTotal: median(totals), p90Total: pct(totals, 0.9), mostTraded: top(sides, 15), overpays: overpays.slice(0, 12), underpays: underpays.slice(0, 12), hours: cHours, days: cDays },
      potions: { nPets: rF.length, fOverNoPot: median(rF), rOverNoPot: median(rR), frOverNoPot: median(rFR), multipliers: multipliers },
      board: { changes: nUpd, weeks: weekRows, hours: bHours, days: bDays, byCategory: Array.from(byCat.values()).sort(function (a, b) { return (b.raises + b.drops) - (a.raises + a.drops); }), stepSizes: stepSizes, mostUpdated30: mostUpdated, up7: movers('chg7', 1, 10), down7: movers('chg7', -1, 10), up30: movers('chg30', 1, 10), down30: movers('chg30', -1, 10), up90: movers('chg90', 1, 10), down90: movers('chg90', -1, 10), neverUpdated: never, stale90: stale90 },
      model: { rows: model.predictions.length, byTierVariant: Object.values(byTierVar), pUpHistogram: pHist, agree: agree, disagree: disagree, oneSided: oneSided, disagreements: dis.slice(0, 15).map(function (p) { return { name: p.name, variant: p.variant, value: p.value, eHist: p.eHist, eMarket: p.eMarket, conf: p.marketConfidence, direction: p.direction }; }) },
      coverage: { pricedListings: model.market.pricedListings, listings: ctx.listings.length, pricedCompleted: model.market.pricedCompleted, completed: ctx.completed.length, unknownNames: model.market.unknownNames.slice(0, 12), pets: pets, nullPotionStates: nullCounts, nameCollisions: model.summary.nameCollisions }
    };
  }

  var api = { build: build, insights: buildInsights, tierOf: tierOf, roundValue: roundValue, priceEntry: priceEntry, VARIANT_FIELD: VARIANT_FIELD, VARIANT_LABEL: VARIANT_LABEL, FEATURE_NAMES: FEATURE_NAMES, TIER_ORDER: TIER_ORDER };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AMVGGEngine = api;
})(typeof window !== 'undefined' ? window : this);
