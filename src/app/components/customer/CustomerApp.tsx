import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Search, Clock, Star, ChevronLeft, Phone, MessageSquare,
  Shield, Navigation, X, Check, Copy, Share2, Download, Home,
  ChevronRight, Plus, Gift, User, Wallet, Award, Bell, Menu,
  AlertTriangle, Car, Zap, Bike, CheckCircle, QrCode, CreditCard,
  Smartphone, Users, Camera, Edit, LogOut, HelpCircle, TrendingUp,
  ArrowUpRight, ArrowDownLeft, MoreVertical
} from 'lucide-react';
import { MapView } from '../MapView';
import logoImage from '@/assets/25a5bd8011d7696bf02e1d5cc818a54ef634abf4.png';

const G = '#D4AF37';
const DARK = '#0F1C2E';
const NAVY = '#1E3A5F';
const GLASS = 'rgba(255,255,255,0.06)';
const GLASS_BORDER = 'rgba(255,255,255,0.1)';

type Screen =
  | 'splash' | 'onboarding' | 'login' | 'otp'
  | 'home' | 'location-search' | 'ride-options' | 'fare-summary'
  | 'confirm-ride' | 'driver-assigned' | 'live-tracking'
  | 'payment' | 'rating' | 'ride-history' | 'wallet'
  | 'profile' | 'rewards' | 'refer-earn';

const getMatchedDriver = () => {
  try {
    const approved = JSON.parse(localStorage.getItem("saaradhigo_approved_drivers") || "[]");
    if (approved && approved.length > 0) {
      const latest = approved[approved.length - 1];
      return {
        name: latest.name || "Pavan",
        vehicle: `${latest.vehicle_model || 'Swift Dzire'} · ${latest.plate || 'KA 05 MC 4892'}`,
        phone: latest.phone_number || "+91 98765 43210"
      };
    }
  } catch (e) {
    console.error("Error reading approved drivers", e);
  }
  return { name: "Pavan", vehicle: "Swift Dzire · KA 05 MC 4892", phone: "+91 98765 43210" };
};

const BOTTOM_NAV_SCREENS: Screen[] = ['home', 'ride-history', 'wallet', 'profile', 'rewards'];

function GoldButton({ label, onClick, style }: { label: string; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-95"
      style={{ background: `linear-gradient(135deg, #D4AF37, #B8962E)`, color: DARK, boxShadow: '0 4px 20px rgba(212,175,55,0.4)', ...style }}
    >
      {label}
    </button>
  );
}

function GlassCard({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: GLASS, backdropFilter: 'blur(12px)', border: `1px solid ${GLASS_BORDER}`, ...style }}
    >
      {children}
    </div>
  );
}

function BackHeader({ title, navigate, to }: { title: string; navigate: (s: Screen) => void; to: Screen }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-16 pb-4">
      <button
        onClick={() => navigate(to)}
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}
      >
        <ChevronLeft size={20} color="white" />
      </button>
      <span className="text-white font-semibold text-lg">{title}</span>
    </div>
  );
}

