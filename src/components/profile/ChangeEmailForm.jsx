import React, { useState } from "react";
import toast from "react-hot-toast";
import { changeEmail } from "../../services/userService";
import Button from "../ui/Button";
import Input from "../ui/Input";

const ChangeEmailForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    newEmail: "",
    currentPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changeEmail(formData);
      toast.success(
        "Email changed successfully! Please check your inbox for verification if required."
      );
      setFormData({ newEmail: "", currentPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to change email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="newEmail">
          New Email Address
        </label>
        <Input
          type="email"
          name="newEmail"
          id="newEmail"
          value={formData.newEmail}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium"
          htmlFor="currentPassword-email"
        >
          Confirm with Current Password
        </label>
        <Input
          type="password"
          name="currentPassword"
          id="currentPassword-email"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" loading={loading} disabled={loading}>
        Update Email
      </Button>
    </form>
  );
};

export default ChangeEmailForm;
