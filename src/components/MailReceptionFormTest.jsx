import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListItemText,
} from "@mui/material";
import {
  Mail as MailIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Schedule as ScheduleIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import courrierApi from '../services/courrierApi';
import axios from "axios";

const MailReceptionFormTest = () => {
  const { courrierId } = useParams();
  const navigate = useNavigate();

  // Valeurs par défaut
  const initialFormData = {
    dateArrivee: new Date().toISOString().split("T")[0],
    typeCourrier: "Fax",
    numeroOrdre: "",
    entiteExpeditrice: "Direction",
    dateExpediteur: "",
    reference: "",
    status: "EN_ATTENTE",
    objet: "",
    langue: "Français",
    copies: "",
    urgent: false,
    delaisJours: "",
    instructions: {
      elementReponse: false,
      exploitationCompte: false,
      avecAccord: false,
      application: false,
      enquete: false,
      etude: false,
    },
    instructionSupplementaire: "",
    entiteTransmise: "",
    servicesTransmis: [],
    serviceDestinataire: "",
    bureauRecepteur: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedEntite, setSelectedEntite] = useState("");
  const [servicesDisponibles, setServicesDisponibles] = useState([]);
  const [fichierPdf, setFichierPdf] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);

  // Liste des entités et services
  const entitesEtServices = {
    Direction: [
      "SERVICE INFORMATIQUE",
      "SERVICE DE LA PLANIFICATION",
      "SERVICE DE LA COMPTABILITE ET FINANCES",
    ],
    DPF: [
      "SERVICE INFORMATIQUE",
      "SERVICE DE LA PLANIFICATION",
      "SERVICE DE LA COMPTABILITE ET FINANCES",
    ],
    DRH: [
      "SERVICE DE FORMATION CONTINUE ET GESTION DES CARRIÈRES",
      "SERVICE DE GESTION DU PERSONNEL",
    ],
  };

  const entitesExpeditrices = [
    "Direction",
    "DIAEA",
    "DPFP",
    "DF",
    "Province",
    "Réclamation",
    "DA",
    "DDA",
    "DRH",
    "DGR",
    "SMG",
    "SAICG",
  ];

  // Gestion des champs simples
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Gestion instructions (checkboxes)
  const handleInstructionChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      instructions: {
        ...prev.instructions,
        [name]: checked,
      },
    }));
  };

  // Gestion entité et services
  const handleEntiteChange = (e) => {
    const entite = e.target.value;
    setSelectedEntite(entite);
    setServicesDisponibles(entitesEtServices[entite] || []);
    setFormData((prev) => ({
      ...prev,
      entiteTransmise: entite,
      servicesTransmis: [],
    }));
  };

  const handleServicesChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      servicesTransmis: typeof value === "string" ? value.split(",") : value,
    }));
  };

  // Gestion fichier PDF
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFichierPdf(file);
      setPreviewPdf(URL.createObjectURL(file));
    } else {
      alert("Veuillez sélectionner uniquement un fichier PDF.");
    }
  };

  const handleRemoveFile = () => {
    setFichierPdf(null);
    setPreviewPdf(null);
  };

  // Chargement d’un courrier si modification
  useEffect(() => {
    if (courrierId) {
      const fetchCourrier = async () => {
        try {
          const res = await axios.get(
            `http://192.168.1.68:8080/api/courriers/${courrierId}`
          );
          const data = res.data;

          setFormData({
            ...data,
            copies: Array.isArray(data.copies)
              ? data.copies.join(", ")
              : data.copies || "",
          });

          if (data.entiteTransmise) {
            setSelectedEntite(data.entiteTransmise);
            setServicesDisponibles(entitesEtServices[data.entiteTransmise] || []);
          }

          if (data.cheminFichierPdf) {
            setPreviewPdf(
              `http://192.168.1.68:8080${
                data.cheminFichierPdf.startsWith("/") ? "" : "/"
              }${data.cheminFichierPdf}`
            );
          }
        } catch (err) {
          console.error("Erreur lors du chargement :", err);
        }
      };
      fetchCourrier();
    }
  }, [courrierId]);

  // Soumission formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        copies: formData.copies || "",
      };

      const formDataObj = new FormData();
      formDataObj.append(
        "courrier",
        new Blob([JSON.stringify(dataToSend)], { type: "application/json" })
      );
      if (fichierPdf) {
        formDataObj.append("fichierPdf", fichierPdf);
      }

      if (courrierId) {
        await axios.put(
          `http://192.168.1.68:8080/api/courriers/${courrierId}`,
          formDataObj,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Courrier mis à jour ✅");
      } else {
        await axios.post("http://192.168.1.68:8080/api/courriers", formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Courrier ajouté ✅");
      }
      navigate("/dashbord");
    } catch (err) {
      console.error("Erreur :", err);
      alert("Erreur lors de l'enregistrement ❌");
    }
  };

  // Suppression
  const handleDelete = async () => {
    if (!courrierId) return;
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce courrier ?")) {
      try {
        await courrierApi.deleteCourrier(courrierId);
        alert("Courrier supprimé avec succès !");
        navigate('/dashbord');
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  // Retour
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, margin: "auto" }}>
      {/* En-tête */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <MailIcon sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
          {courrierId ? "Modifier une Fiche de Courrier" : "Fiche de Réception de Courrier"}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box component="form" onSubmit={handleSubmit}>
        {/* Section : Date d'arrivée */}
        <Box sx={{ bgcolor: "primary.light", p: 2, borderRadius: 1, mb: 3 }}>
          <TextField
            label="📅 Arrivé le"
            type="date"
            value={formData.dateArrivee || ""}
            onChange={(e) => setFormData({ ...formData, dateArrivee: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 1,
              input: { color: "white" },
              label: { color: "white" },
            }}
            required
          />
        </Box>

        {/* Champs principaux */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Type Courrier"
              name="typeCourrier"
              value={formData.typeCourrier}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              <option value="Lettre">Lettre</option>
              <option value="Fax">Fax</option>
              <option value="Email">Email</option>
              <option value="Bordereau">Bordereau</option>
              <option value="Autre">Autre</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="N° Ordre"
              name="numeroOrdre"
              value={formData.numeroOrdre}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}sx={{width: "31%",}}>
            <FormControl fullWidth>
              <InputLabel>Entité Expéditrice</InputLabel>
              <Select
                name="entiteExpeditrice"
                value={formData.entiteExpeditrice}
                onChange={handleChange}
                label="Entité Expéditrice"
              >
                {entitesExpeditrices.map((entite) => (
                  <MenuItem key={entite} value={entite}>
                    {entite}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6 } sx={{width: "31%",}}>
            <TextField
              fullWidth
              label="Date Expédition"
              name="dateExpediteur"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.dateExpediteur}
              onChange={handleChange}
              sx={{ "& .MuiInputBase-root": { height: "56px" } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Référence"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              required
              sx={{ "& .MuiInputBase-root": { height: "56px" } }}
            />
          </Grid>

          <Grid item xs={12} sm={8}sx={{width: "65%",}}>
            <TextField
              fullWidth
              label="Objet"
              name="objet"
              multiline
              rows={2}
              value={formData.objet}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Langue"
              name="langue"
              value={formData.langue}
              onChange={handleChange}
              SelectProps={{ native: true }}
              sx={{ "& .MuiInputBase-root": { height: "56px" } }}
            >
              <option value="Français">Français</option>
              <option value="Arabe">Arabe</option>
              <option value="Anglais">Anglais</option>
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Section Transmission */}
        <Box sx={{ bgcolor: "primary.light", p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "white", fontWeight: "bold" }}>
            📤 Transmis le : {formData.dateArrivee}
          </Typography>
        </Box>

        {/* Sélection Entité + Services */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}sx={{width: "40%",}}>
            <FormControl fullWidth>
              <InputLabel>Entité</InputLabel>
              <Select
                name="entite"
                value={selectedEntite}
                onChange={handleEntiteChange}
                label="Entité"
              >
                {Object.keys(entitesEtServices).map((entite) => (
                  <MenuItem key={entite} value={entite}>
                    {entite}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}sx={{width: "40%",}}>
            {selectedEntite ? (
              <FormControl fullWidth>
                <InputLabel>Services</InputLabel>
                <Select
                  multiple
                  name="servicesTransmis"
                  value={formData.servicesTransmis || []}
                  onChange={handleServicesChange}
                  label="Services"
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  {servicesDisponibles.map((service) => (
                    <MenuItem key={service} value={service}>
                      <Checkbox checked={formData.servicesTransmis.includes(service)} />
                      <ListItemText primary={service} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label="Services"
                disabled
                value="Sélectionnez d'abord une entité"
              />
            )}
          </Grid>
        </Grid>

        {/* Copies */}
        <Grid item xs={12} sm={6}sx={{width: "45%",}}>
          <TextField
            fullWidth
            label="Copie"
            name="copies"
            value={formData.copies}
            onChange={handleChange}
            helperText="Séparez les copies par des virgules"
            sx={{ mb: 2, "& .MuiInputBase-root": { height: "56px" } }}
          />
        </Grid>

        {/* Délais */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Délais (jours)"
              name="delaisJours"
              type="number"
              value={formData.delaisJours}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ScheduleIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiInputBase-root": { height: "56px" } }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Instructions */}
        <Box sx={{ bgcolor: "primary.light", p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "white", fontWeight: "bold" }}>
            📋 Instructions
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {Object.entries(formData.instructions).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value}
                    onChange={handleInstructionChange}
                    name={key}
                    color="primary"
                  />
                }
                label={key.split(/(?=[A-Z])/).join(" ").toUpperCase()}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  p: 1,
                  m: 0,
                  width: "100%",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Instruction supplémentaire */}
        <TextField
          fullWidth
          label="Instruction Supplémentaire"
          name="instructionSupplementaire"
          multiline
          rows={3}
          value={formData.instructionSupplementaire}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        {/* 🔽 CHAMP UPLOAD PDF 🔽 */}
        <Box sx={{ mt: 3, p: 2, border: "1px dashed #1976d2", borderRadius: 2 }}>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
            📎 Joindre une pièce jointe (PDF)
          </Typography>
          <input
            accept="application/pdf"
            style={{ display: "none" }}
            id="upload-pdf"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-pdf">
            <Button variant="contained" component="span" startIcon={<MailIcon />}>
              Choisir un PDF
            </Button>
          </label>

          {(fichierPdf || previewPdf) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="success.main">
                ✅ {fichierPdf ? fichierPdf.name : "Document joint"}
              </Typography>
              <Button
                size="small"
                color="secondary"
                onClick={handleRemoveFile}
                sx={{ mt: 1 }}
              >
                Supprimer
              </Button>
            </Box>
          )}
        </Box>

        {/* Aperçu ou lien PDF */}
        {previewPdf && !fichierPdf && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              variant="outlined"
              href={previewPdf}
              target="_blank"
              sx={{ mb: 1 }}
            >
              🔍 Voir le PDF existant
            </Button>
          </Box>
        )}

        {previewPdf && fichierPdf && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <iframe
              src={previewPdf}
              style={{ width: "100%", height: "400px", border: "1px solid #ddd" }}
              title="Aperçu PDF"
            />
          </Box>
        )}
        {/* 🔼 FIN UPLOAD PDF 🔼 */}

        {/* Boutons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          {courrierId && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ borderRadius: 2 }}
            >
              Supprimer
            </Button>
          )}
          <Box sx={{ marginLeft: courrierId ? 'auto' : '0' }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{ mr: 2, borderRadius: 2 }}
            >
              Retour
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              sx={{ mr: 2, borderRadius: 2 }}
            >
              Imprimer
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              type="submit"
              sx={{ borderRadius: 2 }}
            >
              {courrierId ? "Mettre à jour" : "Valider"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MailReceptionFormTest;