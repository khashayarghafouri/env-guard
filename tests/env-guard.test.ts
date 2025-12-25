/**
 * Tests for env-guard
 * 
 * These tests verify that the checkEnv and checkEnvWithType functions correctly:
 * - Detect missing environment variables
 * - Log appropriate error messages
 * - Exit with code 1 when variables are missing or invalid
 * - Succeed when all variables are present and valid
 */

import { checkEnv, checkEnvWithType, EnvKey } from '../src/index';

// Mock console methods to capture output
const originalConsoleError = console.error;
const originalConsoleLog = console.log;
const originalExit = process.exit;

describe('checkEnv', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;
  
  beforeEach(() => {
    // Clear environment variables
    delete process.env.TEST_VAR_1;
    delete process.env.TEST_VAR_2;
    delete process.env.TEST_VAR_3;
    
    // Setup spies
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
      throw new Error(`process.exit(${code})`);
    });
  });
  
  afterEach(() => {
    // Restore original implementations
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
    process.exit = originalExit;
    
    // Clear environment variables
    delete process.env.TEST_VAR_1;
    delete process.env.TEST_VAR_2;
    delete process.env.TEST_VAR_3;
  });
  
  it('should log success message when all environment variables exist', () => {
    // Set environment variables
    process.env.TEST_VAR_1 = 'value1';
    process.env.TEST_VAR_2 = 'value2';
    
    const result = checkEnv(['TEST_VAR_1', 'TEST_VAR_2']);
    
    expect(result).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('All env variables are set ✅')
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });
  
  it('should log error and exit when a single environment variable is missing', () => {
    // Set one variable, leave the other missing
    process.env.TEST_VAR_1 = 'value1';
    
    expect(() => {
      checkEnv(['TEST_VAR_1', 'TEST_VAR_2']);
    }).toThrow('process.exit(1)');
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing env: TEST_VAR_2')
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
  
  it('should log errors for all missing environment variables', () => {
    // Don't set any variables
    
    expect(() => {
      checkEnv(['TEST_VAR_1', 'TEST_VAR_2', 'TEST_VAR_3']);
    }).toThrow('process.exit(1)');
    
    expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing env: TEST_VAR_1')
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing env: TEST_VAR_2')
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing env: TEST_VAR_3')
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
  
  it('should handle empty array of keys', () => {
    const result = checkEnv([]);
    
    expect(result).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('All env variables are set ✅')
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });
  
  it('should detect empty string as missing variable', () => {
    process.env.TEST_VAR_1 = '';
    
    expect(() => {
      checkEnv(['TEST_VAR_1']);
    }).toThrow('process.exit(1)');
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing env: TEST_VAR_1')
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

describe('checkEnvWithType', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;
  
  beforeEach(() => {
    // Clear environment variables
    delete process.env.TEST_VAR_1;
    delete process.env.TEST_VAR_2;
    delete process.env.TEST_VAR_3;
    delete process.env.TEST_NUMBER;
    delete process.env.TEST_BOOLEAN;
    delete process.env.TEST_STRING;
    
    // Setup spies
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
      throw new Error(`process.exit(${code})`);
    });
  });
  
  afterEach(() => {
    // Restore original implementations
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
    process.exit = originalExit;
    
    // Clear environment variables
    delete process.env.TEST_VAR_1;
    delete process.env.TEST_VAR_2;
    delete process.env.TEST_VAR_3;
    delete process.env.TEST_NUMBER;
    delete process.env.TEST_BOOLEAN;
    delete process.env.TEST_STRING;
  });
  
  it('should log success when all environment variables exist and are valid', () => {
    process.env.TEST_VAR_1 = 'value1';
    process.env.TEST_NUMBER = '42';
    process.env.TEST_BOOLEAN = 'true';
    
    const keys: EnvKey[] = [
      { key: 'TEST_VAR_1' },
      { key: 'TEST_NUMBER', type: 'number' },
      { key: 'TEST_BOOLEAN', type: 'boolean' }
    ];
    
    const result = checkEnvWithType(keys);
    
    expect(result).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('All env variables are set and valid ✅')
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });
  
  it('should log error and exit when a key is missing', () => {
    process.env.TEST_VAR_1 = 'value1';
    
    const keys: EnvKey[] = [
      { key: 'TEST_VAR_1' },
      { key: 'TEST_VAR_2' }
    ];
    
    expect(() => {
      checkEnvWithType(keys);
    }).toThrow('process.exit(1)');
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing env: TEST_VAR_2')
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
  
  it('should validate number type correctly', () => {
    process.env.TEST_NUMBER = '42';
    
    const keys: EnvKey[] = [
      { key: 'TEST_NUMBER', type: 'number' }
    ];
    
    const result = checkEnvWithType(keys);
    expect(result).toBe(true);
    expect(exitSpy).not.toHaveBeenCalled();
  });
  
  it('should reject invalid number type', () => {
    process.env.TEST_NUMBER = 'not-a-number';
    
    const keys: EnvKey[] = [
      { key: 'TEST_NUMBER', type: 'number' }
    ];
    
    expect(() => {
      checkEnvWithType(keys);
    }).toThrow('process.exit(1)');
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid type for TEST_NUMBER: expected number')
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
  
  it('should accept valid number strings including decimals and negatives', () => {
    process.env.TEST_NUMBER_1 = '3.14';
    process.env.TEST_NUMBER_2 = '-42';
    process.env.TEST_NUMBER_3 = '0';
    
    const keys: EnvKey[] = [
      { key: 'TEST_NUMBER_1', type: 'number' },
      { key: 'TEST_NUMBER_2', type: 'number' },
      { key: 'TEST_NUMBER_3', type: 'number' }
    ];
    
    const result = checkEnvWithType(keys);
    expect(result).toBe(true);
    expect(exitSpy).not.toHaveBeenCalled();
  });
  
  it('should validate boolean type correctly', () => {
    process.env.TEST_BOOLEAN_1 = 'true';
    process.env.TEST_BOOLEAN_2 = 'false';
    process.env.TEST_BOOLEAN_3 = 'TRUE';
    process.env.TEST_BOOLEAN_4 = 'FALSE';
    
    const keys: EnvKey[] = [
      { key: 'TEST_BOOLEAN_1', type: 'boolean' },
      { key: 'TEST_BOOLEAN_2', type: 'boolean' },
      { key: 'TEST_BOOLEAN_3', type: 'boolean' },
      { key: 'TEST_BOOLEAN_4', type: 'boolean' }
    ];
    
    const result = checkEnvWithType(keys);
    expect(result).toBe(true);
    expect(exitSpy).not.toHaveBeenCalled();
  });
  
  it('should reject invalid boolean type', () => {
    process.env.TEST_BOOLEAN = 'yes';
    
    const keys: EnvKey[] = [
      { key: 'TEST_BOOLEAN', type: 'boolean' }
    ];
    
    expect(() => {
      checkEnvWithType(keys);
    }).toThrow('process.exit(1)');
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid type for TEST_BOOLEAN: expected boolean')
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
  
  it('should validate string type correctly', () => {
    process.env.TEST_STRING = 'any-value-here';
    
    const keys: EnvKey[] = [
      { key: 'TEST_STRING', type: 'string' }
    ];
    
    const result = checkEnvWithType(keys);
    expect(result).toBe(true);
    expect(exitSpy).not.toHaveBeenCalled();
  });
  
  it('should reject empty string for string type', () => {
    process.env.TEST_STRING = '';
    
    const keys: EnvKey[] = [
      { key: 'TEST_STRING', type: 'string' }
    ];
    
    expect(() => {
      checkEnvWithType(keys);
    }).toThrow('process.exit(1)');
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid type for TEST_STRING: expected string')
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
  
  it('should handle mixed validations (some with types, some without)', () => {
    process.env.TEST_VAR_1 = 'value1';
    process.env.TEST_NUMBER = '123';
    process.env.TEST_BOOLEAN = 'false';
    
    const keys: EnvKey[] = [
      { key: 'TEST_VAR_1' },
      { key: 'TEST_NUMBER', type: 'number' },
      { key: 'TEST_BOOLEAN', type: 'boolean' }
    ];
    
    const result = checkEnvWithType(keys);
    expect(result).toBe(true);
    expect(exitSpy).not.toHaveBeenCalled();
  });
  
  it('should handle multiple type validation errors', () => {
    process.env.TEST_NUMBER = 'not-a-number';
    process.env.TEST_BOOLEAN = 'not-a-boolean';
    
    const keys: EnvKey[] = [
      { key: 'TEST_NUMBER', type: 'number' },
      { key: 'TEST_BOOLEAN', type: 'boolean' }
    ];
    
    expect(() => {
      checkEnvWithType(keys);
    }).toThrow('process.exit(1)');
    
    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid type for TEST_NUMBER: expected number')
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid type for TEST_BOOLEAN: expected boolean')
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
  
  it('should handle empty array of keys', () => {
    const result = checkEnvWithType([]);
    
    expect(result).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('All env variables are set and valid ✅')
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });
});

