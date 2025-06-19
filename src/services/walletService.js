import api from "./api";

export const getWallet = async () => {
  const response = await api.get("/wallet");
  return response.data;
};

export const getWalletSummary = async () => {
  const response = await api.get("/wallet/summary");
  return response.data;
};

export const getTransactionHistory = async (params) => {
  const response = await api.get("/wallet/transactions", { params });
  return response.data;
};

export const initializeDeposit = async (amount) => {
  const response = await api.post("/wallet/deposit/initialize", { amount });
  return response.data;
};

export const requestWithdrawal = async (amount) => {
  const response = await api.post("/wallet/request-withdrawal", { amount });
  return response.data;
};
