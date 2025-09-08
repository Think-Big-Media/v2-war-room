# Political API Setup Guide

## Quick Start

The EnhancedPoliticalMap component is now integrated and ready to use FREE political data APIs instead of relying solely on Mentionlytics.

## API Keys Needed

Add these to your `.env` file (frontend) and Encore Secrets (backend):

### 1. Democracy Works API
- **Sign up**: https://data.democracy.works/api-info
- **Cost**: FREE
- **Key name**: `DEMOCRACY_WORKS_API_KEY`
- **Features**: Elections, polling locations, voter registration

### 2. Google Civic Information API
- **Sign up**: https://console.cloud.google.com/
- **Cost**: FREE
- **Key name**: `GOOGLE_CIVIC_API_KEY`
- **Features**: Representatives, civic data, polling places
- **Steps**:
  1. Go to Google Cloud Console
  2. Create new project or select existing
  3. Enable "Google Civic Information API"
  4. Create credentials → API Key

### 3. FEC OpenFEC API
- **Sign up**: https://api.open.fec.gov/developers/
- **Cost**: FREE
- **Key name**: `FEC_API_KEY`
- **Features**: Campaign finance, contributions, spending
- **Note**: Updates every 15 minutes with real data

### 4. Vote Smart API (Optional)
- **Sign up**: https://votesmart.org/share/api
- **Cost**: FREE with attribution
- **Key name**: `VOTE_SMART_API_KEY`
- **Features**: Candidate bios, voting records, ratings

## Frontend Setup (.env)

```bash
# Add to 2_Frontend_Codebase/3.1-ui-war-room-netlify-clean/.env
VITE_DEMOCRACY_WORKS_API_KEY=your_key_here
VITE_GOOGLE_CIVIC_API_KEY=your_key_here
VITE_FEC_API_KEY=your_key_here
VITE_VOTE_SMART_API_KEY=your_key_here
```

## Backend Setup (Encore Secrets)

```bash
# Add via Encore dashboard or CLI
encore secret set --type dev DEMOCRACY_WORKS_API_KEY
encore secret set --type dev GOOGLE_CIVIC_API_KEY
encore secret set --type dev FEC_API_KEY
encore secret set --type dev VOTE_SMART_API_KEY

# For production
encore secret set --type prod DEMOCRACY_WORKS_API_KEY
encore secret set --type prod GOOGLE_CIVIC_API_KEY
encore secret set --type prod FEC_API_KEY
encore secret set --type prod VOTE_SMART_API_KEY
```

## What's Working Now

1. **EnhancedPoliticalMap Component** ✅
   - Located at: `src/components/political/EnhancedPoliticalMap.tsx`
   - Integrated in Dashboard
   - 4 data layers: Activity, Sentiment, Finance, Elections

2. **Political Services** ✅
   - `democracyWorksApi.ts` - Elections & voting data
   - `fecApi.ts` - Campaign finance data
   - `googleCivicApi.ts` - Civic information

3. **Data Visualization** ✅
   - State-level political activity scores
   - Real-time contribution data
   - Upcoming elections tracking
   - Combined with Mentionlytics sentiment

## Testing Without API Keys

The system gracefully handles missing API keys:
- Falls back to cached/mock data
- Shows "Using Mock Data" indicator
- No crashes or errors

## Next Steps

1. **Get API Keys** (10 minutes)
   - Start with Google Civic (easiest)
   - Then FEC (no approval needed)
   - Democracy Works (may need approval)

2. **Add to Environment**
   - Frontend: Add to `.env` file
   - Backend: Add via Encore dashboard

3. **Test Live Data**
   - Switch to "Finance" layer to see FEC data
   - Switch to "Elections" layer for Democracy Works
   - "Activity" combines all sources

## Data Sources Priority

The map automatically uses available data in this order:
1. Live API data (when keys present)
2. Mentionlytics data (when available)
3. Cached data (from previous API calls)
4. Mock data (last resort)

## Troubleshooting

- **No data showing**: Check browser console for API errors
- **"Mock Data" indicator**: Add API keys to environment
- **Slow loading**: APIs are being called in parallel, initial load takes 5-10 seconds
- **State not updating**: Click on state to see detailed data

## What This Replaces

Instead of paying $2500/year for Mentionlytics API, we now have:
- **FREE** political data from government sources
- **Real** campaign finance data updated every 15 minutes
- **Actual** election calendars and polling locations
- **Live** representative information

The best part: When the client upgrades Mentionlytics, both systems work together seamlessly!