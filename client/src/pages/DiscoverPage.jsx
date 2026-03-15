import React, { useState, useEffect } from 'react';
import { getAllBooks } from '../api/books';
import BookCard from '../components/BookCard';
import Alert from '../components/Alert';
import { BookOpen, Search, Filter } from 'lucide-react';

const DiscoverPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks();
        setBooks(response.data || response || []);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Unable to load books. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pb-20 pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl sm:text-6xl font-black font-serif tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Discover <span className="text-primary italic">Books</span>
        </h1>
        <p className="text-foreground/60 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          Immerse yourself in our vast collection. Find hidden gems, explore new genres, and embark on endless adventures.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 animate-in fade-in duration-700 delay-300">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-input border-border rounded-full py-3 pl-12 pr-4 text-sm focus:ring-primary focus:border-primary transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-foreground/50" />
        </div>
        
        <button className="flex items-center space-x-2 px-6 py-3 rounded-full border border-border hover:bg-foreground/5 transition-all w-full sm:w-auto justify-center font-medium shadow-sm">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {error && <Alert type="error" message={error} />}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-3/4 bg-foreground/5 rounded-2xl mb-4" />
              <div className="h-5 bg-foreground/5 rounded w-3/4 mb-2" />
              <div className="h-4 bg-foreground/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 space-y-8 animate-in fade-in duration-1000 delay-500">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book._id} className="break-inside-avoid">
                <BookCard book={book} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-border rounded-3xl w-full aspect-video flex flex-col items-center justify-center">
              <BookOpen className="w-16 h-16 text-foreground/10 mx-auto mb-4" />
              <p className="text-xl font-bold text-foreground/60 mb-2">No books found.</p>
              <p className="text-foreground/40">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
