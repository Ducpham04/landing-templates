# CHECKLIST — LeadHub MVP

> Vai trò: Project Manager · Thứ tự = độ ưu tiên · Cập nhật lần cuối: 07/11/2026 (hoàn thành MVP)
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
- [x] Kiểm chứng `docker compose up` end-to-end — 6/6 service healthy, e2e pass trên stack này
- [x] GitHub Actions: build + test backend, build + test frontend, e2e (`.github/workflows/ci.yml`)

## 5. QA
- [x] TEST_PLAN.md (ma trận user story ↔ test)
- [x] Unit test backend (Validators, JWT, PublicLeadService, LeadService, CSV, RateLimiter, StartupSafetyCheck)
- [x] Integration test backend (Testcontainers MySQL 8.4 + MockMvc) — **51/51 pass**
- [x] Unit test frontend (Vitest) — 5/5 pass
- [x] E2E Playwright luồng chính (landing → admin → xử lý lead, phân quyền, đăng nhập sai, mobile) — **4/4 pass**
- [x] Tất cả test pass

## 6. Review & bảo mật
- [x] Review bảo mật — `docs/REVIEW.md` (1 cao, 3 trung bình, 2 thấp đã sửa; 4 chấp nhận có ghi rủi ro)
- [x] Review hiệu năng (index, N+1, phân trang, bundle)
- [x] Sửa các vấn đề tìm được: token user bị khoá, secret mặc định, honeypot, body chunked, leadCount

## 7. Tài liệu & bàn giao
- [x] README.md hoàn chỉnh (giới thiệu, sơ đồ, ảnh, chạy, tài khoản demo, test, deploy)
- [x] FINAL_REPORT.md
- [x] PR chuyển Ready for review

## Sau MVP (xem PRD §5 và FINAL_REPORT §5)
- [ ] Thông báo lead mới qua Zalo OA / Telegram / email
- [ ] Chia lead xoay vòng, nhắc gọi lại / SLA
- [ ] Refresh token bằng cookie HttpOnly, Turnstile cho form
- [ ] Multi-tenant
