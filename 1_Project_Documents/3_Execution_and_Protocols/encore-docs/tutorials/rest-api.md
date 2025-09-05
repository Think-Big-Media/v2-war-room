# Building a REST API with Encore and TypeScript: URL Shortener Tutorial

## Overview

This tutorial guides you through creating a URL shortener REST API using Encore and TypeScript. You'll learn how to:

- Create REST APIs
- Use PostgreSQL databases
- Utilize the local development dashboard
- Write and run tests

## Prerequisites

- Node.js installed
- Docker installed
- Encore CLI

## Step 1: Create a New Encore Application

1. Create a new application:
```bash
encore app create
```
Select the "Empty app" template.

2. Create a URL service directory:
```bash
mkdir url
touch url/encore.service.ts
```

3. Define the service in `url/encore.service.ts`:
```typescript
import { Service } from "encore.dev/service";

export default new Service("url");
```

## Step 2: Implement URL Shortening Endpoint

Create `url/url.ts`:

```typescript
import { api } from "encore.dev/api";
import { randomBytes } from "node:crypto";

interface URL {
  id: string;     // short-form URL id
  url: string;    // complete URL
}

interface ShortenParams {
  url: string;    // URL to shorten
}

export const shorten = api(
  { method: "POST", path: "/url", expose: true },
  async ({ url }: ShortenParams): Promise<URL> => {
    const id = randomBytes(6).toString("base64url");
    return { id, url };
  }
);
```

## Step 3: Add Database Storage

1. Create database migration file:
```bash
mkdir url/migrations
touch url/migrations/001_create_tables.up.sql
```

2. Define database schema in `001_create_tables.up.sql`:
```sql
CREATE TABLE url (
  id TEXT PRIMARY KEY,
  original_url TEXT NOT NULL
);
```

3. Update `url/url.ts` to use database:
```typescript
import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { randomBytes } from "node:crypto";

const db = new SQLDatabase("url", { migrations: "./migrations" });

interface URL {
  id: string;
  url: string;
}

interface ShortenParams {
  url: string;
}

export const shorten = api(
  { method: "POST", path: "/url", expose: true },
  async ({ url }: ShortenParams): Promise<URL> => {
    const id = randomBytes(6).toString("base64url");
    await db.exec`
      INSERT INTO url (id, original_url)
      VALUES (${id}, ${url})
    `;
    return { id, url };
  }
);
```

## Step 4: Add URL Retrieval Endpoint

```typescript
import { APIError } from "encore.dev/api";

export const get = api(
  { expose: true, method: "GET", path: "/url/:id" },
  async ({ id }: { id: string }): Promise<URL> => {
    const row = await db.queryRow`
      SELECT original_url FROM url WHERE id = ${id}
    `;
    if (!row) throw APIError.notFound("url not found");
    return { id, url: row.original_url };
  }
);
```

## Step 5: Testing Your API

1. Run your application:
```bash
encore run
```

2. Test using the local development dashboard or curl:
```bash
# Shorten a URL
curl -X POST http://localhost:4000/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://encore.dev"}'

# Retrieve a URL
curl http://localhost:4000/url/{id}
```

## Step 6: Writing Tests

Create `url/url.test.ts`:
```typescript
import { describe, expect, test } from "vitest";
import { shorten, get } from "./url";

describe("url shortener", () => {
  test("shorten and get URL", async () => {
    const url = "https://encore.dev";
    const shortened = await shorten({ url });
    expect(shortened.url).toBe(url);
    
    const retrieved = await get({ id: shortened.id });
    expect(retrieved.url).toBe(url);
  });
});
```

Run tests with:
```bash
encore test
```

## Step 7: Deployment Options

### Self-hosting with Docker
```bash
git add . && git commit -m "Initial commit"
encore build docker my-app
docker run -p 8080:8080 my-app
```

### Encore Cloud
```bash
git push encore
```

## Key Features Demonstrated

- **Type-safe APIs**: Full TypeScript support with compile-time checking
- **Database Integration**: Built-in PostgreSQL support with migrations
- **Testing Framework**: Integrated testing with Vitest
- **Local Development**: Hot reloading and development dashboard
- **Error Handling**: Structured error responses

This tutorial showcases Encore's streamlined approach to building production-ready REST APIs with minimal boilerplate code.