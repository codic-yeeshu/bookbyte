import api from './axios';

export const signUp = async (userData) => {
  const response = await api.post('/auth/sign-up', userData);
  return response.data;
};

export const signIn = async (credentials) => {
  const response = await api.post('/auth/sign-in', credentials);
  return response.data;
};

export const getUserInformation = async (headers) => {
  const response = await api.get('/user/get-user-information', { headers });
  return response.data;
};

export const updateAddress = async (address, headers) => {
  const response = await api.put('/user/update-address', { address }, { headers });
  return response.data;
};

// TODO(#24): replace with api.post('/auth/forgot-password', { email }) — there's no reset flow yet.
export const requestPasswordReset = async () => {
  throw new Error("Password resets aren't available yet. Please contact us and we'll help you back in.");
};
