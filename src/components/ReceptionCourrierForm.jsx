import React, { useState } from 'react';
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
  IconButton
} from '@mui/material';
import {
  Mail as MailIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const ReceptionCourrierForm = () => {
  const [formData, setFormData] = useState({
    dateArrivee: new Date().toLocaleDateString('fr-FR'),
    typeCourrier: 'Fax',
    numeroOrdre: '',
    organismeExpediteur: '',
    entiteExpeditrice: '',
    dateExpediteur: '',
    reference: '',
    objet: '',
    langue: 'Français',
    copies: [],
    urgent: false,
    delaisJours: '',
    instructions: {
      elementReponse: false,
      exploitationCompte: false,
      avecAccord: false,
      application: false,
      enquete: false,
      etude: false
    },
    instructionSupplementaire: '',
    entitesTransmises: {
      DIRECTION: false,
      CPS_PAST_K_METTOI: false,
      C_REQUETE: false,
      DPA_SETTAT: false,
      CENTRE_AIN_JEMAA: false,
      DPA_BEN_SLIMANE: false,
      COM_PROM: false,
      STATISTIQUE: false,
      CONTR_GEST: false,
      AT: false,
      LPADA: false
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInstructionChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      instructions: {
        ...prev.instructions,
        [name]: checked
      }
    }));
  };

  const handleEntiteChange = (entite) => {
    setFormData(prev => ({
      ...prev,
      entitesTransmises: {
        ...prev.entitesTransmises,
        [entite]: !prev.entitesTransmises[entite]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Ici vous ajouteriez la logique pour envoyer les données au backend
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Fiche de Réception de Courrier
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box component="form" onSubmit={handleSubmit}>
        {/* Section Arrivée */}
        <Typography variant="subtitle1" gutterBottom>
          Arrivé le : {formData.dateArrivee}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
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
              <option value="Fax">Fax</option>
              <option value="Email">Email</option>
              <option value="Courrier postal">Courrier postal</option>
              <option value="Interne">Interne</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="N° Ordre"
              name="numeroOrdre"
              value={formData.numeroOrdre}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Organisme Expéditeur"
              name="organismeExpediteur"
              value={formData.organismeExpediteur}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Entité Expéditrice"
              name="entiteExpeditrice"
              value={formData.entiteExpeditrice}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date Expéditeur"
              name="dateExpediteur"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.dateExpediteur}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Référence"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
            >
              <option value="Français">Français</option>
              <option value="Arabe">Arabe</option>
              <option value="Anglais">Anglais</option>
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Section Transmission */}
        <Typography variant="subtitle1" gutterBottom>
          Transmis le : {formData.dateArrivee}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {Object.keys(formData.entitesTransmises).map((entite) => (
            <Grid item xs={12} sm={6} key={entite}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.entitesTransmises[entite]}
                    onChange={() => handleEntiteChange(entite)}
                    name={entite}
                    color="primary"
                  />
                }
                label={entite.replace(/_/g, ' ')}
              />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Copie"
              name="copies"
              value={formData.copies.join(', ')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                copies: e.target.value.split(',').map(item => item.trim())
              }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.urgent}
                  onChange={handleChange}
                  name="urgent"
                  color="primary"
                />
              }
              label="Urgent"
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
                sx={{ mt: 1 }}
              />
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Section Instructions */}
        <Typography variant="subtitle1" gutterBottom>
          Instruction :
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.instructions.elementReponse}
                  onChange={handleInstructionChange}
                  name="elementReponse"
                  color="primary"
                />
              }
              label="Elément de Réponse"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.instructions.exploitationCompte}
                  onChange={handleInstructionChange}
                  name="exploitationCompte"
                  color="primary"
                />
              }
              label="Exploitation et Compte"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.instructions.avecAccord}
                  onChange={handleInstructionChange}
                  name="avecAccord"
                  color="primary"
                />
              }
              label="Avec Accord"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.instructions.application}
                  onChange={handleInstructionChange}
                  name="application"
                  color="primary"
                />
              }
              label="Application"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.instructions.enquete}
                  onChange={handleInstructionChange}
                  name="enquete"
                  color="primary"
                />
              }
              label="Enquête"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.instructions.etude}
                  onChange={handleInstructionChange}
                  name="etude"
                  color="primary"
                />
              }
              label="Etude"
            />
          </Grid>
        </Grid>

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Supprimer
          </Button>
          <Box>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              sx={{ mr: 2 }}
            >
              Imprimer
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              type="submit"
            >
              Valider
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ReceptionCourrierForm;