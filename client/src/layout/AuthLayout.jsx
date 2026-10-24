import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Logo } from '../components/NavParts';

/**
 * Full-screen layout for the auth screens (mockups 3a–3e): a surface panel on the
 * left (desktop only), the form on the right; on mobile a close button + logo header.
 */
const AuthLayout = ({ aside, topLink, backTo = { label: '← Back to the store', to: '/' }, footer, children }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink lg:grid lg:grid-cols-[540px_1fr]">
      <aside className="hidden flex-col justify-between gap-8 border-r border-divider bg-surface px-14 py-11 lg:flex">
        <Logo className="text-[34px]" />
        {aside}
      </aside>

      <div className="flex flex-1 flex-col lg:px-14 lg:py-9">
        <div className="grid grid-cols-[52px_1fr_52px] items-center px-2 py-1 lg:hidden">
          <button type="button" aria-label="Close" onClick={() => navigate(-1)} className="btn btn-icon size-11">
            <X size={22} strokeWidth={1.6} />
          </button>
          <Logo className="justify-self-center text-[26px]" />
        </div>
        <div className="hidden items-center justify-between text-sm lg:flex">
          <Link to={backTo.to} className="text-muted no-underline hover:text-accent">{backTo.label}</Link>
          {topLink}
        </div>

        <div className="flex flex-1 justify-center px-5 pt-6 pb-8 lg:items-center lg:px-0 lg:py-10">
          {children}
        </div>

        {footer}
      </div>
    </div>
  );
};

export default AuthLayout;
