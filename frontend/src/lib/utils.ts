import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并类名，解决 Tailwind 类名优先级冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
