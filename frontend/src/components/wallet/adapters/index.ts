import { SuietAdapter } from './suiet-adapter';
import { MystenAdapter } from './mysten-adapter';
import { BaseWalletAdapter } from './base-adapter';

export * from './base-adapter';
export * from './suiet-adapter';
export * from './mysten-adapter';

// 钱包适配器映射
export const walletAdapters: Record<string, new () => BaseWalletAdapter> = {
  suiet: SuietAdapter,
  mysten: MystenAdapter,
};

// 获取默认适配器
export const getDefaultAdapter = () => new SuietAdapter(); 