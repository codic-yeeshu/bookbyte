import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { addBookToCart } from '../api/cart';
import { useAuth } from './useAuth';

// Shared "add to bag" behaviour: auth check, API call, optimistic context update, toasts.
export const useBag = () => {
  const { user, isAuthenticated, addToUserCart } = useAuth();
  const navigate = useNavigate();

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

  // TODO(#12): curated books (mock data) have no _id yet — find the title on the
  // shelves we've loaded, otherwise search for it.
  const addCuratedToBag = (curated, shelfBooks = []) => {
    const match = shelfBooks.find((b) => b.title.toLowerCase() === curated.title.toLowerCase());
    if (match) addToBag(match._id);
    else navigate(`/discover?q=${encodeURIComponent(curated.title)}`);
  };

  return { addToBag, addCuratedToBag, isInBag };
};
