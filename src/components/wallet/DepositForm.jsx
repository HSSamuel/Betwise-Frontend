import React, { useState } from "react";
import toast from "react-hot-toast";
import { initializeDeposit } from "../../services/walletService";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

const DepositForm = ({ isOpen, onClose, onSubmitted }) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await initializeDeposit(amount);
      toast.success("Redirecting to payment page...");
      // Open the payment link in a new tab
      window.open(data.paymentLink, "_blank");
      onSubmitted();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.msg ||
        "Failed to initiate deposit.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deposit Funds">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount (NGN)
          </label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum deposit is 100 NGN.
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            Proceed to Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DepositForm;
