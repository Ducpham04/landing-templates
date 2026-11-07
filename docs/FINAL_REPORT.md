# FINAL REPORT — LeadHub MVP

> Ngày 07/11/2026 · Nhánh `feature/mvp` · PR: https://github.com/Ducpham04/landing-templates/pull/1

## 1. Đã làm

### Sản phẩm
Gói **"Landing page + CRM mini"**: khách điền form trên landing, lead về LeadHub, tư vấn viên nhận và xử lý tới khi chốt, quản trị theo dõi bằng dashboard.

| Phần | Kết quả |
| --- | --- |
| 3 landing (BĐS, Nội thất, Giáo dục) | Prerender, SEO/OG, Lighthouse mobile ≥ 94, rà bằng impeccable; form gửi lead qua `VITE_LEAD_ENDPOINT`, có honeypot |
| Backend Spring Boot 3.5 / Java 21 / MySQL 8.4 / Flyway | Auth JWT (access/refresh xoay vòng), ADMIN/SALES + phạm vi dữ liệu, API public chống spam, lead (lọc, trạng thái, giao/nhận, ghi chú, lịch sử, CSV), dashboard, landing, nhân viên, OpenAPI |
| Admin React (React Query, Router, RHF, Zod, Tailwind) | Mobile-first, tiếng Việt; dashboard, danh sách/chi tiết lead, landing, nhân viên; tự refresh token |
| DevOps | Dockerfile backend/frontend, nginx (CSP, proxy `/api`), `docker-compose.yml` (6 service), `.env.example`, GitHub Actions (backend → frontend → e2e) |
| Seed demo | 4 tài khoản, 3 landing (site key cố định), 64 lead tiếng Việt rải 14 ngày |
| Tài liệu | README, PRD, DESIGN, ARCHITECTURE (ERD, API, phân quyền), DECISIONS (D1–D17), CHECKLIST, TEST_PLAN, REVIEW, FINAL_REPORT |

### Kiểm thử (lần chạy 07/11/2026)
| Bộ | Kết quả |
| --- | --- |
| Backend unit + integration (Testcontainers MySQL 8.4) | **51/51 pass** |
| Frontend unit (Vitest) | **5/5 pass** |
| E2E Playwright trên `docker compose` (desktop + Pixel 7) | **4/4 pass**: landing → admin → nhận → đổi trạng thái → ghi chú → admin thấy kết quả; phân quyền; đăng nhập sai; nút Gọi/Zalo trên mobile |
| `docker compose up` từ DB trống | 6/6 service healthy |
| `npm run build` (admin + 3 landing) | pass |
| **GitHub Actions** (run [#42396493164](https://github.com/Ducpham04/landing-templates/actions/runs/42396493164)) | Backend ✅ · Frontend ✅ · E2E trên `docker compose` build từ Dockerfile của repo ✅ |

### Review (chi tiết `docs/REVIEW.md`)
Đã sửa: chặn secret JWT mặc định ở production; tài khoản bị khoá mất quyền ngay (không chờ token hết hạn); honeypot ở landing; từ chối body chunked ở API public; `leadCount` trả sai khi sửa landing.

### Tài khoản demo
`admin@leadhub.vn / Admin@123` (quản trị) · `minh.tran@leadhub.vn / Sales@123`, `thu.le@leadhub.vn / Sales@123` (tư vấn viên) · `hoang.pham@leadhub.vn` (đã khoá).

## 2. Chưa làm (ngoài phạm vi MVP)
- Thông báo lead mới qua Zalo OA / Telegram / email.
- Chia lead tự động, nhắc gọi lại, SLA lead quá hạn.
- Quên mật khẩu qua email, 2FA, đổi mật khẩu tự phục vụ. Hiện quản trị tạo mật khẩu tạm.
- Multi-tenant, webhook ra ngoài, Facebook Lead Ads.
- Màn hình tạo tài khoản quản trị đầu tiên khi DB trống. Hiện dùng seed demo rồi khoá tài khoản demo (README §Deploy).

## 3. Lỗi và hạn chế đã biết
1. **Refresh token lưu trong `localStorage`** (D8). Giảm thiểu bằng CSP chặt; nên chuyển sang cookie HttpOnly.
2. **Rate limit trong bộ nhớ**: chỉ đúng khi chạy 1 instance. Phía sau reverse proxy cần cấu hình `X-Forwarded-For` đúng.
3. **Chưa phát hiện tái sử dụng refresh token** (thu hồi cả chuỗi). Token cũ vẫn đã bị thu hồi khi xoay.
4. **Swagger mở mặc định**: tắt bằng biến môi trường (README).
5. **Sandbox**: muốn build image trong môi trường có proxy chặn TLS phải nạp CA (D17). Máy và CI thông thường không cần.
6. Ảnh Unsplash ở landing không tải được trong sandbox nên ảnh chụp kiểm tra chỉ có nền thay thế; trên Internet thật ảnh hiển thị bình thường.

## 4. Rủi ro
| Rủi ro | Mức | Giảm thiểu |
| --- | --- | --- |
| Spam form (site key công khai) | Trung bình | Honeypot + rate limit + validate + giới hạn body; bản 1.1 thêm Turnstile |
| Quên đổi secret/mật khẩu DB khi triển khai | Cao → Thấp | Backend từ chối khởi động với secret mặc định khi tắt demo; README nhấn mạnh |
| Mở rộng nhiều instance | Thấp (khách nhỏ) | Rate limit sang Redis/Bucket4j; user-status cache sang Redis |
| Dữ liệu cá nhân khách hàng (SĐT, email) | Trung bình | Phân quyền theo phạm vi, HTTPS bắt buộc khi deploy, backup volume MySQL; cần thông báo bảo mật trên landing theo Nghị định 13/2023 |

## 5. Đề xuất phiên bản tiếp theo (1.1)
1. Thông báo lead mới qua Zalo OA / Telegram (giá trị cao nhất với khách: phản hồi trong 5 phút).
2. Chia lead xoay vòng + nhắc gọi lại + cảnh báo lead quá 30 phút chưa liên hệ.
3. Cookie HttpOnly cho refresh token, Turnstile cho form, quên mật khẩu.
4. Báo cáo theo nguồn UTM và theo nhân viên (tỉ lệ chốt, thời gian phản hồi).
5. Multi-tenant để freelancer dùng 1 hệ thống cho nhiều khách (mô hình thuê bao).

## 6. Gợi ý giá bán (thị trường VN, tham khảo)
| Gói | Nội dung | Giá đề xuất |
| --- | --- | --- |
| Landing | 1 landing từ template, đổi nội dung, deploy, SEO/OG | 4–8 triệu đ |
| Landing + LeadHub | Landing + LeadHub cài trên VPS của khách, 3–5 tài khoản, đào tạo 1 buổi | 12–20 triệu đ (một lần) |
| Thuê bao | LeadHub host sẵn + bảo trì + backup | 500k–1,5 triệu đ/tháng |
| Tuỳ biến | Thông báo Zalo/Telegram, báo cáo riêng, tích hợp CRM | 3–10 triệu đ/hạng mục |
