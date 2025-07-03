import React, { useState, useEffect } from 'react';
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
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  Badge,
  Tabs,
  Tab,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MenuItemSelect,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Mail,
  AccountBalance,
  Notifications,
  Logout,
  Dashboard,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import courrierApi from '../services/courrierApi';  // ton api custom
import useAutoLogout from './Authentification/useAutoLogout';

const CourrierListService = () => {
    useAutoLogout(); // ✅ Doit être au tout début du composant
  const navigate = useNavigate();
  const [courriers, setCourriers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pour Dialog bureau
  const [openBureauDialog, setOpenBureauDialog] = useState(false);
  const [selectedBureau, setSelectedBureau] = useState('');

  const open = Boolean(anchorEl);
//

console.log("LocalStorage contenu:", localStorage);

const token = localStorage.getItem('token');
const idUser = localStorage.getItem('id_user');
const role = localStorage.getItem('role');
const service = localStorage.getItem('service');
const bureau = localStorage.getItem('bureau');
  // Charger les données depuis l'API
  const fetchCourriers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await courrierApi.getCourriersParEntite(service);
      console.log("service:",service)
      setCourriers(response.data);
    } catch (err) {
      setError(err.message || "Failed to load courriers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourriers();
  }, []);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await courrierApi.getCourriersParEntite(service);
      console.log("date:",response.data)
      setCourriers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourrier = () => {
    navigate('/courriers/add');
  };

  const handleViewDetails = (id) => {
    navigate(`/courriers/${id}`);
  };

  const handleDeleteCourrier = async () => {
    if (!selectedRow) return;

    const isConfirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le courrier avec la référence "${selectedRow.reference}" ?`
    );

    if (isConfirmed) {
      try {
        await courrierApi.deleteCourrier(selectedRow.id);
        alert("Courrier supprimé avec succès !");
        handleMenuClose();
        await fetchCourriers();
      } catch (err) {
        alert("Une erreur est survenue lors de la suppression du courrier.");
      }
    }
  };

  // --- DIALOG BUREAU ---

  // Ouvrir dialog pour sélectionner bureau
  const handleOpenBureauDialog = () => {
    if (!selectedRow) {
      alert("Veuillez d'abord sélectionner un courrier.");
      return;
    }
    setOpenBureauDialog(true);
  };

  // Confirmer transfert
  const handleConfirmTransferToBureau = async () => {
    if (!selectedBureau) {
      alert("Veuillez sélectionner un bureau.");
      return;
    }

    const isConfirmed = window.confirm(
      `Êtes-vous sûr de vouloir transférer le courrier ${selectedRow.numeroOrdre} au bureau ${selectedBureau} ?`
    );

    if (!isConfirmed) return;

    try {
      // Utilisation de courrierApi : crée la méthode updateStatusBureau dans courrierApi.js
      await courrierApi.updateStatusBureau(selectedRow.id, selectedBureau);

      alert(`Le courrier ${selectedRow.numeroOrdre} a été transféré au bureau ${selectedBureau} avec succès.`);
      setOpenBureauDialog(false);
      setSelectedBureau('');
      handleMenuClose();
      await fetchCourriers();
    } catch (error) {
      alert(`Échec du transfert du courrier ${selectedRow.numeroOrdre} au bureau ${selectedBureau}.`);
    }
  };

  // Marquer comme traité
  const handleMarkAsTreated = async () => {
    if (!selectedRow) return;

    const isConfirmed = window.confirm(
      `Voulez-vous vraiment marquer le courrier ${selectedRow.numeroOrdre} ("${selectedRow.objet}") comme traité ?`
    );

    if (!isConfirmed) return;

    try {
      await courrierApi.updateDateReceptioTraite(selectedRow.id);
      alert(`Le courrier ${selectedRow.numeroOrdre} a été marqué comme traité.`);
      handleMenuClose();
      await fetchCourriers();
    } catch (err) {
      alert(`Échec du marquage du courrier ${selectedRow.numeroOrdre} comme traité.`);
    }
  };

const getStatusColor = (status) => {
  switch (status) {
    case 'TRAITE':
      return 'success'; // vert
    case 'RECU_SERVICE':
      return 'info'; // bleu clair
    case 'RECU_BUREAU':
      return 'secondary'; // violet/gris
    case 'REJETE':
      return 'error'; // rouge
    case 'EN_ATTENTE':
      return 'warning'; // orange
    default:
      return 'default'; // gris
  }
};
  const getStatusLabel = (status) => {
  switch (status) {
    case 'RECU_SERVICE':
      return 'Réception service en cours';
    case 'RECU_BUREAU':
      return 'Réception bureau en cours';
    case 'TRAITE':
      return 'Traité';
    case 'REJETE':
      return 'Rejeté';
    case 'EN_ATTENTE':
      return 'En attente';
    default:
      return status;
  }
};
const bureauxParService = {
  "SERVICE DE LA PLANIFICATION": [
    "BUREAU DE SUIVI EVALUATION",
    "BUREAU DES PROGRAMMES ET DU BUDGET"
  ],
  "SERVICE DE LA COMPTABILITE ET FINANCES": [
    "BUREAU DE LA COMPTABILITE PUBLIQUE",
    "BUREAU FINANCIER",
    "BUREAU DE LA COMPTABILITE GENERALE ET ANALYTIQUE"
  ],
  "SERVICE INFORMATIQUE": [
    "BUREAU DE L'EXPLOITATION ET DE LA MAINTENANCE DU SYSTÈME INFORMATIQUE"
  ]
};

const bureauxDisponibles = selectedRow
  ? bureauxParService[selectedRow.serviceDestinataire] || []
  : [];


  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const handleEditCourrier = () => {
    if (selectedRow) {
      navigate(`/courriers/edit/${selectedRow.id}`);
      handleMenuClose();
    }
  };

  const handleLogout = () => {
  // Vider tout le localStorage
  localStorage.clear();

  // Rediriger vers la page de login
  navigate("/login");
};
  if (loading) return <Typography>Chargement en cours...</Typography>;
  if (error) return <Typography color="error">Erreur: {error}</Typography>;

  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor: "primary.main", boxShadow: 3 }}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Mail sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
              Gestion des Courriers
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

      {/* <Paper sx={{ bgcolor: "white", boxShadow: 2 }}>
        <Container maxWidth="xl">
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => {
        if (newValue === 0) navigate('/courriers/Service');
        if (newValue === 2) navigate('/decomptes/scf');
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
        icon={<Dashboard />} 
        label="Tableau de Bord" 
        iconPosition="start" 
        sx={{ mr: 2 }} 
      />
      <Tab 
        icon={<Mail />} 
        label="Gestion Courriers" 
        iconPosition="start" 
        sx={{ mr: 2 }} 
      />
      <Tab 
        icon={<AccountBalance />} 
        label="Suivi Décomptes" 
        iconPosition="start" 
        sx={{
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: 3,
            bgcolor: 'primary.main',
            borderRadius: '3px 3px 0 0',
            opacity: activeTab === 2 ? 1 : 0,
            transition: 'opacity 0.3s'
          }
        }}
      />
    </Tabs>
        </Container>
      </Paper> */}

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Liste des Courriers
          </Typography>
          <Box>
            <Tooltip title="Rafraîchir">
              <IconButton sx={{ mr: 1 }} onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filtrer">
              <IconButton sx={{ mr: 1 }}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCourrier}
            >
              Nouveau Courrier
            </Button>
          </Box>
        </Box>

        {/* Statistiques */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle2">Courriers en attente</Typography>
            <Typography variant="h4">
              {courriers.filter(c => c.status === 'EN_ATTENTE').length}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle2">En cours de traitement</Typography>
            <Typography variant="h4">
              {courriers.filter(c => c.status === 'EN_COURS').length}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle2">Courriers traités</Typography>
            <Typography variant="h4">
              {courriers.filter(c => c.status === 'TRAITE').length}
            </Typography>
          </Paper>
        </Box>

        {/* Tableau */}
        <Paper sx={{ mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Référence</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Expéditeur</TableCell>
                  <TableCell>Objet</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date arrivée</TableCell>
                  <TableCell>Urgent</TableCell>
                  <TableCell>Date Envoi</TableCell>
                  <TableCell>Date Reception Service</TableCell>
                  <TableCell>Date Reception Bureau</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courriers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.numeroOrdre}</TableCell>
                    <TableCell>{row.typeCourrier}</TableCell>
                    <TableCell>{row.entiteExpeditrice}</TableCell>
                    <TableCell>{row.objet}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(row.status)}
                        size="small"
                        color={getStatusColor(row.status)}
                        onClick={() => { }} // Add this line
                      />
                    </TableCell>
                    <TableCell>{formatDate(row.dateArrivee)}</TableCell>
                    <TableCell>
                      {row.urgent && <WarningIcon color="error" />}
                    </TableCell>
                    <TableCell>{formatDate(row.dateEnvoi)}</TableCell>
                    <TableCell>{formatDate(row.dateReceptionService)}</TableCell>
                    <TableCell>{formatDate(row.dateReceptionBureau)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, row)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={courriers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
          />
        </Paper>

        {/* Menu contextuel */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            handleViewDetails(selectedRow.id);
            handleMenuClose();
          }}>
            Voir les détails
          </MenuItem>
          <MenuItem onClick={handleEditCourrier}>Modifier</MenuItem>
          <Divider />
          <MenuItem onClick={handleOpenBureauDialog}>Transférer au bureau</MenuItem>
          <MenuItem onClick={handleMarkAsTreated}>Marquer comme traité</MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteCourrier} sx={{ color: 'error.main' }}>Supprimer</MenuItem>
        </Menu>

        {/* Dialog sélection bureau */}
        <Dialog open={openBureauDialog} onClose={() => setOpenBureauDialog(false)} >
          <DialogTitle>Transférer au bureau</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2, minWidth: 450, }}>
              <InputLabel id="select-bureau-label">Bureau</InputLabel>
              <Select
                labelId="select-bureau-label"
                value={selectedBureau}
                label="Bureau"
                onChange={(e) => setSelectedBureau(e.target.value)}
              >
              <MenuItemSelect value="">
                <em>Choisir un bureau</em>
              </MenuItemSelect>
              {bureauxDisponibles.map((bureau, index) => (
                <MenuItemSelect key={index} value={bureau}>
                  {bureau}
                </MenuItemSelect>
              ))}

                {/* Ajoute ici d'autres bureaux si besoin */}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBureauDialog(false)}>Annuler</Button>
            <Button
              variant="contained"
              onClick={handleConfirmTransferToBureau}
              disabled={!selectedBureau}
            >
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CourrierListService;
