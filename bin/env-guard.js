#!/usr/bin/env node

/**
 * env-guard CLI executable
 * 
 * Entry point for the env-guard command-line tool.
 * Reads command-line arguments and validates environment variables.
 * Supports type validation syntax: KEY:type (e.g., DB_PORT:number)
 */

const { checkEnv, checkEnvWithType } = require('../dist/index.js');
const chalk = require('chalk');

/**
 * Displays help information and usage instructions.
 */
function showHelp() {
  console.log(chalk.green('\n📋 env-guard - Environment Variable Validation Tool\n'));
  
  console.log(chalk.yellow('DESCRIPTION:'));
  console.log('  A lightweight TypeScript CLI tool that validates your environment');
  console.log('  variables and ensures your .env files are correctly configured.\n');
  
  console.log(chalk.yellow('USAGE:'));
  console.log('  env-guard <ENV_KEY1> [ENV_KEY2] ...\n');
  
  console.log(chalk.yellow('OPTIONS:'));
  console.log('  -h, --help    Display this help message and exit\n');
  
  console.log(chalk.yellow('EXAMPLES:'));
  console.log('  env-guard DATABASE_URL');
  console.log('  env-guard DATABASE_URL API_KEY SECRET_TOKEN');
  console.log('  env-guard --help\n');
  
  console.log(chalk.yellow('BEHAVIOR:'));
  console.log('  • If all variables exist: Logs success message in green and continues');
  console.log('  • If any variable is missing: Logs error in red and exits with code 1');
  console.log('  • If type validation fails: Logs error in red and exits with code 1\n');
  
  process.exit(0);
}

/**
 * Parses CLI arguments to extract key names and types.
 * Supports syntax: KEY:type where type can be 'string', 'number', or 'boolean'
 * 
 * @param {string[]} args - Array of command-line arguments
 * @returns {Array<{key: string, type?: string}>} Array of EnvKey objects
 */
function parseArguments(args) {
  return args.map(arg => {
    const parts = arg.split(':');
    
    if (parts.length === 2) {
      const [key, type] = parts;
      const validTypes = ['string', 'number', 'boolean'];
      
      if (validTypes.includes(type.toLowerCase())) {
        return { key, type: type.toLowerCase() };
      } else {
        console.error(chalk.red(`Invalid type: ${type}. Valid types are: string, number, boolean`));
        process.exit(1);
      }
    } else {
      return { key: arg, type: undefined };
    }
  });
}

// Get command-line arguments (skip node and script path)
const args = process.argv.slice(2);

// Show help if --help or -h is passed, or if no arguments are provided
if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  showHelp();
}

// Filter out help flags in case they were mixed with other args
const filteredArgs = args.filter(arg => arg !== '--help' && arg !== '-h');

// Parse arguments to detect type specifications
const envKeys = parseArguments(filteredArgs);
const hasTypeSpecs = envKeys.some(key => key.type !== undefined);

// Use appropriate checker based on whether types are specified
if (hasTypeSpecs) {
  checkEnvWithType(envKeys);
} else {
  checkEnv(envKeys.map(k => k.key));
}