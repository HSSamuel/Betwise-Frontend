import React from "react";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency, capitalize } from "../../utils/helpers";
import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";

const BetRow = ({ bet, onCashOut, isCashOutLoading }) => {
  const isCashOutEligible =
    bet.status === "pending" &&
    bet.selections.length === 1 &&
    bet.selections[0].game?.status === "live";

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
        <StatusBadge status={bet.status} />
      </td>
      <td className="px-6 py-4 font-semibold">{formatCurrency(bet.payout)}</td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {formatDate(bet.createdAt)}
      </td>
      <td className="px-6 py-4">
        {isCashOutEligible && (
          <Button
            onClick={() => onCashOut(bet._id)}
            loading={isCashOutLoading}
            disabled={isCashOutLoading}
            size="sm"
            className="!px-3 !py-1"
          >
            Cash Out
          </Button>
        )}
      </td>
    </tr>
  );
};

export default BetRow;
