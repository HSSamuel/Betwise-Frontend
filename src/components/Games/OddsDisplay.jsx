import React from "react";
import toast from "react-hot-toast";
import { useBetSlip } from "../../contexts/BetSlipContext";

const OddsDisplay = ({ game }) => {
  const { addSelection, selections } = useBetSlip();

  const handleSelect = (outcome, odds) => {
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!game?._id || !mongoIdRegex.test(game._id)) {
      toast.error("This game cannot be selected due to an invalid ID.");
      return;
    }

    addSelection({
      gameId: game._id,
      gameDetails: { homeTeam: game.homeTeam, awayTeam: game.awayTeam },
      outcome,
      odds,
    });
  };

  const isSelected = (outcome) => {
    return selections.some(
      (sel) => sel.gameId === game._id && sel.outcome === outcome
    );
  };

  return (
    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
      <button
        onClick={() => handleSelect("A", game.odds.home)}
        className={`p-2 rounded border transition-colors ${
          isSelected("A")
            ? "bg-green-500 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800" // FIX: Added dark text color
        }`}
      >
        <span className="text-xs">Home</span>
        <span className="block font-bold">
          {game.odds?.home?.toFixed(2) || "N/A"}
        </span>
      </button>
      <button
        onClick={() => handleSelect("Draw", game.odds.draw)}
        className={`p-2 rounded border transition-colors ${
          isSelected("Draw")
            ? "bg-green-500 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800" // FIX: Added dark text color
        }`}
      >
        <span className="text-xs">Draw</span>
        <span className="block font-bold">
          {game.odds?.draw?.toFixed(2) || "N/A"}
        </span>
      </button>
      <button
        onClick={() => handleSelect("B", game.odds.away)}
        className={`p-2 rounded border transition-colors ${
          isSelected("B")
            ? "bg-green-500 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800" // FIX: Added dark text color
        }`}
      >
        <span className="text-xs">Away</span>
        <span className="block font-bold">
          {game.odds?.away?.toFixed(2) || "N/A"}
        </span>
      </button>
    </div>
  );
};

export default OddsDisplay;
