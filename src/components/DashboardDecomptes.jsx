import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  AppBar,
  Toolbar,
  Badge,
  Tabs,
  Tab,
  Container,
   IconButton // Ajoutez cette importation
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Receipt,
  Warning as WarningIcon,
  AccountBalance,
  Notifications,
  Dashboard,
  Mail
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardDecomptes = () => {
  const navigate = useNavigate();
  const [decomptes, setDecomptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // Défaut sur l'onglet Décomptes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.141:8080/api/decomptes');
        setDecomptes(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (_, newValue) => {
    if (newValue === 1) navigate('/courriers');
    if (newValue === 0) navigate('/dashboard');
    setActiveTab(newValue);
  };

  // Calcul des indicateurs
  const totalDecomptes = decomptes.length;
  const totalMontant = decomptes.reduce((sum, d) => sum + (d.montant || 0), 0);
  const decomptesPayes = decomptes.filter(d => d.situationDecompte === 'PAYE').length;
  const decomptesEnAttente = decomptes.filter(d => d.situationDecompte === 'EN_ATTENTE').length;

  // Derniers décomptes
  const derniersDecomptes = [...decomptes]
    .sort((a, b) => new Date(b.dateDecompte) - new Date(a.dateDecompte))
    .slice(0, 5);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Erreur de chargement: {error}</Typography>
      </Box>
    );
  }

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
        </Toolbar>
      </AppBar>

<Paper sx={{ bgcolor: "white", boxShadow: 2 }}>
  <Container maxWidth="xl">
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => {
        if (newValue === 1) navigate('/courriers');
        if (newValue === 2) navigate('/decomptes');
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

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Tableau de Bord - Gestion des Décomptes
        </Typography>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" alignItems="center">
                <AttachMoney color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5">
                    {totalMontant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MDH
                  </Typography>
                  <Typography variant="subtitle2">Montant Total</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" alignItems="center">
                <Receipt color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5">{totalDecomptes}</Typography>
                  <Typography variant="subtitle2">Total Décomptes</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ color: 'success.main', fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5">{decomptesPayes}</Typography>
                  <Typography variant="subtitle2">Décomptes Payés</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" alignItems="center">
                <TrendingDown sx={{ color: 'warning.main', fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5">{decomptesEnAttente}</Typography>
                  <Typography variant="subtitle2">En Attente</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Derniers décomptes */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Derniers Décomptes
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>N° Décompte</TableCell>
                  <TableCell>Fournisseur</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Montant (MDH)</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Urgent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {derniersDecomptes.map((decompte) => (
                  <TableRow key={decompte.idDecompte}>
                    <TableCell>{decompte.numDecompte}</TableCell>
                    <TableCell>{decompte.fournisseur}</TableCell>
                    <TableCell>
                      {new Date(decompte.dateDecompte).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell align="right">
                      {decompte.montant?.toLocaleString('fr-FR', { 
                        minimumFractionDigits: 2 
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={decompte.situationDecompte === 'PAYE' ? 'Payé' : 'En attente'}
                        color={decompte.situationDecompte === 'PAYE' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {decompte.urgent && <WarningIcon color="error" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Statistiques par année */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Répartition par Année
          </Typography>
          <Grid container spacing={3}>
            {Array.from(new Set(decomptes.map(d => d.annee)))
              .sort((a, b) => b - a)
              .map(annee => {
                const decomptesAnnee = decomptes.filter(d => d.annee === annee);
                const montantAnnee = decomptesAnnee.reduce((sum, d) => sum + (d.montant || 0), 0);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={annee}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Année {annee}
                      </Typography>
                      <Typography variant="body2">Nombre: {decomptesAnnee.length}</Typography>
                      <Typography variant="body2">
                        Montant: {montantAnnee.toLocaleString('fr-FR')} MDH
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardDecomptes;