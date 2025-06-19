import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/ui/Spinner";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // If user is logged in but not an admin, redirect to the home page.
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
