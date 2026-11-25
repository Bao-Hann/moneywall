// One ledger owns every cash movement. Plans use earned income and ordinary spending only.
export const FLOW_LABELS = Object.freeze({ regular: 'Thu chi thường', deposit: 'Tiền cọc', refund: 'Tiền được hoàn', 'reserve-in': 'Chuyển vào quỹ', 'reserve-out': 'Rút từ quỹ', debt: 'Trả nợ' });
export const kindOf = (t) => t.flow?.kind || 'regular';
export const isPlanTransaction = (t) => kindOf(t) === 'regular';
const total = (xs) => xs.reduce((s, t) => s + t.amount, 0);
const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('đ', 'd').toLowerCase();
export function suggestFlow(t) {
  const text = norm(t.note);
  if (t.type === 'income' && /\b(hoan tien|hoan coc|nhan lai coc|refund)\b/.test(text)) return 'refund';
  if (t.type === 'expense' && /\b(coc|co hoan tra|deposit)\b/.test(text)) return 'deposit';
  return 'regular';
}
export function categoryHabits(transactions, type = 'expense') {
  const found = new Map();
  for (const t of [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)) {
    if (t.type !== type) continue;
    const item = found.get(t.category) || { category: t.category, group: t.group, count: 0, last: t.date };
    item.count++; found.set(t.category, item);
  }
  return [...found.values()].sort((a, b) => b.count - a.count || b.last.localeCompare(a.last));
}
export function depositBalances(transactions, through = '9999-12-31', excludingId = '') {
  const rows = transactions.filter((t) => t.date <= through && t.id !== excludingId);
  return rows.filter((t) => kindOf(t) === 'deposit').map((t) => {
    const refunded = total(rows.filter((r) => kindOf(r) === 'refund' && r.flow?.targetId === t.id));
    return { ...t, refunded, remaining: Math.max(0, t.amount - refunded) };
  }).sort((a, b) => b.date.localeCompare(a.date));
}
export function dateForMonth(month, now = new Date()) {
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || '') || month >= current) return now;
  return new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0, 12);
}
export function monthAfterDayChange(selectedMonth, previousDay, nextDay) {
  return selectedMonth === previousDay.slice(0, 7) ? nextDay.slice(0, 7) : selectedMonth;
}
export function monthlyMoney(data, a) {
  const rows = data.transactions.filter((t) => t.date.startsWith(a.month) && t.date <= a.today);
  const incoming = rows.filter((t) => t.type === 'income'), outgoing = rows.filter((t) => t.type === 'expense');
  const opening = data.profile.openingBalances?.[a.month];
  const received = total(incoming), paid = total(outgoing), available = opening ? opening.bank + opening.cash + received - paid : null;
  const ordinary = rows.filter((t) => isPlanTransaction(t) && t.type === 'expense' && ['needs', 'wants'].includes(t.group));
  const buckets = new Map();
  for (const t of ordinary) { const c = buckets.get(t.category) || { category: t.category, amount: 0, count: 0 }; c.amount += t.amount; c.count++; buckets.set(t.category, c); }
  const categories = [...buckets.values()].sort((x, y) => y.amount - x.amount);
  const refunds = total(incoming.filter((t) => kindOf(t) === 'refund'));
  const deposits = depositBalances(data.transactions, a.today);
  const unmatchedRefunds = rows.filter((t) => kindOf(t) === 'refund' && !t.flow?.targetId);
  const review = rows.filter((t) => kindOf(t) === 'regular' && suggestFlow(t) !== 'regular');
  const debtDue = data.debts.filter((d) => d.principal > 0).reduce((s, d) => {
    const paidThisMonth = total(rows.filter((t) => kindOf(t) === 'debt' && t.flow?.targetId === d.id));
    return s + Math.min(d.principal, Math.max(0, d.minMonthlyPayment - paidThisMonth));
  }, 0);
  const reserved = a.unpaidFixedBills + debtDue;
  const daily = available === null ? null : Math.max(0, Math.floor((available - reserved) / a.safe.daysLeft));
  return { rows, incoming, outgoing, opening, received, paid, available, ordinary, everyday: total(ordinary), categories, refunds, deposits, unmatchedRefunds, review, debtDue, reserved, daily,
    earned: total(incoming.filter(isPlanTransaction)), deposited: total(outgoing.filter((t) => kindOf(t) === 'deposit')),
    moved: total(outgoing.filter((t) => !['regular', 'deposit'].includes(kindOf(t)) || t.group === 'savings_debt')),
    latest: [...rows].sort((x, y) => y.date.localeCompare(x.date) || y.createdAt - x.createdAt)[0]?.date || null };
}
/** Compute reversals and replacements before one atomic database write. */
export function changeTransaction(data, next, id, today) {
  const previous = data.transactions.find((t) => t.id === id);
  const transactions = data.transactions.filter((t) => t.id !== id);
  const debts = data.debts.map((d) => ({ ...d }));
  const profile = { ...data.profile };
  const effects = (t, direction) => {
    if (!t) return;
    const kind = kindOf(t);
    if (['reserve-in', 'reserve-out', 'debt'].includes(kind) && t.date > today) throw new Error('Chỉ ghi chuyển quỹ hoặc trả nợ khi đã thực hiện. Ngày ghi không được ở tương lai.');
    if (kind === 'reserve-in') profile.liquidSavings += direction * t.amount;
    if (kind === 'reserve-out') profile.liquidSavings -= direction * t.amount;
    if (kind === 'debt') {
      const debt = debts.find((d) => d.id === t.flow.targetId);
      if (!debt) throw new Error('Khoản nợ liên quan không còn tồn tại. Kiểm tra lại trong Khoản cần lo.');
      debt.principal -= direction * t.flow.principal;
    }
  };
  effects(previous, -1); effects(next, 1);
  if (profile.liquidSavings < 0) throw new Error('Quỹ không đủ tiền cho thay đổi này. Kiểm tra số dư quỹ trước.');
  if (debts.some((d) => d.principal < 0)) throw new Error('Phần trả gốc lớn hơn số nợ còn lại.');
  if (next) transactions.push(next);
  // Recheck all links: editing/deleting a deposit must not orphan or overpay its refunds.
  for (const refund of transactions.filter((t) => kindOf(t) === 'refund' && t.flow?.targetId)) {
    const deposit = transactions.find((t) => t.id === refund.flow.targetId && kindOf(t) === 'deposit');
    if (!deposit) throw new Error('Khoản cọc này đã có tiền hoàn liên kết. Gỡ liên kết ở khoản hoàn trước khi đổi hoặc xóa cọc.');
    if (refund.date < deposit.date) throw new Error('Ngày nhận tiền hoàn phải từ ngày đặt cọc trở đi.');
    const refunded = total(transactions.filter((t) => kindOf(t) === 'refund' && t.flow?.targetId === deposit.id));
    if (refunded > deposit.amount) throw new Error('Tổng tiền hoàn vượt số tiền cọc. Kiểm tra khoản cọc được chọn.');
  }
  return { transactions, debts, profile };
}
