# Mã nguồn đầy đủ — Vững Tài Chính

Các tệp dưới đây được xuất nguyên văn theo đúng thứ tự bản yêu cầu.

### File: .nojekyll

```

```

### File: index.html

```html
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0f6f50">
  <meta name="description" content="Một góc nhỏ để hiểu tiền của bạn. Ghi thu chi, đặt mục tiêu và xây nền tài chính vững vàng, ngay trên laptop.">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>Vững Tài Chính · Tiền rõ ràng, sống nhẹ nhàng</title>
  <link rel="icon" type="image/svg+xml" href="./icon.svg">
  <link rel="apple-touch-icon" href="./icon.svg">
  <link rel="manifest" href="./manifest.webmanifest">
  <link rel="stylesheet" href="./css/styles.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js" defer onerror="window.chartLoadFailed=true"></script>
  <script type="module" src="./js/app.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Đến nội dung chính</a>
  <aside class="sidebar">
    <a class="brand" href="#overview" aria-label="Vững Tài Chính, trang tổng quan">
      <span class="brand-icon"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M8 28V18h6v10m6 0V11h6v17m6 0V6" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="m8 12 11-6" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span>
      <span>vững<span class="brand-sub">TÀI CHÍNH</span></span>
    </a>
    <div class="nav-caption">GÓC TÀI CHÍNH CỦA BẠN</div>
    <nav class="main-nav" aria-label="Điều hướng chính">
      <a href="#overview" data-tab="overview" class="nav-link active"><span data-icon="grid"></span><span>Tổng quan</span></a>
      <a href="#transactions" data-tab="transactions" class="nav-link"><span data-icon="wallet"></span><span>Sổ thu chi</span></a>
      <a href="#analysis" data-tab="analysis" class="nav-link"><span data-icon="chart"></span><span>Phân tích</span><span class="nav-count" id="nav-alert-count" hidden></span></a>
      <a href="#planning" data-tab="planning" class="nav-link"><span data-icon="layers"></span><span>Nợ & Quỹ dự phòng</span></a>
      <a href="#settings" data-tab="settings" class="nav-link"><span data-icon="settings"></span><span>Sao lưu & Cài đặt</span></a>
    </nav>
    <div class="sidebar-bottom">
      <div class="sidebar-note"><span data-icon="sprout"></span><strong>Mỗi ngày một chút,<br>vững vàng hơn một bước.</strong><p>Những lựa chọn nhỏ hôm nay tạo nên sự an tâm ngày mai.</p></div>
      <button class="theme-button" id="theme-toggle"><span data-icon="moon"></span><span>Giao diện tối</span></button>
      <div class="local-status"><span data-icon="shield"></span>Dữ liệu riêng, lưu trên máy bạn</div>
    </div>
  </aside>

  <div class="app-shell">
    <header class="topbar"><div class="breadcrumb">Không gian cá nhân <span>/</span> <strong id="breadcrumb-title">Tổng quan</strong></div><div class="topbar-right"><span class="date-label" id="today-label"></span><span class="avatar" aria-label="Tài khoản cá nhân">B</span></div></header>
    <main id="main" tabindex="-1">
      <div id="storage-warning" class="banner warning" role="status" hidden></div>
      <div id="chart-warning" class="banner" hidden>Biểu đồ chưa tải được. Bạn vẫn có thể ghi thu chi và xem mọi chỉ số. Kết nối mạng rồi tải lại để xem biểu đồ.</div>
      <div id="app-content"><div class="loading-state">Đang mở góc tài chính của bạn…</div></div>
    </main>
    <footer class="page-footer"><span>Vững Tài Chính</span><span>Tiền rõ ràng. Sống nhẹ nhàng.</span></footer>
  </div>

  <dialog id="transaction-dialog" class="form-dialog" aria-labelledby="transaction-dialog-title">
    <form id="transaction-form" method="dialog">
      <div class="dialog-header"><div><span class="eyebrow">THÊM MỘT CHÚT RÕ RÀNG</span><h2 id="transaction-dialog-title">Ghi một giao dịch</h2></div><button type="button" class="icon-button" data-close-dialog aria-label="Đóng"><span data-icon="close"></span></button></div>
      <input type="hidden" name="id">
      <div class="type-switch" role="group" aria-label="Loại giao dịch"><button type="button" data-tx-type="expense" class="selected">Khoản chi</button><button type="button" data-tx-type="income">Khoản thu</button></div>
      <input type="hidden" name="type" value="expense">
      <label class="amount-field">Số tiền <span class="required">*</span><span class="amount-input"><input name="amount" inputmode="numeric" type="number" min="1" max="9000000000000" step="1" placeholder="0" required><span>₫</span></span></label>
      <div class="quick-amounts" aria-label="Chọn nhanh số tiền"><button type="button" data-amount="30000">30.000</button><button type="button" data-amount="50000">50.000</button><button type="button" data-amount="100000">100.000</button><button type="button" data-amount="200000">200.000</button><button type="button" data-amount="500000">500.000</button></div>
      <div class="form-grid"><label>Nhóm chi tiêu<select name="group" id="tx-group"><option value="needs">Thiết yếu</option><option value="wants">Mong muốn</option><option value="savings_debt">Tiết kiệm & Trả nợ</option></select></label><label>Danh mục<select name="category" id="tx-category"></select></label></div>
      <div class="form-grid"><label>Ngày giao dịch<input name="date" type="date" required></label><label class="checkbox-label"><input name="isFixedBill" type="checkbox">Đây là hóa đơn cố định</label></div>
      <label>Ghi chú <span class="optional">(không bắt buộc)</span><input name="note" maxlength="1000" placeholder="Khoản này dành cho điều gì?"></label>
      <p class="form-error" role="alert" id="transaction-error" hidden></p>
      <div class="dialog-actions"><button type="button" class="button secondary" data-close-dialog>Để sau</button><button type="submit" class="button primary"><span data-icon="check"></span>Lưu giao dịch</button></div>
    </form>
  </dialog>

  <dialog id="bill-dialog" class="form-dialog" aria-labelledby="bill-dialog-title"><form id="bill-form" method="dialog">
    <div class="dialog-header"><h2 id="bill-dialog-title">Hóa đơn cố định</h2><button type="button" class="icon-button" data-close-dialog aria-label="Đóng"><span data-icon="close"></span></button></div>
    <input type="hidden" name="id"><label>Tên hóa đơn<input name="name" maxlength="200" required placeholder="Ví dụ: Tiền thuê nhà"></label>
    <div class="form-grid"><label>Số tiền mỗi tháng (₫)<input name="amount" type="number" min="1" max="9000000000000" step="1" required></label><label>Ngày đến hạn<input name="dueDay" type="number" min="1" max="31" required value="1"></label></div>
    <div class="form-grid"><label>Nhóm<select name="group"><option value="needs">Thiết yếu</option><option value="wants">Mong muốn</option></select></label><label>Danh mục<select name="category"></select></label></div>
    <label class="checkbox-label"><input type="checkbox" name="active" checked>Tính vào kế hoạch chi tiêu hằng tháng</label>
    <p class="form-error" role="alert" id="bill-error" hidden></p><div class="dialog-actions"><button type="button" class="button secondary" data-close-dialog>Hủy</button><button class="button primary" type="submit">Lưu hóa đơn</button></div>
  </form></dialog>

  <dialog id="debt-dialog" class="form-dialog" aria-labelledby="debt-dialog-title"><form id="debt-form" method="dialog">
    <div class="dialog-header"><h2 id="debt-dialog-title">Khoản nợ</h2><button type="button" class="icon-button" data-close-dialog aria-label="Đóng"><span data-icon="close"></span></button></div>
    <input type="hidden" name="id"><label>Tên khoản nợ<input name="name" maxlength="200" required placeholder="Ví dụ: Thẻ tín dụng"></label>
    <label>Số dư nợ hiện tại (₫)<input name="principal" type="number" min="0" max="9000000000000" step="1" required></label>
    <div class="form-grid"><label>Lãi suất (%/năm)<input name="apr" type="number" min="0" max="1000" step="0.01" required></label><label>Trả tối thiểu/tháng (₫)<input name="minMonthlyPayment" type="number" min="0" max="9000000000000" step="1" required></label></div>
    <p class="helper-text">Các khoản nợ có lãi trên 10%/năm sẽ được ưu tiên trong chiến lược trả nợ.</p>
    <p class="form-error" role="alert" id="debt-error" hidden></p><div class="dialog-actions"><button type="button" class="button secondary" data-close-dialog>Hủy</button><button class="button primary" type="submit">Lưu khoản nợ</button></div>
  </form></dialog>

  <dialog id="confirm-dialog" class="confirm-dialog" aria-labelledby="confirm-title"><form method="dialog"><span class="confirm-icon" data-icon="shield"></span><h2 id="confirm-title">Xác nhận thay đổi</h2><p id="confirm-description"></p><div class="dialog-actions"><button class="button secondary" value="cancel">Giữ nguyên</button><button class="button primary" value="confirm" id="confirm-button">Xác nhận</button></div></form></dialog>
  <dialog id="install-dialog" class="confirm-dialog" aria-labelledby="install-title"><form method="dialog"><h2 id="install-title">Mở nhanh ngay trên máy bạn</h2><p>Trên Chrome hoặc Edge, mở menu trình duyệt → Truyền, lưu và chia sẻ → Cài đặt trang dưới dạng ứng dụng. Khi đã cài, bạn có thể ghim ứng dụng lên thanh tác vụ.</p><p>Trên iPhone: Chia sẻ → Thêm vào Màn hình chính. Cách này giúp giảm nguy cơ dữ liệu bị dọn khi lâu không dùng; sao lưu JSON vẫn là cách bảo vệ chắc chắn hơn.</p><button class="button primary">Đã hiểu</button></form></dialog>
  <input type="file" id="restore-file" accept=".json,application/json" hidden>
  <div id="toast" class="toast" role="status" aria-live="polite" hidden></div>
  <noscript><div class="banner warning">Hãy bật JavaScript để ghi thu chi và lưu dữ liệu trên máy.</div></noscript>
</body>
</html>
```

### File: manifest.webmanifest

```json
{
  "id": "./",
  "name": "Vững Tài Chính",
  "short_name": "Vững",
  "description": "Tiền rõ ràng. Sống nhẹ nhàng.",
  "lang": "vi",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#f5f7f6",
  "theme_color": "#0f6f50",
  "icons": [{ "src": "./icon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any maskable" }]
}
```

### File: sw.js

```javascript
const CACHE = 'vung-tai-chinh-v1';
const STATIC = ['./', './index.html', './css/styles.css', './js/app.js', './js/ui.js', './js/db.js', './js/finance-engine.js', './js/charts.js', './js/seed-data.js', './manifest.webmanifest', './icon.svg'];
const CHART_URL = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(STATIC);
    try { const response = await fetch(CHART_URL, { mode: 'cors' }); if (response.ok) await cache.put(CHART_URL, response); } catch { /* The application still works without charts. */ }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => { for (const name of await caches.keys()) if (name.startsWith('vung-tai-chinh-') && name !== CACHE) await caches.delete(name); await self.clients.claim(); })());
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin && event.request.url !== CHART_URL) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (event.request.url === CHART_URL) {
      const saved = await cache.match(event.request);
      if (saved) return saved;
      try { const response = await fetch(event.request); if (response.ok) await cache.put(event.request, response.clone()); return response; } catch { return Response.error(); }
    }
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      return await cache.match(event.request) || (event.request.mode === 'navigate' ? await cache.match('./index.html') : null) || new Response('Tài nguyên chưa có khi ngoại tuyến.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
```

### File: css/styles.css

