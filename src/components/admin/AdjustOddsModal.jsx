// In: Bet/Frontend/src/components/admin/AdjustOddsModal.jsx

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useApi } from "../../hooks/useApi";
import { adminAdjustOdds } from "../../services/adminService";

const AdjustOddsModal = ({ isOpen, onClose, game, onOddsAdjusted }) => {
  const [odds, setOdds] = useState({ home: "", away: "", draw: "" });
  const { loading, request: submitOddsChange } = useApi(adminAdjustOdds);

  useEffect(() => {
    if (game && game.odds) {
      setOdds({
        home: game.odds.home,
        away: game.odds.away,
        draw: game.odds.draw,
      });
    }
  }, [game]);

  const handleChange = (e) => {
    setOdds({ ...odds, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newOdds = {
      home: parseFloat(odds.home),
      away: parseFloat(odds.away),
      draw: parseFloat(odds.draw),
    };

    const result = await submitOddsChange(game._id, newOdds);
    if (result) {
      toast.success("Odds updated successfully!");
      onOddsAdjusted(); // This will refetch the data on the main page
      onClose();
    }
  };

  if (!game) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adjust Odds for ${game.gameDetails.homeTeam} vs ${game.gameDetails.awayTeam}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="home">
            Home Win Odds
          </label>
          <Input
            type="number"
            name="home"
            id="home"
            value={odds.home}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="draw">
            Draw Odds
          </label>
          <Input
            type="number"
            name="draw"
            id="draw"
            value={odds.draw}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="away">
            Away Win Odds
          </label>
          <Input
            type="number"
            name="away"
            id="away"
            value={odds.away}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdjustOddsModal;
