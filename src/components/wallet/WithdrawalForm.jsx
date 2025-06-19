import React, { useState } from "react";
import toast from "react-hot-toast";
import { requestWithdrawal } from "../../services/walletService";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

const WithdrawalForm = ({ isOpen, onClose, onSubmitted }) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestWithdrawal(amount);
      toast.success("Withdrawal request submitted successfully!");
      onSubmitted();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.msg || "Failed to request withdrawal.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Withdrawal">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount ($)
          </label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.01"
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your request will be reviewed by an admin.
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default WithdrawalForm;
