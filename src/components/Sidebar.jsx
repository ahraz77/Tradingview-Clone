import React from "react";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { classNames, fmtPrice } from "../utils/helpers";

export default function Sidebar({ list, onSelect, active }) {
  return (
    <div className="hidden lg:flex flex-col gap-3 p-3 border-r border-zinc-200 dark:border-zinc-800 w-64 shrink-0 overflow-y-auto">
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 px-2 flex items-center justify-between">
        <span>Watchlist</span>
        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
          {list.length} stocks
        </span>
      </div>
      {list.map((it) => {
        const isPositive = it.chg >= 0;
        const hasPrice = it.ltp && it.ltp > 0;
        
        return (
          <button
            key={it.ticker}
            onClick={() => onSelect(it.ticker)}
            className={classNames(
              "group text-left px-3 py-2.5 rounded-xl border hover:shadow-sm transition-all",
              active === it.ticker
                ? "border-indigo-500/40 bg-indigo-50 dark:bg-indigo-950/30"
                : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="font-semibold tracking-tight">{it.ticker}</div>
              {hasPrice ? (
                <div className="text-sm font-semibold">₹{fmtPrice(it.ltp)}</div>
              ) : (
                <div className="text-xs text-zinc-400 flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></div>
                  No data
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{it.name}</div>
              {hasPrice && (
                <div className={classNames(
                  "text-xs font-medium flex items-center gap-0.5",
                  isPositive ? "text-emerald-500" : "text-rose-500"
                )}>
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isPositive ? "+" : ""}{it.chg.toFixed(2)}%
                </div>
              )}
            </div>
          </button>
        );
      })}
      <button className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
        <Plus className="h-4 w-4"/> Add symbol
      </button>
    </div>
  );
}
