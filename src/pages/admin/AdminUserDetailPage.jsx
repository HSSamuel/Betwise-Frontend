import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import {
  adminGetUserDetail,
  adminUpdateUserRole,
  adminAdjustUserWallet,
  adminDeleteUser,
} from "../../services/adminService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import BetRow from "../../components/bets/BetRow";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { formatCurrency, capitalize } from "../../utils/helpers";
import { formatDate, formatTimeAgo } from "../../utils/formatDate"; // Corrected import
import { useSocket } from "../../contexts/SocketContext";
import {
  FaUser,
  FaHistory,
  FaTicketAlt,
  FaTrashAlt,
  FaShieldAlt,
  FaSignInAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

const OnlineStatusBadge = ({ isOnline, lastSeen }) => {
  if (isOnline) {
    return (
      <div className="flex items-center text-sm text-green-500">
        <span className="h-2 w-2 mr-2 bg-green-500 rounded-full animate-pulse"></span>
        Online
      </div>
    );
  }
  return (
    <div className="flex items-center text-sm text-gray-400">
      <span className="h-2 w-2 mr-2 bg-gray-400 rounded-full"></span>
      Last seen: {formatTimeAgo(lastSeen)}
    </div>
  );
};

const AdminUserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

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

  const { loading: roleLoading, request: changeRole } =
    useApi(adminUpdateUserRole);
  const { loading: walletLoading, request: adjustWallet } = useApi(
    adminAdjustUserWallet
  );
  const { loading: deleteLoading, request: deleteUser } =
    useApi(adminDeleteUser);

  const [walletAmount, setWalletAmount] = useState("");
  const [walletDescription, setWalletDescription] = useState("");
  const [onlineStatus, setOnlineStatus] = useState(null);

  const refetchWithCurrentFilters = useCallback(() => {
    if (userId) {
      const params = { ...filters };
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });
      fetchDetails(userId, params);
    }
  }, [userId, filters, fetchDetails]);

  useEffect(() => {
    refetchWithCurrentFilters();
  }, [refetchWithCurrentFilters]);

  useEffect(() => {
    if (userData?.user) {
      setOnlineStatus({
        isOnline: userData.user.isOnline,
        lastSeen: userData.user.lastSeen || userData.user.createdAt, // Fallback to joined date
      });
    }
  }, [userData]);

  useEffect(() => {
    if (socket) {
      const handleStatusUpdate = (data) => {
        if (data.userId === userId) {
          setOnlineStatus({ isOnline: data.isOnline, lastSeen: data.lastSeen });
        }
      };
      socket.on("userStatusUpdate", handleStatusUpdate);
      return () => {
        socket.off("userStatusUpdate", handleStatusUpdate);
      };
    }
  }, [socket, userId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = async () => {
    const newRole = userData.user.role === "admin" ? "user" : "admin";
    if (
      window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      const result = await changeRole(userId, newRole);
      if (result) {
        toast.success("User role updated successfully!");
        refetchWithCurrentFilters();
      }
    }
  };

  const handleWalletAdjustment = async (e) => {
    e.preventDefault();
    const amount = parseFloat(walletAmount);
    if (!amount || !walletDescription) {
      return toast.error("Amount and description are required.");
    }
    const result = await adjustWallet(userId, amount, walletDescription);
    if (result) {
      toast.success("Wallet adjusted successfully!");
      setWalletAmount("");
      setWalletDescription("");
      refetchWithCurrentFilters();
    }
  };

  const handleDeleteUser = async () => {
    if (
      window.confirm(
        "This action is irreversible. Are you sure you want to delete this user?"
      )
    ) {
      const result = await deleteUser(userId);
      if (result) {
        toast.success("User deleted successfully.");
        navigate("/admin/users");
      }
    }
  };

  if (loading && !userData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

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
      <h1 className="text-3xl font-bold mb-6">User Details</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <Card className="xl:col-span-2">
          <div className="flex items-center space-x-6">
            <img
              src={
                user.profilePicture ||
                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              {onlineStatus && (
                <OnlineStatusBadge
                  isOnline={onlineStatus.isOnline}
                  lastSeen={onlineStatus.lastSeen}
                />
              )}
              <p className="text-gray-500">@{user.username}</p>
              <p className="text-sm">{user.email}</p>
              <p className="text-sm">State: {user.state || "N/A"}</p>
              <p className="text-sm">Joined: {formatDate(user.createdAt)}</p>
              <p className="mt-2 text-xl font-bold">
                Balance: {formatCurrency(user.walletBalance)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-4">Admin Actions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Change Role</h4>
              <Button
                onClick={handleRoleChange}
                loading={roleLoading}
                className="w-full justify-center"
              >
                <FaShieldAlt className="mr-2" />
                {user.role === "admin" ? "Demote to User" : "Promote to Admin"}
              </Button>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Adjust Wallet</h4>
              <form onSubmit={handleWalletAdjustment} className="space-y-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount (+/-)"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Reason/Description"
                  value={walletDescription}
                  onChange={(e) => setWalletDescription(e.target.value)}
                />
                <Button
                  type="submit"
                  loading={walletLoading}
                  variant="secondary"
                  className="w-full justify-center"
                >
                  Adjust Balance
                </Button>
              </form>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Delete User</h4>
              <Button
                onClick={handleDeleteUser}
                loading={deleteLoading}
                variant="danger"
                className="w-full justify-center"
              >
                <FaTrashAlt className="mr-2" /> Delete This User
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-8 flex flex-wrap items-end gap-4">
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
