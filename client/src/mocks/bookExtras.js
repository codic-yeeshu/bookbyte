// TODO(#10): the Book model has no rating / genre / format / pages yet.
// Until it does, derive stable dummy values from the book id so the UI has
// something to show. Delete this file once the API returns real fields.
import { GENRES } from './genres';

const hash = (value = '') => {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
};

const FORMATS = ['Paperback', 'Hardcover', 'Paperback', 'eBook'];
const PUBLISHERS = ['Bookbyte Classics', 'Penguin', 'Vintage', 'Oxford World\'s Classics'];

// Prices ending in 9, like the mockups (₹349, ₹249, ₹99).
const shelfPrice = (value) => Math.max(49, Math.round(value / 10) * 10 - 1);

export const withMockFields = (book) => {
  if (!book) return book;
  const h = hash(book._id || book.title);
  const genre = GENRES[h % GENRES.length];
  return {
    ratingAverage: 3.8 + (h % 12) / 10,
    genre: genre.name,
    genreSlug: genre.slug,
    format: FORMATS[(h >>> 3) % FORMATS.length],
    pages: 180 + (h % 520),
    mrp: Math.round((book.price * 1.29) / 10) * 10,
    editions: [
      { format: 'Hardcover', price: book.price, note: 'Cloth, ribbon' },
      { format: 'Paperback', price: shelfPrice(book.price * 0.72), note: `${180 + (h % 520)} pages` },
      { format: 'eBook', price: shelfPrice(book.price * 0.3), note: 'ePub · instant' },
    ],
    publisher: PUBLISHERS[(h >>> 5) % PUBLISHERS.length],
    publishedYear: 1840 + (h % 180),
    isbn13: `978-0-${String(h % 100).padStart(2, '0')}-${String(h % 1000000).padStart(6, '0')}-${h % 10}`,
    dimensions: '13 × 20 cm',
    ...book,
  };
};
