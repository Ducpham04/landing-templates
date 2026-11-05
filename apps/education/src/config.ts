/**
 * ============================================================
 *  CONFIG — TEMPLATE TRUNG TÂM GIÁO DỤC
 *  Mọi nội dung hiển thị (chữ, ảnh, màu, số liệu, liên hệ, SEO)
 *  đều nằm ở file này. Đổi khách mới = sửa file này.
 *  Ảnh: URL tuyệt đối, hoặc đặt file vào /public/images và ghi "/images/ten-anh.jpg".
 * ============================================================
 */

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=72`;

export const config = {
  site: {
    name: "Nova Academy",
    title: "Nova Academy — Tiếng Anh & kỹ năng cho học sinh 6–18 tuổi | Đăng ký học thử miễn phí",
    description:
      "Trung tâm tiếng Anh chuẩn quốc tế: lộ trình cá nhân hoá, giáo viên bản ngữ & 8.0+ IELTS, lớp tối đa 12 học viên. Đăng ký học thử & kiểm tra trình độ miễn phí.",
    url: "https://nova-academy-demo.example.com",
    ogImage: U("1522202176988-66273c2fd55f") + "&w=1200&h=630",
    locale: "vi_VN",
    keywords: ["trung tâm tiếng anh", "luyện thi IELTS", "tiếng anh trẻ em", "học thử miễn phí", "khoá học tiếng anh"],
    schemaType: "EducationalOrganization",
    preloadImage: U("1522202176988-66273c2fd55f") + "&w=1080",
  },

  /** Màu chủ đạo → CSS variables */
  theme: {
    primary: "#4F46E5", // indigo
    accent: "#D9F99D", // lime
    accentStrong: "#E11D48", // coral (đủ tương phản cho chữ)
    background: "#FBFAF7",
    surface: "#F1EFFE",
    text: "#14123A",
    muted: "#5B5A75",
  },

  contact: {
    hotline: "1900 0000",
    phone: "19000000",
    zalo: "0987654321",
    messenger: "nova.academy.demo",
    email: "tuvan@nova-academy-demo.example.com",
    address: "25 Đường Tri Thức, Q. Cầu Giấy, Hà Nội (địa chỉ mẫu)",
  },

  nav: [
    { label: "Khoá học", href: "#khoa-hoc" },
    { label: "Lộ trình", href: "#lo-trinh" },
    { label: "Giảng viên", href: "#giang-vien" },
    { label: "Lịch khai giảng", href: "#lich" },
    { label: "FAQ", href: "#faq" },
  ],

  hero: {
    badge: "Ưu đãi khai giảng tháng 12 — giảm 20% học phí",
    titleBefore: "Tự tin",
    titleHighlight: "nói tiếng Anh",
    titleAfter: "sau 6 tháng.",
    subtitle:
      "Lộ trình cá nhân hoá theo trình độ, lớp nhỏ tối đa 12 bạn, cam kết đầu ra bằng văn bản. Học thử miễn phí 2 buổi trước khi quyết định.",
    image: U("1522202176988-66273c2fd55f"),
    ctaPrimary: "Đăng ký học thử miễn phí",
    ctaSecondary: "Xem khoá học",
    /** SỐ LIỆU MẪU */
    stats: [
      { value: "12.000+", label: "Học viên" },
      { value: "98%", label: "Đạt mục tiêu đầu ra" },
      { value: "4.9/5", label: "Đánh giá phụ huynh" },
    ],
    floatingCards: [
      { title: "IELTS 7.5", desc: "Học viên lớp 11 (mẫu)" },
      { title: "Lớp ≤ 12", desc: "Kèm sát từng bạn" },
    ],
  },

  courses: {
    title: "Chương trình cho từng độ tuổi & mục tiêu",
    items: [
      { tag: "6–10 tuổi", name: "Kids English", desc: "Phát âm chuẩn, phản xạ tự nhiên qua trò chơi, dự án và kể chuyện.", duration: "3 tháng/cấp", sessions: "2 buổi/tuần", price: "2.400.000đ/tháng", color: "#D9F99D" },
      { tag: "11–15 tuổi", name: "Teen Communication", desc: "Giao tiếp, thuyết trình, viết luận — nền tảng vững cho THCS.", duration: "4 tháng/cấp", sessions: "3 buổi/tuần", price: "2.900.000đ/tháng", color: "#FDE68A" },
      { tag: "Mục tiêu 6.5+", name: "IELTS Intensive", desc: "Luyện 4 kỹ năng với đề thật, chấm chữa Writing/Speaking 1-1.", duration: "6 tháng", sessions: "3 buổi/tuần", price: "3.800.000đ/tháng", color: "#C7D2FE" },
      { tag: "Người đi làm", name: "Business English", desc: "Email, họp, đàm phán và thuyết trình trong môi trường quốc tế.", duration: "3 tháng", sessions: "2 buổi/tuần (tối)", price: "3.200.000đ/tháng", color: "#FBCFE8" },
    ],
    note: "* Học phí MẪU tham khảo.",
  },

  roadmap: {
    title: "Từ mất gốc đến IELTS 7.0+ trong 4 chặng",
    steps: [
      { level: "Chặng 1", name: "Foundation", target: "A1 → A2", duration: "3 tháng", points: ["Phát âm IPA chuẩn", "1.000 từ vựng cốt lõi", "Ngữ pháp nền tảng"] },
      { level: "Chặng 2", name: "Pre-Intermediate", target: "A2 → B1", duration: "3 tháng", points: ["Giao tiếp tình huống", "Đọc hiểu đoạn ngắn", "Viết đoạn văn"] },
      { level: "Chặng 3", name: "IELTS Foundation", target: "4.5 → 5.5", duration: "4 tháng", points: ["Làm quen format IELTS", "Chiến thuật từng dạng bài", "Mock test hằng tháng"] },
      { level: "Chặng 4", name: "IELTS Master", target: "6.5 → 7.0+", duration: "4 tháng", points: ["Chấm chữa 1-1", "Thi thử như thật", "Cam kết đầu ra"] },
    ],
  },

  teachers: {
    title: "Người truyền cảm hứng, không chỉ dạy chữ",
    note: "* Hồ sơ giảng viên MẪU.",
    items: [
      { name: "Ms. Linh Nguyễn", role: "Head Teacher · IELTS 8.5", bio: "Thạc sĩ TESOL (UK), 10 năm luyện thi IELTS.", image: U("1580489944761-15a19d654956") },
      { name: "Mr. James Carter", role: "Native Teacher · CELTA", bio: "Giáo viên bản ngữ Anh, chuyên Speaking & Business.", image: U("1500648767791-00dcc994a43e") },
      { name: "Ms. Thảo Trần", role: "Kids Specialist · TKT", bio: "8 năm dạy tiếng Anh thiếu nhi theo phương pháp Montessori.", image: U("1534528741775-53994a69daeb") },
      { name: "Mr. Minh Đặng", role: "IELTS Coach · 8.0", bio: "Cựu giám khảo kỳ thi học sinh giỏi cấp thành phố.", image: U("1472099645785-5658abf4ff4e") },
    ],
  },

  schedule: {
    title: "Các lớp sắp khai giảng",
    note: "* Lịch MẪU. Cập nhật lịch thật trong config.",
    /** seats: số chỗ còn lại; total: sĩ số tối đa */
    classes: [
      { course: "Kids English", code: "KID-12A", start: "02/12/2026", time: "T3–T5 · 17:30–19:00", campus: "Cầu Giấy", seats: 3, total: 12 },
      { course: "Teen Communication", code: "TEEN-12B", start: "05/12/2026", time: "T2–T4–T6 · 18:00–19:30", campus: "Cầu Giấy", seats: 7, total: 12 },
      { course: "IELTS Intensive", code: "IELTS-12C", start: "08/12/2026", time: "T3–T5–T7 · 19:00–21:00", campus: "Online", seats: 2, total: 12 },
      { course: "Business English", code: "BIZ-12D", start: "10/12/2026", time: "T2–T4 · 19:30–21:00", campus: "Đống Đa", seats: 9, total: 12 },
      { course: "IELTS Intensive", code: "IELTS-01A", start: "06/01/2027", time: "T2–T4–T6 · 18:00–20:00", campus: "Đống Đa", seats: 12, total: 12 },
    ],
  },

  testimonials: {
    title: "Những câu chuyện tiến bộ",
    badge: "Nhận xét mẫu",
    items: [
      { quote: "Con từ sợ nói tiếng Anh nay đã tự tin thuyết trình trước lớp. Cô giáo nhắn tình hình học mỗi tuần nên bố mẹ rất yên tâm.", name: "Chị Hương", role: "Phụ huynh bé Bin, 9 tuổi (mẫu)" },
      { quote: "Từ 5.0 lên 7.0 sau 5 tháng. Phần Writing được chữa rất kỹ, chỉ ra đúng lỗi mình hay mắc.", name: "Hoàng Nam", role: "Học viên IELTS, lớp 12 (mẫu)" },
      { quote: "Lớp buổi tối phù hợp người đi làm, nội dung sát thực tế công việc. Giờ mình họp với đối tác nước ngoài thoải mái hơn nhiều.", name: "Anh Tuấn", role: "Học viên Business English (mẫu)" },
    ],
  },

  faq: {
    title: "Bạn còn băn khoăn?",
    items: [
      { q: "Học thử miễn phí gồm những gì?", a: "Bạn được kiểm tra trình độ 4 kỹ năng, học thử 2 buổi tại lớp phù hợp và nhận tư vấn lộ trình cá nhân — hoàn toàn miễn phí, không ràng buộc." },
      { q: "Một lớp có bao nhiêu học viên?", a: "Tối đa 12 học viên/lớp để giáo viên theo sát từng bạn. Lớp IELTS có thêm buổi chấm chữa 1-1." },
      { q: "Nếu không đạt cam kết đầu ra thì sao?", a: "Học viên đi học đủ ≥ 90% buổi và hoàn thành bài tập nhưng chưa đạt mục tiêu sẽ được học lại miễn phí cho đến khi đạt." },
      { q: "Có lớp online không?", a: "Có. Lớp online học trực tiếp qua Zoom với giáo viên, sĩ số và giáo trình giống lớp offline." },
      { q: "Học phí đóng thế nào?", a: "Đóng theo tháng hoặc theo khoá (giảm thêm 10%). Hỗ trợ chuyển khoản, thẻ và trả góp 0% qua thẻ tín dụng." },
      { q: "Có thể bảo lưu khoá học không?", a: "Được bảo lưu tối đa 3 tháng một lần với lý do chính đáng (ốm, thi cử, công tác)." },
    ],
  },

  form: {
    title: "Nhận 2 buổi học thử & test trình độ miễn phí",
    subtitle: "Để lại thông tin, tư vấn viên sẽ gọi lại trong 30 phút để xếp lịch phù hợp.",
    endpoint: import.meta.env?.VITE_LEAD_ENDPOINT ?? "", // VITE_LEAD_ENDPOINT (LeadHub) / Formspree / Apps Script / webhook. Trống = demo.
    ageOptions: ["6–10 tuổi", "11–15 tuổi", "16–18 tuổi", "Người đi làm"],
    timeOptions: ["Sáng cuối tuần", "Chiều cuối tuần", "Tối ngày thường", "Linh hoạt"],
    perks: ["Kiểm tra trình độ 4 kỹ năng", "2 buổi học thử tại lớp thật", "Lộ trình cá nhân hoá", "Tặng bộ tài liệu khởi động"],
    submitLabel: "Đăng ký học thử ngay",
    successMessage: "Đăng ký thành công! Tư vấn viên sẽ gọi cho bạn trong 30 phút (giờ hành chính).",
  },

  footer: {
    tagline: "Học để tự tin bước ra thế giới.",
    legal: "Hình ảnh, số liệu, học phí, lịch học và nhận xét trên trang là nội dung mẫu phục vụ trình diễn.",
  },
};

export type Config = typeof config;
