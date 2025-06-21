// In: Bet/Frontend/src/hooks/useGameFeeds.js
import { useState, useCallback, useEffect } from "react";
import { useApi } from "./useApi";
import {
  getGames,
  getPersonalizedFeed,
  getGameSuggestions,
  getLiveGamesFeed, // Correctly imported
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

  // API hooks for each data source
  const {
    data: upcomingData,
    loading: upcomingLoading,
    request: fetchUpcoming,
  } = useApi(getGames);

  // --- FIX: Use the new dedicated service for fetching live games ---
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

  const isLoading =
    upcomingLoading ||
    liveLoading ||
    finishedLoading ||
    (user && (recsLoading || feedLoading || suggestionsLoading));

  // fetchAll now correctly calls the new fetchLive function
  const fetchAll = useCallback(() => {
    fetchUpcoming({ status: "upcoming", limit: 20 });
    fetchLive(); // This now calls the correct getLiveGamesFeed
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

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setGames((prev) => ({ ...prev, upcoming: upcomingData?.games || [] }));
  }, [upcomingData]);

  // This effect correctly sets the initial list of live games from the API
  useEffect(() => {
    if (liveData?.games) {
      setGames((prev) => ({ ...prev, live: liveData.games }));
    }
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

  // This useEffect correctly handles all real-time updates from the socket
  useEffect(() => {
    if (!socket) return;

    // Handles single game updates (e.g., status change, score change)
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

    socket.on("gameUpdate", handleGameUpdate);

    // Cleanup function to prevent memory leaks
    return () => {
      socket.off("gameUpdate", handleGameUpdate);
    };
  }, [socket]);

  return {
    games,
    setGames,
    isLoading,
    fetchAll,
    resultsDate,
    setResultsDate,
  };
};
