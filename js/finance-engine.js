import { isPlanTransaction } from './money-flow.js';
/** All calculations are pure. Money is integer VND; dates are local calendar dates. */
export const CATEGORIES = Object.freeze({
  income: ['Lương chính', 'Freelance / Dự án', 'Thưởng / Hoa hồng', 'Thu nhập khác'],
  needs: ['Tiền nhà / Trả góp nhà', 'Điện nước & Internet', 'Đi chợ & Nấu ăn', 'Di chuyển & Xăng xe', 'Y tế & Bảo hiểm', 'Học tập / Gia đình'],
  wants: ['Ăn ngoài & Cafe', 'Mua sắm online', 'Giải trí & Du lịch', 'Đăng ký gói dịch vụ', 'Quà tặng & Giao lưu'],
  savings_debt: ['Nạp quỹ dự phòng', 'Trả nợ gốc/lãi', 'Đầu tư dài hạn'],
});
export const GROUP_LABELS = { income: 'Tiền nhận', needs: 'Sinh hoạt cần thiết', wants: 'Mua sắm & Giải trí', savings_debt: 'Để dành & Trả nợ' };
export const DEFAULT_PROFILE = { id: 'default', liquidSavings: 0, paydayDay: 5, incomeModeOverride: 'AUTO', theme: 'light', lastBackupAt: null, openingBalances: {}, categoryLimits: {} };
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const sum = (xs) => xs.reduce((a, x) => a + x, 0);
export const avg = (xs) => xs.length ? sum(xs) / xs.length : 0;
export const round1 = (x) => Math.round(x * 10) / 10;
export function percentile(values, p) {
  if (!values.length) return 0;
  const a = [...values].sort((x, y) => x - y);
  const i = (a.length - 1) * clamp(p, 0, 100) / 100;
  return a[Math.floor(i)] + (a[Math.ceil(i)] - a[Math.floor(i)]) * (i - Math.floor(i));
}
export const median = (xs) => percentile(xs, 50);
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function monthKeys(date, count) {
  return Array.from({ length: count }, (_, i) => localDate(new Date(date.getFullYear(), date.getMonth() - count + i + 1, 1)).slice(0, 7));
}
export function cashBalanceForMonth(data, month, today = localDate()) {
  const opening = data.profile.openingBalances?.[month];
  const transactions = data.transactions.filter((t) => t.date.startsWith(month) && t.date <= today);
  const income = sum(transactions.filter((t) => t.type === 'income').map((t) => t.amount));
  const expense = sum(transactions.filter((t) => t.type === 'expense').map((t) => t.amount));
  return { month, configured: !!opening, bank: opening?.bank ?? null, cash: opening?.cash ?? null, opening: opening ? opening.bank + opening.cash : null, income, expense, available: opening ? opening.bank + opening.cash + income - expense : null };
}
export function aggregateMonths(transactions, date = new Date()) {
  const months = new Map();
  for (const t of transactions) {
    if (!isPlanTransaction(t)) continue;
    if (t.date > localDate(date)) continue;
    const key = t.date.slice(0, 7);
    if (!months.has(key)) months.set(key, { month: key, income: 0, needs: 0, wants: 0, savings_debt: 0, spent: 0, variable: 0 });
    const m = months.get(key);
    m[t.group] += t.amount;
    if (t.type === 'expense' && ['needs', 'wants'].includes(t.group)) {
      m.spent += t.amount;
      if (!t.isFixedBill) m.variable += t.amount;
    }
  }
  return [...months.values()].sort((a, b) => a.month.localeCompare(b.month));
}

// Module 1 — adaptive income baseline, sample standard deviation.
export function classifyIncome(monthlyIncomes, currentMonthActualIncome = 0, override = 'AUTO') {
  const xs = monthlyIncomes.slice(-12);
  const n = xs.length;
  if (!n) return { mode: 'NO_INCOME', cv: null, yBase: 0, surplusForBuffer: 0, months: 0 };
  const mean = avg(xs);
  const cv = n >= 3 && mean > 0 ? Math.sqrt(sum(xs.map((x) => (x - mean) ** 2)) / (n - 1)) / mean : null;
  let mode = n < 3 ? 'COLD_START' : cv <= .15 ? 'STABLE' : cv <= .30 ? 'MODERATE' : 'IRREGULAR';
  let yBase = n < 3 ? Math.min(...xs) : mode === 'STABLE' ? mean : mode === 'MODERATE' ? Math.min(median(xs), Math.round(mean * .9)) : percentile(xs, 25);
  if (override === 'IRREGULAR') { mode = 'IRREGULAR'; yBase = n < 3 ? Math.min(...xs) : percentile(xs, 25); }
  if (override === 'STABLE' && n >= 3) { mode = 'STABLE'; yBase = mean; }
  yBase = Math.round(yBase);
  return { mode, cv, yBase, surplusForBuffer: Math.max(0, currentMonthActualIncome - yBase), months: n };
}

