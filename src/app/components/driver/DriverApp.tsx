import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, MapPin, Navigation, Star, Phone,
  MessageSquare, Check, CheckCircle, Camera, Shield, Wallet,
  TrendingUp, Clock, Award, User, HelpCircle, Bell, AlertTriangle,
  ArrowUpRight, ArrowDownLeft, X, Car, Zap, ToggleLeft, ToggleRight,
  FileText, Upload
} from 'lucide-react';
import { MapView } from '../MapView';
import logoImage from '@/assets/25a5bd8011d7696bf02e1d5cc818a54ef634abf4.png';

const G = '#D4AF37';
const DARK = '#080F1A';
const NAVY = '#0F1C2E';
const GLASS = 'rgba(255,255,255,0.05)';
const GLASS_BORDER = 'rgba(255,255,255,0.09)';

type DScreen =
  | 'splash' | 'login' | 'otp' | 'kyc' | 'vehicle-info' | 'verification-pending'
  | 'home' | 'ride-request' | 'navigate-pickup' | 'start-ride'
  | 'live-navigation' | 'end-ride' | 'earnings' | 'wallet' | 'ratings' | 'support';

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

function GoldButton({ label, onClick, style }: { label: string; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} className="w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-95"
      style={{ background: `linear-gradient(135deg, #D4AF37, #A8882A)`, color: DARK, boxShadow: '0 4px 20px rgba(212,175,55,0.35)', ...style }}>
      {label}
    </button>
  );
}

function GlassCard({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl ${className}`}
      style={{ background: GLASS, backdropFilter: 'blur(12px)', border: `1px solid ${GLASS_BORDER}`, ...style }}>
      {children}
    </div>
  );
}

function BackBtn({ navigate, to }: { navigate: (s: DScreen) => void; to: DScreen }) {
  return (
    <button onClick={() => navigate(to)}
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
      <ChevronLeft size={20} color="white" />
    </button>
  );
}

function DriverBottomNav({ current, navigate }: { current: DScreen; navigate: (s: DScreen) => void }) {
  const items = [
    { id: 'home' as DScreen, icon: Car, label: 'Drive' },
    { id: 'earnings' as DScreen, icon: TrendingUp, label: 'Earnings' },
    { id: 'wallet' as DScreen, icon: Wallet, label: 'Wallet' },
    { id: 'ratings' as DScreen, icon: Star, label: 'Ratings' },
    { id: 'support' as DScreen, icon: HelpCircle, label: 'Support' },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 pt-3 pb-8"
      style={{ background: `linear-gradient(to top, #050A10, ${DARK})`, borderTop: `1px solid ${GLASS_BORDER}` }}>
      {items.map(item => {
        const active = current === item.id;
        return (
          <button key={item.id} onClick={() => navigate(item.id)} className="flex flex-col items-center gap-1 px-3 py-1">
            <item.icon size={22} color={active ? G : 'rgba(255,255,255,0.35)'} />
            <span className="text-[10px]" style={{ color: active ? G : 'rgba(255,255,255,0.35)' }}>{item.label}</span>
            {active && <div className="w-1 h-1 rounded-full" style={{ background: G }} />}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────── DRIVER SPLASH ─────────── */
function DriverSplash({ navigate }: { navigate: (s: DScreen) => void }) {
  useEffect(() => { const t = setTimeout(() => navigate('login'), 2500); return () => clearTimeout(t); }, [navigate]);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(180deg, #020609 0%, ${DARK} 60%, ${NAVY} 100%)` }}>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, type: 'spring' }}>
        <div className="w-40 h-40 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(212,175,55,0.06)', boxShadow: '0 0 60px rgba(212,175,55,0.2)' }}>
          <img src={logoImage} alt="SaaradhiGO" className="w-32 h-32 object-contain" />
        </div>
      </motion.div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
        <h1 className="text-3xl font-bold mb-1" style={{ color: G, letterSpacing: 2 }}>SAARADHI GO</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Driver Partner App</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-20 flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: G }}
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} />
        ))}
      </motion.div>
      <p className="absolute bottom-10 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Drive. Earn. Grow.</p>
    </div>
  );
}

/* ─────────── DRIVER LOGIN ─────────── */
function DriverLogin({ navigate }: { navigate: (s: DScreen) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #020609 0%, ${DARK} 100%)` }}>
      <div className="flex justify-center pt-16 pb-8">
        <img src={logoImage} alt="Logo" className="h-20 object-contain" />
      </div>
      <div className="flex-1 px-6">
        <div className="mb-2 px-3 py-1.5 rounded-full inline-block" style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid rgba(212,175,55,0.3)` }}>
          <span className="text-xs font-medium" style={{ color: G }}>🚗 Driver Partner Portal</span>
        </div>
        <h2 className="text-2xl font-bold text-white mt-2 mb-1">Welcome, Partner!</h2>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>Login to start earning with SaaradhiGO</p>

        <GlassCard className="flex items-center gap-3 px-4 py-4 mb-4">
          <div className="flex items-center gap-2 pr-3" style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-lg">🇮🇳</span>
            <span className="text-white text-sm font-medium">+91</span>
            <ChevronRight size={14} color={G} />
          </div>
          <input type="tel" placeholder="Enter mobile number"
            className="bg-transparent text-white text-base outline-none flex-1 placeholder:text-white/30" />
        </GlassCard>

        <GoldButton label="Send OTP" onClick={() => navigate('otp')} style={{ marginBottom: 24 }} />

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[['₹32K', 'Avg. Monthly'], ['4.8⭐', 'Avg. Rating'], ['24/7', 'Support']].map(([v, l]) => (
            <GlassCard key={l} className="p-3 text-center">
              <p className="text-sm font-bold" style={{ color: G }}>{v}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{l}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── DRIVER OTP ─────────── */
function DriverOTP({ navigate }: { navigate: (s: DScreen) => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  useEffect(() => { if (timer <= 0) return; const t = setInterval(() => setTimer(v => v - 1), 1000); return () => clearInterval(t); }, [timer]);

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #020609, ${DARK})` }}>
      <div className="flex items-center gap-3 px-5 pt-16 pb-4">
        <BackBtn navigate={navigate} to="login" />
        <span className="text-white font-semibold text-lg">Verify OTP</span>
      </div>
      <div className="flex-1 px-6 pt-4">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.08)', border: '2px solid rgba(212,175,55,0.25)' }}>
            <span className="text-4xl">📱</span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-white text-center mb-2">Enter Verification Code</h2>
        <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>Sent to +91 98765 43210</p>
        <div className="flex justify-between gap-2 mb-8">
          {otp.map((d, i) => (
            <input key={i} type="text" inputMode="numeric" maxLength={1} value={d}
              onChange={e => { const next = [...otp]; next[i] = e.target.value.slice(-1); setOtp(next); }}
              className="flex-1 h-14 text-center text-xl font-bold rounded-xl outline-none text-white transition-all"
              style={{ background: d ? 'rgba(212,175,55,0.1)' : GLASS, border: d ? `2px solid ${G}` : `1px solid ${GLASS_BORDER}` }} />
          ))}
        </div>
        <GoldButton label="Verify & Continue" onClick={() => navigate('kyc')} style={{ marginBottom: 16 }} />
        <div className="text-center">
          {timer > 0 ? <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Resend in <span style={{ color: G }}>00:{timer.toString().padStart(2, '0')}</span></p>
            : <button className="text-sm font-medium" style={{ color: G }} onClick={() => setTimer(30)}>Resend OTP</button>}
        </div>
      </div>
    </div>
  );
}

