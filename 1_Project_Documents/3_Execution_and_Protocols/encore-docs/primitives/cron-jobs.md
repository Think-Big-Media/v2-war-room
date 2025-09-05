# Encore Cron Jobs (TypeScript)

## Overview

Cron Jobs in Encore provide a declarative way to run periodic and recurring tasks in backend applications. Encore automatically manages scheduling, monitoring, and execution of these jobs.

## Defining a Cron Job

### Basic Syntax

```typescript
import { CronJob } from "encore.dev/cron";
import { api } from "encore.dev/api";

const _ = new CronJob("unique-job-id", {
  title: "Job Description",
  every: "2h",  // Periodic interval
  endpoint: jobFunction
});
```

### Key Configuration Options

- `unique-job-id`: A unique identifier for the job
- `title`: Human-readable job description
- `every`: Periodic interval (must divide 24 hours evenly)
- `endpoint`: The API function to execute

## Scheduling Modes

### Periodic Scheduling

Use the `every` field for simple recurring tasks:
- Runs at midnight UTC
- Interval must evenly divide 24 hours
- Supported formats: `10m`, `6h`
- Invalid example: `7h` (not evenly divisible)

### Advanced Cron Expressions

For more complex scheduling, use the `schedule` field:

```typescript
const _ = new CronJob("monthly-sync", {
  title: "Monthly Accounting Sync",
  schedule: "0 4 15 * *",  // 4am on 15th of each month
  endpoint: monthlyAccountingSync
});
```

## Important Considerations

- Not executed during local development or preview environments
- Free tier limited to once per hour
- Both public and private APIs supported
- Endpoints must be:
  - Idempotent
  - Without request parameters

## Execution Environment

- Runs in Encore Cloud
- Managed scheduling and monitoring
- Dashboard available for tracking job executions