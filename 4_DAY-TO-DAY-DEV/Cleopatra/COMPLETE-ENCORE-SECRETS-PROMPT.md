# COMPLETE Comet Prompt for Encore Secrets

Copy this ENTIRE message to Comet:

---

Go to the Encore dashboard at https://app.encore.cloud/war-room-4-4-backend-twpi/settings/secrets

Add these secrets to the STAGING environment:

1. Click "Add secret" and enter:
   Name: MENTIONLYTICS_API_TOKEN
   Value: 0X44tHi275ZqqK2psB4U-Ph-dw2xRkq7T4QVkSBlUz32V0ZcgkXt2dQSni52-fhB7WZyZOoGBPcR23O9oND_h1DE
   Environment: staging
   Click Save

2. Click "Add secret" and enter:
   Name: JWT_SECRET
   Value: war-room-jwt-secret-2025-secure-token-generation
   Environment: staging
   Click Save

3. Click "Add secret" and enter:
   Name: META_APP_ID
   Value: 917316510623086
   Environment: staging
   Click Save

4. Click "Add secret" and enter:
   Name: GOOGLE_ADS_CLIENT_ID
   Value: 808203781238-dgqv5sga2q1r1ls6n77fc40g3idu8h1o.apps.googleusercontent.com
   Environment: staging
   Click Save

5. Click "Add secret" and enter:
   Name: GOOGLE_ADS_DEVELOPER_TOKEN
   Value: h3cQ3ss7lesG9dP0tC56ig
   Environment: staging
   Click Save

6. Click "Add secret" and enter:
   Name: SENDGRID_EMAIL
   Value: Info@wethinkbig.io
   Environment: staging
   Click Save

7. Click "Add secret" and enter:
   Name: SUPABASE_URL
   Value: https://ksnrafwskxaxhaczvwjs.supabase.co
   Environment: staging
   Click Save

8. Click "Add secret" and enter:
   Name: POSTHOG_API_KEY
   Value: phc_31XyMU18DIn1wz5ji5H9Y33jXz6VfTfZxaR6DR8mH4o
   Environment: staging
   Click Save

9. Click "Add secret" and enter:
   Name: POSTHOG_HOST
   Value: https://us.i.posthog.com
   Environment: staging
   Click Save

10. Click "Add secret" and enter:
    Name: OPENAI_API_KEY
    Value: sk-placeholder-add-real-key-if-available
    Environment: staging
    Click Save

11. Click "Add secret" and enter:
    Name: TWILIO_ACCOUNT_SID
    Value: twilio-sid-placeholder
    Environment: staging
    Click Save

12. Click "Add secret" and enter:
    Name: TWILIO_AUTH_TOKEN
    Value: twilio-token-placeholder
    Environment: staging
    Click Save

After adding all 12 secrets, the deployment should automatically restart with the secrets available.

Then confirm the staging URL is working by visiting:
https://staging-war-room-4-4-backend-twpi.encr.app/health