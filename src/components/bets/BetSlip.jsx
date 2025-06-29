import React, { useState, useEffect, useMemo } from "react";

import toast from "react-hot-toast";

import { useBetSlip } from "../../contexts/BetSlipContext";

import { useApi } from "../../hooks/useApi";

import {
  placeMultiBet,
  placeMultipleSingles,
  createShareableSlip,
} from "../../services/betService";

import {
  getRecommendedGames,
  analyzeBetSlip,
  getBetSlipSuggestions,
} from "../../services/aiService";

import { useAuth } from "../../contexts/AuthContext";

import { useWallet } from "../../contexts/WalletContext";

import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";

import Input from "../ui/Input";

import { FaLightbulb, FaPlus, FaShareAlt, FaBrain } from "react-icons/fa";

import Spinner from "../ui/Spinner";

const HotTip = ({ tip, onAdd }) => {
  if (!tip) return null;

  const outcomes = [
    { outcome: "A", odds: tip.odds.home, label: "Home Win" },

    { outcome: "B", odds: tip.odds.away, label: "Away Win" },

    { outcome: "Draw", odds: tip.odds.draw, label: "Draw" },
  ];

  const randomIndex = Math.floor(Math.random() * outcomes.length);

  const randomOutcome = outcomes[randomIndex];

  return (
    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
           {" "}
      <p className="text-xs font-bold">
                {tip.homeTeam} vs {tip.awayTeam}     {" "}
      </p>
           {" "}
      <p className="text-xs text-gray-500 dark:text-gray-400">
                Suggested Bet:        {" "}
        <span className="font-semibold">{randomOutcome.label}</span>     {" "}
      </p>
           {" "}
      <Button
        className="w-full mt-2"
        variant="outline"
        size="sm"
        onClick={() =>
          onAdd({
            gameId: tip._id,

            gameDetails: { homeTeam: tip.homeTeam, awayTeam: tip.awayTeam },

            outcome: randomOutcome.outcome,

            odds: randomOutcome.odds,
          })
        }
      >
                <FaPlus className="mr-2" /> Add to Slip      {" "}
      </Button>
         {" "}
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

  const { user } = useAuth();

  const { balance, fetchWalletBalance } = useWallet();

  const navigate = useNavigate();

  const [keepSelections, setKeepSelections] = useState(false);

  const {
    loading: analysisLoading,

    request: fetchAnalysis,

    data: analysisData,

    error: analysisError,
  } = useApi(analyzeBetSlip);

  const {
    loading: suggestionsLoading,

    request: fetchSuggestions,

    data: suggestionsData,
  } = useApi(getBetSlipSuggestions);

  const { request: placeSinglesRequest, loading: singleLoading } =
    useApi(placeMultipleSingles);

  const { request: placeMultiRequest, loading: multiLoading } =
    useApi(placeMultiBet);

  const { loading: sharing, request: shareSlip } = useApi(createShareableSlip);

  const { loading: tipLoading, request: fetchHotTip } =
    useApi(getRecommendedGames);

  const [hotTips, setHotTips] = useState([]);

  const isLoading = singleLoading || multiLoading;

  useEffect(() => {
    if (betType === "Multi" && selections.length < 2) {
      setBetType("Single");
    }
  }, [selections.length, betType]);

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

    if (result?.games?.length > 0) {
      setHotTips(result.games);
    } else {
      toast.error("Could not fetch new tips at this time.");

      setHotTips([]);
    }
  };

  const handleAddTipToSlip = (tipSelection) => {
    addSelection(tipSelection);
  };

  const handleSuccess = (data) => {
    toast.success(data.msg || "Bets placed successfully!");

    if (!keepSelections) {
      clearSelections();
    }

    setStake("");

    setHotTips([]);

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

  const handleSetBetType = (type) => {
    if (type === "Multi" && selections.length < 2) {
      toast.error("Add at least one more selection to create a multi-bet.");

      return;
    }

    setBetType(type);
  };

  const handleGetSuggestions = () => {
    if (selections.length > 0) {
      fetchSuggestions({ selections, totalOdds });
    }
  };

  const isMultiBet = betType === "Multi" && selections.length > 1;

  const handleQuickStake = (amount) => {
    const currentStake = parseFloat(stake) || 0;

    if (amount === "Max") {
      const maxStake = isMultiBet ? balance : balance / selections.length;

      setStake(maxStake > 0 ? maxStake.toFixed(2) : "0");
    } else {
      setStake((currentStake + amount).toString());
    }
  };

  const handleAnalyzeBet = () => {
    if (selections.length > 1) {
      fetchAnalysis(selections);
    }
  };

  const stakeAmount = parseFloat(stake) || 0;

  const totalStake = isMultiBet ? stakeAmount : stakeAmount * selections.length;

  const potentialPayout = isMultiBet
    ? stakeAmount * totalOdds
    : selections.reduce((acc, sel) => acc + sel.odds * stakeAmount, 0);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
           {" "}
      <h3 className="text-lg font-bold border-b pb-2 mb-4 dark:border-gray-700">
                Bet Slip      {" "}
      </h3>
           {" "}
      {selections.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
                    <p className="mb-4">Click odds on a match to add a bet.</p> 
                 {" "}
          <Button
            onClick={handleGetHotTip}
            loading={tipLoading}
            disabled={tipLoading}
          >
                        <FaLightbulb className="mr-2" /> Get AI Quick Tips      
               {" "}
          </Button>
                 {" "}
        </div>
      ) : (
        <>
                   {" "}
          <div className="space-y-2">
                       {" "}
            {selections.map((selection) => (
              <div
                key={selection.gameId}
                className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                               {" "}
                <div>
                                   {" "}
                  <p className="font-semibold">{`${selection.gameDetails.homeTeam} vs ${selection.gameDetails.awayTeam}`}</p>
                                   {" "}
                  <p className="text-gray-600 dark:text-gray-300">
                                        Your Pick:                    {" "}
                    <span className="font-bold">{selection.outcome}</span> @    
                                    {selection.odds.toFixed(2)}                 {" "}
                  </p>
                                 {" "}
                </div>
                               {" "}
                <button
                  onClick={() => removeSelection(selection.gameId)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                  title="Remove selection"
                >
                                    &times;                {" "}
                </button>
                             {" "}
              </div>
            ))}
                     {" "}
          </div>
                   {" "}
          <div className="mt-4 pt-4 border-t dark:border-gray-700">
                       {" "}
            <div className="mb-4">
                           {" "}
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bet Type              {" "}
              </label>
                           {" "}
              <div className="flex w-full">
                               {" "}
                <button
                  type="button"
                  onClick={() => handleSetBetType("Single")}
                  className={`w-1/2 p-2 text-sm font-semibold border-y border-l rounded-l-md transition-colors ${
                    betType === "Single"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                                    Singles                {" "}
                </button>
                               {" "}
                <button
                  type="button"
                  onClick={() => handleSetBetType("Multi")}
                  className={`w-1/2 p-2 text-sm font-semibold border-y border-r rounded-r-md transition-colors ${
                    betType === "Multi"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-600"
                  } ${
                    selections.length < 2 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={selections.length < 2}
                >
                                    Multi                {" "}
                </button>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div className="mb-4">
                           {" "}
              <label
                htmlFor="stake"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                               {" "}
                {isMultiBet ? "Total Stake ($)" : "Stake per Bet ($)"}         
                   {" "}
              </label>
                           {" "}
              <Input
                type="number"
                id="stake"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full p-2 mt-1"
                placeholder="0.00"
              />
                         {" "}
            </div>
                       {" "}
            <div className="grid grid-cols-4 gap-2 mb-4">
                           {" "}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleQuickStake(5)}
              >
                                +$5              {" "}
              </Button>
                           {" "}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleQuickStake(10)}
              >
                                +$10              {" "}
              </Button>
                           {" "}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleQuickStake(50)}
              >
                                +$50              {" "}
              </Button>
                           {" "}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickStake("Max")}
              >
                                Max              {" "}
              </Button>
                         {" "}
            </div>
                        {/* This is the corrected block for the AI buttons */} 
                     {" "}
            <div className="my-4 space-y-2">
                           {" "}
              {selections.length > 1 && (
                <>
                                   {" "}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleAnalyzeBet}
                    loading={analysisLoading}
                    disabled={analysisLoading}
                  >
                                        <FaBrain className="mr-2" />           
                            Analyze Bet with AI                  {" "}
                  </Button>
                                    {analysisLoading && <Spinner />}           
                       {" "}
                  {analysisError && (
                    <p className="text-red-500 text-xs mt-2">{analysisError}</p>
                  )}
                                   {" "}
                  {analysisData && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-gray-700/50 text-xs rounded-lg border border-blue-200 dark:border-blue-900">
                                            {analysisData.analysis}             
                           {" "}
                    </div>
                  )}
                                 {" "}
                </>
              )}
                           {" "}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGetSuggestions}
                loading={suggestionsLoading}
                disabled={suggestionsLoading}
              >
                                <FaLightbulb className="mr-2" />               
                Get Bet Suggestions              {" "}
              </Button>
                            {suggestionsLoading && <Spinner />}             {" "}
              {suggestionsData && (
                <div className="mt-2 space-y-2 text-xs">
                                   {" "}
                  {suggestionsData.combinationSuggestions?.map(
                    (suggestion, index) => (
                      <div
                        key={index}
                        className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                      >
                                               {" "}
                        <p className="font-semibold">
                                                   {" "}
                          {suggestion.gameDetails.homeTeam} vs                  
                                  {suggestion.gameDetails.awayTeam}             
                                   {" "}
                        </p>
                                               {" "}
                        <p>Suggestion: {suggestion.outcome}</p>                 
                             {" "}
                        <p className="text-xs">{suggestion.justification}</p>   
                                         {" "}
                      </div>
                    )
                  )}
                                   {" "}
                  {suggestionsData.alternativeBet && (
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                           {" "}
                      <p className="font-semibold">Alternative Bet</p>         
                                 {" "}
                      <p>{suggestionsData.alternativeBet.explanation}</p>       
                                 {" "}
                    </div>
                  )}
                                 {" "}
                </div>
              )}
                         {" "}
            </div>
                       {" "}
            <div className="text-right font-bold text-lg">
                           {" "}
              {isMultiBet ? (
                <p className="text-sm">
                                    Total Odds:                  {" "}
                  <span className="text-green-600">{totalOdds.toFixed(2)}</span>
                                 {" "}
                </p>
              ) : (
                <p className="text-sm">
                                    Total Stake:                  {" "}
                  <span className="text-red-600">{`$${totalStake.toFixed(
                    2
                  )}`}</span>
                                 {" "}
                </p>
              )}
                           {" "}
              <p>
                                Potential Payout:                {" "}
                <span className="text-green-600">
                                    ${potentialPayout.toFixed(2)}               {" "}
                </span>
                             {" "}
              </p>
                         {" "}
            </div>
                       {" "}
            <div className="mt-4">
                           {" "}
              <label className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                               {" "}
                <input
                  type="checkbox"
                  checked={keepSelections}
                  onChange={(e) => setKeepSelections(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-green-600 rounded"
                />
                               {" "}
                <span className="ml-2">Keep selections after placing bet</span> 
                           {" "}
              </label>
                         {" "}
            </div>
                       {" "}
            <Button
              onClick={handlePlaceBet}
              disabled={isLoading}
              loading={isLoading}
              className="w-full mt-4"
            >
                            {isLoading ? "Placing Bet..." : "Place Bet"}       
                 {" "}
            </Button>
                       {" "}
            <div className="flex space-x-2 mt-2">
                           {" "}
              <Button
                onClick={clearSelections}
                variant="outline"
                className="w-1/3"
              >
                                Clear Slip              {" "}
              </Button>
                           {" "}
              <Button
                onClick={handleGetHotTip}
                variant="outline"
                className="w-1/3"
                loading={tipLoading}
              >
                                <FaPlus className="mr-1" /> More              {" "}
              </Button>
                           {" "}
              <Button
                onClick={handleShareBet}
                variant="secondary"
                className="w-1/3"
                loading={sharing}
              >
                                <FaShareAlt className="mr-2" /> Share          
                   {" "}
              </Button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </>
      )}
           {" "}
      {hotTips.length > 0 && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
                    <h4 className="font-semibold text-sm mb-2">Quick Tips</h4> 
                 {" "}
          {hotTips.map((tip) => (
            <HotTip key={tip._id} tip={tip} onAdd={handleAddTipToSlip} />
          ))}
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
};

export default BetSlip;
