import { useState, useCallback, useEffect } from "react";
import { useApi } from "./useApi";
import { getGames, getLiveGamesFeed } from "../services/gameService"; // Updated import
import { useSocket } from "../contexts/SocketContext";

export const useGameFeeds = () => {
  const socket = useSocket();
  const [games, setGames] = useState({
    upcoming: [],
    live: [],
    finished: [],
  });

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
    fetchUpcoming({ status: "upcoming", limit: 20 });
    fetchLive();
    fetchFinished({ status: "finished", limit: 10, order: "desc" });
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
          newLive.unshift(updatedGame);
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
    };

    socket.on("gameUpdate", handleGameUpdate);

    return () => {
      socket.off("gameUpdate", handleGameUpdate);
    };
  }, [socket]);

  return { games, isLoading, fetchAll };
};
