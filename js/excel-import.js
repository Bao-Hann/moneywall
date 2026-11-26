import { CATEGORIES, GROUP_LABELS, localDate } from './finance-engine.js';
import { validateRecord, uuid } from './db.js';
import { suggestFlow } from './money-flow.js';

export const MAX_IMPORT_ROWS = 10000;
const blank = (x) => x === undefined || x === null || x === '';
export const normalizeLabel = (x) => String(x ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('đ', 'd').replaceAll('Đ', 'D').toLowerCase().replace(/[^a-z0-9]/g, '');
const val = (cell) => cell && typeof cell === 'object' && !(cell instanceof Date) && Object.hasOwn(cell, 'v') ? cell.v : cell;

/** Arithmetic grammar only: no eval, cell references, functions, or external links. */
export function arithmeticFormula(formula) {
  const text = String(formula).replace(/^=/, '').replace(/\s+/g, '');
  if (!text.length || text.length > 500) throw new Error('Công thức quá dài hoặc trống.');
  const tokens = text.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[()+*/-]/g) || [];
  if (tokens.join('') !== text || tokens.length > 200) throw new Error('Công thức này cần kết quả đã lưu từ Excel.');
  let i = 0, depth = 0;
  function primary() {
    if (++depth > 30) throw new Error('Công thức lồng quá sâu.');
    let result;
    if (tokens[i] === '+' || tokens[i] === '-') { const sign = tokens[i++]; result = (sign === '-' ? -1 : 1) * primary(); }
    else if (tokens[i] === '(') { i++; result = expression(); if (tokens[i++] !== ')') throw new Error('Thiếu dấu ngoặc.'); }
    else { const token = tokens[i++]; if (!token || !/^[\d.]/.test(token)) throw new Error('Công thức không hợp lệ.'); result = Number(token); }
    depth--; return result;
  }
  function product() { let result = primary(); while (tokens[i] === '*' || tokens[i] === '/') { const op = tokens[i++], right = primary(); if (op === '/' && right === 0) throw new Error('Công thức chia cho 0.'); result = op === '*' ? result * right : result / right; } return result; }
  function expression() { let result = product(); while (tokens[i] === '+' || tokens[i] === '-') { const op = tokens[i++], right = product(); result = op === '+' ? result + right : result - right; } return result; }
  const result = expression();
  if (i !== tokens.length || !Number.isFinite(result) || Math.abs(result) > Number.MAX_SAFE_INTEGER) throw new Error('Kết quả công thức không hợp lệ.');
  return result;
}

export function parseMoney(cell, multiplier = 1) {
  const value = val(cell);
  let number, cachedFormula = false;
  if (cell?.f) {
    try { number = arithmeticFormula(cell.f); }
    catch (error) {
      if (typeof value === 'number' && Number.isFinite(value)) { number = value; cachedFormula = true; }
      else throw new Error('Công thức chưa có kết quả lưu. Mở Excel, tính lại và lưu tệp rồi nhập lại.');
    }
  } else if (typeof value === 'number') number = value;
  else {
    if (blank(value)) throw new Error('Thiếu số tiền.');
    let text = String(value).trim();
    if (text.startsWith('=')) number = arithmeticFormula(text);
    else {
      const negative = /^\(.*\)$/.test(text); text = text.replace(/[()]/g, '').replace(/\s|₫|đ|vnd/gi, '');
      if (text.includes(',') && text.includes('.')) {
        if (text.lastIndexOf(',') > text.lastIndexOf('.')) text = text.replaceAll('.', '').replace(',', '.');
        else text = text.replaceAll(',', '');
      } else if (/^[+-]?\d{1,3}([.,]\d{3})+$/.test(text)) text = text.replace(/[.,]/g, '');
      else if (text.includes(',')) text = text.replace(',', '.');
      if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) throw new Error('Không đọc được số tiền.');
      number = Number(text) * (negative ? -1 : 1);
    }
  }
  number = Math.round(number * multiplier);
  if (!Number.isSafeInteger(number)) throw new Error('Số tiền vượt giới hạn hoặc không hợp lệ.');
  return { amount: number, cachedFormula };
}

