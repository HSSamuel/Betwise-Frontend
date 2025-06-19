import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// The socket instance is now a function that accepts the token
export const createSocket = (token) => {
  return io(URL, {
    autoConnect: false,
    // Add the auth object to send the token with the connection request
    auth: {
      token,
    },
  });
};
