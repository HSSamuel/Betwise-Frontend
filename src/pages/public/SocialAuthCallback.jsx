// In: src/pages/public/SocialAuthCallback.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
// FIX: Removed the duplicate import statement below
import * as authService from "../../services/authService";
import { toast } from "react-hot-toast";
import Spinner from "../../components/ui/Spinner";

const SocialAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const completeSocialLogin = async () => {
      try {
        const { user } = await authService.getMe();

        if (user) {
          login(user);
          toast.success(`Welcome, ${user.firstName}!`);
          navigate("/");
        } else {
          throw new Error("Authentication failed. Please try again.");
        }
      } catch (err) {
        console.error("Social login failed:", err);
        const errorMessage =
          err.response?.data?.msg ||
          err.message ||
          "An unknown error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    completeSocialLogin();
  }, [navigate, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Authentication Failed
            </h1>
            <p className="text-gray-600">{error}</p>
            <p className="text-gray-600 mt-2">Redirecting to login...</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Finalizing login...
            </h1>
            <p className="text-gray-600">
              Please wait while we securely log you in.
            </p>
            <Spinner className="mt-4" />
          </>
        )}
      </div>
    </div>
  );
};

export default SocialAuthCallback;
