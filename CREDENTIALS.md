# 🔑 Upstox API Credentials - CONFIGURED ✅

Your Upstox API credentials have been successfully configured!

## Current Configuration

```
API Key: ccff4bf7-d90b-4af0-9df5-30e1116b65c6
API Secret: qtluo9s8vl
Access Token: ✅ CONFIGURED (Token will expire on: Dec 23, 2025)
```

## ✅ What's Ready

1. **Access Token Pre-configured** - You won't need to login manually!
2. **Auto-authentication** - The app will use your token automatically
3. **Live Data Ready** - WebSocket will connect on app load

## 🚀 How to Use

Just refresh your browser at **http://localhost:5173** and the app will:
1. ✅ Automatically authenticate with your access token
2. ✅ Connect to WebSocket for live data
3. ✅ Load historical charts
4. ✅ Display your portfolio positions
5. ✅ Show live order book and trades

## 📝 Important Notes

### Token Expiry
Your access token expires on: **December 23, 2025**

After expiry, you'll need to:
1. Either get a new token from Upstox
2. Or use the OAuth login flow by clicking "Logout" and logging in again

### Security Warning
⚠️ **NEVER commit your `.env` file to GitHub!**  
- It's already in `.gitignore`
- Your credentials are sensitive

### Market Hours
Live WebSocket data only works during market hours:
- **Monday-Friday**: 9:15 AM - 3:30 PM IST
- Outside market hours, you'll see historical data only

## 🔄 If Token Expires

When your token expires, you can either:

### Option 1: Get New Token from Upstox
Update the `.env` file with new token:
```env
VITE_UPSTOX_ACCESS_TOKEN=your_new_token_here
```

### Option 2: Use OAuth Flow
1. Remove the `VITE_UPSTOX_ACCESS_TOKEN` line from `.env`
2. Restart the app
3. Click "Login with Upstox"
4. Complete the OAuth flow

## 🧪 Testing

The app is currently running at: http://localhost:5173

Try these features:
- ✅ Switch between stocks in the watchlist
- ✅ Change timeframes (1m, 5m, 15m, 1h, 1D)
- ✅ Watch live price updates
- ✅ View order book depth
- ✅ Check your portfolio positions
- ✅ Toggle dark/light mode

## 🐛 Troubleshooting

### "401 Unauthorized" error
- Your token might have expired
- Get a new token or use OAuth login

### "No data available"
- Market might be closed
- Try during market hours (9:15 AM - 3:30 PM IST)

### WebSocket not connecting
- Check browser console for errors
- Ensure market is open
- Try refreshing the page

---

**Everything is configured! Just refresh your browser and start trading!** 📈
