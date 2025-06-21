// In: Bet/Frontend/src/components/auth/LoginForm.jsx

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import Input from "../ui/Input";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // FIX: Added state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="mb-2">
        {" "}
        {/* Adjusted margin for the new element */}
        <label className="block text-gray-700 mb-2" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          name="password"
          // FIX: Input type is now dynamic based on the showPassword state
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      {/* FIX: Added the "Show password" checkbox */}
      <div className="mb-6">
        <label className="flex items-center text-sm text-gray-600">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="form-checkbox h-4 w-4 text-green-600 rounded-md border-gray-300 focus:ring-green-500"
          />
          <span className="ml-2">Show password</span>
        </label>
      </div>
      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        className="w-full"
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
