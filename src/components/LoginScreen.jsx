import React from "react";
import { LogIn, TrendingUp } from "lucide-react";
import logoImage from "../assets/images/logo.jpg";

export default function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl overflow-hidden mb-4">
            <img src={logoImage} alt="AhrazTrade Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AhrazTrade</h1>
          <p className="text-zinc-400">Professional Trading Platform</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Connect to Upstox</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Real-time Market Data</h3>
                <p className="text-xs text-zinc-400 mt-1">Stream live prices, order book, and trades</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Advanced Charting</h3>
                <p className="text-xs text-zinc-400 mt-1">Interactive candlestick charts with live updates</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Portfolio Tracking</h3>
                <p className="text-xs text-zinc-400 mt-1">Monitor positions, P&L, and holdings</p>
              </div>
            </div>
          </div>

          <button
            onClick={onLogin}
            className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Login with Upstox
          </button>

          <p className="text-xs text-zinc-500 text-center mt-6">
            By continuing, you agree to Upstox's Terms of Service
          </p>
        </div>

        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-xs text-amber-200/80">
            <strong className="text-amber-200">Setup Required:</strong> Add your Upstox API credentials in the <code className="bg-zinc-900/50 px-1.5 py-0.5 rounded">.env</code> file before logging in.
          </p>
        </div>
      </div>
    </div>
  );
}
