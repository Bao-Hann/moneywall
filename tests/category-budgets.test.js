import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeCategoryBudgets, categoryLimitsForMonth, suggestedCategoryLimits } from '../js/category-budgets.js';
import { createBackup, readData, replaceData, saveCategoryLimits, validateBackup } from '../js/db.js';
import { analyzeFinance, DEFAULT_PROFILE, sum } from '../js/finance-engine.js';
import { monthlyMoney } from '../js/money-flow.js';
import { filteredTransactions, renderAnalysis } from '../js/ui.js';

const month = '2026-04';
const date = new Date(2026, 3, 24, 12);
let id = 0;
const expense = (category, amount, extra = {}) => ({ id: `limit-${++id}`, date: '2026-04-12', type: 'expense', group: 'needs', category, amount, note: '', isFixedBill: false, createdAt: id, ...extra });
const data = (transactions = [], categoryLimits = {}, recurring_bills = []) => ({ transactions, recurring_bills, debts: [], profile: { ...DEFAULT_PROFILE, categoryLimits } });
const limit = (category, amount, extra = {}) => ({ category, pace: 'monthly', limit: amount, eventLimit: null, ...extra });

test('category limits use recorded days, reserve unpaid bills, and separate events from routine cash spending', () => {
  const fixture = data([
    expense('Ăn uống', 450000),
    expense('Ăn uống', 100000, { date: '2026-04-25' }),
    expense('Sinh hoạt', 800000, { isFixedBill: true, flow: { kind: 'regular', billId: 'rent' } }),
    expense('Sinh hoạt', 50000),
    expense('Dịch vụ', 36000, { date: '2026-04-20' }),
    expense('DỊCH VỤ', 290000, { note: 'Bảo dưỡng xe', date: '2026-04-20' }),
    expense('Dịch vụ', 1000000, { flow: { kind: 'deposit' } }),
    expense('Shopping', 190000, { group: 'wants' }),
  ], { [month]: [limit('Ăn uống', 600000, { pace: 'daily' }), limit('Sinh hoạt', 1100000), limit('Dịch vụ', 50000, { eventLimit: 300000 }), limit('Shopping', 150000)] }, [
    { id: 'rent', name: 'Tiền thuê', category: 'Sinh hoạt', group: 'needs', amount: 1000000, dueDay: 15, active: true },
  ]);
  const a = analyzeFinance(fixture, date), m = monthlyMoney(fixture, a), categories = analyzeCategoryBudgets(fixture, a, m);
  const [food, home, service, shop] = ['Ăn uống', 'Sinh hoạt', 'Dịch vụ', 'Shopping'].map((name) => categories.find((row) => row.category === name));
  assert.deepEqual([food.spent, food.status, food.daysLeft, food.perDay], [450000, 'fast', 10, 15000]);
  assert.deepEqual([home.unpaid, home.afterBills, home.status], [200000, 50000, 'near']);
  assert.deepEqual([service.spent, service.eventSpent, service.eventRemaining, service.status], [36000, 290000, 10000, 'within']);
  assert.deepEqual([shop.remaining, shop.status], [-40000, 'over']);
  assert.equal(sum(categories.map((row) => row.spent + row.eventSpent)), m.everyday);
  const scoped = (scope) => filteredTransactions(fixture, { month, category: 'Dịch vụ', through: a.today, scope });
  assert.equal(sum(scoped('budget-routine').map((t) => t.amount)), service.spent);
  assert.equal(sum(scoped('budget-event').map((t) => t.amount)), service.eventSpent);
  assert.match(renderAnalysis(fixture, a, 'plan'), /Chi hơi nhanh/);
});

test('a manual classification and budget month history survive older backups and subsequent updates', async () => {
  const initial = data([expense('Dịch vụ', 120000, { note: 'Sửa xe', budgetTiming: 'routine' })]);
  delete initial.profile.categoryLimits;
  await replaceData(initial);
  const original = await readData();
  const april = analyzeFinance(original, date);
  assert.deepEqual(analyzeCategoryBudgets(original, april).map((row) => [row.spent, row.eventSpent]), [[120000, 0]]);
  const suggested = suggestedCategoryLimits(analyzeCategoryBudgets(original, april));
  await saveCategoryLimits(month, suggested, true);
  await saveCategoryLimits('2026-05', [limit('Dịch vụ', 60000, { eventLimit: 150000 })]);
  await saveCategoryLimits('2026-05', suggested, true);
  const saved = await readData();
  const restored = validateBackup(JSON.parse(createBackup(saved)));
  assert.equal(restored.transactions[0].budgetTiming, 'routine');
  assert.deepEqual(categoryLimitsForMonth(restored.profile, '2026-03'), []);
  assert.deepEqual(categoryLimitsForMonth(restored.profile, month), [limit('Dịch vụ', 50000)]);
  assert.deepEqual(categoryLimitsForMonth(restored.profile, '2026-05'), [limit('Dịch vụ', 60000, { eventLimit: 150000 })]);
  assert.deepEqual(categoryLimitsForMonth(restored.profile, '2026-06'), [limit('Dịch vụ', 60000)]);
  await saveCategoryLimits('2026-05', [limit('Dịch vụ', null)]);
  assert.deepEqual(categoryLimitsForMonth((await readData()).profile, '2026-06'), []);
});
