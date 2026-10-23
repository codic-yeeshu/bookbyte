import toast from 'react-hot-toast';
import { addBookToFavourite, removeBookFromFavourite } from '../api/favourite';
import { useAuth } from './useAuth';

// Shared favourite toggle: auth check, API call, optimistic context update, toasts.
export const useFavourites = () => {
  const { user, isAuthenticated, addToUserFavourites, removeFromUserFavourites } = useAuth();

  const isFavourite = (bookId) => !!user?.favourites?.includes(bookId);

  const toggleFavourite = async (bookId) => {
    if (!isAuthenticated) {
      toast.error('Sign in to keep a shelf of favourites.');
      return;
    }
    try {
      if (isFavourite(bookId)) {
        await removeBookFromFavourite(bookId);
        removeFromUserFavourites(bookId);
        toast.success('Removed from your shelf.');
      } else {
        await addBookToFavourite(bookId);
        addToUserFavourites(bookId);
        toast.success('Saved to your shelf.');
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update your shelf.");
    }
  };

  return { isFavourite, toggleFavourite };
};
