import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { getActivePromotions } from "../../services/promoService";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import { FaGift } from "react-icons/fa";

const PromotionsPage = () => {
  const {
    data: promoData,
    loading,
    error,
    request: fetchPromotions,
  } = useApi(getActivePromotions);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const renderContent = () => {
    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!promoData?.promotions || promoData.promotions.length === 0) {
      return (
        <div className="text-center text-gray-500">
          <FaGift className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold">No Active Promotions</h3>
          <p>Please check back later for new offers.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promoData.promotions.map((promo) => (
          <Card key={promo._id} className="flex flex-col">
            <h2 className="text-2xl font-bold text-green-500 mb-2">
              {promo.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 flex-grow">
              {promo.description}
            </p>
            <div className="mt-4 pt-4 border-t dark:border-gray-600">
              <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {promo.promoType}
              </span>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Promotions & Offers</h1>
      {renderContent()}
    </div>
  );
};

export default PromotionsPage;
