import { AnimatePresence, m } from "framer-motion";
import { config } from "../config";
import { useLeadForm } from "../lib/useLeadForm";
import { Reveal } from "../components/shared/Reveal";

export function TrialForm() {
  const { form, courses } = config;
  const { values, errors, status, set, onSubmit, reset } = useLeadForm(
    { name: "", phone: "", email: "", course: "", age: "", time: "" },
    form.endpoint,
    ["name", "phone"],
  );
  return (
    <section id="hoc-thu" className="px-3 pb-20 sm:px-5 lg:pb-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border-2 border-ink bg-primary px-5 py-14 text-white sm:px-10 lg:px-16 lg:py-20">
        <div className="dots pointer-events-none absolute inset-0 opacity-10 invert" aria-hidden />
        <div className="relative grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="chip text-ink">{form.eyebrow}</span>
            <h2 className="mt-5 text-4xl leading-tight font-bold sm:text-5xl">{form.title}</h2>
            <p className="mt-5 text-lg text-white/80">{form.subtitle}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {form.perks.map((p) => (
                <li key={p} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime text-xs font-bold text-ink">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="pop rounded-3xl bg-white p-6 text-ink sm:p-8">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <m.div key="ok" role="status" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="text-6xl" aria-hidden>🎉</div>
                  <p className="font-display mt-5 text-2xl font-bold">{form.successMessage}</p>
                  <button onClick={reset} className="btn-light mt-8">Đăng ký thêm</button>
                </m.div>
              ) : (
                <m.form key="f" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-4 sm:grid-cols-2">
                  <F label="Họ tên học viên / phụ huynh *" error={errors.name} full>
                    <input className="inp" autoComplete="name" value={values.name} onChange={set("name")} placeholder="Nguyễn Văn A" />
                  </F>
                  <F label="Số điện thoại *" error={errors.phone}>
                    <input className="inp" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} placeholder="09xx xxx xxx" />
                  </F>
                  <F label="Email" error={errors.email}>
                    <input className="inp" type="email" autoComplete="email" value={values.email} onChange={set("email")} placeholder="email@gmail.com" />
                  </F>
                  <F label="Khoá học quan tâm" full>
                    <select className="inp" value={values.course} onChange={set("course")}>
                      <option value="">Chọn khoá học</option>
                      {courses.items.map((c) => <option key={c.name}>{c.name}</option>)}
                    </select>
                  </F>
                  <F label="Độ tuổi">
                    <select className="inp" value={values.age} onChange={set("age")}>
                      <option value="">Chọn</option>
                      {form.ageOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </F>
                  <F label="Thời gian học thử">
                    <select className="inp" value={values.time} onChange={set("time")}>
                      <option value="">Chọn</option>
                      {form.timeOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </F>
                  <button type="submit" disabled={status === "loading"} className="btn-primary mt-2 w-full disabled:opacity-60 sm:col-span-2">
                    {status === "loading" ? "Đang gửi..." : form.submitLabel}
                  </button>
                  {status === "error" && <p role="alert" className="text-sm text-red-600 sm:col-span-2">Gửi chưa thành công, vui lòng thử lại hoặc gọi hotline.</p>}
                </m.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function F({ label, error, full, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="font-display mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
