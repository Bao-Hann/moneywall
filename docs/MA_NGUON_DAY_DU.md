# Mã nguồn đầy đủ — Vững Tài Chính

Giao diện theo cách ghi hằng ngày, sức khỏe và lộ trình tự chủ; liên kết cọc/hoàn, hóa đơn, quỹ và nợ. SheetJS nguyên bản trong `vendor/`. Không đưa dữ liệu cá nhân vào mã nguồn.

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
      <a href="#planning" data-tab="planning" class="nav-link"><span data-icon="layers"></span><span>Khoản cần lo</span></a>
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
      <div class="dialog-header"><div><h2 id="transaction-dialog-title">Ghi thu chi</h2><p class="helper-text">Ghi ngắn như trong sổ của bạn.</p></div><button type="button" class="icon-button" data-close-dialog aria-label="Đóng"><span data-icon="close"></span></button></div>
      <input type="hidden" name="id">
      <div class="type-switch" role="group" aria-label="Loại giao dịch"><button type="button" data-tx-type="expense" class="selected">Khoản chi</button><button type="button" data-tx-type="income">Khoản thu</button></div>
      <input type="hidden" name="type" value="expense">
      <label class="amount-field">Số tiền <span class="required">*</span><span class="amount-input"><input name="amount" inputmode="numeric" type="number" min="1" max="9000000000000" step="1" placeholder="0" required><span>₫</span></span></label>
      <div class="quick-amounts" aria-label="Chọn nhanh số tiền"><button type="button" data-amount="30000">30.000</button><button type="button" data-amount="50000">50.000</button><button type="button" data-amount="100000">100.000</button><button type="button" data-amount="200000">200.000</button><button type="button" data-amount="500000">500.000</button></div>
      <label>Nội dung <span class="optional">(ghi ngắn tùy bạn)</span><input name="note" maxlength="1000" list="note-suggestions" placeholder="Ví dụ: ăn trưa, xăng, tiền trọ…" autocomplete="off"><datalist id="note-suggestions"></datalist></label>
      <div class="form-grid"><label>Danh mục<input name="category" id="tx-category" list="category-suggestions" maxlength="200" placeholder="Chọn hoặc gõ tên mới" required autocomplete="off"><datalist id="category-suggestions"></datalist></label><label>Ngày ghi<input name="date" type="date" required></label></div>
      <div id="category-shortcuts" class="category-shortcuts" aria-label="Danh mục hay dùng"></div>
      <label>Khoản này là<select name="flowKind" id="tx-flow-kind"></select></label>
      <div id="tx-link-fields" hidden><label id="tx-target-label">Khoản liên quan<select name="targetId" id="tx-target"></select></label><label id="tx-principal-label" hidden>Trong đó trả tiền gốc (₫)<input name="principal" type="number" min="0" max="9000000000000" step="1"><span class="helper-text">Phần còn lại là lãi hoặc phí. Chỉ tiền gốc làm giảm số nợ.</span></label></div>
      <p class="flow-explanation helper-text" id="tx-flow-explanation"></p>
      <input name="billId" type="hidden">
      <details class="tx-extra"><summary>Phân nhóm và hóa đơn</summary><div class="form-grid"><label>Nhóm để phân tích<select name="group" id="tx-group"><option value="needs">Sinh hoạt cần thiết</option><option value="wants">Mua sắm & Giải trí</option><option value="savings_debt">Để dành & Trả nợ</option></select></label><label class="checkbox-label"><input name="isFixedBill" type="checkbox">Hóa đơn hằng tháng</label></div><label id="tx-bill-label" hidden>Hóa đơn liên quan<select name="billTarget" id="tx-bill-target"></select></label></details>
      <p class="form-error" role="alert" id="transaction-error" hidden></p>
      <div class="dialog-actions"><button type="button" class="button secondary" data-close-dialog>Để sau</button><button type="submit" class="button primary"><span data-icon="check"></span>Lưu vào sổ</button></div>
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

  <dialog id="link-payment-dialog" class="form-dialog" aria-labelledby="link-payment-title"><form id="link-payment-form" method="dialog">
    <div class="dialog-header"><h2 id="link-payment-title">Dùng khoản đã ghi</h2><button type="button" class="icon-button" data-close-dialog aria-label="Đóng"><span data-icon="close"></span></button></div>
    <input type="hidden" name="billId"><p class="helper-text">Chọn khoản bạn đã trả cho hóa đơn này. Giữ nguyên số tiền trong sổ, không thêm khoản chi mới.</p><label>Khoản chi trong tháng<select name="transactionId" id="bill-payment-source" required></select></label>
    <div class="dialog-actions"><button type="button" class="button secondary" data-close-dialog>Để sau</button><button type="submit" class="button primary">Gắn với hóa đơn</button></div>
  </form></dialog>

  <dialog id="confirm-dialog" class="confirm-dialog" aria-labelledby="confirm-title"><form method="dialog"><span class="confirm-icon" data-icon="shield"></span><h2 id="confirm-title">Xác nhận thay đổi</h2><p id="confirm-description"></p><div class="dialog-actions"><button class="button secondary" value="cancel">Giữ nguyên</button><button class="button primary" value="confirm" id="confirm-button">Xác nhận</button></div></form></dialog>
  <dialog id="install-dialog" class="confirm-dialog" aria-labelledby="install-title"><form method="dialog"><h2 id="install-title">Mở nhanh ngay trên máy bạn</h2><p>Trên Chrome hoặc Edge, mở menu trình duyệt → Truyền, lưu và chia sẻ → Cài đặt trang dưới dạng ứng dụng. Khi đã cài, bạn có thể ghim ứng dụng lên thanh tác vụ.</p><p>Trên iPhone: Chia sẻ → Thêm vào Màn hình chính. Cách này giúp giảm nguy cơ dữ liệu bị dọn khi lâu không dùng; sao lưu JSON vẫn là cách bảo vệ chắc chắn hơn.</p><button class="button primary">Đã hiểu</button></form></dialog>
  <input type="file" id="restore-file" accept=".json,application/json" hidden>
  <div id="toast" class="toast" role="status" aria-live="polite" hidden></div>
  <noscript><div class="banner warning">Hãy bật JavaScript để ghi thu chi và lưu dữ liệu trên máy.</div></noscript>
