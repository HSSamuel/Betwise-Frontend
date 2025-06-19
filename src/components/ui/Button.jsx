import React from "react";
import Spinner from "./Spinner";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
}) => {
  const baseStyles =
    "px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors flex items-center justify-center";

  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "bg-transparent border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-green-500",
  };

  const disabledStyles =
    "disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-400";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  );
};

export default Button;
