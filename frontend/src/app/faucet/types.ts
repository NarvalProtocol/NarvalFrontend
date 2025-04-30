// Transaction record type
export interface Transaction {
  id: string;
  address: string;
  amount: number;
  timestamp: number;
  status: "completed" | "pending" | "failed";
  tokenType: TokenType;
}

// Network status type
export interface NetworkStatus {
  status: "online" | "offline" | "loading";
  blockHeight?: number;
}

// Token type enum
export enum TokenType {
  // Base token
  SUI = "SUI",
  
  // Stablecoins
  NTUSDC = "nTUSDC",
  NTUSDT = "nTUSDT",
  NTMUSD = "nTMUSD",
  NTBUCK = "nTBUCK",
  NTAUSD = "nTAUSD",
  
  // Cryptocurrencies
  NTBTC = "nTBTC",
  NTWBTC = "nTWBTC",
  NTLBTC = "nTLBTC",
  NTWSOL = "nTWSOL",
  NTDEEP = "nTDEEP",
  NTWAL = "nTWAL",
  NTNS = "nTNS",
  
  // LST tokens (Liquid Staking Tokens)
  NTKSUI = "nTKSUI",
  NTISUI = "nTISUI",
  NTMSUI = "nTMSUI",
  NTFUDSUI = "nTFUDSUI",
  NTTREVINSUI = "nTTREVINSUI",
  NTUPSUI = "nTUPSUI"
}

// Token category
export enum TokenCategory {
  NATIVE = "Native Token",
  STABLECOIN = "Stablecoin",
  CRYPTO = "Cryptocurrency",
  LST = "Liquid Staking Token"
}

// Token info type
export interface TokenInfo {
  type: TokenType;
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
  contractAddress: string;
  maxSupply: number;
  currentSupply: number;
  description: string;
  category: TokenCategory;
}

// Faucet configuration type
export interface FaucetConfig {
  maxRequestAmount: number;
  cooldownHours: number;
  isFaucetPaused: boolean;
}

// API response type
export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Faucet request type
export interface FaucetRequest {
  address: string;
  amount: number;
  timestamp: number;
  tokenType: TokenType;
}

// Transaction status
export type TransactionStatus = "pending" | "completed" | "failed";

// Wallet info
export interface WalletInfo {
  address: string;
  network: string;
  balance: number;
} 