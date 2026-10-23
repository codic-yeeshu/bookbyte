import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFavouriteBooks, removeBookFromFavourite } from '../api/favourite';
import { addBookToCart } from '../api/cart';
import { withMockFields } from '../mocks/bookExtras';
import { withFavouriteExtras } from '../mocks/favourites';
import { useAuth } from '../hooks/useAuth';
import BookCover from '../components/BookCover';

// Mockups 1e (desktop) and 2d (mobile).

const VIEWS = [
  { label: 'All', value: 'all' },
  { label: 'Want to read', value: 'want-to-read' },
  { label: 'On sale', value: 'on-sale' },
];

const matchesView = (book, view) => {
  if (view === 'want-to-read') return book.list === 'want-to-read';
  if (view === 'on-sale') return book.onSale;
  return true;
};

const Header = ({ subtitle, children }) => (
  <div className="page flex flex-col gap-4 pt-7 pb-4 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8 lg:border-b lg:border-divider lg:pt-16 lg:pb-8">
    <div className="flex flex-col gap-2 lg:gap-2.5">
      <span className="eyebrow tracking-[.16em]">Favourites</span>
      <h1 className="m-0 text-[50px] leading-none font-normal tracking-[-0.025em] lg:text-[76px]">
        Your <em className="text-accent">shelf</em>
      </h1>
      {subtitle && <span className="text-sm text-muted italic lg:text-[15px]">{subtitle}</span>}
    </div>
    {children}
  </div>
);

const FavouriteRow = ({ book, inBag, onRemove, onMove }) => (
  <div className="grid grid-cols-[76px_1fr] gap-4 border-b border-divider py-[18px] lg:grid-cols-[110px_1fr_auto] lg:items-center lg:gap-6 lg:py-6">
    <Link to={`/book/${book._id}`} aria-label={book.title}><BookCover book={book} /></Link>
    <div className="flex flex-col gap-[3px] lg:gap-1">
      <span className="text-[10px] tracking-[.12em] text-accent-ink uppercase lg:text-[11px]">{book.genre}</span>
      <Link to={`/book/${book._id}`} className="font-heading text-[21px] leading-[1.1] font-semibold text-ink no-underline lg:text-[26px]">{book.title}</Link>
      <span className="text-[13px] text-muted italic lg:text-sm">{book.author}</span>
      <span className="mt-1.5 hidden text-xs text-muted lg:inline">
        Saved {book.savedLabel}{book.backInStock && <span className="text-success"> · back in stock</span>}
      </span>
      <div className="mt-auto flex items-center justify-between pt-2 lg:hidden">
        <span className="font-heading text-[21px] tabular-nums">₹{book.price}</span>
        <RowActions inBag={inBag} onRemove={onRemove} onMove={onMove} title={book.title} compact />
      </div>
    </div>
    <div className="hidden flex-col items-end gap-2.5 lg:flex">
      <span className="font-heading text-[26px] tabular-nums">₹{book.price}</span>
      <RowActions inBag={inBag} onRemove={onRemove} onMove={onMove} title={book.title} />
    </div>
  </div>
);

