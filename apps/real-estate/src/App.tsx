import { config } from "./config";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Overview } from "./sections/Overview";
import { Amenities } from "./sections/Amenities";
import { FloorPlans } from "./sections/FloorPlans";
import { Location } from "./sections/Location";
import { Pricing } from "./sections/Pricing";
import { Register } from "./sections/Register";
import { Footer } from "./sections/Footer";
import { FloatingContact } from "./components/shared/FloatingContact";

export default function App() {
  const { contact } = config;
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-primary focus:px-4 focus:py-2 focus:text-bg">
        Bỏ qua tới nội dung
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Overview />
        <Amenities />
        <FloorPlans />
        <Location />
        <Pricing />
        <Register />
      </main>
      <Footer />
      <FloatingContact zalo={contact.zalo} messenger={contact.messenger} phone={contact.phone} />
    </>
  );
}
