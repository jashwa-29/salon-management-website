import axios from 'axios';

const API_URL = 'http://localhost:5000/api/combos';

const getAuthHeaders = (token) => ({
  'x-auth-token': token,
  'Content-Type': 'application/json'
});

export const fetchCombos = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(token)
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching combos:', error);
    throw error;
  }
};

export const fetchServices = async (token) => {
  try {
    const response = await axios.get('http://localhost:5000/api/services', {
      headers: getAuthHeaders(token)
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const createCombo = async (comboData, token) => {
  try {
    const response = await axios.post(API_URL, comboData, {
      headers: getAuthHeaders(token)
    });
    return response.data;
  } catch (error) {
    console.error('Error creating combo:', error);
    throw error;
  }
};

export const updateCombo = async (id, comboData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, comboData, {
      headers: getAuthHeaders(token)
    });
    return response.data;
  } catch (error) {
    console.error('Error updating combo:', error);
    throw error;
  }
};

export const toggleComboStatus = async (id, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}/status`,
      {},
      { headers: getAuthHeaders(token) }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling combo status:', error);
    throw error;
  }
};

export const deleteCombo = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(token)
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting combo:', error);
    throw error;
  }
};