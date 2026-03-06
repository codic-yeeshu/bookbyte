import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  Search,
  BookOpen,
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  ExternalLink,
  Loader2,
  Package,
  CheckCircle,
  Truck,
  Box
} from 'lucide-react';
import { getAllBooks, deleteBook } from '../api/books';
import { getAllOrders, updateOrderStatus } from '../api/orders';
import AddBookModal from '../components/AddBookModal';
import Alert from '../components/Alert';
import { clsx } from 'clsx';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const refreshData = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (activeTab === 'books') {
        const response = await getAllBooks();
        setBooks(response.data || response || []);
      } else if (activeTab === 'orders') {
        const response = await getAllOrders();
        setOrders(response.data || response || []);
      }
    } catch (err) {
      setError(`Failed to load ${activeTab}. Please retry.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this masterpiece?")) return;
    try {
      await deleteBook(id);
      setBooks(books.filter(b => b._id !== id));
    } catch (err) {
      setError("Failed to delete book.");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      setError("Failed to update order status.");
    }
  };

  const filteredBooks = books.filter(b =>
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black font-serif tracking-tight">Admin Console</h1>
            <p className="text-foreground/40 font-medium italic">Manage your literary empire</p>
          </div>
        </div>

        <div className="flex bg-card border border-border rounded-2xl p-1 shadow-xl">
          {[
            { id: 'books', icon: BookOpen, label: 'Inventory' },
            { id: 'orders', icon: ShoppingCart, label: 'Orders' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-8" />}

      {activeTab === 'books' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-input border-border rounded-xl py-3 pl-10 pr-4 focus:ring-primary transition-all"
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-foreground/20" />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary py-3! flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Masterpiece</span>
            </button>
          </div>

          <div className="bg-card border border-border rounded-4xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-foreground/5 text-xs font-bold uppercase tracking-[0.2em] text-foreground/40">
                    <th className="px-8 py-6">Book</th>
                    <th className="px-8 py-6">Details</th>
                    <th className="px-8 py-6">Price</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    [1, 2, 3].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="4" className="px-8 py-6 h-20 bg-foreground/5" />
                      </tr>
                    ))
                  ) : filteredBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-foreground/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-16 rounded-lg overflow-hidden bg-foreground/5 shrink-0 shadow-lg">
                            <img src={book.url} alt={book.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="font-bold font-serif text-lg line-clamp-1 group-hover:text-primary transition-colors">
                            {book.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="font-bold">{book.author}</p>
                          <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{book.language}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xl font-black text-primary">₹{book.price}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end space-x-3">
                          <button className="p-2.5 rounded-xl hover:bg-foreground/5 text-foreground/20 hover:text-foreground transition-all">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="p-2.5 rounded-xl hover:bg-red-500/10 text-foreground/20 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!isLoading && filteredBooks.length === 0 && (
                <div className="py-20 text-center">
                  <Package className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
                  <p className="text-foreground/40 font-medium italic">No books found in the archives.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="bg-card border border-border rounded-3xl p-8 shadow-xl hover:border-primary/20 transition-all flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-6 w-full">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Order Ref</span>
                      <p className="font-black font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className={clsx(
                      "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border",
                      order.status === 'Delivered' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        order.status === 'Shipped' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                          "bg-primary/10 text-primary border-primary/20"
                    )}>
                      {order.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Box className="w-4 h-4" />
                      </div>
                      <div className="text-sm">
                        <p className="text-foreground/40 font-bold uppercase text-[9px]">Customer</p>
                        <p className="font-bold">{order.user?.username || 'Anonymouse'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div className="text-sm">
                        <p className="text-foreground/40 font-bold uppercase text-[9px]">Items</p>
                        <p className="font-bold">{order.books?.length || 0} Products</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto md:border-l md:border-border md:pl-8 flex flex-col gap-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 text-center">Update Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { s: 'Placed', icon: Box },
                      { s: 'Shipped', icon: Truck },
                      { s: 'Delivered', icon: CheckCircle }
                    ].map(status => (
                      <button
                        key={status.s}
                        onClick={() => handleUpdateStatus(order._id, status.s)}
                        className={clsx(
                          "flex flex-col items-center p-3 rounded-2xl transition-all border",
                          order.status === status.s
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-foreground/5 hover:bg-foreground/10 border-transparent text-foreground/40"
                        )}
                        title={status.s}
                      >
                        <status.icon className="w-5 h-5 mb-1" />
                        <span className="text-[8px] font-black uppercase">{status.s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
          {!isLoading && orders.length === 0 && (
            <div className="py-20 text-center">
              <ShoppingCart className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
              <p className="text-foreground/40 font-medium italic">No orders received yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Revenue', value: '₹1.2M', growth: '+12.5%', color: 'from-emerald-500 to-teal-500' },
            { label: 'Active Readers', value: '45.2K', growth: '+5.2%', color: 'from-primary to-indigo-500' },
            { label: 'Inventory Value', value: '₹4.8M', growth: '+2.1%', color: 'from-amber-500 to-orange-500' }
          ].map((card, i) => (
            <div key={i} className="bg-card border border-border rounded-4xl p-8 relative overflow-hidden group hover:shadow-2xl transition-all">
              <div className={clsx("absolute top-0 left-0 w-2 h-full bg-linear-to-b", card.color)} />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 mb-2">{card.label}</h3>
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-black">{card.value}</p>
                <span className="text-xs font-black text-emerald-500">{card.growth}</span>
              </div>
            </div>
          ))}
          <div className="md:col-span-3 bg-foreground/5 rounded-4xl h-64 flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center opacity-20">
              <BarChart3 className="w-16 h-16 mx-auto mb-4" />
              <p className="font-black uppercase tracking-[0.4em]">Charts incoming...</p>
            </div>
          </div>
        </div>
      )}

      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRefresh={refreshData}
      />
    </div>
  );
};

export default AdminDashboard;
