import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { clsx } from 'clsx';
import {
  Search,
  ShoppingCart,
  User,
  Sun,
  Moon,
  BookOpen,
  Heart,
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { toggleTheme } from '../utils/themeUtils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toggleTheme()
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <nav className="glass-nav px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Left Section: Logo & Desktop Links */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Book<span className="text-primary">Byte</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">Home</Link>
            <Link to="/books" className="text-foreground/80 hover:text-primary transition-colors">All Books</Link>
            <Link to="/favorites" className="text-foreground/80 hover:text-primary transition-colors">Favorites</Link>
          </div>
        </div>

        {/* Center Section: Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for books..."
              className="w-full bg-input border-border rounded-full py-2 pl-10 pr-4 text-sm focus:ring-primary focus:border-primary transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-foreground/50" />
          </div>
        </div>

        {/* Right Section: Theme Toggle & Auth */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative p-2 rounded-full hover:bg-foreground/5 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-1 p-1 pr-2 rounded-full hover:bg-foreground/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <ChevronDown className={clsx("w-4 h-4 text-foreground/40 transition-transform", isProfileOpen && "rotate-180")} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-border mb-2">
                        <p className="text-xs text-foreground/40">Signed in as</p>
                        <p className="text-sm font-bold truncate">{user?.username}</p>
                      </div>
                      <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-foreground/5 transition-colors">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Log In</Link>
                <Link to="/signup" className="btn-primary px-4! py-2! text-sm">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-foreground/5 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border py-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3 px-2">
            <Link to="/" className="px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors">Home</Link>
            <Link to="/books" className="px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors">All Books</Link>
            <Link to="/favorites" className="px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors">Favorites</Link>

            <div className="pt-4 border-t border-border mt-2">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full bg-input border-border rounded-full py-2 pl-10 pr-4 text-sm"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-foreground/50" />
              </div>

              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <Link to="/profile" className="px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile ({user?.username})</span>
                  </Link>
                  <Link to="/cart" className="px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Cart</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" className="w-full text-center px-4 py-2 text-sm font-medium border border-border rounded-lg">Log In</Link>
                  <Link to="/signup" className="w-full btn-primary text-center px-4! py-2! text-sm">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
