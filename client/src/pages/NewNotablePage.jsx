import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { getAllBooks } from '../api/books';
import { getNewAndNotable } from '../api/curation';
import { useBag } from '../hooks/useBag';
import BookCover from '../components/BookCover';

// Mockups 1i (desktop) and 2h (mobile).

const VIEWS = [
  { value: 'week', label: 'This week', short: 'This week' },
  { value: 'month', label: 'This month', short: 'Month' },
  { value: 'coming', label: 'Coming soon', short: 'Coming' },
];

const ARRIVALS = { week: 6, month: 12 };

const weekOf = () => {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const movement = ({ rank, previousRank }) => {
  if (previousRank === null) return 'New';
  if (previousRank === rank) return '—';
  return previousRank > rank ? `▲ ${previousRank - rank}` : `▼ ${rank - previousRank}`;
};

// TODO(#21): pre-orders.
const preorder = (title) => toast(`Pre-orders for ${title} open soon.`);

const Featured = ({ featured, onAdd }) => (
  <div className="flex gap-5 rounded-md border border-accent p-5 lg:grid lg:grid-cols-[280px_1fr] lg:items-center lg:gap-12 lg:border-0 lg:p-0">
    <BookCover book={featured.book} tone={1} titleSize={15} shadow="lg" className="w-[110px] shrink-0 lg:w-auto" />
    <div className="flex flex-col gap-2 lg:gap-[18px]">
      <span className="tag tag-accent self-start">{featured.label}</span>
      <h2 className="m-0 text-[26px] leading-none font-normal lg:text-[56px]">{featured.book.title}</h2>
      <span className="font-heading text-sm text-muted italic lg:text-[22px]">{featured.book.author} · {featured.subtitle}</span>
      <p className="m-0 hidden text-justify text-[15px] leading-[1.65] text-muted hyphens-auto lg:block">{featured.blurb}</p>
      <div className="mt-1 flex items-center gap-3">
        <button type="button" onClick={onAdd} className="btn btn-primary btn-block lg:w-auto">
          <span className="lg:hidden">Add</span><span className="hidden lg:inline">Add to bag</span> · ₹{featured.book.price}
        </button>
        {/* TODO(#12): extracts. */}
        <button type="button" onClick={() => toast('Extracts are coming soon.')} className="btn btn-ghost hidden lg:inline-flex">Read an extract</button>
      </div>
    </div>
  </div>
);

const Bestsellers = ({ list }) => (
  <div className="flex flex-col">
    <span className="border-b border-ink pb-2.5 font-heading text-[30px] font-normal lg:text-[26px] lg:font-medium">The bestseller list</span>
    {list.map((b) => (
      <Link
        key={b.rank}
        to={`/discover?q=${encodeURIComponent(b.title)}`}
        className="grid grid-cols-[46px_1fr_auto] items-baseline gap-3 border-b border-divider py-3 text-ink no-underline hover:text-accent lg:grid-cols-[40px_1fr_auto]"
      >
        <span className="font-heading text-[28px] leading-none text-accent tabular-nums">{b.rank}</span>
        <span className="flex flex-col">
          <span className="font-heading text-[19px] leading-[1.15] font-semibold">{b.title}</span>
          <span className="text-xs text-muted italic">{b.author}</span>
        </span>
        <span className="text-xs text-muted">{movement(b)}</span>
      </Link>
    ))}
  </div>
);

const ComingSoon = ({ list }) => (
  <section className="flex flex-col gap-4">
    <h2 className="m-0 text-[32px] font-normal lg:text-[44px]">Coming <em>soon</em></h2>
    <table className="hidden w-full border-collapse text-sm lg:table">
      <thead>
        <tr className="border-b border-divider text-left text-[11px] tracking-[.08em] text-ink/60 uppercase">
          {['Release', 'Title', 'Author', 'Format', ''].map((h) => <th key={h} className="p-2.5 font-normal">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {list.map((c) => (
          <tr key={c.title} className="border-b border-divider hover:bg-ink/[.04]">
            <td className="w-[140px] p-2.5 tabular-nums">{formatDate(c.releaseDate)}</td>
            <td className="p-2.5 font-heading text-[19px] font-semibold">{c.title}</td>
            <td className="p-2.5 text-muted italic">{c.author}</td>
            <td className="p-2.5">{c.format}</td>
            <td className="p-2.5 text-right">
              <button type="button" onClick={() => preorder(c.title)} className="btn btn-secondary px-3 py-[5px] text-[13px]">Pre-order · ₹{c.price}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="flex flex-col lg:hidden">
      {list.map((c) => (
        <div key={c.title} className="flex items-center justify-between gap-3 border-b border-divider py-3.5">
          <div className="flex flex-col">
            <span className="text-xs text-accent-ink tabular-nums">{formatDate(c.releaseDate)}</span>
            <span className="font-heading text-xl font-semibold">{c.title}</span>
            <span className="text-xs text-muted italic">{c.author}</span>
          </div>
          <button type="button" onClick={() => preorder(c.title)} className="btn btn-secondary min-h-10 text-[13px]">Pre-order</button>
        </div>
      ))}
    </div>
  </section>
);

const NewNotablePage = () => {
  const { addCuratedToBag } = useBag();
  const [view, setView] = useState('week');
  const [data, setData] = useState(null);
  const [books, setBooks] = useState([]);
  const [booksStatus, setBooksStatus] = useState('loading');

  useEffect(() => {
    getNewAndNotable().then((res) => setData(res.data));
    // TODO(#10): ask for ?sort=new&limit=12 once the list is paginated.
    getAllBooks()
      .then((res) => { setBooks(res.data || []); setBooksStatus('ready'); })
      .catch((err) => { console.error(err); setBooksStatus('error'); });
  }, []);

  const arrivals = books.slice(0, ARRIVALS[view] ?? 0);

  return (
    <div className="pb-11 lg:pb-0">
      <div className="page flex flex-col gap-4 pt-7 lg:flex-row lg:items-end lg:justify-between lg:border-b lg:border-divider lg:pt-16 lg:pb-8">
        <div className="flex flex-col gap-2.5">
          <span className="eyebrow tracking-[.16em]">Week of {weekOf()}</span>
          <h1 className="m-0 text-[50px] leading-none font-normal tracking-[-0.025em] lg:text-[76px]">
            New &amp; <em className="text-accent">Notable</em>
          </h1>
        </div>
        <div className="seg flex lg:inline-flex">
          {VIEWS.map(({ value, label, short }) => (
            <label key={value} className="seg-opt min-h-10 flex-1 justify-center whitespace-nowrap lg:min-h-0">
              <input type="radio" name="new-notable-view" checked={view === value} onChange={() => setView(value)} />
              <span className="lg:hidden">{short}</span><span className="hidden lg:inline">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="page flex flex-col gap-11 pt-5 lg:gap-16 lg:pt-14 lg:pb-20">
        {data && view !== 'coming' && (
          <div className="flex flex-col gap-11 lg:grid lg:grid-cols-[1fr_1px_380px] lg:gap-14">
            <Featured featured={data.featured} onAdd={() => addCuratedToBag(data.featured.book, books)} />
            <div className="hidden bg-divider lg:block" />
            <Bestsellers list={data.bestsellers} />
          </div>
        )}

        {view !== 'coming' && (
          <section className="flex flex-col gap-4 lg:gap-7">
            <h2 className="m-0 text-[32px] font-normal lg:text-[44px]">Just <em>arrived</em></h2>
            {booksStatus === 'error' ? (
              <p className="m-0 text-muted italic">Couldn't load the newest books right now.</p>
            ) : (
              <div className={clsx(
                '-mx-5 flex gap-3.5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-7 lg:overflow-visible lg:px-0',
                view === 'month' && 'lg:gap-y-10'
              )}>
                {booksStatus === 'loading'
                  ? Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-[2/3] w-28 flex-none animate-pulse rounded bg-surface lg:w-auto" />)
                  : arrivals.map((b) => (
                      <Link key={b._id} to={`/book/${b._id}`} className="flex w-28 flex-none flex-col gap-2.5 text-ink no-underline lg:w-auto">
                        <BookCover book={b} />
                        <span className="line-clamp-2 font-heading text-base leading-[1.15] font-semibold lg:text-lg">{b.title}</span>
                        <span className="font-heading text-base text-muted tabular-nums lg:text-lg">₹{b.price}</span>
                      </Link>
                    ))}
              </div>
            )}
          </section>
        )}

        {data && view !== 'month' && <ComingSoon list={data.comingSoon} />}
      </div>
    </div>
  );
};

export default NewNotablePage;
