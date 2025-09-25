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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

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


const isOverdue = (dateArrivee, delaisJours) => {
  if (!dateArrivee || !delaisJours) return false;

  // Si c'est déjà un objet Date, on l'utilise
  let arrivee;
  if (dateArrivee instanceof Date) {
    arrivee = dateArrivee;
  } else {
    // Sinon, on essaie de parser la chaîne
    // Format attendu : "YYYY-MM-DD" ou "DD/MM/YYYY"
    if (typeof dateArrivee === 'string') {
      if (dateArrivee.includes('/')) {
        // Format "DD/MM/YYYY"
        const [day, month, year] = dateArrivee.split('/');
        arrivee = new Date(`${year}-${month}-${day}`);
      } else {
        // Format "YYYY-MM-DD" (ISO)
        arrivee = new Date(dateArrivee);
      }
    } else {
      return false; // Type inattendu
    }
  }

  // Vérifier si la date est valide
  if (isNaN(arrivee.getTime())) return false;

  const now = new Date();
  const deadline = new Date(arrivee);
  deadline.setDate(arrivee.getDate() + parseInt(delaisJours, 10));

  return now > deadline;
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
  ? courriers.filter((c) => {
      if (selectedStatusFilter === 'EN_COURS') {
        return c.status !== 'TRAITE_D';
      }
      if (selectedStatusFilter === 'OVERDUE') {
        return isOverdue(c.dateArrivee, c.delaisJours); // ✅ Filtre les dépassés
      }
      return c.status === selectedStatusFilter;
    })
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
    { label: 'Courrier dépassant la deadline', status: 'OVERDUE' }, // ✅ NOUVEAU — affiche les courriers en retard
    { label: 'Dossier en cours', status: 'EN_COURS' }
  ].map(({ label, status }) => (
    <Paper
      key={label}
      sx={{
        p: 2,
        flex: 1,
        minWidth: 200,
        cursor: 'pointer',
        bgcolor: selectedStatusFilter === status ? 'primary.light' : 'white',
        border: status === 'OVERDUE' ? '2px solid #d32f2f' : 'none', // 🔴 Bordure rouge si c’est la carte "Dépassés"
        boxShadow: status === 'OVERDUE' ? 4 : 2,
      }}
      onClick={() => handleStatusCardClick(status)}
    >
      <Typography variant="subtitle2" sx={{ fontSize: '1.1rem', fontWeight: status === 'OVERDUE' ? 'bold' : 'normal' }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ color: status === 'OVERDUE' ? '#d32f2f' : 'inherit' }}>
        {status === 'EN_COURS'
          ? courriers.filter(c => c.status !== 'TRAITE_D').length
          : status === 'OVERDUE'
          ? courriers.filter(c => isOverdue(c.dateArrivee, c.delaisJours)).length // ✅ Filtre par overdue
          : courriers.filter(c => c.status === status).length}
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
                  
             
                  <TableCell>N° Ordre</TableCell>
                       <TableCell>Référence</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Expéditeur</TableCell>
                  <TableCell>Objet</TableCell>
                  {/* <TableCell>Entité</TableCell> */}
             
                    <TableCell>Date arrivée</TableCell>
            <TableCell>Service  <strong>&</strong> Date Reception</TableCell> {/* En-tête */}

                
                
                  <TableCell>Délais</TableCell>
                  <TableCell>Urgent</TableCell>
                
               
                 
                 <TableCell>Bureau  <strong>&</strong> Date Envoi</TableCell> {/* En-tête */}
                  <TableCell>Date Traitement</TableCell>
                  <TableCell>Date Traitement Déf</TableCell>
                    <TableCell>Statut</TableCell>
             <TableCell>Courriers <strong>&</strong> Reponse </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourriers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.numeroOrdre}</TableCell>
                       <TableCell>{row.reference}</TableCell>
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
                      
                            
                      
                   <TableCell sx={{ width: '80px' }}>
  {row.delaisJours} J
  {isOverdue(row.dateArrivee, row.delaisJours) && (
    <Tooltip title="Délai dépassé !">
      <WarningIcon color="error" fontSize="small" sx={{ ml: 1 }} />
    </Tooltip>
  )}
</TableCell>
                    <TableCell>
  {row.delaisJours <= 2 ? (
    <Chip
      label="Très urgent"
      size="small"
      color="error"
      icon={<WarningIcon />}
      onClick={() => { }}
    />
  ) : row.delaisJours <= 4 ? (
    <Chip
      label="Urgent"
      size="small"
      color="warning"
      icon={<WarningIcon />}
      onClick={() => { }}
    />
  ) : null}
</TableCell>

                      
                   
                      <TableCell>
  <div>
    <strong>Bureau :</strong> {row.bureauRecepteur ? row.bureauRecepteur : "--------------------------"}<br />
    <strong>Date Reception :</strong> {formatDate(row.dateReceptionService)}
  </div>
</TableCell>
                       <TableCell>{formatDate(row.dateTraitement) ? formatDate(row.dateTraitement) :"------"}</TableCell>
                        <TableCell>{formatDate(row.dateTraitementDef)?formatDate(row.dateTraitementDef) :"------"}</TableCell>



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
        <MenuItem onClick={handleTransferToService}
          disabled={
    !selectedRow || 
    (selectedRow.status !== "EN_ATTENTE" )
  }
        >Transférer au service</MenuItem>
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
