import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeFinance, DEFAULT_PROFILE, sum } from '../js/finance-engine.js';
import { ANALYSIS_VIEWS, analysisViewForSection, contributionAmount, financePlanSummary, monthlyMoney, wellbeingPlan } from '../js/money-flow.js';
import { createSeedData } from '../js/seed-data.js';
import { filteredTransactions, formatVND, renderAnalysis, renderOverview, renderPlanning } from '../js/ui.js';

const date = new Date(2026, 10, 25, 12);
let id = 0;
const tx = (fields = {}) => ({ id: `analysis-${++id}`, date: '2026-11-12', type: 'expense', group: 'needs', amount: 100000, category: 'Sinh hoạt tổng hợp', note: 'Dữ liệu tổng hợp', isFixedBill: false, createdAt: id, ...fields });
const fixture = (transactions = [], extra = {}) => ({
  transactions, recurring_bills: [], debts: [],
  profile: { ...DEFAULT_PROFILE, openingBalances: { '2026-11': { bank: 3000000, cash: 200000 } } },
  ...extra,
});

test('every original analytic module has a visible entry and its actual computed result', () => {
  const d = createSeedData(date), a = analyzeFinance(d, date), vnd = formatVND;
  const pages = Object.fromEntries(ANALYSIS_VIEWS.map((v) => [v.key, renderAnalysis(d, a, v.key)]));
  for (const [key, html] of Object.entries(pages)) {
    for (const v of ANALYSIS_VIEWS) assert.ok(html.includes(`href="#analysis/${v.key}"`), `${key} lacks entry ${v.key}`);
    assert.doesNotMatch(html, /NaN|undefined|Infinity/);
  }
  const overview = renderOverview(d, a, true);
  for (const amount of [a.safe.dailySafeToSpend, a.safe.savingsTargetMonthly, a.forecast.blendedEomForecast]) assert.ok(overview.includes(vnd(amount)));
  assert.ok(overview.includes('Sức khỏe tài chính'));
  assert.ok(pages.health.includes('Điểm sức khỏe đến từ đâu?'));
  assert.equal((pages.health.match(/class="health-factor-heading"/g) || []).length, 5);
  for (const amount of [a.income.yBase, a.safe.dailySafeToSpend, a.safe.variableBudgetTotal, a.safe.savingsTargetDaily, a.safe.savingsTargetMonthly, a.cutbacks.savingsGap]) assert.ok(pages.plan.includes(vnd(amount)), `Missing plan result ${vnd(amount)}`);
  for (const action of a.cutbacks.actions) for (const value of [action.currentAvg, action.suggestedCut, action.newCap, action.dailySaveGain]) assert.ok(pages.plan.includes(vnd(value)));
  assert.ok(pages.plan.includes('id="daily-chart"'));
  assert.ok(pages.plan.includes('id="debt-advice-section"'));
  for (const amount of [a.forecast.blendedEomForecast, a.forecast.intramonthProj, a.forecast.histForecast]) assert.ok(pages.cashflow.includes(vnd(amount)));
  assert.ok(pages.cashflow.includes('id="cashflow-chart"'));
  assert.ok(pages.cashflow.includes('id="category-chart"'));
  assert.ok(pages.cashflow.includes('id="deposit-section"'));
  assert.ok(pages.habits.includes(vnd(a.payday.paydayAvg)));
  assert.ok(pages.habits.includes(vnd(a.payday.otherAvg)));
  assert.ok(pages.habits.includes('id="lifestyle-section"'));
  assert.ok(pages.habits.includes(vnd(a.anomalies[0].median)));
  assert.ok(pages.habits.includes('data-scope="anomaly"'));
  assert.ok(renderPlanning(d, a, 100000).includes('id="debt-simulation-section"'));
});

test('plan contributions use net recorded movements, and allocation does not create extra money', () => {
  const d = fixture([
    tx({ type: 'income', group: 'income', amount: 1500001 }),
    tx({ amount: 300000 }),
    tx({ group: 'wants', amount: 100000 }),
    tx({ group: 'savings_debt', amount: 200000, flow: { kind: 'reserve-in' } }),
    tx({ type: 'income', group: 'income', amount: 50000, flow: { kind: 'reserve-out' } }),
    tx({ group: 'savings_debt', amount: 140000, flow: { kind: 'debt', targetId: 'loan', principal: 100000 } }),
    tx({ group: 'savings_debt', amount: 25000 }),
    tx({ amount: 600000, flow: { kind: 'deposit' } }),
    tx({ type: 'income', group: 'income', amount: 300000, flow: { kind: 'refund' } }),
    tx({ date: '2026-11-30', group: 'savings_debt', amount: 100000, flow: { kind: 'reserve-in' } }),
  ]);
  d.profile.liquidSavings = 5000000;
  const a = analyzeFinance(d, date), p = financePlanSummary(d, a);
  assert.equal(p.contributions, 315000);
  assert.equal(p.target, a.safe.savingsTargetMonthly);
  assert.equal(sum(p.allocation.map((r) => r.plan)), a.income.yBase);
  assert.equal(p.allocation.find((r) => r.group === 'savings_debt').actual, p.contributions);
  const rows = filteredTransactions(d, { month: a.month, through: a.today, scope: 'contribution' });
  assert.equal(rows.length, 4);
  assert.equal(sum(rows.map(contributionAmount)), p.contributions);
  assert.equal(sum(filteredTransactions(d, { month: a.month, through: a.today, scope: 'earned' }).map((t) => t.amount)), a.current.income);
  assert.equal(sum(filteredTransactions(d, { month: a.month, through: a.today, scope: 'operating' }).filter((t) => t.type === 'expense').map((t) => t.amount)), a.current.spent);
});

