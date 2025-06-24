import api from "./api";

export const getPlatformStats = async () => {
  const response = await api.get("/admin/stats/platform");
  return response.data;
};

export const getFinancialDashboard = async () => {
  const response = await api.get("/admin/dashboard/financial");
  return response.data;
};

export const listUsers = async (params) => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};

export const adminGetUserProfile = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const adminUpdateUserRole = async (id, role) => {
  const response = await api.patch(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const adminAdjustUserWallet = async (id, amount, description) => {
  const response = await api.patch(`/admin/users/${id}/wallet`, {
    amount,
    description,
  });
  return response.data;
};

export const adminDeleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const adminGetWithdrawals = async (status = "pending") => {
  const response = await api.get("/admin/withdrawals", { params: { status } });
  return response.data;
};

export const adminProcessWithdrawal = async (id, status, adminNotes) => {
  const response = await api.patch(`/admin/withdrawals/${id}/process`, {
    status,
    adminNotes,
  });
  return response.data;
};

export const getGameRiskAnalysis = async (gameId) => {
  const response = await api.get(`/admin/games/${gameId}/risk`);
  return response.data;
};

export const getGameRiskSummary = async (gameId) => {
  const response = await api.get(`/admin/games/${gameId}/risk-summary`);
  return response.data;
};

export const manualGameSync = async (data) => {
  // The 'data' object will contain the source, e.g., { source: 'thesportsdb' }
  const response = await api.post("/admin/games/sync", data);
  return response.data;
};

export const getRiskOverview = async () => {
  const response = await api.get("/admin/risk/overview");
  return response.data;
};

export const adminAdjustOdds = async (gameId, odds) => {
  const response = await api.patch(`/admin/games/${gameId}/adjust-odds`, odds);
  return response.data;
};

// --- NEW: Functions for Team Ranking Management ---

export const getRankings = async (params) => {
  const response = await api.get("/admin/rankings", { params });
  return response.data;
};

export const createRanking = async (teamName, ranking) => {
  const response = await api.post("/admin/rankings", { teamName, ranking });
  return response.data;
};

export const updateRanking = async (id, ranking) => {
  const response = await api.patch(`/admin/rankings/${id}`, { ranking });
  return response.data;
};

export const deleteRanking = async (id) => {
  const response = await api.delete(`/admin/rankings/${id}`);
  return response.data;
};

export const adminGetUserDetail = async (id, params) => {
  const response = await api.get(`/admin/users/${id}/details`, { params });
  return response.data;
};

export const adminGetAllPromotions = async () => {
  // Note: The '/all' is to differentiate from the public route that gets only active promos
  const response = await api.get("/promotions/all");
  return response.data;
};

export const adminCreatePromotion = async (promoData) => {
  const response = await api.post("/promotions", promoData);
  return response.data;
};

export const adminUpdatePromotion = async (id, promoData) => {
  const response = await api.patch(`/promotions/${id}`, promoData);
  return response.data;
};

export const adminDeletePromotion = async (id) => {
  const response = await api.delete(`/promotions/${id}`);
  return response.data;
};
