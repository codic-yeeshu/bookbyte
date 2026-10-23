import toast from 'react-hot-toast';
import { addBookToCart } from '../api/cart';
import { useAuth } from './useAuth';

// Shared "add to bag" behaviour: auth check, API call, optimistic context update, toasts.
export const useBag = () => {
  const { user, isAuthenticated, addToUserCart } = useAuth();

  const isInBag = (bookId) => !!user?.cart?.includes(bookId);

  const addToBag = async (bookId) => {
    if (!isAuthenticated) {
      toast.error('Sign in to add books to your bag.');
      return;
    }
    if (isInBag(bookId)) {
      toast('Already in your bag.');
      return;
    }
    try {
      await addBookToCart(bookId);
      addToUserCart(bookId);
      toast.success('Added to your bag.');
    } catch (err) {
      console.error(err);
      toast.error("Couldn't add that to your bag.");
    }
  };

  return { addToBag, isInBag };
};