export function excelDate(cell, month, date1904 = false) {
  const value = val(cell);
  const result = (year, m, day) => {
    const date = new Date(Date.UTC(year, m - 1, day));
    if (year < 1900 || year > 9999 || date.getUTCFullYear() !== year || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== day) return null;
    return date.toISOString().slice(0, 10);
  };
  if (value instanceof Date) return result(value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate());
  if (typeof value === 'number') {
    if (value >= 1 && value <= 31 && /^\d{4}-\d{2}$/.test(month || '')) return result(Number(month.slice(0, 4)), Number(month.slice(5)), Math.floor(value));
    if (!Number.isFinite(value) || value < 0 || value > 2958465 || !date1904 && Math.floor(value) === 60) return null;
    const epoch = Date.UTC(date1904 ? 1904 : 1899, date1904 ? 0 : 11, date1904 ? 1 : Math.floor(value) < 60 ? 31 : 30);
    const d = new Date(epoch + Math.floor(value) * 86400000);
    return result(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  }
  const text = String(value ?? '').trim();
  let match = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T].*)?$/);
  if (match) return result(Number(match[1]), Number(match[2]), Number(match[3]));
  match = text.match(/^(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2}|\d{4}))?$/);
  if (match) {
    if (!match[3] && !/^\d{4}-\d{2}$/.test(month || '')) return null;
    return result(match[3] ? Number(match[3]) + (match[3].length === 2 ? 2000 : 0) : Number(month.slice(0, 4)), Number(match[2]), Number(match[1]));
  }
  if (/^\d{1,2}$/.test(text) && /^\d{4}-\d{2}$/.test(month || '')) return result(Number(month.slice(0, 4)), Number(month.slice(5)), Number(text));
  return null;
}

export function detectColumns(headers) {
  const labels = headers.map((c) => normalizeLabel(val(c)));
  const find = (names) => labels.findIndex((h) => names.includes(h));
  const categoryIndices = labels.flatMap((h, i) => ['danhmuc', 'phanloai', 'category', 'hangmuc'].includes(h) ? [i] : []);
  const category = categoryIndices.at(-1) ?? -1;
  const note = categoryIndices.length > 1 ? categoryIndices[0] : find(['noidung', 'diengiai', 'mota', 'khoanchi', 'tenkhoan', 'description', 'ghichu', 'note']);
  const extra = find(['note', 'ghichu']);
  return {
    date: find(['ngay', 'ngaygiaodich', 'thoigian', 'date']),
    amount: find(['vnd', 'sotien', 'sotienvnd', 'amount', 'tien', 'thuchi']),
    category, note, extra: extra === note ? -1 : extra,
    type: find(['loai', 'loaigiaodich', 'type']), group: find(['nhom', 'nhomchitieu', 'group']),
    fixed: find(['hoadon', 'hoadoncodinh', 'codinh', 'isfixedbill']),
  };
}
export function detectHeader(rows) {
  let winner = { index: 0, score: 0, mapping: detectColumns([]) };
  for (let i = 0; i < Math.min(30, rows.length); i++) {
    const mapping = detectColumns(rows[i]);
    const score = (mapping.date >= 0 ? 5 : 0) + (mapping.amount >= 0 ? 5 : 0) + (mapping.category >= 0 ? 2 : 0) + (mapping.note >= 0 ? 1 : 0);
    if (score > winner.score) winner = { index: i, score, mapping };
  }
  return winner;
}
export function workbookSheets(workbook, XLSX) {
  return workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    if (!sheet?.['!ref']) return { name, rows: [], merges: [], score: 0, header: detectHeader([]), date1904: false };
    const range = XLSX.utils.decode_range(sheet['!ref']);
    if (range.e.r > MAX_IMPORT_ROWS + 30 || range.e.c > 255) throw new Error('Bảng quá lớn. Giữ tối đa 10.000 dòng giao dịch và 256 cột mỗi trang rồi thử lại.');
    const rows = Array.from({ length: range.e.r + 1 }, (_, r) => Array.from({ length: range.e.c + 1 }, (_, c) => {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      return cell ? { v: cell.v ?? '', f: cell.f || '', t: cell.t } : null;
    }));
    const header = detectHeader(rows);
    return { name, rows, merges: sheet['!merges'] || [], score: header.score, header, date1904: !!workbook.Workbook?.WBProps?.date1904 };
  });
}

