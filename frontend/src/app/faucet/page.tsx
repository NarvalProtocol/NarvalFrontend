"use client";

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { FiRefreshCw } from 'react-icons/fi';
import { FaTwitter, FaDiscord, FaTelegram, FaWater } from 'react-icons/fa';
import { NetworkStatus, TokenType, Transaction, TokenCategory } from './types';
import Image from 'next/image';
import { getTokensByCategory, getTokenInfo } from './data/tokenData';

// Import components
import HeaderSection from './components/HeaderSection';
import WalletSection from './components/WalletSection';
import VerificationSection from './components/VerificationSection';
import AmountSection from './components/AmountSection';
import InfoPanel from './components/InfoPanel';
import TransactionHistory from './components/TransactionHistory';
import AdminPanel from './components/AdminPanel';
import TokenDetailCard from './components/TokenDetailCard';
import TokensGrid from './components/TokensGrid';

// Social links configuration
const socialLinks = [
  { name: 'Twitter', url: 'https://twitter.com/sui_network', icon: FaTwitter, color: 'bg-blue-400' },
  { name: 'Discord', url: 'https://discord.gg/sui', icon: FaDiscord, color: 'bg-indigo-500' },
  { name: 'Telegram', url: 'https://t.me/sui_network', icon: FaTelegram, color: 'bg-blue-500' },
];