// Module 2 — SES, damped Holt, additive Holt-Winters and calendar blending.
export function forecastSpending({ hist = [], currVarSpent = 0, paidFixedBills = 0, unpaidFixedBills = 0, elapsedDays = 1, daysInMonth = 30 }) {
  elapsedDays = clamp(elapsedDays, 1, daysInMonth);
  const intramonthProj = currVarSpent + currVarSpent / elapsedDays * (daysInMonth - elapsedDays) + paidFixedBills + unpaidFixedBills;
  const n = hist.length;
  let histForecast = intramonthProj, trendPerMonth = 0, tierIndex = 0;
  if (n >= 1 && n <= 2) {
    tierIndex = 1; histForecast = hist.slice(1).reduce((s, x) => .4 * x + .6 * s, hist[0]);
  } else if (n >= 3 && n <= 23) {
    tierIndex = 2;
    let level = hist[0], trend = (hist[n - 1] - hist[0]) / (n - 1);
    for (const x of hist.slice(1)) {
      const newLevel = .4 * x + .6 * (level + .85 * trend);
      trend = .2 * (newLevel - level) + .8 * .85 * trend;
      level = newLevel;
    }
    trendPerMonth = trend; histForecast = Math.max(0, level + .85 * trend);
  } else if (n >= 24) {
    tierIndex = 3;
    let level = avg(hist.slice(0, 12)), trend = (avg(hist.slice(12, 24)) - level) / 12;
    const seasons = hist.slice(0, 12).map((x) => x - level);
    for (let t = 12; t < n; t++) {
      const oldLevel = level, seasonal = seasons[t % 12];
      level = .3 * (hist[t] - seasonal) + .7 * (level + trend);
      trend = .1 * (level - oldLevel) + .9 * trend;
      seasons[t % 12] = .2 * (hist[t] - level) + .8 * seasonal;
    }
    trendPerMonth = trend; histForecast = Math.max(0, level + trend + seasons[n % 12]);
  }
  const tiers = ['Tầng 0 (Tốc độ chi thực tế)', 'Tầng 1 (Làm mượt hàm mũ đơn SES)', 'Tầng 2 (Xu hướng giảm chấn Damped Holt)', 'Tầng 3 (Mùa vụ Holt-Winters 12 tháng)'];
  const w = Math.min(1, elapsedDays / daysInMonth);
  return { tierIndex, tier: tiers[tierIndex], histForecast, intramonthProj, trendPerMonth, blendedEomForecast: Math.round(w * intramonthProj + (1 - w) * histForecast) };
}

// Module 3A — right-tail robust anomaly detection, with a materiality gate.
export function detectAnomalies(transactions, yBase, date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 89);
  const categories = new Map();
  for (const t of transactions) {
    if (t.type !== 'expense' || t.date < localDate(start) || t.date > localDate(date)) continue;
    if (!categories.has(t.category)) categories.set(t.category, []);
    categories.get(t.category).push(t);
  }
  const alerts = [], minMaterialDelta = Math.max(100000, Math.round(yBase / 100));
  for (const [category, ts] of categories) {
    if (ts.length < 5) continue;
    const xs = ts.map((t) => t.amount), med = median(xs), mad = median(xs.map((x) => Math.abs(x - med)));
    const q1 = percentile(xs, 25), q3 = percentile(xs, 75), iqr = q3 - q1;
    for (const t of ts) {
      const x = t.amount;
      if (!(x > med && x - med >= minMaterialDelta && (med === 0 || x >= 1.5 * med))) continue;
      let severity = null;
      if (mad > 0) {
        const z = .6745 * (x - med) / mad;
        if (z > 3.5 && (med === 0 || x >= 2 * med)) severity = 'CRITICAL';
        else if ((z > 2.5 && z <= 3.5) || (iqr > 0 && x > q3 + 1.5 * iqr)) severity = 'WARNING';
      } else if (iqr > 0) {
        if (x > q3 + 3 * iqr) severity = 'CRITICAL';
        else if (x > q3 + 1.5 * iqr) severity = 'WARNING';
      } else {
        if (med === 0 || x >= 2 * med) severity = 'CRITICAL';
        else if (x >= 1.5 * med) severity = 'WARNING';
      }
      if (severity) alerts.push({ ...t, category, severity, median: med, multiple: med > 0 ? round1(x / med) : null });
    }
  }
  return alerts.sort((a, b) => b.date.localeCompare(a.date) || b.amount - a.amount);
}

