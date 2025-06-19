import React from "react";
import Card from "../../components/ui/Card";
import ChangePasswordForm from "../../components/profile/ChangePasswordForm";
import ChangeEmailForm from "../../components/profile/ChangeEmailForm";
import BettingLimitsForm from "../../components/profile/BettingLimitsForm";

const SettingsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <ChangePasswordForm />
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
