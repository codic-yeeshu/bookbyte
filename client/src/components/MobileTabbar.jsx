import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { Compass, Heart, House, ShoppingBag, User } from 'lucide-react';

// Mockup "BB M Tabbar" — bottom navigation below the lg breakpoint.
const TABS = [
  { label: 'Home', to: '/', icon: House, end: true },
  { label: 'Discover', to: '/discover', icon: Compass },
  { label: 'Shelf', to: '/favourites', icon: Heart },
  { label: 'Bag', to: '/cart', icon: ShoppingBag },
  { label: 'Profile', to: '/profile', icon: User },
];

const MobileTabbar = () => (
  <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-divider bg-bg pb-[env(safe-area-inset-bottom)] text-[11px] lg:hidden">
    <div className="grid grid-cols-5 px-1 pt-2 pb-1">
      {TABS.map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => clsx(
            'flex min-h-11 flex-col items-center justify-center gap-[3px] no-underline',
            isActive ? 'text-accent' : 'text-muted'
          )}
        >
          <Icon size={22} strokeWidth={1.5} />
          {label}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default MobileTabbar;
