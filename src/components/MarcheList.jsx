import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import courrierApi from '../services/courrierApi';

const MarcheList = () => {
  const [marches, setMarches] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMarche, setNewMarche] = useState({ entite: '', objet: '', numOperation: '', fournisseur: '', montant: '' });

  const fetchMarches = async () => {
    try {
      const res = await courrierApi.getAllMarches();
      setMarches(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des marchés:", error);
    }
  };

  useEffect(() => {
    fetchMarches();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSave = async () => {
    try {
        console.log("data :",newMarche)
      await courrierApi.createMarche(newMarche);
      fetchMarches();
      handleCloseDialog();
      setNewMarche({ entite: '', objet: '', numOperation: '', fournisseur: '', montant: '' });
    } catch (err) {
      console.error("Erreur lors de l'ajout du marché:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Liste des Marchés</Typography>
        <Box>
          <Tooltip title="Rafraîchir">
            <IconButton onClick={fetchMarches}><RefreshIcon /></IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
            Nouveau Marché
          </Button>
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Entité</TableCell>
                <TableCell>Objet</TableCell>
                <TableCell>Numéro Marché</TableCell>
                <TableCell>Fournisseur</TableCell>
                <TableCell>Montant</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((marche, index) => (
                <TableRow key={index}>
                  <TableCell>{marche.entite}</TableCell>
                  <TableCell>{marche.objet}</TableCell>
                  <TableCell>{marche.numOperation}</TableCell>
                  <TableCell>{marche.fournisseur}</TableCell>
                  <TableCell>{parseFloat(marche.montant).toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={marches.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ajouter un nouveau marché</DialogTitle>
        <DialogContent>
          <TextField label="Entité" fullWidth margin="dense" value={newMarche.entite} onChange={(e) => setNewMarche({ ...newMarche, entite: e.target.value })} />
          <TextField label="Objet" fullWidth margin="dense" value={newMarche.objet} onChange={(e) => setNewMarche({ ...newMarche, objet: e.target.value })} />
          <TextField label="Numéro Marché" fullWidth margin="dense" value={newMarche.numOperation} onChange={(e) => setNewMarche({ ...newMarche, numOperation: e.target.value })} />
          <TextField label="Fournisseur" fullWidth margin="dense" value={newMarche.fournisseur} onChange={(e) => setNewMarche({ ...newMarche, fournisseur: e.target.value })} />
          <TextField label="Montant" fullWidth margin="dense" type="number" value={newMarche.montant} onChange={(e) => setNewMarche({ ...newMarche, montant: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarcheList;
