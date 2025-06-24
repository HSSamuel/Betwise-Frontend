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
import { formatDate } from "../../utils/formatDate";
import {
  FaUser,
  FaHistory,
  FaTicketAlt,
  FaArrowUp,
  FaArrowDown,
  FaTrashAlt,
  FaShieldAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

const AdminUserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

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
    setData: setUserData,
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

  const refetchDetails = useCallback(() => {
    if (userId) {
      const params = { ...filters };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);
      fetchDetails(userId, params);
    }
  }, [userId, filters, fetchDetails]);

  useEffect(() => {
    refetchDetails();
  }, [userId]); // Refetch when ID changes

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [name]: e.target.value }));
  };

  useEffect(() => {
    refetchDetails();
  }, [filters.txType, filters.betStatus]); // Refetch only when these filters change

  const handleRoleChange = async () => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (
      window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      const result = await changeRole(userId, newRole);
      if (result) {
        toast.success("User role updated successfully!");
        refetchDetails();
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
      refetchDetails();
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
      <h1 className="text-3xl font-bold mb-6">User Details</h1>

      {/* -- NEW Profile and Actions Layout -- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <Card className="xl:col-span-2">
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-6">
            <img
              src={
                user.profilePicture ||
                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4 sm:mb-0"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
                <span
                  className={`ml-3 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === "admin"
                      ? "bg-purple-200 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role}
                </span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                @{user.username}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {user.email}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                State: {user.state || "N/A"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Joined: {formatDate(user.createdAt)}
              </p>
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

      {/* -- Existing History Tables -- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaHistory className="mr-3" />
            Transaction History
          </h2>
          {/* ... transaction table JSX remains here ... */}
        </Card>
        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaTicketAlt className="mr-3" />
            Bet History
          </h2>
          {/* ... bet history table JSX remains here ... */}
        </Card>
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
