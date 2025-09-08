# COMET PROMPT: Get Google Civic Information API Key

## Objective
Get a FREE Google Civic Information API key for the War Room political map to show real-time representative data, polling locations, and civic information.

## Steps to Execute

1. **Go to Google Cloud Console**
   - Navigate to: https://console.cloud.google.com/
   - Sign in with the project Google account (or create new account if needed)

2. **Create or Select Project**
   - If no project exists: Click "Create Project"
   - Project name: "War Room Political Data" 
   - Project ID: Can use auto-generated
   - Click "Create"
   - Wait for project creation (takes 10-30 seconds)

3. **Enable Google Civic Information API**
   - In the search bar at top, type: "Google Civic Information API"
   - Click on "Google Civic Information API" from results
   - Click the blue "ENABLE" button
   - Wait for API to enable (5-10 seconds)

4. **Create API Credentials**
   - After enabling, click "CREATE CREDENTIALS" button (top right)
   - Select "API key" from dropdown
   - The API key will be generated immediately
   - IMPORTANT: Copy the API key shown in the modal

5. **Optional but Recommended: Restrict API Key**
   - Click "RESTRICT KEY" in the modal (or click on the key name after closing)
   - Under "Application restrictions":
     - Select "HTTP referrers (websites)"
     - Add these referrers:
       - `https://war-room-3-1-ui.netlify.app/*`
       - `http://localhost:5173/*`
       - `http://localhost:3000/*`
   - Under "API restrictions":
     - Select "Restrict key"
     - Check only "Google Civic Information API"
   - Click "SAVE"

6. **Copy and Save the API Key**
   - Format: `AIzaSy...` (39 characters)
   - Save as: `VITE_GOOGLE_CIVIC_API_KEY=YOUR_KEY_HERE`
   - Location: Add to `.env` file in frontend

## Expected Result
You should have an API key that looks like:
```
AIzaSyBx_1234567890abcdefghijklmnopqrst
```

## Success Indicators
- ✅ API key generated (starts with AIzaSy)
- ✅ Google Civic Information API is enabled
- ✅ Key is restricted to your domains (optional but good)

## Common Issues & Solutions
- **Billing Account Required**: Google Civic API is FREE but may ask to enable billing. You won't be charged - it's completely free.
- **Project Quota**: Default is 25,000 requests per day (more than enough)
- **Wrong API**: Make sure it's "Google Civic Information API" not "Google Maps" or others

## Test the API Key
Test URL (replace YOUR_KEY):
```
https://www.googleapis.com/civicinfo/v2/representatives?key=YOUR_KEY&address=1600%20Pennsylvania%20Ave%20Washington%20DC
```

Should return JSON with government representative data.

## Time Required
**Total: 3-5 minutes**