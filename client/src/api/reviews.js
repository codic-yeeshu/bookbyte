import { SAMPLE_REVIEWS } from '../mocks/reviews';

// TODO(#13): replace with api.get(`/book/${book._id}/reviews`) once reviews exist.
export const getBookReviews = async (book) => {
  const ratingCount = 120 + (book.pages * 7) % 1400;
  return {
    status: 'Success',
    data: SAMPLE_REVIEWS,
    total: 12 + (book.pages % 90),
    ratingAverage: book.ratingAverage,
    ratingCount,
  };
};
