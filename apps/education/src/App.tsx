import { config } from "./config";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Courses } from "./sections/Courses";
import { Roadmap } from "./sections/Roadmap";
import { Teachers } from "./sections/Teachers";
import { Schedule } from "./sections/Schedule";
import { Testimonials } from "./sections/Testimonials";
import { Faq } from "./sections/Faq";
import { TrialForm } from "./sections/TrialForm";
import { Footer } from "./sections/Footer";
import { FloatingContact } from "./components/shared/FloatingContact";

export default function App() {
  const { contact } = config;
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-white">
        Bỏ qua tới nội dung
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Courses />
        <Roadmap />
        <Teachers />
        <Schedule />
        <Testimonials />
        <Faq />
        <TrialForm />
      </main>
      <Footer />
      <FloatingContact zalo={contact.zalo} messenger={contact.messenger} phone={contact.phone} />
    </>
  );
}
