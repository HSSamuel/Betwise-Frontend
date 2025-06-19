import React, { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import OddsDisplay from "./OddsDisplay";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { useApi } from "../../hooks/useApi";
import { analyzeGame } from "../../services/aiService";
import { FaBrain } from "react-icons/fa";

// A new component to render the score or VS
const MatchCenter = ({ game }) => {
  if (game.status === "live") {
    return (
      <div className="text-center">
        <div className="text-3xl font-bold text-green-500">
          {game.scores.home} - {game.scores.away}
        </div>
        {/* FIX: Add pulsing animation for live time */}
        <div className="text-xs text-red-500 animate-pulse font-semibold">
          {game.elapsedTime}' LIVE
        </div>
      </div>
    );
  }
  if (game.status === "finished") {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-500 dark:text-gray-300">
          {game.scores.home ?? "F"} - {game.scores.away ?? "T"}
        </div>
        <div className="text-xs text-gray-400">Final</div>
      </div>
    );
  }
  return <div className="text-2xl font-bold text-gray-400 mx-4">VS</div>;
};

const GameCard = ({ game }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { data, loading, error, request: fetchAnalysis } = useApi(analyzeGame);

  const handleAnalysisClick = () => {
    fetchAnalysis(game._id);
    setModalOpen(true);
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={`AI Analysis: ${game.homeTeam} vs ${game.awayTeam}`}
      >
        {loading && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}
        {data && (
          <p className="text-gray-600 dark:text-gray-300">{data.analysis}</p>
        )}
      </Modal>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {game.league}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(game.matchDate)}
          </span>
        </div>
        <div className="flex items-center justify-around text-center my-4">
          <div className="flex-1 flex flex-col items-center">
            <img
              src={game.homeTeamLogo || "/default-logo.png"}
              alt={game.homeTeam}
              className="w-12 h-12 mb-2"
            />
            <span className="font-bold text-lg">{game.homeTeam}</span>
          </div>
          <MatchCenter game={game} />
          <div className="flex-1 flex flex-col items-center">
            <img
              src={game.awayTeamLogo || "/default-logo.png"}
              alt={game.awayTeam}
              className="w-12 h-12 mb-2"
            />
            <span className="font-bold text-lg">{game.awayTeam}</span>
          </div>
        </div>
        {game.status === "upcoming" && (
          <div className="flex justify-between items-center mt-4 border-t pt-4 dark:border-gray-700">
            <OddsDisplay game={game} />
            <Button
              variant="outline"
              onClick={handleAnalysisClick}
              className="ml-2 !p-2"
              title="Get AI Analysis"
            >
              <FaBrain size={20} />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default GameCard;
