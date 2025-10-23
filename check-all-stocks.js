import axios from 'axios';
import { readFileSync } from 'fs';

// Read .env file manually
const envContent = readFileSync('.env', 'utf-8');
const ACCESS_TOKEN = envContent.match(/VITE_UPSTOX_ACCESS_TOKEN=(.*)/)?.[1]?.trim();

async function testQuotes(instrumentKeys) {
  try {
    const response = await axios.get('https://api.upstox.com/v2/market-quote/quotes', {
      params: {
        instrument_key: instrumentKeys.join(',')
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });
    
    return response.data?.data || {};
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return {};
  }
}

// Sample of stocks from different sectors
const testStocks = {
  // Banking (known to work)
  'HDFCBANK': 'NSE_EQ|INE040A01034',
  'ICICIBANK': 'NSE_EQ|INE090A01021',
  'SBIN': 'NSE_EQ|INE062A01020',
  
  // Banking (problematic)
  'BAJFINANCE': 'NSE_EQ|INE296A01024',
  'BAJAJFINSV': 'NSE_EQ|INE918I01018',
  
  // IT (known to work)
  'TCS': 'NSE_EQ|INE467B01029',
  'INFY': 'NSE_EQ|INE009A01021',
  
  // Energy
  'RELIANCE': 'NSE_EQ|INE002A01018',
  'ONGC': 'NSE_EQ|INE213A01029',
  
  // Auto
  'TATAMOTORS': 'NSE_EQ|INE155A01022',
  'M_M': 'NSE_EQ|INE101A01026',
  
  // Pharma
  'SUNPHARMA': 'NSE_EQ|INE044A01036',
  'DRREDDY': 'NSE_EQ|INE089A01023',
  
  // Cement
  'ULTRACEMCO': 'NSE_EQ|INE481G01011',
  'AMBUJACEM': 'NSE_EQ|INE079A01024'
};

async function main() {
  console.log('\n🔍 Testing sample stocks from different sectors...\n');
  
  const keys = Object.values(testStocks);
  const quotes = await testQuotes(keys);
  
  console.log('🔑 Returned keys from API:', Object.keys(quotes));
  console.log('\n');
  
  const working = [];
  const failing = [];
  
  Object.entries(testStocks).forEach(([symbol, key]) => {
    const colonKey = key.replace('|', ':');
    const quote = quotes[colonKey];
    
    console.log(`Checking ${symbol}: colonKey=${colonKey}, hasQuote=${!!quote}, hasLastPrice=${!!quote?.last_price}`);
    
    if (quote && quote.last_price) {
      working.push({ symbol, key, ltp: quote.last_price });
    } else {
      failing.push({ symbol, key });
    }
  });
  
  console.log('✅ WORKING STOCKS:', working.length);
  working.forEach(({ symbol, ltp }) => {
    console.log(`   ${symbol.padEnd(15)} ₹${ltp}`);
  });
  
  console.log('\n❌ FAILING STOCKS:', failing.length);
  failing.forEach(({ symbol, key }) => {
    console.log(`   ${symbol.padEnd(15)} ${key}`);
  });
  
  console.log(`\n📊 Success Rate: ${((working.length / Object.keys(testStocks).length) * 100).toFixed(1)}%\n`);
}

main();
