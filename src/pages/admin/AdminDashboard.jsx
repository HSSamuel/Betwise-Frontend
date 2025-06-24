import React, { useEffect, useState, useRef } from "react";
import { useApi } from "../../hooks/useApi";
import {
  getPlatformStats,
  getFinancialDashboard,
  manualGameSync,
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
  FaChevronDown,
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
  // FIX: Pass an option to the useApi hook to prevent it from showing its own error toast,
  // as toast.promise will be handling it.
  const { loading: syncLoading, request: runSync } = useApi(manualGameSync, {
    showToastOnError: false,
  });

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchStats();
    fetchFinancials();
  }, [fetchStats, fetchFinancials]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSync = (source) => {
    setDropdownOpen(false); // Close dropdown on action

    const syncPromise = runSync({ source });

    toast.promise(
      syncPromise,
      {
        loading: `Syncing games from ${source}...`,
        success: (data) => {
          fetchStats(); // Refetch stats on success
          return data?.msg || `Successfully synced from ${source}!`;
        },
        error: (err) => {
          // This will now correctly display the 400 error message from the backend.
          const message = err.response?.data?.msg || "Sync failed.";
          return `Error: ${message}`;
        },
      },
      {
        style: {
          minWidth: "250px",
        },
        success: {
          duration: 4000,
          icon: "✅",
        },
        error: {
          duration: 6000,
          icon: "❌",
        },
      }
    );
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
              Fetch the latest upcoming games from an external sports API.
            </p>
          </div>

          <div
            ref={dropdownRef}
            className="relative inline-flex rounded-md shadow-sm"
          >
            <Button
              onClick={() => handleSync("apifootball")}
              loading={syncLoading}
              disabled={syncLoading}
              className="!rounded-r-none"
            >
              <FaSync className={syncLoading ? "animate-spin mr-2" : "mr-2"} />
              Sync from API-Football
            </Button>
            <button
              type="button"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              disabled={syncLoading}
              className="relative inline-flex items-center px-2 py-2 bg-green-700 text-white rounded-r-md hover:bg-green-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <FaChevronDown className="h-5 w-5" />
            </button>

            {isDropdownOpen && (
              <div
                className="origin-top-right absolute right-0 mt-12 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-1" role="none">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSync("thesportsdb");
                    }}
                    className="text-gray-700 dark:text-gray-200 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                  >
                    Sync from TheSportsDB
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSync("allsportsapi");
                    }}
                    className="text-gray-700 dark:text-gray-200 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                  >
                    Sync from AllSportsApi
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
