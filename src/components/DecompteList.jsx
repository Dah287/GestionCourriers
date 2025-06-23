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
  AttachMoney,
  Mail,
  AccountBalance,
  Notifications,
  Dashboard
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import courrierApi from '../services/courrierApi';

const DecompteList = () => {
  const navigate = useNavigate();
  const [decomptes, setDecomptes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState(2);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const open = Boolean(anchorEl);

  // Charger les données depuis l'API
  const fetchDecomptes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await courrierApi.getAllDecomptes();
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

const handleTransferToBCP = async () => {
  if (!selectedRow) return;
  
  // Ajout de la confirmation
  const isConfirmed = window.confirm(
    `Êtes-vous sûr de vouloir transférer le courrier ${selectedRow.numeroOrdre} au service ?`
  );
  
  if (!isConfirmed) return;

  try {
    await courrierApi.updateDateReceptionBCP(selectedRow.id);
    
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
      return 'En attente de validation';
    case 'BCP':
      return 'Transmis au BCP';
    case 'REJETE_BCP':
      return 'Rejeté par le BCP';
    case 'REJETE_ATP':
      return 'Rejeté par l\'ATP';
    case 'ACCEPTE':
      return 'Accepté et payé';
    default:
      // Capitalise la première lettre et met le reste en minuscules
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'EN_ATTENTE':
      return 'warning'; // En attente de validation
    case 'BCP':
      return 'info'; // Transmis au BCP
    case 'REJETE_BCP':
      return 'error'; // Rejeté par le BCP
    case 'REJETE_ATP':
      return 'error'; // Rejeté par l'ATP
    case 'ACCEPTE':
      return 'success'; // Accepté et payé
    default:
      return 'default'; // Pour tous les autres cas inconnus
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
        </Toolbar>
      </AppBar>

      <Paper sx={{ bgcolor: "white", boxShadow: 2 }}>
        <Container maxWidth="xl">
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => {
              if (newValue === 1) navigate('/courriers');
              if (newValue === 0) navigate('/dashbord');
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
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddDecompte}
            >
              Nouveau Décompte
            </Button>
          </Box>
        </Box>

        {/* Statistiques */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
        </Box>

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
                      />
                    </TableCell>
                    <TableCell>{row.marche?.objet}</TableCell>
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
          <MenuItem onClick={() => {
            handleViewDetails(selectedRow?.id);
            handleMenuClose();
          }}>
            Voir les détails
          </MenuItem>
          <MenuItem onClick={handleEditDecompte}>Modifier</MenuItem>
          <Divider />
          <MenuItem onClick={handleTransferToBCP}>Transférer au BCP</MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteDecompte} sx={{ color: 'error.main' }}>Supprimer</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default DecompteList;