/* ─────────── KYC UPLOAD ─────────── */
function DriverKYC({ navigate }: { navigate: (s: DScreen) => void }) {
  const docs = [
    { label: 'Aadhaar Card', icon: '🪪', uploaded: true },
    { label: 'Driving Licence', icon: '🚗', uploaded: true },
    { label: 'PAN Card', icon: '📄', uploaded: false },
    { label: 'Police Verification', icon: '👮', uploaded: false },
  ];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #020609, ${DARK})` }}>
      <div className="flex items-center gap-3 px-5 pt-16 pb-4">
        <BackBtn navigate={navigate} to="otp" />
        <div>
          <span className="text-white font-semibold text-lg">KYC Documents</span>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Upload required documents</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Completion</span>
          <span style={{ color: G }}>2/4 docs</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full" style={{ width: '50%', background: `linear-gradient(to right, ${G}, #F0CC5A)` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-3">
        {docs.map((d, i) => (
          <GlassCard key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: d.uploaded ? 'rgba(212,175,55,0.1)' : GLASS, border: `1px solid ${d.uploaded ? 'rgba(212,175,55,0.3)' : GLASS_BORDER}` }}>
              <span className="text-2xl">{d.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{d.label}</p>
              <p className="text-xs mt-0.5" style={{ color: d.uploaded ? '#00C864' : 'rgba(255,255,255,0.4)' }}>
                {d.uploaded ? '✓ Uploaded successfully' : 'Tap to upload'}
              </p>
            </div>
            {d.uploaded ? <CheckCircle size={20} color="#00C864" /> :
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid rgba(212,175,55,0.25)` }}>
                <Upload size={16} color={G} />
              </div>}
          </GlassCard>
        ))}

        {/* Selfie */}
        <GlassCard className="p-4">
          <p className="text-sm font-semibold text-white mb-3">Selfie Verification</p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden" style={{ border: `2px dashed rgba(212,175,55,0.4)` }}>
              <img src="https://images.unsplash.com/photo-1604343670513-af01df1260a1?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="Selfie" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white">Live selfie captured</p>
              <p className="text-xs mt-0.5" style={{ color: '#00C864' }}>✓ Face matched</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(212,175,55,0.1)', color: G }}>
              Retake
            </button>
          </div>
        </GlassCard>
      </div>

      <div className="px-5 pt-3 pb-8">
        <GoldButton label="Continue →" onClick={() => navigate('vehicle-info')} />
      </div>
    </div>
  );
}

/* ─────────── VEHICLE INFO ─────────── */
function DriverVehicleInfo({ navigate }: { navigate: (s: DScreen) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #020609, ${DARK})` }}>
      <div className="flex items-center gap-3 px-5 pt-16 pb-4">
        <BackBtn navigate={navigate} to="kyc" />
        <span className="text-white font-semibold text-lg">Vehicle Details</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-4">
        <div className="flex justify-center py-4">
          <span className="text-8xl">🚗</span>
        </div>

        {[
          { label: 'Vehicle Type', placeholder: 'Select type', value: 'Mini Car' },
          { label: 'Make & Model', placeholder: 'e.g. Maruti Swift', value: 'Maruti Swift Dzire' },
          { label: 'Registration Number', placeholder: 'KA 05 MC 4892', value: 'KA 05 MC 4892' },
          { label: 'Year of Manufacture', placeholder: '2020', value: '2022' },
          { label: 'Vehicle Color', placeholder: 'e.g. White', value: 'Pearl White' },
          { label: 'Seating Capacity', placeholder: '4', value: '4' },
        ].map((f, i) => (
          <div key={i}>
            <p className="text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.label}</p>
            <GlassCard className="px-4 py-3.5">
              <p className="text-sm text-white">{f.value}</p>
            </GlassCard>
          </div>
        ))}

        {/* Vehicle photos */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Vehicle Photos</p>
          <div className="grid grid-cols-3 gap-2">
            {['Front', 'Side', 'Interior'].map(side => (
              <div key={side} className="aspect-square rounded-xl flex flex-col items-center justify-center"
                style={{ background: GLASS, border: `1px dashed rgba(255,255,255,0.15)` }}>
                <Camera size={20} color="rgba(255,255,255,0.3)" />
                <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{side}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance */}
        <GlassCard className="flex items-center gap-3 px-4 py-3">
          <FileText size={18} color={G} />
          <div className="flex-1">
            <p className="text-sm text-white">Insurance Certificate</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Valid till Dec 2025</p>
          </div>
          <CheckCircle size={16} color="#00C864" />
        </GlassCard>
      </div>

      <div className="px-5 pt-3 pb-8">
        <GoldButton label="Submit for Verification →" onClick={() => navigate('verification-pending')} />
      </div>
    </div>
  );
}

/* ─────────── VERIFICATION PENDING ─────────── */
function VerificationPending({ navigate }: { navigate: (s: DScreen) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
      style={{ background: `linear-gradient(180deg, #020609, ${DARK})` }}>
      <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(212,175,55,0.08)', border: '2px solid rgba(212,175,55,0.3)' }}>
          <Clock size={56} color={G} />
        </div>
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-3">Under Verification</h2>
      <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Your documents are being reviewed by our team. This usually takes 24-48 hours.
      </p>

      <div className="w-full space-y-3 mb-8">
        {[
          { label: 'KYC Documents', status: 'In Review', color: '#FFAA00' },
          { label: 'Background Check', status: 'Pending', color: 'rgba(255,255,255,0.4)' },
          { label: 'Vehicle Inspection', status: 'Scheduled', color: G },
        ].map((s, i) => (
          <GlassCard key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-sm text-white flex-1 text-left">{s.label}</span>
            <span className="text-xs font-medium" style={{ color: s.color }}>{s.status}</span>
          </GlassCard>
        ))}
      </div>

      <GoldButton label="Go to Home →" onClick={() => navigate('home')} />
    </div>
  );
}

/* ─────────── DRIVER HOME ─────────── */
function DriverHome({ navigate }: { navigate: (s: DScreen) => void }) {
  const [online, setOnline] = useState(false);
  const driver = getMatchedDriver();

  return (
    <div className="absolute inset-0 flex flex-col">
      <MapView showDrivers height="100%" />
      <div className="absolute inset-0 flex flex-col pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(4,8,16,0.75) 0%, transparent 35%, transparent 55%, rgba(4,8,16,0.98) 100%)' }}>

        {/* Top */}
        <div className="pointer-events-auto flex items-center justify-between px-5 pt-16 pb-2">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Logo" className="h-8 w-8 object-contain" />
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Driver Partner</p>
              <p className="text-sm font-semibold text-white">{driver.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}`, backdropFilter: 'blur(12px)' }}>
              <Bell size={18} color="white" />
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="pointer-events-auto px-5 mt-2">
          <div className="flex gap-2">
            {[['₹1,240', 'Today'], ['8', 'Trips'], ['4.9⭐', 'Rating']].map(([v, l]) => (
              <div key={l} className="flex-1 px-3 py-2 rounded-xl text-center"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', border: `1px solid ${GLASS_BORDER}` }}>
                <p className="text-sm font-bold" style={{ color: G }}>{v}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        {/* Go Online toggle */}
        <div className="pointer-events-auto px-5 pb-4">
          <div className="p-5 rounded-3xl" style={{ background: 'rgba(8,15,26,0.95)', backdropFilter: 'blur(20px)', border: `1px solid ${GLASS_BORDER}` }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-base font-bold text-white">
                  {online ? '🟢 You are Online' : '🔴 You are Offline'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {online ? 'Receiving ride requests' : 'Toggle to start receiving rides'}
                </p>
              </div>
              <button onClick={() => { setOnline(o => !o); if (!online) setTimeout(() => navigate('ride-request'), 2000); }}
                className="relative w-16 h-9 rounded-full transition-all duration-300"
                style={{ background: online ? `linear-gradient(135deg, ${G}, #A8882A)` : 'rgba(255,255,255,0.1)' }}>
                <div className="absolute top-1.5 rounded-full w-6 h-6 bg-white shadow-md transition-all duration-300"
                  style={{ left: online ? 'calc(100% - 28px)' : '6px' }} />
              </button>
            </div>

            {online && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(0,200,100,0.08)', border: '1px solid rgba(0,200,100,0.2)' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00C864' }} />
                <p className="text-xs" style={{ color: '#00C864' }}>Looking for rides in your area...</p>
              </div>
            )}
          </div>
        </div>
        <div className="h-20 pointer-events-none" />
      </div>
      <DriverBottomNav current="home" navigate={navigate} />
    </div>
  );
}

/* ─────────── RIDE REQUEST POPUP ─────────── */
function RideRequest({ navigate }: { navigate: (s: DScreen) => void }) {
  const [timer, setTimer] = useState(15);
  useEffect(() => { if (timer <= 0) { navigate('home'); return; } const t = setInterval(() => setTimer(v => v - 1), 1000); return () => clearInterval(t); }, [timer, navigate]);

  return (
    <div className="absolute inset-0">
      <MapView showDrivers height="100%" />
      <div className="absolute inset-0" style={{ background: 'rgba(4,8,16,0.5)' }} />

      {/* Popup */}
      <div className="absolute bottom-0 left-0 right-0">
        <motion.div initial={{ y: 300 }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 25 }}>
          <div className="mx-0 px-5 pt-6 pb-8 rounded-t-3xl"
            style={{ background: 'linear-gradient(180deg, #0D1B2A, #080F1A)', border: `1px solid ${GLASS_BORDER}` }}>

            {/* Timer ring */}
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke={G} strokeWidth="5"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - timer / 15)}`}
                    strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: G }}>{timer}</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white text-center mb-1">New Ride Request!</h3>
            <p className="text-xs text-center mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>Accept before timer runs out</p>

            {/* Trip info */}
            <GlassCard className="p-4 mb-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: G }} />
                  <div className="flex-1">
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Pickup</p>
                    <p className="text-sm font-medium text-white">Koramangala 6th Block</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)', color: G }}>1.2 km</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={12} color={G} className="flex-shrink-0 ml-[2px]" />
                  <div className="flex-1">
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Drop</p>
                    <p className="text-sm font-medium text-white">Indiranagar 100 Feet Road</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>5.2 km</span>
                </div>
              </div>
              <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-center flex-1">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Fare</p>
                  <p className="text-base font-bold" style={{ color: G }}>₹186</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Distance</p>
                  <p className="text-base font-bold text-white">5.2 km</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Type</p>
                  <p className="text-base">🚗</p>
                </div>
              </div>
            </GlassCard>

            <div className="flex gap-3">
              <button onClick={() => navigate('home')} className="flex-1 py-4 rounded-2xl font-semibold"
                style={{ background: 'rgba(220,40,40,0.1)', border: '1px solid rgba(220,40,40,0.25)', color: '#FF4444' }}>
                Decline
              </button>
              <button onClick={() => navigate('navigate-pickup')} className="flex-1 py-4 rounded-2xl font-semibold"
                style={{ background: `linear-gradient(135deg, ${G}, #A8882A)`, color: DARK }}>
                Accept ✓
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────── NAVIGATE TO PICKUP ─────────── */
function NavigatePickup({ navigate }: { navigate: (s: DScreen) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <MapView showRoute height="100%" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(4,8,16,0.7) 0%, transparent 30%, transparent 55%, rgba(4,8,16,1) 100%)' }}>
        <div className="absolute top-16 left-5 right-5 flex items-center gap-3">
          <button onClick={() => navigate('home')} className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(8,15,26,0.9)', border: `1px solid ${GLASS_BORDER}` }}>
            <ChevronLeft size={20} color="white" />
          </button>
          <div className="flex-1 px-4 py-2.5 rounded-full"
            style={{ background: 'rgba(8,15,26,0.9)', border: `1px solid ${GLASS_BORDER}` }}>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Heading to Pickup</p>
            <p className="text-sm font-medium text-white">Koramangala 6th Block</p>
          </div>
          <div className="px-3 py-2 rounded-full" style={{ background: `linear-gradient(135deg, ${G}, #A8882A)` }}>
            <p className="text-xs font-bold" style={{ color: DARK }}>1.2 km</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 space-y-3">
          <GlassCard className="p-4" style={{ backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: `2px solid ${G}` }}>
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                  <User size={24} color="white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Arjun Kumar</p>
                <div className="flex items-center gap-1">
                  <Star size={11} fill={G} color={G} />
                  <span className="text-xs" style={{ color: G }}>4.9</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>· 48 trips</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.25)' }}>
                  <Phone size={14} color="#00C864" />
                </button>
                <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
                  <MessageSquare size={14} color={G} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <MapPin size={12} color={G} />
              <p className="text-xs text-white">Pickup: Koramangala 6th Block</p>
            </div>
          </GlassCard>

          <GoldButton label="I've Arrived at Pickup →" onClick={() => navigate('start-ride')} />
        </div>
      </div>
    </div>
  );
}

