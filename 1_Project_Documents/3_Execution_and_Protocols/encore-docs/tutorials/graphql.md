# Building a GraphQL API with Encore.ts

## Overview

This tutorial guides you through building a GraphQL API using Encore.ts and Apollo Server. You'll learn how to:

- Set up GraphQL with Encore
- Define GraphQL schemas
- Create resolvers
- Implement CRUD operations
- Deploy GraphQL APIs

## Prerequisites

- Node.js
- Encore CLI
- Basic GraphQL knowledge

## Step 1: Create Encore Application

```bash
encore app create graphql-app
cd graphql-app
```

## Step 2: Install Dependencies

```bash
npm install apollo-server-express graphql
npm install -D @types/graphql
```

## Step 3: Define GraphQL Schema

Create `schema.graphql`:
```graphql
type Book {
  id: ID!
  title: String!
  author: String!
  publishedYear: Int
}

type Query {
  books: [Book!]!
  book(id: ID!): Book
}

type Mutation {
  addBook(title: String!, author: String!, publishedYear: Int): Book!
  updateBook(id: ID!, title: String, author: String, publishedYear: Int): Book
  deleteBook(id: ID!): Boolean!
}
```

## Step 4: Create Book Service

Create `book/encore.service.ts`:
```typescript
import { Service } from "encore.dev/service";
export default new Service("book");
```

Create `book/book.ts`:
```typescript
import { api } from "encore.dev/api";

export interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear?: number;
}

// In-memory storage for demo purposes
let books: Book[] = [
  { id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", publishedYear: 1925 },
  { id: "2", title: "To Kill a Mockingbird", author: "Harper Lee", publishedYear: 1960 },
];

let nextId = 3;

export const getBooks = api(
  { expose: true, method: "GET", path: "/books" },
  async (): Promise<{ books: Book[] }> => {
    return { books };
  }
);

export const getBook = api(
  { expose: true, method: "GET", path: "/books/:id" },
  async ({ id }: { id: string }): Promise<Book | null> => {
    return books.find(book => book.id === id) || null;
  }
);

export const addBook = api(
  { expose: true, method: "POST", path: "/books" },
  async ({ title, author, publishedYear }: Omit<Book, "id">): Promise<Book> => {
    const book: Book = {
      id: nextId.toString(),
      title,
      author,
      publishedYear,
    };
    books.push(book);
    nextId++;
    return book;
  }
);

export const updateBook = api(
  { expose: true, method: "PUT", path: "/books/:id" },
  async ({ id, ...updates }: Partial<Book> & { id: string }): Promise<Book | null> => {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) return null;
    
    books[bookIndex] = { ...books[bookIndex], ...updates };
    return books[bookIndex];
  }
);

export const deleteBook = api(
  { expose: true, method: "DELETE", path: "/books/:id" },
  async ({ id }: { id: string }): Promise<{ success: boolean }> => {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) return { success: false };
    
    books.splice(bookIndex, 1);
    return { success: true };
  }
);
```

## Step 5: Create GraphQL Resolvers

Create `graphql/resolvers.ts`:
```typescript
import * as bookService from "../book/book";

export const resolvers = {
  Query: {
    books: async () => {
      const result = await bookService.getBooks();
      return result.books;
    },
    book: async (_: any, { id }: { id: string }) => {
      return await bookService.getBook({ id });
    },
  },
  
  Mutation: {
    addBook: async (_: any, { title, author, publishedYear }: {
      title: string;
      author: string;
      publishedYear?: number;
    }) => {
      return await bookService.addBook({ title, author, publishedYear });
    },
    
    updateBook: async (_: any, { id, title, author, publishedYear }: {
      id: string;
      title?: string;
      author?: string;
      publishedYear?: number;
    }) => {
      return await bookService.updateBook({ id, title, author, publishedYear });
    },
    
    deleteBook: async (_: any, { id }: { id: string }) => {
      const result = await bookService.deleteBook({ id });
      return result.success;
    },
  },
};
```

## Step 6: Configure Apollo Server

Create `graphql/encore.service.ts`:
```typescript
import { Service } from "encore.dev/service";
export default new Service("graphql");
```

Create `graphql/server.ts`:
```typescript
import { api, Gateway } from "encore.dev/api";
import { ApolloServer } from "apollo-server-express";
import { readFileSync } from "fs";
import { resolvers } from "./resolvers";

const typeDefs = readFileSync("schema.graphql", "utf8");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

export const graphql = api.raw(
  { expose: true, path: "/graphql", method: ["GET", "POST"] },
  server.createHandler({ path: "/graphql" })
);
```

## Step 7: Run and Test

```bash
# Start development server
encore run

# Open GraphQL Playground
# Navigate to http://localhost:4000/graphql
```

### Example Queries

Query all books:
```graphql
query {
  books {
    id
    title
    author
    publishedYear
  }
}
```

Add a new book:
```graphql
mutation {
  addBook(
    title: "1984"
    author: "George Orwell"
    publishedYear: 1949
  ) {
    id
    title
    author
    publishedYear
  }
}
```

Update a book:
```graphql
mutation {
  updateBook(
    id: "1"
    title: "The Great Gatsby (Updated)"
  ) {
    id
    title
    author
    publishedYear
  }
}
```

## Step 8: Deploy

### Encore Cloud
```bash
git add . && git commit -m "GraphQL API implementation"
git push encore
```

### Self-hosting
```bash
encore build docker my-graphql-app
docker run -p 8080:8080 my-graphql-app
```

## Key Features

- **Type-safe resolvers** with TypeScript integration
- **Automatic tracing** for performance monitoring
- **Built-in authentication** support (when configured)
- **Minimal boilerplate** compared to traditional setups
- **GraphQL Playground** for development testing

## Best Practices

1. Use Encore's built-in service communication for resolvers
2. Implement proper error handling in resolvers
3. Consider database integration for production applications
4. Use Encore's authentication for secure GraphQL endpoints
5. Leverage Encore's automatic API documentation generation

This tutorial demonstrates how to create a fully functional GraphQL API with Encore.ts, combining the power of GraphQL with Encore's development experience.