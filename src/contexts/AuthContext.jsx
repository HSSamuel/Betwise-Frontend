// In: src/contexts/AuthContext.jsx

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { jwtDecode } from "jwt-decode";
import api, { setupAuthInterceptor } from "../services/api";
import * as authService from "../services/authService";
import { getProfile } from "../services/userService";

// FIX: Add the 'export' keyword back to this line.
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
  }, []);

  const initAuth = useCallback(async () => {
    setupAuthInterceptor(logout);
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        if (decoded.exp * 1000 > Date.now()) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          const fullUserProfile = await getProfile();
          setUser(fullUserProfile);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Authentication initialization failed", error);
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email, password) => {
    const {
      accessToken,
      refreshToken,
      user: userData,
    } = await authService.login(email, password);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setUser(userData);
  };

  const register = async (userData) => {
    const {
      accessToken,
      refreshToken,
      user: newUser,
    } = await authService.register(userData);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setUser(newUser);
  };

  const handleSocialAuth = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    try {
      const decoded = jwtDecode(accessToken);
      setUser({
        _id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      });
    } catch (error) {
      console.error("Error decoding social auth token:", error);
      logout();
    }
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    register,
    loading,
    handleSocialAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
