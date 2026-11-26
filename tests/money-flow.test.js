import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PROFILE, analyzeFinance, cashBalanceForMonth } from '../js/finance-engine.js';
import { kindOf, suggestFlow, monthlyMoney, depositBalances, recordedRefundsForDeposit, categoryHabits, dateForMonth, monthAfterDayChange, ledgerTotals } from '../js/money-flow.js';
import { initDB, replaceData, readData, saveTransaction, appendTransactions, planImport, validateBackup, compareExcelWithLedger } from '../js/db.js';
import { renderOverview, renderAnalysis, filteredTransactions } from '../js/ui.js';
import { buildImport, detectSideBalances } from '../js/excel-import.js';

let n = 0;
const row = (overrides = {}) => ({ id: `flow-${++n}`, date: '2026-11-12', type: 'expense', amount: 100000, group: 'needs', category: 'Sinh hoạt', isFixedBill: false, note: 'Ghi chép tổng hợp', createdAt: n, ...overrides });
const data = (transactions = [], rest = {}) => ({ transactions, recurring_bills: [], debts: [], profile: { ...DEFAULT_PROFILE, openingBalances: { '2026-11': { bank: 1000000, cash: 0 } } }, ...rest });
const date = new Date(2026, 10, 25);
const debt = { id: 'loan', name: 'Khoản vay tổng hợp', principal: 900000, apr: 12, minMonthlyPayment: 150000, isHighInterest: true };

