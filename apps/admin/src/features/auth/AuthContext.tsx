import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/endpoints";
import type { User } from "../../api/types";
import { session } from "../../lib/session";

interface AuthValue {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(session.get()?.user ?? null);
  const qc = useQueryClient();

  useEffect(() => session.subscribe((s) => setUser(s?.user ?? null)), []);

  // Đồng bộ lại thông tin người dùng (vai trò có thể đã đổi)
  useEffect(() => {
    if (session.get()) {
      api.me().then((u) => {
        const s = session.get();
        if (s) session.set({ accessToken: s.accessToken, refreshToken: s.refreshToken, expiresIn: 0, user: u });
      }).catch(() => {});
    }
  }, []);

  const value: AuthValue = {
    user,
    isAdmin: user?.role === "ADMIN",
    async login(email, password) {
      session.set(await api.login(email, password));
    },
    async logout() {
      const s = session.get();
      session.clear();
      qc.clear();
      if (s) await api.logout(s.refreshToken).catch(() => {});
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
