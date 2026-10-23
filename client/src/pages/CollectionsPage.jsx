import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getCollections } from '../api/collections';
import BookCover from '../components/BookCover';

// Mockups 1j (desktop) and 2i (mobile).

const NUMERALS = ['i.', 'ii.', 'iii.', 'iv.', 'v.', 'vi.', 'vii.', 'viii.', 'ix.', 'x.'];
const SPINE_TONES = ['bg-cover-1', 'bg-cover-2', 'bg-cover-3', 'bg-cover-4', 'bg-cover-5', 'bg-cover-6'];
const STACK_ROTATIONS = ['-rotate-9', '-rotate-3', 'rotate-3', 'rotate-9'];

// TODO(#22): collection pages aren't designed yet.
const openCollection = (title) => toast(`The “${title}” shelf opens soon.`);

const Spines = ({ spines, mobile }) => (
  <div
    aria-hidden
    className={
      mobile
        ? 'flex items-end justify-center gap-[3px] border-r border-divider bg-surface px-2.5 pt-3.5'
        : 'flex h-[170px] items-end justify-center gap-1.5 border-b border-divider bg-surface px-6 pt-6'
    }
  >
    {spines.map(({ tone, height }, i) => (
      <div
        key={i}
        className={`${SPINE_TONES[tone - 1]} rounded-t-[2px] shadow-[inset_-2px_0_0_rgba(0,0,0,.18)] ${mobile ? 'w-[15px]' : 'w-[26px]'}`}
        style={{ height: mobile ? Math.min(height, 96) : height }}
      />
    ))}
  </div>
);

const CollectionsPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getCollections().then(setData);
  }, []);

  return (
    <div className="page pb-7 lg:pb-20">
      <div className="flex flex-col gap-2.5 pt-7 pb-5 lg:grid lg:grid-cols-2 lg:items-end lg:gap-14 lg:pt-16 lg:pb-10">
        <div className="flex flex-col gap-2.5">
          <span className="eyebrow tracking-[.16em]">Curated shelves</span>
          <h1 className="m-0 text-[50px] leading-none font-normal tracking-[-0.025em] lg:text-[76px]">Collections</h1>
        </div>
        <p className="m-0 text-sm leading-[1.6] text-muted lg:text-justify lg:text-[15px] lg:leading-[1.65] lg:hyphens-auto">
          <span className="lg:hidden">Small, opinionated shelves from our staff — short enough to finish, good enough to keep.</span>
          <span className="hidden lg:inline">Small, opinionated shelves put together by our staff — for a season, a feeling, or a question you didn't know you had. Each one is short enough to finish and good enough to keep.</span>
        </p>
      </div>

      {!data ? (
        <div className="h-72 animate-pulse rounded-md bg-surface" />
      ) : (
        <>
          {/* Collection of the month */}
          <section className="flex flex-col gap-3.5 rounded-md border border-accent px-5 py-6 lg:mb-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-12">
            <div className="flex justify-center py-1.5 pl-[30px] lg:order-2 lg:py-3 lg:pl-9">
              {data.featured.covers.map((cover, i) => (
                <div key={cover.title} className={`-ml-[30px] w-[84px] lg:-ml-9 lg:w-[150px] ${STACK_ROTATIONS[i % STACK_ROTATIONS.length]}`}>
                  <BookCover book={cover} tone={cover.tone} shadow="lg" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3.5 lg:gap-4">
              <span className="eyebrow tracking-[.16em]">Collection of the month</span>
              <h2 className="m-0 text-[38px] leading-none font-normal lg:text-[60px]">
                {data.featured.title} <em className="text-accent">{data.featured.titleEmphasis}</em>
              </h2>
              <p className="m-0 hidden text-justify text-[15px] leading-[1.65] text-muted lg:block">{data.featured.blurb}</p>
              <span className="text-[13px] text-muted italic lg:hidden">{data.featured.count} books · curated by {data.featured.curator}</span>
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => openCollection(`${data.featured.title} ${data.featured.titleEmphasis}`)}
                  className="btn btn-primary btn-block min-h-11 lg:w-auto lg:min-h-0"
                >
                  Open the collection
                </button>
                <span className="hidden text-[13px] text-muted italic lg:inline">{data.featured.count} books · curated by {data.featured.curator}</span>
              </div>
            </div>
          </section>

          {/* Grid */}
          <div className="flex flex-col gap-4 pt-6 lg:grid lg:grid-cols-3 lg:gap-7 lg:pt-0">
            {data.data.map((c, i) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => openCollection(c.title)}
                className="grid grid-cols-[108px_1fr] overflow-hidden rounded-md border border-divider text-left text-ink hover:border-accent lg:flex lg:flex-col"
              >
                <span className="contents lg:hidden"><Spines spines={c.spines} mobile /></span>
                <span className="hidden lg:contents"><Spines spines={c.spines} /></span>
                <span className="flex flex-col gap-[3px] px-4 py-3.5 lg:gap-1.5 lg:px-6 lg:py-[22px]">
                  <span className="font-heading text-[15px] text-accent italic lg:text-lg">{NUMERALS[i]}</span>
                  <span className="font-heading text-[21px] leading-[1.05] font-medium lg:text-[28px]">{c.title}</span>
                  <span className="hidden text-[13px] text-muted lg:block">{c.description}</span>
                  <span className="text-xs text-muted lg:mt-2 lg:border-t lg:border-divider lg:pt-2.5">{c.count} books · curated by {c.curator}</span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CollectionsPage;
