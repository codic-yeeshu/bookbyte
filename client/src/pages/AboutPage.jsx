import React from 'react';
import { Sparkles, BookOpen, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="pb-20">
      <div className="relative overflow-hidden bg-background py-20 sm:py-32">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
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
            <Link to="/discover" className="btn-primary flex items-center space-x-2 justify-center">
              <span>Start Reading</span>
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
              <div key={idx} className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border/40 shadow-sm hover:border-primary/30 transition-colors">
                <stat.icon className="w-8 h-8 text-primary/60 mb-4" />
                <span className="text-3xl font-black mb-1">{stat.value}</span>
                <span className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-24 animate-in fade-in duration-1000 delay-700">
         <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80">
            <h2 className="font-serif text-3xl font-bold mb-6 text-foreground">Our Story</h2>
            <p className="mb-6 leading-relaxed">
              Founded with a passion for literature, BookByte was created to transform the way readers discover, buy, and interact with books. We believe that a good book has the power to change perspectives, ignite imaginations, and connect people across the world.
            </p>
            <p className="leading-relaxed">
              Our platform is more than just a store; it's a community for those who live for the scent of well-thumbed pages and the thrill of a captivating plot. Whether you're searching for an obscure academic text, the latest bestseller, or a hidden indie gem, BookByte is your destination.
            </p>
         </div>
      </section>
    </div>
  );
};

export default AboutPage;
