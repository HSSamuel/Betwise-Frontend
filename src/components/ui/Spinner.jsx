import React from "react";

const Spinner = ({ size = "md", color = "border-green-500" }) => {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full ${sizes[size]} border-b-2 ${color}`}
      ></div>
    </div>
  );
};

export default Spinner;
