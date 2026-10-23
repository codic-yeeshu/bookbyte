import { JOURNAL } from '../mocks/journal';

// TODO(#23): replace with api.get('/journal', { params: { kind } }) once posts exist.
export const getJournal = async () => {
  return { status: 'Success', ...JOURNAL };
};
