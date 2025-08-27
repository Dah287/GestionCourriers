import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Button, Modal, List, 
  ListItem, ListItemText,Badge, MenuItem, Select, FormControl, InputLabel, Divider,
  AppBar, Toolbar, Chip,Tabs,
  Tab,
  Container,
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
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import courrierApi from '../services/courrierApi';
import useAutoLogout from './Authentification/useAutoLogout';
import PersonIcon from '@mui/icons-material/Person';
import GavelIcon from '@mui/icons-material/Gavel';

const MarcheDecomptes = () => {
        useAutoLogout(); // ✅ Doit être au tout début du composant

  const navigate = useNavigate();

  const [decomptes, setDecomptes] = useState([]);
  const [marches, setMarches] = useState([]);
  const [selectedMarcheId, setSelectedMarcheId] = useState('');
  const [page, setPage] = useState(0);
    const [activeTab, setActiveTab] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [historique, setHistorique] = useState([]);
  const [openHistoriqueModal, setOpenHistoriqueModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchDecomptes();
    fetchMarches();
  }, []);

  const fetchDecomptes = async () => {
    try {
      const response = await courrierApi.getAllDecomptes();
      setDecomptes(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des décomptes :", err);
    }
  };

  const fetchMarches = async () => {
    try {
      const response = await courrierApi.getAllMarches();
      setMarches(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des marchés :", err);
    }
  };

  const handleViewHistorique = async (id) => {
    try {
      const response = await fetch(`http://192.168.1.68:8080/api/decomptes/${id}/historique`);
      const data = await response.json();
      setHistorique(data);
      setOpenHistoriqueModal(true);
    } catch (error) {
      alert("Impossible de charger l'historique");
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'EN_ATTENTE': return 'En attente';
      case 'SERVICE_SCF': return 'Envoyé à SCF';
      case 'BCP': return 'Envoyé à BCP';
      case 'ATP': return 'Envoyé à ATP';
      case 'REJETE_BCP':
      case 'REJETE_ATP':
      case 'REJETE_BCP_E':
      case 'REJETE_ATP_E': return 'Rejeté';
      case 'ACCEPTE': return 'Accepté et payé';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_ATTENTE': return 'warning';
      case 'SERVICE_SCF':
      case 'BCP':
      case 'ATP': return 'info';
      case 'REJETE_BCP':
      case 'REJETE_ATP':
      case 'REJETE_BCP_E':
      case 'REJETE_ATP_E': return 'error';
      case 'ACCEPTE': return 'success';
      default: return 'default';
    }
  };
const handleLogout = () => {
  // Vider tout le localStorage
  localStorage.clear();

  // Rediriger vers la page de login
  navigate("/login");
};
  const splitHistoriqueSections = (historique) => {
  const sections = [];
  let current = [];

  const isRejetVersDPF = (desc) =>
    desc === "Rejeté par ATP, envoyé à DPF" ||
    desc === "Rejeté par BCP, envoyé à DPF";

  historique.forEach((h) => {
    current.push(h);
    if (isRejetVersDPF(h.description)) {
      sections.push([...current]);
      current = [];
    }
  });

  if (current.length > 0) sections.push(current);

  return sections;
};


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
        if (newValue === 1) navigate('/dashbord/decomptes');
        if (newValue === 0) navigate('/dashbord');
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


      <Box sx={{ p: 3 }}>
        {/* Select marché */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="marche-label">Filtrer par Marché</InputLabel>
          <Select
            labelId="marche-label"
            value={selectedMarcheId}
            label="Filtrer par Marché"
            onChange={(e) => setSelectedMarcheId(e.target.value)}
          >
            <MenuItem value="">Tous les marchés</MenuItem>
            {marches.map((marche) => (
              <MenuItem key={marche.id} value={marche.id}>
                {marche.numOperation} - {marche.fournisseur}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tableau des décomptes */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Num Décompte</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Date Signature</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Marché</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {decomptes
                  .filter((d) => !selectedMarcheId || d.marche?.id == selectedMarcheId)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.numDecompte}</TableCell>
                      <TableCell>{row.montant?.toFixed(2)} MAD</TableCell>
                      <TableCell>{formatDate(row.dateSignature)}</TableCell>
                      <TableCell>
                        <Chip label={getStatusLabel(row.statut)} color={getStatusColor(row.statut)} />
                      </TableCell>
                      <TableCell>{row.marche?.numOperation}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedRow(row);
                            handleViewHistorique(row.id);
                          }}
                        >
                          Historique
                        </Button>
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
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>
      </Box>

      {/* Modal historique */}
<Modal open={openHistoriqueModal} onClose={() => setOpenHistoriqueModal(false)}>
  <Box
    sx={{
      width: 650,
      bgcolor: 'background.paper',
      borderRadius: 3,
      boxShadow: 24,
      mx: 'auto',
      mt: 10,
      p: 4,
      maxHeight: '80vh',
      overflowY: 'auto',
    }}
  >
    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
      🕒 Historique des Statuts
    </Typography>

    {splitHistoriqueSections(historique).map((section, idx) => (
      <Box key={idx} sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: 'primary.main',
            borderBottom: '1px solid #ddd',
            pb: 1,
          }}
        >
          {idx === 0 ? "📌 Historique Principal" : `🔁 Tour ${idx + 1} (Après Rejet)`}
        </Typography>

        <List dense>
          {section.map((h, i) => {
            const isRejet = h.description.includes("Rejeté");
            const isValidation = h.description.toLowerCase().includes("validé");
            const isEnCours = h.description.toLowerCase().includes("en cours");

            return (
              <ListItem
                key={i}
                sx={{
                  bgcolor: isRejet ? '#ffebee' : isValidation ? '#e8f5e9' : isEnCours ? '#e3f2fd' : '#f5f5f5',
                  borderLeft: `4px solid ${isRejet ? '#f44336' : isValidation ? '#4caf50' : isEnCours ? '#2196f3' : '#9e9e9e'}`,
                  borderRadius: 2,
                  mb: 1.5,
                  boxShadow: 1,
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>{h.description}</strong>
                    </Typography>
                  }
                  secondary={`📅 ${new Date(h.dateChangement).toLocaleString('fr-FR')}`}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    ))}
  </Box>
</Modal>


    </Box>
  );
};

export default MarcheDecomptes;
