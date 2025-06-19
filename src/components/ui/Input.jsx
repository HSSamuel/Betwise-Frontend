import React from "react";

const Input = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200";

  // FIX: Added a specific dark mode placeholder color for better contrast.
  const placeholderStyles = "placeholder-gray-400 dark:placeholder-gray-400";

  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`${baseStyles} ${placeholderStyles} ${className}`}
      {...props}
    />
  );
};

export default Input;
