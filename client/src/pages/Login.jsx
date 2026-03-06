import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/Alert';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { id, token } = await signIn({ username, password });
      // In a real app, you might fetch user details here using the ID
      // For now, we'll store the ID and Token in context
      await login(token, { id, username });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 rounded-2xl shadow-xl bg-card border border-border transition-all animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 text-primary mb-4">
          <LogIn className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold font-serif tracking-tight">Welcome Back</h2>
        <p className="text-foreground/60 mt-2">Sign in to your account</p>
      </div>

      <Alert type="error" message={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="w-full bg-input border-border rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary transition-all shadow-sm"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full bg-input border-border rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary transition-all shadow-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-foreground/40 hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
            <span className="text-foreground/60">Remember me</span>
          </label>
          <a href="#" className="text-primary hover:underline font-medium">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-3! flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <LogIn className="w-4 h-4 translate-y-px" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-sm text-foreground/60">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