test('habit links return the same records and dates used by the original diagnostic model', () => {
  const d = createSeedData(date), a = analyzeFinance(d, date);
  const selected = filteredTransactions(d, { month: a.month, allMonths: true, through: a.today, scope: 'anomaly' });
  assert.deepEqual(new Set(selected.map((t) => t.id)), new Set(a.anomalies.map((t) => t.id)));
  const paydays = filteredTransactions(d, { month: a.month, allMonths: true, from: a.payday.start, through: a.today, scope: 'payday' });
  assert.ok(Math.abs(sum(paydays.map((t) => t.amount)) - a.payday.paydayAvg * a.payday.windowDays) < 0.01);
  const variables = filteredTransactions(d, { month: a.month, through: a.today, scope: 'variable' });
  assert.equal(sum(variables.map((t) => t.amount)), a.current.variable);
  assert.ok(!variables.some((t) => t.isFixedBill || t.type === 'income'));
});

test('clicking a historical cutback category preserves the actual reference period', () => {
  const d = createSeedData(date), a = analyzeFinance(d, date), action = a.cutbacks.actions[0];
  const from = `${a.history.slice(-6)[0].month}-01`, through = '2026-10-31';
  const matches = filteredTransactions(d, { month: a.month, allMonths: true, from, through, category: action.category, group: 'wants', scope: 'everyday' });
  assert.equal(Math.round(sum(matches.map((t) => t.amount)) / a.history.slice(-6).length), action.currentAvg);
  assert.ok(matches.every((t) => t.date >= from && t.date <= through));
});

test('a first-month user retains analysis and provisional suggestions with incomplete history', () => {
  const d = fixture([
    tx({ type: 'income', group: 'income', amount: 1000000 }),
    tx({ amount: 500000 }),
    tx({ group: 'wants', amount: 1200000, category: 'Giải trí' }),
  ]);
  const a = analyzeFinance(d, date), p = financePlanSummary(d, a), html = renderAnalysis(d, a, 'plan');
  assert.ok(p.provisional);
  assert.equal(a.safe.dailySafeToSpend, 0);
  assert.ok(monthlyMoney(d, a).daily > 0);
  assert.ok(a.cutbacks.actions.length > 0);
  assert.ok(html.includes(formatVND(a.cutbacks.actions[0].suggestedCut)));
  assert.ok(html.includes('Tạm tính theo khoản chi đã ghi tháng này.'));
  assert.ok(wellbeingPlan(d, a).score !== null);
});

test('missing data does not become a false healthy score, zero income plan, or favorable habit conclusion', () => {
  const d = fixture(), a = analyzeFinance(d, date), p = financePlanSummary(d, a);
  assert.equal(p.canPlan, false);
  assert.equal(p.canForecast, false);
  assert.equal(wellbeingPlan(d, a).score, null);
  for (const v of ANALYSIS_VIEWS) assert.doesNotMatch(renderAnalysis(d, a, v.key), /NaN|undefined|Infinity/);
  assert.ok(renderAnalysis(d, a, 'plan').includes('Cần ghi thu nhập'));
  assert.ok(renderAnalysis(d, a, 'habits').includes('Chưa đủ dữ liệu'));
  const withoutHistoricalNeeds = fixture([tx({ type: 'income', group: 'income', date: '2026-10-01' }), tx()]);
  const poorBaseline = analyzeFinance(withoutHistoricalNeeds, date);
  assert.equal(wellbeingPlan(withoutHistoricalNeeds, poorBaseline).hasEssentials, false);
});

test('every analytical section is reachable from its cross-links and invalid views fall back safely', () => {
  const d = createSeedData(date), a = analyzeFinance(d, date);
  for (const [section, view] of [
    ['health-analysis', 'health'], ['monthly-plan-section', 'plan'], ['budget-section', 'plan'],
    ['savings-section', 'plan'], ['allocation-section', 'plan'], ['cutbacks-section', 'plan'],
    ['debt-advice-section', 'plan'], ['forecast-section', 'cashflow'], ['spending-section', 'cashflow'],
    ['income-history-section', 'cashflow'], ['deposit-section', 'cashflow'], ['payday-section', 'habits'],
    ['lifestyle-section', 'habits'], ['anomaly-section', 'habits'],
  ]) {
    assert.equal(analysisViewForSection(section), view);
    assert.ok(renderAnalysis(d, a, view).includes(`id="${section}"`));
  }
  assert.equal(analysisViewForSection('missing', 'cashflow'), 'cashflow');
  assert.equal(analysisViewForSection('missing', '__proto__'), 'health');
});
