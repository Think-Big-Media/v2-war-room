# SLACK WORKFLOW SETUP - War Room Mentions to Backend

## Quick Setup Instructions for Comet Browser

### 1. Go to Slack Workflows
Navigate to: https://app.slack.com/workflow-builder/T0876TWUG77

### 2. Create New Workflow
Click "Create Workflow" → Choose "From a blank workflow"

### 3. Workflow Configuration

**Name:** War Room Mentions Forwarder
**Trigger:** New message posted to channel
**Channel:** #war-room-mentions

### 4. Add Steps

**Step 1: Extract Message Content**
- Variable name: `message_text`
- Source: Message text from trigger

**Step 2: Format as JSON**
- Create JSON payload:
```json
{
  "text": "{{message_text}}",
  "channel": "war-room-mentions",
  "timestamp": "{{message_ts}}",
  "user": "{{user_name}}"
}
```

**Step 3: Send to Backend**
- Action: Send a webhook
- URL: `https://staging-war-roombackend-45-x83i.encr.app/api/v1/webhook/slack`
- Method: POST
- Headers:
  - Content-Type: application/json
- Body: Use the JSON from Step 2

### 5. Alternative: Using Slack Outgoing Webhooks

If workflows don't work, use Outgoing Webhooks:

1. Go to: https://growthpigs.slack.com/apps/A0F7VRG6Q-outgoing-webhooks
2. Add Configuration
3. Settings:
   - Channel: #war-room-mentions
   - Trigger Words: (leave empty to trigger on all messages)
   - URL: `https://staging-war-roombackend-45-x83i.encr.app/api/v1/webhook/slack`

### 6. Testing
Send a test message in #war-room-mentions and verify it appears in the backend.

## Backend Endpoint Ready
The endpoint `/api/v1/webhook/slack` is already deployed and waiting for messages.