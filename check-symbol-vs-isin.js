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
    
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return null;
  }
}

async function main() {
  console.log('\n🔍 Testing ISIN vs Symbol format...\n');
  
  // Test with ISIN format (what we're currently using)
  console.log('1️⃣ Testing with ISIN format (NSE_EQ|ISIN):');
  const isinKeys = [
    'NSE_EQ|INE296A01024', // BAJFINANCE
    'NSE_EQ|INE918I01018'  // BAJAJFINSV
  ];
  
  const isinResult = await testQuotes(isinKeys);
  if (isinResult?.data) {
    console.log('   Response keys:', Object.keys(isinResult.data));
    Object.entries(isinResult.data).forEach(([key, data]) => {
      console.log(`   ${key}: LTP = ${data.last_price || 'N/A'}`);
    });
  } else {
    console.log('   ❌ No data returned');
  }
  
  // Test with Symbol format
  console.log('\n2️⃣ Testing with Symbol format (NSE_EQ|SYMBOL):');
  const symbolKeys = [
    'NSE_EQ|BAJFINANCE',
    'NSE_EQ|BAJAJFINSV'
  ];
  
  const symbolResult = await testQuotes(symbolKeys);
  if (symbolResult?.data) {
    console.log('   Response keys:', Object.keys(symbolResult.data));
    Object.entries(symbolResult.data).forEach(([key, data]) => {
      console.log(`   ${key}: LTP = ${data.last_price || 'N/A'}`);
    });
  } else {
    console.log('   ❌ No data returned');
  }
  
  // Test with known working stocks for comparison
  console.log('\n3️⃣ Testing known working stocks (RELIANCE, TCS):');
  const workingKeys = [
    'NSE_EQ|INE002A01018', // RELIANCE
    'NSE_EQ|INE467B01029'  // TCS
  ];
  
  const workingResult = await testQuotes(workingKeys);
  if (workingResult?.data) {
    console.log('   Response keys:', Object.keys(workingResult.data));
    Object.entries(workingResult.data).forEach(([key, data]) => {
      console.log(`   ${key}: LTP = ${data.last_price || 'N/A'}`);
    });
  } else {
    console.log('   ❌ No data returned');
  }
  
  console.log('\n✅ Test complete\n');
}

main();
