# CHECKLIST — LeadHub MVP

> Vai trò: Project Manager · Thứ tự = độ ưu tiên · Cập nhật lần cuối: 05/11/2026 (bàn giao)
> Ký hiệu: [x] xong · [~] đang làm dở · [ ] chưa làm

## 0. Khởi tạo
- [x] Tài liệu: PRD, DESIGN, ARCHITECTURE, CHECKLIST, DECISIONS
- [x] Nhánh `feature/mvp` + Draft PR

## 1. Backend — luồng chính
- [x] Khung Spring Boot 3.5 / Java 21, Maven, cấu hình qua biến môi trường, Dockerfile
- [x] Flyway V1: schema users, refresh_tokens, sites, leads, lead_notes, lead_activities
- [x] Xử lý lỗi thống nhất (GlobalExceptionHandler, ApiError tiếng Việt)
- [x] Auth: login, refresh (rotation), logout, me — JWT + BCrypt
- [x] Public API nhận lead: validate, honeypot, rate limit, giới hạn body 16KB, CORS
- [x] Leads: danh sách + lọc + phân trang, chi tiết, đổi trạng thái, giao/nhận, phạm vi SALES
- [x] Ghi chú + lịch sử hoạt động
- [x] Dashboard stats
- [x] Sites CRUD + regenerate key
- [x] Users CRUD + khoá/mở
- [x] Xuất CSV (UTF-8 BOM, chống CSV injection)
- [x] Seed demo tiếng Việt + tài khoản demo
- [x] OpenAPI (springdoc, `/swagger-ui.html`)

## 2. Frontend admin — luồng chính
- [x] Khung Vite + TS + Tailwind + Router + React Query + RHF + Zod
- [x] API client + tự refresh token + lưu phiên
- [x] Đăng nhập (kèm hộp tài khoản demo)
- [x] Layout: sidebar desktop / tab bar mobile, phân quyền menu
- [x] Danh sách lead: lọc, tìm, phân trang, đồng bộ URL, nút gọi/Zalo
- [x] Chi tiết lead: trạng thái, giao/nhận, ghi chú, lịch sử
- [x] Tổng quan (dashboard + biểu đồ)
- [x] Landing (sites) — ADMIN
- [x] Nhân viên (users) — ADMIN
- [x] Xuất CSV
- [x] Trạng thái loading / rỗng / lỗi / 404

## 3. Tích hợp landing
- [x] `VITE_LEAD_ENDPOINT` cho 3 landing (gửi kèm URL trang → backend tách UTM)

## 4. DevOps
- [x] Dockerfile backend, Dockerfile frontend (nginx) + cấu hình nginx admin/landing
- [x] docker-compose.yml (mysql, backend, admin, 3 landing) + .env.example
- [~] **Kiểm chứng `docker compose up` end-to-end** — chưa chạy trọn trong sandbox vì proxy TLS của môi trường chặn Maven trong container (xem FINAL_REPORT §3). Ảnh `leadhub-admin` đã build thành công; backend đã chạy thật bằng `java -jar` + MySQL 8.4 Docker.
- [ ] GitHub Actions: build + test backend, build + test frontend, e2e

## 5. QA
- [ ] TEST_PLAN.md
- [x] Unit test backend (Validators, JWT, PublicLeadService, LeadService, CSV, RateLimiter)
- [x] Integration test backend (Testcontainers MySQL 8.4 + MockMvc) — **48/48 pass**
- [x] Unit test frontend (Vitest: format, Zod schemas) — 5/5 pass
- [ ] E2E Playwright luồng chính (đã có `@playwright/test` trong devDeps, chưa viết test)
- [x] Tất cả test hiện có pass

## 6. Review & bảo mật
- [~] Review bảo mật — đã áp dụng trong lúc code (BCrypt, JWT secret ≥32 byte, refresh token băm + rotation, chống dò email, phạm vi dữ liệu 404, Criteria API + escape LIKE, rate limit, CSV injection, CSP nginx). Chưa làm vòng review độc lập cuối.
- [ ] Review hiệu năng chính thức (đã có index + EntityGraph chống N+1, chưa đo tải)

## 7. Tài liệu & bàn giao
- [~] README.md — hiện chỉ mô tả 3 landing; cần thêm phần LeadHub (chạy, tài khoản demo, deploy)
- [x] FINAL_REPORT.md
- [ ] PR chuyển Ready for review (giữ Draft cho tới khi xong mục 4–5 còn lại)

## Việc tiếp theo (theo thứ tự)
1. Chạy `docker compose up -d --build` trên máy có Internet thường; sửa nếu có lỗi.
2. Thêm `.github/workflows/ci.yml` (backend `mvn verify`, frontend `npm ci && npm run build && npm test -w apps/admin`).
3. Viết `docs/TEST_PLAN.md` + 1 e2e Playwright: gửi lead qua API public → đăng nhập SALES → nhận → đổi trạng thái → ghi chú.
4. Bổ sung README phần LeadHub.
5. Review bảo mật vòng cuối, rồi chuyển PR sang Ready for review.
