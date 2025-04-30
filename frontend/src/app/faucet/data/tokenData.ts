import { TokenInfo, TokenType, TokenCategory } from "../types";

// CoinGecko token ID mapping
const COINGECKO_IDS: Partial<Record<TokenType, string>> = {
  [TokenType.SUI]: "26375/large/sui_asset.jpeg",
  [TokenType.NTUSDC]: "6319/large/usdc.png",
  [TokenType.NTUSDT]: "325/large/tether.png",
  [TokenType.NTBTC]: "1/large/bitcoin.png",
  [TokenType.NTWBTC]: "7598/large/wrapped_bitcoin_wbtc.png",
  [TokenType.NTLBTC]: "13855/large/name.png", // Using generic icon
  [TokenType.NTWSOL]: "4128/large/solana.png",
  [TokenType.NTMUSD]: "17956/large/musd.png",
  [TokenType.NTBUCK]: "24383/large/buck.png",
  [TokenType.NTAUSD]: "31553/large/ausd.png",
  [TokenType.NTDEEP]: "18422/large/deep.png",
  [TokenType.NTWAL]: "15985/large/wallet.png",
  [TokenType.NTNS]: "13855/large/name.png",
  // LST tokens use local icons
  [TokenType.NTKSUI]: "26375/large/sui_asset.jpeg", // Modified based on SUI
  [TokenType.NTISUI]: "26375/large/sui_asset.jpeg", // Modified based on SUI
  [TokenType.NTMSUI]: "26375/large/sui_asset.jpeg", // Modified based on SUI
  [TokenType.NTFUDSUI]: "26375/large/sui_asset.jpeg", // Modified based on SUI
  [TokenType.NTTREVINSUI]: "26375/large/sui_asset.jpeg", // Modified based on SUI
  [TokenType.NTUPSUI]: "26375/large/sui_asset.jpeg", // Modified based on SUI
};

// Generate token icon URL
const getTokenIconUrl = (tokenType: TokenType): string => {
  try {
    if (COINGECKO_IDS[tokenType]) {
      return `https://assets.coingecko.com/coins/images/${COINGECKO_IDS[tokenType]}`;
    }
    
    // For testnet tokens not on CoinGecko, use local icons
    const localIcon = `/icons/${tokenType.toLowerCase().replace('nt', '')}.svg`;
    return localIcon;
  } catch (error) {
    console.error(`Error getting icon for ${tokenType}:`, error);
    // Return default icon
    return `/icons/token-default.svg`;
  }
};

// Initialize token icons
const TOKEN_ICONS = Object.values(TokenType).reduce((icons, type) => {
  icons[type] = getTokenIconUrl(type);
  return icons;
}, {} as Record<TokenType, string>);

