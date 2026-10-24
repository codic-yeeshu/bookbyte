import React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Heart, Plus } from 'lucide-react';
import { useBag } from '../hooks/useBag';
import { useFavourites } from '../hooks/useFavourites';
import BookCover from './BookCover';

// Result card from mockups 1c / 2b: cover with a favourite toggle, genre, title, author, price and Add.
const BookCard = ({ book }) => {
  const { addToBag, isInBag } = useBag();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { _id, title, author, price, genre } = book;
  const saved = isFavourite(_id);
  const inBag = isInBag(_id);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Link to={`/book/${_id}`} aria-label={title}>
          <BookCover book={book} />
        </Link>
        <button
          type="button"
          onClick={() => toggleFavourite(_id)}
          aria-label={saved ? `Remove ${title} from favourites` : `Save ${title} to favourites`}
          aria-pressed={saved}
          className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-bg text-accent shadow-sm"
        >
          <Heart size={15} strokeWidth={1.6} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex flex-col gap-0.5">
        {genre && <span className="text-[11px] tracking-[.12em] text-accent-ink uppercase">{genre}</span>}
        <Link to={`/book/${_id}`} className="line-clamp-2 font-heading text-lg leading-[1.15] font-semibold text-ink no-underline lg:text-[21px]">
          {title}
        </Link>
        <span className="text-xs text-muted italic lg:text-[13px]">{author}</span>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-heading text-xl tabular-nums lg:text-[22px]">₹{price}</span>
          <button
            type="button"
            onClick={() => addToBag(_id)}
            aria-label={inBag ? `${title} is in your bag` : `Add ${title} to bag`}
            className={clsx(
              'btn btn-secondary size-9 p-0 text-[13px] lg:size-auto lg:px-3 lg:py-[5px]',
              inBag && 'border-accent text-accent'
            )}
          >
            <Plus size={14} strokeWidth={1.6} className="lg:hidden" />
            <span className="hidden lg:inline">{inBag ? 'In bag' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
