import { io } from "socket.io-client";

const URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://betwise-backend-w91p.onrender.com/api/v1";

// The socket instance is now a function that accepts the token
export const createSocket = (token) => {
  return io(URL, {
    autoConnect: false,
    path: "/betwise-socket/", // This MUST match the path on the server
    auth: {
      token,
    },
  });
};
