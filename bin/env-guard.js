#!/usr/bin/env node

/**
 * env-guard CLI executable
 * 
 * This file is the entry point for the env-guard command-line tool.
 * It reads command-line arguments and validates environment variables.
 */

const { checkEnv } = require('../dist/index.js');
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
  console.log('  • If any variable is missing: Logs error in red and exits with code 1\n');
  
  process.exit(0);
}

// Get command-line arguments (skip node and script path)
const args = process.argv.slice(2);

// Check for help flag - if present, show help and exit immediately
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
}

// If no arguments provided, show help
if (args.length === 0) {
  showHelp();
}

// Filter out help flags (in case they were mixed with other args)
const envKeys = args.filter(arg => arg !== '--help' && arg !== '-h');

// Call checkEnv with the filtered arguments
checkEnv(envKeys);

