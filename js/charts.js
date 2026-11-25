import { sum } from './finance-engine.js';
import { financePlanSummary, monthlyMoney } from './money-flow.js';
import { formatVND, CATEGORY_COLORS } from './ui-parts.js';

const instances = new Map();
export function destroyCharts() { for (const chart of instances.values()) chart.destroy(); instances.clear(); }
function draw(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  if (instances.has(id)) { instances.get(id).destroy(); instances.delete(id); }
  if (!globalThis.Chart) {
    const fallback = document.createElement('div'); fallback.className = 'no-chart';
    fallback.textContent = 'Biểu đồ sẽ xuất hiện khi tải được thư viện. Các chỉ số vẫn được cập nhật.';
    canvas.replaceWith(fallback); return;
  }
  const css = getComputedStyle(document.documentElement), ink = css.getPropertyValue('--muted').trim(), line = css.getPropertyValue('--line').trim();
  Chart.defaults.font.family = "'Be Vietnam Pro', system-ui, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = ink;
  const base = {
    responsive: true, maintainAspectRatio: false,
    animation: matchMedia('(prefers-reduced-motion: reduce)').matches ? false : { duration: 300 },
    interaction: { intersect: false, mode: 'index' },
    plugins: { legend: { display: false }, tooltip: { padding: 12, backgroundColor: '#1c302b', titleFont: { size: 12 }, bodyFont: { size: 12 }, callbacks: { label: (context) => `${context.dataset.label || context.label}: ${formatVND(typeof context.parsed === 'number' ? context.parsed : context.parsed.y)}` } } },
    scales: { x: { grid: { display: false }, border: { display: false }, ticks: { maxRotation: 0 } }, y: { beginAtZero: true, suggestedMax: 1000000, border: { display: false }, grid: { color: line, drawTicks: false }, ticks: { padding: 10, callback: (v) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(v / 1000000) } } },
  };
  instances.set(id, new Chart(canvas, { ...config, options: { ...base, ...(config.options || {}), plugins: { ...base.plugins, ...(config.options?.plugins || {}) } } }));
}
export function renderCharts(tab, data, a) {
  destroyCharts();
  if (tab !== 'analysis') return;
  const m = monthlyMoney(data, a), p = financePlanSummary(data, a, m);
  if (document.getElementById('cashflow-chart')) {
    const months = p.recentMonths;
    draw('cashflow-chart', { type: 'bar', data: {
      labels: months.map((row) => `Thg ${Number(row.month.slice(5))}/${row.month.slice(2, 4)}`),
      datasets: [
        { label: 'Thu nhập mới', data: months.map((row) => row.income), backgroundColor: '#247a58', borderRadius: 4, maxBarThickness: 28 },
        { label: 'Chi sinh hoạt', data: months.map((row) => row.spent), backgroundColor: '#aac8b5', borderRadius: 4, maxBarThickness: 28 },
        { label: 'Dự báo cuối tháng', data: months.map((row) => row.month === a.month && p.canForecast ? a.forecast.blendedEomForecast : null), backgroundColor: '#ecd5ae', borderColor: '#c59650', borderWidth: 1, borderRadius: 4, maxBarThickness: 28 },
      ],
    }, options: { plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, padding: 18 } } } } });
  }
  if (document.getElementById('category-chart')) {
    const entries = m.categories;
    draw('category-chart', { type: 'doughnut', data: { labels: entries.map((c) => c.category), datasets: [{ label: 'Chi sinh hoạt', data: entries.map((c) => c.amount), backgroundColor: entries.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]), borderWidth: 3, borderColor: getComputedStyle(document.documentElement).getPropertyValue('--surface').trim(), hoverOffset: 4 }] }, options: { cutout: '72%', scales: {}, interaction: { intersect: true, mode: 'nearest' } } });
  }
  if (document.getElementById('daily-chart')) {
    let accumulated = 0;
    const actual = Array.from({ length: a.daysInMonth }, (_, i) => {
      if (i + 1 > a.elapsedDays) return null;
      accumulated += sum(a.currentTs.filter((t) => t.type === 'expense' && !t.isFixedBill && ['needs', 'wants'].includes(t.group) && Number(t.date.slice(8)) === i + 1).map((t) => t.amount));
      return accumulated;
    });
    const datasets = [{ label: 'Đã chi ngoài hóa đơn', data: actual, borderColor: '#247a58', backgroundColor: '#247a5810', borderWidth: 2, fill: true, pointRadius: 0, tension: .15 }];
    if (p.canPlan) datasets.push({ label: 'Mức chi đều theo kế hoạch', data: actual.map((_, i) => Math.round(a.safe.variableBudgetTotal / a.daysInMonth * (i + 1))), borderColor: '#c59650', borderDash: [4, 4], borderWidth: 1.5, pointRadius: 0 });
    draw('daily-chart', { type: 'line', data: { labels: Array.from({ length: a.daysInMonth }, (_, i) => i + 1), datasets }, options: { plugins: { legend: { display: true, position: 'bottom', labels: { usePointStyle: true, pointStyle: 'line', boxWidth: 20, padding: 18, font: { size: 12 } } } } } });
  }
}
