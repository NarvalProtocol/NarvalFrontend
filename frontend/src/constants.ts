/**
 * 应用程序常量
 * 该文件包含应用程序中使用的所有常量值
 */

/**
 * 网络相关常量
 */
export const NETWORK = {
  /** 主网 */
  MAINNET: 'mainnet',
  /** 测试网 */
  TESTNET: 'testnet',
  /** 开发网 */
  DEVNET: 'devnet',
  /** 本地网络 */
  LOCAL: 'local',
  /** 当前激活的网络 */
  ACTIVE: process.env.NEXT_PUBLIC_NETWORK || 'devnet',
};

/**
 * 区块链相关常量
 */
export const BLOCKCHAIN = {
  /** 区块浏览器的URL */
  EXPLORER_URL: {
    [NETWORK.MAINNET]: 'https://explorer.sui.io',
    [NETWORK.TESTNET]: 'https://explorer.testnet.sui.io',
    [NETWORK.DEVNET]: 'https://explorer.devnet.sui.io',
    [NETWORK.LOCAL]: 'http://localhost:8080',
  },
  /** RPC端点 */
  RPC_URL: {
    [NETWORK.MAINNET]: 'https://fullnode.mainnet.sui.io:443',
    [NETWORK.TESTNET]: 'https://fullnode.testnet.sui.io:443',
    [NETWORK.DEVNET]: 'https://fullnode.devnet.sui.io:443',
    [NETWORK.LOCAL]: 'http://localhost:9000',
  },
  /** 交易超时时间(毫秒) */
  TRANSACTION_TIMEOUT: 30000,
  /** 区块确认数 */
  BLOCK_CONFIRMATIONS: 1,
};

/**
 * API相关常量
 */
export const API = {
  /** 基础URL */
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  /** 超时时间(毫秒) */
  TIMEOUT: 30000,
  /** 重试次数 */
  RETRY_COUNT: 3,
  /** 重试延迟(毫秒) */
  RETRY_DELAY: 1000,
  /** 本地存储键 */
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER_DATA: 'userData',
    THEME: 'theme',
  },
  /** 分页默认值 */
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
};

/**
 * 智能合约相关常量
 */
export const CONTRACTS = {
  /** 合约地址 */
  ADDRESSES: {
    [NETWORK.MAINNET]: {
      LENDING_POOL: '0x...',
      TOKEN_REGISTRY: '0x...',
      ORACLE: '0x...',
    },
    [NETWORK.TESTNET]: {
      LENDING_POOL: '0x...',
      TOKEN_REGISTRY: '0x...',
      ORACLE: '0x...',
    },
    [NETWORK.DEVNET]: {
      LENDING_POOL: '0x...',
      TOKEN_REGISTRY: '0x...',
      ORACLE: '0x...',
    },
    [NETWORK.LOCAL]: {
      LENDING_POOL: '0x...',
      TOKEN_REGISTRY: '0x...',
      ORACLE: '0x...',
    },
  },
  /** 模块名称 */
  MODULES: {
    LENDING: 'lending',
    TOKEN: 'token',
    ORACLE: 'oracle',
  },
};

/**
 * 钱包相关常量
 */
export const WALLET = {
  /** 支持的钱包 */
  SUPPORTED_WALLETS: ['Suiet', 'Sui Wallet', 'Martian Wallet', 'Ethos'],
  /** 存储键 */
  STORAGE_KEY: 'wallet-storage',
  /** 钱包连接超时(毫秒) */
  CONNECT_TIMEOUT: 15000,
};

/**
 * UI相关常量
 */
export const UI = {
  /** 主题 */
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  },
  /** 通知持续时间(毫秒) */
  NOTIFICATION_DURATION: 5000,
  /** 页面布局 */
  LAYOUT: {
    SIDEBAR_WIDTH: 280,
    HEADER_HEIGHT: 64,
    FOOTER_HEIGHT: 60,
  },
  /** 断点 */
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
  },
  /** 动画持续时间(毫秒) */
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
};

/**
 * 时间相关常量
 */
export const TIME = {
  /** 一分钟(毫秒) */
  MINUTE: 60 * 1000,
  /** 一小时(毫秒) */
  HOUR: 60 * 60 * 1000,
  /** 一天(毫秒) */
  DAY: 24 * 60 * 60 * 1000,
  /** 一周(毫秒) */
  WEEK: 7 * 24 * 60 * 60 * 1000,
  /** 默认日期格式 */
  DATE_FORMAT: 'YYYY-MM-DD',
  /** 默认时间格式 */
  TIME_FORMAT: 'HH:mm:ss',
  /** 默认日期时间格式 */
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
};

/**
 * 数值和交易相关常量
 */
export const FINANCE = {
  /** 默认精度 */
  DEFAULT_DECIMALS: 9,
  /** 显示精度 */
  DISPLAY_DECIMALS: 4,
  /** 最大借贷健康系数 */
  MAX_HEALTH_FACTOR: '2.0',
  /** 安全借贷健康系数 */
  SAFE_HEALTH_FACTOR: '1.5',
  /** 警告借贷健康系数 */
  WARNING_HEALTH_FACTOR: '1.2',
  /** 清算阈值 */
  LIQUIDATION_THRESHOLD: '1.0',
  /** 利率类型 */
  INTEREST_RATE_TYPE: {
    FIXED: 'fixed',
    VARIABLE: 'variable',
  },
};

/**
 * 路由相关常量
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  MARKETS: '/markets',
  MARKET_DETAILS: '/markets/:id',
  PORTFOLIO: '/portfolio',
  TRANSACTIONS: '/transactions',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  NOT_FOUND: '/404',
}; 