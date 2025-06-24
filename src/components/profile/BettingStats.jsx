import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { getUserStats, getUserStatsHistory } from "../../services/userService";
import Spinner from "../ui/Spinner";
import { FaChartBar, FaPlus, FaMinus, FaPercentage } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatItem = ({ label, value, icon, colorClass }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
    <div
      className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}
    >
      {icon}
    </div>
    <p className="mt-2 text-2xl font-bold">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

const BettingStats = () => {
  const {
    data: stats,
    loading: statsLoading,
    request: fetchStats,
  } = useApi(getUserStats);
  const {
    data: history,
    loading: historyLoading,
    request: fetchHistory,
  } = useApi(getUserStatsHistory);

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, [fetchStats, fetchHistory]);

  if (statsLoading || historyLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  if (!stats || !history) return null;

  const netProfitColor =
    stats.netProfit >= 0 ? "text-green-500" : "text-red-500";

  const chartData = {
    labels: history.history.map((h) => new Date(h.date).toLocaleDateString()),
    datasets: [
      {
        label: "Net Profit/Loss",
        data: history.history.map((h) => h.netProfit),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <FaChartBar className="mr-3 text-indigo-500" />
        Your Betting Stats (Last 30 Days)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatItem
          label="Bets Won"
          value={stats.betsWon}
          icon={<FaPlus size={20} className="text-white" />}
          colorClass="bg-green-500"
        />
        <StatItem
          label="Bets Lost"
          value={stats.betsLost}
          icon={<FaMinus size={20} className="text-white" />}
          colorClass="bg-red-500"
        />
        <StatItem
          label="Win Rate"
          value={`${stats.winRate}%`}
          icon={<FaPercentage size={20} className="text-white" />}
          colorClass="bg-blue-500"
        />
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
          <p className={`text-3xl font-bold ${netProfitColor}`}>
            {stats.netProfit >= 0 ? `+` : ``}${formatCurrency(stats.netProfit)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Net Profit</p>
        </div>
      </div>
      <div>
        <Line data={chartData} />
      </div>
    </div>
  );
};

// Helper for currency formatting
function formatCurrency(amount) {
  return "$" + amount.toFixed(2);
}

export default BettingStats;
