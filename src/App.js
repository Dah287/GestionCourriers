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
import DecompteList from './components/DecompteList';
import DashboardDecomptes from './components/DashboardDecomptes';
import AjoutDecompte from './components/AjoutDecompte';
import DecompteListBCP from './components/DecompteListBCP';
import DashboardCourrires from './components/DashboardCourrires';
import DecompteServiceSCF from './components/DecompteServiceSCF';
import LoginPage from './components/Login/LoginPage';
import LoginPage1 from './components/Login/LoginPage1';
import { AuthProvider } from './components/Authentification/AuthContext';
import ProtectedRoute from './components/Authentification/ProtectedRoute';
import MarcheList from './components/MarcheList';

// import ProtectedRoute from './ProtectedRoute';
// import { AuthProvider } from './AuthContext';

// Création du thème Material UI
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login1" element={<LoginPage1 />} />
                <Route path="/marche" element={<MarcheList />} />     
                {/* Routes protégées */}
                <Route path="/courriers" element={<ProtectedRoute><CourrierList /></ProtectedRoute>} />
                <Route path="/decomptes" element={<ProtectedRoute><DecompteList /></ProtectedRoute>} />
                <Route path="/dashbord" element={<ProtectedRoute><DashboardCourrires /></ProtectedRoute>} />
                <Route path="/add" element={<ProtectedRoute><ReceptionCourrierForm /></ProtectedRoute>} />
                <Route path="/decomptes/add2" element={<ProtectedRoute><AjoutDecompte /></ProtectedRoute>} />
                <Route path="/courriers/add" element={<ProtectedRoute><MailReceptionFormTest /></ProtectedRoute>} />
                <Route path="/courriers/:courrierId" element={<ProtectedRoute><MailReceptionFormTest /></ProtectedRoute>} />
                <Route path="/courriers/edit/:courrierId" element={<ProtectedRoute><MailReceptionFormTest /></ProtectedRoute>} />
                <Route path="/courriers/Service" element={<ProtectedRoute><CourrierListService /></ProtectedRoute>} />
                <Route path="/courriers/Bureau" element={<ProtectedRoute><CourrierListBureau /></ProtectedRoute>} />
                <Route path="/decomptes/bcp" element={<ProtectedRoute><DecompteListBCP /></ProtectedRoute>} />
                <Route path="/dashbord/decomptes" element={<ProtectedRoute><DashboardDecomptes /></ProtectedRoute>} />
                <Route path="/decomptes/scf" element={<ProtectedRoute><DecompteServiceSCF /></ProtectedRoute>} />
                <Route path="/decomptes/dashbord" element={<ProtectedRoute><DashboardDecomptes /></ProtectedRoute>} />
                 <Route path="/decomptes/edit/:id" element={<ProtectedRoute><AjoutDecompte /></ProtectedRoute>} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;



// import React from 'react';
// import { 
//   CssBaseline, 
//   ThemeProvider, 
//   createTheme,
//   StyledEngineProvider 
// } from '@mui/material';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import CourrierList from './components/CourrierList';
// import ReceptionCourrierForm from './components/ReceptionCourrierForm';
// import MailReceptionForm from './components/MailReceptionForm';
// import CourrierListService from './components/CourrierListService';
// import CourrierListBureau from './components/CourrierListBureau';
// import MailReceptionFormTest from './components/MailReceptionFormTest';
// import DecompteList from './components/DecompteList';
// import Dashboard from './components/DashboardDecomptes';
// import DashboardDecomptes from './components/DashboardDecomptes';
// import AjoutDecompte from './components/AjoutDecompte';
// import DecompteListBCP from './components/DecompteListBCP';
// import DashboardCourrires from './components/DashboardCourrires';
// import DecompteServiceSCF from './components/DecompteServiceSCF';
// import LoginPage from './components/Login/LoginPage';
// import LoginPage1 from './components/Login/LoginPage1';

// // Création du thème Material UI
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//     background: {
//       default: '#f5f5f5',
//     },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//   },
//   components: {
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//         },
//       },
//     },
//   },
// });

// function App() {
//   return (
//     <StyledEngineProvider injectFirst>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <Router>
//           <div className="App">
//             <Routes>
//               <Route path="/" element={<LoginPage />} />
//               <Route path="/courriers" element={<CourrierList />} />
//               <Route path="/decomptes" element={<DecompteList />} />
//               <Route path="/dashbord" element={<DashboardCourrires />} />
//               <Route path="/add" element={<ReceptionCourrierForm />} />
//               <Route path="/decomptes/add2" element={<AjoutDecompte />} />
//               <Route path="/courriers/add" element={<MailReceptionFormTest />} />
//               <Route path="/courriers/:courrierId" element={<MailReceptionFormTest />} />
//               <Route path="/courriers/edit/:courrierId" element={<MailReceptionFormTest />} />
//               <Route path="/courriers/Service" element={<CourrierListService />} />
//               <Route path="/courriers/Bureau" element={<CourrierListBureau />} />
//                <Route path="/decomptes/bcp" element={<DecompteListBCP />} />
//                 <Route path="/decomptes/scf" element={<DecompteServiceSCF />} />
//                 <Route path="/decomptes/dashbord" element={<DashboardDecomptes />} />
//                 <Route path="/login" element={<LoginPage />} />
//                  <Route path="/login1" element={<LoginPage1 />} />
//             </Routes>
//           </div>
//         </Router>
//       </ThemeProvider>
//     </StyledEngineProvider>
//   );
// }

// export default App;