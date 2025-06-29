import { io } from "socket.io-client";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

let SOCKET_URL;
try {
  const urlObject = new URL(API_URL);
  SOCKET_URL = urlObject.origin;
} catch (error) {
  SOCKET_URL = "http://localhost:5000";
}

export const createSocket = (token) => {
  return io(SOCKET_URL, {
    autoConnect: false,
    auth: {
      token,
    },
    // FIX: Force the connection to use only the WebSocket transport.
    // This is the standard solution for connection errors in many deployed environments.
    transports: ["websocket"],
  });
};