// Module 3B — include zero-spend days in both daily-average denominators.
export const inPaydayWindow = (day, paydayDay) => (day - paydayDay + 30) % 30 <= 4;
export function paydaySpike(transactions, paydayDay = 5, date = new Date()) {
  const earliest = monthKeys(date, 3)[0], first = transactions.filter((t) => t.date <= localDate(date)).map((t) => t.date).sort()[0];
  if (!first) return { psi: null, warning: false, paydayAvg: 0, otherAvg: 0 };
  const start = first > `${earliest}-01` ? first : `${earliest}-01`;
  let windowDays = 0, otherDays = 0, windowSpent = 0, otherSpent = 0;
  const inWindow = (day) => inPaydayWindow(day, paydayDay);
  for (let d = new Date(`${start}T12:00:00`); localDate(d) <= localDate(date); d.setDate(d.getDate() + 1)) {
    if (inWindow(d.getDate())) windowDays++; else otherDays++;
  }
  for (const t of transactions) {
    if (t.date < start || t.date > localDate(date) || t.type !== 'expense' || t.isFixedBill || !['needs', 'wants'].includes(t.group)) continue;
    if (inWindow(Number(t.date.slice(8)))) windowSpent += t.amount; else otherSpent += t.amount;
  }
  const paydayAvg = windowDays ? windowSpent / windowDays : 0, otherAvg = otherDays ? otherSpent / otherDays : 0;
  const psi = otherAvg > 0 ? paydayAvg / otherAvg : paydayAvg > 0 && otherDays > 0 ? Infinity : null;
  return { psi, warning: psi !== null && psi >= 1.5, paydayAvg, otherAvg, windowDays, otherDays, start };
}

// Module 3C — compare adjacent complete calendar windows, never partial months.
export function lifestyleCreep(months) {
  const n = months.length;
  if (n < 4) return { available: false, warning: false, driftPP: 0 };
  const w = n >= 6 ? 3 : 2, prev = months.slice(-2 * w, -w), curr = months.slice(-w);
  if ([...prev, ...curr].some((m) => m.income <= 0)) return { available: false, warning: false, driftPP: 0 };
  const ratioPrev = avg(prev.map((m) => m.wants / m.income)), ratioCurr = avg(curr.map((m) => m.wants / m.income));
  const growth = (a, b) => b > 0 ? (a - b) / b * 100 : a > 0 ? Infinity : 0;
  const driftPP = (ratioCurr - ratioPrev) * 100;
  const wantsGrowthPct = growth(avg(curr.map((m) => m.wants)), avg(prev.map((m) => m.wants)));
  const incGrowthPct = growth(avg(curr.map((m) => m.income)), avg(prev.map((m) => m.income)));
  return { available: true, warning: driftPP >= 3 || (wantsGrowthPct > incGrowthPct + 5 && ratioCurr > .25), driftPP, wantsGrowthPct, incGrowthPct, ratioCurr, ratioPrev };
}

