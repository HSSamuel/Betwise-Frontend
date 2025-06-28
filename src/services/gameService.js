import api from "./api";

export const getGames = async (params) => {
  const response = await api.get("/games", { params });
  return response.data;
};

export const getLiveGamesFeed = async () => {
  const response = await api.get("/games/live-feed");
  return response.data;
};

export const getGameById = async (id) => {
  const response = await api.get(`/games/${id}`);
  return response.data;
};

export const cancelGame = async (id) => {
  const response = await api.patch(`/admin/games/${id}/cancel`);
  return response.data;
};

export const createGame = async (gameData) => {
  const response = await api.post("/admin/games", gameData);
  return response.data;
};

export const setGameResult = async (id, resultData) => {
  const response = await api.post(`/admin/games/${id}/result`, resultData);
  return response.data;
};

// --- Aviator Specific Functions ---

export const getAviatorHistory = async () => {
  const response = await api.get("/aviator/history");
  return response.data;
};

export const placeAviatorBet = async (amount, autoCashOutMultiplier) => {
  const response = await api.post("/aviator/bet", {
    amount: parseFloat(amount),
    autoCashOutMultiplier: autoCashOutMultiplier
      ? parseFloat(autoCashOutMultiplier)
      : null,
  });
  return response.data;
};

// ** FIX: This function was missing and has now been added. **
export const cashOutAviator = async () => {
  const response = await api.post("/aviator/cashout");
  return response.data;
};
