import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TokenInfo, TokenCategory, TokenType } from '../types';
import { getAllTokens, getTokensByCategory, getAllCategories } from '../data/tokenData';
import { FaCoins } from 'react-icons/fa';

interface TokensGridProps {
  onSelectToken: (token: TokenType) => void;
  selectedToken: TokenType;
}

const TokensGrid: React.FC<TokensGridProps> = ({ onSelectToken, selectedToken }) => {
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory | 'all'>('all');
  const [tokensToShow, setTokensToShow] = useState<TokenInfo[]>(getAllTokens());
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // When the category changes, update the tokens to display
  useEffect(() => {
    if (selectedCategory === 'all') {
      setTokensToShow(getAllTokens());
    } else {
      setTokensToShow(getTokensByCategory(selectedCategory as TokenCategory));
    }
  }, [selectedCategory]);
  
  // Handle image load errors
  const handleImageError = (tokenType: string) => {
    setImageErrors(prev => ({
      ...prev,
      [tokenType]: true
    }));
  };
  
  // Get category style
  const getCategoryStyle = (category: TokenCategory) => {
    switch (category) {
      case TokenCategory.NATIVE:
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case TokenCategory.STABLECOIN:
        return 'bg-green-100 text-green-600 border-green-200';
      case TokenCategory.CRYPTO:
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case TokenCategory.LST:
        return 'bg-amber-100 text-amber-600 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };
  
  return (
    <div className="w-full">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {getAllCategories().map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? getCategoryStyle(category)
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Token grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokensToShow.map(token => (
          <button
            key={token.type}
            className={`p-4 rounded-lg border transition-all duration-200 text-left ${
              selectedToken === token.type
                ? 'bg-blue-50 border-blue-200 shadow-sm transform scale-[1.02]'
                : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-gray-50'
            }`}
            onClick={() => onSelectToken(token.type)}
          >
            <div className="flex items-center">
              {imageErrors[token.type] ? (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <FaCoins className="text-gray-400" />
                </div>
              ) : (
                <div className="relative w-10 h-10 mr-3">
                  <Image 
                    src={token.icon} 
                    alt={token.name} 
                    fill
                    sizes="40px"
                    className="rounded-full object-cover"
                    onError={() => handleImageError(token.type)}
                  />
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">{token.name}</div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">{token.symbol}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryStyle(token.category)}`}>
                    {token.category}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TokensGrid; 