export const LEVELS = [
  { title: 'Cân bằng lại dòng tiền', description: 'Ưu tiên dừng thâm hụt. Rà soát các khoản mong muốn trước và giữ lại phần chi thiết yếu.', needs: .60, wants: .15, save: .25 },
  { title: 'Xây lớp đệm đầu tiên', description: 'Tích lũy đủ một tháng chi thiết yếu để chủ động trước những việc ngoài dự tính.', needs: .55, wants: .20, save: .25 },
  { title: 'Ưu tiên xóa nợ lãi cao', description: 'Trả tối thiểu mọi khoản nợ, sau đó dồn phần dư vào khoản có lãi suất cao nhất.', needs: .50, wants: .20, save: .30 },
  { title: 'Làm dày quỹ dự phòng', description: 'Tích lũy quỹ dự phòng theo mức thu nhập, từng bước tiến đến sự an tâm dài hạn.', needs: .50, wants: .25, save: .25 },
  { title: 'Vững vàng để tăng trưởng', description: 'Duy trì quỹ dự phòng, giữ kỷ luật chi tiêu và dành nguồn lực cho mục tiêu dài hạn.', needs: .50, wants: .30, save: .20 },
];
// Module 4 — FHI weights, five financial levels, adaptive allocation.
export function financialHealth({ yBase = 0, actualIncome = 0, totalNeedsWantsSpent = 0, avgMonthlyNeeds = 0, totalActiveFixedBills = 0, currWantsSpent = 0, debts = [], profile = DEFAULT_PROFILE, incomeMode = 'NO_INCOME', cashFlow = actualIncome - totalNeedsWantsSpent }) {
  const essentialMonthly = Math.max(avgMonthlyNeeds, totalActiveFixedBills, 1), runwayMonths = profile.liquidSavings / essentialMonthly;
  const targetRunway = incomeMode === 'IRREGULAR' ? 6 : 4.5;
  const netSavingsRate = actualIncome > 0 ? (actualIncome - totalNeedsWantsSpent) / actualIncome : 0;
  const fixedCostRatio = yBase > 0 ? totalActiveFixedBills / yBase : 1;
  const totalMinDebtPayments = sum(debts.filter((d) => d.principal > 0).map((d) => d.minMonthlyPayment));
  const dtiRatio = yBase > 0 ? totalMinDebtPayments / yBase : 0;
  const hasHighInterestDebt = debts.some((d) => d.principal > 0 && d.apr > 10), wantsRatio = yBase > 0 ? currWantsSpent / yBase : 1;
  const sSavings = netSavingsRate <= 0 ? 0 : netSavingsRate <= .2 ? netSavingsRate / .2 * 80 : Math.min(100, 80 + (netSavingsRate - .2) / .1 * 20);
  const sRunway = clamp(runwayMonths / targetRunway * 100, 0, 100);
  const sFixed = clamp((1 - (fixedCostRatio - .5) / .35) * 100, 0, 100);
  const sDebt = clamp((1 - Math.max(0, dtiRatio - .1) / .3) * 100, 0, 100) * (hasHighInterestDebt ? .6 : 1);
  const sControl = clamp((1 - (wantsRatio - .3) / .25) * 100, 0, 100);
  const fhi = round1(.25 * sSavings + .30 * sRunway + .20 * sFixed + .15 * sDebt + .10 * sControl);
  const level = netSavingsRate < 0 || cashFlow < 0 ? 1 : runwayMonths < 1 ? 2 : hasHighInterestDebt ? 3 : runwayMonths < targetRunway ? 4 : 5;
  const strategy = LEVELS[level - 1];
  let alloc = { needs: strategy.needs, wants: strategy.wants, save: strategy.save };
  if (fixedCostRatio > alloc.needs) {
    const needs = Math.min(.75, fixedCostRatio), excess = needs - alloc.needs;
    const wants = Math.max(.10, alloc.wants - excess);
    alloc = { needs, wants, save: Math.max(.05, 1 - needs - wants) };
  }
  const label = fhi < 40 ? 'Dễ tổn thương' : fhi < 70 ? 'Đang xoay xở' : fhi < 85 ? 'Ổn định' : 'Vững tài chính';
  return { fhi, label, level, strategy, alloc, scores: { sSavings, sRunway, sFixed, sDebt, sControl }, essentialMonthly, runwayMonths, targetRunway, netSavingsRate, fixedCostRatio, dtiRatio, hasHighInterestDebt, wantsRatio, totalMinDebtPayments };
}

