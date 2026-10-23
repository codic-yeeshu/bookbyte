// TODO(#10): the Book model has no rating / genre / format / pages yet.
// Until it does, derive stable dummy values from the book id so the UI has
// something to show. Delete this file once the API returns real fields.

const hash = (value = '') => {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
};

const GENRES = ['Literary Fiction', 'Classics', 'Mystery & Crime', 'Fantasy', 'History', 'Poetry', 'Philosophy', 'Science'];
const FORMATS = ['Paperback', 'Hardcover'];

export const withMockFields = (book) => {
  if (!book) return book;
  const h = hash(book._id || book.title);
  return {
    ratingAverage: 3.8 + (h % 12) / 10,
    genre: GENRES[h % GENRES.length],
    format: FORMATS[(h >> 3) % FORMATS.length],
    pages: 180 + (h % 520),
    ...book,
  };
};
