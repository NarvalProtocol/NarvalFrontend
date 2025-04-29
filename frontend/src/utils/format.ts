/**
 * 格式化工具函数
 */

/**
 * 截断加密钱包地址，显示开头和结尾，中间用省略号表示
 * @param address 完整地址
 * @param prefixLength 保留前缀的长度，默认为6
 * @param suffixLength 保留后缀的长度，默认为4
 * @returns 处理后的地址
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
 * 格式化货币数值
 * @param amount 金额
 * @param decimals 小数位数，默认为2
 * @param symbol 货币符号，默认为空
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(
  amount: number | string,
  decimals: number = 2,
  symbol: string = ''
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return `${symbol}0`;
  
  const formattedAmount = numAmount.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return symbol ? `${symbol}${formattedAmount}` : formattedAmount;
}

/**
 * 格式化百分比
 * @param value 百分比值（0-1之间的小数）
 * @param decimals 小数位数，默认为2
 * @returns 格式化后的百分比字符串
 */
export function formatPercent(
  value: number | string,
  decimals: number = 2
): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0%';
  
  // 将小数转换为百分比
  const percentValue = numValue * 100;
  
  return `${percentValue.toFixed(decimals)}%`;
}

/**
 * 格式化日期时间
 * @param date 日期对象或时间戳
 * @param format 格式化模式，默认为'datetime'
 * @returns 格式化后的日期时间字符串
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
  
  return dateObj.toLocaleString('zh-CN', options);
} 