import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateAddress } from '../api/user';
import { getRecentOrders } from '../api/orders';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

// Mockups 1g (desktop) and 2f (mobile).

const THEME_OPTIONS = [
  { label: 'Paper', value: 'light' },
  { label: 'Lamplight', value: 'dark' },
  { label: 'System', value: 'system' },
];

const STATUS = {
  placed: { label: 'Order placed', tag: 'tag-accent' },
  'out-for-delivery': { label: 'On its way', tag: 'tag-accent' },
  delivered: { label: 'Delivered', tag: 'tag-neutral' },
  cancelled: { label: 'Cancelled', tag: 'tag-neutral' },
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const titlesLabel = (titles) => (titles.length > 2 ? `${titles[0]} +${titles.length - 1}` : titles.join(', '));
const capitalise = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

const Monogram = ({ name, className }) => (
  <span
    className={clsx(
      'grid shrink-0 place-items-center rounded-full border border-accent font-heading text-accent italic',
      className
    )}
  >
    {(name || '?').charAt(0).toUpperCase()}
  </span>
);

const ThemePicker = ({ className }) => {
  const { preference, setPreference } = useTheme();
  return (
    <div className={clsx('seg', className)}>
      {THEME_OPTIONS.map(({ label, value }) => (
        <label key={value} className="seg-opt min-h-10 flex-1 justify-center lg:min-h-0 lg:flex-none">
          <input type="radio" name="profile-theme" checked={preference === value} onChange={() => setPreference(value)} />
          {label}
        </label>
      ))}
    </div>
  );
};

const AccountCard = ({ user, setUser }) => {
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState(user.address || '');
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAddress(address.trim());
      setUser({ ...user, address: address.trim() });
      setEditing(false);
      toast.success('Address updated.');
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save your address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id="account" onSubmit={save} className="flex scroll-mt-6 flex-col gap-3.5 rounded-md border border-divider p-[18px] lg:p-7">
      <span className="text-[10px] tracking-[.1em] text-accent uppercase">Account</span>
      <div>
        <label htmlFor="profile-email" className="mb-1 block text-xs text-ink/70">Email</label>
        {/* TODO(#20): email can't be changed yet. */}
        <input id="profile-email" className="input" value={user.email || ''} readOnly />
      </div>
      <div>
        <label htmlFor="profile-address" className="mb-1 block text-xs text-ink/70">Default address</label>
        <input
          id="profile-address"
          className="input"
          value={address}
          readOnly={!editing}
          required
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      {editing ? (
        <div className="flex gap-2">
          <button type="submit" disabled={saving || !address.trim()} className="btn btn-primary">{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" onClick={() => { setAddress(user.address || ''); setEditing(false); }} className="btn btn-ghost">Cancel</button>
        </div>
      ) : (
        <button type="button" onClick={() => setEditing(true)} className="btn btn-secondary self-start">Edit details</button>
      )}
    </form>
  );
};

const ProfilePage = () => {
  const { user, isAuthenticated, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (isAuthenticated) getRecentOrders().then(setOrders);
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div className="page flex flex-col items-start gap-4 pt-10 pb-16 lg:pt-16">
        <span className="eyebrow tracking-[.16em]">Your account</span>
        <h1 className="m-0 text-[50px] leading-none font-normal tracking-[-0.025em] lg:text-[68px]">Welcome back.</h1>
        <p className="m-0 max-w-[460px] text-muted">Sign in to see your orders, your shelf and your settings.</p>
        <div className="flex gap-3">
          <Link to="/login" className="btn btn-primary">Sign in</Link>
          <Link to="/signup" className="btn btn-ghost">Create a free account</Link>
        </div>
      </div>
    );
  }

  const name = capitalise(user.username);
  const since = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : null;

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const comingSoon = (label) => () => toast(`${label} is coming soon.`);

  // TODO(#20): Addresses / Payment methods / Settings pages.
  const NAV = [
    { label: 'Overview', active: true },
    { label: 'Orders', href: '#orders' },
    { label: 'Favourites', to: '/favourites' },
    { label: 'Addresses', href: '#account' },
    { label: 'Payment methods', onClick: comingSoon('Payment methods') },
    { label: 'Settings', onClick: comingSoon('Settings') },
    { label: 'Sign out', onClick: handleSignOut, danger: true },
  ];

  const navItem = ({ label, to, href, onClick, active, danger }, mobile) => {
    const className = clsx(
      'flex w-full items-center justify-between border-b border-divider text-left text-[15px] no-underline',
      mobile ? 'min-h-[52px]' : 'py-3',
      active ? 'text-accent' : danger ? 'text-danger' : 'text-ink hover:text-accent'
    );
    const mark = mobile ? <ChevronRight size={16} strokeWidth={1.6} className="text-muted" /> : active && <span className="text-accent">—</span>;
    if (to) return <Link key={label} to={to} className={className}>{label}{mark}</Link>;
    if (href) return <a key={label} href={href} className={className}>{label}{mark}</a>;
    return <button key={label} type="button" onClick={onClick} className={className} aria-current={active ? 'page' : undefined}>{label}{mark}</button>;
  };

  // TODO(#19): books bought should count books, not single-book orders; TODO(#13): reviews written.
  const stats = [
    { v: orders && !orders.sample ? orders.data.length : '—', k: 'Books bought' },
    { v: user.favourites?.length ?? 0, k: 'On your shelf' },
    { v: 0, k: 'Reviews written' },
  ];

  return (
    <div className="page pb-7 lg:grid lg:grid-cols-[260px_1fr] lg:gap-16 lg:pt-16 lg:pb-20">
      <aside className="hidden flex-col gap-7 lg:flex">
        <div className="flex flex-col items-start gap-3">
          <Monogram name={name} className="size-[88px] text-[40px] shadow-[inset_0_0_0_5px_var(--color-bg),inset_0_0_0_6px_var(--color-divider)]" />
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-[28px] font-medium">{name}</span>
            {since && <span className="text-[13px] text-muted italic">Reader since {since}</span>}
          </div>
        </div>
        <nav className="flex flex-col border-t border-divider">{NAV.map((item) => navItem(item, false))}</nav>
      </aside>

      <div className="flex flex-col gap-6 lg:gap-12">
        {/* Greeting */}
        <div className="flex items-center gap-4 pt-7 lg:hidden">
          <Monogram name={name} className="size-[68px] text-[32px] shadow-[inset_0_0_0_4px_var(--color-bg),inset_0_0_0_5px_var(--color-divider)]" />
          <div className="flex flex-col">
            <h1 className="m-0 text-[34px] leading-none font-normal">{greeting()}, <em className="text-accent">{name}.</em></h1>
            {since && <span className="mt-1 text-[13px] text-muted italic">Reader since {since}</span>}
          </div>
        </div>
        <div className="hidden flex-col gap-2 lg:flex">
          <span className="eyebrow tracking-[.16em]">Overview</span>
          <h1 className="m-0 text-[68px] leading-none font-normal tracking-[-0.025em]">{greeting()}, <em className="text-accent">{name}.</em></h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-t border-b border-t-ink border-b-divider">
          {stats.map(({ v, k }) => (
            <div key={k} className="flex flex-col gap-0.5 py-3.5 lg:gap-1 lg:border-r lg:border-divider lg:py-[22px] lg:pr-6 lg:last:border-r-0">
              <span className="font-heading text-4xl leading-none tabular-nums lg:text-[52px]">{v}</span>
              <span className="text-xs text-muted lg:text-[13px]">{k}</span>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <section id="orders" className="flex scroll-mt-6 flex-col gap-2.5 lg:gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="m-0 text-[26px] font-medium lg:text-[34px]">Recent orders</h2>
            {orders?.sample && <span className="text-xs text-muted italic">Sample orders — history is on its way</span>}
          </div>
          {!orders ? (
            <div className="h-28 animate-pulse rounded bg-surface" />
          ) : orders.data.length === 0 ? (
            <p className="m-0 text-muted italic">No orders yet — <Link to="/discover">find your first book</Link>.</p>
          ) : (
            <>
              <table className="hidden w-full border-collapse text-sm lg:table">
                <thead>
                  <tr className="border-b border-divider text-left text-[11px] tracking-[.08em] text-ink/60 uppercase">
                    {['Order', 'Placed', 'Books', 'Total', 'Status', ''].map((h) => <th key={h} className="p-2.5 font-normal">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {orders.data.slice(0, 5).map((o) => (
                    <tr key={o._id} className="border-b border-divider hover:bg-ink/[.04]">
                      <td className="p-2.5 tabular-nums">#{o.number}</td>
                      <td className="p-2.5">{formatDate(o.createdAt)}</td>
                      <td className="p-2.5 italic">{titlesLabel(o.titles)}</td>
                      <td className="p-2.5 tabular-nums">₹{o.total.toLocaleString('en-IN')}</td>
                      <td className="p-2.5"><span className={`tag ${STATUS[o.status].tag}`}>{STATUS[o.status].label}</span></td>
                      {/* TODO(#19): order details page. */}
                      <td className="p-2.5 text-right"><button type="button" onClick={comingSoon('Order details')} className="text-[13px] text-accent underline underline-offset-4">Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-col lg:hidden">
                {orders.data.slice(0, 5).map((o) => (
                  <div key={o._id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b border-divider py-3.5">
                    <span className="font-heading text-[19px] font-semibold italic">{titlesLabel(o.titles)}</span>
                    <span className={`tag ${STATUS[o.status].tag}`}>{STATUS[o.status].label}</span>
                    <span className="text-xs text-muted tabular-nums">#{o.number} · {formatDate(o.createdAt)}</span>
                    <span className="justify-self-end text-sm tabular-nums">₹{o.total.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Appearance + account */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-7">
          <div className="flex flex-col gap-2.5 rounded-md border border-divider p-[18px] lg:gap-3.5 lg:p-7">
            <span className="text-[10px] tracking-[.1em] text-accent uppercase">
              <span className="lg:hidden">Reading light</span><span className="hidden lg:inline">Appearance</span>
            </span>
            <span className="hidden font-heading text-[22px] font-semibold lg:inline">Reading light</span>
            <p className="m-0 hidden text-[13px] opacity-80 lg:block">Paper by day, lamplight by night — or follow your device.</p>
            <ThemePicker className="flex lg:inline-flex lg:self-start" />
          </div>
          <AccountCard user={user} setUser={setUser} />
        </div>

        <nav className="flex flex-col lg:hidden">{NAV.filter((n) => !['Overview', 'Favourites'].includes(n.label)).map((item) => navItem(item, true))}</nav>
      </div>
    </div>
  );
};

export default ProfilePage;
