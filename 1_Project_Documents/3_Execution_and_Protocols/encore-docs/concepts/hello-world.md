# Hello World in Encore.ts

Encore enables developers to create type-safe, idiomatic TypeScript API endpoints with minimal boilerplate. Here's a simple Hello World example:

## Defining an API Endpoint

```typescript
import { api } from "encore.dev/api";

export const get = api(
 { expose: true, method: "GET", path: "/hello/:name" },
 async ({ name }: { name: string }): Promise<Response> => {
   const msg = `Hello ${name}!`;
   return { message: msg };
 }
);

interface Response {
 message: string;
}
```

## Key Features

Encore provides several key capabilities:
- Automatically parses and validates incoming requests
- Generates necessary boilerplate at compile-time
- Enables creating production-ready services in under 10 lines of code

## Getting Started

The framework supports adding various primitives easily, including:
- Services
- APIs
- Databases
- Cron Jobs
- Pub/Sub
- Secrets

## Example Project

You can create a Hello World example using the Encore CLI:

```bash
$ encore app create --example=ts/hello-world
```

A getting started video is also available to help developers understand the basics of Encore.ts.