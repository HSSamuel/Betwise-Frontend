import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useApi } from "../../hooks/useApi";
import { updateProfile } from "../../services/userService";

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    state: "",
  });
  const { loading, request: submitUpdate } = useApi(updateProfile);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        state: user.state || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitUpdate(formData); // Capture the result
    if (result) {
      toast.success("Profile updated successfully!");
      onProfileUpdate(result.user); // Pass the updated user object back
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Your Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="firstName">
            First Name
          </label>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="lastName">
            Last Name
          </label>
          <Input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="state">
            State
          </label>
          <Input
            type="text"
            name="state"
            id="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g., Lagos"
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

export default EditProfileModal;
