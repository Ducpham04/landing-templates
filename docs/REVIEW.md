# REVIEW — Bảo mật, hiệu năng, chất lượng code

> Vai trò: Code Reviewer / Security · Ngày 07/11/2026 · Phạm vi: `backend/`, `apps/admin/`, `docker/`, `docker-compose.yml`

## 1. Kết quả tóm tắt

| Mức | Số vấn đề | Đã sửa | Chấp nhận (ghi rủi ro) |
| --- | --- | --- | --- |
| Cao | 1 | 1 | 0 |
| Trung bình | 4 | 3 | 1 |
| Thấp | 5 | 2 | 3 |

## 2. Bảo mật

| # | Hạng mục | Phát hiện | Mức | Xử lý |
| --- | --- | --- | --- | --- |
| S1 | Secret | Chạy production với `JWT_SECRET` mặc định thì ai cũng ký được token | Cao | **Đã sửa:** `StartupSafetyCheck` chặn khởi động khi tắt demo mà secret là placeholder. Ở chế độ demo chỉ cảnh báo |
| S2 | Auth | Tài khoản bị khoá vẫn dùng access token còn hạn (≤ 15 phút) | Trung bình | **Đã sửa:** `UserStatusCache` kiểm tra active + role (cache 30 giây, xoá cache khi admin sửa user). Có test `lockingUserInvalidatesExistingAccessTokenImmediately` |
| S3 | Chống spam | Landing không có honeypot dù backend hỗ trợ | Trung bình | **Đã sửa:** thêm ô ẩn `website` ở 3 form |
| S4 | DoS | Body gửi kiểu chunked (không có Content-Length) vượt qua giới hạn 16KB | Trung bình | **Đã sửa:** trả 411 cho `/api/public/leads` khi thiếu Content-Length. Đã kiểm bằng curl trên stack Docker |
| S5 | Token | Refresh token lưu trong `localStorage` (rủi ro nếu có XSS) | Trung bình | **Chấp nhận** (DECISIONS D8): CSP chặt ở nginx, React escape mọi nội dung, không có `dangerouslySetInnerHTML` ở admin. Bản 1.1 chuyển sang cookie HttpOnly |
| S6 | Rate limit | Lưu trong bộ nhớ, chỉ đúng với 1 instance. Phía sau proxy cần cấu hình X-Forwarded-For đúng | Thấp | **Chấp nhận** (D9). `server.forward-headers-strategy=native` chỉ tin XFF từ IP nội bộ |
| S7 | Refresh rotation | Chưa phát hiện việc dùng lại token đã xoay (token family) | Thấp | **Chấp nhận**: token cũ đã bị thu hồi khi xoay; bản sau thu hồi cả chuỗi khi phát hiện tái sử dụng |
| S8 | API docs | Swagger mở công khai | Thấp | **Chấp nhận**, README hướng dẫn tắt bằng `SPRINGDOC_*_ENABLED=false` |
| S9 | Site update | API trả `leadCount = 0` sau khi sửa (sai dữ liệu) | Thấp | **Đã sửa** + test |

### Các điểm đã kiểm và đạt

- **SQL injection:** chỉ dùng Spring Data/Criteria/JPQL với tham số bind, không có nối chuỗi SQL. `q` được escape `%`/`_`. Có test tìm `' OR 1=1 --` trả về 0 kết quả.
- **IDOR / phạm vi dữ liệu:** mọi thao tác trên lead (đọc, sửa, nhận, ghi chú, lịch sử) đi qua `LeadService.load()` với `visibleTo(user)`. Lead ngoài phạm vi trả 404. Có test.
- **Phân quyền URL + method:** `/api/users/**`, `/api/sites/**` (trừ GET), `/api/leads/export` chỉ ADMIN; `anyRequest().denyAll()`.
- **Mật khẩu:** BCrypt cost 10. Đăng nhập sai và email không tồn tại trả cùng thông báo, cùng thời gian xử lý (so với hash giả).
- **Validation:** Bean Validation trên mọi DTO có giới hạn độ dài. API public giới hạn 20 trường `extra`, mỗi giá trị 500 ký tự. Page size tối đa 100, export tối đa 10.000 dòng.
- **Mass assignment:** request DTO tách riêng; không bind trực tiếp entity.
- **XSS:** React escape; `pageUrl` và `extra` hiển thị dạng chữ, không thành link. JSON-LD ở landing escape `<`.
- **CSV injection:** ô bắt đầu bằng `= + - @` được thêm tiền tố `'`.
- **Thông tin lỗi:** không lộ stacktrace (`include-stacktrace: never`, handler chung trả 500 tiếng Việt).
- **CORS:** chỉ `/api/public/**` mở (POST, không credentials). API admin cùng origin qua nginx.
- **Header:** CSP, X-Frame-Options DENY, nosniff, Referrer-Policy ở nginx admin; frame deny ở Spring.
- **Container:** backend chạy user không phải root; chỉ expose health của actuator.
- **Secret trong repo:** không có. `.env` nằm trong `.gitignore`, chỉ commit `.env.example` với placeholder.

## 3. Hiệu năng

| Hạng mục | Kết luận |
| --- | --- |
| N+1 | Danh sách lead, ghi chú, lịch sử dùng `@EntityGraph`; `default_batch_fetch_size=50` |
| Index | `leads(status)`, `(site_id, created_at)`, `(assignee_id)`, `(created_at)`, `(phone)`; notes và activities index theo `(lead_id, created_at)` |
| Phân trang | Luôn phân trang, size ≤ 100, sort theo whitelist cột |
| Dashboard | 3 truy vấn gộp (group by) + 1 truy vấn thời điểm tạo trong 14 ngày; đủ cho tới vài chục nghìn lead/tháng. Khi lớn hơn, chuyển sang group by ngày trong SQL |
| JWT filter | Thêm 1 truy vấn theo khoá chính mỗi 30 giây cho mỗi user (cache) |
| Frontend | Admin ~133KB gzip (React + React Query + Router). Landing: prerender, CSS inline, preload font, Lighthouse ≥ 94 |

## 4. Chất lượng code

- Đóng gói theo tính năng (`auth`, `user`, `site`, `lead`, `dashboard`); controller mỏng, logic nằm ở service.
- Lỗi thống nhất qua `AppException` + `GlobalExceptionHandler`, thông báo tiếng Việt.
- Frontend: một API client duy nhất (tự refresh token); form dùng RHF + Zod với schema dùng chung; bộ component UI nhỏ trong `components/ui.tsx`.
- Còn nợ kỹ thuật nhỏ: 3 landing lặp lại `seo-plugin.ts`, `prerender.mjs`, `lib/` và `components/shared/` (cố ý, để mỗi landing tách ra bàn giao độc lập; xem README).
