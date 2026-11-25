import { CATEGORIES, DEFAULT_PROFILE, GROUP_LABELS, analyzeFinance, localDate, simulateDebtPayoff } from './finance-engine.js';
import { initDB, readData, putRecord, deleteRecord, replaceData, storageStatus, validateBackup, createBackup, createCSV, uuid, appendTransactions, saveTransaction } from './db.js';
import { createSeedData } from './seed-data.js';
import { fillIcons, icon, escapeHtml as E, categoryOptions, renderOverview, renderTransactions, renderAnalysis, renderPlanning, renderSettings, renderDebtSimulation, filteredTransactions, formatVND } from './ui.js';
import { categoryHabits, depositBalances, dateForMonth, kindOf, suggestFlow, monthAfterDayChange } from './money-flow.js';
import { renderCharts, destroyCharts } from './charts.js';
import { openExcelImporter } from './excel-ui.js';

const tabs = { overview: 'Tổng quan', transactions: 'Sổ thu chi', analysis: 'Phân tích', planning: 'Khoản cần lo', settings: 'Sao lưu & Cài đặt' };
const state = { data: null, analysis: null, storage: null, tab: 'overview', page: 1, ledgerView: 'daily', filters: { month: localDate().slice(0, 7), group: '', category: '', search: '' }, extraPayment: 1000000, busy: false, installDismissed: false, importHints: null };
const content = document.getElementById('app-content');
let toastTimer, installPrompt, calendarDay = localDate();
try { state.installDismissed = sessionStorage.getItem('vung-install-dismissed') === '1'; } catch { /* Optional preference, unrelated to saved financial data. */ }

