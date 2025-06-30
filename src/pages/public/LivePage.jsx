import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { getLiveGamesFeed } from "../../services/gameService";
import GameList from "../../components/Games/GameList";
import Spinner from "../../components/ui/Spinner";
import { FaBroadcastTower } from "react-icons/fa";

const LivePage = () => {
  const {
    data: liveGames,
    loading,
    error,
    request: fetchLiveGames,
  } = useApi(getLiveGamesFeed);

  useEffect(() => {
    fetchLiveGames();
  }, [fetchLiveGames]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center mt-10">
          <Spinner size="lg" />
        </div>
      );
    }
    if (error) {
      return <p className="text-red-500 text-center">{error}</p>;
    }
    if (liveGames?.games && liveGames.games.length > 0) {
      return <GameList games={liveGames.games} />;
    }
    return (
      <div className="text-center text-gray-500 mt-10 py-16">
        <FaBroadcastTower className="mx-auto text-4xl text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          No Live Games Currently
        </h3>
        <p className="mt-1">Check back soon for in-play action.</p>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Live In-Play Matches</h1>
      {renderContent()}
    </div>
  );
};

export default LivePage;
