import React, { useState, useEffect, useCallback } from "react";
import { useApi } from "../../hooks/useApi";
import {
  adminGetAllPromotions,
  adminCreatePromotion,
  adminUpdatePromotion,
  adminDeletePromotion,
} from "../../services/adminService";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import PromoModal from "../../components/admin/PromoModal";
import { formatDate } from "../../utils/formatDate";

const AdminPromotionsPage = () => {
  const {
    data: promoData,
    loading,
    request: fetchPromotions,
  } = useApi(adminGetAllPromotions);
  const { loading: creating, request: createPromo } =
    useApi(adminCreatePromotion);
  const { loading: updating, request: updatePromo } =
    useApi(adminUpdatePromotion);
  const { loading: deleting, request: deletePromo } =
    useApi(adminDeletePromotion);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const refreshPromotions = useCallback(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  useEffect(() => {
    refreshPromotions();
  }, [refreshPromotions]);

  const handleOpenModal = (promo = null) => {
    setSelectedPromo(promo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPromo(null);
  };

  const handleSave = async (formData) => {
    const result = selectedPromo
      ? await updatePromo(selectedPromo._id, formData)
      : await createPromo(formData);

    if (result) {
      toast.success(
        `Promotion ${selectedPromo ? "updated" : "created"} successfully!`
      );
      handleCloseModal();
      refreshPromotions();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      const result = await deletePromo(id);
      if (result) {
        toast.success("Promotion deleted successfully!");
        refreshPromotions();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Promotions</h1>
        <Button onClick={() => handleOpenModal()}>
          <FaPlus className="mr-2" /> Create Promotion
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {promoData?.promotions.map((promo) => (
                <tr key={promo._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{promo.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {promo.promoType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        promo.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {promo.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {promo.expiresAt ? formatDate(promo.expiresAt) : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 !p-2"
                      onClick={() => handleOpenModal(promo)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="!p-2"
                      onClick={() => handleDelete(promo._id)}
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

      <PromoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        loading={creating || updating}
        promo={selectedPromo}
      />
    </div>
  );
};

export default AdminPromotionsPage;
