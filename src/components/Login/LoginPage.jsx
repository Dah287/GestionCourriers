import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentification/AuthContext'; // Chemin correct vers AuthContext

const LoginPage = () => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Appelle login pour changer l'état d'authentification

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://192.168.1.59:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          matricule,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Matricule ou mot de passe incorrect');
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('id_user', data.id);
      localStorage.setItem('role', data.role);
      localStorage.setItem('service', data.service);
      localStorage.setItem('bureau', data.bureau);
        localStorage.setItem('login', "login");

      login(); // ➤ Marque comme authentifié

      // ➤ Redirection selon le rôle
      switch (data.role) {
        case 'ADMIN':
          navigate('/dashbord');
          break;
        case 'SECRETARIAT':
          navigate('/courriers');
          break;
        case 'CHEF_SERVICE':
          navigate('/courriers/Service');
          break;
        case 'CHEF_BUREAU':
          navigate('/courriers/Bureau');
          break;
        default:
          navigate('/unauthorized');
          break;
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
<Box
  sx={{
    height: '100vh',
    background: 'linear-gradient(135deg, #4a90e2 0%, #50e3c2 100%)', // un dégradé plus dynamique
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url("https://source.unsplash.com/featured/?mail,office")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backdropFilter: 'blur(6px)', // légèrement plus flou
  }}
>
  <Paper
    elevation={8}
    sx={{
      padding: 6,
      width: { xs: '90%', sm: 420 },
      borderRadius: 5,
      backgroundColor: 'rgba(255,255,255,0.95)', // un peu plus opaque
      boxShadow: '0 12px 30px rgba(0,0,0,0.25)', // ombre plus douce et étendue
      border: '1px solid #1976d2', // bordure bleue pour souligner le cadre
    }}
  >
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Avatar sx={{ bgcolor: '#1976d2', margin: '0 auto', mb: 2, width: 64, height: 64 }}>
        <LockOutlined fontSize="large" />
      </Avatar>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Connexion
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Accédez à votre application de gestion des courriers
      </Typography>
    </Box>

    <form onSubmit={handleLogin}>
      <TextField
        fullWidth
        label="Matricule"
        variant="outlined"
        value={matricule}
        onChange={(e) => setMatricule(e.target.value)}
        margin="normal"
        required
        autoFocus
      />

      <TextField
        fullWidth
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="toggle password visibility">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Typography color="error" sx={{ mt: 1, fontWeight: 'bold' }}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 4,
          py: 1.75,
          borderRadius: 4,
          fontWeight: 700,
          fontSize: '1.1rem',
          backgroundColor: '#1976d2',
          transition: 'background-color 0.3s ease',
          '&:hover': { backgroundColor: '#125ea4' },
        }}
      >
        Se connecter
      </Button>
    </form>
  </Paper>
</Box>

  );
};

export default LoginPage;