// Token contract addresses
const TOKEN_CONTRACTS = {
  // Native token
  [TokenType.SUI]: "0x2::sui::SUI",
  
  // Stablecoins
  [TokenType.NTUSDC]: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
  [TokenType.NTUSDT]: "0x7d7e436f0b2aafde60774efb26ccc432cf881b677aca7faaf2a01879bd19fb8::coin::COIN",
  [TokenType.NTMUSD]: "0x8e9412a159becd9d19ceeacbc59d6c7f33c98d9cd5b2e8a1db32a175d7d4fa77::coin::COIN",
  [TokenType.NTBUCK]: "0x9ea7726224e9a11e4ad27bdc532c79d9bf9d07c46efac5e2186b104e9986c258::coin::COIN",
  [TokenType.NTAUSD]: "0x1a3f097afa48f3de710a4c84e443f91e46a93055ffde489ae9b1755a1cd94923::coin::COIN",
  
  // Cryptocurrencies
  [TokenType.NTBTC]: "0x9c29d64c68139c05091cbc2eb0ae135a3b10bba5e3cd3f13a97621d3944fd1b5::coin::COIN",
  [TokenType.NTWBTC]: "0x2e5af3c3f7c56b4b3a1c68e8ade9a59da657a4aa2a68d8d59122b5373c483fce::coin::COIN",
  [TokenType.NTLBTC]: "0x3c6e042ab175de0b4ecfe49c7126bad3013d4ceda0c8be8c2235c9cc9e82497a::coin::COIN",
  [TokenType.NTWSOL]: "0x4de9c3d5ba67b1c6fbe4b915774139ee98eb831875c5a3194c6db4da23454d71::coin::COIN",
  [TokenType.NTDEEP]: "0x5e4ce1dca7f960563c601a738d18b6d909a005d1631e6900d11ad48d4e9c3b96::coin::COIN",
  [TokenType.NTWAL]: "0x6e5f71e23877e85761c6d4bee6ea2d08d6f4c0025afec10e7d7c51c2c2110c45::coin::COIN",
  [TokenType.NTNS]: "0x7f3d91b1e206da70e0a5a4605be9817180a74139327c94d4c89322db16a6b4ab::coin::COIN",
  
  // LST tokens
  [TokenType.NTKSUI]: "0x8e8a9ea1e6a0483c4e39dfdd4f66c7c457dbcbd9dcd72637a013b61a3a9e84df::coin::COIN",
  [TokenType.NTISUI]: "0x9f38481db65a53fb99a0c9921596f26588c8132c2e8ca1b906c9268f2a4afb1c::coin::COIN",
  [TokenType.NTMSUI]: "0x10d11e2b1ec012a1a5c2b845c2febbee162fcaa3d4d7a19ccae8c441fa923bf3::coin::COIN",
  [TokenType.NTFUDSUI]: "0x11a8d737a957de8f3b10ffd63338a9c46b7790ad1fcd6ce42e6d9bb69b2c4b1e::coin::COIN",
  [TokenType.NTTREVINSUI]: "0x12b9d45c79f2e8a364b8fc9e5eac39e6e97af4ad5bbb9c1b39f797283b9c0b68::coin::COIN",
  [TokenType.NTUPSUI]: "0x13c7dc59385a107f1e408d894fb66f6bad0ffce20bf38ae4e4a0c02b0bbbcd23::coin::COIN"
};

// Token descriptions
const TOKEN_DESCRIPTIONS = {
  // Native token
  [TokenType.SUI]: "SUI is the native token of Sui Network, used for paying transaction fees and participating in network governance.",
  
  // Stablecoins
  [TokenType.NTUSDC]: "nTUSDC is a USDC Coin stablecoin on the Sui testnet, pegged 1:1 to the US dollar.",
  [TokenType.NTUSDT]: "nTUSDT is a Tether stablecoin on the Sui testnet, pegged 1:1 to the US dollar.",
  [TokenType.NTMUSD]: "nTMUSD is a multi-collateral stablecoin on the Sui testnet, stabilized through multiple crypto asset collaterals.",
  [TokenType.NTBUCK]: "nTBUCK is a decentralized stablecoin on the Sui testnet, maintaining stability through algorithms and collateral.",
  [TokenType.NTAUSD]: "nTAUSD is an Arbitrum ecosystem stablecoin on the Sui testnet, used for testing cross-chain stablecoin applications.",
  
  // Cryptocurrencies
  [TokenType.NTBTC]: "nTBTC is a Bitcoin token on the Sui testnet, used for testing and development.",
  [TokenType.NTWBTC]: "nTWBTC is a Wrapped Bitcoin token on the Sui testnet, used for testing cross-chain assets.",
  [TokenType.NTLBTC]: "nTLBTC is a Liquid Bitcoin token on the Sui testnet, used for testing on-chain Bitcoin liquidity.",
  [TokenType.NTWSOL]: "nTWSOL is a Wrapped Solana token on the Sui testnet, used for interacting with the Solana ecosystem.",
  [TokenType.NTDEEP]: "nTDEEP is a Deep token on the Sui testnet, used for testing and validating deep learning related blockchain applications.",
  [TokenType.NTWAL]: "nTWAL is a Wal token on the Sui testnet, used for testing ecosystem wallet functionality.",
  [TokenType.NTNS]: "nTNS is a Name Service token on the Sui testnet, used for testing domain service functionality.",
  
  // LST tokens
  [TokenType.NTKSUI]: "nTKSUI is a Kinobi Liquid Staked SUI token on the Sui testnet, representing staked SUI.",
  [TokenType.NTISUI]: "nTISUI is an Interest Bearing SUI token on the Sui testnet, used for testing interest-bearing staking models.",
  [TokenType.NTMSUI]: "nTMSUI is a Mysten Labs Staked SUI token on the Sui testnet, used for testing official staking solutions.",
  [TokenType.NTFUDSUI]: "nTFUDSUI is a Fud Staked SUI token on the Sui testnet, used for testing community staking pools.",
  [TokenType.NTTREVINSUI]: "nTTREVINSUI is a Trevin Staked SUI token on the Sui testnet, used for testing innovative liquid staking models.",
  [TokenType.NTUPSUI]: "nTUPSUI is a UPool Staked SUI token on the Sui testnet, used for testing unified staking pool models."
};

