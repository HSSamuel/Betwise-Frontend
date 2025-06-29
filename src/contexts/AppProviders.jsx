import React, { createContext, useContext, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import AuthProvider from "./AuthContext";
import WalletProvider from "./WalletContext";
import BetSlipProvider from "./BetSlipContext";
import { SocketProvider } from "./SocketContext"; // Import the SocketProvider

// --- NEW: Create Chat Context ---
const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

const ChatProvider = ({ children }) => {
  const [isChatOpen, setChatOpen] = useState(false);
  const toggleChat = () => setChatOpen((prev) => !prev);
  const value = { isChatOpen, toggleChat };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

const AppProviders = ({ children }) => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            {/* FIX: SocketProvider is now part of the main provider tree */}
            <SocketProvider>
              <WalletProvider>
                <BetSlipProvider>
                  <ChatProvider>{children}</ChatProvider>
                </BetSlipProvider>
              </WalletProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default AppProviders;
