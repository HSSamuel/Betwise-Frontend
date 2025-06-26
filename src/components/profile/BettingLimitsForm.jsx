import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { setBettingLimits, getProfile } from "../../services/userService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Spinner from "../ui/Spinner";
import { generateLimitSuggestion } from "../../services/aiService";
import { useApi } from "../../hooks/useApi";
import { FaBrain, FaTimes } from "react-icons/fa";

const BettingLimitsForm = () => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [limits, setLimits] = useState({
    weeklyBetCountLimit: 0,
    weeklyStakeAmountLimit: 0,
  });

  // State to hold the AI suggestion object
  const [suggestion, setSuggestion] = useState(null);

  const { loading: suggestionLoading, request: fetchSuggestion } = useApi(
    generateLimitSuggestion
  );

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const profile = await getProfile();
        setLimits({
          weeklyBetCountLimit: profile.limits.weeklyBetCount.limit || 0,
          weeklyStakeAmountLimit: profile.limits.weeklyStakeAmount.limit || 0,
        });
      } catch (error) {
        toast.error("Could not load current limits.");
      } finally {
        setPageLoading(false);
      }
    };
    fetchLimits();
  }, []);

  const handleChange = (e) =>
    setLimits({ ...limits, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setBettingLimits({
        weeklyBetCountLimit: Number(limits.weeklyBetCountLimit),
        weeklyStakeAmountLimit: Number(limits.weeklyStakeAmountLimit),
      });
      toast.success("Betting limits updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update limits.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestion = async () => {
    const result = await fetchSuggestion();
    if (result) {
      // Set the entire suggestion object to state instead of just a toast
      setSuggestion(result);
    }
  };

  const applySuggestion = () => {
    if (suggestion && suggestion.suggestedLimits) {
      setLimits({
        weeklyBetCountLimit: suggestion.suggestedLimits.betCount,
        weeklyStakeAmountLimit: suggestion.suggestedLimits.stakeAmount,
      });
      toast.success("Suggestion applied!");
    }
    setSuggestion(null); // Close the suggestion box
  };

  if (pageLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Set limits on your weekly activity. Set to 0 to disable a limit. These
        will reset weekly.
      </p>

      <div className="my-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleGetSuggestion}
          loading={suggestionLoading}
          className="w-full"
        >
          <FaBrain className="mr-2" />
          Get AI Suggestion
        </Button>
      </div>

      {/* Persistent Suggestion Box */}
      {suggestion && (
        <div className="relative p-4 pr-10 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg text-sm text-green-800 dark:text-green-200">
          <button
            type="button"
            onClick={() => setSuggestion(null)}
            className="absolute top-2 right-2 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
            aria-label="Dismiss suggestion"
          >
            <FaTimes />
          </button>
          <p className="font-semibold mb-2">AI Suggestion</p>
          <p className="mb-3">{suggestion.suggestion}</p>
          {suggestion.suggestedLimits && (
            <Button type="button" size="sm" onClick={applySuggestion}>
              Apply this suggestion
            </Button>
          )}
        </div>
      )}

      <div>
        <label
          className="block text-sm font-medium"
          htmlFor="weeklyBetCountLimit"
        >
          Weekly Bet Count Limit
        </label>
        <Input
          type="number"
          name="weeklyBetCountLimit"
          id="weeklyBetCountLimit"
          value={limits.weeklyBetCountLimit}
          onChange={handleChange}
          required
          min="0"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium"
          htmlFor="weeklyStakeAmountLimit"
        >
          Weekly Stake Amount Limit ($)
        </label>
        <Input
          type="number"
          name="weeklyStakeAmountLimit"
          id="weeklyStakeAmountLimit"
          value={limits.weeklyStakeAmountLimit}
          onChange={handleChange}
          required
          min="0"
        />
      </div>
      <Button type="submit" loading={loading} disabled={loading}>
        Set Limits
      </Button>
    </form>
  );
};

export default BettingLimitsForm;
