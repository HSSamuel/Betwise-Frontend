import React, { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "../../services/userService";
import Button from "../ui/Button";
import Input from "../ui/Input";

const ChangePasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      return toast.error("New passwords do not match.");
    }
    setLoading(true);
    try {
      await changePassword(passwords);
      toast.success("Password changed successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="currentPassword">
          Current Password
        </label>
        <Input
          type="password"
          name="currentPassword"
          id="currentPassword"
          value={passwords.currentPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="newPassword">
          New Password
        </label>
        <Input
          type="password"
          name="newPassword"
          id="newPassword"
          value={passwords.newPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium"
          htmlFor="confirmNewPassword"
        >
          Confirm New Password
        </label>
        <Input
          type="password"
          name="confirmNewPassword"
          id="confirmNewPassword"
          value={passwords.confirmNewPassword}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" loading={loading} disabled={loading}>
        Update Password
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
