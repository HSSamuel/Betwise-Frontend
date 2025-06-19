import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-300 hover:bg-gray-700 focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
    </button>
  );
};

export default ThemeToggle;
