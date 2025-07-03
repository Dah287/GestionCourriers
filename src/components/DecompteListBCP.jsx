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
  TextField
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  AttachMoney,
  Mail,
  AccountBalance,
  Notifications,
  Logout,
  Dashboard
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import courrierApi from '../services/courrierApi';
import useAutoLogout from './Authentification/useAutoLogout';

const DecompteListBCP = () => {
        useAutoLogout(); // ✅ Doit être au tout début du composant
  const navigate = useNavigate();
  const [decomptes, setDecomptes] = useState([]);
  const [decomptesBCP, setDecomptesBCP] = useState([]);
    const [decomptesATP, setDecomptesATP] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState(2);
const [anchorElBCP, setAnchorElBCP] = useState(null);
const [anchorElATP, setAnchorElATP] = useState(null);
const [selectedRowBCP, setSelectedRowBCP] = useState(null);
const [selectedRowATP, setSelectedRowATP] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

const openBCP = Boolean(anchorElBCP);
const openATP = Boolean(anchorElATP);


// En haut de ton component :
const [openMotifDialog, setOpenMotifDialog] = useState(false);
const [motifRejet, setMotifRejet] = useState("");
const [targetRow, setTargetRow] = useState(null);
const [targetStatut, setTargetStatut] = useState("");

// Méthode pour ouvrir la popup motif
const handleOpenMotifDialog = (row, statut) => {
  setTargetRow(row);
  setTargetStatut(statut);
  setMotifRejet("");
  setOpenMotifDialog(true);
};

const handleCloseMotifDialog = () => {
  setOpenMotifDialog(false);
};

// Appel API pour mise à jour statut et motif
const updateStatutWithMotif = async () => {
  if (!targetRow || !targetStatut) return;

  try {
    console.log("statut :",targetStatut)
    console.log("motifRejet :",motifRejet)
    await courrierApi.updateStatut(targetRow.id, {
      statut: targetStatut,
      motif: motifRejet
    });
    alert("Statut mis à jour avec succès.");
    setOpenMotifDialog(false);
    await fetchDecomptes();
  } catch (error) {
    alert("Erreur lors de la mise à jour du statut.");
    console.error(error);
  }
};

const handleUpdateStatut = async (row, Newstatut) => {
  try {
    await courrierApi.updateStatut(row.id, {
      statut: Newstatut
    });
    alert(`Statut mis à jour vers ${Newstatut}`);
    await fetchDecomptes();
  } catch (err) {
    console.error("Erreur lors de la mise à jour du statut:", err);
    alert("Erreur lors de la mise à jour du statut.");
  }
};


  // Charger les données depuis l'API
  const fetchDecomptes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response1 = await courrierApi.getAllDecomptesBCP();
           const response2 = await courrierApi.getAllDecomptesATP();
      setDecomptesBCP(response1.data);
      setDecomptesATP(response2.data);
    } catch (err) {
      console.error("Error fetching decomptes:", err);
      setError(err.message || "Failed to load decomptes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecomptes();
      }, []);

const handleMenuClickBCP = (event, row) => {
  setAnchorElBCP(event.currentTarget);
  setSelectedRowBCP(row);
};

const handleMenuCloseBCP = () => {
  setAnchorElBCP(null);
};

const handleMenuClickATP = (event, row) => {
  setAnchorElATP(event.currentTarget);
  setSelectedRowATP(row);
};

const handleMenuCloseATP = () => {
  setAnchorElATP(null);
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
    await fetchDecomptes();
  };

  const handleAddDecompte = () => {
    navigate('/decomptes/add2');
  };

  const handleViewDetails = (id) => {
    navigate(`/decomptes/${id}`);
  };

const handleDeleteDecompte = async (row) => {
  if (!row) return;

  const isConfirmed = window.confirm(
    `Êtes-vous sûr de vouloir supprimer le décompte "${row.numDecompte}" ?`
  );

  if (isConfirmed) {
    try {
      await courrierApi.deleteDecompte(row.id);
      alert("Décompte supprimé avec succès !");
      await fetchDecomptes();
    } catch (err) {
      console.error("Erreur lors de la suppression du décompte:", err);
      alert("Une erreur est survenue lors de la suppression.");
    }
  }
};


