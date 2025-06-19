// src/services/courrierApi.js
import axios from 'axios';

const API_URL = 'http://192.168.1.112:8080/api/courriers'; // **IMPORTANT: Replace with your actual backend API URL for courriers**

const getCourrier = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createCourrier = (courrierData) => {
  return axios.post(API_URL, courrierData);
};

const updateCourrier = (id, courrierData) => {
  return axios.put(`${API_URL}/${id}`, courrierData);
};

const deleteCourrier = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// You might also want to add a function to get all courriers
const getAllCourriers = () => {
    return axios.get(API_URL);
}
 const getCourriersParEntite = (entite) => {
  return axios.get(`${API_URL}/recu-service/par-entite`, {
    params: { entite },
  });
};

 const getCourriersParEntite2 = (entite) => {
  return axios.get(`${API_URL}/recu-bureau/par-entite`, {
    params: { entite },
  });
};

// Dans courrierApi.js
const updateDateReceptionService = (id) => {
  return axios.put(`${API_URL}/update-status-service/${id}`);
};

const updateDateReceptioTraite = (id) => {
  return axios.put(`${API_URL}/update-status-traite/${id}`);
};

// Nouvelle méthode pour mettre à jour le bureau
const updateStatusBureau = (id, bureau) => {
  return axios.put(`${API_URL}/update-status-bureau/${id}`, null, { params: { bureau } });
};
// --- END NEW METHOD ---

const courrierApi = {
  getCourrier,
  createCourrier,
  updateCourrier,
  deleteCourrier,
  getAllCourriers,
  updateDateReceptionService,
  updateDateReceptioTraite,
  getCourriersParEntite,
  updateStatusBureau,
  getCourriersParEntite2,
};

export default courrierApi;