import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth(); // Get user from AuthContext

  useEffect(() => {
    if (user && user.id) {
      // Connect only when the user is logged in
      const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        // ** Pass userId in the connection query **
        query: {
          userId: user.id,
        },
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        setIsConnected(true);
        console.log("✅ Socket connected successfully with ID:", newSocket.id);
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
        console.log("🔌 Socket disconnected.");
      });

      return () => {
        newSocket.close();
        setIsConnected(false);
      };
    } else {
      // If no user, disconnect any existing socket
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user]); // Re-run effect when user object changes

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
