import axios from 'axios';
import { readFileSync } from 'fs';

// Read .env file manually
const envContent = readFileSync('.env', 'utf-8');
const ACCESS_TOKEN = envContent.match(/VITE_UPSTOX_ACCESS_TOKEN=(.*)/)?.[1]?.trim();

async function main() {
  try {
    const testKeys = [
      'NSE_EQ|INE040A01034', // HDFCBANK
      'NSE_EQ|INE002A01018'  // RELIANCE
    ];
    
    const response = await axios.get('https://api.upstox.com/v2/market-quote/quotes', {
      params: {
        instrument_key: testKeys.join(',')
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });
    
    console.log('\n📦 Response Status:', response.data.status);
    console.log('📦 Response Keys:', Object.keys(response.data.data || {}));
    console.log('\n📊 Full Response:\n', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

main();
