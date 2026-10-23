import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { signIn } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { COLLECTIONS } from '../mocks/collections';
import AuthLayout from '../layout/AuthLayout';
import BookCover from '../components/BookCover';
import Checkbox from '../components/Checkbox';
import PasswordInput from '../components/PasswordInput';

// Mockups 3a (desktop) and 3d (mobile).

const STACK_ROTATIONS = ['-rotate-9', '-rotate-3', 'rotate-3', 'rotate-9'];

// TODO(#24): Google sign-in and email links.
const comingSoon = (what) => () => toast(`${what} is coming soon.`);

const Divider = ({ children }) => (
  <div className="flex items-center gap-3.5 text-[13px] text-muted italic">
    <span className="h-px flex-1 bg-divider" />{children}<span className="h-px flex-1 bg-divider" />
  </div>
);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // TODO(#24): sign in with email once the API accepts it.
      const { id, token } = await signIn({ username, password });
      await login(token, { id, username }, { remember });
      navigate(location.state?.from ?? '/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Couldn't sign you in. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const aside = (
    <>
      <div className="flex justify-center pl-11">
        {COLLECTIONS.featured.covers.map((cover, i) => (
          <div key={cover.title} className={`-ml-11 w-[140px] ${STACK_ROTATIONS[i]}`}>
            <BookCover book={cover} tone={cover.tone} shadow="lg" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <p className="m-0 font-heading text-[34px] leading-[1.12] italic">“Welcome back. Your shelf has been keeping your place.”</p>
        <span className="text-[13px] text-muted">Free shipping over ₹499 · 14-day returns</span>
      </div>
    </>
  );

  return (
    <AuthLayout
      aside={aside}
      topLink={<span className="text-muted">New here? <Link to="/signup">Create an account</Link></span>}
      footer={
        <div className="border-t border-divider px-5 py-4 text-center text-sm text-muted lg:hidden">
          New to Bookbyte? <Link to="/signup">Create an account</Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex w-full max-w-[420px] flex-col gap-4 lg:gap-5">
        <div className="flex flex-col gap-2">
          <span className="eyebrow tracking-[.16em]">Welcome back</span>
          <h1 className="m-0 text-[46px] leading-none font-normal tracking-[-0.025em] lg:text-[60px]">
            Sign in to your <em className="text-accent">shelf</em>
          </h1>
        </div>

        <div className="flex flex-col gap-2.5">
          <button type="button" onClick={comingSoon('Google sign-in')} className="btn btn-secondary btn-block min-h-12 lg:min-h-[46px]">
            Continue with Google
          </button>
          <button type="button" onClick={comingSoon('Email sign-in links')} className="btn btn-ghost btn-block hidden min-h-[46px] border border-divider lg:flex">
            <Mail size={16} strokeWidth={1.6} />Email me a sign-in link
          </button>
        </div>
        <Divider><span className="lg:hidden">or</span><span className="hidden lg:inline">or with a password</span></Divider>

        <div>
          <label htmlFor="login-username" className="mb-1.5 block text-xs text-ink/70">Username</label>
          <input
            id="login-username"
            className="input min-h-[46px] lg:min-h-9"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="login-password" className="text-xs text-ink/70">Password</label>
            <Link to="/forgot-password" className="text-[13px]">Forgot it?</Link>
          </div>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="min-h-[46px] lg:min-h-9"
          />
        </div>
        <label className="flex min-h-8 cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox checked={remember} onChange={setRemember} label="Keep me signed in" className="size-5 lg:size-[18px]" />
          <span>Keep me signed in<span className="hidden lg:inline"> on this device</span></span>
        </label>

        {error && <p role="alert" className="m-0 text-sm text-danger">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary btn-block min-h-[50px] text-base lg:text-[17px]">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        {/* TODO(#24): the mockup's two-step verification note returns once 2FA exists. */}
      </form>
    </AuthLayout>
  );
};

export default Login;
