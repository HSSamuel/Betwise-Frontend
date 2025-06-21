import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import {
  getRiskOverview,
  getGameRiskAnalysis,
  getGameRiskSummary,
} from "../../services/adminService";
import { cancelGame } from "../../services/gameService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import StatCard from "../../components/admin/StatCard";
import AdjustOddsModal from "../../components/admin/AdjustOddsModal";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/helpers";
import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaEye,
  FaBrain,
  FaWrench,
  FaTrashAlt,
} from "react-icons/fa";

// --- START: RiskAnalysisDetails component is now integrated directly ---
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

  if (!game) return null;
  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data?.analysis) return null;

  const { analysis } = data;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Risk Breakdown</h3>
        <Button
          onClick={() => onGetSummary(game._id)}
          size="sm"
          variant="outline"
        >
          <FaBrain className="mr-2" />
          Get AI Summary
        </Button>
      </div>
      <p className="mb-4">
        <span className="font-semibold">Total Game Exposure:</span>{" "}
        <span className="font-bold text-red-600">
          {formatCurrency(analysis.totalExposure)}
        </span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(analysis.outcomes).map(([outcome, details]) => (
          <div
            key={outcome}
            className="p-4 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50"
          >
            <h4 className="font-bold text-lg">
              {outcome === "A"
                ? game.gameDetails.homeTeam
                : outcome === "B"
                ? game.gameDetails.awayTeam
                : "Draw"}
            </h4>
            <div className="mt-2 space-y-1 text-sm">
              <p className="flex justify-between">
                <span>Total Bets:</span>
                <span className="font-semibold">{details.betCount}</span>
              </p>
              <p className="flex justify-between">
                <span>Total Staked:</span>
                <span className="font-semibold">
                  {formatCurrency(details.totalStake)}
                </span>
              </p>
              <p className="flex justify-between">
                <span>Exposure:</span>
                <span className="font-semibold text-red-500">
                  {formatCurrency(details.totalPotentialPayout)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
// --- END: RiskAnalysisDetails component integration ---

const AdminRiskPage = () => {
  const {
    data: overview,
    loading,
    request: fetchOverview,
  } = useApi(getRiskOverview);
  const { loading: cancelling, request: runCancelGame } = useApi(cancelGame);

  const [selectedGame, setSelectedGame] = useState(null);
  const [isOddsModalOpen, setOddsModalOpen] = useState(false);
  const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);

  const {
    data: summaryData,
    loading: summaryLoading,
    request: fetchSummary,
  } = useApi(getGameRiskSummary);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleOpenOddsModal = (game) => {
    setSelectedGame(game);
    setOddsModalOpen(true);
  };

  const handleViewDetails = (game) => {
    setSelectedGame(game);
  };

  const handleCancelGame = async (gameId, gameName) => {
    if (
      window.confirm(
        `Are you sure you want to cancel the game: ${gameName}? All bets will be refunded.`
      )
    ) {
      const result = await runCancelGame(gameId);
      if (result) {
        toast.success("Game successfully cancelled and bets refunded.");
        fetchOverview();
        setSelectedGame(null);
      }
    }
  };

  const handleGetSummary = async (gameId) => {
    const result = await fetchSummary(gameId);
    if (result) {
      setSummaryModalOpen(true);
    }
  };

  const handleOddsAdjusted = () => {
    fetchOverview();
    if (selectedGame) {
      handleViewDetails(selectedGame);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <AdjustOddsModal
        isOpen={isOddsModalOpen}
        onClose={() => setOddsModalOpen(false)}
        game={selectedGame}
        onOddsAdjusted={handleOddsAdjusted}
      />
      <Modal
        isOpen={isSummaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        title="AI Risk Summary"
      >
        {summaryLoading ? (
          <Spinner />
        ) : (
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
            {summaryData?.summary}
          </p>
        )}
      </Modal>

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
          <h2 className="text-xl font-semibold mb-4">High-Exposure Games</h2>
          <div className="space-y-3">
            {overview?.topExposedGames.length > 0 ? (
              overview.topExposedGames.map((item) => (
                <Card key={item._id} className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">
                          {item.gameDetails.homeTeam} vs{" "}
                          {item.gameDetails.awayTeam}
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
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 flex justify-end space-x-2 rounded-b-lg">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(item)}
                    >
                      <FaEye className="mr-2" /> View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenOddsModal(item)}
                    >
                      <FaWrench className="mr-2" /> Adjust Odds
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        handleCancelGame(
                          item._id,
                          `${item.gameDetails.homeTeam} vs ${item.gameDetails.awayTeam}`
                        )
                      }
                      loading={cancelling}
                    >
                      <FaTrashAlt className="mr-2" /> Cancel
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
                <FaShieldAlt size={40} className="mb-4 text-green-500" />
                <h3 className="font-bold text-lg">No Exposed Games</h3>
                <p>
                  There are currently no games with significant risk exposure.
                </p>
              </Card>
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
            <Card className="flex flex-col items-center justify-center text-center h-full text-gray-500 min-h-[200px]">
              <FaEye size={40} className="mb-4" />
              <h3 className="font-bold text-lg">Select a Game</h3>
              <p>
                Click "View Details" on a game from the list to see its detailed
                risk analysis.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRiskPage;
