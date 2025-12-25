# env-guard

A lightweight TypeScript CLI tool that validates your environment variables and ensures your .env files are correctly configured.

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Usage

Check if environment variables exist:

```bash
env-guard DATABASE_URL API_KEY SECRET_TOKEN
```

### Type Validation

Validate environment variables with type checking using the syntax `KEY:type`:

```bash
# Validate a number
env-guard DB_PORT:number

# Validate a boolean
env-guard DEBUG:boolean

# Validate a string
env-guard API_URL:string

# Mix of typed and untyped variables
env-guard DATABASE_URL DB_PORT:number DEBUG:boolean API_KEY
```

**Supported types:**
- `string` - Any non-empty string value
- `number` - Valid numeric value (integers, decimals, negative numbers)
- `boolean` - Must be exactly `true` or `false` (case-insensitive)

## Usage Examples

```bash
# Check a single environment variable
env-guard DATABASE_URL

# Check multiple variables with type validation
env-guard DATABASE_URL DB_PORT:number DEBUG:boolean JWT_SECRET

# Use in npm scripts
npm start  # Will validate env vars before starting
```

## Behavior

- **If all variables exist and are valid**: Logs `All env variables are set and valid ✅` in green
- **If any variable is missing**: Logs `Missing env: KEY` in red and exits with code 1
- **If type validation fails**: Logs `Invalid type for KEY: expected TYPE` in red and exits with code 1

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
