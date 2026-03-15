import React, { useState, useEffect } from 'react';
import { getFavouriteBooks } from '../api/favourite';
import BookCard from '../components/BookCard';
import Alert from '../components/Alert';
import { Heart, Search } from 'lucide-react';

const FavouritesPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await getFavouriteBooks();
        setBooks(response.data || []);
      } catch (err) {
        console.error("Error fetching favourites:", err);
        setError("Unable to load your favourite books.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  return (
    <div className="pb-20 pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[70vh]">
      <div className="flex items-center space-x-4 mb-10 border-b border-border pb-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <Heart className="w-6 h-6 text-red-500 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-black font-serif tracking-tight">Your Favourites</h1>
          <p className="text-foreground/50 mt-1">Books you've loved and saved for later</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-3/4 bg-foreground/5 rounded-2xl mb-4" />
              <div className="h-5 bg-foreground/5 rounded w-3/4 mb-2" />
              <div className="h-4 bg-foreground/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-in fade-in duration-700 delay-150">
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl bg-card/30">
              <Heart className="w-16 h-16 text-foreground/10 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No favourites yet</h3>
              <p className="text-foreground/50 max-w-sm mx-auto">
                Explore our collection and click the heart icon on any book you'd like to save for later.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
