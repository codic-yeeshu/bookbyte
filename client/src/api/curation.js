import { LANDING_CURATION } from '../mocks/curation';

// TODO(#12): replace with api.get('/curation/landing') once the endpoint exists.
export const getLandingCuration = async () => {
  return { status: 'Success', data: LANDING_CURATION };
};
