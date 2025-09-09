# COMET PROMPT: Add Secrets to Encore Dashboard

## Copy this entire prompt to Comet:

Go to https://app.encore.cloud/war-roombackend-45-x83i/settings/secrets and add these secrets for the staging environment:

```
MENTIONLYTICS_API_TOKEN = 0X44tHi275ZqqK2psB4U-Ph-dw2xRkq7T4QVkSBlUz32V0ZcgkXt2dQSni52-fhB7WZyZOoGBPcR23O9oND_h1DE

JWT_SECRET = war-room-jwt-secret-2025-secure-token-generation

META_APP_ID = 917316510623086

GOOGLE_ADS_CLIENT_ID = 808203781238-dgqv5sga2q1r1ls6n77fc40g3idu8h1o.apps.googleusercontent.com

GOOGLE_ADS_DEVELOPER_TOKEN = h3cQ3ss7lesG9dP0tC56ig

SENDGRID_EMAIL = Info@wethinkbig.io

SUPABASE_URL = https://ksnrafwskxaxhaczvwjs.supabase.co

POSTHOG_API_KEY = phc_31XyMU18DIn1wz5ji5H9Y33jXz6VfTfZxaR6DR8mH4o

POSTHOG_HOST = https://us.i.posthog.com

OPENAI_API_KEY = [Add your OpenAI key if you have one]

TWILIO_ACCOUNT_SID = [Add if you have Twilio]

TWILIO_AUTH_TOKEN = [Add if you have Twilio]
```

For each secret:
1. Click "Add secret"
2. Enter the secret name (exactly as shown above)
3. Enter the value
4. Select "staging" environment
5. Save

After adding all secrets, trigger a new deployment or restart the staging environment.

---

## Once Done, The Staging URL Should Be:
`https://staging-war-roombackend-45-x83i.encr.app`

Test with:
```bash
curl https://staging-war-roombackend-45-x83i.encr.app/health
```