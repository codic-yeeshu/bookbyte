import api from './axios';

export const getUserInfo = async () => {
  const response = await api.get('/user/get-user-information');
  return response.data;
};

export const updateAddress = async (address) => {
  const response = await api.put('/user/update-address', { address });
  return response.data;
};
