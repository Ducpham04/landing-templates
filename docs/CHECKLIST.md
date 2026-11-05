# CHECKLIST — LeadHub MVP

> Vai trò: Project Manager · Thứ tự = độ ưu tiên · Cập nhật liên tục

## 0. Khởi tạo
- [x] Tài liệu: PRD, DESIGN, ARCHITECTURE, CHECKLIST, DECISIONS
- [x] Nhánh `feature/mvp` + Draft PR

## 1. Backend — luồng chính
- [x] Khung Spring Boot 3.5 / Java 21, Maven, cấu hình theo profile, Docker
- [x] Flyway V1: schema users, refresh_tokens, sites, leads, lead_notes, lead_activities
- [x] Xử lý lỗi thống nhất (GlobalExceptionHandler, ApiError tiếng Việt)
- [x] Auth: login, refresh (rotation), logout, me — JWT + BCrypt
- [x] Public API nhận lead: validate, honeypot, rate limit, CORS
- [x] Leads: danh sách + lọc + phân trang, chi tiết, đổi trạng thái, giao/nhận, phạm vi SALES
- [x] Ghi chú + lịch sử hoạt động
- [x] Dashboard stats
- [x] Sites CRUD + regenerate key
- [x] Users CRUD + khoá/mở
- [x] Xuất CSV (UTF-8 BOM, chống CSV injection)
- [x] Seed demo tiếng Việt + tài khoản demo
- [x] OpenAPI (springdoc)

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
- [ ] `VITE_LEAD_ENDPOINT` cho 3 landing, gửi kèm UTM

## 4. DevOps
- [x] Dockerfile backend, Dockerfile frontend (nginx)
- [ ] docker-compose.yml chạy toàn bộ bằng 1 lệnh, .env.example
- [ ] GitHub Actions: build + test backend, build + test frontend, e2e

## 5. QA
- [ ] TEST_PLAN.md
- [ ] Unit test backend (service, JWT, validation)
- [ ] Integration test backend (Testcontainers MySQL + MockMvc)
- [ ] Unit test frontend (Vitest)
- [ ] E2E Playwright luồng chính: landing gửi lead → admin đăng nhập → xử lý lead
- [ ] Tất cả test pass

## 6. Review & bảo mật
- [ ] Review bảo mật (auth, validation, SQLi, secret, CORS, rate limit)
- [ ] Review hiệu năng (index, N+1, phân trang) và code sạch
- [ ] Sửa các vấn đề tìm được

## 7. Tài liệu & bàn giao
- [ ] README.md hoàn chỉnh
- [ ] FINAL_REPORT.md
- [ ] PR chuyển Ready for review
