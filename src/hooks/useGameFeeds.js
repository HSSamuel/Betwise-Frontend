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
import { useSocket } from "../contexts/SocketContext"; // Import the useSocket hook

/**
 * A custom hook to fetch and manage all game feeds required for the HomePage.
 */
export const useGameFeeds = () => {
  const { user } = useAuth();
  const socket = useSocket(); // Get the socket instance from context
  const [games, setGames] = useState({
    upcoming: [],
    live: [],
    finished: [],
    recommendations: [],
    feed: [],
    suggestions: [],
  });

  const [resultsDate, setResultsDate] = useState(new Date());

  // API hooks for each data source
  const {
    data: upcomingData,
    loading: upcomingLoading,
    request: fetchUpcoming,
  } = useApi(getGames);
  const {
    data: liveData,
    loading: liveLoading,
    request: fetchLive,
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

  // Combined loading state for the entire hook
  const isLoading =
    upcomingLoading ||
    liveLoading ||
    finishedLoading ||
    (user && (recsLoading || feedLoading || suggestionsLoading));

  // A single function to trigger all data fetches
  const fetchAll = useCallback(() => {
    fetchUpcoming({ status: "upcoming", limit: 20 });
    fetchLive({ status: "live" });
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
    fetchLive,
    fetchFinished,
    fetchRecs,
    fetchFeed,
    fetchSuggestions,
    user,
  ]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Effects to update the central 'games' state when any data source changes
  useEffect(() => {
    setGames((prev) => ({ ...prev, upcoming: upcomingData?.games || [] }));
  }, [upcomingData]);

  useEffect(() => {
    setGames((prev) => ({ ...prev, live: liveData?.games || [] }));
  }, [liveData]);

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

  // --- FIX: Logic for handling socket updates is now inside the hook ---
  useEffect(() => {
    if (!socket) return;

    const handleGameUpdate = (updatedGame) => {
      setGames((prev) => {
        const newLiveGames = prev.live.filter((g) => g._id !== updatedGame._id);
        const newUpcomingGames = prev.upcoming.filter(
          (g) => g._id !== updatedGame._id
        );

        if (updatedGame.status === "live") {
          newLiveGames.unshift(updatedGame);
        }

        return {
          ...prev,
          live: newLiveGames,
          upcoming: newUpcomingGames,
        };
      });
    };

    socket.on("gameUpdate", handleGameUpdate);
    return () => {
      socket.off("gameUpdate", handleGameUpdate);
    };
  }, [socket]);
  // --- END FIX ---

  // Expose the state and functions to the component
  return {
    games,
    setGames,
    isLoading,
    fetchAll,
    resultsDate,
    setResultsDate,
  };
};
