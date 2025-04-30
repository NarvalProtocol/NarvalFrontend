import { NetworkStatus } from "../types";
import { FaNetworkWired, FaCheckCircle, FaTimesCircle, FaSpinner, FaInfoCircle } from "react-icons/fa";

interface InfoPanelProps {
  networkStatus: NetworkStatus;
}

const InfoPanel = ({ networkStatus }: InfoPanelProps) => {
  // Network status related configuration
  const statusConfig = {
    online: {
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: FaCheckCircle,
      text: "Online"
    },
    offline: {
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: FaTimesCircle,
      text: "Offline"
    },
    loading: {
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      icon: FaSpinner,
      text: "Connecting"
    }
  };

  const currentStatus = statusConfig[networkStatus.status];

  return (
    <div className="bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg overflow-hidden relative border border-gray-100 transform hover:-translate-y-1">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-bl from-blue-100 to-transparent rounded-full opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 -ml-4 -mb-4 bg-gradient-to-tr from-indigo-100 to-transparent rounded-full opacity-60"></div>
      
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white mr-3 shadow-md transform transition-transform duration-300 hover:scale-110">
          <FaNetworkWired />
        </div>
        <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Network Status</h3>
      </div>
      
      <div className="space-y-3 relative z-10">
        {/* Network status */}
        <div className={`p-3 rounded-lg ${currentStatus.bgColor} ${currentStatus.borderColor} border flex items-center transform transition-all duration-300 hover:scale-[1.02] shadow-sm`}>
          <div className={`${currentStatus.color} ${networkStatus.status === 'loading' ? 'animate-spin' : ''}`}>
            <currentStatus.icon size={18} />
          </div>
          <div className="ml-3">
            <div className="text-gray-700 font-medium">Sui Testnet</div>
            <div className={`text-sm ${currentStatus.color} font-medium flex items-center`}>
              {currentStatus.text}
              {networkStatus.status === 'online' && (
                <span className="ml-2 w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
              )}
            </div>
          </div>
        </div>
        
        {/* Block height */}
        {networkStatus.blockHeight && (
          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
            <div className="text-sm text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Block Height
            </div>
            <div className="font-mono font-medium text-gray-800 flex items-center">
              <span className="text-blue-500 mr-1">#</span>
              <span className="text-indigo-600">{networkStatus.blockHeight.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Request operation notice */}
      <div className="mt-4 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100 shadow-sm relative z-10">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-gray-600">
            Please ensure you are connected to the Sui testnet before requesting test tokens
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel; 