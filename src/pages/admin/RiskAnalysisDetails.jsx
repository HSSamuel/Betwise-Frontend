import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { getGameRiskAnalysis } from "../../services/adminService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { FaBrain } from "react-icons/fa";

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

export default RiskAnalysisDetails;