```css
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;450;500;550;600;650;700;750;800&display=swap');

:root{color-scheme:light;--bg:#f5f7f6;--surface:#fff;--surface-soft:#fafcfb;--ink:#1c302b;--muted:#73817b;--line:#e5ebe8;--green:#0f6f50;--green-dark:#10523f;--mint:#eaf5ee;--lime:#c6f5ad;--blue:#6288ce;--blue-soft:#edf3fc;--orange:#cc8a3b;--orange-soft:#fff4e5;--red:#c95757;--red-soft:#fceeee;--shadow:0 4px 22px #183d2810;--sidebar:242px;--radius:18px;font-family:'Be Vietnam Pro',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);line-height:1.6;font-size:14px}button,input,select,textarea{font:inherit}button,a,input,select{touch-action:manipulation}button{cursor:pointer}button:disabled{cursor:wait;opacity:.55}a{color:var(--green);text-decoration:none}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:3px solid var(--blue);outline-offset:3px}button{border:0}svg{display:block}h1,h2,h3,p{margin-top:0}h1{font-size:28px;letter-spacing:-1px;line-height:1.3;font-weight:650;margin-bottom:9px}h2{font-size:18px;letter-spacing:-.35px;font-weight:600;margin-bottom:4px}h3{font-size:16px;font-weight:600;margin-bottom:5px}p{margin-bottom:12px}.icon{width:20px;height:20px;flex:none;display:inline-block;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.muted,.helper-text{color:var(--muted)}.helper-text{font-size:13px}.eyebrow{color:var(--muted);font-size:11px;font-weight:600;letter-spacing:1.5px}.money,.tabular{font-variant-numeric:tabular-nums;letter-spacing:-.35px}strong{font-weight:600}[hidden]{display:none!important}.skip-link{position:fixed;left:16px;top:-100px;z-index:100;background:var(--surface);padding:12px}.skip-link:focus{top:10px}
.sidebar{position:fixed;inset:0 auto 0 0;width:var(--sidebar);background:var(--surface);border-right:1px solid var(--line);padding:33px 20px 22px;display:flex;flex-direction:column;z-index:20}.brand{display:flex;gap:11px;align-items:center;color:var(--ink);font-size:31px;font-weight:750;line-height:1;letter-spacing:-1.5px;margin:0 14px 42px}.brand-icon{display:block;background:var(--green);color:var(--lime);width:45px;height:45px;border-radius:12px;padding:7px}.brand-sub{display:block;font-size:9px;font-weight:550;letter-spacing:2.8px;margin-top:6px}.nav-caption{font-size:10px;color:var(--muted);letter-spacing:1px;padding:0 13px;margin-bottom:16px}.main-nav{display:grid;gap:6px}.nav-link{display:flex;align-items:center;gap:13px;padding:13px 14px;color:var(--muted);font-size:13px;border-radius:9px;font-weight:500;white-space:nowrap;position:relative}.nav-link:hover{background:var(--bg);color:var(--ink)}.nav-link.active{background:var(--mint);color:var(--green);font-weight:600}.nav-link.active:before{content:'';position:absolute;left:-20px;top:14px;bottom:14px;width:3px;background:var(--green);border-radius:0 3px 3px 0}.nav-count{margin-left:auto;font-size:10px;min-width:20px;text-align:center;background:var(--orange-soft);color:var(--orange);border-radius:5px;padding:0 4px}.sidebar-bottom{margin-top:auto}.sidebar-note{background:var(--mint);border:1px solid #cfe4d5;border-radius:13px;padding:17px;margin-bottom:24px}.sidebar-note>.icon{width:27px;height:27px;color:var(--green);margin-bottom:12px}.sidebar-note strong{font-size:13px;line-height:1.6;display:block;color:var(--green-dark)}.sidebar-note p{font-size:11px;line-height:1.8;color:var(--muted);margin:8px 0 0}.theme-button{background:transparent;color:var(--muted);display:flex;gap:11px;align-items:center;padding:10px 13px;width:100%;font-size:12px}.local-status{font-size:10px;color:var(--muted);border-top:1px solid var(--line);padding:18px 7px 0;margin-top:15px;display:flex;gap:6px;align-items:center}.local-status .icon{width:14px;height:14px}.app-shell{margin-left:var(--sidebar);min-height:100vh;display:flex;flex-direction:column}.topbar{height:77px;padding:0 38px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;background:var(--surface)}.breadcrumb{font-size:12px;color:var(--muted)}.breadcrumb span{margin:0 13px;color:#b5beb8}.breadcrumb strong{font-weight:500;color:var(--ink)}.topbar-right{display:flex;align-items:center;gap:23px}.date-label{font-size:11px;color:var(--muted)}.avatar{display:grid;place-items:center;background:#e1eadf;color:var(--green-dark);border:4px solid var(--surface-soft);width:39px;height:39px;border-radius:50%;font-size:13px;font-weight:600}main{width:100%;max-width:1540px;margin:0 auto;padding:33px 38px 20px;flex:1}.page-footer{display:flex;justify-content:space-between;margin:16px 38px 0;padding:18px 0;border-top:1px solid var(--line);font-size:10px;color:var(--muted)}.page-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:27px}.page-heading p{color:var(--muted);font-size:13px;margin:0}.heading-actions{display:flex;align-items:center;gap:10px}.button{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 16px;border-radius:8px;font-size:12px;font-weight:550;line-height:1.5;white-space:nowrap;transition:background .15s,transform .15s}.button:hover{transform:translateY(-1px)}.button .icon{width:16px;height:16px}.button.primary{background:var(--green);color:white;border:1px solid var(--green)}.button.primary:hover{background:var(--green-dark)}.button.secondary{background:var(--surface);color:var(--ink);border:1px solid var(--line)}.button.ghost{background:transparent;color:var(--green);padding-left:0}.button.danger{background:var(--red);color:white}.button.small{padding:7px 11px;font-size:11px}.icon-button{display:inline-grid;place-items:center;flex:none;width:31px;height:31px;background:transparent;border-radius:7px;color:var(--muted)}.icon-button .icon{width:16px;height:16px}.icon-button:hover{background:var(--mint);color:var(--green)}.icon-button.delete:hover{background:var(--red-soft);color:var(--red)}.month-pill{display:inline-flex;gap:8px;align-items:center;color:var(--ink);background:var(--surface);border:1px solid var(--line);padding:9px 13px;border-radius:8px;font-size:11px}.month-pill .icon{width:15px;height:15px}.section-label{font-size:11px;letter-spacing:1.15px;color:var(--muted);margin:0 0 14px;font-weight:550}.metrics-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:23px}.metric-card{min-width:0;min-height:178px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--line);padding:20px 20px 17px;position:relative;overflow:hidden}.metric-card.featured{background:var(--green);color:white;border-color:var(--green)}.metric-card.featured:after{content:'';width:150px;height:150px;border:1px solid #ffffff13;border-radius:50%;position:absolute;right:-75px;bottom:-75px;box-shadow:0 0 0 25px #ffffff05,0 0 0 50px #ffffff04;pointer-events:none}.metric-top{display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:11px;color:var(--muted);margin-bottom:15px}.featured .metric-top{color:#d6eadd}.metric-icon{background:var(--mint);color:var(--green);border-radius:8px;display:grid;place-items:center;width:30px;height:30px;flex:none}.metric-icon .icon{width:16px;height:16px}.featured .metric-icon{background:#ffffff17;color:#d5f4c8}.metric-value{font-size:28px;font-weight:650;line-height:1.25;letter-spacing:-1.1px;white-space:nowrap}.metric-value .unit{font-size:14px;letter-spacing:0;color:var(--muted);font-weight:400}.featured .metric-value{color:#effde8}.metric-foot{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:10px;margin-top:15px;flex-wrap:wrap}.featured .metric-foot{color:#d6eadd}.metric-foot .icon{width:12px;height:12px}.badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:550;padding:3px 8px;border-radius:5px;line-height:1.5;background:var(--mint);color:var(--green)}.badge.safe{background:var(--mint);color:var(--green)}.badge.notice{background:var(--blue-soft);color:var(--blue)}.badge.warning{background:var(--orange-soft);color:var(--orange)}.badge.danger{background:var(--red-soft);color:var(--red)}.featured .badge{background:#ffffff20;color:white}.progress{height:5px;border-radius:5px;background:var(--line);overflow:hidden;margin-top:17px}.progress>span{display:block;height:100%;border-radius:5px;background:var(--green)}.score-ring{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--green) var(--score),var(--line) 0);position:absolute;right:20px;top:76px}.score-ring:before{content:'';width:37px;height:37px;background:var(--surface);border-radius:50%}.score-ring .icon{position:absolute;width:16px;height:16px;color:var(--green)}.savings-unit{font-size:12px;font-weight:400;letter-spacing:0}.main-grid{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(290px,1fr);gap:21px;margin-bottom:21px}.panel{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:23px;min-width:0}.panel-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:21px}.panel-header p{font-size:11px;color:var(--muted);margin:4px 0 0}.panel-header h2{font-size:15px}.chart-wrap{height:230px;position:relative}.chart-wrap.small{height:210px}.chart-legend{display:flex;gap:15px;font-size:10px;color:var(--muted);align-items:center;flex-wrap:wrap}.legend-item{display:inline-flex;align-items:center;gap:6px}.legend-dot{width:8px;height:8px;border-radius:2px;display:inline-block}.legend-dot.income{background:var(--green)}.legend-dot.expense{background:#c1d9c9}.legend-dot.forecast{border:1px dashed var(--orange);background:var(--orange-soft)}.chart-summary{display:flex;gap:35px;padding-top:17px;margin-top:15px;border-top:1px solid var(--line)}.chart-summary span{display:block;font-size:10px;color:var(--muted)}.chart-summary strong{font-size:17px;font-variant-numeric:tabular-nums}.chart-summary small{font-size:10px;color:var(--green)}.strategy-head{display:flex;align-items:center;gap:9px}.strategy-head .icon{color:var(--green);width:18px;height:18px}.level-label{margin:0 0 11px;color:var(--green);font-size:10px;font-weight:550;letter-spacing:.5px}.strategy-title{font-size:21px;letter-spacing:-.5px;line-height:1.4;margin-bottom:8px;font-weight:600}.strategy-copy{font-size:12px;line-height:1.8;color:var(--muted)}.allocation-label{font-size:10px;font-weight:550;margin:23px 0 10px}.allocation-bar{display:flex;height:10px;border-radius:5px;overflow:hidden;gap:3px}.allocation-bar span:nth-child(1){background:var(--green)}.allocation-bar span:nth-child(2){background:#aac7b7}.allocation-bar span:nth-child(3){background:#d3dfaa}.allocation-legend{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:12px;font-size:10px;color:var(--muted)}.allocation-legend strong{display:block;font-size:14px;color:var(--ink);margin-top:4px}.strategy-callout{background:var(--mint);border-radius:10px;padding:12px;font-size:11px;color:var(--green-dark);margin-top:21px;display:flex;gap:9px;align-items:flex-start}.strategy-callout .icon{width:15px;height:15px;margin-top:2px}.strategy-callout p{margin:0}.recent-header{margin-bottom:12px}.text-link{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:550;color:var(--green);background:transparent}.table-scroll{overflow-x:auto}table{width:100%;border-collapse:collapse;text-align:left;font-size:12px}th{font-weight:450;color:var(--muted);font-size:10px;padding:10px 10px;border-bottom:1px solid var(--line);white-space:nowrap}td{padding:13px 10px;border-bottom:1px solid var(--line)}tbody tr:last-child td{border-bottom:0}td:first-child,th:first-child{padding-left:0}td:last-child,th:last-child{padding-right:0}.align-right{text-align:right}.amount-income{color:var(--green);font-weight:550}.amount-expense{color:var(--ink);font-weight:550}.transaction-title{display:flex;align-items:center;gap:10px}.category-icon{display:grid;place-items:center;flex:none;width:33px;height:33px;border-radius:9px;background:var(--mint);color:var(--green)}.category-icon.wants{color:var(--orange);background:var(--orange-soft)}.category-icon.savings_debt{color:var(--blue);background:var(--blue-soft)}.category-icon .icon{width:16px;height:16px}.transaction-title strong{display:block;font-weight:500;font-size:11px}.transaction-title small{display:block;color:var(--muted);font-size:10px;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.row-actions{display:flex;justify-content:flex-end;gap:2px}.install-banner{display:flex;align-items:center;gap:13px;background:var(--mint);border:1px solid #d6e7dc;border-radius:11px;padding:15px 18px;margin-top:20px;color:var(--green-dark)}.install-banner>.icon{width:22px;height:22px}.install-banner p{font-size:11px;margin:0}.install-banner strong{font-size:12px;display:block;margin-bottom:2px}.install-banner .text-link{margin-left:auto;white-space:nowrap}.install-banner .icon-button{color:var(--green)}.empty-state{text-align:center;padding:28px 20px;color:var(--muted)}.empty-state>.icon{width:34px;height:34px;color:var(--green);margin-bottom:12px}.empty-state h3{color:var(--ink);font-size:15px}.empty-state p{font-size:12px;max-width:400px;margin:0 auto 16px}.welcome-panel{background:linear-gradient(110deg,var(--mint),var(--surface));border:1px solid #d1e5d7;margin-bottom:23px;display:flex;justify-content:space-between;gap:24px;align-items:center}.welcome-panel h2{font-size:20px}.welcome-panel p{font-size:12px;color:var(--muted);max-width:620px;margin-bottom:0}.welcome-actions{display:flex;gap:8px;flex:none}.banner{padding:13px 16px;border:1px solid var(--line);background:var(--mint);border-radius:10px;margin-bottom:18px;font-size:12px}.banner.warning{background:var(--orange-soft);border-color:#e8cdab;color:var(--orange)}.filters{display:grid;grid-template-columns:160px 1fr 1.2fr 1.4fr;gap:12px;margin-bottom:20px}.filters label{font-size:11px;margin:0}.filters input,.filters select{padding:9px 10px;font-size:12px}.transactions-summary{display:flex;gap:35px;margin-bottom:20px;flex-wrap:wrap}.transactions-summary span{display:block;font-size:11px;color:var(--muted)}.transactions-summary strong{font-size:20px}.pagination{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--line);padding-top:15px;margin-top:10px;font-size:11px;color:var(--muted)}.pagination-controls{display:flex;gap:6px}.diagnostics-grid{display:grid;grid-template-columns:1fr 1fr;gap:21px;margin-bottom:21px}.diagnostic-value{font-size:31px;font-weight:650;letter-spacing:-1px;margin:12px 0}.diagnostic-copy{font-size:12px;color:var(--muted);line-height:1.8;max-width:500px}.alert-list{display:grid;gap:10px}.alert-row{display:flex;align-items:center;gap:13px;padding:14px;border:1px solid var(--line);border-radius:11px}.alert-row .alert-icon{background:var(--orange-soft);color:var(--orange);padding:9px;border-radius:8px}.alert-row.critical .alert-icon{background:var(--red-soft);color:var(--red)}.alert-row .alert-icon .icon{width:17px;height:17px}.alert-body{flex:1;min-width:0}.alert-body strong{font-size:12px}.alert-body p{font-size:11px;margin:4px 0 0;color:var(--muted)}.alert-amount{font-size:13px;font-weight:550;white-space:nowrap}.cutback-table{margin-top:15px}.cutback-table td,.cutback-table th{font-size:11px}.insight-note{font-size:11px;color:var(--muted);background:var(--surface-soft);border-radius:8px;padding:12px;margin:14px 0 0}.planning-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:21px}.stack{display:grid;gap:21px;align-content:start}.bill-row,.debt-row{display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--line);padding:16px 0}.bill-row:last-child,.debt-row:last-child{border-bottom:0}.bill-row h3,.debt-row h3{font-size:12px;margin:0}.bill-row p,.debt-row p{font-size:10px;color:var(--muted);margin:4px 0 0}.record-info{flex:1;min-width:0}.record-money{text-align:right;white-space:nowrap;font-size:12px}.record-money small{display:block;color:var(--muted);font-size:10px}.record-actions{display:flex;align-items:center}.debt-priority{width:28px;height:28px;flex:none;border-radius:50%;background:var(--mint);color:var(--green);font-size:11px;display:grid;place-items:center}.settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:21px}.settings-card>p{font-size:12px;color:var(--muted);margin:10px 0 18px}.settings-card .button{margin:0 8px 8px 0}.setting-row{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:15px 0;border-top:1px solid var(--line)}.setting-row strong{font-size:12px;display:block}.setting-row small{font-size:11px;color:var(--muted);display:block;margin-top:3px}.switch{width:43px;height:25px;border-radius:20px;padding:3px;background:var(--line);display:flex;align-items:center}.switch span{width:19px;height:19px;border-radius:50%;background:white;box-shadow:0 1px 3px #0002;transition:transform .15s}.switch[aria-checked=true]{background:var(--green)}.switch[aria-checked=true] span{transform:translateX(18px)}.danger-zone{border-color:#ebcdcd}.danger-zone h2{color:var(--red)}.loading-state{padding:80px 20px;text-align:center;color:var(--muted)}
label{display:block;font-size:12px;font-weight:500;margin-bottom:16px;color:var(--ink)}input:not([type=checkbox]),select,textarea{display:block;width:100%;min-width:0;background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:11px 12px;margin-top:7px;font-size:13px;line-height:1.5}input::placeholder{color:#a5aea9}select{appearance:none;padding-right:30px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='m6 8 4 4 4-4' stroke='%2373817b' stroke-width='1.5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 9px center;background-size:17px}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.checkbox-label{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:400}.checkbox-label input{accent-color:var(--green);width:16px;height:16px;margin:0}.form-grid .checkbox-label{padding-top:20px;line-height:1.5}.required{color:var(--red)}.optional{font-weight:400;color:var(--muted);font-size:11px}.form-dialog,.confirm-dialog{border:1px solid var(--line);border-radius:20px;background:var(--surface);color:var(--ink);padding:28px;width:min(540px,calc(100% - 32px));max-height:90vh;overflow:auto;box-shadow:0 20px 100px #0a332c30}dialog::backdrop{background:#102d2580;backdrop-filter:blur(4px)}.dialog-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:24px}.dialog-header h2{font-size:23px;margin-top:6px}.dialog-header .eyebrow{font-size:9px}.dialog-actions{display:flex;justify-content:flex-end;gap:9px;padding-top:10px}.type-switch{display:flex;background:var(--bg);padding:4px;border-radius:10px;margin-bottom:22px;gap:4px}.type-switch button{flex:1;border-radius:7px;padding:10px;background:transparent;color:var(--muted);font-size:13px}.type-switch button.selected{background:var(--surface);color:var(--green);box-shadow:0 1px 4px #0001;font-weight:600}.amount-field{margin-bottom:10px}.amount-input{display:flex;align-items:center;border-bottom:2px solid var(--line);padding:4px 0}.amount-input input{border:0;padding:0;font-size:34px;letter-spacing:-1px;font-weight:600;margin:0;background:transparent}.amount-input>span{font-size:22px;color:var(--muted)}.quick-amounts{display:flex;gap:7px;margin-bottom:24px;flex-wrap:wrap}.quick-amounts button{background:var(--mint);color:var(--green);font-size:11px;padding:7px 11px;border-radius:6px}.confirm-dialog{max-width:420px;padding:30px}.confirm-icon{display:grid;place-items:center;background:var(--mint);color:var(--green);width:45px;height:45px;border-radius:12px;margin-bottom:17px}.confirm-dialog h2{font-size:21px;margin-bottom:13px}.confirm-dialog p{font-size:12px;line-height:1.9;color:var(--muted)}.form-error{background:var(--red-soft);color:var(--red);padding:10px 12px;border-radius:8px;font-size:12px}.toast{position:fixed;bottom:28px;left:calc(50% + var(--sidebar)/2);transform:translateX(-50%);z-index:100;background:var(--ink);color:var(--surface);font-size:12px;border-radius:10px;padding:13px 20px;box-shadow:var(--shadow);max-width:90vw}.toast.error{background:var(--red);color:white}.no-chart{color:var(--muted);font-size:12px;display:flex;align-items:center;justify-content:center;height:100%;text-align:center}.fine-print{font-size:10px;color:var(--muted);line-height:1.8;margin:15px 0 0}.profile-form .button{margin-top:2px}.section-spaced{margin-top:21px}details summary{cursor:pointer;color:var(--green);font-size:12px}.method-content{padding-top:15px;font-size:12px;color:var(--muted);line-height:1.9}.method-content p{margin-bottom:10px}
[data-theme=dark]{color-scheme:dark;--bg:#111e1a;--surface:#192a23;--surface-soft:#1d3028;--ink:#e6efe8;--muted:#9eafa5;--line:#30443a;--green:#70cea2;--green-dark:#a6e6c6;--mint:#213c30;--lime:#c6f5ad;--blue:#91b0e8;--blue-soft:#24364c;--orange:#e4b572;--orange-soft:#3c3223;--red:#ed9696;--red-soft:#452e30;--shadow:0 4px 22px #0002}[data-theme=dark] .metric-card.featured{background:#185b43;border-color:#246c51}[data-theme=dark] .button.primary{background:#287d58;border-color:#287d58;color:#fff}[data-theme=dark] .sidebar-note,[data-theme=dark] .welcome-panel,[data-theme=dark] .install-banner{border-color:#345541}[data-theme=dark] .brand-icon{background:#287d58}[data-theme=dark] .avatar{background:#324c3d}[data-theme=dark] .metric-card.featured .metric-top,[data-theme=dark] .metric-card.featured .metric-foot{color:#cde8d9}[data-theme=dark] .button.danger{background:#9e4242}
@media(min-width:1500px){:root{--sidebar:256px}main{padding:40px 46px 24px}.topbar{padding:0 46px}.metric-value{font-size:32px}.metric-card{min-height:189px}.chart-wrap{height:265px}.panel{padding:26px}.strategy-title{font-size:24px}.nav-link{font-size:14px}.sidebar-note strong{font-size:14px}.page-heading p{font-size:14px}.metric-top{font-size:12px}.metric-foot{font-size:11px}h1{font-size:31px}}
@media(max-width:1200px){:root{--sidebar:215px}.sidebar{padding-left:15px;padding-right:15px}.brand{margin-left:10px}.nav-link{font-size:12px;padding-left:12px;gap:9px}.nav-link.active:before{left:-15px}main{padding:28px 24px 20px}.topbar{padding:0 24px}.metric-card{padding:16px;min-height:165px}.metric-top{font-size:10px}.metric-value{font-size:24px}.metric-foot{font-size:9px}.score-ring{right:15px;top:70px;width:38px;height:38px}.score-ring:before{width:29px;height:29px}.score-ring .icon{width:13px;height:13px}.main-grid{grid-template-columns:minmax(0,1.5fr) minmax(265px,1fr);gap:16px}.panel{padding:20px}.chart-legend{gap:9px;font-size:9px}.welcome-panel{display:block}.welcome-actions{margin-top:15px}.page-footer{margin-left:24px;margin-right:24px}.metrics-grid{gap:12px}.strategy-title{font-size:19px}}
@media(max-width:1000px){.metrics-grid{grid-template-columns:repeat(2,1fr)}.metric-value{font-size:28px}.metric-top{font-size:12px}.metric-foot{font-size:11px}.main-grid,.planning-grid{grid-template-columns:1fr}.strategy-panel{display:grid;grid-template-columns:1fr 1fr;column-gap:25px}.strategy-panel>.panel-header{grid-column:1/-1}.strategy-panel .strategy-callout{margin-top:0}.settings-grid{grid-template-columns:1fr}.page-heading{align-items:flex-start}.heading-actions{flex-wrap:wrap;justify-content:flex-end}.filters{grid-template-columns:1fr 1fr}.diagnostics-grid{gap:16px}.score-ring{top:69px;right:20px;width:48px;height:48px}.score-ring:before{width:37px;height:37px}.score-ring .icon{width:16px;height:16px}}
@media(max-width:760px){:root{--sidebar:0px}.sidebar{position:fixed;top:auto;bottom:0;width:100%;height:69px;padding:0 6px;border:0;border-top:1px solid var(--line);z-index:30}.sidebar .brand,.nav-caption,.sidebar-bottom{display:none}.main-nav{display:flex;gap:0;justify-content:space-around}.nav-link{flex:1;flex-direction:column;justify-content:center;gap:5px;padding:10px 2px 7px;border-radius:0;font-size:9px;font-weight:500;white-space:normal;text-align:center}.nav-link .icon{width:19px;height:19px}.nav-link.active{background:transparent}.nav-link.active:before{top:0;left:25%;right:25%;bottom:auto;height:2px;width:auto}.nav-link:nth-child(4)>span:nth-child(2){font-size:8px}.nav-count{position:absolute;top:6px;right:15px;min-width:14px;font-size:8px;padding:0 2px}.app-shell{padding-bottom:69px}.topbar{height:59px;padding:0 20px}.breadcrumb{font-size:10px}.date-label{display:none}.avatar{height:32px;width:32px;font-size:11px}.topbar-right{gap:8px}main{padding:24px 18px 16px}h1{font-size:24px}.page-heading{display:block;margin-bottom:23px}.page-heading p{font-size:11px}.heading-actions{justify-content:flex-start;margin-top:17px}.month-pill{font-size:10px;padding:8px 10px}.button{padding:9px 12px;font-size:11px}.metrics-grid{gap:10px;margin-bottom:16px}.metric-card{padding:15px 13px;min-height:157px;border-radius:13px}.metric-top{font-size:9px;gap:3px;margin-bottom:16px;align-items:flex-start}.metric-icon{width:23px;height:23px;border-radius:6px}.metric-icon .icon{width:13px;height:13px}.metric-value{font-size:24px}.metric-value .unit{font-size:11px}.metric-foot{font-size:9px;gap:5px;margin-top:12px}.metric-foot .badge{font-size:8px;padding:2px 5px}.score-ring{width:34px;height:34px;right:12px;top:67px}.score-ring:before{width:26px;height:26px}.score-ring .icon{width:12px;height:12px}.savings-unit{font-size:10px}.panel{padding:18px;border-radius:13px}.panel-header{margin-bottom:17px;align-items:flex-start}.panel-header h2{font-size:14px}.panel-header p{font-size:10px}.main-grid{gap:16px;margin-bottom:16px}.chart-wrap{height:215px}.chart-wrap.small{height:210px}.chart-legend{font-size:8px;gap:8px}.chart-panel .panel-header{display:block}.chart-panel .chart-legend{margin-top:12px}.chart-summary{gap:26px}.chart-summary strong{font-size:15px}.strategy-panel{display:block}.strategy-panel .strategy-callout{margin-top:18px}.strategy-title{font-size:21px}.strategy-copy{font-size:12px}.diagnostics-grid{grid-template-columns:1fr;gap:16px}.install-banner{padding:13px;gap:9px;flex-wrap:wrap}.install-banner p{font-size:10px}.install-banner strong{font-size:11px}.install-banner>.icon{display:none}.install-banner>div{flex:1;min-width:180px}.install-banner .text-link{margin-left:0}.page-footer{margin:12px 18px 0;font-size:8px}.filters{gap:10px}.filters label{font-size:10px}.filters input,.filters select{font-size:11px}.transaction-title small{max-width:130px}.table-scroll table{min-width:490px}.recent-table th:nth-child(2),.recent-table td:nth-child(2){display:none}.recent-table table{min-width:0}.recent-table .transaction-title strong{font-size:10px}.recent-table td{font-size:10px}.alert-row{padding:11px;gap:8px;flex-wrap:wrap}.alert-body strong{font-size:11px}.alert-body p{font-size:10px}.alert-amount{font-size:11px}.form-dialog{padding:22px 19px}.dialog-header h2{font-size:21px}.dialog-header{margin-bottom:20px}.form-grid{gap:10px}label{font-size:11px}.quick-amounts{gap:5px}.quick-amounts button{font-size:10px;padding:7px 9px}.toast{bottom:85px;left:50%;width:max-content;max-width:90vw}.welcome-panel h2{font-size:18px}.welcome-actions{flex-wrap:wrap}.record-actions{flex-wrap:wrap;max-width:65px;justify-content:flex-end}.record-money{font-size:11px}.bill-row,.debt-row{gap:7px}.bill-row h3,.debt-row h3{font-size:11px}.settings-grid{gap:16px}.settings-card .button{font-size:11px}.transactions-summary{gap:25px}.transactions-summary strong{font-size:17px}.strategy-title{line-height:1.5}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
@media(min-width:761px) and (max-height:820px){.sidebar-note{display:none}.sidebar{overflow-y:auto}.brand{margin-bottom:30px}}
@media(min-width:761px){body{font-size:16px}.nav-link{font-size:14px}.sidebar-note strong{font-size:14px}.sidebar-note p{font-size:12px}.nav-caption{font-size:11px}.local-status{font-size:11px}.theme-button{font-size:14px}.breadcrumb{font-size:13px}.date-label{font-size:12px}.page-heading p{font-size:14px}.button{font-size:14px}.button.small{font-size:12px}.month-pill{font-size:13px}.metric-card{min-height:193px}.metric-top{font-size:14px;align-items:flex-start;min-height:34px;margin-bottom:13px;line-height:1.6}.metric-top>span:first-child{max-width:calc(100% - 35px)}.metric-value{font-size:29px}.metric-value .unit{font-size:14px}.metric-foot{font-size:12px;margin-top:14px}.badge{font-size:11px}.savings-unit{font-size:12px}.score-ring{top:81px;width:38px;height:38px;right:16px}.score-ring:before{width:29px;height:29px}.score-ring .icon{width:13px;height:13px}.section-label{font-size:12px}.panel-header h2{font-size:17px}.panel-header p{font-size:13px}.chart-legend{font-size:11px}.chart-summary span{font-size:12px}.chart-summary strong{font-size:17px}.strategy-copy{font-size:14px}.level-label{font-size:12px}.allocation-label{font-size:12px}.allocation-legend{font-size:12px}.allocation-legend strong{font-size:16px}.strategy-callout{font-size:13px}.text-link{font-size:13px}table{font-size:14px}th{font-size:12px}.transaction-title strong{font-size:14px}.transaction-title small{font-size:12px}.install-banner p{font-size:12px}.install-banner strong{font-size:14px}.empty-state p,.diagnostic-copy{font-size:14px}.empty-state h3{font-size:17px}.filters label,label{font-size:14px}.filters input,.filters select,input:not([type=checkbox]),select{font-size:14px}.transactions-summary span{font-size:13px}.pagination{font-size:13px}.alert-body strong{font-size:14px}.alert-body p{font-size:13px}.alert-amount{font-size:14px}.cutback-table td,.cutback-table th{font-size:13px}.insight-note{font-size:13px}.bill-row h3,.debt-row h3{font-size:14px}.bill-row p,.debt-row p{font-size:12px}.record-money{font-size:14px}.record-money small{font-size:12px}.settings-card>p{font-size:14px}.setting-row strong{font-size:14px}.setting-row small{font-size:13px}.fine-print{font-size:12px}.helper-text{font-size:14px}.form-dialog label{font-size:14px}.confirm-dialog p{font-size:14px}.welcome-panel p{font-size:14px}.page-footer{font-size:11px}.toast{font-size:14px}}
```

