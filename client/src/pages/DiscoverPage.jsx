import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getAllBooks } from '../api/books';
import { withMockFields } from '../mocks/bookExtras';
import { GENRES } from '../mocks/genres';
import { DESKTOP, useMediaQuery } from '../hooks/useMediaQuery';
import BookCard from '../components/BookCard';
import DiscoverFilters from '../components/DiscoverFilters';

// Mockups 1c (desktop), 2b (mobile) and 2l (filter sheet).
// TODO(#10): search / filter / sort / paginate run in the browser over every book
// until the book list endpoint supports them; then send these params to the API instead.

const PAGE_SIZE = 12;
const MOBILE_STEP = 8;

const SUGGESTIONS = [
  { label: 'Brontë sisters', set: { q: 'Brontë' } },
  { label: 'Classics', set: { genre: 'classics' } },
  { label: 'Under ₹300', set: { max: '300' } },
  { label: 'Poetry', set: { genre: 'poetry' } },
  { label: 'eBooks', set: { format: 'ebook' } },
];

const SORTS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Newest', value: 'new' },
  { label: 'Price', value: 'price' },
];

const FILTER_KEYS = ['genre', 'format', 'min', 'max', 'rating'];

const numberParam = (value) => (value === null || value === '' ? null : Number(value));

const readParams = (params) => ({
  q: params.get('q') || '',
  genres: (params.get('genre') || '').split(',').filter(Boolean),
  format: params.get('format') || '',
  min: numberParam(params.get('min')),
  max: numberParam(params.get('max')),
  rating: numberParam(params.get('rating')),
  sort: params.get('sort') || 'relevance',
  page: Math.max(1, Number(params.get('page')) || 1),
});

const matchesFormat = (book, format) => {
  if (format === 'print') return book.format !== 'eBook';
  if (format === 'ebook') return book.format === 'eBook';
  return true;
};

const relevance = (book, q) => {
  const title = book.title.toLowerCase();
  if (title.startsWith(q)) return 3;
  if (title.includes(q)) return 2;
  return book.author.toLowerCase().includes(q) ? 1 : 0;
};

// Everything except the genre filter — so genre counts reflect the other filters.
const filterBooks = (books, f, { skipGenre = false } = {}) => {
  const q = f.q.trim().toLowerCase();
  return books.filter((b) =>
    (!q || relevance(b, q) > 0) &&
    (skipGenre || !f.genres.length || f.genres.includes(b.genreSlug)) &&
    matchesFormat(b, f.format) &&
    (f.min === null || b.price >= f.min) &&
    (f.max === null || b.price <= f.max) &&
    (f.rating === null || b.ratingAverage >= f.rating)
  );
};

const sortBooks = (books, sort, q) => {
  const list = [...books];
  if (sort === 'new') return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sort === 'price') return list.sort((a, b) => a.price - b.price);
  const query = q.trim().toLowerCase();
  return query ? list.sort((a, b) => relevance(b, query) - relevance(a, query)) : list;
};

const pageNumbers = (current, total) => {
  const pages = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['…', p] : [p]));
};

const Pagination = ({ page, totalPages, onPage }) => (
  <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 border-t border-divider pt-5 tabular-nums">
    <button type="button" className="btn btn-ghost" disabled={page === 1} onClick={() => onPage(page - 1)}>← Previous</button>
    {pageNumbers(page, totalPages).map((p, i) =>
      p === '…' ? (
        <span key={`gap-${i}`} className="text-muted">…</span>
      ) : (
        <button
          key={p}
          type="button"
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onPage(p)}
          className={clsx(
            'grid size-[34px] place-items-center rounded-md font-heading text-[17px]',
            p === page ? 'border border-accent text-accent' : 'text-ink hover:bg-surface'
          )}
        >
          {p}
        </button>
      )
    )}
    <button type="button" className="btn btn-ghost" disabled={page === totalPages} onClick={() => onPage(page + 1)}>Next →</button>
  </nav>
);

