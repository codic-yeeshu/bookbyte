import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserCart, removeBookFromCart } from '../api/cart';
import toast from 'react-hot-toast';
import Alert from '../components/Alert';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await getUserCart();
        // Assuming response.data is the array of cart items based on common patterns
        const items = response.data || response || [];
        setCartItems(items);
        calculateTotal(items);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Unable to load your cart. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, navigate]);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (item.price || 0), 0);
    setTotalPrice(total);
  };

  const handleRemove = async (bookId) => {
    try {
      await removeBookFromCart(bookId);
      const updatedCart = cartItems.filter(item => item._id !== bookId);
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (err) {
      setError("Failed to remove item from cart.");
    }
  };

  const handleCardClick = (e, bookId) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    navigate(`/book/${bookId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <ShoppingCart className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
        <div className="h-8 bg-foreground/5 rounded-xl w-48 mx-auto mb-10" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-foreground/5 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black font-serif tracking-tight">Your Cart</h1>
            <p className="text-foreground/40 font-medium">
              {cartItems.length} items in your bag
            </p>
          </div>
        </div>
        <Link to="/books" className="hidden sm:flex items-center space-x-2 text-sm font-bold text-primary hover:underline group">
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {error && <Alert type="error" message={error} className="mb-8" />}

      {cartItems.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-4xl bg-card/50">
          <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-foreground/20" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-foreground/40 mb-8 max-w-sm mx-auto">
            Looks like you haven't added any books to your cart yet. Start exploring our collection!
          </p>
          <Link to="/books" className="btn-primary">Browse Books</Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                onClick={(e) => handleCardClick(e, item._id)}
                className="group flex flex-items items-center p-4 sm:p-6 bg-card border border-border rounded-3xl transition-all hover:shadow-xl hover:border-primary/20 cursor-pointer"
              >
                <div className="w-20 h-24 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-foreground/5 shrink-0">
                  <img
                    src={item.url || 'https://images.unsplash.com/photo-1543003923-3882f0ced6b5?q=80&w=200'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="ml-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold font-serif line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-sm text-foreground/50">{item.author}</p>
                    </div>
                    <span className="text-xl font-black text-primary">₹{item.price}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-foreground/5 rounded-lg">
                      <button onClick={() => toast('Quantity updates coming soon!', { icon: '🚧' })} className="p-2 hover:text-primary transition-colors"><Minus className="w-4 h-4" /></button>
                      <span className="px-4 font-bold text-sm">1</span>
                      <button onClick={() => toast('Quantity updates coming soon!', { icon: '🚧' })} className="p-2 hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="p-2.5 rounded-xl text-foreground/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      title="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-card border border-border rounded-4xl p-8 sticky top-24 shadow-2xl">
              <h2 className="text-2xl font-black font-serif mb-8 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-primary" />
                <span>Summary</span>
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-foreground/60">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-foreground/60">
                  <span>Shipping</span>
                  <span className="font-bold text-green-500 italic">FREE</span>
                </div>
                <div className="flex justify-between text-foreground/60">
                  <span>Platform Fee</span>
                  <span className="font-bold">₹49</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center text-xl font-black">
                  <span>Total</span>
                  <span className="text-primary text-2xl font-black">₹{totalPrice + 49}</span>
                </div>
              </div>

              <button 
                onClick={() => toast('Work in progress', { icon: '🚧' })}
                className="w-full btn-primary py-4! flex items-center justify-center space-x-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative font-black uppercase tracking-wider">Proceed to Checkout</span>
                <ChevronRight className="w-5 h-5 relative transition-transform group-hover:translate-x-1" />
              </button>

              <div className="mt-8 pt-8 border-t border-border space-y-4">
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em] text-center">Secure Payment Guaranteed</p>
                <div className="flex justify-center gap-4 opacity-20 grayscale">
                  <div className="w-10 h-6 bg-foreground rounded" />
                  <div className="w-10 h-6 bg-foreground rounded" />
                  <div className="w-10 h-6 bg-foreground rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
