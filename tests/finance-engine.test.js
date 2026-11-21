import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyIncome, forecastSpending, detectAnomalies, paydaySpike, lifestyleCreep, financialHealth, safeToSpend, cutbackPlan, analyzeFinance, DEFAULT_PROFILE, simulateDebtPayoff, localDate } from '../js/finance-engine.js';
import { createSeedData } from '../js/seed-data.js';
import { validateBackup, createBackup, createCSV, validateRecord, initDB, readData, replaceData, putRecord, deleteRecord } from '../js/db.js';
import { escapeHtml, filteredTransactions, renderOverview, renderAnalysis, renderPlanning, renderSettings, renderTransactions } from '../js/ui.js';

const date = new Date(2026, 10, 21), today = localDate(date);
const tx = (overrides = {}) => ({ id: crypto.randomUUID(), date: today, type: 'expense', group: 'wants', category: 'Ăn ngoài & Cafe', amount: 50000, isFixedBill: false, note: '', createdAt: 100, ...overrides });
const empty = () => ({ transactions: [], recurring_bills: [], debts: [], profile: { ...DEFAULT_PROFILE } });
const approximate = (actual, expected, tolerance = 1e-7) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);

test('income: no observations and cold start', () => {
  assert.equal(classifyIncome([]).mode, 'NO_INCOME');
  assert.equal(classifyIncome([10, 20]).yBase, 10);
  assert.equal(classifyIncome([10, 20]).mode, 'COLD_START');
});
test('income: sample CV thresholds, conservative mean and P25', () => {
  assert.equal(classifyIncome([1000000, 1000000, 1000000]).yBase, 1000000);
  const moderate = classifyIncome([800000, 1000000, 1200000]);
  approximate(moderate.cv, .2); assert.equal(moderate.mode, 'MODERATE'); assert.equal(moderate.yBase, 900000);
  const irregular = classifyIncome([0, 1000000, 2000000]); assert.equal(irregular.mode, 'IRREGULAR'); assert.equal(irregular.yBase, 500000);
});
test('income: irregular and stable overrides; surplus is not negative', () => {
  const a = classifyIncome([100, 200], 300, 'IRREGULAR'); assert.equal(a.yBase, 100); assert.equal(a.mode, 'IRREGULAR'); assert.equal(a.surplusForBuffer, 200);
  assert.equal(classifyIncome([0, 100, 200], 50, 'STABLE').yBase, 100);
  assert.equal(classifyIncome([100, 100, 100], 20).surplusForBuffer, 0);
});
test('forecast: tier zero reserves paid and unpaid bills, exact intramonth blend', () => {
  const a = forecastSpending({ currVarSpent: 100, paidFixedBills: 50, unpaidFixedBills: 150, elapsedDays: 10, daysInMonth: 30 });
  assert.equal(a.tierIndex, 0); assert.equal(a.intramonthProj, 500); assert.equal(a.blendedEomForecast, 500);
});
test('forecast: SES exact smoothing and weighted blend', () => {
  const a = forecastSpending({ hist: [100, 200], elapsedDays: 15, daysInMonth: 30, currVarSpent: 100 });
  assert.equal(a.histForecast, 140); assert.equal(a.blendedEomForecast, 170); assert.equal(a.tierIndex, 1);
});
test('forecast: damped Holt recurrence has the expected independent result', () => {
  const a = forecastSpending({ hist: [100, 200, 300], elapsedDays: 1 });
  // level1=191, trend1=86.2; level2=278.562, trend2=76.1284.
  approximate(a.histForecast, 343.27114); assert.equal(a.tierIndex, 2);
});
test('forecast: additive seasonality repeats the twelve-month seasonal pattern', () => {
  const xs = Array.from({ length: 24 }, (_, i) => 100000 + (i % 12) * 10000);
  const a = forecastSpending({ hist: xs }); assert.equal(a.tierIndex, 3); approximate(a.histForecast, 100000);
  assert.equal(forecastSpending({ hist: Array(24).fill(100000), elapsedDays: 30, daysInMonth: 30, currVarSpent: 90000 }).blendedEomForecast, 90000);
});
test('anomalies: zero MAD and zero IQR still detect large purchases', () => {
  const a = detectAnomalies([50000, 50000, 50000, 50000, 500000].map((amount) => tx({ amount })), 1000000, date);
  assert.equal(a.length, 1); assert.equal(a[0].severity, 'CRITICAL'); assert.equal(a[0].multiple, 10);
});
test('anomalies: MAD zero/IQR nonzero and MAD positive', () => {
  assert.ok(detectAnomalies([50000, 50000, 50000, 80000, 500000].map((amount) => tx({ amount })), 1000000, date).some((a) => a.amount === 500000));
  assert.ok(detectAnomalies([40000, 50000, 60000, 70000, 900000].map((amount) => tx({ amount })), 1000000, date).some((a) => a.severity === 'CRITICAL'));
});
test('anomalies: materiality gate, sample size and 90-day window', () => {
  assert.equal(detectAnomalies([10000, 10000, 10000, 10000, 80000].map((amount) => tx({ amount })), 0, date).length, 0);
  assert.equal(detectAnomalies([50000, 50000, 50000, 900000].map((amount) => tx({ amount })), 0, date).length, 0);
  assert.equal(detectAnomalies([50000, 50000, 50000, 50000, 900000].map((amount) => tx({ amount, date: '2026-01-01' })), 0, date).length, 0);
});
test('PSI: denominator counts zero-spend calendar days, excluding fixed bills', () => {
  const rows = [tx({ date: '2026-11-01', amount: 50000 }), ...[5, 6, 7, 8, 9].map((d) => tx({ date: `2026-11-0${d}`, amount: 200000 })), tx({ date: '2026-11-01', amount: 4000000, isFixedBill: true })];
  const a = paydaySpike(rows, 5, new Date(2026, 10, 10));
  assert.equal(a.windowDays, 5); assert.equal(a.otherDays, 5); assert.equal(a.psi, 20); assert.equal(a.warning, true);
});
test('PSI: zero baseline is explicit and safe to render', () => {
  assert.equal(paydaySpike([], 5, date).psi, null);
  assert.equal(paydaySpike([tx({ date: '2026-11-05' })], 5, date).psi, Infinity);
});
test('lifestyle: adjacent windows, threshold drift, missing income', () => {
  const rows = [.1, .1, .1, .2, .2, .2].map((x) => ({ income: 10000000, wants: x * 10000000 }));
  const a = lifestyleCreep(rows); assert.equal(a.warning, true); approximate(a.driftPP, 10);
  assert.equal(lifestyleCreep(rows.slice(0, 3)).available, false);
  assert.equal(lifestyleCreep([...rows.slice(0, 3), { income: 0, wants: 2 }]).available, false);
});
test('FHI: exact weighted score and high-interest penalty', () => {
  const a = financialHealth({ yBase: 10000000, actualIncome: 10000000, totalNeedsWantsSpent: 8000000, avgMonthlyNeeds: 5000000, totalActiveFixedBills: 5000000, currWantsSpent: 3000000, profile: { ...DEFAULT_PROFILE, liquidSavings: 22500000 } });
  assert.equal(a.fhi, 95); assert.equal(a.label, 'Vững tài chính'); assert.equal(a.level, 5);
  const b = financialHealth({ yBase: 10000000, actualIncome: 10000000, avgMonthlyNeeds: 5000000, profile: { ...DEFAULT_PROFILE, liquidSavings: 5000000 }, debts: [{ principal: 5000000, apr: 24, minMonthlyPayment: 1000000 }] });
  assert.equal(b.level, 3); assert.equal(b.scores.sDebt, 60);
});
test('FHI: five level priorities and 6-month irregular runway', () => {
  const base = { yBase: 100, actualIncome: 100, totalNeedsWantsSpent: 50, avgMonthlyNeeds: 10, profile: { ...DEFAULT_PROFILE, liquidSavings: 20 } };
  assert.equal(financialHealth({ ...base, totalNeedsWantsSpent: 200 }).level, 1);
  assert.equal(financialHealth({ ...base, profile: { ...DEFAULT_PROFILE, liquidSavings: 0 } }).level, 2);
  assert.equal(financialHealth({ ...base, debts: [{ principal: 100, apr: 24, minMonthlyPayment: 10 }] }).level, 3);
  assert.equal(financialHealth(base).level, 4);
  assert.equal(financialHealth({ ...base, profile: { ...DEFAULT_PROFILE, liquidSavings: 100 } }).level, 5);
  assert.equal(financialHealth({ ...base, incomeMode: 'IRREGULAR' }).targetRunway, 6);
});
test('FHI: high fixed costs keep allocation sum 100%, wants >= 10%, saving >= 5%', () => {
  const a = financialHealth({ yBase: 100, totalActiveFixedBills: 90 });
  assert.equal(a.alloc.needs, .75); approximate(a.alloc.needs + a.alloc.wants + a.alloc.save, 1); assert.ok(a.alloc.wants >= .10); assert.ok(a.alloc.save >= .05);
});
test('safe spending: month end, exhausted budget, burn thresholds', () => {
  const a = safeToSpend({ yBase: 10000000, alloc: { save: .3 }, totalActiveFixedBills: 4000000, currentMonthVariableSpent: 2000000, elapsedDays: 30, daysInMonth: 30 });
  assert.equal(a.daysLeft, 1); assert.equal(a.dailySafeToSpend, 1000000); assert.equal(a.savingsTargetDaily, 100000);
  assert.equal(safeToSpend({ currentMonthVariableSpent: 1000 }).dailySafeToSpend, 0);
  assert.equal(safeToSpend({ currentMonthVariableSpent: 1000 }).status, 'danger');
  const burn = (r) => safeToSpend({ yBase: 10000, alloc: { save: 0 }, currentMonthVariableSpent: 5000 * r, elapsedDays: 15 }).status;
  assert.equal(burn(1), 'safe'); assert.equal(burn(1.01), 'notice'); assert.equal(burn(1.16), 'warning'); assert.equal(burn(1.31), 'danger');
});
test('cutbacks: bounded to 35%, multiple of 50k, no overshoot or sub-50k cut', () => {
  const a = cutbackPlan({ yBase: 10000000, blendedEomForecast: 9000000, savingsTargetMonthly: 3000000, categoryAverages: [{ category: 'A', amount: 1100000 }, { category: 'B', amount: 750000 }, { category: 'C', amount: 10000 }] });
  assert.equal(a.savingsGap, 2000000);
  for (const c of a.actions) { assert.equal(c.suggestedCut % 50000, 0); assert.ok(c.suggestedCut <= Math.round(c.currentAvg * .35)); assert.ok(c.suggestedCut >= 50000); }
  assert.equal(a.actions.reduce((x, c) => x + c.suggestedCut, 0) + a.unmetGap, a.savingsGap);
  assert.equal(cutbackPlan({ yBase: 1, blendedEomForecast: 2, savingsTargetMonthly: 1, categoryAverages: [{ category: 'A', amount: 1000000 }] }).actions.length, 0);
});
test('debt payoff: avalanche ordering and early payments reduce interest', () => {
  const a = simulateDebtPayoff([{ principal: 10000000, apr: 12, minMonthlyPayment: 500000 }, { principal: 10000000, apr: 24, minMonthlyPayment: 500000 }], 1000000);
  assert.equal(a.orderedDebts[0].apr, 24); assert.ok(a.accelerated.months < a.baseline.months); assert.ok(a.interestSaved > 0);
  assert.equal(simulateDebtPayoff([{ principal: 10000000, apr: 24, minMonthlyPayment: 10000 }]).baseline.paidOff, false);
});
test('orchestration: partial fixed payment is reserved once, same-category bills match once', () => {
  const data = empty();
  data.recurring_bills = [1, 2].map((i) => ({ id: `bill${i}`, name: `Bill ${i}`, amount: 1000000, dueDay: 1, group: 'needs', category: 'Tiền nhà / Trả góp nhà', active: true }));
  data.transactions = [tx({ amount: 500000, group: 'needs', category: 'Tiền nhà / Trả góp nhà', isFixedBill: true })];
  const a = analyzeFinance(data, date); assert.equal(a.unpaidFixedBills, 1500000); assert.equal(a.totalActiveFixedBills, 2000000); assert.equal(a.forecast.intramonthProj, 2000000); assert.equal(a.bills.filter((b) => b.paid).length, 0);
});
test('orchestration: missing calendar months count as zero, future records excluded', () => {
  const data = empty(); data.transactions = [tx({ date: '2026-08-01', type: 'income', group: 'income', amount: 10000000 }), tx({ date: '2026-10-01', type: 'income', group: 'income', amount: 10000000 }), tx({ date: '2026-12-01', amount: 100000000 })];
  const a = analyzeFinance(data, date); assert.equal(a.history.length, 3); assert.equal(a.history[1].income, 0); assert.equal(a.current.spent, 0); assert.equal(a.anomalies.length, 0);
});
test('empty application: all finance values finite and no NaN in rendered views', () => {
  const data = empty(), a = analyzeFinance(data, date);
  const walk = (x) => { for (const v of Object.values(x)) { if (typeof v === 'number') assert.ok(Number.isFinite(v)); else if (v && typeof v === 'object') walk(v); } }; walk(a);
  const views = [renderOverview(data, a, false), renderAnalysis(data, a), renderPlanning(data, a, 100000), renderSettings(data, a, { mode: 'memory' }), renderTransactions(data, a, { month: '', group: '', category: '', search: '' }, 1)];
  for (const html of views) assert.doesNotMatch(html, /NaN|undefined|Infinity/);
});
test('sample data: all required diagnostic signals and level 3 for each part of a month', () => {
  for (const day of [1, 5, 15, 21, 30]) {
    const d = new Date(2026, 10, day), data = createSeedData(d), a = analyzeFinance(data, d);
    assert.equal(a.history.length, 6); assert.equal(a.health.level, 3); assert.ok(a.anomalies.length >= 2); assert.ok(a.payday.warning); assert.ok(a.lifestyle.warning); assert.ok(a.cutbacks.actions.length > 0);
    assert.ok(data.transactions.every((t) => Number.isSafeInteger(t.amount)));
  }
});
test('backup: round-trip all stores, reject corrupted schema before any writes', () => {
  const data = createSeedData(date), clean = validateBackup(JSON.parse(createBackup(data, 100000)));
  assert.deepEqual(clean, data);
  assert.throws(() => validateBackup({ version: 1, data }), /định dạng/);
  assert.throws(() => validateRecord('transactions', tx({ amount: 1.5 })), /số nguyên/);
  assert.throws(() => validateRecord('transactions', tx({ date: '2026-02-30' })), /Ngày/);
  assert.throws(() => validateRecord('transactions', tx({ type: 'income' })), /khớp/);
  assert.throws(() => validateBackup({ app: 'vung-tai-chinh', version: 1, data: { ...empty(), transactions: [tx({ id: 'duplicate' }), tx({ id: 'duplicate' })] } }), /trùng/);
});
test('CSV: UTF-8 BOM, Vietnamese, multiline escaping and formula neutralization', () => {
  const csv = createCSV([tx({ note: '=1+1\n"Chào bạn"' })]);
  assert.equal(csv.charCodeAt(0), 0xfeff); assert.ok(csv.includes('Ăn ngoài & Cafe')); assert.ok(csv.includes("'=1+1")); assert.ok(csv.includes('""Chào bạn""'));
});
test('XSS: every user note is escaped in financial pages', () => {
  const payload = '<img src=x onerror=alert(1)>', data = empty(); data.transactions = [tx({ note: payload, category: payload })];
  const a = analyzeFinance(data, date), html = renderOverview(data, a, true) + renderTransactions(data, a, { month: '', group: '', category: '', search: '' }, 1);
  assert.ok(html.includes(escapeHtml(payload))); assert.ok(!html.includes(payload));
});
test('ledger: all four filters combine and keep income/expense distinct', () => {
  const data = empty(); data.transactions = [tx({ note: 'Cà phê sáng' }), tx({ note: 'Buổi tối', date: '2026-10-01' }), tx({ group: 'needs' })];
  assert.equal(filteredTransactions(data, { month: '2026-11', group: 'wants', category: 'Ăn ngoài & Cafe', search: 'CÀ PHÊ' }).length, 1);
});
test('storage: private-mode memory fallback supports all stores and backup restore', async () => {
  const status = await initDB(); assert.equal(status.mode, 'memory');
  const sample = createSeedData(date); await replaceData(sample); assert.deepEqual(await readData(), sample);
});
test('storage: invalid restore leaves existing data untouched', async () => {
  const before = await readData();
  await assert.rejects(replaceData({ ...before, transactions: [tx({ amount: -1 })] }));
  assert.deepEqual(await readData(), before);
});
test('storage: CRUD and persistent profile settings share the same validated contract', async () => {
  const record = tx(); await putRecord('transactions', record);
  assert.ok((await readData()).transactions.some((t) => t.id === record.id));
  await putRecord('transactions', { ...record, amount: 99000 });
  assert.equal((await readData()).transactions.find((t) => t.id === record.id).amount, 99000);
  await deleteRecord('transactions', record.id); assert.ok(!(await readData()).transactions.some((t) => t.id === record.id));
  await putRecord('profile', { ...DEFAULT_PROFILE, theme: 'dark', liquidSavings: 100000 });
  assert.equal((await readData()).profile.theme, 'dark');
});
