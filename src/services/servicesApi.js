// services/servicesApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/services";

const getToken = () => localStorage.getItem("adminToken");

const axiosConfig = () => ({
  headers: { "x-auth-token": getToken() },
});

// GET all services
export const fetchServicesApi = async () => {
  const { data } = await axios.get(BASE_URL, axiosConfig());
  return data;
};

// POST create service
export const createServiceApi = async (formData) => {
  const { data } = await axios.post(BASE_URL, formData, axiosConfig());
  return data;
};

// PUT update service
export const updateServiceApi = async (id, formData) => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, formData, axiosConfig());
  return data;
};

// DELETE service
export const deleteServiceApi = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`, axiosConfig());
};

// PATCH toggle service status
export const toggleServiceStatusApi = async (id) => {
  const { data } = await axios.patch(`${BASE_URL}/${id}/status`, {}, axiosConfig());
  return data;
};
