import { FaInfoCircle } from "react-icons/fa";
import { IconType } from "react-icons";
import Image from "next/image";
import { TokenType, TokenCategory } from "../types";
import { getTokenInfo, getTokensByCategory, getAllCategories } from "../data/tokenData";
import { useState, useEffect } from 'react';
import { FaCoins, FaChevronDown } from 'react-icons/fa';

interface AmountSectionProps {
  step: number;
  selectedAmount: number;
  setSelectedAmount: (amount: number) => void;
  selectedToken: TokenType;
  setSelectedToken: (token: TokenType) => void;
  isWalletConnected: boolean;
  isVerified: boolean;
}

const IconComponent = (Icon: IconType) => <Icon />;

const AmountSection = ({
  step,
  selectedAmount,
  setSelectedAmount,
  selectedToken,
  setSelectedToken,
  isWalletConnected,
  isVerified
}: AmountSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory>(TokenCategory.NATIVE);
  const [showTokenSelector, setShowTokenSelector] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // Predefined amount options
  const amountOptions = [10, 50, 100, 500, 1000];
  
  // Token category switch
  const handleCategoryChange = (category: TokenCategory) => {
    setSelectedCategory(category);
    // If the currently selected token doesn't belong to the new category, automatically select the first token of that category
    const tokensInCategory = getTokensByCategory(category);
    if (!tokensInCategory.some(token => token.type === selectedToken)) {
      setSelectedToken(tokensInCategory[0].type);
    }
  };
  
  // When the category changes, check if the currently selected token is in that category
  useEffect(() => {
    const tokensInCategory = getTokensByCategory(selectedCategory);
    if (!tokensInCategory.some(token => token.type === selectedToken)) {
      setSelectedToken(tokensInCategory[0].type);
    }
  }, [selectedCategory, selectedToken, setSelectedToken]);
  
  // Handle token image loading error
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
  
  // Current selected token info
  const currentTokenInfo = getTokenInfo(selectedToken);
  
  return (
    <div className={`mb-6 ${!isWalletConnected || !isVerified ? 'opacity-50' : ''}`}>
      <div className="flex items-start mb-4">
        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium text-blue-600 mr-3 mt-0.5">
          {step}
        </div>
        <div>
          <h3 className="font-medium text-gray-800 mb-1">Select Amount and Token</h3>
          <p className="text-sm text-gray-500">Please select the token type and amount you'd like to receive</p>
        </div>
      </div>
      
      {/* Notice: Previous steps not completed */}
      {(!isWalletConnected || !isVerified) && (
        <div className="ml-11 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm mb-4">
          Please complete the wallet connection and verification steps first
        </div>
      )}
      
      <div className={`transition-opacity duration-200 ml-11 ${(!isWalletConnected || !isVerified) ? 'opacity-60' : 'opacity-100'}`}>
        {/* Token category selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Token Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.values(TokenCategory).map((category) => (
              <button
                key={category}
                className={`py-2 px-3 rounded-lg border transition-all duration-200 text-sm font-medium ${
                  selectedCategory === category
                    ? `${getCategoryStyle(category)} shadow-sm transform scale-105`
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryChange(category)}
                disabled={!isWalletConnected || !isVerified}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Token selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Token</label>
          <div className="relative">
            <button
              className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3 text-gray-700 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onClick={() => setShowTokenSelector(!showTokenSelector)}
              disabled={!isWalletConnected || !isVerified}
            >
              <div className="flex items-center">
                {imageErrors[selectedToken] ? (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <FaCoins className="text-gray-400" />
                  </div>
                ) : (
                  <div className="relative w-8 h-8 mr-3">
                    <Image 
                      src={currentTokenInfo.icon} 
                      alt={currentTokenInfo.name} 
                      fill
                      sizes="32px"
                      className="rounded-full"
                      onError={() => handleImageError(selectedToken)}
                    />
                  </div>
                )}
                <span>{currentTokenInfo.name}</span>
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getCategoryStyle(currentTokenInfo.category)}`}>
                  {currentTokenInfo.symbol}
                </span>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${showTokenSelector ? 'transform rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown selection panel */}
            {showTokenSelector && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                <div className="p-2">
                  {getTokensByCategory(selectedCategory).map((token) => (
                    <button
                      key={token.type}
                      className={`w-full flex items-center p-2 rounded-lg mb-1 last:mb-0 hover:bg-gray-50 transition-colors ${
                        selectedToken === token.type ? 'bg-blue-50 border border-blue-100' : ''
                      }`}
                      onClick={() => {
                        setSelectedToken(token.type);
                        setShowTokenSelector(false);
                      }}
                    >
                      {imageErrors[token.type] ? (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <FaCoins className="text-gray-400" />
                        </div>
                      ) : (
                        <div className="relative w-8 h-8 mr-3">
                          <Image 
                            src={token.icon} 
                            alt={token.name} 
                            fill
                            sizes="32px"
                            className="rounded-full object-cover"
                            onError={() => handleImageError(token.type)}
                          />
                        </div>
                      )}
                      <div className="flex flex-col items-start text-left">
                        <span className="font-medium text-gray-800">{token.name}</span>
                        <span className="text-xs text-gray-500">{token.symbol}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Amount selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount</label>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {amountOptions.map(amount => (
              <button
                key={amount}
                className={`py-2 px-3 rounded-lg border transition-all duration-200 text-sm font-medium ${
                  selectedAmount === amount
                    ? 'bg-blue-100 text-blue-600 border-blue-200 shadow-sm transform scale-105'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedAmount(amount)}
                disabled={!isWalletConnected || !isVerified}
              >
                {amount}
              </button>
            ))}
          </div>
          
          {/* Custom amount input */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Custom Amount
            </label>
            <div className="relative rounded-lg shadow-sm">
              <input
                type="number"
                className="block w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(Number(e.target.value))}
                disabled={!isWalletConnected || !isVerified}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-gray-500 sm:text-sm">{selectedToken}</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 flex items-center">
              <FaInfoCircle className="mr-1" />
              Maximum request amount: 1000 per day
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmountSection; 