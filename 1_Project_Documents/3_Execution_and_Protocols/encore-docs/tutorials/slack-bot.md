# Building a Slack Bot with Encore.ts

## Overview

This tutorial guides you through creating a Slack bot using Encore.ts that implements a "/cowsay" command. You'll learn how to:

- Create a serverless backend with webhook integration
- Handle Slack slash commands
- Implement security verification for Slack requests
- Deploy and configure a production Slack bot

## Prerequisites

- Encore CLI
- Slack workspace with admin permissions
- Node.js

## Step 1: Create Encore Application

```bash
encore app create slack-bot
cd slack-bot
```

Note your app ID from the output - you'll need it for Slack configuration.

## Step 2: Create Slack App

1. Go to [Slack API website](https://api.slack.com/apps)
2. Click "Create New App" → "From an app manifest"
3. Use this manifest (replace YOUR_APP_ID):

```json
{
  "display_information": {
    "name": "Cowsay Bot"
  },
  "features": {
    "bot_user": {
      "display_name": "Cowsay Bot",
      "always_online": false
    },
    "slash_commands": [
      {
        "command": "/cowsay",
        "url": "https://staging-YOUR_APP_ID.encr.app/slack/cowsay",
        "description": "Make a cow say something",
        "usage_hint": "your message here"
      }
    ]
  },
  "oauth_config": {
    "scopes": {
      "bot": [
        "commands"
      ]
    }
  },
  "settings": {
    "event_subscriptions": {
      "bot_events": []
    },
    "interactivity": {
      "is_enabled": false
    },
    "org_deploy_enabled": false,
    "socket_mode_enabled": false,
    "token_rotation_enabled": false
  }
}
```

## Step 3: Implement Slack Service

Create `slack/encore.service.ts`:
```typescript
import { Service } from "encore.dev/service";
export default new Service("slack");
```

Create `slack/slack.ts`:
```typescript
import { api } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { createHmac, timingSafeEqual } from "node:crypto";

const slackSigningSecret = secret("SlackSigningSecret");

interface SlackRequest {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
}

export const cowsay = api.raw(
  { expose: true, path: "/slack/cowsay", method: "POST" },
  async (req, resp) => {
    // Verify the request came from Slack
    const timestamp = req.header("x-slack-request-timestamp");
    const signature = req.header("x-slack-signature");
    
    if (!verifySlackSignature(req.body, timestamp, signature)) {
      resp.writeHead(401, { "Content-Type": "text/plain" });
      resp.end("Unauthorized");
      return;
    }

    // Parse the form data
    const body = new URLSearchParams(req.body.toString());
    const text = body.get("text") || "Hello, World!";
    
    // Generate cowsay response
    const cowsayText = generateCowsay(text);
    
    // Send response
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.end(JSON.stringify({
      response_type: "in_channel",
      text: "```" + cowsayText + "```"
    }));
  }
);

function verifySlackSignature(body: Buffer, timestamp: string, signature: string): boolean {
  const signingSecret = slackSigningSecret();
  
  // Reject old requests (older than 5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    return false;
  }
  
  // Compute the expected signature
  const sigBasestring = `v0:${timestamp}:${body.toString()}`;
  const expectedSignature = `v0=${createHmac('sha256', signingSecret)
    .update(sigBasestring)
    .digest('hex')}`;
  
  // Compare signatures securely
  return signature && timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

function generateCowsay(text: string): string {
  const message = text.length > 40 ? text.substring(0, 37) + "..." : text;
  const border = "-".repeat(message.length + 2);
  
  return `
 ${border}
< ${message} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
}
```

## Step 4: Configure Secrets

Set up the Slack signing secret:

```bash
encore secret set --type dev,staging,prod SlackSigningSecret
```

Find the signing secret in your Slack app settings under "Basic Information" → "App Credentials".

## Step 5: Enhanced Cowsay Implementation

For a more feature-rich implementation, create `slack/cowsay.ts`:

```typescript
interface CowsayOptions {
  eyes?: string;
  tongue?: string;
  mode?: 'default' | 'borg' | 'dead' | 'greedy' | 'paranoid' | 'stoned' | 'tired' | 'wired' | 'young';
}

