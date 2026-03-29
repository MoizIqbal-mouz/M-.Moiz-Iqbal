import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  User as UserIcon, 
  LogOut, 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Package, 
  ChevronRight,
  Globe,
  Waves,
  Anchor
} from 'lucide-react';
import { User, Order, Product, Notification } from './types';
import { PRODUCTS, SEA_IMAGES } from './constants';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'login' | 'register' | 'orders' | 'staff'>('home');
  const [cart, setCart] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [authForm, setAuthForm] = useState({ username: '', password: '', email: '', role: 'customer' as 'customer' | 'staff', country: 'Pakistan' });
  const [staffMessage, setStaffMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchNotifications();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    const res = await fetch(`/api/orders/${user.id}`);
    const data = await res.json();
    setOrders(data);
  };

  const fetchNotifications = async () => {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    setNotifications(data);
  };

  const handleAuth = async (type: 'login' | 'register') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setView('home');
      } else {
        alert(data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!user) return setView('login');
    const total = cart.reduce((sum, p) => sum + p.price, 0);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, items: cart, total })
    });
    if (res.ok) {
      setCart([]);
      fetchOrders();
      alert("Order placed successfully!");
    }
  };

  const cancelOrder = async (orderId: string) => {
    const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    if (res.ok) fetchOrders();
  };

  const sendNotification = async () => {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: staffMessage, targetRole: 'customer' })
    });
    if (res.ok) {
      setStaffMessage('');
      fetchNotifications();
      alert("Notification sent to all customers!");
    }
  };

  return (
    <div className="min-h-screen bg-[#001219] text-[#e9d8a6] font-sans selection:bg-[#94d2bd] selection:text-[#001219]">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <img 
          src={SEA_IMAGES[0]} 
          alt="Sea Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001219]/80 via-transparent to-[#001219]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md border-b border-[#94d2bd]/20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          <Waves className="w-8 h-8 text-[#94d2bd] animate-pulse" />
          <h1 className="text-2xl font-bold tracking-tighter uppercase italic">Coral Whisper</h1>
        </div>
        
        <div className="flex items-center gap-8">
          <button onClick={() => setView('home')} className="hover:text-[#94d2bd] transition-colors">Store</button>
          {user ? (
            <>
              {user.role === 'staff' && (
                <button onClick={() => setView('staff')} className="hover:text-[#94d2bd] transition-colors flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Staff Portal
                </button>
              )}
              <button onClick={() => setView('orders')} className="hover:text-[#94d2bd] transition-colors flex items-center gap-2">
                <Package className="w-4 h-4" /> My Orders
              </button>
              <div className="flex items-center gap-4 bg-[#005f73]/30 px-4 py-2 rounded-full border border-[#94d2bd]/30">
                <UserIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{user.username}</span>
                <button onClick={() => setUser(null)} className="hover:text-red-400">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => setView('login')}
              className="bg-[#94d2bd] text-[#001219] px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-8 py-12">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-6xl font-black uppercase tracking-widest text-[#94d2bd]">The Essence of the Ocean</h2>
                <p className="text-xl opacity-70 max-w-2xl mx-auto italic">Crafted for those who find peace in the waves. Our fragrances are a tribute to the deep blue.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {PRODUCTS.map((product) => (
                  <motion.div 
                    key={product.id}
                    whileHover={{ scale: 1.02, y: -10 }}
                    className="bg-[#005f73]/20 rounded-3xl overflow-hidden border border-[#94d2bd]/10 group"
                  >
                    <div className="h-64 overflow-hidden relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001219] to-transparent opacity-60" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <span className="text-[#94d2bd] font-mono">${product.price}</span>
                      </div>
                      <p className="text-sm opacity-60 line-clamp-2">{product.description}</p>
                      <button 
                        onClick={() => setCart([...cart, product])}
                        className="w-full bg-[#0a9396] hover:bg-[#94d2bd] hover:text-[#001219] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {cart.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="fixed bottom-12 right-12 bg-[#94d2bd] text-[#001219] p-8 rounded-[2rem] shadow-2xl border-4 border-[#005f73] min-w-[350px]"
                >
                  <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                    <ShoppingBag /> Your Selection
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                    {cart.map((item, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-[#001219]/10 pb-2">
                        <span>{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono">${item.price}</span>
                          <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-red-600 hover:scale-110">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold mb-6">
                    <span>Total</span>
                    <span>${cart.reduce((s, p) => s + p.price, 0)}</span>
                  </div>
                  <button 
                    onClick={placeOrder}
                    className="w-full bg-[#001219] text-[#94d2bd] py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#005f73] transition-colors"
                  >
                    Confirm Order
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {(view === 'login' || view === 'register') && (
            <motion.div 
              key="auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto bg-[#005f73]/20 p-10 rounded-[3rem] border border-[#94d2bd]/20 backdrop-blur-xl"
            >
              <h2 className="text-4xl font-black uppercase mb-8 text-center tracking-tighter">
                {view === 'login' ? 'Welcome Back' : 'Join the Voyage'}
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest opacity-50">Username</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#001219]/50 border border-[#94d2bd]/20 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#94d2bd] transition-colors"
                    value={authForm.username}
                    onChange={e => setAuthForm({...authForm, username: e.target.value})}
                  />
                </div>
                {view === 'register' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest opacity-50">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full bg-[#001219]/50 border border-[#94d2bd]/20 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#94d2bd] transition-colors"
                        value={authForm.email}
                        onChange={e => setAuthForm({...authForm, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest opacity-50">Priority Region</label>
                      <select 
                        className="w-full bg-[#001219]/50 border border-[#94d2bd]/20 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#94d2bd] transition-colors appearance-none"
                        value={authForm.country}
                        onChange={e => setAuthForm({...authForm, country: e.target.value})}
                      >
                        <option value="Pakistan">Pakistan (Priority 1)</option>
                        <option value="International">Other Countries (Priority 2)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest opacity-50">Account Type</label>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setAuthForm({...authForm, role: 'customer'})}
                          className={`flex-1 py-3 rounded-xl border ${authForm.role === 'customer' ? 'bg-[#94d2bd] text-[#001219]' : 'border-[#94d2bd]/20'}`}
                        >
                          Customer
                        </button>
                        <button 
                          onClick={() => setAuthForm({...authForm, role: 'staff'})}
                          className={`flex-1 py-3 rounded-xl border ${authForm.role === 'staff' ? 'bg-[#94d2bd] text-[#001219]' : 'border-[#94d2bd]/20'}`}
                        >
                          Staff
                        </button>
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest opacity-50">Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-[#001219]/50 border border-[#94d2bd]/20 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#94d2bd] transition-colors"
                    value={authForm.password}
                    onChange={e => setAuthForm({...authForm, password: e.target.value})}
                  />
                </div>
                <button 
                  onClick={() => handleAuth(view as 'login' | 'register')}
                  disabled={loading}
                  className="w-full bg-[#94d2bd] text-[#001219] py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {loading ? 'Processing...' : view === 'login' ? 'Enter Store' : 'Create Account'}
                </button>
                <p className="text-center text-sm opacity-60">
                  {view === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => setView(view === 'login' ? 'register' : 'login')}
                    className="ml-2 text-[#94d2bd] font-bold underline"
                  >
                    {view === 'login' ? 'Register' : 'Login'}
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {view === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-black uppercase tracking-tighter">Your Voyage History</h2>
              <div className="grid gap-6">
                {orders.length === 0 ? (
                  <div className="text-center py-20 bg-[#005f73]/10 rounded-3xl border border-dashed border-[#94d2bd]/30">
                    <Anchor className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="opacity-50 italic">No orders found. Start your journey in the store.</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-[#005f73]/20 p-8 rounded-3xl border border-[#94d2bd]/20 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono opacity-50">{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-lg font-bold">{order.items.length} Fragrances Selected</p>
                        <p className="text-sm opacity-60">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-8">
                        <span className="text-2xl font-black text-[#94d2bd]">${order.total}</span>
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => cancelOrder(order.id)}
                            className="bg-red-500/10 text-red-400 border border-red-500/30 px-6 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {view === 'staff' && (
            <motion.div 
              key="staff"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="bg-[#94d2bd] text-[#001219] p-12 rounded-[3rem] space-y-8">
                <h2 className="text-5xl font-black uppercase tracking-tighter">Staff Command Center</h2>
                <div className="space-y-4">
                  <label className="text-sm font-black uppercase tracking-widest">Broadcast Sale Notification</label>
                  <textarea 
                    className="w-full bg-[#001219]/10 border-2 border-[#001219]/20 rounded-3xl p-6 focus:outline-none focus:border-[#001219] transition-colors min-h-[150px] placeholder:text-[#001219]/40"
                    placeholder="Enter your message for the customers..."
                    value={staffMessage}
                    onChange={e => setStaffMessage(e.target.value)}
                  />
                  <button 
                    onClick={sendNotification}
                    className="bg-[#001219] text-[#94d2bd] px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Deploy Notification
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-black uppercase flex items-center gap-3">
                  <Bell className="text-[#94d2bd]" /> Recent Broadcasts
                </h3>
                <div className="grid gap-4">
                  {notifications.map(n => (
                    <div key={n.id} className="bg-[#005f73]/20 p-6 rounded-2xl border border-[#94d2bd]/10">
                      <p className="text-lg mb-2">{n.message}</p>
                      <span className="text-xs opacity-40 uppercase tracking-widest">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Notifications Overlay for Customers */}
      {user?.role === 'customer' && notifications.length > 0 && (
        <div className="fixed top-24 right-8 z-[100] w-80 space-y-4">
          {notifications.slice(-3).map(n => (
            <motion.div 
              key={n.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-[#94d2bd] text-[#001219] p-6 rounded-2xl shadow-2xl border-l-8 border-[#005f73]"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Sale Alert</span>
                <Bell className="w-3 h-3" />
              </div>
              <p className="text-sm font-bold">{n.message}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-24 border-t border-[#94d2bd]/20 py-12 px-8 bg-[#001219]/80 backdrop-blur-xl">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Waves className="w-6 h-6 text-[#94d2bd]" />
              <h4 className="text-xl font-black uppercase italic">Coral Whisper</h4>
            </div>
            <p className="opacity-50 text-sm leading-relaxed">
              The world's first high-performance fragrance platform, designed to handle 2000 orders per 30 seconds with absolute precision and security.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-[#94d2bd]">Global Priority</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#94d2bd]" />
                <span>1. Pakistan (Primary Hub)</span>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <Globe className="w-4 h-4" />
                <span>2. International Markets</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-right">
            <p className="text-sm font-bold tracking-widest uppercase">Design by Moiz Iqbal</p>
            <p className="text-[#94d2bd] font-mono text-sm">mouzmughal@gmail.com</p>
            <div className="flex justify-end gap-4 opacity-30">
              <Anchor className="w-5 h-5" />
              <Waves className="w-5 h-5" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
