import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { arithmeticFormula, parseMoney, excelDate, detectColumns, detectHeader, workbookSheets, buildImport, detectOpeningBalance } from '../js/excel-import.js';
import { initDB, replaceData, readData, appendTransactions, markExistingTransactions, validateBackup } from '../js/db.js';
import { DEFAULT_PROFILE, cashBalanceForMonth } from '../js/finance-engine.js';
import { renderTransactions, renderSettings } from '../js/ui.js';
import { analyzeFinance } from '../js/finance-engine.js';

const context = {}; vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../vendor/xlsx.full.min.js', import.meta.url), 'utf8'), context, { timeout: 3000 });
const X = context.XLSX;
const sample = () => {
  const wb = X.utils.book_new();
  X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([['Một trang ghi chú khác']]), 'Ghi chú');
  const sheet = X.utils.aoa_to_sheet([['Tháng 11'], ['Ngày', 'Danh mục', 'VNĐ', 'Tổng chi/ngày', 'Note', 'Danh mục'], ['2026-11-01', 'Khoản thu mẫu', 900000, -99999, '', 'Thu nhập khác'], ['2026-11-02', 'Giao dịch A', -47000, -999999, '', 'Sinh hoạt'], ['', 'Giao dịch B', -18000, '', 'Ghi chú thêm', 'Di chuyển'], ['2026-11-03', 'Khoản cọc thử', -200000, '', 'Có hoàn trả', 'Học tập']]);
  sheet['!merges'] = [{ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }];
  sheet.C5 = { t: 'n', f: '-10000-8000', v: -18000 };
  sheet.H4 = { t: 's', v: 'Số dư riêng' }; sheet.I4 = { t: 'n', v: 999999999 }; sheet['!ref'] = 'A1:I6';
  X.utils.book_append_sheet(wb, sheet, 'Thu chi');
  const bytes = X.write(wb, { type: 'array', bookType: 'xlsx' });
  return workbookSheets(X.read(bytes, { type: 'array', cellDates: false }), X).find((s) => s.name === 'Thu chi');
};
const empty = () => ({ transactions: [], debts: [], recurring_bills: [], profile: { ...DEFAULT_PROFILE } });