/* ─────────── START RIDE ─────────── */
function StartRide({ navigate }: { navigate: (s: DScreen) => void }) {
  const [otpInput, setOtpInput] = useState(['', '', '', '']);

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #020609, ${DARK})` }}>
      <div className="flex items-center gap-3 px-5 pt-16 pb-4">
        <BackBtn navigate={navigate} to="navigate-pickup" />
        <span className="text-white font-semibold text-lg">Start Ride</span>
      </div>

      <div className="flex-1 px-5 space-y-4">
        {/* Passenger info */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: `2px solid rgba(212,175,55,0.3)` }}>
              <User size={28} color={G} />
            </div>
            <div>
              <p className="text-base font-bold text-white">Arjun Kumar</p>
              <div className="flex items-center gap-1">
                <Star size={12} fill={G} color={G} />
                <span className="text-sm" style={{ color: G }}>4.9</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* OTP verification */}
        <GlassCard className="p-5">
          <p className="text-sm font-semibold text-white mb-1">Verify Passenger OTP</p>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Ask passenger for their 4-digit OTP</p>
          <div className="flex justify-between gap-3 mb-4">
            {otpInput.map((d, i) => (
              <input key={i} type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => { const next = [...otpInput]; next[i] = e.target.value.slice(-1); setOtpInput(next); }}
                className="flex-1 h-14 text-center text-xl font-bold rounded-xl outline-none text-white"
                style={{ background: d ? 'rgba(212,175,55,0.1)' : GLASS, border: d ? `2px solid ${G}` : `1px solid ${GLASS_BORDER}` }} />
            ))}
          </div>
        </GlassCard>

        {/* Trip details */}
        <GlassCard className="p-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: G }} />
              <p className="text-sm text-white">Koramangala 6th Block</p>
            </div>
            <div className="ml-1 w-0.5 h-4" style={{ background: 'rgba(212,175,55,0.3)' }} />
            <div className="flex items-center gap-3">
              <MapPin size={12} color={G} />
              <p className="text-sm text-white">Indiranagar 100 Feet Road</p>
            </div>
          </div>
          <div className="flex gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)', color: G }}>5.2 km</span>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: GLASS, color: 'rgba(255,255,255,0.6)' }}>~18 mins</span>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: GLASS, color: 'rgba(255,255,255,0.6)' }}>₹186</span>
          </div>
        </GlassCard>
      </div>

      <div className="px-5 pt-3 pb-8">
        <GoldButton label="🚗  Start Ride" onClick={() => navigate('live-navigation')} />
      </div>
    </div>
  );
}

