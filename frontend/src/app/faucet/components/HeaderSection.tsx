import { FaCog, FaCoins } from "react-icons/fa";

interface HeaderSectionProps {
  faucetBalance: number;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
}

const HeaderSection = ({ faucetBalance, isAdminMode, toggleAdminMode }: HeaderSectionProps) => {
  return (
    <div className="flex flex-col mb-8">
      <div className="flex items-center">
        <div className="flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 mr-4">
          <FaCoins className="text-3xl text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
            Narval <span className="text-gray-800">Testnet Faucet</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-md">
            Quickly obtain Sui testnet tokens for developing and testing your applications
          </p>
        </div>
        
        {/* Admin button */}
        <button
          onClick={toggleAdminMode}
          className={`ml-auto p-2 rounded-lg transition-all duration-300 flex items-center shadow-sm hover:shadow ${
            isAdminMode 
              ? "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-600 hover:from-amber-200 hover:to-amber-300" 
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 hover:from-gray-200 hover:to-gray-300"
          }`}
          title={isAdminMode ? "Exit Admin Mode" : "Enable Admin Mode"}
        >
          <FaCog className={`${isAdminMode ? "animate-spin-slow" : ""}`} />
          <span className="ml-2 text-sm font-medium">{isAdminMode ? "Admin Mode" : "Admin"}</span>
        </button>
      </div>
      
      {/* Wave effect background */}
      <div className="relative mt-6 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        {/* Wave decoration */}
        <div className="absolute -bottom-2 left-0 right-0 h-16 opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#4F46E5" fillOpacity="1" d="M0,128L48,122.7C96,117,192,107,288,101.3C384,96,480,96,576,112C672,128,768,160,864,154.7C960,149,1056,107,1152,85.3C1248,64,1344,64,1392,64L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 bg-blue-400 rounded-full opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 -mb-8 -ml-8 bg-indigo-500 rounded-full opacity-10"></div>
        
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-gray-700 mb-2 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Total SUI Balance
            </p>
            <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center">
              <div className="flex items-center mr-3 bg-white p-2 rounded-lg shadow-inner">
                <FaCoins className="text-indigo-500 mr-2" /> 
              </div>
              {faucetBalance.toLocaleString()} SUI
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Claim Limit
            </p>
            <p className="font-semibold text-gray-800">Once every 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection; 