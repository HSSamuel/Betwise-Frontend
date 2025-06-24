import React, { useState, useEffect, useCallback } from "react";
import { useApi } from "../../hooks/useApi";
import {
  getTopWinnersLeaderboard,
  getHighestOddsLeaderboard,
} from "../../services/leaderboardService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import Tabs from "../../components/ui/Tabs";
import { FaTrophy, FaChartLine } from "react-icons/fa";
import { formatCurrency } from "../../utils/helpers";

const LeaderboardTable = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <FaTrophy size={40} className="mx-auto mb-2" />
        <p>No data available for this leaderboard yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
              Rank
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
          {data.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap font-bold">
                {index + 1}
              </td>
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("winners");
  const [timePeriod, setTimePeriod] = useState("all-time");

  const {
    data: winnersData,
    loading: winnersLoading,
    request: fetchWinners,
  } = useApi(getTopWinnersLeaderboard);
  const {
    data: oddsData,
    loading: oddsLoading,
    request: fetchHighestOdds,
  } = useApi(getHighestOddsLeaderboard);

  useEffect(() => {
    if (activeTab === "winners") {
      fetchWinners(timePeriod);
    } else if (activeTab === "odds") {
      fetchHighestOdds();
    }
  }, [activeTab, timePeriod, fetchWinners, fetchHighestOdds]);

  const isLoading = winnersLoading || oddsLoading;

  const tabs = [
    { name: "winners", label: "Top Winners" },
    { name: "odds", label: "Highest Odds" },
  ];

  const winnerColumns = [
    {
      key: "username",
      header: "User",
      render: (item) => item.userDetails.username,
    },
    {
      key: "netProfit",
      header: "Net Profit",
      render: (item) => formatCurrency(item.netProfit),
    },
  ];

  const oddsColumns = [
    { key: "username", header: "User" },
    {
      key: "odds",
      header: "Odds Won",
      render: (item) => `${item.odds.toFixed(2)}x`,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Leaderboards</h1>
      <div className="flex justify-between items-center mb-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
        {activeTab === "winners" && (
          <select
            onChange={(e) => setTimePeriod(e.target.value)}
            value={timePeriod}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all-time">All-Time</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        )}
      </div>
      <Card>
        {isLoading ? (
          <Spinner />
        ) : activeTab === "winners" ? (
          <LeaderboardTable
            data={winnersData?.leaderboard}
            columns={winnerColumns}
          />
        ) : (
          <LeaderboardTable
            data={oddsData?.leaderboard}
            columns={oddsColumns}
          />
        )}
      </Card>
    </div>
  );
};

export default LeaderboardPage;
