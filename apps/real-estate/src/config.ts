/**
 * ============================================================
 *  CONFIG — TEMPLATE BẤT ĐỘNG SẢN CAO CẤP
 *  Mọi nội dung hiển thị (chữ, ảnh, màu, số liệu, liên hệ, SEO)
 *  đều nằm ở file này. Đổi khách mới = sửa file này.
 *  Ảnh: dùng URL tuyệt đối, hoặc đặt file vào /public/images và ghi "/images/ten-anh.jpg".
 * ============================================================
 */

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=72`;

export const config = {
  site: {
    name: "The Aurelia Residences",
    title: "The Aurelia Residences — Căn hộ hạng sang ven sông | Đăng ký nhận bảng giá",
    description:
      "Dự án căn hộ hạng sang ven sông với 42 tiện ích nội khu, tầm nhìn panorama và chính sách thanh toán linh hoạt. Đăng ký nhận bảng giá & tư vấn riêng.",
    url: "https://aurelia-demo.example.com",
    ogImage: U("1545324418-cc1a3fa10c00").replace("q=72", "q=80") + "&w=1200&h=630",
    locale: "vi_VN",
    keywords: ["căn hộ hạng sang", "bất động sản cao cấp", "căn hộ ven sông", "penthouse", "dự án mới"],
    schemaType: "RealEstateAgent",
    /** Ảnh hero được preload để tối ưu LCP (nên trùng hero.image, kèm w=1440) */
    preloadImage: U("1600596542815-ffad4c1539a9") + "&w=1440",
  },

  /** Màu chủ đạo → CSS variables (--c-primary, --c-background, ...) */
  theme: {
    primary: "#C6A15B", // vàng champagne
    primaryDark: "#9E7D3E",
    background: "#0B0C0E",
    surface: "#14161A",
    text: "#EEE7DA",
    muted: "#A9A397",
  },

  contact: {
    hotline: "0909 000 000",
    phone: "0909000000",
    zalo: "0909000000",
    messenger: "aurelia.residences.demo", // username fanpage
    email: "sales@aurelia-demo.example.com",
    address: "Số 01 Đường Ven Sông, TP. Thủ Đức, TP. HCM (địa chỉ mẫu)",
  },

  nav: [
    { label: "Tổng quan", href: "#tong-quan" },
    { label: "Tiện ích", href: "#tien-ich" },
    { label: "Mặt bằng", href: "#mat-bang" },
    { label: "Vị trí", href: "#vi-tri" },
    { label: "Bảng giá", href: "#bang-gia" },
  ],

  hero: {
    title: ["Nơi thượng lưu", "chọn để an cư"],
    subtitle:
      "286 căn hộ & penthouse giới hạn, thiết kế bởi kiến trúc sư quốc tế, bàn giao nội thất nhập khẩu châu Âu.",
    image: U("1600596542815-ffad4c1539a9"),
    /** Video nền (tuỳ chọn, mp4). Để trống → dùng ảnh. Video chỉ tải trên desktop. */
    video: "",
    ctaPrimary: "Nhận bảng giá",
    ctaSecondary: "Khám phá dự án",
    /** SỐ LIỆU MẪU — thay bằng số thật của dự án */
    stats: [
      { value: "286", label: "Căn hộ giới hạn" },
      { value: "42", label: "Tiện ích nội khu" },
      { value: "68%", label: "Mật độ cây xanh" },
      { value: "Q4/2027", label: "Dự kiến bàn giao" },
    ],
  },

  overview: {
    title: "Kiệt tác kiến trúc giữa lòng đô thị",
    body: [
      "The Aurelia được kiến tạo như một khu nghỉ dưỡng thu nhỏ, nơi mỗi căn hộ đều sở hữu tầm nhìn trọn vẹn ra sông và đường chân trời thành phố.",
      "Mặt dựng kính Low-E, sảnh đón 3 tầng cao và hệ thống quản lý vận hành chuẩn khách sạn 5 sao mang đến trải nghiệm sống riêng tư tuyệt đối.",
    ],
    image: U("1582268611958-ebfd161ef9cf"),
    facts: [
      { label: "Chủ đầu tư", value: "Aurelia Group (mẫu)" },
      { label: "Quy mô", value: "2 tháp · 32 tầng" },
      { label: "Diện tích", value: "1,8 ha" },
      { label: "Loại hình", value: "Căn hộ · Duplex · Penthouse" },
      { label: "Pháp lý", value: "Sở hữu lâu dài" },
      { label: "Bàn giao", value: "Nội thất cao cấp" },
    ],
  },

  amenities: {
    title: "42 tiện ích chuẩn resort",
    featured: [
      { title: "Hồ bơi vô cực tầng mái", desc: "Tràn bờ 50m, ngắm hoàng hôn trên sông", image: U("1571896349842-33c89424de2d") },
      { title: "Sky Lounge & Bar", desc: "Không gian tiếp khách riêng tư tầng 32", image: U("1600607687939-ce8a6c25118c") },
      { title: "Spa & Onsen", desc: "Liệu trình chăm sóc chuẩn Nhật Bản", image: U("1540555700478-4be289fbecef") },
      { title: "Fitness Center", desc: "Trang thiết bị Technogym, PT riêng", image: U("1534438327276-14e5300c3a48") },
    ],
    list: [
      "Sảnh đón 3 tầng chuẩn khách sạn",
      "Vườn treo trên cao",
      "Phòng chiếu phim riêng",
      "Khu BBQ ven sông",
      "Thư viện & co-working",
      "Kids club trong nhà",
      "Sân tennis & pickleball",
      "Bến du thuyền riêng",
      "Hầm xe thông minh",
      "An ninh 3 lớp 24/7",
      "Wine cellar",
      "Concierge & quản gia",
    ],
  },

  floorPlans: {
    title: "Thiết kế tối ưu từng mét vuông",
    note: "Mặt bằng minh hoạ. Có thể thay bằng ảnh bản vẽ thật qua trường `image`.",
    units: [
      {
        id: "2pn",
        name: "Căn 2 phòng ngủ",
        area: "78 m²",
        bedrooms: 2,
        bathrooms: 2,
        view: "Sông & thành phố",
        image: "", // VD: "/images/mat-bang-2pn.jpg" — nếu có sẽ thay sơ đồ minh hoạ
        rooms: [
          { x: 0, y: 0, w: 60, h: 45, label: "Phòng khách" },
          { x: 60, y: 0, w: 40, h: 45, label: "Ban công" },
          { x: 0, y: 45, w: 30, h: 30, label: "Bếp" },
          { x: 30, y: 45, w: 35, h: 55, label: "Phòng ngủ 1" },
          { x: 65, y: 45, w: 35, h: 55, label: "Phòng ngủ 2" },
          { x: 0, y: 75, w: 30, h: 25, label: "WC" },
        ],
      },
      {
        id: "3pn",
        name: "Căn 3 phòng ngủ",
        area: "112 m²",
        bedrooms: 3,
        bathrooms: 2,
        view: "Toàn cảnh sông",
        image: "",
        rooms: [
          { x: 0, y: 0, w: 50, h: 40, label: "Phòng khách" },
          { x: 50, y: 0, w: 25, h: 40, label: "Ăn" },
          { x: 75, y: 0, w: 25, h: 40, label: "Bếp" },
          { x: 0, y: 40, w: 35, h: 60, label: "Master" },
          { x: 35, y: 40, w: 20, h: 25, label: "WC" },
          { x: 35, y: 65, w: 30, h: 35, label: "Phòng ngủ 2" },
          { x: 65, y: 40, w: 35, h: 60, label: "Phòng ngủ 3" },
        ],
      },
      {
        id: "penthouse",
        name: "Penthouse Duplex",
        area: "246 m²",
        bedrooms: 4,
        bathrooms: 4,
        view: "Panorama 270°",
        image: "",
        rooms: [
          { x: 0, y: 0, w: 45, h: 50, label: "Living" },
          { x: 45, y: 0, w: 30, h: 30, label: "Dining" },
          { x: 75, y: 0, w: 25, h: 30, label: "Bếp" },
          { x: 45, y: 30, w: 55, h: 20, label: "Sân vườn" },
          { x: 0, y: 50, w: 40, h: 50, label: "Master suite" },
          { x: 40, y: 50, w: 30, h: 50, label: "Phòng ngủ 2" },
          { x: 70, y: 50, w: 30, h: 50, label: "Hồ bơi riêng" },
        ],
      },
    ],
  },

  location: {
    title: "Tâm điểm giao thương, tĩnh tại bên sông",
    /** Link nhúng Google Maps: Google Maps → Chia sẻ → Nhúng bản đồ → copy src */
    mapEmbed: "https://www.google.com/maps?q=Thu+Thiem,+Ho+Chi+Minh&z=14&output=embed",
    /** Khoảng cách MẪU */
    distances: [
      { place: "Trung tâm Quận 1", time: "5 phút" },
      { place: "Ga Metro gần nhất", time: "3 phút" },
      { place: "Trường quốc tế", time: "7 phút" },
      { place: "Bệnh viện quốc tế", time: "10 phút" },
      { place: "Sân bay Tân Sơn Nhất", time: "25 phút" },
      { place: "TTTM cao cấp", time: "5 phút" },
    ],
  },

  pricing: {
    title: "Đầu tư vào giá trị bền vững",
    disclaimer: "* Bảng giá MẪU dùng cho demo. Giá thực tế theo chính sách bán hàng từng đợt.",
    rows: [
      { type: "Căn 2 phòng ngủ", area: "72 – 80 m²", price: "6,2 tỷ", perM2: "~ 82 tr/m²" },
      { type: "Căn 3 phòng ngủ", area: "105 – 118 m²", price: "9,8 tỷ", perM2: "~ 88 tr/m²" },
      { type: "Duplex", area: "160 – 185 m²", price: "16,5 tỷ", perM2: "~ 95 tr/m²" },
      { type: "Penthouse", area: "240 – 320 m²", price: "Liên hệ", perM2: "Giới hạn 8 căn" },
    ],
    policies: [
      { title: "Thanh toán 30%", desc: "Đến khi nhận nhà, giãn đều 24 tháng" },
      { title: "Hỗ trợ lãi suất 0%", desc: "Trong 18 tháng, ân hạn nợ gốc" },
      { title: "Chiết khấu đến 9%", desc: "Khi thanh toán sớm (mẫu)" },
    ],
  },

  form: {
    title: "Nhận bảng giá & mặt bằng chi tiết",
    subtitle: "Chuyên viên sẽ liên hệ trong vòng 15 phút (giờ hành chính) để gửi tài liệu và sắp lịch tham quan căn hộ mẫu.",
    /** Endpoint nhận dữ liệu (Formspree / Google Apps Script / webhook). Trống = demo. */
    endpoint: "",
    interestOptions: ["Căn 2 phòng ngủ", "Căn 3 phòng ngủ", "Duplex", "Penthouse", "Chưa xác định"],
    submitLabel: "Gửi đăng ký",
    successMessage: "Cảm ơn quý khách! Chuyên viên tư vấn sẽ liên hệ trong thời gian sớm nhất.",
    privacy: "Thông tin của quý khách được bảo mật tuyệt đối.",
  },

  footer: {
    tagline: "Kiến tạo chuẩn sống thượng lưu.",
    legal: "Hình ảnh, số liệu và bảng giá trên trang là nội dung mẫu phục vụ trình diễn.",
  },
};

export type Config = typeof config;
