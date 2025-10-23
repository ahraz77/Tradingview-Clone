// Quick test to verify Upstox API access
import axios from 'axios';

const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI1VUJMNUIiLCJqdGkiOiI2OGY5ZTczNTc2MWFiNzRiODYyYjNhYzMiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6ZmFsc2UsImlhdCI6MTc2MTIwODExNywiaXNzIjoidWRhcGktZ2F0ZXdheS1zZXJ2aWNlIiwiZXhwIjoxNzYxMjU2ODAwfQ.w_nJr6f8csFMhRoIn-MtnSVsWABFMM1v-q1hwerRVQY';

async function testAPI() {
  try {
    console.log('🔍 Testing Upstox API connection...\n');
    
    // Test 1: Get Profile
    console.log('1️⃣ Testing Profile API...');
    const profileResponse = await axios.get('https://api.upstox.com/v2/user/profile', {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    console.log('✅ Profile:', profileResponse.data);
    console.log('');

    // Test 2: Get Market Quote for NIFTY 50
    console.log('2️⃣ Testing Market Quote API for NIFTY 50...');
    const quoteResponse = await axios.get('https://api.upstox.com/v2/market-quote/quotes', {
      params: {
        instrument_key: 'NSE_INDEX|Nifty 50'
      },
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    console.log('✅ Market Quote:', JSON.stringify(quoteResponse.data, null, 2));
    console.log('');

    // Test 3: Get Historical Candle Data for RELIANCE
    console.log('3️⃣ Testing Historical Candle API for RELIANCE...');
    const instrumentKey = 'NSE_EQ|INE002A01018';
    const interval = '30minute';
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const candleResponse = await axios.get(
      `https://api.upstox.com/v2/historical-candle/${instrumentKey}/${interval}/${toDate}/${fromDate}`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Accept': 'application/json'
        }
      }
    );
    console.log('✅ Historical Data:', JSON.stringify(candleResponse.data, null, 2));
    console.log('');

    console.log('🎉 All API tests passed!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

testAPI();
