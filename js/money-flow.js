// One ledger owns every cash movement. Plans use earned income and ordinary spending only.
export const FLOW_LABELS = Object.freeze({ regular: 'Thu chi thường', deposit: 'Tiền cọc', refund: 'Tiền được hoàn', 'reserve-in': 'Chuyển vào quỹ', 'reserve-out': 'Rút từ quỹ', debt: 'Trả nợ' });
export const kindOf = (t) => t.flow?.kind || 'regular';
export const isPlanTransaction = (t) => kindOf(t) === 'regular';
export const isLivingExpense = (t) => isPlanTransaction(t) && t.type === 'expense' && ['needs', 'wants'].includes(t.group);
export const isContribution = (t) => kindOf(t) === 'reserve-out' || t.type === 'expense' && (['reserve-in', 'debt'].includes(kindOf(t)) || kindOf(t) === 'regular' && t.group === 'savings_debt');
export const contributionAmount = (t) => !isContribution(t) ? 0 : kindOf(t) === 'reserve-out' ? -t.amount : t.amount;
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
  const ordinary = rows.filter(isLivingExpense);
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

// These are presentation values from the existing finance model and the same ledger.
// Money returned to the wallet is not new earned income; opening savings are not contributions.
export function financePlanSummary(data, a, m = monthlyMoney(data, a)) {
  const canPlan = a.income.yBase > 0;
  const canForecast = m.ordinary.length > 0 || a.history.some((month) => month.spent > 0) || a.totalActiveFixedBills > 0;
  const contributions = m.rows.reduce((value, t) => value + contributionAmount(t), 0);
  const target = a.safe.savingsTargetMonthly;
  const needs = Math.round(a.income.yBase * a.health.alloc.needs);
  const wants = a.income.yBase - needs - target;
  const allocation = [
    { group: 'needs', label: 'Chi thiết yếu', ratio: a.health.alloc.needs, plan: needs, actual: a.current.needs },
    { group: 'wants', label: 'Chi linh hoạt', ratio: a.health.alloc.wants, plan: wants, actual: a.current.wants },
    { group: 'savings_debt', label: 'Để dành & trả nợ', ratio: a.health.alloc.save, plan: target, actual: contributions },
  ];
  const progress = target > 0 ? Math.max(0, Math.min(100, contributions / target * 100)) : null;
  const recentMonths = a.history.slice(-5).concat(a.current);
  return { canPlan, canForecast, provisional: a.income.months < 3, contributions, target, progress, allocation,
    contributionGap: canPlan ? Math.max(0, target - contributions) : null,
    extraDebt: Math.max(0, target - a.health.totalMinDebtPayments),
    recentMonths };
}

export const ANALYSIS_VIEWS = Object.freeze([
  { key: 'health', label: 'Sức khỏe tài chính', icon: 'heart', description: 'Mức độ an tâm và lộ trình' },
  { key: 'plan', label: 'Kế hoạch chi tiêu', icon: 'target', description: 'Hạn mức, để dành, trả nợ' },
  { key: 'cashflow', label: 'Dòng tiền & dự báo', icon: 'chart', description: 'Tiền đi đâu, cuối tháng ra sao' },
  { key: 'habits', label: 'Thói quen & cảnh báo', icon: 'alert', description: 'Những khoản đáng xem lại' },
]);
export const isAnalysisView = (view) => ANALYSIS_VIEWS.some((v) => v.key === view);
const analysisSections = Object.freeze({
  'health-analysis': 'health', 'monthly-plan-section': 'plan', 'budget-section': 'plan', 'category-limits-section': 'plan',
  'savings-section': 'plan', 'allocation-section': 'plan', 'cutbacks-section': 'plan', 'debt-advice-section': 'plan',
  'spending-section': 'cashflow', 'income-history-section': 'cashflow', 'forecast-section': 'cashflow', 'deposit-section': 'cashflow',
  'habit-section': 'habits', 'anomaly-section': 'habits', 'payday-section': 'habits', 'lifestyle-section': 'habits',
});
export function analysisViewForSection(section, fallback = 'health') {
  return Object.hasOwn(analysisSections, section) ? analysisSections[section] : isAnalysisView(fallback) ? fallback : 'health';
}

