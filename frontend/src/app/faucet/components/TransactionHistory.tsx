import { useState } from "react";
import { FaHistory, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IconType } from "react-icons";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Transaction } from "../types";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const IconComponent = (Icon: IconType) => <Icon />;

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Filtering and pagination logic
  const filteredTransactions = transactions.filter(tx => 
    tx.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format address display
  const formatAddress = (address: string) => {
    if (address.length < 15) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Transaction status color mapping
  const statusColors = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  // Transaction status icons
  const statusIcons = {
    completed: (
      <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    pending: (
      <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
    ),
    failed: (
      <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Transaction History</h2>
        <p className="text-gray-500 text-sm md:text-base max-w-md">
          View your recent transactions
        </p>
        <div className="text-center py-10 text-gray-500">
          <p>No transaction records</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Transaction History</h2>
        <p className="text-gray-500 text-sm md:text-base max-w-md">
          View your recent transactions
        </p>
        
        {/* Search box */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search address..."
            className="pl-8 pr-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchQuery ? "No matching transaction records" : "No transaction records"}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900">
                      {tx.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-500">
                      {formatAddress(tx.address)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {tx.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {tx.tokenType || "SUI"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(tx.timestamp, { addSuffix: true, locale: zhCN })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[tx.status as keyof typeof statusColors]}`}>
                        {statusIcons[tx.status as keyof typeof statusIcons]}
                        {tx.status === "completed" ? "Success" : tx.status === "pending" ? "Processing" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {paginatedTransactions.length} of {transactions.length} records
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Previous page
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Next page
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistory; 