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
import { Upload as UploadIcon } from "@mui/icons-material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
const CourrierListBureau = () => {
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
  const [selectedBureau, setSelectedBureau] = useState('');
//
const [openDialog, setOpenDialog] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);
  const open = Boolean(anchorEl);


  //

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
      const response = await courrierApi.getCourriersParEntite2(bureau);
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
      const response = await courrierApi.getCourriersParEntite2(bureau);
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

    const handleMarkAsTreated4 = async () => {
    if (!selectedRow) return;

    const isConfirmed = window.confirm(
      `Voulez-vous vraiment marquer le courrier ${selectedRow.numeroOrdre} ("${selectedRow.objet}") comme reçu ?`
    );

    if (!isConfirmed) return;

    try {
      await courrierApi.updateDateReceptioTraite4(selectedRow.id);
      alert(`Le courrier ${selectedRow.numeroOrdre} a été marqué comme traité.`);
      handleMenuClose();
      await fetchCourriers();
    } catch (err) {
      alert(`Échec du marquage du courrier ${selectedRow.numeroOrdre} comme traité.`);
    }
  };

    const handleMarkAsTreated3 = async () => {
    if (!selectedRow) return;

    const isConfirmed = window.confirm(
      `Voulez-vous vraiment marquer le courrier ${selectedRow.numeroOrdre} ("${selectedRow.objet}") comme traité ?`
    );

    if (!isConfirmed) return;

    try {
      await courrierApi.updateDateReceptioTraite3(selectedRow.id);
      alert(`Le courrier ${selectedRow.numeroOrdre} a été marqué comme traité.`);
      handleMenuClose();
      await fetchCourriers();
    } catch (err) {
      alert(`Échec du marquage du courrier ${selectedRow.numeroOrdre} comme traité.`);
    }
  };

  //

  const handleOpenDialog = () => setOpenDialog(true);
const handleCloseDialog = () => {
  setOpenDialog(false);
  setSelectedFile(null);
};

const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]);
};

const handleSubmitResponse = async () => {
  if (!selectedRow || !selectedFile) return;

  const formData = new FormData();
  formData.append("fichierReponsePdf", selectedFile);

  try {
    await courrierApi.updateDateReceptioTraite33(selectedRow.id, formData);
    alert("Réponse transférée avec succès !");
    handleCloseDialog();
    await fetchCourriers();
  } catch (err) {
    alert("Erreur lors du transfert de la réponse.");
  }
};




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
        if (newValue === 1) navigate('/decomptes/bcp');
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

      {matricule === '7879' && (
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
                          onClick={() => { }}
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
          <MenuItem onClick={() => {
            handleViewDetails(selectedRow.id);
            handleMenuClose();
          }}>
            Voir les détails
          </MenuItem>
          <MenuItem onClick={handleEditCourrier}>Modifier</MenuItem>
          <Divider />
       <MenuItem onClick={handleOpenDialog}>
        Transférer La réponse au Service
      </MenuItem>

          <MenuItem onClick={handleMarkAsTreated4}>Marquer comme Reçu</MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteCourrier} sx={{ color: 'error.main' }}>Supprimer</MenuItem>
        </Menu>

        {/* Dialog sélection bureau */}
        <Dialog open={openBureauDialog} onClose={() => setOpenBureauDialog(false)}>
          <DialogTitle>Transférer au bureau</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2, minWidth: 250 }}>
              <InputLabel id="select-bureau-label">Bureau</InputLabel>
              <Select
                labelId="select-bureau-label"
                value={selectedBureau}
                label="Bureau"
                onChange={(e) => setSelectedBureau(e.target.value)}
              >
                <MenuItemSelect value=""><em>Choisir un bureau</em></MenuItemSelect>
                <MenuItemSelect value="Bureau A">Bureau A</MenuItemSelect>
                <MenuItemSelect value="Bureau B">Bureau B</MenuItemSelect>
                <MenuItemSelect value="Bureau C">Bureau C</MenuItemSelect>
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
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      keepMounted
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          boxShadow: 8
        }
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.25rem",
          textAlign: "center",
          borderBottom: "1px solid #eee"
        }}
      >
        Transférer la réponse
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            p: 2
          }}
        >
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none"
            }}
          >
            {selectedFile ? "Changer de fichier" : "Sélectionner un PDF"}
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </Button>

          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              📄 {selectedFile.name}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={handleCloseDialog}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmitResponse}
          variant="contained"
          disabled={!selectedFile}
          sx={{
            borderRadius: 2,
            textTransform: "none"
          }}
        >
          Envoyer
        </Button>
      </DialogActions>
    </Dialog>

      </Box>
    </Box>
  );
};

export default CourrierListBureau;
