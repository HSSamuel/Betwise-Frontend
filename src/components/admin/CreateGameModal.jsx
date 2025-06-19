import React, { useState } from "react";
import toast from "react-hot-toast";
import { createGame } from "../../services/gameService"; // Corrected import path
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

const CreateGameModal = ({ isOpen, onClose, onGameCreated }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      homeTeam: formData.get("homeTeam"),
      awayTeam: formData.get("awayTeam"),
      league: formData.get("league"),
      matchDate: formData.get("matchDate"),
      odds: {
        home: parseFloat(formData.get("homeOdds")),
        away: parseFloat(formData.get("awayOdds")),
        draw: parseFloat(formData.get("drawOdds")),
      },
    };

    setLoading(true);
    try {
      await createGame(data);
      toast.success("Game created successfully!");
      onGameCreated();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.msg ||
        "Failed to create game.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Game">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input name="homeTeam" placeholder="Home Team" required />
          <Input name="awayTeam" placeholder="Away Team" required />
          <Input name="league" placeholder="League" required />
          <Input name="matchDate" type="datetime-local" required />
          <Input
            name="homeOdds"
            type="number"
            step="0.01"
            placeholder="Home Odds"
            required
          />
          <Input
            name="awayOdds"
            type="number"
            step="0.01"
            placeholder="Away Odds"
            required
          />
          <Input
            name="drawOdds"
            type="number"
            step="0.01"
            placeholder="Draw Odds"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            Create Game
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGameModal;
