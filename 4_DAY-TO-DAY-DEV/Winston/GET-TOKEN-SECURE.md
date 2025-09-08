# 🔐 GET YOUR MENTIONLYTICS TOKEN - Secure Method

## DO THIS YOURSELF (More Secure):

### Step 1: Open a New Browser Tab (Incognito/Private Mode Recommended)

### Step 2: Copy and Paste This URL
Replace the placeholders with your actual credentials:
```
https://app.mentionlytics.com/api/token?email=roderic@badaboost.com&password=YOUR_PASSWORD
```

### Step 3: Press Enter
You should see something like:
```json
{
  "token": "long-string-of-characters-here"
}
```

### Step 4: Copy ONLY the Token Value
Copy the token string (without the quotes)

### Step 5: Update in Encore
1. Go to: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging/settings
2. Click "Secrets" tab
3. Find `MENTIONLYTICS_API_TOKEN`
4. Paste your new token
5. Save

---

## Alternative: Use curl in Terminal
```bash
curl "https://app.mentionlytics.com/api/token?email=roderic@badaboost.com&password=YOUR_PASSWORD"
```

---

## Once You Have the Token:

### Test It Works:
```bash
# Replace YOUR_TOKEN with actual token
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.mentionlytics.com/api/mentions/search"
```

### Update Backend:
Give the token to Comet to update in Encore, or do it manually as shown above.

---

**Important**: After getting your token, clear your browser history if you used the URL method to protect your password.