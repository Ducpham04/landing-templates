# DECISIONS — Nhật ký quyết định

Các điểm chưa rõ trong yêu cầu, phương án đã chọn và lý do.

| # | Vấn đề | Quyết định | Lý do |
| --- | --- | --- | --- |
| D1 | Yêu cầu không nêu sản phẩm cụ thể ("phần đặc tả" trống) | Xây **LeadHub** — backend + trang quản trị nhận và quản lý lead từ 3 landing page đã có trong repo | Là bước tự nhiên tiếp theo của repo: biến landing tĩnh thành gói "Landing + CRM mini" bán được cho khách freelance; tận dụng stack chuẩn (Spring Boot + React) |
| D2 | Repo trống, không có nhánh `main` để mở PR | Tạo `main` từ một commit rỗng `chore: initial commit`, đặt lịch sử landing + MVP lên trên trong nhánh `feature/mvp` | PR cần nhánh base có lịch sử chung; commit rỗng giúp PR thể hiện toàn bộ công việc; nhánh cũ `claude/lucid-dijkstra-cej73r` giữ nguyên, không force-push |
| D3 | Vai trò người dùng | 2 vai trò: `ADMIN` (chủ doanh nghiệp / quản lý) và `SALES` (tư vấn viên) | Đủ cho đội nhỏ 2–10 người — đối tượng của dịch vụ landing; thêm vai trò khác khi có nhu cầu thật |
| D4 | SALES được thấy lead nào | Lead giao cho mình + lead chưa giao (để tự nhận) | Cân bằng giữa riêng tư dữ liệu và tốc độ phản hồi lead mới; lead ngoài phạm vi trả 404 để không lộ |
| D5 | Xác thực site gửi lead | `siteKey` công khai trong query string + rate limit + honeypot + validation, CORS mở cho `/api/public/**` | Landing là site tĩnh nên không thể giữ bí mật; key dùng để định danh nguồn, chống spam bằng các lớp khác (giống Formspree) |
| D6 | Seed dữ liệu | Schema bằng Flyway; dữ liệu demo bằng `DemoDataSeeder` (Java) chạy khi `APP_SEED_DEMO=true` và DB chưa có user | Cần băm BCrypt và rải ngày tạo lead theo 14 ngày gần nhất — làm trong Java rõ ràng hơn SQL tĩnh; tắt được ở production |
| D7 | Lưu trường form khác nhau giữa các landing | Cột `extra` kiểu JSON | 3 landing có field khác nhau (loại căn, ngân sách, khoá học…); không cần đổi schema khi thêm landing |
| D8 | Refresh token | Chuỗi ngẫu nhiên 256-bit, lưu băm SHA-256, rotation mỗi lần refresh, lưu ở `localStorage` phía admin | Đơn giản cho SPA + API khác cổng khi dev; thu hồi được; rủi ro XSS được giảm bằng CSP chặt ở Nginx. Sau MVP có thể chuyển sang cookie HttpOnly |
| D9 | Rate limit | In-memory sliding window theo IP (10 lead/phút, 10 login/phút) | MVP chạy 1 instance; không cần Redis. Ghi rủi ro trong FINAL_REPORT khi scale ngang |
| D10 | Spring Boot version | 3.5.x (bản 3.x mới nhất) | Yêu cầu ghi "Spring Boot 3"; bản 4.x đã có nhưng giữ đúng yêu cầu và hệ sinh thái ổn định (springdoc 2.8, Testcontainers 1.21) |
| D11 | Biểu đồ dashboard | SVG tự vẽ, không thêm thư viện chart | Chỉ cần 1 biểu đồ cột; tiết kiệm ~100KB bundle |
| D12 | Admin gọi API | Nginx của admin proxy `/api` → backend (cùng origin); khi dev dùng Vite proxy | Không cần CORS cho API nội bộ, giảm bề mặt tấn công |
| D13 | Docker 29 trong môi trường dev | Chạy dockerd local; nếu Testcontainers 1.21 báo API version quá cũ thì đặt `DOCKER_MIN_API_VERSION` cho daemon / `api.version` cho docker-java | Docker 29 nâng API tối thiểu; GitHub Actions runner không bị ảnh hưởng |
| D14 | Múi giờ | Lưu UTC (`DATETIME` + JVM UTC), hiển thị theo `Asia/Ho_Chi_Minh` ở frontend; thống kê theo ngày dùng múi giờ VN | Tránh lệch ngày khi thống kê "hôm nay" |
