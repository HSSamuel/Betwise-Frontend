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
  const socketInstance = useRef(null);

  useEffect(() => {
    const cleanup = () => {
      if (socketInstance.current) {
        console.log("Cleaning up existing socket connection...");
        socketInstance.current.disconnect();
        socketInstance.current = null;
        setSocket(null);
      }
    };

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

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          console.error("Socket Error: Access token has expired.");
          toast.error("Your session has expired. Please log in again.");
          logout();
          return;
        }
      } catch (error) {
        console.error("Socket Error: Invalid token. Logging out.", error);
        logout();
        return;
      }

      cleanup();

      console.log("Creating new socket instance...");
      const newSocket = createSocket(token);
      socketInstance.current = newSocket;
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log(
          `✅ Socket connected successfully with ID: ${newSocket.id}`
        );
        newSocket.emit("joinUserRoom", user._id);
      });

      // --- THIS IS THE FINAL FIX FOR THE FRONTEND ---
      // The error handler now logs the full error object for better debugging.
      newSocket.on("connect_error", (err) => {
        console.error("Socket Connection Error:", err); // Log the full error object
        const errorCode = err.data?.code; // Access the custom error code
        if (errorCode === "INVALID_TOKEN") {
          toast.error("Your session is invalid. Please log in again.");
          logout(); // Force logout if the token is definitively invalid
        } else {
          toast.error("Could not connect to real-time service.");
        }
      });
      // --- END OF FINAL FIX ---

      newSocket.connect();
    } else {
      cleanup();
    }

    return cleanup;
  }, [user, logout]);

  return (
    <SocketProvider socket={socket}>
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