### File: js/db.js

```javascript
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
```

### File: js/finance-engine.js

```javascript
/** All calculations are pure. Money is integer VND; dates are local calendar dates. */
export const CATEGORIES = Object.freeze({
  income: ['Lương chính', 'Freelance / Dự án', 'Thưởng / Hoa hồng', 'Thu nhập khác'],
  needs: ['Tiền nhà / Trả góp nhà', 'Điện nước & Internet', 'Đi chợ & Nấu ăn', 'Di chuyển & Xăng xe', 'Y tế & Bảo hiểm', 'Học tập / Gia đình'],
  wants: ['Ăn ngoài & Cafe', 'Mua sắm online', 'Giải trí & Du lịch', 'Đăng ký gói dịch vụ', 'Quà tặng & Giao lưu'],
  savings_debt: ['Nạp quỹ dự phòng', 'Trả nợ gốc/lãi', 'Đầu tư dài hạn'],
});
export const GROUP_LABELS = { income: 'Thu nhập', needs: 'Thiết yếu', wants: 'Mong muốn', savings_debt: 'Tiết kiệm & Trả nợ' };
export const DEFAULT_PROFILE = { id: 'default', liquidSavings: 0, paydayDay: 5, incomeModeOverride: 'AUTO', theme: 'light', lastBackupAt: null };
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const sum = (xs) => xs.reduce((a, x) => a + x, 0);
export const avg = (xs) => xs.length ? sum(xs) / xs.length : 0;
export const round1 = (x) => Math.round(x * 10) / 10;
export function percentile(values, p) {
  if (!values.length) return 0;
  const a = [...values].sort((x, y) => x - y);
  const i = (a.length - 1) * clamp(p, 0, 100) / 100;
  return a[Math.floor(i)] + (a[Math.ceil(i)] - a[Math.floor(i)]) * (i - Math.floor(i));
}
export const median = (xs) => percentile(xs, 50);
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function monthKeys(date, count) {
  return Array.from({ length: count }, (_, i) => localDate(new Date(date.getFullYear(), date.getMonth() - count + i + 1, 1)).slice(0, 7));
}
export function aggregateMonths(transactions, date = new Date()) {
  const months = new Map();
  for (const t of transactions) {
    if (t.date > localDate(date)) continue;
    const key = t.date.slice(0, 7);
    if (!months.has(key)) months.set(key, { month: key, income: 0, needs: 0, wants: 0, savings_debt: 0, spent: 0, variable: 0 });
    const m = months.get(key);
    m[t.group] += t.amount;
    if (t.type === 'expense' && ['needs', 'wants'].includes(t.group)) {
      m.spent += t.amount;
      if (!t.isFixedBill) m.variable += t.amount;
    }
  }
  return [...months.values()].sort((a, b) => a.month.localeCompare(b.month));
}

// Module 1 — adaptive income baseline, sample standard deviation.
export function classifyIncome(monthlyIncomes, currentMonthActualIncome = 0, override = 'AUTO') {
  const xs = monthlyIncomes.slice(-12);
  const n = xs.length;
  if (!n) return { mode: 'NO_INCOME', cv: null, yBase: 0, surplusForBuffer: 0, months: 0 };
  const mean = avg(xs);
  const cv = n >= 3 && mean > 0 ? Math.sqrt(sum(xs.map((x) => (x - mean) ** 2)) / (n - 1)) / mean : null;
  let mode = n < 3 ? 'COLD_START' : cv <= .15 ? 'STABLE' : cv <= .30 ? 'MODERATE' : 'IRREGULAR';
  let yBase = n < 3 ? Math.min(...xs) : mode === 'STABLE' ? mean : mode === 'MODERATE' ? Math.min(median(xs), Math.round(mean * .9)) : percentile(xs, 25);
  if (override === 'IRREGULAR') { mode = 'IRREGULAR'; yBase = n < 3 ? Math.min(...xs) : percentile(xs, 25); }
  if (override === 'STABLE' && n >= 3) { mode = 'STABLE'; yBase = mean; }
  yBase = Math.round(yBase);
  return { mode, cv, yBase, surplusForBuffer: Math.max(0, currentMonthActualIncome - yBase), months: n };
}

// Module 2 — SES, damped Holt, additive Holt-Winters and calendar blending.
export function forecastSpending({ hist = [], currVarSpent = 0, paidFixedBills = 0, unpaidFixedBills = 0, elapsedDays = 1, daysInMonth = 30 }) {
  elapsedDays = clamp(elapsedDays, 1, daysInMonth);
  const intramonthProj = currVarSpent + currVarSpent / elapsedDays * (daysInMonth - elapsedDays) + paidFixedBills + unpaidFixedBills;
  const n = hist.length;
  let histForecast = intramonthProj, trendPerMonth = 0, tierIndex = 0;
  if (n >= 1 && n <= 2) {
    tierIndex = 1; histForecast = hist.slice(1).reduce((s, x) => .4 * x + .6 * s, hist[0]);
  } else if (n >= 3 && n <= 23) {
    tierIndex = 2;
    let level = hist[0], trend = (hist[n - 1] - hist[0]) / (n - 1);
    for (const x of hist.slice(1)) {
      const newLevel = .4 * x + .6 * (level + .85 * trend);
      trend = .2 * (newLevel - level) + .8 * .85 * trend;
      level = newLevel;
    }
    trendPerMonth = trend; histForecast = Math.max(0, level + .85 * trend);
  } else if (n >= 24) {
    tierIndex = 3;
    let level = avg(hist.slice(0, 12)), trend = (avg(hist.slice(12, 24)) - level) / 12;
    const seasons = hist.slice(0, 12).map((x) => x - level);
    for (let t = 12; t < n; t++) {
      const oldLevel = level, seasonal = seasons[t % 12];
      level = .3 * (hist[t] - seasonal) + .7 * (level + trend);
      trend = .1 * (level - oldLevel) + .9 * trend;
      seasons[t % 12] = .2 * (hist[t] - level) + .8 * seasonal;
    }
    trendPerMonth = trend; histForecast = Math.max(0, level + trend + seasons[n % 12]);
  }
  const tiers = ['Tầng 0 (Tốc độ chi thực tế)', 'Tầng 1 (Làm mượt hàm mũ đơn SES)', 'Tầng 2 (Xu hướng giảm chấn Damped Holt)', 'Tầng 3 (Mùa vụ Holt-Winters 12 tháng)'];
  const w = Math.min(1, elapsedDays / daysInMonth);
  return { tierIndex, tier: tiers[tierIndex], histForecast, intramonthProj, trendPerMonth, blendedEomForecast: Math.round(w * intramonthProj + (1 - w) * histForecast) };
}

// Module 3A — right-tail robust anomaly detection, with a materiality gate.
export function detectAnomalies(transactions, yBase, date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 89);
  const categories = new Map();
  for (const t of transactions) {
    if (t.type !== 'expense' || t.date < localDate(start) || t.date > localDate(date)) continue;
    if (!categories.has(t.category)) categories.set(t.category, []);
    categories.get(t.category).push(t);
  }
  const alerts = [], minMaterialDelta = Math.max(100000, Math.round(yBase / 100));
  for (const [category, ts] of categories) {
    if (ts.length < 5) continue;
    const xs = ts.map((t) => t.amount), med = median(xs), mad = median(xs.map((x) => Math.abs(x - med)));
    const q1 = percentile(xs, 25), q3 = percentile(xs, 75), iqr = q3 - q1;
    for (const t of ts) {
      const x = t.amount;
      if (!(x > med && x - med >= minMaterialDelta && (med === 0 || x >= 1.5 * med))) continue;
      let severity = null;
      if (mad > 0) {
        const z = .6745 * (x - med) / mad;
        if (z > 3.5 && (med === 0 || x >= 2 * med)) severity = 'CRITICAL';
        else if ((z > 2.5 && z <= 3.5) || (iqr > 0 && x > q3 + 1.5 * iqr)) severity = 'WARNING';
      } else if (iqr > 0) {
        if (x > q3 + 3 * iqr) severity = 'CRITICAL';
        else if (x > q3 + 1.5 * iqr) severity = 'WARNING';
      } else {
        if (med === 0 || x >= 2 * med) severity = 'CRITICAL';
        else if (x >= 1.5 * med) severity = 'WARNING';
      }
      if (severity) alerts.push({ ...t, category, severity, median: med, multiple: med > 0 ? round1(x / med) : null });
    }
  }
  return alerts.sort((a, b) => b.date.localeCompare(a.date) || b.amount - a.amount);
}

// Module 3B — include zero-spend days in both daily-average denominators.
export function paydaySpike(transactions, paydayDay = 5, date = new Date()) {
  const earliest = monthKeys(date, 3)[0], first = transactions.filter((t) => t.date <= localDate(date)).map((t) => t.date).sort()[0];
  if (!first) return { psi: null, warning: false, paydayAvg: 0, otherAvg: 0 };
  const start = first > `${earliest}-01` ? first : `${earliest}-01`;
  let windowDays = 0, otherDays = 0, windowSpent = 0, otherSpent = 0;
  const inWindow = (day) => (day - paydayDay + 30) % 30 <= 4;
  for (let d = new Date(`${start}T12:00:00`); localDate(d) <= localDate(date); d.setDate(d.getDate() + 1)) {
    if (inWindow(d.getDate())) windowDays++; else otherDays++;
  }
  for (const t of transactions) {
    if (t.date < start || t.date > localDate(date) || t.type !== 'expense' || t.isFixedBill || !['needs', 'wants'].includes(t.group)) continue;
    if (inWindow(Number(t.date.slice(8)))) windowSpent += t.amount; else otherSpent += t.amount;
  }
  const paydayAvg = windowDays ? windowSpent / windowDays : 0, otherAvg = otherDays ? otherSpent / otherDays : 0;
  const psi = otherAvg > 0 ? paydayAvg / otherAvg : paydayAvg > 0 && otherDays > 0 ? Infinity : null;
  return { psi, warning: psi !== null && psi >= 1.5, paydayAvg, otherAvg, windowDays, otherDays };
}

// Module 3C — compare adjacent complete calendar windows, never partial months.
export function lifestyleCreep(months) {
  const n = months.length;
  if (n < 4) return { available: false, warning: false, driftPP: 0 };
  const w = n >= 6 ? 3 : 2, prev = months.slice(-2 * w, -w), curr = months.slice(-w);
  if ([...prev, ...curr].some((m) => m.income <= 0)) return { available: false, warning: false, driftPP: 0 };
  const ratioPrev = avg(prev.map((m) => m.wants / m.income)), ratioCurr = avg(curr.map((m) => m.wants / m.income));
  const growth = (a, b) => b > 0 ? (a - b) / b * 100 : a > 0 ? Infinity : 0;
  const driftPP = (ratioCurr - ratioPrev) * 100;
  const wantsGrowthPct = growth(avg(curr.map((m) => m.wants)), avg(prev.map((m) => m.wants)));
  const incGrowthPct = growth(avg(curr.map((m) => m.income)), avg(prev.map((m) => m.income)));
  return { available: true, warning: driftPP >= 3 || (wantsGrowthPct > incGrowthPct + 5 && ratioCurr > .25), driftPP, wantsGrowthPct, incGrowthPct, ratioCurr, ratioPrev };
}

export const LEVELS = [
  { title: 'Cân bằng lại dòng tiền', description: 'Ưu tiên dừng thâm hụt. Rà soát các khoản mong muốn trước và giữ lại phần chi thiết yếu.', needs: .60, wants: .15, save: .25 },
  { title: 'Xây lớp đệm đầu tiên', description: 'Tích lũy đủ một tháng chi thiết yếu để chủ động trước những việc ngoài dự tính.', needs: .55, wants: .20, save: .25 },
  { title: 'Ưu tiên xóa nợ lãi cao', description: 'Trả tối thiểu mọi khoản nợ, sau đó dồn phần dư vào khoản có lãi suất cao nhất.', needs: .50, wants: .20, save: .30 },
  { title: 'Làm dày quỹ dự phòng', description: 'Tích lũy quỹ dự phòng theo mức thu nhập, từng bước tiến đến sự an tâm dài hạn.', needs: .50, wants: .25, save: .25 },
  { title: 'Vững vàng để tăng trưởng', description: 'Duy trì quỹ dự phòng, giữ kỷ luật chi tiêu và dành nguồn lực cho mục tiêu dài hạn.', needs: .50, wants: .30, save: .20 },
];
// Module 4 — FHI weights, five financial levels, adaptive allocation.
export function financialHealth({ yBase = 0, actualIncome = 0, totalNeedsWantsSpent = 0, avgMonthlyNeeds = 0, totalActiveFixedBills = 0, currWantsSpent = 0, debts = [], profile = DEFAULT_PROFILE, incomeMode = 'NO_INCOME', cashFlow = actualIncome - totalNeedsWantsSpent }) {
  const essentialMonthly = Math.max(avgMonthlyNeeds, totalActiveFixedBills, 1), runwayMonths = profile.liquidSavings / essentialMonthly;
  const targetRunway = incomeMode === 'IRREGULAR' ? 6 : 4.5;
  const netSavingsRate = actualIncome > 0 ? (actualIncome - totalNeedsWantsSpent) / actualIncome : 0;
  const fixedCostRatio = yBase > 0 ? totalActiveFixedBills / yBase : 1;
  const totalMinDebtPayments = sum(debts.filter((d) => d.principal > 0).map((d) => d.minMonthlyPayment));
  const dtiRatio = yBase > 0 ? totalMinDebtPayments / yBase : 0;
  const hasHighInterestDebt = debts.some((d) => d.principal > 0 && d.apr > 10), wantsRatio = yBase > 0 ? currWantsSpent / yBase : 1;
  const sSavings = netSavingsRate <= 0 ? 0 : netSavingsRate <= .2 ? netSavingsRate / .2 * 80 : Math.min(100, 80 + (netSavingsRate - .2) / .1 * 20);
  const sRunway = clamp(runwayMonths / targetRunway * 100, 0, 100);
  const sFixed = clamp((1 - (fixedCostRatio - .5) / .35) * 100, 0, 100);
  const sDebt = clamp((1 - Math.max(0, dtiRatio - .1) / .3) * 100, 0, 100) * (hasHighInterestDebt ? .6 : 1);
  const sControl = clamp((1 - (wantsRatio - .3) / .25) * 100, 0, 100);
  const fhi = round1(.25 * sSavings + .30 * sRunway + .20 * sFixed + .15 * sDebt + .10 * sControl);
  const level = netSavingsRate < 0 || cashFlow < 0 ? 1 : runwayMonths < 1 ? 2 : hasHighInterestDebt ? 3 : runwayMonths < targetRunway ? 4 : 5;
  const strategy = LEVELS[level - 1];
  let alloc = { needs: strategy.needs, wants: strategy.wants, save: strategy.save };
  if (fixedCostRatio > alloc.needs) {
    const needs = Math.min(.75, fixedCostRatio), excess = needs - alloc.needs;
    const wants = Math.max(.10, alloc.wants - excess);
    alloc = { needs, wants, save: Math.max(.05, 1 - needs - wants) };
  }
  const label = fhi < 40 ? 'Dễ tổn thương' : fhi < 70 ? 'Đang xoay xở' : fhi < 85 ? 'Ổn định' : 'Vững tài chính';
  return { fhi, label, level, strategy, alloc, scores: { sSavings, sRunway, sFixed, sDebt, sControl }, essentialMonthly, runwayMonths, targetRunway, netSavingsRate, fixedCostRatio, dtiRatio, hasHighInterestDebt, wantsRatio, totalMinDebtPayments };
}

// Module 5 — committed fixed bills are reserved exactly once.
export function safeToSpend({ yBase = 0, alloc = { save: .25 }, totalActiveFixedBills = 0, currentMonthVariableSpent = 0, elapsedDays = 1, daysInMonth = 30 }) {
  const savingsTargetMonthly = Math.round(yBase * alloc.save), savingsTargetDaily = Math.round(savingsTargetMonthly / daysInMonth);
  const variableBudgetTotal = Math.max(0, yBase - totalActiveFixedBills - savingsTargetMonthly);
  const remainingVariablePool = variableBudgetTotal - currentMonthVariableSpent, daysLeft = Math.max(1, daysInMonth - elapsedDays + 1);
  const dailySafeToSpend = Math.round(Math.max(0, remainingVariablePool) / daysLeft);
  const variableBurnRatio = variableBudgetTotal > 0 && elapsedDays > 0 ? currentMonthVariableSpent / variableBudgetTotal / (elapsedDays / daysInMonth) : 0;
  const status = variableBudgetTotal === 0 && currentMonthVariableSpent > 0 ? 'danger' : variableBurnRatio <= 1 ? 'safe' : variableBurnRatio <= 1.15 ? 'notice' : variableBurnRatio <= 1.3 ? 'warning' : 'danger';
  return { savingsTargetMonthly, savingsTargetDaily, variableBudgetTotal, remainingVariablePool, daysLeft, dailySafeToSpend, variableBurnRatio, status };
}

// Module 6 — bounded deterministic cuts; keep every cut a multiple of 50,000.
export function cutbackPlan({ yBase = 0, blendedEomForecast = 0, savingsTargetMonthly = 0, categoryAverages = [], daysInMonth = 30 }) {
  const projectedSurplus = yBase - blendedEomForecast, savingsGap = Math.max(0, savingsTargetMonthly - projectedSurplus);
  let remainingGap = savingsGap;
  const actions = [], totalWants = sum(categoryAverages.map((c) => c.amount));
  for (const { category, amount: amt } of [...categoryAverages].sort((a, b) => b.amount - a.amount)) {
    if (remainingGap <= 0 || totalWants <= 0) break;
    const maxCut = Math.round(amt * 35 / 100);
    const rawShare = Math.min(maxCut, Math.max(remainingGap * (amt / totalWants), Math.min(remainingGap, maxCut)));
    const suggestedCut = Math.min(Math.round(rawShare / 50000) * 50000, Math.floor(maxCut / 50000) * 50000, Math.floor(remainingGap / 50000) * 50000);
    if (suggestedCut < 50000) continue;
    actions.push({ category, currentAvg: Math.round(amt), suggestedCut, newCap: Math.round(amt - suggestedCut), cutPct: round1(suggestedCut / amt * 100), dailySaveGain: Math.round(suggestedCut / daysInMonth) });
    remainingGap -= suggestedCut;
  }
  return { projectedSurplus, savingsGap, actions, unmetGap: remainingGap };
}

/** Level-payment debt model. Returns explicit infeasible/limit states, no infinite loop. */
export function simulateDebtPayoff(debts, extraMonthly = 0) {
  const active = debts.filter((d) => d.principal > 0).sort((a, b) => b.apr - a.apr || a.principal - b.principal);
  const simulate = (extra) => {
    const ds = active.map((d) => ({ ...d, balance: d.principal }));
    const budget = sum(ds.map((d) => d.minMonthlyPayment)) + Math.max(0, extra);
    if (!ds.length) return { months: 0, interest: 0, paidOff: true };
    let interest = 0;
    for (let month = 1; month <= 1200; month++) {
      const before = sum(ds.map((d) => d.balance));
      for (const d of ds) { const i = d.balance * d.apr / 1200; interest += i; d.balance += i; }
      let available = budget;
      for (const d of ds) { const payment = Math.min(d.balance, d.minMonthlyPayment, available); d.balance -= payment; available -= payment; }
      for (const d of ds) { const payment = Math.min(d.balance, available); d.balance -= payment; available -= payment; }
      if (ds.every((d) => d.balance < 1)) return { months: month, interest: Math.round(interest), paidOff: true };
      if (sum(ds.map((d) => d.balance)) >= before) return { months: null, interest: Math.round(interest), paidOff: false };
    }
    return { months: null, interest: Math.round(interest), paidOff: false };
  };
  const baseline = simulate(0), accelerated = simulate(extraMonthly);
  return { orderedDebts: active, baseline, accelerated, interestSaved: baseline.paidOff && accelerated.paidOff ? Math.max(0, baseline.interest - accelerated.interest) : null };
}

export function analyzeFinance({ transactions = [], recurring_bills = [], debts = [], profile = DEFAULT_PROFILE }, date = new Date()) {
  const today = localDate(date), key = today.slice(0, 7), elapsedDays = date.getDate(), daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const months = aggregateMonths(transactions, date), current = months.find((m) => m.month === key) || { month: key, income: 0, needs: 0, wants: 0, spent: 0, variable: 0, savings_debt: 0 };
  const firstMonth = months[0]?.month;
  const history = firstMonth ? monthKeys(new Date(date.getFullYear(), date.getMonth() - 1, 1), 120).filter((m) => m >= firstMonth).map((m) => months.find((x) => x.month === m) || { month: m, income: 0, needs: 0, wants: 0, spent: 0, variable: 0, savings_debt: 0 }) : [];
  const incomeMonths = [...history, ...(current.income > 0 ? [current] : [])].slice(-12);
  const income = classifyIncome(incomeMonths.map((m) => m.income), current.income, profile.incomeModeOverride);
  const currentTs = transactions.filter((t) => t.date.startsWith(key) && t.date <= today);
  const fixedTs = currentTs.filter((t) => t.type === 'expense' && t.isFixedBill && ['needs', 'wants'].includes(t.group));
  const activeBills = recurring_bills.filter((b) => b.active);
  // Match each payment once. Partial payments leave the remaining bill reserved.
  const paymentPool = fixedTs.map((t) => ({ ...t, left: t.amount }));
  const bills = activeBills.map((b) => {
    let remaining = b.amount;
    for (const p of paymentPool) {
      if (p.left <= 0 || p.category !== b.category || p.group !== b.group) continue;
      const used = Math.min(p.left, remaining); p.left -= used; remaining -= used;
      if (!remaining) break;
    }
    return { ...b, remaining, paid: remaining === 0 };
  });
  const paidFixedBills = sum(fixedTs.map((t) => t.amount)), unpaidFixedBills = sum(bills.map((b) => b.remaining));
  const totalActiveFixedBills = Math.max(sum(activeBills.map((b) => b.amount)), paidFixedBills + unpaidFixedBills);
  const health = financialHealth({ yBase: income.yBase, actualIncome: current.income, totalNeedsWantsSpent: current.spent, avgMonthlyNeeds: avg(history.length ? history.slice(-6).map((m) => m.needs) : [current.needs]), totalActiveFixedBills, currWantsSpent: current.wants, debts, profile, incomeMode: income.mode });
  const forecast = forecastSpending({ hist: history.map((m) => m.spent), currVarSpent: current.variable, paidFixedBills, unpaidFixedBills, elapsedDays, daysInMonth });
  const safe = safeToSpend({ yBase: income.yBase, alloc: health.alloc, totalActiveFixedBills, currentMonthVariableSpent: current.variable, elapsedDays, daysInMonth });
  const categoryMonths = history.length ? history.slice(-6).map((m) => m.month) : [key];
  const categoryAverages = [...new Set(transactions.filter((t) => t.group === 'wants').map((t) => t.category))].map((category) => ({ category, amount: Math.round(sum(transactions.filter((t) => t.type === 'expense' && t.group === 'wants' && t.category === category && categoryMonths.includes(t.date.slice(0, 7)) && t.date <= today).map((t) => t.amount)) / categoryMonths.length) }));
  const cutbacks = cutbackPlan({ yBase: income.yBase, blendedEomForecast: forecast.blendedEomForecast, savingsTargetMonthly: safe.savingsTargetMonthly, categoryAverages, daysInMonth });
  return { today, month: key, elapsedDays, daysInMonth, history, current, currentTs, income, health, forecast, safe, cutbacks, bills, totalActiveFixedBills, paidFixedBills, unpaidFixedBills, anomalies: detectAnomalies(transactions, income.yBase, date), payday: paydaySpike(transactions, profile.paydayDay, date), lifestyle: lifestyleCreep(history), debtPlan: simulateDebtPayoff(debts, Math.max(0, safe.savingsTargetMonthly - health.totalMinDebtPayments)) };
}
```