// Faucet page main component
const Faucet = () => {
  // Faucet status
  const [faucetBalance, setFaucetBalance] = useState<number>(100000000);
  const [maxRequestAmount, setMaxRequestAmount] = useState<number>(1000);
  const [cooldownHours, setCooldownHours] = useState<number>(24);
  const [isFaucetPaused, setIsFaucetPaused] = useState<boolean>(false);
  
  // User status
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  
  // Token related status
  const [selectedToken, setSelectedToken] = useState<TokenType>(TokenType.SUI);
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [tokenBalances, setTokenBalances] = useState<Record<TokenType, number>>({} as Record<TokenType, number>);
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory>(TokenCategory.NATIVE);
  
  // Transaction related status
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({ status: 'loading' });
  
  // UI status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  // Initialize on page load
  useEffect(() => {
    // Simulate data loading
    fetchData();
    // Simulate network status
    setNetworkStatus({
      status: 'online',
      blockHeight: 12345678
    });
    // Simulate balance data
    initializeTokenBalances();
  }, []);

  // Initialize token balances
  const initializeTokenBalances = () => {
    const balances = {} as Record<TokenType, number>;
    Object.values(TokenType).forEach(token => {
      balances[token] = Math.floor(Math.random() * 1000000) + 100000;
    });
    setTokenBalances(balances);
  };

  // Get current selected token balance
  const getCurrentTokenBalance = () => {
    return tokenBalances[selectedToken] || 0;
  };

  // Get current selected token info
  const currentTokenInfo = getTokenInfo(selectedToken);
  
  // Get current user selected token balance
  const currentUserBalance = Math.floor(Math.random() * 1000);

  // Refresh data
  const fetchData = () => {
    setRefreshing(true);
    
    // Simulate network request
    setTimeout(() => {
      setRefreshing(false);
      setTransactions([
        {
          id: '1',
          address: '0x1234...5678',
          amount: 100,
          timestamp: Date.now() - 1000 * 60 * 5,
          status: 'completed',
          tokenType: TokenType.SUI
        },
        {
          id: '2',
          address: '0x8765...4321',
          amount: 50,
          timestamp: Date.now() - 1000 * 60 * 15,
          status: 'completed',
          tokenType: TokenType.NTUSDC
        },
        {
          id: '3',
          address: '0x5678...1234',
          amount: 200,
          timestamp: Date.now() - 1000 * 60 * 45,
          status: 'pending',
          tokenType: TokenType.NTBTC
        }
      ]);
    }, 1000);
  };

  // Get CSS class for token category
  const getCategoryStyle = (category: TokenCategory) => {
    switch (category) {
      case TokenCategory.NATIVE:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-600',
          border: 'border-blue-200'
        };
      case TokenCategory.STABLECOIN:
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          border: 'border-green-200'
        };
      case TokenCategory.CRYPTO:
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-600',
          border: 'border-purple-200'
        };
      case TokenCategory.LST:
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-600',
          border: 'border-amber-200'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          border: 'border-gray-200'
        };
    }
  };

  // Toggle admin mode
  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  // Add funds (admin function)
  const addFunds = (amount: number) => {
    setFaucetBalance(prev => prev + amount);
    toast.success(`Successfully added ${amount} units of funds`);
  };

  // Update faucet settings (admin function)
  const updateFaucetSettings = () => {
    toast.success('Faucet settings updated');
  };

  // Export transaction history (admin function)
  const exportTransactionHistory = () => {
    toast.success('Transaction history exported');
  };

  // Toggle faucet service status (admin function)
  const toggleFaucetService = () => {
    setIsFaucetPaused(!isFaucetPaused);
    toast.success(`Faucet service ${isFaucetPaused ? 'started' : 'paused'}`);
  };

  // Request test tokens
  const requestTestTokens = () => {
    setIsLoading(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setIsLoading(false);
      setLastRequestTime(Date.now());
      
      // Update faucet balance
      setTokenBalances(prev => ({
        ...prev,
        [selectedToken]: prev[selectedToken] - selectedAmount
      }));
      
      // Add transaction record
      setTransactions(prev => [
        {
          id: Math.random().toString(36).substring(2, 9),
          address: userAddress || '0x1234...5678',
          amount: selectedAmount,
          timestamp: Date.now(),
          status: 'completed',
          tokenType: selectedToken
        },
        ...prev
      ]);
      
      toast.success(`Successfully received ${selectedAmount} ${selectedToken}`);
    }, 2000);
  };

  // Check if button is disabled
  const isButtonDisabled = 
    !isWalletConnected ||
    !isVerified ||
    selectedAmount <= 0 ||
    selectedAmount > maxRequestAmount ||
    isFaucetPaused ||
    getCurrentTokenBalance() < selectedAmount ||
    isLoading ||
    (lastRequestTime !== null && Date.now() - lastRequestTime < cooldownHours * 3600 * 1000);

  // Calculate cooldown time
  const calculateCooldown = () => {
    if (!lastRequestTime) return null;
    
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    const cooldownTime = cooldownHours * 3600 * 1000;
    
    if (timeSinceLastRequest < cooldownTime) {
      const timeLeft = cooldownTime - timeSinceLastRequest;
      const hoursLeft = Math.floor(timeLeft / (3600 * 1000));
      const minutesLeft = Math.floor((timeLeft % (3600 * 1000)) / (60 * 1000));
      
      return { hoursLeft, minutesLeft, timeLeft };
    }
    
    return null;
  };

  // Render cooldown time notice
  const renderCooldown = () => {
    const cooldown = calculateCooldown();
    
    if (cooldown) {
      return (
        <div className="ml-8 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-sm text-red-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>
              Please wait {cooldown.hoursLeft} hours {cooldown.minutesLeft} minutes before requesting again
            </span>
          </p>
        </div>
      );
    }
    
    return null;
  };
    
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Page title and faucet balance */}
        <div className="flex justify-between items-center mb-6">
          <HeaderSection 
            faucetBalance={faucetBalance} 
            isAdminMode={isAdminMode} 
            toggleAdminMode={toggleAdminMode} 
          />
          
          {/* Refresh button */}
          <button 
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center space-x-1 bg-white rounded-full py-2 px-4 shadow hover:shadow-md transition-all duration-200"
          >
            <FiRefreshCw className={`text-blue-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm text-gray-700">Refresh Data</span>
          </button>
        </div>
        
        {/* Main operation area */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Operation panel */}
          <div className="md:col-span-2 space-y-4">
            {/* Token detail card */}
            <TokenDetailCard 
              tokenInfo={currentTokenInfo}
              userBalance={currentUserBalance}
            />
            
            {/* Operation area */}
            <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mr-3 shadow-md">
                  <FaWater className="text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Request Test Tokens</h2>
              </div>
              
              {/* Step 1: Connect wallet */}
              <WalletSection step={1} />
              
              <div className="my-4 border-t border-gray-100"></div>
              
              {/* Step 2: Verification */}
              <VerificationSection 
                step={2} 
                isVerified={isVerified} 
                setIsVerified={setIsVerified} 
              />
              
              <div className="my-4 border-t border-gray-100"></div>
              
              {/* Step 3: Select amount and token */}
              <AmountSection 
                step={3} 
                selectedAmount={selectedAmount} 
                setSelectedAmount={setSelectedAmount}
                selectedToken={selectedToken}
                setSelectedToken={setSelectedToken}
                isWalletConnected={isWalletConnected} 
                isVerified={isVerified} 
              />
              
              {/* Token balance display */}
              <div className="mb-4 ml-8 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="mr-2">Current {selectedToken} faucet balance:</span>
                  <span className="font-semibold text-blue-600">{getCurrentTokenBalance().toLocaleString()}</span>
                </p>
              </div>
              
              {/* Cooldown notice */}
              {renderCooldown()}
              
              {/* Submit button */}
              <div className="mt-6">
                <button
                  className={`w-full py-4 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] ${
                    isButtonDisabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                  }`}
                  onClick={requestTestTokens}
                  disabled={isButtonDisabled}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Get {selectedAmount} {selectedToken}</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Funds will arrive in your wallet within seconds after request
                </p>
              </div>
            </div>
          </div>
          
          {/* Right: Information panel */}
          <div className="space-y-4">
            <InfoPanel networkStatus={networkStatus} />
            
            {/* Token category switcher */}
            <div className="bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                Select Token Category
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(TokenCategory).map((category) => {
                  const categoryStyle = getCategoryStyle(category);
                  return (
                    <button
                      key={category}
                      className={`p-2 rounded-lg border transition-all duration-200 text-sm font-medium flex items-center justify-center ${
                        selectedCategory === category
                          ? `${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} shadow-sm transform scale-105`
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Token list */}
            <div className="bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  Token List
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryStyle(selectedCategory).bg} ${getCategoryStyle(selectedCategory).text} font-medium`}>
                  {selectedCategory}
                </span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {getTokensByCategory(selectedCategory).map(token => (
                  <div 
                    key={token.type} 
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      token.type === selectedToken 
                        ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => setSelectedToken(token.type)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-3 relative">
                        <Image
                          src={token.icon}
                          alt={token.name}
                          fill
                          sizes="32px"
                          className="rounded-full object-cover"
                          onError={(e) => {
                            // Use default icon when image fails to load
                            (e.target as HTMLImageElement).src = '/icons/token-default.svg';
                          }}
                        />
                      </div>
                      <span className="font-medium">{token.name}</span>
                    </div>
                    <span className="text-gray-700 font-medium">{tokenBalances[token.type]?.toLocaleString() || '0'}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Social links */}
            <div className="bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-medium mb-3 text-gray-800">Join Community</h3>
              <div className="grid grid-cols-3 gap-3">
                {socialLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link.color} text-white p-3 rounded-xl text-center flex flex-col items-center transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md`}
                  >
                    <link.icon size={24} className="mb-2" />
                    <span className="text-xs font-medium">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Token grid display area */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Available Testnet Tokens</h2>
            <TokensGrid 
              onSelectToken={(token) => setSelectedToken(token)}
              selectedToken={selectedToken}
            />
            <div className="mt-6 text-sm text-gray-500">
              <p>Token icons source: Some provided by CoinGecko, others are local SVG icons</p>
              <p>All testnet tokens are for testing purposes only and have no real value</p>
            </div>
          </div>
        </div>
        
        {/* Transaction history */}
        <div className="mt-8">
          <TransactionHistory transactions={transactions} />
        </div>
        
        {/* Admin panel */}
        <AdminPanel 
          isAdminMode={isAdminMode}
          faucetBalance={faucetBalance}
          maxRequestAmount={maxRequestAmount}
          setMaxRequestAmount={setMaxRequestAmount}
          cooldownHours={cooldownHours}
          setCooldownHours={setCooldownHours}
          isFaucetPaused={isFaucetPaused}
          toggleFaucetService={toggleFaucetService}
          addFunds={addFunds}
          updateFaucetSettings={updateFaucetSettings}
          exportTransactionHistory={exportTransactionHistory}
          isLoading={isLoading}
        />
        
        {/* Footer information */}
        <div className="mt-8 text-center text-gray-500 p-4 bg-white rounded-xl shadow-sm">
          <p>
            This faucet is for the Sui testnet only, test tokens have no real value.
            <br />
            For any issues, please contact <a href="mailto:support@example.com" className="text-blue-500 hover:underline">support@example.com</a>
          </p>
        </div>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#333333',
              padding: '12px 16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Faucet;
