import type { AuthResponse, User } from "../api/types";

/** Lưu phiên đăng nhập (xem DECISIONS D8). */
const KEY = "leadhub.session";

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: User;
}

type Listener = (s: Session | null) => void;
const listeners = new Set<Listener>();

function read(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

let current: Session | null = read();

export const session = {
  get: () => current,
  set(auth: AuthResponse) {
    current = { accessToken: auth.accessToken, refreshToken: auth.refreshToken, user: auth.user };
    try {
      localStorage.setItem(KEY, JSON.stringify(current));
    } catch {
      /* chế độ riêng tư: vẫn chạy trong bộ nhớ */
    }
    listeners.forEach((l) => l(current));
  },
  clear() {
    current = null;
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l(null));
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