function BottomNav({ current, navigate }: { current: Screen; navigate: (s: Screen) => void }) {
  const items = [
    { id: 'home' as Screen, icon: Home, label: 'Home' },
    { id: 'ride-history' as Screen, icon: Clock, label: 'Rides' },
    { id: 'wallet' as Screen, icon: Wallet, label: 'Wallet' },
    { id: 'rewards' as Screen, icon: Award, label: 'Rewards' },
    { id: 'profile' as Screen, icon: User, label: 'Profile' },
  ];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 pt-3 pb-8"
      style={{ background: `linear-gradient(to top, #0A1628, ${DARK})`, borderTop: `1px solid ${GLASS_BORDER}` }}
    >
      {items.map(item => {
        const active = current === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <item.icon size={22} color={active ? G : 'rgba(255,255,255,0.4)'} />
            <span className="text-[10px]" style={{ color: active ? G : 'rgba(255,255,255,0.4)' }}>{item.label}</span>
            {active && <div className="w-1 h-1 rounded-full" style={{ background: G }} />}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────── SPLASH ─────────── */
function SplashScreen({ navigate }: { navigate: (s: Screen) => void }) {
  useEffect(() => {
    const t = setTimeout(() => navigate('onboarding'), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(180deg, #050D1A 0%, ${DARK} 50%, ${NAVY} 100%)` }}>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, type: 'spring' }}>
        <div className="w-40 h-40 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(212,175,55,0.08)', boxShadow: '0 0 60px rgba(212,175,55,0.3)' }}>
          <img src={logoImage} alt="SaaradhiGO" className="w-32 h-32 object-contain" />
        </div>
      </motion.div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-center">
        <h1 className="text-3xl font-bold mb-1" style={{ color: G, fontFamily: 'Inter, sans-serif', letterSpacing: 2 }}>SAARADHI GO</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Premium Ride Experience</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-20 flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: G }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} />
        ))}
      </motion.div>
      <p className="absolute bottom-10 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Guided by Excellence</p>
    </div>
  );
}

/* ─────────── ONBOARDING ─────────── */
function OnboardingScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [page, setPage] = useState(0);
  const slides = [
    { emoji: '🗺️', icon: '🚀', title: 'Travel in Luxury', desc: 'Premium rides at your fingertips. Experience comfort like never before with SaaradhiGO.', bg: '#0F1C2E' },
    { emoji: '📍', icon: '🔴', title: 'Track in Real-Time', desc: 'Live GPS tracking of your ride. Know exactly where your driver is and when they\'ll arrive.', bg: '#0F1C2E' },
    { emoji: '🛡️', icon: '✅', title: 'Safe & Secure', desc: 'Your safety is our priority. SOS alerts, verified drivers and 24/7 support always with you.', bg: '#0F1C2E' },
  ];
  const s = slides[page];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #050D1A 0%, ${DARK} 100%)` }}>
      <div className="flex justify-end px-5 pt-16">
        <button onClick={() => navigate('login')} className="text-sm px-4 py-2 rounded-full" style={{ color: 'rgba(255,255,255,0.5)', background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>Skip</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.35 }} className="flex flex-col items-center text-center">
            <div className="w-48 h-48 rounded-full flex items-center justify-center mb-8" style={{ background: 'rgba(212,175,55,0.08)', border: '2px solid rgba(212,175,55,0.2)', boxShadow: '0 0 50px rgba(212,175,55,0.15)' }}>
              <span className="text-7xl">{s.emoji}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{s.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-8 pb-12">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300"
              style={{ width: i === page ? 24 : 8, height: 8, background: i === page ? G : 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>
        <GoldButton
          label={page < 2 ? 'Next →' : 'Get Started'}
          onClick={() => page < 2 ? setPage(p => p + 1) : navigate('login')}
        />
      </div>
    </div>
  );
}

/* ─────────── LOGIN ─────────── */
function LoginScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [phone, setPhone] = useState('');
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #050D1A 0%, ${DARK} 100%)` }}>
      <div className="flex justify-center pt-16 pb-8">
        <img src={logoImage} alt="Logo" className="h-20 object-contain" />
      </div>
      <div className="flex-1 px-6">
        <h2 className="text-2xl font-bold text-white mb-1">Welcome Back 👋</h2>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Enter your phone number to continue</p>

        <GlassCard className="flex items-center gap-3 px-4 py-4 mb-4">
          <div className="flex items-center gap-2 pr-3" style={{ borderRight: '1px solid rgba(255,255,255,0.15)' }}>
            <span className="text-lg">🇮🇳</span>
            <span className="text-white text-sm font-medium">+91</span>
            <ChevronRight size={14} color={G} />
          </div>
          <input
            type="tel"
            placeholder="Enter mobile number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="bg-transparent text-white text-base outline-none flex-1 placeholder:text-white/30"
          />
        </GlassCard>

        <GoldButton label="Send OTP" onClick={() => navigate('otp')} style={{ marginBottom: 24 }} />

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>or continue with</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <div className="flex gap-3">
          {[
            { label: 'Google', icon: '🌐' },
            { label: 'Apple', icon: '🍎' },
          ].map(p => (
            <button key={p.label} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl"
              style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
              <span className="text-xl">{p.icon}</span>
              <span className="text-white text-sm font-medium">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-xs pb-8 px-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
        By continuing, you agree to our <span style={{ color: G }}>Terms</span> & <span style={{ color: G }}>Privacy Policy</span>
      </p>
    </div>
  );
}

/* ─────────── OTP ─────────── */
function OTPScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const next = [...otp];
    next[i] = v.slice(-1);
    setOtp(next);
    if (v && i < 5) refs[i + 1]?.current?.focus();
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #050D1A 0%, ${DARK} 100%)` }}>
      <BackHeader title="Verify OTP" navigate={navigate} to="login" />
      <div className="flex-1 px-6 pt-4">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '2px solid rgba(212,175,55,0.3)' }}>
            <span className="text-4xl">📱</span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-white text-center mb-2">Enter Verification Code</h2>
        <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Sent to +91 98765 43210
        </p>
        <div className="flex justify-between gap-2 mb-8">
          {otp.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              className="flex-1 h-14 text-center text-xl font-bold rounded-xl outline-none text-white transition-all"
              style={{
                background: d ? 'rgba(212,175,55,0.12)' : GLASS,
                border: d ? `2px solid ${G}` : `1px solid ${GLASS_BORDER}`,
                boxShadow: d ? '0 0 12px rgba(212,175,55,0.25)' : 'none',
              }}
            />
          ))}
        </div>
        <GoldButton label="Verify & Continue" onClick={() => navigate('home')} style={{ marginBottom: 20 }} />
        <div className="text-center">
          {timer > 0 ? (
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Resend in <span style={{ color: G }}>00:{timer.toString().padStart(2, '0')}</span>
            </p>
          ) : (
            <button className="text-sm font-medium" style={{ color: G }} onClick={() => setTimer(30)}>Resend OTP</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── HOME ─────────── */
function HomeScreen({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <MapView showDrivers height="100%" />
      <div className="absolute inset-0 flex flex-col pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(8,16,28,0.7) 0%, transparent 35%, transparent 60%, rgba(8,16,28,0.95) 100%)' }}>

        {/* Top bar */}
        <div className="pointer-events-auto flex items-center justify-between px-5 pt-16 pb-2">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Logo" className="h-8 w-8 object-contain" />
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Good Morning 👋</p>
              <p className="text-sm font-semibold text-white">Arjun Kumar</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}`, backdropFilter: 'blur(12px)' }}>
              <Bell size={18} color="white" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}`, backdropFilter: 'blur(12px)' }}>
              <Menu size={18} color="white" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="pointer-events-auto px-5 mt-2">
          <button onClick={() => navigate('location-search')}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)' }}>
            <Search size={18} color={DARK} />
            <span className="text-sm" style={{ color: 'rgba(15,28,46,0.6)' }}>Where are you going?</span>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom panel */}
        <div className="pointer-events-auto px-5 pb-24">
          {/* Quick access */}
          <div className="flex gap-3 mb-4">
            {[{ label: 'Home', icon: '🏠' }, { label: 'Work', icon: '💼' }, { label: 'Saved', icon: '❤️' }].map(q => (
              <button key={q.label} onClick={() => navigate('location-search')}
                className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}`, backdropFilter: 'blur(12px)' }}>
                <span className="text-base">{q.icon}</span>
                <span className="text-xs text-white font-medium">{q.label}</span>
              </button>
            ))}
          </div>

          {/* Wallet + Book */}
          <div className="flex gap-3 mb-4">
            <GlassCard className="flex items-center gap-2 px-4 py-3 flex-1" style={{ backdropFilter: 'blur(16px)' }}>
              <Wallet size={18} color={G} />
              <div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Wallet</p>
                <p className="text-sm font-bold" style={{ color: G }}>₹482.50</p>
              </div>
            </GlassCard>
            <button onClick={() => navigate('location-search')}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm active:scale-95"
              style={{ background: `linear-gradient(135deg, ${G}, #B8962E)`, color: DARK, boxShadow: '0 4px 20px rgba(212,175,55,0.4)' }}>
              <Car size={18} />
              Book a Ride
            </button>
          </div>
        </div>
      </div>

      <BottomNav current="home" navigate={navigate} />
    </div>
  );
}

/* ─────────── LOCATION SEARCH ─────────── */
function LocationSearchScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [from, setFrom] = useState('Current Location');
  const [to, setTo] = useState('');
  const recents = [
    { name: 'Phoenix Mall', sub: 'Whitefield, Bengaluru', emoji: '🛍️' },
    { name: 'Kempegowda Airport', sub: 'Devanahalli, Bengaluru', emoji: '✈️' },
    { name: 'Cubbon Park', sub: 'Central Bengaluru', emoji: '🌳' },
    { name: 'Indiranagar 100 ft', sub: 'Indiranagar, Bengaluru', emoji: '🍽️' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      {/* Search inputs */}
      <div className="px-5 pt-16 pb-4" style={{ background: `linear-gradient(180deg, #050D1A, ${DARK})` }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
            <ChevronLeft size={20} color="white" />
          </button>
          <div className="flex-1">
            <GlassCard className="px-4 py-3 flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: G }} />
              <input value={from} onChange={e => setFrom(e.target.value)}
                className="bg-transparent text-white text-sm outline-none flex-1 placeholder:text-white/30"
                placeholder="From" />
            </GlassCard>
            <GlassCard className="px-4 py-3 flex items-center gap-3">
              <MapPin size={12} color={G} className="flex-shrink-0" />
              <input value={to} onChange={e => setTo(e.target.value)}
                className="bg-transparent text-white text-sm outline-none flex-1 placeholder:text-white/30"
                placeholder="Where to?" autoFocus />
            </GlassCard>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="flex gap-3">
          {[{ label: 'Home', icon: '🏠', addr: 'Koramangala' }, { label: 'Work', icon: '💼', addr: 'MG Road' }].map(s => (
            <button key={s.label} onClick={() => navigate('ride-options')}
              className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.2)` }}>
              <span>{s.icon}</span>
              <div className="text-left">
                <p className="text-xs font-semibold text-white">{s.label}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.addr}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map strip */}
      <div className="h-32 relative overflow-hidden">
        <MapView height="128px" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(15,28,46,0.8))' }} />
      </div>

      {/* Recent locations */}
      <div className="flex-1 overflow-y-auto px-5 pt-4">
        <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Recent</p>
        {recents.map((r, i) => (
          <button key={i} onClick={() => navigate('ride-options')}
            className="w-full flex items-center gap-4 py-3.5 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
              <span className="text-lg">{r.emoji}</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">{r.name}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{r.sub}</p>
            </div>
            <Clock size={14} color="rgba(255,255,255,0.3)" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────── RIDE OPTIONS ─────────── */
function RideOptionsScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState(2);
  const rides = [
    { id: 0, name: 'Bike', icon: '🏍️', eta: '3 min', price: '₹65', cap: 1, desc: 'Quick & affordable' },
    { id: 1, name: 'Auto', icon: '🛺', eta: '5 min', price: '₹120', cap: 3, desc: 'Comfortable & open' },
    { id: 2, name: 'Mini', icon: '🚗', eta: '4 min', price: '₹189', cap: 4, desc: 'Compact AC car' },
    { id: 3, name: 'Prime', icon: '🚘', eta: '7 min', price: '₹285', cap: 4, desc: 'Luxury sedan' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      {/* Mini map */}
      <div className="h-56 relative">
        <MapView showRoute height="224px" />
        <div className="absolute top-16 left-5">
          <button onClick={() => navigate('location-search')}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(15,28,46,0.9)', border: `1px solid ${GLASS_BORDER}` }}>
            <ChevronLeft size={20} color="white" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: `linear-gradient(to top, ${DARK}, transparent)` }} />
      </div>

      {/* Route info */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: G }} />
          <span className="text-xs text-white">Koramangala</span>
          <div className="flex-1 h-px mx-2" style={{ background: `linear-gradient(to right, ${G}, rgba(212,175,55,0.2))` }} />
          <MapPin size={12} color={G} />
          <span className="text-xs text-white">Indiranagar</span>
        </div>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>5.2 km · ~18 mins</p>
      </div>

      {/* Ride cards */}
      <div className="flex-1 overflow-y-auto px-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Select a Ride</p>
        {rides.map(r => (
          <button key={r.id} onClick={() => setSelected(r.id)}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all"
            style={{
              background: selected === r.id ? 'rgba(212,175,55,0.1)' : GLASS,
              border: selected === r.id ? `2px solid ${G}` : `1px solid ${GLASS_BORDER}`,
              boxShadow: selected === r.id ? '0 4px 20px rgba(212,175,55,0.2)' : 'none',
            }}>
            <span className="text-3xl">{r.icon}</span>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{r.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>{r.cap} 👤</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{r.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold" style={{ color: G }}>{r.price}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{r.eta}</p>
            </div>
            {selected === r.id && <CheckCircle size={18} color={G} />}
          </button>
        ))}
      </div>

      <div className="px-5 pt-3 pb-24">
        <GoldButton label={`Book ${rides[selected].name} · ${rides[selected].price}`} onClick={() => navigate('fare-summary')} />
      </div>
      <BottomNav current="home" navigate={navigate} />
    </div>
  );
}

/* ─────────── FARE SUMMARY ─────────── */
function FareSummaryScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [coupon, setCoupon] = useState('');
  const fare = [
    { label: 'Base Fare', value: '₹50' },
    { label: 'Distance (5.2 km)', value: '₹104' },
    { label: 'Time Charge', value: '₹18' },
    { label: 'Platform Fee', value: '₹5' },
    { label: 'GST (5%)', value: '₹8.85' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      <BackHeader title="Fare Breakdown" navigate={navigate} to="ride-options" />
      <div className="flex-1 overflow-y-auto px-5 space-y-4">
        {/* Route card */}
        <GlassCard className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-3 h-3 rounded-full" style={{ background: G }} />
              <div className="w-0.5 h-8" style={{ background: 'rgba(212,175,55,0.3)' }} />
              <MapPin size={14} color={G} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Koramangala 6th Block</p>
              <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>Pickup point</p>
              <p className="text-sm font-medium text-white">Indiranagar 100 Feet Road</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Drop point</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)', color: G }}>🚗 Mini</span>
          </div>
        </GlassCard>

        {/* Fare breakdown */}
        <GlassCard className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Fare Details</p>
          {fare.map((f, i) => (
            <div key={i} className="flex justify-between py-2.5" style={{ borderBottom: i < fare.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{f.label}</span>
              <span className="text-sm font-medium text-white">{f.value}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 mt-2" style={{ borderTop: `1px solid rgba(212,175,55,0.3)` }}>
            <span className="text-base font-bold text-white">Total</span>
            <span className="text-base font-bold" style={{ color: G }}>₹185.85</span>
          </div>
        </GlassCard>

        {/* Surge notice */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,170,0,0.08)', border: '1px solid rgba(255,170,0,0.2)' }}>
          <Zap size={14} color="#FFAA00" />
          <p className="text-xs" style={{ color: '#FFAA00' }}>1.2x surge pricing active in your area</p>
        </div>

        {/* Coupon */}
        <GlassCard className="flex items-center gap-3 px-4 py-3">
          <Gift size={18} color={G} />
          <input value={coupon} onChange={e => setCoupon(e.target.value)}
            className="bg-transparent text-sm text-white flex-1 outline-none placeholder:text-white/30"
            placeholder="Enter coupon code" />
          <button className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ color: DARK, background: G }}>Apply</button>
        </GlassCard>
      </div>

      <div className="px-5 pt-3 pb-24">
        <GoldButton label="Continue to Confirm →" onClick={() => navigate('confirm-ride')} />
      </div>
      <BottomNav current="home" navigate={navigate} />
    </div>
  );
}

/* ─────────── CONFIRM RIDE ─────────── */
function ConfirmRideScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [payment, setPayment] = useState('wallet');
  const methods = [
    { id: 'wallet', label: 'Wallet', sub: '₹482.50 available', icon: '💰' },
    { id: 'upi', label: 'UPI', sub: 'Google Pay, PhonePe', icon: '📲' },
    { id: 'card', label: 'Card', sub: 'Visa •••• 4242', icon: '💳' },
    { id: 'cash', label: 'Cash', sub: 'Pay driver directly', icon: '💵' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      <BackHeader title="Confirm Ride" navigate={navigate} to="fare-summary" />
      <div className="flex-1 overflow-y-auto px-5 space-y-4">
        {/* Summary */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🚗</span>
            <div>
              <p className="text-sm font-bold text-white">Mini · 4 Seater</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>ETA: 4 mins · 2 drivers nearby</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-lg font-bold" style={{ color: G }}>₹186</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Estimated</p>
            </div>
          </div>
          <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: G }} />
              <p className="text-sm text-white">Koramangala 6th Block</p>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={10} color={G} className="flex-shrink-0 ml-[1px]" />
              <p className="text-sm text-white">Indiranagar 100 Feet Road</p>
            </div>
          </div>
        </GlassCard>

        {/* Payment */}
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Payment Method</p>
        <div className="space-y-2">
          {methods.map(m => (
            <button key={m.id} onClick={() => setPayment(m.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{
                background: payment === m.id ? 'rgba(212,175,55,0.1)' : GLASS,
                border: payment === m.id ? `2px solid ${G}` : `1px solid ${GLASS_BORDER}`,
              }}>
              <span className="text-xl">{m.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">{m.label}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{m.sub}</p>
              </div>
              {payment === m.id && <CheckCircle size={16} color={G} />}
            </button>
          ))}
        </div>

        {/* Safety */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(0,200,100,0.06)', border: '1px solid rgba(0,200,100,0.15)' }}>
          <Shield size={14} color="#00C864" />
          <p className="text-xs" style={{ color: '#00C864' }}>Your ride is insured & driver is verified</p>
        </div>
      </div>

      <div className="px-5 pt-3 pb-24">
        <GoldButton label="🚗  Confirm Ride" onClick={() => navigate('driver-assigned')} />
      </div>
      <BottomNav current="home" navigate={navigate} />
    </div>
  );
}

/* ─────────── DRIVER ASSIGNED ─────────── */
function DriverAssignedScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const driver = getMatchedDriver();
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      {/* Mini map */}
      <div className="relative h-52">
        <MapView showRoute height="208px" />
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: `linear-gradient(to top, ${DARK}, transparent)` }} />
        <div className="absolute top-16 right-5">
          <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(220,40,40,0.15)', border: '1px solid rgba(220,40,40,0.3)' }}>
            <X size={18} color="#FF4444" />
          </button>
        </div>
      </div>

      {/* ETA Banner */}
      <div className="mx-5 -mt-4 px-4 py-3 rounded-xl flex items-center gap-3 z-10" style={{ background: `linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))`, border: `1px solid rgba(212,175,55,0.3)` }}>
        <Navigation size={16} color={G} />
        <p className="text-sm font-medium text-white">Driver arriving in <span style={{ color: G }}>4 minutes</span></p>
        <div className="ml-auto">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00C864' }} />
        </div>
      </div>

      {/* Driver card */}
      <div className="flex-1 px-5 pt-4 space-y-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden" style={{ border: `2px solid ${G}` }}>
                <img src="https://images.unsplash.com/photo-1604343670513-af01df1260a1?w=200&h=200&fit=crop" className="w-full h-full object-cover" alt="Driver" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#00C864' }}>
                <Check size={10} color="white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-white">{driver.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={12} fill={G} color={G} />
                <span className="text-sm font-medium" style={{ color: G }}>4.8</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>· 2,340 rides</span>
              </div>
              <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{driver.vehicle}</p>
            </div>
          </div>

          {/* OTP */}
          <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.25)` }}>
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Share OTP with driver</p>
              <p className="text-2xl font-bold tracking-widest mt-0.5" style={{ color: G }}>7 3 8 4</p>
            </div>
            <Shield size={24} color={G} />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl"
              style={{ background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.25)' }}>
              <Phone size={16} color="#00C864" />
              <span className="text-sm font-medium" style={{ color: '#00C864' }}>Call</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl"
              style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
              <MessageSquare size={16} color={G} />
              <span className="text-sm font-medium" style={{ color: G }}>Chat</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl"
              style={{ background: 'rgba(220,40,40,0.1)', border: '1px solid rgba(220,40,40,0.25)' }}>
              <AlertTriangle size={16} color="#FF4444" />
              <span className="text-sm font-medium" style={{ color: '#FF4444' }}>SOS</span>
            </button>
          </div>
        </GlassCard>
      </div>

      <div className="px-5 pb-8">
        <GoldButton label="Track Live →" onClick={() => navigate('live-tracking')} />
      </div>
    </div>
  );
}

/* ─────────── LIVE TRACKING ─────────── */
function LiveTrackingScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const driver = getMatchedDriver();
  return (
    <div className="absolute inset-0">
      <MapView showRoute showDrivers height="100%" />

      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(8,16,28,0.8), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(8,16,28,1), rgba(8,16,28,0.5), transparent)' }} />

      {/* Top bar */}
      <div className="absolute top-16 left-5 right-5 flex items-center justify-between">
        <GlassCard className="px-4 py-2.5 flex items-center gap-2" style={{ backdropFilter: 'blur(16px)' }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00C864' }} />
          <span className="text-xs font-medium text-white">Live Tracking</span>
        </GlassCard>
        <button className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(220,40,40,0.15)', border: '1px solid rgba(220,40,40,0.35)', backdropFilter: 'blur(12px)' }}>
          <AlertTriangle size={18} color="#FF4444" />
        </button>
      </div>

      {/* ETA chip */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-10">
        <div className="px-5 py-3 rounded-full shadow-lg" style={{ background: `linear-gradient(135deg, ${G}, #B8962E)`, boxShadow: '0 4px 20px rgba(212,175,55,0.5)' }}>
          <p className="text-xs font-bold" style={{ color: DARK }}>ETA: 12 mins</p>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 space-y-3">
        <GlassCard className="p-4" style={{ backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: `2px solid ${G}` }}>
              <img src="https://images.unsplash.com/photo-1604343670513-af01df1260a1?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="Driver" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{driver.name}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>KA 05 MC 4892 · Swift Dzire</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,200,100,0.15)', border: '1px solid rgba(0,200,100,0.25)' }}>
                <Phone size={16} color="#00C864" />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
                <MessageSquare size={16} color={G} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <MapPin size={12} color={G} />
            <p className="text-xs text-white flex-1">Heading to Indiranagar 100 Feet Road</p>
            <span className="text-xs font-bold" style={{ color: G }}>5.2 km left</span>
          </div>
        </GlassCard>

        <div className="flex gap-3">
          <button onClick={() => navigate('home')} className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(220,40,40,0.1)', border: '1px solid rgba(220,40,40,0.25)', color: '#FF6666' }}>
            Cancel Ride
          </button>
          <button className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(220,40,40,0.8)', color: 'white' }}
            onClick={() => navigate('payment')}>
            🚨 SOS
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── PAYMENT ─────────── */
function PaymentScreen({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      <div className="px-5 pt-16 pb-4 flex items-center justify-between">
        <div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Trip Completed 🎉</p>
          <h2 className="text-xl font-bold text-white">Payment Receipt</h2>
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,200,100,0.15)', border: '1px solid rgba(0,200,100,0.3)' }}>
          <CheckCircle size={24} color="#00C864" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-4">
        {/* Fare summary */}
        <GlassCard className="p-5">
          <div className="text-center mb-4">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Total Amount Paid</p>
            <p className="text-4xl font-bold mt-1" style={{ color: G }}>₹186</p>
          </div>
          <div className="space-y-2.5">
            {[['Base Fare', '₹50'], ['Distance (5.2 km)', '₹104'], ['Platform Fee', '₹5'], ['GST', '₹8.85'], ['Discount', '-₹0']].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{l}</span>
                <span className="text-sm text-white">{v}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Trip details */}
        <GlassCard className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Trip Details</p>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Duration</span><span className="text-sm text-white">22 mins</span></div>
            <div className="flex justify-between"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Distance</span><span className="text-sm text-white">5.2 km</span></div>
            <div className="flex justify-between"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Payment</span><span className="text-sm text-white">💰 Wallet</span></div>
          </div>
        </GlassCard>

        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl"
          style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
          <Download size={16} color={G} />
          <span className="text-sm font-medium" style={{ color: G }}>Download Invoice</span>
        </button>
      </div>

      <div className="px-5 pt-3 pb-8 space-y-3">
        <GoldButton label="Rate Your Experience" onClick={() => navigate('rating')} />
        <button onClick={() => navigate('home')} className="w-full py-3 rounded-xl text-sm"
          style={{ color: 'rgba(255,255,255,0.5)' }}>Back to Home</button>
      </div>
    </div>
  );
}

/* ─────────── RATING ─────────── */
function RatingScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const driver = getMatchedDriver();
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const allTags = ['Great Driver', 'Clean Car', 'On Time', 'Safe Driving', 'Friendly', 'AC Working'];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      <div className="flex justify-center pt-16 pb-6">
        <img src={logoImage} alt="Logo" className="h-10 object-contain" />
      </div>
      <div className="flex-1 overflow-y-auto px-6">
        <h2 className="text-xl font-bold text-white text-center mb-1">How was your trip?</h2>
        <p className="text-sm text-center mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>With {driver.name}</p>

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <button key={i} onClick={() => setStars(i)}>
              <Star size={40} fill={i <= stars ? G : 'transparent'} color={i <= stars ? G : 'rgba(255,255,255,0.2)'} />
            </button>
          ))}
        </div>

        {/* Tags */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Quick Tags</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {allTags.map(t => (
            <button key={t} onClick={() => setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: tags.includes(t) ? 'rgba(212,175,55,0.2)' : GLASS,
                border: tags.includes(t) ? `1px solid ${G}` : `1px solid ${GLASS_BORDER}`,
                color: tags.includes(t) ? G : 'rgba(255,255,255,0.7)',
              }}>
              {t}
            </button>
          ))}
        </div>

        {/* Feedback */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Tell us more</p>
        <GlassCard>
          <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
            placeholder="Share your experience..."
            className="w-full bg-transparent text-white text-sm p-4 outline-none resize-none placeholder:text-white/30"
            rows={3} />
        </GlassCard>
      </div>

      <div className="px-5 pt-4 pb-8 space-y-3">
        <GoldButton label="Submit Rating" onClick={() => navigate('home')} />
        <button onClick={() => navigate('home')} className="w-full py-2 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Skip for now</button>
      </div>
    </div>
  );
}

