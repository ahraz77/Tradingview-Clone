import React from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Settings,
  Search,
  RefreshCw,
  LayoutGrid,
  Bell,
  BookOpen,
} from "lucide-react";
import logoImage from "../assets/images/logo.jpg";

export default function TopBar({ dark, setDark, symbol, setSymbol, onRefresh }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
          <img src={logoImage} alt="AhrazTrade Logo" className="h-8 w-8 rounded-2xl object-cover" />
          <div className="font-semibold tracking-tight">AhrazTrade</div>
        </motion.div>
        <div className="hidden sm:flex items-center gap-2 ml-6 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800"><LayoutGrid className="h-3.5 w-3.5"/> Workspace</span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800"><BookOpen className="h-3.5 w-3.5"/> Paper Trading</span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800"><Bell className="h-3.5 w-3.5"/> Alerts</span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Search symbol: e.g. NIFTY, RELIANCE, BTCUSDT"
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button onClick={onRefresh} className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
          <RefreshCw className="h-4 w-4" />
        </button>
        <button onClick={() => setDark(!dark)} className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
