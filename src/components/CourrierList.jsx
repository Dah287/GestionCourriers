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
  Button
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
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import courrierApi from '../services/courrierApi';
import useAutoLogout from './Authentification/useAutoLogout';

const CourrierList = () => {
  useAutoLogout(); // ✅ Doit être au tout début du composant
  const navigate = useNavigate();
  const [courriers, setCourriers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const open = Boolean(anchorEl);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchCourriers = async () => {
      try {
        const response = await courrierApi.getAllCourriers();
        setCourriers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourriers();
  }, []);


  // Charger les données depuis l'API
  const fetchCourriers = async () => { // Made this a separate function to easily call it again
    setLoading(true); // Set loading before fetch
    setError(null); // Clear previous errors
    try {
      const response = await courrierApi.getAllCourriers();
      setCourriers(response.data);
    } catch (err) {
      console.error("Error fetching courriers:", err);
      setError(err.message || "Failed to load courriers.");
    } finally {
      setLoading(false); // Always set loading to false
    }
  };

  useEffect(() => {
    fetchCourriers(); // Initial fetch
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
      const response = await courrierApi.getAllCourriers();
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


    // --- NEW DELETE FUNCTION ---
  const handleDeleteCourrier = async () => {
    if (!selectedRow) return;

    // Confirmation dialog
    const isConfirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le courrier avec la référence "${selectedRow.reference}" ?`
    );

    if (isConfirmed) {
      try {
        await courrierApi.deleteCourrier(selectedRow.id);
        alert("Courrier supprimé avec succès !");
        handleMenuClose(); // Close the menu
        await fetchCourriers(); // Refresh the list after deletion
      } catch (err) {
        console.error("Error deleting courrier:", err);
        alert("Une erreur est survenue lors de la suppression du courrier.");
      }
    }
  };
  // --- END NEW DELETE FUNCTION ---
const handleTransferToService = async () => {
  if (!selectedRow) return;
  
  // Ajout de la confirmation
  const isConfirmed = window.confirm(
    `Êtes-vous sûr de vouloir transférer le decompte ${selectedRow.numDecompte} au BCP ?`
  );
  
  if (!isConfirmed) return;

  try {
    await courrierApi.updateDateReceptionService(selectedRow.id);
    
    // Message de succès plus informatif
    alert(`Le courrier ${selectedRow.numeroOrdre} a été transféré au service avec succès.`);
    
    handleMenuClose();
    await fetchCourriers();
  } catch (err) {
    console.error("Erreur lors du transfert au service:", err);
    alert(`Échec du transfert du courrier ${selectedRow.numeroOrdre} au service.`);
  }
};

  const handleMarkAsTreated1 = async () => {
    if (!selectedRow) return;
    const isConfirmed = window.confirm(`Marquer ${selectedRow.numeroOrdre} comme traité Définitivement?`);
    if (!isConfirmed) return;

    try {
      await courrierApi.updateDateReceptioTraite1(selectedRow.id);
      alert("Marqué comme traité Définitivement.");
      handleMenuClose();
      await fetchCourriers();
    } catch (err) {
      alert("Erreur de traitement.");
    }
  };
const getStatusLabel = (status) => {
  switch (status) {
    case 'RECU':
      return 'Courrier reçu'; // ✅ nouveau
    case 'RECU_SERVICE':
      return 'Envoyé au service';
    case 'RECU_BUREAU':
      return 'Envoyé au bureau';
    case 'BUREAU_SERVICE':
      return 'Réponse bureau';
    case 'TRAITE':
      return 'Courrier traité';
    case 'TRAITE_D':
      return 'Courrier traité définitivement';
    case 'REJETE':
      return 'Rejeté';
    case 'EN_ATTENTE':
      return "En attente d'envoi";
    default:
      return status;
  }
};


const getStatusColor = (status) => {
  switch (status) {
    case 'RECU':
      return 'warning'; // ✅ jaune/orange
    case 'TRAITE':
      return 'success'; // vert
    case 'TRAITE_D':
      return 'primary'; // bleu foncé
    case 'RECU_SERVICE':
      return 'info'; // bleu clair
    case 'RECU_BUREAU':
      return 'secondary'; // violet/gris
    case 'BUREAU_SERVICE':
      return 'black'; // tu peux aussi changer pour une couleur custom
    case 'REJETE':
      return 'error'; // rouge
    case 'EN_ATTENTE':
      return 'default'; // gris (car warning déjà pris pour RECU)
    default:
      return 'default'; // gris
  }
};







  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const handleEditCourrier = () => {
    if (selectedRow) {
      navigate(`/courriers/edit/${selectedRow.id}`); // Navigate to the edit form
      handleMenuClose(); // Close the menu after navigation
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

<Paper sx={{ bgcolor: "white", boxShadow: 2 }}>
  <Container maxWidth="xl">
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => {
        if (newValue === 1) navigate('/decomptes');
        //if (newValue === 2) navigate('/dashbord');
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
              label="Gestion Courriers" 
              iconPosition="start" 
              sx={{ mr: 2 }} 
            />
            <Tab 
              icon={<AccountBalance />} 
              label="Suivi Décomptes" 
              iconPosition="start" 
              sx={{ mr: 2 }} 
            />
    </Tabs>
  </Container>
</Paper>

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
            <Typography variant="subtitle2">En cours Réception Service</Typography>
            <Typography variant="h4">
              {courriers.filter(c => c.status === 'RECU_SERVICE').length}
            </Typography>
          </Paper>
                    <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle2">En cours Réception Bureau</Typography>
            <Typography variant="h4">
              {courriers.filter(c => c.status === 'RECU_BUREAU').length}
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
                  <TableCell>Entite Transmis</TableCell>
                   <TableCell>Service Transmis</TableCell>
                    <TableCell>Bureau Transmis</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date arrivée</TableCell>
                  <TableCell>Urgent</TableCell>
                   <TableCell>Délais</TableCell>
                  <TableCell>Date Envoi</TableCell>
                   <TableCell>Date Reception Service</TableCell>
                    <TableCell>Date Reception Bureau</TableCell>
                     <TableCell>Date Traitement</TableCell>
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
                     <TableCell>{row.entiteTransmise}</TableCell>
                     <TableCell>{row.serviceDestinataire}</TableCell>
                      <TableCell>{row.bureauRecepteur}</TableCell>
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
                    <TableCell>{row.delaisJours} /Jours</TableCell>
                    <TableCell>{formatDate(row.dateEnvoi)}</TableCell>
                      <TableCell>{formatDate(row.dateReceptionService)}</TableCell>
                        <TableCell>{formatDate(row.dateReceptionBureau)}</TableCell>
                        <TableCell>{formatDate(row.dateTraitement)}</TableCell>
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
          {/* <MenuItem onClick={() => {
            handleViewDetails(selectedRow.id);
            handleMenuClose();
          }}>
            Voir les détails
          </MenuItem>
          <MenuItem onClick={handleEditCourrier}>Modifier</MenuItem> */}
          <Divider />
          <MenuItem onClick={handleTransferToService}
           disabled={selectedRow?.status !== 'EN_ATTENTE'}
          >Transférer au service</MenuItem>
          <MenuItem onClick={handleMarkAsTreated1}
          disabled={selectedRow?.status !== 'EN_ATTENTE'}
          >Marquer comme traité Définitivement</MenuItem>
          <Divider />
          {/* <MenuItem onClick={handleDeleteCourrier} sx={{ color: 'error.main' }}>Supprimer</MenuItem> */}
        </Menu>
      </Box>
    </Box>
  );
};

export default CourrierList;