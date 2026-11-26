import { GROUP_LABELS, localDate } from './finance-engine.js';
import { markExistingTransactions, planImport, compareExcelWithLedger } from './db.js';
import { workbookSheets, buildImport, parseMoney, suggestedGroup, detectColumns, detectOpeningBalance, detectSideBalances, excelDate, hasDailyTotals, compareDailyTotals } from './excel-import.js';
import { kindOf, ledgerTotals } from './money-flow.js';
import { escapeHtml as E, formatMonth, formatVND, icon } from './ui.js';
import { dateText } from './ui-parts.js';

let libraryPromise;
function renderComparison(fileRows, existing) {
  if (!fileRows.length) return '';
  const { months, transactions, onlyInExcel, onlyInLedger } = compareExcelWithLedger(fileRows, existing);
  const records = [
    ['Excel · các dòng đọc được', fileRows.map((row) => row.transaction)],
    ['Sổ thu chi · cùng tháng', transactions],
  ];
  const differences = [
    ['Chỉ có trong Excel', onlyInExcel.map((row) => row.transaction)],
    ['Chỉ có trong sổ thu chi', onlyInLedger],
  ];
  return `<section class="excel-comparison" aria-label="Đối chiếu Excel với sổ thu chi">
    <h3>Đối chiếu Excel với sổ thu chi</h3>
    <p class="helper-text">${months.length <= 3 ? months.map(formatMonth).join(' · ') : `${months.length} tháng có giao dịch trong tệp`}. Các khoản đã có cũng được tính ở đây.</p>
    <div class="table-scroll"><table><thead><tr><th>Nguồn</th><th class="align-right">Tiền vào</th><th class="align-right">Tiền ra</th><th class="align-right">Thực chi ròng</th><th class="align-right">Chi ròng trung bình/ngày có chi</th></tr></thead><tbody>
    ${records.map(([label, rows]) => {
      const { received, expense, actualSpent, spendingDays } = ledgerTotals(rows);
      return `<tr><th scope="row">${label}<small class="table-secondary">${rows.length} khoản</small></th><td class="align-right money">${formatVND(received)}</td><td class="align-right money">${formatVND(expense)}</td><td class="align-right money">${formatVND(actualSpent)}</td><td class="align-right money">${spendingDays ? formatVND(actualSpent / spendingDays) : '—'}<small class="table-secondary">${spendingDays} ngày có chi</small></td></tr>`;
    }).join('')}</tbody></table></div>
    ${differences.map(([label, rows]) => rows.length ? `<details class="excel-mapping"><summary>${label} (${rows.length})</summary><ul>${rows.slice(0, 12).map((t) => `<li>${dateText(t.date)} · ${E(t.note || t.category)} · ${t.type === 'income' ? '+' : '−'}${formatVND(t.amount)}</li>`).join('')}</ul>${rows.length > 12 ? '<p class="helper-text">Đang hiển thị 12 khoản đầu.</p>' : ''}</details>` : '').join('')}
  </section>`;
}
function loadExcelLibrary() {
  if (globalThis.XLSX) return Promise.resolve(globalThis.XLSX);
  if (!libraryPromise) libraryPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = new URL('../vendor/xlsx.full.min.js', import.meta.url).href;
    let timer = setTimeout(() => { script.remove(); libraryPromise = null; reject(new Error('Chưa tải được phần đọc Excel. Kết nối mạng và thử lại.')); }, 15000);
    script.onload = () => { clearTimeout(timer); if (globalThis.XLSX) resolve(globalThis.XLSX); else { libraryPromise = null; reject(new Error('Không khởi chạy được phần đọc Excel.')); } };
    script.onerror = () => { clearTimeout(timer); libraryPromise = null; script.remove(); reject(new Error('Chưa tải được phần đọc Excel. Hãy tải lại trang.')); };
    document.head.append(script);
  });
  return libraryPromise;
}