const handleTransferToATP = async (row) => {
  if (!row) return;

  const isConfirmed = window.confirm(
    `Êtes-vous sûr de vouloir transférer le décompte ${row.numDecompte} à l'ATP ?`
  );

  if (!isConfirmed) return;

  try {
    await courrierApi.updateDateReceptionATP(row.id);
    alert(`Le décompte ${row.numDecompte} a été transféré à l'ATP avec succès.`);
    await fetchDecomptes();
  } catch (err) {
    console.error("Erreur lors du transfert à l'ATP:", err);
    alert(`Échec du transfert du décompte ${row.numDecompte} à l'ATP.`);
  }
};
const handleTransferToRATP = async (row) => {
  if (!row) return;

  const isConfirmed = window.confirm(
    `Êtes-vous sûr de vouloir transférer le décompte ${row.numDecompte} à l'ATP ?`
  );

  if (!isConfirmed) return;

  try {
    await courrierApi.updateDateReceptionRATP(row.id);
    alert(`Le décompte ${row.numDecompte} a été transféré à l'ATP avec succès.`);
    await fetchDecomptes();
  } catch (err) {
    console.error("Erreur lors du transfert à l'ATP:", err);
    alert(`Échec du transfert du décompte ${row.numDecompte} à l'ATP.`);
  }
};
const handleTransferToRBCP = async (row) => {
  if (!row) return;

  const isConfirmed = window.confirm(
    `Êtes-vous sûr de vouloir transférer le décompte ${row.numDecompte} à l'ATP ?`
  );

  if (!isConfirmed) return;

  try {
    await courrierApi.updateDateReceptionRBCP(row.id);
    alert(`Le décompte ${row.numDecompte} a été transféré à l'ATP avec succès.`);
    await fetchDecomptes();
  } catch (err) {
    console.error("Erreur lors du transfert à l'ATP:", err);
    alert(`Échec du transfert du décompte ${row.numDecompte} à l'ATP.`);
  }
};