/** Explain the existing health model without turning its score into a claim of independence. */
export function wellbeingPlan(data, a) {
  const h = a.health, hasIncome = a.income.yBase > 0;
  const hasEssentials = h.essentialMonthly > 1 && (a.current.needs > 0 || a.history.some((m) => m.needs > 0) || a.totalActiveFixedBills > 0);
  const ready = hasIncome && hasEssentials, provisional = a.income.months < 3;
  const score = ready ? h.fhi : null;
  const reserve = data.profile.liquidSavings, target = Math.ceil(h.essentialMonthly * h.targetRunway);
  const oneMonthGap = hasEssentials ? Math.max(0, Math.ceil(h.essentialMonthly - reserve)) : null;
  const reserveGap = hasEssentials ? Math.max(0, target - reserve) : null;
  const highDebt = [...data.debts].filter((d) => d.principal > 0 && d.apr > 10).sort((x, y) => y.apr - x.apr)[0];
  const completeMonths = a.history.slice(-3), surplusMonths = completeMonths.filter((m) => m.income > 0 && m.income > m.spent).length;
  let next;
  if (!ready) next = { title: 'Hoàn thiện bức tranh của bạn', text: 'Ghi thu nhập và chi phí sinh hoạt để biết nền tảng hiện tại.', action: 'add-transaction', label: 'Bổ sung thu chi', symbol: 'wallet' };
  else if (h.level === 1) next = { title: 'Giảm phần chi đang vượt thu', gap: Math.max(0, a.current.spent - a.current.income), text: 'Tiền có sẵn vẫn nằm trong số dư. Ưu tiên xem khoản có thể giảm trước khi tăng để dành.', action: 'open-analysis', section: 'spending-section', label: 'Tìm chỗ có thể điều chỉnh', symbol: 'wallet' };
  else if (h.level === 2) next = { title: 'Có quỹ đủ 1 tháng sinh hoạt', gap: oneMonthGap, text: 'Tạo lớp đệm đầu tiên cho những việc ngoài dự tính.', action: 'reserve-in', label: 'Chọn tiền chuyển vào quỹ', symbol: 'shield' };
  else if (h.level === 3 && highDebt) next = { title: 'Giảm khoản nợ có lãi cao nhất', debtId: highDebt.id, debtName: highDebt.name, gap: highDebt.principal, text: 'Trả các mức tối thiểu trước, rồi cân nhắc phần có thể trả thêm.', action: 'pay-debt', label: 'Xem và ghi lần trả nợ', symbol: 'layers' };
  else if (h.level === 4) next = { title: `Quỹ đủ ${new Intl.NumberFormat('vi-VN').format(h.targetRunway)} tháng sinh hoạt`, gap: reserveGap, text: 'Có thêm thời gian xoay xở nếu nguồn thu tạm dừng.', action: 'reserve-in', label: 'Chọn tiền chuyển vào quỹ', symbol: 'shield' };
  else next = { title: 'Giữ quỹ và duy trì khoản dư', text: 'Bạn đã có nền tảng. Tiếp tục giữ quỹ, kiểm soát nợ và dành tiền cho mục tiêu dài hạn.', action: 'reserve-in', label: 'Ghi khoản để dành', symbol: 'sprout' };
  return { ready, provisional, score, hasEssentials, target, reserveGap, oneMonthGap, highDebt, surplusMonths, next,
    label: score === null ? 'Cần thêm ghi chép' : score < 40 ? 'Cần củng cố nền tảng' : score < 70 ? 'Đang xây sự chủ động' : score < 85 ? 'Đang khá vững' : 'Nền tảng tốt',
    milestones: [
      { key: 'balance', title: 'Thu đủ trang trải chi sinh hoạt', done: a.current.income > 0 && a.current.income >= a.current.spent, known: a.current.income > 0 || a.current.spent > 0, action: 'open-analysis', section: 'spending-section', label: 'Xem thu chi' },
      { key: 'buffer', title: 'Có quỹ đệm 1 tháng', done: hasEssentials && h.runwayMonths >= 1, known: hasEssentials, action: 'open-planning', section: 'reserve-section', label: 'Xem quỹ' },
      { key: 'debt', title: 'Kiểm soát nợ lãi cao', done: data.debts.length > 0 && !highDebt, known: data.debts.length > 0, action: 'open-planning', section: 'debts-section', label: 'Đối chiếu nợ' },
      { key: 'reserve', title: `Quỹ đủ ${new Intl.NumberFormat('vi-VN').format(h.targetRunway)} tháng`, done: hasEssentials && h.runwayMonths >= h.targetRunway, known: hasEssentials, action: 'open-planning', section: 'reserve-section', label: 'Xem mốc quỹ' },
      { key: 'surplus', title: 'Thu vượt chi sinh hoạt trong 3 tháng', done: completeMonths.length === 3 && surplusMonths === 3, known: completeMonths.length === 3, action: 'open-analysis', section: 'income-history-section', label: 'Xem các tháng' },
    ] };
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
