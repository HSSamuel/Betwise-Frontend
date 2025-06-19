import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import AuthProvider from "./AuthContext";
import WalletProvider from "./WalletContext";
import BetSlipProvider from "./BetSlipContext";

/**
 * A single component to compose all global context providers.
 * This helps to flatten the component tree in App.jsx and provides
 * a single location for managing the app's providers.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the providers.
 */
const AppProviders = ({ children }) => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <WalletProvider>
              <BetSlipProvider>{children}</BetSlipProvider>
            </WalletProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default AppProviders;
