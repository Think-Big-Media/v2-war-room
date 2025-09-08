# Deploy Crisis Endpoint - Quick Fix

## For Comet Browser

Go to: https://app.encore.cloud/war-roombackend-45-x83i

Click "Deploy" and the crisis endpoint will be added.

## What was added

Created `/api/v1/mentionlytics/mentions/crisis` endpoint that returns empty alerts array to fix the 404 error.

File: `mentionlytics/crisis.ts`

This will stop the 404 error in the frontend.