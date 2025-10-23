import axios from 'axios';

const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI1VUJMNUIiLCJqdGkiOiI2OGY5ZTczNTc2MWFiNzRiODYyYjNhYzMiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6ZmFsc2UsImlhdCI6MTc2MTIwODExNywiaXNzIjoidWRhcGktZ2F0ZXdheS1zZXJ2aWNlIiwiZXhwIjoxNzYxMjU2ODAwfQ.w_nJr6f8csFMhRoIn-MtnSVsWABFMM1v-q1hwerRVQY';

async function testAllStocks() {
  try {
    const stocks = [
      'NSE_EQ|INE002A01018', // RELIANCE
      'NSE_EQ|INE467B01029', // TCS
      'NSE_EQ|INE040A01034', // HDFCBANK
      'NSE_EQ|INE009A01021', // INFY
    ];
    
    const params = new URLSearchParams();
    stocks.forEach(key => params.append('instrument_key', key));
    
    const response = await axios.get(
      `https://api.upstox.com/v2/market-quote/quotes?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Response keys:', Object.keys(response.data.data));
    console.log('\nFull response:');
    console.log(JSON.stringify(response.data.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAllStocks();
