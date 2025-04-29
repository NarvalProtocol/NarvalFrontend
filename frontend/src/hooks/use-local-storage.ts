'use client';

import { useState, useEffect } from 'react';

/**
 * 使用localStorage存储和检索数据的自定义钩子
 * @param key 在localStorage中使用的键名
 * @param initialValue 如果localStorage中没有数据时使用的初始值
 * @returns 存储的值和更新函数的数组
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 用于在浏览器环境下获取存储的值或使用初始值
  const readValue = (): T => {
    // 仅在客户端环境下使用localStorage
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`使用键名'${key}'读取localStorage时出错:`, error);
      return initialValue;
    }
  };

  // 状态保存实际值
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 返回一个包装的设置函数，该函数将新值同步到localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 允许值是一个函数，这样我们就可以使用与useState相同的API
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // 保存到状态
      setStoredValue(valueToStore);
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`使用键名'${key}'设置localStorage时出错:`, error);
    }
  };

  // 在组件挂载时读取值
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 监听其他标签页的变化
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue) as T);
      }
    };

    // 添加事件监听器监听其他标签页/窗口中的更改
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
} 