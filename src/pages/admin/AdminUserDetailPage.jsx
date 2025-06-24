import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { adminGetUserDetail } from "../../services/adminService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import BetRow from "../../components/bets/BetRow";
import { formatCurrency, capitalize } from "../../utils/helpers";
import { formatDate } from "../../utils/formatDate";
import { FaUser, FaHistory, FaTicketAlt } from "react-icons/fa";
import Input from "../../components/ui/Input";

const AdminUserDetailPage = () => {
  const { userId } = useParams();

  // --- Implementation: State to manage filters ---
  const [filters, setFilters] = useState({
    txType: "",
    betStatus: "",
    sortBy: "createdAt",
    order: "desc",
    startDate: "",
    endDate: "",
  });

  const {
    data: userData,
    loading,
    error,
    request: fetchDetails,
  } = useApi(adminGetUserDetail);

  const refetchDetails = useCallback(() => {
    if (userId) {
      const params = { ...filters };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);
      fetchDetails(userId, params);
    }
  }, [userId, filters, fetchDetails]);

  useEffect(() => {
    refetchDetails();
  }, [refetchDetails]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading && !userData)
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!userData) return null;

  const { user, transactions, bets } = userData;

  return (
    <div>
      <Link
        to="/admin/users"
        className="text-blue-500 hover:underline mb-4 block"
      >
        &larr; Back to User List
      </Link>

      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold mb-6">User Details</h1>
        <Card className="!p-4 mb-6">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </Card>
      </div>

      {/* --- Implementation: New Filter Bar --- */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-8 flex flex-wrap items-end gap-4">
        {/* Transaction Filters */}
        <div>
          <label htmlFor="txType" className="text-sm font-medium">
            Transaction Type
          </label>
          <select
            id="txType"
            name="txType"
            value={filters.txType}
            onChange={handleFilterChange}
            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">All</option>
            <option value="bet">Bet</option>
            <option value="win">Win</option>
            <option value="topup">Top-up</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>
        {/* Bet Filters */}
        <div>
          <label htmlFor="betStatus" className="text-sm font-medium">
            Bet Status
          </label>
          <select
            id="betStatus"
            name="betStatus"
            value={filters.betStatus}
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
        {/* Common Filters */}
        <div>
          <label htmlFor="startDate" className="text-sm font-medium">
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
          <label htmlFor="endDate" className="text-sm font-medium">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaHistory className="mr-3" />
            Transaction History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">{formatDate(tx.createdAt)}</td>
                    <td className="px-4 py-2">{capitalize(tx.type)}</td>
                    <td
                      className={`px-4 py-2 font-bold ${
                        tx.amount >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-2">{tx.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaTicketAlt className="mr-3" />
            Bet History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2">Selections</th>
                  <th className="px-4 py-2">Stake</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Payout</th>
                </tr>
              </thead>
              <tbody>
                {bets.map((bet) => (
                  <BetRow key={bet._id} bet={bet} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
