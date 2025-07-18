import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Button, Modal, List, 
  ListItem, ListItemText,Badge, MenuItem, Select, FormControl, InputLabel, Divider,
  AppBar, Toolbar, Chip,Tabs,Tooltip,
  Tab,  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney,
  Mail,
  AccountBalance,
  Notifications,
  Logout ,
  Dashboard
} from '@mui/icons-material';

import courrierApi from '../services/courrierApi';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';

const MarcheList = () => {

      const navigate = useNavigate();
  const [marches, setMarches] = useState([]);
  const [page, setPage] = useState(0);
      const [activeTab, setActiveTab] = useState(3);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMarche, setEditingMarche] = useState(null);
  const [formMarche, setFormMarche] = useState({ entite: '', objet: '', numOperation: '', fournisseur: '', montant: '' });

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

  const handleOpenDialog = (marche = null) => {
    setEditingMarche(marche);
    setFormMarche(marche || { entite: '', objet: '', numOperation: '', fournisseur: '', montant: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMarche(null);
  };

  const handleSave = async () => {
    try {
      if (editingMarche) {
        await courrierApi.updateMarche(editingMarche.id, formMarche);
      } else {
        await courrierApi.createMarche(formMarche);
      }
      fetchMarches();
      handleCloseDialog();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce marché ?")) {
      try {
        await courrierApi.deleteMarche(id);
        fetchMarches();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
      }
    }
  };
  const handleLogout = () => {
  // Vider tout le localStorage
  localStorage.clear();

  // Rediriger vers la page de login
  navigate("/login");
};

  return (
<Box>

  <AppBar position="static" sx={{ bgcolor: "primary.main", boxShadow: 3 }}>
                <Toolbar>
                  <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                    <AttachMoney sx={{ mr: 2, fontSize: 32 }} />
                    <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                      Gestion des Décomptes
                    </Typography>
                  </Box>
        
                  <IconButton color="inherit" size="large">
                    <Badge badgeContent={17} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>
                          <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
                            Déconnecter
                          </Button>
                </Toolbar>
              </AppBar>

      <Paper sx={{ bgcolor: "white", boxShadow: 2 }}>
  <Container maxWidth="xl">
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => {
        if (newValue === 1) navigate('/dashbord/decomptes');
        if (newValue === 0) navigate('/dashbord');
        if (newValue === 2) navigate('/historique/dashbord');
          if (newValue === 4) navigate('/user');
        setActiveTab(newValue);
      }}
      aria-label="navigation tabs"
      sx={{
        "& .MuiTab-root": {
          minHeight: 64,
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 500,
        },
      }}
    >
            <Tab 
              icon={<Mail />} 
              label="Tableau de Bord Gestion Courriers" 
              iconPosition="start" 
              sx={{ mr: 2 }} 
            />
            <Tab 
              icon={<AccountBalance />} 
              label="Tableau de Bord Suivi Décomptes" 
              iconPosition="start" 
              sx={{ mr: 2 }} 
            />

            <Tab 
            icon={<HistoryIcon />} 
            label="Historique Courrier" 
            iconPosition="start" 
            sx={{ mr: 2 }} 
            />

                <Tab 
                icon={<GavelIcon />} 
                label="Gestion des Marchés" 
                iconPosition="start" 
                sx={{ mr: 2 }} 
                />
                <Tab
                  icon={<PersonIcon />}
                  label="Utilisateurs"
                  iconPosition="start"
                  sx={{ mr: 2 }}
                />

    </Tabs>
  </Container>
</Paper>

    
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Liste des Marchés</Typography>
        <Box>
          <Tooltip title="Rafraîchir">
            <IconButton onClick={fetchMarches}><RefreshIcon /></IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
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
                <TableCell>Numéro</TableCell>
                <TableCell>Fournisseur</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((marche) => (
                <TableRow key={marche.id}>
                  <TableCell>{marche.entite}</TableCell>
                  <TableCell>{marche.objet}</TableCell>
                  <TableCell>{marche.numOperation}</TableCell>
                  <TableCell>{marche.fournisseur}</TableCell>
                  <TableCell>
                    {parseFloat(marche.montant).toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'MAD'
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Modifier">
                      <IconButton onClick={() => handleOpenDialog(marche)}><EditIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton onClick={() => handleDelete(marche.id)}><DeleteIcon color="error" /></IconButton>
                    </Tooltip>
                  </TableCell>
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
        <DialogTitle>{editingMarche ? "Modifier Marché" : "Ajouter Marché"}</DialogTitle>
        <DialogContent>
          <TextField label="Entité" fullWidth margin="dense" value={formMarche.entite} onChange={(e) => setFormMarche({ ...formMarche, entite: e.target.value })} />
          <TextField label="Objet" fullWidth margin="dense" value={formMarche.objet} onChange={(e) => setFormMarche({ ...formMarche, objet: e.target.value })} />
          <TextField label="Numéro Marché" fullWidth margin="dense" value={formMarche.numOperation} onChange={(e) => setFormMarche({ ...formMarche, numOperation: e.target.value })} />
          <TextField label="Fournisseur" fullWidth margin="dense" value={formMarche.fournisseur} onChange={(e) => setFormMarche({ ...formMarche, fournisseur: e.target.value })} />
          <TextField label="Montant" fullWidth margin="dense" type="number" value={formMarche.montant} onChange={(e) => setFormMarche({ ...formMarche, montant: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Box>
  );
};

export default MarcheList;
