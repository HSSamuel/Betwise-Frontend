// In: src/services/api.js

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
});

let logoutUser;

export const setupAuthInterceptor = (logout) => {
  logoutUser = logout;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // This block runs when an API call fails with a 401 Unauthorized error.
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // FIX: Define refreshToken by getting it from localStorage
      const refreshToken = localStorage.getItem("refreshToken");

      // Now, check if the refreshToken exists.
      if (!refreshToken) {
        if (logoutUser) logoutUser();
        return Promise.reject(error);
      }

      try {
        const decodedRefresh = jwtDecode(refreshToken);
        if (decodedRefresh.exp * 1000 < Date.now()) {
          throw new Error("Refresh token expired");
        }

        const { data } = await api.post("/auth/refresh-token", {
          token: refreshToken,
        });

        localStorage.setItem("accessToken", data.accessToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        toast.error("Your session has expired. Please log in again.");
        if (logoutUser) {
          logoutUser();
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
