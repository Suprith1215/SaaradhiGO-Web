import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    ArrowLeft, MapPin, Search, Home, Briefcase, Clock,
    Users, Zap, ChevronRight, Shield, Star, CreditCard,
    CheckCircle, Navigation, X, Phone, User, AlertCircle,
    MessageCircle, Send, PhoneCall, KeyRound, Car
} from "lucide-react";
import { MapBackground } from "../components/MapBackground";
import logoImage from "figma:asset/25a5bd8011d7696bf02e1d5cc818a54ef634abf4.png";

const G = "#D4AF37";
const DARK = "#050D1A";
const NAVY = "#0F1C2E";
const GLASS = "rgba(255,255,255,0.04)";
const GLASS_B = "rgba(255,255,255,0.09)";

/* ── Ride data from Figma ── */
const rides = [
    { id: "bike", icon: "🏍️", name: "SaaraBike", desc: "Quick & affordable", eta: "2 min", price: "₹49", priceNum: 49, passengers: 1, badge: null },
    { id: "auto", icon: "🛺", name: "SaaraAuto", desc: "Classic auto rickshaw", eta: "4 min", price: "₹89", priceNum: 89, passengers: 3, badge: null },
    { id: "mini", icon: "🚗", name: "SaaraMini", desc: "Compact & comfortable", eta: "5 min", price: "₹129", priceNum: 129, passengers: 4, badge: "Popular" },
    { id: "prime", icon: "🚙", name: "SaaraPrime", desc: "Premium sedan experience", eta: "7 min", price: "₹199", priceNum: 199, passengers: 4, badge: "Premium" },
];

const recentLocations = [
    { icon: "🏢", name: "Brigade Road, Bengaluru", sub: "Commercial St, 2.3 km", time: "2h ago" },
    { icon: "🏥", name: "Manipal Hospital, HAL Road", sub: "HAL Airport Rd, 5.1 km", time: "Yesterday" },
    { icon: "🛒", name: "Phoenix Marketcity", sub: "Whitefield Rd, 8.4 km", time: "2 days ago" },
    { icon: "🎓", name: "IIM Bangalore", sub: "Bannerghatta Rd, 6.7 km", time: "3 days ago" },
    { icon: "✈️", name: "Kempegowda International Airport", sub: "BIAL, 35.8 km", time: "Last week" },
    { icon: "🏨", name: "Taj West End Hotel", sub: "Race Course Rd, 4.2 km", time: "Last week" },
];

const paymentMethods = [
    { id: "wallet", icon: "💛", label: "SaaraWallet", balance: "₹850" },
    { id: "upi", icon: "📱", label: "UPI / GPay / PhonePe", balance: null },
    { id: "card", icon: "💳", label: "Debit / Credit Card", balance: null },
    { id: "cash", icon: "💵", label: "Cash", balance: null },
];

type Step = "location" | "rides" | "confirm" | "booked";
type Gender = "male" | "female" | "other" | "";

