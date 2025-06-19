import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import LoginForm from "../../components/auth/LoginForm";
import SocialLoginButtons from "../../components/auth/SocialLoginButtons";

const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to BetWise
        </h2>
        <LoginForm />

        {/* --- ADD THIS SECTION --- */}
        <div className="text-right mt-4">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </Link>
        </div>
        {/* --- END OF ADDED SECTION --- */}

        <SocialLoginButtons />

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 hover:underline">
            Register here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
