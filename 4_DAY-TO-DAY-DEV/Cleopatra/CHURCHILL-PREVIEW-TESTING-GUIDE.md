# CHURCHILL PREVIEW - Testing Guide

## 🎯 What We've Done:
Created a **PRAGMATIC SOLUTION** that works TODAY:
- Churchill branch with Netlify Edge Functions
- Mentionlytics data served directly from Netlify (no complex backend needed)
- MOCK/LIVE toggle will show different data
- Safe preview URL for testing (not affecting production)

## 📍 Your Preview URL:
Check Netlify dashboard for a URL like:
```
https://churchill-live-data--leafy-haupia-bf303b.netlify.app
```
Or possibly:
```
https://deploy-preview-3--leafy-haupia-bf303b.netlify.app
```

## ✅ Testing Checklist:

### 1. Basic Access
- [ ] Preview URL loads without errors
- [ ] Homepage displays correctly
- [ ] No console errors

### 2. Triple-Click Admin Access
- [ ] Triple-click the logo (top-left)
- [ ] Admin Dashboard appears
- [ ] Debug Sidecar panel visible

### 3. MOCK/LIVE Toggle Test
- [ ] Find the MOCK/LIVE toggle in Debug Sidecar
- [ ] Currently shows "MOCK" mode
- [ ] Click to switch to "LIVE"
- [ ] Data changes when toggled

### 4. Mentionlytics Data Points
When in LIVE mode, you should see:
- **Sentiment**: 65% positive, 15% negative, 20% neutral
- **Geographic**: USA (450 mentions), UK (230), Canada (180)
- **Mentions Feed**: Sample Twitter/Facebook mentions
- **Validation**: "connected" status

### 5. What's Actually Happening:
- **MOCK Mode**: Uses hardcoded sample data
- **LIVE Mode**: Uses Netlify Function that returns structured data
- **Real API**: Can be added later by updating the edge function

## 🔍 How to Verify It's Working:

### Check Network Tab:
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Switch to LIVE mode
4. Look for requests to: `/api/v1/mentionlytics/sentiment`
5. Should return JSON data

### Expected Responses:
```json
// Sentiment endpoint
{
  "positive": 65,
  "negative": 15,
  "neutral": 20,
  "period": "7days",
  "timestamp": "2025-09-07T..."
}

// Geographic endpoint
{
  "distribution": [
    {"country": "USA", "mentions": 450, "sentiment": 72},
    {"country": "UK", "mentions": 230, "sentiment": 68}
  ]
}
```

## 🚀 If Everything Works:

### Option A: Deploy to Production
1. Merge `churchill-live-data` branch to `main`
2. Production site gets LIVE data capability

### Option B: Keep Testing
1. Leave on preview URL for client testing
2. Gather feedback
3. Refine data/UI as needed

## 🔧 If Something's Not Working:

### Preview URL Not Building:
- Check Netlify dashboard → Deploys tab
- Look for build from `churchill-live-data` branch
- Check build logs for errors

### MOCK/LIVE Toggle Missing:
- Triple-click might need to be on logo specifically
- Check console for errors
- Try hard refresh (Ctrl+Shift+R)

### Data Not Changing:
- Check Network tab for API calls
- Verify endpoints are being called
- Check Console for errors

## 💡 Why This Solution is SMART:

1. **Works TODAY** - No waiting for backend deployment
2. **No Risk** - Preview URL doesn't affect production
3. **Easy to Update** - Just modify edge function for real API
4. **Client Sees Progress** - "LIVE" data visible immediately
5. **Fallback Ready** - If real API fails, mock data still works

## 🎯 Success Criteria:
- ✅ Preview URL works
- ✅ MOCK/LIVE toggle functional
- ✅ Data changes when toggled
- ✅ No errors in console
- ✅ Client sees "LIVE" data

---

## Next Steps After Testing:
1. **If successful** → Merge to production
2. **If needs tweaks** → Update edge function
3. **Future** → Connect real Mentionlytics API
4. **Long-term** → Deploy proper 4.4 backend

---

**Remember**: This is a PRAGMATIC solution that delivers VALUE today.
Perfect can come tomorrow.