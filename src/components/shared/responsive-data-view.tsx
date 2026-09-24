"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cascadeContainerVariants, cascadeItemVariants, appleSpring } from "@/lib/animations";

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
      {/* Mobile Card Cascade (Staggered Entry 0.05s) */}
      <motion.div
        variants={cascadeContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 md:hidden"
      >
        {items.map((item) => (
          <motion.div
            key={keyFn(item)}
            variants={cascadeItemVariants}
            whileHover={{ scale: 1.008, y: -2 }}
            transition={appleSpring}
            className="rounded-2xl"
          >
            {renderCard(item)}
          </motion.div>
        ))}
      </motion.div>

      {/* Desktop Pristine Frosted Glass Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/70 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.7)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {columns.map((col) => (
                  <th key={col.header} className="px-4 py-3.5 font-bold">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody
              variants={cascadeContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {items.map((item) => (
                <motion.tr
                  key={keyFn(item)}
                  variants={cascadeItemVariants}
                  className="border-b border-black/[0.04] dark:border-white/[0.04] hover:bg-emerald-500/[0.03] transition-colors duration-150 last:border-b-0"
                >
                  {columns.map((col) => (
                    <td key={col.header} className={cn("px-4 py-3.5 text-slate-800 dark:text-slate-200")}>
                      {col.cell(item)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>
    </>
  );
}
