import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKg(value: number) {
  return `${value.toLocaleString("en-IN")} kg`;
}

export function maskPhone(phone: string) {
  if (phone.length < 4) return phone;
  return `${phone.slice(0, 2)}******${phone.slice(-2)}`;
}
