import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import {
  getGameRiskAnalysis,
  getGameRiskSummary,
  getRiskOverview,
} from "../../services/adminService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { formatDate } from "../../utils/formatDate";
// FIX: Add missing icon imports
import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaEye,
  FaBrain,
} from "react-icons/fa";

// This is a new StatCard component, similar to the one on the main dashboard
const StatCard = ({ title, value, icon, gradient }) => (
  <div
    className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-lg text-white`}
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

// This sub-component shows the detailed risk breakdown for a selected game
const RiskAnalysisDetails = ({ game, onGetSummary }) => {
  const {
    data,
    loading,
    error,
    request: fetchRisk,
  } = useApi(getGameRiskAnalysis);

  useEffect(() => {
    if (game?._id) {
      fetchRisk(game._id);
    }
  }, [game, fetchRisk]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data?.analysis) return null;

  const { analysis } = data;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Risk Details</h3>
        <Button onClick={() => onGetSummary(game._id)} size="sm">
          <FaBrain className="mr-2" />
          Get AI Summary
        </Button>
      </div>
      <p className="mb-4">
        <span className="font-semibold">Total Exposure:</span>{" "}
        <span className="font-bold text-red-600">
          {formatCurrency(analysis.totalExposure)}
        </span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(analysis.outcomes).map(([outcome, details]) => (
          <div
            key={outcome}
            className="p-4 border rounded-lg dark:border-gray-600"
          >
            <h4 className="font-bold text-lg">
              {outcome === "A"
                ? "Home Win"
                : outcome === "B"
                ? "Away Win"
                : "Draw"}
            </h4>
            <p>
              Total Bets:{" "}
              <span className="font-semibold">{details.betCount}</span>
            </p>
            <p>
              Total Staked:{" "}
              <span className="font-semibold">
                {formatCurrency(details.totalStake)}
              </span>
            </p>
            <p>
              Potential Payout:{" "}
              <span className="font-semibold">
                {formatCurrency(details.totalPotentialPayout)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

const AdminRiskPage = () => {
  const {
    data: overview,
    loading,
    error,
    request: fetchOverview,
  } = useApi(getRiskOverview);
  const [selectedGame, setSelectedGame] = useState(null);

  // FIX: Add the missing state and hook for the AI Summary modal
  const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
  const {
    data: summaryData,
    loading: summaryLoading,
    request: fetchSummary,
  } = useApi(getGameRiskSummary);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleViewDetails = (game) => {
    setSelectedGame(game);
  };

  // FIX: Add the missing handler function to fetch and show the AI summary
  const handleGetSummary = async (gameId) => {
    await fetchSummary(gameId);
    setSummaryModalOpen(true);
  };

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <Spinner />
      </div>
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Platform Risk Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Total Platform Exposure"
          value={formatCurrency(overview?.totalExposure || 0)}
          icon={<FaShieldAlt size={28} />}
          gradient="from-blue-500 to-indigo-500"
        />
        <StatCard
          title="High-Risk Games"
          value={overview?.highRiskGamesCount || 0}
          icon={<FaExclamationTriangle size={28} />}
          gradient="from-red-500 to-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Top 5 Exposed Games</h2>
          <div className="space-y-3">
            {overview?.topExposedGames.map((item) => (
              <Card
                key={item._id}
                className="cursor-pointer hover:border-green-500 border-transparent border"
                onClick={() => handleViewDetails(item)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">
                      {item.gameDetails.homeTeam} vs {item.gameDetails.awayTeam}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.gameDetails.league}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-500">
                      {formatCurrency(item.totalPotentialPayout)}
                    </p>
                    <p className="text-xs text-gray-400">Exposure</p>
                  </div>
                </div>
              </Card>
            ))}
            {!overview?.topExposedGames.length && (
              <p className="text-gray-500">
                No significant risk exposure on any upcoming games.
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Risk Details</h2>
          {selectedGame ? (
            <RiskAnalysisDetails
              game={selectedGame}
              onGetSummary={handleGetSummary}
            />
          ) : (
            <Card className="flex flex-col items-center justify-center text-center h-full text-gray-500">
              <FaEye size={40} className="mb-4" />
              <h3 className="font-bold">Select a Game</h3>
              <p>
                Click on a game from the list to view its detailed risk
                analysis.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Add a simple modal to display the AI summary */}
      {isSummaryModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setSummaryModalOpen(false)}
        >
          <Card
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">AI Risk Summary</h3>
            {summaryLoading ? (
              <Spinner />
            ) : (
              <p className="whitespace-pre-wrap">{summaryData?.summary}</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminRiskPage;
