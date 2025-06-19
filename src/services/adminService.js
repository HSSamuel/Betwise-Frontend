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

export const manualGameSync = async () => {
  const response = await api.post("/admin/games/sync");
  return response.data;
};

export const getRiskOverview = async () => {
  const response = await api.get("/admin/risk/overview");
  return response.data;
};
