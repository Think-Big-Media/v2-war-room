# Automated Testing in Encore TypeScript

## Overview

Encore provides built-in testing tools designed to simplify application testing across various test runners. The core testing workflow involves:

1. Configuring the test command in `package.json`
2. Setting up your preferred test runner
3. Running tests via `encore test`

## Recommended Test Runner: Vitest

### Why Vitest?

Vitest offers key advantages:
- Fast test execution
- Native ESM and TypeScript support
- Jest API compatibility

### Setup Steps

#### Configuration Files

1. Create `vite.config.ts`:

```typescript
/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
 resolve: {
   alias: {
     "~encore": path.resolve(__dirname, "./encore.gen"),
   },
 },
});
```

2. Update `package.json`:

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

#### Optional VS Code Integration

1. Install Vitest VS Code extension
2. Add to `.vscode/settings.json`:

```json
{
  "vitest.commandLine": "encore test"
}
```

## Testing Best Practices

### Integration Testing Focus

Encore recommends integration testing because:
- Minimal boilerplate code
- Business logic often involves databases and inter-service API calls
- Integration tests provide more comprehensive verification

### Test Environment Optimizations

Encore automatically:
- Creates separate test databases
- Optimizes database performance by:
  - Skipping `fsync`
  - Using in-memory filesystems
  - Removing durability overhead

These optimizations make integration tests nearly as performant as unit tests.

## Example Test Structure

```typescript
import { describe, expect, test } from "vitest";
import { createUser, getUser } from "./user";

describe("User Service", () => {
  test("create and retrieve user", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com"
    };
    
    const created = await createUser(userData);
    expect(created.name).toBe(userData.name);
    
    const retrieved = await getUser(created.id);
    expect(retrieved.email).toBe(userData.email);
  });
});
```

## Key Testing Principles

- Prioritize integration over unit tests
- Leverage Encore's built-in infrastructure setup
- Use Vitest for efficient, TypeScript-friendly testing
- Focus on testing actual business logic and service interactions
- Take advantage of automatic database provisioning and cleanup