</body>
</html>

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
.excel-dialog{width:min(1080px,calc(100% - 40px));max-height:92vh}.excel-file-box{border:1px dashed #9abca8;background:var(--mint);padding:18px;border-radius:12px;margin-bottom:18px}.excel-file-box label{margin-bottom:8px}.excel-file-box input{font-size:14px;max-width:100%}.excel-file-box input::file-selector-button{background:var(--surface);border:1px solid var(--line);color:var(--green);border-radius:7px;padding:9px 13px;margin-right:12px;cursor:pointer}.excel-config-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.excel-config-grid label{font-size:13px}.excel-config-grid .checkbox-label{padding-top:22px;line-height:1.7}.excel-mapping{border:1px solid var(--line);border-radius:10px;padding:13px 15px;margin:6px 0 17px}.excel-mapping summary{font-size:14px;font-weight:500}.excel-column-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding-top:16px}.excel-column-grid label{font-size:12px;overflow-wrap:anywhere;margin-bottom:2px}.excel-column-grid select{font-size:13px}.excel-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;border-top:1px solid var(--line);padding:20px 0 18px}.excel-summary span{display:block;font-size:12px;color:var(--muted);margin-bottom:5px}.excel-summary strong{font-size:20px;font-variant-numeric:tabular-nums}.excel-import-options{display:flex;gap:20px;flex-wrap:wrap}.excel-import-options label{font-size:13px}.excel-preview-table{max-height:400px;overflow:auto;border:1px solid var(--line);border-radius:10px;padding:0 13px}.excel-preview-table thead{position:sticky;top:0;background:var(--surface);z-index:1}.excel-preview-table td{font-size:13px;vertical-align:top}.excel-preview-table th{font-size:12px}.excel-preview-table input[type=checkbox]{accent-color:var(--green);width:16px;height:16px}.excel-note{display:block;max-width:280px;white-space:normal;overflow-wrap:anywhere}.excel-row-number{display:block;color:var(--muted);font-size:11px;white-space:nowrap}.excel-row-warning{display:block;color:var(--orange);font-size:11px;line-height:1.6;max-width:270px;margin-top:5px}.excel-duplicate{opacity:.55}.excel-actions{position:sticky;bottom:-28px;background:var(--surface);padding:16px 0 3px;border-top:1px solid var(--line);margin-top:18px;align-items:center}.excel-actions>.helper-text{margin-right:auto;font-size:12px}.ledger-view-tabs{display:flex;gap:8px;margin-bottom:22px}.daily-ledger{border:1px solid var(--line);border-radius:11px;margin:13px 0;padding:0 15px;overflow:hidden}.daily-ledger>summary{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:15px 0;font-size:14px;color:var(--ink);cursor:pointer}.daily-ledger>summary>span:first-child{display:flex;align-items:center;gap:12px}.daily-ledger>summary small{font-size:12px;color:var(--muted)}.daily-ledger>summary:before{content:'+';color:var(--green);font-size:17px;font-weight:600}.daily-ledger[open]>summary:before{content:'−'}.daily-totals{display:flex;gap:20px;margin-left:auto;font-size:12px;flex-wrap:wrap;justify-content:flex-end}.daily-totals b{font-weight:550;font-variant-numeric:tabular-nums;margin-left:5px}.daily-ledger .table-scroll{border-top:1px solid var(--line)}.welcome-actions{flex-wrap:wrap;justify-content:flex-end}.welcome-panel .welcome-actions{max-width:410px}
.wallet-panel{margin-bottom:22px;background:var(--surface-soft)}.wallet-readout{display:flex;justify-content:space-between;gap:20px;align-items:center}.wallet-readout h2{font-size:17px}.wallet-readout p{margin:7px 0 4px;line-height:1.8}.wallet-amount{font-size:27px;color:var(--green);white-space:nowrap}.wallet-panel details{margin-top:13px}.wallet-panel summary{font-size:13px}.opening-balance-form{display:grid;grid-template-columns:1fr 1fr auto;gap:15px;align-items:end;margin-top:17px}.opening-balance-form label{margin:0;font-size:13px}.opening-balance-form .button{margin-bottom:1px;min-height:44px}.excel-opening-banner{font-size:13px}.excel-opening-banner label{font-weight:600;margin-bottom:10px}.excel-opening-banner p{margin-bottom:6px}.excel-opening-banner .fine-print{margin-top:7px}
@media(max-width:900px){.wallet-readout{flex-wrap:wrap}.opening-balance-form{grid-template-columns:1fr 1fr}.opening-balance-form>.button{grid-column:1/-1;justify-self:start}.wallet-amount{font-size:23px}}
@media(max-width:900px){.excel-column-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.excel-summary strong{font-size:17px}.daily-ledger>summary{flex-wrap:wrap}.daily-totals{width:100%;justify-content:flex-start;gap:14px}.excel-config-grid{grid-template-columns:1fr 1fr}.excel-config-grid label:last-child{grid-column:1/-1}.welcome-panel .welcome-actions{max-width:none;justify-content:flex-start}}
@media(max-width:600px){.excel-dialog{padding:20px 14px;width:calc(100% - 18px)}.excel-config-grid{grid-template-columns:1fr}.excel-config-grid label:last-child{grid-column:auto}.excel-summary{grid-template-columns:1fr 1fr}.excel-summary strong{font-size:18px}.excel-actions{bottom:-20px;flex-wrap:wrap}.excel-actions>.helper-text{width:100%}.excel-column-grid{grid-template-columns:1fr 1fr}.excel-preview-table table{min-width:680px}.daily-totals{font-size:10px;gap:7px}.daily-ledger>summary>span:first-child{gap:8px}.daily-ledger{padding:0 10px}.excel-config-grid .checkbox-label{padding-top:0}}
@media(min-width:761px){body{font-size:16px}.nav-link{font-size:14px}.sidebar-note strong{font-size:14px}.sidebar-note p{font-size:12px}.nav-caption{font-size:11px}.local-status{font-size:11px}.theme-button{font-size:14px}.breadcrumb{font-size:13px}.date-label{font-size:12px}.page-heading p{font-size:14px}.button{font-size:14px}.button.small{font-size:12px}.month-pill{font-size:13px}.metric-card{min-height:193px}.metric-top{font-size:14px;align-items:flex-start;min-height:34px;margin-bottom:13px;line-height:1.6}.metric-top>span:first-child{max-width:calc(100% - 35px)}.metric-value{font-size:29px}.metric-value .unit{font-size:14px}.metric-foot{font-size:12px;margin-top:14px}.badge{font-size:11px}.savings-unit{font-size:12px}.score-ring{top:81px;width:38px;height:38px;right:16px}.score-ring:before{width:29px;height:29px}.score-ring .icon{width:13px;height:13px}.section-label{font-size:12px}.panel-header h2{font-size:17px}.panel-header p{font-size:13px}.chart-legend{font-size:11px}.chart-summary span{font-size:12px}.chart-summary strong{font-size:17px}.strategy-copy{font-size:14px}.level-label{font-size:12px}.allocation-label{font-size:12px}.allocation-legend{font-size:12px}.allocation-legend strong{font-size:16px}.strategy-callout{font-size:13px}.text-link{font-size:13px}table{font-size:14px}th{font-size:12px}.transaction-title strong{font-size:14px}.transaction-title small{font-size:12px}.install-banner p{font-size:12px}.install-banner strong{font-size:14px}.empty-state p,.diagnostic-copy{font-size:14px}.empty-state h3{font-size:17px}.filters label,label{font-size:14px}.filters input,.filters select,input:not([type=checkbox]),select{font-size:14px}.transactions-summary span{font-size:13px}.pagination{font-size:13px}.alert-body strong{font-size:14px}.alert-body p{font-size:13px}.alert-amount{font-size:14px}.cutback-table td,.cutback-table th{font-size:13px}.insight-note{font-size:13px}.bill-row h3,.debt-row h3{font-size:14px}.bill-row p,.debt-row p{font-size:12px}.record-money{font-size:14px}.record-money small{font-size:12px}.settings-card>p{font-size:14px}.setting-row strong{font-size:14px}.setting-row small{font-size:13px}.fine-print{font-size:12px}.helper-text{font-size:14px}.form-dialog label{font-size:14px}.confirm-dialog p{font-size:14px}.welcome-panel p{font-size:14px}.page-footer{font-size:11px}.toast{font-size:14px}}

/* Everyday money: answers first, supporting calculations on demand. */
body { font-size: 16px; }
.page-heading h1 { font-size: 28px; letter-spacing: -.7px; }
.page-heading p { max-width: 550px; font-size: 14px; }
.heading-actions { flex-shrink: 0; }
.month-picker { display: flex; align-items: center; gap: 8px; margin: 0; border: 1px solid var(--line); border-radius: 9px; background: var(--surface); padding: 3px 11px; }
.month-picker .icon { width: 17px; color: var(--green); }
.month-picker input { border: 0; padding: 8px 0; background: transparent; width: 145px; min-width: 0; margin: 0; font-size: 14px; }
.money-cards { display: grid; grid-template-columns: 1.1fr 1fr 1fr; gap: 16px; margin-bottom: 18px; }
.money-card { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 22px; min-width: 0; display: flex; align-items: flex-start; flex-direction: column; }
.card-label { font-size: 14px; font-weight: 500; margin-bottom: 14px; }
.big-money { font-size: clamp(25px, 2.35vw, 36px); font-weight: 650; letter-spacing: -1px; line-height: 1.3; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.money-card p { color: var(--muted); font-size: 13px; line-height: 1.7; margin: 12px 0 8px; }
.money-card .text-link, .balance-link { margin-top: auto; padding: 4px 0; background: transparent; font-size: 13px; text-align: left; color: var(--green); }
.balance-card { background: #16523e; color: #fff; border-color: #16523e; }
.balance-card p { color: #d1e9dc; }
.balance-link { color: #e2f6d9; text-decoration: underline; text-underline-offset: 4px; }
.daily-card { background: var(--mint); border-color: var(--line); }
.daily-note { font-size: 12px; color: var(--muted); line-height: 1.7; }
.balance-detail { margin-bottom: 22px; padding: 15px 22px; }
.balance-detail>summary { font-size: 14px; }
.money-equation { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 15px; margin: 20px 0 16px; }
.money-equation span { color: var(--muted); font-size: 13px; }
.money-equation strong { display: block; margin-top: 6px; color: var(--ink); font-size: 19px; font-variant-numeric: tabular-nums; }
.overview-columns { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,1fr); gap: 20px; margin-bottom: 20px; }
.overview-columns>.panel { min-width: 0; }
.panel-header { gap: 12px; }
.panel-header h2 { font-size: 18px; }
.panel-header p { font-size: 13px; line-height: 1.7; }
.eyebrow { font-size: 11px; letter-spacing: 1.2px; }
.next-panel>.panel-header { margin-bottom: 10px; }
.next-step { display: flex; gap: 13px; padding: 16px 0; border-top: 1px solid var(--line); }
.next-step:first-of-type { border-top: 0; }
.step-icon { width: 34px; height: 34px; display: grid; place-items: center; background: var(--mint); border-radius: 10px; color: var(--green); flex-shrink: 0; margin-top: 2px; }
.step-icon .icon { width: 18px; height: 18px; }
.next-step h3 { font-size: 15px; margin: 0 0 5px; }
.next-step p { font-size: 13px; color: var(--muted); margin: 0 0 10px; line-height: 1.7; }
.next-step .button.small { font-size: 13px; }
.category-breakdown { display: grid; gap: 18px; }
.category-line { display: block; width: 100%; padding: 0; text-align: left; background: transparent; color: var(--ink); border-radius: 5px; }
.category-line:hover .category-line-head>span { color: var(--green); }
.category-line-head { display: flex; gap: 12px; justify-content: space-between; font-size: 14px; margin-bottom: 9px; }
.category-line-head small { display: block; font-size: 12px; color: var(--muted); }
.category-line-head strong { flex-shrink: 0; font-size: 14px; font-variant-numeric: tabular-nums; }
.category-track { display: block; height: 7px; border-radius: 7px; background: var(--bg); overflow: hidden; }
.category-track>i { display: block; height: 100%; border-radius: 7px; background: var(--bar-color); }
.compact-note { padding: 13px 15px; background: var(--surface-soft); border-radius: 9px; font-size: 13px; color: var(--muted); margin: 18px 0 0; line-height: 1.8; }
.recent-list { display: grid; }
.recent-item { display: flex; gap: 12px; padding: 14px 0; width: 100%; align-items: center; text-align: left; color: var(--ink); background: transparent; border-bottom: 1px solid var(--line); }
.recent-item:last-child { border-bottom: 0; }
.recent-item:hover .recent-copy strong { color: var(--green); }
.recent-copy { min-width: 0; flex: 1; }
.recent-copy strong { font-size: 14px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.recent-copy small { display: block; color: var(--muted); font-size: 12px; margin-top: 3px; }
.recent-item>.money { font-size: 14px; flex-shrink: 0; }
.separate-row { display: flex; gap: 15px; justify-content: space-between; align-items: center; width: 100%; text-align: left; background: transparent; color: var(--ink); padding: 17px 0; border-bottom: 1px solid var(--line); font-size: 14px; }
.separate-row:last-child { border-bottom: 0; }
.separate-row>span { display: flex; gap: 10px; align-items: center; color: var(--muted); }
.separate-row .icon { width: 18px; color: var(--green); }
.separate-row:hover { color: var(--green); }
.analysis-lead { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px; background: var(--mint); }
.analysis-lead>div { flex: 1; }
.analysis-lead h2 { margin: 0 0 6px; }
.analysis-lead p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.8; }
.deposit-row { padding: 17px 0; border-top: 1px solid var(--line); display: flex; align-items: center; gap: 15px; flex-wrap: wrap; }
.deposit-row>div:first-child { flex: 1; min-width: 180px; }
.deposit-row h3 { font-size: 15px; }
.deposit-row p { font-size: 13px; color: var(--muted); margin: 0; }
.deposit-row .row-actions { flex-wrap: wrap; }
.adjustment-list,.plain-insights { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 20px; }
.adjustment-list>article { padding: 16px; border: 1px solid var(--line); border-radius: 10px; }
.adjustment-list h3 { font-size: 15px; }
.adjustment-list strong { color: var(--green); font-size: 15px; }
.adjustment-list p { margin: 6px 0 12px; font-size: 13px; color: var(--muted); }
.plain-insights,.trend-charts { grid-template-columns: 1fr 1fr; display: grid; gap: 25px; margin: 20px 0; }
.advanced-analysis .chart-wrap { height: 250px; }
.advanced-analysis .method-content>p { font-size: 13px; }
.advanced-analysis summary { font-size: 15px; }
.ledger-context { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; margin: 0 0 20px; padding: 10px 16px; background: var(--mint); border-radius: 10px; font-size: 14px; }
.ledger-context .text-link { margin-left: auto; }
.transaction-title { min-width: 210px; }
.transaction-title strong { max-width: 350px; white-space: normal; overflow-wrap: anywhere; }
.transaction-title small { white-space: normal; }
.bill-row,.debt-row { flex-wrap: wrap; gap: 10px; }
.record-info { min-width: 175px; }
.record-actions { flex-wrap: wrap; justify-content: flex-end; }
.record-actions .button.small { font-size: 12px; }
.reserve-amount { display: block; font-size: 32px; margin: 15px 0 20px; color: var(--green); }
.fund-actions { display: flex; gap: 9px; flex-wrap: wrap; margin-bottom: 16px; }
.profile-form { margin-top: 18px; }
.category-shortcuts { display: flex; gap: 7px; flex-wrap: wrap; margin: -5px 0 16px; }
.category-shortcuts button { color: var(--green); background: var(--mint); border: 1px solid var(--line); padding: 6px 10px; border-radius: 20px; font-size: 12px; }
.category-shortcuts button:hover { border-color: var(--green); }
.flow-explanation { background: var(--surface-soft); padding: 10px 12px; border-radius: 8px; font-size: 13px; margin: 4px 0 15px; }
.tx-extra { margin: 12px 0 8px; }
.tx-extra>summary { font-size: 13px; }
.tx-extra>.form-grid { margin-top: 16px; }
#tx-target-label { display: block; }
#tx-principal-label .helper-text { display: block; font-size: 12px; margin-top: 7px; }
.excel-kind-select { min-width: 140px; font-size: 12px; }
.button.small,.text-link { font-size: 13px; }
@media (max-width: 1150px) { .page-heading { align-items: flex-start; flex-wrap: wrap; } .heading-actions { flex-wrap: wrap; } .money-card { padding: 20px 17px; } .big-money { font-size: 26px; } .record-actions { justify-content: flex-start; } }
@media (max-width: 950px) { .overview-columns { grid-template-columns: 1fr; } .money-equation { grid-template-columns: 1fr 1fr; } .money-cards { gap: 12px; } .money-card { padding: 18px 14px; } .big-money { font-size: 23px; } .analysis-lead { flex-wrap: wrap; } }
@media (max-width: 760px) { .money-cards { grid-template-columns: 1fr 1fr; } .money-cards>.balance-card { grid-column: 1/-1; } .big-money { font-size: 30px; } .money-card:not(.balance-card) .big-money { font-size: 24px; } .card-label { font-size: 13px; } .money-card p { font-size: 12px; } .page-heading h1 { font-size: 25px; } .money-card { min-height: 170px; } .balance-card { min-height: 185px; } .heading-actions { width: 100%; justify-content: space-between; } .analysis-lead>div { min-width: calc(100% - 65px); } .plain-insights,.trend-charts,.adjustment-list { grid-template-columns: 1fr; } .recent-item { gap: 9px; } .recent-item>.money { font-size: 13px; } .recent-copy strong { font-size: 13px; } .separate-row { font-size: 13px; } .helper-text { font-size: 14px; } .fine-print { font-size: 12px; } }
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto!important; } }

/* Financial wellbeing stays visible, with one concrete next step. */
.wellbeing-overview { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.1fr); gap:20px 28px; margin-bottom:20px; border:1px solid #bcd7c6; }
.wellbeing-rating { display:flex; align-items:center; gap:20px; min-width:0; }
.wellbeing-gauge { width:100px; height:100px; flex:none; border-radius:50%; padding:7px; background:conic-gradient(var(--green) var(--health-score),var(--line) 0); }
.wellbeing-gauge>div { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:50%; background:var(--surface); }
.wellbeing-gauge strong { font-size:29px; line-height:1.2; font-variant-numeric:tabular-nums; }
.wellbeing-gauge small { font-size:12px; color:var(--muted); }
.wellbeing-label { color:var(--green); display:block; font-size:15px; margin-top:8px; }
.wellbeing-rating h2 { font-size:20px; margin:0; }
.wellbeing-rating p { font-size:13px; color:var(--muted); margin:8px 0 0; max-width:260px; }
.wellbeing-next { padding-left:28px; border-left:1px solid var(--line); }
.wellbeing-next h3 { font-size:18px; margin:7px 0; }
.wellbeing-gap { display:block; font-size:14px; line-height:1.7; }
.wellbeing-next p { color:var(--muted); font-size:13px; margin:6px 0 12px; }
.wellbeing-next .button { font-size:13px; }
.wellbeing-footer { grid-column:1/-1; border-top:1px solid var(--line); padding-top:15px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; font-size:13px; }
.wellbeing-footer>span { display:flex; align-items:center; flex-wrap:wrap; gap:5px; }
.wellbeing-footer .icon { width:17px; color:var(--green); margin-right:3px; }
.wellbeing-footer strong { font-weight:650; }
.health-details { margin-top:0; margin-bottom:22px; scroll-margin-top:20px; }
.health-detail-columns { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:34px; }
.health-detail-columns h3 { font-size:16px; margin-bottom:10px; }
.health-factor { padding:15px 0; border-bottom:1px solid var(--line); }
.health-factor:last-child { border-bottom:0; }
.health-factor-heading { display:flex; justify-content:space-between; gap:15px; font-size:14px; }
.health-factor-heading>span { color:var(--green); font-variant-numeric:tabular-nums; flex:none; }
.health-factor-bar { height:5px; border-radius:5px; overflow:hidden; background:var(--line); margin:10px 0; }
.health-factor-bar>i { display:block; height:100%; background:var(--green); border-radius:5px; }
.health-factor p { font-size:13px; color:var(--muted); margin:7px 0; line-height:1.7; }
.health-factor .text-link,.independence-milestone .text-link { font-size:13px; background:transparent; padding:0; }
.independence-path { border-left:1px solid var(--line); padding-left:30px; }
.independence-path>.helper-text { font-size:13px; }
.independence-milestone { display:flex; gap:12px; padding:12px 0; align-items:flex-start; }
.milestone-icon { display:grid; place-items:center; background:var(--bg); color:var(--muted); border-radius:50%; width:28px; height:28px; flex:none; margin-top:2px; }
.milestone-icon .icon { width:16px; height:16px; }
.complete .milestone-icon { background:var(--mint); color:var(--green); }
.independence-milestone h4 { font-size:14px; font-weight:550; margin:0 0 4px; }
.milestone-status { display:block; color:var(--muted); font-size:12px; margin-bottom:5px; }
.complete .milestone-status { color:var(--green); }
.next-milestone { background:var(--mint); padding:17px; border-radius:10px; margin-top:12px; }
.next-milestone h3 { margin:6px 0; font-size:15px; }
.next-milestone p { font-size:13px; color:var(--muted); margin-bottom:12px; }
#spending-section,#reserve-section,#debts-section,#bills-section,#income-history-section { scroll-margin-top:20px; }
@media(max-width:1050px) { .wellbeing-overview { grid-template-columns:1fr; } .wellbeing-next { border-left:0; border-top:1px solid var(--line); padding:17px 0 0; } .wellbeing-rating p { max-width:none; } }
@media(max-width:800px) { .health-detail-columns { grid-template-columns:1fr; gap:24px; } .independence-path { padding:20px 0 0; border-left:0; border-top:1px solid var(--line); } }
@media(max-width:600px) { .wellbeing-gauge { width:80px; height:80px; padding:6px; } .wellbeing-gauge strong { font-size:25px; } .wellbeing-rating { gap:15px; } .wellbeing-rating h2 { font-size:18px; } .wellbeing-label { font-size:14px; } }

```

### File: js/finance-engine.js

```javascript
import { isPlanTransaction } from './money-flow.js';
/** All calculations are pure. Money is integer VND; dates are local calendar dates. */
export const CATEGORIES = Object.freeze({
  income: ['Lương chính', 'Freelance / Dự án', 'Thưởng / Hoa hồng', 'Thu nhập khác'],
  needs: ['Tiền nhà / Trả góp nhà', 'Điện nước & Internet', 'Đi chợ & Nấu ăn', 'Di chuyển & Xăng xe', 'Y tế & Bảo hiểm', 'Học tập / Gia đình'],
  wants: ['Ăn ngoài & Cafe', 'Mua sắm online', 'Giải trí & Du lịch', 'Đăng ký gói dịch vụ', 'Quà tặng & Giao lưu'],
  savings_debt: ['Nạp quỹ dự phòng', 'Trả nợ gốc/lãi', 'Đầu tư dài hạn'],
});
export const GROUP_LABELS = { income: 'Tiền nhận', needs: 'Sinh hoạt cần thiết', wants: 'Mua sắm & Giải trí', savings_debt: 'Để dành & Trả nợ' };
export const DEFAULT_PROFILE = { id: 'default', liquidSavings: 0, paydayDay: 5, incomeModeOverride: 'AUTO', theme: 'light', lastBackupAt: null, openingBalances: {} };
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
export function cashBalanceForMonth(data, month, today = localDate()) {
  const opening = data.profile.openingBalances?.[month];
  const transactions = data.transactions.filter((t) => t.date.startsWith(month) && t.date <= today);
  const income = sum(transactions.filter((t) => t.type === 'income').map((t) => t.amount));
  const expense = sum(transactions.filter((t) => t.type === 'expense').map((t) => t.amount));
  return { month, configured: !!opening, bank: opening?.bank ?? null, cash: opening?.cash ?? null, opening: opening ? opening.bank + opening.cash : null, income, expense, available: opening ? opening.bank + opening.cash + income - expense : null };
}
export function aggregateMonths(transactions, date = new Date()) {
  const months = new Map();
  for (const t of transactions) {
    if (!isPlanTransaction(t)) continue;
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
  transactions = transactions.filter(isPlanTransaction);
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
  const paymentPool = fixedTs.map((t) => ({ ...t, left: t.amount })).sort((x, y) => Number(!!y.flow?.billId) - Number(!!x.flow?.billId));
  const bills = activeBills.map((b) => {
    let remaining = b.amount; const payments = [];
    for (const p of paymentPool) {
      if (p.left <= 0 || (p.flow?.billId ? p.flow.billId !== b.id : p.category !== b.category || p.group !== b.group)) continue;
      const used = Math.min(p.left, remaining); p.left -= used; remaining -= used;
      payments.push({ id: p.id, amount: used });
      if (!remaining) break;
    }
    return { ...b, remaining, paid: remaining === 0, payments };
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

### File: js/money-flow.js

```javascript
// One ledger owns every cash movement. Plans use earned income and ordinary spending only.
export const FLOW_LABELS = Object.freeze({ regular: 'Thu chi thường', deposit: 'Tiền cọc', refund: 'Tiền được hoàn', 'reserve-in': 'Chuyển vào quỹ', 'reserve-out': 'Rút từ quỹ', debt: 'Trả nợ' });
export const kindOf = (t) => t.flow?.kind || 'regular';
export const isPlanTransaction = (t) => kindOf(t) === 'regular';
const total = (xs) => xs.reduce((s, t) => s + t.amount, 0);
const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('đ', 'd').toLowerCase();
export function suggestFlow(t) {
  const text = norm(t.note);
  if (t.type === 'income' && /\b(hoan tien|hoan coc|nhan lai coc|refund)\b/.test(text)) return 'refund';
  if (t.type === 'expense' && /\b(coc|co hoan tra|deposit)\b/.test(text)) return 'deposit';
  return 'regular';
}
export function categoryHabits(transactions, type = 'expense') {
  const found = new Map();
  for (const t of [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)) {
    if (t.type !== type) continue;
    const item = found.get(t.category) || { category: t.category, group: t.group, count: 0, last: t.date };
    item.count++; found.set(t.category, item);
  }
  return [...found.values()].sort((a, b) => b.count - a.count || b.last.localeCompare(a.last));
}
export function depositBalances(transactions, through = '9999-12-31', excludingId = '') {
  const rows = transactions.filter((t) => t.date <= through && t.id !== excludingId);
  return rows.filter((t) => kindOf(t) === 'deposit').map((t) => {
    const refunded = total(rows.filter((r) => kindOf(r) === 'refund' && r.flow?.targetId === t.id));
    return { ...t, refunded, remaining: Math.max(0, t.amount - refunded) };
  }).sort((a, b) => b.date.localeCompare(a.date));
}
export function dateForMonth(month, now = new Date()) {
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || '') || month >= current) return now;
  return new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0, 12);
}
export function monthAfterDayChange(selectedMonth, previousDay, nextDay) {
  return selectedMonth === previousDay.slice(0, 7) ? nextDay.slice(0, 7) : selectedMonth;
}
export function monthlyMoney(data, a) {
  const rows = data.transactions.filter((t) => t.date.startsWith(a.month) && t.date <= a.today);
  const incoming = rows.filter((t) => t.type === 'income'), outgoing = rows.filter((t) => t.type === 'expense');
  const opening = data.profile.openingBalances?.[a.month];
  const received = total(incoming), paid = total(outgoing), available = opening ? opening.bank + opening.cash + received - paid : null;
  const ordinary = rows.filter((t) => isPlanTransaction(t) && t.type === 'expense' && ['needs', 'wants'].includes(t.group));
  const buckets = new Map();
  for (const t of ordinary) { const c = buckets.get(t.category) || { category: t.category, amount: 0, count: 0 }; c.amount += t.amount; c.count++; buckets.set(t.category, c); }
  const categories = [...buckets.values()].sort((x, y) => y.amount - x.amount);
  const refunds = total(incoming.filter((t) => kindOf(t) === 'refund'));
  const deposits = depositBalances(data.transactions, a.today);
  const unmatchedRefunds = rows.filter((t) => kindOf(t) === 'refund' && !t.flow?.targetId);
  const review = rows.filter((t) => kindOf(t) === 'regular' && suggestFlow(t) !== 'regular');
  const debtDue = data.debts.filter((d) => d.principal > 0).reduce((s, d) => {
    const paidThisMonth = total(rows.filter((t) => kindOf(t) === 'debt' && t.flow?.targetId === d.id));
    return s + Math.min(d.principal, Math.max(0, d.minMonthlyPayment - paidThisMonth));
  }, 0);
  const reserved = a.unpaidFixedBills + debtDue;
  const daily = available === null ? null : Math.max(0, Math.floor((available - reserved) / a.safe.daysLeft));
  return { rows, incoming, outgoing, opening, received, paid, available, ordinary, everyday: total(ordinary), categories, refunds, deposits, unmatchedRefunds, review, debtDue, reserved, daily,
    earned: total(incoming.filter(isPlanTransaction)), deposited: total(outgoing.filter((t) => kindOf(t) === 'deposit')),
    moved: total(outgoing.filter((t) => !['regular', 'deposit'].includes(kindOf(t)) || t.group === 'savings_debt')),
    latest: [...rows].sort((x, y) => y.date.localeCompare(x.date) || y.createdAt - x.createdAt)[0]?.date || null };
}
/** Explain the existing health model without turning its score into a claim of independence. */
export function wellbeingPlan(data, a) {
  const h = a.health, hasIncome = a.income.yBase > 0;
  const hasEssentials = a.current.needs > 0 || a.history.some((m) => m.needs > 0) || a.totalActiveFixedBills > 0;
  const ready = hasIncome && hasEssentials, provisional = a.income.months < 3;
  const score = ready ? h.fhi : null;
  const reserve = data.profile.liquidSavings, target = Math.ceil(h.essentialMonthly * h.targetRunway);
  const oneMonthGap = hasEssentials ? Math.max(0, Math.ceil(h.essentialMonthly - reserve)) : null;
  const reserveGap = hasEssentials ? Math.max(0, target - reserve) : null;
  const highDebt = [...data.debts].filter((d) => d.principal > 0 && d.apr > 10).sort((x, y) => y.apr - x.apr)[0];
  const completeMonths = a.history.slice(-3), surplusMonths = completeMonths.filter((m) => m.income > 0 && m.income > m.spent).length;
  let next;
  if (!ready) next = { title: 'Hoàn thiện bức tranh của bạn', text: 'Ghi thu nhập và chi phí sinh hoạt để biết nền tảng hiện tại.', action: 'add-transaction', label: 'Bổ sung thu chi', symbol: 'wallet' };
  else if (h.level === 1) next = { title: 'Giảm phần chi đang vượt thu', gap: Math.max(0, a.current.spent - a.current.income), text: 'Tiền có sẵn vẫn nằm trong số dư. Ưu tiên xem khoản có thể giảm trước khi tăng để dành.', action: 'open-analysis', section: 'spending-section', label: 'Tìm chỗ có thể điều chỉnh', symbol: 'wallet' };
  else if (h.level === 2) next = { title: 'Có quỹ đủ 1 tháng sinh hoạt', gap: oneMonthGap, text: 'Tạo lớp đệm đầu tiên cho những việc ngoài dự tính.', action: 'reserve-in', label: 'Chọn tiền chuyển vào quỹ', symbol: 'shield' };
  else if (h.level === 3 && highDebt) next = { title: 'Giảm khoản nợ có lãi cao nhất', debtId: highDebt.id, debtName: highDebt.name, gap: highDebt.principal, text: 'Trả các mức tối thiểu trước, rồi cân nhắc phần có thể trả thêm.', action: 'pay-debt', label: 'Xem và ghi lần trả nợ', symbol: 'layers' };
  else if (h.level === 4) next = { title: `Quỹ đủ ${new Intl.NumberFormat('vi-VN').format(h.targetRunway)} tháng sinh hoạt`, gap: reserveGap, text: 'Có thêm thời gian xoay xở nếu nguồn thu tạm dừng.', action: 'reserve-in', label: 'Chọn tiền chuyển vào quỹ', symbol: 'shield' };
  else next = { title: 'Giữ quỹ và duy trì khoản dư', text: 'Bạn đã có nền tảng. Tiếp tục giữ quỹ, kiểm soát nợ và dành tiền cho mục tiêu dài hạn.', action: 'reserve-in', label: 'Ghi khoản để dành', symbol: 'sprout' };
  return { ready, provisional, score, hasEssentials, target, reserveGap, oneMonthGap, highDebt, surplusMonths, next,
    label: score === null ? 'Cần thêm ghi chép' : score < 40 ? 'Cần củng cố nền tảng' : score < 70 ? 'Đang xây sự chủ động' : score < 85 ? 'Đang khá vững' : 'Nền tảng tốt',
    milestones: [
      { key: 'balance', title: 'Thu đủ trang trải chi sinh hoạt', done: a.current.income > 0 && a.current.income >= a.current.spent, known: a.current.income > 0 || a.current.spent > 0, action: 'open-analysis', section: 'spending-section', label: 'Xem thu chi' },
      { key: 'buffer', title: 'Có quỹ đệm 1 tháng', done: hasEssentials && h.runwayMonths >= 1, known: hasEssentials, action: 'open-planning', section: 'reserve-section', label: 'Xem quỹ' },
      { key: 'debt', title: 'Kiểm soát nợ lãi cao', done: data.debts.length > 0 && !highDebt, known: data.debts.length > 0, action: 'open-planning', section: 'debts-section', label: 'Đối chiếu nợ' },
      { key: 'reserve', title: `Quỹ đủ ${new Intl.NumberFormat('vi-VN').format(h.targetRunway)} tháng`, done: hasEssentials && h.runwayMonths >= h.targetRunway, known: hasEssentials, action: 'open-planning', section: 'reserve-section', label: 'Xem mốc quỹ' },
      { key: 'surplus', title: 'Thu vượt chi sinh hoạt trong 3 tháng', done: completeMonths.length === 3 && surplusMonths === 3, known: completeMonths.length === 3, action: 'open-analysis', section: 'income-history-section', label: 'Xem các tháng' },
    ] };
}
/** Compute reversals and replacements before one atomic database write. */
export function changeTransaction(data, next, id, today) {
  const previous = data.transactions.find((t) => t.id === id);
  const transactions = data.transactions.filter((t) => t.id !== id);
  const debts = data.debts.map((d) => ({ ...d }));
  const profile = { ...data.profile };
  const effects = (t, direction) => {
    if (!t) return;
    const kind = kindOf(t);
    if (['reserve-in', 'reserve-out', 'debt'].includes(kind) && t.date > today) throw new Error('Chỉ ghi chuyển quỹ hoặc trả nợ khi đã thực hiện. Ngày ghi không được ở tương lai.');
    if (kind === 'reserve-in') profile.liquidSavings += direction * t.amount;
    if (kind === 'reserve-out') profile.liquidSavings -= direction * t.amount;
    if (kind === 'debt') {
      const debt = debts.find((d) => d.id === t.flow.targetId);
      if (!debt) throw new Error('Khoản nợ liên quan không còn tồn tại. Kiểm tra lại trong Khoản cần lo.');
      debt.principal -= direction * t.flow.principal;
    }
  };
  effects(previous, -1); effects(next, 1);
  if (profile.liquidSavings < 0) throw new Error('Quỹ không đủ tiền cho thay đổi này. Kiểm tra số dư quỹ trước.');
  if (debts.some((d) => d.principal < 0)) throw new Error('Phần trả gốc lớn hơn số nợ còn lại.');
  if (next) transactions.push(next);
  // Recheck all links: editing/deleting a deposit must not orphan or overpay its refunds.
  for (const refund of transactions.filter((t) => kindOf(t) === 'refund' && t.flow?.targetId)) {
    const deposit = transactions.find((t) => t.id === refund.flow.targetId && kindOf(t) === 'deposit');
    if (!deposit) throw new Error('Khoản cọc này đã có tiền hoàn liên kết. Gỡ liên kết ở khoản hoàn trước khi đổi hoặc xóa cọc.');
    if (refund.date < deposit.date) throw new Error('Ngày nhận tiền hoàn phải từ ngày đặt cọc trở đi.');
    const refunded = total(transactions.filter((t) => kindOf(t) === 'refund' && t.flow?.targetId === deposit.id));
    if (refunded > deposit.amount) throw new Error('Tổng tiền hoàn vượt số tiền cọc. Kiểm tra khoản cọc được chọn.');
  }
  return { transactions, debts, profile };
}

```

### File: js/db.js

```javascript
import { DEFAULT_PROFILE, GROUP_LABELS, localDate } from './finance-engine.js';
import { FLOW_LABELS, changeTransaction, kindOf } from './money-flow.js';

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
      if (kindOf(old) === 'regular' && ['deposit', 'refund'].includes(kindOf(t))) { updated.flow = t.flow; updated.isFixedBill = false; }
      if (t.isFixedBill && !old.isFixedBill && kindOf(updated) === 'regular') updated.isFixedBill = true;
      if (JSON.stringify(updated) !== JSON.stringify(old)) updates.push(updated);
    }
  });
  return { accepted, updates, imported: accepted.length, updated: updates.length, skipped: clean.length - accepted.length };
}
export async function appendTransactions(records, { skipDuplicates = true, openingBalance = null, liquidSavings = null, updateDetails = true } = {}) {
  if (!Array.isArray(records) || records.length > 10000) throw new Error('Mỗi lần nhập tối đa 10.000 giao dịch.');
  const clean = records.map((record) => validateRecord('transactions', record));
  if (clean.some((t) => !['regular', 'deposit', 'refund'].includes(kindOf(t)))) throw new Error('Ghi chuyển quỹ và trả nợ bằng chức năng trong sổ để cập nhật các số dư cùng lúc.');
  const opening = openingBalance ? validateOpeningBalance(openingBalance) : null;
  if (liquidSavings !== null) money(liquidSavings, 'Quỹ để dành từ Excel');
  const profileChanges = !!opening || liquidSavings !== null;
  const amendProfile = (profile) => validateRecord('profile', { ...DEFAULT_PROFILE, ...profile, ...(liquidSavings !== null ? { liquidSavings } : {}), ...(opening ? { openingBalances: { ...(profile?.openingBalances || {}), [opening.month]: { bank: opening.bank, cash: opening.cash } } } : {}) });
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
export function validateOpeningBalance(value) {
  assert(value && typeof value === 'object' && /^\d{4}-(0[1-9]|1[0-2])$/.test(value.month) && Number(value.month.slice(0, 4)) >= 1900, 'Tháng của số dư đầu kỳ không hợp lệ.');
  return { month: value.month, bank: money(value.bank, 'Tiền ngân hàng đầu tháng'), cash: money(value.cash, 'Tiền mặt đầu tháng') };
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
      assert(!(['deposit', 'reserve-in', 'debt'].includes(kind) && value.type !== 'expense') && !(['refund', 'reserve-out'].includes(kind) && value.type !== 'income'), 'Cách tính không khớp khoản thu hoặc chi.');
      assert(!['reserve-in', 'debt'].includes(kind) || value.group === 'savings_debt', 'Chuyển quỹ và trả nợ cần thuộc nhóm Để dành & Trả nợ.');
      const flow = { kind };
      if (value.flow.targetId) flow.targetId = text(value.flow.targetId, 'Khoản liên kết', 100);
      if (value.flow.billId) { assert(kind === 'regular' && value.type === 'expense' && value.isFixedBill, 'Liên kết hóa đơn không hợp lệ.'); flow.billId = text(value.flow.billId, 'Hóa đơn liên kết', 100); }
      if (kind === 'debt') { assert(flow.targetId, 'Hãy chọn khoản nợ được trả.'); flow.principal = money(value.flow.principal, 'Phần trả gốc'); assert(flow.principal <= result.amount, 'Phần trả gốc không được lớn hơn tổng tiền đã trả.'); }
      if (kind !== 'regular' || flow.billId) result.flow = flow;
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
  for (const [month, amounts] of Object.entries(rawBalances)) { const entry = validateOpeningBalance({ ...amounts, month }); openingBalances[month] = { bank: entry.bank, cash: entry.cash }; }
  return { id, liquidSavings: money(value.liquidSavings, 'Quỹ dự phòng'), paydayDay: day(value.paydayDay), incomeModeOverride: value.incomeModeOverride, theme: value.theme, lastBackupAt: value.lastBackupAt, openingBalances };
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
import { CATEGORIES, GROUP_LABELS, clamp, sum, cashBalanceForMonth, localDate, analyzeFinance } from './finance-engine.js';

import { monthlyMoney, kindOf, FLOW_LABELS, dateForMonth, wellbeingPlan } from './money-flow.js';

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
  return `<div class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="heading-actions"><label class="month-picker">${icon('calendar')}<input type="month" id="focus-month" aria-label="Tháng đang xem" max="${localDate().slice(0, 7)}" value="${a.month}"></label>${primary ? btn('Ghi thu chi', 'add-transaction', 'primary', 'plus') : ''}</div></div>`;
}
export function transactionRows(transactions, editable = false) {
  return transactions.map((t) => `<tr><td><div class="transaction-title"><span class="category-icon ${t.group}">${icon(categoryIcon(t.category, t.group))}</span><div><strong>${E(t.note || t.category)}</strong><small>${E(t.category)}${t.isFixedBill ? ' · Hóa đơn' : ''}${kindOf(t) !== 'regular' ? ` · ${FLOW_LABELS[kindOf(t)]}` : ''}</small></div></div></td><td><span class="badge ${t.group === 'wants' ? 'warning' : 'safe'}">${GROUP_LABELS[t.group]}</span></td><td class="muted">${dateText(t.date)}</td><td class="align-right money ${t.type === 'income' ? 'amount-income' : 'amount-expense'}">${t.type === 'income' ? '+' : '−'}${formatVND(t.amount)}</td>${editable ? `<td><div class="row-actions"><button class="icon-button" data-action="edit-transaction" data-id="${E(t.id)}" aria-label="Sửa ${E(t.note || t.category)}">${icon('edit')}</button><button class="icon-button delete" data-action="delete-transaction" data-id="${E(t.id)}" aria-label="Xóa ${E(t.note || t.category)}">${icon('trash')}</button></div></td>` : ''}</tr>`).join('');
}
function transactionTable(ts, editable = false, recent = false) {
  return `<div class="table-scroll ${recent ? 'recent-table' : ''}"><table><thead><tr><th>Nội dung</th><th>Nhóm</th><th>Ngày</th><th class="align-right">Số tiền</th>${editable ? '<th class="align-right">Thao tác</th>' : ''}</tr></thead><tbody>${transactionRows(ts, editable)}</tbody></table></div>`;
}
function ledgerButton(label, category = '', extra = '', cls = 'text-link') {
  return btn(E(label), 'open-ledger', cls, '', `data-category="${E(category)}" ${category ? 'data-scope="everyday"' : ''} ${extra}`);
}
function prioritySteps(data, a, m) {
  const steps = [];
  const add = (title, text, button, symbol = 'check') => steps.push(`<article class="next-step"><span class="step-icon">${icon(symbol)}</span><div><h3>${title}</h3><p>${text}</p>${button}</div></article>`);
  if (!m.opening) add('Thêm tiền có sẵn đầu tháng', 'Điền tiền ngân hàng và tiền mặt để tính số còn dùng.', btn('Điền số dư đầu tháng', 'open-opening', 'secondary small'), 'wallet');
  if (m.unmatchedRefunds.length) add('Gắn tiền hoàn với khoản cọc', `${m.unmatchedRefunds.length} khoản tiền hoàn chưa có khoản cọc đi kèm.`, btn('Chọn khoản cọc', 'edit-transaction', 'secondary small', '', `data-id="${E(m.unmatchedRefunds[0].id)}"`), 'receipt');
  else if (m.review.length) add('Kiểm tra tiền cọc hoặc tiền hoàn', 'Tách khoản này để phần thu nhập và chi sinh hoạt dễ hiểu hơn.', btn('Xem khoản này', 'review-flow', 'secondary small', '', `data-id="${E(m.review[0].id)}"`), 'receipt');
  const bill = a.bills.filter((b) => !b.paid).sort((x, y) => x.dueDay - y.dueDay)[0];
  if (bill) add(E(bill.name), `Còn ${formatVND(bill.remaining)} · Hạn ngày ${Math.min(bill.dueDay, a.daysInMonth)}.`, btn('Ghi đã trả', 'pay-bill', 'secondary small', '', `data-id="${E(bill.id)}"`), 'calendar');
  if (m.debtDue > 0) { const debt = data.debts.find((d) => d.principal > 0 && d.minMonthlyPayment > sum(m.rows.filter((t) => kindOf(t) === 'debt' && t.flow.targetId === d.id).map((t) => t.amount))); if (debt) add('Dành tiền trả nợ tháng này', `Cần giữ lại ${formatVND(m.debtDue)} theo mức trả bạn đã đặt.`, btn('Ghi trả nợ', 'pay-debt', 'secondary small', '', `data-id="${E(debt.id)}"`), 'layers'); }
  if (!steps.length && a.cutbacks.actions.length && a.income.months >= 3) { const c = a.cutbacks.actions[0]; add(`Xem lại ${E(c.category)}`, `Gợi ý giảm khoảng ${formatVND(c.suggestedCut)} trong một tháng.`, ledgerButton('Xem các khoản này', c.category, '', 'secondary small'), 'bag'); }
  if (!steps.length) add('Tiếp tục ghi những khoản trong ngày', 'Số dư và phân tích sẽ đổi ngay khi bạn lưu.', btn('Ghi khoản mới', 'add-transaction', 'secondary small', 'plus'), 'sprout');
  return steps.slice(0, 3).join('');
}
function categoryList(m, limit = 8) {
  return m.categories.length ? `<div class="category-breakdown">${m.categories.slice(0, limit).map((c, i) => `<button class="category-line" data-action="open-ledger" data-scope="everyday" data-category="${E(c.category)}"><span class="category-line-head"><span>${E(c.category)} <small>${c.count} khoản</small></span><strong class="money">${formatVND(c.amount)}</strong></span><span class="category-track"><i style="width:${m.everyday ? c.amount / m.everyday * 100 : 0}%;--bar-color:${['#247a58', '#729f85', '#93b6a1', '#bbcba8'][i % 4]}"></i></span></button>`).join('')}</div>` : '<p class="helper-text">Chưa có khoản chi sinh hoạt trong tháng này.</p>';
}
function recentList(rows) {
  return `<div class="recent-list">${rows.map((t) => `<button class="recent-item" data-action="edit-transaction" data-id="${E(t.id)}"><span class="category-icon ${t.group}">${icon(categoryIcon(t.category, t.group))}</span><span class="recent-copy"><strong>${E(t.note || t.category)}</strong><small>${E(t.category)} · ${dateText(t.date)}</small></span><strong class="money ${t.type === 'income' ? 'amount-income' : ''}">${t.type === 'income' ? '+' : '−'}${formatVND(t.amount)}</strong></button>`).join('')}</div>`;
}
function wellbeingAction(next, cls = 'primary small') {
  return btn(next.label, next.action, cls, '', `${next.debtId ? `data-id="${E(next.debtId)}"` : ''} ${next.section ? `data-section="${E(next.section)}"` : ''}`);
}
function wellbeingGap(plan, a) {
  if (plan.next.gap === undefined) return '';
  if (a.health.level === 1) return `Chi sinh hoạt đang cao hơn thu nhập mới ${formatVND(plan.next.gap)}.`;
  if (plan.next.debtId) return `${E(plan.next.debtName)} · còn ${formatVND(plan.next.gap)} nợ gốc.`;
  return `Còn cần ${formatVND(plan.next.gap)} để chạm mốc này.`;
}
function renderWellbeing(data, a) {
  const p = wellbeingPlan(data, a), h = a.health;
  return `<section class="panel wellbeing-overview" id="health-overview" aria-label="Sức khỏe tài chính và bước tự chủ"><div class="wellbeing-rating"><div class="wellbeing-gauge ${p.score === null ? 'unrated' : ''}" style="--health-score:${p.score ?? 0}%" role="img" aria-label="${p.score === null ? 'Chưa đủ dữ liệu để chấm điểm' : `Sức khỏe tài chính ${N(p.score)} trên 100`}"><div><strong>${p.score === null ? '—' : N(p.score)}</strong><small>/ 100</small></div></div><div><h2>Sức khỏe tài chính</h2><strong class="wellbeing-label">${p.label}</strong><p>${p.provisional ? 'Đánh giá tạm từ những tháng bạn đã ghi.' : 'Theo thu chi, quỹ và nợ bạn đã ghi.'}</p></div></div><div class="wellbeing-next"><span class="eyebrow">TỪNG BƯỚC TỰ CHỦ TÀI CHÍNH</span><h3>${p.next.title}</h3>${p.next.gap !== undefined ? `<strong class="wellbeing-gap">${wellbeingGap(p, a)}</strong>` : ''}<p>${p.next.text}</p>${wellbeingAction(p.next)}</div><div class="wellbeing-footer"><span>${icon('shield')}${p.hasEssentials ? `Quỹ hiện đủ khoảng <strong>${N(h.runwayMonths)} tháng</strong> chi thiết yếu.` : 'Thêm chi phí sinh hoạt để biết quỹ có thể đỡ được bao lâu.'}</span>${btn('Xem lộ trình và từng phần', 'open-health', 'text-link')}</div></section>`;
}
function renderHealthDetails(data, a) {
  const p = wellbeingPlan(data, a), h = a.health;
  const surplus = a.current.income - a.current.spent;
  const factors = [
    { title: 'Tiền dư sau sinh hoạt', score: h.scores.sSavings, note: surplus >= 0 ? `Còn ${formatVND(surplus)} trước để dành và trả nợ.` : `Chi sinh hoạt vượt thu nhập mới ${formatVND(-surplus)}.`, action: 'open-analysis', section: 'spending-section', label: 'Xem khoản có thể giảm' },
    { title: 'Quỹ cho lúc cần gấp', score: h.scores.sRunway, note: p.hasEssentials ? `${formatVND(data.profile.liquidSavings)} · khoảng ${N(h.runwayMonths)} tháng chi thiết yếu.` : 'Cần thêm chi thiết yếu để ước tính quỹ.', action: 'open-planning', section: 'reserve-section', label: 'Xem quỹ để dành' },
    { title: 'Hóa đơn vừa với thu nhập', score: h.scores.sFixed, note: `Đã ghi ${formatVND(a.totalActiveFixedBills)} hóa đơn mỗi tháng.`, action: 'open-planning', section: 'bills-section', label: 'Đối chiếu hóa đơn' },
    { title: 'Áp lực từ các khoản nợ', score: h.scores.sDebt, note: data.debts.length ? `Còn ${formatVND(sum(data.debts.map((d) => d.principal)))} nợ gốc · mức trả ${formatVND(h.totalMinDebtPayments)}/tháng.` : 'Chưa có khoản nợ nào được ghi. Kiểm tra để đánh giá sát hơn.', action: 'open-planning', section: 'debts-section', label: 'Đối chiếu nợ' },
    { title: 'Mua sắm trong khả năng', score: h.scores.sControl, note: `${formatVND(a.current.wants)} cho mua sắm và giải trí tháng này.`, action: 'open-ledger', group: 'wants', label: 'Xem các khoản này' },
  ];
  return `<section class="panel health-details section-spaced" id="health-analysis"><div class="panel-header"><div><h2>Đường đến sự chủ động về tiền</h2><p>${p.score === null ? 'Hoàn thiện sổ trước khi đánh giá.' : `${N(p.score)}/100 · ${p.label}${p.provisional ? ' · Đánh giá tạm' : ''}`}</p></div><a class="text-link" href="#overview">Về tổng quan</a></div><div class="health-detail-columns"><div><h3>Sức khỏe đến từ đâu?</h3><div class="health-factor-list">${factors.map((f) => `<article class="health-factor"><div class="health-factor-heading"><strong>${f.title}</strong><span>${p.ready ? `${N(f.score, 0)}/100` : '—'}</span></div><div class="health-factor-bar"><i style="width:${p.ready ? clamp(f.score, 0, 100) : 0}%"></i></div><p>${f.note}</p>${btn(f.label, f.action, 'text-link', '', `${f.section ? `data-section="${f.section}"` : ''} ${f.group ? `data-group="${f.group}" data-scope="everyday"` : ''}`)}</article>`).join('')}</div></div><div class="independence-path"><h3>Những mốc để yên tâm hơn</h3><p class="helper-text">Mỗi mốc là một nền tảng cần xây, không phải mức giàu nghèo.</p>${p.milestones.map((m) => `<article class="independence-milestone ${m.done ? 'complete' : ''}"><span class="milestone-icon">${icon(m.done ? 'check' : 'target')}</span><div><h4>${m.title}</h4><span class="milestone-status">${m.done ? 'Đã đạt theo dữ liệu hiện có' : m.key === 'debt' && !m.known ? 'Chưa đối chiếu nợ' : !m.known ? 'Cần thêm ghi chép' : m.key === 'surplus' ? `${p.surplusMonths}/3 tháng có dư sau sinh hoạt` : 'Đang xây nền tảng'}</span>${btn(m.label, m.action, 'text-link', '', `data-section="${m.section}"`)}</div></article>`).join('')}<div class="next-milestone"><span class="eyebrow">ƯU TIÊN HIỆN TẠI</span><h3>${p.next.title}</h3><p>${wellbeingGap(p, a) || p.next.text}</p>${wellbeingAction(p.next)}</div></div></div><p class="fine-print">Mốc quỹ dựa trên khoảng ${formatVND(h.essentialMonthly)} chi thiết yếu/tháng${h.totalMinDebtPayments ? ', chưa gồm tiền trả nợ' : ''}. Quỹ và nợ dùng số dư bạn đang cập nhật. Điểm cao cho thấy nền tảng tốt hơn; chưa có nghĩa là đã đủ tiền sống lâu dài mà không cần thu nhập.</p></section>`;
}
export function renderOverview(data, a, installDismissed) {
  const m = monthlyMoney(data, a), current = a.month === localDate().slice(0, 7);
  const recent = [...m.rows].sort((x, y) => y.date.localeCompare(x.date) || y.createdAt - x.createdAt).slice(0, 4);
  const outstanding = sum(m.deposits.map((d) => d.remaining));
  const sample = data.transactions.some((t) => t.note === 'Thu nhập minh họa');
  return heading('Tiền của bạn, rõ từng ngày', `Một nơi để ghi, xem lại và biết mình cần làm gì.`, a) +
    (sample ? `<div class="banner">Đây là sổ minh họa. ${btn('Bắt đầu sổ của tôi', 'clear-data', 'ghost small')}</div>` : '') +
    (!data.transactions.length ? `<section class="panel welcome-panel"><div><h2>Mang sổ Excel của bạn vào đây</h2><p>Giữ tên khoản, danh mục và cách xem theo ngày như bạn đang ghi.</p></div><div class="welcome-actions">${btn('Nhập Excel', 'import-excel', 'primary', 'upload')}${btn('Ghi khoản đầu tiên', 'add-transaction', 'secondary', 'plus')}</div></section>` : '') +
    renderWellbeing(data, a) + `<section class="money-cards" aria-label="Tiền trong tháng"><article class="money-card balance-card"><span class="card-label">${current ? 'Tiền còn dùng' : 'Tiền cuối tháng'}</span><strong class="big-money">${m.available === null ? 'Chưa có số dư' : formatVND(m.available)}</strong><p>Ngân hàng + tiền mặt · sau các khoản đã ghi</p>${btn('Xem cách tính', 'show-balance', 'balance-link', '', 'aria-controls="balance-detail"')}</article><article class="money-card"><span class="card-label">Đã chi ra</span><strong class="big-money">${formatVND(m.paid)}</strong><p>${formatVND(m.everyday)} cho sinh hoạt${m.deposited ? ' · Có tiền cọc' : ''}</p>${ledgerButton('Xem sổ chi', '', 'data-type="expense"')}</article><article class="money-card daily-card"><span class="card-label">${current ? 'Tạm chia mỗi ngày' : 'Tiền nhận trong tháng'}</span><strong class="big-money">${current ? m.daily === null ? '—' : formatVND(m.daily) : formatVND(m.received)}</strong><p>${current ? `Cho ${a.safe.daysLeft} ngày còn lại, tính cả hôm nay` : 'Gồm thu nhập và các khoản tiền quay về'}</p><span class="daily-note">${current ? m.opening ? m.reserved > 0 ? `Đã giữ lại ${formatVND(m.reserved)} cho hóa đơn và trả nợ` : 'Chưa giữ lại khoản trả hằng tháng' : 'Điền tiền đầu tháng để xem gợi ý' : `Trong đó ${formatVND(m.refunds)} là tiền hoàn`}</span></article></section>
    <details id="balance-detail" class="panel balance-detail"><summary>Tiền còn lại được tính thế nào?</summary><div class="money-equation"><span>Đầu tháng<strong>${m.opening ? formatVND(m.opening.bank + m.opening.cash) : 'Chưa điền'}</strong></span><span>+ Tiền nhận<strong>${formatVND(m.received)}</strong></span><span>− Tiền chi ra<strong>${formatVND(m.paid)}</strong></span><span>= Còn lại<strong>${m.available === null ? '—' : formatVND(m.available)}</strong></span></div><p class="helper-text">Quỹ để dành được theo dõi riêng. Số này tính theo các khoản đã ghi đến ${dateText(a.today)}.</p>${btn('Sửa tiền đầu tháng', 'open-opening', 'secondary small')}${current ? '<p class="fine-print">Gợi ý mỗi ngày chia tiền còn lại sau hóa đơn và mức trả nợ chưa ghi. Chưa trừ khoản mua sắm hoặc chi phí khác bạn chưa thêm; chưa tính khoản thu tương lai.</p>' : ''}</details>
    <div class="overview-columns"><section class="panel next-panel"><div class="panel-header"><div><span class="eyebrow">BƯỚC TIẾP THEO</span><h2>${m.available !== null && m.available < m.reserved ? 'Giữ tiền cho các khoản cần trả' : 'Bạn có thể làm gì hôm nay?'}</h2></div>${icon('sparkles')}</div>${prioritySteps(data, a, m)}</section><section class="panel"><div class="panel-header"><div><h2>Chi nhiều ở đâu?</h2><p>Chạm vào danh mục để xem từng khoản.</p></div><a class="text-link" href="#analysis">Xem phân tích</a></div>${categoryList(m, 3)}${m.deposited ? `<p class="compact-note">${formatVND(m.deposited)} tiền cọc được tách riêng bên dưới.</p>` : ''}</section></div>
    <div class="overview-columns"><section class="panel"><div class="panel-header"><div><h2>Vừa ghi gần đây</h2>${m.latest ? `<p>Ghi gần nhất ${dateText(m.latest)}</p>` : ''}</div>${ledgerButton('Mở sổ thu chi')}</div>${recent.length ? recentList(recent) : empty('Chưa có khoản nào trong tháng', 'Ghi một khoản hoặc nhập sổ Excel.', btn('Nhập Excel', 'import-excel', 'secondary', 'upload'))}</section><section class="panel separate-money"><div class="panel-header"><div><h2>Các khoản theo dõi riêng</h2><p>Không cộng vào tiền đang dùng.</p></div></div><button class="separate-row" data-action="open-planning" data-section="reserve-section"><span>${icon('shield')}Quỹ hiện có</span><strong>${formatVND(data.profile.liquidSavings)}</strong></button><button class="separate-row" data-action="open-deposits"><span>${icon('receipt')}Cọc còn chờ hoàn</span><strong>${formatVND(outstanding)}</strong></button><button class="separate-row" data-action="open-planning" data-section="debts-section"><span>${icon('layers')}Nợ gốc hiện còn</span><strong>${formatVND(sum(data.debts.map((d) => d.principal)))}</strong></button></section></div>
    ${!installDismissed ? `<aside class="install-banner">${icon('laptop')}<div><strong>Mở nhanh trên laptop</strong><p>Cài ứng dụng và sao lưu sổ trong phần Cài đặt.</p></div>${btn('Cách cài', 'install', 'ghost small')}<button class="icon-button" data-action="dismiss-install" aria-label="Ẩn gợi ý cài đặt">${icon('close')}</button></aside>` : ''}`;
}

export function filteredTransactions(data, filters) {
  const sources = filters.billId ? new Set([...(analyzeFinance(data, dateForMonth(filters.month)).bills.find((b) => b.id === filters.billId)?.payments || []).map((p) => p.id), ...data.transactions.filter((t) => t.flow?.billId === filters.billId).map((t) => t.id)]) : null;
  return data.transactions.filter((t) => (!sources || sources.has(t.id)) && (!filters.month || filters.allMonths || t.date.startsWith(filters.month)) && (!filters.through || t.date <= filters.through) && (!filters.scope || (kindOf(t) === 'regular' && t.type === 'expense' && ['needs', 'wants'].includes(t.group))) && (!filters.type || t.type === filters.type) && (!filters.kind || (filters.kind === 'reserve' ? ['reserve-in', 'reserve-out'].includes(kindOf(t)) : kindOf(t) === filters.kind)) && (!filters.target || t.flow?.targetId === filters.target) && (!filters.group || t.group === filters.group) && (!filters.category || t.category === filters.category) && (!filters.search || `${t.note} ${t.category}`.toLocaleLowerCase('vi-VN').includes(filters.search.toLocaleLowerCase('vi-VN')))).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}
function renderOpeningBalance(data, month, today, editable = true) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || '')) return '';
  const b = cashBalanceForMonth(data, month, today);
  if (!editable && !b.configured) return '';
  return `<section class="panel wallet-panel" id="opening-section"><div class="wallet-readout"><div><h2>Tiền còn lại trong tháng</h2><p class="helper-text">${b.configured ? `Đầu tháng ${formatVND(b.opening)} + Thu ${formatVND(b.income)} − Chi ${formatVND(b.expense)}` : 'Thêm số tiền có sẵn đầu tháng để biết số dư sau thu chi.'}</p></div><strong class="wallet-amount money">${b.configured ? formatVND(b.available) : 'Chưa có số dư đầu tháng'}</strong></div>${editable ? `<details ${b.configured ? '' : 'open'}><summary>${b.configured ? 'Chỉnh tiền có sẵn đầu tháng' : 'Thêm tiền có sẵn đầu tháng'}</summary><form id="opening-balance-form" class="opening-balance-form"><input type="hidden" name="month" value="${E(month)}"><label>Tiền ngân hàng đầu tháng (₫)<input name="bank" type="number" min="0" max="9000000000000" step="1" value="${b.bank ?? 0}" required></label><label>Tiền mặt đầu tháng (₫)<input name="cash" type="number" min="0" max="9000000000000" step="1" value="${b.cash ?? 0}" required></label><button type="submit" class="button primary">Lưu số dư đầu tháng</button></form></details>` : '<a class="text-link" href="#transactions">Xem sổ và số dư đầu tháng</a>'}<p class="fine-print">Số dư tính toàn bộ tháng đến ngày đang xem, không đổi khi lọc sổ. Quỹ để dành tính riêng.</p></section>`;
}
export function renderTransactions(data, a, filters, page, view = 'table') {
  const ts = filteredTransactions(data, filters), days = [...new Set(ts.map((t) => t.date))];
  const size = view === 'daily' ? 10 : 15, total = view === 'daily' ? days.length : ts.length;
  const pages = Math.max(1, Math.ceil(total / size)); page = Math.min(page, pages);
  const categories = [...new Set(data.transactions.filter((t) => !filters.group || t.group === filters.group).map((t) => t.category))].sort((a, b) => a.localeCompare(b, 'vi'));
  const income = sum(ts.filter((t) => t.type === 'income').map((t) => t.amount)), expense = sum(ts.filter((t) => t.type === 'expense').map((t) => t.amount));
  const daily = days.slice((page - 1) * size, page * size).map((day) => {
    const records = ts.filter((t) => t.date === day), inc = sum(records.filter((t) => t.type === 'income').map((t) => t.amount)), out = sum(records.filter((t) => t.type === 'expense').map((t) => t.amount));
    return `<details class="daily-ledger" open><summary><span><strong>${dateText(day)}</strong><small>${records.length} khoản</small></span><span class="daily-totals"><span>Thu <b class="amount-income">${formatVND(inc)}</b></span><span>Chi <b>${formatVND(out)}</b></span><span>Thu trừ chi <b class="${inc >= out ? 'amount-income' : ''}">${formatVND(inc - out)}</b></span></span></summary>${transactionTable(records, true)}</details>`;
  }).join('');
  const pageHeading = heading('Sổ thu chi', 'Ghi từng khoản, xem tổng từng ngày theo cách bạn vẫn quen.', a).replace('<div class="heading-actions">', `<div class="heading-actions">${btn('Nhập Excel', 'import-excel', 'secondary', 'upload')}`);
  return pageHeading + renderOpeningBalance(data, filters.month, a.today) + ((filters.category || filters.group || filters.search || filters.kind || filters.type || filters.allMonths || filters.billId) ? `<div class="ledger-context"><span>Đang xem: ${filters.allMonths ? 'Mọi tháng · ' : ''}${filters.scope ? 'Chi sinh hoạt · ' : ''}${E(filters.billName || filters.category || FLOW_LABELS[filters.kind] || (filters.kind === 'reserve' ? 'Chuyển quỹ' : GROUP_LABELS[filters.group]) || (filters.type === 'expense' ? 'Các khoản chi' : filters.search) || 'Các khoản đã chọn')}</span>${btn('Bỏ lọc', 'clear-filters', 'ghost small')}<a class="text-link" href="#analysis">Về phân tích</a></div>` : '') + `<section class="panel"><div class="ledger-view-tabs" role="group" aria-label="Cách xem sổ thu chi">${btn('Theo từng ngày', 'view-daily', view === 'daily' ? 'primary small' : 'secondary small', 'calendar')}${btn('Bảng tất cả khoản', 'view-table', view === 'table' ? 'primary small' : 'secondary small', 'grid')}</div><div class="filters"><label>Tháng<input type="month" id="filter-month" value="${E(filters.month)}"></label><label>Nhóm<select id="filter-group"><option value="">Tất cả nhóm</option>${Object.entries(GROUP_LABELS).map(([k, v]) => `<option value="${k}" ${filters.group === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label><label>Danh mục<select id="filter-category"><option value="">Tất cả danh mục</option>${categories.map((c) => `<option value="${E(c)}" ${filters.category === c ? 'selected' : ''}>${E(c)}</option>`).join('')}</select></label><label>Tìm giao dịch<input type="search" id="filter-search" value="${E(filters.search)}" placeholder="Tìm tên khoản, danh mục…" maxlength="1000"></label></div>
    ${filters.billId ? '' : `<label class="checkbox-label all-months-toggle"><input id="filter-all-months" type="checkbox" ${filters.allMonths ? 'checked' : ''}>Xem mọi tháng</label>`}<div id="ledger-results"><div class="transactions-summary"><div><span>Tổng tiền nhận</span><strong class="amount-income">${formatVND(income)}</strong></div><div><span>Tổng tiền chi ra</span><strong>${formatVND(expense)}</strong></div><div><span>Thu trừ chi</span><strong>${formatVND(income - expense)}</strong></div><div><span>Số giao dịch</span><strong>${ts.length}</strong></div></div>
    ${ts.length ? view === 'daily' ? daily : transactionTable(ts.slice((page - 1) * size, page * size), true) : empty('Chưa tìm thấy giao dịch', 'Thêm khoản mới, nhập tệp Excel hoặc đổi bộ lọc để xem lại giao dịch.', btn('Nhập Excel', 'import-excel', 'secondary', 'upload'))}
    <div class="pagination"><span>${total ? `${(page - 1) * size + 1}–${Math.min(page * size, total)} / ${total} ${view === 'daily' ? 'ngày' : 'giao dịch'}` : '0 giao dịch'}</span><div class="pagination-controls">${btn('Trước', 'prev-page', 'secondary small', '', page <= 1 ? 'disabled' : '')}<span class="month-pill">${page} / ${pages}</span>${btn('Sau', 'next-page', 'secondary small', '', page >= pages ? 'disabled' : '')}</div></div><p class="fine-print">Tổng ở trên theo bộ lọc đang chọn. Tiền cọc, tiền hoàn và chuyển quỹ vẫn xuất hiện đúng ngày; được tách riêng khi phân tích sinh hoạt. Khoản ghi ở ngày tương lai chưa cộng vào số dư hiện tại.</p></div></section>`;
}

export function renderAnalysis(data, a) {
  const m = monthlyMoney(data, a), top = m.categories[0], current = a.month === localDate().slice(0, 7);
  const linked = m.deposits.filter((d) => d.date.startsWith(a.month) || d.remaining > 0 || m.rows.some((t) => t.flow?.targetId === d.id));
  return heading('Hiểu tiền của mình', 'Xem khoản lớn, tìm chỗ điều chỉnh, rồi mở đúng ghi chép cần xem.', a) + renderHealthDetails(data, a) +
    `<section class="analysis-lead panel"><span class="category-icon">${icon('chart')}</span><div><h2>${top ? `${E(top.category)} là mục bạn chi nhiều nhất` : 'Bắt đầu từ những khoản bạn đã ghi'}</h2><p>${top ? `${formatVND(top.amount)} · khoảng ${N(top.amount / m.everyday * 100, 0)}% tiền sinh hoạt tháng này.` : 'Có khoản thu chi thì phần này sẽ tự cập nhật.'}${m.refunds ? ` ${formatVND(m.refunds)} tiền hoàn đã tách khỏi thu nhập mới.` : ''}</p></div>${top ? ledgerButton('Xem các khoản này', top.category, '', 'secondary small') : ''}</section>
    <div class="overview-columns analysis-columns"><section class="panel" id="spending-section"><div class="panel-header"><div><h2>Tiền sinh hoạt đã dùng</h2><p>${formatVND(m.everyday)} · không gồm cọc, chuyển quỹ và trả nợ</p></div></div>${categoryList(m, m.categories.length)}${m.categories.length ? '<p class="fine-print">Bấm một danh mục để xem, sửa hoặc xóa các khoản trong sổ.</p>' : ''}</section><section class="panel next-panel"><div class="panel-header"><div><h2>Việc nên xem trước</h2><p>Từ những gì bạn đã ghi trong sổ.</p></div>${icon('target')}</div>${prioritySteps(data, a, m)}${a.income.months < 3 ? '<p class="compact-note">Bạn mới có ít tháng ghi chép. Chưa đủ để kết luận thói quen chi tiêu dài hạn.</p>' : ''}</section></div>
    <section class="panel section-spaced" id="deposit-section"><div class="panel-header"><div><h2>Cọc và tiền được hoàn</h2><p>Vẫn tính đúng tiền ra vào, tách khỏi thu nhập và chi hằng ngày.</p></div>${btn('Ghi tiền cọc', 'new-deposit', 'secondary small', 'plus')}</div>${linked.length ? `<div class="deposit-list">${linked.map((d) => `<article class="deposit-row"><div><h3>${E(d.note || d.category)}</h3><p>Cọc ${formatVND(d.amount)} · Đã nhận lại ${formatVND(d.refunded)}</p></div><span class="badge ${d.remaining ? 'warning' : 'safe'}">${d.remaining ? `Chờ ${formatVND(d.remaining)}` : 'Đã nhận đủ'}</span><div class="row-actions">${d.remaining ? btn('Ghi nhận hoàn', 'refund-deposit', 'secondary small', '', `data-id="${E(d.id)}"`) : ''}${btn('Xem', 'edit-transaction', 'ghost small', '', `data-id="${E(d.id)}"`)}</div></article>`).join('')}</div>` : '<p class="helper-text">Khi ghi cọc, chọn “Tiền cọc chờ hoàn”. Lúc nhận lại, chọn đúng khoản cọc để thấy số còn chờ.</p>'}${m.unmatchedRefunds.length ? `<div class="compact-note">Có ${m.unmatchedRefunds.length} khoản hoàn chưa liên kết. ${btn('Chọn khoản cọc', 'edit-transaction', 'ghost small', '', `data-id="${E(m.unmatchedRefunds[0].id)}"`)}</div>` : ''}</section>
    <section class="panel section-spaced"><div class="panel-header"><div><h2>Khoản lớn đáng nhìn lại</h2><p>Chi cao hơn những lần trước cùng danh mục; có thể hoàn toàn hợp lý.</p></div></div>${a.anomalies.length ? recentList(a.anomalies.slice(0, 4)) + ledgerButton('Mở sổ để xem thêm') : '<p class="helper-text">Chưa thấy khoản nào cần nhắc riêng. Mỗi danh mục cần ít nhất 5 khoản để so sánh.</p>'}</section>
    ${a.cutbacks.actions.length && a.income.months >= 3 ? `<section class="panel section-spaced"><div class="panel-header"><div><h2>Có thể giảm ở đâu?</h2><p>Gợi ý cho cả tháng, dựa trên mức chi đã ghi trước đây.</p></div></div><div class="adjustment-list">${a.cutbacks.actions.slice(0, 3).map((c) => `<article><h3>${E(c.category)}</h3><strong>Giảm khoảng ${formatVND(c.suggestedCut)}</strong><p>Thử giữ trong ${formatVND(c.newCap)}/tháng.</p>${ledgerButton('Xem lại các khoản', c.category)}</article>`).join('')}</div></section>` : ''}
    <details class="panel section-spaced advanced-analysis"><summary>Xem thêm xu hướng và cách tính</summary><div class="method-content"><div class="plain-insights"><article><h3>Chi sau ngày nhận lương</h3><p>${a.payday.psi === null ? 'Chưa đủ dữ liệu để so sánh.' : a.payday.warning ? 'Bạn thường chi nhiều hơn trong 5 ngày sau ngày lương. Thử chia đều tiền cho từng tuần.' : 'Chưa thấy nhịp chi tăng mạnh sau ngày lương.'}</p>${btn('Đổi ngày nhận lương', 'open-planning', 'ghost small', '', 'data-section="reserve-section"')}</article><article><h3>Mua sắm và giải trí</h3><p>${!a.lifestyle.available ? 'Cần ít nhất 4 tháng hoàn chỉnh để xem thay đổi dài hạn.' : a.lifestyle.warning ? 'Phần tiền dành cho mua sắm và giải trí đang tăng nhanh hơn thu nhập.' : 'Chưa thấy phần tiền mua sắm và giải trí tăng quá nhanh.'}</p>${ledgerButton('Xem nhóm này', '', 'data-group="wants"')}</article></div><div class="trend-charts"><section id="income-history-section"><h3>Thu và chi qua các tháng</h3><p class="helper-text">Đơn vị: triệu đồng · không gồm cọc, tiền hoàn, chuyển quỹ và trả nợ.</p>${canvas('cashflow-chart', 'Thu nhập mới và chi sinh hoạt sáu tháng gần nhất')}</section><section><h3>Nhịp chi trong tháng</h3><p class="helper-text">Chi sinh hoạt cộng dồn so với kế hoạch theo thu nhập.</p>${canvas('daily-chart', 'Chi tiêu lũy kế so với kế hoạch theo thu nhập')}</section></div><p><strong>Chia tiền hiện có mỗi ngày:</strong> (tiền còn dùng − hóa đơn chưa trả − mức trả nợ tháng này còn thiếu) ÷ ${a.safe.daysLeft} ngày. Chưa tính thu nhập tương lai và các chi phí chưa ghi.</p><p><strong>Kế hoạch theo thu nhập:</strong> ${a.income.months ? `Dựa trên ${a.income.months} tháng đã ghi, mức tham chiếu ${formatVND(a.income.yBase)}/tháng. Hạn mức từ kế hoạch: ${formatVND(a.safe.dailySafeToSpend)}/ngày.` : 'Chưa có thu nhập để lập kế hoạch.'} Khác với cách chia tiền hiện có ở Tổng quan.</p><p><strong>Dự báo chi sinh hoạt:</strong> ${formatVND(a.forecast.blendedEomForecast)} đến cuối tháng theo lịch sử và nhịp chi đã ghi${current ? '' : ', tại thời điểm cuối tháng được chọn'}.</p><p><strong>Điểm theo dõi của ứng dụng:</strong> ${N(a.health.fhi)}/100. Gồm để dành 25%, quỹ 30%, hóa đơn 20%, nợ 15%, kiểm soát mua sắm 10%; không dùng để kết luận khi sổ còn thiếu.</p></div></details>`;
}

export function renderPlanning(data, a, extraPayment) {
  const debts = [...data.debts].sort((x, y) => y.apr - x.apr || x.principal - y.principal);
  return heading('Khoản cần lo', 'Hóa đơn, nợ và quỹ để dành đều nối với sổ thu chi.', a, false) +
    `<div class="planning-grid"><div class="stack"><section class="panel" id="bills-section"><div class="panel-header"><div><h2>Hóa đơn mỗi tháng</h2><p>Còn ${formatVND(a.unpaidFixedBills)} chưa ghi đã trả</p></div>${btn('Thêm', 'add-bill', 'secondary small', 'plus')}</div>${data.recurring_bills.length ? [...data.recurring_bills].sort((x, y) => x.dueDay - y.dueDay).map((b) => { const status = a.bills.find((x) => x.id === b.id); return `<article class="bill-row"><div class="record-info"><h3>${E(b.name)}</h3><p>Ngày ${Math.min(b.dueDay, a.daysInMonth)} · ${!b.active ? 'Tạm dừng' : status?.paid ? 'Đã trả tháng này' : `Còn ${formatVND(status?.remaining ?? b.amount)}`}</p></div><div class="record-actions">${b.active && !status?.paid ? btn('Ghi đã trả', 'pay-bill', 'secondary small', '', `data-id="${E(b.id)}"`) : ''}${b.active && !status?.paid ? btn('Dùng khoản đã ghi', 'link-bill-payment', 'ghost small', '', `data-id="${E(b.id)}"`) : ''}${ledgerButton('Xem sổ', '', `data-bill-id="${E(b.id)}" data-bill-name="${E(b.name)}"`, 'ghost small')}<button class="icon-button" data-action="edit-bill" data-id="${E(b.id)}" aria-label="Sửa hóa đơn ${E(b.name)}">${icon('edit')}</button><button class="icon-button delete" data-action="delete-bill" data-id="${E(b.id)}" aria-label="Xóa hóa đơn ${E(b.name)}">${icon('trash')}</button></div></article>`; }).join('') : '<p class="helper-text">Thêm tiền trọ, mạng hoặc khoản trả đều đặn để ứng dụng giữ lại tiền trước.</p>'}<p class="fine-print">“Ghi đã trả” thêm khoản chi mới. Nếu đã ghi hoặc đã nhập Excel, chọn “Dùng khoản đã ghi” để không trừ tiền hai lần.</p></section>
    <section class="panel" id="debts-section"><div class="panel-header"><div><h2>Nợ còn lại</h2><p>Ghi cả tiền trả gốc và lãi trong cùng một lần.</p></div>${btn('Thêm nợ', 'add-debt', 'secondary small', 'plus')}</div>${debts.length ? debts.map((d) => `<article class="debt-row"><div class="record-info"><h3>${E(d.name)}</h3><p>${N(d.apr, 2)}%/năm · Mỗi tháng ${formatVND(d.minMonthlyPayment)}</p><strong class="money">${formatVND(d.principal)}</strong></div><div class="record-actions">${d.principal > 0 ? btn('Ghi trả nợ', 'pay-debt', 'secondary small', '', `data-id="${E(d.id)}"`) : '<span class="badge safe">Đã hết nợ</span>'}${btn('Xem lần trả', 'open-ledger', 'ghost small', '', `data-all-months="true" data-kind="debt" data-target="${E(d.id)}"`)}<button class="icon-button" data-action="edit-debt" data-id="${E(d.id)}" aria-label="Sửa khoản nợ ${E(d.name)}">${icon('edit')}</button><button class="icon-button delete" data-action="delete-debt" data-id="${E(d.id)}" aria-label="Xóa khoản nợ ${E(d.name)}">${icon('trash')}</button></div></article>`).join('') : '<p class="helper-text">Nếu có khoản vay, điền số nợ thực tế và mức trả mỗi tháng.</p>'}<p class="fine-print">Ghi trả nợ sẽ thêm khoản chi và giảm nợ đúng phần gốc bạn nhập. Sửa hoặc xóa lần trả sẽ tính lại số nợ.</p></section></div>
    <div class="stack"><section class="panel" id="reserve-section"><div class="panel-header"><div><h2>Quỹ để dành</h2><p>Tách khỏi tiền tiêu hằng ngày.</p></div>${icon('shield')}</div><strong class="reserve-amount money">${formatVND(data.profile.liquidSavings)}</strong><div class="fund-actions">${btn('Chuyển vào quỹ', 'reserve-in', 'primary small')}${btn('Rút từ quỹ', 'reserve-out', 'secondary small')}${btn('Xem lịch sử', 'open-ledger', 'ghost small', '', 'data-kind="reserve" data-all-months="true"')}</div><p class="helper-text">Mỗi lần chuyển quỹ được ghi vào sổ và cập nhật số dư cùng lúc.</p><details><summary>Đối chiếu số dư và cài đặt</summary><form id="profile-form" class="profile-form"><label>Số dư quỹ thực tế (₫)<input name="liquidSavings" type="number" min="0" max="9000000000000" step="1" value="${data.profile.liquidSavings}" required></label><p class="fine-print">Chỉ đối chiếu khi bắt đầu hoặc cần sửa số dư. Chuyển tiền hằng ngày dùng hai nút phía trên.</p><div class="form-grid"><label>Ngày nhận lương<input name="paydayDay" type="number" min="1" max="31" value="${data.profile.paydayDay}" required></label><label>Thu nhập<select name="incomeModeOverride"><option value="AUTO" ${data.profile.incomeModeOverride === 'AUTO' ? 'selected' : ''}>Để ứng dụng xem</option><option value="STABLE" ${data.profile.incomeModeOverride === 'STABLE' ? 'selected' : ''}>Đều hằng tháng</option><option value="IRREGULAR" ${data.profile.incomeModeOverride === 'IRREGULAR' ? 'selected' : ''}>Không đều</option></select></label></div><button class="button primary" type="submit">Lưu đối chiếu</button></form></details></section>
    <details class="panel"><summary>Thử trả nợ nhanh hơn</summary><div class="method-content"><label>Có thể trả thêm mỗi tháng (₫)<input type="number" id="extra-payment" min="0" max="9000000000000" step="50000" value="${extraPayment}"></label><div id="debt-simulation"></div><p class="fine-print">Ước tính theo lãi suất đã nhập, chưa tính phí hoặc thay đổi lãi thực tế.</p></div></details></div></div>`;
}
export function renderDebtSimulation(plan) {
  if (!plan.orderedDebts.length) return '<p class="insight-note">Thêm khoản nợ để ước tính thời gian và tiền lãi có thể tiết kiệm.</p>';
  return `<div class="chart-summary"><div><span>Thời gian trả hết</span><strong>${plan.accelerated.paidOff ? `${plan.accelerated.months} tháng` : 'Chưa trả hết được'}</strong></div><div><span>Tiền lãi giảm dự kiến</span><strong class="amount-income">${plan.interestSaved === null ? 'Chưa ước tính được' : formatVND(plan.interestSaved)}</strong></div></div>${!plan.accelerated.paidOff ? '<p class="insight-note">Mức trả hiện tại chưa đủ giảm dư nợ hoặc vượt 100 năm mô phỏng. Hãy tăng số tiền trả mỗi tháng.</p>' : !plan.baseline.paidOff ? '<p class="insight-note">Mức trả tối thiểu chưa đủ tất toán. Phần trả thêm giúp có thể trả hết; chưa thể so sánh tổng lãi với phương án cũ.</p>' : `<p class="insight-note">Chỉ trả tối thiểu: ${plan.baseline.months} tháng, tổng lãi ${formatVND(plan.baseline.interest)}. Phương án trả thêm: tổng lãi ${formatVND(plan.accelerated.interest)}.</p>`}`;
}

export function renderSettings(data, a, storage) {
  return heading('Giữ dữ liệu, giữ sự an tâm.', 'Một vài cài đặt nhỏ để góc tài chính luôn thuộc về bạn.', a, false) +
  `<div class="settings-grid"><section class="panel settings-card"><div class="panel-header"><h2>Nhập sổ Excel của bạn</h2>${icon('upload')}</div><p>Đọc tệp .xlsx, .xls hoặc .csv ngay trên laptop. Tự nhận ngày gộp, tiền âm/dương và danh mục; xem trước rồi mới lưu, có kiểm tra khoản trùng.</p>${btn('Chọn tệp Excel', 'import-excel', 'primary', 'upload')}<p class="fine-print">Giữ nguyên tên danh mục bạn đang dùng. Các ô tổng ngày và số dư riêng không được nhập lại thành giao dịch.</p></section><section class="panel settings-card"><div class="panel-header"><h2>Sao lưu & Khôi phục</h2>${icon('download')}</div><p>Tải một bản JSON để giữ đầy đủ giao dịch, hóa đơn, nợ và cài đặt. Dùng tệp này để chuyển dữ liệu sang trình duyệt hoặc máy khác.</p>${btn('Sao lưu dữ liệu', 'backup', 'primary', 'download')}${btn('Khôi phục từ JSON', 'restore', 'secondary', 'upload')}<div class="setting-row"><div><strong>Bản sao lưu gần nhất</strong><small>${data.profile.lastBackupAt ? E(new Date(data.profile.lastBackupAt).toLocaleString('vi-VN')) : 'Bạn chưa tạo bản sao lưu nào.'}</small></div>${icon('clock')}</div><p class="fine-print">Khôi phục sẽ thay thế dữ liệu hiện có sau khi tệp được kiểm tra. Tệp sao lưu nằm trong thư mục tải xuống trên máy bạn.</p></section>
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

```

### File: js/app.js

```javascript
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
  if (section) { const target = document.getElementById(section); let parent = target?.parentElement?.closest('details'); while (parent) { parent.open = true; parent = parent.parentElement?.closest('details'); } target?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
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
  else if (action === 'open-health') goTo('analysis', 'health-analysis');
  else if (action === 'open-analysis') goTo('analysis', attrs.section);
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

```

### File: js/excel-import.js

```javascript
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
export function buildImport(sheet, { headerRow = sheet.header.index, mapping = sheet.header.mapping, mode = 'signed', month = localDate().slice(0, 7), multiplier = 1, fillDates = false, categoryGroups = {} } = {}) {
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
      let type = ['income', 'thu', 'khoanthu'].includes(rawType) ? 'income' : ['expense', 'chi', 'khoanchi'].includes(rawType) ? 'expense' : mode === 'income' ? 'income' : mode === 'expense' ? 'expense' : signed > 0 ? 'income' : 'expense';
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
      const kind = suggestFlow({ type, note });
      if (kind !== 'regular') warnings.push(kind === 'deposit' ? 'Gợi ý tách tiền cọc khỏi chi sinh hoạt. Có thể đổi cách tính ở cột bên phải.' : 'Gợi ý tách tiền hoàn khỏi thu nhập mới. Sau khi nhập, chọn khoản cọc liên quan.');
      const transaction = validateRecord('transactions', { id: uuid(), date, type, amount: Math.abs(signed), group, category, isFixedBill: kind === 'regular' && type === 'expense' && ['1', 'true', 'co', 'yes'].includes(rawFixed), note: note || category, createdAt: Date.now(), ...(kind !== 'regular' ? { flow: { kind } } : {}) });
      categories.add(rawCategory || 'Chưa phân loại');
      records.push({ row: r + 1, transaction, warnings, selected: true });
    } catch (error) { errors.push({ row: r + 1, message: error.message }); }
  }
  return { rows: records, errors, skipped, categories: [...categories] };
}

```

### File: js/excel-ui.js

```javascript
import { GROUP_LABELS, localDate } from './finance-engine.js';
import { markExistingTransactions, planImport } from './db.js';
import { workbookSheets, buildImport, parseMoney, suggestedGroup, detectColumns, detectOpeningBalance, detectSideBalances, excelDate } from './excel-import.js';
import { kindOf } from './money-flow.js';
import { escapeHtml as E, formatVND, icon } from './ui.js';

let libraryPromise;
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
    const importedIncome = state.ready.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0), importedExpense = state.ready.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { duplicateCount: duplicate.filter(Boolean).length, income: importedIncome, expense: importedExpense, foundOpening, side };
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
    preview.innerHTML = `<div class="excel-summary"><div><span>Sẵn sàng nhập</span><strong>${state.ready.length} khoản</strong></div><div><span>Tổng thu được chọn</span><strong class="amount-income">${formatVND(totals.income)}</strong></div><div><span>Tổng chi được chọn</span><strong>${formatVND(totals.expense)}</strong></div><div><span>Thu trừ chi</span><strong>${formatVND(totals.income - totals.expense)}</strong></div></div>
      ${totals.foundOpening ? `<aside class="banner excel-opening-banner"><label class="checkbox-label"><input id="excel-import-opening" type="checkbox" ${state.importOpening ? 'checked' : ''}>Lưu cả tiền có sẵn đầu tháng ${E(state.options.month)}</label><p>Ngân hàng: <strong>${formatVND(totals.foundOpening.bank)}</strong> · Tiền mặt: <strong>${formatVND(totals.foundOpening.cash)}</strong>. Tổng: <strong>${formatVND(totals.foundOpening.bank + totals.foundOpening.cash)}</strong>.</p><p class="fine-print">Chỉ chọn nếu đây là số dư đầu tháng. Lưu riêng để tính tiền còn lại, không cộng vào thu nhập mới và không cộng quỹ tiết kiệm. Sẽ thay số dư đầu tháng đang lưu cho tháng này.</p></aside>` : ''}
      <details class="excel-mapping"><summary>Phân nhóm theo danh mục của bạn</summary><p class="helper-text">Giữ nguyên tên danh mục trong Excel. Kiểm tra nhóm Thiết yếu / Mong muốn trước khi xác nhận; các khoản nhận tiền luôn được ghi là thu.</p><div class="excel-column-grid">${categoryGroups}</div></details>
      ${totals.side.liquidSavings !== null ? `<aside class="banner"><label class="checkbox-label"><input id="excel-import-savings" type="checkbox" ${state.importSavings ? 'checked' : ''}>Đối chiếu quỹ để dành: ${formatVND(totals.side.liquidSavings)}</label><p class="fine-print">Thay số dư quỹ đang lưu bằng số này, không tạo khoản thu chi. Chỉ chọn nếu đây là số quỹ thực tế hiện tại.</p></aside>` : ''}
      ${totals.side.debt !== null ? `<p class="compact-note">Tệp có ghi dư nợ ${formatVND(totals.side.debt)}. Sau khi nhập, bạn có thể bổ sung lãi suất và mức trả trong Khoản cần lo; ứng dụng chưa tự tạo nợ.</p>` : ''}
      <p class="fine-print">Cọc và tiền hoàn được gợi ý tách riêng ở cột “Cách tính”. Kiểm tra trước khi lưu; tiền ra vào vẫn giữ nguyên.</p>
      <div class="excel-import-options"><label class="checkbox-label"><input id="excel-skip-duplicates" type="checkbox" ${state.skipDuplicates ? 'checked' : ''}>Bỏ qua khoản giống giao dịch đã có (${totals.duplicateCount})</label>${state.skipDuplicates ? `<label class="checkbox-label"><input id="excel-update-details" type="checkbox" ${state.updateDetails ? 'checked' : ''}>Bổ sung danh mục trống, loại cọc/hoàn cho khoản đã có (${state.updates} khoản)</label>` : ''}${result.errors.length ? `<label class="checkbox-label"><input id="excel-allow-partial" type="checkbox" ${state.allowPartial ? 'checked' : ''}>Chỉ nhập các dòng hợp lệ; bỏ ${result.errors.length} dòng lỗi</label>` : ''}</div>
      ${result.errors.length ? `<div class="form-error"><strong>${result.errors.length} dòng cần kiểm tra</strong><ul>${result.errors.slice(0, 10).map((r) => `<li>Dòng ${r.row}: ${E(r.message)}</li>`).join('')}</ul>${result.errors.length > 10 ? '<p>Chỉ hiển thị 10 lỗi đầu. Hãy kiểm tra lại tệp trước khi nhập.</p>' : ''}</div>` : ''}
      ${result.rows.length ? `<div class="table-scroll excel-preview-table"><table><thead><tr><th><input id="excel-select-all" type="checkbox" aria-label="Chọn tất cả giao dịch Excel" ${result.rows.every((r) => !state.excluded.has(r.row)) ? 'checked' : ''}></th><th>Ngày</th><th>Nội dung & Lưu ý</th><th>Danh mục</th><th class="align-right">Số tiền</th><th>Cách tính</th><th>Hóa đơn<br>cố định</th></tr></thead><tbody>${result.rows.slice((state.page - 1) * perPage, state.page * perPage).map((r) => `<tr class="${r.duplicate && state.skipDuplicates && !state.excluded.has(r.row) ? 'excel-duplicate' : ''}"><td><input type="checkbox" data-excel-row="${r.row}" aria-label="Chọn dòng ${r.row}" ${state.excluded.has(r.row) ? '' : 'checked'}></td><td class="tabular">${E(r.transaction.date.split('-').reverse().join('/'))}<small class="excel-row-number">Dòng ${r.row}</small></td><td><span class="excel-note">${E(r.transaction.note)}</span>${r.warnings.map((w) => `<small class="excel-row-warning">${E(w)}</small>`).join('')}${r.duplicate && !state.excluded.has(r.row) ? '<small class="excel-row-warning">Giống giao dịch đã có trong sổ.</small>' : ''}</td><td>${E(r.transaction.category)}<small class="excel-row-number">${GROUP_LABELS[r.transaction.group]}</small></td><td class="align-right money ${r.transaction.type === 'income' ? 'amount-income' : ''}">${r.transaction.type === 'income' ? '+' : '−'}${formatVND(r.transaction.amount)}</td><td><select class="excel-kind-select" data-excel-kind="${r.row}" aria-label="Cách tính dòng ${r.row}">${(r.transaction.type === 'income' ? [['regular','Thu nhập mới'],['refund','Tiền được hoàn']] : [['regular','Chi sinh hoạt'],['deposit','Tiền cọc']]).map(([kind,label]) => `<option value="${kind}" ${kindOf(r.transaction) === kind ? 'selected' : ''}>${label}</option>`).join('')}</select></td><td><input type="checkbox" data-excel-fixed="${r.row}" aria-label="Dòng ${r.row} là hóa đơn cố định" ${r.transaction.isFixedBill ? 'checked' : ''} ${r.transaction.type === 'income' || kindOf(r.transaction) !== 'regular' ? 'disabled' : ''}></td></tr>`).join('')}</tbody></table></div><div class="pagination"><span>${result.rows.length} dòng hợp lệ · ${result.skipped} dòng tổng hoặc bằng 0 được bỏ qua</span><div class="pagination-controls"><button type="button" class="button secondary small" data-excel-action="previous" ${state.page === 1 ? 'disabled' : ''}>Trước</button><span>${state.page}/${pages}</span><button type="button" class="button secondary small" data-excel-action="next" ${state.page === pages ? 'disabled' : ''}>Sau</button></div></div>` : '<div class="empty-state"><h3>Chưa có giao dịch để nhập</h3><p>Kiểm tra trang tính, dòng tiêu đề và cột ngày / số tiền ở trên.</p></div>'}
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
    state.options = { headerRow: sheet.header.index, mapping: { ...sheet.header.mapping }, month: firstDate?.slice(0, 7) || localDate().slice(0, 7), mode: hasNegative ? 'signed' : 'expense', multiplier: 1, fillDates: false, categoryGroups: Object.create(null) };
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

```

### File: sw.js

```javascript
const CACHE = 'vung-tai-chinh-v5-wellbeing';
const STATIC = ['./', './index.html', './css/styles.css', './js/app.js', './js/ui.js', './js/db.js', './js/finance-engine.js', './js/money-flow.js', './js/charts.js', './js/seed-data.js', './js/excel-import.js', './js/excel-ui.js', './vendor/xlsx.full.min.js', './manifest.webmanifest', './icon.svg'];
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

### File: icon.svg

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="44" fill="#0f6f50"/><path d="M48 136V88h24v48m24 0V64h24v72m24 0V40" fill="none" stroke="#c6f5ad" stroke-width="14" stroke-linecap="round"/><path d="m45 55 28-15" stroke="#c6f5ad" stroke-width="10" stroke-linecap="round"/></svg>

```

### File: package.json

```json
{
  "name": "vung-tai-chinh",
  "private": true,
  "type": "module",
  "scripts": { "test": "node --test tests/*.test.js" },
  "description": "Sổ thu chi cá nhân tiếng Việt, không cần máy chủ hay bước biên dịch"
}

```

### File: .gitignore

```
dist/
.openai/
node_modules/
test-results/
*.xlsx
*.xls
*.csv
vung-tai-chinh-*.json

```

### File: README.md

````markdown
# Vững Tài Chính

Sổ quản lý chi tiêu cá nhân tiếng Việt, ưu tiên sử dụng trên laptop. Chạy trực tiếp bằng HTML, CSS và JavaScript; không cần máy chủ riêng, tài khoản hay bước biên dịch.

**Mở ứng dụng:** https://bao-hann.github.io/moneywall/

## Bắt đầu

1. Mở ứng dụng trên laptop, vào **Sổ thu chi → Nhập Excel** để mang ghi chép đang dùng vào sổ.
2. Kiểm tra cách tính cọc/tiền hoàn và chọn lưu số dư ngân hàng, tiền mặt đầu tháng nếu đúng. Có thể đối chiếu quỹ để dành riêng.
3. Ở **Tổng quan**, xem tiền còn dùng, tiền đã chi ra và gợi ý tạm chia mỗi ngày. Phần **Bước tiếp theo** mở đúng nơi cần ghi hoặc sửa.
4. Ở **Phân tích**, bấm một danh mục để xem đúng các khoản sinh hoạt tạo nên tổng đó. Xu hướng và công thức nằm trong phần mở rộng.
5. Ở **Khoản cần lo**, thêm hóa đơn, nợ hoặc quỹ. Ghi thanh toán, chuyển quỹ và trả nợ tại đây sẽ cập nhật cùng sổ thu chi.
6. Vào **Sao lưu & Cài đặt → Sao lưu dữ liệu** định kỳ, trước khi đổi máy hoặc dọn dữ liệu trình duyệt.

Không tự nạp dữ liệu mẫu. Mục thử mẫu trong Cài đặt luôn hỏi trước khi thay sổ.

## Sức khỏe và từng bước tự chủ tài chính

Sức khỏe tài chính được đặt ở đầu Tổng quan: điểm trên 100 theo mô hình hiện có, tình trạng dễ hiểu, quỹ đủ bao lâu và đúng một bước ưu tiên. Không đổi công thức hay trọng số chấm điểm. Khi chưa có thu nhập hoặc chi phí thiết yếu, chưa chấm điểm; sổ dưới ba tháng ghi rõ là đánh giá tạm.

Nút **Xem lộ trình và từng phần** mở Phân tích, giải thích năm phần của điểm và các mốc: thu đủ chi sinh hoạt, quỹ đệm một tháng, kiểm soát nợ lãi cao, quỹ dài hơn và thu vượt chi sinh hoạt ba tháng hoàn chỉnh. Chưa ghi nợ được hiển thị là chưa đối chiếu, không tự đánh dấu hoàn tất mốc nợ. Mỗi mốc mở đúng sổ, quỹ, nợ hoặc biểu đồ liên quan.

Bước ưu tiên đi theo cấp hiện tại của mô hình: cân bằng thu chi → quỹ đầu tiên → nợ lãi cao → quỹ dài hơn → duy trì nền tảng. Hiển thị số còn thiếu để đạt mốc quỹ hoặc khoản nợ cần xem, không tự thực hiện giao dịch. Điểm theo dõi nền tảng hiện tại; không dùng làm tỷ lệ phần trăm đã đạt tự do tài chính.

## Cách ghi quen thuộc

Tên khoản là nội dung chính, danh mục nằm ngay dưới. Biểu mẫu gợi lại danh mục và nội dung từng dùng, cho phép nhập danh mục mới. Nhóm dùng cho phân tích nằm trong phần mở rộng. Sổ mặc định gom theo ngày, cộng riêng thu, chi và chênh lệch; có thể chuyển sang bảng toàn bộ.

Tháng được chọn thống nhất giữa Tổng quan, Phân tích và Sổ thu chi. Lịch sử chuyển quỹ/trả nợ có thể xem mọi tháng. Bộ lọc từ phân tích được ghi rõ và có nút bỏ lọc.

## Các khoản nối với nhau

| Việc ghi | Cập nhật cùng lúc |
| --- | --- |
| Thu hoặc chi thường | Sổ, số dư, danh mục và phân tích |
| Tiền cọc | Tiền chi ra và số cọc đang chờ; tách khỏi chi sinh hoạt |
| Nhận hoàn cọc | Tiền nhận và số còn chờ của khoản cọc đã chọn; tách khỏi thu nhập mới |
| Chuyển vào/rút khỏi quỹ | Sổ và số dư quỹ; không tính thành thu nhập hay chi sinh hoạt |
| Trả nợ | Toàn bộ tiền chi trong sổ; giảm nợ đúng phần gốc được nhập, phần còn lại là lãi/phí |
| Thanh toán hóa đơn | Một khoản chi trong sổ và trạng thái đã trả/mức còn thiếu |
| Dùng khoản Excel đã ghi để trả hóa đơn | Gắn chính khoản có sẵn, giữ nguyên số lượng giao dịch và tiền ra vào |
| Sửa/xóa chuyển quỹ hoặc trả nợ | Hoàn lại tác động cũ rồi áp dụng thay đổi; lưu nguyên vẹn hoặc hủy toàn bộ |

Không cho hoàn vượt tiền cọc, rút vượt quỹ hoặc trả gốc vượt nợ. Muốn bỏ khoản cọc đã gắn tiền hoàn, cần gỡ liên kết tại khoản hoàn trước. Khoản nợ có lịch sử trả được giữ lại để truy vết; trả hết thì số nợ về 0. Các lần chuyển quỹ/trả nợ chỉ ghi khi đã thực hiện, không đặt ngày tương lai.

**Tạm chia mỗi ngày** dùng tiền hiện còn, trừ hóa đơn chưa trả và mức trả nợ tháng này còn thiếu, rồi chia số ngày còn lại (kể cả hôm nay). Không dự đoán khoản thu tương lai, không bao gồm chi phí chưa ghi hoặc chưa khai báo. Đây là cách chia tiền hiện có, tách với kế hoạch theo thu nhập trong phần phân tích mở rộng.

## Nhập sổ Excel đang dùng

Mở **Sổ thu chi → Nhập Excel** hoặc **Sao lưu & Cài đặt → Chọn tệp Excel**. Ứng dụng đọc `.xlsx`, `.xls` và `.csv` ngay trên laptop, tối đa 10 MB và 10.000 dòng giao dịch mỗi lần.

1. Chọn tệp, sau đó kiểm tra trang tính và dòng tiêu đề được nhận diện. Có thể đổi cột nếu tệp của bạn khác mẫu.
2. Kiểm tra cách ghi tiền: âm là chi/dương là thu, tất cả là chi, hoặc tất cả là thu. Có thể đổi đơn vị từ nghìn/triệu đồng sang đồng.
3. Xem trước tổng thu, tổng chi và từng khoản. Ngày trong ô gộp được nhận tự động; ô ngày bỏ trống ngoài vùng gộp chỉ được lấy ngày dòng trước khi bạn bật tùy chọn đó.
4. Giữ nguyên danh mục từ Excel, chọn lại nhóm Thiết yếu/Mong muốn/Tiết kiệm nếu cần, đánh dấu hóa đơn cố định và bỏ chọn khoản không muốn nhập.
5. Bấm **Nhập ... giao dịch vào sổ**. Chỉ thêm giao dịch, không xóa sổ hay tự tạo khoản nợ. Có thể bổ sung danh mục trống và cách tính cọc/hoàn của khoản đã có, có hiển thị số khoản cập nhật trước khi lưu. Nếu chọn lưu tiền đầu tháng, ứng dụng lưu riêng số dư của tháng đó.

Một bảng có hai cột cùng tên “Danh mục” được hiểu là tên khoản ở cột đầu, phân loại ở cột cuối. Cột tổng ngày và các ô số dư bên cạnh không được nhập lại thành giao dịch. Các phép cộng/trừ/nhân/chia đơn giản trong ô số tiền được tính bằng bộ phân tích giới hạn; công thức khác chỉ dùng kết quả số đã lưu trong tệp, có lưu ý ở bản xem trước. Ứng dụng không chạy mã hoặc hàm từ tệp Excel.

Các dòng lỗi phải được sửa trong tệp, hoặc bạn chủ động cho phép chỉ nhập dòng hợp lệ. Các khoản giống sổ hiện có được bỏ qua mặc định, có đối chiếu số lần xuất hiện để giữ đúng những lần mua trùng nhau thực sự. Có thể bỏ tùy chọn này nếu cần nhập cả khoản giống nhau.

Sổ thu chi có hai cách xem: **Theo từng ngày** và **Bảng tất cả khoản**. Theo từng ngày hiển thị tổng thu, tổng chi và chênh lệch riêng, cộng từ từng giao dịch để tránh lỗi vùng tính tổng trong bảng tính.

Thư viện đọc Excel được đóng gói trong `vendor/`, không cần gọi dịch vụ để xử lý tệp. Xem [thông tin giấy phép](./vendor/NOTICE.md). Không đưa sổ Excel cá nhân hoặc dữ liệu thật vào kho GitHub.

## Tiền có sẵn đầu tháng và số tiền còn lại

Sổ thu chi có phần **Tiền còn lại trong tháng**. Điền tiền ngân hàng và tiền mặt ở đầu tháng rồi lưu, hoặc trong phần nhập Excel chọn **Lưu cả tiền có sẵn đầu tháng** khi ứng dụng nhận được hai ô ngân hàng và tiền mặt riêng.

Công thức: **Tiền còn lại = Ngân hàng đầu tháng + Tiền mặt đầu tháng + Các khoản thu mới − Các khoản chi đã ghi**. Quỹ dự phòng không cộng vào số tiền này. Số dư đầu tháng được lưu theo từng tháng, không tự coi là thu nhập và không thay đổi theo bộ lọc nhóm/danh mục/ghi chú. Giao dịch tương lai chưa được cộng vào số tiền hiện tại.

Không thể tách chính xác số dư ngân hàng hiện tại và tiền mặt hiện tại nếu giao dịch chưa ghi phương thức thanh toán; ứng dụng chỉ hiển thị tổng hai nguồn tiền sau thu chi. Không tự chuyển số cuối tháng sang đầu tháng kế tiếp khi chưa đối chiếu; bạn có thể cập nhật riêng từng tháng. Tệp JSON cũ vẫn khôi phục được khi chưa có trường số dư đầu tháng.

## Dữ liệu được lưu ở đâu?

Mọi giao dịch, hóa đơn, khoản nợ và cài đặt được lưu bằng IndexedDB trong trình duyệt trên máy đang dùng. Ứng dụng không có máy chủ nhận các dữ liệu này. Mỗi trình duyệt và mỗi địa chỉ web có một sổ riêng, không tự đồng bộ giữa các thiết bị.

Đóng và mở lại trang vẫn còn dữ liệu nếu trình duyệt cho phép lưu. Khi IndexedDB bị chặn, ứng dụng hiện cảnh báo dùng bộ nhớ tạm; hãy xuất JSON trước khi đóng thẻ. Quyền lưu trữ bền vững được yêu cầu tự động nhưng trình duyệt quyết định có cấp hay không.

JSON giữ đủ bốn nhóm dữ liệu để khôi phục. CSV dùng UTF-8 BOM, giữ tiếng Việt khi mở Excel và vô hiệu hóa ghi chú có thể bị bảng tính hiểu là công thức. **Không lưu dữ liệu thật hoặc tệp sao lưu cá nhân vào kho mã nguồn công khai này.**

## Năm khu vực

| Khu vực | Chức năng |
| --- | --- |
| Tổng quan | Tiền còn dùng, tiền đã chi, tạm chia mỗi ngày, bước tiếp theo và khoản ghi gần đây |
| Sổ thu chi | Thêm/sửa/xóa, chọn nhanh mệnh giá, nhóm và danh mục, lọc tháng/nhóm/danh mục/ghi chú, phân trang |
| Phân tích | Danh mục chi lớn, việc cần xem, cọc và tiền hoàn; xu hướng và cách tính mở khi cần |
| Khoản cần lo | Hóa đơn, dùng khoản đã ghi để đánh dấu đã trả, trả nợ gốc/lãi, chuyển quỹ và đối chiếu số dư |
| Sao lưu & Cài đặt | Xuất/nhập JSON, xuất CSV, trạng thái lưu trữ, sáng/tối, dữ liệu mẫu và xóa sổ |

Các quy tắc phân tích được viết độc lập với giao diện trong `js/finance-engine.js`; liên kết dòng tiền và thay đổi số dư ở `js/money-flow.js`. Số tiền lưu dưới dạng số nguyên VND. Lãi suất và các tỷ lệ được phép có phần thập phân.

### Một số quy ước quan trọng

- Dự báo chi sinh hoạt gồm nhóm thiết yếu và mong muốn, không cộng lại cọc, hoàn tiền và chuyển quỹ/trả nợ. Tất cả vẫn có trong dòng tiền thực tế.
- Hóa đơn định kỳ dùng để dành trước ngân sách; không tự tạo giao dịch. Nút ✓ mở giao dịch thanh toán để bạn kiểm tra rồi lưu. Thanh toán một phần chỉ dành trước số còn thiếu.
- Hóa đơn có liên kết rõ được đối chiếu trước; khoản cũ chưa liên kết được đối chiếu theo danh mục. Một khoản thanh toán không dùng hai lần.
- Đối chiếu số dư quỹ/nợ dùng khi thiết lập hoặc sửa số thực tế. Chuyển quỹ và ghi trả nợ hằng ngày dùng các chức năng liên kết với sổ; sửa/xóa giao dịch sẽ đảo đúng tác động cũ.
- Dự báo chỉ dùng các tháng đã kết thúc; tháng có khoảng trống được tính là 0. Tháng hiện tại chỉ tham gia thu nhập nền khi đã có khoản thu.
- Giao dịch có ngày tương lai được lưu trong sổ nhưng chưa cộng vào các chỉ số của hôm nay.
- Mỗi mức giảm chi là bội số 50.000 ₫, không vượt 35% mức trung bình danh mục, không vượt phần hụt. Nếu làm tròn gần nhất vượt trần thì hạ về bội số lớn nhất còn nằm trong giới hạn.
- Điểm FHI, ngưỡng nợ lãi cao và các cấp độ là quy tắc của ứng dụng theo bản yêu cầu, không phải một chứng nhận hay bộ tiêu chuẩn tài chính chính thức.
- Mô phỏng trả nợ dùng lãi suất năm chia 12, lãi gộp mỗi tháng; chưa tính phí hoặc thay đổi lãi. Nếu mức trả không đủ giảm dư nợ, giao diện báo không thể tất toán thay vì hiển thị kết quả sai.

## Chạy trên máy và kiểm tra

Không mở `index.html` bằng đường dẫn `file://`, vì trình duyệt chặn mô-đun JavaScript và chế độ ngoại tuyến. Dùng địa chỉ GitHub Pages hoặc một máy chủ tệp tĩnh, ví dụ:

```sh
python -m http.server 8000
```

Sau đó mở `http://localhost:8000/`.

Các phép kiểm tra dùng Node.js 20 trở lên, không cần cài thêm thư viện:

```sh
npm test
```

## GitHub Pages

Trong **Settings → Pages**, chọn **Deploy from a branch**, nhánh **main**, thư mục **/(root)**, rồi **Save**. Các đường dẫn đều tương đối, có `.nojekyll`, nên hoạt động tại thư mục con `/moneywall/`.

Service Worker dùng ưu tiên mạng cho tệp nội bộ, ưu tiên bộ đệm cho Chart.js. Sau lần tải thành công, ứng dụng dùng được khi mất mạng. Lần đầu chưa tải được Chart.js thì hiện thông báo; các chức năng ghi chép và tính toán vẫn dùng được. Phông chữ từ Google Fonts có phông hệ thống dự phòng.

Khi cập nhật nguồn sau này, đổi phiên bản `CACHE` trong `sw.js` để dọn các bộ đệm cũ. Đừng đổi địa chỉ trang nếu chưa sao lưu: IndexedDB gắn với địa chỉ trang đang dùng.

Xem bảng kiểm chứng tại [docs/KIEM_CHUNG.md](./docs/KIEM_CHUNG.md) và toàn bộ các tệp theo thứ tự bản yêu cầu tại [docs/MA_NGUON_DAY_DU.md](./docs/MA_NGUON_DAY_DU.md).

````

### File: tests/finance-engine.test.js

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyIncome, forecastSpending, detectAnomalies, paydaySpike, lifestyleCreep, financialHealth, safeToSpend, cutbackPlan, analyzeFinance, DEFAULT_PROFILE, simulateDebtPayoff, localDate } from '../js/finance-engine.js';
import { createSeedData } from '../js/seed-data.js';
import { validateBackup, createBackup, createCSV, validateRecord, initDB, readData, replaceData, putRecord, deleteRecord } from '../js/db.js';
import { escapeHtml, filteredTransactions, renderOverview, renderAnalysis, renderPlanning, renderSettings, renderTransactions } from '../js/ui.js';

const date = new Date(2026, 10, 21), today = localDate(date);
const tx = (overrides = {}) => ({ id: crypto.randomUUID(), date: today, type: 'expense', group: 'wants', category: 'Ăn ngoài & Cafe', amount: 50000, isFixedBill: false, note: '', createdAt: 100, ...overrides });
const empty = () => ({ transactions: [], recurring_bills: [], debts: [], profile: { ...DEFAULT_PROFILE } });
const approximate = (actual, expected, tolerance = 1e-7) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);

test('income: no observations and cold start', () => {
  assert.equal(classifyIncome([]).mode, 'NO_INCOME');
  assert.equal(classifyIncome([10, 20]).yBase, 10);
  assert.equal(classifyIncome([10, 20]).mode, 'COLD_START');
});
test('income: sample CV thresholds, conservative mean and P25', () => {
  assert.equal(classifyIncome([1000000, 1000000, 1000000]).yBase, 1000000);
  const moderate = classifyIncome([800000, 1000000, 1200000]);
  approximate(moderate.cv, .2); assert.equal(moderate.mode, 'MODERATE'); assert.equal(moderate.yBase, 900000);
  const irregular = classifyIncome([0, 1000000, 2000000]); assert.equal(irregular.mode, 'IRREGULAR'); assert.equal(irregular.yBase, 500000);
});
test('income: irregular and stable overrides; surplus is not negative', () => {
  const a = classifyIncome([100, 200], 300, 'IRREGULAR'); assert.equal(a.yBase, 100); assert.equal(a.mode, 'IRREGULAR'); assert.equal(a.surplusForBuffer, 200);
  assert.equal(classifyIncome([0, 100, 200], 50, 'STABLE').yBase, 100);
  assert.equal(classifyIncome([100, 100, 100], 20).surplusForBuffer, 0);
});
test('forecast: tier zero reserves paid and unpaid bills, exact intramonth blend', () => {
  const a = forecastSpending({ currVarSpent: 100, paidFixedBills: 50, unpaidFixedBills: 150, elapsedDays: 10, daysInMonth: 30 });
  assert.equal(a.tierIndex, 0); assert.equal(a.intramonthProj, 500); assert.equal(a.blendedEomForecast, 500);
});
test('forecast: SES exact smoothing and weighted blend', () => {
  const a = forecastSpending({ hist: [100, 200], elapsedDays: 15, daysInMonth: 30, currVarSpent: 100 });
  assert.equal(a.histForecast, 140); assert.equal(a.blendedEomForecast, 170); assert.equal(a.tierIndex, 1);
});
test('forecast: damped Holt recurrence has the expected independent result', () => {
  const a = forecastSpending({ hist: [100, 200, 300], elapsedDays: 1 });
  // level1=191, trend1=86.2; level2=278.562, trend2=76.1284.
  approximate(a.histForecast, 343.27114); assert.equal(a.tierIndex, 2);
});
test('forecast: additive seasonality repeats the twelve-month seasonal pattern', () => {
  const xs = Array.from({ length: 24 }, (_, i) => 100000 + (i % 12) * 10000);
  const a = forecastSpending({ hist: xs }); assert.equal(a.tierIndex, 3); approximate(a.histForecast, 100000);
  assert.equal(forecastSpending({ hist: Array(24).fill(100000), elapsedDays: 30, daysInMonth: 30, currVarSpent: 90000 }).blendedEomForecast, 90000);
});
test('anomalies: zero MAD and zero IQR still detect large purchases', () => {
  const a = detectAnomalies([50000, 50000, 50000, 50000, 500000].map((amount) => tx({ amount })), 1000000, date);
  assert.equal(a.length, 1); assert.equal(a[0].severity, 'CRITICAL'); assert.equal(a[0].multiple, 10);
});
test('anomalies: MAD zero/IQR nonzero and MAD positive', () => {
  assert.ok(detectAnomalies([50000, 50000, 50000, 80000, 500000].map((amount) => tx({ amount })), 1000000, date).some((a) => a.amount === 500000));
  assert.ok(detectAnomalies([40000, 50000, 60000, 70000, 900000].map((amount) => tx({ amount })), 1000000, date).some((a) => a.severity === 'CRITICAL'));
});
test('anomalies: materiality gate, sample size and 90-day window', () => {
  assert.equal(detectAnomalies([10000, 10000, 10000, 10000, 80000].map((amount) => tx({ amount })), 0, date).length, 0);
  assert.equal(detectAnomalies([50000, 50000, 50000, 900000].map((amount) => tx({ amount })), 0, date).length, 0);
  assert.equal(detectAnomalies([50000, 50000, 50000, 50000, 900000].map((amount) => tx({ amount, date: '2026-01-01' })), 0, date).length, 0);
});
test('PSI: denominator counts zero-spend calendar days, excluding fixed bills', () => {
  const rows = [tx({ date: '2026-11-01', amount: 50000 }), ...[5, 6, 7, 8, 9].map((d) => tx({ date: `2026-11-0${d}`, amount: 200000 })), tx({ date: '2026-11-01', amount: 4000000, isFixedBill: true })];
  const a = paydaySpike(rows, 5, new Date(2026, 10, 10));
  assert.equal(a.windowDays, 5); assert.equal(a.otherDays, 5); assert.equal(a.psi, 20); assert.equal(a.warning, true);
});
test('PSI: zero baseline is explicit and safe to render', () => {
  assert.equal(paydaySpike([], 5, date).psi, null);
  assert.equal(paydaySpike([tx({ date: '2026-11-05' })], 5, date).psi, Infinity);
});
test('lifestyle: adjacent windows, threshold drift, missing income', () => {
  const rows = [.1, .1, .1, .2, .2, .2].map((x) => ({ income: 10000000, wants: x * 10000000 }));
  const a = lifestyleCreep(rows); assert.equal(a.warning, true); approximate(a.driftPP, 10);
  assert.equal(lifestyleCreep(rows.slice(0, 3)).available, false);
  assert.equal(lifestyleCreep([...rows.slice(0, 3), { income: 0, wants: 2 }]).available, false);
});
test('FHI: exact weighted score and high-interest penalty', () => {
  const a = financialHealth({ yBase: 10000000, actualIncome: 10000000, totalNeedsWantsSpent: 8000000, avgMonthlyNeeds: 5000000, totalActiveFixedBills: 5000000, currWantsSpent: 3000000, profile: { ...DEFAULT_PROFILE, liquidSavings: 22500000 } });
  assert.equal(a.fhi, 95); assert.equal(a.label, 'Vững tài chính'); assert.equal(a.level, 5);
  const b = financialHealth({ yBase: 10000000, actualIncome: 10000000, avgMonthlyNeeds: 5000000, profile: { ...DEFAULT_PROFILE, liquidSavings: 5000000 }, debts: [{ principal: 5000000, apr: 24, minMonthlyPayment: 1000000 }] });
  assert.equal(b.level, 3); assert.equal(b.scores.sDebt, 60);
});
test('FHI: five level priorities and 6-month irregular runway', () => {
  const base = { yBase: 100, actualIncome: 100, totalNeedsWantsSpent: 50, avgMonthlyNeeds: 10, profile: { ...DEFAULT_PROFILE, liquidSavings: 20 } };
  assert.equal(financialHealth({ ...base, totalNeedsWantsSpent: 200 }).level, 1);
  assert.equal(financialHealth({ ...base, profile: { ...DEFAULT_PROFILE, liquidSavings: 0 } }).level, 2);
  assert.equal(financialHealth({ ...base, debts: [{ principal: 100, apr: 24, minMonthlyPayment: 10 }] }).level, 3);
  assert.equal(financialHealth(base).level, 4);
  assert.equal(financialHealth({ ...base, profile: { ...DEFAULT_PROFILE, liquidSavings: 100 } }).level, 5);
  assert.equal(financialHealth({ ...base, incomeMode: 'IRREGULAR' }).targetRunway, 6);
});
test('FHI: high fixed costs keep allocation sum 100%, wants >= 10%, saving >= 5%', () => {
  const a = financialHealth({ yBase: 100, totalActiveFixedBills: 90 });
  assert.equal(a.alloc.needs, .75); approximate(a.alloc.needs + a.alloc.wants + a.alloc.save, 1); assert.ok(a.alloc.wants >= .10); assert.ok(a.alloc.save >= .05);
});
test('safe spending: month end, exhausted budget, burn thresholds', () => {
  const a = safeToSpend({ yBase: 10000000, alloc: { save: .3 }, totalActiveFixedBills: 4000000, currentMonthVariableSpent: 2000000, elapsedDays: 30, daysInMonth: 30 });
  assert.equal(a.daysLeft, 1); assert.equal(a.dailySafeToSpend, 1000000); assert.equal(a.savingsTargetDaily, 100000);
  assert.equal(safeToSpend({ currentMonthVariableSpent: 1000 }).dailySafeToSpend, 0);
  assert.equal(safeToSpend({ currentMonthVariableSpent: 1000 }).status, 'danger');
  const burn = (r) => safeToSpend({ yBase: 10000, alloc: { save: 0 }, currentMonthVariableSpent: 5000 * r, elapsedDays: 15 }).status;
  assert.equal(burn(1), 'safe'); assert.equal(burn(1.01), 'notice'); assert.equal(burn(1.16), 'warning'); assert.equal(burn(1.31), 'danger');
});
test('cutbacks: bounded to 35%, multiple of 50k, no overshoot or sub-50k cut', () => {
  const a = cutbackPlan({ yBase: 10000000, blendedEomForecast: 9000000, savingsTargetMonthly: 3000000, categoryAverages: [{ category: 'A', amount: 1100000 }, { category: 'B', amount: 750000 }, { category: 'C', amount: 10000 }] });
  assert.equal(a.savingsGap, 2000000);
  for (const c of a.actions) { assert.equal(c.suggestedCut % 50000, 0); assert.ok(c.suggestedCut <= Math.round(c.currentAvg * .35)); assert.ok(c.suggestedCut >= 50000); }
  assert.equal(a.actions.reduce((x, c) => x + c.suggestedCut, 0) + a.unmetGap, a.savingsGap);
  assert.equal(cutbackPlan({ yBase: 1, blendedEomForecast: 2, savingsTargetMonthly: 1, categoryAverages: [{ category: 'A', amount: 1000000 }] }).actions.length, 0);
});
test('debt payoff: avalanche ordering and early payments reduce interest', () => {
  const a = simulateDebtPayoff([{ principal: 10000000, apr: 12, minMonthlyPayment: 500000 }, { principal: 10000000, apr: 24, minMonthlyPayment: 500000 }], 1000000);
  assert.equal(a.orderedDebts[0].apr, 24); assert.ok(a.accelerated.months < a.baseline.months); assert.ok(a.interestSaved > 0);
  assert.equal(simulateDebtPayoff([{ principal: 10000000, apr: 24, minMonthlyPayment: 10000 }]).baseline.paidOff, false);
});
test('orchestration: partial fixed payment is reserved once, same-category bills match once', () => {
  const data = empty();
  data.recurring_bills = [1, 2].map((i) => ({ id: `bill${i}`, name: `Bill ${i}`, amount: 1000000, dueDay: 1, group: 'needs', category: 'Tiền nhà / Trả góp nhà', active: true }));
  data.transactions = [tx({ amount: 500000, group: 'needs', category: 'Tiền nhà / Trả góp nhà', isFixedBill: true })];
  const a = analyzeFinance(data, date); assert.equal(a.unpaidFixedBills, 1500000); assert.equal(a.totalActiveFixedBills, 2000000); assert.equal(a.forecast.intramonthProj, 2000000); assert.equal(a.bills.filter((b) => b.paid).length, 0);
});
test('orchestration: missing calendar months count as zero, future records excluded', () => {
  const data = empty(); data.transactions = [tx({ date: '2026-08-01', type: 'income', group: 'income', amount: 10000000 }), tx({ date: '2026-10-01', type: 'income', group: 'income', amount: 10000000 }), tx({ date: '2026-12-01', amount: 100000000 })];
  const a = analyzeFinance(data, date); assert.equal(a.history.length, 3); assert.equal(a.history[1].income, 0); assert.equal(a.current.spent, 0); assert.equal(a.anomalies.length, 0);
});
test('empty application: all finance values finite and no NaN in rendered views', () => {
  const data = empty(), a = analyzeFinance(data, date);
  const walk = (x) => { for (const v of Object.values(x)) { if (typeof v === 'number') assert.ok(Number.isFinite(v)); else if (v && typeof v === 'object') walk(v); } }; walk(a);
  const views = [renderOverview(data, a, false), renderAnalysis(data, a), renderPlanning(data, a, 100000), renderSettings(data, a, { mode: 'memory' }), renderTransactions(data, a, { month: '', group: '', category: '', search: '' }, 1)];
  for (const html of views) assert.doesNotMatch(html, /NaN|undefined|Infinity/);
});
test('sample data: all required diagnostic signals and level 3 for each part of a month', () => {
  for (const day of [1, 5, 15, 21, 30]) {
    const d = new Date(2026, 10, day), data = createSeedData(d), a = analyzeFinance(data, d);
    assert.equal(a.history.length, 6); assert.equal(a.health.level, 3); assert.ok(a.anomalies.length >= 2); assert.ok(a.payday.warning); assert.ok(a.lifestyle.warning); assert.ok(a.cutbacks.actions.length > 0);
    assert.ok(data.transactions.every((t) => Number.isSafeInteger(t.amount)));
  }
});
test('backup: round-trip all stores, reject corrupted schema before any writes', () => {
  const data = createSeedData(date), clean = validateBackup(JSON.parse(createBackup(data, 100000)));
  assert.deepEqual(clean, data);
  assert.throws(() => validateBackup({ version: 1, data }), /định dạng/);
  assert.throws(() => validateRecord('transactions', tx({ amount: 1.5 })), /số nguyên/);
  assert.throws(() => validateRecord('transactions', tx({ date: '2026-02-30' })), /Ngày/);
  assert.throws(() => validateRecord('transactions', tx({ type: 'income' })), /khớp/);
  assert.throws(() => validateBackup({ app: 'vung-tai-chinh', version: 1, data: { ...empty(), transactions: [tx({ id: 'duplicate' }), tx({ id: 'duplicate' })] } }), /trùng/);
});
test('CSV: UTF-8 BOM, Vietnamese, multiline escaping and formula neutralization', () => {
  const csv = createCSV([tx({ note: '=1+1\n"Chào bạn"' })]);
  assert.equal(csv.charCodeAt(0), 0xfeff); assert.ok(csv.includes('Ăn ngoài & Cafe')); assert.ok(csv.includes("'=1+1")); assert.ok(csv.includes('""Chào bạn""'));
});
test('XSS: every user note is escaped in financial pages', () => {
  const payload = '<img src=x onerror=alert(1)>', data = empty(); data.transactions = [tx({ note: payload, category: payload })];
  const a = analyzeFinance(data, date), html = renderOverview(data, a, true) + renderTransactions(data, a, { month: '', group: '', category: '', search: '' }, 1);
  assert.ok(html.includes(escapeHtml(payload))); assert.ok(!html.includes(payload));
});
test('ledger: all four filters combine and keep income/expense distinct', () => {
  const data = empty(); data.transactions = [tx({ note: 'Cà phê sáng' }), tx({ note: 'Buổi tối', date: '2026-10-01' }), tx({ group: 'needs' })];
  assert.equal(filteredTransactions(data, { month: '2026-11', group: 'wants', category: 'Ăn ngoài & Cafe', search: 'CÀ PHÊ' }).length, 1);
});
test('storage: private-mode memory fallback supports all stores and backup restore', async () => {
  const status = await initDB(); assert.equal(status.mode, 'memory');
  const sample = createSeedData(date); await replaceData(sample); assert.deepEqual(await readData(), sample);
});
test('storage: invalid restore leaves existing data untouched', async () => {
  const before = await readData();
  await assert.rejects(replaceData({ ...before, transactions: [tx({ amount: -1 })] }));
  assert.deepEqual(await readData(), before);
});
test('storage: CRUD and persistent profile settings share the same validated contract', async () => {
  const record = tx(); await putRecord('transactions', record);
  assert.ok((await readData()).transactions.some((t) => t.id === record.id));
  await putRecord('transactions', { ...record, amount: 99000 });
  assert.equal((await readData()).transactions.find((t) => t.id === record.id).amount, 99000);
  await deleteRecord('transactions', record.id); assert.ok(!(await readData()).transactions.some((t) => t.id === record.id));
  await putRecord('profile', { ...DEFAULT_PROFILE, theme: 'dark', liquidSavings: 100000 });
  assert.equal((await readData()).profile.theme, 'dark');
});

```

### File: tests/excel-import.test.js

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { arithmeticFormula, parseMoney, excelDate, detectColumns, detectHeader, workbookSheets, buildImport, detectOpeningBalance } from '../js/excel-import.js';
import { initDB, replaceData, readData, appendTransactions, markExistingTransactions, validateBackup } from '../js/db.js';
import { DEFAULT_PROFILE, cashBalanceForMonth } from '../js/finance-engine.js';
import { renderTransactions, renderSettings } from '../js/ui.js';
import { analyzeFinance } from '../js/finance-engine.js';

const context = {}; vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../vendor/xlsx.full.min.js', import.meta.url), 'utf8'), context, { timeout: 3000 });
const X = context.XLSX;
const sample = () => {
  const wb = X.utils.book_new();
  X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([['Một trang ghi chú khác']]), 'Ghi chú');
  const sheet = X.utils.aoa_to_sheet([['Tháng 11'], ['Ngày', 'Danh mục', 'VNĐ', 'Tổng chi/ngày', 'Note', 'Danh mục'], ['2026-11-01', 'Khoản thu mẫu', 900000, -99999, '', 'Thu nhập khác'], ['2026-11-02', 'Giao dịch A', -47000, -999999, '', 'Sinh hoạt'], ['', 'Giao dịch B', -18000, '', 'Ghi chú thêm', 'Di chuyển'], ['2026-11-03', 'Khoản cọc thử', -200000, '', 'Có hoàn trả', 'Học tập']]);
  sheet['!merges'] = [{ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }];
  sheet.C5 = { t: 'n', f: '-10000-8000', v: -18000 };
  sheet.H4 = { t: 's', v: 'Số dư riêng' }; sheet.I4 = { t: 'n', v: 999999999 }; sheet['!ref'] = 'A1:I6';
  X.utils.book_append_sheet(wb, sheet, 'Thu chi');
  const bytes = X.write(wb, { type: 'array', bookType: 'xlsx' });
  return workbookSheets(X.read(bytes, { type: 'array', cellDates: false }), X).find((s) => s.name === 'Thu chi');
};
const empty = () => ({ transactions: [], debts: [], recurring_bills: [], profile: { ...DEFAULT_PROFILE } });

test('arithmetic grammar respects precedence, unary signs and parentheses', () => {
  assert.equal(arithmeticFormula('=-10000-60000/2'), -40000);
  assert.equal(arithmeticFormula('=-(10000+20000)/2'), -15000);
  assert.equal(arithmeticFormula('=1.5e3*2'), 3000);
});
test('arithmetic grammar rejects code, references, excessive depth and division by zero', () => {
  for (const text of ['=alert(1)', '=A1+A2', '=SUM(A1:A4)', '=1/0', '=1**3', '=()']) assert.throws(() => arithmeticFormula(text));
  assert.throws(() => arithmeticFormula('='.concat('('.repeat(40), '1', ')'.repeat(40))));
});
test('money parser handles Vietnamese and international formats, integer VND and units', () => {
  assert.equal(parseMoney('-1.234.567 ₫').amount, -1234567);
  assert.equal(parseMoney('1,234,567 VND').amount, 1234567);
  assert.equal(parseMoney('(25.000)').amount, -25000);
  assert.equal(parseMoney('1,5', 1000).amount, 1500);
  assert.equal(parseMoney('1.234,50').amount, 1235);
  assert.equal(parseMoney(123.4).amount, 123);
  assert.throws(() => parseMoney('20k'));
});
test('simple formulas recalculate safely; other formulas require a numeric cached result', () => {
  assert.equal(parseMoney({ f: '-10000-8000', v: -1 }).amount, -18000);
  assert.equal(parseMoney({ f: 'SUM(A1:A2)', v: -18000 }).cachedFormula, true);
  assert.throws(() => parseMoney({ f: 'SUM(A1:A2)', v: '' }), /chưa có kết quả/);
});
test('dates support Excel 1900/1904, Vietnamese day-first strings and day-only values', () => {
  assert.equal(excelDate('21/11/26', '2026-11'), '2026-11-21');
  assert.equal(excelDate('2026-11-21T12:00:00', ''), '2026-11-21');
  assert.equal(excelDate('21/11', '2026-11'), '2026-11-21');
  assert.equal(excelDate(21, '2026-11'), '2026-11-21');
  assert.equal(excelDate(61, '', false), '1900-03-01');
  assert.equal(excelDate(0, '', true), '1904-01-01');
  assert.equal(excelDate(60, '', false), null);
  assert.equal(excelDate('31/11/2026', ''), null);
  assert.equal(excelDate('21/11', ''), null);
});
test('duplicate category headers distinguish transaction text from final category column', () => {
  const m = detectColumns(['Ngày', 'Danh mục', 'VNĐ', 'Tổng chi/ngày', 'Note', 'Danh mục']);
  assert.equal(m.date, 0); assert.equal(m.amount, 2); assert.equal(m.note, 1); assert.equal(m.extra, 4); assert.equal(m.category, 5);
  assert.equal(detectHeader([['Tên sổ'], ['Ngày', 'Số tiền', 'Ghi chú']]).index, 1);
});
test('XLSX bytes round-trip: merged dates, transaction formulas, side balances and subtotals', () => {
  const sheet = sample(), result = buildImport(sheet, { month: '2026-11' });
  assert.equal(sheet.header.index, 1); assert.equal(result.rows.length, 4); assert.equal(result.errors.length, 0);
  assert.equal(result.rows[2].transaction.date, '2026-11-02'); assert.equal(result.rows[2].transaction.amount, 18000);
  assert.equal(result.rows[2].transaction.note, 'Giao dịch B · Ghi chú thêm');
  assert.equal(result.rows.filter((r) => r.transaction.type === 'expense').reduce((s, r) => s + r.transaction.amount, 0), 265000);
  assert.equal(result.rows[0].transaction.type, 'income');
  assert.ok(result.rows[3].warnings.some((w) => w.includes('tiền cọc')));
});
test('single positive expense sheet is explicitly interpreted through selected mode', () => {
  const sheet = sample(); sheet.rows[3][2] = { v: 47000 };
  assert.equal(buildImport(sheet, { mode: 'expense' }).rows[1].transaction.type, 'expense');
  assert.equal(buildImport(sheet, { mode: 'signed' }).rows[1].transaction.type, 'income');
});
test('invalid rows remain visible, totals skipped, missing categories retained for review', () => {
  const sheet = sample();
  sheet.rows.push([{ v: '2026-11-04' }, { v: 'Tổng cộng' }, { v: -265000 }]);
  sheet.rows.push([{ v: '2026-11-31' }, { v: 'Ngày sai' }, { v: -10000 }]);
  sheet.rows.push([{ v: '2026-11-05' }, { v: 'Không có nhóm' }, { v: -10000 }]);
  const result = buildImport(sheet);
  assert.equal(result.skipped, 1); assert.equal(result.errors.length, 1); assert.equal(result.rows.length, 5);
  assert.equal(result.rows.at(-1).transaction.category, 'Chưa phân loại');
  assert.ok(result.rows.at(-1).warnings.length > 0);
});
test('blank date is not guessed unless explicitly allowed; real merged cells always work', () => {
  const sheet = sample(); sheet.rows.push([null, { v: 'Ngày bỏ trống' }, { v: -10000 }]);
  assert.equal(buildImport(sheet).errors.length, 1);
  assert.equal(buildImport(sheet, { fillDates: true }).errors.length, 0);
});
test('user can change expense groups while preserving the source category', () => {
  const result = buildImport(sample(), { categoryGroups: { 'Sinh hoạt': 'wants' } });
  assert.equal(result.rows[1].transaction.group, 'wants'); assert.equal(result.rows[1].transaction.category, 'Sinh hoạt');
});
test('CSV keeps Vietnamese day/month order instead of auto-converting to US dates', () => {
  const wb = X.read('\uFEFFNgày;Số tiền;Ghi chú\n12/11/2026;-35.000;Đi chợ', { type: 'string', raw: true });
  const sheet = workbookSheets(wb, X)[0], result = buildImport(sheet);
  assert.equal(result.rows.length, 1); assert.equal(result.rows[0].transaction.date, '2026-11-12'); assert.equal(result.rows[0].transaction.amount, 35000);
});
test('duplicate multiset does not erase repeated legitimate purchases', () => {
  const transaction = buildImport(sample()).rows[1].transaction;
  assert.deepEqual(markExistingTransactions([transaction, { ...transaction, id: 'second' }], [transaction]), [true, false]);
  assert.deepEqual(markExistingTransactions([transaction, transaction], []), [false, false]);
});
test('append is atomic, preserves other stores and skips repeated imports', async () => {
  await initDB(); await replaceData(empty());
  const transactions = buildImport(sample()).rows.map((r) => r.transaction);
  assert.equal((await appendTransactions(transactions)).imported, 4);
  const second = transactions.map((t) => ({ ...t, id: crypto.randomUUID() }));
  assert.deepEqual(await appendTransactions(second), { imported: 0, skipped: 4, updated: 0 });
  const before = await readData();
  await assert.rejects(appendTransactions([{ ...transactions[0], id: 'valid-next' }, { ...transactions[1], id: 'invalid-next', amount: -1 }]));
  assert.deepEqual(await readData(), before);
  assert.equal((await appendTransactions(second, { skipDuplicates: false })).imported, 4);
  assert.deepEqual((await readData()).profile, DEFAULT_PROFILE);
});
test('daily ledger displays separate income, expense and net totals, including all day records', () => {
  const data = empty(); data.transactions = buildImport(sample()).rows.map((r) => r.transaction);
  const a = analyzeFinance(data, new Date(2026, 10, 21));
  const html = renderTransactions(data, a, { month: '2026-11', group: '', category: '', search: '' }, 1, 'daily');
  assert.ok(html.includes('daily-ledger')); assert.ok(html.includes('65.000')); assert.ok(html.includes('Thu trừ chi'));
  assert.ok(html.includes('Nhập Excel'));
  assert.ok(renderSettings(data, a, { mode: 'indexeddb' }).includes('Chọn tệp Excel'));
});
test('opening balances are detected separately from transactions and savings', () => {
  const sheet = sample();
  sheet.rows[2][7] = { v: 'TK NH:' }; sheet.rows[2][8] = { f: '100000+200000', v: 300000 };
  sheet.rows[3][7] = { v: 'Tiền mặt:' }; sheet.rows[3][8] = { v: 100000 };
  sheet.rows[4][7] = { v: 'Tiết kiệm:' }; sheet.rows[4][8] = { v: 5000000 };
  assert.deepEqual(detectOpeningBalance(sheet), { bank: 300000, cash: 100000 });
  assert.equal(buildImport(sheet).rows.length, 4);
});
test('cash balance separates opening money, new income, expenses and emergency reserves', () => {
  const data = empty(); data.transactions = buildImport(sample()).rows.map((r) => r.transaction);
  data.profile = { ...DEFAULT_PROFILE, liquidSavings: 5000000, openingBalances: { '2026-11': { bank: 300000, cash: 100000 } } };
  const balance = cashBalanceForMonth(data, '2026-11', '2026-11-21');
  assert.equal(balance.opening, 400000); assert.equal(balance.income, 900000); assert.equal(balance.expense, 265000); assert.equal(balance.available, 1035000);
  assert.equal(cashBalanceForMonth(data, '2026-12').available, null);
});
test('future transactions do not alter current cash balance', () => {
  const data = empty(); data.profile.openingBalances = { '2026-11': { bank: 100000, cash: 0 } };
  data.transactions = buildImport(sample()).rows.map((r) => ({ ...r.transaction, date: '2026-11-30' }));
  assert.equal(cashBalanceForMonth(data, '2026-11', '2026-11-21').available, 100000);
});
test('Excel import can atomically update opening money without replacing other profile fields', async () => {
  const data = empty(); data.profile.liquidSavings = 700000; data.profile.theme = 'dark';
  await replaceData(data);
  const transactions = buildImport(sample()).rows.map((r) => r.transaction);
  await appendTransactions(transactions, { openingBalance: { month: '2026-11', bank: 300000, cash: 100000 } });
  const after = await readData();
  assert.equal(after.transactions.length, 4); assert.equal(after.profile.liquidSavings, 700000); assert.equal(after.profile.theme, 'dark');
  assert.deepEqual(after.profile.openingBalances['2026-11'], { bank: 300000, cash: 100000 });
  await appendTransactions([], { openingBalance: { month: '2026-11', bank: 350000, cash: 120000 } });
  assert.equal((await readData()).transactions.length, 4);
  assert.equal((await readData()).profile.openingBalances['2026-11'].bank, 350000);
});
test('invalid opening balance rejects the entire import before any record is written', async () => {
  const before = await readData(), record = buildImport(sample()).rows[0].transaction;
  await assert.rejects(appendTransactions([{ ...record, id: 'should-not-import' }], { openingBalance: { month: '2026-13', bank: 100000, cash: 0 } }));
  assert.deepEqual(await readData(), before);
});
test('older backups without opening balances remain compatible', () => {
  const data = empty(); delete data.profile.openingBalances; data.profile.liquidSavings = 250000;
  const normalized = validateBackup({ app: 'vung-tai-chinh', version: 1, data });
  assert.deepEqual(normalized.profile.openingBalances, {}); assert.equal(normalized.profile.liquidSavings, 250000);
});

```

### File: tests/money-flow.test.js

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PROFILE, analyzeFinance, cashBalanceForMonth } from '../js/finance-engine.js';
import { kindOf, suggestFlow, monthlyMoney, depositBalances, categoryHabits, dateForMonth, monthAfterDayChange } from '../js/money-flow.js';
import { initDB, replaceData, readData, saveTransaction, appendTransactions, planImport, validateBackup } from '../js/db.js';
import { renderOverview, renderAnalysis, filteredTransactions } from '../js/ui.js';
import { buildImport, detectSideBalances } from '../js/excel-import.js';

let n = 0;
const row = (overrides = {}) => ({ id: `flow-${++n}`, date: '2026-11-12', type: 'expense', amount: 100000, group: 'needs', category: 'Sinh hoạt', isFixedBill: false, note: 'Ghi chép tổng hợp', createdAt: n, ...overrides });
const data = (transactions = [], rest = {}) => ({ transactions, recurring_bills: [], debts: [], profile: { ...DEFAULT_PROFILE, openingBalances: { '2026-11': { bank: 1000000, cash: 0 } } }, ...rest });
const date = new Date(2026, 10, 25);
const debt = { id: 'loan', name: 'Khoản vay tổng hợp', principal: 900000, apr: 12, minMonthlyPayment: 150000, isHighInterest: true };

test('cash movements reconcile while deposits and refunds stay out of income/spending plans', () => {
  const deposit = row({ amount: 500000, flow: { kind: 'deposit' } });
  const records = [deposit, row({ type: 'income', group: 'income', amount: 300000 }), row({ type: 'income', group: 'income', amount: 400000, flow: { kind: 'refund', targetId: deposit.id } }), row(), row({ group: 'savings_debt', flow: { kind: 'reserve-in' } }), row({ amount: 50000, group: 'savings_debt', flow: { kind: 'debt', targetId: debt.id, principal: 40000 } })];
  const d = data(records), a = analyzeFinance(d, date), m = monthlyMoney(d, a);
  assert.equal(cashBalanceForMonth(d, a.month, a.today).available, 950000);
  assert.equal(m.available, 950000); assert.equal(m.received, 700000); assert.equal(m.paid, 750000);
  assert.equal(a.current.income, 300000); assert.equal(a.current.spent, 100000);
  assert.equal(m.everyday, 100000); assert.equal(m.refunds, 400000); assert.equal(m.deposits[0].remaining, 100000);
  assert.equal(m.moved, 150000);
});
test('daily cash suggestion reserves the unpaid part of bills and debt payments once', () => {
  const b = { id: 'rent', name: 'Hóa đơn tổng hợp', amount: 200000, dueDay: 28, group: 'needs', category: 'Sinh hoạt', active: true };
  const d = data([row({ amount: 50000, isFixedBill: true, flow: { kind: 'regular', billId: b.id } }), row({ amount: 50000, group: 'savings_debt', flow: { kind: 'debt', targetId: debt.id, principal: 40000 } })], { recurring_bills: [b], debts: [debt] });
  const a = analyzeFinance(d, date), m = monthlyMoney(d, a);
  assert.equal(m.reserved, 250000); assert.equal(m.available, 900000);
  assert.equal(m.daily, Math.floor(650000 / 6));
  const without = data([], { profile: { ...DEFAULT_PROFILE } });
  assert.equal(monthlyMoney(without, analyzeFinance(without, date)).daily, null);
});
test('named bill links cannot pay another bill with the same category', () => {
  const bills = ['a', 'b'].map((id) => ({ id, name: id, category: 'Sinh hoạt', group: 'needs', active: true, amount: 100000, dueDay: 5 }));
  const a = analyzeFinance(data([row({ isFixedBill: true, flow: { kind: 'regular', billId: 'b' } })], { recurring_bills: bills }), date);
  assert.equal(a.bills[0].remaining, 100000); assert.equal(a.bills[1].paid, true);
  const mixed = analyzeFinance(data([row({ isFixedBill: true }), row({ isFixedBill: true, flow: { kind: 'regular', billId: 'a' } })], { recurring_bills: bills }), date);
  assert.equal(mixed.unpaidFixedBills, 0, 'named payments are consumed before generic category payments');
});
test('using an existing Excel expense as a bill payment changes no cash amount or record count', async () => {
  await initDB();
  const expense = row({ amount: 170000 });
  const bill = { id: 'existing-bill', name: 'Hóa đơn tổng hợp', category: 'Tiền mạng', group: 'needs', active: true, dueDay: 12, amount: 170000 };
  await replaceData(data([expense], { recurring_bills: [bill] }));
  const before = cashBalanceForMonth(await readData(), '2026-11', '2026-11-25');
  await saveTransaction({ ...expense, isFixedBill: true, flow: { kind: 'regular', billId: bill.id } }, '', '2026-11-25');
  const saved = await readData();
  assert.equal(saved.transactions.length, 1); assert.deepEqual(cashBalanceForMonth(saved, '2026-11', '2026-11-25'), before);
  assert.equal(analyzeFinance(saved, date).bills[0].paid, true);
  assert.deepEqual(filteredTransactions(saved, { month: '2026-11', billId: bill.id }).map((t) => t.id), [expense.id]);
});
test('fund entry edits and deletion reverse only the prior effect', async () => {
  await initDB(); await replaceData(data());
  const t = row({ group: 'savings_debt', amount: 200000, flow: { kind: 'reserve-in' } });
  await saveTransaction(t, '', '2026-11-25');
  assert.equal((await readData()).profile.liquidSavings, 200000);
  await saveTransaction({ ...t, amount: 350000 }, '', '2026-11-25');
  assert.equal((await readData()).profile.liquidSavings, 350000); assert.equal((await readData()).transactions.length, 1);
  await saveTransaction(null, t.id, '2026-11-25');
  assert.equal((await readData()).profile.liquidSavings, 0); assert.equal((await readData()).transactions.length, 0);
});
test('invalid fund withdrawal and deleting a spent deposit leave all data unchanged', async () => {
  await initDB(); await replaceData(data());
  const inFund = row({ group: 'savings_debt', flow: { kind: 'reserve-in' } });
  await saveTransaction(inFund, '', '2026-11-25');
  await saveTransaction(row({ type: 'income', group: 'income', flow: { kind: 'reserve-out' } }), '', '2026-11-25');
  const before = await readData();
  await assert.rejects(saveTransaction(row({ type: 'income', group: 'income', flow: { kind: 'reserve-out' } }), '', '2026-11-25'), /Quỹ không đủ/);
  await assert.rejects(saveTransaction(null, inFund.id, '2026-11-25'), /Quỹ không đủ/);
  assert.deepEqual(await readData(), before);
});
test('debt payment records the full cash amount but reduces principal only by the explicit part', async () => {
  await initDB(); await replaceData(data([], { debts: [debt] }));
  const t = row({ group: 'savings_debt', amount: 150000, flow: { kind: 'debt', targetId: debt.id, principal: 120000 } });
  await saveTransaction(t, '', '2026-11-25');
  let d = await readData(); assert.equal(d.debts[0].principal, 780000); assert.equal(d.transactions[0].amount, 150000);
  await saveTransaction({ ...t, flow: { ...t.flow, principal: 130000 } }, '', '2026-11-25');
  assert.equal((await readData()).debts[0].principal, 770000);
  const before = await readData();
  await assert.rejects(saveTransaction({ ...t, flow: { ...t.flow, principal: 160000 } }, '', '2026-11-25'), /Phần trả gốc/);
  await assert.rejects(saveTransaction({ ...t, amount: 1000000, flow: { ...t.flow, principal: 1000000 } }, '', '2026-11-25'), /lớn hơn số nợ/);
  assert.deepEqual(await readData(), before);
  await saveTransaction(null, t.id, '2026-11-25'); assert.equal((await readData()).debts[0].principal, debt.principal);
});
test('future or missing linked debt/fund effects reject without a partial ledger entry', async () => {
  await initDB(); await replaceData(data());
  const before = await readData();
  await assert.rejects(saveTransaction(row({ date: '2026-12-01', group: 'savings_debt', flow: { kind: 'reserve-in' } }), '', '2026-11-25'), /tương lai/);
  await assert.rejects(saveTransaction(row({ group: 'savings_debt', flow: { kind: 'debt', targetId: 'missing', principal: 50000 } }), '', '2026-11-25'), /không còn tồn tại/);
  assert.deepEqual(await readData(), before);
});
test('partial refunds across months link correctly and cannot exceed or orphan their deposit', async () => {
  const deposit = row({ date: '2026-10-10', amount: 400000, flow: { kind: 'deposit' } });
  await initDB(); await replaceData(data([deposit]));
  const refund = row({ type: 'income', group: 'income', amount: 150000, flow: { kind: 'refund', targetId: deposit.id } });
  await saveTransaction(refund, '', '2026-11-25');
  assert.equal(depositBalances((await readData()).transactions)[0].remaining, 250000);
  const before = await readData();
  await assert.rejects(saveTransaction({ ...refund, amount: 450000 }, '', '2026-11-25'), /vượt số tiền cọc/);
  await assert.rejects(saveTransaction(null, deposit.id, '2026-11-25'), /Gỡ liên kết/);
  await assert.rejects(saveTransaction({ ...refund, date: '2026-10-09' }, '', '2026-11-25'), /từ ngày đặt cọc/);
  assert.deepEqual(await readData(), before);
  await saveTransaction(null, refund.id, '2026-11-25'); assert.equal(depositBalances((await readData()).transactions)[0].remaining, 400000);
});
test('reimport fills missing categories and suggests cash classification without duplicate cash movements', async () => {
  const old = row({ category: 'Chưa phân loại', note: 'Cọc đồ dùng', amount: 200000 });
  const incoming = { ...old, id: 'new-id', category: 'Học tập', flow: { kind: 'deposit' } };
  await initDB(); await replaceData(data([old]));
  const receipt = await appendTransactions([incoming]);
  assert.equal(receipt.imported, 0); assert.equal(receipt.updated, 1);
  const d = await readData(); assert.equal(d.transactions.length, 1); assert.equal(d.transactions[0].id, old.id);
  assert.equal(d.transactions[0].category, 'Học tập'); assert.equal(kindOf(d.transactions[0]), 'deposit');
  assert.equal(cashBalanceForMonth(d, '2026-11', '2026-11-25').expense, 200000);
  assert.equal((await appendTransactions([incoming])).updated, 0);
  assert.equal(planImport([incoming], [old], { updateDetails: false }).updated, 0);
});
test('reimport keeps manual refund links and counts legitimately repeated purchases', () => {
  const t = row({ type: 'income', group: 'income', flow: { kind: 'refund', targetId: 'my-deposit' } });
  const imported = { ...t, id: 'other', flow: { kind: 'refund' } };
  assert.equal(planImport([imported], [t]).updated, 0);
  assert.equal(planImport([row({ ...t, id: 'a' }), row({ ...t, id: 'b' })], [t]).imported, 1);
});
test('side balances and cash classifications are proposed without manufacturing a debt or transaction', () => {
  const rows = [['Ngày', 'Nội dung', 'VNĐ', 'Danh mục'], ['2026-11-02', 'cọc sách', -200000, 'Học tập'], ['2026-11-03', 'hoàn tiền', 200000, 'Khác'], [null, null, null, null, 'Tiết kiệm:', 750000], [null, null, null, null, 'dư nợ', 550000]];
  const sheet = { rows, merges: [], header: { index: 0, mapping: { date: 0, note: 1, amount: 2, category: 3, extra: -1, fixed: -1, group: -1, type: -1 } } };
  const result = buildImport(sheet, { month: '2026-11' });
  assert.equal(result.rows.length, 2); assert.equal(kindOf(result.rows[0].transaction), 'deposit'); assert.equal(kindOf(result.rows[1].transaction), 'refund');
  assert.deepEqual(detectSideBalances(sheet), { liquidSavings: 750000, debt: 550000 });
  assert.equal(suggestFlow(row({ note: 'Mua cocacola' })), 'regular');
});
test('month selection, learned categories and insight ledger filters refer to the same records', () => {
  assert.equal(monthAfterDayChange('2026-10', '2026-11-25', '2026-11-25'), '2026-10');
  assert.equal(monthAfterDayChange('2026-10', '2026-11-30', '2026-12-01'), '2026-10');
  assert.equal(monthAfterDayChange('2026-11', '2026-11-30', '2026-12-01'), '2026-12');
  assert.equal(dateForMonth('2026-10', date).getDate(), 31);
  assert.equal(dateForMonth('2026-11', date), date);
  const rows = [row({ category: 'Ăn uống' }), row({ category: 'Di chuyển' }), row({ category: 'Ăn uống' }), row({ type: 'income', group: 'income', flow: { kind: 'refund' } })];
  assert.equal(categoryHabits(rows)[0].category, 'Ăn uống');
  assert.equal(filteredTransactions(data(rows), { month: '2026-11', category: 'Ăn uống' }).length, 2);
  assert.equal(filteredTransactions(data(rows), { month: '2026-11', kind: 'refund' }).length, 1);
  const categorized = [...rows, row({ category: 'Ăn uống', flow: { kind: 'deposit' } }), row({ date: '2026-12-01', category: 'Ăn uống' }), row({ date: '2026-10-01', category: 'Ăn uống' })];
  const subset = filteredTransactions(data(categorized), { month: '2026-11', category: 'Ăn uống', scope: 'everyday', through: '2026-11-25' });
  assert.equal(subset.length, 2);
  assert.equal(filteredTransactions(data(categorized), { month: '2026-11', category: 'Ăn uống', scope: 'everyday', through: '2026-11-25', allMonths: true }).length, 3);
});
test('old backups remain valid; linked records survive backups and render as escaped actionable content', () => {
  const deposit = row({ note: '<script>bad()</script>', category: 'a" onclick="bad()', flow: { kind: 'deposit' } });
  const d = data([deposit]), clean = validateBackup({ app: 'vung-tai-chinh', version: 1, data: d });
  assert.deepEqual(clean.transactions[0].flow, { kind: 'deposit' });
  const a = analyzeFinance(clean, date), html = renderOverview(clean, a, true) + renderAnalysis(clean, a);
  assert.ok(!html.includes('<script>bad()')); assert.ok(html.includes('&lt;script&gt;bad()'));
  assert.ok(html.includes('data-action="open-ledger"')); assert.ok(html.includes('data-action="refund-deposit"'));
  assert.ok(!html.includes('NaN')); assert.ok(!html.includes('Sức khỏe tài chính · FHI'));
});

```

### File: tests/wellbeing.test.js

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PROFILE, analyzeFinance } from '../js/finance-engine.js';
import { wellbeingPlan, monthlyMoney } from '../js/money-flow.js';
import { renderOverview, renderAnalysis } from '../js/ui.js';

const date = new Date(2026, 10, 25);
let serial = 0;
const tx = (type, amount, month = '2026-11') => ({ id: `wellbeing-${++serial}`, type, amount, group: type === 'income' ? 'income' : 'needs', date: `${month}-05`, category: type === 'income' ? 'Khoản thu' : 'Sinh hoạt', note: 'Dữ liệu tổng hợp', isFixedBill: false, createdAt: serial });
function fixture({ income = 1000000, expense = 300000, reserve = 0, debts = [], historical = [] } = {}) {
  return { transactions: [tx('income', income), tx('expense', expense), ...historical], recurring_bills: [], debts, profile: { ...DEFAULT_PROFILE, liquidSavings: reserve, openingBalances: { '2026-11': { bank: 2000000, cash: 0 } } } };
}
const loan = { id: 'wellbeing-loan', name: 'Khoản vay tổng hợp', principal: 800000, minMonthlyPayment: 100000, apr: 12, isHighInterest: true };

test('empty or income-only records cannot look like a fully healthy independent household', () => {
  for (const transactions of [[], [tx('income', 1000000)]]) {
    const d = { ...fixture(), transactions }, a = analyzeFinance(d, date), p = wellbeingPlan(d, a);
    assert.equal(p.ready, false); assert.equal(p.score, null); assert.equal(p.next.action, 'add-transaction');
    const html = renderOverview(d, a, true); assert.ok(html.includes('Sức khỏe tài chính')); assert.ok(html.includes('Chưa đủ dữ liệu để chấm điểm'));
    assert.ok(!p.milestones.find((m) => m.key === 'reserve').done);
  }
});
test('cash kept from the beginning does not erase a current income/spending gap', () => {
  const d = fixture({ income: 200000, expense: 500000, reserve: 1000000 }), a = analyzeFinance(d, date), p = wellbeingPlan(d, a);
  assert.equal(monthlyMoney(d, a).available, 1700000);
  assert.equal(p.next.gap, 300000); assert.equal(p.next.action, 'open-analysis'); assert.equal(p.next.section, 'spending-section');
  assert.equal(p.provisional, true); assert.equal(p.score, a.health.fhi);
});
test('health stages retain the engine priorities and give the correct actionable gap', () => {
  const cases = [
    [fixture({ reserve: 50000 }), 2, 'reserve-in', 250000],
    [fixture({ reserve: 500000, debts: [loan] }), 3, 'pay-debt', 800000],
    [fixture({ reserve: 500000 }), 4, 'reserve-in', 850000],
    [fixture({ reserve: 1500000 }), 5, 'reserve-in', undefined],
  ];
  for (const [d, level, action, gap] of cases) {
    const a = analyzeFinance(d, date), p = wellbeingPlan(d, a);
    assert.equal(a.health.level, level); assert.equal(p.score, a.health.fhi); assert.equal(p.next.action, action); assert.equal(p.next.gap, gap);
    if (level === 3) assert.equal(p.next.debtId, loan.id);
  }
});
test('consistent surplus needs three complete months; unentered debt stays unconfirmed', () => {
  const historical = ['2026-08', '2026-09', '2026-10'].flatMap((m) => [tx('income', 1000000, m), tx('expense', 300000, m)]);
  const d = fixture({ reserve: 1500000, historical }), p = wellbeingPlan(d, analyzeFinance(d, date));
  assert.equal(p.milestones.find((m) => m.key === 'surplus').done, true);
  assert.equal(p.milestones.find((m) => m.key === 'debt').known, false);
  assert.equal(wellbeingPlan(fixture(), analyzeFinance(fixture(), date)).milestones.find((m) => m.key === 'surplus').done, false);
  const withoutCurrent = { ...d, transactions: historical };
  assert.equal(wellbeingPlan(withoutCurrent, analyzeFinance(withoutCurrent, date)).milestones.find((m) => m.key === 'balance').done, false);
});
test('prominent health links, component explanations and milestones escape personal content', () => {
  const malicious = { ...loan, name: '<img src=x onerror=bad()>' }, d = fixture({ reserve: 500000, debts: [malicious] }), a = analyzeFinance(d, date);
  const overview = renderOverview(d, a, true), analysis = renderAnalysis(d, a);
  assert.ok(overview.indexOf('id="health-overview"') < overview.indexOf('class="money-cards"'));
  assert.ok(overview.includes('data-action="open-health"')); assert.ok(overview.includes('data-action="pay-debt"'));
  assert.ok(analysis.includes('id="health-analysis"')); assert.ok(analysis.includes('id="spending-section"')); assert.ok(analysis.includes('id="income-history-section"'));
  assert.ok(analysis.includes('Chưa đối chiếu nợ') === false); assert.ok(analysis.includes('Điểm cao cho thấy nền tảng tốt hơn'));
  assert.ok(!overview.includes('<img src=x')); assert.ok(overview.includes('&lt;img src=x'));
  assert.ok(!overview.includes('NaN')); assert.ok(!analysis.includes('NaN'));
});

```

### File: vendor/NOTICE.md

````markdown
# SheetJS Community Edition

`xlsx.full.min.js` is the unmodified standalone build of SheetJS Community Edition 0.20.3, distributed under the Apache License 2.0. The full license is included in `SHEETJS-LICENSE.txt`.

Official distribution: https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js

Official browser documentation: https://docs.sheetjs.com/docs/getting-started/installation/standalone/

The script is served with the application, including in its offline cache. Spreadsheet file contents are read in the visitor's browser and are not uploaded by the application.

````

### File: vendor/SHEETJS-LICENSE.txt

```
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "{}"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright (C) 2012-present   SheetJS LLC

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

```

# Bảng kiểm chứng — Vững Tài Chính

Ngày kiểm tra: 21/11/2026. Bộ kiểm tra tự động: `npm test`, **51/51 đạt**, không cần cài thư viện.

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

## Bổ sung nhập Excel

15 bài kiểm tra mới xác nhận đọc/ghi lại dữ liệu Excel mẫu tổng hợp, nhận dòng tiêu đề sau dòng tên tháng, hai cột trùng tên danh mục, ngày gộp, ngày theo hệ 1900/1904, phép tính tiền an toàn, nhóm tùy chọn, dòng lỗi, dữ liệu trùng và thêm giao dịch mà giữ nguyên dữ liệu cũ. Chỉ dùng dữ liệu tổng hợp trong các tệp kiểm tra công khai.

Giao diện cho xem trước, chọn trang/cột/đơn vị, bỏ chọn từng dòng, đánh dấu hóa đơn, phân nhóm danh mục và xác nhận nhập. Sổ theo ngày tách tổng thu, tổng chi và chênh lệch. Thư viện SheetJS 0.20.3 được đóng gói tại chỗ kèm giấy phép Apache 2.0.

Đã thử trên Chrome: đọc một tệp Excel mẫu thành ba giao dịch, xem trước, xác nhận nhập và giữ nguyên các khoản cũ; đọc lại cùng tệp cho kết quả không có khoản mới khi bật bỏ trùng. Đã thử tắt bỏ trùng để kiểm tra bản xem trước cập nhật lại đúng tổng.

## Tiền đầu tháng

Có sáu kiểm tra bổ sung cho số dư: nhận riêng ô ngân hàng/tiền mặt; loại quỹ dự phòng khỏi tiền đang dùng; không tính giao dịch tương lai; ghi giao dịch và số dư đầu kỳ trong cùng một lần lưu, giữ các cài đặt khác; hủy toàn bộ khi số dư không hợp lệ; chấp nhận tệp JSON cũ chưa có trường mới.

Đã thử trên Chrome nhập lại tệp mẫu khi toàn bộ giao dịch bị nhận trùng, chỉ chọn lưu số dư đầu tháng. Số giao dịch và tổng thu giữ nguyên; tiền còn lại tăng đúng số tiền đầu kỳ.


## Giao diện theo cách ghi chép hằng ngày — 25/11/2026

- Tổng quan đưa ba câu trả lời lên trước: tiền còn dùng, tiền chi ra, số tạm chia mỗi ngày. Công thức và chỉ số nâng cao được thu gọn.
- Danh mục trong phân tích mở đúng tập chi sinh hoạt tạo nên tổng đó; cọc/hoàn trong cùng danh mục không làm tổng chi tiết lệch khỏi số đã bấm. Giữ tháng đang chọn khi chuyển trang.
- Nội dung khoản là chữ chính. Danh mục và mô tả đã dùng được gợi ý từ chính dữ liệu trong trình duyệt; không đưa dữ liệu cá nhân vào mã nguồn.
- Các kiểm tra mới dùng dữ liệu tổng hợp: đối chiếu tiền thực tế với thu nhập/chi sinh hoạt, hoàn cọc một phần và qua tháng, chống hoàn vượt hoặc mất liên kết, cập nhật quỹ/nợ khi sửa và xóa, lỗi không gây lưu một phần, ngăn ghi hiệu ứng ở tương lai, liên kết đúng hóa đơn và tránh nhập trùng khi bổ sung danh mục cũ.
- Đã thử trực tiếp trên Chrome bản nội bộ: ghi cọc, nhận hoàn một phần, bấm danh mục mở đúng sổ, chuyển quỹ rồi sửa số tiền, trả nợ có phần lãi, ghi đã trả hóa đơn và mở các biểu đồ thu gọn. Chiều ngang nội dung khớp cửa sổ laptop, không có thanh cuộn ngang toàn trang.
- Nhập lại Excel có thể chỉ sửa phân loại cũ thay vì thêm tiền ra vào. Số dư đầu tháng và quỹ được lưu trong cùng giao dịch cơ sở dữ liệu với phần nhập; phải chủ động chọn đối chiếu quỹ. Ghi chú dư nợ chỉ tạo gợi ý thiết lập, không tự giả định lãi suất.

Kết quả hiện tại: **65/65 kiểm tra tự động đạt**. Bổ sung kiểm tra ưu tiên giao dịch gắn đúng hóa đơn trước khi phân bổ khoản cũ theo danh mục, và giữ tháng cũ khi đồng hồ kiểm tra sang ngày mới. Trên Chrome, đã thử dùng khoản có sẵn để hoàn tất hóa đơn mà giữ nguyên tiền ra vào, cùng nhập lại tệp mẫu chỉ cập nhật phân loại cũ.


## Sức khỏe và lộ trình tự chủ

Sức khỏe trở lại vị trí đầu Tổng quan, giữ nguyên công thức FHI. Phân tích có năm phần điểm, mốc nền tảng và hành động liên quan. Năm kiểm tra bổ sung xác nhận: không chấm điểm khi sổ trống/thiếu chi thiết yếu; số dư đầu tháng không che phần chi vượt thu nhập; thứ tự ưu tiên và số thiếu đúng ở các cấp; ba tháng có dư phải là tháng đã hoàn tất; nội dung tên nợ được hiển thị an toàn. Tổng **70/70 kiểm tra đạt**.

Đã thử trực tiếp trên Chrome: điểm hiện trên Tổng quan; nút lộ trình mở đúng phần phân tích; mốc xem các tháng tự mở phần biểu đồ đang thu gọn; các cột vừa chiều ngang laptop. Quỹ/nợ lấy số dư đang cập nhật, không khẳng định là số dư lịch sử của tháng cũ. Đã ghi rõ quỹ chỉ so với chi thiết yếu và điểm cao không đồng nghĩa đủ tiền sống lâu dài không cần thu nhập.
