import { config } from "./config";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Portfolio } from "./sections/Portfolio";
import { Process } from "./sections/Process";
import { Packages } from "./sections/Packages";
import { Testimonials } from "./sections/Testimonials";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { FloatingContact } from "./components/shared/FloatingContact";

export default function App() {
  const { contact } = config;
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">
        Bỏ qua tới nội dung
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Portfolio />
        <Process />
        <Packages />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingContact zalo={contact.zalo} messenger={contact.messenger} phone={contact.phone} />
    </>
  );
}
