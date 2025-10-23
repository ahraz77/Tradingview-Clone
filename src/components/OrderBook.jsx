import React from "react";
import { fmtPrice } from "../utils/helpers";

export default function OrderBook({ bids = [], asks = [] }) {
  const max = Math.max(
    ...bids.map((b) => b.size || b.quantity || 0),
    ...asks.map((a) => a.size || a.quantity || 0),
    1
  );
  
  // Show message if no data
  if (bids.length === 0 && asks.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">Order Book</div>
        <div className="p-4 text-center text-sm text-zinc-500">
          No order book data available
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">Order Book</div>
      <div className="grid grid-cols-2 text-xs">
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {bids.slice(0, 10).map((b, i) => {
            const size = b.size || b.quantity || 0;
            return (
              <div key={i} className="relative px-3 py-1.5">
                <div className="absolute inset-y-0 right-0 bg-emerald-500/10" style={{ width: `${(size / max) * 100}%` }} />
                <div className="relative flex justify-between">
                  <span className="text-emerald-500">{fmtPrice(b.price)}</span>
                  <span>{size}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {asks.slice(0, 10).map((a, i) => {
            const size = a.size || a.quantity || 0;
            return (
              <div key={i} className="relative px-3 py-1.5">
                <div className="absolute inset-y-0 left-0 bg-rose-500/10" style={{ width: `${(size / max) * 100}%` }} />
                <div className="relative flex justify-between">
                  <span className="text-rose-500">{fmtPrice(a.price)}</span>
                  <span>{size}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
