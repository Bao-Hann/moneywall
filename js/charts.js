import { monthKeys, sum } from './finance-engine.js';
import { formatVND } from './ui.js';

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
  const date = new Date(`${a.today}T12:00:00`);
  if (tab === 'overview' || tab === 'analysis') {
    const months = monthKeys(date, 6), totals = [...a.history, a.current];
    const income = months.map((k) => totals.find((m) => m.month === k)?.income || 0);
    const expenses = months.map((k) => totals.find((m) => m.month === k)?.spent || 0);
    draw('cashflow-chart', { type: 'bar', data: {
      labels: months.map((k) => `Thg ${Number(k.slice(5))}`),
      datasets: [
        { label: 'Thu nhập', data: income, backgroundColor: '#247a58', borderRadius: 4, maxBarThickness: 23 },
        { label: 'Chi tiêu', data: expenses, backgroundColor: '#bed7c7', borderRadius: 4, maxBarThickness: 23 },
        { label: 'Dự báo cuối tháng', data: months.map((k) => k === a.month && data.transactions.length ? a.forecast.blendedEomForecast : null), backgroundColor: '#f5e6ce', borderColor: '#c59650', borderWidth: 1, borderRadius: 4, maxBarThickness: 23 },
      ],
    } });
    const scores = a.health.scores;
    draw('health-chart', { type: 'bar', data: { labels: ['Tiết kiệm', 'Quỹ dự phòng', 'Chi cố định', 'Kiểm soát nợ', 'Chi mong muốn'], datasets: [{ label: 'Điểm', data: data.transactions.length ? [scores.sSavings, scores.sRunway, scores.sFixed, scores.sDebt, scores.sControl] : [0, 0, 0, 0, 0], backgroundColor: ['#247a58', '#78a98c', '#a5c0ae', '#b9c7a2', '#d4deb9'], borderRadius: 4, barThickness: 10 }] }, options: { indexAxis: 'y', scales: { x: { min: 0, max: 100, border: { display: false }, grid: { display: false }, ticks: { stepSize: 25, font: { size: 11 } } }, y: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, padding: 8 } } }, plugins: { tooltip: { callbacks: { label: (c) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(c.parsed.x)} / 100 điểm` } } } } });
  }
  if (tab === 'analysis') {
    const categories = new Map();
    for (const t of a.currentTs) if (t.type === 'expense' && ['needs', 'wants'].includes(t.group)) categories.set(t.category, (categories.get(t.category) || 0) + t.amount);
    const entries = [...categories].sort((x, y) => y[1] - x[1]);
    draw('category-chart', { type: 'doughnut', data: { labels: entries.map((x) => x[0]), datasets: [{ label: 'Chi tiêu', data: entries.map((x) => x[1]), backgroundColor: ['#247a58', '#78a98c', '#aecbba', '#d4deb9', '#c79651', '#8aa8bf', '#c2a6b2', '#91a575', '#8dbbb2', '#d9c28f'], borderWidth: 3, borderColor: getComputedStyle(document.documentElement).getPropertyValue('--surface').trim(), hoverOffset: 5 }] }, options: { cutout: '70%', scales: {}, plugins: { legend: { display: true, position: 'right', labels: { boxWidth: 9, boxHeight: 9, padding: 12, font: { size: 11 } } } } } });
    let accumulated = 0;
    const actual = Array.from({ length: a.daysInMonth }, (_, i) => {
      if (i + 1 > a.elapsedDays) return null;
      accumulated += sum(a.currentTs.filter((t) => t.type === 'expense' && !t.isFixedBill && ['needs', 'wants'].includes(t.group) && Number(t.date.slice(8)) === i + 1).map((t) => t.amount));
      return accumulated;
    });
    draw('daily-chart', { type: 'line', data: { labels: Array.from({ length: a.daysInMonth }, (_, i) => i + 1), datasets: [{ label: 'Đã chi', data: actual, borderColor: '#247a58', backgroundColor: '#247a5810', borderWidth: 2, fill: true, pointRadius: 0, tension: .25 }, { label: 'Mức chi đều', data: actual.map((_, i) => Math.round(a.safe.variableBudgetTotal / a.daysInMonth * (i + 1))), borderColor: '#c59650', borderDash: [4, 4], borderWidth: 1.5, pointRadius: 0 }] }, options: { plugins: { legend: { display: true, position: 'bottom', labels: { usePointStyle: true, pointStyle: 'line', boxWidth: 20, padding: 20, font: { size: 11 } } } } } });
  }
}
