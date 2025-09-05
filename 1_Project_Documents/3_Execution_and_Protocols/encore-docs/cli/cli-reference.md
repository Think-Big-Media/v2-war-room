# Encore TypeScript CLI Reference

## Running Commands

### `encore run`
Runs the Encore application with optional flags:
```bash
encore run [--debug] [--watch=true] [--port NUMBER] [flags]
```

**Flags:**
- `--debug`: Enable debug mode
- `--watch`: Enable hot reloading (default: true)
- `--port`: Specify port number (default: 4000)

### `encore test`
Runs application tests, supporting standard test flags:
```bash
encore test ./... [test flags]
```

**Examples:**
```bash
# Run all tests
encore test

# Run tests with coverage
encore test --coverage

# Run specific test file
encore test ./user/user.test.ts
```

### `encore check`
Checks the application for compile-time errors:
```bash
encore check
```

### `encore exec`
Runs executable scripts with the Encore app environment:
```bash
encore exec -- <command>
```

**Example - Database seeding:**
```bash
encore exec -- npx tsx ./seed.ts
```

## App Management Commands

### `encore app clone`
Clone an existing Encore app:
```bash
encore app clone [app-id] [directory]
```

### `encore app create`
Create a new Encore application:
```bash
encore app create [name]
```

**Interactive prompts:**
- App name
- Template selection
- Git repository setup

### `encore app init`
Initialize a new Encore app from an existing repository:
```bash
encore app init [name]
```

### `encore app link`
Link an Encore app with the server:
```bash
encore app link [app-id]
```

## Authentication Commands

### `encore auth login`
Log in to Encore:
```bash
encore auth login
```

### `encore auth logout`
Log out of the current session:
```bash
encore auth logout
```

### `encore auth signup`
Create a new Encore account:
```bash
encore auth signup
```

### `encore auth whoami`
Display the current logged-in user:
```bash
encore auth whoami
```

## Database Management

### `encore db shell`
Connect to a database shell:
```bash
encore db shell <database-name> [--env=<name>]
```

**Examples:**
```bash
# Connect to local development database
encore db shell mydb

# Connect to production database
encore db shell mydb --env=prod
```

### `encore db conn-uri`
Get database connection URI:
```bash
encore db conn-uri <database-name> [--env=<name>] [flags]
```

### `encore db proxy`
Set up a local database proxy:
```bash
encore db proxy [--env=<name>] [flags]
```

### `encore db reset`
Reset database to clean state:
```bash
encore db reset [--env=<name>]
```

## Environment Management

### `encore env list`
List all environments:
```bash
encore env list
```

### `encore env clone`
Clone an environment:
```bash
encore env clone <source-env> <target-env>
```

## Secret Management

### `encore secret set`
Set a secret value:
```bash
encore secret set --type=<type> <key>
```

### `encore secret list`
List all secrets:
```bash
encore secret list [--env=<name>]
```

## Deployment Commands

### `encore deploy`
Deploy to Encore Cloud:
```bash
encore deploy [--env=<name>]
```

### `encore build`
Build application for deployment:
```bash
encore build [docker|executable] [name]
```

**Examples:**
```bash
# Build Docker image
encore build docker my-app

# Build executable
encore build executable my-app
```

## Monitoring Commands

### `encore logs`
Stream application logs:
```bash
encore logs [--env=<name>] [--service=<name>] [flags]
```

**Flags:**
- `--follow`: Follow logs in real-time
- `--level`: Filter by log level
- `--service`: Filter by service name

### `encore daemon`
Manage the Encore daemon:
```bash
encore daemon [start|stop|env]
```

## Development Tools

### `encore gen`
Generate code and documentation:
```bash
encore gen [client|openapi] [flags]
```

**Examples:**
```bash
# Generate TypeScript client
encore gen client --output=./client --lang=typescript

# Generate OpenAPI specification
encore gen openapi --output=./api-spec.json
```

### `encore version`
Display Encore CLI version:
```bash
encore version
```

## Global Flags

Most commands support these global flags:
- `--help`: Show command help
- `--verbose`: Enable verbose output
- `--json`: Output in JSON format (where applicable)

## Configuration

The CLI reads configuration from:
- `~/.encore/auth.json` - Authentication tokens
- `encore.app` - App configuration
- Environment variables

## Getting Help

For detailed help on any command:
```bash
encore <command> --help
```

For general help:
```bash
encore help
```