/* ─────────── LIVE NAVIGATION ─────────── */
function LiveNavigation({ navigate }: { navigate: (s: DScreen) => void }) {
  return (
    <div className="absolute inset-0">
      <MapView showRoute height="100%" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(4,8,16,0.7) 0%, transparent 30%, transparent 55%, rgba(4,8,16,0.95) 100%)' }}>

        {/* Navigation header */}
        <div className="absolute top-16 left-5 right-5">
          <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(8,15,26,0.9)', border: `1px solid ${GLASS_BORDER}`, backdropFilter: 'blur(16px)' }}>
            <div className="flex items-center gap-3">
              <Navigation size={20} color={G} />
              <div className="flex-1">
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Next turn in 200m</p>
                <p className="text-sm font-bold text-white">Turn right onto 100 Feet Road</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold" style={{ color: G }}>8</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>mins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 space-y-3">
          <GlassCard className="p-4" style={{ backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)' }}>
                <User size={20} color={G} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Arjun Kumar</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Drop: Indiranagar 100 Feet Rd</p>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.25)' }}>
                  <Phone size={14} color="#00C864" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-center">
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Remaining</p>
                <p className="text-sm font-bold" style={{ color: G }}>3.1 km</p>
              </div>
              <div className="text-center">
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>ETA</p>
                <p className="text-sm font-bold text-white">8 min</p>
              </div>
              <div className="text-center">
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Fare</p>
                <p className="text-sm font-bold" style={{ color: G }}>₹186</p>
              </div>
            </div>
          </GlassCard>

          <GoldButton label="End Ride at Destination" onClick={() => navigate('end-ride')} />
        </div>
      </div>
    </div>
  );
}

