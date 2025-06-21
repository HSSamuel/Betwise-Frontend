// In: Bet/Frontend/src/hooks/useGameFeeds.js
import { useState, useCallback, useEffect } from "react";
import { useApi } from "./useApi";
import {
  getGames,
  getPersonalizedFeed,
  getGameSuggestions,
} from "../services/gameService";
import { getRecommendedGames } from "../services/aiService";
import { useAuth } from "./useAuth";
import { useSocket } from "../contexts/SocketContext";

/**
 * A custom hook to fetch and manage all game feeds required for the HomePage.
 */
export const useGameFeeds = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [games, setGames] = useState({
    upcoming: [],
    live: [],
    finished: [],
    recommendations: [],
    feed: [],
    suggestions: [],
  });

  const [resultsDate, setResultsDate] = useState(new Date());

  // API hooks for all data *except* live games
  const {
    data: upcomingData,
    loading: upcomingLoading,
    request: fetchUpcoming,
  } = useApi(getGames);
  const {
    data: finishedData,
    loading: finishedLoading,
    request: fetchFinished,
  } = useApi(getGames);
  const {
    data: recsData,
    loading: recsLoading,
    request: fetchRecs,
  } = useApi(getRecommendedGames);
  const {
    data: feedData,
    loading: feedLoading,
    request: fetchFeed,
  } = useApi(getPersonalizedFeed);
  const {
    data: suggestionsData,
    loading: suggestionsLoading,
    request: fetchSuggestions,
  } = useApi(getGameSuggestions);

  // isLoading no longer includes a `liveLoading` state
  const isLoading =
    upcomingLoading ||
    finishedLoading ||
    (user && (recsLoading || feedLoading || suggestionsLoading));

  // fetchAll no longer includes a `fetchLive` call
  const fetchAll = useCallback(() => {
    fetchUpcoming({ status: "upcoming", limit: 20 });
    const date_filter = resultsDate.toISOString().split("T")[0];
    fetchFinished({
      status: "finished",
      limit: 50,
      order: "desc",
      date: date_filter,
    });
    if (user) {
      fetchRecs();
      fetchFeed();
      fetchSuggestions();
    }
  }, [
    resultsDate,
    fetchUpcoming,
    fetchFinished,
    fetchRecs,
    fetchFeed,
    fetchSuggestions,
    user,
  ]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Effects to update state from API calls (excluding live games)
  useEffect(() => {
    setGames((prev) => ({ ...prev, upcoming: upcomingData?.games || [] }));
  }, [upcomingData]);

  useEffect(() => {
    setGames((prev) => ({ ...prev, finished: finishedData?.games || [] }));
  }, [finishedData]);

  useEffect(() => {
    if (user)
      setGames((prev) => ({ ...prev, recommendations: recsData?.games || [] }));
  }, [recsData, user]);

  useEffect(() => {
    if (user) setGames((prev) => ({ ...prev, feed: feedData?.games || [] }));
  }, [feedData, user]);

  useEffect(() => {
    if (user)
      setGames((prev) => ({
        ...prev,
        suggestions: suggestionsData?.suggestions || [],
      }));
  }, [suggestionsData, user]);

  // This single useEffect now manages all live game state via WebSockets
  useEffect(() => {
    if (!socket) return;

    // Handles the initial list of live games sent upon connection
    const handleAllLiveGames = (allLiveGames) => {
      setGames((prev) => ({ ...prev, live: allLiveGames }));
    };

    // Handles subsequent real-time updates for individual games
    const handleGameUpdate = (updatedGame) => {
      setGames((prev) => {
        const newUpcoming = prev.upcoming.filter(
          (g) => g._id !== updatedGame._id
        );
        let newLive = prev.live.filter((g) => g._id !== updatedGame._id);

        if (updatedGame.status === "live") {
          newLive.unshift(updatedGame);
        }

        return {
          ...prev,
          upcoming: newUpcoming,
          live: newLive,
        };
      });
    };

    socket.on("allLiveGames", handleAllLiveGames);
    socket.on("gameUpdate", handleGameUpdate);

    return () => {
      socket.off("allLiveGames", handleAllLiveGames);
      socket.off("gameUpdate", handleGameUpdate);
    };
  }, [socket]);

  return {
    games,
    isLoading,
    fetchAll,
    resultsDate,
    setResultsDate,
  };
};