export function BookRidePage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("location");
    const [pickup, setPickup] = useState("Koramangala, Bengaluru");
    const [drop, setDrop] = useState("");
    const [dropFocused, setDropFocused] = useState(false);
    const [selectedRide, setSelectedRide] = useState("mini");
    const [payment, setPayment] = useState("wallet");
    const [confirmed, setConfirmed] = useState(false);
    const [gender, setGender] = useState<Gender>("");
    const [guardianName, setGuardianName] = useState("");
    const [guardianPhone, setGuardianPhone] = useState("");
    const [shareTrip, setShareTrip] = useState(false);
    const dropRef = useRef<HTMLInputElement>(null);

    const ride = rides.find(r => r.id === selectedRide)!;
    const isFemale = gender === "female";
    const guardianRequired = false;
    const guardianFilled = guardianName.trim().length > 0 && guardianPhone.replace(/\D/g, "").length === 10;
    const canBook = !guardianRequired || guardianFilled;

    const resetAndBookAnother = () => {
        setStep("location");
        setPickup("Koramangala, Bengaluru");
        setDrop("");
        setDropFocused(false);
        setSelectedRide("mini");
        setPayment("wallet");
        setConfirmed(false);
        setGender("");
        setGuardianName("");
        setGuardianPhone("");
        setShareTrip(false);
    };

    useEffect(() => {
        if (step === "location") setTimeout(() => dropRef.current?.focus(), 100);
    }, [step]);

    /* ── Booking success ── */
    if (step === "booked") return <BookedScreen navigate={navigate} ride={ride} guardianName={guardianName} shareTrip={shareTrip} onBookAnother={resetAndBookAnother} />;

    return (
        <div style={{
            minHeight: "100vh", background: `linear-gradient(180deg, ${DARK} 0%, ${NAVY} 100%)`,
            fontFamily: "'Inter','Segoe UI',sans-serif", color: "white"
        }}>
            {/* ── TOP NAV ── */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 50,
                display: "flex", alignItems: "center", gap: 16,
                padding: "14px 5vw",
                background: "rgba(5,13,26,0.92)", backdropFilter: "blur(20px)",
                borderBottom: `1px solid ${GLASS_B}`
            }}>
                <button onClick={() => navigate("/")} style={{
                    width: 40, height: 40, borderRadius: 12, background: GLASS,
                    border: `1px solid ${GLASS_B}`, display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer"
                }}>
                    <ArrowLeft size={20} color={G} />
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={logoImage} alt="logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} />
                    <span style={{ fontWeight: 900, fontSize: 16 }}>
                        <span style={{ color: G }}>SAARADHI</span><span style={{ color: "white" }}>GO</span>
                    </span>
                </div>

                {/* Step breadcrumb */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                    {(["location", "rides", "confirm"] as Step[]).map((s, i) => {
                        const labels = ["📍 Location", "🚗 Choose Ride", "✅ Confirm"];
                        const active = s === step;
                        const done = ["location", "rides", "confirm"].indexOf(step) > i;
                        return (
                            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "5px 12px", borderRadius: 999,
                                    background: active ? "rgba(212,175,55,0.15)" : done ? "rgba(212,175,55,0.06)" : GLASS,
                                    border: `1px solid ${active ? "rgba(212,175,55,0.4)" : done ? "rgba(212,175,55,0.2)" : GLASS_B}`,
                                    fontSize: 12, fontWeight: active ? 700 : 500,
                                    color: active ? G : done ? "rgba(212,175,55,0.6)" : "rgba(255,255,255,0.35)"
                                }}>
                                    {done ? "✓" : null} {labels[i]}
                                </div>
                                {i < 2 && <ChevronRight size={14} color="rgba(255,255,255,0.2)" />}
                            </div>
                        );
                    })}
                </div>
            </nav>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 5vw" }}>
                {/* ══════════════════════════════════════════
            STEP 1: LOCATION
        ══════════════════════════════════════════ */}
                {step === "location" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="book-grid">
                        {/* ─── Left Panel ─── */}
                        <div>

                            {/* Premium heading */}
                            <div style={{ marginBottom: 28 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10,
                                        background: `linear-gradient(135deg, ${G}, #F0C040)`,
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>
                                        <MapPin size={18} color="#050D1A" strokeWidth={2.5} />
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: G, textTransform: "uppercase" }}>Live Booking</span>
                                </div>
                                <h1 style={{
                                    fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 900, lineHeight: 1.15,
                                    background: "linear-gradient(135deg,#fff 50%,rgba(212,175,55,0.7))",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                    backgroundClip: "text", marginBottom: 8,
                                }}>
                                    Where to next?<br />
                                    <span style={{ fontStyle: "italic" }}>Your chariot awaits.</span>
                                </h1>
                                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
                                    6 vehicles available near you · Avg wait <strong style={{ color: G }}>3 min</strong>
                                </p>
                            </div>

                            {/* Live nearby vehicle pills */}
                            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                                {[
                                    { icon: "🚗", label: "Cars", count: "3", col: "#D4AF37" },
                                    { icon: "🛺", label: "Autos", count: "2", col: "#4ECDC4" },
                                    { icon: "🏍️", label: "Bikes", count: "4", col: "#A78BFA" },
                                ].map(v => (
                                    <div key={v.label} style={{
                                        flex: 1, padding: "8px 10px", borderRadius: 12,
                                        background: `linear-gradient(135deg, ${v.col}12, ${v.col}05)`,
                                        border: `1px solid ${v.col}33`,
                                        textAlign: "center"
                                    }}>
                                        <div style={{ fontSize: 22 }}>{v.icon}</div>
                                        <div style={{ color: v.col, fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>{v.count}</div>
                                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600 }}>{v.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* ─── Location Inputs ─── */}
                            <div style={{
                                background: "linear-gradient(135deg, rgba(15,28,46,0.95), rgba(10,18,30,0.95))",
                                borderRadius: 20, border: `1px solid rgba(212,175,55,0.15)`,
                                padding: 20, marginBottom: 16,
                                boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
                            }}>
                                {/* Pickup */}
                                <div style={{ marginBottom: 12 }}>
                                    <p style={{ color: G, fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                                        📍 Pickup Location
                                    </p>
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: 12,
                                        background: "rgba(212,175,55,0.06)", borderRadius: 12,
                                        padding: "13px 14px", border: "1.5px solid rgba(212,175,55,0.3)",
                                        boxShadow: "0 0 20px rgba(212,175,55,0.08)"
                                    }}>
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: G, boxShadow: `0 0 0 4px rgba(212,175,55,0.2)`, flexShrink: 0 }} />
                                        <input
                                            value={pickup}
                                            onChange={e => setPickup(e.target.value)}
                                            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "white", fontSize: 14, fontWeight: 500 }}
                                            placeholder="Enter pickup location"
                                        />
                                        <Navigation size={16} color={G} />
                                    </div>
                                </div>

                                {/* Route connector */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0 6px 4px" }}>
                                    <div style={{ width: 2, height: 28, background: `linear-gradient(180deg, ${G}, #60A5FA)`, borderRadius: 2, marginLeft: 3 }} />
                                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>Route</span>
                                </div>

                                {/* Drop */}
                                <div>
                                    <p style={{ color: "#60A5FA", fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                                        🎯 Drop Location
                                    </p>
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: 12,
                                        background: "rgba(255,255,255,0.04)", borderRadius: 12,
                                        padding: "13px 14px",
                                        border: `1.5px solid ${dropFocused ? "rgba(96,165,250,0.5)" : GLASS_B}`,
                                        boxShadow: dropFocused ? "0 0 20px rgba(96,165,250,0.1)" : "none",
                                        transition: "all 0.3s"
                                    }}>
                                        <Search size={14} color={dropFocused ? "#60A5FA" : "#5a7a9a"} style={{ flexShrink: 0 }} />
                                        <input
                                            ref={dropRef}
                                            value={drop}
                                            onChange={e => setDrop(e.target.value)}
                                            onFocus={() => setDropFocused(true)}
                                            onBlur={() => setDropFocused(false)}
                                            placeholder="Where are you going?"
                                            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "white", fontSize: 14, fontWeight: 500 }}
                                            autoFocus
                                        />
                                        {drop && (
                                            <button onClick={() => setDrop("")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                                                <X size={14} color="#5a7a9a" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quick shortcuts */}
                            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                                {[
                                    { icon: <Home size={14} color={G} />, label: "Home", addr: "Koramangala 5th Block", sub: "2.1 km" },
                                    { icon: <Briefcase size={14} color={G} />, label: "Work", addr: "MG Road, Bengaluru", sub: "4.5 km" },
                                ].map(s => (
                                    <button key={s.label} onClick={() => setDrop(s.addr)} style={{
                                        flex: 1, display: "flex", alignItems: "center", gap: 10,
                                        padding: "12px 14px", borderRadius: 14,
                                        background: "rgba(212,175,55,0.05)",
                                        border: `1px solid rgba(212,175,55,0.15)`,
                                        cursor: "pointer", transition: "all 0.2s", textAlign: "left"
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,175,55,0.1)"; e.currentTarget.style.borderColor = `rgba(212,175,55,0.35)`; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(212,175,55,0.05)"; e.currentTarget.style.borderColor = `rgba(212,175,55,0.15)`; }}
                                    >
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                                            background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)",
                                            display: "flex", alignItems: "center", justifyContent: "center"
                                        }}>{s.icon}</div>
                                        <div>
                                            <p style={{ color: "white", fontSize: 13, fontWeight: 600, lineHeight: 1 }}>{s.label}</p>
                                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginTop: 2 }}>{s.sub}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Recent locations */}
                            <div>
                                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                                    <Clock size={10} /> Recent Locations
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    {recentLocations.map((r, i) => (
                                        <button key={i} onClick={() => setDrop(r.name)} style={{
                                            display: "flex", alignItems: "center", gap: 14,
                                            padding: "12px 16px", borderRadius: 14,
                                            background: "rgba(12,22,38,0.7)", border: `1px solid ${GLASS_B}`,
                                            cursor: "pointer", textAlign: "left", transition: "all 0.2s"
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,175,55,0.06)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(12,22,38,0.7)"; e.currentTarget.style.borderColor = GLASS_B; }}
                                        >
                                            <div style={{
                                                width: 38, height: 38, borderRadius: 10, flexShrink: 0, fontSize: 18,
                                                background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.15)",
                                                display: "flex", alignItems: "center", justifyContent: "center"
                                            }}>{r.icon}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ color: "white", fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</p>
                                                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{r.sub}</p>
                                            </div>
                                            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, flexShrink: 0 }}>{r.time}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Find Rides CTA */}
                            <button
                                onClick={() => { if (drop) setStep("rides"); }}
                                style={{
                                    width: "100%", marginTop: 22, padding: "17px",
                                    borderRadius: 16,
                                    border: drop ? "1px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.07)",
                                    cursor: drop ? "pointer" : "not-allowed",
                                    background: drop
                                        ? `linear-gradient(135deg, rgba(212,175,55,0.9), rgba(240,192,64,0.9))`
                                        : "rgba(255,255,255,0.05)",
                                    backdropFilter: drop ? "blur(12px)" : "none",
                                    boxShadow: drop ? "0 8px 32px rgba(212,175,55,0.3)" : "none",
                                    color: drop ? DARK : "rgba(255,255,255,0.25)",
                                    fontSize: 15, fontWeight: 800,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                    transition: "all 0.3s",
                                    letterSpacing: 0.5,
                                }}
                            >
                                <Zap size={18} strokeWidth={drop ? 2.5 : 1.5} />
                                Find Rides Near Me
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* ─── Right: Live Map ─── */}
                        <div style={{ borderRadius: 24, overflow: "hidden", height: 640, position: "sticky", top: 90, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
                            <MapBackground height="100%" showDriverPin showRoute={!!drop} showDestPin={!!drop} />

                            {/* Top overlay — your location */}
                            <div style={{
                                position: "absolute", top: 14, left: 14, right: 14,
                                background: "rgba(5,13,26,0.88)", backdropFilter: "blur(16px)",
                                border: `1px solid rgba(212,175,55,0.25)`, borderRadius: 16,
                                padding: "12px 16px", display: "flex", alignItems: "center", gap: 12
                            }}>
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: G, boxShadow: `0 0 0 4px rgba(212,175,55,0.25)` }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" }}>Your Location</p>
                                    <p style={{ color: "white", fontSize: 13, fontWeight: 700 }}>📍 {pickup || "Set pickup..."}</p>
                                </div>
                                <div style={{
                                    background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)",
                                    borderRadius: 8, padding: "4px 10px", fontSize: 11, color: G, fontWeight: 700
                                }}>LIVE</div>
                            </div>

                            {/* Bottom overlay — destination or vehicle count */}
                            {drop ? (
                                <div style={{
                                    position: "absolute", bottom: 60, left: 14, right: 14,
                                    background: "rgba(5,13,26,0.9)", backdropFilter: "blur(16px)",
                                    border: `1px solid rgba(96,165,250,0.3)`, borderRadius: 16, padding: "12px 16px"
                                }}>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" }}>Destination</p>
                                    <p style={{ color: "white", fontSize: 13, fontWeight: 700 }}>🎯 {drop}</p>
                                </div>
                            ) : (
                                <div style={{
                                    position: "absolute", bottom: 55, left: 14, right: 14,
                                    background: "rgba(5,13,26,0.85)", backdropFilter: "blur(16px)",
                                    border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 16,
                                    padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between"
                                }}>
                                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>🚗 3 &nbsp; 🛺 2 &nbsp; 🏍️ 4 &nbsp;<span style={{ color: G }}>available nearby</span></p>
                                    <Zap size={14} color={G} />
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* ══════════════════════════════════════════
            STEP 2: RIDE OPTIONS
        ══════════════════════════════════════════ */}
                {step === "rides" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="book-grid">
                        <div>
                            {/* Route summary */}
                            <div style={{
                                background: "rgba(15,28,46,0.8)", borderRadius: 20, border: `1px solid ${GLASS_B}`,
                                padding: 20, marginBottom: 24
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                    <button onClick={() => setStep("location")} style={{
                                        width: 34, height: 34, borderRadius: 10, background: GLASS,
                                        border: `1px solid ${GLASS_B}`, display: "flex", alignItems: "center",
                                        justifyContent: "center", cursor: "pointer"
                                    }}>
                                        <ArrowLeft size={16} color={G} />
                                    </button>
                                    <div>
                                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>Your Route</p>
                                        <p style={{ color: "white", fontSize: 13, fontWeight: 600 }}>📍 {pickup} → 🟢 {drop}</p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 10 }}>
                                    {[["📏", "8.8 km"], ["⏱️", "~22 min"], ["🔥", "Surge 1.2x"]].map(([ic, t]) => (
                                        <div key={t} style={{
                                            flex: 1, background: "rgba(212,175,55,0.06)", borderRadius: 10,
                                            border: "1px solid rgba(212,175,55,0.12)", padding: "8px",
                                            textAlign: "center", fontSize: 12, color: G, fontWeight: 600
                                        }}>{ic} {t}</div>
                                    ))}
                                </div>
                            </div>

                            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Choose Your Ride</h2>
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 }}>
                                Select the category that suits you best.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                                {rides.map(r => {
                                    const active = selectedRide === r.id;
                                    return (
                                        <button
                                            key={r.id}
                                            onClick={() => setSelectedRide(r.id)}
                                            style={{
                                                display: "flex", alignItems: "center", gap: 16,
                                                padding: "18px 20px", borderRadius: 18, textAlign: "left",
                                                background: active ? "rgba(212,175,55,0.08)" : "rgba(15,28,46,0.6)",
                                                border: active ? `2px solid ${G}` : `1px solid ${GLASS_B}`,
                                                cursor: "pointer", transition: "all 0.2s", width: "100%"
                                            }}
                                        >
                                            <div style={{
                                                width: 56, height: 56, borderRadius: 16, flexShrink: 0, fontSize: 28,
                                                background: active ? "rgba(212,175,55,0.15)" : GLASS,
                                                display: "flex", alignItems: "center", justifyContent: "center"
                                            }}>{r.icon}</div>

                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                                                    <span style={{ color: "white", fontSize: 15, fontWeight: 700 }}>{r.name}</span>
                                                    {r.badge && (
                                                        <span style={{
                                                            padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                                                            background: r.badge === "Premium" ? "rgba(212,175,55,0.15)" : "rgba(96,208,96,0.15)",
                                                            color: r.badge === "Premium" ? G : "#60D080"
                                                        }}>{r.badge}</span>
                                                    )}
                                                </div>
                                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 4 }}>{r.desc}</p>
                                                <div style={{ display: "flex", gap: 12 }}>
                                                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                                                        <Clock size={10} /> {r.eta}
                                                    </span>
                                                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                                                        <Users size={10} /> {r.passengers}
                                                    </span>
                                                </div>
                                            </div>

                                            <span style={{ color: active ? G : "white", fontSize: 20, fontWeight: 800 }}>{r.price}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setStep("confirm")}
                                style={{
                                    width: "100%", padding: "16px", borderRadius: 16, border: "none",
                                    cursor: "pointer", background: `linear-gradient(135deg, ${G}, #F0C040)`,
                                    color: DARK, fontSize: 16, fontWeight: 800,
                                    display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 24, paddingRight: 24
                                }}
                            >
                                <span>Book {rides.find(r => r.id === selectedRide)!.name}</span>
                                <span>{rides.find(r => r.id === selectedRide)!.price} →</span>
                            </button>
                        </div>

                        {/* Right: Map with route */}
                        <div style={{ borderRadius: 24, overflow: "hidden", height: 600, position: "sticky", top: 100 }}>
                            <MapBackground height="100%" showRoute showDriverPin showDestPin />
                            <div style={{
                                position: "absolute", top: 16, left: 16, right: 16,
                                background: "rgba(5,13,26,0.9)", backdropFilter: "blur(12px)",
                                border: `1px solid rgba(212,175,55,0.25)`, borderRadius: 14, padding: "12px 16px"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>PICKUP → DROP</p>
                                        <p style={{ color: "white", fontSize: 12, fontWeight: 600, marginTop: 2 }}>📍 {pickup.split(",")[0]} → 🟢 {drop.split(",")[0]}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ color: G, fontSize: 16, fontWeight: 800 }}>{ride.eta}</p>
                                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>away</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ride type badge on map */}
                            <div style={{
                                position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
                                background: `rgba(212,175,55,0.12)`, backdropFilter: "blur(12px)",
                                border: `1px solid rgba(212,175,55,0.4)`, borderRadius: 14,
                                padding: "10px 20px", textAlign: "center"
                            }}>
                                <p style={{ color: G, fontSize: 18, fontWeight: 800 }}>{ride.icon} {ride.name}</p>
                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{ride.price} • ETA {ride.eta}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
            STEP 3: CONFIRM & PAY
        ══════════════════════════════════════════ */}
                {step === "confirm" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="book-grid">
                        <div>
                            <button onClick={() => setStep("rides")} style={{
                                display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
                                color: G, cursor: "pointer", fontSize: 14, marginBottom: 20
                            }}>
                                <ArrowLeft size={16} /> Back to Ride Options
                            </button>

                            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Confirm Your Ride</h2>
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>Review details and choose how to pay.</p>

                            {/* Route card */}
                            <div style={{
                                background: "rgba(15,28,46,0.8)", borderRadius: 20, border: `1px solid ${GLASS_B}`,
                                padding: 20, marginBottom: 16
                            }}>
                                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>TRIP DETAILS</p>
                                <div style={{ display: "flex", gap: 14 }}>
                                    {/* Timeline */}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: G, boxShadow: "0 0 0 3px rgba(212,175,55,0.2)" }} />
                                        <div style={{ flex: 1, width: 2, background: "rgba(212,175,55,0.2)", margin: "4px 0" }} />
                                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#E84040" }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ marginBottom: 16 }}>
                                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, textTransform: "uppercase", marginBottom: 3 }}>PICKUP</p>
                                            <p style={{ color: "white", fontSize: 14, fontWeight: 500 }}>{pickup}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, textTransform: "uppercase", marginBottom: 3 }}>DROP</p>
                                            <p style={{ color: "white", fontSize: 14, fontWeight: 500 }}>{drop}</p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 10, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${GLASS_B}` }}>
                                    {[["📏 8.8 km", "Distance"], ["⏱️ ~22 min", "Duration"], [`${ride.price}`, "Fare"]].map(([v, l]) => (
                                        <div key={l} style={{ flex: 1, textAlign: "center" }}>
                                            <p style={{ color: G, fontSize: 14, fontWeight: 700 }}>{v}</p>
                                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>{l}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle card */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 14,
                                background: "rgba(15,28,46,0.8)", borderRadius: 18,
                                border: `1px solid ${GLASS_B}`, padding: 16, marginBottom: 16
                            }}>
                                <div style={{
                                    width: 60, height: 60, borderRadius: 16, background: "rgba(212,175,55,0.08)",
                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32
                                }}>{ride.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: "white", fontSize: 16, fontWeight: 700 }}>{ride.name}</p>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{ride.passengers} seats • {ride.desc}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                                        <Star size={11} color={G} fill={G} />
                                        <span style={{ color: G, fontSize: 12, fontWeight: 600 }}>Arrives in {ride.eta}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ color: G, fontSize: 22, fontWeight: 800 }}>{ride.price}</p>
                                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>estimated</p>
                                </div>
                            </div>

                            {/* Payment methods */}
                            <div style={{
                                background: "rgba(15,28,46,0.8)", borderRadius: 20, border: `1px solid ${GLASS_B}`,
                                overflow: "hidden", marginBottom: 24
                            }}>
                                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${GLASS_B}` }}>
                                    <p style={{ color: "white", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                                        <CreditCard size={16} color={G} /> Payment Method
                                    </p>
                                </div>
                                {paymentMethods.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setPayment(m.id)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 14, width: "100%",
                                            padding: "14px 18px", borderBottom: `1px solid ${GLASS_B}`,
                                            background: payment === m.id ? "rgba(212,175,55,0.05)" : "transparent",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <div style={{
                                            width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                                            background: payment === m.id ? G : "transparent",
                                            border: payment === m.id ? "none" : "2px solid rgba(255,255,255,0.2)",
                                            boxShadow: payment === m.id ? "0 0 0 3px rgba(212,175,55,0.2)" : "none"
                                        }} />
                                        <span style={{ fontSize: 22 }}>{m.icon}</span>
                                        <span style={{ flex: 1, color: "white", fontSize: 14, textAlign: "left" }}>{m.label}</span>
                                        {m.balance && <span style={{ color: G, fontSize: 13, fontWeight: 700 }}>{m.balance}</span>}
                                    </button>
                                ))}
                            </div>

                            {/* ── GUARDIAN SAFETY SECTION ── */}
                            <div style={{
                                background: isFemale ? "rgba(255,120,180,0.06)" : "rgba(212,175,55,0.04)",
                                border: `1.5px solid ${isFemale ? "rgba(255,120,180,0.3)" : "rgba(212,175,55,0.18)"}`,
                                borderRadius: 18, padding: 20, marginBottom: 16
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                    <Shield size={16} color={isFemale ? "#FF78B4" : G} />
                                    <p style={{ color: "white", fontWeight: 700, fontSize: 14 }}>Safety & Guardian Info</p>
                                    {isFemale && (
                                        <span style={{
                                            marginLeft: "auto", fontSize: 10, fontWeight: 700,
                                            color: "#FF78B4", background: "rgba(255,120,180,0.12)",
                                            border: "1px solid rgba(255,120,180,0.3)",
                                            padding: "2px 10px", borderRadius: 999
                                        }}>Optional</span>
                                    )}
                                </div>

                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Your Gender</p>
                                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                                    {(["female", "male", "other"] as Gender[]).map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setGender(g)}
                                            style={{
                                                flex: 1, padding: "10px 6px", borderRadius: 12, cursor: "pointer",
                                                background: gender === g
                                                    ? (g === "female" ? "rgba(255,120,180,0.2)" : "rgba(212,175,55,0.15)")
                                                    : "rgba(255,255,255,0.05)",
                                                border: `1.5px solid ${gender === g ? (g === "female" ? "#FF78B4" : G) : "rgba(255,255,255,0.1)"}`,
                                                color: gender === g ? (g === "female" ? "#FF78B4" : G) : "rgba(255,255,255,0.5)",
                                                fontSize: 13, fontWeight: 700, transition: "all 0.2s"
                                            }}
                                        >
                                            {g === "female" ? "👩 Female" : g === "male" ? "👨 Male" : "🧑 Other"}
                                        </button>
                                    ))}
                                </div>

                                {gender !== "" && (
                                    <>
                                        {isFemale && (
                                            <div style={{
                                                display: "flex", alignItems: "center", gap: 8,
                                                background: "rgba(255,120,180,0.07)", border: "1px solid rgba(255,120,180,0.2)",
                                                borderRadius: 10, padding: "8px 12px", marginBottom: 12
                                            }}>
                                                <AlertCircle size={13} color="#FF78B4" />
                                                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                                                    For your safety, we <strong style={{ color: "#FF78B4" }}>recommend</strong> adding guardian info.
                                                </p>
                                            </div>
                                        )}
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                                            {isFemale ? "Guardian / Emergency Contact (Optional)" : "Emergency Contact (Optional)"}
                                        </p>
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 10,
                                            background: "rgba(0,0,0,0.2)", borderRadius: 12,
                                            border: `1.5px solid ${guardianName.trim() ? (isFemale ? "rgba(255,120,180,0.5)" : "rgba(212,175,55,0.4)") : "rgba(255,255,255,0.1)"}`,
                                            padding: "12px 14px", marginBottom: 10
                                        }}>
                                            <User size={14} color={isFemale ? "#FF78B4" : G} style={{ flexShrink: 0 }} />
                                            <input
                                                value={guardianName}
                                                onChange={e => setGuardianName(e.target.value)}
                                                placeholder="Guardian's full name"
                                                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "white", fontSize: 14 }}
                                            />
                                        </div>
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 10,
                                            background: "rgba(0,0,0,0.2)", borderRadius: 12,
                                            border: `1.5px solid ${guardianPhone.replace(/\D/g, "").length === 10 ? (isFemale ? "rgba(255,120,180,0.5)" : "rgba(212,175,55,0.4)") : "rgba(255,255,255,0.1)"}`,
                                            padding: "12px 14px", marginBottom: 12
                                        }}>
                                            <Phone size={14} color={isFemale ? "#FF78B4" : G} style={{ flexShrink: 0 }} />
                                            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginRight: 4 }}>+91</span>
                                            <input
                                                value={guardianPhone}
                                                onChange={e => setGuardianPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                                placeholder="10-digit guardian phone"
                                                type="tel" maxLength={10}
                                                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "white", fontSize: 14 }}
                                            />
                                        </div>
                                        <button onClick={() => setShareTrip(p => !p)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                            <div style={{
                                                width: 40, height: 22, borderRadius: 11, flexShrink: 0,
                                                background: shareTrip ? (isFemale ? "#FF78B4" : G) : "rgba(255,255,255,0.1)",
                                                display: "flex", alignItems: "center", padding: "0 3px",
                                                justifyContent: shareTrip ? "flex-end" : "flex-start", transition: "all 0.25s"
                                            }}>
                                                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "white" }} />
                                            </div>
                                            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Share live trip with guardian via SMS</span>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Safety badge */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 10,
                                background: "rgba(96,208,96,0.05)", border: "1px solid rgba(96,208,96,0.15)",
                                borderRadius: 14, padding: "12px 16px", marginBottom: 16
                            }}>
                                <Shield size={16} color="#60D080" />
                                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                                    This ride is <strong style={{ color: "#60D080" }}>insured & verified</strong>. Driver KYC completed. SOS available during trip.
                                </p>
                            </div>

                            {guardianRequired && !guardianFilled && (
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    background: "rgba(255,120,180,0.07)", border: "1px solid rgba(255,120,180,0.25)",
                                    borderRadius: 12, padding: "10px 14px", marginBottom: 12
                                }}>
                                    <AlertCircle size={14} color="#FF78B4" />
                                    <p style={{ color: "#FF78B4", fontSize: 12, fontWeight: 600 }}>
                                        Please fill guardian name & 10-digit phone to continue.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => { if (canBook) { setConfirmed(true); setTimeout(() => setStep("booked"), 1200); } }}
                                style={{
                                    width: "100%", padding: "18px", borderRadius: 18, border: "none",
                                    cursor: canBook ? "pointer" : "not-allowed",
                                    background: confirmed
                                        ? "rgba(96,208,96,0.15)"
                                        : canBook
                                            ? `linear-gradient(135deg, ${G}, #F0C040)`
                                            : "rgba(255,255,255,0.07)",
                                    color: confirmed ? "#60D080" : canBook ? DARK : "rgba(255,255,255,0.3)",
                                    fontSize: 17, fontWeight: 800, transition: "all 0.3s",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                                }}
                            >
                                {confirmed ? <><CheckCircle size={20} /> Booking confirmed...</> : <>✅ Confirm & Book Ride</>}
                            </button>
                        </div>

                        {/* Right: Summary panel */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{
                                background: "rgba(15,28,46,0.8)", borderRadius: 24, border: `1px solid ${GLASS_B}`,
                                overflow: "hidden", height: 340
                            }}>
                                <MapBackground height="100%" showRoute showDriverPin showDestPin />
                            </div>

                            {/* Fare breakdown */}
                            <div style={{
                                background: "rgba(15,28,46,0.8)", borderRadius: 20, border: `1px solid ${GLASS_B}`, padding: 20
                            }}>
                                <p style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>💰 Fare Breakdown</p>
                                {[
                                    ["Base Fare", "₹49"],
                                    ["Distance (8.8 km × ₹8.5)", "₹74.8"],
                                    ["Time Charge (22 min)", "₹22"],
                                    ["Surge Multiplier (1.2x)", "+₹14"],
                                    ["Platform Fee", "₹5"],
                                ].map(([l, v]) => (
                                    <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                        <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{l}</span>
                                        <span style={{ color: "white", fontSize: 13 }}>{v}</span>
                                    </div>
                                ))}
                                <div style={{ height: 1, background: GLASS_B, margin: "12px 0" }} />
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Total Fare</span>
                                    <span style={{ color: G, fontWeight: 800, fontSize: 18 }}>{ride.price}</span>
                                </div>
                                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 6 }}>*Final fare may vary slightly based on actual distance/time</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @media (max-width: 768px) {
          .book-grid { grid-template-columns: 1fr !important; }
        }
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
        </div >
    );
}

