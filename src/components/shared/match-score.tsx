import type { MatchBreakdown } from "@/lib/schemas/match";

const LABELS: Record<keyof MatchBreakdown, string> = {
  quantity: "Quantity",
  price: "Price",
  location: "Location",
  quality: "Quality",
  trust: "Trust",
};

export function MatchScore({
  score,
  breakdown,
}: {
  score: number;
  breakdown: MatchBreakdown;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <p className="text-sm text-muted-foreground">Match score</p>
        <p className="font-display text-3xl font-semibold text-primary">{score}</p>
      </div>
      <ul className="space-y-2">
        {(Object.keys(LABELS) as (keyof MatchBreakdown)[]).map((key) => (
          <li key={key}>
            <div className="mb-1 flex justify-between text-xs">
              <span>{LABELS[key]}</span>
              <span>{breakdown[key]}/22</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, (breakdown[key] / 22) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
