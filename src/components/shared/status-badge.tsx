import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, "default" | "accent" | "success" | "danger" | "outline"> = {
    listed: "default",
    matched: "accent",
    requested: "outline",
    accepted: "default",
    paid: "success",
    assigned: "accent",
    picked_up: "accent",
    in_transit: "accent",
    delivered: "success",
    cancelled: "danger",
    disputed: "danger",
    open: "danger",
    resolved: "success",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        map[status] === "success" && "bg-emerald-100 text-emerald-800",
        map[status] === "danger" && "bg-red-100 text-red-800",
        map[status] === "accent" && "bg-amber-100 text-amber-800",
        map[status] === "default" && "bg-primary/10 text-primary",
        (!map[status] || map[status] === "outline") && "border border-border text-foreground",
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
