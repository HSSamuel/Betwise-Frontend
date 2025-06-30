import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { setResult } from "../../services/gameService";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input"; // Make sure Input is imported

const SetResultModal = ({ isOpen, onClose, onResultSubmitted, game }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResultValue] = useState("");

  // --- NEW: State for scores ---
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  useEffect(() => {
    // Reset form when modal opens or game changes
    if (isOpen) {
      setResultValue("");
      setHomeScore("");
      setAwayScore("");
    }
  }, [isOpen, game]);

  if (!game) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!result) return toast.error("Please select a result.");

    // --- NEW: Validation for scores ---
    if (homeScore === "" || awayScore === "") {
      return toast.error("Please enter both home and away scores.");
    }

    setLoading(true);
    try {
      // Pass the new score values to the service function
      await setResult(game._id, result, homeScore, awayScore);
      toast.success("Result set and bets settled!");
      onResultSubmitted();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.msg ||
        "Failed to set result.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Set Result for ${game.homeTeam} vs ${game.awayTeam}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Select Winner</label>
          <select
            value={result}
            onChange={(e) => setResultValue(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          >
            <option value="" disabled>
              -- Select Result --
            </option>
            <option value="A">{game.homeTeam} (Home)</option>
            <option value="B">{game.awayTeam} (Away)</option>
            <option value="Draw">Draw</option>
          </select>
        </div>

        {/* --- NEW: Score Input Fields --- */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium" htmlFor="homeScore">
              {game.homeTeam} Score
            </label>
            <Input
              id="homeScore"
              type="number"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium" htmlFor="awayScore">
              {game.awayTeam} Score
            </label>
            <Input
              id="awayScore"
              type="number"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            Submit Result
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SetResultModal;
