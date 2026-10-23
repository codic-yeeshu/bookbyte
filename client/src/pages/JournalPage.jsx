import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { getJournal } from '../api/journal';

// Mockups 1k (desktop) and 2j (mobile).

const KINDS = [
  { value: 'all', label: 'All' },
  { value: 'essay', label: 'Essays', single: 'Essay' },
  { value: 'interview', label: 'Interviews', single: 'Interview' },
  { value: 'reading-list', label: 'Reading lists', single: 'Reading list' },
  { value: 'shop-notes', label: 'Shop notes', single: 'Shop notes' },
];

const kindLabel = (kind) => KINDS.find((k) => k.value === kind)?.single ?? kind;
const shortDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
const longDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// TODO(#23): article pages aren't designed yet.
const openPost = () => toast('Articles open soon — the Journal is still being typeset.');

// Striped "plate" placeholder from the mockups, used until posts have images (#23).
const Plate = ({ label, className, framed = true }) => (
  <div
    className={clsx(
      'grid place-items-center bg-[repeating-linear-gradient(135deg,var(--color-surface)_0_14px,var(--bb-raised)_14px_28px)] text-xs text-muted italic',
      framed && 'border-[6px] border-surface outline outline-divider',
      className
    )}
  >
    {label}
  </div>
);

const JournalPage = () => {
  const [kind, setKind] = useState('all');
  const [data, setData] = useState(null);

  useEffect(() => {
    getJournal().then(setData);
  }, []);

  const posts = data ? data.data.filter((p) => kind === 'all' || p.kind === kind) : [];
  const showFeatured = data?.featured && (kind === 'all' || data.featured.kind === kind);
  const f = data?.featured;

  return (
    <div className="pb-7 lg:pb-20">
      <header className="flex flex-col items-center gap-1.5 pt-7 text-center lg:gap-3 lg:border-b lg:border-divider lg:pt-16 lg:pb-7">
        <span className="eyebrow tracking-[.16em]">
          Essays · Interviews · <span className="lg:hidden">Lists</span><span className="hidden lg:inline">Reading lists</span>
        </span>
        <h1 className="m-0 text-[60px] leading-[.95] font-normal tracking-[-0.03em] lg:text-[96px]">
          The <em className="text-accent">Journal</em>
        </h1>
        <nav
          aria-label="Journal sections"
          className="mt-4 flex w-full gap-[22px] overflow-x-auto border-b border-divider px-5 text-sm [scrollbar-width:none] lg:mt-3.5 lg:w-auto lg:justify-center lg:gap-7 lg:border-0 lg:px-0"
        >
          {KINDS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={kind === value}
              onClick={() => setKind(value)}
              className={clsx(
                '-mb-px flex-none border-b pb-2.5 lg:mb-0 lg:pb-[3px]',
                kind === value ? 'border-accent text-accent' : 'border-transparent text-ink hover:text-accent'
              )}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {!data ? (
        <div className="page pt-6"><div className="h-72 animate-pulse rounded bg-surface" /></div>
      ) : (
        <>
          {showFeatured && (
            <section className="page flex flex-col gap-3 pt-6 lg:grid lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-14 lg:py-14">
              <button type="button" onClick={openPost} aria-label={f.titleParts.join('')} className="block">
                <Plate label="Feature photograph" className="aspect-[4/3]" />
              </button>
              <div className="flex flex-col gap-3 lg:gap-[18px]">
                <span className="text-[11px] tracking-[.14em] text-accent-ink uppercase lg:tracking-[.16em]">
                  {kindLabel(f.kind)} · {f.readMinutes} min read
                </span>
                <h2 className="m-0 text-[32px] leading-[1.04] font-normal text-balance lg:text-[52px] lg:leading-[1.02] lg:tracking-[-0.015em]">
                  <button type="button" onClick={openPost} className="text-left">
                    {f.titleParts[0]}<em>{f.titleParts[1]}</em>{f.titleParts[2]}
                  </button>
                </h2>
                <p className="m-0 hidden text-justify text-[15px] leading-[1.65] text-muted hyphens-auto lg:block">{f.dek}</p>
                <div className="flex items-center justify-between lg:border-t lg:border-divider lg:pt-3.5">
                  <span className="text-xs text-muted italic lg:text-[13px]">By {f.author} · {longDate(f.publishedAt)}</span>
                  <button type="button" onClick={openPost} className="hidden text-sm text-accent underline underline-offset-4 lg:inline">Read the essay →</button>
                </div>
              </div>
            </section>
          )}

          <section className="page pt-5 lg:border-t lg:border-divider lg:pt-12">
            {posts.length === 0 && <p className="m-0 py-6 text-muted italic">Nothing in this section yet.</p>}
            <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
              {posts.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={openPost}
                  className="grid grid-cols-[1fr_92px] gap-3.5 border-t border-divider py-4 text-left text-ink lg:flex lg:flex-col lg:gap-3 lg:border-t-0 lg:py-0"
                >
                  <Plate label={<span className="hidden lg:inline">Image</span>} className="order-2 aspect-square rounded-[2px] border border-divider outline-0 lg:order-none lg:aspect-[3/2] lg:rounded-none lg:border-[6px] lg:border-surface lg:outline-1" />
                  <span className="flex flex-col gap-1 lg:contents">
                    <span className="text-[10px] tracking-[.14em] text-accent-ink uppercase lg:text-[11px]">{kindLabel(p.kind)} · {p.readMinutes} min</span>
                    <span className="font-heading text-xl leading-[1.1] font-medium text-balance lg:text-[27px] lg:leading-[1.08]">{p.title}</span>
                    <span className="hidden text-sm leading-[1.55] text-muted lg:block">{p.dek}</span>
                    <span className="text-xs text-muted italic">{p.author}<span className="hidden lg:inline"> · {shortDate(p.publishedAt)}</span></span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default JournalPage;
