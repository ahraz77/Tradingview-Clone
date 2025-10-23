import React from "react";
import { ChevronDown, SlidersHorizontal, CandlestickChart } from "lucide-react";
import { classNames } from "../utils/helpers";

export default function TimeframeBar({ timeframe, setTimeframe }) {
  const tfs = ["1m", "5m", "15m", "1h", "4h", "1D"];
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tfs.map((tf) => (
        <button
          key={tf}
          onClick={() => setTimeframe(tf)}
          className={classNames(
            "px-2.5 py-1.5 rounded-lg text-xs border",
            timeframe === tf
              ? "border-indigo-500/40 bg-indigo-50 dark:bg-indigo-950/30"
              : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          )}
        >
          {tf}
        </button>
      ))}
      <button className="px-2.5 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-800 inline-flex items-center gap-1">
        <SlidersHorizontal className="h-3.5 w-3.5"/> Indicators <ChevronDown className="h-3 w-3"/>
      </button>
      <button className="px-2.5 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-800 inline-flex items-center gap-1">
        <CandlestickChart className="h-3.5 w-3.5"/> Style <ChevronDown className="h-3 w-3"/>
      </button>
    </div>
  );
}
