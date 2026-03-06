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

// Placeholder components for other routes
const AllBooks = () => <div className="max-w-7xl mx-auto p-12 text-center"><h2 className="text-3xl font-bold font-serif">All Books</h2></div>;
const Favorites = () => <div className="max-w-7xl mx-auto p-12 text-center"><h2 className="text-3xl font-bold font-serif">Your Favorites</h2></div>;
const Admin = () => <div className="max-w-7xl mx-auto p-12 text-center"><h2 className="text-3xl font-bold font-serif">Admin Dashboard</h2></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<AllBooks />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<CartPage />} />

            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<div className="p-12 text-center">404 - Not Found</div>} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
