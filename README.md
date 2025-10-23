# AhrazTrade - Professional Trading Platform



A modern, real-time trading platform powered by **Upstox API v2** with live WebSocket market data streaming.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🚀 FeaturesCurrently, two official plugins are available:



✅ **Real-time Market Data** - Live price updates via WebSocket  - [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

✅ **Interactive Charts** - Candlestick charts with multiple timeframes  - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

✅ **Order Book** - Live bid/ask prices  

✅ **Portfolio Tracking** - Monitor positions and P&L  ## React Compiler

✅ **Trade History** - View recent trades  

✅ **Dark Mode** - Beautiful dark/light theme  The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

✅ **Responsive Design** - Works on all screen sizes  

## Expanding the ESLint configuration

## 📋 Setup Instructions

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

### 1. Get Upstox API Credentials

1. Visit [Upstox Developer Console](https://api.upstox.com/)
2. Create a new app
3. Note down your **API Key** (Client ID) and **API Secret** (Client Secret)
4. Set the **Redirect URI** to: `http://localhost:5173/callback`

### 2. Configure Environment Variables

Edit `.env` and add your credentials:
```env
VITE_UPSTOX_API_KEY=your_api_key_here
VITE_UPSTOX_API_SECRET=your_api_secret_here
VITE_UPSTOX_REDIRECT_URI=http://localhost:5173/callback
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and click "Login with Upstox"!

## 📖 Documentation

See the full documentation in the comments and code structure.

**Happy Trading!** 📈
# Tradingview-Clone
