import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
  Divider,
  Autocomplete,
    Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { AccountBalance, Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import courrierApi from '../services/courrierApi';

const AjoutDecompte = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingMarches, setLoadingMarches] = useState(false);
  const [errors, setErrors] = useState({});
  const [marches, setMarches] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
const [searchTerm, setSearchTerm] = useState('');

  const currentDate = format(new Date(), 'yyyy-MM-dd');

  const [decompte, setDecompte] = useState({
    annee: new Date().getFullYear(),
    numDecompte: '',
    montant: '',
    dateAttachement: currentDate,
    dateEtablis: currentDate,
    dateSignature: currentDate,
    statut: 'EN_ATTENTE',
    motif: null,
    marche: {
      id: ''
    }
  });

  const statuts = [
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'PAYE', label: 'Payé' },
    { value: 'REJETE', label: 'Rejeté' }
  ];

  // Charger la liste des marchés depuis l'API
  useEffect(() => {
    const fetchMarches = async () => {
      setLoadingMarches(true);
      try {
        const response = await courrierApi.getAllMarches();
        setMarches(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des marchés:', error);
      } finally {
        setLoadingMarches(false);
      }
    };
    
    fetchMarches();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!decompte.numDecompte) newErrors.numDecompte = 'Numéro de décompte requis';
    if (!decompte.montant || isNaN(decompte.montant)) newErrors.montant = 'Montant invalide';
    if (!decompte.marche.id) newErrors.marche = 'Marché requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        annee: decompte.annee,
        numDecompte: decompte.numDecompte,
        montant: parseFloat(decompte.montant),
        dateAttachement: decompte.dateAttachement,
        dateEtablis: decompte.dateEtablis,
        dateSignature: decompte.dateSignature,
        statut: decompte.statut,
        motif: decompte.motif,
         marche: {  // Structure que vous voulez envoyer
        id: decompte.marche.id
      }
      };
      console.log("data:",payload)
      await courrierApi.createDecompte(payload);
      navigate('/decomptes');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert("Une erreur est survenue lors de la création du décompte");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDecompte(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarcheChange = (event, newValue) => {
    setDecompte(prev => ({
      ...prev,
      marche: {
        id: newValue?.id || ''
      }
    }));
  };

  const handleDateChange = (name, value) => {
    setDecompte(prev => ({
      ...prev,
      [name]: value ? format(new Date(value), 'yyyy-MM-dd') : ''
    }));
  };

  const handleCancel = () => {
    navigate('/decomptes');
  };

  const filteredMarches = marches.filter(m =>
  m.numOperation.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1100, margin: "auto" , mt: 8, }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <AccountBalance sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
          Nouveau Décompte
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ bgcolor: "info.light", p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "white", fontWeight: "bold" }}>
            Sélection du marché
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sx={{width: "31%",}}>
<Button
  variant="outlined"
  onClick={() => setOpenDialog(true)}
  fullWidth
>
  Choisir un marché
</Button>

{decompte.marche.id && (
  <Typography variant="body2" sx={{ mt: 1 }}>
    Marché sélectionné : {
      marches.find(m => m.id === decompte.marche.id)?.numOperation || "Non défini"
    }
  </Typography>
)}

          </Grid>
        </Grid>

        {/* Section Informations de base */}
        <Box sx={{ bgcolor: "primary.light", p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "white", fontWeight: "bold" }}>
            Informations principales
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Année"
              name="annee"
              type="number"
              value={decompte.annee}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Numéro de décompte"
              name="numDecompte"
              value={decompte.numDecompte}
              onChange={handleChange}
              error={!!errors.numDecompte}
              helperText={errors.numDecompte}
              required
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Montant (MDH)"
              name="montant"
              type="number"
              value={decompte.montant}
              onChange={handleChange}
              error={!!errors.montant}
              helperText={errors.montant}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          {/* <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                name="statut"
                value={decompte.statut}
                onChange={handleChange}
                label="Statut"
              >
                {statuts.map((statut) => (
                  <MenuItem key={statut.value} value={statut.value}>
                    {statut.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}
        </Grid>

        {/* Section Dates importantes */}
        <Box sx={{ bgcolor: "secondary.light", p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "white", fontWeight: "bold" }}>
            Dates importantes
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Date attachement"
              type="date"
              value={decompte.dateAttachement}
              onChange={(e) => handleDateChange('dateAttachement', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Date établis"
              type="date"
              value={decompte.dateEtablis}
              onChange={(e) => handleDateChange('dateEtablis', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Date signature"
              type="date"
              value={decompte.dateSignature}
              onChange={(e) => handleDateChange('dateSignature', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* Section Marché */}


        {/* Section Rejet */}
        {decompte.statut === 'REJETE' && (
          <>
            <Box sx={{ bgcolor: "warning.light", p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: "white", fontWeight: "bold" }}>
                Motif de rejet
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Motif de rejet"
                  name="motif"
                  value={decompte.motif || ''}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </>
        )}

        {/* Boutons d'action */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={handleCancel}
            sx={{ borderRadius: 2 }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<Save />}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Enregistrer'}
          </Button>
        </Box>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
  <DialogTitle>Choisir un marché</DialogTitle>
  <Box mt={0} />
  <DialogContent>
    <TextField
      fullWidth
      label="Filtrer par Numéro d'opération"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ mb: 2 }}
    />
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Numéro</TableCell>
          <TableCell>Objet</TableCell>
          <TableCell>Fournisseur</TableCell>
          <TableCell>Montant</TableCell>
          <TableCell>Entité</TableCell>
          <TableCell>Sélection</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredMarches.map((marche) => (
          <TableRow key={marche.id}>
            <TableCell>{marche.numOperation}</TableCell>
            <TableCell>{marche.objet}</TableCell>
            <TableCell>{marche.fournisseur}</TableCell>
            <TableCell>{marche.montant}</TableCell>
            <TableCell>{marche.entite}</TableCell>
            <TableCell>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  setDecompte(prev => ({
                    ...prev,
                    marche: { id: marche.id },
                    numDecompte: marche.numOperation // Auto-remplissage du champ Numéro de décompte
                  }));
                  setOpenDialog(false);
                }}

              >
                Sélectionner
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)} color="error">
      Fermer
    </Button>
  </DialogActions>
</Dialog>

    </Paper>
  );
};

export default AjoutDecompte;