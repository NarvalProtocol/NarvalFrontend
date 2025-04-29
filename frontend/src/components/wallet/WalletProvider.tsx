'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet as useSuietWallet } from '@suiet/wallet-kit';
import { 
  BaseWalletAdapter, 
  SuietAdapter, 
  MystenAdapter,
  WalletEvent,
  WalletAccount,
  WalletTransaction,
  WalletBalance,
  WalletConnectionStatus,
} from './adapters';
import { showSuccess, showError } from '@/utils/notifications';

// 上下文状态接口
interface WalletContextState {
  adapter: BaseWalletAdapter | null;
  status: WalletConnectionStatus;
  account: WalletAccount | null;
  balance: WalletBalance | null;
  isConnecting: boolean;
  network?: string;
  walletName?: string;
  
  // 方法
  connect: () => Promise<WalletAccount | null>;
  disconnect: () => Promise<void>;
  getAddress: () => string | null;
  signAndExecuteTransaction: (transaction: WalletTransaction) => Promise<any>;
  
  // 适配器管理
  setAdapterType: (type: 'suiet' | 'mysten') => void;
  getAdapterType: () => 'suiet' | 'mysten' | null;
}

// 创建上下文
export const WalletContext = createContext<WalletContextState | null>(null);

// 提供者属性
interface WalletProviderProps {
  children: ReactNode;
  defaultAdapter?: 'suiet' | 'mysten';
}

// 钱包提供者组件
export function WalletProvider({ 
  children,
  defaultAdapter = 'suiet'
}: WalletProviderProps) {
  // 状态
  const [adapter, setAdapter] = useState<BaseWalletAdapter | null>(null);
  const [adapterType, setAdapterTypeState] = useState<'suiet' | 'mysten'>(defaultAdapter);
  const [status, setStatus] = useState<WalletConnectionStatus>(WalletConnectionStatus.DISCONNECTED);
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState<string | undefined>(undefined);
  const [walletName, setWalletName] = useState<string | undefined>(undefined);
  
  // 获取Suiet钱包实例
  const suietWallet = useSuietWallet();
  
  // 初始化适配器
  useEffect(() => {
    let newAdapter: BaseWalletAdapter | null = null;
    
    if (adapterType === 'suiet') {
      const suietAdapter = new SuietAdapter();
      suietAdapter.init(suietWallet);
      newAdapter = suietAdapter;
    } else if (adapterType === 'mysten') {
      const mystenAdapter = new MystenAdapter();
      // 注意：这里需要mysten的钱包实例
      // mystenAdapter.init(mystenWallet, mystenContext);
      newAdapter = mystenAdapter;
    }
    
    setAdapter(newAdapter);
    
    // 注册事件监听
    if (newAdapter) {
      const handleConnect = (data: WalletAccount) => {
        setStatus(WalletConnectionStatus.CONNECTED);
        setAccount(data);
        setIsConnecting(false);
        setWalletName(newAdapter?.name);
        setNetwork(newAdapter?.network);
        
        // 连接成功时获取余额
        fetchBalance(newAdapter);
      };
      
      const handleDisconnect = () => {
        setStatus(WalletConnectionStatus.DISCONNECTED);
        setAccount(null);
        setBalance(null);
        setWalletName(undefined);
        setNetwork(undefined);
      };
      
      const handleError = (error: any) => {
        console.error('钱包错误:', error);
        setStatus(WalletConnectionStatus.ERROR);
        setIsConnecting(false);
        showError('钱包操作失败');
      };
      
      newAdapter.on(WalletEvent.CONNECT, handleConnect);
      newAdapter.on(WalletEvent.DISCONNECT, handleDisconnect);
      newAdapter.on(WalletEvent.ERROR, handleError);
      
      // 清理函数
      return () => {
        newAdapter?.off(WalletEvent.CONNECT, handleConnect);
        newAdapter?.off(WalletEvent.DISCONNECT, handleDisconnect);
        newAdapter?.off(WalletEvent.ERROR, handleError);
      };
    }
  }, [adapterType, suietWallet]);
  
  // 获取余额函数
  const fetchBalance = async (walletAdapter: BaseWalletAdapter) => {
    try {
      const balanceData = await walletAdapter.getBalance();
      if (balanceData) {
        setBalance(balanceData);
      }
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  };
  
  // 连接钱包
  const connect = async (): Promise<WalletAccount | null> => {
    if (!adapter) return null;
    
    try {
      setIsConnecting(true);
      setStatus(WalletConnectionStatus.CONNECTING);
      
      const account = await adapter.connect();
      return account;
    } catch (error) {
      console.error('连接钱包失败:', error);
      setStatus(WalletConnectionStatus.ERROR);
      showError('连接钱包失败');
      return null;
    } finally {
      setIsConnecting(false);
    }
  };
  
  // 断开连接
  const disconnect = async (): Promise<void> => {
    if (!adapter) return;
    
    try {
      await adapter.disconnect();
    } catch (error) {
      console.error('断开连接失败:', error);
      showError('断开连接失败');
    }
  };
  
  // 签名并执行交易
  const signAndExecuteTransaction = async (transaction: WalletTransaction): Promise<any> => {
    if (!adapter || status !== WalletConnectionStatus.CONNECTED) {
      showError('钱包未连接');
      throw new Error('钱包未连接');
    }
    
    try {
      const result = await adapter.signAndExecuteTransaction(transaction);
      showSuccess('交易成功执行');
      return result;
    } catch (error) {
      console.error('交易执行失败:', error);
      showError('交易执行失败');
      throw error;
    }
  };
  
  // 获取地址
  const getAddress = (): string | null => {
    return adapter?.getAddress() || null;
  };
  
  // 设置适配器类型
  const setAdapterType = (type: 'suiet' | 'mysten') => {
    // 如果已连接，先断开
    if (status === WalletConnectionStatus.CONNECTED) {
      disconnect();
    }
    setAdapterTypeState(type);
  };
  
  // 获取适配器类型
  const getAdapterType = (): 'suiet' | 'mysten' | null => {
    return adapterType;
  };
  
  // 提供上下文值
  const contextValue: WalletContextState = {
    adapter,
    status,
    account,
    balance,
    isConnecting,
    network,
    walletName,
    
    connect,
    disconnect,
    getAddress,
    signAndExecuteTransaction,
    
    setAdapterType,
    getAdapterType,
  };
  
  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// 钱包钩子
export const useWallet = (): WalletContextState => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet必须在WalletProvider内使用');
  }
  return context;
}; 