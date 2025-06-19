import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import {
  getPlatformStats,
  getFinancialDashboard,
  manualGameSync, // Import the new service function
} from "../../services/adminService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaGamepad,
  FaFileInvoiceDollar,
  FaChartLine,
  FaDollarSign,
  FaPiggyBank,
  FaSync,
} from "react-icons/fa";
import { formatCurrency } from "../../utils/helpers";

const StatCard = ({ title, value, icon, gradient }) => (
  <div
    className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300 ease-in-out`}
  >
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <p className="text-lg font-medium opacity-90">{title}</p>
        <p className="text-4xl font-bold tracking-tight">{value}</p>
      </div>
      <div className="p-3 bg-white bg-opacity-30 rounded-lg">{icon}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const {
    data: stats,
    loading: statsLoading,
    request: fetchStats,
  } = useApi(getPlatformStats);
  const {
    data: financials,
    loading: financialsLoading,
    request: fetchFinancials,
  } = useApi(getFinancialDashboard);

  // FIX: Add the missing useApi hook for the manual sync functionality.
  const { loading: syncLoading, request: runSync } = useApi(manualGameSync);

  useEffect(() => {
    fetchStats();
    fetchFinancials();
  }, [fetchStats, fetchFinancials]);

  const handleSync = async () => {
    toast.loading("Starting game synchronization...");
    const result = await runSync();
    toast.dismiss(); // Dismiss the loading toast
    if (result) {
      toast.success(result.msg || "Game synchronization completed!");
      // Optionally, refetch platform stats to see updated game counts
      fetchStats();
    }
  };

  if (statsLoading || financialsLoading) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers}
          icon={<FaUsers size={28} />}
          gradient="from-blue-500 to-indigo-500"
        />
        <StatCard
          title="Total Bets"
          value={stats?.totalBets}
          icon={<FaFileInvoiceDollar size={28} />}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          title="Active Games"
          value={stats?.totalGames}
          icon={<FaGamepad size={28} />}
          gradient="from-green-500 to-teal-500"
        />
        <StatCard
          title="Upcoming Games"
          value={stats?.upcomingGames}
          icon={<FaChartLine size={28} />}
          gradient="from-orange-500 to-yellow-500"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Financial Snapshot</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Stakes"
          value={formatCurrency(financials?.totalStakes.amount)}
          icon={<FaDollarSign size={28} />}
          gradient="from-yellow-600 to-yellow-400"
        />
        <StatCard
          title="Total Payouts"
          value={formatCurrency(financials?.totalPayoutsToUsers.amount)}
          icon={<FaPiggyBank size={28} />}
          gradient="from-red-600 to-red-400"
        />
        <StatCard
          title="Platform Revenue"
          value={formatCurrency(financials?.platformRevenue.amount)}
          icon={<FaDollarSign size={28} />}
          gradient="from-green-600 to-green-400"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">System Actions</h2>
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold">Manual Game Sync</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fetch the latest upcoming games from the external sports API.
            </p>
          </div>
          <Button
            onClick={handleSync}
            loading={syncLoading}
            disabled={syncLoading}
          >
            <FaSync className={syncLoading ? "animate-spin mr-2" : "mr-2"} />
            Sync Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
