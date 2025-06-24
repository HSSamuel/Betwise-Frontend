import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useBetSlip } from "../../contexts/BetSlipContext";
import { useApi } from "../../hooks/useApi";
import {
  placeMultiBet,
  placeMultipleSingles,
  createShareableSlip,
} from "../../services/betService";
import { getGameSuggestions } from "../../services/gameService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input"; // Ensure Input is imported
import { FaLightbulb, FaPlus, FaShareAlt } from "react-icons/fa";

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
      <p className="text-xs font-bold">
        {tip.homeTeam} vs {tip.awayTeam}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Suggested Bet:{" "}
        <span className="font-semibold">{likelyOutcome.label}</span>
      </p>
      <Button
        className="w-full mt-2"
        variant="outline"
        size="sm"
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
  const { loading: sharing, request: shareSlip } = useApi(createShareableSlip);
  const { loading: tipLoading, request: fetchHotTip } =
    useApi(getGameSuggestions);

  const [hotTips, setHotTips] = useState([]);
  const isLoading = singleLoading || multiLoading;

  // --- Smart Defaulting Logic ---
  useEffect(() => {
    if (selections.length >= 2) {
      setBetType("Multi");
    } else {
      setBetType("Single");
    }
  }, [selections.length]);

  const handleShareBet = async () => {
    if (selections.length === 0) {
      toast.error("Add selections to your slip before sharing.");
      return;
    }
    const slipData = {
      selections: selections.map((s) => ({
        gameId: s.gameId,
        outcome: s.outcome,
      })),
      betType: selections.length > 1 ? "multi" : "single",
    };
    const result = await shareSlip(slipData);
    if (result?.shareUrl) {
      navigator.clipboard.writeText(result.shareUrl);
      toast.success("Share link copied to clipboard!");
    }
  };

  const handleGetHotTip = async () => {
    if (!user) {
      toast.error("Please login to get AI-powered tips.");
      return;
    }
    const result = await fetchHotTip();
    if (result?.suggestions?.length > 0) {
      setHotTips(result.suggestions);
    } else {
      toast.error("Could not fetch new tips at this time.");
      setHotTips([]);
    }
  };

  const handleAddTipToSlip = (tipSelection) => {
    addSelection(tipSelection);
    setHotTips((prevTips) =>
      prevTips.filter((t) => t._id !== tipSelection.gameId)
    );
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

    const stakeAmount = parseFloat(stake);
    if (isMultiBet) {
      const betData = {
        stake: stakeAmount,
        selections: selections.map((s) => ({
          gameId: s.gameId,
          outcome: s.outcome,
        })),
      };
      const result = await placeMultiRequest(betData);
      if (result) handleSuccess(result);
    } else {
      const betData = {
        stakePerBet: stakeAmount,
        selections: selections.map((s) => ({
          gameId: s.gameId,
          outcome: s.outcome,
        })),
      };
      const result = await placeSinglesRequest(betData);
      if (result) handleSuccess(result);
    }
  };

  const isMultiBet = betType === "Multi" && selections.length > 1;
  const stakeAmount = parseFloat(stake) || 0;
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
            <FaLightbulb className="mr-2" /> Get AI Quick Tips
          </Button>
          {hotTips.map((tip) => (
            <HotTip key={tip._id} tip={tip} onAdd={handleAddTipToSlip} />
          ))}
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
              <div className="flex w-full">
                <button
                  type="button"
                  onClick={() => setBetType("Single")}
                  className={`w-1/2 p-2 text-sm font-semibold border-y border-l rounded-l-md transition-colors ${
                    betType === "Single"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  Singles
                </button>
                <button
                  type="button"
                  onClick={() => setBetType("Multi")}
                  disabled={selections.length < 2}
                  className={`w-1/2 p-2 text-sm font-semibold border-y border-r rounded-r-md transition-colors disabled:opacity-50 ${
                    betType === "Multi"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  Multi
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="stake"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {isMultiBet ? "Total Stake ($)" : "Stake per Bet ($)"}
              </label>
              <Input
                type="number"
                id="stake"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full p-2 mt-1"
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
                  <span className="text-red-600">${totalStake.toFixed(2)}</span>
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
            <div className="flex space-x-2 mt-2">
              <Button
                onClick={clearSelections}
                variant="outline"
                className="w-full"
              >
                Clear Slip
              </Button>
              <Button
                onClick={handleShareBet}
                variant="secondary"
                className="w-full"
                loading={sharing}
              >
                <FaShareAlt className="mr-2" /> Share
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BetSlip;
