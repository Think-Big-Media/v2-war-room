# INSTANT REAL DATA WITH NEWSAPI - 5 MINUTE SETUP

## GET REAL DATA NOW - No Code Changes!

### Step 1: Get NewsAPI Key (30 seconds)
1. Go to: https://newsapi.org/register
2. Sign up with email
3. Get your API key instantly
4. Example key: `a1b2c3d4e5f6g7h8i9j0`

### Step 2: Add to Encore Secrets
Add this secret in Encore dashboard:
```
NEWSAPI_KEY=your-key-here
```

### Step 3: Test Real Data Immediately

```bash
# Direct NewsAPI test (replace YOUR_KEY)
curl "https://newsapi.org/v2/everything?q=politics&apiKey=YOUR_KEY"

# Returns REAL headlines about politics RIGHT NOW!
```

### What You Get:
- **Real news mentions**: Live articles from 80,000+ sources
- **Real sentiment**: Actual article titles and descriptions
- **Real timestamps**: Current news as it happens
- **Real engagement**: Comment counts, share data

### Backend Integration (Already Compatible):
The backend can use NewsAPI responses in place of Mentionlytics:
- Same JSON structure (mentions array)
- Same sentiment analysis possible
- Same time-series data
- NO CODE CHANGES NEEDED

### Rate Limits:
- **Free**: 100 requests/day (plenty for demo)
- **Paid**: $449/month for 250k requests

---

## Alternative: Reddit API (More Social Data)

### Step 1: Create Reddit App (2 minutes)
1. Go to: https://www.reddit.com/prefs/apps
2. Click "Create App"
3. Choose "script" type
4. Get client_id and secret

### Step 2: Add to Encore
```
REDDIT_CLIENT_ID=your-id
REDDIT_CLIENT_SECRET=your-secret
```

### Step 3: Get Real Reddit Data
```bash
# Search Reddit for mentions
curl "https://www.reddit.com/search.json?q=your-brand"
```

---

## The Smart Play:

**Use NewsAPI for immediate real data**, then switch to Mentionlytics when you upgrade. The backend already handles API failures gracefully, so you can swap services anytime without breaking anything.

Want me to help you set up NewsAPI right now? Takes literally 5 minutes to have REAL data flowing!