import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MiniStat({ icon: Icon, label, value, sub, change, changePercent }) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0 || change === undefined;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 flex items-center gap-3">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
        change !== undefined 
          ? isPositive 
            ? 'bg-green-500/10' 
            : isNegative 
            ? 'bg-red-500/10' 
            : 'bg-zinc-100 dark:bg-zinc-800'
          : 'bg-zinc-100 dark:bg-zinc-800'
      }`}>
        <Icon className={`h-5 w-5 ${
          change !== undefined 
            ? isPositive 
              ? 'text-green-500' 
              : isNegative 
              ? 'text-red-500' 
              : ''
            : ''
        }`} />
      </div>
      <div className="flex-1">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
        <div className="font-semibold">{value}</div>
        {(change !== undefined || sub) && (
          <div className="flex items-center gap-1 text-xs mt-0.5">
            {change !== undefined ? (
              <span className={`flex items-center gap-0.5 font-medium ${
                isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-zinc-500'
              }`}>
                {isPositive && <TrendingUp className="h-3 w-3" />}
                {isNegative && <TrendingDown className="h-3 w-3" />}
                {isNeutral && <Minus className="h-3 w-3" />}
                {isPositive && '+'}{change.toFixed(2)}
                {changePercent !== undefined && ` (${isPositive ? '+' : ''}${changePercent.toFixed(2)}%)`}
              </span>
            ) : (
              <span className="text-zinc-500 dark:text-zinc-400">{sub}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
