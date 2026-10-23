import { LANDING_CURATION } from '../mocks/curation';
import { NEW_AND_NOTABLE } from '../mocks/newNotable';

// TODO(#12): replace with api.get('/curation/landing') once the endpoint exists.
export const getLandingCuration = async () => {
  return { status: 'Success', data: LANDING_CURATION };
};

// TODO(#12, #21): replace with the curation, bestseller and coming-soon endpoints.
export const getNewAndNotable = async () => {
  return { status: 'Success', data: NEW_AND_NOTABLE };
};
