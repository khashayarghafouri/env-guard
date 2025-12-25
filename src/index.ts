/**
 * env-guard - Environment variable validation tool
 * 
 * This module provides functionality to check if required environment
 * variables are set before running an application.
 */

/**
 * Checks if the provided environment variable keys exist.
 * 
 * @param keys - Array of environment variable keys to check
 * @returns true if all keys exist, false otherwise
 */
export function checkEnv(keys: string[]): boolean {
  const missingKeys: string[] = [];
  
  // Check each key
  for (const key of keys) {
    if (!process.env[key]) {
      missingKeys.push(key);
    }
  }
  
  // If there are missing keys, log them in red and exit
  if (missingKeys.length > 0) {
    for (const key of missingKeys) {
      console.error(`\x1b[31mMissing env: ${key}\x1b[0m`);
    }
    process.exit(1);
  }
  
  // All keys exist, log success in green
  console.log(`\x1b[32mAll env variables are set ✅\x1b[0m`);
  return true;
}