export function generateAdvancedCowsay(text: string, options: CowsayOptions = {}): string {
  const { eyes = "oo", tongue = "  ", mode = "default" } = options;
  
  // Apply mode-specific settings
  const modeSettings = getModeSettings(mode);
  const actualEyes = modeSettings.eyes || eyes;
  const actualTongue = modeSettings.tongue || tongue;
  
  // Word wrap the text
  const lines = wrapText(text, 38);
  const maxLength = Math.max(...lines.map(line => line.length));
  
  // Create speech bubble
  const border = "-".repeat(maxLength + 2);
  const bubble = [
    ` ${border}`,
    ...lines.map((line, index) => {
      const padding = " ".repeat(maxLength - line.length);
      if (lines.length === 1) return `< ${line}${padding} >`;
      if (index === 0) return `/ ${line}${padding} \\`;
      if (index === lines.length - 1) return `\\ ${line}${padding} /`;
      return `| ${line}${padding} |`;
    }),
    ` ${border}`
  ].join('\n');
  
  // Create cow
  const cow = `
        \\   ^__^
         \\  (${actualEyes})\\_______
            (__)\\       )\\/\\
             ${actualTongue} ||----w |
                ||     ||`;
  
  return bubble + cow;
}

function getModeSettings(mode: string) {
  const modes: Record<string, { eyes?: string; tongue?: string }> = {
    borg: { eyes: "==" },
    dead: { eyes: "xx", tongue: "U " },
    greedy: { eyes: "$$" },
    paranoid: { eyes: "@@" },
    stoned: { eyes: "**", tongue: "U " },
    tired: { eyes: "--" },
    wired: { eyes: "OO" },
    young: { eyes: ".." }
  };
  return modes[mode] || {};
}

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + word).length <= maxWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines.length ? lines : [''];
}
```

## Step 6: Add Command Parsing

Update `slack/slack.ts` to support different modes:

```typescript
export const cowsay = api.raw(
  { expose: true, path: "/slack/cowsay", method: "POST" },
  async (req, resp) => {
    // ... verification code ...
    
    const body = new URLSearchParams(req.body.toString());
    const text = body.get("text") || "Hello, World!";
    
    // Parse command options
    const parts = text.split(' ');
    const options: CowsayOptions = {};
    let message = text;
    
    // Check for mode flags
    if (parts[0] && parts[0].startsWith('-')) {
      const mode = parts[0].substring(1);
      options.mode = mode as any;
      message = parts.slice(1).join(' ');
    }
    
    const cowsayText = generateAdvancedCowsay(message, options);
    
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.end(JSON.stringify({
      response_type: "in_channel",
      text: "```" + cowsayText + "```"
    }));
  }
);
```

## Step 7: Deploy and Test

```bash
# Deploy to staging
git add . && git commit -m "Slack bot implementation"
git push encore

# Install the Slack app to your workspace
# Test with: /cowsay Hello from Encore!
# Test modes: /cowsay -dead Something spooky
```

## Usage Examples

Basic usage:
```
/cowsay Hello, World!
```

With modes:
```
/cowsay -dead I'm not feeling well
/cowsay -borg Resistance is futile
/cowsay -stoned Whoa, dude...
```

## Key Features

- **Secure webhook verification** using HMAC signatures
- **Multiple cow modes** for different personalities
- **Word wrapping** for long messages
- **Production-ready deployment** with Encore Cloud
- **Secret management** for API credentials

## Security Considerations

1. Always verify Slack signatures to prevent unauthorized requests
2. Use timing-safe comparison for signature verification
3. Reject old requests to prevent replay attacks
4. Store sensitive credentials in Encore's secret management
5. Use HTTPS endpoints for all Slack integrations

This tutorial demonstrates how to build a robust, secure Slack bot using Encore.ts with minimal infrastructure setup and built-in security best practices.