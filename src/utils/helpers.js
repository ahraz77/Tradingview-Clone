// --- Utilities --------------------------------------------------------------
export const fmtPrice = (n) => (n === undefined ? "" : n.toLocaleString(undefined, { maximumFractionDigits: 2 }));

export const classNames = (...a) => a.filter(Boolean).join(" ");

// Generate mock OHLCV data to render initially
export function genMockOHLCV({ bars = 300, start = Date.now() - 1000 * 60 * 60 * 24 * 120, intervalMs = 60 * 1000 }) {
  const out = [];
  let last = 100 + Math.random() * 50;
  for (let i = 0; i < bars; i++) {
    const t = Math.round((start + i * intervalMs) / 1000);
    const drift = (Math.random() - 0.5) * 1.6;
    const open = last;
    const close = Math.max(2, open + drift);
    const high = Math.max(open, close) + Math.random() * 1.5;
    const low = Math.min(open, close) - Math.random() * 1.5;
    const volume = 100 + Math.round(Math.random() * 900);
    out.push({ time: t, open, high, low, close, volume });
    last = close;
  }
  return out;
}

// Map timeframe string to milliseconds
export const TF_TO_MS = {
  "1m": 60 * 1000,
  "5m": 5 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "4h": 4 * 60 * 60 * 1000,
  "1D": 24 * 60 * 60 * 1000,
};
