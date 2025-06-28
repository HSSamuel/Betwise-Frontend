import { useState, useCallback, useEffect } from "react";
import { useApi } from "./useApi";
import { getGames, getLiveGamesFeed } from "../services/gameService";
import { useSocket } from "../contexts/SocketContext";

export const useGameFeeds = () => {
  const { socket } = useSocket();
  const [games, setGames] = useState({
    upcoming: [],
    live: [],
    finished: [],
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  const {
    data: upcomingData,
    loading: upcomingLoading,
    request: fetchUpcoming,
  } = useApi(getGames);
  const {
    data: liveData,
    loading: liveLoading,
    request: fetchLive,
  } = useApi(getLiveGamesFeed);
  const {
    data: finishedData,
    loading: finishedLoading,
    request: fetchFinished,
  } = useApi(getGames);

  const isLoading = upcomingLoading || liveLoading || finishedLoading;

  const fetchAll = useCallback(() => {
    fetchUpcoming({ status: "upcoming", limit: 100 });
    fetchLive();
    fetchFinished({ status: "finished", limit: 50, order: "desc" });
  }, [fetchUpcoming, fetchLive, fetchFinished]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Update state from initial API calls
  useEffect(
    () =>
      setGames((prev) => ({ ...prev, upcoming: upcomingData?.games || [] })),
    [upcomingData]
  );
  useEffect(
    () => setGames((prev) => ({ ...prev, live: liveData?.games || [] })),
    [liveData]
  );
  useEffect(
    () =>
      setGames((prev) => ({ ...prev, finished: finishedData?.games || [] })),
    [finishedData]
  );

  // This single useEffect now manages all live game state via WebSockets
  useEffect(() => {
    if (!socket) return;

    const handleGameUpdate = (updatedGame) => {
      setGames((prev) => {
        // Remove the game from any list it might be in
        const newUpcoming = prev.upcoming.filter(
          (g) => g._id !== updatedGame._id
        );
        let newLive = prev.live.filter((g) => g._id !== updatedGame._id);
        const newFinished = prev.finished.filter(
          (g) => g._id !== updatedGame._id
        );

        // Add the game to the correct new list
        if (updatedGame.status === "live") {
          const gameExistsInLive = prev.live.some(
            (g) => g._id === updatedGame._id
          );
          if (gameExistsInLive) {
            newLive = prev.live.map((g) =>
              g._id === updatedGame._id ? updatedGame : g
            );
          } else {
            newLive.unshift(updatedGame);
          }
        } else if (updatedGame.status === "finished") {
          newFinished.unshift(updatedGame);
        }

        return {
          ...prev,
          upcoming: newUpcoming,
          live: newLive,
          finished: newFinished,
        };
      });
      setLastUpdated(new Date());
    };

    // ** This function was already present, but now we also listen for the "liveOddsUpdate" event **
    const handleOddsUpdate = (data) => {
      const { gameId, odds } = data;
      setGames((prevGames) => {
        const newGames = { ...prevGames };
        for (const status in newGames) {
          if (Array.isArray(newGames[status])) {
            newGames[status] = newGames[status].map((game) =>
              game._id === gameId ? { ...game, odds: odds } : game
            );
          }
        }
        return newGames;
      });
    };

    socket.on("gameUpdate", handleGameUpdate);
    // ** FIX: Listen for both "oddsUpdate" (from admin manual changes) and "liveOddsUpdate" (from AI) **
    socket.on("oddsUpdate", handleOddsUpdate);
    socket.on("liveOddsUpdate", handleOddsUpdate);

    return () => {
      socket.off("gameUpdate", handleGameUpdate);
      socket.off("oddsUpdate", handleOddsUpdate);
      socket.off("liveOddsUpdate", handleOddsUpdate);
    };
  }, [socket]);

  return { games, isLoading, fetchAll, lastUpdated };
};
