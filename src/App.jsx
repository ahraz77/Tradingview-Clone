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
import upstoxService from "./services/upstoxService";

// Timeframe to interval mapping for Upstox API
// Note: Intraday API only supports 1minute and 30minute
// Historical API supports: 1minute, 30minute, day, week, month
const TIMEFRAME_INTERVALS = {
  "1m": "1minute",
  "5m": "30minute",  // Use 30min as closest to 5min
  "15m": "30minute",
  "1h": "30minute",
  "4h": "day",
  "1D": "day",
};

function App() {
  const [dark, setDark] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [timeframe, setTimeframe] = useState("5m");
  
  // Authentication
  const { isAuthenticated, isLoading: authLoading, login, logout, handleCallback } = useUpstoxAuth();
  
  // Check if we're on the callback page
  const isCallbackPage = window.location.pathname === '/callback';
  
  // Get instrument key for selected symbol
  const instrumentKey = COMMON_SYMBOLS[selectedSymbol] || COMMON_SYMBOLS.RELIANCE;
  
  // Debug: Log authentication and instrument key
  useEffect(() => {
    console.log('🔍 Debug Info:', {
      isAuthenticated,
      selectedSymbol,
      instrumentKey,
      timeframe
    });
  }, [isAuthenticated, selectedSymbol, instrumentKey, timeframe]);
  
  // Fetch historical data for charts
  const { data: chartData, isLoading: chartLoading, error: chartError } = useHistoricalData(
    instrumentKey, // Always fetch data, don't wait for auth since we have token
    TIMEFRAME_INTERVALS[timeframe]
  );
  
  // Debug: Log chart data
  useEffect(() => {
    console.log('📊 Chart Data:', { 
      length: chartData?.length || 0, 
      loading: chartLoading,
      error: chartError,
      firstCandle: chartData?.[0]
    });
  }, [chartData, chartLoading, chartError]);
  
  // Get live market data
  const { data: liveData, error: liveError } = useMarketData(instrumentKey); // Always connect
  
  // Debug: Log live data
  useEffect(() => {
    if (liveData) {
      console.log('💹 Live Data:', liveData);
    }
    if (liveError) {
      console.error('❌ Live Data Error:', liveError);
    }
  }, [liveData, liveError]);
  
  // Get positions
  const { positions } = usePositions();
  
  // Get trades
  const { trades: recentTrades } = useTrades();
  
  // Watchlist with live data - All 210+ stocks
  const [watchlist, setWatchlist] = useState([
    // Indices
    { ticker: "NIFTY", name: "Nifty 50 Index", instrumentKey: COMMON_SYMBOLS.NIFTY, chg: 0, ltp: 0 },
    { ticker: "BANKNIFTY", name: "Nifty Bank", instrumentKey: COMMON_SYMBOLS.BANKNIFTY, chg: 0, ltp: 0 },
    { ticker: "NIFTYMIDCAP", name: "Nifty Midcap 100", instrumentKey: COMMON_SYMBOLS.NIFTYMIDCAP, chg: 0, ltp: 0 },
    { ticker: "NIFTYIT", name: "Nifty IT", instrumentKey: COMMON_SYMBOLS.NIFTYIT, chg: 0, ltp: 0 },
    
    // Banking & Financial Services
    { ticker: "HDFCBANK", name: "HDFC Bank", instrumentKey: COMMON_SYMBOLS.HDFCBANK, chg: 0, ltp: 0 },
    { ticker: "ICICIBANK", name: "ICICI Bank", instrumentKey: COMMON_SYMBOLS.ICICIBANK, chg: 0, ltp: 0 },
    { ticker: "SBIN", name: "State Bank", instrumentKey: COMMON_SYMBOLS.SBIN, chg: 0, ltp: 0 },
    { ticker: "KOTAKBANK", name: "Kotak Bank", instrumentKey: COMMON_SYMBOLS.KOTAKBANK, chg: 0, ltp: 0 },
    { ticker: "AXISBANK", name: "Axis Bank", instrumentKey: COMMON_SYMBOLS.AXISBANK, chg: 0, ltp: 0 },
    { ticker: "INDUSINDBK", name: "IndusInd Bank", instrumentKey: COMMON_SYMBOLS.INDUSINDBK, chg: 0, ltp: 0 },
    { ticker: "BAJFINANCE", name: "Bajaj Finance", instrumentKey: COMMON_SYMBOLS.BAJFINANCE, chg: 0, ltp: 0 },
    { ticker: "BAJAJFINSV", name: "Bajaj Finserv", instrumentKey: COMMON_SYMBOLS.BAJAJFINSV, chg: 0, ltp: 0 },
    { ticker: "HDFCLIFE", name: "HDFC Life", instrumentKey: COMMON_SYMBOLS.HDFCLIFE, chg: 0, ltp: 0 },
    { ticker: "SBILIFE", name: "SBI Life", instrumentKey: COMMON_SYMBOLS.SBILIFE, chg: 0, ltp: 0 },
    { ticker: "ICICIGI", name: "ICICI Lombard", instrumentKey: COMMON_SYMBOLS.ICICIGI, chg: 0, ltp: 0 },
    { ticker: "BAJAJHLDNG", name: "Bajaj Holdings", instrumentKey: COMMON_SYMBOLS.BAJAJHLDNG, chg: 0, ltp: 0 },
    { ticker: "PNB", name: "Punjab Natl Bank", instrumentKey: COMMON_SYMBOLS.PNB, chg: 0, ltp: 0 },
    { ticker: "BANKBARODA", name: "Bank of Baroda", instrumentKey: COMMON_SYMBOLS.BANKBARODA, chg: 0, ltp: 0 },
    { ticker: "CANBK", name: "Canara Bank", instrumentKey: COMMON_SYMBOLS.CANBK, chg: 0, ltp: 0 },
    { ticker: "UNIONBANK", name: "Union Bank", instrumentKey: COMMON_SYMBOLS.UNIONBANK, chg: 0, ltp: 0 },
    { ticker: "IDFCFIRSTB", name: "IDFC First Bank", instrumentKey: COMMON_SYMBOLS.IDFCFIRSTB, chg: 0, ltp: 0 },
    { ticker: "FEDERALBNK", name: "Federal Bank", instrumentKey: COMMON_SYMBOLS.FEDERALBNK, chg: 0, ltp: 0 },
    { ticker: "BANDHANBNK", name: "Bandhan Bank", instrumentKey: COMMON_SYMBOLS.BANDHANBNK, chg: 0, ltp: 0 },
    { ticker: "RBLBANK", name: "RBL Bank", instrumentKey: COMMON_SYMBOLS.RBLBANK, chg: 0, ltp: 0 },
    { ticker: "AUBANK", name: "AU Small Finance", instrumentKey: COMMON_SYMBOLS.AUBANK, chg: 0, ltp: 0 },
    { ticker: "CHOLAFIN", name: "Cholamandalam", instrumentKey: COMMON_SYMBOLS.CHOLAFIN, chg: 0, ltp: 0 },
    { ticker: "MUTHOOTFIN", name: "Muthoot Finance", instrumentKey: COMMON_SYMBOLS.MUTHOOTFIN, chg: 0, ltp: 0 },
    { ticker: "PNBHOUSING", name: "PNB Housing", instrumentKey: COMMON_SYMBOLS.PNBHOUSING, chg: 0, ltp: 0 },
    { ticker: "M_MFIN", name: "M&M Financial", instrumentKey: COMMON_SYMBOLS.M_MFIN, chg: 0, ltp: 0 },
    
    // IT & Technology
    { ticker: "TCS", name: "Tata Consultancy", instrumentKey: COMMON_SYMBOLS.TCS, chg: 0, ltp: 0 },
    { ticker: "INFY", name: "Infosys", instrumentKey: COMMON_SYMBOLS.INFY, chg: 0, ltp: 0 },
    { ticker: "WIPRO", name: "Wipro", instrumentKey: COMMON_SYMBOLS.WIPRO, chg: 0, ltp: 0 },
    { ticker: "HCLTECH", name: "HCL Tech", instrumentKey: COMMON_SYMBOLS.HCLTECH, chg: 0, ltp: 0 },
    { ticker: "TECHM", name: "Tech Mahindra", instrumentKey: COMMON_SYMBOLS.TECHM, chg: 0, ltp: 0 },
    { ticker: "LTIM", name: "LTIMindtree", instrumentKey: COMMON_SYMBOLS.LTIM, chg: 0, ltp: 0 },
    { ticker: "COFORGE", name: "Coforge", instrumentKey: COMMON_SYMBOLS.COFORGE, chg: 0, ltp: 0 },
    { ticker: "PERSISTENT", name: "Persistent Sys", instrumentKey: COMMON_SYMBOLS.PERSISTENT, chg: 0, ltp: 0 },
    { ticker: "MPHASIS", name: "Mphasis", instrumentKey: COMMON_SYMBOLS.MPHASIS, chg: 0, ltp: 0 },
    { ticker: "LTTS", name: "L&T Technology", instrumentKey: COMMON_SYMBOLS.LTTS, chg: 0, ltp: 0 },
    { ticker: "TATAELXSI", name: "Tata Elxsi", instrumentKey: COMMON_SYMBOLS.TATAELXSI, chg: 0, ltp: 0 },
    { ticker: "OFSS", name: "Oracle Fin Serv", instrumentKey: COMMON_SYMBOLS.OFSS, chg: 0, ltp: 0 },
    { ticker: "SONATSOFTW", name: "Sonata Software", instrumentKey: COMMON_SYMBOLS.SONATSOFTW, chg: 0, ltp: 0 },
    { ticker: "MINDTREE", name: "Mindtree", instrumentKey: COMMON_SYMBOLS.MINDTREE, chg: 0, ltp: 0 },
    { ticker: "INTELLECT", name: "Intellect Design", instrumentKey: COMMON_SYMBOLS.INTELLECT, chg: 0, ltp: 0 },
    { ticker: "ZOMATO", name: "Zomato", instrumentKey: COMMON_SYMBOLS.ZOMATO, chg: 0, ltp: 0 },
    { ticker: "NAUKRI", name: "Naukri.com", instrumentKey: COMMON_SYMBOLS.NAUKRI, chg: 0, ltp: 0 },
    { ticker: "POLICYBZR", name: "PolicyBazaar", instrumentKey: COMMON_SYMBOLS.POLICYBZR, chg: 0, ltp: 0 },
    { ticker: "PAYTM", name: "Paytm", instrumentKey: COMMON_SYMBOLS.PAYTM, chg: 0, ltp: 0 },
    { ticker: "HAPPSTMNDS", name: "Happiest Minds", instrumentKey: COMMON_SYMBOLS.HAPPSTMNDS, chg: 0, ltp: 0 },
    
    // Oil & Gas
    { ticker: "RELIANCE", name: "Reliance Ind.", instrumentKey: COMMON_SYMBOLS.RELIANCE, chg: 0, ltp: 0 },
    { ticker: "ONGC", name: "ONGC", instrumentKey: COMMON_SYMBOLS.ONGC, chg: 0, ltp: 0 },
    { ticker: "IOC", name: "Indian Oil", instrumentKey: COMMON_SYMBOLS.IOC, chg: 0, ltp: 0 },
    { ticker: "BPCL", name: "BPCL", instrumentKey: COMMON_SYMBOLS.BPCL, chg: 0, ltp: 0 },
    { ticker: "HINDPETRO", name: "HPCL", instrumentKey: COMMON_SYMBOLS.HINDPETRO, chg: 0, ltp: 0 },
    { ticker: "GAIL", name: "GAIL India", instrumentKey: COMMON_SYMBOLS.GAIL, chg: 0, ltp: 0 },
    { ticker: "PETRONET", name: "Petronet LNG", instrumentKey: COMMON_SYMBOLS.PETRONET, chg: 0, ltp: 0 },
    { ticker: "ADANIGREEN", name: "Adani Green", instrumentKey: COMMON_SYMBOLS.ADANIGREEN, chg: 0, ltp: 0 },
    { ticker: "ADANIPOWER", name: "Adani Power", instrumentKey: COMMON_SYMBOLS.ADANIPOWER, chg: 0, ltp: 0 },
    { ticker: "ADANIENT", name: "Adani Enterprises", instrumentKey: COMMON_SYMBOLS.ADANIENT, chg: 0, ltp: 0 },
    { ticker: "ADANIPORTS", name: "Adani Ports", instrumentKey: COMMON_SYMBOLS.ADANIPORTS, chg: 0, ltp: 0 },
    { ticker: "ATGL", name: "Adani Total Gas", instrumentKey: COMMON_SYMBOLS.ATGL, chg: 0, ltp: 0 },
    { ticker: "GUJGASLTD", name: "Gujarat Gas", instrumentKey: COMMON_SYMBOLS.GUJGASLTD, chg: 0, ltp: 0 },
    { ticker: "IGL", name: "IGL", instrumentKey: COMMON_SYMBOLS.IGL, chg: 0, ltp: 0 },
    { ticker: "MGL", name: "Mahanagar Gas", instrumentKey: COMMON_SYMBOLS.MGL, chg: 0, ltp: 0 },
    
    // Automobiles
    { ticker: "MARUTI", name: "Maruti Suzuki", instrumentKey: COMMON_SYMBOLS.MARUTI, chg: 0, ltp: 0 },
    { ticker: "TATAMOTORS", name: "Tata Motors", instrumentKey: COMMON_SYMBOLS.TATAMOTORS, chg: 0, ltp: 0 },
    { ticker: "M_M", name: "M&M", instrumentKey: COMMON_SYMBOLS.M_M, chg: 0, ltp: 0 },
    { ticker: "BAJAJ_AUTO", name: "Bajaj Auto", instrumentKey: COMMON_SYMBOLS.BAJAJ_AUTO, chg: 0, ltp: 0 },
    { ticker: "EICHERMOT", name: "Eicher Motors", instrumentKey: COMMON_SYMBOLS.EICHERMOT, chg: 0, ltp: 0 },
    { ticker: "HEROMOTOCO", name: "Hero MotoCorp", instrumentKey: COMMON_SYMBOLS.HEROMOTOCO, chg: 0, ltp: 0 },
    { ticker: "TVSMOTOR", name: "TVS Motor", instrumentKey: COMMON_SYMBOLS.TVSMOTOR, chg: 0, ltp: 0 },
    { ticker: "ASHOKLEY", name: "Ashok Leyland", instrumentKey: COMMON_SYMBOLS.ASHOKLEY, chg: 0, ltp: 0 },
    { ticker: "ESCORTS", name: "Escorts Kubota", instrumentKey: COMMON_SYMBOLS.ESCORTS, chg: 0, ltp: 0 },
    { ticker: "BALKRISIND", name: "Balkrishna Ind", instrumentKey: COMMON_SYMBOLS.BALKRISIND, chg: 0, ltp: 0 },
    { ticker: "APOLLOTYRE", name: "Apollo Tyres", instrumentKey: COMMON_SYMBOLS.APOLLOTYRE, chg: 0, ltp: 0 },
    { ticker: "MRF", name: "MRF", instrumentKey: COMMON_SYMBOLS.MRF, chg: 0, ltp: 0 },
    { ticker: "CEAT", name: "CEAT", instrumentKey: COMMON_SYMBOLS.CEAT, chg: 0, ltp: 0 },
    { ticker: "MOTHERSON", name: "Samvardhana", instrumentKey: COMMON_SYMBOLS.MOTHERSON, chg: 0, ltp: 0 },
    { ticker: "BOSCHLTD", name: "Bosch", instrumentKey: COMMON_SYMBOLS.BOSCHLTD, chg: 0, ltp: 0 },
    { ticker: "EXIDEIND", name: "Exide Ind", instrumentKey: COMMON_SYMBOLS.EXIDEIND, chg: 0, ltp: 0 },
    { ticker: "AMARAJABAT", name: "Amara Raja", instrumentKey: COMMON_SYMBOLS.AMARAJABAT, chg: 0, ltp: 0 },
    { ticker: "BHARATFORG", name: "Bharat Forge", instrumentKey: COMMON_SYMBOLS.BHARATFORG, chg: 0, ltp: 0 },
    { ticker: "SUNDRMFAST", name: "Sundaram Fast", instrumentKey: COMMON_SYMBOLS.SUNDRMFAST, chg: 0, ltp: 0 },
    { ticker: "FINCABLES", name: "Finolex Cables", instrumentKey: COMMON_SYMBOLS.FINCABLES, chg: 0, ltp: 0 },
    
    // Pharmaceuticals
    { ticker: "SUNPHARMA", name: "Sun Pharma", instrumentKey: COMMON_SYMBOLS.SUNPHARMA, chg: 0, ltp: 0 },
    { ticker: "DRREDDY", name: "Dr Reddy's", instrumentKey: COMMON_SYMBOLS.DRREDDY, chg: 0, ltp: 0 },
    { ticker: "CIPLA", name: "Cipla", instrumentKey: COMMON_SYMBOLS.CIPLA, chg: 0, ltp: 0 },
    { ticker: "DIVISLAB", name: "Divi's Lab", instrumentKey: COMMON_SYMBOLS.DIVISLAB, chg: 0, ltp: 0 },
    { ticker: "BIOCON", name: "Biocon", instrumentKey: COMMON_SYMBOLS.BIOCON, chg: 0, ltp: 0 },
    { ticker: "AUROPHARMA", name: "Aurobindo Pharma", instrumentKey: COMMON_SYMBOLS.AUROPHARMA, chg: 0, ltp: 0 },
    { ticker: "LUPIN", name: "Lupin", instrumentKey: COMMON_SYMBOLS.LUPIN, chg: 0, ltp: 0 },
    { ticker: "ALKEM", name: "Alkem Lab", instrumentKey: COMMON_SYMBOLS.ALKEM, chg: 0, ltp: 0 },
    { ticker: "TORNTPHARM", name: "Torrent Pharma", instrumentKey: COMMON_SYMBOLS.TORNTPHARM, chg: 0, ltp: 0 },
    { ticker: "GLENMARK", name: "Glenmark", instrumentKey: COMMON_SYMBOLS.GLENMARK, chg: 0, ltp: 0 },
    { ticker: "IPCALAB", name: "IPCA Lab", instrumentKey: COMMON_SYMBOLS.IPCALAB, chg: 0, ltp: 0 },
    { ticker: "ZYDUSLIFE", name: "Zydus Lifesciences", instrumentKey: COMMON_SYMBOLS.ZYDUSLIFE, chg: 0, ltp: 0 },
    { ticker: "LAURUSLABS", name: "Laurus Labs", instrumentKey: COMMON_SYMBOLS.LAURUSLABS, chg: 0, ltp: 0 },
    { ticker: "SYNGENE", name: "Syngene Intl", instrumentKey: COMMON_SYMBOLS.SYNGENE, chg: 0, ltp: 0 },
    { ticker: "GRANULES", name: "Granules India", instrumentKey: COMMON_SYMBOLS.GRANULES, chg: 0, ltp: 0 },
    { ticker: "LALPATHLAB", name: "Lal PathLab", instrumentKey: COMMON_SYMBOLS.LALPATHLAB, chg: 0, ltp: 0 },
    { ticker: "APOLLOHOSP", name: "Apollo Hospital", instrumentKey: COMMON_SYMBOLS.APOLLOHOSP, chg: 0, ltp: 0 },
    { ticker: "MAXHEALTH", name: "Max Healthcare", instrumentKey: COMMON_SYMBOLS.MAXHEALTH, chg: 0, ltp: 0 },
    { ticker: "FORTIS", name: "Fortis Health", instrumentKey: COMMON_SYMBOLS.FORTIS, chg: 0, ltp: 0 },
    { ticker: "NATCOPHARM", name: "Natco Pharma", instrumentKey: COMMON_SYMBOLS.NATCOPHARM, chg: 0, ltp: 0 },
    
    // FMCG & Consumer
    { ticker: "HINDUNILVR", name: "Hindustan Unilever", instrumentKey: COMMON_SYMBOLS.HINDUNILVR, chg: 0, ltp: 0 },
    { ticker: "ITC", name: "ITC", instrumentKey: COMMON_SYMBOLS.ITC, chg: 0, ltp: 0 },
    { ticker: "NESTLEIND", name: "Nestle India", instrumentKey: COMMON_SYMBOLS.NESTLEIND, chg: 0, ltp: 0 },
    { ticker: "BRITANNIA", name: "Britannia", instrumentKey: COMMON_SYMBOLS.BRITANNIA, chg: 0, ltp: 0 },
    { ticker: "DABUR", name: "Dabur", instrumentKey: COMMON_SYMBOLS.DABUR, chg: 0, ltp: 0 },
    { ticker: "MARICO", name: "Marico", instrumentKey: COMMON_SYMBOLS.MARICO, chg: 0, ltp: 0 },
    { ticker: "GODREJCP", name: "Godrej Consumer", instrumentKey: COMMON_SYMBOLS.GODREJCP, chg: 0, ltp: 0 },
    { ticker: "COLPAL", name: "Colgate", instrumentKey: COMMON_SYMBOLS.COLPAL, chg: 0, ltp: 0 },
    { ticker: "PGHH", name: "P&G Hygiene", instrumentKey: COMMON_SYMBOLS.PGHH, chg: 0, ltp: 0 },
    { ticker: "TATACONSUM", name: "Tata Consumer", instrumentKey: COMMON_SYMBOLS.TATACONSUM, chg: 0, ltp: 0 },
    { ticker: "EMAMILTD", name: "Emami", instrumentKey: COMMON_SYMBOLS.EMAMILTD, chg: 0, ltp: 0 },
    { ticker: "VBL", name: "Varun Beverages", instrumentKey: COMMON_SYMBOLS.VBL, chg: 0, ltp: 0 },
    { ticker: "RADICO", name: "Radico Khaitan", instrumentKey: COMMON_SYMBOLS.RADICO, chg: 0, ltp: 0 },
    { ticker: "JYOTHYLAB", name: "Jyothy Labs", instrumentKey: COMMON_SYMBOLS.JYOTHYLAB, chg: 0, ltp: 0 },
    { ticker: "MCDOWELL_N", name: "United Spirits", instrumentKey: COMMON_SYMBOLS.MCDOWELL_N, chg: 0, ltp: 0 },
    { ticker: "JUBLFOOD", name: "Jubilant Food", instrumentKey: COMMON_SYMBOLS.JUBLFOOD, chg: 0, ltp: 0 },
    { ticker: "DEVYANI", name: "Devyani Intl", instrumentKey: COMMON_SYMBOLS.DEVYANI, chg: 0, ltp: 0 },
    { ticker: "DMART", name: "DMart", instrumentKey: COMMON_SYMBOLS.DMART, chg: 0, ltp: 0 },
    { ticker: "TRENT", name: "Trent", instrumentKey: COMMON_SYMBOLS.TRENT, chg: 0, ltp: 0 },
    
    // Metals & Mining
    { ticker: "TATASTEEL", name: "Tata Steel", instrumentKey: COMMON_SYMBOLS.TATASTEEL, chg: 0, ltp: 0 },
    { ticker: "HINDALCO", name: "Hindalco", instrumentKey: COMMON_SYMBOLS.HINDALCO, chg: 0, ltp: 0 },
    { ticker: "JSWSTEEL", name: "JSW Steel", instrumentKey: COMMON_SYMBOLS.JSWSTEEL, chg: 0, ltp: 0 },
    { ticker: "VEDL", name: "Vedanta", instrumentKey: COMMON_SYMBOLS.VEDL, chg: 0, ltp: 0 },
    { ticker: "COALINDIA", name: "Coal India", instrumentKey: COMMON_SYMBOLS.COALINDIA, chg: 0, ltp: 0 },
    { ticker: "SAIL", name: "SAIL", instrumentKey: COMMON_SYMBOLS.SAIL, chg: 0, ltp: 0 },
    { ticker: "JINDALSTEL", name: "Jindal Steel", instrumentKey: COMMON_SYMBOLS.JINDALSTEL, chg: 0, ltp: 0 },
    { ticker: "HINDZINC", name: "Hindustan Zinc", instrumentKey: COMMON_SYMBOLS.HINDZINC, chg: 0, ltp: 0 },
    { ticker: "NMDC", name: "NMDC", instrumentKey: COMMON_SYMBOLS.NMDC, chg: 0, ltp: 0 },
    { ticker: "NATIONALUM", name: "National Aluminium", instrumentKey: COMMON_SYMBOLS.NATIONALUM, chg: 0, ltp: 0 },
    { ticker: "MOIL", name: "MOIL", instrumentKey: COMMON_SYMBOLS.MOIL, chg: 0, ltp: 0 },
    { ticker: "RATNAMANI", name: "Ratnamani Metals", instrumentKey: COMMON_SYMBOLS.RATNAMANI, chg: 0, ltp: 0 },
    { ticker: "WELCORP", name: "Welspun Corp", instrumentKey: COMMON_SYMBOLS.WELCORP, chg: 0, ltp: 0 },
    { ticker: "WELSPUNIND", name: "Welspun India", instrumentKey: COMMON_SYMBOLS.WELSPUNIND, chg: 0, ltp: 0 },
    { ticker: "APLAPOLLO", name: "APL Apollo", instrumentKey: COMMON_SYMBOLS.APLAPOLLO, chg: 0, ltp: 0 },
    
    // Cement
    { ticker: "ULTRACEMCO", name: "UltraTech Cement", instrumentKey: COMMON_SYMBOLS.ULTRACEMCO, chg: 0, ltp: 0 },
    { ticker: "GRASIM", name: "Grasim", instrumentKey: COMMON_SYMBOLS.GRASIM, chg: 0, ltp: 0 },
    { ticker: "AMBUJACEM", name: "Ambuja Cement", instrumentKey: COMMON_SYMBOLS.AMBUJACEM, chg: 0, ltp: 0 },
    { ticker: "ACC", name: "ACC", instrumentKey: COMMON_SYMBOLS.ACC, chg: 0, ltp: 0 },
    { ticker: "SHREECEM", name: "Shree Cement", instrumentKey: COMMON_SYMBOLS.SHREECEM, chg: 0, ltp: 0 },
    { ticker: "DALMIACEM", name: "Dalmia Cement", instrumentKey: COMMON_SYMBOLS.DALMIACEM, chg: 0, ltp: 0 },
    { ticker: "JKCEMENT", name: "JK Cement", instrumentKey: COMMON_SYMBOLS.JKCEMENT, chg: 0, ltp: 0 },
    { ticker: "RAMCOCEM", name: "Ramco Cement", instrumentKey: COMMON_SYMBOLS.RAMCOCEM, chg: 0, ltp: 0 },
    { ticker: "HEIDELBERG", name: "Heidelberg Cement", instrumentKey: COMMON_SYMBOLS.HEIDELBERG, chg: 0, ltp: 0 },
    { ticker: "INDIACEM", name: "India Cements", instrumentKey: COMMON_SYMBOLS.INDIACEM, chg: 0, ltp: 0 },
    { ticker: "STARCEMENT", name: "Star Cement", instrumentKey: COMMON_SYMBOLS.STARCEMENT, chg: 0, ltp: 0 },
    { ticker: "ORIENTCEM", name: "Orient Cement", instrumentKey: COMMON_SYMBOLS.ORIENTCEM, chg: 0, ltp: 0 },
    
    // Power & Utilities
    { ticker: "POWERGRID", name: "Power Grid", instrumentKey: COMMON_SYMBOLS.POWERGRID, chg: 0, ltp: 0 },
    { ticker: "NTPC", name: "NTPC", instrumentKey: COMMON_SYMBOLS.NTPC, chg: 0, ltp: 0 },
    { ticker: "TATAPOWER", name: "Tata Power", instrumentKey: COMMON_SYMBOLS.TATAPOWER, chg: 0, ltp: 0 },
    { ticker: "TORNTPOWER", name: "Torrent Power", instrumentKey: COMMON_SYMBOLS.TORNTPOWER, chg: 0, ltp: 0 },
    { ticker: "NHPC", name: "NHPC", instrumentKey: COMMON_SYMBOLS.NHPC, chg: 0, ltp: 0 },
    { ticker: "SJVN", name: "SJVN", instrumentKey: COMMON_SYMBOLS.SJVN, chg: 0, ltp: 0 },
    { ticker: "CESC", name: "CESC", instrumentKey: COMMON_SYMBOLS.CESC, chg: 0, ltp: 0 },
    { ticker: "JPPOWER", name: "JP Power", instrumentKey: COMMON_SYMBOLS.JPPOWER, chg: 0, ltp: 0 },
    { ticker: "RPOWER", name: "Reliance Power", instrumentKey: COMMON_SYMBOLS.RPOWER, chg: 0, ltp: 0 },
    { ticker: "PFC", name: "PFC", instrumentKey: COMMON_SYMBOLS.PFC, chg: 0, ltp: 0 },
    { ticker: "RECLTD", name: "REC", instrumentKey: COMMON_SYMBOLS.RECLTD, chg: 0, ltp: 0 },
    
    // Telecom
    { ticker: "BHARTIARTL", name: "Bharti Airtel", instrumentKey: COMMON_SYMBOLS.BHARTIARTL, chg: 0, ltp: 0 },
    { ticker: "IDEA", name: "Vodafone Idea", instrumentKey: COMMON_SYMBOLS.IDEA, chg: 0, ltp: 0 },
    { ticker: "TTML", name: "Tata Teleservices", instrumentKey: COMMON_SYMBOLS.TTML, chg: 0, ltp: 0 },
    { ticker: "ROUTE", name: "Route Mobile", instrumentKey: COMMON_SYMBOLS.ROUTE, chg: 0, ltp: 0 },
    { ticker: "GTPL", name: "GTPL Hathway", instrumentKey: COMMON_SYMBOLS.GTPL, chg: 0, ltp: 0 },
    
    // Real Estate
    { ticker: "DLF", name: "DLF", instrumentKey: COMMON_SYMBOLS.DLF, chg: 0, ltp: 0 },
    { ticker: "GODREJPROP", name: "Godrej Properties", instrumentKey: COMMON_SYMBOLS.GODREJPROP, chg: 0, ltp: 0 },
    { ticker: "OBEROIRLTY", name: "Oberoi Realty", instrumentKey: COMMON_SYMBOLS.OBEROIRLTY, chg: 0, ltp: 0 },
    { ticker: "PRESTIGE", name: "Prestige Estates", instrumentKey: COMMON_SYMBOLS.PRESTIGE, chg: 0, ltp: 0 },
    { ticker: "PHOENIXLTD", name: "Phoenix Mills", instrumentKey: COMMON_SYMBOLS.PHOENIXLTD, chg: 0, ltp: 0 },
    { ticker: "SUNTECK", name: "Sunteck Realty", instrumentKey: COMMON_SYMBOLS.SUNTECK, chg: 0, ltp: 0 },
    { ticker: "SOBHA", name: "Sobha", instrumentKey: COMMON_SYMBOLS.SOBHA, chg: 0, ltp: 0 },
    { ticker: "BRIGADE", name: "Brigade Ent", instrumentKey: COMMON_SYMBOLS.BRIGADE, chg: 0, ltp: 0 },
    { ticker: "MAHLIFE", name: "Mahindra Life", instrumentKey: COMMON_SYMBOLS.MAHLIFE, chg: 0, ltp: 0 },
    { ticker: "LODHA", name: "Macrotech Dev", instrumentKey: COMMON_SYMBOLS.LODHA, chg: 0, ltp: 0 },
    { ticker: "CENTURYPLY", name: "Century Plyboards", instrumentKey: COMMON_SYMBOLS.CENTURYPLY, chg: 0, ltp: 0 },
    
    // Infrastructure & Construction
    { ticker: "LT", name: "L&T", instrumentKey: COMMON_SYMBOLS.LT, chg: 0, ltp: 0 },
    { ticker: "ABB", name: "ABB India", instrumentKey: COMMON_SYMBOLS.ABB, chg: 0, ltp: 0 },
    { ticker: "SIEMENS", name: "Siemens", instrumentKey: COMMON_SYMBOLS.SIEMENS, chg: 0, ltp: 0 },
    { ticker: "HAVELLS", name: "Havells", instrumentKey: COMMON_SYMBOLS.HAVELLS, chg: 0, ltp: 0 },
    { ticker: "CROMPTON", name: "Crompton Greaves", instrumentKey: COMMON_SYMBOLS.CROMPTON, chg: 0, ltp: 0 },
    { ticker: "VOLTAS", name: "Voltas", instrumentKey: COMMON_SYMBOLS.VOLTAS, chg: 0, ltp: 0 },
    { ticker: "BLUESTARCO", name: "Blue Star", instrumentKey: COMMON_SYMBOLS.BLUESTARCO, chg: 0, ltp: 0 },
    { ticker: "KEI", name: "KEI Industries", instrumentKey: COMMON_SYMBOLS.KEI, chg: 0, ltp: 0 },
    
    // Capital Goods
    { ticker: "TIINDIA", name: "Tube Investments", instrumentKey: COMMON_SYMBOLS.TIINDIA, chg: 0, ltp: 0 },
    { ticker: "THERMAX", name: "Thermax", instrumentKey: COMMON_SYMBOLS.THERMAX, chg: 0, ltp: 0 },
    { ticker: "CUMMINSIND", name: "Cummins India", instrumentKey: COMMON_SYMBOLS.CUMMINSIND, chg: 0, ltp: 0 },
    { ticker: "BEL", name: "Bharat Electronics", instrumentKey: COMMON_SYMBOLS.BEL, chg: 0, ltp: 0 },
    { ticker: "HAL", name: "HAL", instrumentKey: COMMON_SYMBOLS.HAL, chg: 0, ltp: 0 },
    { ticker: "COCHINSHIP", name: "Cochin Shipyard", instrumentKey: COMMON_SYMBOLS.COCHINSHIP, chg: 0, ltp: 0 },
    { ticker: "GRSE", name: "GRSE", instrumentKey: COMMON_SYMBOLS.GRSE, chg: 0, ltp: 0 },
    
    // Media & Entertainment
    { ticker: "ZEEL", name: "Zee Entertainment", instrumentKey: COMMON_SYMBOLS.ZEEL, chg: 0, ltp: 0 },
    { ticker: "SUNTV", name: "Sun TV", instrumentKey: COMMON_SYMBOLS.SUNTV, chg: 0, ltp: 0 },
    { ticker: "TV18BRDCST", name: "TV18 Broadcast", instrumentKey: COMMON_SYMBOLS.TV18BRDCST, chg: 0, ltp: 0 },
    { ticker: "PVR", name: "PVR", instrumentKey: COMMON_SYMBOLS.PVR, chg: 0, ltp: 0 },
    { ticker: "INOXLEISUR", name: "INOX Leisure", instrumentKey: COMMON_SYMBOLS.INOXLEISUR, chg: 0, ltp: 0 },
    { ticker: "NAZARA", name: "Nazara Tech", instrumentKey: COMMON_SYMBOLS.NAZARA, chg: 0, ltp: 0 },
    
    // Textiles & Apparel
    { ticker: "GOKEX", name: "Godfrey Phillips", instrumentKey: COMMON_SYMBOLS.GOKEX, chg: 0, ltp: 0 },
    { ticker: "AFFLE", name: "Affle India", instrumentKey: COMMON_SYMBOLS.AFFLE, chg: 0, ltp: 0 },
    { ticker: "ARVIND", name: "Arvind", instrumentKey: COMMON_SYMBOLS.ARVIND, chg: 0, ltp: 0 },
    { ticker: "RAYMOND", name: "Raymond", instrumentKey: COMMON_SYMBOLS.RAYMOND, chg: 0, ltp: 0 },
    { ticker: "RELAXO", name: "Relaxo Footwear", instrumentKey: COMMON_SYMBOLS.RELAXO, chg: 0, ltp: 0 },
    { ticker: "PAGEIND", name: "Page Industries", instrumentKey: COMMON_SYMBOLS.PAGEIND, chg: 0, ltp: 0 },
    { ticker: "RTNPOWER", name: "RattanIndia Power", instrumentKey: COMMON_SYMBOLS.RTNPOWER, chg: 0, ltp: 0 },
    { ticker: "SPICELOTH", name: "Spice Cloths", instrumentKey: COMMON_SYMBOLS.SPICELOTH, chg: 0, ltp: 0 },
  ]);

  // Update watchlist with live data for selected symbol
  useEffect(() => {
    if (liveData && liveData.changePercent !== undefined) {
      setWatchlist(prev => 
        prev.map(item => 
          item.ticker === selectedSymbol
            ? { 
                ...item, 
                chg: liveData.changePercent || 0,
                ltp: liveData.ltp || 0
              }
            : item
        )
      );
    }
  }, [liveData, selectedSymbol]);

  // Fetch live prices for all watchlist items periodically
  useEffect(() => {
    const fetchWatchlistPrices = async () => {
      try {
        // Get all unique instrument keys from watchlist
        const allInstrumentKeys = watchlist.map(item => item.instrumentKey);
        
        // Batch requests - Upstox allows max 500 instruments per request
        // But to be safe and faster, we'll batch in groups of 100
        const batchSize = 100;
        const batches = [];
        
        for (let i = 0; i < allInstrumentKeys.length; i += batchSize) {
          batches.push(allInstrumentKeys.slice(i, i + batchSize));
        }
        
        // Fetch all batches in parallel
        const batchResults = await Promise.all(
          batches.map(batch => upstoxService.getMarketQuotes(batch).catch(err => {
            console.error('Batch fetch error:', err);
            return {};
          }))
        );
        
        // Combine all results
        const allQuotes = batchResults.reduce((acc, quotes) => ({ ...acc, ...quotes }), {});
        
        console.log(`📊 Fetched ${Object.keys(allQuotes).length} quotes for ${allInstrumentKeys.length} stocks`);
        
        let successCount = 0;
        let failCount = 0;
        
        setWatchlist(prev => 
          prev.map(item => {
            // API returns keys with : instead of | and uses symbol name for stocks
            // Try multiple key formats to find the match
            let quote = null;
            
            // Try with : (colon) replacement
            const colonKey = item.instrumentKey.replace('|', ':');
            quote = allQuotes[colonKey];
            
            // If not found, search through all returned quotes
            if (!quote) {
              quote = Object.values(allQuotes).find(q => 
                q.instrument_token === item.instrumentKey
              );
            }
            
            if (quote) {
              const ltp = quote.last_price || 0;
              const closePrice = quote.ohlc?.close || ltp;
              const change = ltp - closePrice;
              const changePercent = closePrice > 0 ? (change / closePrice) * 100 : 0;
              
              successCount++;
              
              return {
                ...item,
                ltp,
                chg: changePercent
              };
            }
            
            failCount++;
            return item;
          })
        );
        
        console.log(`✅ Updated ${successCount} stocks, ❌ ${failCount} stocks have no data`);
      } catch (error) {
        console.error('Error fetching watchlist prices:', error);
      }
    };

    // Initial fetch
    fetchWatchlistPrices();
    
    // Update every 3 seconds during market hours
    const interval = setInterval(fetchWatchlistPrices, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Extract order book from live data
  const orderBook = liveData ? {
    bids: liveData.bids || [],
    asks: liveData.asks || []
  } : {
    bids: [],
    asks: []
  };

  // Format trades for display
  const formattedTrades = recentTrades.slice(0, 30).map(trade => ({
    side: trade.transaction_type?.toLowerCase() || 'buy',
    price: trade.average_price || 0,
    size: trade.quantity || 0,
    time: Math.floor(new Date(trade.trade_timestamp).getTime() / 1000),
  }));

  // Format positions for portfolio
  const formattedPositions = positions.map(pos => ({
    symbol: SYMBOL_DISPLAY[pos.instrument_key] || pos.trading_symbol,
    qty: pos.quantity || 0,
    avg: pos.average_price || 0,
    ltp: pos.last_price || 0,
    pnl: pos.pnl || 0,
    delta: pos.day_change_percentage || 0,
  }));

  // Handle dark mode
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  // Show callback screen
  if (isCallbackPage) {
    return <AuthCallback onCallback={handleCallback} />;
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <TopBar 
        dark={dark} 
        setDark={setDark} 
        symbol={selectedSymbol} 
        setSymbol={setSelectedSymbol} 
        onRefresh={() => window.location.reload()} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr_360px] gap-4 p-4 h-[calc(100vh-64px)]">
        <Sidebar 
          list={watchlist} 
          active={selectedSymbol} 
          onSelect={setSelectedSymbol} 
        />

        <div className="flex flex-col gap-3 min-h-0">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <Activity className="h-3.5 w-3.5"/> 
                <span className="font-semibold tracking-tight">{selectedSymbol}</span>
                {liveData && (
                  <span className={`text-xs ml-2 ${liveData.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {liveData.change >= 0 ? '+' : ''}{fmtPrice(liveData.change)} ({liveData.changePercent?.toFixed(2)}%)
                  </span>
                )}
              </div>
              <TimeframeBar timeframe={timeframe} setTimeframe={setTimeframe} />
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <MiniStat 
                icon={Wallet} 
                label="LTP" 
                value={`₹${fmtPrice(liveData?.ltp || chartData[chartData.length - 1]?.close || 0)}`}
                change={liveData?.change}
                changePercent={liveData?.changePercent}
              />
              <MiniStat 
                icon={Activity} 
                label="Open" 
                value={`₹${fmtPrice(liveData?.open || chartData[0]?.open || 0)}`}
                change={liveData?.ltp && liveData?.open ? liveData.ltp - liveData.open : undefined}
                changePercent={liveData?.ltp && liveData?.open ? ((liveData.ltp - liveData.open) / liveData.open) * 100 : undefined}
              />
              <MiniStat 
                icon={LineChart} 
                label="High" 
                value={`₹${fmtPrice(liveData?.high || Math.max(...(chartData.map((d) => d.high) || [0])))}`}
                change={liveData?.ltp && liveData?.high ? liveData.ltp - liveData.high : undefined}
                changePercent={liveData?.ltp && liveData?.high ? ((liveData.ltp - liveData.high) / liveData.high) * 100 : undefined}
              />
              <MiniStat 
                icon={CandlestickChart} 
                label="Low" 
                value={`₹${fmtPrice(liveData?.low || Math.min(...(chartData.map((d) => d.low) || [0])))}`}
                change={liveData?.ltp && liveData?.low ? liveData.ltp - liveData.low : undefined}
                changePercent={liveData?.ltp && liveData?.low ? ((liveData.ltp - liveData.low) / liveData.low) * 100 : undefined}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 flex-1 min-h-0">
            {chartLoading ? (
              <div className="h-full flex items-center justify-center text-zinc-500">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <div>Loading chart data...</div>
                </div>
              </div>
            ) : chartError ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md p-6">
                  <div className="text-amber-500 text-4xl mb-3">⚠️</div>
                  <div className="text-lg font-medium mb-2">Unable to Load Chart</div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{chartError}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 p-3 rounded-lg">
                    <div className="font-medium mb-1">Possible reasons:</div>
                    <div>• Market is closed (Trading hours: 9:15 AM - 3:30 PM IST)</div>
                    <div>• No data available for selected timeframe</div>
                    <div>• Check browser console for detailed errors</div>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : chartData.length > 0 ? (
              <ChartPanel data={chartData} dark={dark} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md p-6">
                  <div className="text-zinc-400 text-4xl mb-3">📊</div>
                  <div className="text-lg font-medium mb-2">No Chart Data</div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Market might be closed or no data available for {selectedSymbol}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3">
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <ListOrdered className="h-4 w-4"/> Quick Orders
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-xl border border-zinc-200 dark:border-zinc-800 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:border-emerald-500 transition-colors">
                  Buy Market
                </button>
                <button className="rounded-xl border border-zinc-200 dark:border-zinc-800 py-2 hover:bg-rose-50 dark:hover:bg-rose-950 hover:border-rose-500 transition-colors">
                  Sell Market
                </button>
                <button className="rounded-xl border border-zinc-200 dark:border-zinc-800 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  SL Order
                </button>
                <button className="rounded-xl border border-zinc-200 dark:border-zinc-800 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  Limit Order
                </button>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Live trading via Upstox API
              </div>
            </div>
            <Trades items={formattedTrades.length > 0 ? formattedTrades : []} />
            <Portfolio rows={formattedPositions.length > 0 ? formattedPositions : []} />
          </div>
        </div>

        <div className="flex flex-col gap-3 min-h-0">
          <OrderBook 
            bids={orderBook.bids.length > 0 ? orderBook.bids : []} 
            asks={orderBook.asks.length > 0 ? orderBook.asks : []} 
          />
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-sm font-medium mb-2">Notes</div>
            <textarea 
              className="w-full h-40 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Strategy notes, risk rules, to‑dos..." 
            />
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
