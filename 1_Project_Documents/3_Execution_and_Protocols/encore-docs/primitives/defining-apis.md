# Defining APIs

Encore.ts makes it simple to create type-safe, idiomatic TypeScript API endpoints with automatic validation.

## Basic API Definition

Use the `api` function from `encore.dev/api` to define endpoints:

```typescript
import { api } from "encore.dev/api";

// Simple GET endpoint
export const hello = api(
  { method: "GET", path: "/hello" },
  async (): Promise<{ message: string }> => {
    return { message: "Hello World!" };
  }
);
```

## Request and Response Types

Define interfaces for type-safe requests and responses:

```typescript
import { api } from "encore.dev/api";

interface CreateUserParams {
  name: string;
  email: string;
  age?: number; // Optional field
}

interface CreateUserResponse {
  id: string;
  created: Date;
}

export const createUser = api(
  { method: "POST", path: "/users" },
  async (params: CreateUserParams): Promise<CreateUserResponse> => {
    // Params are automatically validated
    return {
      id: "user_123",
      created: new Date(),
    };
  }
);
```

## API Visibility

### Private APIs (Default)
Only accessible from other services within your application:

```typescript
export const internalAPI = api(
  { method: "GET", path: "/internal", expose: false }, // or omit expose
  async () => ({ data: "internal" })
);
```

### Public APIs
Accessible from the internet:

```typescript
export const publicAPI = api(
  { method: "GET", path: "/public", expose: true },
  async () => ({ data: "public" })
);
```

## Path Parameters

Use `:paramName` in the path:

```typescript
export const getUser = api(
  { method: "GET", path: "/users/:id" },
  async ({ id }: { id: string }) => {
    return { userId: id };
  }
);

// Multiple path parameters
export const getPost = api(
  { method: "GET", path: "/users/:userId/posts/:postId" },
  async ({ userId, postId }: { userId: string; postId: string }) => {
    return { userId, postId };
  }
);
```

## Query Parameters

Use the `Query` type for query string parameters:

```typescript
import { api, Query } from "encore.dev/api";

interface ListUsersParams {
  limit?: Query<number>;  // ?limit=10
  offset?: Query<number>; // ?offset=20
  filter?: Query<string>; // ?filter=active
}

export const listUsers = api(
  { method: "GET", path: "/users" },
  async (params: ListUsersParams) => {
    const limit = params.limit ?? 10;
    const offset = params.offset ?? 0;
    
    return { 
      users: [],
      limit,
      offset 
    };
  }
);
```

## Headers

Access HTTP headers using the `Header` type:

```typescript
import { api, Header } from "encore.dev/api";

interface AuthorizedRequest {
  authorization: Header<"Authorization">;
  userAgent?: Header<"User-Agent">;
}

export const secureEndpoint = api(
  { method: "POST", path: "/secure" },
  async (params: AuthorizedRequest) => {
    const token = params.authorization; // "Bearer xxx"
    const ua = params.userAgent;
    
    return { authenticated: true };
  }
);
```

## Authentication

Require authentication with `auth: true`:

```typescript
export const protectedAPI = api(
  { method: "GET", path: "/protected", auth: true },
  async (params, ctx) => {
    // ctx contains auth information
    return { message: "Authenticated!" };
  }
);
```

## Custom Status Codes

Return custom HTTP status codes:

```typescript
import { api, HttpStatus } from "encore.dev/api";

interface CreateResponse {
  id: string;
  status: HttpStatus;
}

export const create = api(
  { method: "POST", path: "/items" },
  async (): Promise<CreateResponse> => {
    return {
      id: "item_123",
      status: HttpStatus.Created, // 201
    };
  }
);
```

## Request Body

For POST/PUT/PATCH requests, the entire params object is the body:

```typescript
interface UpdateUserBody {
  name?: string;
  email?: string;
  bio?: string;
}

export const updateUser = api(
  { method: "PATCH", path: "/users/:id" },
  async ({ id, ...body }: { id: string } & UpdateUserBody) => {
    // id comes from path
    // body contains name, email, bio
    return { updated: true };
  }
);
```

## Cookies

Work with cookies using the `Cookie` type:

```typescript
import { api, Cookie, CookieWithOptions } from "encore.dev/api";

interface LoginResponse {
  success: boolean;
  sessionToken: CookieWithOptions<string>;
}

export const login = api(
  { method: "POST", path: "/login" },
  async (): Promise<LoginResponse> => {
    return {
      success: true,
      sessionToken: {
        value: "session_abc123",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 86400, // 1 day
      },
    };
  }
);

// Reading cookies
interface AuthRequest {
  sessionToken?: Cookie<"session-token">;
}

export const checkAuth = api(
  { method: "GET", path: "/auth/check" },
  async (params: AuthRequest) => {
    const token = params.sessionToken;
    return { authenticated: !!token };
  }
);
```

## Validation

Encore automatically validates requests based on your TypeScript types:

```typescript
interface StrictParams {
  email: string;        // Required, must be string
  age: number;         // Required, must be number
  active?: boolean;    // Optional boolean
  tags: string[];      // Required array
  metadata?: {         // Optional nested object
    source: string;
  };
}

export const strictAPI = api(
  { method: "POST", path: "/strict" },
  async (params: StrictParams) => {
    // Params are guaranteed to match the interface
    return { valid: true };
  }
);
```

Invalid requests automatically return 400 Bad Request with details.

## API Documentation

Encore automatically generates OpenAPI documentation for all your APIs:
- Available at `http://localhost:9400` in development
- Includes all endpoints, parameters, and responses
- Interactive API explorer for testing

## Best Practices

1. **Use descriptive names**: `createUser` instead of `create`
2. **Group related APIs**: Put them in the same service
3. **Version your APIs**: Use path prefixes like `/v1/users`
4. **Handle errors gracefully**: Return appropriate status codes
5. **Document complex logic**: Add comments for business rules
6. **Keep payloads small**: Don't return unnecessary data
7. **Use consistent naming**: camelCase for fields

## Related Topics

- [API Calls](api-calls.md) - Calling APIs between services
- [Validation](validation.md) - Advanced validation rules
- [Raw Endpoints](./raw-endpoints.md) - Low-level HTTP handling
- [API Errors](errors.md) - Error handling
- [Authentication](auth.md) - Setting up auth