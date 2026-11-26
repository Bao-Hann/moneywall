import { DEFAULT_PROFILE, GROUP_LABELS, localDate } from './finance-engine.js';
import { FLOW_LABELS, changeTransaction, isLivingExpense, kindOf } from './money-flow.js';
import { budgetCategoryKey, categoryLimitsForMonth } from './category-budgets.js';

const STORES = ['transactions', 'recurring_bills', 'debts', 'profile'];
const memory = Object.fromEntries(STORES.map((s) => [s, new Map()]));
let database = null;
export const storageState = { mode: 'opening', persistent: false, message: '' };
const clone = (v) => JSON.parse(JSON.stringify(v));
export const uuid = () => globalThis.crypto?.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });

export async function storageStatus(request = false) {
  try {
    if (request) await navigator.storage?.persist?.();
    storageState.persistent = await navigator.storage?.persisted?.() || false;
  } catch { storageState.persistent = false; }
  return { ...storageState };
}
export async function initDB() {
  try {
    if (!globalThis.indexedDB) throw new Error('IndexedDB unavailable');
    database = await new Promise((resolve, reject) => {
      let done = false;
      const request = indexedDB.open('vung_tai_chinh_db', 1);
      const timeout = setTimeout(() => { done = true; reject(new Error('Database timeout')); }, 5000);
      request.onupgradeneeded = () => { for (const name of STORES) if (!request.result.objectStoreNames.contains(name)) request.result.createObjectStore(name, { keyPath: 'id' }); };
      request.onsuccess = () => { clearTimeout(timeout); if (done) request.result.close(); else { done = true; resolve(request.result); } };
      request.onerror = () => { clearTimeout(timeout); done = true; reject(request.error); };
      request.onblocked = () => { storageState.message = 'Hãy đóng các thẻ Vững Tài Chính khác rồi tải lại trang.'; };
    });
    database.onversionchange = () => { database.close(); database = null; storageState.mode = 'memory'; storageState.message = 'Dữ liệu tạm thời trong thẻ này. Hãy tải lại để kết nối kho dữ liệu.'; };
    storageState.mode = 'indexeddb';
  } catch {
    storageState.mode = 'memory';
    storageState.message = 'Trình duyệt đang chặn lưu dữ liệu. Dữ liệu chỉ giữ trong thẻ này; hãy sao lưu trước khi đóng.';
  }
  await storageStatus(true);
  if (!(await getAll('profile')).length) await putRecord('profile', { ...DEFAULT_PROFILE });
  return { ...storageState };
}
function storeRequest(name, method, argument, write = false) {
  if (!STORES.includes(name)) return Promise.reject(new Error('Kho dữ liệu không hợp lệ.'));
  if (!database) {
    if (method === 'getAll') return Promise.resolve([...memory[name].values()].map(clone));
    if (method === 'put') memory[name].set(argument.id, clone(argument));
    if (method === 'delete') memory[name].delete(argument);
    return Promise.resolve(argument);
  }
  return new Promise((resolve, reject) => {
    const tx = database.transaction(name, write ? 'readwrite' : 'readonly');
    const request = tx.objectStore(name)[method](...(argument === undefined ? [] : [argument]));
    let result;
    request.onsuccess = () => { result = request.result; };
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error || new Error('Không thể lưu dữ liệu. Có thể bộ nhớ đã đầy.'));
    tx.onabort = () => reject(tx.error || new Error('Thao tác chưa được lưu.'));
  });
}
export const getAll = (name) => storeRequest(name, 'getAll');
export const putRecord = (name, value) => storeRequest(name, 'put', validateRecord(name, value), true);
export const deleteRecord = (name, id) => storeRequest(name, 'delete', id, true);

