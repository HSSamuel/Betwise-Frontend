// In: src/contexts/WalletContext.jsx

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { getWallet } from "../services/walletService";
import { useAuth } from "./AuthContext";

const WalletContext = createContext();

// FIX: Add a check to ensure the context is available.
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const { user } = useAuth();

  const fetchWalletBalance = useCallback(async () => {
    if (!user) {
      setBalance(0);
      return;
    }
    try {
      const walletData = await getWallet();
      setBalance(walletData.walletBalance);
    } catch (error) {
      console.error("Failed to fetch wallet balance", error);
      setBalance(0);
    }
  }, [user]);

  useEffect(() => {
    fetchWalletBalance();
  }, [fetchWalletBalance]);

  const value = { balance, fetchWalletBalance };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export default WalletProvider;
