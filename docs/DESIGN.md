# DESIGN — LeadHub Admin

> Vai trò: UI/UX Designer · Mobile-first · Tiếng Việt

## 1. Định hướng

LeadHub là **công cụ làm việc** (chế độ "Operate"): người dùng mở nó nhiều lần mỗi ngày để gọi khách. Giao diện ưu tiên sự rõ ràng, mật độ thông tin vừa phải và thao tác nhanh trên điện thoại, không trang trí.

- **Một màu nhấn duy nhất** (xanh lục đậm) cho hành động chính. Các trạng thái lead có màu riêng, luôn kèm chữ, không chỉ dựa vào màu.
- **Hai chạm để gọi khách**: danh sách lead có nút Gọi và nút Zalo ngay trên từng dòng.
- **Không modal** cho các việc thường ngày. Chi tiết lead là một trang riêng; form tạo user/site dùng panel trượt (drawer) trên desktop, trang riêng trên mobile.
- Ba landing page giữ phong cách riêng của chúng; admin không bắt chước landing.

## 2. Design system

### Màu (CSS variables, sáng; có biến thể tối theo `prefers-color-scheme`)

| Token | Sáng | Tối | Dùng cho |
| --- | --- | --- | --- |
| `--bg` | `#F6F7F5` | `#111412` | Nền trang |
| `--surface` | `#FFFFFF` | `#1A1E1B` | Bảng, khung nội dung |
| `--border` | `#E1E4DF` | `#2C322E` | Đường kẻ |
| `--text` | `#161A17` | `#E9ECE8` | Chữ chính |
| `--muted` | `#5C645E` | `#A3ABA5` | Chữ phụ (≥ 4.5:1) |
| `--primary` | `#1F6B4F` | `#4CC38A` | Nút chính, link, focus |
| `--primary-fg` | `#FFFFFF` | `#0B1A12` | Chữ trên nút chính |
| `--danger` | `#B42318` | `#F97066` | Lỗi, xoá, khoá |

**Màu trạng thái lead** (nền nhạt + chữ đậm, luôn có nhãn):

| Trạng thái | Nhãn | Màu |
| --- | --- | --- |
| `NEW` | Mới | xanh dương `#1D4ED8` |
| `CONTACTED` | Đã liên hệ | hổ phách `#A15C07` |
| `QUALIFIED` | Tiềm năng | tím `#6D28D9` |
| `WON` | Đã chốt | xanh lục `#15803D` |
| `LOST` | Thất bại | xám `#4B5563` |

### Typography
- Font: **Be Vietnam Pro** (hỗ trợ tiếng Việt đầy đủ), tải local qua `@fontsource`, các weight 400/500/600.
- Thang cỡ: 12 (meta) · 14 (bảng, form) · 16 (body) · 20 (tiêu đề khối) · 24 (tiêu đề trang) · 30 (số liệu dashboard).
- Số liệu và SĐT dùng `tabular-nums`.

### Spacing, bo góc, đổ bóng
- Thang spacing 4px: 4, 8, 12, 16, 24, 32, 48.
- Bo góc: 8px cho control, 12px cho khung nội dung, dạng pill cho badge trạng thái.
- Chiều sâu chỉ thể hiện bằng **viền 1px**, không đổ bóng (ngoại trừ drawer và menu nổi).

### Component
| Component | Ghi chú |
| --- | --- |
| `Button` | primary / secondary / ghost / danger; size sm, md; có trạng thái loading (spinner + giữ nguyên độ rộng) và disabled |
| `Input`, `Select`, `Textarea` | Nhãn luôn hiện phía trên; lỗi hiện dưới trường, màu danger, nêu cách sửa |
| `StatusBadge` | Pill gồm màu và nhãn |
| `DataTable` | Desktop dạng bảng; mobile chuyển thành danh sách thẻ dòng |
| `Pagination` | Trước / Sau + "Trang x/y" |
| `EmptyState` | Câu mô tả và hành động gợi ý |
| `Toast` | Thông báo kết quả thao tác, tự ẩn sau 4 giây, `aria-live` |
| `Drawer` | Form tạo/sửa trên desktop |
| `StatCard` | Nhãn + số; không dùng icon trang trí |
| `BarChart` | Cột theo ngày, vẽ bằng SVG thuần, có `title` cho từng cột |

### Trạng thái bắt buộc cho mọi màn hình
Đang tải (skeleton), rỗng, lỗi (có nút Thử lại), không có quyền, offline (toast).

