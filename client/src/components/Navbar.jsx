import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { ArrowLeft, Heart, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import MobileMenu from './MobileMenu';
import { BagButton, Logo, SearchForm, ThemeToggle } from './NavParts';
import { useMobileChromeState } from '../context/MobileChromeContext';

const PRIMARY_LINKS = [
  { label: 'Discover', to: '/discover' },
  { label: 'New & Notable', to: '/new' },
  { label: 'Collections', to: '/collections' },
  { label: 'Journal', to: '/journal' },
];

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h16" /><path d="M4 6h16" /><path d="M4 18h12" />
  </svg>
);

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const chrome = useMobileChromeState();
  const bagCount = user?.cart?.length || 0;

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <>
      {/* Desktop — BB Nav */}
      <header className="hidden flex-col border-b border-divider bg-bg text-ink lg:flex">
        <div className="flex justify-center gap-6 border-b border-divider px-14 py-[7px] text-xs text-muted italic">
          <span>Free shipping on orders over ₹499</span>
          <span className="text-accent">·</span>
          <span>New arrivals every Thursday</span>
        </div>
        <nav className="page grid grid-cols-[1fr_auto_1fr] items-center gap-8 py-[18px]">
          <div className="flex gap-7 text-[15px]">
            {PRIMARY_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => clsx(
                  'border-b pb-[3px] no-underline',
                  isActive ? 'border-accent text-accent' : 'border-transparent text-ink hover:text-accent'
                )}
              >
                {label}
              </NavLink>
            ))}
          </div>
          <Logo className="text-[34px]" />
          <div className="flex items-center justify-end gap-1.5">
            <SearchForm className="mr-2.5 w-[180px] border-b border-divider px-0.5 py-1.5" inputClassName="text-sm" />
            {isAuthenticated && (
              <Link to="/favourites" aria-label="Favourites" className="btn btn-icon">
                <Heart size={18} strokeWidth={1.6} />
              </Link>
            )}
            <BagButton count={bagCount} />
            {isAuthenticated ? (
              <Link to="/profile" aria-label="Account" className="btn btn-icon">
                <User size={18} strokeWidth={1.6} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost px-2.5! py-2! text-sm">Sign in</Link>
                <Link to="/signup" className="btn btn-primary px-3.5! py-2! text-sm">Join</Link>
              </>
            )}
            <ThemeToggle className="btn-secondary ml-1 rounded-full" />
          </div>
        </nav>
      </header>

      {/* Mobile — BB M Header: "back" mode when the page asks for it (2c), otherwise brand mode */}
      <header className="border-b border-divider bg-bg text-ink lg:hidden">
        {chrome.back ? (
          <div className="grid grid-cols-[52px_1fr_52px] items-center px-2 pt-1 pb-2">
            <button type="button" aria-label="Back" onClick={() => navigate(-1)} className="btn btn-icon size-11">
              <ArrowLeft size={22} strokeWidth={1.6} />
            </button>
            <span className="justify-self-center truncate font-heading text-[21px] font-semibold">{chrome.title}</span>
            <BagButton count={bagCount} size={20} className="size-11" />
          </div>
        ) : (
          <div className="grid grid-cols-[100px_1fr_100px] items-center px-2 pt-1 pb-2">
            <button type="button" aria-label="Menu" onClick={() => setMenuOpen(true)} className="btn btn-icon size-11">
              <MenuIcon />
            </button>
            <Logo className="justify-self-center text-[28px]" />
            <div className="flex items-center justify-end">
              <ThemeToggle className="size-11" size={19} />
              {isAuthenticated ? (
                <BagButton count={bagCount} size={20} className="size-11" />
              ) : (
                <Link to="/login" className="flex min-h-11 items-center px-2 text-sm whitespace-nowrap text-accent no-underline">Sign in</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
};

export default Navbar;
