// In: Bet/Frontend/src/components/bets/BetSlip.jsx

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useBetSlip } from "../../contexts/BetSlipContext";
import { useApi } from "../../hooks/useApi";
import { placeMultiBet, placeMultipleSingles } from "../../services/betService";
import { getGameSuggestions } from "../../services/gameService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { FaLightbulb, FaPlus } from "react-icons/fa";

const HotTip = ({ tip, onAdd }) => {
  if (!tip) return null;
  const outcomes = [
    { outcome: "A", odds: tip.odds.home, label: "Home Win" },
    { outcome: "B", odds: tip.odds.away, label: "Away Win" },
    { outcome: "Draw", odds: tip.odds.draw, label: "Draw" },
  ];
  const likelyOutcome = outcomes.sort((a, b) => a.odds - b.odds)[0];

  return (
    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
      <div className="flex items-center mb-2">
        <FaLightbulb className="text-yellow-400 mr-2" />
        <h4 className="font-bold text-sm">AI Quick Tip</h4>
      </div>
      <p className="text-xs">
        {tip.homeTeam} vs {tip.awayTeam}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Suggested Bet: <span className="font-bold">{likelyOutcome.label}</span>
      </p>
      <Button
        className="w-full mt-2"
        variant="outline"
        onClick={() =>
          onAdd({
            gameId: tip._id,
            gameDetails: { homeTeam: tip.homeTeam, awayTeam: tip.awayTeam },
            outcome: likelyOutcome.outcome,
            odds: likelyOutcome.odds,
          })
        }
      >
        <FaPlus className="mr-2" /> Add to Slip
      </Button>
    </div>
  );
};

const BetSlip = () => {
  const {
    selections,
    removeSelection,
    clearSelections,
    totalOdds,
    addSelection,
  } = useBetSlip();
  const [stake, setStake] = useState("");
  const [betType, setBetType] = useState("Single");
  const { user, fetchWalletBalance } = useAuth();
  const navigate = useNavigate();

  const { request: placeSinglesRequest, loading: singleLoading } =
    useApi(placeMultipleSingles);
  const { request: placeMultiRequest, loading: multiLoading } =
    useApi(placeMultiBet);

  const [hotTip, setHotTip] = useState(null);
  const { loading: tipLoading, request: fetchHotTip } =
    useApi(getGameSuggestions);

  const isLoading = singleLoading || multiLoading;

  useEffect(() => {
    if (selections.length < 2 && betType === "Multi") {
      setBetType("Single");
    }
  }, [selections.length, betType]);

  const handleGetHotTip = async () => {
    const result = await fetchHotTip();
    // FIX: The `else` block that showed the redundant toast has been removed.
    // If `result` is falsy, it's because the API call failed, and `useApi`
    // has already displayed the correct error message.
    if (result && result.suggestions.length > 0) {
      setHotTip(result.suggestions[0]);
    }
  };

  const handleSuccess = (data) => {
    toast.success(data.msg || "Bets placed successfully!");
    clearSelections();
    setStake("");
    if (fetchWalletBalance) fetchWalletBalance();
  };

  const handlePlaceBet = async () => {
    if (!user) {
      toast.error("Please log in to place a bet.");
      navigate("/login");
      return;
    }
    if (selections.length === 0 || !stake || parseFloat(stake) <= 0) {
      toast.error("Please add selections and enter a valid stake.");
      return;
    }

    if (betType === "Multi") {
      if (selections.length < 2) {
        toast.error("A multi-bet requires at least 2 selections.");
        return;
      }
      const betData = {
        stake: parseFloat(stake),
        selections: selections.map((s) => ({
          gameId: s.gameId,
          outcome: s.outcome,
        })),
      };
      const result = await placeMultiRequest(betData);
      if (result) handleSuccess(result);
    } else {
      const betData = {
        stakePerBet: parseFloat(stake),
        selections: selections.map((s) => ({
          gameId: s.gameId,
          outcome: s.outcome,
        })),
      };
      const result = await placeSinglesRequest(betData);
      if (result) handleSuccess(result);
    }
  };

  const stakeAmount = parseFloat(stake) || 0;
  const isMultiBet = betType === "Multi" && selections.length > 1;

  const totalStake = isMultiBet ? stakeAmount : stakeAmount * selections.length;
  const potentialPayout = isMultiBet
    ? stakeAmount * totalOdds
    : selections.reduce((acc, sel) => acc + sel.odds * stakeAmount, 0);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold border-b pb-2 mb-4 dark:border-gray-700">
        Bet Slip
      </h3>

      {selections.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          <p className="mb-4">Click odds on a match to add a bet.</p>
          <Button
            onClick={handleGetHotTip}
            loading={tipLoading}
            disabled={tipLoading}
          >
            <FaLightbulb className="mr-2" /> Get AI Quick Tip
          </Button>
          <HotTip tip={hotTip} onAdd={addSelection} />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {selections.map((selection) => (
              <div
                key={selection.gameId}
                className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <div>
                  <p className="font-semibold">{`${selection.gameDetails.homeTeam} vs ${selection.gameDetails.awayTeam}`}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your Pick:{" "}
                    <span className="font-bold">{selection.outcome}</span> @{" "}
                    {selection.odds.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeSelection(selection.gameId)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                  title="Remove selection"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t dark:border-gray-700">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bet Type
              </label>
              <select
                value={betType}
                onChange={(e) => setBetType(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
                disabled={selections.length < 2}
              >
                <option value="Single">Singles</option>
                <option value="Multi" disabled={selections.length < 2}>
                  Multi (Accumulator)
                </option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="stake"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {isMultiBet ? "Stake ($)" : "Stake per Bet ($)"}
              </label>
              <input
                type="number"
                id="stake"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md dark:bg-gray-600 dark:border-gray-500"
                placeholder="0.00"
              />
            </div>
            <div className="text-right font-bold text-lg">
              {isMultiBet ? (
                <p className="text-sm">
                  Total Odds:{" "}
                  <span className="text-green-600">{totalOdds.toFixed(2)}</span>
                </p>
              ) : (
                <p className="text-sm">
                  Total Stake:{" "}
                  <span className="text-red-600">{`$${totalStake.toFixed(
                    2
                  )}`}</span>
                </p>
              )}
              <p>
                Potential Payout:{" "}
                <span className="text-green-600">
                  ${potentialPayout.toFixed(2)}
                </span>
              </p>
            </div>
            <Button
              onClick={handlePlaceBet}
              disabled={isLoading}
              loading={isLoading}
              className="w-full mt-4"
            >
              {isLoading ? "Placing Bet..." : "Place Bet"}
            </Button>
            <Button
              onClick={clearSelections}
              variant="outline"
              className="w-full mt-2"
            >
              Clear Slip
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default BetSlip;
