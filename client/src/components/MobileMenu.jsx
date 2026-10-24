import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Logo, SearchForm } from './NavParts';

// Mockup 2k — full-screen menu opened from ☰ on mobile.
const MENU_LINKS = [
  { n: 'i.', label: 'Discover', note: 'Search & browse', to: '/discover' },
  { n: 'ii.', label: 'New & Notable', note: 'This week', to: '/new' },
  { n: 'iii.', label: 'Collections', note: '6 shelves', to: '/collections' },
  { n: 'iv.', label: 'Journal', note: 'Essays', to: '/journal' },
  { n: 'v.', label: 'Book finder', note: '4 questions', to: '/finder' },
];

const SECONDARY_LINKS = [
  { label: 'Orders', to: '/profile' },
  { label: 'Shipping' },
  { label: 'Returns' },
  { label: 'Help' },
  { label: 'Our story', to: '/about' },
];

const THEME_OPTIONS = [
  { label: 'Paper', value: 'light' },
  { label: 'Lamplight', value: 'dark' },
  { label: 'System', value: 'system' },
];

const MobileMenu = ({ onClose }) => {
  const { isAuthenticated, logout } = useAuth();
  const { preference, setPreference } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg text-ink lg:hidden">
      <div className="flex items-center justify-between py-1 pr-2 pl-5">
        <Logo className="text-[28px]" />
        <button type="button" aria-label="Close" onClick={onClose} className="btn btn-icon size-11">
          <X size={22} strokeWidth={1.6} />
        </button>
      </div>

      <SearchForm
        onSearch={onClose}
        iconSize={18}
        className="mx-5 mt-3 gap-2.5 rounded-md border border-divider px-3.5 py-3"
        inputClassName="text-[15px]"
      />

      <nav className="flex flex-col px-5 pt-5">
        {MENU_LINKS.map(({ n, label, note, to }) => (
          <Link
            key={to}
            to={to}
            className="grid grid-cols-[36px_1fr_auto] items-baseline border-b border-divider py-3.5 text-ink no-underline"
          >
            <span className="font-heading text-[17px] text-accent italic">{n}</span>
            <span className="font-heading text-[32px] leading-none font-normal">{label}</span>
            <span className="text-xs text-muted">{note}</span>
          </Link>
        ))}
      </nav>

      <div className="flex flex-wrap gap-x-5 gap-y-2 px-5 pt-6 text-sm text-muted">
        {SECONDARY_LINKS.map(({ label, to }) =>
          to ? <Link key={label} to={to} className="text-muted no-underline">{label}</Link> : <span key={label}>{label}</span>
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2.5 px-5 pt-5">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="btn btn-secondary min-h-11">Profile</Link>
            <button
              type="button"
              onClick={() => { logout(); onClose(); navigate('/login'); }}
              className="btn btn-secondary min-h-11 text-danger"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary min-h-11">Sign in</Link>
            <Link to="/signup" className="btn btn-primary min-h-11">Create account</Link>
          </>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-divider p-5 pb-[calc(20px+env(safe-area-inset-bottom))]">
        <span className="eyebrow">Reading light</span>
        <div className="seg flex">
          {THEME_OPTIONS.map(({ label, value }) => (
            <label key={value} className="seg-opt min-h-10 flex-1 justify-center">
              <input
                type="radio"
                name="theme-preference"
                checked={preference === value}
                onChange={() => setPreference(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
