# 🚀 Quick Setup Guide for Upstox Integration

## Step 1: Get Upstox API Credentials

1. Go to https://api.upstox.com/
2. Sign up / Login with your Upstox account
3. Click "Create App"
4. Fill in the details:
   - **App Name**: AeroTrade (or any name)
   - **Redirect URI**: `http://localhost:5173/callback`
   - **Type**: Web Application
5. After creation, you'll get:
   - ✅ **API Key** (Client ID)
   - ✅ **API Secret** (Client Secret)

## Step 2: Configure Your App

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual credentials:

```env
VITE_UPSTOX_API_KEY=your_actual_api_key_here
VITE_UPSTOX_API_SECRET=your_actual_api_secret_here
VITE_UPSTOX_REDIRECT_URI=http://localhost:5173/callback
VITE_UPSTOX_API_URL=https://api.upstox.com/v2
```

## Step 3: Run the App

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## Step 4: Login & Start Trading

1. Click "Login with Upstox"
2. You'll be redirected to Upstox authorization page
3. Grant permissions
4. You'll be redirected back to the app
5. **You're now connected to live market data!** 🎉

## What Happens After Login?

✅ **Real-time WebSocket Connection** - Automatic connection to live market feed  
✅ **Live Price Updates** - Prices update in real-time  
✅ **Historical Charts** - Past candle data loaded for analysis  
✅ **Portfolio Sync** - Your positions and holdings are loaded  
✅ **Order Book** - Live bid/ask prices  
✅ **Trade History** - Recent trades displayed  

## Testing Without Real Account

If you want to test the UI without connecting to Upstox:

1. Comment out the authentication check in `App.jsx`:
```javascript
// Temporarily disable auth for testing
// if (!isAuthenticated) {
//   return <LoginScreen onLogin={login} />;
// }
```

2. The app will show empty states for data that requires authentication.

## Troubleshooting

### "Invalid redirect URI" error
- Make sure the redirect URI in your Upstox app settings exactly matches: `http://localhost:5173/callback`
- No trailing slash!

### "WebSocket not connecting"
- Ensure you're logged in first
- Check browser console for errors
- Market might be closed (WebSocket only works during market hours)

### "No data showing"
- Market might be closed
- Try during market hours: 9:15 AM - 3:30 PM IST (Mon-Fri)
- Check browser console for API errors

## Important Notes

⚠️ **Security**: Never commit your `.env` file to GitHub  
⚠️ **Market Hours**: Live data only available during Indian market hours  
⚠️ **Rate Limits**: Be mindful of Upstox API rate limits  
⚠️ **Paper Trading**: This is for personal use - trade responsibly!  

## File Structure

```
.env                          # Your API credentials (NEVER COMMIT THIS!)
src/
  ├── config/upstox.config.js # API configuration
  ├── services/
  │   ├── upstoxService.js    # REST API calls
  │   └── websocketService.js # Live data WebSocket
  ├── hooks/useUpstox.js      # React hooks for data
  └── components/
      └── LoginScreen.jsx     # OAuth login screen
```

## Next Steps

1. ✅ Get API credentials
2. ✅ Configure `.env` file
3. ✅ Run `npm run dev`
4. ✅ Login with Upstox
5. 🎯 Start monitoring live markets!

---

**Need Help?** Check the browser console for detailed error messages.

**Happy Trading!** 📈
