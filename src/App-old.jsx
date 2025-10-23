import { useEffect, useState } from "react";
import {
  LineChart,
  CandlestickChart,
  Wallet,
  Activity,
  ListOrdered,
} from "lucide-react";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import TimeframeBar from "./components/TimeframeBar";
import ChartPanel from "./components/ChartPanel";
import MiniStat from "./components/MiniStat";
import OrderBook from "./components/OrderBook";
import Trades from "./components/Trades";
import Portfolio from "./components/Portfolio";
import LoginScreen from "./components/LoginScreen";
import AuthCallback from "./components/AuthCallback";
import { fmtPrice } from "./utils/helpers";
import { useUpstoxAuth, useHistoricalData, useMarketData, usePositions, useTrades } from "./hooks/useUpstox";
import { COMMON_SYMBOLS, SYMBOL_DISPLAY } from "./config/upstox.config";

function App() {
  const [dark, setDark] = useState(true);
  const [symbol, setSymbol] = useState("RELIANCE");
  const [timeframe, setTimeframe] = useState("5m");
  const [chartData, setChartData] = useState(() => genMockOHLCV({ bars: 240, intervalMs: TF_TO_MS["5m"] }));

  // Mock side panels data
  const watchlist = [
    { ticker: "NIFTY", name: "Nifty 50 Index", chg: 0.56 },
    { ticker: "BANKNIFTY", name: "Nifty Bank", chg: -0.23 },
    { ticker: "RELIANCE", name: "Reliance Ind.", chg: 1.12 },
    { ticker: "TCS", name: "Tata Consultancy", chg: 0.34 },
    { ticker: "HDFCBANK", name: "HDFC Bank", chg: -0.67 },
    { ticker: "BTCUSDT", name: "Bitcoin", chg: 2.45 },
  ];

  const bids = Array.from({ length: 10 }, (_, i) => ({ price: 2500 - i * 1.4, size: Math.round(Math.random() * 100) + 1 }));
  const asks = Array.from({ length: 10 }, (_, i) => ({ price: 2500 + i * 1.4, size: Math.round(Math.random() * 100) + 1 }));
  const trades = Array.from({ length: 30 }, (_, i) => ({
    side: Math.random() > 0.5 ? "buy" : "sell",
    price: 2500 + (Math.random() - 0.5) * 10,
    size: Math.round(Math.random() * 5) + 1,
    time: Math.round(Date.now() / 1000) - i * 17,
  }));
  const portfolioRows = [
    { symbol: "RELIANCE", qty: 15, avg: 2420.5, ltp: 2502.2, pnl: 122.4, delta: 1.54 },
    { symbol: "TCS", qty: 4, avg: 3850.0, ltp: 3922.5, pnl: 290.0, delta: 0.79 },
    { symbol: "INFY", qty: 10, avg: 1485.2, ltp: 1468.1, pnl: -171.0, delta: -0.62 },
  ];

  // When timeframe or symbol changes, regenerate mock data (placeholder for API)
  useEffect(() => {
    const ms = TF_TO_MS[timeframe] ?? TF_TO_MS["5m"];
    setChartData(genMockOHLCV({ bars: 240, intervalMs: ms }));
  }, [timeframe, symbol]);

  // Expose a simple hook for future WebSocket plug-in (Upstox)
  // Replace this function with your live data stream handler
  const handleIncomingTick = (tick) => {
    // tick: { timeMs, open, high, low, close, volume }
    setChartData((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      const tfMs = TF_TO_MS[timeframe] ?? TF_TO_MS["5m"];
      const bucket = Math.floor(tick.timeMs / tfMs) * tfMs;
      const bucketSec = Math.round(bucket / 1000);
      if (last.time === bucketSec) {
        // update last bar
        const updated = { ...last };
        updated.high = Math.max(updated.high, tick.high ?? tick.price ?? updated.high);
        updated.low = Math.min(updated.low, tick.low ?? tick.price ?? updated.low);
        if (tick.close !== undefined) updated.close = tick.close;
        if (tick.open !== undefined) updated.open = tick.open;
        if (tick.volume !== undefined) updated.volume = (last.volume ?? 0) + tick.volume;
        return [...prev.slice(0, -1), updated];
      }
      // new bar
      const open = tick.open ?? last.close;
      const close = tick.close ?? tick.price ?? open;
      const high = Math.max(open, close);
      const low = Math.min(open, close);
      const volume = tick.volume ?? 0;
      return [...prev, { time: bucketSec, open, high, low, close, volume }];
    });
  };

  // Handy global for debugging in the preview
  useEffect(() => {
    // @ts-ignore
    window.__pushTick = handleIncomingTick;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div className="h-screen w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <TopBar dark={dark} setDark={setDark} symbol={symbol} setSymbol={setSymbol} onRefresh={() => setChartData((d) => d.slice())} />

      <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr_360px] gap-4 p-4 h-[calc(100vh-64px)]">
        <Sidebar list={watchlist} active={symbol} onSelect={setSymbol} />

        <div className="flex flex-col gap-3 min-h-0">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <Activity className="h-3.5 w-3.5"/> <span className="font-semibold tracking-tight">{symbol}</span>
              </div>
              <TimeframeBar timeframe={timeframe} setTimeframe={setTimeframe} />
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <MiniStat icon={Wallet} label="LTP" value={`₹${fmtPrice(chartData.at(-1)?.close)}`} />
              <MiniStat icon={LineChart} label="High" value={`₹${fmtPrice(Math.max(...chartData.map((d) => d.high)))}`} />
              <MiniStat icon={CandlestickChart} label="Low" value={`₹${fmtPrice(Math.min(...chartData.map((d) => d.low)))}`} />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 flex-1 min-h-0">
            <ChartPanel data={chartData} dark={dark} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3">
              <div className="text-sm font-medium mb-2 flex items-center gap-2"><ListOrdered className="h-4 w-4"/> Quick Orders (mock)</div>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-xl border border-zinc-200 dark:border-zinc-800 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">Buy Market</button>
                <button className="rounded-xl border border-zinc-200 dark:border-zinc-800 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">Sell Market</button>
                <button className="rounded-xl border border-zinc-200 dark:border-zinc-800 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">SL</button>
                <button className="rounded-xl border border-zinc-200 dark:border-zinc-800 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">Limit</button>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Hook these to Upstox order APIs later.</div>
            </div>
            <Trades items={trades} />
            <Portfolio rows={portfolioRows} />
          </div>
        </div>

        <div className="flex flex-col gap-3 min-h-0">
          <OrderBook bids={bids} asks={asks} />
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-sm font-medium mb-2">Notes</div>
            <textarea className="w-full h-40 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent p-3 outline-none" placeholder="Strategy notes, risk rules, to‑dos..." />
          </div>
        </div>
      </div>

      {/* Developer helper: paste in console to simulate a live tick
        window.__pushTick({ timeMs: Date.now(), price: 2510, volume: 2 })
      */}
    </div>
  );
}

export default App