/* ─────────── RIDE HISTORY ─────────── */
function RideHistoryScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const rides = [
    { id: 1, from: 'Koramangala', to: 'Indiranagar', date: 'Today, 2:30 PM', fare: '₹186', status: 'Completed', type: '🚗' },
    { id: 2, from: 'MG Road', to: 'Airport', date: 'Yesterday, 8:00 AM', fare: '₹680', status: 'Completed', type: '🚘' },
    { id: 3, from: 'HSR Layout', to: 'Whitefield', date: '23 Feb, 6:45 PM', fare: '₹245', status: 'Cancelled', type: '🚗' },
    { id: 4, from: 'Banashankari', to: 'Cubbon Park', date: '22 Feb, 11:00 AM', fare: '₹130', status: 'Completed', type: '🛺' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      <div className="px-5 pt-16 pb-4">
        <h2 className="text-xl font-bold text-white">Ride History</h2>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>4 trips this month</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-24">
        {rides.map(r => (
          <GlassCard key={r.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid rgba(212,175,55,0.2)` }}>
                <span className="text-xl">{r.type}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-white">{r.from}</span>
                  <ChevronRight size={10} color="rgba(255,255,255,0.4)" />
                  <span className="text-xs text-white">{r.to}</span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: G }}>{r.fare}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                  background: r.status === 'Completed' ? 'rgba(0,200,100,0.1)' : 'rgba(220,40,40,0.1)',
                  color: r.status === 'Completed' ? '#00C864' : '#FF4444',
                }}>{r.status}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg"
                style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
                <Download size={12} color={G} />
                <span className="text-xs" style={{ color: G }}>Invoice</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg"
                style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
                <Navigation size={12} color="rgba(255,255,255,0.6)" />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Rebook</span>
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
      <BottomNav current="ride-history" navigate={navigate} />
    </div>
  );
}

/* ─────────── WALLET ─────────── */
function WalletScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const txns = [
    { label: 'Ride · Koramangala→Indiranagar', amount: '-₹186', type: 'debit', date: 'Today' },
    { label: 'Added via UPI', amount: '+₹500', type: 'credit', date: 'Yesterday' },
    { label: 'Ride · MG Road→Airport', amount: '-₹680', type: 'debit', date: '23 Feb' },
    { label: 'Referral Bonus', amount: '+₹100', type: 'credit', date: '22 Feb' },
    { label: 'Ride · HSR→Whitefield', amount: '-₹245', type: 'debit', date: '21 Feb' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      {/* Balance card */}
      <div className="px-5 pt-16 pb-4">
        <div className="p-6 rounded-3xl mb-4"
          style={{ background: `linear-gradient(135deg, #1A2E4A, #0F1C2E)`, border: `1px solid rgba(212,175,55,0.25)`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Available Balance</p>
              <p className="text-4xl font-bold mt-1" style={{ color: G }}>₹482<span className="text-2xl">.50</span></p>
            </div>
            <img src={logoImage} alt="Logo" className="h-10 w-10 object-contain opacity-60" />
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{ background: `linear-gradient(135deg, ${G}, #B8962E)`, color: DARK }}>
              + Add Money
            </button>
            <button className="flex-1 py-3 rounded-xl text-sm font-medium text-white"
              style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
              ↗ Transfer
            </button>
          </div>
        </div>

        {/* Quick add */}
        <div className="flex gap-2">
          {['₹100', '₹200', '₹500', '₹1000'].map(a => (
            <button key={a} className="flex-1 py-2 rounded-xl text-xs font-medium"
              style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}`, color: 'rgba(255,255,255,0.7)' }}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Recent Transactions</p>
        {txns.map((t, i) => (
          <div key={i} className="flex items-center gap-3 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: t.type === 'credit' ? 'rgba(0,200,100,0.1)' : 'rgba(220,80,80,0.1)' }}>
              {t.type === 'credit' ? <ArrowDownLeft size={18} color="#00C864" /> : <ArrowUpRight size={18} color="#FF6666" />}
            </div>
            <div className="flex-1">
              <p className="text-sm text-white">{t.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.date}</p>
            </div>
            <span className="text-sm font-bold" style={{ color: t.type === 'credit' ? '#00C864' : '#FF6666' }}>{t.amount}</span>
          </div>
        ))}
      </div>
      <BottomNav current="wallet" navigate={navigate} />
    </div>
  );
}

/* ─────────── PROFILE ─────────── */
function ProfileScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const fields = [
    { label: 'Full Name', value: 'Arjun Kumar', icon: '👤' },
    { label: 'Phone Number', value: '+91 98765 43210', icon: '📱' },
    { label: 'Email', value: 'arjun.kumar@email.com', icon: '📧' },
    { label: 'Date of Birth', value: '15 Aug 1992', icon: '🎂' },
    { label: 'Gender', value: 'Male', icon: '⚧️' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      {/* Header */}
      <div className="px-5 pt-16 pb-6" style={{ background: `linear-gradient(180deg, #050D1A, ${DARK})` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">My Profile</h2>
          <button className="p-2 rounded-xl" style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
            <Edit size={16} color={G} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden" style={{ border: `3px solid ${G}` }}>
              <img src="https://images.unsplash.com/photo-1604343670513-af01df1260a1?w=200&h=200&fit=crop" className="w-full h-full object-cover" alt="Profile" />
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: G }}>
              <Camera size={12} color={DARK} />
            </button>
          </div>
          <div>
            <p className="text-lg font-bold text-white">Arjun Kumar</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={12} fill={G} color={G} />
              <span className="text-sm" style={{ color: G }}>4.9</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Member since 2023</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: G, border: `1px solid rgba(212,175,55,0.3)` }}>⭐ Gold Member</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-3">
        {/* Fields */}
        <GlassCard>
          {fields.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: i < fields.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <span className="text-lg">{f.icon}</span>
              <div className="flex-1">
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{f.label}</p>
                <p className="text-sm font-medium text-white mt-0.5">{f.value}</p>
              </div>
              <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
            </div>
          ))}
        </GlassCard>

        {/* Emergency */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white">Emergency Contacts</p>
            <button className="text-xs px-2 py-1 rounded-lg" style={{ color: G, background: 'rgba(212,175,55,0.1)' }}>+ Add</button>
          </div>
          {['Priya Kumar (Sister)', 'Mohan Kumar (Father)'].map((c, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: GLASS }}>
                <Users size={14} color={G} />
              </div>
              <span className="text-sm text-white flex-1">{c}</span>
              <Phone size={14} color="rgba(255,255,255,0.4)" />
            </div>
          ))}
        </GlassCard>

        {/* Menu items */}
        {[
          { icon: '🎁', label: 'Refer & Earn', action: () => navigate('refer-earn') },
          { icon: '❓', label: 'Help & Support', action: () => {} },
          { icon: '⚙️', label: 'Settings', action: () => {} },
        ].map((item, i) => (
          <button key={i} onClick={item.action}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl"
            style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium text-white flex-1 text-left">{item.label}</span>
            <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
          </button>
        ))}

        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl"
          style={{ background: 'rgba(220,40,40,0.08)', border: '1px solid rgba(220,40,40,0.2)' }}>
          <LogOut size={16} color="#FF4444" />
          <span className="text-sm font-medium" style={{ color: '#FF4444' }}>Sign Out</span>
        </button>
      </div>
      <BottomNav current="profile" navigate={navigate} />
    </div>
  );
}