const getStatusLabel = (status) => {
  switch (status) {
    case 'EN_ATTENTE':
      return 'En attente de validation DPF';
    case 'SERVICE_SCF':
      return 'Envoyé à SCF';
    case 'BCP':
      return 'Envoyé à BCP';
    case 'ATP':
      return 'Envoyé à ATP';
    case 'REJETE_BCP':
      return 'Rejeté par le BCP / SCF';
    case 'REJETE_ATP':
      return 'Rejeté par l\'ATP / BCP';
    case 'REJETE_ATP_S':
      return 'Rejeté par le ATP / SCF';
    case 'REJETE_BCP_E':
      return 'Rejeté par le BCP / DPF';
    case 'REJETE_ATP_E':
      return 'Rejeté par le ATP / DPF';
    case 'ACCEPTE':
      return 'Accepté et payé';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
};


const getStatusColor = (status) => {
  switch (status) {
    case 'EN_ATTENTE':
      return 'warning'; // En attente
    case 'SERVICE_SCF':
      return 'info'; // En cours SCF
    case 'BCP':
      return 'info'; // En cours BCP
    case 'ATP':
      return 'info'; // En cours ATP
    case 'REJETE_BCP':
    case 'REJETE_ATP':
    case 'REJETE_ATP_S':
    case 'REJETE_BCP_E':
    case 'REJETE_ATP_E':
      return 'error'; // Tous les rejets
    case 'ACCEPTE':
      return 'success'; // Validé
    default:
      return 'default';
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

const handleEditDecompte = (row) => {
  if (row) {
    navigate(`/decomptes/edit/${row.id}`);
  }
};

const handleLogout = () => {
  // Vider tout le localStorage
  localStorage.clear();

  // Rediriger vers la page de login
  navigate("/login1");
};


  if (loading) return <Typography>Chargement en cours...</Typography>;
  if (error) return <Typography color="error">Erreur: {error}</Typography>;

  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor:'#2e7d32', boxShadow: 3 }}>
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

      {/* <Paper sx={{ bgcolor: "white", boxShadow: 2 }}>
        <Container maxWidth="xl">
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => {
        if (newValue === 0) navigate('/decomptes/bcp');
        if (newValue === 1) navigate('/courriers/Bureau');
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
            Liste des Décomptes Pour BCP
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
            sx={{ bgcolor:'#2e7d32'}}
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddDecompte}
            >
              Nouveau Décompte
            </Button>
          </Box>
        </Box>

        {/* Statistiques */}


        {/* Tableau */}
        <Paper sx={{ mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Année</TableCell>
                  <TableCell>Numéro Décompte</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Date Attachement</TableCell>
                  <TableCell>Date Établis</TableCell>
                  <TableCell>Date Signature</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Marché</TableCell>
                  <TableCell>Fournisseur</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {decomptesBCP.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.annee}</TableCell>
                    <TableCell>{row.numDecompte}</TableCell>
                    <TableCell>
                      {row.montant?.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} MDH
                    </TableCell>
                    <TableCell>{formatDate(row.dateAttachement)}</TableCell>
                    <TableCell>{formatDate(row.dateEtablis)}</TableCell>
                    <TableCell>{formatDate(row.dateSignature)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(row.statut)}
                        size="small"
                        color={getStatusColor(row.statut)}
                      />
                    </TableCell>
                    <TableCell>{row.marche?.objet}</TableCell>
                    <TableCell>{row.marche?.fournisseur}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClickBCP(e, row)}
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
            count={decomptesBCP.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
          />
        </Paper>

        {/* Menu contextuel */}
<Menu
  anchorEl={anchorElBCP}
  open={Boolean(anchorElBCP)}
  onClose={handleMenuCloseBCP}
>
  <MenuItem onClick={() => { handleViewDetails(selectedRowBCP?.id); handleMenuCloseBCP(); }}>
    Voir les détails
  </MenuItem>
  <MenuItem onClick={() => { handleEditDecompte(selectedRowBCP); handleMenuCloseBCP(); }}>
    Modifier
  </MenuItem>
  <Divider />

  {selectedRowBCP?.statut === "REJETE_ATP" ? (
    <MenuItem onClick={() => {
      handleUpdateStatut(selectedRowBCP, "REJETE_ATP_S");
      handleMenuCloseBCP();
    }}>
      Transférer au Service SCF
    </MenuItem>
  ) : (
    <>
      <MenuItem onClick={() => { handleTransferToATP(selectedRowBCP); handleMenuCloseBCP(); }}>
        Transférer au ATP
      </MenuItem>
      <MenuItem onClick={() => { handleOpenMotifDialog(selectedRowBCP, "REJETE_BCP"); handleMenuCloseBCP(); }}>
        Rejeté par BCP
      </MenuItem>
    </>
  )}

  <Divider />
  <MenuItem onClick={() => { handleDeleteDecompte(selectedRowBCP); handleMenuCloseBCP(); }} sx={{ color: 'error.main' }}>
    Supprimer
  </MenuItem>
</Menu>


      </Box>
            <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Liste des Décomptes Pour ATP
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

          </Box>
        </Box>

        {/* Statistiques */}


        {/* Tableau */}
        <Paper sx={{ mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Année</TableCell>
                  <TableCell>Numéro Décompte</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Date Attachement</TableCell>
                  <TableCell>Date Établis</TableCell>
                  <TableCell>Date Signature</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Marché</TableCell>
                  <TableCell>Fournisseur</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {decomptesATP.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.annee}</TableCell>
                    <TableCell>{row.numDecompte}</TableCell>
                    <TableCell>
                      {row.montant?.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} MDH
                    </TableCell>
                    <TableCell>{formatDate(row.dateAttachement)}</TableCell>
                    <TableCell>{formatDate(row.dateEtablis)}</TableCell>
                    <TableCell>{formatDate(row.dateSignature)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(row.statut)}
                        size="small"
                        color={getStatusColor(row.statut)}
                      />
                    </TableCell>
                    <TableCell>{row.marche?.objet}</TableCell>
                    <TableCell>{row.marche?.fournisseur}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClickATP(e, row)}
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
            count={decomptesATP.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
          />
        </Paper>

        {/* Menu contextuel */}
<Menu
  anchorEl={anchorElATP}
  open={Boolean(anchorElATP)}
  onClose={handleMenuCloseATP}
>
  <MenuItem onClick={() => { handleViewDetails(selectedRowATP?.id); handleMenuCloseATP(); }}>
    Voir les détails
  </MenuItem>
  <MenuItem onClick={() => { handleEditDecompte(selectedRowATP); handleMenuCloseATP(); }}>Modifier</MenuItem>
  <Divider />
  <MenuItem onClick={() => {  handleUpdateStatut(selectedRowATP, "ACCEPTE");; handleMenuCloseATP(); }}>Accepté et payé</MenuItem>
  <MenuItem onClick={() => { handleOpenMotifDialog(selectedRowATP, "REJETE_ATP"); handleMenuCloseATP(); }}>Rejeté par l'ATP</MenuItem>

  <Divider />
  <MenuItem onClick={() => { handleDeleteDecompte(selectedRowATP); handleMenuCloseATP(); }} sx={{ color: 'error.main' }}>
    Supprimer
  </MenuItem>
</Menu>

      </Box>

<Dialog open={openMotifDialog} onClose={handleCloseMotifDialog}>
  <DialogTitle>Motif du rejet</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Motif"
      fullWidth
      value={motifRejet}
      onChange={(e) => setMotifRejet(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseMotifDialog}>Annuler</Button>
    <Button onClick={updateStatutWithMotif} variant="contained">Valider</Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default DecompteListBCP;