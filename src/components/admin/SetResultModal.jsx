import React, { useState } from "react";
import toast from "react-hot-toast";
import { setResult } from "../../services/gameService"; // Corrected import path
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const SetResultModal = ({ isOpen, onClose, onResultSubmitted, game }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResultValue] = useState("");

  if (!game) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!result) {
      toast.error("Please select a result.");
      return;
    }
    setLoading(true);
    try {
      await setResult(game._id, result);
      toast.success("Result set and bets settled!");
      onResultSubmitted();
      onClose();
    } catch (error) {
      const message = error.response?.data?.msg || "Failed to set result.";
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
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Select Winner</label>
          <select
            value={result}
            onChange={(e) => setResultValue(e.target.value)}
            className="w-full p-2 border rounded"
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
        <div className="flex justify-end space-x-2">
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
