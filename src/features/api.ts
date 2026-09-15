import { api } from "@/lib/api-client";
import type { User } from "@/lib/schemas/user";
import type { Product } from "@/lib/schemas/product";
import type { Match } from "@/lib/schemas/match";
import type { Order } from "@/lib/schemas/order";
import type { Delivery } from "@/lib/schemas/delivery";
import type { Dispute } from "@/lib/schemas/dispute";
import type { AdminKpi } from "@/lib/schemas/admin";
import type { Role } from "@/lib/auth/roles";

export const authApi = {
  sendOtp: (phone: string) => api<{ sent: boolean; demoHint?: string }>("/auth/otp", {
    method: "POST",
    body: JSON.stringify({ phone }),
  }),
  verify: (payload: {
    phone: string;
    otp: string;
    role?: Role;
    name?: string;
    district?: string;
    state?: string;
    village?: string;
    language?: "en" | "hi";
  }) => api<{ user: User }>("/auth/verify", { method: "POST", body: JSON.stringify(payload) }),
};

export const productApi = {
  list: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params).toString()}` : "";
    return api<{ items: Product[]; total: number }>(`/products${q}`);
  },
  get: (id: string) => api<{ product: Product }>(`/products/${id}`),
  create: (body: unknown) =>
    api<{ product: Product }>("/products", { method: "POST", body: JSON.stringify(body) }),
};

export const matchApi = {
  list: (productId?: string) => {
    const q = productId ? `?productId=${productId}` : "";
    return api<{ items: Match[] }>(`/matches${q}`);
  },
};

export const orderApi = {
  list: () => api<{ items: Order[] }>("/orders"),
  get: (id: string) => api<{ order: Order }>(`/orders/${id}`),
  create: (body: unknown) =>
    api<{ order: Order }>("/orders", { method: "POST", body: JSON.stringify(body) }),
  patch: (id: string, body: unknown) =>
    api<{ order: Order }>(`/orders/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
};

export const deliveryApi = {
  list: () => api<{ items: Delivery[] }>("/deliveries"),
};

export const disputeApi = {
  list: () => api<{ items: Dispute[] }>("/disputes"),
  create: (body: unknown) =>
    api<{ dispute: Dispute }>("/disputes", { method: "POST", body: JSON.stringify(body) }),
};

export const adminApi = {
  kpis: () => api<AdminKpi>("/admin/kpis"),
  users: () => api<{ items: User[] }>("/admin/users"),
};

export const paymentApi = {
  create: (body: unknown) => api<{ payment: { id: string } }>("/payments", {
    method: "POST",
    body: JSON.stringify(body),
  }),
};
