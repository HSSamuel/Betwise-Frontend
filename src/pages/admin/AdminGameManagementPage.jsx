import React, { useEffect, useState, useCallback } from "react";
import { useApi } from "../../hooks/useApi";
import { getGames, cancelGame } from "../../services/gameService";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import CreateGameModal from "../../components/admin/CreateGameModal";
import SetResultModal from "../../components/admin/SetResultModal";
import SocialPostGeneratorModal from "../../components/admin/SocialPostGeneratorModal";
import EditGameModal from "../../components/admin/EditGameModal";
import {
  FaPlus,
  FaCheckCircle,
  FaTrashAlt,
  FaBullhorn,
  FaEdit,
} from "react-icons/fa";
import { useSocket } from "../../contexts/SocketContext";

// This is a presentational component, so it can stay as is.
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
  // We get everything needed directly from our robust useApi hook.
  // We no longer need a separate 'games' state.
  const { data, loading, error, request: fetchGames } = useApi(getGames);
  const { socket } = useSocket();

  // State for managing modals remains the same.
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isResultModalOpen, setResultModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isSocialModalOpen, setSocialModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // A single, stable function to refetch all games.
  const refetchGames = useCallback(() => {
    fetchGames({ limit: 100, sortBy: "matchDate", order: "desc" });
  }, [fetchGames]);

  // Initial data fetch when the component first loads.
  useEffect(() => {
    refetchGames();
  }, [refetchGames]);

  // This single, simple useEffect handles all real-time updates.
  useEffect(() => {
    if (!socket) return;

    // Any game-related update from the server will trigger a fresh data fetch.
    const handleRealtimeUpdate = () => {
      refetchGames();
    };

    socket.on("gameUpdate", handleRealtimeUpdate);
    socket.on("new_game", handleRealtimeUpdate); // Listen for new games as well

    return () => {
      socket.off("gameUpdate", handleRealtimeUpdate);
      socket.off("new_game", handleRealtimeUpdate);
    };
  }, [socket, refetchGames]);

  const handleCancelGame = async (gameId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this game? All pending bets will be refunded."
      )
    ) {
      try {
        await cancelGame(gameId);
        toast.success("Game cancelled successfully.");
        refetchGames(); // Refetch to show the change.
      } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to cancel game.");
      }
    }
  };

  // Modal opening functions remain the same.
  const openResultModal = (game) => {
    setSelectedGame(game);
    setResultModalOpen(true);
  };

  const openSocialModal = (game) => {
    // Note: The original code set `gameForSocial`, but the modal uses `game`.
    // I've kept it as `setSelectedGame` for consistency.
    setSelectedGame(game);
    setSocialModalOpen(true);
  };

  const openEditModal = (game) => {
    setSelectedGame(game);
    setEditModalOpen(true);
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
      <SocialPostGeneratorModal
        isOpen={isSocialModalOpen}
        onClose={() => setSocialModalOpen(false)}
        game={selectedGame}
      />
      <EditGameModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onGameUpdated={refetchGames}
        game={selectedGame}
      />

      {loading && <Spinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* We render DIRECTLY from the 'data' object from our hook. */}
        {data?.games?.map((game) => (
          <Card key={game._id} className="!p-4">
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
                  {game.league}
                </span>
                <StatusBadge status={game.status} />
              </div>

              <div className="flex items-center my-1">
                <img
                  src={
                    game.homeTeamLogo ||
                    `https://ui-avatars.com/api/?name=${game.homeTeam}`
                  }
                  alt={game.homeTeam}
                  className="w-6 h-6 mr-2 rounded-full object-cover"
                />
                <h3 className="text-base font-bold truncate">
                  {game.homeTeam}
                </h3>
              </div>
              <div className="flex items-center my-1">
                <img
                  src={
                    game.awayTeamLogo ||
                    `https://ui-avatars.com/api/?name=${game.awayTeam}`
                  }
                  alt={game.awayTeam}
                  className="w-6 h-6 mr-2 rounded-full object-cover"
                />
                <h3 className="text-base font-bold truncate">
                  {game.awayTeam}
                </h3>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                {formatDate(game.matchDate)}
              </p>
            </div>

            <div className="mt-auto pt-3 border-t dark:border-gray-700 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal(game)}
                title="Edit Game"
                className="!p-2"
              >
                <FaEdit />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openSocialModal(game)}
                title="Generate Social Post"
                className="!p-2"
              >
                <FaBullhorn />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openResultModal(game)}
                title="Set Result"
                className="!p-2"
              >
                <FaCheckCircle />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleCancelGame(game._id)}
                title="Cancel Game"
                className="!p-2"
              >
                <FaTrashAlt />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminGameManagementPage;
