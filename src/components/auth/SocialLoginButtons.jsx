import React from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Button from "../ui/Button";

const SocialLoginButtons = () => {
  const googleLoginUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  const facebookLoginUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/facebook`;

  return (
    <>
      <div className="my-4 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-400">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div className="space-y-3">
        <a href={googleLoginUrl}>
          <Button variant="outline" className="w-full">
            <FaGoogle className="mr-2" /> Continue with Google
          </Button>
        </a>
        <a href={facebookLoginUrl}>
          <Button variant="outline" className="w-full">
            <FaFacebook className="mr-2 text-blue-600" /> Continue with Facebook
          </Button>
        </a>
      </div>
    </>
  );
};

export default SocialLoginButtons;
