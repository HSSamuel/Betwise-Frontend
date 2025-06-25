import React from "react";
import { useApi } from "../../hooks/useApi";
import { generateSocialPost } from "../../services/aiService";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";

const SocialPostGeneratorModal = ({ isOpen, onClose, game }) => {
  const {
    data,
    loading,
    error,
    request: fetchPost,
  } = useApi(generateSocialPost);

  const handleGenerate = () => {
    if (game?._id) {
      fetchPost(game._id);
    }
  };

  const handleCopyToClipboard = () => {
    if (data?.post) {
      navigator.clipboard.writeText(data.post);
      toast.success("Post copied to clipboard!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Generate Post: ${game?.homeTeam} vs ${game?.awayTeam}`}
    >
      <div className="space-y-4">
        <Button
          onClick={handleGenerate}
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          Generate Social Media Post
        </Button>
        {loading && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}
        {data && (
          <div className="space-y-2">
            <textarea
              readOnly
              value={data.post}
              rows="6"
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            />
            <Button
              onClick={handleCopyToClipboard}
              variant="secondary"
              className="w-full"
            >
              Copy to Clipboard
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SocialPostGeneratorModal;
