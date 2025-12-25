#!/usr/bin/env node

/**
 * env-guard CLI executable
 * 
 * This file is the entry point for the env-guard command-line tool.
 * It reads command-line arguments and validates environment variables.
 * Supports type validation syntax: KEY:type (e.g., DB_PORT:number)
 */

const { checkEnv, checkEnvWithType } = require('../dist/index.js');

/**
 * Parses CLI arguments to extract key names and types.
 * Supports syntax: KEY:type where type can be 'string', 'number', or 'boolean'
 * 
 * @param args - Array of command-line arguments
 * @returns Array of EnvKey objects
 */
function parseArguments(args) {
  return args.map(arg => {
    // Check if argument contains type specification (e.g., "DB_PORT:number")
    const parts = arg.split(':');
    
    if (parts.length === 2) {
      const [key, type] = parts;
      const validTypes = ['string', 'number', 'boolean'];
      
      if (validTypes.includes(type.toLowerCase())) {
        return {
          key: key,
          type: type.toLowerCase()
        };
      } else {
        console.error(`Invalid type: ${type}. Valid types are: string, number, boolean`);
        process.exit(1);
      }
    } else {
      // No type specified, just return the key
      return {
        key: arg,
        type: undefined
      };
    }
  });
}

// Get command-line arguments (skip node and script path)
const args = process.argv.slice(2);

// Check if any arguments were provided
if (args.length === 0) {
  console.error('Usage: env-guard <ENV_KEY1> [ENV_KEY2] ...');
  console.error('Example: env-guard DATABASE_URL API_KEY SECRET');
  console.error('Example with types: env-guard DATABASE_URL DB_PORT:number DEBUG:boolean');
  process.exit(1);
}

// Parse arguments and check if any have type specifications
const envKeys = parseArguments(args);
const hasTypeSpecs = envKeys.some(key => key.type !== undefined);

// Use checkEnvWithType if any arguments have type specifications, otherwise use checkEnv
if (hasTypeSpecs) {
  checkEnvWithType(envKeys);
} else {
  // For backward compatibility, use checkEnv if no types are specified
  checkEnv(envKeys.map(k => k.key));
}

