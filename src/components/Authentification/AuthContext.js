import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialisation basée sur localStorage
    const token = localStorage.getItem('token');
    return !!token;
  });

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear(); // Ou removeItem('token') uniquement
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
