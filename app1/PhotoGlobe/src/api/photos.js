import { apiClient } from "./client.js";

// GET all users
export const getPhotos = () => {
  return apiClient.get("/Photos");
};

// GET a single user by ID
export const getPhotosByType = (id) => {
  return apiClient.get(`/Photos/GetPhotosByType/${id}`);
};
