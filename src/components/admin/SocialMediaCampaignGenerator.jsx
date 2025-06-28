import React, { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { generateSocialMediaCampaign } from "../../services/adminService";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";

const SocialMediaCampaignGenerator = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ league: "", dateRange: "" });
  const {
    data,
    loading,
    error,
    request: fetchCampaign,
  } = useApi(generateSocialMediaCampaign);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.league || !formData.dateRange) {
      toast.error("Please provide both a league and a date.");
      return;
    }
    fetchCampaign(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Social Media Campaign Generator"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="league"
          value={formData.league}
          onChange={handleChange}
          placeholder="League (e.g., Premier League)"
          required
        />
        <Input
          name="dateRange"
          type="date"
          value={formData.dateRange}
          onChange={handleChange}
          required
        />
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            Generate Campaign
          </Button>
        </div>
      </form>
      {loading && (
        <div className="mt-4">
          <Spinner />
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* This is the corrected block. 
              The container for the results now has a maximum height and will scroll if the content overflows.
            */}
      {data && (
        <div className="mt-4 space-y-4 max-h-72 overflow-y-auto pr-2">
          {data.campaign.map((post, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <p className="whitespace-pre-wrap text-sm">{post}</p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default SocialMediaCampaignGenerator;
