// Check if specific stocks are returning data
import axios from 'axios';

const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI1VUJMNUIiLCJqdGkiOiI2OGY5ZTczNTc2MWFiNzRiODYyYjNhYzMiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6ZmFsc2UsImlhdCI6MTc2MTIwODExNywiaXNzIjoidWRhcGktZ2F0ZXdheS1zZXJ2aWNlIiwiZXhwIjoxNzYxMjU2ODAwfQ.w_nJr6f8csFMhRoIn-MtnSVsWABFMM1v-q1hwerRVQY';

async function checkStocks() {
  try {
    const stocks = [
      'NSE_EQ|INE296A01024', // BAJFINANCE
      'NSE_EQ|INE918I01018', // BAJAJFINSV
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
    console.log('\nBAJFINANCE data:');
    const bajFinKey = Object.keys(response.data.data).find(k => k.includes('BAJFINANCE'));
    console.log('Key:', bajFinKey);
    console.log('Data:', JSON.stringify(response.data.data[bajFinKey], null, 2));
    
    console.log('\nBAJAJFINSV data:');
    const bajFinsvKey = Object.keys(response.data.data).find(k => k.includes('BAJAJFINSV'));
    console.log('Key:', bajFinsvKey);
    console.log('Data:', JSON.stringify(response.data.data[bajFinsvKey], null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

checkStocks();
