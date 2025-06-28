import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useApi } from "../../hooks/useApi";
// ** FIX: Import the correctly named function 'setGameResult' **
import { setGameResult } from "../../services/gameService";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

const SetResultModal = ({ isOpen, onClose, onResultSubmitted, game }) => {
  const [scores, setScores] = useState({ home: "", away: "" });
  const {
    loading,
    error,
    request: submitResult,
  } = useApi(setGameResult, { showToastOnError: true });

  useEffect(() => {
    if (game) {
      setScores({
        home: game.scores?.home?.toString() || "",
        away: game.scores?.away?.toString() || "",
      });
    }
  }, [game]);

  const handleChange = (e) => {
    setScores({ ...scores, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (scores.home === "" || scores.away === "") {
      return toast.error("Both scores are required.");
    }

    const resultData = {
      homeScore: parseInt(scores.home, 10),
      awayScore: parseInt(scores.away, 10),
    };

    // ** FIX: Call the correctly named function 'submitResult' (which uses setGameResult) **
    const result = await submitResult(game._id, resultData);

    if (result) {
      toast.success("Game result has been set successfully!");
      onResultSubmitted();
      onClose();
    }
  };

  if (!game) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Set Result for: ${game.homeTeam} vs ${game.awayTeam}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="home"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {game.homeTeam} (Home)
          </label>
          <Input
            id="home"
            name="home"
            type="number"
            min="0"
            value={scores.home}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="away"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {game.awayTeam} (Away)
          </label>
          <Input
            id="away"
            name="away"
            type="number"
            min="0"
            value={scores.away}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div className="flex justify-end pt-2 space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Set Final Score
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SetResultModal;
