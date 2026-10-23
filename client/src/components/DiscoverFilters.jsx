import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export const FORMAT_OPTIONS = [
  { label: 'Any', value: '' },
  { label: 'Print', value: 'print' },
  { label: 'eBook', value: 'ebook' },
];

const RATING_OPTIONS = [4, 3];

const SectionLabel = ({ children }) => <span className="eyebrow">{children}</span>;

const PriceRange = ({ bounds, min, max, onChange }) => {
  const span = bounds.max - bounds.min || 1;
  const left = ((min - bounds.min) / span) * 100;
  const right = ((bounds.max - max) / span) * 100;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="range-dual relative h-[18px]">
        <div className="absolute inset-x-0 top-2 h-px bg-divider" />
        <div className="absolute top-2 h-px bg-accent" style={{ left: `${left}%`, right: `${right}%` }} />
        <input
          type="range"
          aria-label="Minimum price"
          min={bounds.min}
          max={bounds.max}
          step={10}
          value={min}
          onChange={(e) => onChange(Math.min(Number(e.target.value), max), max)}
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={bounds.min}
          max={bounds.max}
          step={10}
          value={max}
          onChange={(e) => onChange(min, Math.max(Number(e.target.value), min))}
        />
      </div>
      <div className="flex justify-between text-[13px] tabular-nums lg:text-[13px]">
        <span>₹{min}</span><span>₹{max}</span>
      </div>
    </div>
  );
};

/**
 * Filter controls shared by the desktop sidebar (1c) and the mobile sheet (2l).
 * `filters` = { genres: string[], format, min, max, rating }; `facets` = [{ name, slug, count }].
 */
const DiscoverFilters = ({ filters, facets, priceBounds, onChange, sheet = false }) => {
  const toggleGenre = (slug) => {
    const genres = filters.genres.includes(slug)
      ? filters.genres.filter((g) => g !== slug)
      : [...filters.genres, slug];
    onChange({ genres });
  };

  return (
    <div className={clsx('flex flex-col', sheet ? 'gap-6' : 'gap-7')}>
      <div className={clsx('flex flex-col', sheet ? '' : 'gap-2.5')}>
        <SectionLabel>Genre</SectionLabel>
        <div className={clsx('flex flex-col', sheet ? 'mt-2' : 'gap-2.5')}>
          {facets.map(({ name, slug, count }) => {
            const on = filters.genres.includes(slug);
            return (
              <label
                key={slug}
                className={clsx(
                  'flex cursor-pointer items-center gap-2.5',
                  sheet ? 'min-h-11 border-b border-divider text-[17px]' : 'text-sm'
                )}
              >
                <input type="checkbox" checked={on} onChange={() => toggleGenre(slug)} className="peer sr-only" />
                <span
                  className={clsx(
                    'grid shrink-0 place-items-center rounded-[2px] border text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-accent',
                    sheet ? 'size-5' : 'size-[15px]',
                    on ? 'border-accent' : 'border-divider'
                  )}
                >
                  {on && <Check size={sheet ? 14 : 11} strokeWidth={2} />}
                </span>
                <span className="flex-1">{name}</span>
                <span className="text-xs text-muted tabular-nums">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <SectionLabel>Format</SectionLabel>
        <div className="seg flex">
          {FORMAT_OPTIONS.map(({ label, value }) => (
            <label key={label} className={clsx('seg-opt flex-1 justify-center', sheet && 'min-h-10 text-sm')}>
              <input
                type="radio"
                name={sheet ? 'format-sheet' : 'format'}
                checked={filters.format === value}
                onChange={() => onChange({ format: value })}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <SectionLabel>Price</SectionLabel>
        <PriceRange
          bounds={priceBounds}
          min={filters.min ?? priceBounds.min}
          max={filters.max ?? priceBounds.max}
          onChange={(min, max) => onChange({ min, max })}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <SectionLabel>Rating</SectionLabel>
        {RATING_OPTIONS.map((stars) => (
          <label key={stars} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name={sheet ? 'rating-sheet' : 'rating'}
              checked={filters.rating === stars}
              onChange={() => onChange({ rating: stars })}
              className="peer sr-only"
            />
            <span className="size-4 shrink-0 rounded-full border-[1.5px] border-divider peer-checked:border-accent peer-checked:bg-accent peer-checked:shadow-[inset_0_0_0_3px_var(--color-bg)] peer-focus-visible:outline-2 peer-focus-visible:outline-accent" />
            <span className="text-accent">{'★'.repeat(stars)}</span> &amp; up
          </label>
        ))}
      </div>
    </div>
  );
};

export default DiscoverFilters;
