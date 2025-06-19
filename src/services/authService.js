import api from "./api";

export const placeSingleBet = (betData) => api.post("/bets/single", betData);
export const placeMultiBet = (betData) => api.post("/bets/multi", betData);
export const getBets = (params) => api.get("/bets", { params });
export const getBetById = (id) => api.get(`/bets/${id}`);

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logout = async () => {
  // The token is blacklisted on the backend via the interceptor
  // This function is mostly for client-side state clearing
  return Promise.resolve();
};

export const refreshToken = async (token) => {
  const response = await api.post("/auth/refresh-token", { token });
  return response.data;
};

export const requestPasswordReset = async (email) => {
  const response = await api.post("/auth/request-password-reset", { email });
  return response.data;
};

export const resetPassword = async (token, password, confirmPassword) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    password,
    confirmPassword,
  });
  return response.data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};
