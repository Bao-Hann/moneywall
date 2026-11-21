# Vững Tài Chính

Sổ quản lý chi tiêu cá nhân tiếng Việt, ưu tiên sử dụng trên laptop. Chạy trực tiếp bằng HTML, CSS và JavaScript; không cần máy chủ riêng, tài khoản hay bước biên dịch.

**Mở ứng dụng:** https://bao-hann.github.io/moneywall/

## Bắt đầu

1. Mở ứng dụng bằng Chrome, Edge hoặc Firefox trên laptop.
2. Chọn **Thêm giao dịch → Khoản thu** để ghi thu nhập. Tiếp tục ghi các khoản chi.
3. Vào **Nợ & Quỹ dự phòng** để thêm hóa đơn, khoản nợ, số dư quỹ dự phòng và ngày nhận lương.
4. Xem **Tổng quan** để biết hạn mức hôm nay, mục tiêu tiết kiệm theo ngày và chiến lược tháng này. **Phân tích** giúp nhìn lại chi sau ngày lương, chi mong muốn và các khoản bất thường.
5. Vào **Sao lưu & Cài đặt → Sao lưu dữ liệu** định kỳ, đặc biệt trước khi đổi máy hoặc dọn dữ liệu trình duyệt.

Muốn khám phá trước, chọn **Thử dữ liệu mẫu** ở trang đầu. Bộ mẫu có sáu tháng đã hoàn tất và phần tháng hiện tại. Dữ liệu mẫu được ghi rõ trong giao diện, không nạp tự động. Có thể xóa mẫu rồi bắt đầu sổ riêng.

## Nhập sổ Excel đang dùng

Mở **Sổ thu chi → Nhập Excel** hoặc **Sao lưu & Cài đặt → Chọn tệp Excel**. Ứng dụng đọc `.xlsx`, `.xls` và `.csv` ngay trên laptop, tối đa 10 MB và 10.000 dòng giao dịch mỗi lần.

1. Chọn tệp, sau đó kiểm tra trang tính và dòng tiêu đề được nhận diện. Có thể đổi cột nếu tệp của bạn khác mẫu.
2. Kiểm tra cách ghi tiền: âm là chi/dương là thu, tất cả là chi, hoặc tất cả là thu. Có thể đổi đơn vị từ nghìn/triệu đồng sang đồng.
3. Xem trước tổng thu, tổng chi và từng khoản. Ngày trong ô gộp được nhận tự động; ô ngày bỏ trống ngoài vùng gộp chỉ được lấy ngày dòng trước khi bạn bật tùy chọn đó.
4. Giữ nguyên danh mục từ Excel, chọn lại nhóm Thiết yếu/Mong muốn/Tiết kiệm nếu cần, đánh dấu hóa đơn cố định và bỏ chọn khoản không muốn nhập.
5. Bấm **Nhập ... giao dịch vào sổ**. Chỉ thêm giao dịch; không xóa sổ, thay hồ sơ, tự nhập số dư hay tạo khoản nợ.

Một bảng có hai cột cùng tên “Danh mục” được hiểu là tên khoản ở cột đầu, phân loại ở cột cuối. Cột tổng ngày và các ô số dư bên cạnh không được nhập lại thành giao dịch. Các phép cộng/trừ/nhân/chia đơn giản trong ô số tiền được tính bằng bộ phân tích giới hạn; công thức khác chỉ dùng kết quả số đã lưu trong tệp, có lưu ý ở bản xem trước. Ứng dụng không chạy mã hoặc hàm từ tệp Excel.

Các dòng lỗi phải được sửa trong tệp, hoặc bạn chủ động cho phép chỉ nhập dòng hợp lệ. Các khoản giống sổ hiện có được bỏ qua mặc định, có đối chiếu số lần xuất hiện để giữ đúng những lần mua trùng nhau thực sự. Có thể bỏ tùy chọn này nếu cần nhập cả khoản giống nhau.

Sổ thu chi có hai cách xem: **Theo từng ngày** và **Bảng tất cả khoản**. Theo từng ngày hiển thị tổng thu, tổng chi và chênh lệch riêng, cộng từ từng giao dịch để tránh lỗi vùng tính tổng trong bảng tính.

Thư viện đọc Excel được đóng gói trong `vendor/`, không cần gọi dịch vụ để xử lý tệp. Xem [thông tin giấy phép](./vendor/NOTICE.md). Không đưa sổ Excel cá nhân hoặc dữ liệu thật vào kho GitHub.

## Dữ liệu được lưu ở đâu?

Mọi giao dịch, hóa đơn, khoản nợ và cài đặt được lưu bằng IndexedDB trong trình duyệt trên máy đang dùng. Ứng dụng không có máy chủ nhận các dữ liệu này. Mỗi trình duyệt và mỗi địa chỉ web có một sổ riêng, không tự đồng bộ giữa các thiết bị.

Đóng và mở lại trang vẫn còn dữ liệu nếu trình duyệt cho phép lưu. Khi IndexedDB bị chặn, ứng dụng hiện cảnh báo dùng bộ nhớ tạm; hãy xuất JSON trước khi đóng thẻ. Quyền lưu trữ bền vững được yêu cầu tự động nhưng trình duyệt quyết định có cấp hay không.

JSON giữ đủ bốn nhóm dữ liệu để khôi phục. CSV dùng UTF-8 BOM, giữ tiếng Việt khi mở Excel và vô hiệu hóa ghi chú có thể bị bảng tính hiểu là công thức. **Không lưu dữ liệu thật hoặc tệp sao lưu cá nhân vào kho mã nguồn công khai này.**

## Năm khu vực

| Khu vực | Chức năng |
| --- | --- |
| Tổng quan | Hạn mức hôm nay, sức khỏe FHI, tiết kiệm theo ngày/tháng, dự phòng, biểu đồ dòng tiền, chiến lược và kế hoạch giảm chi |
| Sổ thu chi | Thêm/sửa/xóa, chọn nhanh mệnh giá, nhóm và danh mục, lọc tháng/nhóm/danh mục/ghi chú, phân trang |
| Phân tích | Giao dịch bất thường, hiệu ứng ngày lương PSI, tăng tỷ trọng chi mong muốn, biểu đồ danh mục và nhịp chi |
| Nợ & Quỹ dự phòng | Hóa đơn định kỳ, ghi thanh toán, thứ tự trả nợ lãi cao, mô phỏng trả thêm, quỹ và ngày lương |
| Sao lưu & Cài đặt | Xuất/nhập JSON, xuất CSV, trạng thái lưu trữ, sáng/tối, dữ liệu mẫu và xóa sổ |

Các quy tắc sáu mô-đun được viết độc lập với giao diện trong `js/finance-engine.js`. Số tiền lưu dưới dạng số nguyên VND. Lãi suất và các tỷ lệ được phép có phần thập phân.

### Một số quy ước quan trọng

- Dự báo chi sinh hoạt gồm nhóm thiết yếu và mong muốn, không cộng lại các khoản chuyển tiết kiệm/trả nợ.
- Hóa đơn định kỳ dùng để dành trước ngân sách; không tự tạo giao dịch. Nút ✓ mở giao dịch thanh toán để bạn kiểm tra rồi lưu. Thanh toán một phần chỉ dành trước số còn thiếu.
- Nhiều hóa đơn trùng danh mục được đối chiếu lần lượt; một khoản thanh toán không được dùng hai lần.
- Số dư quỹ và số dư gốc nợ được cập nhật thủ công, tách với sổ giao dịch để tránh nhầm phần gốc/lãi hoặc cộng tiền hai lần.
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
