import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecentBooks } from '../api/books';
import BookCard from '../components/BookCard';
import Alert from '../components/Alert';
import { ArrowRight, Sparkles, BookOpen, Star, User } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-background py-20 sm:py-32">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your Gateway to Infinite Worlds</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black font-serif tracking-tight text-foreground leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Discover Your Next <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-500 drop-shadow-sm">
            Favorite Adventure
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Explore a curated collection of thousands of books, from timeless classics to modern masterpieces.
          Your journey into the extraordinary starts here.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <Link to="/books" className="btn-primary flex items-center space-x-2 group w-full sm:w-auto justify-center">
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/signup" className="px-8 py-3 rounded-xl border border-border font-bold hover:bg-foreground/5 transition-all w-full sm:w-auto text-center">
            Join the Community
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-12 border-t border-border/50 animate-in fade-in duration-1000 delay-500">
          {[
            { label: 'Books', value: '10K+', icon: BookOpen },
            { label: 'Authors', value: '2K+', icon: User },
            { label: 'Rating', value: '4.9/5', icon: Star },
            { label: 'Readers', value: '50K+', icon: Sparkles }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <stat.icon className="w-5 h-5 text-primary/40 mb-2" />
              <span className="text-2xl font-black">{stat.value}</span>
              <span className="text-xs text-foreground/40 font-medium uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        const response = await getRecentBooks();
        // Assuming response is the array of books based on common API patterns
        setBooks(response.data || response || []);
      } catch (err) {
        console.error("Error fetching recent books:", err);
        setError("Unable to load recent books. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentBooks();
  }, []);

  return (
    <div className="pb-20">
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold font-serif tracking-tight">Recent Additions</h2>
            <p className="text-foreground/50 mt-1">Handpicked gems fresh off the press</p>
          </div>
          <Link to="/books" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group">
            View All Books
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {error && <Alert type="error" message={error} />}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 4, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-3/4 bg-foreground/5 rounded-2xl mb-4" />
                <div className="h-5 bg-foreground/5 rounded w-3/4 mb-2" />
                <div className="h-4 bg-foreground/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.length > 0 ? (
              books.slice(0, 4).map((book) => (
                <BookCard key={book._id} book={book} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl">
                <BookOpen className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
                <p className="text-foreground/40">No books found in the recent collection.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Featured Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="relative rounded-4xl bg-card border border-border p-8 sm:p-16 overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
          <div className="flex-1 relative z-10">
            <h2 className="text-4xl font-black font-serif leading-tight mb-6">
              Personalized Reading <br />
              <span className="text-primary italic">Just for You</span>
            </h2>
            <p className="text-foreground/60 mb-8 max-w-md">
              Our AI-powered recommendation engine learns your tastes and suggests your next masterpiece.
            </p>
            <button className="btn-primary">Get Started Now</button>
          </div>
          <div className="flex-1 relative z-10 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-3/4 rounded-xl bg-foreground/5 animate-float" />
              <div className="aspect-3/4 rounded-xl bg-foreground/5" />
            </div>
            <div className="space-y-4 mt-8">
              <div className="aspect-3/4 rounded-xl bg-foreground/5" />
              <div className="aspect-3/4 rounded-xl bg-foreground/5 animate-float delay-1000" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
