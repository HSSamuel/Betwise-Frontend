import api from "./api";

export const getActivePromotions = async () => {
  const response = await api.get("/promotions");
  return response.data;
};
