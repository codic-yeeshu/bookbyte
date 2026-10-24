import { getAllBooks } from './books';
import { withMockFields } from '../mocks/bookExtras';

// TODO(#15): replace with api.get(`/book/${book._id}/also-shelved?limit=6`).
// Until then: other books from the same (mock) genre, then anything else.
export const getAlsoShelved = async (book, limit = 6) => {
  const { data = [] } = await getAllBooks();
  const others = data.map(withMockFields).filter((b) => b._id !== book._id);
  const sameGenre = others.filter((b) => b.genreSlug === book.genreSlug);
  const rest = others.filter((b) => b.genreSlug !== book.genreSlug);
  return { status: 'Success', data: [...sameGenre, ...rest].slice(0, limit) };
};

export const FINDER_LENGTHS = [
  { value: 'weekend', label: 'A weekend', note: 'Under 300 pages', reason: 'a weekend', test: (p) => p < 300 },
  { value: 'weeks', label: 'A few weeks', note: '300–600 pages', reason: 'a few weeks', test: (p) => p >= 300 && p <= 600 },
  { value: 'long', label: 'A long companion', note: '600+ pages', reason: 'a long read', test: (p) => p > 600 },
];

// TODO(#15): replace with api.post('/recommendations/finder', answers).
// `books` are already passed through withMockFields; answers = { genres, authors, format, length }.
export const findBooks = (books, { genres, authors, format, length }) => {
  const span = FINDER_LENGTHS.find((l) => l.value === length);
  return books
    .filter((b) => {
      const likes = (!genres.length && !authors.length) || genres.includes(b.genreSlug) || authors.includes(b.author);
      const fits = format === 'print' ? b.format !== 'eBook' : format === 'ebook' ? b.format === 'eBook' : true;
      return likes && fits && (!span || span.test(b.pages));
    })
    .map((b) => {
      const reasons = [
        genres.includes(b.genreSlug) && b.genre,
        authors.includes(b.author) && b.author,
        span?.reason,
      ].filter(Boolean);
      return { ...b, reasons, score: reasons.length };
    })
    .sort((a, b) => b.score - a.score);
};
