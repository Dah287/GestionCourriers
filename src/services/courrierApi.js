// src/services/courrierApi.js
import axios from 'axios';

const API_URL = 'http://192.168.1.68:8080/api/courriers'; // **IMPORTANT: Replace with your actual backend API URL for courriers**
const API_URL2 = 'http://192.168.1.68:8080/api/decomptes'; 
const API_URL3 = 'http://192.168.1.68:8080/api/marches';
const API_URL4 = 'http://192.168.1.68:8080/api';  
const API_URL5 = 'http://192.168.1.68:8080/auth';
const getCourrier = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createCourrier = (courrierData) => {
  return axios.post(`${API_URL}/courriers`, courrierData);
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
  console.log("service-->",entite)
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

const updateDateReceptionBCP= (id) => {
  return axios.put(`${API_URL2}/update-status-bcp/${id}`);
};
const updateDateReceptionATP= (id) => {
  return axios.put(`${API_URL2}/update-status-atp/${id}`);
};
const updateDateReceptionRBCP= (id) => {
  return axios.put(`${API_URL2}/update-status-r-bcp/${id}`);
};
const updateDateReceptionRATP= (id) => {
  return axios.put(`${API_URL2}/update-status-r-atp/${id}`);
};

const updateDateReceptioTraite = (id) => {
  return axios.put(`${API_URL}/update-status-traite/${id}`);
};
const updateDateReceptioTraite4 = (id) => {
  return axios.put(`${API_URL}/update-status-traite4/${id}`);
};
const updateDateReceptioTraite3 = (id) => {
  return axios.put(`${API_URL}/update-status-traite3/${id}`);
};
//
const updateDateReceptioTraite33 = (id, formData) => {
  return axios.put(`${API_URL}/update-status-traite33/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const updateDateReceptioTraite1 = (id) => {
  return axios.put(`${API_URL}/update-status-traite-d/${id}`);
};

// Nouvelle méthode pour mettre à jour le bureau
const updateStatusBureau = (id, bureau) => {
  return axios.put(`${API_URL}/update-status-bureau/${id}`, null, { params: { bureau } });
};
// --- END NEW METHOD ---

// Opérations CRUD de base
const getAllDecomptes = () => {
  return axios.get(API_URL2);
};
const getAllDecomptesBCP = () => {
  return axios.get(`${API_URL2}/all-bcp`);
};
const getAllDecomptesATP = () => {
  return axios.get(`${API_URL2}/all-atp`);
};
const getAllDecomptesSCF = () => {
  return axios.get(`${API_URL2}/all-scf`);
};

const getAllMarches = () => {
  return axios.get(API_URL3);
};

const getDecompteById = (id) => {
  return axios.get(`${API_URL2}/${id}`);
};

const createDecompte = (decompteData) => {
  return axios.post(API_URL2, decompteData);
};

const updateDecompte = (id, decompteData) => {
  return axios.put(`${API_URL2}/${id}`, decompteData);
};

const deleteDecompte = (id) => {
  return axios.delete(`${API_URL2}/${id}`);
};

//PDF Rapport
const downloadDecomptePdf = (id) => {
  return axios.get(`${API_URL2}/${id}/export/pdf`, {
    responseType: 'blob'
  });
};
//PDF Rapport
const downloadDecomptePdf1 = (id) => {
  return axios.get(`${API_URL}/${id}/exportt/pdf`, {
    responseType: 'blob'
  });
};

// Méthodes spécifiques aux décomptes
const getDecomptesByAnnee = (annee) => {
  return axios.get(`${API_URL2}/par-annee`, {
    params: { annee }
  });
};

const getDecomptesByFournisseur = (fournisseur) => {
  return axios.get(`${API_URL2}/par-fournisseur`, {
    params: { fournisseur }
  });
};

const getDecomptesByEntite = (entite) => {
  return axios.get(`${API_URL2}/par-entite`, {
    params: { entite }
  });
};

const getDecomptesByStatut = (statut) => {
  return axios.get(`${API_URL2}/par-statut`, {
    params: { statut }
  });
};

const marquerCommePaye = (id) => {
  return axios.put(`${API_URL2}/marquer-paye/${id}`);
};

const marquerCommeRejete = (id, raison) => {
  return axios.put(`${API_URL2}/marquer-rejete/${id}`, null, {
    params: { raison }
  });
};

const transfererEntite = (id, nouvelleEntite) => {
  return axios.put(`${API_URL2}/transferer-entite/${id}`, null, {
    params: { nouvelleEntite }
  });
};

const getMontantTotalByAnnee = (annee) => {
  return axios.get(`${API_URL2}/montant-total`, {
    params: { annee }
  });
};

// Ajoutez cette méthode avec les autres méthodes de décompte
const updateStatut = (id, data) => {
  console.log("data :",data)
  return axios.put(`${API_URL2}/${id}/statut`, data);
};
const updateMarche = (id, marcheData) => {
  return axios.put(`${API_URL3}/${id}`, marcheData);
};
const deleteMarche = (id) => {
  return axios.delete(`${API_URL3}/${id}`);
};



// 🌟 Gestion des Marchés



const createMarche = (marcheData) => {
  return axios.post(`${API_URL3}`, marcheData);
};


const transfertMultiple= (id, bureaux) =>{
  axios.post(`${API_URL}/transfert-multiple`, {
    id: id,
    bureaux: bureaux,
  });
}
// CRUD USER 
// 🔹 Récupérer tous les utilisateurs
const getAllUsers = () => {
  return axios.get(`${API_URL5}`);
};

// 🔹 Créer un nouvel utilisateur
const createUser = (user) => {
  return axios.post(`${API_URL5}/register`, user);
};


// 🔹 Mettre à jour un utilisateur
const updateUser = (id, userData) => {
  return axios.put(`${API_URL5}/${id}`, userData);
};

// 🔹 Supprimer un utilisateur
const deleteUser = (id) => {
  return axios.delete(`${API_URL5}/${id}`);
};


const courrierApi = {
  getCourrier,
  createCourrier,
  updateCourrier,
  deleteCourrier,
  getAllCourriers,
  updateDateReceptionService,
  updateDateReceptioTraite,
    updateDateReceptioTraite4,
   updateDateReceptioTraite33,
     updateDateReceptioTraite3,
   updateDateReceptioTraite1,
  getCourriersParEntite,
  updateStatusBureau,
  getCourriersParEntite2,

  // decomptes methods
    // CRUD
  getAllDecomptes,
  getDecompteById,
  createDecompte,
  updateDecompte,
  deleteDecompte,
  
  // Méthodes spécifiques
  getDecomptesByAnnee,
  getDecomptesByFournisseur,
  getDecomptesByEntite,
  getDecomptesByStatut,
  marquerCommePaye,
  marquerCommeRejete,
  transfererEntite,
  getMontantTotalByAnnee,
  getAllMarches,
  updateDateReceptionBCP,
  updateDateReceptionATP,

  //
  getAllDecomptesATP,
  getAllDecomptesBCP,
  updateDateReceptionRBCP,
  updateDateReceptionRATP,
  //
  updateStatut,
  //
  getAllDecomptesSCF,

  //
  downloadDecomptePdf,
    downloadDecomptePdf1,
  //
    // ✅ nouvelle fonction
  createMarche    ,    // ✅ nouvelle fonction
  updateMarche,
  deleteMarche ,
  //
transfertMultiple,
// crud user 
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};

export default courrierApi;