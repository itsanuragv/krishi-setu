"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ResponsiveDataView<T>({
  items,
  columns,
  renderCard,
  keyFn,
}: {
  items: T[];
  columns: { header: string; cell: (item: T) => ReactNode }[];
  renderCard: (item: T) => ReactNode;
  keyFn: (item: T) => string;
}) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <div key={keyFn(item)}>{renderCard(item)}</div>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              {columns.map((col) => (
                <th key={col.header} className="px-3 py-2 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={keyFn(item)} className="border-b border-border/70">
                {columns.map((col) => (
                  <td key={col.header} className={cn("px-3 py-3")}>
                    {col.cell(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
