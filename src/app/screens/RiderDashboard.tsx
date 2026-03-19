import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    User, Phone, Mail, Calendar, Shield, LogOut, ChevronRight,
    Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard,
    Gift, Star, Zap, Trophy, Clock, MapPin, Download, Home,
    TrendingUp, Bell, Settings, ChevronDown, Check
} from "lucide-react";
import logoImage from "@/assets/25a5bd8011d7696bf02e1d5cc818a54ef634abf4.png";
import { getProfile } from "../../services/authService";
import { getMyRides } from "../../services/rideService";

const G = "#D4AF37";
const DARK = "#050D1A";
const NAVY = "#0F1C2E";
const GLASS = "rgba(255,255,255,0.04)";
const GLASS_B = "rgba(255,255,255,0.09)";

/* ─── DATA (Fallbacks) ─── */
const DEFAULT_TX = [
    { id: 1, type: "debit", desc: "SaaraMini Ride", sub: "Koramangala → Brigade Rd", amount: "₹129", date: "Today 2:30 PM", icon: "🚗" },
    { id: 2, type: "credit", desc: "Money Added", sub: "Via UPI • HDFC Bank", amount: "500", date: "Today 10:00 AM", icon: "💳" },
    { id: 3, type: "credit", desc: "Referral Bonus", sub: "Friend joined SaaradhiGO", amount: "100", date: "Yesterday", icon: "🎁" },
    { id: 4, type: "debit", desc: "SaaraPrime Ride", sub: "HSR → Whitefield", amount: "₹245", date: "Dec 19", icon: "🚙" },
    { id: 5, type: "credit", desc: "Cashback", sub: "Prime membership benefit", amount: "25", date: "Dec 18", icon: "💰" },
    { id: 6, type: "debit", desc: "SaaraBike Ride", sub: "Indiranagar → MG Road", amount: "₹49", date: "Dec 17", icon: "🏍️" },
];

const DEFAULT_HISTORY = [
    { id: "R001", date: "Today, 2:30 PM", from: "Koramangala", to: "Brigade Road", fare: "₹129", status: "completed", type: "SaaraMini", icon: "🚗", distance: "8.8 km", rating: 5 },
    { id: "R002", date: "Yesterday, 9:15 AM", from: "HSR Layout", to: "Whitefield", fare: "₹245", status: "completed", type: "SaaraPrime", icon: "🚙", distance: "14.2 km", rating: 4 },
];

const REWARDS = [
    { title: "Free Ride Coupon", coins: 500, icon: "🚗", value: "₹100 off", available: true },
    { title: "Priority Booking", coins: 800, icon: "⚡", value: "Skip queue", available: true },
    { title: "Airport Transfer Discount", coins: 1200, icon: "✈️", value: "20% off", available: false },
    { title: "Premium Upgrade", coins: 2000, icon: "👑", value: "Free upgrade", available: false },
];

const TIERS = [
    { name: "Silver", icon: "🥈", color: "#A8A8A8", min: 0, max: 1000 },
    { name: "Gold", icon: "🥇", color: G, min: 1000, max: 3000 },
    { name: "Platinum", icon: "💎", color: "#B9F2FF", min: 3000, max: 6000 },
    { name: "Diamond", icon: "💠", color: "#9D84FF", min: 6000, max: 10000 },
];

type Tab = "overview" | "wallet" | "rewards" | "history" | "profile";

function GCard({ children, style = {}, glow, ...rest }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties; glow?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
        const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
        el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
        el.style.boxShadow = glow
            ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${glow}22`
            : `0 20px 50px rgba(0,0,0,0.4), 0 0 20px rgba(212,175,55,0.08)`;
    };
    const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current; if (!el) return;
        el.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)";
        el.style.boxShadow = "";
        if (rest.onMouseLeave) rest.onMouseLeave(e);
    };
    return (
        <div ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
                background: "rgba(12,22,40,0.85)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${GLASS_B}`,
                borderRadius: 18,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                position: "relative", overflow: "hidden",
                ...style
            }} {...rest}>
            {/* Inner top-light reflection */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", pointerEvents: "none" }} />
            {children}
        </div>
    );
}

