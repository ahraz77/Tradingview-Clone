import axios from 'axios';

const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI1VUJMNUIiLCJqdGkiOiI2OGY5ZTczNTc2MWFiNzRiODYyYjNhYzMiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6ZmFsc2UsImlhdCI6MTc2MTIwODExNywiaXNzIjoidWRhcGktZ2F0ZXdheS1zZXJ2aWNlIiwiZXhwIjoxNzYxMjU2ODAwfQ.w_nJr6f8csFMhRoIn-MtnSVsWABFMM1v-q1hwerRVQY';

async function test() {
  try {
    console.log('Testing with CORRECT interval (30minute)...\n');
    
    const response = await axios.get(
      'https://api.upstox.com/v2/historical-candle/intraday/NSE_EQ|INE002A01018/30minute',
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('✅ Success! Got', response.data.data.candles.length, 'candles');
    console.log('First candle:', response.data.data.candles[0]);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

test();
