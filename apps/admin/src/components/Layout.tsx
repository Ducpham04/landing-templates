import { LayoutDashboard, LogOut, Globe, Users, Inbox } from "lucide-react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const NAV = [
  { to: "/", label: "Tổng quan", icon: LayoutDashboard, end: true, admin: false },
  { to: "/leads", label: "Lead", icon: Inbox, end: false, admin: false },
  { to: "/sites", label: "Landing", icon: Globe, end: false, admin: true },
  { to: "/users", label: "Nhân viên", icon: Users, end: false, admin: true },
];

export function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  const items = NAV.filter((n) => !n.admin || isAdmin);

  return (
    <div className="min-h-svh lg:pl-60">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center gap-2 px-5 text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm text-primary-fg">L</span>
          LeadHub
        </div>
        <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Chính">
          {items.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary-soft text-primary" : "text-ink hover:bg-ink/5"
                }`
              }
            >
              <n.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium">{user.fullName}</p>
            <p className="truncate text-xs text-muted">{user.role === "ADMIN" ? "Quản trị" : "Tư vấn viên"} · {user.email}</p>
          </div>
          <button onClick={logout} className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium hover:bg-ink/5">
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden /> Đăng xuất
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
        <span className="flex items-center gap-2 font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-xs text-primary-fg">L</span>
          LeadHub
        </span>
        <button onClick={logout} className="flex h-10 items-center gap-2 rounded-lg px-2 text-sm text-muted" aria-label="Đăng xuất">
          <LogOut className="h-[18px] w-[18px]" aria-hidden />
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-5 pb-24 sm:px-6 lg:pt-8 lg:pb-10">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }} aria-label="Điều hướng">
        {items.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) => `flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium ${isActive ? "text-primary" : "text-muted"}`}
          >
            <n.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium">Bạn không có quyền truy cập trang này</p>
        <a href="/" className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4">Về Tổng quan</a>
      </div>
    );
  }
  return <>{children}</>;
}
