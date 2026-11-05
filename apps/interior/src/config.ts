/**
 * ============================================================
 *  CONFIG — TEMPLATE THIẾT KẾ NỘI THẤT
 *  Mọi nội dung hiển thị (chữ, ảnh, màu, số liệu, liên hệ, SEO)
 *  đều nằm ở file này. Đổi khách mới = sửa file này.
 *  Ảnh: URL tuyệt đối, hoặc đặt file vào /public/images và ghi "/images/ten-anh.jpg".
 * ============================================================
 */

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=72`;

export const config = {
  site: {
    name: "Atelier Mộc",
    title: "Atelier Mộc — Thiết kế & thi công nội thất trọn gói | Báo giá theo m²",
    description:
      "Studio thiết kế nội thất cao cấp cho căn hộ, nhà phố, biệt thự. Quy trình 6 bước minh bạch, báo giá theo gói, bảo hành 5 năm. Nhận tư vấn & phương án miễn phí.",
    url: "https://atelier-moc-demo.example.com",
    ogImage: U("1618221195710-dd6b41faaea6") + "&w=1200&h=630",
    locale: "vi_VN",
    keywords: ["thiết kế nội thất", "thi công nội thất", "nội thất căn hộ", "nội thất biệt thự", "báo giá nội thất"],
    schemaType: "HomeAndConstructionBusiness",
    preloadImage: U("1618221195710-dd6b41faaea6") + "&w=1080",
  },

  /** Màu chủ đạo → CSS variables */
  theme: {
    primary: "#97482A", // đất nung — dùng trên nền sáng
    primaryOnDark: "#E39A74", // đất nung sáng — dùng trên nền tối
    secondary: "#5E6148", // olive
    background: "#E4E6DF", // vữa xám-xanh (plaster)
    surface: "#D6DAD0",
    text: "#1D201C",
    muted: "#4F554C",
  },

  contact: {
    hotline: "0912 345 678",
    phone: "0912345678",
    zalo: "0912345678",
    messenger: "ateliermoc.demo",
    email: "hello@atelier-moc-demo.example.com",
    address: "68 Phố Thợ Mộc, Hoàn Kiếm, Hà Nội (địa chỉ mẫu)",
  },

  nav: [
    { label: "Dự án", href: "#du-an" },
    { label: "Quy trình", href: "#quy-trinh" },
    { label: "Báo giá", href: "#bao-gia" },
    { label: "Khách hàng", href: "#danh-gia" },
  ],

  hero: {
    titleStart: "Không gian sống",
    titleItalic: "mang dấu ấn",
    titleEnd: "của riêng bạn.",
    subtitle:
      "Chúng tôi thiết kế và thi công trọn gói những ngôi nhà ấm áp, tinh tế và bền bỉ theo thời gian — từ căn hộ 50m² đến biệt thự 500m².",
    imageMain: U("1618221195710-dd6b41faaea6"),
    imageSecondary: U("1616486338812-3dadae4b4ace"),
    cta: "Đặt lịch tư vấn",
    /** SỐ LIỆU MẪU */
    stats: [
      { value: "320+", label: "Công trình hoàn thiện" },
      { value: "12", label: "Năm kinh nghiệm" },
      { value: "5 năm", label: "Bảo hành" },
    ],
  },

  services: ["Căn hộ", "Nhà phố", "Biệt thự", "Penthouse", "Văn phòng", "Showroom", "Homestay", "Cải tạo"],

  portfolio: {
    title: "Những ngôi nhà chúng tôi đã chạm vào",
    /** Danh mục lọc (phải khớp trường category của từng dự án) */
    categories: ["Tất cả", "Căn hộ", "Nhà phố", "Biệt thự"],
    projects: [
      { title: "Căn hộ Sông Hồng", category: "Căn hộ", meta: "120 m² · Japandi", image: U("1600210492486-724fe5c67fb0"), ratio: "aspect-[4/5]" },
      { title: "Biệt thự Ecopark", category: "Biệt thự", meta: "380 m² · Modern Luxury", image: U("1600607687939-ce8a6c25118c"), ratio: "aspect-[4/3]" },
      { title: "Nhà phố Tây Hồ", category: "Nhà phố", meta: "220 m² · Indochine", image: U("1617806118233-18e1de247200"), ratio: "aspect-square" },
      { title: "Penthouse Landmark", category: "Căn hộ", meta: "260 m² · Contemporary", image: U("1600566753190-17f0baa2a6c3"), ratio: "aspect-[3/4]" },
      { title: "Căn hộ The Mây", category: "Căn hộ", meta: "85 m² · Minimal", image: U("1586023492125-27b2c045efd7"), ratio: "aspect-[4/3]" },
      { title: "Biệt thự Hồ Tây", category: "Biệt thự", meta: "450 m² · Wabi-sabi", image: U("1615874959474-d609969a20ed"), ratio: "aspect-[4/5]" },
      { title: "Nhà phố Long Biên", category: "Nhà phố", meta: "180 m² · Scandinavian", image: U("1556228453-efd6c1ff04f6"), ratio: "aspect-square" },
      { title: "Căn hộ Duplex Sky", category: "Căn hộ", meta: "160 m² · Mid-century", image: U("1631679706909-1844bbd07221"), ratio: "aspect-[3/4]" },
    ],
  },

  process: {
    title: "6 bước, minh bạch từ ý tưởng đến bàn giao",
    steps: [
      { title: "Gặp gỡ & khảo sát", desc: "Lắng nghe nhu cầu, đo đạc hiện trạng, tư vấn phong cách và ngân sách.", time: "1–2 ngày" },
      { title: "Concept & mặt bằng", desc: "Đề xuất bố trí công năng, moodboard vật liệu và bảng màu.", time: "5–7 ngày" },
      { title: "Thiết kế 3D", desc: "Phối cảnh 3D chân thực từng không gian, chỉnh sửa đến khi hài lòng.", time: "10–14 ngày" },
      { title: "Hồ sơ kỹ thuật", desc: "Bản vẽ thi công chi tiết, dự toán vật tư minh bạch từng hạng mục.", time: "7 ngày" },
      { title: "Sản xuất & thi công", desc: "Xưởng mộc riêng 2.000 m², giám sát kỹ thuật cập nhật tiến độ hằng ngày.", time: "30–60 ngày" },
      { title: "Bàn giao & bảo hành", desc: "Vệ sinh, styling hoàn thiện, bàn giao và bảo hành 5 năm.", time: "Trọn đời" },
    ],
  },

  packages: {
    title: "Chọn gói phù hợp với ngôi nhà của bạn",
    note: "* Đơn giá MẪU tham khảo, chưa bao gồm VAT. Báo giá chính xác sau khảo sát.",
    plans: [
      {
        name: "Essential",
        price: "250.000",
        unit: "đ/m² thiết kế",
        desc: "Thiết kế 2D & 3D cho khách tự thi công.",
        features: ["Mặt bằng bố trí công năng", "Phối cảnh 3D các phòng chính", "Hồ sơ kỹ thuật cơ bản", "2 lần chỉnh sửa"],
        highlight: false,
      },
      {
        name: "Signature",
        price: "4.500.000",
        unit: "đ/m² trọn gói",
        desc: "Thiết kế + thi công trọn gói, miễn phí thiết kế.",
        features: ["Miễn 100% phí thiết kế", "3D toàn bộ không gian", "Gỗ An Cường / MDF chống ẩm", "Giám sát kỹ thuật riêng", "Bảo hành 3 năm"],
        highlight: true,
      },
      {
        name: "Bespoke",
        price: "Liên hệ",
        unit: "theo dự án",
        desc: "Biệt thự, penthouse với vật liệu nhập khẩu.",
        features: ["Kiến trúc sư trưởng phụ trách", "Gỗ tự nhiên, đá, vải nhập khẩu", "Đồ rời đặt riêng (bespoke)", "Styling & decor hoàn thiện", "Bảo hành 5 năm"],
        highlight: false,
      },
    ],
  },

  testimonials: {
    title: "Những ngôi nhà đã có chủ",
    /** Nhận xét MẪU — thay bằng phản hồi thật (có sự đồng ý của khách) */
    badge: "Nhận xét mẫu",
    items: [
      { quote: "Từ bản 3D đến khi nhận nhà gần như giống hệt. Đội thi công gọn gàng, đúng hẹn, cập nhật tiến độ mỗi ngày qua Zalo.", name: "Chị Minh Anh", role: "Căn hộ 120 m² (mẫu)", avatar: U("1494790108377-be9c29b29330") },
      { quote: "Atelier Mộc hiểu được gu của gia đình tôi chỉ sau buổi gặp đầu tiên. Ngôi nhà ấm cúng và rất 'sống được'.", name: "Anh Quốc Huy", role: "Nhà phố 220 m² (mẫu)", avatar: U("1507003211169-0a1dd7228f2d") },
      { quote: "Báo giá minh bạch, không phát sinh. Sau 2 năm sử dụng đồ gỗ vẫn như mới, bảo hành rất nhanh.", name: "Chị Thu Hà", role: "Biệt thự 380 m² (mẫu)", avatar: U("1438761681033-6461ffad8d80") },
    ],
  },

  form: {
    title: "Hãy kể cho chúng tôi về ngôi nhà của bạn",
    subtitle: "Nhận tư vấn & phương án bố trí sơ bộ miễn phí trong 48 giờ.",
    endpoint: import.meta.env?.VITE_LEAD_ENDPOINT ?? "", // VITE_LEAD_ENDPOINT (LeadHub) / Formspree / Apps Script / webhook. Trống = demo.
    typeOptions: ["Căn hộ", "Nhà phố", "Biệt thự", "Văn phòng", "Khác"],
    budgetOptions: ["Dưới 300 triệu", "300 – 700 triệu", "700 triệu – 1,5 tỷ", "Trên 1,5 tỷ"],
    submitLabel: "Gửi yêu cầu",
    successMessage: "Cảm ơn bạn! Kiến trúc sư sẽ liên hệ trong 24 giờ tới.",
  },

  footer: {
    tagline: "Thiết kế để sống, không chỉ để ngắm.",
    legal: "Hình ảnh, số liệu, đơn giá và nhận xét trên trang là nội dung mẫu phục vụ trình diễn.",
  },
};

export type Config = typeof config;
