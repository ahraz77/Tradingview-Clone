import protobuf from 'protobufjs';
import upstoxService from './upstoxService';

// Upstox MarketDataFeed protobuf schema
const PROTO_SCHEMA = `
syntax = "proto3";

message FeedResponse {
  map<string, Feed> feeds = 1;
}

message Feed {
  LTPC ltpc = 1;
  MarketFF ff = 2;
  OptionGreeks optionGreeks = 3;
  ExtendedFeedDetails eFeedDetails = 4;
}

message LTPC {
  double ltp = 1;
  int64 ltt = 2;
  double ltq = 3;
  double cp = 4;
  double chp = 5;
  double ch = 6;
}

message MarketFF {
  MarketLevel marketLevel = 1;
  MarketOHLC marketOHLC = 2;
}

message MarketLevel {
  repeated BidAsk bidAsk = 1;
}

message BidAsk {
  int32 quantity = 1;
  int32 orders = 2;
  double price = 3;
}

message MarketOHLC {
  double open = 1;
  double high = 2;
  double low = 3;
  double close = 4;
  double volume = 5;
  double atp = 6;
  double oi = 7;
  double changeOi = 8;
  double ltt = 9;
  double ltq = 10;
  double tbq = 11;
  double tsq = 12;
  double close_price = 13;
}

message OptionGreeks {
  double vega = 1;
  double theta = 2;
  double gamma = 3;
  double delta = 4;
  double iv = 5;
}

message ExtendedFeedDetails {
  double atp = 1;
  double cp = 2;
  double volume = 3;
  double total_buy_quantity = 4;
  double total_sell_quantity = 5;
  double lower_circuit = 6;
  double upper_circuit = 7;
  double yearly_low = 8;
  double yearly_high = 9;
  double ltt = 10;
  double open_interest = 11;
  double prev_close_price = 12;
  double prev_open_interest = 13;
}
`;

class WebSocketService {
  constructor() {
    this.ws = null;
    this.root = null;
    this.FeedResponse = null;
    this.subscribers = new Map(); // instrumentKey -> array of callback functions
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.isConnecting = false;
    this.isConnected = false;
    
    this.initProtobuf();
  }

  /**
   * Initialize protobuf
   */
  async initProtobuf() {
    try {
      this.root = protobuf.parse(PROTO_SCHEMA).root;
      this.FeedResponse = this.root.lookupType('FeedResponse');
    } catch (error) {
      console.error('Error initializing protobuf:', error);
    }
  }

  /**
   * Connect to Upstox WebSocket
   */
  async connect() {
    if (this.isConnecting || this.isConnected) {
      console.log('WebSocket already connecting or connected');
      return;
    }

    this.isConnecting = true;

    try {
      // Get WebSocket authorization URL
      const wsUrl = await upstoxService.getWebSocketAuth();
      
      // Create WebSocket connection
      this.ws = new WebSocket(wsUrl);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        
        // Resubscribe to all instruments
        this.resubscribeAll();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.isConnecting = false;
        this.handleReconnect();
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  /**
   * Handle WebSocket reconnection
   */
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Handle incoming WebSocket message
   */
  handleMessage(data) {
    try {
      // Decode protobuf message
      const buffer = new Uint8Array(data);
      const feedResponse = this.FeedResponse.decode(buffer);
      const feeds = feedResponse.feeds;

      // Process each feed and notify subscribers
      Object.entries(feeds).forEach(([instrumentKey, feed]) => {
        const callbacks = this.subscribers.get(instrumentKey);
        if (callbacks) {
          callbacks.forEach(callback => {
            callback(this.formatFeedData(instrumentKey, feed));
          });
        }
      });
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  /**
   * Format feed data to a consistent structure
   */
  formatFeedData(instrumentKey, feed) {
    const data = {
      instrumentKey,
      timestamp: Date.now(),
    };

    // LTPC data (Last Traded Price with Change)
    if (feed.ltpc) {
      data.ltp = feed.ltpc.ltp;
      data.lastTradeTime = feed.ltpc.ltt;
      data.lastTradeQty = feed.ltpc.ltq;
      data.closePrice = feed.ltpc.cp;
      data.change = feed.ltpc.ch;
      data.changePercent = feed.ltpc.chp;
    }

    // Full market data
    if (feed.ff && feed.ff.marketOHLC) {
      const ohlc = feed.ff.marketOHLC;
      data.open = ohlc.open;
      data.high = ohlc.high;
      data.low = ohlc.low;
      data.close = ohlc.close;
      data.volume = ohlc.volume;
      data.atp = ohlc.atp;
      data.oi = ohlc.oi;
    }

    // Order book (Bid/Ask)
    if (feed.ff && feed.ff.marketLevel && feed.ff.marketLevel.bidAsk) {
      const bidAsk = feed.ff.marketLevel.bidAsk;
      const mid = Math.floor(bidAsk.length / 2);
      
      data.bids = bidAsk.slice(0, mid).map(ba => ({
        price: ba.price,
        quantity: ba.quantity,
        orders: ba.orders,
      }));
      
      data.asks = bidAsk.slice(mid).map(ba => ({
        price: ba.price,
        quantity: ba.quantity,
        orders: ba.orders,
      }));
    }

    return data;
  }

  /**
   * Subscribe to instrument(s)
   */
  subscribe(instrumentKeys, mode = 'full') {
    if (!Array.isArray(instrumentKeys)) {
      instrumentKeys = [instrumentKeys];
    }

    const message = {
      guid: 'someguid',
      method: 'sub',
      data: {
        mode: mode, // 'ltpc' or 'full'
        instrumentKeys: instrumentKeys,
      },
    };

    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Unsubscribe from instrument(s)
   */
  unsubscribe(instrumentKeys) {
    if (!Array.isArray(instrumentKeys)) {
      instrumentKeys = [instrumentKeys];
    }

    const message = {
      guid: 'someguid',
      method: 'unsub',
      data: {
        instrumentKeys: instrumentKeys,
      },
    };

    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(message));
    }

    // Remove from subscribers
    instrumentKeys.forEach(key => {
      this.subscribers.delete(key);
    });
  }

  /**
   * Add subscriber callback for instrument
   */
  addSubscriber(instrumentKey, callback) {
    if (!this.subscribers.has(instrumentKey)) {
      this.subscribers.set(instrumentKey, []);
    }
    this.subscribers.get(instrumentKey).push(callback);
  }

  /**
   * Remove subscriber callback
   */
  removeSubscriber(instrumentKey, callback) {
    const callbacks = this.subscribers.get(instrumentKey);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.subscribers.delete(instrumentKey);
      }
    }
  }

  /**
   * Resubscribe to all instruments after reconnection
   */
  resubscribeAll() {
    if (this.subscribers.size > 0) {
      const instrumentKeys = Array.from(this.subscribers.keys());
      this.subscribe(instrumentKeys, 'full');
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.subscribers.clear();
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Export singleton instance
export default new WebSocketService();
