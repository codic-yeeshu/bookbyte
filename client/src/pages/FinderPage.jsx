import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { getAllBooks } from '../api/books';
import { FINDER_LENGTHS, findBooks } from '../api/recommendations';
import { withMockFields } from '../mocks/bookExtras';
import { GENRES } from '../mocks/genres';
import { useMobileChrome } from '../context/MobileChromeContext';
import BookCover from '../components/BookCover';

// Mockups 1h (desktop) and 2g (mobile), opened from "Not sure what to pick?" on the landing page.

const FORMATS = [
  { label: 'Print', value: 'print' },
  { label: 'eBook', value: 'ebook' },
  { label: 'Either', value: 'either' },
];

const EMPTY = { genres: [], authors: [], format: '', length: '' };
const AUTHOR_COUNT = 8;
const PREVIEW = { desktop: 5, mobile: 3 };

const Chip = ({ on, onClick, italic, className, children }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    className={clsx(
      'rounded-full border px-4 py-2 text-sm',
      on ? 'border-accent bg-accent/12 text-accent-ink' : 'border-divider text-ink hover:border-ink/45',
      italic && 'italic',
      className
    )}
  >
    {children}
  </button>
);

const Question = ({ n, title, mobileTitle, hint, children }) => (
  <div className="flex flex-col gap-3.5 border-b border-divider py-6 lg:grid lg:grid-cols-[64px_1fr] lg:gap-0 lg:py-8">
    <span className="hidden font-heading text-[30px] text-accent italic lg:inline">{n}</span>
    <div className="flex flex-col gap-3.5 lg:gap-4">
      <div>
        <span className="font-heading text-[26px] leading-tight font-medium lg:text-[30px]">
          <em className="mr-1.5 font-normal text-accent lg:hidden">{n}</em>
          <span className="lg:hidden">{mobileTitle ?? title}</span>
          <span className="hidden lg:inline">{title}</span>
        </span>
        {hint && <div className="hidden text-[13px] text-muted lg:block">{hint}</div>}
      </div>
      {children}
    </div>
  </div>
);

const MatchRow = ({ book }) => (
  <Link to={`/book/${book._id}`} className="grid grid-cols-[40px_1fr_auto] items-center gap-3.5 border-b border-divider py-3 text-ink no-underline lg:grid-cols-[52px_1fr_auto]">
    <BookCover book={book} shadow="none" className="shadow-sm" />
    <div className="flex min-w-0 flex-col gap-px">
      <span className="truncate font-heading text-[17px] leading-[1.1] font-semibold lg:text-[19px]">{book.title}</span>
      <span className="hidden truncate text-xs text-muted italic lg:block">{book.author}</span>
      {book.reasons.length > 0 && <span className="truncate text-[11px] text-accent-ink">Matches: {book.reasons.join(' · ')}</span>}
    </div>
    <span className="font-heading text-[17px] tabular-nums lg:text-[19px]">₹{book.price}</span>
  </Link>
);

