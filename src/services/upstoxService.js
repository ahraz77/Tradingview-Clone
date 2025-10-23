import axios from 'axios';
import { UPSTOX_CONFIG } from '../config/upstox.config';

class UpstoxService {
  constructor() {
    // Try to get token from localStorage, then from environment variable
    this.accessToken = localStorage.getItem('upstox_access_token') || import.meta.env.VITE_UPSTOX_ACCESS_TOKEN;
    
    // If token exists in env but not in localStorage, save it
    if (!localStorage.getItem('upstox_access_token') && import.meta.env.VITE_UPSTOX_ACCESS_TOKEN) {
      this.setAccessToken(import.meta.env.VITE_UPSTOX_ACCESS_TOKEN);
    }
    
    this.apiClient = axios.create({
      baseURL: UPSTOX_CONFIG.apiBaseUrl,
      headers: {
        'Accept': 'application/json',
      },
    });

    // Add auth token to all requests
    this.apiClient.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });
  }

  // ==================== Authentication ====================
  
  /**
   * Get OAuth authorization URL
   */
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: UPSTOX_CONFIG.apiKey,
      redirect_uri: UPSTOX_CONFIG.redirectUri,
      response_type: 'code',
    });
    return `${UPSTOX_CONFIG.authUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(authCode) {
    try {
      const response = await axios.post(
        UPSTOX_CONFIG.tokenUrl,
        {
          code: authCode,
          client_id: UPSTOX_CONFIG.apiKey,
          client_secret: UPSTOX_CONFIG.apiSecret,
          redirect_uri: UPSTOX_CONFIG.redirectUri,
          grant_type: 'authorization_code',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        }
      );

      const { access_token } = response.data;
      this.setAccessToken(access_token);
      return access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  /**
   * Set access token
   */
  setAccessToken(token) {
    this.accessToken = token;
    localStorage.setItem('upstox_access_token', token);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.accessToken;
  }

  /**
   * Logout
   */
  logout() {
    this.accessToken = null;
    localStorage.removeItem('upstox_access_token');
  }

  // ==================== User Profile ====================

  /**
   * Get user profile
   */
  async getProfile() {
    try {
      const response = await this.apiClient.get('/user/profile');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // ==================== Market Data ====================

  /**
   * Get market quotes for instruments
   */
  async getMarketQuotes(instrumentKeys) {
    try {
      const params = new URLSearchParams();
      instrumentKeys.forEach(key => params.append('instrument_key', key));
      
      const response = await this.apiClient.get(`/market-quote/quotes?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching market quotes:', error);
      throw error;
    }
  }

  /**
   * Get full market quotes (OHLC, volume, etc.)
   */
  async getFullMarketQuotes(instrumentKeys) {
    try {
      const params = new URLSearchParams();
      instrumentKeys.forEach(key => params.append('instrument_key', key));
      
      const response = await this.apiClient.get(`/market-quote/ohlc?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching full market quotes:', error);
      throw error;
    }
  }

  /**
   * Get historical candle data
   */
  async getHistoricalData(instrumentKey, interval, fromDate, toDate) {
    try {
      const params = new URLSearchParams({
        instrument_key: instrumentKey,
        interval: interval, // '1minute', '5minute', '15minute', '30minute', '60minute', 'day', 'week', 'month'
        from_date: fromDate,
        to_date: toDate,
      });
      
      const response = await this.apiClient.get(`/historical-candle/${instrumentKey}/${interval}/${toDate}/${fromDate}`);
      return response.data.data.candles;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  /**
   * Get intraday candle data
   */
  async getIntradayData(instrumentKey, interval) {
    try {
      const response = await this.apiClient.get(`/historical-candle/intraday/${instrumentKey}/${interval}`);
      return response.data.data.candles;
    } catch (error) {
      console.error('Error fetching intraday data:', error);
      throw error;
    }
  }

  // ==================== Portfolio & Holdings ====================

  /**
   * Get user holdings
   */
  async getHoldings() {
    try {
      const response = await this.apiClient.get('/portfolio/long-term-holdings');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching holdings:', error);
      throw error;
    }
  }

  /**
   * Get user positions
   */
  async getPositions() {
    try {
      const response = await this.apiClient.get('/portfolio/short-term-positions');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  }

  /**
   * Get funds and margins
   */
  async getFunds() {
    try {
      const response = await this.apiClient.get('/user/get-funds-and-margin');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching funds:', error);
      throw error;
    }
  }

  // ==================== Orders ====================

  /**
   * Place an order
   */
  async placeOrder(orderData) {
    try {
      const response = await this.apiClient.post('/order/place', orderData);
      return response.data.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  /**
   * Get order book
   */
  async getOrders() {
    try {
      const response = await this.apiClient.get('/order/retrieve-all');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Get trade history
   */
  async getTrades() {
    try {
      const response = await this.apiClient.get('/order/trades/get-trades-for-day');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching trades:', error);
      throw error;
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId) {
    try {
      const response = await this.apiClient.delete(`/order/cancel?order_id=${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }

  /**
   * Modify an order
   */
  async modifyOrder(orderId, modifications) {
    try {
      const response = await this.apiClient.put(`/order/modify`, {
        order_id: orderId,
        ...modifications,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error modifying order:', error);
      throw error;
    }
  }

  // ==================== WebSocket Authorization ====================

  /**
   * Get WebSocket authorization
   */
  async getWebSocketAuth() {
    try {
      const response = await this.apiClient.get('/feed/market-data-feed/authorize', {
        headers: {
          'Api-Version': '2.0',
        },
      });
      return response.data.data.authorizedRedirectUri;
    } catch (error) {
      console.error('Error getting WebSocket auth:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new UpstoxService();