### Icon
Bộ icon nét SVG (lucide-react), 16–20px, stroke 1.75.

## 3. Sitemap

```
/login                      Đăng nhập
/                           Tổng quan (dashboard)
/leads                      Danh sách lead (lọc, tìm, xuất CSV)
/leads/:id                  Chi tiết lead (thông tin, trạng thái, giao việc, ghi chú, lịch sử)
/sites                      Landing page (ADMIN)
/users                      Nhân viên (ADMIN)
*                           404
```

Điều hướng:
- **Mobile:** thanh tab dưới cùng gồm Tổng quan · Lead · (Landing · Nhân viên nếu là ADMIN) · Tài khoản.
- **Desktop (≥ 1024px):** sidebar trái rộng 240px.

## 4. Mô tả màn hình

### 4.1 Đăng nhập
- Khối giữa màn hình, rộng tối đa 400px, gồm tên sản phẩm, 2 trường và nút "Đăng nhập".
- Lỗi đăng nhập hiện ngay trên nút, dạng chữ.
- Dưới form có hộp "Tài khoản demo", bấm vào để tự điền.

### 4.2 Tổng quan
- Hàng 4 StatCard (2×2 trên mobile): Tổng lead · Mới hôm nay · Đang chăm sóc · Tỉ lệ chốt.
- Biểu đồ cột "Lead 14 ngày gần nhất".
- Hai danh sách ngắn: theo trạng thái (thanh ngang có số) và theo landing.
- "Lead mới nhất" (5 dòng), có link sang danh sách.

### 4.3 Danh sách lead
- Thanh trên: ô tìm kiếm (tên/SĐT/email), nút "Bộ lọc" (mobile mở panel; desktop hiện inline: trạng thái, landing, người phụ trách, từ ngày, đến ngày), nút "Xuất CSV" (chỉ ADMIN).
- Desktop: bảng gồm Khách hàng (tên + SĐT), Landing, Trạng thái, Phụ trách, Thời gian (tương đối, ví dụ "5 phút trước").
- Mobile: mỗi lead là một thẻ dòng gồm tên, SĐT, badge, landing, thời gian, cùng 2 nút icon Gọi và Zalo.
- Bộ lọc được đồng bộ vào URL query, nên có thể chia sẻ link và giữ được khi bấm Back.

### 4.4 Chi tiết lead
- Đầu trang: tên, SĐT (bấm để gọi), nút Zalo, badge trạng thái.
- Khối "Xử lý": nhóm nút chọn trạng thái (segmented, cuộn ngang trên mobile); chọn người phụ trách (ADMIN) hoặc nút "Nhận xử lý" (SALES, khi lead chưa có người).
- Khối "Thông tin": email, landing, trang gửi, UTM, các trường bổ sung (`extra`) dạng danh sách khoá–giá trị.
- Khối "Ghi chú": textarea + nút "Thêm ghi chú"; danh sách ghi chú mới nhất ở trên.
- Khối "Lịch sử": timeline các thay đổi.

### 4.5 Landing page (ADMIN)
- Bảng gồm Tên, Domain, Số lead, Trạng thái (bật/tắt), Site key (rút gọn, có nút Sao chép).
- Nút "Thêm landing" mở drawer. Hành động trên từng dòng: Sửa, Tạo lại key (có xác nhận inline), Bật/tắt.
- Có hộp hướng dẫn nhúng: hiện sẵn URL endpoint để dán vào `VITE_LEAD_ENDPOINT`.

### 4.6 Nhân viên (ADMIN)
- Bảng gồm Họ tên, Email, Vai trò, Trạng thái, Ngày tạo.
- Drawer tạo/sửa gồm họ tên, email, vai trò, mật khẩu (chỉ khi tạo).
- Có nút Khoá/Mở khoá; không áp dụng cho chính mình.

### 4.7 404 và không có quyền
Câu mô tả ngắn và nút "Về Tổng quan".

## 5. Responsive và truy cập
- Mobile-first, bắt đầu từ 360px. Mốc 640 / 1024.
- Vùng chạm tối thiểu 44×44px; focus ring 2px theo màu `--primary`.
- Mọi icon-only button đều có `aria-label`; bảng có `<th scope>`; form có `<label for>`.
- Tôn trọng `prefers-reduced-motion`; chuyển động chỉ dùng cho drawer và toast (≤ 200ms).
