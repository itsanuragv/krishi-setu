import { create } from "zustand";
import type { Role } from "@/lib/auth/roles";
import type { User } from "@/lib/schemas/user";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Strict`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Strict`;
}

type AuthState = {
  user: User | null;
  pendingPhone: string | null;
  pendingRole: Role | null;
  setPending: (phone: string, role?: Role) => void;
  setSession: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  pendingPhone: null,
  pendingRole: null,
  setPending: (phone, role) => set({ pendingPhone: phone, pendingRole: role ?? null }),
  setSession: (user) => {
    setCookie("ks_auth", "1");
    setCookie("ks_role", user.role);
    setCookie("ks_uid", user.id);
    set({ user, pendingPhone: null, pendingRole: null });
  },
  logout: () => {
    clearCookie("ks_auth");
    clearCookie("ks_role");
    clearCookie("ks_uid");
    set({ user: null, pendingPhone: null, pendingRole: null });
  },
}));
