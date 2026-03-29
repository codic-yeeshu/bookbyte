import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Twitter,
  Github,
  Instagram,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast'

const TooltipWrapper = ({ text, children }) => (
  <div className="relative group inline-flex justify-center overflow-visible">
    {children}
    <div className="absolute bottom-full mb-2 w-max px-2.5 py-1 text-[11px] font-bold tracking-wide text-white bg-primary rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-100">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-foreground" />
    </div>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Book<span className="text-primary">Byte</span>
              </span>
            </Link>
            <p className="text-sm text-foreground/60 leading-relaxed max-w-xs">
              Your ultimate destination for discovering, tracking, and exploring your favorite books.
              Built with love for book lovers everywhere.
            </p>
            <div className="flex items-center space-x-4">
              <TooltipWrapper text="View Source">
                <a href="https://github.com/codic-yeeshu/bookbyte" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-foreground/5 transition-colors text-foreground/60 hover:text-primary block">
                  <Github className="w-5 h-5" />
                </a>
              </TooltipWrapper>
              <TooltipWrapper text="Work in progress 🚧">
                <a href="#" className="p-2 rounded-full hover:bg-foreground/5 transition-colors text-foreground/60 hover:text-primary block">
                  <Twitter className="w-5 h-5" />
                </a>
              </TooltipWrapper>
              <TooltipWrapper text="Work in progress 🚧">
                <a href="#" className="p-2 rounded-full hover:bg-foreground/5 transition-colors text-foreground/60 hover:text-primary block">
                  <Instagram className="w-5 h-5" />
                </a>
              </TooltipWrapper>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="text-foreground/60 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/books" className="text-foreground/60 hover:text-primary transition-colors">All Books</Link></li>
              <li><Link to="/favorites" className="text-foreground/60 hover:text-primary transition-colors">Favorites</Link></li>
              <li><Link to="/cart" className="text-foreground/60 hover:text-primary transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <TooltipWrapper text="Work in progress 🚧">
                  <Link to="#" className="text-foreground/60 hover:text-primary transition-colors">Help Center</Link>
                </TooltipWrapper>
              </li>
              <li>
                <TooltipWrapper text="Work in progress 🚧">
                  <Link to="#" className="text-foreground/60 hover:text-primary transition-colors">Terms of Service</Link>
                </TooltipWrapper>
              </li>
              <li>
                <TooltipWrapper text="Work in progress 🚧">
                  <Link to="#" className="text-foreground/60 hover:text-primary transition-colors">Privacy Policy</Link>
                </TooltipWrapper>
              </li>
              <li>
                <TooltipWrapper text="Work in progress 🚧">
                  <Link to="#" className="text-foreground/60 hover:text-primary transition-colors">Contact Us</Link>
                </TooltipWrapper>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Stay Updated</h3>
            <p className="text-sm text-foreground/60 mb-4">Subscribe to our newsletter for updates and new releases.</p>
            <form onSubmit={(e) => {e.preventDefault(); toast.success("Subscribed successfully..")}} className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-input border-border rounded-lg px-4 py-2 text-sm focus:ring-primary focus:border-primary transition-all"
              />
              <button type="submit" className="btn-primary w-full py-2! text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-foreground/50">
            &copy; {currentYear} BookByte. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <TooltipWrapper text="Work in progress 🚧">
              <Link to="#" className="text-xs text-foreground/40 hover:text-primary transition-colors">Sitemap</Link>
            </TooltipWrapper>
            <TooltipWrapper text="Work in progress 🚧">
              <Link to="#" className="text-xs text-foreground/40 hover:text-primary transition-colors">Cookies Settings</Link>
            </TooltipWrapper>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
