import React, { useState } from 'react';
import { X, Upload, BookOpen, User, DollarSign, Globe, AlignLeft } from 'lucide-react';
import { addBook } from '../api/books';
import Alert from './Alert';

const AddBookModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    author: '',
    price: '',
    desc: '',
    language: 'English'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await addBook({
        ...formData,
        price: Number(formData.price)
      });
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add book. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-black font-serif flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <span>Add New Masterpiece</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-foreground/5 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <Alert type="error" message={error} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Book Title</label>
              <div className="relative">
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-input border-border rounded-xl py-3 pl-10 pr-4 focus:ring-primary transition-all"
                  placeholder="The Great Gatsby"
                />
                <BookOpen className="absolute left-3 top-3 w-5 h-5 text-foreground/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Author Name</label>
              <div className="relative">
                <input
                  required
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full bg-input border-border rounded-xl py-3 pl-10 pr-4 focus:ring-primary transition-all"
                  placeholder="F. Scott Fitzgerald"
                />
                <User className="absolute left-3 top-3 w-5 h-5 text-foreground/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Cover Image URL</label>
              <div className="relative">
                <input
                  required
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="w-full bg-input border-border rounded-xl py-3 pl-10 pr-4 focus:ring-primary transition-all"
                  placeholder="https://images.unsplash..."
                />
                <Upload className="absolute left-3 top-3 w-5 h-5 text-foreground/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Price (₹)</label>
              <div className="relative">
                <input
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-input border-border rounded-xl py-3 pl-10 pr-4 focus:ring-primary transition-all"
                  placeholder="499"
                />
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-foreground/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Language</label>
              <div className="relative">
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full bg-input border-border rounded-xl py-3 pl-10 pr-4 focus:ring-primary transition-all appearance-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>French</option>
                  <option>German</option>
                </select>
                <Globe className="absolute left-3 top-3.5 w-5 h-5 text-foreground/20 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Description</label>
            <div className="relative">
              <textarea
                required
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                rows="4"
                className="w-full bg-input border-border rounded-xl py-3 pl-10 pr-4 focus:ring-primary transition-all"
                placeholder="Brief summary of the book..."
              />
              <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-foreground/20" />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-3 rounded-xl border border-border font-bold hover:bg-foreground/5 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              type="submit"
              className="flex-1 btn-primary py-3! flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  <span>Publish Book</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
