# env-guard

A lightweight TypeScript CLI tool that validates your environment variables and ensures your .env files are correctly configured.

```bash
# Check a single environment variable
env-guard DATABASE_URL

```

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
