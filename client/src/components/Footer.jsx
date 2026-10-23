import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscribeToNewsletter } from '../api/newsletter';

// Items without `to` have no page yet and render as plain text.
const COLUMNS = [
  { title: 'Shop', items: [['Discover', '/discover'], ['New & Notable', '/new'], ['Bestsellers', '/new'], ['Gift cards']] },
  { title: 'Help', items: [['Shipping'], ['Returns'], ['Track an order'], ['Contact']] },
  { title: 'Bookbyte', items: [['Our story', '/about'], ['Journal', '/journal'], ['Careers'], ['Press']] },
  { title: 'Account', items: [['Profile', '/profile'], ['Favourites', '/favourites'], ['Orders', '/profile'], ['Settings', '/profile']] },
];

const FooterLink = ({ label, to }) =>
  to ? (
    <Link to={to} className="text-muted no-underline hover:text-accent">{label}</Link>
  ) : (
    <span className="text-muted">{label}</span>
  );

const NewsletterForm = ({ buttonLabel, inputClassName }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await subscribeToNewsletter(email);
      toast.success("You're on the list — see you Sunday.");
      setEmail('');
    } catch {
      toast.error("Couldn't subscribe right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
        className={`input ${inputClassName ?? ''}`}
      />
      <button type="submit" disabled={submitting} className="btn btn-primary whitespace-nowrap">
        {buttonLabel}
      </button>
    </form>
  );
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-divider bg-bg text-ink">
      {/* Desktop — BB Footer */}
      <div className="page hidden flex-col gap-12 pt-16 pb-7 lg:flex">
        <div className="grid grid-cols-[1.4fr_1px_1fr] items-end gap-12">
          <div className="flex flex-col gap-3.5">
            <span className="eyebrow">The Bookbyte Letter</span>
            <h2 className="m-0 text-[46px] leading-[1.02] font-normal tracking-[-0.02em] text-balance">
              One good book, every <em className="text-accent">Sunday</em> morning.
            </h2>
          </div>
          <div className="self-stretch bg-divider" />
          <div className="flex flex-col gap-2.5">
            <p className="m-0 text-justify text-sm text-muted hyphens-auto">
              A short letter from our shelves — a pick, a passage, and nothing you didn't ask for.
            </p>
            <NewsletterForm buttonLabel="Subscribe" />
          </div>
        </div>
        <div className="h-px bg-divider" />
        <div className="grid grid-cols-[repeat(4,1fr)_1.2fr] gap-8 text-sm">
          {COLUMNS.map(({ title, items }) => (
            <div key={title} className="flex flex-col gap-[9px]">
              <span className="mb-1 font-heading text-lg font-semibold">{title}</span>
              {items.map(([label, to]) => <FooterLink key={label} label={label} to={to} />)}
            </div>
          ))}
          <div className="flex flex-col items-end gap-[9px] text-right">
            <span className="font-heading text-[30px] leading-none font-medium">Book<em className="text-accent">byte</em></span>
            <span className="text-sm text-muted italic">Booksellers, online since 2024.</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-divider pt-[18px] text-xs text-muted">
          <span>© {year} Bookbyte. Set in Cormorant Garamond &amp; Lora.</span>
          <div className="flex gap-[22px]">
            <span>Privacy</span><span>Terms</span><span>Cookies</span><span>₹ INR · English</span>
          </div>
        </div>
      </div>

      {/* Mobile — from mockup 2a */}
      <div className="flex flex-col gap-[22px] px-5 pt-9 pb-7 lg:hidden">
        <div className="flex flex-col gap-2.5">
          <span className="eyebrow">The Bookbyte Letter</span>
          <span className="font-heading text-[30px] leading-[1.05]">
            One good book, every <em className="text-accent">Sunday</em>.
          </span>
          <NewsletterForm buttonLabel="Join" inputClassName="min-h-11" />
        </div>
        <div className="border-t border-divider">
          {COLUMNS.map(({ title, items }) => (
            <details key={title} className="group border-b border-divider">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-heading text-[19px] font-semibold [&::-webkit-details-marker]:hidden">
                {title}
                <Plus size={16} strokeWidth={1.6} className="text-muted transition-transform group-open:rotate-45" />
              </summary>
              <div className="flex flex-col gap-2.5 pb-4 text-[15px]">
                {items.map(([label, to]) => <FooterLink key={label} label={label} to={to} />)}
              </div>
            </details>
          ))}
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-heading text-2xl font-medium">Book<em className="text-accent">byte</em></span>
          <span className="text-xs text-muted">© {year} · ₹ INR</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