const RowActions = ({ inBag, onRemove, onMove, title, compact = false }) => (
  <div className="flex gap-1.5">
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${title} from favourites`}
      className={compact ? 'btn btn-icon btn-secondary size-10 text-accent' : 'btn btn-icon btn-secondary text-accent'}
    >
      <Heart size={16} strokeWidth={1.6} fill="currentColor" />
    </button>
    <button type="button" onClick={onMove} className={compact ? 'btn btn-primary min-h-10 px-3 py-1.5 text-sm' : 'btn btn-primary'}>
      {inBag ? 'In bag' : compact ? 'To bag' : 'Move to bag'}
    </button>
  </div>
);

const FavouritesPage = () => {
  const { user, isAuthenticated, addToUserCart, removeFromUserFavourites } = useAuth();
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('loading');
  const [view, setView] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus('signed-out');
      return;
    }
    setStatus('loading');
    getFavouriteBooks()
      .then((res) => {
        setBooks((res.data || []).map(withMockFields).map(withFavouriteExtras));
        setStatus('ready');
      })
      .catch((err) => {
        console.error('Error fetching favourites:', err);
        setStatus('error');
      });
  }, [isAuthenticated]);

  const inBag = (id) => !!user?.cart?.includes(id);

  const remove = async (book, { quiet = false } = {}) => {
    await removeBookFromFavourite(book._id);
    removeFromUserFavourites(book._id);
    setBooks((list) => list.filter((b) => b._id !== book._id));
    if (!quiet) toast.success('Removed from your shelf.');
  };

  const handleRemove = (book) => remove(book).catch(() => toast.error("Couldn't update your shelf."));

  // TODO(#17): one "move to bag" request once the API has it.
  const handleMove = async (book) => {
    try {
      if (!inBag(book._id)) {
        await addBookToCart(book._id);
        addToUserCart(book._id);
      }
      await remove(book, { quiet: true });
      toast.success(`Moved ${book.title} to your bag.`);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't move that to your bag.");
    }
  };

  const handleAddAll = async () => {
    const toAdd = books.filter((b) => !inBag(b._id));
    if (!toAdd.length) {
      toast('Everything here is already in your bag.');
      return;
    }
    const results = await Promise.allSettled(toAdd.map((b) => addBookToCart(b._id).then(() => addToUserCart(b._id))));
    const added = results.filter((r) => r.status === 'fulfilled').length;
    if (added) toast.success(`Added ${added} ${added === 1 ? 'book' : 'books'} to your bag.`);
    if (added < toAdd.length) toast.error(`${toAdd.length - added} couldn't be added.`);
  };

  if (status === 'signed-out') {
    return (
      <div className="pb-16">
        <Header />
        <div className="page flex flex-col items-start gap-4 pt-10">
          <p className="m-0 max-w-[460px] text-muted">Sign in to see the books you've saved — your shelf follows you to every device.</p>
          <div className="flex gap-3">
            <Link to="/login" className="btn btn-primary">Sign in</Link>
            <Link to="/signup" className="btn btn-ghost">Create a free account</Link>
          </div>
        </div>
      </div>
    );
  }

  const shown = books.filter((b) => matchesView(b, view));
  const backInStock = books.filter((b) => b.backInStock).length;
  const subtitle = status === 'ready'
    ? `${books.length} ${books.length === 1 ? 'book' : 'books'} saved${backInStock ? ` · ${backInStock} back in stock` : ''}`
    : null;

  const viewSwitch = (className) => (
    <div className={`seg ${className}`}>
      {VIEWS.map(({ label, value }) => (
        <label key={value} className="seg-opt min-h-10 flex-1 justify-center whitespace-nowrap lg:min-h-0">
          <input type="radio" name="favourites-view" checked={view === value} onChange={() => setView(value)} />
          {label}
        </label>
      ))}
    </div>
  );

  return (
    <div className="pb-7 lg:pb-20">
      <Header subtitle={subtitle && <>{subtitle}<span className="hidden lg:inline">{backInStock ? ' since your last visit' : ''}</span></>}>
        {books.length > 0 && (
          <div className="flex items-center gap-3">
            {viewSwitch('flex w-full lg:inline-flex lg:w-auto')}
            <button type="button" onClick={handleAddAll} className="btn btn-primary hidden lg:inline-flex">Add all to bag</button>
          </div>
        )}
      </Header>

      <div className="page">
        {status === 'loading' ? (
          <div className="grid gap-x-14 lg:grid-cols-2 lg:pt-10">
            {Array.from({ length: 4 }, (_, i) => <div key={i} className="my-[18px] h-[115px] animate-pulse rounded bg-surface lg:h-[165px]" />)}
          </div>
        ) : status === 'error' ? (
          <p className="m-0 pt-10 text-muted italic">Couldn't load your shelf right now. Please try again in a moment.</p>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-start gap-3 pt-10">
            <p className="m-0 font-heading text-[28px]">Nothing saved yet.</p>
            <p className="m-0 text-muted">Tap the heart on any book to keep it here for later.</p>
            <Link to="/discover" className="btn btn-primary">Browse the shelves</Link>
          </div>
        ) : (
          <>
            {shown.length === 0 && <p className="m-0 pt-10 text-muted italic">Nothing in this list yet.</p>}
            <div className="grid gap-x-14 lg:grid-cols-2 lg:pt-10">
              {shown.map((book) => (
                <FavouriteRow
                  key={book._id}
                  book={book}
                  inBag={inBag(book._id)}
                  onRemove={() => handleRemove(book)}
                  onMove={() => handleMove(book)}
                />
              ))}
            </div>
            <button type="button" onClick={handleAddAll} className="btn btn-secondary btn-block mt-5 min-h-[46px] lg:hidden">
              Add all to bag
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;
