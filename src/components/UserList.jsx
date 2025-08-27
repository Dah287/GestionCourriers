import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Button, Modal, List, 
  ListItem, ListItemText,Badge, MenuItem, Select, FormControl, InputLabel, Divider,
  AppBar, Toolbar, Chip,Tabs,  Tooltip,
  Tab,
  Container,    Dialog,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
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
const roles = ['ADMIN', 'USER', 'CHEF_SERVICE'];

const structure = {
  DPF: {
    "SERVICE INFORMATIQUE": [
      "BUREAU DE L'EXPLOITATION ET DE LA MAINTENANCE DU SYSTÈME INFORMATIQUE"
    ],
    "SERVICE DE LA PLANIFICATION": [
      "BUREAU DE SUIVI EVALUATION", "BUREAU DES PROGRAMMES ET DU BUDGET"
    ],
    "SERVICE DE LA COMPTABILITE ET FINANCES": [
      "BUREAU FINANCIER",
      "BUREAU DE LA COMPTABILITE GENERALE ET ANALYTIQUE",
      "BUREAU DE LA COMPTABILITE PUBLIQUE"
    ]
  },
  DRH: {
    "SERVICE DE FORMATION CONTINUE ET GESTION DES CARRIÈRES": [
      "BUREAU DE GESTION DES CARRIERES", "BUREAU DE FORMATION CONTINUE"
    ],
    "SERVICE DE GESTION DU PERSONNEL": [
      "BUREAU DE PERSONNEL ET PAIE", "BUREAU DES AFFAIRES SOCIALES"
    ]
  }
};
const UserList = () => {

  useAutoLogout();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState(4);

  const [formUser, setFormUser] = useState({
    username: '', password: '', matricule: '', role: '', service: '', bureau: '', entite: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await courrierApi.getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Erreur chargement users:", error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenDialog = (user = null) => {
    setEditingUser(user);
    setFormUser(user || { username: '', password: '', matricule: '', role: '', service: '', bureau: '', entite: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await courrierApi.updateUser(editingUser.id, formUser);
      } else {
        await courrierApi.createUser(formUser);
      }
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      console.error("Erreur d'enregistrement:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      try {
        await courrierApi.deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error("Erreur suppression:", err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEntiteChange = (e) => {
    const entite = e.target.value;
    setFormUser({ ...formUser, entite, service: '', bureau: '' });
  };

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setFormUser({ ...formUser, service, bureau: '' });
  };

  const handleBureauChange = (e) => {
    setFormUser({ ...formUser, bureau: e.target.value });
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
        if (newValue === 2) navigate('/historique/dashbord');
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Gestion des Utilisateurs</Typography>
          <Box>
            <Tooltip title="Rafraîchir"><IconButton onClick={fetchUsers}><RefreshIcon /></IconButton></Tooltip>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Nouvel Utilisateur</Button>
          </Box>
        </Box>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell><TableCell>Matricule</TableCell><TableCell>Rôle</TableCell>
                  <TableCell>Service</TableCell><TableCell>Bureau</TableCell><TableCell>Entité</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell><TableCell>{user.matricule}</TableCell>
                    <TableCell>{user.role}</TableCell><TableCell>{user.service}</TableCell>
                    <TableCell>{user.bureau}</TableCell><TableCell>{user.entite}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier"><IconButton onClick={() => handleOpenDialog(user)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton onClick={() => handleDelete(user.id)}><DeleteIcon color="error" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination component="div" count={users.length} page={page} onPageChange={(e, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} />
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{editingUser ? "Modifier Utilisateur" : "Ajouter Utilisateur"}</DialogTitle>
          <DialogContent>
            <TextField label="Username" fullWidth margin="dense" value={formUser.username} onChange={(e) => setFormUser({ ...formUser, username: e.target.value })} />
            <TextField label="Mot de passe" type="password" fullWidth margin="dense" value={formUser.password} onChange={(e) => setFormUser({ ...formUser, password: e.target.value })} />
            <TextField label="Matricule" fullWidth margin="dense" value={formUser.matricule} onChange={(e) => setFormUser({ ...formUser, matricule: e.target.value })} />
            <TextField label="Rôle" select fullWidth margin="dense" value={formUser.role} onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}>
              {roles.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
            </TextField>
            <FormControl fullWidth margin="dense">
              <InputLabel>Entité</InputLabel>
              <Select value={formUser.entite} label="Entité" onChange={handleEntiteChange}>
                {Object.keys(structure).map((entite) => (
                  <MenuItem key={entite} value={entite}>{entite}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {formUser.entite && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Service</InputLabel>
                <Select value={formUser.service} label="Service" onChange={handleServiceChange}>
                  {Object.keys(structure[formUser.entite]).map(service => (
                    <MenuItem key={service} value={service}>{service}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {formUser.entite && formUser.service && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Bureau</InputLabel>
                <Select value={formUser.bureau} label="Bureau" onChange={handleBureauChange}>
                  {structure[formUser.entite][formUser.service].map(bureau => (
                    <MenuItem key={bureau} value={bureau}>{bureau}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
          </DialogActions>
        </Dialog>
      </Box>
        
</Box>
  );
};

export default UserList;