test('cash movements reconcile while deposits and refunds stay out of income/spending plans', () => {
  const deposit = row({ amount: 500000, flow: { kind: 'deposit' } });
  const records = [deposit, row({ type: 'income', group: 'income', amount: 300000 }), row({ type: 'income', group: 'income', amount: 400000, flow: { kind: 'refund', targetId: deposit.id } }), row(), row({ group: 'savings_debt', flow: { kind: 'reserve-in' } }), row({ amount: 50000, group: 'savings_debt', flow: { kind: 'debt', targetId: debt.id, principal: 40000 } })];
  const d = data(records), a = analyzeFinance(d, date), m = monthlyMoney(d, a);
  assert.equal(cashBalanceForMonth(d, a.month, a.today).available, 950000);
  assert.equal(m.available, 950000); assert.equal(m.received, 700000); assert.equal(m.paid, 750000);
  assert.equal(a.current.income, 300000); assert.equal(a.current.spent, 100000);
  assert.equal(m.everyday, 100000); assert.equal(m.refunds, 400000); assert.equal(m.deposits[0].remaining, 100000);
  assert.equal(m.moved, 150000);
});
test('daily cash suggestion reserves the unpaid part of bills and debt payments once', () => {
  const b = { id: 'rent', name: 'Hóa đơn tổng hợp', amount: 200000, dueDay: 28, group: 'needs', category: 'Sinh hoạt', active: true };
  const d = data([row({ amount: 50000, isFixedBill: true, flow: { kind: 'regular', billId: b.id } }), row({ amount: 50000, group: 'savings_debt', flow: { kind: 'debt', targetId: debt.id, principal: 40000 } })], { recurring_bills: [b], debts: [debt] });
  const a = analyzeFinance(d, date), m = monthlyMoney(d, a);
  assert.equal(m.reserved, 250000); assert.equal(m.available, 900000);
  assert.equal(m.daily, Math.floor(650000 / 6));
  const without = data([], { profile: { ...DEFAULT_PROFILE } });
  assert.equal(monthlyMoney(without, analyzeFinance(without, date)).daily, null);
});
test('named bill links cannot pay another bill with the same category', () => {
  const bills = ['a', 'b'].map((id) => ({ id, name: id, category: 'Sinh hoạt', group: 'needs', active: true, amount: 100000, dueDay: 5 }));
  const a = analyzeFinance(data([row({ isFixedBill: true, flow: { kind: 'regular', billId: 'b' } })], { recurring_bills: bills }), date);
  assert.equal(a.bills[0].remaining, 100000); assert.equal(a.bills[1].paid, true);
  const mixed = analyzeFinance(data([row({ isFixedBill: true }), row({ isFixedBill: true, flow: { kind: 'regular', billId: 'a' } })], { recurring_bills: bills }), date);
  assert.equal(mixed.unpaidFixedBills, 0, 'named payments are consumed before generic category payments');
});
test('using an existing Excel expense as a bill payment changes no cash amount or record count', async () => {
  await initDB();
  const expense = row({ amount: 170000 });
  const bill = { id: 'existing-bill', name: 'Hóa đơn tổng hợp', category: 'Tiền mạng', group: 'needs', active: true, dueDay: 12, amount: 170000 };
  await replaceData(data([expense], { recurring_bills: [bill] }));
  const before = cashBalanceForMonth(await readData(), '2026-11', '2026-11-25');
  await saveTransaction({ ...expense, isFixedBill: true, flow: { kind: 'regular', billId: bill.id } }, '', '2026-11-25');
  const saved = await readData();
  assert.equal(saved.transactions.length, 1); assert.deepEqual(cashBalanceForMonth(saved, '2026-11', '2026-11-25'), before);
  assert.equal(analyzeFinance(saved, date).bills[0].paid, true);
  assert.deepEqual(filteredTransactions(saved, { month: '2026-11', billId: bill.id }).map((t) => t.id), [expense.id]);
});
test('fund entry edits and deletion reverse only the prior effect', async () => {
  await initDB(); await replaceData(data());
  const t = row({ group: 'savings_debt', amount: 200000, flow: { kind: 'reserve-in' } });
  await saveTransaction(t, '', '2026-11-25');
  assert.equal((await readData()).profile.liquidSavings, 200000);
  await saveTransaction({ ...t, amount: 350000 }, '', '2026-11-25');
  assert.equal((await readData()).profile.liquidSavings, 350000); assert.equal((await readData()).transactions.length, 1);
  await saveTransaction(null, t.id, '2026-11-25');
  assert.equal((await readData()).profile.liquidSavings, 0); assert.equal((await readData()).transactions.length, 0);
});
test('invalid fund withdrawal and deleting a spent deposit leave all data unchanged', async () => {
  await initDB(); await replaceData(data());
  const inFund = row({ group: 'savings_debt', flow: { kind: 'reserve-in' } });
  await saveTransaction(inFund, '', '2026-11-25');
  await saveTransaction(row({ type: 'income', group: 'income', flow: { kind: 'reserve-out' } }), '', '2026-11-25');
  const before = await readData();
  await assert.rejects(saveTransaction(row({ type: 'income', group: 'income', flow: { kind: 'reserve-out' } }), '', '2026-11-25'), /Quỹ không đủ/);
  await assert.rejects(saveTransaction(null, inFund.id, '2026-11-25'), /Quỹ không đủ/);
  assert.deepEqual(await readData(), before);
});
test('debt payment records the full cash amount but reduces principal only by the explicit part', async () => {
  await initDB(); await replaceData(data([], { debts: [debt] }));
  const t = row({ group: 'savings_debt', amount: 150000, flow: { kind: 'debt', targetId: debt.id, principal: 120000 } });
  await saveTransaction(t, '', '2026-11-25');
  let d = await readData(); assert.equal(d.debts[0].principal, 780000); assert.equal(d.transactions[0].amount, 150000);
  await saveTransaction({ ...t, flow: { ...t.flow, principal: 130000 } }, '', '2026-11-25');
  assert.equal((await readData()).debts[0].principal, 770000);
  const before = await readData();
  await assert.rejects(saveTransaction({ ...t, flow: { ...t.flow, principal: 160000 } }, '', '2026-11-25'), /Phần trả gốc/);
  await assert.rejects(saveTransaction({ ...t, amount: 1000000, flow: { ...t.flow, principal: 1000000 } }, '', '2026-11-25'), /lớn hơn số nợ/);
  assert.deepEqual(await readData(), before);
  await saveTransaction(null, t.id, '2026-11-25'); assert.equal((await readData()).debts[0].principal, debt.principal);
});
test('future or missing linked debt/fund effects reject without a partial ledger entry', async () => {
  await initDB(); await replaceData(data());
  const before = await readData();
  await assert.rejects(saveTransaction(row({ date: '2026-12-01', group: 'savings_debt', flow: { kind: 'reserve-in' } }), '', '2026-11-25'), /tương lai/);
  await assert.rejects(saveTransaction(row({ group: 'savings_debt', flow: { kind: 'debt', targetId: 'missing', principal: 50000 } }), '', '2026-11-25'), /không còn tồn tại/);
  assert.deepEqual(await readData(), before);
});
test('partial refunds across months link correctly and cannot exceed or orphan their deposit', async () => {
  const deposit = row({ date: '2026-10-10', amount: 400000, flow: { kind: 'deposit' } });
  await initDB(); await replaceData(data([deposit]));
  const refund = row({ type: 'income', group: 'income', amount: 150000, flow: { kind: 'refund', targetId: deposit.id } });
  await saveTransaction(refund, '', '2026-11-25');
  assert.equal(depositBalances((await readData()).transactions)[0].remaining, 250000);
  const before = await readData();
  await assert.rejects(saveTransaction({ ...refund, amount: 450000 }, '', '2026-11-25'), /vượt số tiền cọc/);
  await assert.rejects(saveTransaction(null, deposit.id, '2026-11-25'), /Gỡ liên kết/);
  await assert.rejects(saveTransaction({ ...refund, date: '2026-10-09' }, '', '2026-11-25'), /từ ngày đặt cọc/);
  assert.deepEqual(await readData(), before);
  await saveTransaction(null, refund.id, '2026-11-25'); assert.equal(depositBalances((await readData()).transactions)[0].remaining, 400000);
});
test('reimport fills missing categories and suggests cash classification without duplicate cash movements', async () => {
  const old = row({ category: 'Chưa phân loại', note: 'Cọc đồ dùng', amount: 200000 });
  const incoming = { ...old, id: 'new-id', category: 'Học tập', flow: { kind: 'deposit' } };
  await initDB(); await replaceData(data([old]));
  const receipt = await appendTransactions([incoming]);
  assert.equal(receipt.imported, 0); assert.equal(receipt.updated, 1);
  const d = await readData(); assert.equal(d.transactions.length, 1); assert.equal(d.transactions[0].id, old.id);
  assert.equal(d.transactions[0].category, 'Học tập'); assert.equal(kindOf(d.transactions[0]), 'deposit');
  assert.equal(cashBalanceForMonth(d, '2026-11', '2026-11-25').expense, 200000);
  assert.equal((await appendTransactions([incoming])).updated, 0);
  assert.equal(planImport([incoming], [old], { updateDetails: false }).updated, 0);
});
test('reimport keeps manual refund links and counts legitimately repeated purchases', () => {
  const t = row({ type: 'income', group: 'income', flow: { kind: 'refund', targetId: 'my-deposit' } });
  const imported = { ...t, id: 'other', flow: { kind: 'refund' } };
  assert.equal(planImport([imported], [t]).updated, 0);
  assert.equal(planImport([row({ ...t, id: 'a' }), row({ ...t, id: 'b' })], [t]).imported, 1);
});

