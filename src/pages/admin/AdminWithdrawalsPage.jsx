import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import {
  adminGetWithdrawals,
  adminProcessWithdrawal,
} from "../../services/adminService";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/helpers";
import { FaCheck, FaTimes, FaInbox } from "react-icons/fa";

const AdminWithdrawalsPage = () => {
  const [statusFilter, setStatusFilter] = useState("pending");
  const {
    data: withdrawals,
    loading,
    error,
    request: fetchWithdrawals,
  } = useApi(adminGetWithdrawals);

  useEffect(() => {
    fetchWithdrawals(statusFilter);
  }, [statusFilter, fetchWithdrawals]);

  const handleProcess = async (id, newStatus) => {
    if (
      window.confirm(`Are you sure you want to ${newStatus} this withdrawal?`)
    ) {
      try {
        await adminProcessWithdrawal(
          id,
          newStatus,
          `Request ${newStatus} by admin.`
        );
        toast.success(`Withdrawal ${newStatus}.`);
        fetchWithdrawals(statusFilter);
      } catch (err) {
        toast.error(err.response?.data?.msg || "Action failed.");
      }
    }
  };

  const tabClass = (tabName) =>
    `px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
      statusFilter === tabName
        ? "bg-green-600 text-white"
        : "text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center mt-10">
          <Spinner />
        </div>
      );
    }

    if (error) {
      return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    if (!withdrawals || withdrawals.length === 0) {
      return (
        <div className="text-center text-gray-500 mt-10 py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <FaInbox className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            No {statusFilter} requests
          </h3>
          <p className="mt-1">
            There are currently no withdrawals with this status.
          </p>
        </div>
      );
    }

    return (
      // FIX: Changed grid columns to show more cards per row on larger screens
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {withdrawals.map((w) => (
          // FIX: Reduced padding on the card from !p-4 to !p-3 for a more compact look
          <Card key={w._id} className="!p-3 flex flex-col justify-between">
            <div>
              {/* FIX: Reduced text sizes and margins for a tighter layout */}
              <div className="mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
                <p className="font-bold text-sm break-words">
                  {w.user?.username} ({w.user?.email})
                </p>
              </div>
              <div className="mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Amount Requested
                </p>
                <p className="font-bold text-xl text-red-500">
                  {formatCurrency(w.amount)}
                </p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  User's Current Balance
                </p>
                <p className="font-semibold text-sm">
                  {formatCurrency(w.user?.walletBalance)}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Requested: {formatDate(w.createdAt)}
              </p>
            </div>
            {statusFilter === "pending" && (
              // FIX: Reduced top margin to bring buttons closer
              <div className="mt-3 pt-3 border-t dark:border-gray-700 flex justify-end space-x-2">
                <Button
                  variant="danger"
                  size="sm" // Use small buttons
                  className="!px-3 !py-1" // Custom compact padding
                  onClick={() => handleProcess(w._id, "rejected")}
                >
                  <FaTimes className="mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm" // Use small buttons
                  className="!px-3 !py-1" // Custom compact padding
                  onClick={() => handleProcess(w._id, "approved")}
                >
                  <FaCheck className="mr-1" />
                  Approve
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Withdrawal Requests</h1>

      <div className="mb-6 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg inline-flex space-x-2">
        <button
          onClick={() => setStatusFilter("pending")}
          className={tabClass("pending")}
        >
          Pending
        </button>
        <button
          onClick={() => setStatusFilter("approved")}
          className={tabClass("approved")}
        >
          Approved
        </button>
        <button
          onClick={() => setStatusFilter("rejected")}
          className={tabClass("rejected")}
        >
          Rejected
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default AdminWithdrawalsPage;