/* ─────────── REWARDS ─────────── */
function RewardsScreen({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      <div className="px-5 pt-16 pb-4">
        <h2 className="text-xl font-bold text-white">Rewards</h2>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Earn coins, unlock perks</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        {/* Coin balance */}
        <div className="p-6 rounded-3xl text-center" style={{ background: `linear-gradient(135deg, #1A2E4A, #0F1C2E)`, border: `1px solid rgba(212,175,55,0.3)`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <span className="text-5xl">🪙</span>
          <p className="text-4xl font-bold mt-2" style={{ color: G }}>2,480</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>SaaradhiCoins</p>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Gold Level</span>
              <span style={{ color: G }}>2,480 / 5,000</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full" style={{ width: '49.6%', background: `linear-gradient(to right, ${G}, #F0CC5A)` }} />
            </div>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>2,520 coins to Platinum</p>
          </div>
        </div>

        {/* Streak */}
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,170,0,0.15)', border: '2px solid rgba(255,170,0,0.3)' }}>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">5-Day Streak!</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Ride daily to earn bonus coins</p>
          </div>
          <span className="text-sm font-bold" style={{ color: '#FFAA00' }}>+50/day</span>
        </GlassCard>

        {/* Redemption */}
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Redeem Coins</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: '₹50 off', coins: '500 coins', emoji: '💰' },
            { name: 'Free Ride', coins: '2000 coins', emoji: '🚗' },
            { name: '20% Discount', coins: '800 coins', emoji: '🎉' },
            { name: 'Priority Booking', coins: '300 coins', emoji: '⚡' },
          ].map((r, i) => (
            <GlassCard key={i} className="p-4 text-center">
              <span className="text-3xl">{r.emoji}</span>
              <p className="text-sm font-bold text-white mt-2">{r.name}</p>
              <p className="text-xs mt-1 mb-3" style={{ color: G }}>🪙 {r.coins}</p>
              <button className="w-full py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: `linear-gradient(135deg, ${G}, #B8962E)`, color: DARK }}>Redeem</button>
            </GlassCard>
          ))}
        </div>

        {/* How to earn */}
        <GlassCard className="p-4">
          <p className="text-sm font-semibold text-white mb-3">How to Earn Coins</p>
          {[['🚗', 'Complete a ride', '+10 coins'], ['⭐', 'Rate your driver', '+5 coins'], ['📢', 'Refer a friend', '+200 coins'], ['💰', 'Add wallet money', '+20 per ₹100']].map(([e, l, v]) => (
            <div key={l} className="flex items-center gap-3 py-2">
              <span className="text-lg">{e}</span>
              <span className="text-sm flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{l}</span>
              <span className="text-xs font-medium" style={{ color: G }}>{v}</span>
            </div>
          ))}
        </GlassCard>
      </div>
      <BottomNav current="rewards" navigate={navigate} />
    </div>
  );
}

