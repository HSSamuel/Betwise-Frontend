// In: src/services/aiService.js

import api from "./api";

export const handleChat = async (message, history, context = null) => {
  const response = await api.post("/ai/chat", { message, history, context });
  return response.data;
};

export const parseBetIntent = async (text) => {
  const response = await api.post("/ai/parse-bet-intent", { text });
  return response.data;
};

export const analyzeGame = async (gameId) => {
  const response = await api.post("/ai/analyze-game", { gameId });
  return response.data;
};

export const getBettingFeedback = async () => {
  const response = await api.get("/ai/my-betting-feedback");
  return response.data;
};

export const generateLimitSuggestion = async () => {
  const response = await api.get("/ai/limit-suggestion");
  return response.data;
};

// FIX: Add a guard clause to prevent sending empty requests
export const getNewsSummary = async (topic) => {
  // If the topic is empty or just whitespace, do not proceed.
  if (!topic || !topic.trim()) {
    console.error("News summary topic cannot be empty.");
    return; // Stop the function here
  }
  const response = await api.post("/ai/news-summary", { topic });
  return response.data;
};

export const getRecommendedGames = async () => {
  const response = await api.get("/ai/recommendations");
  return response.data;
};

export const getGeneralSportsNews = async () => {
  const response = await api.get("/ai/world-sports-news");
  return response.data;
};

export const generateSocialPost = async (gameId) => {
  const response = await api.post("/ai/generate-social-post", { gameId });
  return response.data;
};

// --- Bet Slip Analysis ---
export const analyzeBetSlip = async (selections) => {
  const response = await api.post("/ai/analyze-slip", { selections });
  return response.data;
};

export const getBetSlipSuggestions = async (slipData) => {
  const response = await api.post("/ai/slip-suggestions", slipData);
  return response.data;
};

export const getPersonalizedNewsFeed = async () => {
  const response = await api.get("/ai/personalized-news");
  return response.data;
};