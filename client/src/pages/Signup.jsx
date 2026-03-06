import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/Alert';
import { UserPlus, Eye, EyeOff, User, Mail, MapPin, Lock } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await signUp(formData);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 mb-20 p-8 rounded-2xl shadow-xl bg-card border border-border transition-all animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 text-primary mb-4">
          <UserPlus className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold font-serif tracking-tight">Join BookByte</h2>
        <p className="text-foreground/60 mt-2">Create your account to get started</p>
      </div>

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="username">Username</label>
          <div className="relative">
            <input
              id="username"
              type="text"
              className="w-full bg-input border-border rounded-xl px-4 py-3 pl-11 text-sm focus:ring-primary focus:border-primary transition-all"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <User className="absolute left-4 top-3.5 w-4 h-4 text-foreground/40" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
          <div className="relative">
            <input
              id="email"
              type="email"
              className="w-full bg-input border-border rounded-xl px-4 py-3 pl-11 text-sm focus:ring-primary focus:border-primary transition-all"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-foreground/40" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="address">Address</label>
          <div className="relative">
            <input
              id="address"
              type="text"
              className="w-full bg-input border-border rounded-xl px-4 py-3 pl-11 text-sm focus:ring-primary focus:border-primary transition-all"
              placeholder="123 Book St, Library City"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-foreground/40" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full bg-input border-border rounded-xl px-4 py-3 pl-11 text-sm focus:ring-primary focus:border-primary transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-foreground/40" />
            <button
              type="button"
              className="absolute right-3 top-3.5 text-foreground/40 hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-3! flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Account</span>
              <UserPlus className="w-4 h-4 translate-y-px" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-sm text-foreground/60">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
