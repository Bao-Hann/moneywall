import { DEFAULT_PROFILE, GROUP_LABELS } from './finance-engine.js';

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
export function transactionFingerprint(t) {
  const norm = (value) => String(value || '').normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi-VN');
  return JSON.stringify([t.date, t.type, t.amount, norm(t.category), norm(t.note)]);
}
/** Multiset comparison keeps legitimately repeated purchases in the source file. */
export function markExistingTransactions(incoming, existing) {
  const counts = new Map();
  for (const t of existing) { const key = transactionFingerprint(t); counts.set(key, (counts.get(key) || 0) + 1); }
  return incoming.map((t) => { const key = transactionFingerprint(t), count = counts.get(key) || 0; if (count) counts.set(key, count - 1); return count > 0; });
}
export async function appendTransactions(records, { skipDuplicates = true } = {}) {
  if (!Array.isArray(records) || records.length > 10000) throw new Error('Mỗi lần nhập tối đa 10.000 giao dịch.');
  const clean = records.map((record) => validateRecord('transactions', record));
  if (new Set(clean.map((t) => t.id)).size !== clean.length) throw new Error('Có mã giao dịch trùng nhau trong tệp nhập.');
  const select = (existing) => {
    const duplicate = markExistingTransactions(clean, existing), ids = new Set(existing.map((t) => t.id));
    const accepted = clean.filter((t, i) => !skipDuplicates || !duplicate[i]);
    if (accepted.some((t) => ids.has(t.id))) throw new Error('Mã giao dịch đã tồn tại. Đọc lại tệp để thử lại.');
    return { accepted, imported: accepted.length, skipped: clean.length - accepted.length };
  };
  if (!database) {
    const result = select([...memory.transactions.values()]);
    for (const t of result.accepted) memory.transactions.set(t.id, clone(t));
    return { imported: result.imported, skipped: result.skipped };
  }
  return new Promise((resolve, reject) => {
    const tx = database.transaction('transactions', 'readwrite'), store = tx.objectStore('transactions');
    let result, failure;
    const read = store.getAll();
    read.onsuccess = () => {
      try { result = select(read.result); for (const t of result.accepted) store.add(t); }
      catch (error) { failure = error; tx.abort(); }
    };
    tx.oncomplete = () => resolve({ imported: result.imported, skipped: result.skipped });
    tx.onerror = () => reject(failure || tx.error || new Error('Không thể nhập dữ liệu. Có thể bộ nhớ đã đầy.'));
    tx.onabort = () => reject(failure || tx.error || new Error('Chưa nhập giao dịch nào. Dữ liệu cũ được giữ nguyên.'));
  });
}
export async function readData() {
  const [transactions, recurring_bills, debts, profiles] = await Promise.all(STORES.map(getAll));
  return { transactions, recurring_bills, debts, profile: profiles.find((p) => p.id === 'default') || { ...DEFAULT_PROFILE } };
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
export function validateRecord(store, value) {
  assert(value && typeof value === 'object' && !Array.isArray(value), 'Bản ghi không hợp lệ.');
  const id = text(value.id, 'Mã bản ghi', 100);
  if (store === 'transactions') {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(value.date) && value.date.slice(0, 4) >= '1900' && new Date(`${value.date}T12:00:00Z`).toISOString().slice(0, 10) === value.date, 'Ngày giao dịch không hợp lệ.');
    assert(['income', 'expense'].includes(value.type) && Object.hasOwn(GROUP_LABELS, value.group), 'Loại hoặc nhóm giao dịch không hợp lệ.');
    assert((value.type === 'income') === (value.group === 'income'), 'Loại giao dịch không khớp với nhóm.');
    assert(typeof value.note === 'string' && value.note.length <= 1000, 'Ghi chú tối đa 1.000 ký tự.');
    money(value.createdAt, 'Thời điểm tạo');
    return { id, date: value.date, type: value.type, amount: money(value.amount, 'Số tiền', false), group: value.group, category: text(value.category, 'Danh mục'), isFixedBill: bool(value.isFixedBill, 'Hóa đơn cố định'), note: value.note, createdAt: value.createdAt };
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
  return { id, liquidSavings: money(value.liquidSavings, 'Quỹ dự phòng'), paydayDay: day(value.paydayDay), incomeModeOverride: value.incomeModeOverride, theme: value.theme, lastBackupAt: value.lastBackupAt };
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
  const rows = [['Ngày', 'Loại', 'Số tiền (VND)', 'Nhóm', 'Danh mục', 'Hóa đơn cố định', 'Ghi chú'], ...[...transactions].sort((a, b) => a.date.localeCompare(b.date)).map((t) => [t.date, t.type === 'income' ? 'Thu' : 'Chi', t.amount, GROUP_LABELS[t.group], t.category, t.isFixedBill ? 'Có' : 'Không', t.note])];
  return '\uFEFF' + rows.map((r) => r.map(cell).join(',')).join('\r\n');
}
