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
import NotificationsIcon from '@mui/icons-material/Notifications'; // ou toute autre icône pertinente

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
const CourrierListService = () => {
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

  // Pour Dialog bureau
  const [openBureauDialog, setOpenBureauDialog] = useState(false);
const [selectedBureaux, setSelectedBureaux] = useState([]);


  const open = Boolean(anchorEl);
//

//console.log("LocalStorage contenu:", localStorage);

const token = localStorage.getItem('token');
const idUser = localStorage.getItem('id_user');
const role = localStorage.getItem('role');
const service = localStorage.getItem('service');
const bureau = localStorage.getItem('bureau');
const matricule = localStorage.getItem('matricule');
  // Charger les données depuis l'API
  const fetchCourriers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await courrierApi.getCourriersParEntite(service);
     // console.log("service:",service)
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
  if (selectedBureaux.length === 0) {
    alert("Veuillez sélectionner au moins un bureau.");
    return;
  }

  const isConfirmed = window.confirm(
    `Confirmer le transfert vers ${selectedBureaux.join(', ')} ?`
  );

  if (!isConfirmed) return;

  try {
    if (selectedBureaux.length === 1) {
      // Cas simple : 1 bureau, mise à jour
      await courrierApi.updateStatusBureau(selectedRow.id, selectedBureaux[0]);
    } else {
      // Cas multiple : copier le courrier pour chaque bureau
      const originalCourrier = { ...selectedRow };

      for (const bureau of selectedBureaux) {
        const nouveauCourrier = {
          ...originalCourrier,
          id: null, // Laisse l'ID vide ou null pour le back-end
          status: "RECU_BUREAU",
          bureauRecepteur: bureau,
          dateReceptionService: new Date(),
          dateReceptionB: new Date(),
        };
console.log("Dupliquer et transférer le courrier",nouveauCourrier)
        await courrierApi.createCourrier(nouveauCourrier); // Assure-toi que cette méthode existe
          // ✅ Mise à jour du statut du courrier original à 'TRANSFERE'
        await courrierApi.updateDateReceptioTraite(selectedRow.id);
      }

      alert(`Courrier transférer avec succès pour les bureaux : ${selectedBureaux.join(', ')}`);
    }

    setOpenBureauDialog(false);
    setSelectedBureaux([]);
    handleMenuClose();
    await fetchCourriers();
  } catch (error) {
    alert(`Erreur lors du transfert : ${error.message}`);
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
    "BUREAU DE L'EXPLOITATION ET DE LA MAINTENANCE DU SYSTÈME INFORMATIQUE",
    "BUREAU DE ETUDE ET DEVELOPPEMENT INFORMATIQUE"
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

<Paper sx={{ bgcolor: "white", boxShadow: 2 }}>
  <Container maxWidth="xl">
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => {
        if (newValue === 1) navigate('/decomptes/scf');
        // if (newValue === 2) navigate('/dashboard');
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

      {matricule === '7801' && (
        <Tab 
          icon={<AccountBalance />} 
          label="Suivi Décomptes" 
          iconPosition="start" 
          sx={{ mr: 2 }} 
        />
      )}
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
        {/* <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
        </Box> */}

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
                  {/* <TableCell>Entité</TableCell> */}
             
                    <TableCell>Date arrivée</TableCell>
                 <TableCell>Service  <strong>&</strong> Date Reception</TableCell> {/* En-tête */}

                
                
                  <TableCell>Délais</TableCell>
                  <TableCell>Urgent</TableCell>
                
               
                 
                 <TableCell>Bureau  <strong>&</strong> Date Reception</TableCell> {/* En-tête */}
                  <TableCell>Date Traitement</TableCell>
                    <TableCell>Statut</TableCell>
<TableCell>Courriers <strong>&</strong> Reponse </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courriers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.numeroOrdre}</TableCell>
                      <TableCell>{row.typeCourrier}</TableCell>
                      <TableCell>{row.entiteExpeditrice}</TableCell>
                      <TableCell>{row.objet}</TableCell>
                      {/* <TableCell>{row.entiteTransmise}</TableCell> */}
             
                       <TableCell>{formatDate(row.dateArrivee)}</TableCell>
<TableCell>
  <div>
    <strong>Service :</strong> {row.serviceDestinataire}<br />
    <strong>Date Reception :</strong> {formatDate(row.dateEnvoi)}
  </div>
</TableCell>
                      
                            
                      
                   <TableCell>{row.delaisJours} J</TableCell>  
                    <TableCell>
  {row.delaisJours <= 2 ? (
    <Chip
      label="Très urgent"
      size="small"
      color="error"
      icon={<WarningIcon />}
    />
  ) : row.delaisJours <= 4 ? (
    <Chip
      label="Urgent"
      size="small"
      color="warning"
      icon={<WarningIcon />}
    />
  ) : null}
</TableCell>

                      
                   
                      <TableCell>
  <div>
    <strong>Bureau :</strong> {row.bureauRecepteur}<br />
    <strong>Date Reception :</strong> {formatDate(row.dateReceptionService)}
  </div>
</TableCell>
                       <TableCell>{formatDate(row.dateTraitement)}</TableCell>
<TableCell>
  <Chip
    label={getStatusLabel(row.status)}
    size="small"
    color={getStatusColor(row.status)}
    icon={row.status === 'BUREAU_SERVICE' ? <NotificationsIcon  /> : undefined}
    onClick={() => {}}
  />
</TableCell>
                       {/* Nouvelle colonne pour visualiser le PDF */}
<TableCell align="center">
  <div
    style={{
      display: "flex",
      justifyContent: "center", // centre horizontalement
      alignItems: "center",     // centre verticalement
      gap: "8px"
    }}
  >
    {/* Courrier original */}
    {row.cheminFichierPdf && (
      <IconButton
        component="a"
        href={`http://192.168.1.68:8080/uploads/courriers/${row.cheminFichierPdf.split("\\").pop()}`}
        target="_blank"
        rel="noopener noreferrer"
        color="error"
        size="small"
      >
        <PictureAsPdfIcon />
      </IconButton>
    )}

    {/* Réponse */}
    {row.cheminFichierReponsePdf && (
      <IconButton
        component="a"
        href={`http://192.168.1.68:8080/uploads/courriers/${row.cheminFichierReponsePdf.split("\\").pop()}`}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        size="small"
      >
        <PictureAsPdfIcon />
      </IconButton>
    )}
  </div>
</TableCell>
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
          <MenuItem onClick={handleOpenBureauDialog}   disabled={
    !selectedRow || 
    (
      // selectedRow.status !== "RECU_BUREAU" &&
      
      selectedRow.status !== "RECU_SERVICE")
  }
  >Transférer au bureau</MenuItem>
          <MenuItem onClick={handleMarkAsTreated}>Marquer comme traité</MenuItem>
          <Divider />
          {/* <MenuItem onClick={handleDeleteCourrier} sx={{ color: 'error.main' }}>Supprimer</MenuItem> */}
        </Menu>

        {/* Dialog sélection bureau */}
<Dialog
  open={openBureauDialog}
  onClose={() => setOpenBureauDialog(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: 2,
    }
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
    {selectedBureaux.length <= 1
      ? "Transférer le courrier"
      : "Dupliquer et transférer le courrier"}
  </DialogTitle>

  <DialogContent dividers sx={{ mt: 1 }}>
    <FormControl fullWidth>
      <InputLabel id="select-bureau-label">Bureaux</InputLabel>
      <Select
        labelId="select-bureau-label"
        multiple
        value={selectedBureaux}
        onChange={(e) => setSelectedBureaux(e.target.value)}
        label="Bureaux"
        renderValue={(selected) => (
          <Box sx={{ whiteSpace: 'pre-line' }}>
            {selected.map((val) => `• ${val}`).join('\n')}
          </Box>
        )}
        sx={{
          minHeight: 100,
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          '& .MuiSelect-select': {
            padding: 2,
          }
        }}
      >
        {bureauxDisponibles.map((bureau, index) => (
          <MenuItem key={index} value={bureau}>
            {bureau}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </DialogContent>

  <DialogActions sx={{ p: 2 }}>
    <Button onClick={() => setOpenBureauDialog(false)} color="inherit">
      Annuler
    </Button>
    <Button
      variant="contained"
      onClick={handleConfirmTransferToBureau}
      disabled={selectedBureaux.length === 0}
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
