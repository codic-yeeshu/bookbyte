import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { signUp } from '../api/auth';
import { GENRES } from '../mocks/genres';
import AuthLayout from '../layout/AuthLayout';
import Checkbox from '../components/Checkbox';
import PasswordInput from '../components/PasswordInput';

// Mockups 3b (desktop) and 3e (mobile).
// TODO(#24): the design asks for Full name / Email / Password only. The API still needs a
// unique username (used to sign in) and an address, so both stay until #24 lands.

const MEMBER_PERKS = [
  { n: 'i.', t: 'Your shelf', d: 'Save favourites and pick up where you left off, on any device.' },
  { n: 'ii.', t: 'Order tracking', d: 'Every parcel, from our packing table to your door.' },
  { n: 'iii.', t: 'First look', d: 'New arrivals a day before everyone else.' },
];

const MIN_PASSWORD = 5; // matches the server's current rule

// Meter from the 3b mockup: 1–4 bars with a short hint.
const strengthOf = (pw) => {
  if (pw.length < MIN_PASSWORD) return { score: 1, label: 'Too short' };
  let score = 1;
  if (pw.length >= 8) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || (/[a-z]/.test(pw) && /[A-Z]/.test(pw))) score++;
  const hint = /\d/.test(pw) ? 'add a symbol' : 'add a number';
  return { score, label: ['', 'Weak', `Fair — ${hint}`, 'Good', 'Strong'][score] };
};

const Field = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-xs text-ink/70">{label}</label>
    {children}
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', address: '' });
  const [genres, setGenres] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const strength = strengthOf(form.password);
  const toggleGenre = (slug) => setGenres((g) => (g.includes(slug) ? g.filter((x) => x !== slug) : [...g, slug]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!agreed) {
      setError('Please agree to the Terms and Privacy policy to continue.');
      return;
    }
    setLoading(true);
    try {
      // TODO(#24): send favourite genres once the API stores them.
      await signUp(form);
      toast.success('Account created — sign in to open your shelf.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const aside = (
    <>
      <div className="flex flex-col gap-2.5">
        <p className="m-0 mb-3.5 font-heading text-[38px] leading-[1.1] italic">“Your shelf, your notes and your next book — kept in one place.”</p>
        <div className="border-t border-divider">
          {MEMBER_PERKS.map(({ n, t, d }) => (
            <div key={n} className="grid grid-cols-[40px_1fr] border-b border-divider py-4">
              <span className="font-heading text-xl text-accent italic">{n}</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-heading text-[22px] font-medium">{t}</span>
                <span className="text-[13px] text-muted">{d}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="text-[13px] text-muted">Free, forever. We never sell your reading history.</span>
    </>
  );

  const submit = (
    <button type="submit" form="signup-form" disabled={loading} className="btn btn-primary btn-block min-h-[50px] text-base lg:text-[17px]">
      {loading ? 'Creating your account…' : 'Create my account'}
    </button>
  );

  return (
    <AuthLayout
      aside={aside}
      topLink={<span className="text-muted">Already a member? <Link to="/login">Sign in</Link></span>}
      footer={
        <div className="sticky bottom-0 flex flex-col gap-2 border-t border-divider bg-bg px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] lg:hidden">
          {submit}
          <span className="text-center text-[13px] text-muted">Already a member? <Link to="/login">Sign in</Link></span>
        </div>
      }
    >
      <form id="signup-form" onSubmit={handleSubmit} className="flex w-full max-w-[480px] flex-col gap-4 lg:gap-[18px]">
        <div className="flex flex-col gap-2">
          <span className="eyebrow tracking-[.16em]">
            <span className="lg:hidden">Free · 30 seconds</span><span className="hidden lg:inline">Create an account</span>
          </span>
          <h1 className="m-0 text-[46px] leading-none font-normal tracking-[-0.025em] lg:text-[60px]">
            Join <em className="text-accent">Bookbyte</em>
          </h1>
        </div>

        <button type="button" onClick={() => toast('Google sign-up is coming soon.')} className="btn btn-secondary btn-block min-h-12 lg:min-h-[46px]">
          Sign up with Google
        </button>
        <div className="flex items-center gap-3.5 text-[13px] text-muted italic">
          <span className="h-px flex-1 bg-divider" />or with email<span className="h-px flex-1 bg-divider" />
        </div>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-3.5">
          <Field id="signup-username" label="Username">
            <input id="signup-username" className="input min-h-[46px] lg:min-h-9" value={form.username} onChange={set('username')} autoComplete="username" minLength={4} required />
          </Field>
          <Field id="signup-email" label="Email">
            <input id="signup-email" type="email" className="input min-h-[46px] lg:min-h-9" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" required />
          </Field>
        </div>
        <Field id="signup-password" label="Password">
          <PasswordInput id="signup-password" value={form.password} onChange={set('password')} autoComplete="new-password" className="min-h-[46px] lg:min-h-9" />
          {form.password && (
            <div className="mt-1.5 flex items-center gap-2.5">
              <div className="flex flex-1 gap-1" aria-hidden>
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={clsx('h-0.5 flex-1', i <= strength.score ? (strength.score >= 3 ? 'bg-success' : 'bg-accent') : 'bg-divider')} />
                ))}
              </div>
              <span className={clsx('text-xs', strength.score >= 3 ? 'text-success' : 'text-muted')}>{strength.label}</span>
            </div>
          )}
        </Field>
        <Field id="signup-address" label="Delivery address">
          <input id="signup-address" className="input min-h-[46px] lg:min-h-9" value={form.address} onChange={set('address')} autoComplete="street-address" required />
        </Field>

        <div className="flex flex-col gap-2.5">
          <span className="text-sm">
            Favourite genres <span className="text-muted italic">— optional<span className="hidden lg:inline">, tunes your shelf</span></span>
          </span>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => {
              const on = genres.includes(g.slug);
              return (
                <button
                  key={g.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleGenre(g.slug)}
                  className={clsx(
                    'rounded-full border px-3.5 py-[9px] text-sm lg:py-1.5 lg:text-[13px]',
                    on ? 'border-accent bg-accent/12 text-accent-ink' : 'border-divider text-ink'
                  )}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.5] text-muted">
          <Checkbox checked={agreed} onChange={setAgreed} label="Agree to the Terms and Privacy policy" className="mt-px size-5 lg:size-[18px]" />
          <span>I agree to the Terms and Privacy policy.</span>
        </label>

        {error && <p role="alert" className="m-0 text-sm text-danger">{error}</p>}

        <div className="hidden lg:block">{submit}</div>
      </form>
    </AuthLayout>
  );
};

export default Signup;
