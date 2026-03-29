import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../api/books';
import { addBookToCart, addBookToFavourite, removeBookFromFavourite } from '../api/cart';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import {
  ShoppingCart,
  Heart,
  Star,
  ArrowLeft,
  BookOpen,
  User,
  CheckCircle2,
  Calendar,
  Languages
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const BookDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated, addToUserCart, addToUserFavourites, removeFromUserFavourites } = useAuth();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isFavorite = user?.favourites?.includes(id) || false;
  const inCart = user?.cart?.includes(id) || false;

  useEffect(() => {
  window.scrollTo(0, 0);
}, [id]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookById(id);
        setBook(response.data || response);
      } catch (err) {
        console.error("Error fetching book details:", err);
        toast.error("Could not load book details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return toast.error("Please login to add items to cart.");
    if (inCart) return;
    try {
      await addBookToCart(id);
      addToUserCart(id);
      toast.success("Added to cart successfully!");
    } catch (err) {
      toast.error("Failed to add to cart.");
    }
  };

  const handleAddToFavourite = async () => {
    if (!isAuthenticated) return toast.error("Please login to update favourites.");
    try {
      if (isFavorite) {
        await removeBookFromFavourite(id);
        removeFromUserFavourites(id);
        toast.success("Removed from favourites!");
      } else {
        await addBookToFavourite(id);
        addToUserFavourites(id);
        toast.success("Added to favourites!");
      }
    } catch (err) {
      toast.error("Failed to update favourites.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/3 aspect-3/4 bg-foreground/5 rounded-3xl" />
          <div className="flex-1 space-y-6">
            <div className="h-10 bg-foreground/5 rounded-xl w-3/4" />
            <div className="h-6 bg-foreground/5 rounded-xl w-1/4" />
            <div className="h-32 bg-foreground/5 rounded-2xl" />
            <div className="h-12 bg-foreground/5 rounded-xl w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!book && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">Book not found</div>
        <Link to="/books" className="inline-flex items-center space-x-2 text-primary mt-6 font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-700">
      <Link to="/books" className="inline-flex items-center space-x-2 text-foreground/40 hover:text-primary transition-colors mb-12 group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-bold uppercase tracking-wider">Back to Bookstore</span>
      </Link>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        {/* Left: Book Cover */}
        <div className="w-full md:w-2/5 lg:w-1/3">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative aspect-3/4 rounded-4xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={book?.url || 'https://images.unsplash.com/photo-1543003923-3882f0ced6b5?q=80&w=600&auto=format&fit=crop'}
                alt={book?.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Right: Book Details */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-sm font-bold text-foreground/40">4.9 (248 Reviews)</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black font-serif tracking-tight leading-tight mb-4">
            {book?.title || 'Unknown Title'}
          </h1>

          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Author</p>
              <p className="text-lg font-bold">{book?.author || 'Unknown'}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border mb-10">
            <p className="text-lg leading-relaxed text-foreground/70 italic">
              "{book?.desc || 'No description available for this book yet. Dive into the world of literature and discover the hidden stories.'}"
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10 pb-10 border-b border-border">
            <div className="flex flex-col items-center p-4 rounded-2xl bg-foreground/5">
              <Calendar className="w-5 h-5 text-primary/40 mb-2" />
              <span className="text-sm font-bold uppercase tracking-tighter opacity-40">Published</span>
              <span className="font-black">2023</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-foreground/5">
              <BookOpen className="w-5 h-5 text-primary/40 mb-2" />
              <span className="text-sm font-bold uppercase tracking-tighter opacity-40">Pages</span>
              <span className="font-black">432</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-foreground/5">
              <Languages className="w-5 h-5 text-primary/40 mb-2" />
              <span className="text-sm font-bold uppercase tracking-tighter opacity-40">Language</span>
              <span className="font-black">English</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-foreground/5">
              <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
              <span className="text-sm font-bold uppercase tracking-tighter opacity-40">Status</span>
              <span className="font-black text-green-500">In Stock</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col">
              <span className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Price</span>
              <span className="text-4xl font-black text-primary">₹{book?.price}</span>
            </div>

            <div className="flex flex-1 w-full gap-3">
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={clsx(
                  "flex-1 py-4! flex items-center justify-center space-x-2 group transition-all",
                  inCart ? "bg-green-500 text-white rounded-xl shadow cursor-not-allowed opacity-80" : "btn-primary"
                )}
              >
                {inCart ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
              <button
                onClick={handleAddToFavourite}
                className={clsx(
                  "p-4 rounded-xl border transition-all text-foreground/40",
                  isFavorite ? "border-red-500 bg-red-500 text-white hover:bg-red-600" : "border-border hover:bg-foreground/5 hover:text-red-500"
                )}
              >
                <Heart className={clsx("w-6 h-6", isFavorite && "fill-current")} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