export async function openExcelImporter({ getExisting, onImport }) {
  if (document.getElementById('excel-dialog')?.open) return;
  const old = document.getElementById('excel-dialog'); if (old) old.remove();
  const dialog = document.createElement('dialog'); dialog.id = 'excel-dialog'; dialog.className = 'form-dialog excel-dialog'; dialog.setAttribute('aria-labelledby', 'excel-title');
  dialog.innerHTML = `<div class="dialog-header"><div><span class="eyebrow">TỪ SỔ CŨ SANG GÓC TÀI CHÍNH MỚI</span><h2 id="excel-title">Nhập ghi chép từ Excel</h2><p class="helper-text">Chọn tệp, xem lại từng khoản rồi mới đưa vào sổ thu chi.</p></div><button class="icon-button" type="button" data-excel-action="close" aria-label="Đóng nhập Excel">${icon('close')}</button></div>
    <div class="excel-file-box"><label for="excel-file">Chọn tệp từ laptop (.xlsx, .xls hoặc .csv)</label><input id="excel-file" type="file" accept=".xlsx,.xls,.csv" aria-describedby="excel-privacy"><p id="excel-privacy" class="fine-print">Tệp được đọc ngay trên máy bạn, không gửi lên máy chủ. Chỉ nhập các dòng giao dịch, giữ nguyên dữ liệu đang có.</p><button type="button" class="text-link" data-excel-action="demo">Xem thử bằng tệp mẫu</button></div>
    <p id="excel-error" class="form-error" role="alert" hidden></p><div id="excel-config"></div><div id="excel-preview"></div>
    <div class="dialog-actions excel-actions"><span id="excel-ready" class="helper-text"></span><button type="button" class="button secondary" data-excel-action="close">Để sau</button><button type="button" class="button primary" data-excel-action="commit" id="excel-commit" disabled>Nhập vào sổ thu chi</button></div>`;
  document.body.append(dialog); dialog.showModal();
  const state = { sheets: [], sheetIndex: 0, result: null, options: null, excluded: new Set(), fixed: new Map(), kinds: new Map(), skipDuplicates: true, updateDetails: true, allowPartial: false, importOpening: false, importSavings: false, openingBalance: null, busy: false, page: 1, ready: [], incoming: [], updates: 0, liquidSavings: null };
  const errorBox = dialog.querySelector('#excel-error'), config = dialog.querySelector('#excel-config'), preview = dialog.querySelector('#excel-preview');
  const showError = (message) => { errorBox.textContent = message; errorBox.hidden = !message; };
  const currentSheet = () => state.sheets[state.sheetIndex];
  function columnOptions(selected = -1) {
    const sheet = currentSheet(), headers = sheet.rows[state.options.headerRow] || [];
    return '<option value="-1">Không dùng cột</option>' + headers.map((cell, i) => `<option value="${i}" ${i === selected ? 'selected' : ''}>${i >= 26 ? String.fromCharCode(64 + Math.floor(i / 26)) : ''}${String.fromCharCode(65 + i % 26)} · ${E(cell?.v ?? `Cột ${i + 1}`)}</option>`).join('');
  }
  function configView() {
    const sheet = currentSheet(), o = state.options;
    config.innerHTML = `<div class="excel-config-grid"><label>Trang tính<select id="excel-sheet">${state.sheets.map((s, i) => `<option value="${i}" ${i === state.sheetIndex ? 'selected' : ''}>${E(s.name)}${s.score >= 10 ? ' · Có bảng thu chi' : ''}</option>`).join('')}</select></label><label>Dòng tiêu đề<input id="excel-header" type="number" min="1" max="${Math.max(1, sheet.rows.length)}" step="1" value="${o.headerRow + 1}"></label><label>Tháng của các ngày chưa có năm<input id="excel-month" type="month" value="${E(o.month)}"></label></div>
    <div class="excel-config-grid"><label>Cách ghi số tiền<select id="excel-mode"><option value="signed" ${o.mode === 'signed' ? 'selected' : ''}>Số âm là chi, số dương là thu</option><option value="expense" ${o.mode === 'expense' ? 'selected' : ''}>Tất cả là khoản chi</option><option value="income" ${o.mode === 'income' ? 'selected' : ''}>Tất cả là khoản thu</option></select></label><label>Đơn vị tiền trong tệp<select id="excel-multiplier"><option value="1" ${o.multiplier === 1 ? 'selected' : ''}>Đồng (₫)</option><option value="1000" ${o.multiplier === 1000 ? 'selected' : ''}>Nghìn đồng (× 1.000)</option><option value="1000000" ${o.multiplier === 1000000 ? 'selected' : ''}>Triệu đồng (× 1.000.000)</option></select></label><label class="checkbox-label"><input id="excel-fill-dates" type="checkbox" ${o.fillDates ? 'checked' : ''}>Ô ngày trống dùng ngày dòng trước</label></div>
    <label class="checkbox-label"><input id="excel-offset-receipts" type="checkbox" ${o.offsetReceipts ? 'checked' : ''}>Gộp khoản nhận nhỏ vào chi trong ngày</label>
    <p class="helper-text">Với tùy chọn này, các khoản nhận chưa ghi rõ Chu cấp hoặc Tiền hoàn được xếp vào Bù chi. Bạn có thể đổi từng dòng ở cột Cách tính.</p>
    <details class="excel-mapping"><summary>Kiểm tra các cột được nhận diện</summary><div class="excel-column-grid">${[['date', 'Ngày'], ['amount', 'Số tiền giao dịch'], ['note', 'Tên khoản / Nội dung'], ['category', 'Danh mục'], ['extra', 'Ghi chú bổ sung'], ['type', 'Loại thu / chi'], ['group', 'Nhóm'], ['fixed', 'Hóa đơn cố định']].map(([key, label]) => `<label>${label}<select data-excel-column="${key}">${columnOptions(o.mapping[key])}</select></label>`).join('')}</div><p class="fine-print">Chọn cột tiền của từng khoản; không chọn cột tổng ngày hoặc số dư. Ngày trong ô gộp được nhận tự động.</p></details>`;
  }
  function rebuild() {
    state.result = buildImport(currentSheet(), state.options);
    for (const row of state.result.rows) if (state.fixed.has(row.row)) row.transaction.isFixedBill = state.fixed.get(row.row);
    for (const row of state.result.rows) if (state.kinds.has(row.row)) { const kind = state.kinds.get(row.row); if (kind === 'regular') delete row.transaction.flow; else { row.transaction.flow = { kind }; row.transaction.isFixedBill = false; } }
    for (const row of state.result.rows) if (row.transaction.type === 'income' || kindOf(row.transaction) !== 'regular') row.transaction.isFixedBill = false;
    state.page = 1; previewView();
  }
  function readiness() {
    const result = state.result; if (!result) return;
    const selected = result.rows.filter((r) => !state.excluded.has(r.row));
    const duplicate = markExistingTransactions(selected.map((r) => r.transaction), getExisting());
    selected.forEach((row, i) => { row.duplicate = duplicate[i]; });
    state.incoming = selected.map((r) => r.transaction);
    const planned = planImport(state.incoming, getExisting(), { skipDuplicates: state.skipDuplicates, updateDetails: state.updateDetails });
    state.ready = planned.accepted; state.updates = planned.updated;
    const foundOpening = detectOpeningBalance(currentSheet(), state.options.multiplier);
    state.openingBalance = state.importOpening && foundOpening ? { month: state.options.month, ...foundOpening } : null;
    const side = detectSideBalances(currentSheet(), state.options.multiplier);
    state.liquidSavings = state.importSavings ? side.liquidSavings : null;
    return { duplicateCount: duplicate.filter(Boolean).length, ...ledgerTotals(state.ready), foundOpening, side };
  }
  function previewView() {
    const result = state.result, totals = readiness(); if (!result || !totals) return;
    const perPage = 30, pages = Math.max(1, Math.ceil(result.rows.length / perPage)); state.page = Math.min(state.page, pages);
    const groupList = Object.entries(GROUP_LABELS).filter(([g]) => g !== 'income');
    const categoryGroups = result.categories.map((cat) => {
      const onlyIncome = result.rows.filter((r) => r.transaction.category === cat).every((r) => r.transaction.type === 'income');
      const group = state.options.categoryGroups[cat] || suggestedGroup(cat);
      return `<label>${E(cat)}<select data-excel-category="${E(cat)}" ${onlyIncome ? 'disabled' : ''}>${onlyIncome ? '<option>Thu nhập</option>' : groupList.map(([g, label]) => `<option value="${g}" ${g === group ? 'selected' : ''}>${label}</option>`).join('')}</select></label>`;
    }).join('');
    const dayDifferences = compareDailyTotals(currentSheet(), result.rows, state.options);
    const note = dayDifferences.length ? `<details class="excel-mapping" open><summary>${dayDifferences.length} ngày có tổng trong Excel khác tổng các dòng</summary><ul>${dayDifferences.slice(0, 10).map((d) => `<li>${dateText(d.date)} · Ô tổng ngày ${formatVND(d.saved)} · Cộng từng dòng ${formatVND(d.calculated)}</li>`).join('')}</ul><p class="helper-text">Moneywall cộng từng dòng tiền vào, tiền ra. Ô tổng ngày dùng để đối chiếu.</p></details>` : '';
    preview.innerHTML = `${renderComparison(result.rows, getExisting())}${note}
      <div class="excel-summary"><div><span>Sẵn sàng nhập</span><strong>${state.ready.length} khoản</strong></div><div><span>Tiền vào sẽ thêm</span><strong class="amount-income">${formatVND(totals.received)}</strong></div><div><span>Tiền ra sẽ thêm</span><strong>${formatVND(totals.expense)}</strong></div><div><span>Thực chi ròng sẽ thêm</span><strong>${formatVND(totals.actualSpent)}</strong></div></div>
      ${totals.foundOpening ? `<aside class="banner excel-opening-banner"><label class="checkbox-label"><input id="excel-import-opening" type="checkbox" ${state.importOpening ? 'checked' : ''}>Lưu cả tiền có sẵn đầu tháng ${E(state.options.month)}</label><p>Ngân hàng: <strong>${formatVND(totals.foundOpening.bank)}</strong> · Tiền mặt: <strong>${formatVND(totals.foundOpening.cash)}</strong>. Tổng: <strong>${formatVND(totals.foundOpening.bank + totals.foundOpening.cash)}</strong>.</p><p class="fine-print">Chỉ chọn nếu đây là số dư đầu tháng. Lưu riêng để tính tiền còn lại, không cộng vào thu nhập mới và không cộng quỹ tiết kiệm. Sẽ thay số dư đầu tháng đang lưu cho tháng này.</p></aside>` : ''}
      <details class="excel-mapping"><summary>Phân nhóm theo danh mục của bạn</summary><p class="helper-text">Giữ nguyên tên danh mục trong Excel. Kiểm tra nhóm Thiết yếu / Mong muốn trước khi xác nhận; các khoản nhận tiền luôn được ghi là thu.</p><div class="excel-column-grid">${categoryGroups}</div></details>
      ${totals.side.liquidSavings !== null ? `<aside class="banner"><label class="checkbox-label"><input id="excel-import-savings" type="checkbox" ${state.importSavings ? 'checked' : ''}>Đối chiếu quỹ để dành: ${formatVND(totals.side.liquidSavings)}</label><p class="fine-print">Thay số dư quỹ đang lưu bằng số này, không tạo khoản thu chi. Chỉ chọn nếu đây là số quỹ thực tế hiện tại.</p></aside>` : ''}
      ${totals.side.debt !== null ? `<p class="compact-note">Tệp có ghi dư nợ ${formatVND(totals.side.debt)}. Sau khi nhập, bạn có thể bổ sung lãi suất và mức trả trong Khoản cần lo; ứng dụng chưa tự tạo nợ.</p>` : ''}
      <p class="fine-print">Cọc và tiền hoàn được gợi ý tách riêng ở cột “Cách tính”. Kiểm tra trước khi lưu; tiền ra vào vẫn giữ nguyên.</p>
      <div class="excel-import-options"><label class="checkbox-label"><input id="excel-skip-duplicates" type="checkbox" ${state.skipDuplicates ? 'checked' : ''}>Bỏ qua khoản giống giao dịch đã có (${totals.duplicateCount})</label>${state.skipDuplicates ? `<label class="checkbox-label"><input id="excel-update-details" type="checkbox" ${state.updateDetails ? 'checked' : ''}>Bổ sung danh mục trống, cách tính cọc, hoàn hoặc bù chi cho khoản đã có (${state.updates} khoản)</label>` : ''}${result.errors.length ? `<label class="checkbox-label"><input id="excel-allow-partial" type="checkbox" ${state.allowPartial ? 'checked' : ''}>Chỉ nhập các dòng hợp lệ; bỏ ${result.errors.length} dòng lỗi</label>` : ''}</div>
      ${result.errors.length ? `<div class="form-error"><strong>${result.errors.length} dòng cần kiểm tra</strong><ul>${result.errors.slice(0, 10).map((r) => `<li>Dòng ${r.row}: ${E(r.message)}</li>`).join('')}</ul>${result.errors.length > 10 ? '<p>Chỉ hiển thị 10 lỗi đầu. Hãy kiểm tra lại tệp trước khi nhập.</p>' : ''}</div>` : ''}
      ${result.rows.length ? `<div class="table-scroll excel-preview-table"><table><thead><tr><th><input id="excel-select-all" type="checkbox" aria-label="Chọn tất cả giao dịch Excel" ${result.rows.every((r) => !state.excluded.has(r.row)) ? 'checked' : ''}></th><th>Ngày</th><th>Nội dung & Lưu ý</th><th>Danh mục</th><th class="align-right">Số tiền</th><th>Cách tính</th><th>Hóa đơn<br>cố định</th></tr></thead><tbody>${result.rows.slice((state.page - 1) * perPage, state.page * perPage).map((r) => `<tr class="${r.duplicate && state.skipDuplicates && !state.excluded.has(r.row) ? 'excel-duplicate' : ''}"><td><input type="checkbox" data-excel-row="${r.row}" aria-label="Chọn dòng ${r.row}" ${state.excluded.has(r.row) ? '' : 'checked'}></td><td class="tabular">${E(r.transaction.date.split('-').reverse().join('/'))}<small class="excel-row-number">Dòng ${r.row}</small></td><td><span class="excel-note">${E(r.transaction.note)}</span>${r.warnings.map((w) => `<small class="excel-row-warning">${E(w)}</small>`).join('')}${r.duplicate && !state.excluded.has(r.row) ? '<small class="excel-row-warning">Giống giao dịch đã có trong sổ.</small>' : ''}</td><td>${E(r.transaction.category)}<small class="excel-row-number">${GROUP_LABELS[r.transaction.group]}</small></td><td class="align-right money ${r.transaction.type === 'income' ? 'amount-income' : ''}">${r.transaction.type === 'income' ? '+' : '−'}${formatVND(r.transaction.amount)}</td><td><select class="excel-kind-select" data-excel-kind="${r.row}" aria-label="Cách tính dòng ${r.row}">${(r.transaction.type === 'income' ? [['regular','Thu nhập mới / Chu cấp'],['offset','Bù chi trong ngày'],['refund','Tiền được hoàn']] : [['regular','Chi sinh hoạt'],['deposit','Tiền cọc']]).map(([kind,label]) => `<option value="${kind}" ${kindOf(r.transaction) === kind ? 'selected' : ''}>${label}</option>`).join('')}</select></td><td><input type="checkbox" data-excel-fixed="${r.row}" aria-label="Dòng ${r.row} là hóa đơn cố định" ${r.transaction.isFixedBill ? 'checked' : ''} ${r.transaction.type === 'income' || kindOf(r.transaction) !== 'regular' ? 'disabled' : ''}></td></tr>`).join('')}</tbody></table></div><div class="pagination"><span>${result.rows.length} dòng hợp lệ · ${result.skipped} dòng tổng hoặc bằng 0 được bỏ qua</span><div class="pagination-controls"><button type="button" class="button secondary small" data-excel-action="previous" ${state.page === 1 ? 'disabled' : ''}>Trước</button><span>${state.page}/${pages}</span><button type="button" class="button secondary small" data-excel-action="next" ${state.page === pages ? 'disabled' : ''}>Sau</button></div></div>` : '<div class="empty-state"><h3>Chưa có giao dịch để nhập</h3><p>Kiểm tra trang tính, dòng tiêu đề và cột ngày / số tiền ở trên.</p></div>'}
      <p class="fine-print">Các ô tổng ngày và ghi chú số dư bên cạnh bảng không trở thành giao dịch. Quỹ và tiền đầu tháng chỉ được lưu khi bạn chọn ở trên.</p>`;
    const button = dialog.querySelector('#excel-commit'); button.textContent = !state.ready.length ? state.updates ? `Cập nhật ${state.updates} khoản đã có` : state.openingBalance ? 'Lưu số dư đầu tháng' : state.liquidSavings !== null ? 'Lưu số dư quỹ' : 'Không có khoản mới' : `Nhập ${state.ready.length} giao dịch vào sổ`;
    button.disabled = state.busy || !state.ready.length && !state.updates && !state.openingBalance && state.liquidSavings === null || result.errors.length > 0 && !state.allowPartial;
    dialog.querySelector('#excel-ready').textContent = `${result.rows.length - state.excluded.size} khoản được chọn${state.openingBalance ? ' · Lưu cả số dư đầu tháng' : ' · Dữ liệu cũ được giữ'}`;
  }
  function selectSheet(index) {
    state.sheetIndex = index; state.excluded.clear(); state.fixed.clear(); state.kinds.clear();
    state.importOpening = false; state.importSavings = false; state.liquidSavings = null; state.openingBalance = null;
    const sheet = currentSheet();
    const hasNegative = sheet.rows.slice(sheet.header.index + 1).some((row) => { try { return parseMoney(row[sheet.header.mapping.amount]).amount < 0; } catch { return false; } });
    const firstDate = sheet.rows.slice(sheet.header.index + 1).map((row) => excelDate(row[sheet.header.mapping.date], localDate().slice(0, 7), sheet.date1904)).find(Boolean);
    state.options = { headerRow: sheet.header.index, mapping: { ...sheet.header.mapping }, month: firstDate?.slice(0, 7) || localDate().slice(0, 7), mode: hasNegative ? 'signed' : 'expense', multiplier: 1, fillDates: false, offsetReceipts: hasNegative && hasDailyTotals(sheet), categoryGroups: Object.create(null) };
    state.allowPartial = false; configView(); rebuild();
  }
  async function readFile(file) {
    if (!file) return;
    showError(''); state.busy = true; dialog.querySelector('#excel-commit').disabled = true;
    try {
      if (!/\.(xlsx|xls|csv)$/i.test(file.name)) throw new Error('Hãy chọn tệp .xlsx, .xls hoặc .csv.');
      if (file.size > 10 * 1024 * 1024) throw new Error('Tệp tối đa 10 MB. Hãy tách bớt trang không cần thiết rồi thử lại.');
      const XLSX = await loadExcelLibrary();
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', raw: true, cellDates: false, cellHTML: false, cellFormula: true, bookVBA: false });
      state.sheets = workbookSheets(workbook, XLSX);
      if (!state.sheets.length) throw new Error('Tệp không có trang tính nào.');
      state.busy = false;
      selectSheet(state.sheets.indexOf([...state.sheets].sort((a, b) => b.score - a.score)[0]));
    } catch (error) { state.result = null; state.ready = []; config.replaceChildren(); preview.replaceChildren(); showError(error.message || 'Không đọc được tệp Excel.'); }
    finally { state.busy = false; }
  }
  dialog.addEventListener('change', async (event) => {
    const el = event.target;
    if (el.id === 'excel-file') { await readFile(el.files[0]); return; }
    if (!state.options || state.busy) return;
    if (el.id === 'excel-sheet') { selectSheet(Number(el.value)); return; }
    if (el.id === 'excel-header') { state.options.headerRow = Math.max(0, Math.min(currentSheet().rows.length - 1, Math.round(Number(el.value)) - 1)); state.options.mapping = { ...detectColumns(currentSheet().rows[state.options.headerRow] || []) }; state.excluded.clear(); configView(); }
    if (el.id === 'excel-offset-receipts') state.options.offsetReceipts = el.checked;
    if (el.id === 'excel-mode') state.options.mode = el.value;
    if (el.id === 'excel-month') state.options.month = el.value;
    if (el.id === 'excel-multiplier') state.options.multiplier = Number(el.value);
    if (el.id === 'excel-fill-dates') state.options.fillDates = el.checked;
    if (el.id === 'excel-skip-duplicates') state.skipDuplicates = el.checked;
    if (el.id === 'excel-allow-partial') state.allowPartial = el.checked;
    if (el.id === 'excel-import-opening') state.importOpening = el.checked;
    if (el.id === 'excel-import-savings') state.importSavings = el.checked;
    if (el.id === 'excel-update-details') state.updateDetails = el.checked;
    if (el.id === 'excel-select-all') { if (el.checked) state.excluded.clear(); else state.result.rows.forEach((r) => state.excluded.add(r.row)); }
    if (el.dataset.excelColumn) { state.options.mapping[el.dataset.excelColumn] = Number(el.value); state.excluded.clear(); }
    if (el.dataset.excelCategory) state.options.categoryGroups[el.dataset.excelCategory] = el.value;
    if (el.dataset.excelRow) { if (el.checked) state.excluded.delete(Number(el.dataset.excelRow)); else state.excluded.add(Number(el.dataset.excelRow)); }
    if (el.dataset.excelFixed) state.fixed.set(Number(el.dataset.excelFixed), el.checked);
    if (el.dataset.excelKind) state.kinds.set(Number(el.dataset.excelKind), el.value);
    if (el.dataset.excelRow || el.id === 'excel-skip-duplicates' || el.id === 'excel-allow-partial' || el.id === 'excel-select-all' || el.id === 'excel-import-opening' || el.id === 'excel-import-savings' || el.id === 'excel-update-details') previewView(); else rebuild();
  });
  dialog.addEventListener('cancel', (event) => { if (state.busy) event.preventDefault(); });
  dialog.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-excel-action]'); if (!button || state.busy) return;
    const action = button.dataset.excelAction;
    if (action === 'close') dialog.close();
    if (action === 'previous') { state.page--; previewView(); }
    if (action === 'next') { state.page++; previewView(); }
    if (action === 'demo') {
      try {
        const X = await loadExcelLibrary(), m = localDate().slice(0, 7), workbook = X.utils.book_new();
        const sheet = X.utils.aoa_to_sheet([['Ghi chép mẫu'], ['Ngày', 'Danh mục', 'VNĐ', 'Tổng chi / ngày', 'Note', 'Danh mục'], [`${m}-01`, 'Thu nhập minh họa', 2000000, '', '', 'Thu nhập khác'], [`${m}-02`, 'Đi chợ', -80000, '', '', 'Ăn uống'], ['', 'Đi xe', -25000, '', '', 'Di chuyển']]);
        sheet['!merges'] = [{ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }];
        X.utils.sheet_add_aoa(sheet, [['TK NH:', 300000], ['Tiền mặt:', 100000]], { origin: 'H3' });
        X.utils.book_append_sheet(workbook, sheet, 'Thu chi mẫu');
        const bytes = X.write(workbook, { type: 'array', bookType: 'xlsx' });
        await readFile(new File([bytes], 'thu-chi-mau.xlsx'));
      } catch (error) { showError(error.message); }
    }
    if (action === 'commit') {
      readiness();
      if (!state.ready.length && !state.updates && !state.openingBalance && state.liquidSavings === null || state.result.errors.length && !state.allowPartial) return;
      state.busy = true; dialog.querySelector('#excel-commit').disabled = true; showError('');
      try {
        const result = await onImport(state.incoming, { skipDuplicates: state.skipDuplicates, updateDetails: state.updateDetails, openingBalance: state.openingBalance, liquidSavings: state.liquidSavings, debtHint: detectSideBalances(currentSheet(), state.options.multiplier).debt });
        if (result) dialog.close();
      } catch (error) { showError(error.message || 'Chưa nhập được. Dữ liệu cũ được giữ nguyên.'); }
      finally { state.busy = false; if (dialog.open) previewView(); }
    }
  });
}
