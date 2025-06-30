import api from "./api";

// --- Public Functions ---
export const getGames = async (params) => {
  const response = await api.get("/games", { params });
  return response.data;
};

export const getLiveGamesFeed = async () => {
  const response = await api.get("/games/live");
  return response.data;
};

export const getGameById = async (id) => {
  const response = await api.get(`/games/${id}`);
  return response.data;
};

// --- Authenticated User Functions ---
export const getPersonalizedFeed = async () => {
  const response = await api.get("/games/feed");
  return response.data;
};

export const getGameSuggestions = async () => {
  const response = await api.get("/games/suggestions");
  return response.data;
};

export const getGameOddsHistory = async (id) => {
  const response = await api.get(`/games/${id}/odds-history`);
  return response.data;
};

// --- Admin Functions ---
export const createGame = async (gameData) => {
  const response = await api.post("/games", gameData);
  return response.data;
};

export const setResult = async (gameId, result, homeScore, awayScore) => {
  const response = await api.patch(`/games/${gameId}/result`, {
    result,
    homeScore,
    awayScore,
  });
  return response.data;
};

export const cancelGame = async (gameId) => {
  const response = await api.patch(`/games/${gameId}/cancel`);
  return response.data;
};

export const searchGamesAI = async (query) => {
  const response = await api.post("/ai/game-search", { query });
  return response.data;
};

export const getGameDetails = async (id) => {
  const response = await api.get(`/games/${id}/details`);
  return response.data;
};