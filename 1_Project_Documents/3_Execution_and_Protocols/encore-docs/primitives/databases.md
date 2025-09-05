# SQL Databases

Encore provides native PostgreSQL database support with automatic provisioning, migrations, and connection management.

## Creating a Database

Define a database as a resource in your service:

```typescript
import { SQLDatabase } from "encore.dev/storage/sqldb";

// Create a database named "myapp"
const db = new SQLDatabase("myapp", {
  migrations: "./migrations",
});
```

## Migrations

Encore uses SQL migrations to manage your database schema.

### Migration Files

Create migration files in the `migrations` directory:

```
service/
├── encore.service.ts
├── api.ts
└── migrations/
    ├── 1_create_users.up.sql
    ├── 2_add_posts.up.sql
    └── 3_add_indexes.up.sql
```

### Migration Naming

Migration files must:
- Start with a number (sequential)
- Followed by underscore
- Descriptive name
- End with `.up.sql`

### Example Migration

```sql
-- migrations/1_create_users.up.sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

## Querying Data

### Query Methods

```typescript
// db.query - Returns async iterator
const users = db.query`SELECT * FROM users WHERE active = true`;
for await (const user of users) {
  console.log(user.name);
}

// db.queryRow - Returns single row or null
const user = await db.queryRow`
  SELECT * FROM users WHERE id = ${userId}
`;

// db.queryAll - Returns array of all rows
const allUsers = await db.queryAll`
  SELECT * FROM users ORDER BY created_at DESC
`;
```

### Type-Safe Queries

Define types for your query results:

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

// Type-safe query
const user = await db.queryRow<User>`
  SELECT * FROM users WHERE id = ${userId}
`;

// user is typed as User | null
if (user) {
  console.log(user.email); // Type-safe access
}
```

## Inserting Data

### Simple Insert

```typescript
await db.exec`
  INSERT INTO users (email, name)
  VALUES (${email}, ${name})
`;
```

### Insert with Returning

```typescript
const newUser = await db.queryRow<{ id: number }>`
  INSERT INTO users (email, name)
  VALUES (${email}, ${name})
  RETURNING id
`;

console.log(`Created user with ID: ${newUser?.id}`);
```

### Bulk Insert

```typescript
const users = [
  { email: "user1@example.com", name: "User 1" },
  { email: "user2@example.com", name: "User 2" },
];

for (const user of users) {
  await db.exec`
    INSERT INTO users (email, name)
    VALUES (${user.email}, ${user.name})
  `;
}
```

## Updating Data

```typescript
await db.exec`
  UPDATE users 
  SET name = ${newName}, updated_at = NOW()
  WHERE id = ${userId}
`;

// Update with returning
const updated = await db.queryRow<User>`
  UPDATE users 
  SET name = ${newName}, updated_at = NOW()
  WHERE id = ${userId}
  RETURNING *
`;
```

## Deleting Data

```typescript
// Simple delete
await db.exec`
  DELETE FROM users WHERE id = ${userId}
`;

// Delete with check
const deleted = await db.queryRow<{ id: number }>`
  DELETE FROM users 
  WHERE id = ${userId}
  RETURNING id
`;

if (!deleted) {
  throw new Error("User not found");
}
```

## Transactions

Use transactions for atomic operations:

```typescript
import { getCurrentRequest } from "encore.dev";

export const transferFunds = api(
  { method: "POST", path: "/transfer" },
  async (params: TransferParams) => {
    // Start transaction
    const tx = await db.begin();
    
    try {
      // Debit from account
      await tx.exec`
        UPDATE accounts 
        SET balance = balance - ${params.amount}
        WHERE id = ${params.fromAccount}
      `;
      
      // Credit to account
      await tx.exec`
        UPDATE accounts 
        SET balance = balance + ${params.amount}
        WHERE id = ${params.toAccount}
      `;
      
      // Commit transaction
      await tx.commit();
      return { success: true };
      
    } catch (error) {
      // Rollback on error
      await tx.rollback();
      throw error;
    }
  }
);
```

## Raw SQL Queries

For complex queries, use raw SQL:

```typescript
// Raw query with parameters
const results = await db.rawQuery(
  `SELECT u.*, COUNT(p.id) as post_count
   FROM users u
   LEFT JOIN posts p ON p.user_id = u.id
   WHERE u.created_at > $1
   GROUP BY u.id
   ORDER BY post_count DESC
   LIMIT $2`,
  startDate,
  limit
);

// Raw exec for complex operations
await db.rawExec(
  `CREATE TEMPORARY TABLE temp_stats AS
   SELECT user_id, COUNT(*) as count
   FROM events
   WHERE created_at > $1
   GROUP BY user_id`,
  cutoffDate
);
```

## Connection Pooling

Encore automatically manages connection pooling. You don't need to:
- Open/close connections
- Manage connection pools
- Handle connection errors

## Testing with Databases

In tests, each test gets an isolated database:

```typescript
import { describe, test, expect } from "vitest";
import { db } from "./db";

describe("User Service", () => {
  test("create user", async () => {
    // This runs in an isolated database
    await db.exec`
      INSERT INTO users (email, name)
      VALUES ('test@example.com', 'Test User')
    `;
    
    const user = await db.queryRow`
      SELECT * FROM users WHERE email = 'test@example.com'
    `;
    
    expect(user).toBeDefined();
    expect(user?.name).toBe('Test User');
  });
  
  // Each test gets a fresh database
  test("another test", async () => {
    // Previous test's data is not here
    const count = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM users
    `;
    
    expect(count?.count).toBe(0);
  });
});
```

## Local Development

When running `encore run`:
- Databases are created automatically
- Migrations run on startup
- Use `encore db shell <database-name>` to connect via psql
- Data persists between runs

## Database Commands

```bash
# Connect to database shell
encore db shell myapp

# Reset database (drop and recreate)
encore db reset myapp

# Run migrations manually
encore db migrate myapp

# Create a new migration
encore db migration create myapp "add_user_roles"
```

## Best Practices

1. **Always use migrations** - Never modify schema manually
2. **Use transactions** - For operations that must be atomic
3. **Type your queries** - Define interfaces for query results
4. **Index foreign keys** - Improve join performance
5. **Use connection pooling** - Let Encore handle it
6. **Avoid N+1 queries** - Use joins or batch queries
7. **Parameterize queries** - Never concatenate SQL strings

## Performance Tips

### Indexes

```sql
-- Index for lookups
CREATE INDEX idx_users_email ON users(email);

-- Composite index for queries
CREATE INDEX idx_posts_user_created 
ON posts(user_id, created_at DESC);

-- Partial index
CREATE INDEX idx_active_users 
ON users(email) 
WHERE active = true;
```

### Query Optimization

```typescript
// Bad: N+1 query
const users = await db.queryAll`SELECT * FROM users`;
for (const user of users) {
  const posts = await db.queryAll`
    SELECT * FROM posts WHERE user_id = ${user.id}
  `;
}

// Good: Single query with join
const usersWithPosts = await db.queryAll`
  SELECT u.*, 
    COALESCE(
      json_agg(
        json_build_object('id', p.id, 'title', p.title)
      ) FILTER (WHERE p.id IS NOT NULL), 
      '[]'
    ) as posts
  FROM users u
  LEFT JOIN posts p ON p.user_id = u.id
  GROUP BY u.id
`;
```

## Related Topics

- [PostgreSQL Extensions](./databases-extensions.md)
- [Caching](./caching.md)
- [Testing](testing.md)
- [Migrations Guide](../develop/migrations.md)