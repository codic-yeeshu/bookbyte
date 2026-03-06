import api from './axios';

export const addBookToCart = async (bookId) => {
  const response = await api.put('/cart/add-book-to-cart', {}, {
    headers: { bookID: bookId }
  });
  return response.data;
};

export const removeBookFromCart = async (bookId) => {
  const response = await api.put('/cart/remove-book-from-cart', {}, {
    headers: { bookID: bookId }
  });
  return response.data;
};

export const getUserCart = async () => {
  const response = await api.get('/cart/get-user-cart');
  return response.data;
};

// Favourite APIs integrated here as they are similar and relatively small
export const addBookToFavourite = async (bookId) => {
  const response = await api.put('/favourite/add-book-to-favourite', {}, {
    headers: { bookID: bookId }
  });
  return response.data;
};

export const removeBookFromFavourite = async (bookId) => {
  const response = await api.put('/favourite/remove-book-from-favourite', {}, {
    headers: { bookID: bookId }
  });
  return response.data;
};

export const getFavouriteBooks = async () => {
  const response = await api.get('/favourite/get-favourite-books');
  return response.data;
};
