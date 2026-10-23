import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUserCart, removeBookFromCart } from '../api/cart';
import { applyPromo } from '../api/promo';
import { withMockFields } from '../mocks/bookExtras';
import { useAuth } from '../hooks/useAuth';
import { useMobileChrome } from '../context/MobileChromeContext';
import BookCover from '../components/BookCover';
import Checkbox from '../components/Checkbox';
import QtyStepper from '../components/QtyStepper';

// Mockups 1f (desktop) and 2e (mobile).

const GIFT_WRAP = 49;
const FREE_SHIPPING_FROM = 499;
const SHIPPING_FEE = 49;

// TODO(#14): quantity and selection live in this browser until cart lines have them.
const LINES_KEY = 'bb-bag-lines';
const loadLines = () => {
  try {
    return JSON.parse(localStorage.getItem(LINES_KEY)) || {};
  } catch {
    return {};
  }
};
const saveLines = (lines) => {
  try {
    localStorage.setItem(LINES_KEY, JSON.stringify(lines));
  } catch {
    // storage blocked — selections just won't survive a reload
  }
};

const rupees = (n) => `₹${n.toLocaleString('en-IN')}`;

const Steps = ({ className }) => (
  <div className={clsx('flex items-center gap-2.5 text-xs text-muted lg:text-[13px]', className)}>
    <span className="text-accent">Bag</span>
    <span className="h-px flex-1 bg-divider lg:w-6 lg:flex-none" />
    <span>Delivery</span>
    <span className="h-px flex-1 bg-divider lg:w-6 lg:flex-none" />
    <span>Payment</span>
  </div>
);

