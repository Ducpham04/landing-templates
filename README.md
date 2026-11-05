# Landing Templates — 3 mẫu landing page cao cấp

Bộ 3 landing page demo cho dịch vụ freelance, mỗi mẫu có phong cách thị giác riêng.

| Thư mục | Ngành | Phong cách | Font |
| --- | --- | --- | --- |
| `apps/real-estate` | Bất động sản cao cấp — *The Aurelia Residences* | Nền đen, nhấn vàng champagne, serif thanh mảnh, chữ in hoa giãn rộng | Cormorant Garamond + Be Vietnam Pro |
| `apps/interior` | Thiết kế nội thất — *Atelier Mộc* | Kiểu tạp chí: nền vữa xám-xanh, nhấn đất nung, serif lớn, lưới bất đối xứng | Playfair Display + Inter |
| `apps/education` | Trung tâm giáo dục — *Nova Academy* | Trẻ trung kiểu neobrutalist: viền đậm, bóng lệch, tím indigo + xanh chanh, bộ icon nét thống nhất | Lexend |

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS v4 · Framer Motion (LazyMotion) · Prerender (SSG) lúc build.

## Có những gì

**Bất động sản:** hero ảnh/video toàn màn hình · tổng quan dự án · tiện ích · mặt bằng theo tab (sơ đồ minh hoạ sinh từ config hoặc ảnh bản vẽ thật) · vị trí (Google Maps, chỉ tải khi bấm) · bảng giá + chính sách · form nhận tư vấn.

**Nội thất:** hero ảnh ghép · dải hạng mục nhận thiết kế · portfolio dạng masonry có lọc + lightbox (phím ←/→/Esc) · quy trình 6 bước · báo giá 3 gói · testimonial tự chuyển · form liên hệ (loại công trình, diện tích, ngân sách).

**Giáo dục:** khoá học · lộ trình 4 chặng · giảng viên · lịch khai giảng có lọc + thanh số chỗ còn lại · testimonial · FAQ dạng accordion (kèm dữ liệu FAQPage cho Google) · form đăng ký học thử.

**Dùng chung cho cả 3:**
- Nút **Zalo / Messenger / Gọi điện** nổi ở góc phải dưới.
- Thẻ **SEO + Open Graph + Twitter Card + JSON-LD**, `robots.txt`, `sitemap.xml` sinh tự động từ config lúc build.
- HTML được **prerender** và CSS được inline, font chính được preload, nên trang hiện nội dung ngay cả trước khi JS chạy và không nhảy layout (tốt cho Lighthouse và crawler).
- Responsive từ 360px, hỗ trợ `prefers-reduced-motion`, có link "bỏ qua tới nội dung", điều hướng bàn phím.
- Ảnh responsive (`srcset` tự động cho Unsplash), lazy-load, ảnh lỗi thì hiện nền gradient thay thế.
- Testimonial, số liệu, bảng giá đều **ghi rõ là mẫu** trên giao diện.

## Chạy thử

Yêu cầu Node 20 trở lên.

```bash
npm install
```

```bash
npm run dev:real-estate     # hoặc dev:interior / dev:education
```

```bash
npm run build               # build cả 3 → apps/*/dist
```

```bash
npm run build:interior      # build riêng 1 mẫu
```

Xem bản build: `cd apps/interior && npx vite preview`.

## Đổi nội dung cho khách mới

**Mọi nội dung nằm trong một file: `apps/<mẫu>/src/config.ts`.** Không cần sửa component.

1. Copy thư mục mẫu, ví dụ `cp -r apps/real-estate apps/du-an-abc`, rồi đổi `name` trong `package.json` mới (VD `@templates/du-an-abc`).
2. Mở `src/config.ts` và sửa theo từng khối:

| Khối | Nội dung |
| --- | --- |
| `site` | Tên, `title`, `description`, `url` (domain thật, dùng cho canonical, OG và sitemap), `ogImage` (1200×630), `keywords`, `schemaType` |
| `theme` | Màu chủ đạo (`primary`, `background`, `text`, …). Được inject thành CSS variables, toàn trang đổi theo |
| `contact` | Hotline, số Zalo, username fanpage Messenger (`m.me/<username>`), email, địa chỉ |
| `nav`, `hero`, … | Chữ, ảnh, số liệu, danh sách của từng section |
| `form.endpoint` | Nơi nhận dữ liệu form (xem bên dưới) |

3. **Ảnh:** dùng URL tuyệt đối, hoặc chép ảnh vào `public/images/` và ghi `"/images/ten-anh.jpg"`. Nên nén sang WebP/AVIF, ảnh hero rộng khoảng 1920px. Ảnh Unsplash được tự sinh nhiều kích thước.
4. **Video hero (BĐS):** điền `hero.video` (mp4, nên dưới 5MB). Video chỉ tải trên desktop, sau khi trang đã hiện, nên không làm chậm trang.
5. **Mặt bằng (BĐS):** điền `floorPlans.units[].image` bằng ảnh bản vẽ thật. Để trống thì trang hiện sơ đồ minh hoạ vẽ từ `rooms`.
6. **Bản đồ:** Google Maps → Chia sẻ → Nhúng bản đồ → copy giá trị `src` vào `location.mapEmbed`.
7. Thay favicon ở `public/favicon.svg`.
8. Thay toàn bộ testimonial/số liệu mẫu bằng dữ liệu thật và bỏ chữ "(mẫu)".

### Nhận dữ liệu form

