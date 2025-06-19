import React from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  StyledEngineProvider 
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourrierList from './components/CourrierList';
import ReceptionCourrierForm from './components/ReceptionCourrierForm';
import MailReceptionForm from './components/MailReceptionForm';
import CourrierListService from './components/CourrierListService';
import CourrierListBureau from './components/CourrierListBureau';
import MailReceptionFormTest from './components/MailReceptionFormTest';

// Création du thème Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<CourrierList />} />
              <Route path="/courriers" element={<CourrierList />} />
              <Route path="/add" element={<ReceptionCourrierForm />} />
              <Route path="/courriers/add" element={<MailReceptionFormTest />} />
              <Route path="/courriers/:courrierId" element={<MailReceptionFormTest />} />
              <Route path="/courriers/edit/:courrierId" element={<MailReceptionFormTest />} />
                <Route path="/courriers/Service" element={<CourrierListService />} />
                <Route path="/courriers/Bureau" element={<CourrierListBureau />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;