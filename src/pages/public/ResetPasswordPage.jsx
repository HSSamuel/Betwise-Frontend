import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../services/authService";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password, confirmPassword);
      toast.success("Password has been reset successfully!");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.msg ||
        "Failed to reset password. The token may be invalid or expired.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              New Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full"
          >
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
