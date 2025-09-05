# Installation

If you are new to Encore, we recommend following the [quick start guide](quick-start.md).

## Install the Encore CLI

To develop locally with Encore, you first need to install the Encore CLI. This provisions your local development environment and runs the Local Development Dashboard.

### Installation Methods

#### macOS (Brew)
```bash
$ brew install encoredev/tap/encore
```

#### Linux
```bash
$ curl -L https://encore.dev/install.sh | bash
```

#### Windows (WSL)
```bash
$ iwr https://encore.dev/install.ps1 | iex
```

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) version 18+ is required to run Encore.ts apps
- [Docker](https://www.docker.com) is required for setting up local databases

### Optional: LLM Instructions

To help LLM tools understand Encore, you can add pre-made instructions:

1. Download [ts_llm_instructions.txt](https://github.com/encoredev/encore/blob/main/ts_llm_instructions.txt)

2. Usage options:
   - Cursor: Rename to `.cursorrules`
   - GitHub Copilot: Paste in `.github/copilot-instructions.md`
   - Other tools: Place in app root

### Build from Source

If you prefer building from source, [follow these instructions](https://github.com/encoredev/encore/blob/main/CONTRIBUTING.md).

## Update to Latest Version

Check your current version:
```bash
encore version
```

Expected output will look like:
```
encore version v1.28.0
```

To update, run:
```bash
encore version update
```

## Verify Installation

After installation, verify everything is working:
```bash
encore daemon
```

This starts the Encore daemon which manages your local development environment.