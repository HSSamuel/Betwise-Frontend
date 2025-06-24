import React, { useState, useEffect, useCallback } from "react";
import { useApi } from "../../hooks/useApi";
import {
  getRankings,
  createRanking,
  updateRanking,
  deleteRanking,
} from "../../services/adminService";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrashAlt, FaStar } from "react-icons/fa";
import RankingModal from "../../components/admin/RankingModal";
import { formatDate } from "../../utils/formatDate";

const AdminRankingsPage = () => {
  const { data, loading, request: fetchRankings } = useApi(getRankings);
  const { loading: creating, request: createNewRanking } =
    useApi(createRanking);
  const { loading: updating, request: updateExistingRanking } =
    useApi(updateRanking);
  const { loading: deleting, request: deleteExistingRanking } =
    useApi(deleteRanking);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState(null);

  const refreshRankings = useCallback(() => {
    fetchRankings();
  }, [fetchRankings]);

  useEffect(() => {
    refreshRankings();
  }, [refreshRankings]);

  const handleOpenModal = (ranking = null) => {
    setSelectedRanking(ranking);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRanking(null);
  };

  const handleSave = async (formData) => {
    const result = selectedRanking
      ? await updateExistingRanking(selectedRanking._id, {
          ranking: formData.ranking,
        })
      : await createNewRanking(formData.teamName, formData.ranking);

    if (result) {
      toast.success(
        `Ranking ${selectedRanking ? "updated" : "created"} successfully!`
      );
      handleCloseModal();
      refreshRankings();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team ranking?")) {
      const result = await deleteExistingRanking(id);
      if (result) {
        toast.success("Ranking deleted successfully!");
        refreshRankings();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FaStar className="mr-3 text-yellow-400" /> Team Power Rankings
        </h1>
        <Button onClick={() => handleOpenModal()}>
          <FaPlus className="mr-2" /> Add New Ranking
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {/* --- Correction: Added dark mode text color for headers --- */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Team Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Ranking
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {data?.rankings.map((rank) => (
                <tr key={rank._id}>
                  {/* --- Correction: Added dark mode text color for table cells --- */}
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">
                    {rank.teamName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {rank.ranking}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 !p-2"
                      onClick={() => handleOpenModal(rank)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="!p-2"
                      onClick={() => handleDelete(rank._id)}
                      loading={deleting}
                    >
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RankingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        loading={creating || updating}
        ranking={selectedRanking}
      />
    </div>
  );
};

export default AdminRankingsPage;
