import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecentBooks, getAllBooks } from '../api/books';
import BookCard from '../components/BookCard';
import Alert from '../components/Alert';
import { ArrowRight, Sparkles, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Discover Your Next Favorite Adventure",
      subtitle: "Explore a curated collection of thousands of books, from timeless classics to modern masterpieces.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Unlock New Worlds With Every Page",
      subtitle: "Immerse yourself in stories that will captivate your mind and touch your soul.",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Knowledge is Power, Read More",
      subtitle: "Gain insights, learn new skills, and expand your horizons with our non-fiction collection.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-background py-10 sm:py-20 rounded-3xl mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-125 h-125 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-100 h-100 bg-indigo-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative h-100 sm:h-125 rounded-3xl overflow-hidden shadow-2xl border border-border/50">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 sm:p-12">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Collection</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black font-serif text-white tracking-tight leading-[1.1] mb-6 max-w-4xl drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow">
                {slide.subtitle}
              </p>
              <Link to="/discover" className="btn-primary flex items-center space-x-2 group/btn justify-center shadow-xl">
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
        
        {/* Carousel Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-primary/80 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-primary/80 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [recentBooks, setRecentBooks] = useState([]);
  const [otherBooks, setOtherBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [recentRes, allRes] = await Promise.all([
          getRecentBooks(),
          getAllBooks()
        ]);
        
        // Recent books
        setRecentBooks(recentRes.data || recentRes || []);
        
        // Other books (shuffle and pick 8 that are not in recent, or just pick other subset)
        const allBooksArray = allRes.data || allRes || [];
        // Sort randomly to get "other" books
        const shuffled = [...allBooksArray].sort(() => 0.5 - Math.random());
        setOtherBooks(shuffled.slice(0, 8));
        
      } catch (err) {
        console.error("Error fetching home books:", err);
        setError("Unable to load books. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="pb-20">
      <HeroCarousel />

      {/* Recent Additions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold font-serif tracking-tight">Recent Additions</h2>
            <p className="text-foreground/50 mt-1">Handpicked gems fresh off the press</p>
          </div>
          <Link to="/discover" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group">
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {recentBooks.length > 0 ? (
              recentBooks.slice(0, 4).map((book) => (
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

      {/* Other Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold font-serif tracking-tight">Other Books You May Like</h2>
            <p className="text-foreground/50 mt-1">Curated selections from our vast catalog</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={`other-skel-${i}`} className="animate-pulse">
                <div className="aspect-3/4 bg-foreground/5 rounded-2xl mb-4" />
                <div className="h-5 bg-foreground/5 rounded w-3/4 mb-2" />
                <div className="h-4 bg-foreground/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {otherBooks.length > 0 ? (
              otherBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))
            ) : null}
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
            <Link to="/discover" className="btn-primary inline-flex">Get Started Now</Link>
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
