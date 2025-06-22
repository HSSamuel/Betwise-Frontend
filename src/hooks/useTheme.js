import { useContext } from "react";
// FIX: Import the context directly from its definition file.
import { ThemeContext } from "../contexts/ThemeContext";

/**
 * A custom hook to easily access the ThemeContext.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
