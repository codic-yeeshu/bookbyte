import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserInformation } from '../api/auth';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Set authorization header for the initial request
          const data = await getUserInformation();
          setUser(data);
        } catch (error) {
          console.error("Auth initialization failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const register = async (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const addToUserCart = (id) => {
    if (user) setUser({ ...user, cart: [...(user.cart || []), id] });
  };

  const removeFromUserCart = (id) => {
    if (user) setUser({ ...user, cart: (user.cart || []).filter(item => item !== id) });
  };

  const addToUserFavourites = (id) => {
    if (user) setUser({ ...user, favourites: [...(user.favourites || []), id] });
  };

  const removeFromUserFavourites = (id) => {
    if (user) setUser({ ...user, favourites: (user.favourites || []).filter(item => item !== id) });
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    setUser,
    addToUserCart,
    removeFromUserCart,
    addToUserFavourites,
    removeFromUserFavourites
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