test('arithmetic grammar respects precedence, unary signs and parentheses', () => {
  assert.equal(arithmeticFormula('=-10000-60000/2'), -40000);
  assert.equal(arithmeticFormula('=-(10000+20000)/2'), -15000);
  assert.equal(arithmeticFormula('=1.5e3*2'), 3000);
});
test('arithmetic grammar rejects code, references, excessive depth and division by zero', () => {
  for (const text of ['=alert(1)', '=A1+A2', '=SUM(A1:A4)', '=1/0', '=1**3', '=()']) assert.throws(() => arithmeticFormula(text));
  assert.throws(() => arithmeticFormula('='.concat('('.repeat(40), '1', ')'.repeat(40))));
});
test('money parser handles Vietnamese and international formats, integer VND and units', () => {
  assert.equal(parseMoney('-1.234.567 ₫').amount, -1234567);
  assert.equal(parseMoney('1,234,567 VND').amount, 1234567);
  assert.equal(parseMoney('(25.000)').amount, -25000);
  assert.equal(parseMoney('1,5', 1000).amount, 1500);
  assert.equal(parseMoney('1.234,50').amount, 1235);
  assert.equal(parseMoney(123.4).amount, 123);
  assert.throws(() => parseMoney('20k'));
});
test('simple formulas recalculate safely; other formulas require a numeric cached result', () => {
  assert.equal(parseMoney({ f: '-10000-8000', v: -1 }).amount, -18000);
  assert.equal(parseMoney({ f: 'SUM(A1:A2)', v: -18000 }).cachedFormula, true);
  assert.throws(() => parseMoney({ f: 'SUM(A1:A2)', v: '' }), /chưa có kết quả/);
});
test('dates support Excel 1900/1904, Vietnamese day-first strings and day-only values', () => {
  assert.equal(excelDate('21/11/26', '2026-11'), '2026-11-21');
  assert.equal(excelDate('2026-11-21T12:00:00', ''), '2026-11-21');
  assert.equal(excelDate('21/11', '2026-11'), '2026-11-21');
  assert.equal(excelDate(21, '2026-11'), '2026-11-21');
  assert.equal(excelDate(61, '', false), '1900-03-01');
  assert.equal(excelDate(0, '', true), '1904-01-01');
  assert.equal(excelDate(60, '', false), null);
  assert.equal(excelDate('31/11/2026', ''), null);
  assert.equal(excelDate('21/11', ''), null);
});
test('duplicate category headers distinguish transaction text from final category column', () => {
  const m = detectColumns(['Ngày', 'Danh mục', 'VNĐ', 'Tổng chi/ngày', 'Note', 'Danh mục']);
  assert.equal(m.date, 0); assert.equal(m.amount, 2); assert.equal(m.note, 1); assert.equal(m.extra, 4); assert.equal(m.category, 5);
  assert.equal(detectHeader([['Tên sổ'], ['Ngày', 'Số tiền', 'Ghi chú']]).index, 1);
});
test('XLSX bytes round-trip: merged dates, transaction formulas, side balances and subtotals', () => {
  const sheet = sample(), result = buildImport(sheet, { month: '2026-11' });
  assert.equal(sheet.header.index, 1); assert.equal(result.rows.length, 4); assert.equal(result.errors.length, 0);
  assert.equal(result.rows[2].transaction.date, '2026-11-02'); assert.equal(result.rows[2].transaction.amount, 18000);
  assert.equal(result.rows[2].transaction.note, 'Giao dịch B · Ghi chú thêm');
  assert.equal(result.rows.filter((r) => r.transaction.type === 'expense').reduce((s, r) => s + r.transaction.amount, 0), 265000);
  assert.equal(result.rows[0].transaction.type, 'income');
  assert.ok(result.rows[3].warnings.some((w) => w.includes('tiền cọc')));
});
test('single positive expense sheet is explicitly interpreted through selected mode', () => {
  const sheet = sample(); sheet.rows[3][2] = { v: 47000 };
  assert.equal(buildImport(sheet, { mode: 'expense' }).rows[1].transaction.type, 'expense');
  assert.equal(buildImport(sheet, { mode: 'signed' }).rows[1].transaction.type, 'income');
});
test('invalid rows remain visible, totals skipped, missing categories retained for review', () => {
  const sheet = sample();
  sheet.rows.push([{ v: '2026-11-04' }, { v: 'Tổng cộng' }, { v: -265000 }]);
  sheet.rows.push([{ v: '2026-11-31' }, { v: 'Ngày sai' }, { v: -10000 }]);
  sheet.rows.push([{ v: '2026-11-05' }, { v: 'Không có nhóm' }, { v: -10000 }]);
  const result = buildImport(sheet);
  assert.equal(result.skipped, 1); assert.equal(result.errors.length, 1); assert.equal(result.rows.length, 5);
  assert.equal(result.rows.at(-1).transaction.category, 'Chưa phân loại');
  assert.ok(result.rows.at(-1).warnings.length > 0);
});
test('blank date is not guessed unless explicitly allowed; real merged cells always work', () => {
  const sheet = sample(); sheet.rows.push([null, { v: 'Ngày bỏ trống' }, { v: -10000 }]);
  assert.equal(buildImport(sheet).errors.length, 1);
  assert.equal(buildImport(sheet, { fillDates: true }).errors.length, 0);
});
test('user can change expense groups while preserving the source category', () => {
  const result = buildImport(sample(), { categoryGroups: { 'Sinh hoạt': 'wants' } });
  assert.equal(result.rows[1].transaction.group, 'wants'); assert.equal(result.rows[1].transaction.category, 'Sinh hoạt');
});
test('CSV keeps Vietnamese day/month order instead of auto-converting to US dates', () => {
  const wb = X.read('\uFEFFNgày;Số tiền;Ghi chú\n12/11/2026;-35.000;Đi chợ', { type: 'string', raw: true });
  const sheet = workbookSheets(wb, X)[0], result = buildImport(sheet);
  assert.equal(result.rows.length, 1); assert.equal(result.rows[0].transaction.date, '2026-11-12'); assert.equal(result.rows[0].transaction.amount, 35000);
});
test('duplicate multiset does not erase repeated legitimate purchases', () => {
  const transaction = buildImport(sample()).rows[1].transaction;
  assert.deepEqual(markExistingTransactions([transaction, { ...transaction, id: 'second' }], [transaction]), [true, false]);
  assert.deepEqual(markExistingTransactions([transaction, transaction], []), [false, false]);
});
test('append is atomic, preserves other stores and skips repeated imports', async () => {
  await initDB(); await replaceData(empty());
  const transactions = buildImport(sample()).rows.map((r) => r.transaction);
  assert.equal((await appendTransactions(transactions)).imported, 4);
  const second = transactions.map((t) => ({ ...t, id: crypto.randomUUID() }));
  assert.deepEqual(await appendTransactions(second), { imported: 0, skipped: 4 });
  const before = await readData();
  await assert.rejects(appendTransactions([{ ...transactions[0], id: 'valid-next' }, { ...transactions[1], id: 'invalid-next', amount: -1 }]));
  assert.deepEqual(await readData(), before);
  assert.equal((await appendTransactions(second, { skipDuplicates: false })).imported, 4);
  assert.deepEqual((await readData()).profile, DEFAULT_PROFILE);
});
test('daily ledger displays separate income, expense and net totals, including all day records', () => {
  const data = empty(); data.transactions = buildImport(sample()).rows.map((r) => r.transaction);
  const a = analyzeFinance(data, new Date(2026, 10, 21));
  const html = renderTransactions(data, a, { month: '2026-11', group: '', category: '', search: '' }, 1, 'daily');
  assert.ok(html.includes('daily-ledger')); assert.ok(html.includes('65.000')); assert.ok(html.includes('Thu trừ chi'));
  assert.ok(html.includes('Nhập Excel'));
  assert.ok(renderSettings(data, a, { mode: 'indexeddb' }).includes('Chọn tệp Excel'));
});
test('opening balances are detected separately from transactions and savings', () => {
  const sheet = sample();
  sheet.rows[2][7] = { v: 'TK NH:' }; sheet.rows[2][8] = { f: '100000+200000', v: 300000 };
  sheet.rows[3][7] = { v: 'Tiền mặt:' }; sheet.rows[3][8] = { v: 100000 };
  sheet.rows[4][7] = { v: 'Tiết kiệm:' }; sheet.rows[4][8] = { v: 5000000 };
  assert.deepEqual(detectOpeningBalance(sheet), { bank: 300000, cash: 100000 });
  assert.equal(buildImport(sheet).rows.length, 4);
});
test('cash balance separates opening money, new income, expenses and emergency reserves', () => {
  const data = empty(); data.transactions = buildImport(sample()).rows.map((r) => r.transaction);
  data.profile = { ...DEFAULT_PROFILE, liquidSavings: 5000000, openingBalances: { '2026-11': { bank: 300000, cash: 100000 } } };
  const balance = cashBalanceForMonth(data, '2026-11', '2026-11-21');
  assert.equal(balance.opening, 400000); assert.equal(balance.income, 900000); assert.equal(balance.expense, 265000); assert.equal(balance.available, 1035000);
  assert.equal(cashBalanceForMonth(data, '2026-12').available, null);
});
test('future transactions do not alter current cash balance', () => {
  const data = empty(); data.profile.openingBalances = { '2026-11': { bank: 100000, cash: 0 } };
  data.transactions = buildImport(sample()).rows.map((r) => ({ ...r.transaction, date: '2026-11-30' }));
  assert.equal(cashBalanceForMonth(data, '2026-11', '2026-11-21').available, 100000);
});
test('Excel import can atomically update opening money without replacing other profile fields', async () => {
  const data = empty(); data.profile.liquidSavings = 700000; data.profile.theme = 'dark';
  await replaceData(data);
  const transactions = buildImport(sample()).rows.map((r) => r.transaction);
  await appendTransactions(transactions, { openingBalance: { month: '2026-11', bank: 300000, cash: 100000 } });
  const after = await readData();
  assert.equal(after.transactions.length, 4); assert.equal(after.profile.liquidSavings, 700000); assert.equal(after.profile.theme, 'dark');
  assert.deepEqual(after.profile.openingBalances['2026-11'], { bank: 300000, cash: 100000 });
  await appendTransactions([], { openingBalance: { month: '2026-11', bank: 350000, cash: 120000 } });
  assert.equal((await readData()).transactions.length, 4);
  assert.equal((await readData()).profile.openingBalances['2026-11'].bank, 350000);
});
test('invalid opening balance rejects the entire import before any record is written', async () => {
  const before = await readData(), record = buildImport(sample()).rows[0].transaction;
  await assert.rejects(appendTransactions([{ ...record, id: 'should-not-import' }], { openingBalance: { month: '2026-13', bank: 100000, cash: 0 } }));
  assert.deepEqual(await readData(), before);
});
test('older backups without opening balances remain compatible', () => {
  const data = empty(); delete data.profile.openingBalances; data.profile.liquidSavings = 250000;
  const normalized = validateBackup({ app: 'vung-tai-chinh', version: 1, data });
  assert.deepEqual(normalized.profile.openingBalances, {}); assert.equal(normalized.profile.liquidSavings, 250000);
});
