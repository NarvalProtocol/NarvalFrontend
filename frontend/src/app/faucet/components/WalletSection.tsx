import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useWallet } from "@suiet/wallet-kit";
import { FaWallet, FaInfoCircle } from "react-icons/fa";
import { IconType } from "react-icons";

interface WalletSectionProps {
  step: number;
}

const IconComponent = (Icon: IconType) => <Icon />;

const WalletSection = ({ step }: WalletSectionProps) => {
  const wallet = useWallet();
  const currentAccount = useCurrentAccount();
  const isWalletConnected = wallet.connected || !!currentAccount;

  return (
    <div className="mb-6 transition-all duration-300 hover:bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center mb-2">
        <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">
          {step}
        </div>
        <h3 className="font-medium">Wallet Connection</h3>
      </div>
      <div className="ml-8 flex items-center">
        {wallet.connected && wallet.address ? (
          <div className="flex items-center text-green-600">
            {IconComponent(FaWallet)}
            <span className="ml-2">
              Connected Suiet: {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
            </span>
          </div>
        ) : currentAccount ? (
          <div className="flex items-center text-green-600">
            {IconComponent(FaWallet)}
            <span className="ml-2">
              Connected: {currentAccount.address.substring(0, 6)}...{currentAccount.address.substring(currentAccount.address.length - 4)}
            </span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="text-amber-500 mr-2 flex items-center">
              {IconComponent(FaInfoCircle)}
              <span className="ml-2">Please connect your Sui wallet</span>
            </div>
            <div className="flex space-x-2">
              <div className="transform hover:scale-105 transition-transform duration-200">
                <ConnectButton className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletSection; 