/* ─────────── REFER & EARN ─────────── */
function ReferEarnScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [copied, setCopied] = useState(false);
  const code = 'ARJUN200';

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: DARK }}>
      <BackHeader title="Refer & Earn" navigate={navigate} to="profile" />
      <div className="flex-1 overflow-y-auto px-5 space-y-4">
        {/* Hero */}
        <div className="p-6 rounded-3xl text-center" style={{ background: `linear-gradient(135deg, #1A2E4A, #0F1C2E)`, border: `1px solid rgba(212,175,55,0.25)` }}>
          <span className="text-5xl">🎁</span>
          <p className="text-2xl font-bold mt-3 text-white">Refer & Earn <span style={{ color: G }}>₹200</span></p>
          <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Invite friends & earn ₹200 for each successful referral</p>
        </div>

        {/* Code */}
        <GlassCard className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Your Referral Code</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 py-3 px-4 rounded-xl text-center" style={{ background: 'rgba(212,175,55,0.08)', border: `1px dashed rgba(212,175,55,0.4)` }}>
              <span className="text-xl font-bold tracking-widest" style={{ color: G }}>{code}</span>
            </div>
            <button onClick={copy} className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: copied ? 'rgba(0,200,100,0.15)' : 'rgba(212,175,55,0.1)', border: `1px solid ${copied ? 'rgba(0,200,100,0.3)' : 'rgba(212,175,55,0.3)'}` }}>
              {copied ? <Check size={18} color="#00C864" /> : <Copy size={18} color={G} />}
            </button>
          </div>
        </GlassCard>

        {/* Share */}
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '💬', label: 'WhatsApp' }, { icon: '📘', label: 'Facebook' }, { icon: '📲', label: 'More' }].map(s => (
            <button key={s.label} className="flex flex-col items-center gap-2 py-4 rounded-xl"
              style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: G }}>3</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Friends Referred</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: G }}>₹600</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Total Earned</p>
          </GlassCard>
        </div>

        {/* How it works */}
        <GlassCard className="p-4">
          <p className="text-sm font-semibold text-white mb-3">How It Works</p>
          {[['1', 'Share your referral code with friends'], ['2', 'Friend signs up & completes first ride'], ['3', 'You get ₹200, they get ₹100!']].map(([n, l]) => (
            <div key={n} className="flex items-center gap-3 py-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${G}, #B8962E)` }}>
                <span className="text-xs font-bold" style={{ color: DARK }}>{n}</span>
              </div>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{l}</span>
            </div>
          ))}
        </GlassCard>
      </div>

      <div className="px-5 pt-3 pb-8">
        <GoldButton label="Share Your Code" onClick={() => {}} />
      </div>
    </div>
  );
}