test('recording a refund can reuse an imported receipt without changing the cash balance', async () => {
  const deposit = row({ amount: 500000, date: '2026-11-02', flow: { kind: 'deposit' } });
  const refund = (fields = {}) => row({ type: 'income', group: 'income', note: 'Hoàn tiền', flow: { kind: 'refund' }, ...fields });
  const exact = refund({ amount: 500000 });
  const partial = refund({ date: '2026-11-22' });
  const transactions = [deposit, partial, refund({ amount: 500001 }), refund({ date: '2026-11-01' }), refund({ date: '2026-11-26' }), exact];
  const candidates = recordedRefundsForDeposit(transactions, depositBalances(transactions)[0], '2026-11-25');
  assert.deepEqual(candidates.map((t) => t.id), [exact.id, partial.id]);
  await replaceData(data([deposit, exact]));
  const before = cashBalanceForMonth(await readData(), '2026-11', '2026-11-25').available;
  await saveTransaction({ ...exact, flow: { kind: 'refund', targetId: deposit.id } }, '', '2026-11-25');
  const after = await readData();
  assert.equal(after.transactions.length, 2);
  assert.equal(depositBalances(after.transactions)[0].remaining, 0);
  assert.equal(cashBalanceForMonth(after, '2026-11', '2026-11-25').available, before);
});

