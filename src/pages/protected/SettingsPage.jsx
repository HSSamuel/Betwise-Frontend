import React from "react";
import { useAuth } from "../../hooks/useAuth"; // --- Implementation: Import useAuth ---
import Card from "../../components/ui/Card";
import ChangePasswordForm from "../../components/profile/ChangePasswordForm";
import SetPasswordForm from "../../components/profile/SetPasswordForm"; // --- Implementation: Import the new form ---
import ChangeEmailForm from "../../components/profile/ChangeEmailForm";
import BettingLimitsForm from "../../components/profile/BettingLimitsForm";

const SettingsPage = () => {
  const { user, setUser } = useAuth(); // --- Implementation: Get user and setUser ---

  // --- Implementation: Handler to update user state after password is set ---
  const handlePasswordSet = () => {
    // Optimistically update the user object to reflect that a password now exists
    setUser((prevUser) => ({ ...prevUser, hasPassword: true }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-8">
        {/* --- Implementation: Conditionally render the correct password form --- */}
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
