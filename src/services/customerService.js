import axios from "axios";

const BASE_URL = "http://localhost:5000/api/customer";

const getToken = () => localStorage.getItem("adminToken");

const axiosConfig = () => ({
  headers: { "x-auth-token": getToken() },
});

// GET all services
export const fetchCustomerApi = async () => {
  const { data } = await axios.get(BASE_URL, axiosConfig());
  return data;
};

export const createCustomerApi = async (formData) => {
  const { data } = await axios.post(BASE_URL, formData, axiosConfig());
  return data;
};