/* ─────────── END RIDE ─────────── */
function EndRide({ navigate }: { navigate: (s: DScreen) => void }) {
  const driver = getMatchedDriver();
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #020609, ${DARK})` }}>
      <div className="flex flex-col items-center px-6 pt-16 pb-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(0,200,100,0.12)', border: '2px solid rgba(0,200,100,0.35)' }}>
          <CheckCircle size={40} color="#00C864" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Ride Completed!</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Great job, {driver.name.split(' ')[0]}!</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-4">
        {/* Earning card */}
        <div className="p-6 rounded-3xl text-center"
          style={{ background: `linear-gradient(135deg, #1A2E4A, #0F1C2E)`, border: `1px solid rgba(212,175,55,0.3)` }}>
          <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>You Earned</p>
          <p className="text-5xl font-bold" style={{ color: G }}>₹167</p>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>After 10% platform fee (₹19)</p>
        </div>

        <GlassCard className="p-4 space-y-2.5">
          {[['Total Fare', '₹186'], ['Platform Fee (10%)', '-₹19'], ['Your Earning', '₹167'], ['Trip Distance', '5.2 km'], ['Duration', '22 mins']].map(([l, v], i) => (
            <div key={i} className="flex justify-between">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{l}</span>
              <span className="text-sm font-medium" style={{ color: i === 2 ? G : 'white' }}>{v}</span>
            </div>
          ))}
        </GlassCard>

        {/* Passenger rating */}
        <GlassCard className="p-4">
          <p className="text-sm font-semibold text-white mb-3">Rate Your Passenger</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={32} fill={i <= 5 ? G : 'transparent'} color={i <= 5 ? G : 'rgba(255,255,255,0.2)'} />
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="px-5 pt-3 pb-8">
        <GoldButton label="Done · Go Back Online" onClick={() => navigate('home')} />
      </div>
    </div>
  );
}