/* ──────────────────────────────────────────────────────────
   Booked Screen — with Live Tracking, PIN Verify & Chat
────────────────────────────────────────────────────────── */
const TRACKING_STEPS = [
    { id: "assigned", icon: "✅", label: "Driver Assigned", sub: "Ramesh K. is heading your way", color: "#60D080" },
    { id: "enroute", icon: "🏍️", label: "Driver En Route", sub: "2 min away · KA 05 MC 4892", color: G },
    { id: "arrived", icon: "📍", label: "Driver Arrived", sub: "Verify PIN before boarding", color: "#60A5FA" },
    { id: "started", icon: "🚀", label: "Trip in Progress", sub: "You're on your way!", color: "#A78BFA" },
];

const CHAT_MESSAGES_INIT = [
    { from: "driver", text: "Hello! I am Ramesh, your driver. I have arrived near the pickup point.", time: "Now" },
];

function BookedScreen({
    navigate, ride, guardianName, shareTrip, onBookAnother
}: {
    navigate: ReturnType<typeof useNavigate>;
    ride: typeof rides[0];
    guardianName: string;
    shareTrip: boolean;
    onBookAnother: () => void;
}) {
    // Tracking
    const [trackStep, setTrackStep] = useState(0);       // 0=assigned,1=enroute,2=arrived,3=started
    const [pinVerified, setPinVerified] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [pinError, setPinError] = useState(false);
    const SECURITY_PIN = "4782";   // simulated PIN

    // Chat
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMsg, setChatMsg] = useState("");
    const [messages, setMessages] = useState(CHAT_MESSAGES_INIT);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Location share
    const [locationShared, setLocationShared] = useState(false);

    // Auto-advance tracking steps (simulated)
    useEffect(() => {
        if (trackStep >= TRACKING_STEPS.length - 1) return;
        const delays = [3000, 5000, 8000]; // ms between steps
        const t = setTimeout(() => setTrackStep(s => s + 1), delays[trackStep] ?? 4000);
        return () => clearTimeout(t);
    }, [trackStep]);

    // Auto-scroll chat
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, chatOpen]);

    const sendMessage = useCallback(() => {
        if (!chatMsg.trim()) return;
        const userMsg = { from: "user", text: chatMsg.trim(), time: "Now" };
        setMessages(m => [...m, userMsg]);
        setChatMsg("");
        // Simulated driver reply
        setTimeout(() => {
            setMessages(m => [...m, { from: "driver", text: "Got it! I'll be right there. 👍", time: "Now" }]);
        }, 1500);
    }, [chatMsg]);

    const handlePinVerify = () => {
        if (pinInput === SECURITY_PIN) {
            setPinError(false);
            setTrackStep(3); // trip started
        } else {
            setPinError(true);
            setTimeout(() => setPinError(false), 2000);
        }
    };

    const currentStep = TRACKING_STEPS[trackStep];
    const isArrived = trackStep === 2 && !pinVerified && trackStep < 3;
    const isTripStarted = trackStep === 3;

    return (
        <div style={{
            minHeight: "100vh",
            background: `linear-gradient(180deg, ${DARK} 0%, ${NAVY} 100%)`,
            fontFamily: "'Inter',sans-serif", color: "white"
        }}>

            {/* ── TOP NAV ── */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 50,
                display: "flex", alignItems: "center", gap: 16, padding: "14px 5vw",
                background: "rgba(5,13,26,0.92)", backdropFilter: "blur(20px)",
                borderBottom: `1px solid ${GLASS_B}`
            }}>
                <button onClick={() => navigate("/")} style={{
                    width: 40, height: 40, borderRadius: 12, background: GLASS,
                    border: `1px solid ${GLASS_B}`, display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer"
                }}><ArrowLeft size={20} color={G} /></button>
                <div>
                    <p style={{ fontSize: 16, fontWeight: 900 }}>
                        <span style={{ color: G }}>Booking</span> <span style={{ color: "white" }}>Confirmed</span>
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 1 }}>Track your ride below</p>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                    {/* Call driver */}
                    <a href="tel:+919876543210"
                        style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: "rgba(96,208,96,0.12)", border: "1px solid rgba(96,208,96,0.35)",
                            display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none"
                        }}>
                        <PhoneCall size={18} color="#60D080" />
                    </a>
                    {/* Chat */}
                    <button onClick={() => setChatOpen(true)}
                        style={{
                            width: 40, height: 40, borderRadius: 12, position: "relative",
                            background: "rgba(212,175,55,0.12)", border: `1px solid rgba(212,175,55,0.35)`,
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                        }}>
                        <MessageCircle size={18} color={G} />
                        {messages.length > 0 && (
                            <span style={{
                                position: "absolute", top: -4, right: -4, width: 16, height: 16,
                                borderRadius: "50%", background: "#E84040", fontSize: 9, fontWeight: 800,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>{messages.length}</span>
                        )}
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 5vw" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }} className="book-grid">

                    {/* ── LEFT: Tracking + PIN + Actions ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Booking confirmed banner */}
                        <div style={{
                            borderRadius: 20, overflow: "hidden",
                            background: "linear-gradient(135deg, rgba(96,208,96,0.12), rgba(96,208,96,0.04))",
                            border: "1.5px solid rgba(96,208,96,0.35)", padding: "20px 22px",
                            display: "flex", alignItems: "center", gap: 16
                        }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 16,
                                background: "rgba(96,208,96,0.15)", border: "1.5px solid rgba(96,208,96,0.3)",
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                            }}>
                                <CheckCircle size={28} color="#60D080" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: "white", fontSize: 18, fontWeight: 900, marginBottom: 2 }}>Ride Booked! 🎉</p>
                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Your {ride.name} is confirmed</p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <p style={{ color: G, fontSize: 24, fontWeight: 900 }}>{ride.price}</p>
                                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>FARE</p>
                            </div>
                        </div>

                        {/* ── LIVE TRACKING CARD ── */}
                        <div style={{
                            background: "rgba(15,28,46,0.8)", borderRadius: 20,
                            border: `1px solid ${GLASS_B}`, padding: 22
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                                <div style={{
                                    width: 10, height: 10, borderRadius: "50%",
                                    background: currentStep.color,
                                    boxShadow: `0 0 0 4px ${currentStep.color}30`,
                                    animation: trackStep < 3 ? "pulse 1.5s infinite" : "none"
                                }} />
                                <p style={{ color: "white", fontWeight: 800, fontSize: 15 }}>Live Tracking</p>
                                <span style={{
                                    marginLeft: "auto", fontSize: 11, fontWeight: 700,
                                    color: currentStep.color,
                                    background: `${currentStep.color}18`,
                                    border: `1px solid ${currentStep.color}40`,
                                    padding: "3px 10px", borderRadius: 999
                                }}>LIVE</span>
                            </div>

                            {/* Step timeline */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                {TRACKING_STEPS.map((s, i) => {
                                    const done = i < trackStep;
                                    const active = i === trackStep;
                                    const future = i > trackStep;
                                    return (
                                        <div key={s.id} style={{ display: "flex", gap: 14 }}>
                                            {/* Line + dot */}
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: 16,
                                                    background: done ? `${s.color}22` : active ? `${s.color}18` : "rgba(255,255,255,0.04)",
                                                    border: `2px solid ${done ? s.color : active ? s.color : "rgba(255,255,255,0.1)"}`,
                                                    transition: "all 0.5s",
                                                    boxShadow: active ? `0 0 16px ${s.color}40` : "none"
                                                }}>
                                                    {done ? <CheckCircle size={16} color={s.color} /> : <span>{s.icon}</span>}
                                                </div>
                                                {i < TRACKING_STEPS.length - 1 && (
                                                    <div style={{
                                                        width: 2, flex: 1, minHeight: 28, marginTop: 3,
                                                        background: done ? `linear-gradient(180deg, ${s.color}, ${TRACKING_STEPS[i + 1].color})` : "rgba(255,255,255,0.08)",
                                                        transition: "all 0.5s", borderRadius: 2
                                                    }} />
                                                )}
                                            </div>
                                            {/* Text */}
                                            <div style={{ paddingBottom: 20, flex: 1 }}>
                                                <p style={{
                                                    color: future ? "rgba(255,255,255,0.25)" : "white",
                                                    fontWeight: active ? 800 : 600, fontSize: 14,
                                                    transition: "all 0.5s"
                                                }}>{s.label}</p>
                                                <p style={{
                                                    color: future ? "rgba(255,255,255,0.15)" : active ? s.color : "rgba(255,255,255,0.35)",
                                                    fontSize: 12, marginTop: 2, transition: "all 0.5s"
                                                }}>{s.sub}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── PIN VERIFICATION CARD ── (shown when driver arrives, before trip starts) */}
                        {trackStep === 2 && (
                            <div style={{
                                background: "rgba(96,165,250,0.06)", borderRadius: 20,
                                border: "1.5px solid rgba(96,165,250,0.35)",
                                padding: 22, animation: "fadeSlideIn 0.4s ease"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 12,
                                        background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)",
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}><KeyRound size={20} color="#60A5FA" /></div>
                                    <div>
                                        <p style={{ color: "white", fontWeight: 800, fontSize: 14 }}>Driver Arrived — Verify PIN</p>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Share this PIN with your driver to start the trip</p>
                                    </div>
                                </div>

                                {/* PIN Display for Customer */}
                                <div style={{
                                    display: "flex", justifyContent: "center", gap: 12, marginBottom: 18
                                }}>
                                    {SECURITY_PIN.split("").map((digit, i) => (
                                        <div key={i} style={{
                                            width: 56, height: 64, borderRadius: 14,
                                            background: "rgba(96,165,250,0.12)",
                                            border: "2px solid rgba(96,165,250,0.5)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 28, fontWeight: 900, color: "#60A5FA",
                                            boxShadow: "0 4px 20px rgba(96,165,250,0.2)"
                                        }}>{digit}</div>
                                    ))}
                                </div>

                                <div style={{
                                    background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)",
                                    borderRadius: 12, padding: "10px 14px", marginBottom: 14,
                                    display: "flex", alignItems: "center", gap: 8
                                }}>
                                    <Shield size={14} color="#60A5FA" />
                                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                                        Show this PIN to your driver. Do <strong style={{ color: "#60A5FA" }}>NOT</strong> share it over phone or chat.
                                    </p>
                                </div>

                                {/* Driver enters PIN (simulated) */}
                                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Driver Confirms PIN</p>
                                <div style={{ display: "flex", gap: 10 }}>
                                    <div style={{
                                        flex: 1, display: "flex", alignItems: "center", gap: 10,
                                        background: pinError ? "rgba(232,64,64,0.08)" : "rgba(0,0,0,0.25)",
                                        border: `1.5px solid ${pinError ? "rgba(232,64,64,0.5)" : "rgba(96,165,250,0.3)"}`,
                                        borderRadius: 12, padding: "12px 14px", transition: "all 0.3s"
                                    }}>
                                        <KeyRound size={14} color={pinError ? "#E84040" : "#60A5FA"} style={{ flexShrink: 0 }} />
                                        <input
                                            value={pinInput}
                                            onChange={e => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                            placeholder="Enter 4-digit PIN"
                                            type="tel" maxLength={4}
                                            style={{
                                                flex: 1, background: "none", border: "none", outline: "none",
                                                color: pinError ? "#E84040" : "white", fontSize: 18, fontWeight: 700,
                                                letterSpacing: 6, textAlign: "center"
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={handlePinVerify}
                                        style={{
                                            padding: "12px 20px", borderRadius: 12, border: "none", cursor: "pointer",
                                            background: `linear-gradient(135deg, #60A5FA, #3B82F6)`,
                                            color: "white", fontSize: 14, fontWeight: 700
                                        }}>Verify</button>
                                </div>
                                {pinError && (
                                    <p style={{ color: "#E84040", fontSize: 12, marginTop: 8, textAlign: "center" }}>❌ Incorrect PIN. Please ask your driver to check again.</p>
                                )}
                            </div>
                        )}

                        {/* Trip started badge */}
                        {isTripStarted && (
                            <div style={{
                                background: "rgba(167,139,250,0.08)", border: "1.5px solid rgba(167,139,250,0.4)",
                                borderRadius: 18, padding: "16px 20px",
                                display: "flex", alignItems: "center", gap: 14, animation: "fadeSlideIn 0.4s ease"
                            }}>
                                <span style={{ fontSize: 32 }}>🚀</span>
                                <div>
                                    <p style={{ color: "#A78BFA", fontWeight: 800, fontSize: 15 }}>Trip in Progress!</p>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>You're heading to {ride.desc} destination. Stay safe!</p>
                                </div>
                            </div>
                        )}

                        {/* ── DRIVER CARD ── */}
                        <div style={{
                            background: "rgba(15,28,46,0.8)", borderRadius: 20,
                            border: `1px solid ${GLASS_B}`, padding: 20
                        }}>
                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Your Driver</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: "50%",
                                    background: `linear-gradient(135deg, ${G}, #F0C040)`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 24, flexShrink: 0
                                }}>👨</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 800, fontSize: 16 }}>Ramesh K.</p>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>KA 05 MC 4892</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} color={G} fill={G} />)}
                                        <span style={{ color: G, fontSize: 12, fontWeight: 700, marginLeft: 4 }}>4.9</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 10 }}>
                                    <a href="tel:+919876543210" style={{
                                        width: 44, height: 44, borderRadius: 12,
                                        background: "rgba(96,208,96,0.12)", border: "1.5px solid rgba(96,208,96,0.35)",
                                        display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none"
                                    }}><PhoneCall size={18} color="#60D080" /></a>
                                    <button onClick={() => setChatOpen(true)} style={{
                                        width: 44, height: 44, borderRadius: 12,
                                        background: "rgba(212,175,55,0.12)", border: `1.5px solid rgba(212,175,55,0.35)`,
                                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                                    }}><MessageCircle size={18} color={G} /></button>
                                </div>
                            </div>
                        </div>

                        {/* ── SHARE LOCATION BUTTON ── */}
                        <button
                            onClick={() => setLocationShared(true)}
                            style={{
                                width: "100%", padding: "14px", borderRadius: 14,
                                border: locationShared ? "1px solid rgba(96,208,96,0.4)" : `1px solid ${G}`,
                                background: locationShared ? "rgba(96,208,96,0.12)" : "rgba(212,175,55,0.1)",
                                color: locationShared ? "#60D080" : G,
                                cursor: "pointer", fontSize: 15, fontWeight: 700,
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                transition: "all 0.3s"
                            }}>
                            {locationShared ? <>✅ Live Location Shared!</> : <>📍 Share Live Location Link</>}
                        </button>

                        {/* Guardian notification */}
                        {guardianName.trim() && (
                            <div style={{
                                display: "flex", alignItems: "center", gap: 10,
                                background: shareTrip ? "rgba(255,120,180,0.07)" : "rgba(96,208,96,0.06)",
                                border: `1px solid ${shareTrip ? "rgba(255,120,180,0.3)" : "rgba(96,208,96,0.2)"}`,
                                borderRadius: 14, padding: "12px 16px"
                            }}>
                                <Shield size={14} color={shareTrip ? "#FF78B4" : "#60D080"} style={{ flexShrink: 0 }} />
                                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                                    {shareTrip
                                        ? <>Live trip shared with <strong style={{ color: "#FF78B4" }}>{guardianName}</strong> via SMS 📲</>
                                        : <>Guardian <strong style={{ color: "#60D080" }}>{guardianName}</strong> notified ✅</>}
                                </p>
                            </div>
                        )}

                        {/* Home / Book Another */}
                        <div style={{ display: "flex", gap: 12 }}>
                            <button onClick={() => navigate("/")} style={{
                                flex: 1, padding: "14px", borderRadius: 14, border: `1px solid ${GLASS_B}`,
                                background: GLASS, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14
                            }}>← Home</button>
                            <button onClick={onBookAnother} style={{
                                flex: 1, padding: "14px", borderRadius: 14, border: "none",
                                background: `linear-gradient(135deg, ${G}, #F0C040)`,
                                color: DARK, cursor: "pointer", fontSize: 14, fontWeight: 700
                            }}>Book Another</button>
                        </div>
                    </div>

                    {/* ── RIGHT: Map + Ride Info ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ borderRadius: 24, overflow: "hidden", height: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                            <MapBackground height="100%" showRoute showDriverPin showDestPin />
                            <div style={{
                                position: "absolute", top: 14, left: 14, right: 14,
                                background: "rgba(5,13,26,0.9)", backdropFilter: "blur(16px)",
                                border: `1px solid rgba(212,175,55,0.25)`, borderRadius: 16, padding: "12px 16px"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{
                                        width: 8, height: 8, borderRadius: "50%",
                                        background: currentStep.color,
                                        boxShadow: `0 0 0 3px ${currentStep.color}30`
                                    }} />
                                    <p style={{ color: "white", fontWeight: 700, fontSize: 13 }}>{currentStep.label}</p>
                                    <span style={{
                                        marginLeft: "auto", color: G, fontSize: 16, fontWeight: 900,
                                        background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)",
                                        padding: "2px 10px", borderRadius: 8
                                    }}>{ride.eta}</span>
                                </div>
                            </div>
                        </div>

                        {/* Ride summary */}
                        <div style={{
                            background: "rgba(15,28,46,0.8)", borderRadius: 20,
                            border: `1px solid ${GLASS_B}`, padding: 20
                        }}>
                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Ride Summary</p>
                            <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: 16,
                                    background: "rgba(212,175,55,0.08)",
                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28
                                }}>{ride.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 800, fontSize: 16 }}>{ride.name}</p>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{ride.desc}</p>
                                    <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                                        <span style={{ color: G, fontSize: 11, fontWeight: 700 }}>ETA {ride.eta}</span>
                                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>·</span>
                                        <span style={{ color: G, fontSize: 11, fontWeight: 700 }}>{ride.price}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ height: 1, background: GLASS_B, margin: "12px 0" }} />
                            <div style={{ display: "flex", gap: 14 }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: G }} />
                                    <div style={{ width: 1, height: 28, background: GLASS_B, margin: "3px 0" }} />
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E84040" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ marginBottom: 14 }}>
                                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, textTransform: "uppercase" }}>Pickup</p>
                                        <p style={{ color: "white", fontSize: 13, fontWeight: 500, marginTop: 2 }}>Koramangala, Bengaluru</p>
                                    </div>
                                    <div>
                                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, textTransform: "uppercase" }}>Drop</p>
                                        <p style={{ color: "white", fontSize: 13, fontWeight: 500, marginTop: 2 }}>{ride.desc} destination</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
                CHAT DRAWER
            ════════════════════════════════════════ */}
            {chatOpen && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 200,
                    display: "flex", flexDirection: "column"
                }}>
                    {/* Backdrop */}
                    <div
                        onClick={() => setChatOpen(false)}
                        style={{ flex: 1, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                    />
                    {/* Drawer */}
                    <div style={{
                        background: "rgba(10,18,32,0.98)", borderTop: `1px solid ${GLASS_B}`,
                        borderTopLeftRadius: 28, borderTopRightRadius: 28,
                        padding: "0 0 env(safe-area-inset-bottom,16px)",
                        maxHeight: "75vh", display: "flex", flexDirection: "column",
                        animation: "slideUp 0.3s ease"
                    }}>
                        {/* Header */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 14, padding: "18px 20px 14px",
                            borderBottom: `1px solid ${GLASS_B}`
                        }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: "50%",
                                background: `linear-gradient(135deg, ${G}, #F0C040)`,
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0
                            }}>👨</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 800, fontSize: 15 }}>Ramesh K.</p>
                                <p style={{ color: "#60D080", fontSize: 12 }}>● Online · Driver</p>
                            </div>
                            <a href="tel:+919876543210" style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: "rgba(96,208,96,0.12)", border: "1px solid rgba(96,208,96,0.35)",
                                display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
                                marginRight: 8
                            }}><PhoneCall size={18} color="#60D080" /></a>
                            <button onClick={() => setChatOpen(false)} style={{
                                width: 40, height: 40, borderRadius: 12, background: GLASS,
                                border: `1px solid ${GLASS_B}`, display: "flex", alignItems: "center",
                                justifyContent: "center", cursor: "pointer"
                            }}><X size={18} color="rgba(255,255,255,0.5)" /></button>
                        </div>

                        {/* Address hint */}
                        <div style={{
                            margin: "10px 16px 0",
                            background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.2)",
                            borderRadius: 10, padding: "8px 12px",
                            display: "flex", alignItems: "center", gap: 8
                        }}>
                            <MapPin size={13} color={G} />
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                                Share exact address or landmark to help your driver locate you.
                            </p>
                        </div>

                        {/* Quick Address Suggestions */}
                        <div style={{ padding: "10px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {["Near main gate", "Opposite to hospital", "Ground floor", "Send exact pin 📍"].map(q => (
                                <button key={q}
                                    onClick={() => setChatMsg(q)}
                                    style={{
                                        padding: "6px 12px", borderRadius: 20, cursor: "pointer",
                                        background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)",
                                        color: G, fontSize: 12, fontWeight: 600
                                    }}>{q}</button>
                            ))}
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1, overflowY: "auto", padding: "8px 16px 12px",
                            display: "flex", flexDirection: "column", gap: 10
                        }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    display: "flex",
                                    justifyContent: msg.from === "user" ? "flex-end" : "flex-start"
                                }}>
                                    <div style={{
                                        maxWidth: "78%", padding: "10px 14px", borderRadius: 16,
                                        background: msg.from === "user"
                                            ? `linear-gradient(135deg, ${G}, #F0C040)`
                                            : "rgba(30,50,80,0.9)",
                                        color: msg.from === "user" ? DARK : "white",
                                        fontSize: 14, fontWeight: msg.from === "user" ? 600 : 400,
                                        borderBottomRightRadius: msg.from === "user" ? 4 : 16,
                                        borderBottomLeftRadius: msg.from === "driver" ? 4 : 16,
                                    }}>
                                        {msg.text}
                                        <p style={{
                                            fontSize: 10, marginTop: 4,
                                            color: msg.from === "user" ? "rgba(5,13,26,0.5)" : "rgba(255,255,255,0.3)",
                                            textAlign: "right"
                                        }}>{msg.time} ✓✓</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "12px 16px", borderTop: `1px solid ${GLASS_B}`
                        }}>
                            <div style={{
                                flex: 1, display: "flex", alignItems: "center", gap: 10,
                                background: "rgba(255,255,255,0.05)", border: `1px solid ${GLASS_B}`,
                                borderRadius: 14, padding: "10px 14px"
                            }}>
                                <input
                                    value={chatMsg}
                                    onChange={e => setChatMsg(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                                    placeholder="Type a message or share address…"
                                    style={{
                                        flex: 1, background: "none", border: "none", outline: "none",
                                        color: "white", fontSize: 14
                                    }}
                                />
                            </div>
                            <button
                                onClick={sendMessage}
                                style={{
                                    width: 48, height: 48, borderRadius: 14, border: "none",
                                    cursor: "pointer",
                                    background: chatMsg.trim()
                                        ? `linear-gradient(135deg, ${G}, #F0C040)`
                                        : "rgba(255,255,255,0.08)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.2s"
                                }}>
                                <Send size={18} color={chatMsg.trim() ? DARK : "rgba(255,255,255,0.3)"} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) { .book-grid { grid-template-columns: 1fr !important; } }
                * { box-sizing: border-box; }
                input::placeholder { color: rgba(255,255,255,0.25); }
                @keyframes pulse {
                    0%,100% { box-shadow: 0 0 0 4px rgba(212,175,55,0.2); }
                    50%      { box-shadow: 0 0 0 8px rgba(212,175,55,0.05); }
                }
                @keyframes fadeSlideIn {
                    from { opacity:0; transform: translateY(12px); }
                    to   { opacity:1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to   { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
