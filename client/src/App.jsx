import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
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
    </AuthProvider>
  );
}

export default App;
