import React, { createContext, useContext } from "react";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  // Add a defensive check to prevent crashes.
  if (context === null) {
    // This can happen briefly on initial load before the user is authenticated.
    // Return a safe default value.
    return { socket: null, isConnected: false };
  }
  return context;
};

// Correction: The provider should accept a 'value' prop and pass it to the context.
export const SocketProvider = ({ children, value }) => {
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
