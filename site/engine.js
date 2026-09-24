/* AMVGG Value Intelligence — prediction engine (pure JS, no DOM, no dependencies)
 * Input : data.json produced by build/build_data.pl (items, value-update log, active listings, completed trades, trader profiles)
 * Output: AMVGGEngine.build(data) -> model with market signals, implied values, a backtested history model and per-item predictions.
 * Portable: drop this file into the Next.js app and run build() in a cron job against the live database instead of data.json.
 */
(function (root) {
  'use strict';
  var DAY = 86400000;
  var VARIANT_FIELD = { '': 'np', fr: 'fr', r: 'r', f: 'f', n: 'n', nr: 'nr', nf: 'nf', nfr: 'nfr', m: 'm', mr: 'mr', mf: 'mf', mfr: 'mfr' };
  var VARIANT_LABEL = { np: 'No potion', fr: 'FR', r: 'R', f: 'F', n: 'N', nr: 'NR', nf: 'NF', nfr: 'NFR', m: 'M', mr: 'MR', mf: 'MF', mfr: 'MFR', v: '' };
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
    if (it.cat === 'Pets') { f = VARIANT_FIELD[e.type || ''] || 'fr'; value = it.values[f]; if (value == null) { value = it.values.fr; f = 'fr'; } }
    else { f = 'v'; value = it.values.v; }
    if (value == null || !isFinite(value)) return null;
    return { value: value, key: it.name + '|' + f, name: it.name, variant: f, item: it, label: it.name + (VARIANT_LABEL[f] ? ' ' + VARIANT_LABEL[f] : '') };
  }
  function priceSide(side, byName) {
    var total = 0, parts = [], ok = true;
    for (var i = 0; i < side.length; i++) { var p = priceEntry(side[i], byName); if (!p) { ok = false; parts.push({ label: side[i].name || side[i].sign || '?', value: null, unknown: true }); continue; } total += p.value; parts.push(p); }
    return { ok: ok && side.length > 0, total: total, parts: parts };
  }

  /* ---------------- value history from the update log ---------------- */
  function buildHistory(updates) {
    var series = new Map(); // key -> [{t, prev, new}] sorted asc
    updates.forEach(function (u) {
      if (u.prev == null && u.new == null) return; // demand-only rows
      if (u.prev == null || u.new == null) return;
      var key = u.item + '|' + u.var, t = Date.parse(u.t); if (!isFinite(t)) return;
      if (!series.has(key)) series.set(key, []);
      series.get(key).push({ t: t, prev: u.prev, new: u.new });
    });
    series.forEach(function (arr) { arr.sort(function (a, b) { return a.t - b.t; }); });
    return series;
  }
  function makeValueAt(series, byName) {
    return function (key, t) {
      var arr = series.get(key);
      if (!arr || !arr.length) { var nm = key.split('|'), it = byName.get(nm[0]); if (!it) return null; return it.cat === 'Pets' ? it.values[nm[1] === 'v' ? 'fr' : nm[1]] : it.values.v; }
      if (t < arr[0].t) return arr[0].prev;
      var lo = 0, hi = arr.length - 1, ans = 0;
      while (lo <= hi) { var mid = (lo + hi) >> 1; if (arr[mid].t <= t) { ans = mid; lo = mid + 1; } else hi = mid - 1; }
      return arr[ans].new;
    };
  }

  /* ---------------- history features ---------------- */
  var FEATURE_NAMES = ['log10 value', 'log10 value²', 'change 7d', 'change 30d', 'change 90d', 'updates 30d', 'updates 90d', 'days since update', 'last direction', 'streak', 'is pet', 'demand', 'other-tier updates 30d', 'has 90d history', 'tier (0 regular, 1 neon, 2 mega)'];
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
    var daysSince = last ? Math.min(180, daysBetween(last.t, t)) : 180;
    var other30 = 0;
    if (it && it.cat === 'Pets') { ['v', 'nfr', 'mfr'].forEach(function (vv) { if (vv === vkey) return; var a2 = ctx.series.get(name + '|' + vv) || []; for (var j = 0; j < a2.length; j++) { if (a2[j].t > t) break; if (a2[j].t > t - 30 * DAY && a2[j].prev !== a2[j].new) other30++; } }); }
    var demField = (it && it.cat === 'Pets') ? (vkey === 'v' ? 'fr' : vkey) : 'v';
    var dem = it ? DEMAND_NUM[it.demand[demField]] : 1; if (dem == null) dem = 1;
    var tierIdx = vkey === 'nfr' ? 1 : vkey === 'mfr' ? 2 : 0;
    var lv = Math.log10(v0);
    return { v0: v0, x: [lv, lv * lv, chg(7), chg(30), chg(90), n30, n90, daysSince / 30, lastDir, clamp(streak, -5, 5), it && it.cat === 'Pets' ? 1 : 0, dem, other30, (t - 90 * DAY) >= ctx.histStart ? 1 : 0, tierIdx], daysSince: daysSince, n30: n30, n90: n90, lastDir: lastDir, streak: streak, chg7: chg(7), chg30: chg(30), chg90: chg(90) };
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
    var splitT = dates[dates.length - nTestDates];
    var train = rows.filter(function (r) { return r.t < splitT; }), test = rows.filter(function (r) { return r.t >= splitT; });
    var m = trainSoftmax(train.map(function (r) { return r.x; }), train.map(function (r) { return r.y; }), opts);
    // evaluate
    var conf = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], correct = 0, base = [0, 0, 0];
    var scored = test.map(function (r) { var p = m.predict(r.x); var pred = p.indexOf(Math.max(p[0], p[1], p[2])); conf[r.y][pred]++; if (pred === r.y) correct++; base[r.y]++; return { r: r, p: p }; });
    var majority = Math.max(base[0], base[1], base[2]) / test.length;
    var momOK = 0; test.forEach(function (r) { var pred = (r.daysSince <= 14 && r.lastDir === 1) ? 1 : (r.daysSince <= 14 && r.lastDir === -1) ? 2 : 0; if (pred === r.y) momOK++; });
    function precAt(cls, k) { var s = scored.slice().sort(function (a, b) { return b.p[cls] - a.p[cls]; }).slice(0, k); var hit = 0; s.forEach(function (x) { if (x.r.y === cls) hit++; }); return { k: Math.min(k, s.length), hit: hit, prec: s.length ? hit / s.length : 0, meanP: mean(s.map(function (x) { return x.p[cls]; })) }; }
    function f1(cls) { var tp = conf[cls][cls], fp = 0, fn = 0; for (var i = 0; i < 3; i++) { if (i !== cls) { fp += conf[i][cls]; fn += conf[cls][i]; } } var pr = tp + fp ? tp / (tp + fp) : 0, rc = tp + fn ? tp / (tp + fn) : 0; return pr + rc ? 2 * pr * rc / (pr + rc) : 0; }
    var calib = []; for (var b = 0; b < 5; b++) calib.push({ lo: b / 5, hi: (b + 1) / 5, n: 0, sumP: 0, hits: 0 });
    scored.forEach(function (s) { var p = s.p[1], b = Math.min(4, Math.floor(p * 5)); calib[b].n++; calib[b].sumP += p; if (s.r.y === 1) calib[b].hits++; });
    // expected move per tier from training rows
    // typical size of a move per tier: median (robust to the handful of huge drops) and capped at ±25%
    function median(a) { if (!a.length) return null; var s = a.slice().sort(function (x, y) { return x - y; }); var m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
    var CAP = Math.log(1.25);
    var moves = {}; ['high', 'highmid', 'mid', 'low', 'insignificant'].forEach(function (tr) { var up = train.filter(function (r) { return r.tier === tr && r.y === 1; }).map(function (r) { return r.yv; }); var dn = train.filter(function (r) { return r.tier === tr && r.y === 2; }).map(function (r) { return r.yv; }); var mu = median(up), md = median(dn); moves[tr] = { up: mu == null ? 0.06 : clamp(mu, 0, CAP), down: md == null ? -0.06 : clamp(md, -CAP, 0), meanUp: up.length ? mean(up) : null, meanDown: dn.length ? mean(dn) : null, nUp: up.length, nDown: dn.length }; });
    // refit on everything for live predictions
    var full = trainSoftmax(rows.map(function (r) { return r.x; }), rows.map(function (r) { return r.y; }), opts);
    var weights = FEATURE_NAMES.map(function (nm, j) { return { feature: nm, up: full.W[1][j + 1] - full.W[0][j + 1], down: full.W[2][j + 1] - full.W[0][j + 1] }; });
    return { ok: true, horizonDays: horizon, rows: rows.length, nTrain: train.length, nTest: test.length, asOfDates: dates.length, splitDate: new Date(splitT).toISOString().slice(0, 10), firstAsOf: new Date(dates[0]).toISOString().slice(0, 10), lastAsOf: new Date(dates[dates.length - 1]).toISOString().slice(0, 10),
      baseRates: { flat: base[0] / test.length, up: base[1] / test.length, down: base[2] / test.length },
      metrics: { accuracy: correct / test.length, majorityBaseline: majority, momentumBaseline: momOK / test.length, macroF1: (f1(0) + f1(1) + f1(2)) / 3, f1Up: f1(1), f1Down: f1(2), precUp50: precAt(1, 50), precDown50: precAt(2, 50), precUp100: precAt(1, 100), precDown100: precAt(2, 100) },
      confusion: conf, calibration: calib.map(function (c) { return { range: c.lo.toFixed(1) + '–' + c.hi.toFixed(1), n: c.n, meanP: c.n ? c.sumP / c.n : null, observed: c.n ? c.hits / c.n : null }; }),
      moves: moves, weights: weights, model: full, predict: full.predict };
  }

  /* ---------------- market signals from listings & completed trades ---------------- */
  function reputation(profiles, uid) { var p = profiles[uid]; if (!p || p.completed == null) return 0.5; return clamp(0.3 + p.completed / 20, 0.3, 1.0); }
  function buildMarket(ctx) {
    var byName = ctx.byName, sig = new Map();
    function S(name) { if (!sig.has(name)) sig.set(name, { name: name, offers: 0, wants: 0, offersByVariant: {}, wantsByVariant: {}, overpay: [], ask: [], trades: [], perUser: {}, completedOffered: 0, completedWanted: 0 }); return sig.get(name); }
    var unknown = new Map(); function unk(n) { unknown.set(n, (unknown.get(n) || 0) + 1); }
    var pricedListings = 0, pricedCompleted = 0;
    ctx.listings.forEach(function (l) {
      l.offering.forEach(function (e) { if (!e.name) return; if (!byName.has(e.name)) { unk(e.name); return; } var s = S(e.name); s.offers++; var v = e.type || ''; s.offersByVariant[v] = (s.offersByVariant[v] || 0) + 1; });
      l.lookingFor.forEach(function (e) { if (!e.name) return; if (!byName.has(e.name)) { unk(e.name); return; } var s = S(e.name); s.wants++; var v = e.type || ''; s.wantsByVariant[v] = (s.wantsByVariant[v] || 0) + 1; });
      var off = priceSide(l.offering, byName), lf = priceSide(l.lookingFor, byName);
      if (off.ok && lf.ok && off.total > 0 && lf.total > 0) {
        pricedListings++; var r = Math.log(off.total / lf.total); if (Math.abs(r) > 1.5) return; // ignore absurd asks
        lf.parts.forEach(function (p) { if (p.fixed) return; S(p.name).ask.push({ r: r * (p.value / lf.total), w: 0.3 }); });
        off.parts.forEach(function (p) { if (p.fixed) return; S(p.name).ask.push({ r: -r * (p.value / off.total), w: 0.3 }); });
      }
    });
    ctx.completed.forEach(function (c) {
      var off = priceSide(c.offering, byName), lf = priceSide(c.lookingFor, byName);
      c.offering.forEach(function (e) { if (e.name && byName.has(e.name)) S(e.name).completedOffered++; else if (e.name) unk(e.name); });
      c.lookingFor.forEach(function (e) { if (e.name && byName.has(e.name)) S(e.name).completedWanted++; else if (e.name) unk(e.name); });
      if (!(off.ok && lf.ok && off.total > 0 && lf.total > 0)) return;
      pricedCompleted++;
      var r = Math.log(off.total / lf.total); if (Math.abs(r) > 1.5) return;
      var w = reputation(ctx.profiles, c.uid), t = Date.parse(c.t), age = isFinite(t) ? daysBetween(t, ctx.now) : 30; w *= Math.exp(-Math.max(0, age) / 45);
      function add(p, sign, side) { if (p.fixed) return; var s = S(p.name); var cnt = s.perUser[c.uid] = (s.perUser[c.uid] || 0) + 1; if (cnt > 3) return; s.overpay.push({ r: sign * r * (p.value / (sign > 0 ? lf.total : off.total)), w: w }); s.trades.push({ id: c.id, t: c.t, side: side, r: r, w: w, offering: off.parts.map(function (q) { return q.label; }), lookingFor: lf.parts.map(function (q) { return q.label; }), offTotal: off.total, lfTotal: lf.total }); }
      lf.parts.forEach(function (p) { add(p, 1, 'wanted'); });
      off.parts.forEach(function (p) { add(p, -1, 'offered'); });
    });
    // aggregate with shrinkage
    var rows = [];
    sig.forEach(function (s) {
      // shrink toward zero: one or two lopsided trades should not dominate (k = 4 trade-weights of prior)
      var sw = 0, swr = 0; s.overpay.forEach(function (o) { sw += o.w; swr += o.w * o.r; }); s.overpayAdj = sw ? swr / (sw + 4) : 0; s.overpayN = s.overpay.length; s.overpayMean = sw ? swr / sw : null;
      var aw = 0, awr = 0; s.ask.forEach(function (o) { aw += o.w; awr += o.w * o.r; }); s.askAdj = aw ? awr / (aw + 5) : 0; s.askN = s.ask.length;
      s.wantRatio = Math.log((s.wants + 1) / (s.offers + 1));
      s.activity = s.offers + s.wants + s.completedOffered + s.completedWanted;
      if (s.activity > 0) rows.push(s);
    });
    function zs(field) { var vals = rows.map(function (s) { return s[field]; }); var m = mean(vals), sd = std(vals, m); rows.forEach(function (s) { s[field + 'Z'] = (s[field] - m) / sd; }); }
    zs('overpayAdj'); zs('askAdj'); zs('wantRatio');
    rows.forEach(function (s) { s.pressure = 0.45 * s.overpayAdjZ + 0.35 * s.wantRatioZ + 0.20 * s.askAdjZ; var n = s.overpayN + 0.3 * (s.offers + s.wants); s.confidence = n / (n + 6); s.strength = s.pressure * s.confidence; delete s.perUser; });
    var unknownList = Array.from(unknown.entries()).sort(function (a, b) { return b[1] - a[1]; }).map(function (e) { return { name: e[0], count: e[1] }; });
    return { signals: sig, active: rows.length, pricedListings: pricedListings, pricedCompleted: pricedCompleted, unknownNames: unknownList };
  }

  /* ---------------- implied values from completed trades ---------------- */
  function solveImplied(ctx, opts) {
    var byName = ctx.byName, lambda = opts.lambda || 0.5, delta = 0.25, iters = opts.iters || 300, lr = opts.lr || 0.5;
    var eqs = [];
    ctx.completed.forEach(function (c) {
      var off = priceSide(c.offering, byName), lf = priceSide(c.lookingFor, byName);
      if (!(off.ok && lf.ok && off.total > 0 && lf.total > 0)) return;
      if (Math.abs(Math.log(off.total / lf.total)) > 1.5) return;
      var t = Date.parse(c.t), age = isFinite(t) ? daysBetween(t, ctx.now) : 30;
      eqs.push({ w: reputation(ctx.profiles, c.uid) * Math.exp(-Math.max(0, age) / 45), off: off.parts, lf: lf.parts });
    });
    var count = new Map(); eqs.forEach(function (e) { e.off.concat(e.lf).forEach(function (p) { if (!p.fixed) count.set(p.key, (count.get(p.key) || 0) + 1); }); });
    var keys = Array.from(count.keys()).filter(function (k) { return count.get(k) >= 2; }), idx = new Map(); keys.forEach(function (k, i) { idx.set(k, i); });
    var x0 = keys.map(function (k) { var nm = k.split('|'), it = byName.get(nm[0]); return Math.log(it.cat === 'Pets' ? it.values[nm[1]] : it.values.v); }), x = x0.slice();
    if (!keys.length) return { keys: [], eqs: eqs.length, results: [] };
    function sideVal(parts) { var s = 0; parts.forEach(function (p) { var i = idx.get(p.key); s += (i == null) ? p.value : Math.exp(x[i]); }); return s; }
    // diagonal preconditioner: total equation weight touching each unknown, so heavily traded items take steps of the same size as rare ones
    var deg = new Array(keys.length).fill(0);
    eqs.forEach(function (e) { e.off.concat(e.lf).forEach(function (p) { var i = idx.get(p.key); if (i != null) deg[i] += e.w; }); });
    var loss = 0;
    for (var it = 0; it < iters; it++) {
      var g = new Array(keys.length).fill(0); loss = 0;
      eqs.forEach(function (e) {
        var so = sideVal(e.off), sl = sideVal(e.lf), r = Math.log(so / sl);
        var dr = Math.abs(r) <= delta ? r : delta * Math.sign(r); loss += e.w * (Math.abs(r) <= delta ? 0.5 * r * r : delta * (Math.abs(r) - 0.5 * delta));
        e.off.forEach(function (p) { var i = idx.get(p.key); if (i != null) g[i] += e.w * dr * Math.exp(x[i]) / so; });
        e.lf.forEach(function (p) { var i = idx.get(p.key); if (i != null) g[i] -= e.w * dr * Math.exp(x[i]) / sl; });
      });
      for (var i = 0; i < keys.length; i++) { g[i] += 2 * lambda * (x[i] - x0[i]); x[i] -= clamp(lr * g[i] / (deg[i] + 2 * lambda), -0.1, 0.1); x[i] = clamp(x[i], x0[i] - 0.7, x0[i] + 0.7); }
    }
    var results = keys.map(function (k, i) { var nm = k.split('|'); return { key: k, name: nm[0], variant: nm[1], listed: Math.exp(x0[i]), implied: Math.exp(x[i]), gap: Math.exp(x[i] - x0[i]) - 1, n: count.get(k) }; });
    results.sort(function (a, b) { return Math.abs(b.gap) * Math.log(1 + b.n) - Math.abs(a.gap) * Math.log(1 + a.n); });
    return { keys: keys.length, eqs: eqs.length, results: results, finalLoss: loss, byKey: new Map(results.map(function (r) { return [r.key, r]; })) };
  }

  /* ---------------- combine ---------------- */
  function fmtPct(x) { return (x >= 0 ? '+' : '') + (x * 100).toFixed(1) + '%'; }
  function sumCodes(map, codes) { var n = 0; codes.forEach(function (c) { n += map[c] || 0; }); return n; }
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
        var conf = s ? s.confidence : 0, eMarket = 0, reasons = [];
        if (imp && imp.n >= 3) eMarket = clamp(imp.gap, -0.3, 0.3) * (imp.n / (imp.n + 4));
        else if (s) eMarket = clamp(s.pressure, -3, 3) * 0.03;
        var wM = 0.55 * conf, e = (1 - wM) * eHist + wM * eMarket;
        var offeredNow = s ? (isPet ? sumCodes(s.offersByVariant, T.codes) : s.offers) : 0, wantedNow = s ? (isPet ? sumCodes(s.wantsByVariant, T.codes) : s.wants) : 0;
        // reasons (only real, observed facts)
        var tl = T.label ? T.label + ' ' : '';
        if (f.n30 > 0) reasons.push(tl + (f.n30 === 1 ? 'value updated once' : 'value updated ' + f.n30 + ' times') + ' in the last 30 days (' + fmtPct(Math.exp(f.chg30) - 1) + ')');
        else reasons.push('No ' + (T.label ? T.label.toLowerCase() + ' ' : '') + 'value change for ' + Math.round(f.daysSince) + (f.daysSince >= 180 ? '+' : '') + ' days');
        if (Math.abs(f.streak) >= 2) reasons.push(Math.abs(f.streak) + ' consecutive ' + (f.streak > 0 ? 'raises' : 'drops'));
        if (f.chg90 && Math.abs(Math.exp(f.chg90) - 1) >= 0.05) reasons.push('90-day change ' + fmtPct(Math.exp(f.chg90) - 1));
        if (s) {
          if (s.overpayN >= 3) reasons.push((s.overpayMean > 0 ? 'Overpaid' : 'Underpaid') + ' in completed trades (all tiers): avg ' + fmtPct(s.overpayMean) + ' across ' + s.overpayN + ' trade sides');
          if (offeredNow + wantedNow >= 5) reasons.push((T.label || 'Item') + ' wanted ' + wantedNow + '× vs offered ' + offeredNow + '× in listings (last ' + (ctx.listingWindowHours || 48) + 'h)');
          if (s.askN >= 5 && Math.abs(s.askAdj) >= 0.02) reasons.push('Traders ' + (s.askAdj > 0 ? 'offer above' : 'ask below') + ' its value when listing (' + fmtPct(s.askAdj) + ')');
        }
        if (imp && imp.n >= 3) reasons.push('Market-implied ' + (T.label ? T.label.toLowerCase() + ' ' : '') + 'value ' + roundValue(imp.implied) + ' vs listed ' + roundValue(imp.listed) + ' (' + fmtPct(imp.gap) + ', ' + imp.n + ' trades)');
        // a call needs both a material expected move and a majority probability, or strong trade evidence
        var strongImp = imp && imp.n >= 5 && Math.abs(imp.gap) >= 0.05;
        var dir = 'flat';
        if (e > 0.02 && (p[1] >= 0.5 || (strongImp && imp.gap > 0) || (p[1] >= 0.35 && conf >= 0.4))) dir = 'up';
        else if (e < -0.02 && (p[2] >= 0.5 || (strongImp && imp.gap < 0) || (p[2] >= 0.35 && conf >= 0.4))) dir = 'down';
        var pDir = dir === 'up' ? p[1] : dir === 'down' ? p[2] : p[0];
        // trading opportunity scores: a rise only pays if the pet is in demand and actually changes hands
        var demand = it.demand[isPet ? T.field : 'v'];
        var liquidity = offeredNow + wantedNow + (s ? s.completedOffered + s.completedWanted : 0);
        var demandF = ({ High: 1, Medium: 0.8, Low: 0.55 })[demand] || 0.7;
        var flipScore = Math.max(0, e) * (0.4 + 0.6 * p[1]) * demandF * (1 + Math.min(liquidity, 40) / 40) * (0.7 + 0.3 * conf);
        var dumpScore = Math.max(0, -e) * (0.4 + 0.6 * p[2]) * (1 + Math.min(liquidity, 40) / 40) * (0.7 + 0.3 * conf);
        // every potion state inside this tier moves with it
        var subs = T.subs.filter(function (k) { return it.values[k] != null && it.values[k] > 0; }).map(function (k) { return { code: k, label: VARIANT_LABEL[k] || 'Value', value: it.values[k], predicted: roundValue(it.values[k] * Math.exp(e)) }; });
        preds.push({ name: it.name, cat: it.cat, origin: it.origin, variant: T.label || 'Item', variantField: T.field, variantVar: T.v, key: it.name + '|' + T.field, value: v, tier: tier, demand: demand, lastUpdatedAt: it.lastUpdatedAt,
          pFlat: p[0], pUp: p[1], pDown: p[2], eHist: eHist, eMarket: eMarket, marketWeight: wM, expectedMove: e, predicted: roundValue(v * Math.exp(e)), direction: dir,
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
    var series = buildHistory(data.updates);
    var now = Date.parse(data.meta.collectedAt) || Date.now();
    var firstT = data.updates.length ? Date.parse(data.updates[0].t) : now, lastT = data.updates.length ? Date.parse(data.updates[data.updates.length - 1].t) : now;
    var ctx = { items: data.items, byName: idx.byName, series: series, valueAt: makeValueAt(series, idx.byName), now: now, histStart: Math.max(firstT, BASELESS_START), listings: data.listings, completed: data.completed, profiles: data.profiles || {}, listingWindowHours: data.meta.listingWindowHours || 48 };
    var hist = buildHistoryModel(ctx, { iters: options.iters || 400, lr: 0.5, lambda: 1e-3 });
    var market = buildMarket(ctx);
    var implied = solveImplied(ctx, {});
    var preds = buildPredictions(ctx, hist, market, implied);
    var nUpd = 0; series.forEach(function (a) { nUpd += a.length; });
    var summary = { items: data.items.length, predictionRows: preds.length, updateRows: nUpd, updatesFrom: new Date(firstT).toISOString().slice(0, 10), updatesTo: new Date(lastT).toISOString().slice(0, 10), historyDays: Math.round(daysBetween(ctx.histStart, now)), listings: data.listings.length, completed: data.completed.length, profiles: Object.keys(ctx.profiles).length,
      pricedListings: market.pricedListings, pricedCompleted: market.pricedCompleted, impliedKeys: implied.keys, itemsWithMarket: market.active, collectedAt: data.meta.collectedAt, buildMs: Date.now() - t0, nameCollisions: idx.collisions, unknownNames: market.unknownNames.slice(0, 40),
      raise: preds.filter(function (p) { return p.direction === 'up'; }).length, lower: preds.filter(function (p) { return p.direction === 'down'; }).length };
    function explorer(name) {
      var it = idx.byName.get(name); if (!it) return null;
      var isPet = it.cat === 'Pets';
      var tiers = (isPet ? PET_TIERS : ITEM_TIERS).map(function (T) {
        var hk = name + '|' + T.v, arr = series.get(hk) || [], pts = [], cur = it.values[T.field];
        if (cur == null) return null;
        if (arr.length) { pts.push({ t: ctx.histStart, v: arr[0].t > ctx.histStart ? arr[0].prev : arr[0].new }); arr.forEach(function (u) { if (u.t >= ctx.histStart) pts.push({ t: u.t, v: u.new }); }); }
        else pts.push({ t: ctx.histStart, v: cur });
        pts.push({ t: now, v: cur });
        return { label: T.label || 'Value', field: T.field, v: T.v, series: pts, updates: arr.slice().reverse(), prediction: preds.find(function (p) { return p.name === name && p.variantField === T.field; }) || null, implied: implied.results.filter(function (r) { return r.name === name && r.variant === T.field; }) };
      }).filter(Boolean);
      return { item: it, tiers: tiers, series: tiers[0].series, updates: tiers[0].updates, prediction: tiers[0].prediction, market: market.signals.get(name) || null, implied: implied.results.filter(function (r) { return r.name === name; }) };
    }
    return { summary: summary, history: hist, market: market, implied: implied, predictions: preds, explorer: explorer, ctx: ctx, featureNames: FEATURE_NAMES, tierOf: tierOf, roundValue: roundValue, variantLabel: VARIANT_LABEL, petTiers: PET_TIERS };
  }

  var api = { build: build, tierOf: tierOf, roundValue: roundValue, priceEntry: priceEntry, VARIANT_FIELD: VARIANT_FIELD, VARIANT_LABEL: VARIANT_LABEL, FEATURE_NAMES: FEATURE_NAMES, TIER_ORDER: TIER_ORDER };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AMVGGEngine = api;
})(typeof window !== 'undefined' ? window : this);
