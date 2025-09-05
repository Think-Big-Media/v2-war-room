# Quick Start Guide

This guide helps you build your first Encore.ts application in approximately 5 minutes.

## Prerequisites

- [Node.js](https://nodejs.org/) version 18+
- [Docker](https://docker.com) for local databases
- [Encore CLI](Environment%20Setup/encore-docs/install.md) installed

## Steps

### 1. Install Encore CLI

If you haven't already, install the Encore CLI:

```bash
# macOS
brew install encoredev/tap/encore

# Linux
curl -L https://encore.dev/install.sh | bash

# Windows (WSL)
iwr https://encore.dev/install.ps1 | iex
```

### 2. Create Your App

Create a new Encore application:

```bash
encore app create
```

When prompted:
- Enter a name for your app
- Choose the **Hello World** template
- Optionally create a free Encore account for deployment

### 3. Explore the Code

Your app structure:
```
your-app/
├── hello/
│   ├── hello.ts         # API endpoint definitions
│   └── encore.service.ts # Service configuration
├── package.json
└── tsconfig.json
```

Example API endpoint in `hello/hello.ts`:
```typescript
import { api } from "encore.dev/api";

interface Response {
  message: string;
}

// Public API endpoint
export const world = api(
  { method: "GET", path: "/hello/:name", expose: true },
  async ({ name }: { name: string }): Promise<Response> => {
    return { message: `Hello ${name}!` };
  },
);
```

### 4. Run the Application

Start your local development server:

```bash
cd your-app-name
encore run
```

This will:
- Start the Encore daemon
- Launch the Local Development Dashboard at http://localhost:9400
- Run your API at http://localhost:4000

Test your API:
```bash
curl http://localhost:4000/hello/world
# Response: {"message":"Hello world!"}
```

### 5. Make Changes

Try modifying the response in `hello/hello.ts`:

```typescript
export const world = api(
  { method: "GET", path: "/hello/:name", expose: true },
  async ({ name }: { name: string }): Promise<Response> => {
    const greeting = `Hello ${name}! Welcome to Encore.`;
    return { message: greeting };
  },
);
```

Encore automatically reloads when you save changes.

### 6. Deploy Your Application

#### Option A: Deploy to Encore Cloud

```bash
# Initialize git repository
git init
git add -A .
git commit -m 'Initial commit'

# Deploy to Encore Cloud
git push encore
```

Your app will be deployed to a preview environment with a URL like:
`https://staging-your-app-name-abcd.encr.app`

#### Option B: Generate Docker Image

```bash
encore build docker my-app:latest
```

Then deploy the Docker image to any container platform.

## What's Next?

- **[REST API Tutorial](rest-api.md)** - Build a complete REST API
- **[Database Guide](databases.md)** - Add PostgreSQL to your app
- **[Authentication](auth.md)** - Secure your APIs
- **[Testing](testing.md)** - Write tests for your application

## Useful Commands

```bash
encore run          # Start local development
encore test         # Run tests
encore db shell     # Connect to local database
encore logs         # View application logs
encore gen client   # Generate API client
```

## Getting Help

- 📚 [Documentation](https://encore.dev/docs)
- 💬 [Discord Community](https://encore.dev/discord)
- 🐛 [GitHub Issues](https://github.com/encoredev/encore)