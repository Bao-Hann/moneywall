import { localDate } from './finance-engine.js';

const paths = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  wallet: '<path d="M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v11H5a3 3 0 0 1-3-3V6"/><path d="M20 12h-5v5h5"/><path d="M17 14.5h.01"/>',
  chart: '<path d="M4 3v17h17M8 15v-4m5 4V6m5 9v-6"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  settings: '<path d="m9 3-1 3-3 1-2 3 2 2-1 3 3 2 1 3h4l1-3 3-1 2-3-2-2 1-3-3-2-1-3H9Z"/><circle cx="10" cy="11" r="3"/>',
  sprout: '<path d="M12 21v-9M12 16C5 16 3 12 3 7c6 0 9 3 9 9Zm0-5c0-5 3-8 9-8 0 6-3 9-9 9"/>',
  moon: '<path d="M20.8 13a9 9 0 0 1-9.8-9.8A9 9 0 1 0 20.8 13Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-14 4h3m4 0h3"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/><path d="M3 11h5l2-4 3 8 2-4h6"/>',
  leaf: '<path d="M20 3c-1 9-3 17-11 17a6 6 0 0 1-6-6c0-8 9-10 17-11ZM3 21 15 9"/>',
  sparkles: '<path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7L12 3Z"/>',
  edit: '<path d="m16 3 5 5L8 21H3v-5L16 3Zm-3 3 5 5"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  coffee: '<path d="M3 8h13v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Zm13 1h2a3 3 0 0 1 0 6h-2M6 2v2m4-2v2m4-2v2"/>',
  bag: '<path d="M4 7h16l1 14H3L4 7Zm4 0V5a4 4 0 0 1 8 0v2"/>',
  home: '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>',
  receipt: '<path d="m5 3 3 2 4-2 4 2 3-2v18l-3-2-4 2-4-2-3 2V3Zm3 6h8m-8 4h8m-8 4h4"/>',
  alert: '<path d="m12 3 10 18H2L12 3Zm0 6v5m0 3v.01"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
  upload: '<path d="M12 15V3m-4 4 4-4 4 4M4 16v5h16v-5"/>',
  laptop: '<rect x="4" y="3" width="16" height="13" rx="1.5"/><path d="m4 16-3 5h22l-3-5M9 18h6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
};
export const icon = (name, extra = '') => `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.wallet}</svg>`;
export function fillIcons(root = document) { root.querySelectorAll('[data-icon]').forEach((el) => { el.replaceWith(createIcon(el.dataset.icon)); }); }
function createIcon(name) { const span = document.createElement('span'); span.innerHTML = icon(name); return span.firstElementChild; }
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const E = escapeHtml;
export const formatVND = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Math.round(Number.isFinite(value) ? value : 0));
export const N = (value, decimals = 1) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: decimals }).format(Number.isFinite(value) ? value : 0);
export const formatMonth = (key) => `Tháng ${Number(key.slice(5))}, ${key.slice(0, 4)}`;
export const dateText = (d) => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;
export const categoryIcon = (category, group) => group === 'income' ? 'wallet' : category.includes('Cafe') ? 'coffee' : category.includes('nhà') ? 'home' : category.includes('Mua') ? 'bag' : group === 'savings_debt' ? 'sprout' : 'receipt';
export const btn = (label, action, cls = 'primary', symbol = '', attrs = '') => `<button class="button ${cls}" data-action="${action}" ${attrs}>${symbol ? icon(symbol) : ''}${label}</button>`;
export const empty = (title, text, action = '') => `<div class="empty-state">${icon('sprout')}<h3>${title}</h3><p>${text}</p>${action}</div>`;
export const canvas = (id, label, small = false) => `<div class="chart-wrap${small ? ' small' : ''}"><canvas id="${id}" role="img" aria-label="${E(label)}"></canvas></div>`;
export function heading(title, subtitle, a, primary = true) {
  return `<div class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="heading-actions"><label class="month-picker">${icon('calendar')}<input type="month" id="focus-month" aria-label="Tháng đang xem" max="${localDate().slice(0, 7)}" value="${a.month}"></label>${primary ? btn('Ghi thu chi', 'add-transaction', 'primary', 'plus') : ''}</div></div>`;
}

export function ledgerButton(label, category = '', extra = '', cls = 'text-link') {
  return btn(E(label), 'open-ledger', cls, '', `data-category="${E(category)}" ${category ? 'data-scope="everyday"' : ''} ${extra}`);
}
export const CATEGORY_COLORS = ['#247a58', '#78a98c', '#a9c5b3', '#cbd7af', '#c79651', '#8aa8bf', '#c2a6b2', '#91a575', '#8dbbb2', '#d9c28f'];
export function categoryList(m, limit = 8) {
  return m.categories.length ? `<div class="category-breakdown">${m.categories.slice(0, limit).map((c, i) => {
    const ratio = m.everyday ? c.amount / m.everyday * 100 : 0, color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
    return `<button class="category-line" data-action="open-ledger" data-scope="everyday" data-category="${E(c.category)}"><span class="category-line-head"><span>${E(c.category)} <small>${c.count} khoản · ${N(ratio, 1)}%</small></span><strong class="money">${formatVND(c.amount)}</strong></span><span class="category-track"><i style="width:${ratio}%;--bar-color:${color}"></i></span></button>`;
  }).join('')}</div>` : '<p class="helper-text">Chưa có khoản chi sinh hoạt trong tháng này.</p>';
}
