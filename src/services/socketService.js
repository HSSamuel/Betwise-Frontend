import { io } from "socket.io-client";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// This new logic correctly extracts just the base part, e.g., 'http://localhost:5000'
let SOCKET_URL;
try {
  const urlObject = new URL(API_URL);
  SOCKET_URL = urlObject.origin;
} catch (error) {
  // Fallback if the URL is somehow invalid
  SOCKET_URL = "http://localhost:5000";
}

// The createSocket function now uses the correct base URL
export const createSocket = (token) => {
  return io(SOCKET_URL, {
    autoConnect: false,
    auth: {
      token,
    },
  });
};
