import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllBooks } from '../api/books';
import { getGenres } from '../api/genres';
import { getLandingCuration } from '../api/curation';
import { withMockFields } from '../mocks/bookExtras';
import { useAuth } from '../hooks/useAuth';
import { useBag } from '../hooks/useBag';
import BookCover from '../components/BookCover';

// Mockups 1b (desktop) and 2a (mobile).

const PERKS = [
  { n: 'i.', t: 'Two-day delivery', d: 'across 400+ cities' },
  { n: 'ii.', t: 'Hand-picked', d: 'by our reading staff' },
  { n: 'iii.', t: '14-day returns', d: 'no questions asked' },
];

const MEMBER_PERKS = [
  { n: 'i.', t: 'Your shelf', d: 'Save favourites and pick up where you left off, on any device.' },
  { n: 'ii.', t: 'Order tracking', d: 'Every parcel, from our packing table to your door.' },
  { n: 'iii.', t: 'First look', d: 'New arrivals a day before everyone else.' },
];

const SHELF_SIZE = 6;

const Hero = ({ curation }) => {
  const list = curation?.list;
  const pick = curation?.editorsPick;

  return (
    <section className="page grid items-center gap-7 pt-9 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-20 lg:pb-[72px]">
      <div className="flex flex-col gap-[18px] lg:gap-[26px]">
        <span className="eyebrow tracking-[.16em]">{list ? `${list.title} · No. ${list.number}` : ' '}</span>
        <h1 className="m-0 text-[56px] leading-[.92] font-normal tracking-[-0.03em] lg:text-[clamp(64px,8.1vw,104px)]">
          Books worth <em className="text-accent">staying up</em> for.
        </h1>
        <p className="m-0 max-w-[470px] text-[15px] leading-[1.6] text-muted lg:text-justify lg:text-base lg:leading-[1.65] lg:hyphens-auto">
          <span className="lg:hidden">A small, carefully kept bookshop on the internet — chosen by people who actually read, delivered in two days.</span>
          <span className="hidden lg:inline">A small, carefully kept bookshop on the internet. Thousands of titles, chosen and annotated by people who actually read them — delivered to your door in two days.</span>
        </p>
        <div className="flex items-center gap-3">
          <Link to="/discover" className="btn btn-primary btn-block px-[22px] py-3.5 text-base lg:w-auto lg:py-[13px]">
            Browse the shelves <ArrowRight size={16} strokeWidth={1.6} className="hidden lg:block" />
          </Link>
          <Link to="/new" className="btn btn-ghost hidden px-2.5 py-[13px] text-base lg:inline-flex">This week's picks</Link>
        </div>
      </div>

      {pick && (
        <div className="relative h-[290px] lg:h-[500px]">
          <div className="absolute inset-[10px_30px_0] rounded-[50%_50%_0_0/30%_30%_0_0] border border-divider lg:inset-[30px_40px_0_60px]" />
          <div className="absolute top-[70px] left-1 w-[118px] -rotate-8 lg:top-[90px] lg:left-10 lg:w-[190px]">
            <BookCover book={pick.flanking[0]} tone={2} shadow="lg" />
          </div>
          <div className="absolute top-20 right-1 w-[118px] rotate-7 lg:top-[110px] lg:right-[30px] lg:w-[190px]">
            <BookCover book={pick.flanking[1]} tone={3} shadow="lg" />
          </div>
          <div className="absolute top-5 left-1/2 -ml-[75px] w-[150px] lg:top-10 lg:-ml-[120px] lg:w-[240px]">
            <BookCover book={pick.featured} tone={1} titleSize={15} shadow="lg" />
          </div>
          <p className="absolute inset-x-0 bottom-0 m-0 text-center text-xs text-muted italic lg:text-[13px]">
            Editor's pick — <span className="text-ink">{pick.featured.title}<span className="hidden lg:inline">, {pick.featured.author}</span></span>
          </p>
        </div>
      )}
    </section>
  );
};