/* ─────────── MAIN APP ─────────── */
export function CustomerApp() {
  const [screen, setScreen] = useState<Screen>('splash');
  const navigate = (s: Screen) => setScreen(s);

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen navigate={navigate} />;
      case 'onboarding': return <OnboardingScreen navigate={navigate} />;
      case 'login': return <LoginScreen navigate={navigate} />;
      case 'otp': return <OTPScreen navigate={navigate} />;
      case 'home': return <HomeScreen navigate={navigate} />;
      case 'location-search': return <LocationSearchScreen navigate={navigate} />;
      case 'ride-options': return <RideOptionsScreen navigate={navigate} />;
      case 'fare-summary': return <FareSummaryScreen navigate={navigate} />;
      case 'confirm-ride': return <ConfirmRideScreen navigate={navigate} />;
      case 'driver-assigned': return <DriverAssignedScreen navigate={navigate} />;
      case 'live-tracking': return <LiveTrackingScreen navigate={navigate} />;
      case 'payment': return <PaymentScreen navigate={navigate} />;
      case 'rating': return <RatingScreen navigate={navigate} />;
      case 'ride-history': return <RideHistoryScreen navigate={navigate} />;
      case 'wallet': return <WalletScreen navigate={navigate} />;
      case 'profile': return <ProfileScreen navigate={navigate} />;
      case 'rewards': return <RewardsScreen navigate={navigate} />;
      case 'refer-earn': return <ReferEarnScreen navigate={navigate} />;
      default: return <HomeScreen navigate={navigate} />;
    }
  };

  return (
    <div className="h-full w-full relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${DARK} 0%, ${NAVY} 100%)` }}>
      <AnimatePresence mode="wait">
        <motion.div key={screen} className="absolute inset-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}>
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
