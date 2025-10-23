import React from "react";
import { fmtPrice } from "../utils/helpers";

export default function Trades({ items = [] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">Recent Trades</div>
        <div className="p-4 text-center text-sm text-zinc-500">
          No recent trades
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">Recent Trades</div>
      <div className="max-h-64 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
        {items.map((t, i) => (
          <div key={i} className="px-3 py-1.5 flex justify-between">
            <span className={t.side === "buy" ? "text-emerald-500" : "text-rose-500"}>{t.side.toUpperCase()}</span>
            <span>{fmtPrice(t.price)}</span>
            <span>{t.size}</span>
            <span className="text-zinc-500">{new Date(t.time * 1000).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