// Module 5 — committed fixed bills are reserved exactly once.
export function safeToSpend({ yBase = 0, alloc = { save: .25 }, totalActiveFixedBills = 0, currentMonthVariableSpent = 0, elapsedDays = 1, daysInMonth = 30 }) {
  const savingsTargetMonthly = Math.round(yBase * alloc.save), savingsTargetDaily = Math.round(savingsTargetMonthly / daysInMonth);
  const variableBudgetTotal = Math.max(0, yBase - totalActiveFixedBills - savingsTargetMonthly);
  const remainingVariablePool = variableBudgetTotal - currentMonthVariableSpent, daysLeft = Math.max(1, daysInMonth - elapsedDays + 1);
  const dailySafeToSpend = Math.round(Math.max(0, remainingVariablePool) / daysLeft);
  const variableBurnRatio = variableBudgetTotal > 0 && elapsedDays > 0 ? currentMonthVariableSpent / variableBudgetTotal / (elapsedDays / daysInMonth) : 0;
  const status = variableBudgetTotal === 0 && currentMonthVariableSpent > 0 ? 'danger' : variableBurnRatio <= 1 ? 'safe' : variableBurnRatio <= 1.15 ? 'notice' : variableBurnRatio <= 1.3 ? 'warning' : 'danger';
  return { savingsTargetMonthly, savingsTargetDaily, variableBudgetTotal, remainingVariablePool, daysLeft, dailySafeToSpend, variableBurnRatio, status };
}

// Module 6 — bounded deterministic cuts; keep every cut a multiple of 50,000.
export function cutbackPlan({ yBase = 0, blendedEomForecast = 0, savingsTargetMonthly = 0, categoryAverages = [], daysInMonth = 30 }) {
  const projectedSurplus = yBase - blendedEomForecast, savingsGap = Math.max(0, savingsTargetMonthly - projectedSurplus);
  let remainingGap = savingsGap;
  const actions = [], totalWants = sum(categoryAverages.map((c) => c.amount));
  for (const { category, amount: amt } of [...categoryAverages].sort((a, b) => b.amount - a.amount)) {
    if (remainingGap <= 0 || totalWants <= 0) break;
    const maxCut = Math.round(amt * 35 / 100);
    const rawShare = Math.min(maxCut, Math.max(remainingGap * (amt / totalWants), Math.min(remainingGap, maxCut)));
    const suggestedCut = Math.min(Math.round(rawShare / 50000) * 50000, Math.floor(maxCut / 50000) * 50000, Math.floor(remainingGap / 50000) * 50000);
    if (suggestedCut < 50000) continue;
    actions.push({ category, currentAvg: Math.round(amt), suggestedCut, newCap: Math.round(amt - suggestedCut), cutPct: round1(suggestedCut / amt * 100), dailySaveGain: Math.round(suggestedCut / daysInMonth) });
    remainingGap -= suggestedCut;
  }
  return { projectedSurplus, savingsGap, actions, unmetGap: remainingGap };
}

/** Level-payment debt model. Returns explicit infeasible/limit states, no infinite loop. */
export function simulateDebtPayoff(debts, extraMonthly = 0) {
  const active = debts.filter((d) => d.principal > 0).sort((a, b) => b.apr - a.apr || a.principal - b.principal);
  const simulate = (extra) => {
    const ds = active.map((d) => ({ ...d, balance: d.principal }));
    const budget = sum(ds.map((d) => d.minMonthlyPayment)) + Math.max(0, extra);
    if (!ds.length) return { months: 0, interest: 0, paidOff: true };
    let interest = 0;
    for (let month = 1; month <= 1200; month++) {
      const before = sum(ds.map((d) => d.balance));
      for (const d of ds) { const i = d.balance * d.apr / 1200; interest += i; d.balance += i; }
      let available = budget;
      for (const d of ds) { const payment = Math.min(d.balance, d.minMonthlyPayment, available); d.balance -= payment; available -= payment; }
      for (const d of ds) { const payment = Math.min(d.balance, available); d.balance -= payment; available -= payment; }
      if (ds.every((d) => d.balance < 1)) return { months: month, interest: Math.round(interest), paidOff: true };
      if (sum(ds.map((d) => d.balance)) >= before) return { months: null, interest: Math.round(interest), paidOff: false };
    }
    return { months: null, interest: Math.round(interest), paidOff: false };
  };
  const baseline = simulate(0), accelerated = simulate(extraMonthly);
  return { orderedDebts: active, baseline, accelerated, interestSaved: baseline.paidOff && accelerated.paidOff ? Math.max(0, baseline.interest - accelerated.interest) : null };
}

