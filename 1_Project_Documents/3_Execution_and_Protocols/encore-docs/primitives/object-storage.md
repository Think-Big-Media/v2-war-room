# Encore Object Storage Documentation

## Overview

Object Storage provides a simple and scalable solution for storing files and unstructured data in backend applications. Encore offers a cloud-agnostic API supporting multiple storage providers like Amazon S3, Google Cloud Storage, and S3-compatible services.

## Key Features

- Cloud-agnostic storage API
- Automatic tracing of storage operations
- Local development support
- Integration testing capabilities
- Support for multiple cloud providers

## Creating a Bucket

```typescript
import { Bucket } from "encore.dev/storage/objects";

export const profilePictures = new Bucket("profile-pictures", {
  versioned: false
});
```

## File Operations

### Uploading Files

```typescript
const data = Buffer.from(...); // image data
const attributes = await profilePictures.upload("my-image.jpeg", data, {
  contentType: "image/jpeg"
});
```

### Downloading Files

```typescript
const data = await profilePictures.download("my-image.jpeg");
```

### Listing Objects

```typescript
for await (const entry of profilePictures.list({})) {
  // Process each entry
}
```

### Deleting Objects

```typescript
await profilePictures.remove("my-image.jpeg");
```

## Advanced Features

### Public Buckets

```typescript
export const publicProfilePictures = new Bucket("public-profile-pictures", {
  public: true,
  versioned: false
});

// Get public URL
const url = publicProfilePictures.publicUrl("my-image.jpeg");
```

### Signed Upload/Download URLs

```typescript
// Generate signed upload URL
const uploadUrl = await profilePictures.signedUploadUrl("user-id", {ttl: 7200});

// Generate signed download URL
const downloadUrl = await documents.signedDownloadUrl("document-id", {ttl: 7200});
```

## Bucket References and Permissions

```typescript
import { Uploader } from "encore.dev/storage/objects";

// Create a reference with specific permissions
const ref = profilePictures.ref<Uploader>();
```

## Error Handling

Object Storage operations can throw errors for various reasons such as network issues, permission problems, or missing objects. Always implement proper error handling in your applications.

## Best Practices

- Use appropriate content types for uploads
- Implement proper error handling
- Consider using signed URLs for secure access
- Leverage bucket versioning for important data
- Monitor storage costs and usage