import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Moon, Search, ShoppingBag, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

// Small pieces shared by the desktop nav, mobile header and mobile menu.
export const Logo = ({ className }) => (
  <Link
    to="/"
    className={clsx('font-heading font-medium leading-none tracking-[-0.02em] text-ink no-underline', className)}
  >
    Book<em className="text-accent">byte</em>
  </Link>
);

export const ThemeToggle = ({ className, size = 16 }) => {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" onClick={toggle} aria-label="Toggle theme" className={clsx('btn btn-icon', className)}>
      {theme === 'dark' ? <Sun size={size} strokeWidth={1.6} /> : <Moon size={size} strokeWidth={1.6} />}
    </button>
  );
};

export const BagButton = ({ count, className, size = 18 }) => (
  <Link to="/cart" aria-label="Bag" className={clsx('btn btn-icon relative', className)}>
    <ShoppingBag size={size} strokeWidth={1.6} />
    {count > 0 && (
      <span className="absolute top-[3px] right-[2px] h-4 min-w-4 rounded-full border border-accent bg-bg px-[3px] text-center text-[10px] leading-[14px] font-semibold text-accent tabular-nums">
        {count}
      </span>
    )}
  </Link>
);

export const SearchForm = ({ className, inputClassName, iconSize = 16, onSearch }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/discover?q=${encodeURIComponent(q)}` : '/discover');
    onSearch?.();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={clsx('flex items-center gap-2 text-muted', className)}>
      <Search size={iconSize} strokeWidth={1.6} className="shrink-0" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search titles, authors…"
        aria-label="Search titles, authors"
        className={clsx('w-full min-w-0 bg-transparent italic text-ink placeholder:text-muted focus-visible:outline-none', inputClassName)}
      />
    </form>
  );
};
