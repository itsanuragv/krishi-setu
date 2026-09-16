export const ROLES = [
  "farmer",
  "consumer",
  "delivery",
  "admin",
  "bulk_buyer",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_HOME: Record<Role, string> = {
  farmer: "/farmer/dashboard",
  consumer: "/consumer/dashboard",
  delivery: "/delivery/dashboard",
  admin: "/admin/dashboard",
  bulk_buyer: "/buyer/dashboard",
};

export const ROLE_LABEL: Record<Role, string> = {
  farmer: "Farmer",
  consumer: "Consumer",
  delivery: "Delivery Partner",
  admin: "Admin",
  bulk_buyer: "FPO / Bulk Buyer",
};

export function isRole(value: string | undefined): value is Role {
  return !!value && (ROLES as readonly string[]).includes(value);
}
