import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { createSocket } from "./services/socketService";
import { SocketProvider } from "./contexts/SocketContext";
import AppProviders from "./contexts/AppProviders"; // <-- IMPORT the new component

// This component handles the socket connection logic which depends on the AuthContext.
// It remains unchanged.
function AppContent() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const socketInstance = useRef(null);

  useEffect(() => {
    if (user && !socketInstance.current) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        socketInstance.current = createSocket(token);
        setSocket(socketInstance.current);
        socketInstance.current.connect();
        socketInstance.current.on("connect", () => {
          socketInstance.current.emit("joinUserRoom", user._id);
        });
      }
    } else if (!user && socketInstance.current) {
      socketInstance.current.disconnect();
      socketInstance.current = null;
      setSocket(null);
    }
    return () => {
      if (socketInstance.current) {
        socketInstance.current.disconnect();
      }
    };
  }, [user]);

  return (
    <SocketProvider socket={socket}>
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </SocketProvider>
  );
}

// The main App component is now significantly cleaner.
function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;
