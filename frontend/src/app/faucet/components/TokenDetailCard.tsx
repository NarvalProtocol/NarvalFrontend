import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCopy, FaExternalLinkAlt, FaInfoCircle, FaCoins } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { TokenInfo, TokenCategory } from '../types';

// Define category colors
const CATEGORY_COLORS = {
  [TokenCategory.NATIVE]: 'bg-purple-100 text-purple-800',
  [TokenCategory.STABLECOIN]: 'bg-green-100 text-green-800',
  [TokenCategory.CRYPTO]: 'bg-blue-100 text-blue-800',
  [TokenCategory.LST]: 'bg-amber-100 text-amber-800',
};

interface TokenDetailCardProps {
  tokenInfo: TokenInfo;
  userBalance: number;
}

const TokenDetailCard = ({ tokenInfo, userBalance }: TokenDetailCardProps) => {
  const [showAddressTooltip, setShowAddressTooltip] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // Reset image error state when token changes
  useEffect(() => {
    setImageError(false);
  }, [tokenInfo.type]);

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get icon URL
  const getIconUrl = () => {
    if (imageError) {
      return '/icons/token-default.svg';
    }
    return tokenInfo.icon;
  };

  // Shorten address display
  const shortenAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  // Copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Address copied to clipboard');
    }).catch(err => {
      toast.error('Copy failed');
      console.error('Copy failed: ', err);
    });
  };

  // Get category badge style
  const getCategoryBadgeStyle = (category: TokenCategory) => {
    switch (category) {
      case TokenCategory.NATIVE:
        return 'bg-blue-100 text-blue-600';
      case TokenCategory.STABLECOIN:
        return 'bg-green-100 text-green-600';
      case TokenCategory.CRYPTO:
        return 'bg-purple-100 text-purple-600';
      case TokenCategory.LST:
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toString();
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md p-5 mb-4 transition-all duration-300 hover:shadow-lg border border-gray-100 overflow-hidden relative transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gray-50 to-transparent rounded-full -mr-32 -mt-32 transition-all duration-500 ${isHovering ? 'opacity-60' : 'opacity-30'}`}></div>
      
      <div className="flex flex-col md:flex-row md:items-center relative z-10">
        {/* Token icon and basic information */}
        <div className="flex items-center mb-4 md:mb-0 md:mr-6">
          <div className="relative w-16 h-16 p-1 rounded-full bg-gray-50 mr-4 shadow-sm transition-transform duration-300 flex items-center justify-center">
            <div className="relative rounded-full overflow-hidden w-full h-full">
              <Image
                src={getIconUrl()}
                alt={tokenInfo.name}
                fill
                sizes="64px"
                className="object-cover"
                onError={handleImageError}
              />
            </div>
            {/* Decorative halo */}
            <div className="absolute inset-0 w-full h-full rounded-full border border-gray-200 opacity-30 animate-ping"></div>
          </div>
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-gray-800 mr-2">{tokenInfo.name}</h2>
              <span className={`text-xs px-2 py-1 rounded-full ${CATEGORY_COLORS[tokenInfo.category]}`}>
                {tokenInfo.category}
              </span>
            </div>
            <div className="text-gray-500 text-sm flex items-center">
              <span>{tokenInfo.symbol}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mx-2"></div>
              <span>Decimals: {tokenInfo.decimals}</span>
            </div>
          </div>
        </div>
        
        {/* Token balance and contract information */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User balance */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-100 shadow-sm transition-all duration-300 hover:shadow">
            <div className="text-sm text-gray-500 mb-1">Your Balance</div>
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {formatNumber(userBalance)} {tokenInfo.symbol}
            </div>
          </div>
          
          {/* Contract address */}
          <div 
            className="relative bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-100 shadow-sm transition-all duration-300 hover:shadow"
            onMouseEnter={() => setShowAddressTooltip(true)}
            onMouseLeave={() => setShowAddressTooltip(false)}
          >
            <div className="text-sm text-gray-500 mb-1">Contract Address</div>
            <div className="flex items-center">
              <code className="text-xs md:text-sm text-gray-700 font-mono truncate max-w-[120px] md:max-w-[180px]">
                {shortenAddress(tokenInfo.contractAddress)}
              </code>
              <button 
                onClick={() => copyToClipboard(tokenInfo.contractAddress)}
                className="ml-2 text-blue-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                title="Copy address"
              >
                <FaCopy size={14} />
              </button>
              <a 
                href={`https://explorer.sui.io/object/${tokenInfo.contractAddress}?network=testnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                title="View in explorer"
              >
                <FaExternalLinkAlt size={14} />
              </a>
            </div>
            
            {/* Address tooltip */}
            {showAddressTooltip && (
              <div className="absolute left-0 bottom-full mb-2 bg-black text-white text-xs rounded py-1 px-2 shadow-lg z-20 whitespace-nowrap">
                {tokenInfo.contractAddress}
                <div className="absolute top-full left-4 w-2 h-2 bg-black transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Token description */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-start relative z-10">
        <FaInfoCircle className="text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-600">
            {tokenInfo.description}
          </p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Category: <span className="font-medium ml-1">{tokenInfo.category}</span>
            </span>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Supply: <span className="font-medium ml-1">{formatNumber(tokenInfo.currentSupply)} / {formatNumber(tokenInfo.maxSupply)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailCard; 