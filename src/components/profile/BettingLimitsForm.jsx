import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { setBettingLimits, getProfile } from "../../services/userService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Spinner from "../ui/Spinner";

const BettingLimitsForm = () => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [limits, setLimits] = useState({
    weeklyBetCountLimit: 0,
    weeklyStakeAmountLimit: 0,
  });

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

  if (pageLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">
        Set limits on your weekly activity. Set to 0 to disable a limit. These
        will reset weekly.
      </p>
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