const FilterSheet = ({ count, onClose, onClear, children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      <button type="button" aria-label="Close filters" onClick={onClose} className="absolute inset-0 bg-neutral-900/50" />
      <div role="dialog" aria-modal="true" aria-label="Filters" className="relative flex max-h-[85vh] flex-col rounded-t-[22px] bg-bg text-ink">
        <span className="mx-auto mt-2.5 h-1 w-9 rounded-full bg-divider" />
        <div className="flex items-baseline justify-between border-b border-divider px-7 pt-5 pb-4">
          <span className="font-heading text-[32px] leading-none">Filters</span>
          <button type="button" onClick={onClear} className="text-sm text-accent underline underline-offset-4">Clear all</button>
        </div>
        <div className="overflow-y-auto px-7 py-6">{children}</div>
        <div className="border-t border-divider px-7 pt-6 pb-[calc(24px+env(safe-area-inset-bottom))]">
          <button type="button" onClick={onClose} className="btn btn-primary btn-block min-h-12 text-base">
            Show {count} {count === 1 ? 'book' : 'books'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DiscoverPage = () => {
  const [params, setParams] = useSearchParams();
  const filters = readParams(params);
  const isDesktop = useMediaQuery(DESKTOP);
  const resultsRef = useRef(null);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [visible, setVisible] = useState(MOBILE_STEP);

  useEffect(() => {
    getAllBooks()
      .then((res) => setBooks((res.data || []).map(withMockFields)))
      .catch((err) => { console.error(err); setError(true); })
      .finally(() => setLoading(false));
  }, []);

  const filterKey = params.toString().replace(/(^|&)page=\d+/, '');
  useEffect(() => setVisible(MOBILE_STEP), [filterKey]);

  const priceBounds = useMemo(() => {
    if (!books.length) return { min: 0, max: 1000 };
    const prices = books.map((b) => b.price);
    return { min: Math.floor(Math.min(...prices) / 10) * 10, max: Math.ceil(Math.max(...prices) / 10) * 10 };
  }, [books]);

  const results = useMemo(
    () => sortBooks(filterBooks(books, filters), filters.sort, filters.q),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [books, params]
  );

  const facets = useMemo(() => {
    const pool = filterBooks(books, filters, { skipGenre: true });
    return GENRES.map((g) => ({ ...g, count: pool.filter((b) => b.genreSlug === g.slug).length }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books, params]);

  const update = (patch, { keepPage = false } = {}) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || (Array.isArray(value) && !value.length)) next.delete(key);
      else next.set(key, Array.isArray(value) ? value.join(',') : String(value));
    });
    if (!keepPage) next.delete('page');
    setParams(next, { replace: true });
  };

  const updateFilters = (patch) => {
    const { genres, ...rest } = patch;
    update(genres ? { ...rest, genre: genres } : rest);
  };

  const clearFilters = () => update(Object.fromEntries(FILTER_KEYS.map((k) => [k, null])));

  const activeFilterCount =
    (filters.genres.length ? 1 : 0) + (filters.format ? 1 : 0) +
    (filters.min !== null || filters.max !== null ? 1 : 0) + (filters.rating !== null ? 1 : 0);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);
  const shown = isDesktop ? results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : results.slice(0, visible);

  const goToPage = (p) => {
    update({ page: p === 1 ? null : p }, { keepPage: true });
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cycleSort = () => {
    const i = SORTS.findIndex((s) => s.value === filters.sort);
    update({ sort: SORTS[(i + 1) % SORTS.length].value === 'relevance' ? null : SORTS[(i + 1) % SORTS.length].value });
  };

  const sortLabel = SORTS.find((s) => s.value === filters.sort)?.label ?? 'Relevance';

  const filterPanel = (sheet) => (
    <DiscoverFilters filters={filters} facets={facets} priceBounds={priceBounds} onChange={updateFilters} sheet={sheet} />
  );

  return (
    <div className="page pb-12 lg:pb-[72px]">
      <section className="flex flex-col gap-[18px] pt-7 pb-5 lg:gap-[22px] lg:pt-14 lg:pb-7">
        <h1 className="m-0 text-[44px] leading-none font-normal tracking-[-0.025em] lg:text-[76px]">Discover</h1>
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-2.5 border-b border-ink py-2.5 lg:gap-3.5 lg:py-4"
        >
          <Search size={22} strokeWidth={1.6} className="shrink-0 text-accent lg:size-6" />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search the shelves…"
            aria-label="Search by title or author"
            className="min-w-0 flex-1 bg-transparent font-heading text-2xl text-ink italic placeholder:text-muted focus-visible:outline-none lg:text-[32px] [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.q && (
            <button type="button" aria-label="Clear search" onClick={() => update({ q: null })} className="btn btn-icon text-muted lg:hidden">
              <X size={18} strokeWidth={1.6} />
            </button>
          )}
          <span className="hidden text-xs text-muted lg:inline">Search by title or author</span>
        </form>
        <div className="-mx-5 flex items-center gap-2 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0">
          <span className="mr-1 hidden text-[13px] text-muted lg:inline">Try:</span>
          {SUGGESTIONS.map(({ label, set }) => (
            <button
              key={label}
              type="button"
              onClick={() => update(set)}
              className="tag tag-outline shrink-0 border-divider px-3 py-2 text-[13px] text-ink hover:border-accent lg:px-2.5 lg:py-[3px] lg:text-[11px]"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Mobile toolbar — 2b */}
      <div className="flex items-center gap-4 border-b border-divider pt-1 pb-4 lg:hidden">
        <button type="button" onClick={() => setSheetOpen(true)} className="btn btn-secondary min-h-11 gap-2 text-sm">
          <SlidersHorizontal size={16} strokeWidth={1.6} />
          Filters{activeFilterCount ? ` · ${activeFilterCount}` : ''}
        </button>
        <button type="button" onClick={cycleSort} className="text-sm text-accent">Sort: {sortLabel}</button>
        <span className="ml-auto text-sm text-muted tabular-nums">{results.length}</span>
      </div>

      <div ref={resultsRef} className="scroll-mt-6 lg:grid lg:grid-cols-[232px_1fr] lg:gap-12 lg:pt-3">
        <aside className="hidden flex-col gap-7 lg:flex">
          <div className="flex items-baseline justify-between border-b border-ink pb-2.5">
            <span className="font-heading text-[22px] font-semibold">Filters</span>
            <button type="button" onClick={clearFilters} className="text-xs text-accent underline underline-offset-4">Clear all</button>
          </div>
          {filterPanel(false)}
        </aside>

        <div className="flex flex-col gap-7 pt-6 lg:pt-0">
          <div className="hidden items-center justify-between border-b border-divider pb-2.5 lg:flex">
            <span className="text-sm text-muted">
              <span className="text-ink tabular-nums">{results.length}</span> {results.length === 1 ? 'book' : 'books'}
              {filters.q && <> for <em className="text-ink">“{filters.q}”</em></>}
            </span>
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] text-muted">Sort</span>
              <div className="seg">
                {SORTS.map(({ label, value }) => (
                  <label key={value} className="seg-opt">
                    <input
                      type="radio"
                      name="sort"
                      checked={filters.sort === value}
                      onChange={() => update({ sort: value === 'relevance' ? null : value })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {error ? (
            <p className="m-0 text-muted italic">Couldn't load the shelves right now. Please try again in a moment.</p>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-x-[18px] gap-y-8 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-10">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="aspect-[2/3] animate-pulse rounded-[2px_4px_4px_2px] bg-surface" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-start gap-3 py-10">
              <p className="m-0 font-heading text-[28px] leading-tight">Nothing on the shelves matches that.</p>
              <p className="m-0 text-muted">Try a different search or loosen the filters.</p>
              <button type="button" onClick={() => update({ q: null, ...Object.fromEntries(FILTER_KEYS.map((k) => [k, null])) })} className="btn btn-primary">
                Clear search &amp; filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-[18px] gap-y-8 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-10">
                {shown.map((book) => <BookCard key={book._id} book={book} />)}
              </div>
              {isDesktop
                ? totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPage={goToPage} />
                : visible < results.length && (
                    <button type="button" onClick={() => setVisible((v) => v + MOBILE_STEP)} className="btn btn-secondary btn-block min-h-11">
                      Show more · {shown.length} of {results.length}
                    </button>
                  )}
            </>
          )}
        </div>
      </div>

      {sheetOpen && (
        <FilterSheet count={results.length} onClose={() => setSheetOpen(false)} onClear={clearFilters}>
          {filterPanel(true)}
        </FilterSheet>
      )}
    </div>
  );
};

export default DiscoverPage;