function toast(message, error = false) {
  const el = document.getElementById('toast'); clearTimeout(toastTimer); el.textContent = message; el.classList.toggle('error', error); el.hidden = false;
  toastTimer = setTimeout(() => { el.hidden = true; }, error ? 7000 : 3500);
}
async function confirmChange(title, description, label = 'Xác nhận', danger = false) {
  const dialog = document.getElementById('confirm-dialog');
  document.getElementById('confirm-title').textContent = title; document.getElementById('confirm-description').textContent = description;
  const button = document.getElementById('confirm-button'); button.textContent = label; button.className = `button ${danger ? 'danger' : 'primary'}`;
  dialog.returnValue = ''; dialog.showModal();
  return new Promise((resolve) => dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), { once: true }));
}
function applyTheme() {
  document.documentElement.dataset.theme = state.data.profile.theme;
  document.getElementById('theme-toggle').innerHTML = `${icon(state.data.profile.theme === 'dark' ? 'sun' : 'moon')}<span>${state.data.profile.theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}</span>`;
  document.querySelector('meta[name="theme-color"]').content = state.data.profile.theme === 'dark' ? '#192a23' : '#0f6f50';
}
function render() {
  if (!state.data) return;
  state.analysis = analyzeFinance(state.data, dateForMonth(state.filters.month));
  const a = state.analysis;
  applyTheme(); destroyCharts();
  document.querySelectorAll('[data-tab]').forEach((el) => { const active = el.dataset.tab === state.tab; el.classList.toggle('active', active); if (active) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current'); });
  document.getElementById('breadcrumb-title').textContent = tabs[state.tab];
  document.title = `${tabs[state.tab]} · Vững Tài Chính`;
  const alerts = a.anomalies.length + Number(a.payday.warning) + Number(a.lifestyle.warning), count = document.getElementById('nav-alert-count');
  count.textContent = alerts; count.hidden = !alerts;
  const warning = document.getElementById('storage-warning'); warning.textContent = state.storage.message; warning.hidden = !state.storage.message;
  document.getElementById('chart-warning').hidden = !!globalThis.Chart;
  if (state.tab === 'overview') content.innerHTML = renderOverview(state.data, a, state.installDismissed);
  if (state.tab === 'transactions') {
    const filtered = filteredTransactions(state.data, state.filters);
    const pages = state.ledgerView === 'daily' ? Math.ceil(new Set(filtered.map((t) => t.date)).size / 10) : Math.ceil(filtered.length / 15);
    state.page = Math.min(state.page, Math.max(1, pages));
    content.innerHTML = renderTransactions(state.data, a, state.filters, state.page, state.ledgerView);
  }
  if (state.tab === 'analysis') content.innerHTML = renderAnalysis(state.data, a);
  if (state.tab === 'planning') { content.innerHTML = renderPlanning(state.data, a, state.extraPayment); updateSimulation(); }
  if (state.tab === 'settings') content.innerHTML = renderSettings(state.data, a, state.storage);
  if (state.importHints?.debt !== null && state.importHints && !state.data.debts.length) content.insertAdjacentHTML('afterbegin', `<aside class="banner"><strong>Ghi chú trong Excel có dư nợ ${formatVND(state.importHints.debt)}.</strong> Thêm mức trả mỗi tháng và lãi suất để giữ lại đúng tiền. <button class="button secondary small" data-action="setup-import-debt">Bổ sung khoản nợ</button><button class="icon-button" data-action="dismiss-import-hint" aria-label="Ẩn ghi chú từ Excel">${icon('close')}</button></aside>`);
  renderCharts(state.tab, state.data, a);
}
async function refresh() { state.data = await readData(); state.storage = await storageStatus(); render(); }
async function mutation(work, success = '') {
  if (state.busy) return;
  state.busy = true;
  const submitters = [...document.querySelectorAll('dialog[open] button[type="submit"], #profile-form button[type="submit"]')];
  submitters.forEach((b) => { b.disabled = true; });
  try { await work(); await refresh(); if (success) toast(success); return true; }
  catch (error) { toast(error.message || 'Chưa thể lưu thay đổi. Hãy thử lại.', true); return false; }
  finally { state.busy = false; submitters.forEach((b) => { b.disabled = false; }); }
}
function navigate() {
  const tab = location.hash.slice(1) || 'overview'; state.tab = Object.hasOwn(tabs, tab) ? tab : 'overview'; render();
}
function transactionType(type) {
  const form = document.getElementById('transaction-form'); form.elements.type.value = type;
  form.querySelectorAll('[data-tx-type]').forEach((el) => { el.classList.toggle('selected', el.dataset.txType === type); el.setAttribute('aria-pressed', el.dataset.txType === type); });
  const group = form.elements.group;
  group.innerHTML = (type === 'income' ? ['income'] : ['needs', 'wants', 'savings_debt']).map((k) => `<option value="${k}">${GROUP_LABELS[k]}</option>`).join('');
  form.elements.isFixedBill.disabled = type === 'income'; if (type === 'income') form.elements.isFixedBill.checked = false;
  updateCategories(form);
  form.elements.billId.value = ''; flowOptions(form); flowFields();
}
function updateCategories(form, selected = '') {
  const group = form.elements.group.value;
  if (form.getAttribute('id') !== 'transaction-form') { form.elements.category.innerHTML = categoryOptions(group, selected, state.data?.transactions.filter((t) => t.group === group).map((t) => t.category)); return; }
  const type = form.elements.type.value, habits = categoryHabits(state.data.transactions, type);
  const defaults = (type === 'income' ? CATEGORIES.income : [...CATEGORIES.needs, ...CATEGORIES.wants, ...CATEGORIES.savings_debt]);
  document.getElementById('category-suggestions').innerHTML = [...new Set([...habits.map((h) => h.category), ...defaults])].map((c) => `<option value="${E(c)}"></option>`).join('');
  document.getElementById('category-shortcuts').innerHTML = habits.slice(0, 5).map((h) => `<button type="button" data-category-shortcut="${E(h.category)}" data-group="${h.group}">${E(h.category)}</button>`).join('');
  const notes = [...new Set([...state.data.transactions].filter((t) => t.type === type && t.note).sort((x, y) => y.date.localeCompare(x.date)).map((t) => t.note))].slice(0, 35);
  document.getElementById('note-suggestions').innerHTML = notes.map((n) => `<option value="${E(n)}"></option>`).join('');
  form.elements.category.value = selected;
}
function fillForm(form, record) {
  for (const [key, value] of Object.entries(record)) {
    const el = form.elements.namedItem(key); if (!el) continue;
    if (el.type === 'checkbox') el.checked = value; else el.value = value;
  }
}
function flowFields(selectedTarget = '') {
  const form = document.getElementById('transaction-form'), kind = form.elements.flowKind.value;
  const target = form.elements.targetId;
  const isDebt = kind === 'debt', isRefund = kind === 'refund';
  document.getElementById('tx-link-fields').hidden = !isDebt && !isRefund;
  document.getElementById('tx-principal-label').hidden = !isDebt;
  form.elements.principal.required = isDebt;
  target.required = isDebt;
  const deposits = depositBalances(state.data.transactions, form.elements.date.value || localDate(), form.elements.id.value);
  target.innerHTML = isDebt ? '<option value="">Chọn khoản nợ</option>' + state.data.debts.map((d) => `<option value="${E(d.id)}">${E(d.name)} · còn ${formatVND(d.principal)}</option>`).join('') : '<option value="">Chưa liên kết khoản cọc</option>' + deposits.map((d) => `<option value="${E(d.id)}">${E(d.note || d.category)} · còn ${formatVND(d.remaining)}</option>`).join('');
  target.value = selectedTarget;
  if (['reserve-in', 'debt'].includes(kind)) form.elements.group.value = 'savings_debt';
  if (isRefund || kind === 'reserve-out') form.elements.group.value = 'income';
  if (kind === 'deposit' && form.elements.group.value === 'savings_debt') form.elements.group.value = 'needs';
  const copies = { regular: 'Lưu vào sổ và cập nhật số dư, tổng thu chi.', deposit: 'Tiền đã ra khỏi ví nhưng còn chờ nhận lại. Tách khỏi chi sinh hoạt.', refund: 'Tiền quay về ví, không cộng vào thu nhập mới. Chọn khoản cọc để cập nhật số còn chờ.', 'reserve-in': 'Thêm khoản chi vào sổ và tăng quỹ cùng một lần lưu.', 'reserve-out': 'Thêm tiền vào ví và giảm quỹ cùng lúc; không tính là thu nhập mới.', debt: 'Thêm khoản chi vào sổ, đồng thời trừ nợ đúng phần tiền gốc bạn nhập.' };
  document.getElementById('tx-flow-explanation').textContent = copies[kind];
  const regular = kind === 'regular'; form.elements.isFixedBill.disabled = !regular || form.elements.type.value === 'income';
  if (form.elements.isFixedBill.disabled) { form.elements.isFixedBill.checked = false; form.elements.billId.value = ''; }
  billFields(form.elements.billId.value);
}
function billFields(selected = '') {
  const form = document.getElementById('transaction-form'), visible = form.elements.isFixedBill.checked && !form.elements.isFixedBill.disabled;
  document.getElementById('tx-bill-label').hidden = !visible;
  form.elements.billTarget.innerHTML = '<option value="">Đối chiếu theo danh mục</option>' + state.data.recurring_bills.map((b) => `<option value="${E(b.id)}">${E(b.name)}</option>`).join('');
  form.elements.billTarget.value = selected;
}
function flowOptions(form, kind = 'regular') {
  const options = form.elements.type.value === 'income' ? [['regular', 'Thu nhập mới'], ['refund', 'Tiền được hoàn'], ['reserve-out', 'Rút từ quỹ để dành']] : [['regular', 'Chi tiêu bình thường'], ['deposit', 'Tiền cọc chờ hoàn'], ['reserve-in', 'Chuyển vào quỹ để dành'], ['debt', 'Trả nợ']];
  form.elements.flowKind.innerHTML = options.map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
  form.elements.flowKind.value = options.some(([k]) => k === kind) ? kind : 'regular';
}
function openTransaction(record) {
  const form = document.getElementById('transaction-form'); form.reset(); transactionType(record?.type || 'expense');
  form.elements.id.value = record?.id || ''; form.elements.date.value = state.analysis.today;
  if (record) { form.elements.group.value = record.group; updateCategories(form, record.category); fillForm(form, record); }
  flowOptions(form, record ? kindOf(record) : 'regular');
  form.elements.billId.value = record?.flow?.billId || '';
  form.elements.principal.value = record?.flow?.principal ?? '';
  flowFields(record?.flow?.targetId || '');
  document.getElementById('transaction-error').hidden = true;
  document.getElementById('transaction-dialog-title').textContent = record?.id ? 'Sửa khoản đã ghi' : 'Ghi thu chi';
  document.getElementById('transaction-dialog').showModal(); form.elements.amount.focus();
}
function openBill(record) {
  const form = document.getElementById('bill-form'); form.reset(); form.elements.id.value = '';
  if (record) form.elements.group.value = record.group;
  updateCategories(form, record?.category); if (record) fillForm(form, record);
  document.getElementById('bill-error').hidden = true; document.getElementById('bill-dialog').showModal();
}
function openDebt(record) {
  const form = document.getElementById('debt-form'); form.reset(); form.elements.id.value = '';
  if (record) fillForm(form, record); document.getElementById('debt-error').hidden = true;
  document.getElementById('debt-dialog').showModal();
}
function download(name, contentValue, type) {
  const blob = new Blob([contentValue], { type }), url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = name; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
}
function updateSimulation() {
  const element = document.getElementById('debt-simulation');
  if (element) element.innerHTML = renderDebtSimulation(simulateDebtPayoff(state.data.debts, state.extraPayment));
}
async function install() {
  if (installPrompt) { await installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; }
  else document.getElementById('install-dialog').showModal();
}
function goTo(tab, section = '') {
  state.tab = tab;
  if (location.hash !== `#${tab}`) history.pushState(null, '', `#${tab}`);
  render();
  if (section) { const target = document.getElementById(section); target?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  else document.getElementById('main').scrollIntoView({ block: 'start' });
}
async function handleAction(action, id, attrs = {}) {
  const find = (store) => state.data[store].find((x) => x.id === id);
  if (action === 'add-transaction') openTransaction();
  else if (action === 'open-ledger') {
    state.filters = { month: state.filters.month, group: attrs.group || '', category: attrs.category || '', search: '', kind: attrs.kind || '', type: attrs.type || '', target: attrs.target || '', scope: attrs.scope || '', through: attrs.scope || attrs.type ? state.analysis.today : '', allMonths: attrs.allMonths === 'true', billId: attrs.billId || '', billName: attrs.billName || '' };
    state.page = 1; goTo('transactions');
  }
  else if (action === 'clear-filters') { state.filters = { month: state.filters.month, group: '', category: '', search: '' }; state.page = 1; render(); }
  else if (action === 'open-opening') { state.filters = { month: state.filters.month, group: '', category: '', search: '' }; goTo('transactions', 'opening-section'); const details = document.querySelector('#opening-section details'); if (details) details.open = true; document.querySelector('#opening-balance-form [name=bank]')?.focus({ preventScroll: true }); }
  else if (action === 'show-balance') { const el = document.getElementById('balance-detail'); el.open = !el.open; }
  else if (action === 'open-planning') goTo('planning', attrs.section);
  else if (action === 'open-deposits') goTo('analysis', 'deposit-section');
  else if (action === 'new-deposit') openTransaction({ type: 'expense', group: 'needs', category: '', note: '', date: state.analysis.today, flow: { kind: 'deposit' } });
  else if (action === 'refund-deposit') { const d = depositBalances(state.data.transactions, state.analysis.today).find((d) => d.id === id); if (d?.remaining) openTransaction({ type: 'income', group: 'income', category: d.category, note: `Hoàn cọc: ${d.note || d.category}`.slice(0, 1000), amount: d.remaining, date: state.analysis.today, flow: { kind: 'refund', targetId: d.id } }); }
  else if (action === 'reserve-in' || action === 'reserve-out') openTransaction({ type: action === 'reserve-in' ? 'expense' : 'income', group: action === 'reserve-in' ? 'savings_debt' : 'income', category: 'Quỹ để dành', note: action === 'reserve-in' ? 'Chuyển vào quỹ' : 'Rút từ quỹ', date: state.analysis.today, flow: { kind: action } });
  else if (action === 'pay-debt') { const debt = find('debts'); if (debt) openTransaction({ type: 'expense', group: 'savings_debt', category: 'Trả nợ', note: `Trả nợ: ${debt.name}`, amount: Math.min(debt.principal, debt.minMonthlyPayment) || '', date: state.analysis.today, flow: { kind: 'debt', targetId: debt.id } }); }
  else if (action === 'setup-import-debt') { openDebt({ name: 'Khoản nợ từ sổ Excel', principal: state.importHints.debt }); }
  else if (action === 'dismiss-import-hint') { state.importHints = null; render(); }
  else if (action === 'review-flow') { const t = find('transactions'); if (t) openTransaction({ ...t, flow: { kind: suggestFlow(t) } }); }
  else if (action === 'link-bill-payment') {
    const bill = find('recurring_bills'); if (!bill) return;
    const candidates = state.data.transactions.filter((t) => t.date.startsWith(state.analysis.month) && t.date <= state.analysis.today && t.type === 'expense' && kindOf(t) === 'regular' && ['needs', 'wants'].includes(t.group) && !t.flow?.billId).sort((x, y) => Number(y.category === bill.category) - Number(x.category === bill.category) || y.date.localeCompare(x.date));
    if (!candidates.length) { toast('Chưa có khoản chi phù hợp trong tháng. Chọn Ghi đã trả khi bạn thanh toán.'); return; }
    const form = document.getElementById('link-payment-form'); form.elements.billId.value = bill.id;
    form.elements.transactionId.innerHTML = '<option value="">Chọn khoản đã thanh toán</option>' + candidates.map((t) => `<option value="${E(t.id)}">${E(t.date.split('-').reverse().join('/'))} · ${E(t.note || t.category)} · ${formatVND(t.amount)}</option>`).join('');
    document.getElementById('link-payment-title').textContent = `Khoản đã trả: ${bill.name}`;
    document.getElementById('link-payment-dialog').showModal();
  }
  else if (action === 'import-excel') {
    await openExcelImporter({
      getExisting: () => state.data.transactions,
      onImport: async (records, options) => {
        let receipt;
        const ok = await mutation(async () => { receipt = await appendTransactions(records, options); });
        if (ok) {
          state.importHints = { debt: options.debtHint ?? null };
          state.filters = { month: options.openingBalance?.month || records.map((t) => t.date).sort().at(-1)?.slice(0, 7) || localDate().slice(0, 7), group: '', category: '', search: '' };
          state.page = 1; state.tab = 'transactions'; location.hash = 'transactions'; render();
          toast(`${receipt.imported ? `Đã nhập ${receipt.imported} khoản` : 'Không thêm khoản trùng'}${receipt.updated ? `, cập nhật cách phân loại ${receipt.updated} khoản cũ` : ''}${options.openingBalance ? '. Đã lưu tiền đầu tháng' : ''}${options.liquidSavings !== null ? '. Đã đối chiếu quỹ để dành' : ''}.`);
        }
        return ok;
      },
    });
  }
  else if (action === 'view-daily' || action === 'view-table') { state.ledgerView = action === 'view-daily' ? 'daily' : 'table'; state.page = 1; render(); }
  else if (action === 'edit-transaction') { const t = find('transactions'); if (t) openTransaction(t); }
  else if (action === 'add-bill') openBill();
  else if (action === 'edit-bill') { const b = find('recurring_bills'); if (b) openBill(b); }
  else if (action === 'add-debt') openDebt();
  else if (action === 'edit-debt') { const d = find('debts'); if (d) openDebt(d); }
  else if (action.startsWith('delete-')) {
    const store = action === 'delete-transaction' ? 'transactions' : action === 'delete-bill' ? 'recurring_bills' : 'debts';
    if (!find(store)) return;
    if (store === 'debts' && state.data.transactions.some((t) => t.flow?.kind === 'debt' && t.flow.targetId === id)) throw new Error('Khoản nợ đã có lần trả trong sổ. Giữ khoản nợ để xem đúng lịch sử; khi trả hết, số nợ sẽ về 0.');
    if (await confirmChange('Xóa mục này?', 'Các số dư liên quan sẽ được tính lại cùng với sổ thu chi.', 'Xóa mục này', true)) await mutation(() => store === 'transactions' ? saveTransaction(null, id) : deleteRecord(store, id), 'Đã xóa và cập nhật các số dư liên quan.');
  } else if (action === 'pay-bill') {
    const b = state.analysis.bills.find((x) => x.id === id);
    if (!b || b.paid) return;
    openTransaction({ id: '', type: 'expense', date: state.analysis.today, amount: b.remaining, group: b.group, category: b.category, isFixedBill: true, note: `Thanh toán: ${b.name}`, flow: { kind: 'regular', billId: b.id } });
  } else if (action === 'theme') {
    await mutation(() => putRecord('profile', { ...state.data.profile, theme: state.data.profile.theme === 'dark' ? 'light' : 'dark' }));
  } else if (action === 'seed-data') {
    const proceed = !state.data.transactions.length && !state.data.debts.length && !state.data.recurring_bills.length && !state.data.profile.liquidSavings || await confirmChange('Thử một bức tranh tài chính mẫu?', 'Dữ liệu mẫu sẽ thay thế toàn bộ sổ hiện tại. Hãy sao lưu trước nếu bạn muốn giữ các khoản đã ghi.', 'Nạp dữ liệu mẫu');
    if (proceed) await mutation(() => replaceData(createSeedData()), 'Đã nạp dữ liệu minh họa. Hãy thử xem Tổng quan và Phân tích.');
  } else if (action === 'clear-data') {
    if (await confirmChange('Bắt đầu một sổ hoàn toàn mới?', 'Toàn bộ giao dịch, hóa đơn, nợ, quỹ dự phòng và cài đặt sẽ bị xóa. Chỉ khôi phục được nếu bạn đã giữ tệp sao lưu.', 'Xóa toàn bộ', true)) {
      await mutation(() => replaceData({ transactions: [], recurring_bills: [], debts: [], profile: { ...DEFAULT_PROFILE } }), 'Sổ đã được làm mới. Bắt đầu từ khoản đầu tiên nhé.');
    }
  } else if (action === 'backup') {
    await mutation(async () => {
      const timestamp = Date.now(), profile = { ...state.data.profile, lastBackupAt: timestamp };
      const json = createBackup({ ...state.data, profile }, timestamp);
      download(`vung-tai-chinh-${localDate()}.json`, json, 'application/json;charset=utf-8');
      await putRecord('profile', profile);
    }, 'Đã tạo tệp sao lưu. Kiểm tra thư mục tải xuống trên máy bạn.');
  } else if (action === 'restore') document.getElementById('restore-file').click();
  else if (action === 'export-csv') { download(`so-thu-chi-${localDate()}.csv`, createCSV(state.data.transactions), 'text/csv;charset=utf-8'); toast('Đã xuất báo cáo CSV có đầy đủ dấu tiếng Việt.'); }
  else if (action === 'persist') { state.storage = await storageStatus(true); render(); toast(state.storage.persistent ? 'Đã được cấp lưu trữ bền vững.' : 'Trình duyệt chưa cấp quyền. Hãy giữ bản sao lưu định kỳ.'); }
  else if (action === 'install') await install();
  else if (action === 'dismiss-install') { state.installDismissed = true; try { sessionStorage.setItem('vung-install-dismissed', '1'); } catch { /* Nonessential preference. */ } render(); }
  else if (action === 'prev-page') { state.page = Math.max(1, state.page - 1); render(); }
  else if (action === 'next-page') { state.page++; render(); }
}

document.addEventListener('click', (event) => {
  const close = event.target.closest('[data-close-dialog]'); if (close) { close.closest('dialog').close(); return; }
  const quick = event.target.closest('[data-amount]'); if (quick) { document.getElementById('transaction-form').elements.amount.value = quick.dataset.amount; return; }
  const type = event.target.closest('[data-tx-type]'); if (type) { transactionType(type.dataset.txType); return; }
  const shortcut = event.target.closest('[data-category-shortcut]'); if (shortcut) { const form = document.getElementById('transaction-form'); form.elements.category.value = shortcut.dataset.categoryShortcut; form.elements.group.value = shortcut.dataset.group; flowFields(form.elements.targetId.value); return; }
  const action = event.target.closest('[data-action]'); if (action) handleAction(action.dataset.action, action.dataset.id, action.dataset).catch((e) => toast(e.message, true));
});
document.getElementById('theme-toggle').addEventListener('click', () => handleAction('theme'));
document.addEventListener('change', (event) => {
  const el = event.target;
  if (el.matches('#bill-form [name=group]')) updateCategories(el.form);
  if (el.matches('#transaction-form [name=category]')) {
    const form = el.form, habit = categoryHabits(state.data.transactions, form.elements.type.value).find((h) => h.category === el.value);
    const known = Object.entries(CATEGORIES).find(([, cats]) => cats.includes(el.value))?.[0];
    if (form.elements.type.value !== 'income') form.elements.group.value = habit?.group || (known === 'income' ? 'needs' : known) || 'needs';
    flowFields(form.elements.targetId.value);
  }
  if (el.matches('#transaction-form [name=group]')) flowFields(el.form.elements.targetId.value);
  if (el.matches('#transaction-form [name=note]') && !el.form.elements.category.value) {
    const previous = [...state.data.transactions].filter((t) => t.type === el.form.elements.type.value && t.note === el.value).sort((x, y) => y.date.localeCompare(x.date))[0];
    if (previous) { el.form.elements.category.value = previous.category; el.form.elements.group.value = previous.group; }
  }
  if (el.id === 'tx-flow-kind' || el.matches('#transaction-form [name=date]')) flowFields(el.form.elements.targetId.value);
  if (el.matches('#transaction-form [name=isFixedBill]')) { if (!el.checked) el.form.elements.billId.value = ''; billFields(el.form.elements.billId.value); }
  if (el.id === 'tx-bill-target') el.form.elements.billId.value = el.value;
  if (el.id === 'focus-month' || el.id === 'filter-month') {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(el.value) || el.value > localDate().slice(0, 7)) { toast('Chọn tháng hiện tại hoặc một tháng trước đó.'); render(); return; }
    state.filters.month = el.value; state.filters.allMonths = false; if (state.filters.through) state.filters.through = localDate(dateForMonth(el.value)); state.page = 1; render(); return;
  }
  if (el.id === 'filter-all-months') { state.filters.allMonths = el.checked; state.page = 1; render(); return; }
  const filters = { 'filter-month': 'month', 'filter-group': 'group', 'filter-category': 'category' };
  if (Object.hasOwn(filters, el.id)) { state.filters[filters[el.id]] = el.value; if (el.id === 'filter-group') state.filters.category = ''; state.page = 1; render(); }
});
document.addEventListener('input', (event) => {
  const el = event.target;
  if (el.id === 'filter-search') {
    state.filters.search = el.value; state.page = 1;
    const template = document.createElement('template');
    template.innerHTML = renderTransactions(state.data, state.analysis, state.filters, state.page, state.ledgerView);
    // Preserve the actual search input, caret, and IME composition while typing.
    document.getElementById('ledger-results').replaceChildren(...template.content.querySelector('#ledger-results').childNodes);
  }
  if (el.id === 'extra-payment') { state.extraPayment = Math.max(0, Math.round(Number(el.value) || 0)); updateSimulation(); }
});
document.addEventListener('submit', async (event) => {
  const form = event.target;
  // Named form controls can shadow native properties (including an input named "id").
  const formId = form.getAttribute('id');
  if (!['transaction-form', 'bill-form', 'debt-form', 'profile-form', 'opening-balance-form', 'link-payment-form'].includes(formId)) return;
  event.preventDefault();
  const values = new FormData(form), value = (key) => String(values.get(key) ?? ''), amount = (key) => Math.round(Number(value(key)));
  if (formId === 'link-payment-form') {
    const transaction = state.data.transactions.find((t) => t.id === value('transactionId'));
    if (!transaction || !state.data.recurring_bills.some((b) => b.id === value('billId'))) { toast('Khoản chi hoặc hóa đơn đã thay đổi. Mở lại để chọn.', true); return; }
    const ok = await mutation(() => saveTransaction({ ...transaction, isFixedBill: true, flow: { kind: 'regular', billId: value('billId') } }), 'Đã gắn khoản đã ghi. Số tiền trong sổ giữ nguyên.');
    if (ok) form.closest('dialog').close(); return;
  }
  if (formId === 'opening-balance-form') {
    await mutation(() => putRecord('profile', { ...state.data.profile, openingBalances: { ...(state.data.profile.openingBalances || {}), [value('month')]: { bank: amount('bank'), cash: amount('cash') } } }), 'Đã lưu tiền có sẵn đầu tháng, tách riêng với thu nhập mới.'); return;
  }
  if (formId === 'profile-form') {
    await mutation(() => putRecord('profile', { ...state.data.profile, liquidSavings: amount('liquidSavings'), paydayDay: amount('paydayDay'), incomeModeOverride: value('incomeModeOverride') }), 'Đã cập nhật quỹ dự phòng và kế hoạch.'); return;
  }
  let store, record;
  const id = value('id') || uuid();
  if (formId === 'transaction-form') {
    store = 'transactions'; const existing = state.data.transactions.find((t) => t.id === id);
    record = { id, type: value('type'), date: value('date'), amount: amount('amount'), group: value('group'), category: value('category'), isFixedBill: values.get('isFixedBill') === 'on', note: value('note'), createdAt: existing?.createdAt || Date.now() };
    const kind = value('flowKind');
    if (kind !== 'regular') record.flow = { kind, ...(value('targetId') && ['refund', 'debt'].includes(kind) ? { targetId: value('targetId') } : {}), ...(kind === 'debt' ? { principal: amount('principal') } : {}) };
    else if (record.isFixedBill && value('billId')) record.flow = { kind, billId: value('billId') };
  } else if (formId === 'bill-form') {
    store = 'recurring_bills'; record = { id, name: value('name'), amount: amount('amount'), dueDay: amount('dueDay'), group: value('group'), category: value('category'), active: values.get('active') === 'on' };
  } else {
    store = 'debts'; record = { id, name: value('name'), principal: amount('principal'), apr: Number(value('apr')), minMonthlyPayment: amount('minMonthlyPayment'), isHighInterest: Number(value('apr')) > 10 };
  }
  const error = document.getElementById(formId.replace('-form', '-error')); error.hidden = true;
  const ok = await mutation(() => store === 'transactions' ? saveTransaction(record) : putRecord(store, record), 'Đã lưu vào sổ và cập nhật các số liên quan.');
  if (ok) form.closest('dialog').close(); else { error.textContent = 'Chưa thể lưu. Kiểm tra các trường và thử lại; dữ liệu cũ vẫn được giữ.'; error.hidden = false; }
});
document.getElementById('restore-file').addEventListener('change', async (event) => {
  const file = event.target.files[0]; event.target.value = ''; if (!file) return;
  try {
    if (file.size > 20 * 1024 * 1024) throw new Error('Tệp sao lưu quá lớn (tối đa 20 MB).');
    const parsed = JSON.parse(await file.text()), clean = validateBackup(parsed);
    if (await confirmChange('Khôi phục từ bản sao lưu?', `Tệp chứa ${clean.transactions.length} giao dịch, ${clean.recurring_bills.length} hóa đơn và ${clean.debts.length} khoản nợ. Toàn bộ dữ liệu hiện có sẽ được thay thế.`, 'Khôi phục dữ liệu')) await mutation(() => replaceData(clean), 'Đã khôi phục đầy đủ dữ liệu.');
  } catch (error) { toast(error instanceof SyntaxError ? 'Tệp JSON không đọc được. Hãy chọn đúng tệp sao lưu.' : error.message, true); }
});
window.addEventListener('hashchange', navigate);
window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); installPrompt = event; });
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState !== 'visible' || !state.data || document.querySelector('dialog[open]') || state.busy) return;
  try {
    const fresh = await readData();
    if (JSON.stringify(fresh) === JSON.stringify(state.data) && calendarDay === localDate()) return;
    if (document.querySelector('dialog[open]') || state.busy || document.activeElement?.matches('input, textarea, select')) return;
    state.filters.month = monthAfterDayChange(state.filters.month, calendarDay, localDate()); calendarDay = localDate();
    state.data = fresh; state.storage = await storageStatus(); render();
  } catch (error) { toast(error.message, true); }
});
async function boot() {
  fillIcons();
  document.getElementById('today-label').textContent = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  state.storage = await initDB(); state.data = await readData(); navigate();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js').catch(() => { toast('Chưa bật được chế độ ngoại tuyến. Bạn vẫn có thể dùng khi có mạng.'); });
  setInterval(() => { if (calendarDay !== localDate() && !document.querySelector('dialog[open]')) { state.filters.month = monthAfterDayChange(state.filters.month, calendarDay, localDate()); calendarDay = localDate(); refresh().catch((e) => toast(e.message, true)); } }, 30000);
}
boot().catch((error) => { content.replaceChildren(); const box = document.createElement('div'); box.className = 'banner warning'; box.textContent = `Chưa mở được sổ thu chi. ${error.message} Hãy tải lại trang hoặc thử trình duyệt khác.`; content.append(box); });
