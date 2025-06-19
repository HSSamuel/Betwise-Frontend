import api from "./api";

export const placeBet = async (betData) => {
  const response = await api.post("/bets/single", betData);
  return response.data;
};

// FIX: Added new function for placing multiple single bets
export const placeMultipleSingles = async (betData) => {
  const response = await api.post("/bets/singles", betData); // New endpoint
  return response.data;
};

export const placeMultiBet = async (betData) => {
  const response = await api.post("/bets/multi", betData);
  return response.data;
};

export const getUserBets = async (params) => {
  const response = await api.get("/bets", { params });
  return response.data;
};

export const getBetById = async (id) => {
  const response = await api.get(`/bets/${id}`);
  return response.data;
};
