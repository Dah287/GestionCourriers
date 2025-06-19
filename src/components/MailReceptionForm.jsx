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
} from "@mui/material";
import {
  Mail as MailIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import courrierApi from '../services/courrierApi';

const ReceptionCourrierForm = () => {

  const { courrierId } = useParams();
  const navigate = useNavigate();

  const initialFormData = {
    dateArrivee: new Date().toISOString().split('T')[0],
    typeCourrier: "Fax",
    numeroOrdre: "",
    entiteExpeditrice: "Direction",
    dateExpediteur: "",
    reference: "",
    status: "EN_ATTENTE",
    objet: "",
    langue: "Français",
    copies: "", // Changé de array à string
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
    instructionSupplementaire: "", // Maintenant un simple string
    entitesTransmises: "", // Nouveau champ pour la sélection
  };

  const [formData, setFormData] = useState(initialFormData);

  // Options pour Entité Expéditrice
  const entitesExpeditrices = ["Direction", "DA", "DDA", "DRH", "DGR", "SMG", "SAICG"];

  // Options pour Entités Transmises
  const entitesTransmisesOptions = [
        "SERVICE INFORMATIQUE",
    "SERVICE DE LA PLANIFICATION",
    "SERVICE DE LA COMPTABILITE ET FINANCES",

  ];
  

  useEffect(() => {
    if (courrierId) {
      const fetchCourrier = async () => {
        try {
          const response = await courrierApi.getCourrier(courrierId);
          setFormData({
            ...response.data,
            // Convertir les arrays en strings si nécessaire
            copies: Array.isArray(response.data.copies) ? response.data.copies.join(", ") : response.data.copies,
          });
        } catch (error) {
          console.error("Error fetching courrier:", error);
        }
      };
      fetchCourrier();
    }
  }, [courrierId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        // Convertir la string copies en array si nécessaire
    
      };

      if (courrierId) {
        await courrierApi.updateCourrier(courrierId, dataToSend);
        alert("Courrier mis à jour avec succès !");
      } else {
        console.log("data :", dataToSend)
        await courrierApi.createCourrier(dataToSend);
         console.log("New courrier created:", dataToSend);
        alert("Courrier ajouté avec succès !");
      }
      navigate('/courriers');
    } catch (error) {
      console.error("Error saving courrier:", error);
      alert("Une erreur est survenue lors de l'enregistrement du courrier.");
    }
  };

  const handleDelete = async () => {
    if (!courrierId) return;
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce courrier ?")) {
      try {
        await courrierApi.deleteCourrier(courrierId);
        alert("Courrier supprimé avec succès !");
        navigate('/courriers');
      } catch (error) {
        console.error("Error deleting courrier:", error);
        alert("Une erreur est survenue lors de la suppression du courrier.");
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, margin: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <MailIcon sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
          {courrierId ? "Modifier une Fiche de Courrier" : "Fiche de Réception de Courrier"}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box component="form" onSubmit={handleSubmit}>
        {/* Section Arrivée */}
        <Box sx={{ bgcolor: "primary.light", p: 2, borderRadius: 1, mb: 3 }}>
<TextField
  label="📅 Arrivé le"
  type="date"
  value={formData.dateArrivee || ""}
  onChange={(e) =>
    setFormData({ ...formData, dateArrivee: e.target.value })
  }
  InputLabelProps={{
    shrink: true,
  }}
  sx={{
    mb: 1,
    input: { color: "white" }, // Texte blanc
    label: { color: "white" }, // Label blanc
  }}
/>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Première ligne - 3 champs */}
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Type Courrier"
              name="typeCourrier"
              value={formData.typeCourrier}
              onChange={handleChange}
              SelectProps={{
                native: true,
              }}
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

          {/* Deuxième ligne - Date Expéditeur et Référence */}
          <Grid item xs={12} sm={6}sx={{width: "31%",}}>
            <TextField
              fullWidth
              label="Date Expéditeur"
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
              sx={{ "& .MuiInputBase-root": { height: "56px" } }}
            />
          </Grid>

          {/* Troisième ligne - Objet et Langue */}
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
              SelectProps={{
                native: true,
              }}
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
        <Box sx={{ bgcolor: "secondary.light", p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "white", fontWeight: "bold" }}>
            📤 Transmis le : {formData.dateArrivee}
          </Typography>
        </Box>

        {/* Nouveau champ Entités Transmises */}
        <Grid container spacing={2} sx={{ mb: 2 ,}}>
          <Grid item xs={12} sm={6}sx={{width: "100%",}}>
            <FormControl fullWidth>
              <InputLabel>Entités Transmises</InputLabel>
              <Select
                name="entitesTransmises"
                value={formData.entitesTransmises}
                onChange={handleChange}
                label="Entités Transmises"
              >
                {entitesTransmisesOptions.map((entite) => (
                  <MenuItem key={entite} value={entite}>
                    {entite}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Champ Copies modifié */}
          <Grid item xs={12} sm={6}sx={{width: "45%",}}>
            <TextField
              fullWidth
              label="Copie"
              name="copies"
              value={formData.copies}
              onChange={handleChange}
              sx={{ "& .MuiInputBase-root": { height: "56px" } }}
              helperText="Séparez les copies par des virgules"
            />
          </Grid>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox checked={formData.urgent} onChange={handleChange} name="urgent" color="error" />}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <WarningIcon sx={{ mr: 1, color: "error.main" }} />
                  Urgent
                </Box>
              }
            />
            {formData.urgent && (
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
                sx={{ mt: 1, "& .MuiInputBase-root": { height: "56px" } }}
              />
            )}
          </Grid>
        </Grid>
        </Grid>



        <Divider sx={{ my: 2 }} />

        {/* Section Instructions */}
        <Box sx={{ bgcolor: "info.light", p: 2, borderRadius: 1, mb: 3 }}>
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
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Instruction Supplémentaire modifiée */}
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

        {/* Boutons d'action */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          {courrierId && (
            <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDelete} sx={{ borderRadius: 2 }}>
              Supprimer
            </Button>
          )}
          <Box sx={{ marginLeft: courrierId ? 'auto' : '0' }}>
            <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBackIcon />} sx={{ mr: 2, borderRadius: 2 }}>
              Retour
            </Button>
            <Button variant="outlined" startIcon={<PrintIcon />} sx={{ mr: 2, borderRadius: 2 }}>
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

export default ReceptionCourrierForm;