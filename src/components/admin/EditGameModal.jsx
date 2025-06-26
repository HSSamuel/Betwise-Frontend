import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { adminUpdateGame } from "../../services/adminService"; // Assuming this function will be created
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

const EditGameModal = ({ isOpen, onClose, onGameUpdated, game }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (game) {
      setFormData({
        homeTeam: game.homeTeam || "",
        awayTeam: game.awayTeam || "",
        league: game.league || "",
        status: game.status || "upcoming",
        matchDate: game.matchDate
          ? new Date(game.matchDate).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [game]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminUpdateGame(game._id, formData);
      toast.success("Game updated successfully!");
      onGameUpdated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update game.");
    } finally {
      setLoading(false);
    }
  };

  if (!game) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Game: ${game.homeTeam} vs ${game.awayTeam}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="homeTeam"
          value={formData.homeTeam}
          onChange={handleChange}
          placeholder="Home Team"
          required
        />
        <Input
          name="awayTeam"
          value={formData.awayTeam}
          onChange={handleChange}
          placeholder="Away Team"
          required
        />
        <Input
          name="league"
          value={formData.league}
          onChange={handleChange}
          placeholder="League"
          required
        />
        <Input
          name="matchDate"
          type="datetime-local"
          value={formData.matchDate}
          onChange={handleChange}
          required
        />
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="finished">Finished</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditGameModal;
