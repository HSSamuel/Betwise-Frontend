import React from "react";
import Card from "../ui/Card";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency, capitalize } from "../../utils/helpers";
import { FaTicketAlt, FaExclamationCircle } from "react-icons/fa";

const BetCard = ({ bet }) => {
  const isMulti = bet.betType === "multi";

  const BetDetails = () => {
    // Gracefully handle selections where game data might be missing
    const validSelections = bet.selections.filter((sel) => sel.game);

    if (validSelections.length === 0) {
      return (
        <div className="text-sm text-red-500 flex items-center">
          <FaExclamationCircle className="mr-2" />
          Game data is unavailable for this bet.
        </div>
      );
    }

    return validSelections.map((sel) => (
      <div key={sel._id || sel.game._id} className="text-sm">
        <p className="font-bold">
          {sel.game.homeTeam} vs {sel.game.awayTeam}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Your Pick:{" "}
          <span className="font-semibold">{capitalize(sel.outcome)}</span>
        </p>
      </div>
    ));
  };

  return (
    <Card className="transition-all hover:shadow-lg hover:border-green-500 border border-transparent">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
            <FaTicketAlt className="mr-2" />
            <span className="font-bold text-md">
              {capitalize(bet.betType)} Bet
            </span>
          </div>
          <p className="text-xs text-gray-400">{formatDate(bet.createdAt)}</p>
        </div>
        <StatusBadge status={bet.status} />
      </div>

      <div className="space-y-3 my-4 py-4 border-y dark:border-gray-700">
        <BetDetails />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Stake</p>
          <p className="font-bold text-lg">{formatCurrency(bet.stake)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isMulti ? "Total Odds" : "Odds"}
          </p>
          <p className="font-bold text-lg">{bet.totalOdds.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Payout</p>
          <p
            className={`font-bold text-lg ${
              bet.status === "won" ? "text-green-500" : ""
            }`}
          >
            {formatCurrency(bet.payout)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BetCard;