/* ─────────── EARNINGS ─────────── */
function DriverEarnings({ navigate }: { navigate: (s: DScreen) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #020609, ${DARK})` }}>
      <div className="px-5 pt-16 pb-4">
        <h2 className="text-xl font-bold text-white">Earnings Dashboard</h2>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>February 2026</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        {/* Monthly total */}
        <div className="p-6 rounded-3xl" style={{ background: `linear-gradient(135deg, #1A2E4A, #0F1C2E)`, border: `1px solid rgba(212,175,55,0.3)` }}>
          <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>This Month</p>
          <p className="text-4xl font-bold" style={{ color: G }}>₹28,450</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={14} color="#00C864" />
            <span className="text-xs" style={{ color: '#00C864' }}>+12% vs last month</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[['168', 'Trips'], ['4.92', 'Rating'], ['96%', 'Acceptance']].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-lg font-bold text-white">{v}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Period selector */}
        <div className="flex gap-2">
          {['Today', 'Week', 'Month'].map((p, i) => (
            <button key={p} className="flex-1 py-2 rounded-xl text-xs font-medium"
              style={{ background: i === 2 ? 'rgba(212,175,55,0.15)' : GLASS, border: `1px solid ${i === 2 ? 'rgba(212,175,55,0.4)' : GLASS_BORDER}`, color: i === 2 ? G : 'rgba(255,255,255,0.6)' }}>
              {p}
            </button>
          ))}
        </div>

        {/* Bar chart placeholder */}
        <GlassCard className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Daily Earnings</p>
          <div className="flex items-end gap-2 h-24">
            {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%`, background: i === 5 ? `linear-gradient(to top, ${G}, #F0CC5A)` : 'rgba(255,255,255,0.12)' }} />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="flex-1 text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{d}</span>
            ))}
          </div>
        </GlassCard>

        {/* Recent trips */}
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Recent Trips</p>
        {[
          { from: 'Koramangala', to: 'Indiranagar', fare: '₹167', time: '2:30 PM', date: 'Today' },
          { from: 'MG Road', to: 'Airport', fare: '₹612', time: '8:15 AM', date: 'Today' },
          { from: 'HSR Layout', to: 'Whitefield', fare: '₹220', time: '6:45 PM', date: 'Yesterday' },
        ].map((t, i) => (
          <GlassCard key={i} className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.08)' }}>
              <span className="text-xl">🚗</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-white">{t.from} → {t.to}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.date} · {t.time}</p>
            </div>
            <span className="text-sm font-bold" style={{ color: G }}>{t.fare}</span>
          </GlassCard>
        ))}
      </div>
      <DriverBottomNav current="earnings" navigate={navigate} />
    </div>
  );
}

