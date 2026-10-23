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
