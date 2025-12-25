#!/usr/bin/env node

/**
 * env-guard CLI executable
 * 
 * This file is the entry point for the env-guard command-line tool.
 * It reads command-line arguments and validates environment variables.
 */

const { checkEnv } = require('../dist/index.js');

// Get command-line arguments (skip node and script path)
const args = process.argv.slice(2);

// Check if any arguments were provided
if (args.length === 0) {
  console.error('Usage: env-guard <ENV_KEY1> [ENV_KEY2] ...');
  console.error('Example: env-guard DATABASE_URL API_KEY SECRET');
  process.exit(1);
}

// Call checkEnv with the provided arguments
checkEnv(args);

