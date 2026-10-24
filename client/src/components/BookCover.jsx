import React, { useState } from 'react';
import { clsx } from 'clsx';

const TONES = ['bg-cover-1', 'bg-cover-2', 'bg-cover-3', 'bg-cover-4', 'bg-cover-5', 'bg-cover-6'];

const toneFor = (text = '') => {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h % TONES.length;
};

// Ask Cloudinary for a resized, auto-format image instead of the original upload.
const optimizeImageUrl = (url) => {
  if (!url.includes('/upload/')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_600/');
};

/**
 * A 2:3 book cover. Shows the book's image when it has one, otherwise the
 * typographic cover from the mockups (author / italic title / rule).
 * `tone` (1–6) picks the --bb-cover-* colour; defaults to one derived from the title.
 */
const BookCover = ({ book, tone, titleSize = 14, shadow = 'md', className }) => {
  const [failed, setFailed] = useState(false);
  const { title = '', author = '', url } = book || {};
  const src = url && !failed ? optimizeImageUrl(url) : null;

  return (
    <div
      className={clsx(
        '@container relative aspect-[2/3] overflow-hidden rounded-[2px_4px_4px_2px] text-cover-ink',
        { lg: 'shadow-lg', md: 'shadow-md', none: 'shadow-none' }[shadow],
        src ? 'bg-surface' : TONES[tone ? tone - 1 : toneFor(title)],
        className
      )}
    >
      {src ? (
        <img src={src} alt={`${title} cover`} loading="lazy" onError={() => setFailed(true)} className="size-full object-cover" />
      ) : (
        <div
          role="img"
          aria-label={`${title} by ${author}`}
          className="absolute inset-[5cqw] flex flex-col items-center justify-between border border-cover-ink/35 px-[7cqw] py-[10cqw] text-center"
        >
          <span className="text-[6cqw] tracking-[.16em] uppercase opacity-80">{author}</span>
          <span className="font-heading leading-[1.02] italic hyphens-auto" style={{ fontSize: `${titleSize}cqw` }}>
            {title}
          </span>
          <span className="h-px w-[14cqw] bg-current opacity-60" />
        </div>
      )}
    </div>
  );
};

export default BookCover;