export function analyzeFinance({ transactions = [], recurring_bills = [], debts = [], profile = DEFAULT_PROFILE }, date = new Date()) {
  transactions = transactions.filter(isPlanTransaction);
  const today = localDate(date), key = today.slice(0, 7), elapsedDays = date.getDate(), daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const months = aggregateMonths(transactions, date), current = months.find((m) => m.month === key) || { month: key, income: 0, needs: 0, wants: 0, spent: 0, variable: 0, savings_debt: 0 };
  const firstMonth = months[0]?.month;
  const history = firstMonth ? monthKeys(new Date(date.getFullYear(), date.getMonth() - 1, 1), 120).filter((m) => m >= firstMonth).map((m) => months.find((x) => x.month === m) || { month: m, income: 0, needs: 0, wants: 0, spent: 0, variable: 0, savings_debt: 0 }) : [];
  const incomeMonths = [...history, ...(current.income > 0 ? [current] : [])].slice(-12);
  const income = classifyIncome(incomeMonths.map((m) => m.income), current.income, profile.incomeModeOverride);
  const currentTs = transactions.filter((t) => t.date.startsWith(key) && t.date <= today);
  const fixedTs = currentTs.filter((t) => t.type === 'expense' && t.isFixedBill && ['needs', 'wants'].includes(t.group));
  const activeBills = recurring_bills.filter((b) => b.active);
  // Match each payment once. Partial payments leave the remaining bill reserved.
  const paymentPool = fixedTs.map((t) => ({ ...t, left: t.amount })).sort((x, y) => Number(!!y.flow?.billId) - Number(!!x.flow?.billId));
  const bills = activeBills.map((b) => {
    let remaining = b.amount; const payments = [];
    for (const p of paymentPool) {
      if (p.left <= 0 || (p.flow?.billId ? p.flow.billId !== b.id : p.category !== b.category || p.group !== b.group)) continue;
      const used = Math.min(p.left, remaining); p.left -= used; remaining -= used;
      payments.push({ id: p.id, amount: used });
      if (!remaining) break;
    }
    return { ...b, remaining, paid: remaining === 0, payments };
  });
  const paidFixedBills = sum(fixedTs.map((t) => t.amount)), unpaidFixedBills = sum(bills.map((b) => b.remaining));
  const totalActiveFixedBills = Math.max(sum(activeBills.map((b) => b.amount)), paidFixedBills + unpaidFixedBills);
  const health = financialHealth({ yBase: income.yBase, actualIncome: current.income, totalNeedsWantsSpent: current.spent, avgMonthlyNeeds: avg(history.length ? history.slice(-6).map((m) => m.needs) : [current.needs]), totalActiveFixedBills, currWantsSpent: current.wants, debts, profile, incomeMode: income.mode });
  const forecast = forecastSpending({ hist: history.map((m) => m.spent), currVarSpent: current.variable, paidFixedBills, unpaidFixedBills, elapsedDays, daysInMonth });
  const safe = safeToSpend({ yBase: income.yBase, alloc: health.alloc, totalActiveFixedBills, currentMonthVariableSpent: current.variable, elapsedDays, daysInMonth });
  const categoryMonths = history.length ? history.slice(-6).map((m) => m.month) : [key];
  const categoryAverages = [...new Set(transactions.filter((t) => t.group === 'wants').map((t) => t.category))].map((category) => ({ category, amount: Math.round(sum(transactions.filter((t) => t.type === 'expense' && t.group === 'wants' && t.category === category && categoryMonths.includes(t.date.slice(0, 7)) && t.date <= today).map((t) => t.amount)) / categoryMonths.length) }));
  const cutbacks = cutbackPlan({ yBase: income.yBase, blendedEomForecast: forecast.blendedEomForecast, savingsTargetMonthly: safe.savingsTargetMonthly, categoryAverages, daysInMonth });
  return { today, month: key, elapsedDays, daysInMonth, history, current, currentTs, income, health, forecast, safe, cutbacks, bills, totalActiveFixedBills, paidFixedBills, unpaidFixedBills, anomalies: detectAnomalies(transactions, income.yBase, date), payday: paydaySpike(transactions, profile.paydayDay, date), lifestyle: lifestyleCreep(history), debtPlan: simulateDebtPayoff(debts, Math.max(0, safe.savingsTargetMonthly - health.totalMinDebtPayments)) };
}
