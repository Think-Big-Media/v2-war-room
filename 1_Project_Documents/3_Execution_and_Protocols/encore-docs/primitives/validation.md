# Request Validation in Encore.ts

## Overview

Encore.ts provides built-in runtime validation using TypeScript types, ensuring both compile-time and runtime type safety. The validation system automatically validates request data from multiple sources including request body, query parameters, headers, and path parameters.

## Basic Type Validation

### Primitive Types
```typescript
import { api } from "encore.dev/api";

interface BasicRequest {
  name: string;
  age: number;
  isActive: boolean;
  tags: string[];
}

export const create = api(
  { expose: true, method: "POST", path: "/users" },
  async (req: BasicRequest): Promise<{ success: boolean }> => {
    // req is automatically validated
    return { success: true };
  }
);
```

### Optional and Nullable Fields
```typescript
interface UserRequest {
  email: string;                    // Required
  name?: string;                    // Optional
  avatar: string | null;            // Nullable
  preferences?: string[] | null;    // Optional and nullable
}
```

### Array Validation
```typescript
interface ArrayRequest {
  tags: string[];                   // Array of strings
  scores: number[];                 // Array of numbers
  mixed: (string | number)[];       // Mixed array
  nested: { id: string; name: string }[];  // Array of objects
}
```

## Advanced Validation Rules

### Numeric Constraints
```typescript
import { Min, Max } from "encore.dev/api";

interface NumericRequest {
  age: number & Min<18> & Max<120>;           // Between 18 and 120
  percentage: number & Min<0> & Max<100>;     // 0 to 100
  port: number & Min<1024> & Max<65535>;      // Valid port range
}
```

### String Length Validation
```typescript
import { MinLen, MaxLen } from "encore.dev/api";

interface StringRequest {
  username: string & MinLen<3> & MaxLen<20>;      // 3-20 characters
  password: string & MinLen<8>;                   // At least 8 characters
  description: string & MaxLen<500>;              // Max 500 characters
}
```

### Format Validation
```typescript
import { IsEmail, IsURL } from "encore.dev/api";

interface FormatRequest {
  email: string & IsEmail;                        // Valid email format
  website: string & IsURL;                        // Valid URL format
  contact: string & (IsEmail | IsURL);            // Either email or URL
}
```

### Pattern Matching
```typescript
import { StartsWith, EndsWith, MatchesRegexp } from "encore.dev/api";

interface PatternRequest {
  slug: string & StartsWith<"api-">;              // Must start with "api-"
  filename: string & EndsWith<".json">;           // Must end with ".json"
  phoneNumber: string & MatchesRegexp<"^\\+[1-9]\\d{1,14}$">;  // E.164 format
}
```

### Enum Validation
```typescript
enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator"
}

interface RoleRequest {
  role: UserRole;                                 // Must be valid enum value
  permissions: UserRole[];                        // Array of enum values
}
```

## Complex Validation Examples

### User Registration
```typescript
import { api } from "encore.dev/api";
import { MinLen, MaxLen, IsEmail, Min, Max } from "encore.dev/api";

interface RegisterRequest {
  email: string & IsEmail;
  username: string & MinLen<3> & MaxLen<20>;
  password: string & MinLen<8> & MaxLen<128>;
  age: number & Min<13> & Max<120>;
  terms: boolean;  // Must be true
  newsletter?: boolean;
}

export const register = api(
  { expose: true, method: "POST", path: "/auth/register" },
  async (req: RegisterRequest): Promise<{ userId: string }> => {
    if (!req.terms) {
      throw new Error("Terms must be accepted");
    }
    
    // Process registration
    return { userId: "user-123" };
  }
);
```

### Product Creation
```typescript
interface CreateProductRequest {
  name: string & MinLen<1> & MaxLen<100>;
  description: string & MaxLen<1000>;
  price: number & Min<0.01> & Max<999999.99>;
  category: "electronics" | "clothing" | "books" | "home";
  tags: string[] & MaxLen<10>;  // Max 10 tags
  images: string[] & MinLen<1>; // At least 1 image
  specifications: Record<string, string | number>;
}
```

