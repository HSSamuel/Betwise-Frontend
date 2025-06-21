// In: Bet/Frontend/src/components/admin/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, icon, gradient }) => (
  <div
    className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300 ease-in-out`}
  >
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <p className="text-lg font-medium opacity-90">{title}</p>
        <p className="text-4xl font-bold tracking-tight">{value}</p>
      </div>
      <div className="p-3 bg-white bg-opacity-30 rounded-lg">{icon}</div>
    </div>
  </div>
);

export default StatCard;
