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
    Modal,
  List,
  ListItem,
  ListItemText,
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
  Logout ,
  Dashboard
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import courrierApi from '../services/courrierApi';
import useAutoLogout from './Authentification/useAutoLogout';

const DecompteList = () => {
      useAutoLogout(); // ✅ Doit être au tout début du composant
  const navigate = useNavigate();
  const [decomptes, setDecomptes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //handleViewHistorique
const [historique, setHistorique] = useState([]);
const [openHistoriqueModal, setOpenHistoriqueModal] = useState(false);


  const open = Boolean(anchorEl);

  // Charger les données depuis l'API
  const fetchDecomptes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await courrierApi.getAllDecomptes();
      console.log("response.data :",response.data)
      setDecomptes(response.data);
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
    await fetchDecomptes();
  };

  const handleAddDecompte = () => {
    navigate('/decomptes/add2');
  };

  const handleViewDetails = (id) => {
    navigate(`/decomptes/${id}`);
  };

  const handleDeleteDecompte = async () => {
    if (!selectedRow) return;

    const isConfirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le décompte "${selectedRow.numDecompte}" ?`
    );

    if (isConfirmed) {
      try {
        await courrierApi.deleteDecompte(selectedRow.id);
        alert("Décompte supprimé avec succès !");
        handleMenuClose();
        await fetchDecomptes();
      } catch (err) {
        console.error("Error deleting decompte:", err);
        alert("Une erreur est survenue lors de la suppression du décompte.");
      }
    }
  };

const handleTransferToSCF = async () => {
  if (!selectedRow) return;
  
  // Ajout de la confirmation
  const isConfirmed = window.confirm(
    `Êtes-vous sûr de vouloir transférer le courrier ${selectedRow.numeroOrdre} au service ?`
  );
  
  if (!isConfirmed) return;

  try {
    await courrierApi.updateStatut(selectedRow.id,{
      statut: "SERVICE_SCF",
     date_envoi_scf: new Date().toISOString().split('T')[0], // "2025-06-01"
    });
    
    // Message de succès plus informatif
    alert(`Le courrier ${selectedRow.numeroOrdre} a été transféré au service avec succès.`);
    
    handleMenuClose();
    await fetchDecomptes();
  } catch (err) {
    console.error("Erreur lors du transfert au service:", err);
    alert(`Échec du transfert du courrier ${selectedRow.numeroOrdre} au service.`);
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

  const handleEditDecompte = () => {
    if (selectedRow) {
      navigate(`/decomptes/edit/${selectedRow.id}`);
      handleMenuClose();
    }
  };

  const handleDownloadDecomptePdf = async (id) => {
  try {
    const response = await courrierApi.downloadDecomptePdf(id);
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `decompte_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Erreur lors du téléchargement du PDF :", error);
  }
};

const handleViewHistorique = async (id) => {
  try {
    const response = await fetch(`http://192.168.1.86:8080/api/decomptes/${id}/historique`);
    if (!response.ok) throw new Error('Erreur lors du chargement de l’historique');
    
    const data = await response.json();
    setHistorique(data);
    setOpenHistoriqueModal(true);
  } catch (error) {
    console.error(error);
    alert('Impossible de charger l’historique.');
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
        if (newValue === 0) navigate('/courriers');
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
            Liste des Décomptes
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
             sx={{ bgcolor: "primary.main"}}
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddDecompte}
            >
              Nouveau Décompte
            </Button>
          </Box>
        </Box>

        {/* Statistiques */}
        {/* <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle2">Décomptes en attente</Typography>
            <Typography variant="h4">
              {decomptes.filter(d => d.statut === 'EN_ATTENTE').length}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle2">En cours de traitement</Typography>
            <Typography variant="h4">
              {decomptes.filter(d => d.statut === 'EN_COURS').length}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle2">Décomptes payés</Typography>
            <Typography variant="h4">
              {decomptes.filter(d => d.statut === 'PAYE').length}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="subtitle2">Montant total</Typography>
            <Typography variant="h4">
              {decomptes.reduce((sum, d) => sum + (d.montant || 0), 0).toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} MDH
            </Typography>
          </Paper>
        </Box> */}

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
                  <TableCell>Motif Rejet</TableCell>
                   <TableCell>Nº Marché</TableCell>
                  <TableCell>Fournisseur</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {decomptes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
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
                       onClick={() => { }} // Add this line
                      />
                    </TableCell>
                     <TableCell>{row.motif}</TableCell>
                    <TableCell>{row.marche?.numOperation}</TableCell>
                    <TableCell>{row.marche?.fournisseur}</TableCell>
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
            count={decomptes.length}
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
            handleViewDetails(selectedRow?.id);
            handleMenuClose();
          }}>
            Voir les détails
          </MenuItem>
          <MenuItem onClick={handleEditDecompte}>Modifier</MenuItem> */}
          <Divider />
          <MenuItem onClick={handleTransferToSCF}
           disabled={selectedRow?.status !== 'EN_ATTENTE'}
          >Transférer au SCF</MenuItem>
          <Divider />
          {/* <MenuItem onClick={handleDeleteDecompte} sx={{ color: 'error.main' }}>Supprimer</MenuItem> */}
            {/* ✅ Nouveau MenuItem pour téléchargement PDF */}
          <Divider />
          <MenuItem
            onClick={() => {
              handleDownloadDecomptePdf(selectedRow?.id);
              handleMenuClose();
            }}
          >
            Télécharger PDF
          </MenuItem>
           {/* ✅ Voir l'historique */}
          <MenuItem
            onClick={() => {
              handleViewHistorique(selectedRow?.id); // 👉 Tu dois créer cette fonction
              handleMenuClose();
            }}
          >
            Voir l'historique
          </MenuItem>
        </Menu>
        <Modal open={openHistoriqueModal} onClose={() => setOpenHistoriqueModal(false)}>
  <Box sx={{ width: 500, bgcolor: 'background.paper', margin: 'auto', mt: 10, p: 3, borderRadius: 2, boxShadow: 24 }}>
    <Typography variant="h6" gutterBottom>
      Historique des statuts
    </Typography>

    <List>
      {historique.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemText
              primary={`🔁 ${item.ancienStatut} ➜ ${item.nouveauStatut}`}
              secondary={`🗓️ ${item.dateChangement} | ${item.description}`}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  </Box>
</Modal>

      </Box>
    </Box>
  );
};

export default DecompteList;