import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { requestPasswordReset } from "../../services/authService";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    try {
      await requestPasswordReset(email);
      // We show a generic success message regardless of whether the email exists
      // This is a security best practice to prevent email enumeration.
      setSubmitted(true);
    } catch (error) {
      // Also show a generic message on error to prevent leaking info
      setSubmitted(true);
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        {submitted ? (
          <div className="text-center">
            <p className="text-gray-600">
              If an account with that email exists, we've sent a password reset
              link to it.
            </p>
            <Link
              to="/login"
              className="text-green-600 hover:underline mt-4 inline-block"
            >
              &larr; Back to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-500 mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <form onSubmit={handleSubmit}>
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
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                Send Reset Link
              </Button>
            </form>
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-sm text-green-600 hover:underline"
              >
                Remembered your password? Login
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
