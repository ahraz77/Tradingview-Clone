import { useState, useEffect, useCallback, useRef } from 'react';
import upstoxService from '../services/upstoxService';
import websocketService from '../services/websocketService';

/**
 * Hook for Upstox authentication
 */
export function useUpstoxAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      console.log('🔐 Checking authentication...');
      
      if (upstoxService.isAuthenticated()) {
        console.log('✅ Access token found, fetching profile...');
        const profile = await upstoxService.getProfile();
        console.log('👤 User profile:', profile);
        setUser(profile);
        setIsAuthenticated(true);
        console.log('✅ Authentication successful!');
      } else {
        console.warn('⚠️ No access token found');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('❌ Auth check failed:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    const authUrl = upstoxService.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleCallback = async (code) => {
    try {
      setIsLoading(true);
      await upstoxService.getAccessToken(code);
      await checkAuth();
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    upstoxService.logout();
    websocketService.disconnect();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    login,
    logout,
    handleCallback,
  };
}

/**
 * Hook for live market data via WebSocket
 */
export function useMarketData(instrumentKey) {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!instrumentKey) return;

    let isMounted = true;

    const connect = async () => {
      try {
        await websocketService.connect();
        
        const callback = (feedData) => {
          if (isMounted) {
            setData(feedData);
          }
        };

        websocketService.addSubscriber(instrumentKey, callback);
        websocketService.subscribe([instrumentKey], 'full');
        setIsConnected(true);

        return () => {
          websocketService.removeSubscriber(instrumentKey, callback);
          websocketService.unsubscribe([instrumentKey]);
        };
      } catch (err) {
        console.error('WebSocket connection failed:', err);
        setError(err.message);
      }
    };

    connect();

    return () => {
      isMounted = false;
    };
  }, [instrumentKey]);

  return { data, isConnected, error };
}

/**
 * Hook for historical candle data
 */
export function useHistoricalData(instrumentKey, interval = '5minute', days = 30) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!instrumentKey) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('📈 Fetching historical data:', { instrumentKey, interval });

        // For intraday data, use intraday endpoint (only supports 1minute and 30minute)
        if (['1minute', '30minute'].includes(interval)) {
          const candles = await upstoxService.getIntradayData(instrumentKey, interval);
          
          console.log('✅ Received candles:', candles?.length || 0);
          
          if (!candles || candles.length === 0) {
            console.warn('⚠️ No candle data received - market might be closed');
            setError('No data available. Market might be closed.');
            setData([]);
            return;
          }
          
          // Convert to OHLCV format
          const formattedData = candles.map(candle => ({
            time: Math.floor(new Date(candle[0]).getTime() / 1000),
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            volume: candle[5] || 0,
          })).reverse();
          
          console.log('📊 Formatted data:', formattedData.slice(0, 3));
          setData(formattedData);
        } else {
          // For historical data
          const toDate = new Date();
          const fromDate = new Date();
          fromDate.setDate(fromDate.getDate() - days);

          const candles = await upstoxService.getHistoricalData(
            instrumentKey,
            interval,
            fromDate.toISOString().split('T')[0],
            toDate.toISOString().split('T')[0]
          );

          if (!candles || candles.length === 0) {
            console.warn('⚠️ No historical data received');
            setError('No historical data available');
            setData([]);
            return;
          }

          const formattedData = candles.map(candle => ({
            time: Math.floor(new Date(candle[0]).getTime() / 1000),
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            volume: candle[5] || 0,
          })).reverse();

          setData(formattedData);
        }
      } catch (err) {
        console.error('❌ Error fetching historical data:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.message || 'Failed to fetch data');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [instrumentKey, interval, days]);

  return { data, isLoading, error };
}

/**
 * Hook for portfolio positions
 */
export function usePositions() {
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPositions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await upstoxService.getPositions();
      setPositions(data);
    } catch (err) {
      console.error('Error fetching positions:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  return { positions, isLoading, error, refresh: fetchPositions };
}

/**
 * Hook for order book
 */
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await upstoxService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = async (orderData) => {
    try {
      const result = await upstoxService.placeOrder(orderData);
      await fetchOrders(); // Refresh orders
      return result;
    } catch (err) {
      console.error('Error placing order:', err);
      throw err;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await upstoxService.cancelOrder(orderId);
      await fetchOrders(); // Refresh orders
    } catch (err) {
      console.error('Error canceling order:', err);
      throw err;
    }
  };

  return { orders, isLoading, error, placeOrder, cancelOrder, refresh: fetchOrders };
}

/**
 * Hook for trade history
 */
export function useTrades() {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrades = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await upstoxService.getTrades();
      setTrades(data);
    } catch (err) {
      console.error('Error fetching trades:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  return { trades, isLoading, error, refresh: fetchTrades };
}

/**
 * Hook for live chart updates
 */
export function useLiveChart(instrumentKey, initialData = []) {
  const [chartData, setChartData] = useState(initialData);
  const lastUpdateRef = useRef(Date.now());
  const { data: liveData } = useMarketData(instrumentKey);

  useEffect(() => {
    if (!liveData || !liveData.ltp) return;

    const now = Date.now();
    const timeDiff = now - lastUpdateRef.current;

    // Update every 1 second for smoother updates
    if (timeDiff < 1000) return;

    lastUpdateRef.current = now;

    setChartData(prev => {
      if (!prev.length) return prev;

      const lastCandle = prev[prev.length - 1];
      const currentTime = Math.floor(now / 1000);

      // Check if we need to create a new candle (based on timeframe)
      // For now, update the last candle
      const updatedCandle = {
        ...lastCandle,
        close: liveData.ltp,
        high: Math.max(lastCandle.high, liveData.ltp),
        low: Math.min(lastCandle.low, liveData.ltp),
        volume: liveData.volume || lastCandle.volume,
      };

      return [...prev.slice(0, -1), updatedCandle];
    });
  }, [liveData]);

  return { chartData, setChartData, liveData };
}
