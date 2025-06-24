import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

const RankingModal = ({ isOpen, onClose, onSave, loading, ranking }) => {
  const [formData, setFormData] = useState({
    teamName: "",
    ranking: 75,
  });

  useEffect(() => {
    if (ranking) {
      setFormData({
        teamName: ranking.teamName || "",
        ranking: ranking.ranking || 75,
      });
    } else {
      setFormData({ teamName: "", ranking: 75 });
    }
  }, [ranking, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ranking ? "Edit Ranking" : "Create Ranking"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="teamName"
          value={formData.teamName}
          onChange={handleChange}
          placeholder="Team Name"
          required
          disabled={!!ranking}
        />
        <Input
          name="ranking"
          type="number"
          value={formData.ranking}
          onChange={handleChange}
          placeholder="Ranking (1-100)"
          required
          min="1"
          max="100"
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {ranking ? "Save Changes" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RankingModal;
