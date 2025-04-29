/**
 * Formatting utility functions
 */

/**
 * Truncate cryptocurrency wallet address, showing beginning and end, with ellipsis in the middle
 * @param address Complete address
 * @param prefixLength Length of prefix to keep, default is 6
 * @param suffixLength Length of suffix to keep, default is 4
 * @returns Processed address
 */
export const truncateAddress = (address?: string, prefixLength = 6, suffixLength = 4): string => {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;
  
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

/**
 * Format currency values
 * @param amount Amount
 * @param decimals Decimal places, default is 2
 * @param symbol Currency symbol, default is empty
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string,
  options: {
    currency?: string;
    locale?: string;
    decimals?: number;
    abbreviate?: boolean;
  } = {}
): string {
  const { currency = 'USD', locale = 'en-US', decimals = 2, abbreviate = false } = options;

  // Convert string to number if needed
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  // Handle invalid values
  if (isNaN(numValue)) {
    return 'Invalid amount';
  }

  // Use abbreviation for large numbers if requested
  if (abbreviate && Math.abs(numValue) >= 1000) {
    const tiers = [
      { threshold: 1e12, suffix: 'T' },
      { threshold: 1e9, suffix: 'B' },
      { threshold: 1e6, suffix: 'M' },
      { threshold: 1e3, suffix: 'K' },
    ];

    for (const { threshold, suffix } of tiers) {
      if (Math.abs(numValue) >= threshold) {
        const formatted = (numValue / threshold).toFixed(1).replace(/\.0$/, '');
        return `${formatted}${suffix}`;
      }
    }
  }

  // Format as currency
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
}

/**
 * Format percentage
 * @param value Percentage value (decimal between 0-1)
 * @param decimals Decimal places, default is 2
 * @returns Formatted percentage string
 */
export function formatPercent(value: number | string, decimals: number = 2): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0%';

  // Convert decimal to percentage
  const percentValue = numValue * 100;

  return `${percentValue.toFixed(decimals)}%`;
}

/**
 * Format date and time
 * @param date Date object or timestamp
 * @param format Formatting mode, default is 'datetime'
 * @returns Formatted date time string
 */
export function formatDateTime(
  date: Date | number | string,
  format: 'date' | 'time' | 'datetime' = 'datetime'
): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  const options: Intl.DateTimeFormatOptions = {};

  if (format === 'date' || format === 'datetime') {
    options.year = 'numeric';
    options.month = '2-digit';
    options.day = '2-digit';
  }

  if (format === 'time' || format === 'datetime') {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }

  return dateObj.toLocaleString('en-US', options);
}

/**
 * Format a token amount
 */
export const formatTokenAmount = (
  amount: bigint | number | string, 
  options: { 
    decimals?: number; 
    maxDecimals?: number; 
    minDecimals?: number;
    symbol?: string;
  } = {}
): string => {
  const { 
    decimals = 9, 
    maxDecimals = 4, 
    minDecimals = 2,
    symbol = ''
  } = options;
  
  // Convert to number
  const amountBigInt = typeof amount === 'bigint' ? amount : BigInt(amount.toString());
  
  // Calculate divisor (10^decimals)
  const divisor = BigInt(10) ** BigInt(decimals);
  
  // Integer part
  const integerPart = amountBigInt / divisor;
  
  // Fractional part
  const fractionalBigInt = amountBigInt % divisor;
  let fractionalStr = fractionalBigInt.toString().padStart(decimals, '0');
  
  // Handle decimal places
  const significantDecimals = Math.min(
    Math.max(
      // Keep at least minDecimals decimal places
      minDecimals,
      // Remove trailing zeros
      decimals - fractionalStr.replace(/0+$/, '').length === decimals ? 0 : decimals - fractionalStr.replace(/0+$/, '').length
    ),
    // Keep at most maxDecimals decimal places
    maxDecimals
  );
  
  if (significantDecimals > 0) {
    fractionalStr = fractionalStr.substring(0, significantDecimals);
    return `${integerPart.toString()}.${fractionalStr}${symbol ? ' ' + symbol : ''}`;
  }
  
  return `${integerPart.toString()}${symbol ? ' ' + symbol : ''}`;
};

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
