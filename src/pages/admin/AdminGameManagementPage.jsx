import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { getGames, cancelGame } from "../../services/gameService";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import CreateGameModal from "../../components/admin/CreateGameModal";
import SetResultModal from "../../components/admin/SetResultModal";
import { FaPlus, FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import { useSocket } from "../../contexts/SocketContext";

// This component for the status badge is correct and needs no changes.
const StatusBadge = ({ status }) => {
  const badgeStyles = {
    upcoming:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    live: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse",
    finished: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    cancelled:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        badgeStyles[status] || badgeStyles.finished
      }`}
    >
      {status}
    </span>
  );
};

const AdminGameManagementPage = () => {
  const { data, loading, error, request: fetchGames } = useApi(getGames);
  const [games, setGames] = useState([]);
  const socket = useSocket();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isResultModalOpen, setResultModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    fetchGames({ limit: 100, sortBy: "matchDate", order: "desc" });
  }, [fetchGames]);

  useEffect(() => {
    if (data?.games) {
      setGames(data.games);
    }
  }, [data]);

  // FIX: This useEffect now correctly handles adding, updating, and removing games.
  useEffect(() => {
    if (!socket) return;

    const handleGameUpdate = (updatedGame) => {
      setGames((prevGames) => {
        const index = prevGames.findIndex((g) => g._id === updatedGame._id);

        // Game is not in the list yet
        if (index === -1) {
          // Add it to the list (typically would be a new 'live' game)
          return [updatedGame, ...prevGames];
        }

        // Game is already in the list, so update or remove it
        const newGames = [...prevGames];

        // If the game is no longer upcoming or live, remove it from the admin view
        if (
          updatedGame.status === "finished" ||
          updatedGame.status === "cancelled"
        ) {
          return newGames.filter((g) => g._id !== updatedGame._id);
        } else {
          // Otherwise, update the game in place
          newGames[index] = updatedGame;
          return newGames;
        }
      });
    };

    socket.on("gameUpdate", handleGameUpdate);

    return () => {
      socket.off("gameUpdate", handleGameUpdate);
    };
  }, [socket]);

  const refetchGames = () =>
    fetchGames({ limit: 100, sortBy: "matchDate", order: "desc" });

  const handleCancelGame = async (gameId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this game? All pending bets will be refunded."
      )
    ) {
      try {
        await cancelGame(gameId);
        toast.success("Game cancelled successfully.");
        refetchGames();
      } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to cancel game.");
      }
    }
  };

  const openResultModal = (game) => {
    setSelectedGame(game);
    setResultModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Game Management</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          <FaPlus className="mr-2" />
          Create Game
        </Button>
      </div>

      <CreateGameModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onGameCreated={refetchGames}
      />
      <SetResultModal
        isOpen={isResultModalOpen}
        onClose={() => setResultModalOpen(false)}
        onResultSubmitted={refetchGames}
        game={selectedGame}
      />

      {loading && <Spinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game._id} className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {game.league}
                </span>
                <StatusBadge status={game.status} />
              </div>

              {game.status === "live" && game.scores ? (
                <div className="my-2 text-center">
                  <p className="text-2xl font-bold">
                    {game.homeTeam}{" "}
                    <span className="text-red-500">{game.scores.home}</span>
                  </p>
                  <p className="text-2xl font-bold">
                    {game.awayTeam}{" "}
                    <span className="text-red-500">{game.scores.away}</span>
                  </p>
                  <p className="text-xs text-red-500 animate-pulse">
                    {game.elapsedTime}'
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold mb-1">{game.homeTeam}</h3>
                  <h3 className="text-lg font-bold mb-2">vs {game.awayTeam}</h3>
                </>
              )}

              <p className="text-xs text-gray-400 mb-4">
                {formatDate(game.matchDate)}
              </p>
              {game.result && (
                <p className="font-bold text-sm">Result: {game.result}</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end space-x-2">
              {game.status === "upcoming" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => openResultModal(game)}
                  >
                    <FaCheckCircle className="mr-2" />
                    Set Result
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleCancelGame(game._id)}
                  >
                    <FaTrashAlt className="mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminGameManagementPage;
