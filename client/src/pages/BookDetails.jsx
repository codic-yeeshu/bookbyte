import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { Heart, RotateCcw, Truck } from 'lucide-react';
import { getBookById } from '../api/books';
import { getBookReviews } from '../api/reviews';
import { getAlsoShelved } from '../api/recommendations';
import { withMockFields } from '../mocks/bookExtras';
import { authorBio } from '../mocks/authors';
import { useBag } from '../hooks/useBag';
import { useFavourites } from '../hooks/useFavourites';
import { useMobileChrome } from '../context/MobileChromeContext';
import BookCover from '../components/BookCover';
import QtyStepper from '../components/QtyStepper';

// Mockups 1d (desktop) and 2c (mobile).

const stars = (rating) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

const arrivalDate = () =>
  new Date(Date.now() + 4 * 864e5).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

const formatMonth = (date) => new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

const ReviewCard = ({ review }) => (
  <div className="flex flex-col gap-3 rounded-md border border-divider p-[18px] lg:p-7">
    <div className="flex items-center justify-between">
      <span className="tracking-[2px] text-accent">{stars(review.rating)}</span>
      <span className="hidden text-[11px] text-muted lg:inline">{formatMonth(review.createdAt)}</span>
    </div>
    <p className="m-0 font-heading text-lg leading-[1.3] italic lg:text-[22px]">“{review.quote}”</p>
    <span className="text-xs text-muted lg:text-[13px]">— {review.author}{review.verifiedBuyer && ', verified buyer'}</span>
  </div>
);

const Specs = ({ book }) => {
  // TODO(#10): publisher / year / ISBN / dimensions are mocked.
  const rows = [
    ['Publisher', book.publisher],
    ['Published', book.publishedYear],
    ['Pages', book.pages],
    ['Language', book.language],
    ['ISBN-13', book.isbn13],
    ['Dimensions', book.dimensions],
  ];
  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} className="border-b border-divider">
            <td className="py-2.5 text-muted lg:w-[42%] lg:px-2">{k}</td>
            <td className="py-2.5 text-right tabular-nums lg:px-2 lg:text-left">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Synopsis = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = (text || '').split(/\n+/).filter(Boolean);
  if (!paragraphs.length) return <p className="m-0 text-muted italic">No synopsis yet.</p>;
  const long = text.length > 600; // short blurbs read badly split across two columns
  const clampable = text.length > 280; // roughly five lines on a phone

  return (
    <div>
      <div className={clsx('text-[15px] leading-[1.7] hyphens-auto lg:text-justify', long && 'lg:columns-2 lg:gap-10 lg:[column-rule:1px_solid_var(--color-divider)]', !expanded && clampable && 'max-lg:line-clamp-5')}>
        {paragraphs.map((p, i) => (
          <p key={i} className="m-0 mb-3.5 last:mb-0">
            {i === 0 && (
              <span className="float-left pt-1.5 pr-2 font-heading text-[64px] leading-[.8] text-accent lg:text-[74px]">{p[0]}</span>
            )}
            {i === 0 ? p.slice(1) : p}
          </p>
        ))}
      </div>
      {!expanded && clampable && (
        <button type="button" onClick={() => setExpanded(true)} className="mt-3 text-sm text-accent underline underline-offset-4 lg:hidden">
          Read more
        </button>
      )}
    </div>
  );
};

