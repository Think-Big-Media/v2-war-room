# CORRECTED Comet Prompt - Fix Missing Secrets

Copy this to Comet to add the MISSING secrets with correct names:

---

Go to https://app.encore.cloud/war-room-4-4-backend-twpi/settings/secrets and add these additional secrets:

1. Click "Add secret" and enter:
   Name: EMAIL_API_KEY
   Value: Info@wethinkbig.io
   Environment: staging
   Click Save

2. Click "Add secret" and enter:
   Name: GOOGLE_ADS_API_KEY
   Value: h3cQ3ss7lesG9dP0tC56ig
   Environment: staging
   Click Save

3. Click "Add secret" and enter:
   Name: META_ACCESS_TOKEN
   Value: 917316510623086
   Environment: staging
   Click Save

These are the 3 missing secrets that are causing the deployment to fail.

After adding these, the deployment should automatically restart and work properly.

Then test: https://staging-war-room-4-4-backend-twpi.encr.app/health