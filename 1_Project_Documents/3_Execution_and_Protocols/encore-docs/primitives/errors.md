# Encore TypeScript API Errors

## Overview

Encore provides a standardized approach to handling and returning API errors with structured information. The error format includes three key components:

```json
{
  "code": "error_type",
  "message": "descriptive error message",
  "details": null
}
```

## Error Handling

### Throwing Errors

To return an error, use the `APIError` from `encore.dev/api`:

```typescript
import { APIError, ErrCode } from "encore.dev/api";

// Verbose method
throw new APIError(ErrCode.NotFound, "sprocket not found");

// Shorthand method
throw APIError.notFound("sprocket not found");
```

## Error Codes

Encore uses error codes compatible with gRPC, mapping to specific HTTP status codes:

| Error Code | String Value | HTTP Status |
|-----------|--------------|-------------|
| `OK` | `"ok"` | 200 OK |
| `NotFound` | `"not_found"` | 404 Not Found |
| `InvalidArgument` | `"invalid_argument"` | 400 Bad Request |
| `PermissionDenied` | `"permission_denied"` | 403 Forbidden |
| `Unauthenticated` | `"unauthenticated"` | 401 Unauthorized |

## Additional Error Details

You can attach structured details to errors using the `withDetails` method:

```typescript
throw APIError.notFound("resource not found").withDetails(additionalContext);
```

This allows for more comprehensive error reporting while maintaining a consistent error response structure.