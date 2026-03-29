import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { CONFIG } from './config';
import ServerWakeup from './components/ServerWakeup';
import MainLayout from './layout/MainLayout';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import BookDetails from './pages/BookDetails';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import DiscoverPage from './pages/DiscoverPage';
import FavouritesPage from './pages/FavouritesPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';

function App() {
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'waking', 'awake'

  useEffect(() => {
    let isMounted = true;
    let retryInterval;

    const checkServer = async () => {
      // 1.5 seconds threshold before showing the wakeup screen
      const timer = setTimeout(() => {
        if (isMounted) setServerStatus('waking');
      }, 1500);

      const ping = async () => {
        try {
          await axios.get(`${CONFIG.API_URL}/health`);
          return true; // Server is awake
        } catch (error) {
          return false; // Server still sleeping or error
        }
      };

      const isAwake = await ping();
      
      if (isAwake) {
        clearTimeout(timer);
        if (isMounted) setServerStatus('awake');
      } else {
        // If failed initially (maybe 502/timeout from Render), poll every 3 seconds
        retryInterval = setInterval(async () => {
          const ok = await ping();
          if (ok) {
            clearInterval(retryInterval);
            if (isMounted) setServerStatus('awake');
          }
        }, 3000);
      }
    };

    checkServer();

    return () => {
      isMounted = false;
      if (retryInterval) clearInterval(retryInterval);
    };
  }, []);

  if (serverStatus === 'checking') {
    // Blank screen for the first 1.5s to avoid flashing the loader if server is actually fast
    return null;
  }

  if (serverStatus === 'waking') {
    return <ServerWakeup />;
  }

  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/books" element={<DiscoverPage />} /> {/* Alias */}
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/about" element={<AboutPage />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/favourites" element={<FavouritesPage />} />
            <Route path="/favorites" element={<FavouritesPage />} /> {/* Alias */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<div className="p-12 text-center text-2xl font-bold font-serif min-h-[50vh] flex items-center justify-center">404 - Not Found</div>} />
          </Routes>
        </MainLayout>
      </Router>
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
    </AuthProvider>
  );
}

export default App;
