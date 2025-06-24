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
  const { socket } = useSocket(); // --- Correction: Destructure the socket object ---
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isResultModalOpen, setResultModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const refetchGames = () => {
    fetchGames({ limit: 100, sortBy: "matchDate", order: "desc" });
  };

  useEffect(() => {
    refetchGames();
  }, []);

  useEffect(() => {
    if (data?.games) {
      setGames(data.games);
    }
  }, [data]);

  useEffect(() => {
    if (!socket) return;

    const handleGameUpdate = (updatedGame) => {
      setGames((prevGames) => {
        const index = prevGames.findIndex((g) => g._id === updatedGame._id);

        if (index === -1 && updatedGame.status === "upcoming") {
          return [updatedGame, ...prevGames];
        }

        const newGames = [...prevGames];
        if (
          updatedGame.status === "cancelled" ||
          updatedGame.status === "finished"
        ) {
          return newGames.filter((g) => g._id !== updatedGame._id);
        } else if (index > -1) {
          newGames[index] = updatedGame;
          return newGames;
        }
        return prevGames;
      });
    };

    socket.on("gameUpdate", handleGameUpdate); // This line will now work correctly

    return () => {
      socket.off("gameUpdate", handleGameUpdate);
    };
  }, [socket]);

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

              <div className="flex items-center my-2">
                <img
                  src={game.homeTeamLogo || "/default-logo.png"}
                  alt={game.homeTeam}
                  className="w-8 h-8 mr-3"
                />
                <h3 className="text-lg font-bold">{game.homeTeam}</h3>
              </div>
              <div className="flex items-center my-2">
                <img
                  src={game.awayTeamLogo || "/default-logo.png"}
                  alt={game.awayTeam}
                  className="w-8 h-8 mr-3"
                />
                <h3 className="text-lg font-bold">{game.awayTeam}</h3>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                {formatDate(game.matchDate)}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end space-x-2">
              {game.status === "upcoming" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openResultModal(game)}
                  >
                    <FaCheckCircle className="mr-2" />
                    Set Result
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
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
