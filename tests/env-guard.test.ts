/**
 * Tests for env-guard
 * 
 * These tests verify that the checkEnv function correctly:
 * - Detects missing environment variables
 * - Logs appropriate error messages
 * - Exits with code 1 when variables are missing
 * - Succeeds when all variables are present
 */

import { checkEnv } from '../src/index';

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

