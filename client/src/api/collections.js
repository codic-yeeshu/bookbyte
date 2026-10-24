import { COLLECTIONS } from '../mocks/collections';

// TODO(#22): replace with api.get('/collections') once the endpoint exists.
export const getCollections = async () => {
  return { status: 'Success', ...COLLECTIONS };
};
