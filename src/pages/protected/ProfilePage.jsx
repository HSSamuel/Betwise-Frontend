import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { getProfile, uploadProfilePicture } from "../../services/userService";
import { getBettingFeedback } from "../../services/aiService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import EditProfileModal from "../../components/profile/EditProfileModal";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaCamera,
  FaBrain,
  FaShieldAlt,
  FaCog,
} from "react-icons/fa";

const ProfilePage = () => {
  const {
    data: profile,
    loading,
    error,
    request: fetchProfile,
  } = useApi(getProfile);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const {
    data: feedbackData,
    loading: feedbackLoading,
    request: fetchFeedback,
  } = useApi(getBettingFeedback);

  const { loading: uploading, request: submitUpload } =
    useApi(uploadProfilePicture);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    const result = await submitUpload(formData);
    if (result) {
      toast.success("Profile picture updated!");
      fetchProfile();
    }
  };

  const handleProfileUpdate = () => {
    fetchProfile();
  };

  const handleGetFeedback = async () => {
    const result = await fetchFeedback();
    if (result) {
      setFeedbackModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  // --- FIX IS HERE: ADD AN EXPLICIT CHECK FOR THE PROFILE OBJECT ---
  // This prevents the component from trying to render with null data.
  if (!profile) {
    return null; // or return a loading spinner
  }

  return (
    <div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={profile}
        onProfileUpdate={handleProfileUpdate}
      />

      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title="Your AI Betting Feedback"
      >
        {feedbackLoading ? (
          <Spinner />
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            {feedbackData?.feedback}
          </p>
        )}
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="!p-0">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-t-lg">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={
                      profile.profilePicture ||
                      `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=random&color=fff`
                    }
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-600"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                    className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100"
                    title="Change profile picture"
                  >
                    {uploading ? (
                      <Spinner size="sm" />
                    ) : (
                      <FaCamera className="text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                </div>
                <div className="text-white">
                  <h2 className="text-3xl font-bold">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-400 text-lg">@{profile.username}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FaEnvelope className="text-gray-400 mr-4" size={20} />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FaCalendarAlt className="text-gray-400 mr-4" size={20} />
                <span>
                  Joined on: {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditModalOpen(true)}
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <h3 className="font-bold text-xl mb-4 flex items-center">
              <FaShieldAlt className="mr-3 text-blue-500" />
              Betting Limits
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Weekly Bet Count:
                </span>
                <span className="font-semibold">
                  {profile.limits.weeklyBetCount.limit > 0
                    ? profile.limits.weeklyBetCount.limit
                    : "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Weekly Stake Limit:
                </span>
                <span className="font-semibold">
                  {profile.limits.weeklyStakeAmount.limit > 0
                    ? `$${profile.limits.weeklyStakeAmount.limit}`
                    : "Not set"}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-xl mb-4 flex items-center">
              <FaCog className="mr-3 text-gray-500" />
              Account Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="secondary"
                onClick={handleGetFeedback}
                loading={feedbackLoading}
                className="w-full"
              >
                <FaBrain className="mr-2" />
                Get AI Betting Feedback
              </Button>
              <Link to="/settings" className="w-full">
                <Button variant="outline" className="w-full">
                  Change Password or Email
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
