import { useContext } from "react";
// Use curly braces {} for a named import
import { AuthContext } from "../contexts/AuthContext";

/**
 * A custom hook to easily access the AuthContext.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