const FinderPage = () => {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('loading');
  const [answers, setAnswers] = useState(EMPTY);
  const [showAll, setShowAll] = useState(false);

  useMobileChrome({ back: true, title: 'Book finder', hideTabbar: true });

  useEffect(() => {
    getAllBooks()
      .then((res) => {
        setBooks((res.data || []).map(withMockFields));
        setStatus('ready');
      })
      .catch((err) => { console.error(err); setStatus('error'); });
  }, []);

  const authors = useMemo(() => {
    const counts = {};
    books.forEach((b) => { counts[b.author] = (counts[b.author] || 0) + 1; });
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, AUTHOR_COUNT);
  }, [books]);

  const matches = useMemo(() => findBooks(books, answers), [books, answers]);

  const toggleIn = (key, value) => setAnswers((a) => ({
    ...a,
    [key]: a[key].includes(value) ? a[key].filter((v) => v !== value) : [...a[key], value],
  }));
  const pick = (key, value) => setAnswers((a) => ({ ...a, [key]: a[key] === value ? '' : value }));
  const reset = () => { setAnswers(EMPTY); setShowAll(false); };

  const answered = [answers.genres.length > 0, answers.authors.length > 0, !!answers.format, !!answers.length];
  const answeredCount = answered.filter(Boolean).length;

  const progress = (className) => (
    <div className={clsx('flex gap-1', className)} aria-hidden>
      {answered.map((on, i) => <span key={i} className={clsx('h-0.5 flex-1 lg:w-10 lg:flex-none', on ? 'bg-accent' : 'bg-divider')} />)}
    </div>
  );

  const matchList = (limit) => {
    if (status === 'loading') return <div className="mt-3 h-40 animate-pulse rounded bg-surface" />;
    if (status === 'error') return <p className="m-0 mt-3 text-sm text-muted italic">Couldn't load the shelves right now.</p>;
    if (!matches.length) return <p className="m-0 mt-3 text-sm text-muted italic">No exact matches yet — try loosening a choice.</p>;
    return (showAll ? matches : matches.slice(0, limit)).map((b) => <MatchRow key={b._id} book={b} />);
  };

  return (
    <div className="pb-[calc(84px+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="page flex flex-col gap-4 border-b border-divider pt-7 pb-6 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8 lg:pt-16 lg:pb-9">
        <div className="flex flex-col gap-2.5">
          <span className="eyebrow hidden tracking-[.16em] lg:inline">Book finder</span>
          <h1 className="m-0 text-[46px] leading-none font-normal tracking-[-0.025em] lg:text-[76px]">
            Let's find your next <em className="text-accent">book.</em>
          </h1>
          <span className="hidden text-[15px] text-muted italic lg:inline">Matches update as you answer.</span>
        </div>
        <div className="flex items-center gap-3 lg:flex-col lg:items-end lg:gap-2">
          {progress('flex-1 lg:order-2 lg:flex-none')}
          <span className="text-xs text-muted tabular-nums lg:text-[13px]">
            {answeredCount} of 4<span className="hidden lg:inline"> answered</span>
          </span>
        </div>
      </div>

      <div className="page lg:grid lg:grid-cols-[1fr_400px] lg:items-start lg:gap-16 lg:pt-4 lg:pb-20">
        <div className="flex flex-col">
          <Question n="i." title="What are you in the mood for?" hint="Pick any genres">
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Chip key={g.slug} on={answers.genres.includes(g.slug)} onClick={() => toggleIn('genres', g.slug)}>{g.name}</Chip>
              ))}
            </div>
          </Question>
          <Question n="ii." title="Any authors you already love?" mobileTitle="Authors you already love?" hint="We'll find them — and writers like them">
            <div className="flex flex-wrap gap-2">
              {authors.map((a) => (
                <Chip key={a} italic on={answers.authors.includes(a)} onClick={() => toggleIn('authors', a)}>{a}</Chip>
              ))}
            </div>
          </Question>
          <Question n="iii." title="How do you like to read?">
            <div className="grid grid-cols-3 gap-2 lg:flex">
              {FORMATS.map((f) => (
                <Chip key={f.value} on={answers.format === f.value} onClick={() => pick('format', f.value)} className="lg:px-[18px]">{f.label}</Chip>
              ))}
            </div>
          </Question>
          <Question n="iv." title="How long a read?">
            <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-3">
              {FINDER_LENGTHS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  aria-pressed={answers.length === l.value}
                  onClick={() => pick('length', l.value)}
                  className={clsx(
                    'flex items-baseline justify-between gap-1 rounded-md border px-[18px] py-3.5 text-left lg:flex-col lg:justify-start lg:py-4',
                    answers.length === l.value ? 'border-accent shadow-[inset_0_0_0_1px_var(--color-accent)]' : 'border-divider'
                  )}
                >
                  <span className="font-heading text-xl font-semibold lg:text-[22px]">{l.label}</span>
                  <span className="text-xs text-muted">{l.note}</span>
                </button>
              ))}
            </div>
          </Question>
          <div className="hidden gap-3 pt-7 pl-16 lg:flex">
            <button type="button" onClick={() => setShowAll(true)} disabled={!matches.length || showAll} className="btn btn-primary px-[22px] py-[13px] text-base">
              Show all {matches.length} matches
            </button>
            <button type="button" onClick={reset} className="btn btn-ghost">Start over</button>
          </div>
        </div>

        <aside className="mt-6 flex flex-col gap-1.5 rounded-md border border-divider bg-raised p-5 shadow-sm lg:mt-8 lg:p-7">
          <div className="flex items-baseline justify-between border-b border-divider pb-2.5">
            <span className="font-heading text-[22px] font-medium lg:text-[28px]">
              <span className="lg:hidden">Top matches</span><span className="hidden lg:inline">Your matches</span>
            </span>
            <span className="hidden font-heading text-[28px] text-accent tabular-nums lg:inline">{matches.length}</span>
            <button type="button" onClick={reset} className="text-xs text-accent lg:hidden">Start over</button>
          </div>
          <div className="hidden flex-col lg:flex">{matchList(PREVIEW.desktop)}</div>
          <div className="flex flex-col lg:hidden">{matchList(PREVIEW.mobile)}</div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-divider bg-bg px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] lg:hidden">
        <button type="button" onClick={() => setShowAll(true)} disabled={!matches.length || showAll} className="btn btn-primary btn-block min-h-12 text-[15px]">
          Show all {matches.length} matches
        </button>
      </div>
    </div>
  );
};

export default FinderPage;
