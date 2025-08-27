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
import HistoryIcon from '@mui/icons-material/History';

import { useNavigate } from 'react-router-dom';
import courrierApi from '../services/courrierApi';
import useAutoLogout from './Authentification/useAutoLogout';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';

const DashboardCourrires = () => {
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

    const handleDownloadDecomptePdf = async (id) => {
  try {
    const response = await courrierApi.downloadDecomptePdf1(id);
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Courriers_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Erreur lors du téléchargement du PDF :", error);
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
    case 'RECU_SERVICE':
      return 'Envoyé au service';
    case 'RECU_BUREAU':
      return 'Envoyé au bureau';
    case 'BUREAU_SERVICE':               // ✅ Nouveau statut
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
    case 'TRAITE':
      return 'success'; // vert
    case 'TRAITE_D':
      return 'primary'; // bleu foncé
    case 'RECU_SERVICE':
      return 'info'; // bleu clair
    case 'RECU_BUREAU':
      return 'secondary'; // violet/gris
    case 'BUREAU_SERVICE':               // ✅ Couleur différente
      return 'purple'; // ou 'secondary' si tu veux rester dans MUI
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
        if (newValue === 1) navigate('/dashbord/decomptes');
        if (newValue === 2) navigate('/historique/dashbord');
          if (newValue === 3) navigate('/marche');
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
              label="Tableau de Bord Gestion Décomptes" 
              iconPosition="start" 
              sx={{ mr: 2 }} 
            />

            <Tab 
  icon={<HistoryIcon />} 
  label="Historique Décomptes" 
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

      {/* Statistiques */}
      <Box sx={{ p: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {[
          { label: 'Courrier envoyé au service', status: 'RECU_SERVICE' },
          { label: 'Courrier Traité', status: 'TRAITE' },
          { label: 'Courrier traité définitivement', status: 'TRAITE_D' },         
          { label: 'Courrier dépassant la deadline', status: 'REJETE' },

          { label: 'Dossier en cours', status: null }
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
            <Typography variant="subtitle2"
              sx={{ fontSize: '1.1rem' }}
            >{label}</Typography>
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
                  {/* <TableCell>Entité</TableCell> */}
             
                    <TableCell>Date arrivée</TableCell>
            <TableCell>Service  <strong>&</strong> Date Envoi</TableCell> {/* En-tête */}

                
                
                  <TableCell>Délais</TableCell>
                  <TableCell>Urgent</TableCell>
                
               
                 
                 <TableCell>Bureau  <strong>&</strong> Date Envoi</TableCell> {/* En-tête */}
                  <TableCell>Date Traitement</TableCell>
                    <TableCell>Statut</TableCell>
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
                      {/* <TableCell>{row.entiteTransmise}</TableCell> */}
             
                       <TableCell>{formatDate(row.dateArrivee)}</TableCell>
<TableCell>
  <div>
    <strong>Service :</strong> {row.serviceDestinataire}<br />
    <strong>Date envoi :</strong> {formatDate(row.dateReceptionService)}
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
    <strong>Date envoi :</strong> {formatDate(row.dateReceptionBureau)}
  </div>
</TableCell>
                       <TableCell>{formatDate(row.dateTraitement)}</TableCell>
                       <TableCell>
                        <Chip
                          label={getStatusLabel(row.status)}
                          size="small"
                          color={getStatusColor(row.status)}
                        />
                      </TableCell>
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
        <MenuItem onClick={handleMarkAsTreated1}>Marquer comme traité Définitivement</MenuItem>
        <Divider />
                  <MenuItem
                    onClick={() => {
                      handleDownloadDecomptePdf(selectedRow?.id);
                      handleMenuClose();
                    }}
                  >
                    Télécharger PDF
                  </MenuItem>
        <MenuItem onClick={handleDeleteCourrier} sx={{ color: 'error.main' }}>Supprimer</MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardCourrires;