export function RiderDashboard() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("overview");
    const [profile, setProfile] = useState<any>(null);
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [p, r] = await Promise.all([getProfile(), getMyRides()]);
                setProfile(p);
                setRides(r || []);
                setLoading(false);
            } catch (e) {
                console.error("Failed to load dashboard data", e);
                // Try from local storage if profile fails
                const localUser = JSON.parse(localStorage.getItem('saaradhigo_current_user') || 'null');
                if (localUser) setProfile(localUser);
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('saaradhigo_current_user');
        navigate("/login");
    };

    const coins = (profile?.reward_coins) || 2450;
    const progress = ((coins - 1000) / 2000) * 100;

    const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
        { id: "overview", icon: <Home size={16} />, label: "Overview" },
        { id: "wallet", icon: <Wallet size={16} />, label: "Wallet" },
        { id: "rewards", icon: <Trophy size={16} />, label: "Rewards" },
        { id: "history", icon: <Clock size={16} />, label: "My Rides" },
        { id: "profile", icon: <User size={16} />, label: "Profile" },
    ];

    return (
        <div style={{
            minHeight: "100vh",
            background: `linear-gradient(160deg, ${DARK} 0%, #0a1628 50%, ${NAVY} 100%)`,
            fontFamily: "'Inter','Segoe UI',sans-serif", color: "white"
        }}>
            {/* ambient glow orbs */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
                <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.04), transparent 70%)", top: "10%", left: "-10%", filter: "blur(80px)" }} />
                <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.04), transparent 70%)", bottom: "10%", right: "-5%", filter: "blur(80px)" }} />
            </div>
            {/* ── NAVBAR ── */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 50,
                display: "flex", alignItems: "center", gap: 16, padding: "12px 5vw",
                background: "rgba(5,13,26,0.94)", backdropFilter: "blur(24px)",
                borderBottom: `1px solid rgba(212,175,55,0.12)`
            }}>
                {/* gold shimmer top line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6) 50%, transparent)", pointerEvents: "none" }} />
                <button onClick={() => navigate("/")} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "none", border: "none", cursor: "pointer"
                }}>
                    <img src={logoImage} alt="logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} />
                    <span style={{ fontWeight: 900, fontSize: 16 }}>
                        <span style={{ color: G }}>SAARADHI</span><span style={{ color: "white" }}>GO</span>
                    </span>
                </button>

                <span style={{
                    padding: "3px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                    background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", color: G
                }}>Rider Dashboard</span>

                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
                    <button style={{
                        width: 38, height: 38, borderRadius: 10, background: GLASS,
                        border: `1px solid ${GLASS_B}`, display: "flex", alignItems: "center",
                        justifyContent: "center", cursor: "pointer"
                    }}>
                        <Bell size={16} color="rgba(255,255,255,0.5)" />
                    </button>
                    <div style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
                        background: GLASS, border: `1px solid ${GLASS_B}`, borderRadius: 10, cursor: "pointer"
                    }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: "50%", background: "rgba(212,175,55,0.2)",
                            border: `1px solid ${G}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
                        }}>{profile?.gender === 'female' ? "👩" : "👨"}</div>
                        <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{profile?.full_name || "Arjun Kumar"}</span>
                        <ChevronDown size={14} color="rgba(255,255,255,0.4)" />
                    </div>
                    <button onClick={() => navigate("/book")} style={{
                        padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                        background: `linear-gradient(135deg, ${G}, #F0C040)`, color: DARK, fontSize: 13, fontWeight: 700,
                        boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
                        transition: "all 0.25s"
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(212,175,55,0.45)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(212,175,55,0.3)"; }}
                    >
                        + Book Ride
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 5vw", display: "flex", gap: 28, position: "relative", zIndex: 1 }}>
                {/* ── SIDEBAR ── */}
                <aside style={{ width: 200, flexShrink: 0 }}>
                    <div style={{ position: "sticky", top: 82 }}>
                        {/* User card */}
                        <GCard style={{ padding: 22, marginBottom: 16, textAlign: "center" }} glow="#D4AF37">
                            <div style={{
                                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 10px",
                                background: "rgba(212,175,55,0.15)", border: `2px solid ${G}`,
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32
                            }}>{profile?.gender === 'female' ? "👩" : "👨"}</div>
                            <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{profile?.full_name || "Arjun Kumar"}</p>
                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginBottom: 10 }}>Member since {profile?.date_joined ? new Date(profile.date_joined).getFullYear() : "2024"}</p>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px",
                                background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 999,
                                boxShadow: "0 0 16px rgba(212,175,55,0.12)"
                            }}>
                                <span style={{ fontSize: 14 }}>🥇</span>
                                <span style={{ color: G, fontSize: 11, fontWeight: 700 }}>Gold Tier</span>
                            </div>
                        </GCard>

                        {/* Nav tabs */}
                        <GCard style={{ overflow: "hidden" }}>
                            {tabs.map((t, i) => (
                                <button key={t.id} onClick={() => setTab(t.id)} style={{
                                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                                    padding: "13px 16px", background: tab === t.id ? "rgba(212,175,55,0.08)" : "transparent",
                                    borderLeft: tab === t.id ? `3px solid ${G}` : "3px solid transparent",
                                    borderTop: "none", borderRight: "none",
                                    borderBottom: i < tabs.length - 1 ? `1px solid ${GLASS_B}` : "none",
                                    cursor: "pointer", transition: "all 0.2s"
                                }}>
                                    <span style={{ color: tab === t.id ? G : "rgba(255,255,255,0.4)" }}>{t.icon}</span>
                                    <span style={{ color: tab === t.id ? "white" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: tab === t.id ? 700 : 400 }}>
                                        {t.label}
                                    </span>
                                </button>
                            ))}
                        </GCard>

                        {/* Quick stats */}
                        <GCard style={{ padding: 16, marginTop: 16 }}>
                            {[["48", "Total Rides"], ["4.9★", "Rating"], ["₹4,280", "Total Spent"], ["312 km", "Distance"]].map(([v, l]) => (
                                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{l}</span>
                                    <span style={{ color: G, fontSize: 13, fontWeight: 700 }}>{v}</span>
                                </div>
                            ))}
                        </GCard>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main style={{ flex: 1, minWidth: 0 }}>

                    {/* ═══ OVERVIEW ═══ */}
                    {tab === "overview" && (
                        <div>
                            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>Good afternoon, {profile?.full_name?.split(' ')[0] || "Arjun"}! 👋</h1>
                            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Welcome back to your SaaradhiGO dashboard.</p>

                            {/* Stats row */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
                                {[
                                    { icon: "🚗", label: "Total Rides", value: rides.length || "48", color: G, sub: "+3 this week" },
                                    { icon: "💰", label: "Wallet Balance", value: `₹${profile?.wallet_balance || 850}`, color: "#4ade80", sub: "Available", glow: "#4ade80" },
                                    { icon: "🪙", label: "Reward Coins", value: "2,450", color: "#60A5FA", sub: "Gold Member", glow: "#60A5FA" },
                                    { icon: "⭐", label: "Your Rating", value: "4.9", color: G, sub: "out of 5.0", glow: "#D4AF37" },
                                ].map(s => (
                                    <GCard key={s.label} style={{ padding: 20 }} glow={s.glow}>
                                        <div style={{ fontSize: 26, marginBottom: 10, filter: `drop-shadow(0 0 8px ${s.color}55)` }}>{s.icon}</div>
                                        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, marginBottom: 6, textTransform: "uppercase" }}>{s.label}</p>
                                        <p style={{ color: s.color, fontSize: 26, fontWeight: 900, marginBottom: 3, textShadow: `0 0 16px ${s.color}44` }}>{s.value}</p>
                                        <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 10 }}>{s.sub}</p>
                                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}55, transparent)`, borderRadius: "0 0 18px 18px" }} />
                                    </GCard>
                                ))}
                            </div>

                            {/* Book ride CTA + Rewards progress */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                                {/* Book Ride */}
                                <div style={{
                                    background: `linear-gradient(135deg, rgba(212,175,55,0.1), rgba(10,22,40,0.9))`,
                                    border: "1px solid rgba(212,175,55,0.3)", borderRadius: 20, padding: 24,
                                    display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 180,
                                    position: "relative", overflow: "hidden",
                                    boxShadow: "0 0 40px rgba(212,175,55,0.06) inset"
                                }}>
                                    {/* grid pattern bg */}
                                    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(212,175,55,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
                                    <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.1), transparent 70%)", pointerEvents: "none" }} />
                                    <div>
                                        <p style={{ color: G, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>QUICK BOOKING</p>
                                        <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Where to next?</h3>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Book a ride in seconds — Bike, Auto, Mini or Prime.</p>
                                    </div>
                                    <button onClick={() => navigate("/book")} style={{
                                        padding: "12px 24px", borderRadius: 12, border: "none",
                                        background: `linear-gradient(135deg, ${G}, #F0C040)`, color: DARK,
                                        fontSize: 14, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8
                                    }}>
                                        🚗 Book a Ride
                                    </button>
                                </div>

                                {/* Rewards progress */}
                                <GCard style={{ padding: 24 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                        <div>
                                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 4 }}>REWARD COINS</p>
                                            <p style={{ color: G, fontSize: 28, fontWeight: 900 }}>2,450</p>
                                        </div>
                                        <span style={{ fontSize: 32 }}>🥇</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                        <span style={{ padding: "4px 10px", background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 999, color: G, fontSize: 11, fontWeight: 700 }}>Gold Member</span>
                                        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>550 to Platinum</span>
                                    </div>
                                    <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                                        <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${G}, #F0C040)`, borderRadius: 999 }} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>Gold (1000)</span>
                                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>Platinum (3000)</span>
                                    </div>
                                    <button onClick={() => setTab("rewards")} style={{
                                        marginTop: 14, width: "100%", padding: "10px", borderRadius: 10, border: `1px solid rgba(212,175,55,0.25)`,
                                        background: "rgba(212,175,55,0.06)", color: G, fontSize: 12, fontWeight: 700, cursor: "pointer"
                                    }}>View & Redeem Rewards →</button>
                                </GCard>
                            </div>

                            {/* Recent rides */}
                            <GCard style={{ overflow: "hidden" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${GLASS_B}` }}>
                                    <p style={{ fontWeight: 700, fontSize: 15 }}>Recent Rides</p>
                                    <button onClick={() => setTab("history")} style={{ color: G, fontSize: 12, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
                                </div>
                                {(rides.length > 0 ? rides : DEFAULT_HISTORY).slice(0, 3).map((r, i) => (
                                    <div key={r.id} style={{
                                        display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                                        borderBottom: i < 2 ? `1px solid ${GLASS_B}` : "none"
                                    }}>
                                        <div style={{ fontSize: 28, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,28,46,0.8)", borderRadius: 12, flexShrink: 0 }}>{r.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{r.type}</p>
                                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{r.from} → {r.to} • {r.date}</p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{r.fare}</p>
                                            <span style={{
                                                fontSize: 10, padding: "2px 8px", borderRadius: 999,
                                                background: r.status === "completed" ? "rgba(96,208,96,0.12)" : "rgba(232,64,64,0.1)",
                                                color: r.status === "completed" ? "#60D080" : "#E84040"
                                            }}>{r.status === "completed" ? "✓ Completed" : "✗ Cancelled"}</span>
                                        </div>
                                    </div>
                                ))}
                            </GCard>
                        </div>
                    )}

                    {/* ═══ WALLET ═══ */}
                    {tab === "wallet" && (
                        <div>
                            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Wallet</h1>
                            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Manage your balance, add money, and view transactions.</p>

                            {/* Balance hero */}
                            <div style={{
                                background: "linear-gradient(135deg, #1a2d48, #0d1f35)",
                                border: "1px solid rgba(212,175,55,0.3)", borderRadius: 24, padding: 32, marginBottom: 20,
                                position: "relative", overflow: "hidden"
                            }}>
                                <div style={{ position: "absolute", right: -60, top: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.08), transparent)" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                                    <div>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 8 }}>Available Balance</p>
                                        <p style={{ color: G, fontSize: 48, fontWeight: 900, marginBottom: 4 }}>₹{profile?.wallet_balance || "0"}</p>
                                        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Last updated: Today, 10:00 AM</p>
                                    </div>
                                    <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(212,175,55,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Wallet size={28} color={G} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                    <button style={{
                                        display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, border: "none",
                                        background: `linear-gradient(135deg, ${G}, #F0C040)`, color: DARK, fontSize: 14, fontWeight: 700, cursor: "pointer"
                                    }}><Plus size={16} /> Add Money</button>
                                    <button style={{
                                        display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12,
                                        border: `1px solid rgba(212,175,55,0.3)`, background: "rgba(212,175,55,0.06)",
                                        color: G, fontSize: 14, fontWeight: 600, cursor: "pointer"
                                    }}><CreditCard size={16} /> Linked Cards</button>
                                </div>
                            </div>

                            {/* Quick add */}
                            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                                {["₹100", "₹200", "₹500", "₹1000"].map(amt => (
                                    <button key={amt} style={{
                                        flex: 1, padding: "12px", borderRadius: 12, cursor: "pointer",
                                        background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)",
                                        color: G, fontSize: 14, fontWeight: 700
                                    }}>{amt}</button>
                                ))}
                            </div>

                            {/* Transactions */}
                            <GCard style={{ overflow: "hidden" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${GLASS_B}` }}>
                                    <p style={{ fontWeight: 700, fontSize: 15 }}>Transaction History</p>
                                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Last 30 days</span>
                                </div>
                                {DEFAULT_TX.map((tx, i) => (
                                    <div key={tx.id} style={{
                                        display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                                        borderBottom: i < DEFAULT_TX.length - 1 ? `1px solid ${GLASS_B}` : "none",
                                        transition: "background 0.2s"
                                    }}
                                        onMouseEnter={(e: any) => e.currentTarget.style.background = "rgba(212,175,55,0.03)"}
                                        onMouseLeave={(e: any) => e.currentTarget.style.background = "transparent"}
                                    >
                                        <div style={{
                                            width: 46, height: 46, borderRadius: 14, flexShrink: 0, fontSize: 22,
                                            background: "rgba(15,28,46,0.8)", display: "flex", alignItems: "center", justifyContent: "center"
                                        }}>{tx.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{tx.desc}</p>
                                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{tx.sub} • {tx.date}</p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ fontWeight: 700, fontSize: 16, color: tx.type === "credit" ? "#60D080" : "#FF8080", marginBottom: 4 }}>
                                                {tx.type === "credit" ? "+" : "-"}₹{tx.amount.replace(/[₹+-]/g, "")}
                                            </p>
                                            {tx.type === "credit"
                                                ? <ArrowDownLeft size={14} color="#60D080" />
                                                : <ArrowUpRight size={14} color="#FF8080" />
                                            }
                                        </div>
                                    </div>
                                ))}
                            </GCard>
                        </div>
                    )}

                    {/* ═══ REWARDS ═══ */}
                    {tab === "rewards" && (
                        <div>
                            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>SaaraRewards</h1>
                            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Earn coins on every ride and redeem exclusive rewards.</p>

                            {/* Coins + tier hero */}
                            <div style={{
                                background: "linear-gradient(135deg, #1a3a20, #0d2210)",
                                border: "1px solid rgba(212,175,55,0.25)", borderRadius: 24, padding: 28, marginBottom: 20,
                                position: "relative", overflow: "hidden"
                            }}>
                                <div style={{ position: "absolute", right: -40, top: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.06), transparent)" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                    <div>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 6 }}>Your Coin Balance</p>
                                        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                                            <span style={{ color: G, fontSize: 52, fontWeight: 900 }}>2,450</span>
                                            <span style={{ color: "rgba(212,175,55,0.5)", fontSize: 16, marginBottom: 10 }}>coins</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                                            <span style={{ padding: "4px 12px", background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.35)", borderRadius: 999, color: G, fontSize: 12, fontWeight: 700 }}>🥇 Gold Member</span>
                                            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>550 coins to Platinum</span>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 56 }}>🥇</span>
                                </div>
                                <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
                                    <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${G}, #F0C040)`, borderRadius: 999 }} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Gold (1,000)</span>
                                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Platinum (3,000)</span>
                                </div>
                            </div>

                            {/* Tier ladder */}
                            <GCard style={{ padding: 20, marginBottom: 20 }}>
                                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Membership Tiers</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                                    {TIERS.map((tier, i) => (
                                        <div key={tier.name} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                                            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <div style={{
                                                    width: 52, height: 52, borderRadius: "50%", display: "flex", alignItems: "center",
                                                    justifyContent: "center", marginBottom: 6, fontSize: 24,
                                                    background: tier.name === "Gold" ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
                                                    border: `2px solid ${tier.name === "Gold" ? G : "rgba(255,255,255,0.1)"}`
                                                }}>{tier.icon}</div>
                                                <span style={{ fontSize: 11, color: tier.name === "Gold" ? G : "rgba(255,255,255,0.4)", fontWeight: tier.name === "Gold" ? 700 : 400 }}>{tier.name}</span>
                                                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{tier.min.toLocaleString()}+</span>
                                            </div>
                                            {i < 3 && <div style={{ height: 2, width: 24, background: i < 1 ? G : "rgba(255,255,255,0.08)" }} />}
                                        </div>
                                    ))}
                                </div>
                            </GCard>

                            {/* Rewards grid */}
                            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Redeem Rewards</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 24 }}>
                                {REWARDS.map(r => (
                                    <GCard key={r.title} style={{ padding: 20, border: `1px solid ${r.available ? "rgba(212,175,55,0.2)" : GLASS_B}`, opacity: r.available ? 1 : 0.75 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                            <div style={{
                                                width: 50, height: 50, borderRadius: 14, background: r.available ? "rgba(212,175,55,0.1)" : GLASS,
                                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26
                                            }}>{r.icon}</div>
                                            <span style={{
                                                padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                                                background: r.available ? "rgba(212,175,55,0.1)" : GLASS,
                                                color: r.available ? G : "rgba(255,255,255,0.3)"
                                            }}>🪙 {r.coins}</span>
                                        </div>
                                        <p style={{ color: r.available ? "white" : "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{r.title}</p>
                                        <p style={{ color: r.available ? G : "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 14 }}>{r.value}</p>
                                        <button style={{
                                            width: "100%", padding: "10px", borderRadius: 10, border: "none",
                                            background: r.available ? `linear-gradient(135deg, ${G}, #F0C040)` : "rgba(255,255,255,0.06)",
                                            color: r.available ? DARK : "rgba(255,255,255,0.3)",
                                            cursor: r.available ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 700
                                        }}>
                                            {r.available ? "Redeem Now" : "🔒 Locked"}
                                        </button>
                                    </GCard>
                                ))}
                            </div>

                            {/* Activity */}
                            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Coin Activity</p>
                            <GCard style={{ overflow: "hidden" }}>
                                {[
                                    { action: "Completed 3 rides", coins: "+150", time: "Today", type: "earn" },
                                    { action: "Redeemed free ride coupon", coins: "-500", time: "Yesterday", type: "spend" },
                                    { action: "Referral bonus — Rahul joined", coins: "+300", time: "Mon", type: "earn" },
                                    { action: "Weekend surge bonus", coins: "+200", time: "Sat", type: "earn" },
                                ].map((a, i, arr) => (
                                    <div key={i} style={{
                                        display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                                        borderBottom: i < arr.length - 1 ? `1px solid ${GLASS_B}` : "none"
                                    }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                                            background: a.type === "earn" ? "rgba(96,208,96,0.1)" : "rgba(255,100,100,0.1)"
                                        }}>
                                            {a.type === "earn" ? <Zap size={16} color="#60D080" /> : <Gift size={16} color="#FF6464" />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{a.action}</p>
                                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{a.time}</p>
                                        </div>
                                        <span style={{ color: a.type === "earn" ? "#60D080" : "#FF6464", fontSize: 15, fontWeight: 700 }}>{a.coins}</span>
                                    </div>
                                ))}
                            </GCard>
                        </div>
                    )}

                    {/* ═══ RIDE HISTORY ═══ */}
                    {tab === "history" && (
                        <div>
                            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>My Rides</h1>
                            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Your complete ride history and trip details.</p>

                            {/* Summary */}
                            <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
                                {[["48", "Total Rides"], ["312 km", "Total Distance"], ["₹4,280", "Total Spent"], ["4.9 ★", "Avg Rating"]].map(([v, l]) => (
                                    <div key={l} style={{
                                        flex: 1, minWidth: 120, padding: "18px 20px", borderRadius: 16,
                                        background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.12)", textAlign: "center"
                                    }}>
                                        <p style={{ color: G, fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{v}</p>
                                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{l}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {(rides.length > 0 ? rides : DEFAULT_HISTORY).map(r => (
                                    <GCard key={r.id} style={{ overflow: "hidden", transition: "border-color 0.2s" }}
                                        onMouseEnter={(e: any) => e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)"}
                                        onMouseLeave={(e: any) => e.currentTarget.style.borderColor = GLASS_B}
                                    >
                                        {/* Top */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: `1px solid ${GLASS_B}` }}>
                                            <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(212,175,55,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{r.icon}</div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{r.type}</p>
                                                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{r.date} • {r.distance}</p>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <p style={{ fontWeight: 800, fontSize: 18, marginBottom: 5 }}>{r.fare}</p>
                                                <span style={{
                                                    padding: "3px 10px", borderRadius: 999, fontSize: 11,
                                                    background: r.status === "completed" ? "rgba(96,208,96,0.1)" : "rgba(232,64,64,0.1)",
                                                    color: r.status === "completed" ? "#60D080" : "#E84040"
                                                }}>{r.status === "completed" ? "✓ Completed" : "✗ Cancelled"}</span>
                                            </div>
                                        </div>

                                        {/* Route */}
                                        <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: r.status === "completed" ? `1px solid ${GLASS_B}` : "none" }}>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: G }} />
                                                <div style={{ width: 1, height: 16, background: "rgba(212,175,55,0.25)" }} />
                                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E84040" }} />
                                            </div>
                                            <div>
                                                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 10 }}>{r.from}</p>
                                                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{r.to}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {r.status === "completed" && (
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px" }}>
                                                <div style={{ display: "flex", gap: 2 }}>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} size={14} fill={s <= r.rating ? G : "transparent"} color={G} />
                                                    ))}
                                                </div>
                                                <div style={{ display: "flex", gap: 10 }}>
                                                    <button style={{ display: "flex", alignItems: "center", gap: 6, color: G, fontSize: 12, background: "none", border: "none", cursor: "pointer" }}>
                                                        <Download size={13} /> Invoice
                                                    </button>
                                                    <button onClick={() => navigate("/book")} style={{
                                                        padding: "6px 14px", borderRadius: 8, border: `1px solid rgba(212,175,55,0.25)`,
                                                        background: "rgba(212,175,55,0.06)", color: G, fontSize: 12, cursor: "pointer"
                                                    }}>Rebook</button>
                                                </div>
                                            </div>
                                        )}
                                    </GCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ PROFILE ═══ */}
                    {tab === "profile" && (
                        <div>
                            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>My Profile</h1>
                            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Manage your personal information and preferences.</p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                {/* Left */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    {/* Avatar card */}
                                    <GCard style={{ padding: 24 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
                                            <div style={{
                                                width: 80, height: 80, borderRadius: "50%", flexShrink: 0, fontSize: 40,
                                                background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))",
                                                border: `2px solid ${G}`, display: "flex", alignItems: "center", justifyContent: "center"
                                            }}>{profile?.gender === 'female' ? "👩" : "👨"}</div>
                                            <div>
                                                <p style={{ fontWeight: 800, fontSize: 20, marginBottom: 3 }}>{profile?.full_name || "Arjun Kumar"}</p>
                                                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 10 }}>Member since {profile?.date_joined ? new Date(profile.date_joined).getFullYear() : "2024"}</p>
                                                <button style={{ padding: "7px 16px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${G}, #F0C040)`, color: DARK, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                                    Edit Profile
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 20, paddingTop: 16, borderTop: `1px solid ${GLASS_B}` }}>
                                            {[["48", "Rides"], ["4.9★", "Rating"], ["Gold", "Tier"]].map(([v, l]) => (
                                                <div key={l} style={{ textAlign: "center", flex: 1 }}>
                                                    <p style={{ color: G, fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{v}</p>
                                                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{l}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </GCard>

                                    {/* Personal info */}
                                    <GCard style={{ overflow: "hidden" }}>
                                        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${GLASS_B}`, display: "flex", justifyContent: "space-between" }}>
                                            <p style={{ fontWeight: 700, fontSize: 14 }}>Personal Information</p>
                                            <button style={{ color: G, fontSize: 12, background: "none", border: "none", cursor: "pointer" }}>Edit</button>
                                        </div>
                                        {[
                                            { Icon: User, label: "Full Name", value: profile?.full_name || "Not Set" },
                                            { Icon: Phone, label: "Phone Number", value: profile?.phone_number || "Not Set" },
                                            { Icon: Mail, label: "Email", value: profile?.email || "Not Set" },
                                            { Icon: Calendar, label: "Date of Birth", value: profile?.dob || "Not Set" },
                                            { Icon: User, label: "Gender", value: profile?.gender || "Not Set" },
                                        ].map(({ Icon, label, value }, i, arr) => (
                                            <div key={label} style={{
                                                display: "flex", alignItems: "center", gap: 14, padding: "13px 20px",
                                                borderBottom: i < arr.length - 1 ? `1px solid ${GLASS_B}` : "none"
                                            }}>
                                                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(212,175,55,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <Icon size={15} color={G} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginBottom: 2 }}>{label}</p>
                                                    <p style={{ color: "white", fontSize: 14 }}>{value}</p>
                                                </div>
                                                <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
                                            </div>
                                        ))}
                                    </GCard>
                                </div>

                                {/* Right */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    {/* Emergency contacts */}
                                    <GCard style={{ overflow: "hidden" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${GLASS_B}` }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <Shield size={15} color={G} />
                                                <p style={{ fontWeight: 700, fontSize: 14 }}>Emergency Contacts</p>
                                            </div>
                                            <button style={{ color: G, fontSize: 12, background: "none", border: "none", cursor: "pointer" }}>+ Add</button>
                                        </div>
                                        {[
                                            { name: "Priya Kumar", relation: "Sister", phone: "+91 98880 12345" },
                                            { name: "Suresh Kumar", relation: "Father", phone: "+91 97760 98765" },
                                        ].map((c, i) => (
                                            <div key={c.name} style={{
                                                display: "flex", alignItems: "center", gap: 14, padding: "13px 20px",
                                                borderBottom: i === 0 ? `1px solid ${GLASS_B}` : "none"
                                            }}>
                                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(212,175,55,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{c.name}</p>
                                                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{c.relation} • {c.phone}</p>
                                                </div>
                                                <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
                                            </div>
                                        ))}
                                    </GCard>

                                    {/* Preferences */}
                                    <GCard style={{ padding: 20 }}>
                                        <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                            <Settings size={15} color={G} /> Preferences
                                        </p>
                                        {[
                                            { label: "Push Notifications", on: true },
                                            { label: "Email Receipts", on: true },
                                            { label: "Ride Alerts (SMS)", on: false },
                                            { label: "Promotional Offers", on: false },
                                        ].map(pref => (
                                            <div key={pref.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{pref.label}</span>
                                                <div style={{
                                                    width: 42, height: 24, borderRadius: 12, cursor: "pointer",
                                                    background: pref.on ? `linear-gradient(135deg, ${G}, #F0C040)` : "rgba(255,255,255,0.1)",
                                                    display: "flex", alignItems: "center", padding: "0 3px",
                                                    justifyContent: pref.on ? "flex-end" : "flex-start"
                                                }}>
                                                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white" }} />
                                                </div>
                                            </div>
                                        ))}
                                    </GCard>

                                    {/* Logout */}
                                    <button onClick={logout} style={{
                                        width: "100%", padding: "14px", borderRadius: 14, cursor: "pointer",
                                        background: "rgba(220,50,50,0.06)", border: "1px solid rgba(220,50,50,0.2)",
                                        color: "#E84040", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                                    }}>
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #050D1A; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#D4AF37,#F0C040); border-radius:4px; }
        @media (max-width: 900px) {
          aside { display: none; }
          main { min-width: unset !important; }
        }
        @keyframes dashPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.35); }
          50% { box-shadow: 0 0 0 8px rgba(212,175,55,0); }
        }
      `}</style>
        </div>
    );
}

