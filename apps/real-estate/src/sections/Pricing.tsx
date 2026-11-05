import { config } from "../config";
import { Heading } from "./Heading";

export function Pricing() {
  const { pricing } = config;
  return (
    <section id="bang-gia" className="py-24 lg:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Heading title={pricing.title} center />
        <div className="mt-16 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-primary/50 text-[11px] tracking-[0.2em] text-muted uppercase">
                <th scope="col" className="py-4 font-normal">Loại căn</th>
                <th scope="col" className="py-4 font-normal">Diện tích</th>
                <th scope="col" className="py-4 font-normal">Giá từ</th>
                <th scope="col" className="py-4 text-right font-normal">Đơn giá</th>
              </tr>
            </thead>
            <tbody>
              {pricing.rows.map((r) => (
                <tr key={r.type} className="group border-b border-ink/10 transition-colors hover:bg-surface">
                  <th scope="row" className="font-display py-6 text-2xl font-normal">{r.type}</th>
                  <td className="py-6 text-ink/75">{r.area}</td>
                  <td className="font-display py-6 text-3xl text-primary">{r.price}</td>
                  <td className="py-6 text-right text-sm text-ink/60">{r.perM2}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-muted">{pricing.disclaimer}</p>
        </div>
        <div className="mt-16 grid gap-px bg-ink/10 md:grid-cols-3">
          {pricing.policies.map((p) => (
            <div key={p.title} className="bg-bg p-8 text-center">
              <div className="font-display text-3xl text-primary">{p.title}</div>
              <p className="mt-3 text-sm text-ink/70">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href="#dang-ky" className="btn-gold">Nhận bảng giá chi tiết</a>
        </div>
      </div>
    </section>
  );
}
