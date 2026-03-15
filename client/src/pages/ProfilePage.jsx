import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserInfo } from '../api/user';
import Alert from '../components/Alert';
import { User, Mail, MapPin, Package, Heart, ShoppingCart, ShieldCheck, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserInfo();
        setProfile(data?.data || data); // handle standard wrapper if any
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="max-w-3xl mx-auto p-8"><Alert type="error" message={error} /></div>;
  }

  // Fallback if avatar is undefined, default from user schema
  const avatar = profile?.avatar || "https://cdn-icons.png.flaticon.com/128/3177/3177440.png";

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-3xl border border-border p-8 text-center shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="absolute top-0 left-0 w-full h-32 bg-primary/10"></div>
            <div className="relative z-10">
              <div className="w-32 h-32 mx-auto rounded-full p-2 bg-background shadow-xl mb-4">
                <img src={avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold font-serif">{profile?.username}</h2>
              <div className="flex items-center justify-center space-x-1 text-foreground/50 text-sm mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{profile?.email}</span>
              </div>
              
              <div className="mt-6 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {profile?.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                <span>{profile?.role}</span>
              </div>
            </div>
          </div>
          
          {/* Contact Details Card */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm animate-in fade-in delay-100 slide-in-from-bottom-4">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Contact Info</h3>
                <button className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors hidden"><Edit2 className="w-4 h-4"/></button>
             </div>
             <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-foreground/40 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-foreground/60">{profile?.address}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
        
        {/* Right Col: Stats & Quick Links */}
        <div className="lg:col-span-2 space-y-8 animate-in fade-in delay-200 slide-in-from-bottom-4">
          <h2 className="text-3xl font-black font-serif">Hello, {profile?.username}!</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/orders" className="bg-card p-6 rounded-3xl border border-border hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-3xl font-black mb-1">{profile?.orders?.length || 0}</p>
              <p className="text-foreground/50 text-sm font-medium">Total Orders</p>
            </Link>
            
            <Link to="/favourites" className="bg-card p-6 rounded-3xl border border-border hover:border-red-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-red-500 fill-current" />
              </div>
              <p className="text-3xl font-black mb-1">{profile?.favourites?.length || 0}</p>
              <p className="text-foreground/50 text-sm font-medium">Saved Books</p>
            </Link>
            
            <Link to="/cart" className="bg-card p-6 rounded-3xl border border-border hover:border-green-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-3xl font-black mb-1">{profile?.cart?.length || 0}</p>
              <p className="text-foreground/50 text-sm font-medium">In Cart</p>
            </Link>
          </div>
          
          {/* Recent Activity Placeholder */}
          <div className="bg-card rounded-3xl border border-border p-8">
            <h3 className="font-bold text-xl mb-6 font-serif">Recent Activity</h3>
            <div className="py-12 text-center text-foreground/40 border-2 border-dashed border-border rounded-xl">
              <p>No recent activity to show.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
