import React from "react";
import RegisterForm from "../../components/auth/RegisterForm";
import SocialLoginButtons from "../../components/auth/SocialLoginButtons"; // <-- Import SocialLoginButtons
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create Your Account
          </h2>

          <RegisterForm />

          {/* --- ADD THIS SECTION --- */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <SocialLoginButtons />
          {/* --- END OF ADDED SECTION --- */}

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