const CartPage = () => {
  const { isAuthenticated, removeFromUserCart } = useAuth();
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('loading');
  const [lines, setLines] = useState(loadLines);
  const [giftWrap, setGiftWrap] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  useMobileChrome({ back: true, title: 'Your bag', hideTabbar: isAuthenticated && books.length > 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus('signed-out');
      return;
    }
    setStatus('loading');
    getUserCart()
      .then((res) => {
        setBooks((res.data || []).map(withMockFields));
        setStatus('ready');
      })
      .catch((err) => {
        console.error('Error fetching cart:', err);
        setStatus('error');
      });
  }, [isAuthenticated]);

  useEffect(() => saveLines(lines), [lines]);

  const lineFor = (id) => ({ qty: 1, selected: true, ...lines[id] });
  const updateLine = (id, patch) => setLines((all) => ({ ...all, [id]: { ...lineFor(id), ...patch } }));

  const selectedBooks = books.filter((b) => lineFor(b._id).selected);
  const allSelected = books.length > 0 && selectedBooks.length === books.length;
  const someSelected = selectedBooks.length > 0 && !allSelected;
  const toggleAll = () => setLines((all) => {
    const next = { ...all };
    books.forEach((b) => { next[b._id] = { ...lineFor(b._id), selected: !allSelected }; });
    return next;
  });

  // TODO(#18): totals belong on the server.
  const count = selectedBooks.reduce((n, b) => n + lineFor(b._id).qty, 0);
  const subtotal = selectedBooks.reduce((n, b) => n + b.price * lineFor(b._id).qty, 0);
  const discount = promo ? Math.round(subtotal * promo.rate) : 0;
  const shipping = !count || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  const wrap = giftWrap && count ? GIFT_WRAP : 0;
  const total = subtotal - discount + shipping + wrap;

  const handleRemove = async (book) => {
    try {
      await removeBookFromCart(book._id);
      removeFromUserCart(book._id);
      setBooks((list) => list.filter((b) => b._id !== book._id));
      setLines(({ [book._id]: _removed, ...rest }) => rest);
      toast.success(`Removed ${book.title} from your bag.`);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't remove that book.");
    }
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    setPromoError('');
    try {
      const result = await applyPromo(promoInput, subtotal);
      // Keep the rate, not the amount, so the discount follows the selection.
      setPromo({ code: result.code, rate: result.discount / subtotal });
      setPromoInput('');
    } catch (err) {
      setPromoError(err.message);
    }
  };

  // TODO: checkout screens are still being designed.
  const handleCheckout = () => toast('Checkout opens soon — your bag is saved.');

  if (status === 'signed-out') {
    return (
      <div className="page flex flex-col items-start gap-4 pt-10 pb-16 lg:pt-16">
        <h1 className="m-0 text-[50px] leading-none font-normal tracking-[-0.025em] lg:text-[76px]">Your bag</h1>
        <p className="m-0 max-w-[460px] text-muted">Sign in to see your bag — it's kept safe on your account.</p>
        <div className="flex gap-3">
          <Link to="/login" className="btn btn-primary">Sign in</Link>
          <Link to="/signup" className="btn btn-ghost">Create a free account</Link>
        </div>
      </div>
    );
  }

  const promoForm = (
    <form onSubmit={handleApplyPromo} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          className="input min-h-11 lg:min-h-9"
          placeholder="Promo code"
          aria-label="Promo code"
          value={promoInput}
          onChange={(e) => setPromoInput(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary" disabled={!promoInput.trim() || !subtotal}>Apply</button>
      </div>
      {promoError && <span className="text-xs text-danger">{promoError}</span>}
    </form>
  );

  const summaryRows = (
    <div className="flex flex-col gap-2 text-sm tabular-nums lg:gap-2.5">
      <div className="flex justify-between"><span className="whitespace-nowrap text-muted">Subtotal · {count} {count === 1 ? 'book' : 'books'}</span><span>{rupees(subtotal)}</span></div>
      <div className="flex justify-between">
        <span className="text-muted">Shipping</span>
        {shipping ? <span>{rupees(shipping)}</span> : <span className="text-success">Free</span>}
      </div>
      {wrap > 0 && <div className="flex justify-between"><span className="text-muted">Gift wrap</span><span>{rupees(wrap)}</span></div>}
      {promo && (
        <div className="flex justify-between">
          <span className="text-muted">
            <span className="hidden lg:inline">Promo </span>{promo.code}
            <button type="button" onClick={() => setPromo(null)} className="ml-2 text-xs text-accent underline underline-offset-2">remove</button>
          </span>
          <span>−{rupees(discount)}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className={clsx('lg:pb-20', books.length && 'pb-[calc(88px+env(safe-area-inset-bottom))]')}>
      <div className="page hidden items-end justify-between pt-16 pb-6 lg:flex">
        <h1 className="m-0 text-[76px] leading-none font-normal tracking-[-0.025em]">Your bag</h1>
        <Steps />
      </div>
      <Steps className="border-b border-divider px-5 py-4 lg:hidden" />

      {status === 'loading' ? (
        <div className="page flex flex-col gap-4 pt-6">
          {Array.from({ length: 3 }, (_, i) => <div key={i} className="h-[110px] animate-pulse rounded bg-surface" />)}
        </div>
      ) : status === 'error' ? (
        <p className="page m-0 pt-8 text-muted italic">Couldn't load your bag right now. Please try again in a moment.</p>
      ) : books.length === 0 ? (
        <div className="page flex flex-col items-start gap-3 pt-8 pb-16">
          <p className="m-0 font-heading text-[28px]">Your bag is empty.</p>
          <p className="m-0 text-muted">Find something worth staying up for.</p>
          <Link to="/discover" className="btn btn-primary">Browse the shelves</Link>
        </div>
      ) : (
        <div className="lg:page lg:grid lg:grid-cols-[1fr_400px] lg:items-start lg:gap-14 lg:pt-3">
          <div className="flex flex-col px-5 lg:px-0">
            <div className="flex min-h-[52px] items-center gap-3 border-b border-ink lg:grid lg:min-h-0 lg:grid-cols-[20px_1fr_130px_100px_36px] lg:gap-5 lg:py-2.5 lg:text-[11px] lg:tracking-[.12em] lg:text-muted lg:uppercase">
              <Checkbox checked={allSelected} mixed={someSelected} onChange={toggleAll} label="Select all" className="size-[22px] lg:size-[18px]" />
              <span className="flex flex-1 items-baseline gap-3.5 text-sm lg:text-[11px]">
                Select all
                <span className="ml-auto text-[13px] tracking-normal whitespace-nowrap normal-case text-muted italic lg:ml-0 lg:text-xs">
                  {selectedBooks.length} of {books.length} selected
                </span>
              </span>
              <span className="hidden lg:inline">Quantity</span>
              <span className="hidden text-right lg:inline">Price</span>
              <span className="hidden lg:inline" />
            </div>

            {books.map((book) => {
              const { qty, selected } = lineFor(book._id);
              const lineTotal = rupees(book.price * qty);
              return (
                <div key={book._id} className="grid grid-cols-[22px_70px_1fr] items-start gap-3.5 border-b border-divider py-[18px] lg:grid-cols-[20px_1fr_130px_100px_36px] lg:items-center lg:gap-5 lg:py-6">
                  <Checkbox
                    checked={selected}
                    onChange={(value) => updateLine(book._id, { selected: value })}
                    label={`Select ${book.title}`}
                    className="mt-0.5 size-[22px] lg:mt-0 lg:size-[18px]"
                  />
                  <Link to={`/book/${book._id}`} className={clsx('lg:hidden', !selected && 'opacity-50')} aria-label={book.title}>
                    <BookCover book={book} />
                  </Link>
                  <div className={clsx('flex flex-col gap-[3px] lg:grid lg:grid-cols-[84px_1fr] lg:items-center lg:gap-5', !selected && 'opacity-50')}>
                    <Link to={`/book/${book._id}`} className="hidden lg:block" aria-label={book.title}><BookCover book={book} /></Link>
                    <div className="flex flex-col gap-[3px]">
                      <div className="flex justify-between gap-2">
                        <Link to={`/book/${book._id}`} className="font-heading text-xl leading-[1.1] font-semibold text-ink no-underline lg:text-2xl">{book.title}</Link>
                        <button type="button" onClick={() => handleRemove(book)} aria-label={`Remove ${book.title}`} className="btn btn-icon size-7 shrink-0 text-muted lg:hidden">
                          <X size={16} strokeWidth={1.6} />
                        </button>
                      </div>
                      <span className="text-[13px] text-muted italic lg:text-sm">
                        {book.author}<span className="lg:hidden"> · {book.format}</span>
                      </span>
                      <span className="mt-1 hidden text-xs text-muted lg:inline">{book.format} · In stock</span>
                      <div className="mt-2.5 flex items-center justify-between lg:hidden">
                        <QtyStepper value={qty} onChange={(v) => updateLine(book._id, { qty: v })} className="[&_.btn-icon]:size-10" />
                        <span className="font-heading text-[21px] tabular-nums">{lineTotal}</span>
                      </div>
                    </div>
                  </div>
                  <QtyStepper value={qty} onChange={(v) => updateLine(book._id, { qty: v })} className="hidden w-max lg:flex [&_.btn-icon]:size-[34px]" />
                  <span className={clsx('hidden text-right font-heading text-2xl tabular-nums lg:inline', !selected && 'opacity-50')}>{lineTotal}</span>
                  <button type="button" onClick={() => handleRemove(book)} aria-label={`Remove ${book.title}`} className="btn btn-icon hidden size-8 text-muted lg:inline-flex">
                    <X size={16} strokeWidth={1.6} />
                  </button>
                </div>
              );
            })}

            <label className="flex cursor-pointer items-center gap-3 border-b border-divider py-4 text-sm lg:border-b-0 lg:py-5">
              <Checkbox checked={giftWrap} onChange={setGiftWrap} label="Gift wrap" className="size-[22px] lg:size-[15px]" />
              <span className="lg:hidden">Gift-wrap in brown paper</span>
              <span className="hidden lg:inline">This is a gift — wrap it in brown paper and leave out the receipt</span>
              <span className="text-muted">(+{rupees(GIFT_WRAP)})</span>
            </label>
            <Link to="/discover" className="hidden self-start border-b border-current text-sm no-underline lg:inline">← Keep browsing</Link>
          </div>

          {/* Summary — desktop card */}
          <aside className="hidden flex-col gap-4 rounded-md border border-divider bg-raised p-8 shadow-sm lg:flex">
            <span className="font-heading text-[28px] font-medium">Summary</span>
            {summaryRows}
            {promoForm}
            <div className="h-px bg-divider" />
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-[22px]">Total</span>
              <span className="font-heading text-[44px] leading-none font-medium tabular-nums">{rupees(total)}</span>
            </div>
            <button type="button" onClick={handleCheckout} disabled={!count} className="btn btn-primary btn-block p-3.5 text-[17px]">
              Checkout {selectedBooks.length} selected
            </button>
            <span className="text-center text-xs text-muted italic">Unselected books stay in your bag for later.</span>
            <span className="text-center text-xs text-muted">UPI · Cards · Net banking · Cash on delivery</span>
          </aside>

          {/* Summary — mobile */}
          <div className="m-5 flex flex-col gap-3 rounded-md border border-divider bg-raised p-5 lg:hidden">
            {promoForm}
            {summaryRows}
          </div>
          <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3.5 border-t border-divider bg-bg px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] lg:hidden">
            <div className="flex flex-col">
              <span className="text-xs text-muted">Total</span>
              <span className="font-heading text-[28px] leading-none font-medium tabular-nums">{rupees(total)}</span>
            </div>
            <button type="button" onClick={handleCheckout} disabled={!count} className="btn btn-primary min-h-12 flex-1 text-[15px]">
              Checkout {selectedBooks.length} selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
