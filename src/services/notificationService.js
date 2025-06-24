import api from "./api";

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markNotificationsAsRead = async () => {
  const response = await api.patch("/notifications/read");
  return response.data;
};
