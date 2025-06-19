import React from "react";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency, capitalize } from "../../utils/helpers";

const BetRow = ({ bet }) => {
  const isWin = bet.status === "won";
  const isLoss = bet.status === "lost";

  let statusClass =
    "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
  if (isWin)
    statusClass =
      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
  if (isLoss)
    statusClass = "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";

  const betDetails = bet.selections.map((sel) => {
    if (!sel.game) {
      return (
        <div key={sel._id || Math.random()} className="text-red-500">
          <span>Game data is unavailable</span>
        </div>
      );
    }
    return (
      <div key={sel.game._id}>
        <span>
          {sel.game.homeTeam} vs {sel.game.awayTeam}
        </span>
        <span className="font-semibold ml-2">({capitalize(sel.outcome)})</span>
      </div>
    );
  });

  return (
    <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <td className="px-6 py-4">{capitalize(bet.betType)}</td>
      <td className="px-6 py-4">{betDetails}</td>
      <td className="px-6 py-4">{formatCurrency(bet.stake)}</td>
      <td className="px-6 py-4">{bet.totalOdds.toFixed(2)}</td>
      <td className="px-6 py-4">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
        >
          {capitalize(bet.status)}
        </span>
      </td>
      <td className="px-6 py-4 font-semibold">{formatCurrency(bet.payout)}</td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {formatDate(bet.createdAt)}
      </td>
    </tr>
  );
};

export default BetRow;
