import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useApi } from "../../hooks/useApi";
import { getUserBets, cashOutBet } from "../../services/betService";
import Spinner from "../../components/ui/Spinner";
import Pagination from "../../components/ui/Pagination";
import { FaTicketAlt, FaInbox, FaFilter } from "react-icons/fa";
import { useSocket } from "../../contexts/SocketContext";
import BetRow from "../../components/bets/BetRow";
import Input from "../../components/ui/Input"; // Ensure Input is imported

const MyBetsPage = () => {
  // --- Implementation: State is now managed by a single 'filters' object ---
  const [filters, setFilters] = useState({
    status: "",
    sortBy: "createdAt",
    order: "desc",
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error, request: fetchBets } = useApi(getUserBets);
  const { socket } = useSocket();
  const { loading: cashOutLoading, request: performCashOut } =
    useApi(cashOutBet);

  const fetchLatestBets = useCallback(() => {
    // Pass the entire filters object to the API call
    const params = { page: currentPage, limit: 12, ...filters };
    // Clean up empty filter values before sending
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });
    fetchBets(params);
  }, [currentPage, filters, fetchBets]);

  useEffect(() => {
    fetchLatestBets();
  }, [fetchLatestBets]);

  // Reset to page 1 only when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCashOut = async (betId) => {
    const result = await performCashOut(betId);
    if (result) {
      toast.success(result.msg || "Bet cashed out successfully!");
      fetchLatestBets();
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleGameResultUpdate = () => {
      fetchLatestBets();
    };
    socket.on("gameResultUpdated", handleGameResultUpdate);
    return () => {
      socket.off("gameResultUpdated", handleGameResultUpdate);
    };
  }, [socket, fetchLatestBets]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FaTicketAlt className="mr-3 text-green-500" /> My Bets
        </h1>
      </div>

      {/* --- Implementation: New Filter Bar --- */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor="status"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="sortBy"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Sort By
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="createdAt">Date</option>
            <option value="stake">Stake</option>
            <option value="payout">Payout</option>
            <option value="totalOdds">Odds</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Start Date
          </label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            End Date
          </label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="mt-1"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center mt-10">
          <Spinner />
        </div>
      )}
      {error && !loading && (
        <p className="text-center p-4 text-red-500">{error}</p>
      )}

      {!loading && data?.bets.length > 0 && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Selections
                </th>
                <th scope="col" className="px-6 py-3">
                  Stake
                </th>
                <th scope="col" className="px-6 py-3">
                  Odds
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Payout
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.bets.map((bet) => (
                <BetRow
                  key={bet._id}
                  bet={bet}
                  onCashOut={handleCashOut}
                  isCashOutLoading={cashOutLoading}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && data?.bets.length === 0 && (
        <div className="text-center text-gray-500 mt-10 py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <FaInbox className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            No Bets Found
          </h3>
          <p className="mt-1">Your bets for this category will appear here.</p>
        </div>
      )}

      <Pagination
        currentPage={data?.currentPage || 1}
        totalPages={data?.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default MyBetsPage;
