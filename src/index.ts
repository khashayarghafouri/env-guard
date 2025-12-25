/**
 * env-guard - Environment variable validation tool
 * 
 * This module provides functionality to check if required environment
 * variables are set before running an application.
 */

/**
 * Interface for environment variable keys with optional type validation.
 */
export interface EnvKey {
  key: string;
  type?: 'string' | 'number' | 'boolean';
}

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

/**
 * Validates if a string value can be parsed as a number.
 * 
 * @param value - The value to validate
 * @returns true if the value is a valid number, false otherwise
 */
function isValidNumber(value: string): boolean {
  // Check if the value is a valid number (including decimals and negative numbers)
  return !isNaN(Number(value)) && value.trim() !== '';
}

/**
 * Validates if a string value is a valid boolean representation.
 * 
 * @param value - The value to validate
 * @returns true if the value is 'true' or 'false', false otherwise
 */
function isValidBoolean(value: string): boolean {
  const normalized = value.toLowerCase().trim();
  return normalized === 'true' || normalized === 'false';
}

/**
 * Checks if the provided environment variable keys exist and validates their types.
 * 
 * @param keys - Array of EnvKey objects with key names and optional type validation
 * @returns true if all keys exist and pass type validation, false otherwise
 */
export function checkEnvWithType(keys: EnvKey[]): boolean {
  const missingKeys: string[] = [];
  const invalidTypeKeys: Array<{ key: string; expectedType: string }> = [];
  
  // Check each key
  for (const envKey of keys) {
    const { key, type } = envKey;
    const value = process.env[key];
    
    // Check if key exists
    if (!value) {
      missingKeys.push(key);
      continue;
    }
    
    // If type is specified, validate the value matches the expected type
    if (type) {
      let isValid = false;
      
      switch (type) {
        case 'number':
          isValid = isValidNumber(value);
          break;
        case 'boolean':
          isValid = isValidBoolean(value);
          break;
        case 'string':
          // Any non-empty string is valid
          isValid = value.trim() !== '';
          break;
      }
      
      if (!isValid) {
        invalidTypeKeys.push({ key, expectedType: type });
      }
    }
  }
  
  // If there are missing keys, log them in red and exit
  if (missingKeys.length > 0) {
    for (const key of missingKeys) {
      console.error(`\x1b[31mMissing env: ${key}\x1b[0m`);
    }
    process.exit(1);
  }
  
  // If there are type validation errors, log them in red and exit
  if (invalidTypeKeys.length > 0) {
    for (const { key, expectedType } of invalidTypeKeys) {
      console.error(`\x1b[31mInvalid type for ${key}: expected ${expectedType}\x1b[0m`);
    }
    process.exit(1);
  }
  
  // All keys exist and are valid, log success in green
  console.log(`\x1b[32mAll env variables are set and valid ✅\x1b[0m`);
  return true;
}

