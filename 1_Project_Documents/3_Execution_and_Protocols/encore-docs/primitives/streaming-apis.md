# Encore TypeScript Streaming APIs

## Overview

Encore provides a robust streaming API system that supports three primary streaming patterns:

1. **StreamIn**: Client-to-server data streaming
2. **StreamOut**: Server-to-client data streaming
3. **StreamInOut**: Bidirectional data streaming

## Key Streaming Concepts

### WebSocket Handshake
When establishing a stream, Encore performs an initial HTTP handshake that can include:
- Path parameters
- Query parameters
- Headers

### Stream Types

#### StreamIn Example
```typescript
export const uploadStream = api.streamIn<Handshake, Message, Response>({
  path: "/upload", 
  expose: true
}, async (handshake, stream) => {
  const chunks: string[] = [];
  for await (const data of stream) {
    chunks.push(data.data);
    if (data.done) break;
  }
  return { success: true };
});
```

#### StreamOut Example
```typescript
export const logStream = api.streamOut<Handshake, Message>({
  path: "/logs", 
  expose: true
}, async (handshake, stream) => {
  for await (const row of mockedLogs(handshake.rows, stream)) {
    await stream.send({ row });
  }
});
```

#### StreamInOut Example
```typescript
export const ChatStream = api.streamInOut<InMessage, OutMessage>({
  path: "/chat", 
  expose: true
}, async (stream) => {
  for await (const chatMessage of stream) {
    await stream.send({ /* response */ });
  }
});
```

## Advanced Streaming Patterns

### Authentication
- Use `auth: true` in endpoint options
- Authentication data passed via query parameters or headers
- Access authentication data with `getAuthData()`

### Broadcasting Messages
```typescript
const connectedStreams: Map<string, StreamInOut<ChatMessage, ChatMessage>> = new Map();

export const chat = api.streamInOut<HandshakeRequest, ChatMessage, ChatMessage>({
  expose: true, 
  path: "/chat"
}, async (handshake, stream) => {
  const userId = handshake.userId;
  connectedStreams.set(userId, stream);
  
  try {
    for await (const message of stream) {
      // Broadcast to all connected clients
      for (const [id, clientStream] of connectedStreams) {
        if (id !== userId) {
          await clientStream.send(message);
        }
      }
    }
  } finally {
    connectedStreams.delete(userId);
  }
});
```

## Error Handling

Streaming APIs support error handling through standard Encore error mechanisms:

```typescript
import { APIError } from "encore.dev/api";

export const protectedStream = api.streamOut<{}, Message>({
  path: "/protected",
  auth: true
}, async (handshake, stream) => {
  if (!isAuthorized(handshake.auth)) {
    throw APIError.unauthenticated("access denied");
  }
  // Stream logic here
});
```

## Best Practices

- Always clean up resources in finally blocks
- Implement proper error handling for stream interruptions
- Use authentication for sensitive streaming endpoints
- Consider rate limiting for high-volume streams
- Monitor stream connections for resource management