import { z } from 'zod';

// Wallet account information structure
export const AccountSchema = z.object({
  address: z.string(),
  publicKey: z.string().optional(),
  network: z.string(),
});

export type Account = z.infer<typeof AccountSchema>;

// Transaction data structure
export const TransactionSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  sender: z.string(),
  recipient: z.string().optional(),
  amount: z.string(), // Use string to handle large numbers
  status: z.enum(['pending', 'success', 'failed']),
  type: z.string(),
  module: z.string().optional(),
  function: z.string().optional(),
  gas: z.string().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// Asset data structure
export const AssetSchema = z.object({
  id: z.string(),
  type: z.string(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  balance: z.string(),
  value: z.string().optional(), // USD value
  icon: z.string().optional(),
});

export type Asset = z.infer<typeof AssetSchema>;

// Lending market data
export const LendingMarketSchema = z.object({
  id: z.string(),
  asset: z.string(),
  symbol: z.string(),
  supplyApy: z.string(),
  borrowApy: z.string(),
  totalSupply: z.string(),
  totalBorrow: z.string(),
  utilizationRate: z.string(),
  collateralFactor: z.string(),
  liquidationThreshold: z.string().optional(),
});

export type LendingMarket = z.infer<typeof LendingMarketSchema>;

// Lending position data
export const LendingPositionSchema = z.object({
  id: z.string(),
  owner: z.string(),
  marketId: z.string(),
  isSupplier: z.boolean(),
  isBorrower: z.boolean(),
  supplyBalance: z.string().optional(),
  borrowBalance: z.string().optional(),
  collateralValue: z.string().optional(),
  healthFactor: z.string().optional(),
});

export type LendingPosition = z.infer<typeof LendingPositionSchema>;

// Base structure for API responses
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown(), // Specific data structure to be defined when used
  error: z.string().optional(),
});

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
}; 