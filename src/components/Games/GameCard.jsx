import React, { useState, useEffect } from "react";
import { formatDate } from "../../utils/formatDate";
import OddsDisplay from "./OddsDisplay";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { useApi } from "../../hooks/useApi";
import { analyzeGame } from "../../services/aiService";
import { FaBrain, FaExclamationCircle, FaWifi } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

// ** THIS IS THE NEW, DYNAMIC MATCH CENTER WITH A LIVE TIMER **
const MatchCenter = ({ game, isConnected }) => {
  // We now use state to manage the displayed time.
  const [displayTime, setDisplayTime] = useState(game.elapsedTime || 0);

  useEffect(() => {
    let timer;
    if (game.status === "live") {
      // Set the initial time from the game data.
      setDisplayTime(game.elapsedTime || 0);

      // This timer will increment the displayTime every 60 seconds.
      timer = setInterval(() => {
        // We use a function here to ensure we always have the latest state.
        setDisplayTime((prevTime) => prevTime + 1);
      }, 60000); // 60,000 milliseconds = 1 minute
    }

    // This is the cleanup function. It runs when the game is no longer live
    // or when the component is removed from the page. It's crucial for performance.
    return () => {
      clearInterval(timer);
    };
    // This effect depends on the game's status and its official elapsed time.
  }, [game.status, game.elapsedTime]);

  if (game.status === "live") {
    return (
      <div className="text-center">
        <div className="text-3xl font-bold text-green-500">
          {/* We now use optional chaining (?.) to prevent errors if scores are missing. */}
          {game.scores?.home ?? 0} - {game.scores?.away ?? 0}
        </div>
        <div className="text-xs text-red-500 animate-pulse font-semibold flex items-center justify-center space-x-2">
          {/* The time displayed is now from our state, which is updated by the timer. */}
          <span>{displayTime}' LIVE</span>
          {!isConnected && (
            <FaWifi
              className="text-yellow-500"
              title="Connection lost. Scores may be outdated."
            />
          )}
        </div>
      </div>
    );
  }

  if (game.status === "finished") {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-500 dark:text-gray-300">
          {game.scores?.home ?? "F"} - {game.scores?.away ?? "T"}
        </div>
        <div className="text-xs text-gray-400">Final</div>
      </div>
    );
  }
  return <div className="text-2xl font-bold text-gray-400 mx-4">VS</div>;
};

const GameCard = ({ game, isConnected, adminActions = null }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { data, loading, error, request: fetchAnalysis } = useApi(analyzeGame);
  const { user } = useAuth();

  const handleAnalysisClick = () => {
    if (!user) {
      toast.error("Login or register to view AI analysis");
      return;
    }
    fetchAnalysis({ gameId: game._id });
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
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationCircle
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        {data && data.analysis && (
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-200">
                Key Insight
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {data.analysis.keyInsight}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-200">
                Risk Level
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {data.analysis.riskLevel}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-200">
                {game.homeTeam}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {data.analysis.homeTeamAnalysis}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-200">
                {game.awayTeam}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {data.analysis.awayTeamAnalysis}
              </p>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-gray-800 dark:text-gray-200">
                Prediction
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {data.analysis.prediction}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col">
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {game.league}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(game.matchDate)}
            </span>
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] items-center text-center my-4">
            <div className="flex flex-col items-center">
              <img
                src={
                  game.homeTeamLogo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    game.homeTeam
                  )}&background=random&color=fff`
                }
                alt={game.homeTeam}
                className="w-12 h-12 mb-2 object-contain"
              />
              <span className="font-bold text-lg">{game.homeTeam}</span>
            </div>
            <MatchCenter game={game} isConnected={isConnected} />
            <div className="flex flex-col items-center">
              <img
                src={
                  game.awayTeamLogo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    game.awayTeam
                  )}&background=random&color=fff`
                }
                alt={game.awayTeam}
                className="w-12 h-12 mb-2 object-contain"
              />
              <span className="font-bold text-lg">{game.awayTeam}</span>
            </div>
          </div>
        </div>

        {game.status === "upcoming" && (
          <div className="flex justify-between items-center mt-auto pt-4 border-t dark:border-gray-700">
            <div className="flex-grow">
              <OddsDisplay game={game} />
            </div>
            <Button
              variant="outline"
              onClick={handleAnalysisClick}
              className="ml-2 !p-2 flex-shrink-0"
              title="Get AI Analysis"
            >
              <FaBrain size={20} />
            </Button>
            {adminActions && (
              <div className="flex-shrink-0 ml-2">{adminActions}</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(GameCard);