test('Excel comparison counts repeats separately and includes later dates in the same month', () => {
  const early = row({ amount: 25000 });
  const repeat = { ...early, id: 'repeat' };
  const later = row({ date: '2026-11-26', amount: 75000 });
  const received = row({ date: '2026-11-24', type: 'income', group: 'income', amount: 50000 });
  const priorMonth = row({ date: '2026-10-30' });
  const file = [early, repeat, received].map((transaction, index) => ({ row: index + 2, transaction }));
  const comparison = compareExcelWithLedger(file, [priorMonth, early, received, later]);
  assert.deepEqual(comparison.months, ['2026-11']);
  assert.deepEqual(comparison.onlyInExcel, [file[1]]);
  assert.deepEqual(comparison.onlyInLedger, [later]);
  assert.deepEqual(ledgerTotals(comparison.transactions), { income: 50000, expense: 100000, net: -50000, spendingDays: 2, dailyExpense: 50000 });
  assert.equal(ledgerTotals([received]).dailyExpense, null);
});
test('side balances and cash classifications are proposed without manufacturing a debt or transaction', () => {
  const rows = [['Ngày', 'Nội dung', 'VNĐ', 'Danh mục'], ['2026-11-02', 'cọc sách', -200000, 'Học tập'], ['2026-11-03', 'hoàn tiền', 200000, 'Khác'], [null, null, null, null, 'Tiết kiệm:', 750000], [null, null, null, null, 'dư nợ', 550000]];
  const sheet = { rows, merges: [], header: { index: 0, mapping: { date: 0, note: 1, amount: 2, category: 3, extra: -1, fixed: -1, group: -1, type: -1 } } };
  const result = buildImport(sheet, { month: '2026-11' });
  assert.equal(result.rows.length, 2); assert.equal(kindOf(result.rows[0].transaction), 'deposit'); assert.equal(kindOf(result.rows[1].transaction), 'refund');
  assert.deepEqual(detectSideBalances(sheet), { liquidSavings: 750000, debt: 550000 });
  assert.equal(suggestFlow(row({ note: 'Mua cocacola' })), 'regular');
});
test('month selection, learned categories and insight ledger filters refer to the same records', () => {
  assert.equal(monthAfterDayChange('2026-10', '2026-11-25', '2026-11-25'), '2026-10');
  assert.equal(monthAfterDayChange('2026-10', '2026-11-30', '2026-12-01'), '2026-10');
  assert.equal(monthAfterDayChange('2026-11', '2026-11-30', '2026-12-01'), '2026-12');
  assert.equal(dateForMonth('2026-10', date).getDate(), 31);
  assert.equal(dateForMonth('2026-11', date), date);
  const rows = [row({ category: 'Ăn uống' }), row({ category: 'Di chuyển' }), row({ category: 'Ăn uống' }), row({ type: 'income', group: 'income', flow: { kind: 'refund' } })];
  assert.equal(categoryHabits(rows)[0].category, 'Ăn uống');
  assert.equal(filteredTransactions(data(rows), { month: '2026-11', category: 'Ăn uống' }).length, 2);
  assert.equal(filteredTransactions(data(rows), { month: '2026-11', kind: 'refund' }).length, 1);
  const categorized = [...rows, row({ category: 'Ăn uống', flow: { kind: 'deposit' } }), row({ date: '2026-12-01', category: 'Ăn uống' }), row({ date: '2026-10-01', category: 'Ăn uống' })];
  const subset = filteredTransactions(data(categorized), { month: '2026-11', category: 'Ăn uống', scope: 'everyday', through: '2026-11-25' });
  assert.equal(subset.length, 2);
  assert.equal(filteredTransactions(data(categorized), { month: '2026-11', category: 'Ăn uống', scope: 'everyday', through: '2026-11-25', allMonths: true }).length, 3);
});
test('old backups remain valid; linked records survive backups and render as escaped actionable content', () => {
  const deposit = row({ note: '<script>bad()</script>', category: 'a" onclick="bad()', flow: { kind: 'deposit' } });
  const d = data([deposit]), clean = validateBackup({ app: 'vung-tai-chinh', version: 1, data: d });
  assert.deepEqual(clean.transactions[0].flow, { kind: 'deposit' });
  const a = analyzeFinance(clean, date), html = renderOverview(clean, a, true) + renderAnalysis(clean, a, 'cashflow');
  assert.ok(!html.includes('<script>bad()')); assert.ok(html.includes('&lt;script&gt;bad()'));
  assert.ok(html.includes('data-action="open-ledger"')); assert.ok(html.includes('data-action="refund-deposit"'));
  assert.ok(!html.includes('NaN')); assert.ok(!html.includes('Sức khỏe tài chính · FHI'));
});
