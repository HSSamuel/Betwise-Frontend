import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import Spinner from "../../components/ui/Spinner";
import api from "../../services/api";

const SocialAuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Changed from 'login' to 'setUser' for direct state update
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const completeSocialLogin = async () => {
      // FIX: Read tokens from the URL query parameters
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      if (accessToken && refreshToken) {
        try {
          // Store tokens and update API headers
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          // Fetch the full user profile with the new token
          const { user } = await require("../../services/authService").getMe();

          if (user) {
            setUser(user); // Set the user in the auth context
            toast.success(`Welcome, ${user.firstName}!`);
            navigate("/"); // Redirect to homepage
          } else {
            throw new Error("Could not retrieve user profile.");
          }
        } catch (err) {
          console.error("Social login finalization failed:", err);
          setError("An error occurred while finalizing your login.");
          toast.error("An error occurred. Please try logging in again.");
          setTimeout(() => navigate("/login"), 3000);
        }
      } else {
        // Handle case where tokens are not in the URL
        setError("Authentication tokens were not found.");
        toast.error("Authentication failed. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    completeSocialLogin();
  }, [navigate, searchParams, setUser]);

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
