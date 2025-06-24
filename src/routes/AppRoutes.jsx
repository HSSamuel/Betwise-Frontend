import React from "react";
import { Routes, Route } from "react-router-dom";

// Public Pages
import MainLayout from "../components/Layout/MainLayout";
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";
import ResetPasswordPage from "../pages/public/ResetPasswordPage";
import SocialAuthCallback from "../pages/public/SocialAuthCallback";
import LivePage from "../pages/public/LivePage";
import AviatorPage from "../pages/public/AviatorPage";
import PromotionsPage from "../pages/public/PromotionsPage";
import SupportPage from "../pages/public/SupportPage";
import SharedSlipPage from "../pages/public/SharedSlipPage";
import LeaderboardPage from "../pages/public/LeaderboardPage";

// Protected Pages
import ProtectedRoute from "./ProtectedRoute";
import ProfilePage from "../pages/protected/ProfilePage";
import WalletPage from "../pages/protected/WalletPage";
import MyBetsPage from "../pages/protected/MyBetsPage";
import SettingsPage from "../pages/protected/SettingsPage";
import AssistantPage from "../pages/protected/AssistantPage";

// Admin Pages
import AdminRoute from "./AdminRoute";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAviatorPage from "../pages/admin/AdminAviatorPage";
import AdminUserManagementPage from "../pages/admin/AdminUserManagementPage";
import AdminGameManagementPage from "../pages/admin/AdminGameManagementPage";
import AdminWithdrawalsPage from "../pages/admin/AdminWithdrawalsPage";
import AdminRiskPage from "../pages/admin/AdminRiskPage";
import AdminUserDetailPage from "../pages/admin/AdminUserDetailPage";
import AdminPromotionsPage from "../pages/admin/AdminPromotionsPage";
import AdminRankingsPage from "../pages/admin/AdminRankingsPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/aviator" element={<AviatorPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/support" element={<SupportPage />} />
        {/* --- Correction: Moved these routes inside the MainLayout --- */}
        <Route path="/leaderboards" element={<LeaderboardPage />} />
        <Route path="/slip/:shareId" element={<SharedSlipPage />} />
      </Route>
      <Route path="/social-auth-success" element={<SocialAuthCallback />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/my-bets" element={<MyBetsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagementPage />} />
          <Route path="games" element={<AdminGameManagementPage />} />
          <Route path="withdrawals" element={<AdminWithdrawalsPage />} />
          <Route path="risk" element={<AdminRiskPage />} />
          <Route path="aviator" element={<AdminAviatorPage />} />
          <Route path="users/:userId" element={<AdminUserDetailPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="rankings" element={<AdminRankingsPage />} />
        </Route>
      </Route>

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <MainLayout>
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            </div>
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
