import { GENRES } from '../mocks/genres';

// TODO(#11): replace with api.get('/genre') once the endpoint exists.
export const getGenres = async () => {
  return { status: 'Success', data: GENRES };
};
