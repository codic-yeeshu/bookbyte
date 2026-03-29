import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';
import { scale } from '@cloudinary/url-gen/actions/resize';

import { addBookToCart } from '../api/cart';
import { addBookToFavourite, removeBookFromFavourite } from '../api/favourite';
import { useAuth } from '../hooks/useAuth';

const cld = new Cloudinary({ cloud: { cloudName: 'demo' } });

const optimizeImageUrl = (url) => {
  if (!url || !url.includes('upload/')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_1000/');
};

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, addToUserCart, addToUserFavourites, removeFromUserFavourites } = useAuth();

  // Fallback for missing book data
  const {
    _id,
    url = 'https://images.unsplash.com/photo-1543003923-3882f0ced6b5?q=80&w=400&auto=format&fit=crop',
    title = 'Untitled Book',
    author = 'Unknown Author',
    price = 0,
  } = book || {};

  const isFavorite = user?.favourites?.includes(_id) || false;

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error("Please login to update favourites.");
    try {
      if (isFavorite) {
        await removeBookFromFavourite(_id);
        removeFromUserFavourites(_id);
        toast.success("Removed from favourites!");
      } else {
        await addBookToFavourite(_id);
        addToUserFavourites(_id);
        toast.success("Added to favourites!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update favourites.");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error("Please login to add to cart.");
    try {
      await addBookToCart(_id);
      addToUserCart(_id);
      toast.success("Added to cart successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart.");
    }
  };

  const handleCardClick = (e) => {
    // Prevent triggering navigation if a button was clicked
    if (e.target.closest('button') || e.target.closest('a')) return;
    navigate(`/book/${_id}`);
  };

  const optimizedUrl = optimizeImageUrl(url);

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-primary/30 flex flex-col h-full cursor-pointer"
    >
      {/* Book Cover Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-foreground/5 shrink-0">
        <img
          src={optimizedUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/book/${_id}`}
            className="p-3 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-50"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <button
            onClick={handleAddToCart}
            className="p-3 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-150"
            title="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className={clsx(
            "absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 transform active:scale-90",
            isFavorite
              ? "bg-red-500 text-white shadow-lg scale-110"
              : "bg-black/20 text-white hover:bg-white hover:text-red-500"
          )}
        >
          <Heart className={clsx("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2 flex-1">
          <h3 className="text-lg font-bold font-serif leading-tight line-clamp-1 hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-foreground/50 mt-1">{author}</p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-black text-primary">₹{price}</span>
          <div className="flex -space-x-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-primary/20" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
