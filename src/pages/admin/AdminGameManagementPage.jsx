import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  FaSearch,
} from "react-icons/fa";
import { useSocket } from "../../contexts/SocketContext";
import { useDebounce } from "../../hooks/useDebounce";

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
  const [filters, setFilters] = useState({ search: "" });
  const debouncedSearchTerm = useDebounce(filters.search, 300);
  const { data, loading, error, request: fetchGames } = useApi(getGames);
  const { socket } = useSocket();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isResultModalOpen, setResultModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isSocialModalOpen, setSocialModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const refetchGames = useCallback(() => {
    // FIX: Changed limit from 500 to 100 to match backend validation.
    fetchGames({ limit: 100 });
  }, [fetchGames]);

  useEffect(() => {
    refetchGames();
  }, [refetchGames]);

  useEffect(() => {
    if (!socket) return;
    const handleRealtimeUpdate = () => {
      refetchGames();
    };
    socket.on("gameUpdate", handleRealtimeUpdate);
    socket.on("new_game", handleRealtimeUpdate);
    return () => {
      socket.off("gameUpdate", handleRealtimeUpdate);
      socket.off("new_game", handleRealtimeUpdate);
    };
  }, [socket, refetchGames]);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

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

  const sortedAndFilteredGames = useMemo(() => {
    if (!data?.games) return [];

    const statusOrder = {
      live: 1,
      upcoming: 2,
      finished: 3,
      cancelled: 4,
    };

    const filtered = data.games.filter((game) => {
      const searchTerm = debouncedSearchTerm.toLowerCase();
      return (
        game.homeTeam.toLowerCase().includes(searchTerm) ||
        game.awayTeam.toLowerCase().includes(searchTerm) ||
        game.league.toLowerCase().includes(searchTerm)
      );
    });

    return filtered.sort((a, b) => {
      const statusA = statusOrder[a.status] || 99;
      const statusB = statusOrder[b.status] || 99;
      if (statusA !== statusB) {
        return statusA - statusB;
      }
      return new Date(b.matchDate) - new Date(a.matchDate);
    });
  }, [data, debouncedSearchTerm]);

  const openResultModal = (game) => {
    setSelectedGame(game);
    setResultModalOpen(true);
  };

  const openSocialModal = (game) => {
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

      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by team name or league..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full max-w-lg p-3 pl-12 border rounded-full dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-green-500 transition"
          />
        </div>
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

      {loading && !data && <Spinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedAndFilteredGames.map((game) => (
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
