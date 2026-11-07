import { AnimatePresence, m } from "framer-motion";
import { config } from "../config";
import { useLeadForm } from "../lib/useLeadForm";
import { SmartImage } from "../components/shared/SmartImage";

export function Register() {
  const { form } = config;
  const { values, errors, status, set, onSubmit, reset } = useLeadForm(
    { name: "", phone: "", email: "", interest: "", message: "", website: "" },
    form.endpoint,
    ["name", "phone"],
  );

  return (
    <section id="dang-ky" className="relative overflow-hidden py-24 lg:py-36">
      <div className="absolute inset-0">
        <SmartImage src={config.amenities.featured[1].image} alt="" maxWidth={1440} className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/80 to-bg" />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <div className="gold-line h-px w-24" />
          <h2 className="font-display mt-6 text-4xl leading-tight sm:text-5xl lg:text-6xl">{form.title}</h2>
          <p className="mt-6 max-w-md leading-relaxed text-ink/75">{form.subtitle}</p>
          <div className="mt-10 space-y-3 text-sm">
            <p><span className="text-muted">Hotline · </span><a className="text-primary" href={`tel:${config.contact.phone}`}>{config.contact.hotline}</a></p>
            <p><span className="text-muted">Email · </span><a href={`mailto:${config.contact.email}`}>{config.contact.email}</a></p>
          </div>
        </div>

        <div className="border border-primary/30 bg-bg p-8 sm:p-12">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <m.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[360px] flex-col items-center justify-center text-center" role="status">
                <div className="grid h-16 w-16 place-items-center rounded-full border border-primary text-primary" aria-hidden><svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12.5l4.5 4.5L19 7" /></svg></div>
                <p className="font-display mt-6 text-2xl">{form.successMessage}</p>
                <button onClick={reset} className="mt-8 text-xs tracking-[0.2em] text-muted uppercase underline-offset-4 hover:underline">Gửi đăng ký khác</button>
              </m.div>
            ) : (
              <m.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* Honeypot chống bot: người dùng thật không thấy ô này; backend bỏ qua lead nếu có giá trị */}
                <input type="text" name="website" value={values.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
                <Field label="Họ và tên *" error={errors.name}>
                  <input className="field" autoComplete="name" value={values.name} onChange={set("name")} placeholder="Nguyễn Văn A" />
                </Field>
                <Field label="Số điện thoại *" error={errors.phone}>
                  <input className="field" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} placeholder="09xx xxx xxx" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input className="field" type="email" autoComplete="email" value={values.email} onChange={set("email")} placeholder="email@domain.com" />
                </Field>
                <Field label="Quan tâm">
                  <select className="field [&>option]:bg-bg" value={values.interest} onChange={set("interest")}>
                    <option value="">Chọn loại căn hộ</option>
                    {form.interestOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Lời nhắn">
                  <textarea className="field resize-none" rows={2} value={values.message} onChange={set("message")} placeholder="Thời gian thuận tiện để liên hệ..." />
                </Field>
                <button type="submit" disabled={status === "loading"} className="btn-gold w-full disabled:opacity-60">
                  {status === "loading" ? "Đang gửi..." : form.submitLabel}
                </button>
                {status === "error" && <p className="text-sm text-red-400" role="alert">Gửi chưa thành công, vui lòng thử lại hoặc gọi hotline.</p>}
                <p className="text-center text-xs text-muted">{form.privacy}</p>
              </m.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.2em] text-muted uppercase">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
