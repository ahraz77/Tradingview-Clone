import React, { useEffect, useMemo, useRef, useState } from "react";

export default function ChartPanel({ data, dark }) {
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 600, h: 360 });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect;
      setSize({ w: cr.width, h: cr.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const { candles, vols, minP, maxP } = useMemo(() => {
    if (!data?.length) return { candles: [], vols: [], minP: 0, maxP: 1 };
    const minP = Math.min(...data.map((d) => d.low));
    const maxP = Math.max(...data.map((d) => d.high));
    const vols = data.map((d) => d.volume ?? 0);
    return { candles: data, vols, minP, maxP };
  }, [data]);

  const pad = 10;
  const volH = Math.max(60, size.h * 0.2);
  const chartH = Math.max(0, size.h - volH - pad * 2);
  const n = Math.max(1, candles.length);
  const bw = Math.max(1, (size.w - pad * 2) / n * 0.7);
  const x = (i) => pad + (i + 0.5) * ((size.w - pad * 2) / n);
  const y = (p) => pad + (maxP - p) * (chartH / (maxP - minP || 1));

  const maxV = Math.max(1, ...vols);
  const yVol = (v) => size.h - pad - (v / maxV) * volH;

  return (
    <div ref={ref} className="relative h-full w-full">
      <svg width={size.w} height={size.h} className="absolute inset-0">
        {/* Grid */}
        <rect x={0} y={0} width={size.w} height={size.h} fill={dark ? "#09090b" : "#ffffff"} />
        {/* Price area clipping */}
        <g>
          {candles.map((d, i) => {
            const cx = x(i);
            const openY = y(d.open);
            const closeY = y(d.close);
            const highY = y(d.high);
            const lowY = y(d.low);
            const up = d.close >= d.open;
            const color = up ? "#10b981" : "#ef4444";
            const bodyY = Math.min(openY, closeY);
            const bodyH = Math.max(1, Math.abs(closeY - openY));
            return (
              <g key={i}>
                <line x1={cx} y1={highY} x2={cx} y2={lowY} stroke={color} strokeWidth={1} />
                <rect x={cx - bw / 2} y={bodyY} width={bw} height={bodyH} fill={color} rx={2} />
              </g>
            );
          })}
        </g>
        {/* Volume */}
        <g>
          {candles.map((d, i) => {
            const cx = x(i);
            const up = d.close >= d.open;
            const color = up ? "#10b981" : "#ef4444";
            const top = yVol(d.volume ?? 0);
            const base = size.h - pad;
            return <rect key={i} x={cx - bw / 2} y={top} width={bw} height={base - top} fill={color} opacity={0.4} />;
          })}
        </g>
      </svg>
    </div>
  );
}
