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
      // FIX: Add logic to display the error message from the backend in a toast pop-up.
      const errorMessage =
        error.response?.data?.msg ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      console.error(error); // Keep the console log for debugging
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
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="password">
          Password
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
