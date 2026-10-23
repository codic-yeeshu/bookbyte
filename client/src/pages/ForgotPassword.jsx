import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { requestPasswordReset } from '../api/auth';
import AuthLayout from '../layout/AuthLayout';

// Mockup 3c. The "sent" state shows once the reset endpoint exists (#24).

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSentTo(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const aside = (
    <>
      <span aria-hidden className="font-heading text-[240px] leading-[.8] text-transparent [-webkit-text-stroke:1px_var(--color-accent)]">?</span>
      <p className="m-0 font-heading text-[34px] leading-[1.12] italic">“It happens to the best of readers. We'll get you back to your page.”</p>
    </>
  );

  return (
    <AuthLayout aside={aside} backTo={{ label: '← Back to sign in', to: '/login' }}>
      {sentTo ? (
        <div className="flex w-full max-w-[420px] flex-col items-start gap-5">
          <span className="grid size-16 place-items-center rounded-full border border-accent text-accent"><Mail size={24} strokeWidth={1.6} /></span>
          <h1 className="m-0 text-[46px] leading-none font-normal tracking-[-0.025em] lg:text-[60px]">Check your <em className="text-accent">inbox</em></h1>
          <p className="m-0 text-[15px] leading-[1.65] text-muted">
            We've sent a reset link to <span className="text-ink">{sentTo}</span>. It's valid for 30 minutes — check spam if it doesn't arrive.
          </p>
          <div className="flex gap-3">
            <Link to="/login" className="btn btn-primary">Back to sign in</Link>
            <button type="button" onClick={() => setSentTo('')} className="btn btn-ghost">Use a different email</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full max-w-[420px] flex-col gap-5">
          <span className="eyebrow tracking-[.16em]">Reset password</span>
          <h1 className="m-0 text-[46px] leading-none font-normal tracking-[-0.025em] lg:text-[60px]">Forgot your <em className="text-accent">password?</em></h1>
          <p className="m-0 text-[15px] leading-[1.65] text-muted">Enter the email you signed up with and we'll send a link to choose a new one.</p>
          <div>
            <label htmlFor="reset-email" className="mb-1.5 block text-xs text-ink/70">Email</label>
            <input id="reset-email" type="email" className="input min-h-[46px] lg:min-h-9" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          {error && <p role="alert" className="m-0 text-sm text-danger">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary btn-block min-h-[50px] text-base lg:text-[17px]">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
          <Link to="/login" className="text-sm lg:hidden">← Back to sign in</Link>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