### Query Parameter Validation
```typescript
interface SearchQuery {
  q: string & MinLen<1> & MaxLen<100>;           // Search query
  page: number & Min<1> & Max<1000>;             // Page number
  limit: number & Min<1> & Max<100>;             // Results per page
  sort?: "name" | "date" | "price";              // Sort order
  category?: string[];                           // Filter categories
}

export const search = api(
  { expose: true, method: "GET", path: "/search" },
  async (query: SearchQuery): Promise<{ results: any[] }> => {
    // Query parameters are automatically validated
    return { results: [] };
  }
);
```

## Validation Sources

### Request Body
```typescript
// POST /api/users
// Content-Type: application/json
// { "name": "John", "age": 30 }

export const createUser = api(
  { expose: true, method: "POST", path: "/users" },
  async ({ name, age }: { name: string; age: number }) => {
    // Body is validated automatically
    return { id: "123", name, age };
  }
);
```

### Path Parameters
```typescript
// GET /api/users/123
export const getUser = api(
  { expose: true, method: "GET", path: "/users/:id" },
  async ({ id }: { id: string & MinLen<1> }) => {
    // Path parameter is validated
    return { id, name: "John" };
  }
);
```

### Query Parameters
```typescript
// GET /api/users?page=1&limit=20
export const listUsers = api(
  { expose: true, method: "GET", path: "/users" },
  async ({ page, limit }: { 
    page: number & Min<1>; 
    limit: number & Min<1> & Max<100>;
  }) => {
    // Query parameters are validated
    return { users: [], page, limit };
  }
);
```

### Headers
```typescript
import { Header } from "encore.dev/api";

export const authenticated = api(
  { expose: true, method: "GET", path: "/profile" },
  async (req: {}, headers: { 
    authorization: Header<"Authorization"> & StartsWith<"Bearer ">
  }) => {
    // Header validation
    return { profile: {} };
  }
);
```

## Error Handling

### Validation Errors
When validation fails, Encore automatically returns a `400 Bad Request` response with detailed error information:

```json
{
  "code": "invalid_argument",
  "message": "validation failed",
  "details": {
    "validationErrors": [
      {
        "field": "age",
        "message": "must be at least 18"
      },
      {
        "field": "email",
        "message": "must be a valid email address"
      }
    ]
  }
}
```

### Custom Validation
For complex business logic validation:

```typescript
import { APIError } from "encore.dev/api";

export const createUser = api(
  { expose: true, method: "POST", path: "/users" },
  async (req: RegisterRequest): Promise<{ userId: string }> => {
    // Built-in validation happens first
    
    // Custom business logic validation
    if (await emailExists(req.email)) {
      throw APIError.invalidArgument("Email already exists");
    }
    
    if (req.username.includes("admin") && req.role !== "admin") {
      throw APIError.invalidArgument("Username reserved for administrators");
    }
    
    return { userId: "user-123" };
  }
);
```

## Best Practices

### 1. Use Type-Safe Validation
```typescript
// Good: Type-safe and validated
interface Request {
  age: number & Min<18>;
}

// Avoid: Manual validation
interface Request {
  age: number;
}
// Then manually checking: if (req.age < 18) throw error
```

### 2. Combine Multiple Constraints
```typescript
interface Username {
  username: string & MinLen<3> & MaxLen<20> & MatchesRegexp<"^[a-zA-Z0-9_]+$">;
}
```

### 3. Use Union Types for Options
```typescript
interface SortRequest {
  sort: "name" | "date" | "price" | "popularity";
  order: "asc" | "desc";
}
```

### 4. Validate All Input Sources
```typescript
export const updateUser = api(
  { expose: true, method: "PUT", path: "/users/:id" },
  async (
    { id }: { id: string & MinLen<1> },                    // Path
    body: { name?: string & MaxLen<100> },                 // Body  
    query: { force?: boolean },                            // Query
    headers: { authorization: Header<"Authorization"> }    // Headers
  ) => {
    // All inputs validated
  }
);
```

## Performance Considerations

- Validation runs in Encore's Rust runtime for optimal performance
- Failed validation short-circuits request processing
- Type information is compiled into efficient validation rules
- No runtime overhead for TypeScript type checking

The validation system provides robust request handling while maintaining excellent performance and developer experience.