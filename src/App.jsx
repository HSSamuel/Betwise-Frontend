import { Toaster, toast } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { createSocket } from "./services/socketService";
import { SocketProvider } from "./contexts/SocketContext";
import AppProviders from "./contexts/AppProviders";
import { jwtDecode } from "jwt-decode";

function AppContent() {
  const { user, logout } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketInstance = useRef(null);

  useEffect(() => {
    // Disconnect and clean up any existing socket when the user changes
    if (socketInstance.current) {
      console.log("Cleaning up existing socket connection...");
      socketInstance.current.disconnect();
    }

    if (user) {
      console.log("User detected, attempting to establish socket connection.");
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error(
          "Socket Error: No access token found for logged-in user."
        );
        logout();
        return;
      }

      // --- Start of Correction ---
      // All socket logic is now handled within this block.

      const newSocket = createSocket(token);
      socketInstance.current = newSocket;
      setSocket(newSocket);

      // Setup all event listeners on the new socket instance
      newSocket.on("connect", () => {
        console.log(
          `✅ Socket connected successfully with ID: ${newSocket.id}`
        );
        setIsConnected(true);
        newSocket.emit("joinUserRoom", user._id);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Socket disconnected.");
        setIsConnected(false);
      });

      newSocket.on("connect_error", (err) => {
        setIsConnected(false);
        const errorCode = err.data?.code;
        const errorMessage = err.message.toLowerCase();
        console.error("Socket Connection Error:", err);

        if (errorCode === "INVALID_TOKEN") {
          toast.error("Your session is invalid. Please log in again.");
          logout();
        } else if (
          errorMessage.includes("xhr poll error") ||
          errorMessage.includes("websocket error") ||
          errorMessage.includes("internet disconnected")
        ) {
          console.log(
            "Socket connection failed due to a network transport issue. Will retry."
          );
        } else {
          toast.error("A real-time connection error occurred.");
        }
      });

      // Listen for custom real-time events
      newSocket.on("bet_settled", (data) => {
        if (data.status === "won") {
          toast.success(`${data.message} You won $${data.payout.toFixed(2)}!`);
        } else {
          toast.info(data.message);
        }
      });

      newSocket.on("withdrawal_processed", (data) => {
        if (data.status === "success") {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });

      newSocket.connect();

      // The cleanup function for this useEffect instance
      return () => {
        console.log("Running cleanup for the user socket effect.");
        newSocket.off("connect");
        newSocket.off("disconnect");
        newSocket.off("connect_error");
        newSocket.off("bet_settled");
        newSocket.off("withdrawal_processed");
        newSocket.disconnect();
      };
      // --- End of Correction ---
    } else {
      setIsConnected(false);
      if (socketInstance.current) {
        socketInstance.current.disconnect();
        socketInstance.current = null;
        setSocket(null);
      }
    }
  }, [user, logout]);

  return (
    <SocketProvider value={{ socket, isConnected }}>
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </SocketProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;