export async function saveCategoryLimits(month, changes, onlyMissing = false) {
  const update = (current) => {
    const profile = { ...DEFAULT_PROFILE, ...current };
    const entries = new Map(categoryLimitsForMonth(profile, month).map((entry) => [budgetCategoryKey(entry.category), entry]));
    for (const entry of changes) {
      const key = budgetCategoryKey(entry.category);
      const previous = entries.get(key);
      if (onlyMissing && previous?.limit != null) continue;
      const updated = onlyMissing && previous ? { ...entry, eventLimit: previous.eventLimit } : entry;
      if (updated.limit === null && updated.eventLimit === null) entries.delete(key);
      else entries.set(key, updated);
    }
    return validateRecord('profile', { ...profile, categoryLimits: { ...profile.categoryLimits, [month]: [...entries.values()] } });
  };
  if (!database) {
    memory.profile.set('default', update(memory.profile.get('default')));
    return;
  }
  await new Promise((resolve, reject) => {
    const tx = database.transaction('profile', 'readwrite');
    const store = tx.objectStore('profile'), read = store.get('default');
    let failure;
    read.onsuccess = () => {
      try { store.put(update(read.result)); }
      catch (error) { failure = error; tx.abort(); }
    };
    tx.oncomplete = resolve;
    tx.onabort = tx.onerror = () => reject(failure || tx.error || new Error('Chưa lưu được mức chi. Hãy thử lại.'));
  });
}
// Ledger changes and their fund/debt effects commit or roll back together.
export async function saveTransaction(record, removingId = '', today = localDate()) {
  const next = record ? validateRecord('transactions', record) : null, id = next?.id || removingId;
  if (!id) throw new Error('Thiếu khoản cần cập nhật.');
  const prepare = (data) => {
    const result = changeTransaction(data, next, id, today);
    return { ...result, profile: validateRecord('profile', result.profile), debts: result.debts.map((d) => validateRecord('debts', d)) };
  };
  if (!database) {
    const result = prepare(await readData());
    if (next) memory.transactions.set(id, clone(next)); else memory.transactions.delete(id);
    memory.profile.set('default', clone(result.profile));
    for (const d of result.debts) memory.debts.set(d.id, clone(d));
    return;
  }
  await new Promise((resolve, reject) => {
    const tx = database.transaction(['transactions', 'profile', 'debts'], 'readwrite');
    const data = {}, names = ['transactions', 'profile', 'debts']; let ready = 0, failure;
    for (const name of names) {
      const request = tx.objectStore(name).getAll();
      request.onsuccess = () => {
        data[name] = name === 'profile' ? { ...DEFAULT_PROFILE, ...(request.result.find((p) => p.id === 'default') || {}) } : request.result;
        if (++ready !== names.length) return;
        try {
          const result = prepare(data);
          if (next) tx.objectStore('transactions').put(next); else tx.objectStore('transactions').delete(id);
          tx.objectStore('profile').put(result.profile);
          for (const d of result.debts) tx.objectStore('debts').put(d);
        } catch (error) { failure = error; tx.abort(); }
      };
    }
    tx.oncomplete = resolve;
    tx.onerror = tx.onabort = () => reject(failure || tx.error || new Error('Chưa lưu được thay đổi. Các số dư cũ được giữ nguyên.'));
  });
}
export function transactionFingerprint(t) {
  const norm = (value) => String(value || '').normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi-VN');
  return JSON.stringify([t.date, t.type, t.amount, norm(t.category), norm(t.note)]);
}
/** Multiset comparison keeps legitimately repeated purchases in the source file. */
export function markExistingTransactions(incoming, existing) {
  return matchExistingTransactions(incoming, existing).map((i) => i !== -1);
}
export function compareExcelWithLedger(fileRows, ledger) {
  const months = new Set(fileRows.map((row) => row.transaction.date.slice(0, 7)));
  const sameMonths = ledger.filter((t) => months.has(t.date.slice(0, 7)));
  const matched = matchExistingTransactions(fileRows.map((row) => row.transaction), sameMonths);
  const matchedIndexes = new Set(matched);
  return {
    months: [...months].sort(),
    transactions: sameMonths,
    onlyInExcel: fileRows.filter((_, index) => matched[index] === -1),
    onlyInLedger: sameMonths.filter((_, index) => !matchedIndexes.has(index)).sort((a, b) => b.date.localeCompare(a.date)),
  };
}
export function matchExistingTransactions(incoming, existing) {
  const exact = new Map(), any = new Map(), unclassified = new Map(), used = new Set();
  const base = (t) => transactionFingerprint({ ...t, category: '' });
  const add = (map, key, i) => { if (!map.has(key)) map.set(key, []); map.get(key).push(i); };
  existing.forEach((t, i) => { add(exact, transactionFingerprint(t), i); add(any, base(t), i); if (t.category === 'Chưa phân loại') add(unclassified, base(t), i); });
  const take = (map, key) => { const q = map.get(key) || []; while (q.length && used.has(q.at(-1))) q.pop(); if (!q.length) return -1; const i = q.pop(); used.add(i); return i; };
  const matched = incoming.map((t) => take(exact, transactionFingerprint(t)));
  incoming.forEach((t, i) => { if (matched[i] === -1) matched[i] = take(t.category === 'Chưa phân loại' ? any : unclassified, base(t)); });
  return matched;
}
export function planImport(clean, existing, { skipDuplicates = true, updateDetails = true } = {}) {
  const matches = matchExistingTransactions(clean, existing), accepted = [], updates = [], ids = new Set(existing.map((t) => t.id));
  clean.forEach((t, i) => {
    if (!skipDuplicates || matches[i] === -1) { if (ids.has(t.id)) throw new Error('Mã giao dịch đã tồn tại. Đọc lại tệp để thử lại.'); accepted.push(t); return; }
    const old = existing[matches[i]], updated = { ...old };
    if (updateDetails) {
      if (old.category === 'Chưa phân loại' && t.category !== old.category) { updated.category = t.category; updated.group = t.group; }
      if (kindOf(old) === 'regular' && ['deposit', 'refund', 'offset'].includes(kindOf(t))) { updated.flow = t.flow; updated.isFixedBill = false; }
      if (t.isFixedBill && !old.isFixedBill && kindOf(updated) === 'regular') updated.isFixedBill = true;
      if (JSON.stringify(updated) !== JSON.stringify(old)) updates.push(updated);
    }
  });
  return { accepted, updates, imported: accepted.length, updated: updates.length, skipped: clean.length - accepted.length };
}
export async function appendTransactions(records, { skipDuplicates = true, openingBalance = null, liquidSavings = null, updateDetails = true } = {}) {
  if (!Array.isArray(records) || records.length > 10000) throw new Error('Mỗi lần nhập tối đa 10.000 giao dịch.');
  const clean = records.map((record) => validateRecord('transactions', record));
  if (clean.some((t) => !['regular', 'deposit', 'refund', 'offset'].includes(kindOf(t)))) throw new Error('Ghi chuyển quỹ và trả nợ bằng chức năng trong sổ để cập nhật các số dư cùng lúc.');
  const opening = openingBalance ? validateOpeningBalance(openingBalance) : null;
  if (liquidSavings !== null) money(liquidSavings, 'Quỹ để dành từ Excel');
  const profileChanges = !!opening || liquidSavings !== null;
  const amendProfile = (profile) => {
    const next = { ...DEFAULT_PROFILE, ...profile };
    if (liquidSavings !== null) next.liquidSavings = liquidSavings;
    if (opening) {
      const { month, ...balances } = opening;
      next.openingBalances = { ...next.openingBalances, [month]: balances };
    }
    return validateRecord('profile', next);
  };
  if (new Set(clean.map((t) => t.id)).size !== clean.length) throw new Error('Có mã giao dịch trùng nhau trong tệp nhập.');
  const select = (existing) => {
    return planImport(clean, existing, { skipDuplicates, updateDetails });
  };
  if (!database) {
    const result = select([...memory.transactions.values()]);
    const nextProfile = profileChanges ? amendProfile(memory.profile.get('default')) : null;
    for (const t of [...result.accepted, ...result.updates]) memory.transactions.set(t.id, clone(t));
    if (nextProfile) memory.profile.set('default', clone(nextProfile));
    return { imported: result.imported, skipped: result.skipped, updated: result.updated };
  }
  return new Promise((resolve, reject) => {
    const tx = database.transaction(profileChanges ? ['transactions', 'profile'] : ['transactions'], 'readwrite'), store = tx.objectStore('transactions');
    let result, failure, existing, profile, rowsReady = false, profileReady = !profileChanges;
    const save = () => {
      if (!rowsReady || !profileReady) return;
      try {
        result = select(existing);
        const nextProfile = profileChanges ? amendProfile(profile) : null;
        for (const t of result.accepted) store.add(t);
        for (const t of result.updates) store.put(t);
        if (nextProfile) tx.objectStore('profile').put(nextProfile);
      } catch (error) { failure = error; tx.abort(); }
    };
    const read = store.getAll();
    read.onsuccess = () => { existing = read.result; rowsReady = true; save(); };
    if (profileChanges) { const readProfile = tx.objectStore('profile').get('default'); readProfile.onsuccess = () => { profile = readProfile.result; profileReady = true; save(); }; }
    tx.oncomplete = () => resolve({ imported: result.imported, skipped: result.skipped, updated: result.updated });
    tx.onerror = () => reject(failure || tx.error || new Error('Không thể nhập dữ liệu. Có thể bộ nhớ đã đầy.'));
    tx.onabort = () => reject(failure || tx.error || new Error('Chưa nhập giao dịch nào. Dữ liệu cũ được giữ nguyên.'));
  });
}
export async function readData() {
  const [transactions, recurring_bills, debts, profiles] = await Promise.all(STORES.map(getAll));
  return { transactions, recurring_bills, debts, profile: { ...DEFAULT_PROFILE, ...(profiles.find((p) => p.id === 'default') || {}) } };
}
export async function replaceData(data) {
  const clean = validateBackup({ app: 'vung-tai-chinh', version: 1, data });
  if (!database) {
    for (const s of STORES) { memory[s].clear(); for (const item of s === 'profile' ? [clean.profile] : clean[s]) memory[s].set(item.id, clone(item)); }
    return;
  }
  await new Promise((resolve, reject) => {
    const tx = database.transaction(STORES, 'readwrite');
    for (const s of STORES) { const store = tx.objectStore(s); store.clear(); for (const item of s === 'profile' ? [clean.profile] : clean[s]) store.put(item); }
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error || new Error('Không đủ bộ nhớ để khôi phục. Dữ liệu cũ được giữ nguyên.'));
    tx.onabort = () => reject(tx.error || new Error('Khôi phục chưa thành công. Dữ liệu cũ được giữ nguyên.'));
  });
}
const assert = (condition, message) => { if (!condition) throw new Error(message); };
function text(value, label, max = 200) { assert(typeof value === 'string' && value.trim().length > 0 && value.length <= max, `${label} không hợp lệ.`); return value.trim(); }
function money(value, label, allowZero = true) { assert(Number.isSafeInteger(value) && value >= (allowZero ? 0 : 1), `${label} phải là số nguyên ${allowZero ? 'không âm' : 'lớn hơn 0'}.`); return value; }
function bool(value, label) { assert(typeof value === 'boolean', `${label} không hợp lệ.`); return value; }
function day(value) { assert(Number.isInteger(value) && value >= 1 && value <= 31, 'Ngày phải từ 1 đến 31.'); return value; }
const validMonth = (month) => typeof month === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(month) && Number(month.slice(0, 4)) >= 1900;
export function validateOpeningBalance(value) {
  assert(value && typeof value === 'object' && validMonth(value.month), 'Tháng của số dư đầu kỳ không hợp lệ.');
  const bankIsSupport = bool(value.bankIsSupport ?? false, 'Cách tính tiền ngân hàng');
  return { month: value.month, bank: money(value.bank, 'Tiền ngân hàng'), cash: money(value.cash, 'Tiền mặt đầu tháng'), ...(bankIsSupport ? { bankIsSupport } : {}) };
}
function validateCategoryLimits(limits) {
  assert(limits && typeof limits === 'object' && !Array.isArray(limits) && Object.keys(limits).length <= 1200, 'Danh sách mức chi không hợp lệ.');
  const clean = {};
  for (const [month, entries] of Object.entries(limits)) {
    assert(validMonth(month) && Array.isArray(entries) && entries.length <= 1000, 'Mức chi theo tháng không hợp lệ.');
    clean[month] = entries.map((entry) => {
      assert(entry && ['daily', 'monthly'].includes(entry.pace), 'Cách theo dõi mức chi không hợp lệ.');
      return {
        category: text(entry.category, 'Danh mục'), pace: entry.pace,
        limit: entry.limit == null ? null : money(entry.limit, 'Mức chi thường xuyên'),
        eventLimit: entry.eventLimit == null ? null : money(entry.eventLimit, 'Dự trù khoản theo lần'),
      };
    });
    assert(new Set(clean[month].map((entry) => budgetCategoryKey(entry.category))).size === clean[month].length, 'Có danh mục đặt mức chi nhiều lần.');
  }
  return clean;
}
export function validateRecord(store, value) {
  assert(value && typeof value === 'object' && !Array.isArray(value), 'Bản ghi không hợp lệ.');
  const id = text(value.id, 'Mã bản ghi', 100);
  if (store === 'transactions') {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(value.date) && value.date.slice(0, 4) >= '1900' && new Date(`${value.date}T12:00:00Z`).toISOString().slice(0, 10) === value.date, 'Ngày giao dịch không hợp lệ.');
    assert(['income', 'expense'].includes(value.type) && Object.hasOwn(GROUP_LABELS, value.group), 'Loại hoặc nhóm giao dịch không hợp lệ.');
    assert((value.type === 'income') === (value.group === 'income'), 'Loại giao dịch không khớp với nhóm.');
    assert(typeof value.note === 'string' && value.note.length <= 1000, 'Ghi chú tối đa 1.000 ký tự.');
    money(value.createdAt, 'Thời điểm tạo');
    const result = { id, date: value.date, type: value.type, amount: money(value.amount, 'Số tiền', false), group: value.group, category: text(value.category, 'Danh mục'), isFixedBill: bool(value.isFixedBill, 'Hóa đơn cố định'), note: value.note, createdAt: value.createdAt };
    if (value.flow) {
      const kind = value.flow.kind;
      assert(Object.hasOwn(FLOW_LABELS, kind), 'Cách tính khoản tiền không hợp lệ.');
      assert(!(['deposit', 'reserve-in', 'debt'].includes(kind) && value.type !== 'expense') && !(['refund', 'reserve-out', 'offset'].includes(kind) && value.type !== 'income'), 'Cách tính không khớp khoản thu hoặc chi.');
      assert(!['reserve-in', 'debt'].includes(kind) || value.group === 'savings_debt', 'Chuyển quỹ và trả nợ cần thuộc nhóm Để dành & Trả nợ.');
      const flow = { kind };
      if (value.flow.targetId) flow.targetId = text(value.flow.targetId, 'Khoản liên kết', 100);
      if (value.flow.billId) { assert(kind === 'regular' && value.type === 'expense' && value.isFixedBill, 'Liên kết hóa đơn không hợp lệ.'); flow.billId = text(value.flow.billId, 'Hóa đơn liên kết', 100); }
      if (kind === 'debt') { assert(flow.targetId, 'Hãy chọn khoản nợ được trả.'); flow.principal = money(value.flow.principal, 'Phần trả gốc'); assert(flow.principal <= result.amount, 'Phần trả gốc không được lớn hơn tổng tiền đã trả.'); }
      if (kind !== 'regular' || flow.billId) result.flow = flow;
    }
    if (value.budgetTiming && isLivingExpense(result) && !result.isFixedBill) {
      assert(['routine', 'event'].includes(value.budgetTiming), 'Cách tính khoản chi không hợp lệ.');
      result.budgetTiming = value.budgetTiming;
    }
    return result;
  }
  if (store === 'recurring_bills') {
    assert(['needs', 'wants'].includes(value.group), 'Nhóm hóa đơn không hợp lệ.');
    return { id, name: text(value.name, 'Tên hóa đơn'), amount: money(value.amount, 'Số tiền', false), dueDay: day(value.dueDay), category: text(value.category, 'Danh mục'), group: value.group, active: bool(value.active, 'Trạng thái hóa đơn') };
  }
  if (store === 'debts') {
    assert(typeof value.apr === 'number' && Number.isFinite(value.apr) && value.apr >= 0 && value.apr <= 1000, 'Lãi suất phải từ 0 đến 1.000%/năm.');
    return { id, name: text(value.name, 'Tên khoản nợ'), principal: money(value.principal, 'Dư nợ'), apr: value.apr, minMonthlyPayment: money(value.minMonthlyPayment, 'Tiền trả tối thiểu'), isHighInterest: value.apr > 10 };
  }
  assert(store === 'profile' && id === 'default', 'Hồ sơ không hợp lệ.');
  assert(['AUTO', 'STABLE', 'IRREGULAR'].includes(value.incomeModeOverride) && ['light', 'dark'].includes(value.theme), 'Cài đặt không hợp lệ.');
  assert(value.lastBackupAt === null || Number.isSafeInteger(value.lastBackupAt) && value.lastBackupAt >= 0, 'Ngày sao lưu không hợp lệ.');
  const openingBalances = {}, rawBalances = value.openingBalances ?? {};
  assert(rawBalances && typeof rawBalances === 'object' && !Array.isArray(rawBalances) && Object.keys(rawBalances).length <= 1200, 'Danh sách số dư đầu tháng không hợp lệ.');
  for (const [key, amounts] of Object.entries(rawBalances)) {
    const { month, ...balances } = validateOpeningBalance({ ...amounts, month: key });
    openingBalances[month] = balances;
  }
  return { id, liquidSavings: money(value.liquidSavings, 'Quỹ dự phòng'), paydayDay: day(value.paydayDay), incomeModeOverride: value.incomeModeOverride, theme: value.theme, lastBackupAt: value.lastBackupAt, openingBalances, categoryLimits: validateCategoryLimits(value.categoryLimits ?? {}) };
}
export function validateBackup(input) {
  assert(input && input.app === 'vung-tai-chinh' && input.version === 1 && input.data, 'Tệp không đúng định dạng sao lưu Vững Tài Chính (phiên bản 1).');
  const clean = {};
  for (const s of STORES.slice(0, 3)) {
    assert(Array.isArray(input.data[s]) && input.data[s].length <= 100000, `Danh sách ${s} không hợp lệ hoặc quá lớn.`);
    clean[s] = input.data[s].map((item) => validateRecord(s, item));
    assert(new Set(clean[s].map((x) => x.id)).size === clean[s].length, 'Tệp có mã bản ghi trùng lặp.');
  }
  clean.profile = validateRecord('profile', input.data.profile);
  return clean;
}
export function createBackup(data, timestamp = Date.now()) {
  return JSON.stringify({ app: 'vung-tai-chinh', version: 1, exportedAt: new Date(timestamp).toISOString(), data: validateBackup({ app: 'vung-tai-chinh', version: 1, data }) }, null, 2);
}
export function createCSV(transactions) {
  const cell = (v) => { let s = String(v ?? ''); if (/^\s*[=+\-@]|^[\t\r]/.test(s)) s = `'${s}`; return `"${s.replaceAll('"', '""')}"`; };
  const rows = [['Ngày', 'Loại', 'Số tiền (VND)', 'Nhóm', 'Danh mục', 'Hóa đơn cố định', 'Ghi chú'], ...[...transactions].sort((a, b) => a.date.localeCompare(b.date)).map((t) => [t.date, kindOf(t) === 'offset' ? FLOW_LABELS.offset : t.type === 'income' ? 'Thu' : 'Chi', t.amount, GROUP_LABELS[t.group], t.category, t.isFixedBill ? 'Có' : 'Không', t.note])];
  return '\uFEFF' + rows.map((r) => r.map(cell).join(',')).join('\r\n');
}
