import React, { useState } from "react";
import toast from "react-hot-toast";
import { setPassword } from "../../services/userService";
import { useApi } from "../../hooks/useApi";
import Button from "../ui/Button";
import Input from "../ui/Input";

const SetPasswordForm = ({ onPasswordSet }) => {
  const { loading, request: submitNewPassword } = useApi(setPassword);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    const result = await submitNewPassword(passwords);
    if (result) {
      toast.success("Password has been set successfully!");
      onPasswordSet(); // This will hide the form
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Your account was created using a social login, so it doesn't have a
        password yet. Create one now to use all account features and log in
        directly with your email.
      </p>
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
        <label className="block text-sm font-medium" htmlFor="confirmPassword">
          Confirm New Password
        </label>
        <Input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={passwords.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" loading={loading} disabled={loading}>
        Set Password
      </Button>
    </form>
  );
};

export default SetPasswordForm;
