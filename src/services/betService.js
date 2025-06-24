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

export const cashOutBet = async (betId) => {
  const response = await api.post(`/bets/${betId}/cash-out`);
  return response.data;
};

// --- Implementation: New function to create a shareable link ---
export const createShareableSlip = async (slipData) => {
  const response = await api.post("/bets/share", slipData);
  return response.data;
};

// --- Implementation: New function to get a shared slip's details ---
export const getSharedSlip = async (shareId) => {
  const response = await api.get(`/bets/share/${shareId}`);
  return response.data;
};