const Perks = () => (
  <>
    <div className="mx-5 mt-7 border-t border-divider lg:hidden">
      {PERKS.map(({ n, t, d }) => (
        <div key={n} className="flex items-baseline gap-3.5 border-b border-divider py-3.5 text-sm">
          <span className="w-7 font-heading text-[19px] text-accent italic">{n}</span>
          <span><strong className="font-semibold">{t}</strong> <span className="text-muted">{d}</span></span>
        </div>
      ))}
    </div>
    <div className="hidden border-y border-divider lg:block">
      <div className="mx-auto grid max-w-[1280px] grid-cols-3">
        {PERKS.map(({ n, t, d }) => (
          <div key={n} className="flex items-baseline gap-3.5 border-r border-divider px-14 py-[22px] last:border-r-0">
            <span className="font-heading text-[22px] text-accent italic">{n}</span>
            <span className="text-sm"><strong className="font-semibold">{t}</strong> <span className="text-muted">{d}</span></span>
          </div>
        ))}
      </div>
    </div>
  </>
);

const Shelf = ({ books, loading, error }) => (
  <section className="flex flex-col gap-[18px] pt-11 pb-2 lg:page lg:gap-8 lg:py-[72px]">
    <div className="flex items-end justify-between px-5 lg:px-0">
      <div>
        <span className="eyebrow hidden tracking-[.16em] lg:inline">Fresh off the cart</span>
        <h2 className="m-0 text-[34px] leading-none font-normal lg:mt-1.5 lg:text-[52px]">This week's shelf</h2>
      </div>
      <Link to="/new" className="border-b border-current pb-0.5 text-[13px] no-underline lg:text-sm">
        <span className="lg:hidden">All</span><span className="hidden lg:inline">View all new arrivals</span>
      </Link>
    </div>

    {error ? (
      <p className="m-0 px-5 text-muted italic lg:px-0">Couldn't load the shelf right now.</p>
    ) : (
      <div className="flex gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-6 lg:gap-7 lg:overflow-visible lg:px-0 lg:pb-0">
        {loading
          ? Array.from({ length: SHELF_SIZE }, (_, i) => (
              <div key={i} className="aspect-[2/3] w-[132px] flex-none animate-pulse rounded-[2px_4px_4px_2px] bg-surface lg:w-auto" />
            ))
          : books.map((book) => (
              <Link key={book._id} to={`/book/${book._id}`} className="flex w-[132px] flex-none flex-col gap-2 text-ink no-underline lg:w-auto lg:gap-3">
                <BookCover book={book} />
                <div className="flex flex-col gap-0.5">
                  <span className="line-clamp-2 font-heading text-[17px] leading-[1.15] font-semibold lg:text-[19px]">{book.title}</span>
                  <span className="text-xs text-muted italic lg:text-[13px]">{book.author}</span>
                  <div className="mt-1 flex items-baseline justify-between lg:mt-1.5">
                    <span className="font-heading text-lg tabular-nums lg:text-xl">₹{book.price}</span>
                    <span className="hidden text-xs text-accent lg:inline">★ {book.ratingAverage.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    )}
  </section>
);

const Genres = ({ genres }) => (
  <section className="order-5 flex flex-col gap-2.5 px-5 pt-10 lg:page lg:order-4 lg:grid lg:grid-cols-[320px_1fr] lg:gap-[72px] lg:pt-0 lg:pb-20">
    <div className="flex flex-col gap-3.5 lg:border-t lg:border-ink lg:pt-7">
      <span className="eyebrow hidden tracking-[.16em] lg:inline">Contents</span>
      <h2 className="m-0 mb-1.5 text-[34px] leading-none font-normal lg:mb-0 lg:text-[52px]">Browse by <em>genre</em></h2>
      <p className="m-0 hidden text-justify text-sm text-muted lg:block">Our shelves, laid out like the front of a good book. Pick a chapter and wander.</p>
    </div>
    <div className="grid border-t border-ink lg:grid-cols-2 lg:gap-x-12">
      {genres.map((genre, i) => (
        <Link
          key={genre.slug}
          to={`/discover?genre=${genre.slug}`}
          className="grid grid-cols-[34px_1fr_auto] items-baseline border-b border-divider py-3.5 text-ink no-underline hover:text-accent lg:grid-cols-[44px_1fr_auto] lg:py-[18px]"
        >
          <span className="font-heading text-sm text-accent tabular-nums lg:text-base">{String(i + 1).padStart(2, '0')}</span>
          <span className="font-heading text-[22px] font-medium lg:text-[26px]">{genre.name}</span>
          <span className="text-xs text-muted tabular-nums">
            {genre.count.toLocaleString('en-IN')}<span className="hidden lg:inline"> titles</span>
          </span>
        </Link>
      ))}
    </div>
  </section>
);

const StaffPick = ({ pick, books }) => {
  const { addCuratedToBag } = useBag();
  const { book, staff, quote, shortQuote } = pick;
  const handleAdd = () => addCuratedToBag(book, books);

  return (
    <section className="order-6 mx-5 mt-10 flex flex-col gap-4 rounded-md border border-accent px-[22px] py-7 lg:order-5 lg:mx-auto lg:mt-0 lg:mb-20 lg:grid lg:w-[calc(100%-112px)] lg:max-w-[1168px] lg:grid-cols-[220px_1fr] lg:items-center lg:gap-16 lg:p-14">
      <BookCover book={book} tone={5} shadow="lg" className="hidden lg:block" />
      <div className="flex flex-col gap-4 lg:gap-[22px]">
        <span className="eyebrow tracking-[.16em]">
          Staff pick · {staff.name}<span className="hidden lg:inline">, {staff.desk}</span>
        </span>
        <p className="m-0 font-heading text-[27px] leading-[1.15] italic lg:text-[40px] lg:leading-[1.12] lg:tracking-[-0.01em] lg:text-pretty">
          <span className="lg:hidden">“{shortQuote}”</span>
          <span className="hidden lg:inline">“{quote}”</span>
        </p>
        <span className="text-[13px] text-muted lg:hidden">{book.title} — {book.author}</span>
        <div className="flex items-center gap-3">
          <Link to="/journal" className="btn btn-primary hidden lg:inline-flex">Read {staff.name}'s notes</Link>
          <button type="button" onClick={handleAdd} className="btn btn-secondary btn-block lg:w-auto">
            Add to bag · ₹{book.price}
          </button>
        </div>
      </div>
    </section>
  );
};

const Finder = () => (
  <section className="order-4 mx-5 mt-9 flex flex-col gap-3.5 border-t border-b border-t-ink border-b-divider py-7 lg:order-6 lg:mx-auto lg:mt-0 lg:w-[calc(100%-112px)] lg:max-w-[1168px] lg:mb-[88px] lg:grid lg:grid-cols-[1fr_1px_1fr] lg:items-center lg:gap-14 lg:py-14">
    <div className="flex flex-col gap-3.5 lg:gap-4">
      <span className="eyebrow tracking-[.16em]">Book finder</span>
      <h2 className="m-0 text-[40px] leading-[.98] font-normal lg:text-[64px] lg:tracking-[-0.02em]">
        Not sure what to pick? <em className="text-accent">Let us help.</em>
      </h2>
    </div>
    <div className="hidden self-stretch bg-divider lg:block" />
    <div className="flex flex-col gap-3.5 lg:gap-5">
      <p className="m-0 text-sm leading-[1.6] text-muted lg:text-justify lg:text-base lg:leading-[1.65] lg:hyphens-auto">
        <span className="lg:hidden">Four quick questions about mood, authors and length — we'll pull the books that fit.</span>
        <span className="hidden lg:inline">Tell us what you're in the mood for, the authors you already love and how long you'd like to read. Four quick questions — we'll pull the books that fit from our shelves.</span>
      </p>
      <div className="flex items-center gap-4">
        <Link to="/finder" className="btn btn-primary btn-block px-[22px] py-3.5 text-base lg:w-auto lg:py-[13px]">
          Find my next book <ArrowRight size={16} strokeWidth={1.6} className="hidden lg:block" />
        </Link>
        <span className="hidden text-[13px] text-muted italic lg:inline">Takes about a minute</span>
      </div>
    </div>
  </section>
);

const Membership = () => (
  <section className="order-7 mx-5 mt-10 flex flex-col gap-3.5 border-t border-b border-t-ink border-b-divider py-7 lg:mx-auto lg:mt-0 lg:mb-[88px] lg:grid lg:w-[calc(100%-112px)] lg:max-w-[1168px] lg:grid-cols-2 lg:gap-0 lg:rounded-md lg:border lg:border-divider lg:py-0">
    <div className="flex flex-col gap-3.5 lg:gap-[18px] lg:border-r lg:border-divider lg:p-12">
      <span className="eyebrow tracking-[.16em]">Membership · free</span>
      <h2 className="m-0 text-[40px] leading-[.98] font-normal lg:text-[56px] lg:leading-none lg:tracking-[-0.02em]">
        Keep a shelf of your <em className="text-accent">own.</em>
      </h2>
      <p className="m-0 hidden text-justify text-[15px] leading-[1.65] text-muted hyphens-auto lg:block">
        Save books for later, follow every order and hear about new arrivals first. Joining takes thirty seconds and costs nothing.
      </p>
      <div className="mt-1.5 hidden items-center gap-3 lg:flex">
        <Link to="/signup" className="btn btn-primary px-[22px] py-[13px] text-base">Create a free account</Link>
        <Link to="/login" className="btn btn-ghost text-[15px]">I have one — sign in</Link>
      </div>
    </div>
    <div className="flex flex-col lg:justify-center lg:px-12 lg:py-9">
      {MEMBER_PERKS.map(({ n, t, d }) => (
        <div key={n} className="grid grid-cols-[32px_1fr] border-t border-divider py-2.5 text-sm lg:grid-cols-[44px_1fr] lg:border-t-0 lg:border-b lg:py-[18px]">
          <span className="font-heading text-lg text-accent italic lg:text-[22px]">{n}</span>
          <span className="lg:flex lg:flex-col lg:gap-0.5">
            <strong className="font-semibold lg:font-heading lg:text-2xl lg:font-medium">{t}</strong>{' '}
            <span className="text-muted">{d}</span>
          </span>
        </div>
      ))}
    </div>
    <div className="flex flex-col gap-2.5 lg:hidden">
      <Link to="/signup" className="btn btn-primary btn-block p-3.5 text-base">Create a free account</Link>
      <Link to="/login" className="btn btn-ghost btn-block min-h-11">I have one — sign in</Link>
    </div>
  </section>
);

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [genres, setGenres] = useState([]);
  const [curation, setCuration] = useState(null);

  useEffect(() => {
    // TODO(#10): ask for ?sort=new&limit=6 once the book list is paginated.
    getAllBooks()
      .then((res) => setBooks((res.data || []).map(withMockFields)))
      .catch((err) => { console.error(err); setError(true); })
      .finally(() => setLoading(false));
    getGenres().then((res) => setGenres(res.data));
    getLandingCuration().then((res) => setCuration(res.data));
  }, []);

  return (
    <div className="flex flex-col pb-11 lg:pb-0">
      <p className="order-0 m-0 border-b border-divider px-5 py-2.5 text-center text-xs text-muted italic lg:hidden">
        Free shipping on orders over ₹499
      </p>
      <div className="order-1"><Hero curation={curation} /></div>
      <div className="order-2"><Perks /></div>
      <div className="order-3"><Shelf books={books.slice(0, SHELF_SIZE)} loading={loading} error={error} /></div>
      <Genres genres={genres} />
      {curation && <StaffPick pick={curation.staffPick} books={books} />}
      <Finder />
      {!isAuthenticated && <Membership />}
    </div>
  );
};

export default HomePage;
