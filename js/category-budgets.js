import { monthlyMoney } from './money-flow.js';

// Optional starter amounts, in whole VND. These are editable targets.
const trialLimits = new Map([
  ['ăn uống', { limit: 2400000, pace: 'daily' }],
  ['sinh hoạt', { limit: 1800000, pace: 'monthly' }],
  ['di chuyển', { limit: 800000, pace: 'daily' }],
  ['dịch vụ', { limit: 50000, pace: 'monthly' }],
  ['improvement', { limit: 500000, pace: 'monthly', label: 'Phát triển bản thân' }],
  ['friend', { limit: 550000, pace: 'monthly', label: 'Bạn bè' }],
  ['shopping', { limit: 450000, pace: 'monthly', label: 'Mua sắm' }],
]);

export const budgetCategoryKey = (category) => category.trim().normalize('NFC').toLocaleLowerCase('vi-VN');
export const budgetCategoryLabel = (category) => trialLimits.get(budgetCategoryKey(category))?.label || category;

export function isBudgetEvent(transaction) {
  if (transaction.isFixedBill) return false;
  if (transaction.budgetTiming) return transaction.budgetTiming === 'event';
  const note = (transaction.note || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replaceAll('đ', 'd');
  return /\b(bao duong xe|sua xe|thay (bo nuoc|nhot|lop xe|ac quy)|kham (sk|suc khoe) .*bang lai)\b/.test(note);
}

export function categoryLimitsForMonth(profile, month) {
  const limits = profile.categoryLimits ?? {};
  const effectiveMonth = Object.keys(limits).filter((key) => key <= month).sort().at(-1);
  const entries = limits[effectiveMonth] ?? [];
  if (effectiveMonth === month) return entries;
  return entries.filter((entry) => entry.limit !== null).map((entry) => ({ ...entry, eventLimit: null }));
}

export function suggestedCategoryLimits(rows) {
  return rows.flatMap((row) => {
    const trial = trialLimits.get(budgetCategoryKey(row.category));
    return trial && row.limit === null ? [{ category: row.category, limit: trial.limit, pace: trial.pace, eventLimit: row.eventLimit }] : [];
  });
}

function budgetStatus(remaining, afterBills, aheadOfPace, limit) {
  if (limit === null) return 'unset';
  if (remaining < 0) return 'over';
  if (afterBills < 0) return 'bills';
  if (afterBills === 0) return 'full';
  if (aheadOfPace) return 'fast';
  if (afterBills <= limit * .1) return 'near';
  return 'within';
}

export function analyzeCategoryBudgets(data, analysis, monthly = monthlyMoney(data, analysis)) {
  const buckets = new Map();
  function bucket(category) {
    const key = budgetCategoryKey(category);
    if (!buckets.has(key)) buckets.set(key, { category, limit: null, eventLimit: null, pace: 'monthly', spent: 0, eventSpent: 0, fixedSpent: 0, unpaid: 0, essential: false, nextBill: null });
    return buckets.get(key);
  }
  for (const record of categoryLimitsForMonth(data.profile, analysis.month)) Object.assign(bucket(record.category), record);
  for (const transaction of monthly.ordinary) {
    const row = bucket(transaction.category);
    row.essential ||= transaction.group === 'needs';
    if (isBudgetEvent(transaction)) row.eventSpent += transaction.amount;
    else {
      row.spent += transaction.amount;
      if (transaction.isFixedBill) row.fixedSpent += transaction.amount;
    }
  }
  for (const bill of analysis.bills) {
    if (!bill.remaining) continue;
    const row = bucket(bill.category);
    row.essential ||= bill.group === 'needs';
    row.unpaid += bill.remaining;
    if (!row.nextBill || bill.dueDay < row.nextBill.dueDay) row.nextBill = bill;
  }

  const elapsed = Number(monthly.latest?.slice(8) ?? 0);
  const daysLeft = analysis.daysInMonth - elapsed;
  return [...buckets.values()].map((row) => {
    const remaining = row.limit === null ? null : row.limit - row.spent;
    const afterBills = remaining === null ? null : remaining - row.unpaid;
    const daily = row.limit !== null && row.pace === 'daily' && elapsed > 0 && daysLeft > 0;
    const usableForDaily = Math.max(0, row.limit - row.fixedSpent - row.unpaid);
    const aheadOfPace = daily && (row.spent - row.fixedSpent) * analysis.daysInMonth > usableForDaily * elapsed;
    return { ...row, remaining, afterBills,
      status: budgetStatus(remaining, afterBills, aheadOfPace, row.limit),
      perDay: daily ? Math.max(0, Math.floor(afterBills / daysLeft)) : null,
      daysLeft, eventRemaining: row.eventLimit === null ? null : row.eventLimit - row.eventSpent };
  }).sort((left, right) => Number(right.status === 'over') - Number(left.status === 'over') || right.spent - left.spent || left.category.localeCompare(right.category, 'vi-VN'));
}
