import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import {
  getWalletSummary,
  getTransactionHistory,
} from "../../services/walletService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { formatCurrency, capitalize } from "../../utils/helpers";
import { formatDate } from "../../utils/formatDate";
import { FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import DepositForm from "../../components/wallet/DepositForm";
import WithdrawalForm from "../../components/wallet/WithdrawalForm";

const SummaryCard = ({ title, amount, count, icon, color }) => (
  <Card>
    <div className="flex items-center">
      <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
        <p className="text-xs text-gray-400">{count} transactions</p>
      </div>
    </div>
  </Card>
);

const WalletPage = () => {
  const {
    data: summary,
    loading: summaryLoading,
    request: fetchSummary,
  } = useApi(getWalletSummary);
  const {
    data: history,
    loading: historyLoading,
    request: fetchHistory,
  } = useApi(getTransactionHistory);
  const [isDepositOpen, setDepositOpen] = useState(false);
  const [isWithdrawOpen, setWithdrawOpen] = useState(false);

  const refetchData = () => {
    fetchSummary();
    fetchHistory();
  };

  useEffect(() => {
    refetchData();
  }, []);

  if (summaryLoading || !summary) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <DepositForm
        isOpen={isDepositOpen}
        onClose={() => setDepositOpen(false)}
        onSubmitted={refetchData}
      />
      <WithdrawalForm
        isOpen={isWithdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onSubmitted={refetchData}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <div className="space-x-2">
          <Button onClick={() => setWithdrawOpen(true)} variant="outline">
            <FaArrowDown className="mr-2" /> Withdraw
          </Button>
          <Button onClick={() => setDepositOpen(true)}>
            <FaPlus className="mr-2" /> Deposit
          </Button>
        </div>
      </div>

      <div className="mb-8 p-6 bg-green-600 text-white rounded-lg shadow-md">
        <p className="text-lg">Current Balance</p>
        <p className="text-5xl font-bold tracking-tight">
          {formatCurrency(summary.currentWalletBalance)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total Top-Ups"
          amount={summary.totalTopUps.amount}
          count={summary.totalTopUps.count}
          icon={<FaArrowUp />}
          color="bg-green-100 text-green-700"
        />
        <SummaryCard
          title="Total Winnings"
          amount={summary.totalWinnings.amount}
          count={summary.totalWinnings.count}
          icon={<FaArrowUp />}
          color="bg-blue-100 text-blue-700"
        />
        <SummaryCard
          title="Total Stakes"
          amount={summary.totalBetsPlaced.amount}
          count={summary.totalBetsPlaced.count}
          icon={<FaArrowDown />}
          color="bg-red-100 text-red-700"
        />
      </div>

      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Balance After
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {historyLoading && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  <Spinner />
                </td>
              </tr>
            )}
            {history?.transactions.map((tx) => (
              <tr key={tx._id} className="bg-white border-b">
                <td className="px-6 py-4">{formatDate(tx.createdAt)}</td>
                <td className="px-6 py-4">
                  <span className="font-semibold">{capitalize(tx.type)}</span>
                </td>
                <td
                  className={`px-6 py-4 font-bold ${
                    tx.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-6 py-4">{formatCurrency(tx.balanceAfter)}</td>
                <td className="px-6 py-4 text-gray-600">{tx.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WalletPage;
