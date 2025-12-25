# env-guard

A lightweight TypeScript CLI tool that validates your environment variables and ensures your .env files are correctly configured.

## Usage

### Help Command

Display usage instructions and help information:

```bash
env-guard --help
# or
env-guard -h
```

**Help Output:**

```
📋 env-guard - Environment Variable Validation Tool

DESCRIPTION:
  A lightweight TypeScript CLI tool that validates your environment
  variables and ensures your .env files are correctly configured.

USAGE:
  env-guard <ENV_KEY1> [ENV_KEY2] ...

OPTIONS:
  -h, --help    Display this help message and exit

EXAMPLES:
  env-guard DATABASE_URL
  env-guard DATABASE_URL API_KEY SECRET_TOKEN
  env-guard --help

BEHAVIOR:
  • If all variables exist: Logs success message in green and continues
  • If any variable is missing: Logs error in red and exits with code 1
```

### Basic Usage

Check if environment variables exist:

```bash
# Check a single environment variable
env-guard DATABASE_URL

# Check multiple environment variables
env-guard DATABASE_URL API_KEY SECRET_TOKEN
```

## Behavior

- **If all variables exist**: Logs `All env variables are set ✅` in green and continues
- **If any variable is missing**: Logs `Missing env: KEY` in red and exits with code 1

## Installation

```bash
npm install
npm run build
```

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run CLI using ts-node (for development)
- `npm test` - Run tests with Jest

## Project Structure

```
env-guard/
├─ src/
│   └─ index.ts           # main CLI logic
├─ bin/
│   └─ env-guard.js       # executable
├─ package.json
├─ README.md
└─ tests/
    └─ env-guard.test.ts  # test file
```

## License

MIT
