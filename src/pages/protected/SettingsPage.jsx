import React from "react";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/ui/Card";
import ChangePasswordForm from "../../components/profile/ChangePasswordForm";
import SetPasswordForm from "../../components/profile/SetPasswordForm";
import ChangeEmailForm from "../../components/profile/ChangeEmailForm";
import BettingLimitsForm from "../../components/profile/BettingLimitsForm";
// IMPORT THIS
import FavoriteLeagues from "../../components/profile/FavoriteLeagues";
import { FaStar } from "react-icons/fa"; // Optional icon

const SettingsPage = () => {
  const { user, setUser } = useAuth();

  const handlePasswordSet = () => {
    setUser((prevUser) => ({ ...prevUser, hasPassword: true }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-8">
        {/* NEW CARD HERE */}
        <Card>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaStar className="mr-2 text-yellow-500" /> Favorite Leagues
          </h2>
          <FavoriteLeagues />
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">
            {user.hasPassword ? "Change Password" : "Set Account Password"}
          </h2>
          {user.hasPassword ? (
            <ChangePasswordForm />
          ) : (
            <SetPasswordForm onPasswordSet={handlePasswordSet} />
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Change Email</h2>
          <ChangeEmailForm />
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Responsible Gambling</h2>
          <BettingLimitsForm />
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
