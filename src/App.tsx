import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshDistortMaterial, GradientTexture, Sphere, MeshRefractionMaterial, MeshTransmissionMaterial, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
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
  Anchor,
  Maximize,
  Sparkles
} from 'lucide-react';
import { User, Order, Product, Notification } from './types';
import { PRODUCTS, SEA_IMAGES } from './constants';

function Hero3D() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={3} rotationIntensity={2} floatIntensity={2}>
        <PerfumeBottle3D color="#94d2bd" />
      </Float>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

function Bubbles() {
  const count = 100;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#94d2bd" transparent opacity={0.3} />
    </instancedMesh>
  );
}

function PerfumeBottle3D({ color }: { color: string }) {
  const bottleRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (bottleRef.current) {
      bottleRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      bottleRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={bottleRef}>
      {/* Bottle Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
        <MeshTransmissionMaterial
          thickness={0.5}
          roughness={0.1}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.05}
          backside
          color={color}
        />
      </mesh>
      {/* Bottle Cap */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 32]} />
        <meshStandardMaterial color="#e9d8a6" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0, 0.51]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color="white" opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

function SeaBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group>
      <Environment preset="sunset" />
      <Bubbles />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[1.5, 64, 64]} position={[2, 1, -2]}>
          <MeshDistortMaterial
            color="#005f73"
            speed={3}
            distort={0.4}
            radius={1}
            opacity={0.4}
            transparent
          />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[1, 64, 64]} position={[-3, -2, -3]}>
          <MeshDistortMaterial
            color="#94d2bd"
            speed={2}
            distort={0.5}
            radius={1}
            opacity={0.3}
            transparent
          />
        </Sphere>
      </Float>

      <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, -5]}>
        <planeGeometry args={[20, 20, 32, 32]} />
        <MeshDistortMaterial
          color="#001219"
          speed={1}
          distort={0.2}
          radius={1}
        />
      </mesh>
    </group>
  );
}

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
    <div className="min-h-screen bg-[#001219] text-[#e9d8a6] font-sans selection:bg-[#94d2bd] selection:text-[#001219] overflow-x-hidden">
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas dpr={[1, 2]} performance={{ min: 0.5 }}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <SeaBackground />
        </Canvas>
      </div>

      {/* Immersive Background Image (4K) */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <img 
          src={SEA_IMAGES[0]} 
          alt="Sea Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001219]/90 via-transparent to-[#001219]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 backdrop-blur-xl border-b border-[#94d2bd]/10 sticky top-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          <Waves className="w-8 h-8 text-[#94d2bd] animate-pulse" />
          <h1 className="text-2xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-[#94d2bd] to-[#e9d8a6]">Coral Whisper</h1>
        </div>
        
        <div className="flex items-center gap-8">
          <button onClick={() => setView('home')} className="hover:text-[#94d2bd] transition-colors font-bold uppercase tracking-widest text-xs">Store</button>
          {user ? (
            <>
              {user.role === 'staff' && (
                <button onClick={() => setView('staff')} className="hover:text-[#94d2bd] transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                  <Bell className="w-4 h-4" /> Staff Portal
                </button>
              )}
              <button onClick={() => setView('orders')} className="hover:text-[#94d2bd] transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                <Package className="w-4 h-4" /> My Orders
              </button>
              <div className="flex items-center gap-4 bg-[#005f73]/40 px-4 py-2 rounded-full border border-[#94d2bd]/20 backdrop-blur-md">
                <UserIcon className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">{user.username}</span>
                <button onClick={() => setUser(null)} className="hover:text-red-400">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => setView('login')}
              className="bg-[#94d2bd] text-[#001219] px-8 py-2.5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-[0_0_20px_rgba(148,210,189,0.3)]"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-8 py-20">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-24"
            >
              <div className="text-center space-y-6 relative">
                {/* Hero 3D Bottle */}
                <div className="h-[400px] w-full mb-[-100px] relative z-0">
                  <Canvas dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 4]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Hero3D />
                  </Canvas>
                </div>

                <motion.h2 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-8xl font-black uppercase tracking-tighter text-[#94d2bd] leading-none relative z-10"
                >
                  The Essence <br /> of the Ocean
                </motion.h2>
                <p className="text-xl opacity-70 max-w-2xl mx-auto italic font-light relative z-10">Crafted for those who find peace in the waves. Our fragrances are a tribute to the deep blue, captured in 4K clarity.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {PRODUCTS.map((product, idx) => (
                  <motion.div 
                    key={product.id}
                    whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
                    className="bg-[#005f73]/10 rounded-[2.5rem] overflow-hidden border border-[#94d2bd]/10 group backdrop-blur-sm shadow-2xl perspective-1000 relative"
                  >
                    <div className="h-80 overflow-hidden relative">
                      {/* 3D Product Preview Overlay */}
                      <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#001219]/60 backdrop-blur-md">
                        <Canvas dpr={[1, 2]}>
                          <PerspectiveCamera makeDefault position={[0, 0, 3]} />
                          <ambientLight intensity={0.5} />
                          <pointLight position={[10, 10, 10]} intensity={1} />
                          <PerfumeBottle3D color={idx % 2 === 0 ? "#94d2bd" : "#005f73"} />
                        </Canvas>
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#94d2bd]">Interactive 3D View</span>
                        </div>
                      </div>

                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001219] via-transparent to-transparent opacity-80" />
                      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                        <div className="bg-[#94d2bd] text-[#001219] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Maximize className="w-3 h-3" /> 4K Ultra HD
                        </div>
                        <div className="bg-[#0a9396] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3 h-3" /> 3D Model
                        </div>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">{product.name}</h3>
                        <span className="text-[#94d2bd] font-mono text-xl font-bold">${product.price}</span>
                      </div>
                      <p className="text-sm opacity-60 line-clamp-2 font-light leading-relaxed">{product.description}</p>
                      <button 
                        onClick={() => setCart([...cart, product])}
                        className="w-full bg-[#0a9396] hover:bg-[#94d2bd] hover:text-[#001219] py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-lg"
                      >
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {cart.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed bottom-12 right-12 bg-[#94d2bd] text-[#001219] p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-[#005f73] min-w-[400px] z-[100] backdrop-blur-xl"
                >
                  <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-3 tracking-tighter">
                    <ShoppingBag className="w-8 h-8" /> Your Selection
                  </h3>
                  <div className="space-y-4 max-h-60 overflow-y-auto mb-8 pr-2 custom-scrollbar">
                    {cart.map((item, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-[#001219]/10 pb-3">
                        <span className="font-bold">{item.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold">${item.price}</span>
                          <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-red-600 hover:scale-125 transition-transform">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-2xl font-black mb-8 border-t-2 border-[#001219]/10 pt-4">
                    <span>Total</span>
                    <span>${cart.reduce((s, p) => s + p.price, 0)}</span>
                  </div>
                  <button 
                    onClick={placeOrder}
                    className="w-full bg-[#001219] text-[#94d2bd] py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#005f73] transition-all scale-100 hover:scale-[1.02] active:scale-95"
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto bg-[#005f73]/20 p-12 rounded-[4rem] border border-[#94d2bd]/20 backdrop-blur-2xl shadow-2xl"
            >
              <h2 className="text-5xl font-black uppercase mb-10 text-center tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-[#94d2bd] to-[#e9d8a6]">
                {view === 'login' ? 'Welcome Back' : 'Join the Voyage'}
              </h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 ml-4">Username</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#001219]/60 border border-[#94d2bd]/10 rounded-3xl px-8 py-5 focus:outline-none focus:border-[#94d2bd] transition-all focus:ring-4 focus:ring-[#94d2bd]/10"
                    value={authForm.username}
                    onChange={e => setAuthForm({...authForm, username: e.target.value})}
                  />
                </div>
                {view === 'register' && (
                  <>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 ml-4">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full bg-[#001219]/60 border border-[#94d2bd]/10 rounded-3xl px-8 py-5 focus:outline-none focus:border-[#94d2bd] transition-all focus:ring-4 focus:ring-[#94d2bd]/10"
                        value={authForm.email}
                        onChange={e => setAuthForm({...authForm, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 ml-4">Priority Region</label>
                      <select 
                        className="w-full bg-[#001219]/60 border border-[#94d2bd]/10 rounded-3xl px-8 py-5 focus:outline-none focus:border-[#94d2bd] transition-all appearance-none cursor-pointer"
                        value={authForm.country}
                        onChange={e => setAuthForm({...authForm, country: e.target.value})}
                      >
                        <option value="Pakistan">Pakistan (Priority 1)</option>
                        <option value="International">Other Countries (Priority 2)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 ml-4">Account Type</label>
                      <div className="flex gap-4 p-1 bg-[#001219]/40 rounded-3xl border border-[#94d2bd]/10">
                        <button 
                          onClick={() => setAuthForm({...authForm, role: 'customer'})}
                          className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${authForm.role === 'customer' ? 'bg-[#94d2bd] text-[#001219] shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                        >
                          Customer
                        </button>
                        <button 
                          onClick={() => setAuthForm({...authForm, role: 'staff'})}
                          className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${authForm.role === 'staff' ? 'bg-[#94d2bd] text-[#001219] shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                        >
                          Staff
                        </button>
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 ml-4">Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-[#001219]/60 border border-[#94d2bd]/10 rounded-3xl px-8 py-5 focus:outline-none focus:border-[#94d2bd] transition-all focus:ring-4 focus:ring-[#94d2bd]/10"
                    value={authForm.password}
                    onChange={e => setAuthForm({...authForm, password: e.target.value})}
                  />
                </div>
                <button 
                  onClick={() => handleAuth(view as 'login' | 'register')}
                  disabled={loading}
                  className="w-full bg-[#94d2bd] text-[#001219] py-6 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-[0_10px_30px_rgba(148,210,189,0.2)]"
                >
                  {loading ? 'Processing...' : view === 'login' ? 'Enter Store' : 'Create Account'}
                </button>
                <p className="text-center text-xs opacity-50 tracking-widest uppercase">
                  {view === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => setView(view === 'login' ? 'register' : 'login')}
                    className="ml-2 text-[#94d2bd] font-black underline"
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
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <h2 className="text-6xl font-black uppercase tracking-tighter text-[#94d2bd]">Your Voyage History</h2>
              <div className="grid gap-8">
                {orders.length === 0 ? (
                  <div className="text-center py-32 bg-[#005f73]/10 rounded-[4rem] border-2 border-dashed border-[#94d2bd]/20 backdrop-blur-sm">
                    <Anchor className="w-20 h-20 mx-auto mb-6 opacity-10 animate-bounce" />
                    <p className="text-xl opacity-40 italic font-light">No orders found. Start your journey in the store.</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <motion.div 
                      key={order.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#005f73]/10 p-10 rounded-[3rem] border border-[#94d2bd]/10 flex flex-col md:flex-row justify-between items-center gap-8 backdrop-blur-md hover:border-[#94d2bd]/30 transition-all group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono opacity-40 bg-[#001219] px-3 py-1 rounded-full">{order.id}</span>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-3xl font-black uppercase tracking-tighter">{order.items.length} Fragrances Selected</p>
                        <p className="text-sm opacity-40 font-mono uppercase">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <div className="flex items-center gap-12">
                        <span className="text-4xl font-black text-[#94d2bd] tracking-tighter">${order.total}</span>
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => cancelOrder(order.id)}
                            className="bg-red-500/10 text-red-400 border border-red-500/20 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all shadow-lg"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {view === 'staff' && (
            <motion.div 
              key="staff"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto space-y-16"
            >
              <div className="bg-gradient-to-br from-[#94d2bd] to-[#e9d8a6] text-[#001219] p-16 rounded-[4rem] space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Waves className="w-40 h-40" />
                </div>
                <h2 className="text-6xl font-black uppercase tracking-tighter leading-none relative z-10">Staff Command <br /> Center</h2>
                <div className="space-y-6 relative z-10">
                  <label className="text-xs font-black uppercase tracking-[0.3em] opacity-60 ml-2">Broadcast Sale Notification</label>
                  <textarea 
                    className="w-full bg-[#001219]/10 border-2 border-[#001219]/10 rounded-[2.5rem] p-8 focus:outline-none focus:border-[#001219] transition-all min-h-[200px] placeholder:text-[#001219]/30 text-xl font-medium"
                    placeholder="Enter your message for the customers..."
                    value={staffMessage}
                    onChange={e => setStaffMessage(e.target.value)}
                  />
                  <button 
                    onClick={sendNotification}
                    className="bg-[#001219] text-[#94d2bd] px-16 py-6 rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl"
                  >
                    Deploy Notification
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-3xl font-black uppercase flex items-center gap-4 tracking-tighter">
                  <Bell className="text-[#94d2bd] w-10 h-10" /> Recent Broadcasts
                </h3>
                <div className="grid gap-6">
                  {notifications.map(n => (
                    <motion.div 
                      key={n.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-[#005f73]/10 p-8 rounded-3xl border border-[#94d2bd]/10 backdrop-blur-sm"
                    >
                      <p className="text-xl mb-4 font-medium leading-relaxed">{n.message}</p>
                      <span className="text-[10px] opacity-30 font-black uppercase tracking-[0.2em]">{new Date(n.createdAt).toLocaleString()}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Notifications Overlay for Customers */}
      {user?.role === 'customer' && notifications.length > 0 && (
        <div className="fixed top-28 right-12 z-[100] w-96 space-y-6">
          {notifications.slice(-3).map(n => (
            <motion.div 
              key={n.id}
              initial={{ x: 200, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              className="bg-[#94d2bd] text-[#001219] p-8 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-l-[12px] border-[#005f73] backdrop-blur-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Sale Alert</span>
                <Bell className="w-4 h-4" />
              </div>
              <p className="text-lg font-black leading-tight">{n.message}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-40 border-t border-[#94d2bd]/10 py-20 px-8 bg-[#001219]/90 backdrop-blur-3xl">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Waves className="w-10 h-10 text-[#94d2bd]" />
              <h4 className="text-3xl font-black uppercase italic tracking-tighter">Coral Whisper</h4>
            </div>
            <p className="opacity-40 text-sm leading-loose font-light max-w-sm">
              The world's first high-performance fragrance platform, designed to handle 2000 orders per 30 seconds with absolute precision and 4K visual fidelity.
            </p>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#94d2bd]">Global Priority</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-2xl bg-[#94d2bd]/10 flex items-center justify-center group-hover:bg-[#94d2bd] transition-colors">
                  <Globe className="w-5 h-5 text-[#94d2bd] group-hover:text-[#001219]" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">1. Pakistan</p>
                  <p className="text-[10px] opacity-40 uppercase">Primary Logistics Hub</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group opacity-40 hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-2xl bg-[#94d2bd]/10 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">2. International</p>
                  <p className="text-[10px] opacity-40 uppercase">Secondary Markets</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 text-right">
            <div className="space-y-2">
              <p className="text-xs font-black tracking-[0.3em] uppercase opacity-40">Architected By</p>
              <p className="text-4xl font-black uppercase tracking-tighter text-[#94d2bd]">Moiz Iqbal</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black tracking-[0.3em] uppercase opacity-40">Direct Contact</p>
              <p className="text-[#e9d8a6] font-mono text-lg font-bold">mouzmughal@gmail.com</p>
            </div>
            <div className="flex justify-end gap-6 opacity-20">
              <Anchor className="w-8 h-8 hover:opacity-100 transition-opacity cursor-pointer" />
              <Waves className="w-8 h-8 hover:opacity-100 transition-opacity cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-10 border-t border-[#94d2bd]/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">© 2026 Coral Whisper Fragrance | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
