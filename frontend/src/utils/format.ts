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
export function truncateAddress(
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;

  const prefix = address.substring(0, prefixLength);
  const suffix = address.substring(address.length - suffixLength);

  return `${prefix}...${suffix}`;
}

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
export function formatTokenAmount(
  amount: string | number | bigint,
  options: {
    symbol?: string;
    decimals?: number;
    abbreviated?: boolean;
    withSymbol?: boolean;
  } = {}
): string {
  const { symbol = '', decimals = 9, abbreviated = false, withSymbol = true } = options;

  // Convert to number
  let numericAmount: number;

  if (typeof amount === 'string') {
    numericAmount = parseFloat(amount);
  } else if (typeof amount === 'bigint') {
    // Convert from on-chain amount with decimals to human-readable format
    numericAmount = Number(amount) / Math.pow(10, decimals);
  } else {
    numericAmount = amount;
  }

  // Handle invalid values
  if (isNaN(numericAmount)) {
    return 'Invalid amount';
  }

  // Format the number
  let formattedAmount: string = '';

  if (abbreviated && Math.abs(numericAmount) >= 1000) {
    const tiers = [
      { threshold: 1e12, suffix: 'T' },
      { threshold: 1e9, suffix: 'B' },
      { threshold: 1e6, suffix: 'M' },
      { threshold: 1e3, suffix: 'K' },
    ];

    for (const { threshold, suffix } of tiers) {
      if (Math.abs(numericAmount) >= threshold) {
        formattedAmount = (numericAmount / threshold).toFixed(1).replace(/\.0$/, '') + suffix;
        break;
      }
    }
  }

  if (!formattedAmount) {
    // Format based on value range
    if (numericAmount === 0) {
      formattedAmount = '0';
    } else if (numericAmount < 0.000001) {
      formattedAmount = '<0.000001';
    } else if (numericAmount < 1) {
      formattedAmount = numericAmount.toFixed(6);
    } else if (numericAmount < 10000) {
      formattedAmount = numericAmount.toFixed(4);
    } else {
      formattedAmount = numericAmount.toFixed(2);
    }
  }

  // Remove trailing zeros after decimal point
  formattedAmount = formattedAmount.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');

  // Add symbol if requested
  return withSymbol && symbol ? `${formattedAmount} ${symbol}` : formattedAmount;
}

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
