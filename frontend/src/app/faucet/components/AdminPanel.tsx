import { useState } from "react";
import { TokenType } from "../types";

interface AdminPanelProps {
  isAdminMode: boolean;
  faucetBalance: number;
  maxRequestAmount: number;
  setMaxRequestAmount: (amount: number) => void;
  cooldownHours: number;
  setCooldownHours: (hours: number) => void;
  isFaucetPaused: boolean;
  toggleFaucetService: () => void;
  addFunds: (amount: number, tokenType?: TokenType) => void;
  updateFaucetSettings: () => void;
  exportTransactionHistory: () => void;
  isLoading: boolean;
}

const AdminPanel = ({
  isAdminMode,
  faucetBalance,
  maxRequestAmount,
  setMaxRequestAmount,
  cooldownHours,
  setCooldownHours,
  isFaucetPaused,
  toggleFaucetService,
  addFunds,
  updateFaucetSettings,
  exportTransactionHistory,
  isLoading
}: AdminPanelProps) => {
  const [fundAmount, setFundAmount] = useState<number>(1000);
  const [selectedFundToken, setSelectedFundToken] = useState<TokenType>(TokenType.SUI);
  
  if (!isAdminMode) return null;
  
  return (
    <div className="mt-8 bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        管理员面板
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* 龙头资金管理 */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-3 text-gray-700">龙头资金管理</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择代币类型
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {Object.values(TokenType).map((token) => (
                <button
                  key={token}
                  className={`py-1 px-2 rounded text-sm border transition-all ${
                    selectedFundToken === token 
                      ? "bg-blue-500 text-white border-blue-500" 
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedFundToken(token)}
                >
                  {token}
                </button>
              ))}
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mb-1">
              充值金额
            </label>
            <div className="flex">
              <input
                type="number"
                min="1"
                value={fundAmount}
                onChange={(e) => setFundAmount(parseInt(e.target.value) || 0)}
                className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r flex items-center disabled:bg-blue-300"
                onClick={() => addFunds(fundAmount, selectedFundToken)}
                disabled={isLoading || fundAmount <= 0}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                )}
                充值
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded flex items-center justify-center"
              onClick={exportTransactionHistory}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              导出交易历史
            </button>
          </div>
        </div>
        
        {/* 龙头设置 */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-3 text-gray-700">龙头设置</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最大请求金额
              </label>
              <input
                type="number"
                min="1"
                value={maxRequestAmount}
                onChange={(e) => setMaxRequestAmount(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                冷却时间（小时）
              </label>
              <input
                type="number"
                min="0"
                value={cooldownHours}
                onChange={(e) => setCooldownHours(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                className="flex-1 py-2 rounded flex items-center justify-center text-white"
                style={{ backgroundColor: isFaucetPaused ? "#10B981" : "#EF4444" }}
                onClick={toggleFaucetService}
              >
                {isFaucetPaused ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    恢复服务
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    暂停服务
                  </>
                )}
              </button>
              
              <button
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center disabled:bg-blue-300"
                onClick={updateFaucetSettings}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                )}
                保存设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 