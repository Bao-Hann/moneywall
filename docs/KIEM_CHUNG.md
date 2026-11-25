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
