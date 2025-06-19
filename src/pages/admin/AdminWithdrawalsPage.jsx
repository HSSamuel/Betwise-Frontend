import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import {
  adminGetWithdrawals,
  adminProcessWithdrawal,
} from "../../services/adminService";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card"; // Import Card for the new layout
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/helpers";
import { FaCheck, FaTimes, FaInbox } from "react-icons/fa"; // Import icons

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

  // Using a more modern button-style for the tabs
  const tabClass = (tabName) =>
    `px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
      statusFilter === tabName
        ? "bg-green-600 text-white"
        : "text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  // This function will render our new layout
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

    // An improved "empty state" when there are no withdrawals
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

    // Render a grid of cards instead of a table for a cleaner look
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {withdrawals.map((w) => (
          <Card key={w._id} className="flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
                <p className="font-bold">
                  {w.user?.username} ({w.user?.email})
                </p>
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Amount Requested
                </p>
                <p className="font-bold text-2xl text-red-500">
                  {formatCurrency(w.amount)}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  User's Current Balance
                </p>
                <p className="font-semibold">
                  {formatCurrency(w.user?.walletBalance)}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Requested: {formatDate(w.createdAt)}
              </p>
            </div>
            {statusFilter === "pending" && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end space-x-2">
                <Button
                  variant="danger"
                  onClick={() => handleProcess(w._id, "rejected")}
                >
                  <FaTimes className="mr-2" />
                  Reject
                </Button>
                <Button onClick={() => handleProcess(w._id, "approved")}>
                  <FaCheck className="mr-2" />
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
