import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PROFILE, analyzeFinance } from '../js/finance-engine.js';
import { wellbeingPlan, monthlyMoney } from '../js/money-flow.js';
import { renderOverview, renderAnalysis } from '../js/ui.js';

const date = new Date(2026, 10, 25);
let serial = 0;
const tx = (type, amount, month = '2026-11') => ({ id: `wellbeing-${++serial}`, type, amount, group: type === 'income' ? 'income' : 'needs', date: `${month}-05`, category: type === 'income' ? 'Khoản thu' : 'Sinh hoạt', note: 'Dữ liệu tổng hợp', isFixedBill: false, createdAt: serial });
function fixture({ income = 1000000, expense = 300000, reserve = 0, debts = [], historical = [] } = {}) {
  return { transactions: [tx('income', income), tx('expense', expense), ...historical], recurring_bills: [], debts, profile: { ...DEFAULT_PROFILE, liquidSavings: reserve, openingBalances: { '2026-11': { bank: 2000000, cash: 0 } } } };
}
const loan = { id: 'wellbeing-loan', name: 'Khoản vay tổng hợp', principal: 800000, minMonthlyPayment: 100000, apr: 12, isHighInterest: true };

test('empty or income-only records cannot look like a fully healthy independent household', () => {
  for (const transactions of [[], [tx('income', 1000000)]]) {
    const d = { ...fixture(), transactions }, a = analyzeFinance(d, date), p = wellbeingPlan(d, a);
    assert.equal(p.ready, false); assert.equal(p.score, null); assert.equal(p.next.action, 'add-transaction');
    const html = renderOverview(d, a, true); assert.ok(html.includes('Sức khỏe tài chính')); assert.ok(html.includes('Chưa đủ dữ liệu để chấm điểm'));
    assert.ok(!p.milestones.find((m) => m.key === 'reserve').done);
  }
});
test('cash kept from the beginning does not erase a current income/spending gap', () => {
  const d = fixture({ income: 200000, expense: 500000, reserve: 1000000 }), a = analyzeFinance(d, date), p = wellbeingPlan(d, a);
  assert.equal(monthlyMoney(d, a).available, 1700000);
  assert.equal(p.next.gap, 300000); assert.equal(p.next.action, 'open-analysis'); assert.equal(p.next.section, 'spending-section');
  assert.equal(p.provisional, true); assert.equal(p.score, a.health.fhi);
});
test('health stages retain the engine priorities and give the correct actionable gap', () => {
  const cases = [
    [fixture({ reserve: 50000 }), 2, 'reserve-in', 250000],
    [fixture({ reserve: 500000, debts: [loan] }), 3, 'pay-debt', 800000],
    [fixture({ reserve: 500000 }), 4, 'reserve-in', 850000],
    [fixture({ reserve: 1500000 }), 5, 'reserve-in', undefined],
  ];
  for (const [d, level, action, gap] of cases) {
    const a = analyzeFinance(d, date), p = wellbeingPlan(d, a);
    assert.equal(a.health.level, level); assert.equal(p.score, a.health.fhi); assert.equal(p.next.action, action); assert.equal(p.next.gap, gap);
    if (level === 3) assert.equal(p.next.debtId, loan.id);
  }
});
test('consistent surplus needs three complete months; unentered debt stays unconfirmed', () => {
  const historical = ['2026-08', '2026-09', '2026-10'].flatMap((m) => [tx('income', 1000000, m), tx('expense', 300000, m)]);
  const d = fixture({ reserve: 1500000, historical }), p = wellbeingPlan(d, analyzeFinance(d, date));
  assert.equal(p.milestones.find((m) => m.key === 'surplus').done, true);
  assert.equal(p.milestones.find((m) => m.key === 'debt').known, false);
  assert.equal(wellbeingPlan(fixture(), analyzeFinance(fixture(), date)).milestones.find((m) => m.key === 'surplus').done, false);
  const withoutCurrent = { ...d, transactions: historical };
  assert.equal(wellbeingPlan(withoutCurrent, analyzeFinance(withoutCurrent, date)).milestones.find((m) => m.key === 'balance').done, false);
});
test('prominent health links, component explanations and milestones escape personal content', () => {
  const malicious = { ...loan, name: '<img src=x onerror=bad()>' }, d = fixture({ reserve: 500000, debts: [malicious] }), a = analyzeFinance(d, date);
  const overview = renderOverview(d, a, true), analysis = renderAnalysis(d, a, 'health'), cashflow = renderAnalysis(d, a, 'cashflow');
  assert.ok(overview.indexOf('id="health-overview"') < overview.indexOf('class="money-cards"'));
  assert.ok(overview.includes('data-action="open-health"')); assert.ok(overview.includes('data-action="pay-debt"'));
  assert.ok(analysis.includes('id="health-analysis"')); assert.ok(cashflow.includes('id="spending-section"')); assert.ok(cashflow.includes('id="income-history-section"'));
  assert.ok(analysis.includes('Chưa đối chiếu nợ') === false); assert.ok(analysis.includes('Điểm cao cho thấy nền tảng tốt hơn'));
  assert.ok(!overview.includes('<img src=x')); assert.ok(overview.includes('&lt;img src=x'));
  assert.ok(!overview.includes('NaN')); assert.ok(!analysis.includes('NaN'));
});