export function suggestedGroup(category) {
  const label = normalizeLabel(category);
  for (const [group, categories] of Object.entries(CATEGORIES)) if (categories.some((c) => normalizeLabel(c) === label)) return group;
  if (['income', 'thunhap', 'makemoney'].includes(label)) return 'income';
  if (/(shopping|muasam|friend|giaitri|du lich|qua|cafe|caph)/.test(label)) return 'wants';
  if (/(tietkiem|trano|dautu)/.test(label)) return 'savings_debt';
  return 'needs';
}
export function detectOpeningBalance(sheet, multiplier = 1) {
  let bank = null, cash = null;
  for (const row of sheet.rows.slice(0, 40)) for (let c = 0; c < row.length - 1; c++) {
    const label = normalizeLabel(val(row[c]));
    if (!['tknh', 'taikhoannganhang', 'nganhang', 'tienmat'].includes(label)) continue;
    try {
      const amount = parseMoney(row[c + 1], multiplier).amount;
      if (amount < 0) continue;
      if (label === 'tienmat') cash = amount; else bank = amount;
    } catch { /* An ambiguous or missing balance is left for manual entry. */ }
  }
  return bank !== null && cash !== null ? { bank, cash } : null;
}
export function detectSideBalances(sheet, multiplier = 1) {
  let liquidSavings = null, debt = null;
  for (const row of sheet.rows.slice(0, 40)) for (let c = 0; c < row.length - 1; c++) {
    const label = normalizeLabel(val(row[c]));
    if (!['tietkiem', 'quyduphong', 'quydedanh', 'duno'].includes(label)) continue;
    try {
      const amount = parseMoney(row[c + 1], multiplier).amount;
      if (amount < 0) continue;
      if (label === 'duno') debt = amount; else liquidSavings = amount;
    } catch { /* Side notes are suggestions only, never financial transactions. */ }
  }
  return { liquidSavings, debt };
}
export function hasDailyTotals(sheet, headerRow = sheet.header.index) {
  return (sheet.rows[headerRow] || []).some((cell) => ['tongchingay', 'tongchitrongngay', 'tongchitheongay'].includes(normalizeLabel(val(cell))));
}
export function buildImport(sheet, { headerRow = sheet.header.index, mapping = sheet.header.mapping, mode = 'signed', month = localDate().slice(0, 7), multiplier = 1, fillDates = false, categoryGroups = {}, offsetReceipts = false } = {}) {
  if (mapping.date < 0 || mapping.amount < 0) return { rows: [], errors: [{ row: headerRow + 1, message: 'Chọn cột ngày và cột số tiền trước khi nhập.' }], skipped: 0, categories: [] };
  if (mapping.date === mapping.amount) return { rows: [], errors: [{ row: headerRow + 1, message: 'Cột ngày và cột số tiền phải khác nhau.' }], skipped: 0, categories: [] };
  const records = [], errors = [], categories = new Set(); let previousDate = null, skipped = 0;
  const get = (row, field) => mapping[field] >= 0 ? row[mapping[field]] : null;
  for (let r = headerRow + 1; r < sheet.rows.length; r++) {
    const cells = sheet.rows[r], amountCell = get(cells, 'amount'), noteCell = get(cells, 'note'), categoryCell = get(cells, 'category');
    if (blank(val(amountCell)) && !amountCell?.f && blank(val(noteCell)) && blank(val(categoryCell))) continue;
    const label = String(val(noteCell) ?? '').trim(), rawCategory = String(val(categoryCell) ?? '').trim();
    if (/^(tong|tongcong|tongthu|tongchi|cong|sodu|sodudauky|soducuoiky|subtotal|total)$/.test(normalizeLabel(label)) || /^(tong|tongcong|tongthu|tongchi|subtotal|total)$/.test(normalizeLabel(rawCategory))) { skipped++; continue; }
    let dateCell = get(cells, 'date');
    if (blank(val(dateCell))) {
      const merged = sheet.merges.find((m) => mapping.date >= m.s.c && mapping.date <= m.e.c && r > m.s.r && r <= m.e.r);
      if (merged) dateCell = sheet.rows[merged.s.r]?.[merged.s.c];
    }
    const parsedDate = excelDate(dateCell, month, sheet.date1904);
    if (!blank(val(dateCell))) previousDate = parsedDate;
    const date = parsedDate || (fillDates && blank(val(dateCell)) ? previousDate : null);
    if (!date) { errors.push({ row: r + 1, message: 'Ngày chưa rõ. Chọn tháng hoặc kiểm tra ô ngày.' }); continue; }
    try {
      const parsedMoney = parseMoney(amountCell, multiplier), signed = parsedMoney.amount;
      if (signed === 0) { skipped++; continue; }
      const rawType = normalizeLabel(val(get(cells, 'type')));
      let type = ['income', 'thu', 'khoanthu', 'buchitrongngay'].includes(rawType) ? 'income' : ['expense', 'chi', 'khoanchi'].includes(rawType) ? 'expense' : mode === 'income' ? 'income' : mode === 'expense' ? 'expense' : signed > 0 ? 'income' : 'expense';
      const rawGroup = String(val(get(cells, 'group')) ?? '').trim();
      const legacyGroups = { thunhap: 'income', thietyeu: 'needs', mongmuon: 'wants', tietkiemtrano: 'savings_debt' };
      const explicitGroup = Object.keys(GROUP_LABELS).find((g) => g === rawGroup || normalizeLabel(GROUP_LABELS[g]) === normalizeLabel(rawGroup)) || legacyGroups[normalizeLabel(rawGroup)];
      let group = type === 'income' ? 'income' : explicitGroup || categoryGroups[rawCategory || 'Chưa phân loại'] || suggestedGroup(rawCategory);
      if (type === 'expense' && group === 'income') group = 'needs';
      const category = rawCategory || (type === 'income' ? 'Thu nhập khác' : 'Chưa phân loại');
      const extra = String(val(get(cells, 'extra')) ?? '').trim(), note = [label, extra].filter(Boolean).join(' · ');
      const rawFixed = normalizeLabel(val(get(cells, 'fixed')));
      const warnings = [];
      if (!rawCategory) warnings.push('Chưa có danh mục trong tệp.');
      if (parsedMoney.cachedFormula) warnings.push('Dùng kết quả công thức đã lưu trong tệp.');
      let kind = suggestFlow({ type, note });
      const support = [label, extra, category].some((entry) => /^(tien)?(chucap|sinhhoatphi)/.test(normalizeLabel(entry)));
      if (kind === 'regular' && type === 'income' && (rawType === 'buchitrongngay' || offsetReceipts && !support)) kind = 'offset';
      if (kind === 'deposit' || kind === 'refund') warnings.push(kind === 'deposit' ? 'Gợi ý tách tiền cọc khỏi chi sinh hoạt. Có thể đổi cách tính ở cột bên phải.' : 'Gợi ý tách tiền hoàn khỏi thu nhập mới. Sau khi nhập, chọn khoản cọc liên quan.');
      const transaction = validateRecord('transactions', { id: uuid(), date, type, amount: Math.abs(signed), group, category, isFixedBill: kind === 'regular' && type === 'expense' && ['1', 'true', 'co', 'yes'].includes(rawFixed), note: note || category, createdAt: Date.now(), ...(kind !== 'regular' ? { flow: { kind } } : {}) });
      categories.add(rawCategory || 'Chưa phân loại');
      records.push({ row: r + 1, transaction, warnings, selected: true });
    } catch (error) { errors.push({ row: r + 1, message: error.message }); }
  }
  return { rows: records, errors, skipped, categories: [...categories] };
}
