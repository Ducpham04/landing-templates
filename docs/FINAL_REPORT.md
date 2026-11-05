# FINAL REPORT — LeadHub MVP (bàn giao giữa chừng)

> Ngày 05/11/2026 · Nhánh `feature/mvp` · PR: https://github.com/Ducpham04/landing-templates/pull/1 (Draft)

## 1. Đã làm xong

### Sản phẩm
**3 landing page + LeadHub (backend + admin)**. Lead từ form landing đổ về một nơi, được giao cho tư vấn viên và theo dõi tới khi chốt.

| Phần | Trạng thái | Ghi chú |
| --- | --- | --- |
| 3 landing (BĐS, Nội thất, Giáo dục) | ✅ | Prerender, SEO/OG, Lighthouse ≥ 94, đã rà bằng impeccable; gửi lead qua `VITE_LEAD_ENDPOINT` |
| Backend Spring Boot 3.5 / Java 21 / MySQL 8.4 / Flyway | ✅ | Đã chạy thật với MySQL và seed demo; smoke test toàn bộ API bằng curl |
| Auth JWT (access 15', refresh 7 ngày, rotation, logout thu hồi) | ✅ | |
| Phân quyền ADMIN / SALES + phạm vi dữ liệu SALES | ✅ | Lead ngoài phạm vi trả 404 |
| API public nhận lead (validate tiếng Việt, honeypot, rate limit 10/phút/IP, body ≤ 16KB, CORS) | ✅ | |
| Lead: lọc, tìm, phân trang, trạng thái, giao/nhận, ghi chú, lịch sử, CSV | ✅ | |
| Dashboard, quản lý landing (site key), quản lý nhân viên | ✅ | |
| Admin SPA (React Query, Router, RHF, Zod, Tailwind), mobile-first | ✅ | Kiểm tra bằng Playwright ở 1440px và 390px, không lỗi console, không tràn ngang |
| Seed demo: 4 tài khoản, 3 landing, 64 lead tiếng Việt rải 14 ngày | ✅ | |
| Docker: Dockerfile backend, Dockerfile frontend + nginx, docker-compose, .env.example | ✅ viết xong / ⚠️ chưa chạy trọn | Xem §3 |
| Test | ✅ 48 backend (unit + Testcontainers) · 5 frontend | Tất cả pass |
| Tài liệu | ✅ PRD, DESIGN, ARCHITECTURE, DECISIONS, CHECKLIST | |

### Tài khoản demo (khi `APP_SEED_DEMO=true`)
| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Quản trị | admin@leadhub.vn | Admin@123 |
| Tư vấn viên | minh.tran@leadhub.vn | Sales@123 |
| Tư vấn viên | thu.le@leadhub.vn | Sales@123 |
| Bị khoá (để test) | hoang.pham@leadhub.vn | Sales@123 |

Site key demo: `site_aurelia_demo_2026`, `site_atelier_demo_2026`, `site_nova_demo_2026`.

### Cách chạy (đã kiểm chứng)
```bash
docker run -d --name lh-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=leadhub -e MYSQL_USER=leadhub -e MYSQL_PASSWORD=leadhub -p 3306:3306 mysql:8.4
cd backend && mvn package -DskipTests && APP_SEED_DEMO=true java -jar target/leadhub-backend-1.0.0.jar
npm install && npm run dev -w apps/admin          # http://localhost:5173 (proxy /api → :8080)
cd backend && mvn test                            # 48 test, cần Docker cho Testcontainers
npm test -w apps/admin
```

## 2. Chưa làm / làm dở

| Hạng mục | Trạng thái | Việc cụ thể còn lại |
| --- | --- | --- |
| `docker compose up` toàn bộ | Làm dở | Chạy trên máy có Internet thường và xác nhận 6 service healthy (xem §3) |
| GitHub Actions CI | Chưa làm | `ci.yml`: job backend `mvn -B verify` (runner ubuntu có Docker cho Testcontainers); job frontend `npm ci`, `npm run build`, `npm test -w apps/admin` |
| docs/TEST_PLAN.md | Chưa làm | Ma trận test theo user story trong PRD (đã có test tương ứng ở `backend/src/test`) |
| E2E Playwright | Chưa làm | `apps/admin/e2e/lead-flow.spec.ts`: POST lead public → login SALES → mở lead → "Nhận xử lý" → đổi "Đã liên hệ" → thêm ghi chú → kiểm tra lịch sử |
| README phần LeadHub | Chưa làm | Hiện README chỉ mô tả landing; nội dung có sẵn ở báo cáo này + ARCHITECTURE |
| Review bảo mật/hiệu năng vòng cuối | Làm dở | Xem §4 |

## 3. Lỗi / vấn đề đã biết

1. **Build image backend trong sandbox thất bại (môi trường, không phải lỗi code).** Sandbox đi qua proxy chặn TLS, nên Maven bên trong container báo `PKIX path building failed`. Ảnh admin đã build được. Trên máy hay CI thông thường thì không gặp lỗi này. Cần chạy lại `docker compose up -d --build` ở môi trường thật để xác nhận.
2. **Admin dev qua Vite proxy phải giữ `changeOrigin: false`.** Nếu đổi Host, Spring coi request là cross-origin và trả 403 CORS. Đã sửa; production đi qua nginx với `Host $http_host`.
3. **JWT chưa kiểm tra lại trạng thái user mỗi request.** Một user bị khoá vẫn dùng được access token còn hạn, tối đa 15 phút; refresh thì đã bị chặn. Chấp nhận trong MVP.
4. **Rate limit lưu trong bộ nhớ**, nên chỉ đúng khi chạy 1 instance (DECISIONS D9).
5. **Refresh token lưu trong `localStorage`** (D8): có rủi ro nếu bị XSS. Đã có CSP chặt ở nginx; nên chuyển sang cookie HttpOnly.
6. **PATCH site trả `leadCount = 0`**: frontend tự tải lại danh sách nên không hiển thị sai, nhưng API chưa chuẩn.
7. **Landing gửi lead kèm `page` URL**; UTM được tách từ URL đó ở backend. Landing chưa có trường honeypot ẩn, tuy backend đã hỗ trợ trường `website`.

## 4. Rủi ro

| Rủi ro | Mức | Giảm thiểu |
| --- | --- | --- |
| Spam form landing (site key công khai) | Trung bình | Đã có honeypot + rate limit + validate; sau MVP thêm Turnstile/reCAPTCHA |
| Scale nhiều instance | Thấp (khách nhỏ) | Chuyển rate limit sang Redis/Bucket4j |
| Lộ secret mặc định | Cao nếu quên đổi | `.env.example` ghi rõ; nên thêm kiểm tra chặn khởi động khi `JWT_SECRET` là giá trị mặc định ở profile prod |
| Chưa có CI | Trung bình | Mục đầu tiên của bước tiếp theo |

## 5. Bước tiếp theo cụ thể (ước lượng)
1. Chạy `docker compose up -d --build`, mở :3000, :5101–:5103, gửi form thật → kiểm tra lead xuất hiện (0,5 giờ).
2. Thêm `.github/workflows/ci.yml` (1 giờ).
3. TEST_PLAN.md + e2e Playwright luồng chính (2 giờ).
4. README phần LeadHub + ảnh chụp màn hình (1 giờ).
5. Sửa các mục 3, 5, 6, 7 ở §3 và chặn secret mặc định ở prod (2 giờ).
6. Chuyển PR sang Ready for review.

### Đề xuất phiên bản 1.1
- Thông báo lead mới qua Zalo OA / Telegram / email (giá trị cao nhất với khách).
- Chia lead tự động xoay vòng + nhắc gọi lại / SLA lead quá hạn.
- Cookie HttpOnly cho refresh token, Turnstile cho form.
- Multi-tenant, để 1 hệ thống phục vụ nhiều khách của freelancer.

## 6. Gợi ý giá bán (thị trường VN, tham khảo)
| Gói | Nội dung | Giá đề xuất |
| --- | --- | --- |
| Landing | 1 landing từ template, đổi nội dung, deploy, SEO/OG | 4–8 triệu đ |
| Landing + LeadHub | Landing + LeadHub cài trên VPS của khách, 3–5 tài khoản, đào tạo 1 buổi | 12–20 triệu đ (một lần) |
| Thuê bao | LeadHub host sẵn + bảo trì + backup | 500k–1,5 triệu đ/tháng |
| Tuỳ biến | Thông báo Zalo/Telegram, báo cáo riêng, tích hợp CRM | 3–10 triệu đ/hạng mục |
