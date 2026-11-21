import { CATEGORIES, DEFAULT_PROFILE, localDate } from './finance-engine.js';
import { uuid } from './db.js';

/** Six complete months plus the current month to exercise cold-start-free analysis. */
export function createSeedData(date = new Date()) {
  const transactions = [];
  const add = (dateString, amount, group, category, note = '', isFixedBill = false) => transactions.push({ id: uuid(), date: dateString, type: group === 'income' ? 'income' : 'expense', amount: Math.round(amount), group, category, isFixedBill, note, createdAt: new Date(`${dateString}T12:00:00`).getTime() });
  for (let offset = -6; offset <= 0; offset++) {
    const first = new Date(date.getFullYear(), date.getMonth() + offset, 1), key = localDate(first).slice(0, 7);
    const last = offset === 0 ? date.getDate() : new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const ds = (day) => `${key}-${String(day).padStart(2, '0')}`;
    // Current income is recorded on day 1 so the demo is useful on every day.
    add(ds(offset === 0 ? 1 : 5), 18000000, 'income', CATEGORIES.income[0], 'Thu nhập minh họa');
    add(ds(1), 4000000, 'needs', CATEGORIES.needs[0], 'Tiền thuê nhà', true);
    if (last >= 3) add(ds(3), 600000, 'needs', CATEGORIES.needs[1], 'Điện, nước và Internet', true);
    if (last >= 10) add(ds(10), 150000, 'wants', CATEGORIES.wants[3], 'Gói nghe nhạc và lưu trữ', true);
    for (let day = 1; day <= last; day++) {
      add(ds(day), 45000 + (day % 3) * 10000, 'needs', CATEGORIES.needs[2], 'Đi chợ, nấu ăn');
      const afterPayday = (day - 5 + 30) % 30 <= 4;
      const later = offset >= -3;
      add(ds(day), afterPayday ? (later ? 260000 : 180000) : (later ? 95000 : 35000), 'wants', CATEGORIES.wants[0], afterPayday ? 'Ăn ngoài sau ngày lương' : 'Cafe và ăn nhẹ');
      if (day % 5 === 0) add(ds(day), 65000, 'needs', CATEGORIES.needs[3], 'Xăng xe');
    }
    for (const day of [8, 18, 25]) if (day <= last) add(ds(day), offset >= -3 ? 750000 : 280000, 'wants', CATEGORIES.wants[1], 'Mua đồ cá nhân');
    if (last >= 15) add(ds(15), 400000, 'savings_debt', CATEGORIES.savings_debt[1], 'Trả tối thiểu thẻ tín dụng');
    if (offset === -1) {
      add(ds(12), 1700000, 'wants', CATEGORIES.wants[0], 'Bữa tiệc phát sinh ngoài dự tính');
      add(ds(20), 3200000, 'wants', CATEGORIES.wants[1], 'Mua sắm đột xuất');
    }
  }
  return {
    transactions,
    recurring_bills: [
      { id: uuid(), name: 'Tiền thuê nhà', amount: 4000000, dueDay: 1, category: CATEGORIES.needs[0], group: 'needs', active: true },
      { id: uuid(), name: 'Điện, nước & Internet', amount: 600000, dueDay: 3, category: CATEGORIES.needs[1], group: 'needs', active: true },
      { id: uuid(), name: 'Gói dịch vụ hằng tháng', amount: 150000, dueDay: 10, category: CATEGORIES.wants[3], group: 'wants', active: true },
    ],
    debts: [{ id: uuid(), name: 'Thẻ tín dụng', principal: 12000000, apr: 24, minMonthlyPayment: 400000, isHighInterest: true }],
    profile: { ...DEFAULT_PROFILE, liquidSavings: 10000000 },
  };
}
