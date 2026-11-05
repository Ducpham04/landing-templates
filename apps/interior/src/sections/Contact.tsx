import { AnimatePresence, m } from "framer-motion";
import { config } from "../config";
import { useLeadForm } from "../lib/useLeadForm";
import { Reveal } from "../components/shared/Reveal";
import { Arrow } from "./Heading";

export function Contact() {
  const { form, contact } = config;
  const { values, errors, status, set, onSubmit, reset } = useLeadForm(
    { name: "", phone: "", email: "", type: "", area: "", budget: "", message: "" },
    form.endpoint,
    ["name", "phone"],
  );
  return (
    <section id="lien-he" className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="label"><span className="text-primary">(05)</span> {form.eyebrow}</p>
          <h2 className="font-display mt-6 text-4xl leading-tight sm:text-5xl lg:text-6xl">{form.title}</h2>
          <p className="mt-6 text-lg text-muted">{form.subtitle}</p>
          <dl className="mt-12 space-y-6">
            <div><dt className="label">Hotline</dt><dd className="font-display mt-1 text-3xl"><a href={`tel:${contact.phone}`} className="hover:text-primary">{contact.hotline}</a></dd></div>
            <div><dt className="label">Email</dt><dd className="mt-1"><a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a></dd></div>
            <div><dt className="label">Studio</dt><dd className="mt-1">{contact.address}</dd></div>
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <m.div key="ok" role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-[420px] flex-col items-start justify-center bg-surface p-10">
                <span className="font-display text-6xl text-primary italic">Cảm ơn!</span>
                <p className="mt-4 text-lg">{form.successMessage}</p>
                <button onClick={reset} className="btn-line mt-8">Gửi yêu cầu khác</button>
              </m.div>
            ) : (
              <m.form key="f" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                <F label="Họ và tên *" error={errors.name}><input className="input" autoComplete="name" value={values.name} onChange={set("name")} /></F>
                <F label="Số điện thoại *" error={errors.phone}><input className="input" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} /></F>
                <F label="Email" error={errors.email}><input className="input" type="email" autoComplete="email" value={values.email} onChange={set("email")} /></F>
                <F label="Diện tích (m²)"><input className="input" inputMode="numeric" value={values.area} onChange={set("area")} /></F>
                <F label="Loại công trình">
                  <select className="input" value={values.type} onChange={set("type")}>
                    <option value="">Chọn loại</option>
                    {form.typeOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </F>
                <F label="Ngân sách dự kiến">
                  <select className="input" value={values.budget} onChange={set("budget")}>
                    <option value="">Chọn ngân sách</option>
                    {form.budgetOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </F>
                <F label="Mô tả mong muốn" className="sm:col-span-2"><textarea className="input resize-none" rows={3} value={values.message} onChange={set("message")} placeholder="Phong cách yêu thích, số thành viên, thời gian dự kiến..." /></F>
                <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
                  <button type="submit" disabled={status === "loading"} className="btn-ink disabled:opacity-60">
                    {status === "loading" ? "Đang gửi..." : form.submitLabel} <Arrow />
                  </button>
                  {status === "error" && <p role="alert" className="text-sm text-red-700">Gửi chưa thành công, vui lòng thử lại.</p>}
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

function F({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </label>
  );
}
