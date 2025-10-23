import React from "react";
import { fmtPrice } from "../utils/helpers";

export default function Portfolio({ rows = [] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">Positions</div>
        <div className="p-4 text-center text-sm text-zinc-500">
          No open positions
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">Positions</div>
      <div className="text-xs">
        <div className="grid grid-cols-6 px-3 py-2 text-zinc-500 dark:text-zinc-400">
          <div>Symbol</div><div>Qty</div><div>Avg</div><div>LTP</div><div>P&amp;L</div><div>Δ Today</div>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-6 px-3 py-2">
              <div className="font-medium">{r.symbol}</div>
              <div>{r.qty}</div>
              <div>{fmtPrice(r.avg)}</div>
              <div>{fmtPrice(r.ltp)}</div>
              <div className={r.pnl >= 0 ? "text-emerald-500" : "text-rose-500"}>{fmtPrice(r.pnl)}</div>
              <div className={r.delta >= 0 ? "text-emerald-500" : "text-rose-500"}>{r.delta.toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
