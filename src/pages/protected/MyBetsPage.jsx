// In: Bet/Frontend/src/pages/protected/MyBetsPage.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useApi } from "../../hooks/useApi";
// FIX: Corrected the import from 'getBets' to 'getUserBets'
import { getUserBets } from "../../services/betService";
import Spinner from "../../components/ui/Spinner";
import Pagination from "../../components/ui/Pagination";
import { FaTicketAlt, FaInbox } from "react-icons/fa";
import { useSocket } from "../../contexts/SocketContext";
import BetCard from "../../components/bets/BetCard";

const MyBetsPage = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // FIX: Passed the correctly named 'getUserBets' function to the useApi hook
  const { data, loading, error, request: fetchBets } = useApi(getUserBets);
  const socket = useSocket();

  const fetchLatestBets = useCallback(() => {
    const params = { page: currentPage, limit: 10 };
    if (statusFilter) {
      params.status = statusFilter;
    }
    fetchBets(params);
  }, [currentPage, statusFilter, fetchBets]);

  useEffect(() => {
    fetchLatestBets();
  }, [fetchLatestBets]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="cancelled">Cancelled</option>
        </select>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.bets.map((bet) => (
            <BetCard key={bet._id} bet={bet} />
          ))}
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