Đặt `form.endpoint` trong config. Nếu để trống, form chạy ở **chế độ demo**: báo gửi thành công nhưng không gửi dữ liệu đi đâu.

- **Formspree:** tạo form tại formspree.io, rồi dán `https://formspree.io/f/xxxx`.
- **Google Sheet:** tạo Google Apps Script `doPost(e)` ghi `JSON.parse(e.postData.contents)` vào sheet, deploy dạng Web App (Anyone), rồi dán URL `https://script.google.com/macros/s/.../exec`.
- **Webhook** (Make, Zapier, n8n, API riêng): nhận `POST` JSON gồm các trường form cùng `page` và `submittedAt`.

## Deploy từng mẫu

Mỗi mẫu là một app Vite độc lập, output tĩnh nằm ở `apps/<mẫu>/dist`.

### Vercel
New Project → chọn repo → **Root Directory**: `apps/real-estate` (lặp lại cho từng mẫu thành 3 project riêng). Framework: Vite. Build command `npm run build`, Output `dist`. Vercel tự nhận npm workspaces.

### Netlify
Add new site → chọn repo, rồi đặt:
- Base directory: `apps/interior`
- Build command: `npm run build`
- Publish directory: `apps/interior/dist`

### Cloudflare Pages
Root directory `apps/education`, build command `npm run build`, output `dist`.

### Hosting thường / VPS (cPanel, Nginx)

```bash
npm install
```

```bash
npm run build:real-estate
```

Upload toàn bộ nội dung `apps/real-estate/dist/` lên `public_html` (hoặc thư mục web root).

### Deploy vào thư mục con (VD GitHub Pages `/repo/real-estate/`)

```bash
BASE_PATH=/landing-templates/real-estate/ npm run build -w apps/real-estate
```

Khi deploy vào thư mục con, ảnh trong `public/` nên ghi đường dẫn tương đối hoặc kèm base path.

**Sau khi deploy:** sửa `site.url` thành domain thật rồi build lại, để canonical/OG/sitemap đúng. Kiểm tra thẻ OG bằng [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

## Hiệu năng (Lighthouse)

Đo bằng Lighthouse 12, cấu hình mobile mặc định, trên bản `vite preview`:

| Mẫu | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Bất động sản | 94 | 100 | 96 | 100 |
| Nội thất | 98 | 100 | 96 | 100 |
| Giáo dục | 95 | 100 | 96 | 100 |

> Môi trường đo chặn truy cập images.unsplash.com nên ảnh không tải được, và lỗi ảnh trong console kéo Best Practices xuống 96. Khi dùng ảnh thật, hãy nén ảnh và đo lại.

Mẹo giữ điểm ≥ 90 khi thay nội dung: ảnh hero tối đa khoảng 250KB (WebP), không nhúng thêm script bên thứ ba trong `<head>`. Nếu cần Google Analytics / Pixel, nạp chúng sau sự kiện `load`.

## Kiểm tra chất lượng giao diện (impeccable)

Giao diện đã được rà bằng [impeccable](https://github.com/pbakaus/impeccable) (`detect`, 62 quy tắc chống "AI slop") và sửa theo các quy tắc đó:

- Bỏ nhãn kicker/eyebrow phía trên tiêu đề, bỏ đánh số section (01)(02). Riêng số thứ tự các bước quy trình thì giữ, vì thứ tự đó mang thông tin.
- Bỏ khối số liệu kiểu "số to, nhãn nhỏ" ở hero. Số liệu được viết thành một dòng thông tin, ghi rõ "(số liệu mẫu)".
- Bỏ emoji và ký tự unicode dùng làm icon, thay bằng bộ icon SVG nét thống nhất.
- Bỏ marquee chạy vô hạn, nền grain `feTurbulence`, nền chấm, blob blur trang trí và card lồng card.
- Không dùng tiêu đề serif in nghiêng, không dùng nền cream mặc định.
- Bỏ hiệu ứng fade lặp lại ở mọi section. Mỗi trang chỉ giữ một vài chuyển động có chủ đích: hero, mặt bằng, lightbox, lộ trình, accordion.
- Tương phản đạt WCAG AA, kể cả placeholder. Chữ chức năng tối thiểu 11px. Tiêu đề dùng `text-wrap: balance`. Có focus ring theo màu thương hiệu, số dùng `tabular-nums`.
- Bóng lệch cứng ở template Giáo dục là **chủ ý** (hướng neobrutalist), nên detector chỉ báo dạng tư vấn.

Tự kiểm tra lại sau khi đổi nội dung cho khách:

```bash
cd apps/interior && npm run build && npx vite preview --port 4302
```

```bash
npx impeccable detect http://localhost:4302
```

## Cấu trúc

```
apps/<mẫu>/
├── index.html            # chứa <!--app-head-->, nơi plugin chèn SEO
├── seo-plugin.ts         # sinh meta/OG/JSON-LD/biến màu + robots.txt, sitemap.xml
├── prerender.mjs         # chèn HTML đã render vào dist/index.html
├── vite.config.ts
├── public/               # favicon, ảnh tĩnh
└── src/
    ├── config.ts         # ← TOÀN BỘ NỘI DUNG
    ├── App.tsx           # thứ tự các section (xoá/đổi chỗ tại đây)
    ├── sections/         # từng section
    ├── components/shared # FloatingContact, SmartImage (+ Icon ở Giáo dục)
    └── lib/              # gửi form, validate SĐT/email
```