### File: js/charts.js

```javascript
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
  if (tab === 'overview') {
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
```

### File: js/seed-data.js

```javascript
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
```

### File: js/ui.js

```javascript
import { CATEGORIES, GROUP_LABELS, clamp, sum } from './finance-engine.js';

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
const E = escapeHtml;
export const formatVND = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Math.round(Number.isFinite(value) ? value : 0));
const N = (value, decimals = 1) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: decimals }).format(Number.isFinite(value) ? value : 0);
export const formatMonth = (key) => `Tháng ${Number(key.slice(5))}, ${key.slice(0, 4)}`;
const dateText = (d) => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;
const categoryIcon = (category, group) => group === 'income' ? 'wallet' : category.includes('Cafe') ? 'coffee' : category.includes('nhà') ? 'home' : category.includes('Mua') ? 'bag' : group === 'savings_debt' ? 'sprout' : 'receipt';
const btn = (label, action, cls = 'primary', symbol = '', attrs = '') => `<button class="button ${cls}" data-action="${action}" ${attrs}>${symbol ? icon(symbol) : ''}${label}</button>`;
const empty = (title, text, action = '') => `<div class="empty-state">${icon('sprout')}<h3>${title}</h3><p>${text}</p>${action}</div>`;
const canvas = (id, label, small = false) => `<div class="chart-wrap${small ? ' small' : ''}"><canvas id="${id}" role="img" aria-label="${E(label)}"></canvas></div>`;
function heading(title, subtitle, a, primary = true) {
  return `<div class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="heading-actions"><span class="month-pill">${icon('calendar')}${formatMonth(a.month)}</span>${primary ? btn('Thêm giao dịch', 'add-transaction', 'primary', 'plus') : ''}</div></div>`;
}
export function transactionRows(transactions, editable = false) {
  return transactions.map((t) => `<tr><td><div class="transaction-title"><span class="category-icon ${t.group}">${icon(categoryIcon(t.category, t.group))}</span><div><strong>${E(t.category)}</strong><small>${E(t.note || (t.isFixedBill ? 'Hóa đơn cố định' : GROUP_LABELS[t.group]))}</small></div></div></td><td><span class="badge ${t.group === 'wants' ? 'warning' : t.group === 'savings_debt' ? 'notice' : 'safe'}">${GROUP_LABELS[t.group]}</span></td><td class="muted">${dateText(t.date)}</td><td class="align-right money ${t.type === 'income' ? 'amount-income' : 'amount-expense'}">${t.type === 'income' ? '+' : '−'}${formatVND(t.amount)}</td>${editable ? `<td><div class="row-actions"><button class="icon-button" data-action="edit-transaction" data-id="${E(t.id)}" aria-label="Sửa ${E(t.category)}">${icon('edit')}</button><button class="icon-button delete" data-action="delete-transaction" data-id="${E(t.id)}" aria-label="Xóa ${E(t.category)}">${icon('trash')}</button></div></td>` : ''}</tr>`).join('');
}
function transactionTable(ts, editable = false, recent = false) {
  return `<div class="table-scroll ${recent ? 'recent-table' : ''}"><table><thead><tr><th>Giao dịch</th><th>Nhóm</th><th>Ngày</th><th class="align-right">Số tiền</th>${editable ? '<th class="align-right">Thao tác</th>' : ''}</tr></thead><tbody>${transactionRows(ts, editable)}</tbody></table></div>`;
}
export function renderOverview(data, a, installDismissed) {
  const hasData = data.transactions.length > 0, { health: h, safe: s, income } = a;
  const burnLabels = { safe: 'Trong hạn mức', notice: 'Đang chi hơi nhanh', warning: 'Cần giảm nhịp chi', danger: 'Nguy cơ vượt quỹ' };
  const currentBalance = a.current.income - a.current.spent;
  const recent = [...data.transactions].filter((t) => t.date <= a.today).sort((x, y) => y.date.localeCompare(x.date) || y.createdAt - x.createdAt).slice(0, 4);
  const incomeLabels = { NO_INCOME: 'Chưa có thu nhập', COLD_START: 'Đang tìm hiểu thu nhập', STABLE: 'Thu nhập ổn định', MODERATE: 'Thu nhập dao động vừa', IRREGULAR: 'Thu nhập biến động' };
  const sample = data.transactions.some((t) => t.note === 'Thu nhập minh họa');
  return heading('Một chút rõ ràng, một ngày an tâm.', 'Cùng nhìn lại dòng tiền và vững vàng hơn với những lựa chọn hôm nay.', a) +
    (sample ? `<div class="banner">Bạn đang xem dữ liệu minh họa. ${btn('Bắt đầu sổ của tôi', 'clear-data', 'ghost small')}</div>` : '') +
    (!hasData ? `<div class="panel welcome-panel"><div><h2>Chào mừng đến góc tài chính của bạn</h2><p>Bắt đầu bằng khoản thu đầu tiên, rồi ghi lại chi tiêu hằng ngày. Hoặc thử dữ liệu mẫu để khám phá dự báo và các gợi ý hành động.</p></div><div class="welcome-actions">${btn('Ghi khoản đầu tiên', 'add-transaction', 'primary', 'plus')}${btn('Thử dữ liệu mẫu', 'seed-data', 'secondary')}</div></div>` : '') +
    `<div class="section-label">BỨC TRANH TÀI CHÍNH THÁNG NÀY</div>
    <section class="metrics-grid" aria-label="Các chỉ số chính">
      <article class="metric-card featured"><div class="metric-top"><span>Hạn mức an toàn hôm nay</span><span class="metric-icon">${icon('wallet')}</span></div><div class="metric-value money">${formatVND(s.dailySafeToSpend)}</div><div class="metric-foot"><span class="badge ${s.status}">${burnLabels[s.status]}</span><span>Còn ${s.daysLeft} ngày</span></div></article>
      <article class="metric-card"><div class="metric-top"><span>Sức khỏe tài chính · FHI</span><span class="metric-icon">${icon('heart')}</span></div><div class="metric-value tabular">${hasData ? N(h.fhi) : '—'} <span class="unit">/ 100</span></div><div class="score-ring" style="--score:${hasData ? h.fhi : 0}%">${icon('check')}</div><div class="metric-foot"><span class="badge">Cấp ${h.level}/5</span><span>${hasData ? h.label : 'Bắt đầu từ hôm nay'}</span></div></article>
      <article class="metric-card"><div class="metric-top"><span>Mục tiêu tiết kiệm & Trả nợ</span><span class="metric-icon">${icon('target')}</span></div><div class="metric-value money">${formatVND(s.savingsTargetDaily)}<span class="savings-unit"> /ngày</span></div><div class="metric-foot">${icon('calendar')}<span>${formatVND(s.savingsTargetMonthly)} cho cả tháng</span></div></article>
      <article class="metric-card"><div class="metric-top"><span>Quỹ dự phòng của bạn</span><span class="metric-icon">${icon('shield')}</span></div><div class="metric-value tabular">${N(h.runwayMonths)} <span class="unit">/ ${N(h.targetRunway)} tháng</span></div><div class="progress" role="progressbar" aria-label="Tiến độ quỹ dự phòng" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(clamp(h.runwayMonths / h.targetRunway * 100, 0, 100))}"><span style="width:${clamp(h.runwayMonths / h.targetRunway * 100, 0, 100)}%"></span></div><div class="metric-foot">${formatVND(data.profile.liquidSavings)} đang sẵn sàng</div></article>
    </section>
    <div class="main-grid"><section class="panel chart-panel"><div class="panel-header"><div><h2>Dòng tiền qua từng tháng</h2><p>6 tháng gần nhất · Đơn vị: triệu đồng</p></div><div class="chart-legend"><span class="legend-item"><i class="legend-dot income"></i>Thu nhập</span><span class="legend-item"><i class="legend-dot expense"></i>Chi tiêu</span><span class="legend-item"><i class="legend-dot forecast"></i>Dự báo</span></div></div>${canvas('cashflow-chart', 'Thu nhập, chi tiêu và dự báo chi tiêu sáu tháng gần nhất')}<div class="chart-summary"><div><span>Thu nhập tháng này</span><strong>${formatVND(a.current.income)}</strong></div><div><span>Thu trừ chi sinh hoạt</span><strong style="color:var(--${currentBalance >= 0 ? 'green' : 'red'})">${formatVND(currentBalance)}</strong></div><div><span>Dự báo chi cuối tháng</span><strong>${formatVND(a.forecast.blendedEomForecast)}</strong></div></div></section>
      <section class="panel strategy-panel"><div class="panel-header"><div class="strategy-head">${icon('sparkles')}<h2>Chiến lược tháng này</h2></div><span class="badge">Cá nhân hóa</span></div><div><p class="level-label">BƯỚC ƯU TIÊN · CẤP ${h.level}/5</p><h3 class="strategy-title">${h.strategy.title}</h3><p class="strategy-copy">${h.strategy.description}</p></div><div><p class="allocation-label">PHÂN BỔ NGÂN SÁCH GỢI Ý</p><div class="allocation-bar" aria-label="Phân bổ ngân sách"><span style="width:${h.alloc.needs * 100}%"></span><span style="width:${h.alloc.wants * 100}%"></span><span style="width:${h.alloc.save * 100}%"></span></div><div class="allocation-legend"><span>Thiết yếu<strong>${N(h.alloc.needs * 100, 0)}%</strong></span><span>Mong muốn<strong>${N(h.alloc.wants * 100, 0)}%</strong></span><span>Tiết kiệm & Nợ<strong>${N(h.alloc.save * 100, 0)}%</strong></span></div><div class="strategy-callout">${icon('leaf')}<p>${income.mode === 'IRREGULAR' && income.surplusForBuffer > 0 ? `Dành ${formatVND(income.surplusForBuffer)} vượt thu nhập nền để làm dày quỹ đệm.` : `${incomeLabels[income.mode]}. ${income.yBase > 0 ? `Kế hoạch dựa trên ${formatVND(income.yBase)}/tháng.` : 'Thêm khoản thu để xây dựng kế hoạch riêng.'}`}</p></div></div></section></div>
    <div class="main-grid"><section class="panel"><div class="panel-header recent-header"><div><h2>Những giao dịch gần đây</h2><p>Mỗi khoản nhỏ đều có một câu chuyện.</p></div><a class="text-link" href="#transactions">Xem tất cả</a></div>${recent.length ? transactionTable(recent, false, true) : empty('Chưa có khoản thu chi nào', 'Ghi khoản đầu tiên để bắt đầu hiểu dòng tiền của bạn.', btn('Thêm giao dịch', 'add-transaction', 'secondary', 'plus'))}</section><section class="panel"><div class="panel-header"><div><h2>Điểm vững vàng của bạn</h2><p>5 yếu tố tạo nên sức khỏe tài chính</p></div></div>${canvas('health-chart', 'Năm điểm thành phần sức khỏe tài chính, trên thang một trăm', true)}</section></div>
    ${a.cutbacks.savingsGap > 0 ? `<section class="panel section-spaced"><div class="panel-header"><div><h2>Một vài điều chỉnh, gần mục tiêu hơn</h2><p>Dự báo còn thiếu ${formatVND(a.cutbacks.savingsGap)} so với mục tiêu tiết kiệm và trả nợ tháng này.</p></div>${icon('target')}</div>${a.cutbacks.actions.length ? `<div class="table-scroll cutback-table"><table><thead><tr><th>Danh mục</th><th class="align-right">Trung bình/tháng</th><th class="align-right">Giảm bớt</th><th class="align-right">Hạn mức mới</th><th class="align-right">Để dành thêm/ngày</th></tr></thead><tbody>${a.cutbacks.actions.map((c) => `<tr><td>${E(c.category)}</td><td class="align-right money">${formatVND(c.currentAvg)}</td><td class="align-right money amount-income">${formatVND(c.suggestedCut)} <span class="muted">(${N(c.cutPct)}%)</span></td><td class="align-right money">${formatVND(c.newCap)}</td><td class="align-right money">${formatVND(c.dailySaveGain)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted helper-text">Chưa đủ mức chi mong muốn để đề xuất cắt giảm theo nấc 50.000 ₫.</p>'}${a.cutbacks.unmetGap > 0 ? `<p class="insight-note">Còn ${formatVND(a.cutbacks.unmetGap)} cần bù thêm. Hãy rà soát hóa đơn cố định hoặc tìm thêm nguồn thu; mỗi danh mục chỉ được gợi ý giảm tối đa 35%.</p>` : ''}</section>` : ''}
    ${!installDismissed ? `<aside class="install-banner">${icon('laptop')}<div><strong>Một góc tài chính, luôn ở gần bạn</strong><p>Cài lên laptop để mở nhanh, dùng cả khi mất mạng. Nhớ sao lưu định kỳ để giữ dữ liệu an toàn.</p></div><button class="text-link" data-action="install">Cách cài đặt</button><button class="icon-button" data-action="dismiss-install" aria-label="Ẩn gợi ý cài đặt">${icon('close')}</button></aside>` : ''}`;
}

export function filteredTransactions(data, filters) {
  return data.transactions.filter((t) => (!filters.month || t.date.startsWith(filters.month)) && (!filters.group || t.group === filters.group) && (!filters.category || t.category === filters.category) && (!filters.search || `${t.note} ${t.category}`.toLocaleLowerCase('vi-VN').includes(filters.search.toLocaleLowerCase('vi-VN')))).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}
export function renderTransactions(data, a, filters, page) {
  const ts = filteredTransactions(data, filters), size = 15, pages = Math.max(1, Math.ceil(ts.length / size));
  page = Math.min(page, pages);
  const categories = [...new Set(data.transactions.filter((t) => !filters.group || t.group === filters.group).map((t) => t.category))].sort((a, b) => a.localeCompare(b, 'vi'));
  return heading('Sổ thu chi', 'Ghi lại từng khoản nhỏ. Hiểu rõ từng lựa chọn.', a) + `<section class="panel"><div class="filters"><label>Tháng<input type="month" id="filter-month" value="${E(filters.month)}"></label><label>Nhóm<select id="filter-group"><option value="">Tất cả nhóm</option>${Object.entries(GROUP_LABELS).map(([k, v]) => `<option value="${k}" ${filters.group === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label><label>Danh mục<select id="filter-category"><option value="">Tất cả danh mục</option>${categories.map((c) => `<option value="${E(c)}" ${filters.category === c ? 'selected' : ''}>${E(c)}</option>`).join('')}</select></label><label>Tìm giao dịch<input type="search" id="filter-search" value="${E(filters.search)}" placeholder="Tìm ghi chú, danh mục…" maxlength="1000"></label></div><div id="ledger-results"><div class="transactions-summary"><div><span>Tổng thu</span><strong class="amount-income">${formatVND(sum(ts.filter((t) => t.type === 'income').map((t) => t.amount)))}</strong></div><div><span>Tổng chi & Chuyển tiết kiệm</span><strong>${formatVND(sum(ts.filter((t) => t.type === 'expense').map((t) => t.amount)))}</strong></div><div><span>Số giao dịch</span><strong>${ts.length}</strong></div></div>${ts.length ? transactionTable(ts.slice((page - 1) * size, page * size), true) : empty('Chưa tìm thấy giao dịch', 'Thêm một khoản mới hoặc thử đổi bộ lọc để xem lại các giao dịch.', btn('Thêm giao dịch', 'add-transaction', 'secondary', 'plus'))}<div class="pagination"><span>${ts.length ? `${(page - 1) * size + 1}–${Math.min(page * size, ts.length)} / ${ts.length} giao dịch` : '0 giao dịch'}</span><div class="pagination-controls">${btn('Trước', 'prev-page', 'secondary small', '', page <= 1 ? 'disabled' : '')}<span class="month-pill">${page} / ${pages}</span>${btn('Sau', 'next-page', 'secondary small', '', page >= pages ? 'disabled' : '')}</div></div><p class="fine-print">Khoản chuyển tiết kiệm và trả nợ được ghi riêng, không tính là chi sinh hoạt trong dự báo. Giao dịch ngày tương lai chỉ được tính vào chỉ số khi đến ngày đó.</p></div></section>`;
}

export function renderAnalysis(data, a) {
  const p = a.payday, l = a.lifestyle;
  const psiText = p.psi === null ? 'Chưa đủ dữ liệu' : Number.isFinite(p.psi) ? `${N(p.psi)} lần` : 'Chỉ chi sau ngày lương';
  return heading('Hiểu thói quen, giữ nhịp chi tiêu.', 'Nhận ra những thay đổi nhỏ trước khi chúng trở thành áp lực lớn.', a) +
    `<div class="diagnostics-grid"><article class="panel"><div class="panel-header"><h2>Chi tiêu sau ngày lương · PSI</h2><span class="badge ${p.warning ? 'warning' : 'safe'}">${p.warning ? 'Cần chú ý' : 'Đang theo dõi'}</span></div><div class="diagnostic-value">${psiText}</div><p class="diagnostic-copy">${p.psi === null ? 'Ghi thêm giao dịch để so sánh chi tiêu 5 ngày từ ngày lương với những ngày còn lại.' : `Chi biến đổi mỗi ngày sau lương: ${formatVND(p.paydayAvg)}; ngày còn lại: ${formatVND(p.otherAvg)}. ${p.warning ? 'Thử giữ cùng một hạn mức chi mỗi ngày, kể cả khi vừa nhận lương.' : 'Nhịp chi sau lương đang tương đối cân bằng.'}`}</p><p class="fine-print">So sánh trên tối đa 3 tháng gần nhất, có tính cả ngày không chi. Ngưỡng cần chú ý: từ 1,5 lần.</p></article>
    <article class="panel"><div class="panel-header"><h2>Chi mong muốn đang tăng?</h2><span class="badge ${l.warning ? 'warning' : 'safe'}">${l.available ? l.warning ? 'Đang tăng nhanh' : 'Trong tầm kiểm soát' : 'Cần thêm lịch sử'}</span></div><div class="diagnostic-value">${l.available ? `${l.driftPP > 0 ? '+' : ''}${N(l.driftPP)} điểm %` : 'Chưa đủ 4 tháng'}</div><p class="diagnostic-copy">${l.available ? `Tỷ trọng chi mong muốn/thu nhập chuyển từ ${N(l.ratioPrev * 100)}% lên ${N(l.ratioCurr * 100)}%. ${l.warning ? 'Giữ lại những khoản thật sự đem đến niềm vui và đặt trần cho phần còn lại.' : 'Chi mong muốn đang tăng phù hợp với thu nhập.'}` : 'Sau ít nhất 4 tháng hoàn chỉnh có thu nhập, bạn sẽ thấy chi mong muốn tăng nhanh hơn thu nhập hay không.'}</p><p class="fine-print">So sánh hai giai đoạn liền nhau, mỗi giai đoạn 2 hoặc 3 tháng; không dùng tháng đang dở.</p></article></div>
    <div class="main-grid"><section class="panel"><div class="panel-header"><div><h2>Tiền đang đi về đâu?</h2><p>Cơ cấu chi sinh hoạt trong ${formatMonth(a.month).toLowerCase()}</p></div></div>${canvas('category-chart', 'Tỷ trọng chi tiêu theo danh mục trong tháng')}</section><section class="panel"><div class="panel-header"><div><h2>Nhịp chi trong tháng</h2><p>Chi biến đổi lũy kế và mức chi đều dự kiến</p></div></div>${canvas('daily-chart', 'Chi tiêu biến đổi lũy kế từng ngày so với đường ngân sách tuyến tính')}</section></div>
    <section class="panel"><div class="panel-header"><div><h2>Những khoản chi đáng nhìn lại</h2><p>So với mức thường thấy trong cùng danh mục · 90 ngày gần nhất</p></div><span class="badge ${a.anomalies.length ? 'warning' : 'safe'}">${a.anomalies.length} khoản</span></div>${a.anomalies.length ? `<div class="alert-list">${a.anomalies.slice(0, 30).map((t) => `<article class="alert-row ${t.severity === 'CRITICAL' ? 'critical' : ''}"><span class="alert-icon">${icon('alert')}</span><div class="alert-body"><strong>${E(t.category)}</strong> <span class="badge ${t.severity === 'CRITICAL' ? 'danger' : 'warning'}">${t.severity === 'CRITICAL' ? 'Bất thường cao' : 'Cần xem lại'}</span><p>${dateText(t.date)} · ${t.multiple === null ? 'Mức thường thấy bằng 0' : `Gấp ${N(t.multiple)} lần mức thường thấy (${formatVND(t.median)})`}${t.note ? ` · ${E(t.note)}` : ''}</p></div><span class="alert-amount money">${formatVND(t.amount)}</span><button class="icon-button" data-action="edit-transaction" data-id="${E(t.id)}" aria-label="Xem và sửa giao dịch">${icon('edit')}</button></article>`).join('')}</div>${a.anomalies.length > 30 ? '<p class="fine-print">Hiển thị 30 khoản mới nhất. Xem toàn bộ giao dịch trong Sổ thu chi.</p>' : ''}` : empty('Chưa có khoản chi bất thường', 'Mỗi danh mục cần ít nhất 5 giao dịch để so sánh. Chỉ những chênh lệch đủ lớn mới được nhắc tới.')}<p class="fine-print">Một khoản chi khác thường có thể hoàn toàn hợp lý. Gợi ý này giúp bạn nhìn lại, không tự thay đổi hay xóa giao dịch.</p></section>
    <details class="panel section-spaced"><summary>Cách các chỉ số được tính</summary><div class="method-content"><p><strong>Thu nhập nền:</strong> dùng tối đa 12 tháng. Thu nhập ổn định lấy trung bình; thu nhập biến động dùng mức thận trọng hơn. Hiện có ${a.income.months} tháng quan sát.</p><p><strong>Dự báo:</strong> ${E(a.forecast.tier)}; phối hợp xu hướng lịch sử với nhịp chi thực tế trong tháng. Hóa đơn đã trả và chưa trả được cộng đúng một lần.</p><p><strong>Hạn mức hôm nay:</strong> lấy thu nhập nền, trừ hóa đơn cố định và mục tiêu tiết kiệm/trả nợ, trừ chi biến đổi đã dùng, rồi chia cho số ngày còn lại (tính cả hôm nay).</p><p><strong>Điểm sức khỏe FHI:</strong> tiết kiệm 25%, quỹ dự phòng 30%, chi cố định 20%, nợ 15%, kiểm soát chi mong muốn 10%. Đây là thang điểm của ứng dụng, giúp theo dõi thói quen; không phải xếp hạng tín dụng hay chứng nhận tài chính.</p><p><strong>Quỹ dự phòng:</strong> ${formatVND(data.profile.liquidSavings)} chia cho ${formatVND(a.health.essentialMonthly)} chi thiết yếu ước tính/tháng. Mục tiêu ${N(a.health.targetRunway)} tháng theo quy tắc trong ứng dụng.</p></div></details>`;
}

export function renderPlanning(data, a, extraPayment) {
  const activeDebts = [...data.debts].sort((x, y) => y.apr - x.apr || x.principal - y.principal);
  return heading('Ít áp lực hơn. Nhiều chủ động hơn.', 'Sắp xếp hóa đơn, trả nợ có kế hoạch và làm dày lớp đệm an tâm.', a, false) +
  `<div class="planning-grid"><div class="stack"><section class="panel"><div class="panel-header"><div><h2>Hóa đơn cố định</h2><p>Chủ động dành ${formatVND(a.totalActiveFixedBills)} mỗi tháng</p></div>${btn('Thêm', 'add-bill', 'secondary small', 'plus')}</div>${data.recurring_bills.length ? [...data.recurring_bills].sort((x, y) => x.dueDay - y.dueDay).map((b) => { const status = a.bills.find((x) => x.id === b.id); return `<article class="bill-row"><span class="category-icon">${icon('receipt')}</span><div class="record-info"><h3>${E(b.name)}</h3><p>Ngày ${b.dueDay} hằng tháng · ${!b.active ? 'Đã tạm dừng' : status?.paid ? 'Đã thanh toán tháng này' : `Còn ${formatVND(status?.remaining || b.amount)}`}</p></div><div class="record-money money">${formatVND(b.amount)}<small>${GROUP_LABELS[b.group]}</small></div><div class="record-actions">${b.active && !status?.paid ? `<button class="icon-button" data-action="pay-bill" data-id="${E(b.id)}" aria-label="Ghi thanh toán ${E(b.name)}" title="Ghi thanh toán">${icon('check')}</button>` : ''}<button class="icon-button" data-action="edit-bill" data-id="${E(b.id)}" aria-label="Sửa hóa đơn">${icon('edit')}</button><button class="icon-button delete" data-action="delete-bill" data-id="${E(b.id)}" aria-label="Xóa hóa đơn">${icon('trash')}</button></div></article>`; }).join('') : empty('Chưa có hóa đơn cố định', 'Thêm tiền nhà, điện nước hoặc những khoản trả đều đặn để tính đúng hạn mức chi tiêu.')}<p class="fine-print">Dấu ✓ ghi khoản thanh toán vào sổ thu chi. Hóa đơn chỉ được dự trù, không tự tạo giao dịch. Ngày vượt số ngày thực tế của tháng được hiểu là ngày cuối tháng.</p></section>
    <section class="panel"><div class="panel-header"><div><h2>Các khoản nợ</h2><p>Ưu tiên lãi cao trước để giảm tổng tiền lãi</p></div>${btn('Thêm', 'add-debt', 'secondary small', 'plus')}</div>${activeDebts.length ? activeDebts.map((d, i) => `<article class="debt-row"><span class="debt-priority">${i + 1}</span><div class="record-info"><h3>${E(d.name)} ${d.apr > 10 && d.principal > 0 ? '<span class="badge warning">Lãi cao</span>' : ''}</h3><p>${N(d.apr, 2)}%/năm · Trả tối thiểu ${formatVND(d.minMonthlyPayment)}/tháng</p></div><div class="record-money money">${formatVND(d.principal)}</div><div class="record-actions"><button class="icon-button" data-action="edit-debt" data-id="${E(d.id)}" aria-label="Sửa khoản nợ">${icon('edit')}</button><button class="icon-button delete" data-action="delete-debt" data-id="${E(d.id)}" aria-label="Xóa khoản nợ">${icon('trash')}</button></div></article>`).join('') : empty('Một khoảng trống thật nhẹ nhàng', 'Nếu đang có khoản vay, thêm vào đây để có thứ tự ưu tiên và ước tính trả nợ.')}<p class="fine-print">Số dư nợ được cập nhật tại đây. Ghi giao dịch trả nợ trong sổ không tự trừ số dư để tránh tính nhầm phần gốc và lãi.</p></section></div>
    <div class="stack"><section class="panel"><div class="panel-header"><div><h2>Lớp đệm an tâm</h2><p>Khoản tiền sẵn sàng dùng khi cần thiết</p></div>${icon('shield')}</div><form id="profile-form" class="profile-form"><label>Quỹ dự phòng hiện có (₫)<input name="liquidSavings" type="number" min="0" max="9000000000000" step="1" value="${data.profile.liquidSavings}" required></label><div class="form-grid"><label>Ngày nhận lương<input name="paydayDay" type="number" min="1" max="31" value="${data.profile.paydayDay}" required></label><label>Kiểu thu nhập<select name="incomeModeOverride"><option value="AUTO" ${data.profile.incomeModeOverride === 'AUTO' ? 'selected' : ''}>Tự nhận diện</option><option value="STABLE" ${data.profile.incomeModeOverride === 'STABLE' ? 'selected' : ''}>Ổn định</option><option value="IRREGULAR" ${data.profile.incomeModeOverride === 'IRREGULAR' ? 'selected' : ''}>Biến động</option></select></label></div><button class="button primary" type="submit">${icon('check')}Cập nhật kế hoạch</button></form><p class="insight-note">Quỹ hiện đủ khoảng <strong>${N(a.health.runwayMonths)} tháng</strong> chi thiết yếu. Mốc tiếp theo: <strong>${formatVND(a.health.essentialMonthly * a.health.targetRunway)}</strong> (${N(a.health.targetRunway)} tháng).</p><p class="fine-print">Đây là số dư bạn cập nhật thủ công, không tự cộng lại các giao dịch chuyển vào quỹ.</p></section>
    <section class="panel"><div class="panel-header"><div><h2>Thử trả nợ nhanh hơn</h2><p>Dồn phần dư vào khoản có lãi suất cao nhất</p></div>${icon('sparkles')}</div><label>Có thể trả thêm mỗi tháng (₫)<input type="number" id="extra-payment" min="0" max="9000000000000" step="50000" value="${extraPayment}"></label><div id="debt-simulation"></div><p class="fine-print">Ước tính lãi gộp theo tháng từ lãi suất năm, giữ nguyên tổng ngân sách trả nợ khi một khoản đã hết. Chưa tính phí, ưu đãi hoặc thay đổi lãi suất thực tế.</p></section></div></div>`;
}
export function renderDebtSimulation(plan) {
  if (!plan.orderedDebts.length) return '<p class="insight-note">Thêm khoản nợ để ước tính thời gian và tiền lãi có thể tiết kiệm.</p>';
  return `<div class="chart-summary"><div><span>Thời gian trả hết</span><strong>${plan.accelerated.paidOff ? `${plan.accelerated.months} tháng` : 'Chưa trả hết được'}</strong></div><div><span>Tiền lãi giảm dự kiến</span><strong class="amount-income">${plan.interestSaved === null ? 'Chưa ước tính được' : formatVND(plan.interestSaved)}</strong></div></div>${!plan.accelerated.paidOff ? '<p class="insight-note">Mức trả hiện tại chưa đủ giảm dư nợ hoặc vượt 100 năm mô phỏng. Hãy tăng số tiền trả mỗi tháng.</p>' : !plan.baseline.paidOff ? '<p class="insight-note">Mức trả tối thiểu chưa đủ tất toán. Phần trả thêm giúp có thể trả hết; chưa thể so sánh tổng lãi với phương án cũ.</p>' : `<p class="insight-note">Chỉ trả tối thiểu: ${plan.baseline.months} tháng, tổng lãi ${formatVND(plan.baseline.interest)}. Phương án trả thêm: tổng lãi ${formatVND(plan.accelerated.interest)}.</p>`}`;
}

export function renderSettings(data, a, storage) {
  return heading('Giữ dữ liệu, giữ sự an tâm.', 'Một vài cài đặt nhỏ để góc tài chính luôn thuộc về bạn.', a, false) +
  `<div class="settings-grid"><section class="panel settings-card"><div class="panel-header"><h2>Sao lưu & Khôi phục</h2>${icon('download')}</div><p>Tải một bản JSON để giữ đầy đủ giao dịch, hóa đơn, nợ và cài đặt. Dùng tệp này để chuyển dữ liệu sang trình duyệt hoặc máy khác.</p>${btn('Sao lưu dữ liệu', 'backup', 'primary', 'download')}${btn('Khôi phục từ JSON', 'restore', 'secondary', 'upload')}<div class="setting-row"><div><strong>Bản sao lưu gần nhất</strong><small>${data.profile.lastBackupAt ? E(new Date(data.profile.lastBackupAt).toLocaleString('vi-VN')) : 'Bạn chưa tạo bản sao lưu nào.'}</small></div>${icon('clock')}</div><p class="fine-print">Khôi phục sẽ thay thế dữ liệu hiện có sau khi tệp được kiểm tra. Tệp sao lưu nằm trong thư mục tải xuống trên máy bạn.</p></section>
  <section class="panel settings-card"><div class="panel-header"><h2>Báo cáo cho bảng tính</h2>${icon('receipt')}</div><p>Xuất toàn bộ lịch sử thu chi sang CSV, mở được trong Excel và Google Sheets, giữ nguyên tiếng Việt có dấu.</p>${btn('Xuất báo cáo Excel (CSV)', 'export-csv', 'secondary', 'download')}<div class="setting-row"><div><strong>${data.transactions.length} giao dịch đang được lưu</strong><small>Số tiền là đồng Việt Nam, không có phần thập phân.</small></div><span class="badge">UTF-8</span></div></section>
  <section class="panel settings-card"><div class="panel-header"><h2>Nơi lưu dữ liệu</h2>${icon('shield')}</div><p>Dữ liệu được lưu trong trình duyệt trên laptop này. Đổi trình duyệt, đổi địa chỉ web hoặc xóa dữ liệu trang sẽ tạo một sổ riêng.</p><div class="setting-row"><div><strong>${storage.mode === 'indexeddb' ? 'Đã kết nối bộ nhớ trên máy' : 'Đang dùng bộ nhớ tạm'}</strong><small>${storage.mode === 'indexeddb' ? 'Dữ liệu còn sau khi đóng và mở lại trang.' : 'Hãy sao lưu trước khi đóng thẻ trình duyệt.'}</small></div><span class="badge ${storage.mode === 'indexeddb' ? 'safe' : 'danger'}">${storage.mode === 'indexeddb' ? 'Đã lưu' : 'Tạm thời'}</span></div><div class="setting-row"><div><strong>Lưu trữ bền vững</strong><small>${storage.persistent ? 'Trình duyệt đã cho phép bảo vệ dữ liệu khỏi dọn tự động.' : 'Trình duyệt chưa cấp quyền. Sao lưu thường xuyên vẫn rất cần thiết.'}</small></div>${btn('Kiểm tra', 'persist', 'secondary small')}</div><p class="fine-print">Cho phép lưu bền vững không bảo vệ trước việc bạn xóa dữ liệu trang. Trên Safari, dữ liệu có thể bị dọn sau một thời gian không dùng; cài ứng dụng và giữ một bản JSON sẽ giúp an tâm hơn.</p></section>
  <section class="panel settings-card"><div class="panel-header"><h2>Giao diện & Cách mở</h2>${icon('sun')}</div><div class="setting-row"><div><strong>Giao diện tối</strong><small>Dịu mắt hơn khi xem chi tiêu buổi tối.</small></div><button class="switch" data-action="theme" role="switch" aria-label="Giao diện tối" aria-checked="${data.profile.theme === 'dark'}"><span></span></button></div><div class="setting-row"><div><strong>Mở nhanh trên laptop</strong><small>Cài như một ứng dụng và ghim lên thanh tác vụ.</small></div>${btn('Cách cài', 'install', 'secondary small')}</div><p class="fine-print">Ứng dụng dùng được ngoại tuyến sau khi đã mở và tải đủ các tệp cần thiết ít nhất một lần.</p></section>
  <section class="panel settings-card"><div class="panel-header"><h2>Khám phá bằng dữ liệu mẫu</h2>${icon('sprout')}</div><p>Bộ dữ liệu minh họa tại Việt Nam có 6 tháng lịch sử và tháng hiện tại: thu nhập, hóa đơn, chi hằng ngày, khoản bất thường và nợ thẻ tín dụng lãi 24%/năm.</p>${btn('Nạp dữ liệu mẫu 6 tháng', 'seed-data', 'secondary', 'sparkles')}<p class="fine-print">Dữ liệu mẫu sẽ thay thế sổ hiện có sau khi bạn xác nhận. Các số liệu chỉ để trải nghiệm tính năng.</p></section>
  <section class="panel settings-card danger-zone"><div class="panel-header"><h2>Xóa sổ và bắt đầu lại</h2>${icon('trash')}</div><p>Xóa toàn bộ giao dịch, hóa đơn, khoản nợ và cài đặt trong trình duyệt này. Hãy lưu một bản sao trước nếu vẫn cần dữ liệu.</p>${btn('Xóa toàn bộ dữ liệu', 'clear-data', 'secondary', 'trash')}</section></div>`;
}

export function categoryOptions(group, selected = '', extra = []) {
  return [...new Set([...(CATEGORIES[group] || []), ...extra, ...(selected ? [selected] : [])])].map((c) => `<option value="${E(c)}" ${c === selected ? 'selected' : ''}>${E(c)}</option>`).join('');
}
```

### File: js/app.js

```javascript
import { CATEGORIES, DEFAULT_PROFILE, GROUP_LABELS, analyzeFinance, localDate, simulateDebtPayoff } from './finance-engine.js';
import { initDB, readData, putRecord, deleteRecord, replaceData, storageStatus, validateBackup, createBackup, createCSV, uuid } from './db.js';
import { createSeedData } from './seed-data.js';
import { fillIcons, icon, categoryOptions, renderOverview, renderTransactions, renderAnalysis, renderPlanning, renderSettings, renderDebtSimulation, filteredTransactions } from './ui.js';
import { renderCharts, destroyCharts } from './charts.js';

const tabs = { overview: 'Tổng quan', transactions: 'Sổ thu chi', analysis: 'Phân tích', planning: 'Nợ & Quỹ dự phòng', settings: 'Sao lưu & Cài đặt' };
const state = { data: null, analysis: null, storage: null, tab: 'overview', page: 1, filters: { month: localDate().slice(0, 7), group: '', category: '', search: '' }, extraPayment: 1000000, busy: false, installDismissed: false };
const content = document.getElementById('app-content');
let toastTimer, installPrompt;
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
  state.analysis = analyzeFinance(state.data);
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
  if (state.tab === 'transactions') { state.page = Math.min(state.page, Math.max(1, Math.ceil(filteredTransactions(state.data, state.filters).length / 15))); content.innerHTML = renderTransactions(state.data, a, state.filters, state.page); }
  if (state.tab === 'analysis') content.innerHTML = renderAnalysis(state.data, a);
  if (state.tab === 'planning') { content.innerHTML = renderPlanning(state.data, a, state.extraPayment); updateSimulation(); }
  if (state.tab === 'settings') content.innerHTML = renderSettings(state.data, a, state.storage);
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
}
function updateCategories(form, selected = '') {
  const group = form.elements.group.value;
  form.elements.category.innerHTML = categoryOptions(group, selected, state.data?.transactions.filter((t) => t.group === group).map((t) => t.category));
}
function fillForm(form, record) {
  for (const [key, value] of Object.entries(record)) {
    const el = form.elements.namedItem(key); if (!el) continue;
    if (el.type === 'checkbox') el.checked = value; else el.value = value;
  }
}
function openTransaction(record) {
  const form = document.getElementById('transaction-form'); form.reset(); transactionType(record?.type || 'expense');
  form.elements.id.value = record?.id || ''; form.elements.date.value = localDate();
  if (record) { form.elements.group.value = record.group; updateCategories(form, record.category); fillForm(form, record); }
  document.getElementById('transaction-error').hidden = true;
  document.getElementById('transaction-dialog-title').textContent = record ? 'Chỉnh lại giao dịch' : 'Ghi một giao dịch';
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
async function handleAction(action, id) {
  const find = (store) => state.data[store].find((x) => x.id === id);
  if (action === 'add-transaction') openTransaction();
  else if (action === 'edit-transaction') { const t = find('transactions'); if (t) openTransaction(t); }
  else if (action === 'add-bill') openBill();
  else if (action === 'edit-bill') { const b = find('recurring_bills'); if (b) openBill(b); }
  else if (action === 'add-debt') openDebt();
  else if (action === 'edit-debt') { const d = find('debts'); if (d) openDebt(d); }
  else if (action.startsWith('delete-')) {
    const store = action === 'delete-transaction' ? 'transactions' : action === 'delete-bill' ? 'recurring_bills' : 'debts';
    if (!find(store)) return;
    if (await confirmChange('Xóa mục này?', 'Thao tác sẽ xóa mục đã chọn và tính lại kế hoạch của bạn.', 'Xóa mục này', true)) await mutation(() => deleteRecord(store, id), 'Đã xóa và cập nhật kế hoạch.');
  } else if (action === 'pay-bill') {
    const b = state.analysis.bills.find((x) => x.id === id);
    if (!b || b.paid) return;
    openTransaction({ id: '', type: 'expense', date: localDate(), amount: b.remaining, group: b.group, category: b.category, isFixedBill: true, note: `Thanh toán: ${b.name}` });
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
  const action = event.target.closest('[data-action]'); if (action) handleAction(action.dataset.action, action.dataset.id).catch((e) => toast(e.message, true));
});
document.getElementById('theme-toggle').addEventListener('click', () => handleAction('theme'));
document.addEventListener('change', (event) => {
  const el = event.target;
  if (el.matches('#transaction-form [name=group], #bill-form [name=group]')) updateCategories(el.form);
  const filters = { 'filter-month': 'month', 'filter-group': 'group', 'filter-category': 'category' };
  if (Object.hasOwn(filters, el.id)) { state.filters[filters[el.id]] = el.value; if (el.id === 'filter-group') state.filters.category = ''; state.page = 1; render(); }
});
document.addEventListener('input', (event) => {
  const el = event.target;
  if (el.id === 'filter-search') {
    state.filters.search = el.value; state.page = 1;
    const template = document.createElement('template');
    template.innerHTML = renderTransactions(state.data, state.analysis, state.filters, state.page);
    // Preserve the actual search input, caret, and IME composition while typing.
    document.getElementById('ledger-results').replaceChildren(...template.content.querySelector('#ledger-results').childNodes);
  }
  if (el.id === 'extra-payment') { state.extraPayment = Math.max(0, Math.round(Number(el.value) || 0)); updateSimulation(); }
});
document.addEventListener('submit', async (event) => {
  const form = event.target;
  // Named form controls can shadow native properties (including an input named "id").
  const formId = form.getAttribute('id');
  if (!['transaction-form', 'bill-form', 'debt-form', 'profile-form'].includes(formId)) return;
  event.preventDefault();
  const values = new FormData(form), value = (key) => String(values.get(key) ?? ''), amount = (key) => Math.round(Number(value(key)));
  if (formId === 'profile-form') {
    await mutation(() => putRecord('profile', { ...state.data.profile, liquidSavings: amount('liquidSavings'), paydayDay: amount('paydayDay'), incomeModeOverride: value('incomeModeOverride') }), 'Đã cập nhật quỹ dự phòng và kế hoạch.'); return;
  }
  let store, record;
  const id = value('id') || uuid();
  if (formId === 'transaction-form') {
    store = 'transactions'; const existing = state.data.transactions.find((t) => t.id === id);
    record = { id, type: value('type'), date: value('date'), amount: amount('amount'), group: value('group'), category: value('category'), isFixedBill: values.get('isFixedBill') === 'on', note: value('note'), createdAt: existing?.createdAt || Date.now() };
  } else if (formId === 'bill-form') {
    store = 'recurring_bills'; record = { id, name: value('name'), amount: amount('amount'), dueDay: amount('dueDay'), group: value('group'), category: value('category'), active: values.get('active') === 'on' };
  } else {
    store = 'debts'; record = { id, name: value('name'), principal: amount('principal'), apr: Number(value('apr')), minMonthlyPayment: amount('minMonthlyPayment'), isHighInterest: Number(value('apr')) > 10 };
  }
  const error = document.getElementById(formId.replace('-form', '-error')); error.hidden = true;
  const ok = await mutation(() => putRecord(store, record), 'Đã lưu. Các chỉ số đã được cập nhật.');
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
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && state.data && !document.querySelector('dialog[open]') && !state.busy) refresh().catch((e) => toast(e.message, true)); });
async function boot() {
  fillIcons();
  document.getElementById('today-label').textContent = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  state.storage = await initDB(); state.data = await readData(); navigate();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js').catch(() => { toast('Chưa bật được chế độ ngoại tuyến. Bạn vẫn có thể dùng khi có mạng.'); });
  setInterval(() => { if (state.analysis?.today !== localDate() && !document.querySelector('dialog[open]')) { state.filters.month = localDate().slice(0, 7); refresh().catch((e) => toast(e.message, true)); } }, 30000);
}
boot().catch((error) => { content.replaceChildren(); const box = document.createElement('div'); box.className = 'banner warning'; box.textContent = `Chưa mở được sổ thu chi. ${error.message} Hãy tải lại trang hoặc thử trình duyệt khác.`; content.append(box); });
```

# Bảng kiểm chứng — Vững Tài Chính

Ngày kiểm tra: 21/11/2026. Bộ kiểm tra tự động: `npm test`, **30/30 đạt**, không cần cài thư viện.

| Yêu cầu | Kết quả | Bằng chứng |
| --- | --- | --- |
| GitHub Pages tại thư mục con | Đạt cấu trúc | `.nojekyll` rỗng; HTML, mô-đun, biểu tượng, manifest và Service Worker dùng đường dẫn tương đối; `start_url` và `scope` là `./` |
| Sáu mô-đun định lượng | Đạt kiểm tra | Thu nhập và độ lệch chuẩn mẫu; 4 tầng dự báo; cảnh báo bất thường, PSI và tăng chi mong muốn; FHI và 5 cấp; hạn mức chi; kế hoạch cắt giảm có giới hạn |
| Các biên dễ sai | Đạt kiểm tra | Chưa có dữ liệu, ít tháng thu nhập, chia 0, MAD/IQR bằng 0, ngày cuối tháng, khoảng trống tháng, giao dịch tương lai, thanh toán một phần và hóa đơn trùng danh mục |
| Lưu trữ và sao lưu | Đạt triển khai và kiểm tra hợp đồng dữ liệu | IndexedDB gồm đủ 4 kho; tự yêu cầu `navigator.storage.persist()`; kiểm tra `persisted()`; dữ liệu tạm khi bị chặn; JSON kiểm tra phiên bản, kiểu và ID trùng; thay thế tất cả kho trong một giao dịch ghi |
| Excel có tiếng Việt | Đạt kiểm tra | CSV có ký tự đầu UTF-8 BOM `\uFEFF`, dấu phẩy/dấu nháy/xuống dòng được bao đúng, vô hiệu hóa ô có thể bị hiểu là công thức |
| Dữ liệu mẫu | Đạt kiểm tra | Sáu tháng đầy đủ và phần tháng hiện tại; thử tại ngày 1, 5, 15, 21 và 30 đều kích hoạt cảnh báo, PSI, tăng chi mong muốn, cấp 3 và cắt giảm |
| Giao diện laptop | Đã thử trực tiếp trên Chrome | Đủ 5 mục; ghi thu nhập, sửa số tiền, tìm ghi chú có tiếng Việt, thêm hóa đơn/nợ, cập nhật quỹ; dữ liệu còn sau tải lại |
| Ghi chú an toàn | Đạt kiểm tra tự động và trực tiếp | Chuỗi `<img src=x onerror=alert(1)>` hiển thị thành chữ trong bảng, không được tạo thành phần tử hình ảnh |
| Biểu đồ | Đạt triển khai | Các biểu đồ cột, thanh ngang, vòng tròn và đường; hủy đối tượng cũ trước khi vẽ lại; có thông báo khi Chart.js không tải được |
| Hoạt động ngoại tuyến | Đã triển khai | Service Worker lưu bộ tệp nội bộ và Chart.js; nội bộ ưu tiên mạng, thư viện ngoài ưu tiên bộ đệm. Việc tải lần đầu và quyền lưu trữ do trình duyệt quyết định |

## Kết quả mẫu cố định để đối chiếu

Với mốc ngày 21/11/2026 và dữ liệu do `createSeedData()` tạo:

| Chỉ số | Giá trị |
| --- | --- |
| FHI | 74/100 |
| Cấp ưu tiên | 3 — xóa nợ lãi suất cao |
| Giao dịch bất thường | 2 |
| Hiệu ứng ngày lương PSI | Khoảng 1,64 lần |
| Tăng tỷ trọng chi mong muốn | Khoảng 27,69 điểm phần trăm |
| Hạn mức hôm nay | 211.500 ₫ |
| Danh mục đề xuất cắt giảm | 2 |

## Giới hạn kiểm chứng

- Kết quả các phép tính được kiểm tra độc lập bằng các ca xác định trong `tests/finance-engine.test.js`.
- Việc chuyển đổi qua JSON và trường hợp khôi phục sai không làm thay đổi dữ liệu cũ đã được kiểm tra tự động; quyền lưu bền vững phụ thuộc từng trình duyệt.
- Không có đồng bộ giữa máy hoặc tài khoản; bản sao JSON là cách chuyển dữ liệu được hỗ trợ.
- Dự báo và điểm FHI tuân theo các quy tắc trong bản yêu cầu của ứng dụng, không khẳng định là một mô hình dự báo đã được thẩm định ngoài thực tế.