const AlsoShelved = ({ books }) => (
  <section className="flex flex-col gap-[18px] border-t border-divider pt-9 lg:page lg:gap-7 lg:pt-14 lg:pb-20">
    <h2 className="m-0 px-5 text-[32px] font-normal lg:px-0 lg:text-[44px]">Readers also <em>shelved</em></h2>
    <div className="flex gap-3.5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-6 lg:gap-7 lg:px-0">
      {books.map((b) => (
        <Link key={b._id} to={`/book/${b._id}`} className="flex w-[104px] flex-none flex-col gap-2.5 text-ink no-underline lg:w-auto">
          <BookCover book={b} />
          <span className="line-clamp-2 font-heading text-[15px] leading-[1.15] font-semibold lg:text-lg">{b.title}</span>
          <span className="font-heading text-[15px] text-muted tabular-nums lg:text-lg">₹{b.price}</span>
        </Link>
      ))}
    </div>
  </section>
);

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState('loading');
  const [reviews, setReviews] = useState(null);
  const [alsoShelved, setAlsoShelved] = useState([]);
  const [edition, setEdition] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const { addToBag } = useBag();
  const { isFavourite, toggleFavourite } = useFavourites();

  useMobileChrome({ back: true, title: book?.genre ?? '', hideTabbar: true });

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setEdition(0);
    setQty(1);
    setTab(0);
    window.scrollTo(0, 0);
    getBookById(id)
      .then((res) => {
        if (cancelled) return;
        const b = withMockFields(res.data);
        setBook(b);
        setStatus('ready');
        getBookReviews(b).then((r) => !cancelled && setReviews(r));
        getAlsoShelved(b).then((r) => !cancelled && setAlsoShelved(r.data));
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setStatus([400, 404].includes(err.response?.status) ? 'missing' : 'error');
      });
    return () => { cancelled = true; };
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="page grid gap-10 py-10 lg:grid-cols-[500px_1fr] lg:gap-[72px]">
        <div className="aspect-[4/5] animate-pulse rounded-md bg-surface" />
        <div className="flex flex-col gap-4">
          <div className="h-16 w-3/4 animate-pulse rounded bg-surface" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-surface" />
        </div>
      </div>
    );
  }

  if (status !== 'ready') {
    return (
      <div className="page flex flex-col items-start gap-4 py-20">
        <h1 className="m-0 text-[44px] font-normal">{status === 'missing' ? "That book isn't on our shelves." : "Couldn't open that book."}</h1>
        <p className="m-0 text-muted">{status === 'missing' ? 'It may have sold out or been moved.' : 'Please try again in a moment.'}</p>
        <Link to="/discover" className="btn btn-primary">Back to Discover</Link>
      </div>
    );
  }

  const { _id, title, author, genre, genreSlug, language, editions } = book;
  const selected = editions[edition];
  const lineTotal = (selected.price * qty).toLocaleString('en-IN');
  const saved = isFavourite(_id);
  const reviewTotal = reviews?.total ?? 0;
  const tabs = ['Synopsis & details', `Reviews (${reviewTotal})`, 'About the author'];

  // TODO(#14): the cart stores one copy per book, with no edition — send qty + format once it can.
  const handleAdd = () => addToBag(_id);

  const favButton = (className) => (
    <button
      type="button"
      onClick={() => toggleFavourite(_id)}
      aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
      aria-pressed={saved}
      className={clsx('btn btn-secondary btn-icon text-accent', className)}
    >
      <Heart size={18} strokeWidth={1.6} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );

  return (
    <div className="pb-[calc(84px+env(safe-area-inset-bottom))] lg:pb-0">
      <nav aria-label="Breadcrumb" className="page hidden gap-2 pt-[22px] text-[13px] text-muted lg:flex">
        <Link to="/discover" className="text-muted no-underline hover:text-accent">Discover</Link><span>/</span>
        <Link to={`/discover?genre=${genreSlug}`} className="text-muted no-underline hover:text-accent">{genre}</Link><span>/</span>
        <span className="text-ink">{title}</span>
      </nav>

      <section className="lg:page lg:grid lg:grid-cols-[minmax(0,500px)_1fr] lg:gap-[72px] lg:pt-9 lg:pb-16">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4 border-b border-divider bg-surface py-7 lg:rounded-md lg:border lg:px-20 lg:py-14">
            <BookCover book={book} titleSize={16} shadow="lg" className="w-[166px] lg:w-full" />
            <div className="flex gap-1.5 lg:hidden" aria-hidden>
              <span className="h-0.5 w-4 bg-accent" /><span className="h-0.5 w-4 bg-divider" /><span className="h-0.5 w-4 bg-divider" /><span className="h-0.5 w-4 bg-divider" />
            </div>
          </div>
          <div className="hidden grid-cols-4 gap-3 lg:grid">
            <div className="grid aspect-square place-items-center rounded-md border border-accent bg-surface">
              <BookCover book={book} shadow="none" className="w-2/5" />
            </div>
            {['Back', 'Spine', 'Look inside'].map((label) => (
              <div key={label} className="grid aspect-square place-items-center rounded-md border border-divider bg-surface text-xs text-muted italic">{label}</div>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div className="flex flex-col gap-[18px] px-5 pt-6 lg:gap-[22px] lg:px-0 lg:pt-2">
          <div className="flex gap-2">
            <span className="tag tag-accent">{genre}</span>
            <span className="tag tag-neutral">{language}</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="m-0 text-[48px] leading-[.95] font-normal tracking-[-0.025em] lg:text-[80px]">{title}</h1>
            <span className="font-heading text-xl text-muted italic lg:text-2xl">
              by{' '}
              <Link to={`/discover?q=${encodeURIComponent(author)}`} className="border-b border-accent text-ink no-underline">{author}</Link>
            </span>
          </div>
          {reviews && (
            <div className="flex items-center gap-3.5 text-sm">
              <span className="tracking-[2px] text-accent">{stars(reviews.ratingAverage)}</span>
              <span className="tabular-nums">{reviews.ratingAverage.toFixed(1)}</span>
              <span className="text-muted">
                · {reviews.ratingCount.toLocaleString('en-IN')} ratings<span className="hidden lg:inline"> · {reviewTotal} reviews</span>
              </span>
            </div>
          )}
          <div className="h-px bg-divider" />
          <div className="flex items-baseline gap-3.5">
            <span className="font-heading text-[40px] leading-none font-medium tabular-nums lg:text-5xl">₹{selected.price}</span>
            {edition === 0 && book.mrp > selected.price && (
              <>
                <span className="text-base text-muted tabular-nums line-through">₹{book.mrp}</span>
                <span className="hidden text-[13px] text-success lg:inline">You save ₹{book.mrp - selected.price}</span>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <span className="eyebrow hidden lg:inline">Edition</span>
            {/* TODO(#10): editions are mocked from the book's single price. */}
            <div role="radiogroup" aria-label="Edition" className="-mx-5 flex gap-2.5 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:px-0">
              {editions.map((e, i) => (
                <button
                  key={e.format}
                  type="button"
                  role="radio"
                  aria-checked={i === edition}
                  onClick={() => setEdition(i)}
                  className={clsx(
                    'flex min-w-[112px] flex-none flex-col gap-0.5 rounded-md border px-3.5 py-3 text-left',
                    i === edition ? 'border-accent shadow-[inset_0_0_0_1px_var(--color-accent)]' : 'border-divider'
                  )}
                >
                  <span className="font-heading text-lg font-semibold">{e.format}</span>
                  <span className="text-xs text-muted tabular-nums">
                    ₹{e.price}<span className="hidden lg:inline"> · {e.note}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="hidden items-stretch gap-3 lg:flex">
            <QtyStepper value={qty} onChange={setQty} />
            <button type="button" onClick={handleAdd} className="btn btn-primary flex-1 p-[13px] text-[17px]">
              Add to bag — ₹{lineTotal}
            </button>
            {favButton('h-auto w-[50px]')}
          </div>
          <div className="grid gap-x-6 gap-y-2.5 text-[13px] text-muted lg:grid-cols-2">
            <span className="flex items-center gap-2"><Truck size={16} strokeWidth={1.6} />Arrives {arrivalDate()}</span>
            <span className="flex items-center gap-2"><RotateCcw size={16} strokeWidth={1.6} />Free 14-day returns</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-6 lg:page lg:mt-0">
        <div role="tablist" className="flex gap-6 overflow-x-auto border-b border-divider px-5 [scrollbar-width:none] lg:gap-9 lg:px-0">
          {tabs.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={clsx(
                '-mb-px shrink-0 border-b py-3.5 font-heading text-lg font-medium whitespace-nowrap lg:text-[22px]',
                tab === i ? 'border-accent text-ink' : 'border-transparent text-muted'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="page flex flex-col gap-9 pt-6 pb-10 lg:gap-0 lg:pt-10 lg:pb-[72px]">
        {tab === 0 && (
          <>
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-[72px] lg:pb-[72px]">
              <Synopsis text={book.desc} />
              <Specs book={book} />
            </div>
            {reviews && (
              <div className="flex flex-col gap-3.5">
                <div className="flex items-baseline justify-between lg:hidden">
                  <h2 className="m-0 text-[30px] font-normal">Reviews</h2>
                  <button type="button" onClick={() => setTab(1)} className="text-sm text-accent underline underline-offset-4">All {reviewTotal}</button>
                </div>
                <div className="grid gap-3.5 lg:grid-cols-2 lg:gap-7">
                  {reviews.data.slice(0, 2).map((r) => <ReviewCard key={r._id} review={r} />)}
                </div>
              </div>
            )}
          </>
        )}
        {tab === 1 && reviews && (
          // TODO(#13): reviews are sample data.
          <div className="grid gap-3.5 lg:grid-cols-2 lg:gap-7">
            {reviews.data.map((r) => <ReviewCard key={r._id} review={r} />)}
          </div>
        )}
        {tab === 2 && (
          // TODO(#16): placeholder until author profiles exist.
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 className="m-0 text-[32px] font-normal">{author}</h2>
            <p className="m-0 leading-[1.7] text-muted">{authorBio(author)}</p>
            <Link to={`/discover?q=${encodeURIComponent(author)}`} className="text-sm text-accent">More by {author} →</Link>
          </div>
        )}
      </section>

      {alsoShelved.length > 0 && <AlsoShelved books={alsoShelved} />}

      {/* Mobile buy bar — 2c */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-2.5 border-t border-divider bg-bg px-5 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] lg:hidden">
        {favButton('size-12')}
        <QtyStepper value={qty} onChange={setQty} />
        <button type="button" onClick={handleAdd} className="btn btn-primary flex-1 text-base">Add · ₹{lineTotal}</button>
      </div>
    </div>
  );
};

export default BookDetails;
