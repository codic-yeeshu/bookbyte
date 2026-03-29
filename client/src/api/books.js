import api from './axios';

// Admin specific APIs
export const addBook = async (bookData) => {
  const response = await api.post('/book/add-book', bookData);
  return response.data;
};

export const updateBook = async (bookId, bookData) => {
  const response = await api.put('/book/update-book', bookData, {
    headers: { bookID: bookId }
  });
  return response.data;
};

export const deleteBook = async (bookId) => {
  const response = await api.delete('/book/delete-book', {
    headers: { bookID: bookId }
  });
  return response.data;
};

// Common APIs
export const getAllBooks = async () => {
  const response = await api.get('/book/get-all-books');
  return response.data;
};

export const getRecentBooks = async () => {
  const response = await api.get('/book/get-recent-books');
  return response.data;
};

export const getRandomBooks = async () => {
  const response = await api.get('/book/get-random-books');
  return response.data;
};

export const getBookById = async (bookId) => {
  const response = await api.get(`/book/get-book-by-id/${bookId}`);
  return response.data;
};
