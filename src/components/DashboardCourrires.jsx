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

const DashboardCourrires = () => {
        useAutoLogout(); // ✅ Doit être au tout début du composant
  const navigate = useNavigate();
  const [courriers, setCourriers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(null); // 🔥 Nouveau

  const open = Boolean(anchorEl);

  const fetchCourriers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await courrierApi.getAllCourriers();
      setCourriers(response.data);
    } catch (err) {
      console.error("Error fetching courriers:", err);
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

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = async () => {
    await fetchCourriers();
  };

  const handleAddCourrier = () => navigate('/courriers/add');
  const handleViewDetails = (id) => navigate(`/courriers/${id}`);

  const handleEditCourrier = () => {
    if (selectedRow) {
      navigate(`/courriers/edit/${selectedRow.id}`);
      handleMenuClose();
    }
  };

  const handleDeleteCourrier = async () => {
    if (!selectedRow) return;
    const isConfirmed = window.confirm(`Supprimer courrier "${selectedRow.reference}" ?`);
    if (isConfirmed) {
      try {
        await courrierApi.deleteCourrier(selectedRow.id);
        alert("Supprimé avec succès !");
        handleMenuClose();
        await fetchCourriers();
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleTransferToService = async () => {
    if (!selectedRow) return;
    const isConfirmed = window.confirm(`Transférer ${selectedRow.numeroOrdre} au service ?`);
    if (!isConfirmed) return;

    try {
      await courrierApi.updateDateReceptionService(selectedRow.id);
      alert("Transféré avec succès.");
      handleMenuClose();
      await fetchCourriers();
    } catch (err) {
      alert("Erreur de transfert.");
    }
  };

  const handleMarkAsTreated = async () => {
    if (!selectedRow) return;
    const isConfirmed = window.confirm(`Marquer ${selectedRow.numeroOrdre} comme traité ?`);
    if (!isConfirmed) return;

    try {
      await courrierApi.updateDateReceptioTraite(selectedRow.id);
      alert("Marqué comme traité.");
      handleMenuClose();
      await fetchCourriers();
    } catch (err) {
      alert("Erreur de traitement.");
    }
  };

const getStatusLabel = (status) => {
  switch (status) {
    case 'RECU_SERVICE':
      return 'Envoyé au service';
    case 'RECU_BUREAU':
      return 'Envoyé au bureau';
    case 'TRAITE':
      return 'Courrier traité';
    case 'REJETE':
      return 'Rejeté';
    case 'EN_ATTENTE':
      return 'En attente d\'envoi';
    default:
      return status;
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


  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const handleLogout = () => {
  // Vider tout le localStorage
  localStorage.clear();

  // Rediriger vers la page de login
  navigate("/login");
};

  const handleStatusCardClick = (status) => {
    setSelectedStatusFilter((prev) => (prev === status ? null : status));
  };

  const filteredCourriers = selectedStatusFilter
    ? courriers.filter((c) => c.status === selectedStatusFilter)
    : courriers;

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
        if (newValue === 1) navigate('/dashbord');
        if (newValue === 2) navigate('/dashbord');
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
</Paper>

      {/* Statistiques */}
      <Box sx={{ p: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {[
          { label: 'En attente', status: 'EN_ATTENTE' },
          { label: 'Réception service en cours', status: 'RECU_SERVICE' },
          { label: 'Réception bureau en cours', status: 'RECU_BUREAU' },
          { label: 'Traité', status: 'TRAITE' },
          { label: 'Rejeté', status: 'REJETE' },
          { label: 'Total', status: null }
        ].map(({ label, status }) => (
          <Paper
            key={label}
            sx={{
              p: 2,
              flex: 1,
              minWidth: 200,
              cursor: 'pointer',
              bgcolor: selectedStatusFilter === status ? 'primary.light' : 'white'
            }}
            onClick={() => handleStatusCardClick(status)}
          >
            <Typography variant="subtitle2">{label}</Typography>
            <Typography variant="h4">
              {status
                ? courriers.filter(c => c.status === status).length
                : courriers.length}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Table */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Liste des Courriers</Typography>
          <Box>
            <Tooltip title="Rafraîchir">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filtrer">
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddCourrier}>
              Nouveau Courrier
            </Button>
          </Box>
        </Box>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Référence</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Expéditeur</TableCell>
                  <TableCell>Objet</TableCell>
                  <TableCell>Entité</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date arrivée</TableCell>
                  <TableCell>Urgent</TableCell>
                  <TableCell>Délais</TableCell>
                  <TableCell>Date Envoi</TableCell>
                  <TableCell>Date Réception Service</TableCell>
                  <TableCell>Date Réception Bureau</TableCell>
                  <TableCell>Date Traitement</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourriers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.numeroOrdre}</TableCell>
                      <TableCell>{row.typeCourrier}</TableCell>
                      <TableCell>{row.entiteExpeditrice}</TableCell>
                      <TableCell>{row.objet}</TableCell>
                      <TableCell>{row.entiteTransmise}</TableCell>
                      <TableCell>{row.serviceDestinataire}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(row.status)}
                          size="small"
                          color={getStatusColor(row.status)}
                        />
                      </TableCell>
                      <TableCell>{formatDate(row.dateArrivee)}</TableCell>
                      <TableCell>{row.urgent && <WarningIcon color="error" />}</TableCell>
                      <TableCell>{row.delaisJours} J</TableCell>
                      <TableCell>{formatDate(row.dateEnvoi)}</TableCell>
                      <TableCell>{formatDate(row.dateReceptionService)}</TableCell>
                      <TableCell>{formatDate(row.dateReceptionBureau)}</TableCell>
                       <TableCell>{formatDate(row.dateTraitement)}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleMenuClick(e, row)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            count={filteredCourriers.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* Menu contextuel */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleViewDetails(selectedRow.id); handleMenuClose(); }}>Voir les détails</MenuItem>
        <MenuItem onClick={handleEditCourrier}>Modifier</MenuItem>
        <Divider />
        <MenuItem onClick={handleTransferToService}>Transférer au service</MenuItem>
        <MenuItem onClick={handleMarkAsTreated}>Marquer comme traité</MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteCourrier} sx={{ color: 'error.main' }}>Supprimer</MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardCourrires;