/* ─────────── DRIVER WALLET ─────────── */
function DriverWallet({ navigate }: { navigate: (s: DScreen) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #020609, ${DARK})` }}>
      <div className="px-5 pt-16 pb-4">
        <h2 className="text-xl font-bold text-white">Driver Wallet</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        <div className="p-6 rounded-3xl" style={{ background: `linear-gradient(135deg, #1A2E4A, #0F1C2E)`, border: `1px solid rgba(212,175,55,0.25)` }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Available Balance</p>
              <p className="text-4xl font-bold mt-1" style={{ color: G }}>₹4,820</p>
            </div>
            <img src={logoImage} alt="Logo" className="h-10 w-10 object-contain opacity-60" />
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{ background: `linear-gradient(135deg, ${G}, #A8882A)`, color: DARK }}>
              ↗ Withdraw
            </button>
            <button className="flex-1 py-3 rounded-xl text-sm font-medium text-white"
              style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
              📋 Statement
            </button>
          </div>
        </div>

        {/* Transactions */}
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Transactions</p>
        {[
          { label: 'Trip Earning', amount: '+₹167', type: 'credit', date: 'Today 2:52 PM' },
          { label: 'Trip Earning', amount: '+₹612', type: 'credit', date: 'Today 8:37 AM' },
          { label: 'Weekly Withdrawal', amount: '-₹5,000', type: 'debit', date: 'Mon 10:00 AM' },
          { label: 'Fuel Incentive Bonus', amount: '+₹200', type: 'credit', date: 'Sun 6:00 PM' },
          { label: 'Trip Earning', amount: '+₹220', type: 'credit', date: 'Sat 6:58 PM' },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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
      <DriverBottomNav current="wallet" navigate={navigate} />
    </div>
  );
}

/* ─────────── RATINGS ─────────── */
function DriverRatings({ navigate }: { navigate: (s: DScreen) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #020609, ${DARK})` }}>
      <div className="px-5 pt-16 pb-4">
        <h2 className="text-xl font-bold text-white">My Ratings</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        {/* Overall */}
        <div className="p-6 rounded-3xl text-center" style={{ background: `linear-gradient(135deg, #1A2E4A, #0F1C2E)`, border: `1px solid rgba(212,175,55,0.3)` }}>
          <p className="text-6xl font-bold" style={{ color: G }}>4.92</p>
          <div className="flex justify-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill={i <= 5 ? G : 'transparent'} color={G} />)}
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Based on 2,340 ratings</p>
        </div>

        {/* Breakdown */}
        <GlassCard className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Rating Breakdown</p>
          {[['5★', 85], ['4★', 10], ['3★', 3], ['2★', 1], ['1★', 1]].map(([label, pct]) => (
            <div key={label as string} className="flex items-center gap-3 py-1.5">
              <span className="text-xs w-8" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</span>
              <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(to right, ${G}, #F0CC5A)` }} />
              </div>
              <span className="text-xs w-8 text-right" style={{ color: 'rgba(255,255,255,0.5)' }}>{pct}%</span>
            </div>
          ))}
        </GlassCard>

        {/* Recent reviews */}
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Recent Reviews</p>
        {[
          { name: 'Arjun K.', rating: 5, comment: 'Excellent driver! Very professional and on time.', date: 'Today' },
          { name: 'Priya S.', rating: 5, comment: 'Great ride, clean car. Highly recommended!', date: 'Yesterday' },
          { name: 'Mohan R.', rating: 4, comment: 'Good driver, safe driving.', date: '23 Feb' },
        ].map((r, i) => (
          <GlassCard key={i} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)' }}>
                <User size={16} color={G} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{r.name}</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill={i <= r.rating ? G : 'transparent'} color={i <= r.rating ? G : 'rgba(255,255,255,0.2)'} />)}
                </div>
              </div>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.date}</span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{r.comment}</p>
          </GlassCard>
        ))}
      </div>
      <DriverBottomNav current="ratings" navigate={navigate} />
    </div>
  );
}

