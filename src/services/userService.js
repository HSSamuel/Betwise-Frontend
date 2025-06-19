import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const changeEmail = async (data) => {
  const response = await api.patch("/users/email", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.patch("/users/password", data);
  return response.data;
};

export const setPassword = async (data) => {
  const response = await api.post("/users/set-password", data);
  return response.data;
};

export const setBettingLimits = async (limits) => {
  const response = await api.post("/users/limits", limits);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch("/users/profile", profileData);
  return response.data;
};

export const uploadProfilePicture = async (formData) => {
  const response = await api.post("/users/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
