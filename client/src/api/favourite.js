import api from './axios';

export const addBookToFavourite = async (bookId) => {
  const response = await api.put('/favourite/add-book-to-favourite', { bookId });
  return response.data;
};

export const removeBookFromFavourite = async (bookId) => {
  const response = await api.put('/favourite/remove-book-from-favourite', { bookId });
  return response.data;
};

export const getFavouriteBooks = async () => {
  const response = await api.get('/favourite/get-favourite-books');
  return response.data;
};