/* ─────────── SUPPORT ─────────── */
function DriverSupport({ navigate }: { navigate: (s: DScreen) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(180deg, #020609, ${DARK})` }}>
      <div className="px-5 pt-16 pb-4">
        <h2 className="text-xl font-bold text-white">Help & Support</h2>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>We're here 24/7</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        {/* Contact options */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📞', label: 'Call Support', sub: '24/7 Available', color: '#00C864' },
            { icon: '💬', label: 'Live Chat', sub: 'Avg 2 min reply', color: G },
            { icon: '📧', label: 'Email Us', sub: 'Reply in 24h', color: '#4A9EFF' },
            { icon: '🎥', label: 'Video Call', sub: 'Schedule a call', color: '#FF6B6B' },
          ].map(c => (
            <GlassCard key={c.label} className="p-4 flex flex-col items-center text-center">
              <span className="text-3xl mb-2">{c.icon}</span>
              <p className="text-sm font-medium text-white">{c.label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{c.sub}</p>
            </GlassCard>
          ))}
        </div>

        {/* FAQs */}
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Common Issues</p>
        {[
          'Payment not received for trip',
          'How to update vehicle documents',
          'App navigation issues',
          'Account suspension queries',
          'Cancellation policy',
        ].map((q, i) => (
          <button key={i} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left"
            style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}>
            <HelpCircle size={16} color={G} className="flex-shrink-0" />
            <span className="text-sm text-white flex-1">{q}</span>
            <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
          </button>
        ))}
      </div>
      <DriverBottomNav current="support" navigate={navigate} />
    </div>
  );
}

/* ─────────── MAIN DRIVER APP ─────────── */
export function DriverApp() {
  const [screen, setScreen] = useState<DScreen>('splash');
  const navigate = (s: DScreen) => setScreen(s);

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <DriverSplash navigate={navigate} />;
      case 'login': return <DriverLogin navigate={navigate} />;
      case 'otp': return <DriverOTP navigate={navigate} />;
      case 'kyc': return <DriverKYC navigate={navigate} />;
      case 'vehicle-info': return <DriverVehicleInfo navigate={navigate} />;
      case 'verification-pending': return <VerificationPending navigate={navigate} />;
      case 'home': return <DriverHome navigate={navigate} />;
      case 'ride-request': return <RideRequest navigate={navigate} />;
      case 'navigate-pickup': return <NavigatePickup navigate={navigate} />;
      case 'start-ride': return <StartRide navigate={navigate} />;
      case 'live-navigation': return <LiveNavigation navigate={navigate} />;
      case 'end-ride': return <EndRide navigate={navigate} />;
      case 'earnings': return <DriverEarnings navigate={navigate} />;
      case 'wallet': return <DriverWallet navigate={navigate} />;
      case 'ratings': return <DriverRatings navigate={navigate} />;
      case 'support': return <DriverSupport navigate={navigate} />;
      default: return <DriverHome navigate={navigate} />;
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
