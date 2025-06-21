import { io } from "socket.io-client";

const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://betwise-backend-w91p.onrender.com/api/v1";

// FIX: The WebSocket server is at the root of the domain, not under /api/v1.
// This function derives the base URL (e.g., "https://betwise-backend-w91p.onrender.com")
// from the full API URL.
const getBaseUrl = (url) => {
  try {
    const urlObject = new URL(url);
    return `${urlObject.protocol}//${urlObject.host}`;
  } catch (e) {
    // Fallback for invalid or relative URLs during development
    return "https://betwise-backend-w91p.onrender.com";
  }
};

const SOCKET_URL = getBaseUrl(API_URL);

// The socket instance is now a function that accepts the token
export const createSocket = (token) => {
  return io(SOCKET_URL, {
    autoConnect: false,
    // FIX: The path now matches the new, nested path on the server.
    path: "/api/v1/socket.io", // This MUST match the path on the server
    auth: {
      token,
    },
  });
};
