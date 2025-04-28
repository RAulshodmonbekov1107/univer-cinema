/**
 * Utility functions for consistent logging throughout the application
 */

/**
 * Log an informational message
 * @param message The message to log
 * @param data Optional data to include with the log
 */
export const logInfo = (message: string, data?: any): void => {
  console.log(`[INFO] ${message}`, data || '');
};

/**
 * Log an error message
 * @param message The error message to log
 * @param error Optional error object to include
 */
export const logError = (message: string, error?: any): void => {
  console.error(`[ERROR] ${message}`, error || '');
};

/**
 * Log a warning message
 * @param message The warning message to log
 * @param data Optional data to include with the warning
 */
export const logWarning = (message: string, data?: any): void => {
  console.warn(`[WARNING] ${message}`, data || '');
};

export default {
  logInfo,
  logError,
  logWarning
}; 