// Get token detailed information
const tokensInfo: TokenInfo[] = [
  // Native token
  {
    type: TokenType.SUI,
    name: "SUI",
    symbol: "SUI",
    decimals: 9,
    icon: TOKEN_ICONS[TokenType.SUI],
    contractAddress: TOKEN_CONTRACTS[TokenType.SUI],
    maxSupply: 10000000000,
    currentSupply: 5000000000,
    description: TOKEN_DESCRIPTIONS[TokenType.SUI],
    category: TokenCategory.NATIVE
  },
  
  // Stablecoins
  {
    type: TokenType.NTUSDC,
    name: "nTUSDC",
    symbol: "nTUSDC",
    decimals: 6,
    icon: TOKEN_ICONS[TokenType.NTUSDC],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTUSDC],
    maxSupply: 1000000000,
    currentSupply: 750000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTUSDC],
    category: TokenCategory.STABLECOIN
  },
  {
    type: TokenType.NTUSDT,
    name: "nTUSDT",
    symbol: "nTUSDT",
    decimals: 6,
    icon: TOKEN_ICONS[TokenType.NTUSDT],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTUSDT],
    maxSupply: 1000000000,
    currentSupply: 800000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTUSDT],
    category: TokenCategory.STABLECOIN
  },
  {
    type: TokenType.NTMUSD,
    name: "nTMUSD",
    symbol: "nTMUSD",
    decimals: 6,
    icon: TOKEN_ICONS[TokenType.NTMUSD],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTMUSD],
    maxSupply: 500000000,
    currentSupply: 300000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTMUSD],
    category: TokenCategory.STABLECOIN
  },
  {
    type: TokenType.NTBUCK,
    name: "nTBUCK",
    symbol: "nTBUCK",
    decimals: 6,
    icon: TOKEN_ICONS[TokenType.NTBUCK],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTBUCK],
    maxSupply: 500000000,
    currentSupply: 250000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTBUCK],
    category: TokenCategory.STABLECOIN
  },
  {
    type: TokenType.NTAUSD,
    name: "nTAUSD",
    symbol: "nTAUSD",
    decimals: 6,
    icon: TOKEN_ICONS[TokenType.NTAUSD],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTAUSD],
    maxSupply: 500000000,
    currentSupply: 200000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTAUSD],
    category: TokenCategory.STABLECOIN
  },
  
  // Cryptocurrencies
  {
    type: TokenType.NTBTC,
    name: "nTBTC",
    symbol: "nTBTC",
    decimals: 8,
    icon: TOKEN_ICONS[TokenType.NTBTC],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTBTC],
    maxSupply: 21000000,
    currentSupply: 19000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTBTC],
    category: TokenCategory.CRYPTO
  },
  {
    type: TokenType.NTWBTC,
    name: "nTWBTC",
    symbol: "nTWBTC",
    decimals: 8,
    icon: TOKEN_ICONS[TokenType.NTWBTC],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTWBTC],
    maxSupply: 21000000,
    currentSupply: 18000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTWBTC],
    category: TokenCategory.CRYPTO
  },
  {
    type: TokenType.NTLBTC,
    name: "nTLBTC",
    symbol: "nTLBTC",
    decimals: 8,
    icon: TOKEN_ICONS[TokenType.NTLBTC],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTLBTC],
    maxSupply: 21000000,
    currentSupply: 17000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTLBTC],
    category: TokenCategory.CRYPTO
  },
  {
    type: TokenType.NTWSOL,
    name: "nTWSOL",
    symbol: "nTWSOL",
    decimals: 9,
    icon: TOKEN_ICONS[TokenType.NTWSOL],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTWSOL],
    maxSupply: 500000000,
    currentSupply: 300000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTWSOL],
    category: TokenCategory.CRYPTO
  },
  {
    type: TokenType.NTDEEP,
    name: "nTDEEP",
    symbol: "nTDEEP",
    decimals: 8,
    icon: TOKEN_ICONS[TokenType.NTDEEP],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTDEEP],
    maxSupply: 1000000000,
    currentSupply: 500000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTDEEP],
    category: TokenCategory.CRYPTO
  },
  {
    type: TokenType.NTWAL,
    name: "nTWAL",
    symbol: "nTWAL",
    decimals: 8,
    icon: TOKEN_ICONS[TokenType.NTWAL],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTWAL],
    maxSupply: 1000000000,
    currentSupply: 400000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTWAL],
    category: TokenCategory.CRYPTO
  },
  {
    type: TokenType.NTNS,
    name: "nTNS",
    symbol: "nTNS",
    decimals: 8,
    icon: TOKEN_ICONS[TokenType.NTNS],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTNS],
    maxSupply: 1000000000,
    currentSupply: 300000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTNS],
    category: TokenCategory.CRYPTO
  },
  
  // LST tokens
  {
    type: TokenType.NTKSUI,
    name: "nTKSUI",
    symbol: "nTKSUI",
    decimals: 9,
    icon: TOKEN_ICONS[TokenType.NTKSUI],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTKSUI],
    maxSupply: 5000000000,
    currentSupply: 1000000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTKSUI],
    category: TokenCategory.LST
  },
  {
    type: TokenType.NTISUI,
    name: "nTISUI",
    symbol: "nTISUI",
    decimals: 9,
    icon: TOKEN_ICONS[TokenType.NTISUI],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTISUI],
    maxSupply: 5000000000,
    currentSupply: 900000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTISUI],
    category: TokenCategory.LST
  },
  {
    type: TokenType.NTMSUI,
    name: "nTMSUI",
    symbol: "nTMSUI",
    decimals: 9,
    icon: TOKEN_ICONS[TokenType.NTMSUI],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTMSUI],
    maxSupply: 5000000000,
    currentSupply: 1100000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTMSUI],
    category: TokenCategory.LST
  },
  {
    type: TokenType.NTFUDSUI,
    name: "nTFUDSUI",
    symbol: "nTFUDSUI",
    decimals: 9,
    icon: TOKEN_ICONS[TokenType.NTFUDSUI],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTFUDSUI],
    maxSupply: 5000000000,
    currentSupply: 800000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTFUDSUI],
    category: TokenCategory.LST
  },
  {
    type: TokenType.NTTREVINSUI,
    name: "nTTREVINSUI",
    symbol: "nTTREVINSUI",
    decimals: 9,
    icon: TOKEN_ICONS[TokenType.NTTREVINSUI],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTTREVINSUI],
    maxSupply: 5000000000,
    currentSupply: 750000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTTREVINSUI],
    category: TokenCategory.LST
  },
  {
    type: TokenType.NTUPSUI,
    name: "nTUPSUI",
    symbol: "nTUPSUI",
    decimals: 9,
    icon: TOKEN_ICONS[TokenType.NTUPSUI],
    contractAddress: TOKEN_CONTRACTS[TokenType.NTUPSUI],
    maxSupply: 5000000000,
    currentSupply: 950000000,
    description: TOKEN_DESCRIPTIONS[TokenType.NTUPSUI],
    category: TokenCategory.LST
  }
];

// Export functions to access token data
export const getTokenInfo = (tokenType: TokenType): TokenInfo => {
  return tokensInfo.find(token => token.type === tokenType) || tokensInfo[0];
};

export const getTokensByCategory = (category: TokenCategory): TokenInfo[] => {
  return tokensInfo.filter(token => token.category === category);
};

export const getAllCategories = (): TokenCategory[] => {
  return Object.values(TokenCategory);
};

export const getAllTokens = (): TokenInfo[] => {
  return tokensInfo;
};

export default tokensInfo; 