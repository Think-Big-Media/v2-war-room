# Building an Event-Driven Uptime Monitoring System with Encore.ts

## Overview

This tutorial guides you through creating an uptime monitoring system using TypeScript and Encore. The application will:
- Check website availability
- Track site status
- Send Slack notifications when sites go down

## Prerequisites

- Docker
- Node.js
- Encore CLI

## Project Structure

The application will consist of three main services:
1. `site` - Manage monitored websites
2. `monitor` - Check website status
3. `slack` - Send notifications

## Step 1: Create Encore Application

```bash
encore app create uptime --example=github.com/encoredev/example-app-uptime/tree/starting-point-ts
```

## Step 2: Create Monitor Service

### Create Service Definition

`monitor/encore.service.ts`:
```typescript
import { Service } from "encore.dev/service";
export default new Service("monitor");
```

### Implement Ping Endpoint

`monitor/ping.ts`:
```typescript
import { api } from "encore.dev/api";

export interface PingParams {
  url: string;
}

export interface PingResponse {
  up: boolean;
}

export const ping = api<PingParams, PingResponse>(
  { expose: true, path: "/ping/:url", method: "GET" },
  async ({ url }) => {
    if (!url.startsWith("http:") && !url.startsWith("https:")) {
      url = "https://" + url;
    }

    try {
      const resp = await fetch(url, { method: "GET" });
      const up = resp.status >= 200 && resp.status < 300;
      return { up };
    } catch (err) {
      return { up: false };
    }
  }
);
```

## Step 3: Create Site Service

### Database Migration

`site/migrations/1_create_tables.up.sql`:
```sql
CREATE TABLE site (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL UNIQUE
);
```

### Site Management

`site/site.ts`:
```typescript
import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("site", { migrations: "./migrations" });

export interface Site {
  id: number;
  url: string;
}

export const add = api(
  { expose: true, method: "POST", path: "/site" },
  async ({ url }: { url: string }): Promise<Site> => {
    const site = await db.queryRow`
      INSERT INTO site (url) VALUES (${url})
      RETURNING id, url
    `;
    return site!;
  }
);

export const list = api(
  { expose: true, method: "GET", path: "/site" },
  async (): Promise<{ sites: Site[] }> => {
    const sites = await db.query`SELECT id, url FROM site`;
    return { sites };
  }
);
```

## Step 4: Event-Driven Architecture

### Pub/Sub Topics

`monitor/check.ts`:
```typescript
import { Topic } from "encore.dev/pubsub";
import { Subscription } from "encore.dev/pubsub";
import { api } from "encore.dev/api";

export interface CheckEvent {
  siteId: number;
  url: string;
}

export const checkTopic = new Topic<CheckEvent>("check", {
  deliveryGuarantee: "at-least-once",
});

export const checkSite = api(
  { expose: true, method: "POST", path: "/check/:siteId" },
  async ({ siteId }: { siteId: number }): Promise<void> => {
    const site = await getSite(siteId);
    await checkTopic.publish({ siteId, url: site.url });
  }
);

export const _ = new Subscription(checkTopic, "check-handler", {
  handler: async (event: CheckEvent) => {
    const result = await ping({ url: event.url });
    console.log(`Site ${event.url} is ${result.up ? "up" : "down"}`);
  },
});
```

## Step 5: Slack Integration

### Slack Service

`slack/slack.ts`:
```typescript
import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const slackWebhook = secret("SlackWebhookURL");

export interface NotifyParams {
  text: string;
}

export const notify = api(
  { expose: true, method: "POST", path: "/slack/notify" },
  async ({ text }: NotifyParams): Promise<void> => {
    const webhookURL = slackWebhook();
    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  }
);
```

## Step 6: Cron Jobs

### Periodic Monitoring

`monitor/check.ts` (additional code):
```typescript
import { CronJob } from "encore.dev/cron";

const _ = new CronJob("check-all-sites", {
  title: "Check all monitored sites",
  schedule: "*/5 * * * *", // Every 5 minutes
  endpoint: checkAllSites,
});

const checkAllSites = api(
  { expose: false },
  async (): Promise<void> => {
    const { sites } = await list();
    for (const site of sites) {
      await checkTopic.publish({ siteId: site.id, url: site.url });
    }
  }
);
```

## Step 7: Run and Test

```bash
# Start development server
encore run

# Add a site to monitor
curl -X POST http://localhost:4000/site -d '{"url":"https://example.com"}'

# Manually check a site
curl -X POST http://localhost:4000/check/1

# View logs and metrics in development dashboard
encore daemon
```

## Key Concepts Demonstrated

- **Event-driven architecture** with Pub/Sub
- **Cron jobs** for scheduled tasks
- **Database integration** with migrations
- **External API integration** (Slack)
- **Secret management** for API keys
- **Service communication** patterns

This tutorial showcases Encore's capabilities for building production-ready, event-driven applications with minimal boilerplate code.