import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    MapPin, Navigation, Search, X, ChevronRight, Zap,
    Star, Phone, MessageCircle, Shield, Clock, ArrowLeft,
    Wifi, WifiOff, LocateFixed, ChevronDown, ChevronUp,
    CheckCircle, Loader, Route, Users, AlertTriangle
} from "lucide-react";
import { MapBackground } from "../components/MapBackground";

/* ─────── Theme ─────── */
const G = "#D4AF37";
const DARK = "#050D1A";
const NAVY = "#0F1C2E";
const GLASS = "rgba(255,255,255,0.04)";
const GLASS_B = "rgba(255,255,255,0.09)";
const GLASS_M = "rgba(255,255,255,0.06)";

/* ─────── Ride types ─────── */
const RIDE_TYPES = [
    {
        id: "bike", emoji: "🏍️", label: "Bike", desc: "Fastest & cheapest",
        eta: "1–2 min", price: "₹49–79", surge: false, priceNum: 49,
        color: "#A78BFA", passengers: 1, features: ["Helmet provided", "Quick drops"]
    },
    {
        id: "auto", emoji: "🛺", label: "Auto", desc: "Comfortable & quick",
        eta: "2–4 min", price: "₹89–120", surge: true, priceNum: 89,
        color: "#4ECDC4", passengers: 3, features: ["AC optional", "No surge zones"]
    },
    {
        id: "mini", emoji: "🚗", label: "Mini", desc: "Compact car ride",
        eta: "4–6 min", price: "₹129–160", surge: false, priceNum: 129,
        color: "#D4AF37", passengers: 4, features: ["AC", "Comfortable", "Popular"],
        badge: "Popular"
    },
    {
        id: "prime", emoji: "🚙", label: "Prime", desc: "Premium sedan",
        eta: "5–8 min", price: "₹199–250", surge: false, priceNum: 199,
        color: "#60A5FA", passengers: 4, features: ["AC", "Premium", "Top rated"],
        badge: "Premium"
    },
];

/* ─────── Mock locations for autocomplete ─────── */
const QUICK_LOCATIONS = [
    { icon: "🏢", name: "Brigade Road", area: "Commercial Street, Bengaluru", lat: 12.9706, lng: 77.6099 },
    { icon: "🛒", name: "Phoenix Marketcity", area: "Whitefield, Bengaluru", lat: 12.9975, lng: 77.6968 },
    { icon: "✈️", name: "Kempegowda Airport", area: "BIAL, North Bengaluru", lat: 13.1986, lng: 77.7066 },
    { icon: "🏥", name: "Manipal Hospital", area: "HAL Airport Road, Bengaluru", lat: 12.9526, lng: 77.6461 },
    { icon: "🎓", name: "IIM Bangalore", area: "Bannerghatta Road, Bengaluru", lat: 12.9133, lng: 77.5947 },
    { icon: "🏨", name: "Taj West End", area: "Race Course Road, Bengaluru", lat: 12.9779, lng: 77.5773 },
    { icon: "🏠", name: "Koramangala 5th Block", area: "Near Forum Mall, Bengaluru", lat: 12.9352, lng: 77.6245 },
    { icon: "💼", name: "MG Road Metro", area: "MG Road, Bengaluru", lat: 12.9756, lng: 77.6094 },
];

type BookingStep = "idle" | "searching" | "seeking" | "matched" | "riding" | "arrived";

interface Driver {
    name: string; rating: number; rides: number; vehicle: string;
    plate: string; color: string; type: string; eta: string; phone: string;
}

const MOCK_DRIVER: Driver = {
    name: "Ravi Kumar", rating: 4.9, rides: 3847, vehicle: "Maruti Swift",
    plate: "KA 05 AB 1234", color: "Pearl White", type: "SaaraMini",
    eta: "3 min", phone: "+91 98765 43210"
};

/* ─────── Suggestion dropdown ─────── */
function LocationSuggestions({
    query, onSelect, color
}: { query: string; onSelect: (loc: typeof QUICK_LOCATIONS[0]) => void; color: string }) {
    const filtered = query.length > 0
        ? QUICK_LOCATIONS.filter(l =>
            l.name.toLowerCase().includes(query.toLowerCase()) ||
            l.area.toLowerCase().includes(query.toLowerCase())
        )
        : QUICK_LOCATIONS;

    if (filtered.length === 0) return null;

    return (
        <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: "rgba(8,18,34,0.98)", backdropFilter: "blur(20px)",
            border: `1px solid ${color}33`, borderTop: "none",
            borderRadius: "0 0 14px 14px",
            zIndex: 60, maxHeight: 280, overflowY: "auto",
            boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
        }}>
            {filtered.map((loc, i) => (
                <button
                    key={i}
                    onClick={() => onSelect(loc)}
                    style={{
                        display: "flex", alignItems: "center", gap: 12,
                        width: "100%", padding: "12px 16px",
                        background: "transparent", border: "none",
                        borderBottom: i < filtered.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none",
                        cursor: "pointer", textAlign: "left", transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${color}0a`)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                    <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: `${color}14`, border: `1px solid ${color}22`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                    }}>{loc.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: "white", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{loc.name}</div>
                        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{loc.area}</div>
                    </div>
                    <ChevronRight size={14} color={`${color}55`} />
                </button>
            ))}
        </div>
    );
}

/* ─────── Driver matched card ─────── */
function DriverCard({
    driver, step, onCancel, onArrived
}: { driver: Driver; step: BookingStep; onCancel: () => void; onArrived: () => void }) {
    const [expanded, setExpanded] = useState(true);
    const col = "#D4AF37";

    return (
        <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2000,
            background: "rgba(5,13,26,0.97)", backdropFilter: "blur(24px)",
            borderTop: `1px solid ${col}33`,
            boxShadow: "0 -16px 64px rgba(0,0,0,0.7)",
            borderRadius: "24px 24px 0 0",
            transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}>
            {/* Drag handle */}
            <div style={{ paddingTop: 12, display: "flex", justifyContent: "center" }}>
                <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.15)" }} />
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setExpanded(!expanded)}
                style={{
                    position: "absolute", top: 12, right: 16,
                    background: GLASS_M, border: `1px solid ${GLASS_B}`,
                    borderRadius: 8, padding: "4px 8px", cursor: "pointer", color: "rgba(255,255,255,0.5)",
                }}
            >
                {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>

            <div style={{ padding: "12px 20px 20px" }}>
                {/* Status bar */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
                    padding: "10px 14px", borderRadius: 12,
                    background: step === "riding"
                        ? "rgba(96,208,96,0.08)" : step === "arrived"
                            ? "rgba(212,175,55,0.12)" : "rgba(96,165,250,0.08)",
                    border: `1px solid ${step === "riding" ? "rgba(96,208,96,0.25)" : step === "arrived" ? "rgba(212,175,55,0.3)" : "rgba(96,165,250,0.2)"}`,
                }}>
                    {step === "matched" && (
                        <>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#60A5FA", boxShadow: "0 0 8px #60A5FA", flexShrink: 0 }} />
                            <span style={{ color: "#60A5FA", fontWeight: 700, fontSize: 13 }}>Driver is on the way · ETA {driver.eta}</span>
                        </>
                    )}
                    {step === "riding" && (
                        <>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#60D080", boxShadow: "0 0 8px #60D080", flexShrink: 0 }} />
                            <span style={{ color: "#60D080", fontWeight: 700, fontSize: 13 }}>🚗 Trip in progress · Enjoy your ride!</span>
                        </>
                    )}
                    {step === "arrived" && (
                        <>
                            <CheckCircle size={14} color={col} />
                            <span style={{ color: col, fontWeight: 700, fontSize: 13 }}>✅ You have arrived! Rate your driver.</span>
                        </>
                    )}
                </div>

                {expanded && (
                    <>
                        {/* Driver info */}
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                            <div style={{
                                width: 60, height: 60, borderRadius: "50%", flexShrink: 0,
                                background: `linear-gradient(135deg, ${col}22, ${col}08)`,
                                border: `2px solid ${col}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 28, position: "relative"
                            }}>
                                🧑
                                {step === "riding" && (
                                    <div style={{
                                        position: "absolute", bottom: -4, right: -4,
                                        width: 20, height: 20, borderRadius: "50%", background: "#60D080",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        border: "2px solid #050D1A", fontSize: 10,
                                    }}>✓</div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                                    <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>{driver.name}</span>
                                    <span style={{
                                        padding: "2px 8px", borderRadius: 999, fontSize: 10,
                                        background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)",
                                        color: col, fontWeight: 700,
                                    }}>{driver.type}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                    <Star size={12} color={col} fill={col} />
                                    <span style={{ color: col, fontSize: 13, fontWeight: 700 }}>{driver.rating}</span>
                                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>• {driver.rides.toLocaleString()} rides</span>
                                </div>
                                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                                    {driver.vehicle} · {driver.color} · <strong style={{ color: "rgba(255,255,255,0.65)" }}>{driver.plate}</strong>
                                </div>
                            </div>
                            {step !== "arrived" && (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button style={{
                                        width: 44, height: 44, borderRadius: "50%",
                                        background: "rgba(96,208,96,0.1)", border: "1px solid rgba(96,208,96,0.3)",
                                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                                    }}>
                                        <Phone size={18} color="#60D080" />
                                    </button>
                                    <button style={{
                                        width: 44, height: 44, borderRadius: "50%",
                                        background: GLASS_M, border: `1px solid ${GLASS_B}`,
                                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                                    }}>
                                        <MessageCircle size={18} color="rgba(255,255,255,0.5)" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Safety + share */}
                        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                            <div style={{
                                flex: 1, display: "flex", alignItems: "center", gap: 8,
                                background: "rgba(96,208,96,0.06)", border: "1px solid rgba(96,208,96,0.15)",
                                borderRadius: 10, padding: "8px 12px"
                            }}>
                                <Shield size={13} color="#60D080" />
                                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
                                    <strong style={{ color: "#60D080" }}>Verified & Insured</strong> · KYC Done
                                </span>
                            </div>
                            <button style={{
                                padding: "8px 14px", borderRadius: 10,
                                background: GLASS_M, border: `1px solid ${GLASS_B}`,
                                color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, cursor: "pointer"
                            }}>
                                📤 Share Trip
                            </button>
                        </div>

                        {/* Actions */}
                        {step === "arrived" ? (
                            <div>
                                <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 14 }}>
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} style={{
                                            fontSize: 28, background: "none", border: "none", cursor: "pointer",
                                            transition: "transform 0.15s",
                                        }}
                                            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.3)")}
                                            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                                        >⭐</button>
                                    ))}
                                </div>
                                <button
                                    onClick={onCancel}
                                    style={{
                                        width: "100%", padding: "14px", borderRadius: 14, border: "none",
                                        background: `linear-gradient(135deg, ${col}, #F0C040)`,
                                        color: DARK, fontWeight: 800, fontSize: 15, cursor: "pointer",
                                    }}
                                >
                                    ✓ Submit & Book Another Ride
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onCancel}
                                style={{
                                    width: "100%", padding: "13px", borderRadius: 14,
                                    background: "rgba(232,64,64,0.08)", border: "1px solid rgba(232,64,64,0.25)",
                                    color: "#E84040", fontWeight: 700, fontSize: 14, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                }}
                            >
                                <X size={16} /> Cancel Ride
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

/* ─────── Searching spinner overlay ─────── */
function SearchingOverlay({ onCancel }: { onCancel: () => void }) {
    const [dots, setDots] = useState("...");
    const [count, setCount] = useState(0);
    useEffect(() => {
        const iv = setInterval(() => {
            setDots(d => d.length >= 3 ? "." : d + ".");
            setCount(c => c + 1);
        }, 500);
        return () => clearInterval(iv);
    }, []);

    return (
        <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2000,
            background: "rgba(5,13,26,0.97)", backdropFilter: "blur(24px)",
            borderTop: "1px solid rgba(212,175,55,0.25)",
            borderRadius: "24px 24px 0 0",
            padding: "30px 24px 40px",
            boxShadow: "0 -16px 64px rgba(0,0,0,0.7)",
        }}>
            <div style={{ textAlign: "center" }}>
                <div style={{
                    width: 80, height: 80, borderRadius: "50%", margin: "0 auto 20px",
                    background: "rgba(212,175,55,0.1)", border: "2px solid rgba(212,175,55,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                }}>
                    <div style={{
                        position: "absolute", inset: -8, borderRadius: "50%",
                        border: "2px solid transparent",
                        borderTop: "2px solid #D4AF37",
                        animation: "spin 1s linear infinite",
                    }} />
                    <span style={{ fontSize: 32 }}>🔍</span>
                </div>
                <h3 style={{ fontWeight: 900, fontSize: 20, marginBottom: 6, color: "white" }}>
                    Finding your ride{dots}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24 }}>
                    Searching {8 - Math.min(count, 6)} drivers near you · usually takes &lt;60s
                </p>

                {/* Progress dots */}
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: count > i ? "#D4AF37" : "rgba(255,255,255,0.12)",
                            transition: "background 0.3s",
                            boxShadow: count > i ? "0 0 8px #D4AF37" : "none",
                        }} />
                    ))}
                </div>

                <button
                    onClick={onCancel}
                    style={{
                        padding: "12px 36px", borderRadius: 12,
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600, cursor: "pointer"
                    }}
                >
                    Cancel
                </button>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

/* ─────── MAIN MAP PAGE ─────── */
export function MapPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<BookingStep>("idle");
    const [pickup, setPickup] = useState("Koramangala, Bengaluru");
    const [drop, setDrop] = useState("");
    const [pickupFocused, setPickupFocused] = useState(false);
    const [dropFocused, setDropFocused] = useState(false);
    const [selectedRide, setSelectedRide] = useState("mini");
    const [panelOpen, setPanelOpen] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [gpsStatus, setGpsStatus] = useState<"loading" | "ok" | "denied" | "default">("loading");
    const [driver, setDriver] = useState<Driver | null>(null);
    const [pickupQuery, setPickupQuery] = useState("");
    const [dropQuery, setDropQuery] = useState("");
    const searchTimerRef = useRef<ReturnType<typeof setTimeout>>();

    const ride = RIDE_TYPES.find(r => r.id === selectedRide)!;

    /* ── Get user GPS ── */
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setGpsStatus("ok");
                },
                () => {
                    setGpsStatus("denied");
                    // fallback to Koramangala
                    setUserLocation({ lat: 12.9352, lng: 77.6245 });
                },
                { timeout: 8000, enableHighAccuracy: true }
            );
        } else {
            setGpsStatus("default");
            setUserLocation({ lat: 12.9352, lng: 77.6245 });
        }
    }, []);

    /* ── Book ride flow ── */
    const handleBookRide = useCallback(() => {
        if (!drop) return;
        setStep("searching");
        // Simulate finding driver
        setTimeout(() => {
            setStep("seeking");
            setTimeout(() => {
                setDriver(MOCK_DRIVER);
                setStep("matched");
                // Simulate driver arriving
                setTimeout(() => setStep("riding"), 6000);
                // Arrived
                setTimeout(() => setStep("arrived"), 18000);
            }, 4000);
        }, 800);
    }, [drop]);

    const handleCancel = useCallback(() => {
        setStep("idle");
        setDrop("");
        setDropQuery("");
        setDriver(null);
        setPanelOpen(false);
    }, []);

    const selectLocation = useCallback((loc: typeof QUICK_LOCATIONS[0], isPickup: boolean) => {
        if (isPickup) {
            setPickup(loc.name);
            setPickupQuery("");
            setPickupFocused(false);
        } else {
            setDrop(loc.name);
            setDropQuery("");
            setDropFocused(false);
            setPanelOpen(true);
        }
    }, []);

    const showMap = step === "idle" || step === "searching";
    const showRoute = (step !== "idle") || !!drop;
    const showDrivers = step === "idle" || step === "searching";

    return (
        <div style={{
            position: "fixed", inset: 0,
            fontFamily: "'Inter','Segoe UI',sans-serif",
            background: DARK, color: "white",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
        }}>
            {/* ── Full-screen Map ── */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                <MapBackground
                    height="100%"
                    showRoute={showRoute}
                    showDriverPin={true}
                    showDestPin={!!drop}
                    userLat={userLocation?.lat}
                    userLng={userLocation?.lng}
                    interactive={true}
                    mode={step === "searching" ? "seeking" : "idle"}
                    trackedDriverId={driver ? 1 : null}
                />
            </div>

            {/* ── Top Nav Bar ── */}
            <div style={{
                position: "relative", zIndex: 1000,
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px",
                background: "rgba(5,13,26,0.85)", backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: GLASS_M, border: `1px solid ${GLASS_B}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", flexShrink: 0,
                    }}
                >
                    <ArrowLeft size={18} color={G} />
                </button>

                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 900, fontSize: 16, color: G }}>SAARADHI</span>
                        <span style={{ fontWeight: 900, fontSize: 16, color: "white" }}>GO</span>
                        <span style={{
                            padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                            background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", color: G,
                        }}>Live Map</span>
                    </div>
                </div>

                {/* GPS status */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 12px", borderRadius: 20,
                    background: gpsStatus === "ok" ? "rgba(96,208,96,0.08)" : "rgba(255,165,0,0.08)",
                    border: `1px solid ${gpsStatus === "ok" ? "rgba(96,208,96,0.25)" : "rgba(255,165,0,0.25)"}`,
                    fontSize: 11, fontWeight: 600,
                    color: gpsStatus === "ok" ? "#60D080" : "#FFA500",
                }}>
                    {gpsStatus === "ok" ? <LocateFixed size={12} /> : <AlertTriangle size={12} />}
                    {gpsStatus === "ok" ? "GPS Active" : gpsStatus === "loading" ? "Locating..." : "Manual Mode"}
                </div>

                <button
                    onClick={() => navigate("/book")}
                    style={{
                        padding: "8px 14px", borderRadius: 10, border: "none",
                        background: `linear-gradient(135deg, ${G}, #F0C040)`,
                        color: DARK, fontSize: 12, fontWeight: 800, cursor: "pointer",
                    }}
                >Book Ride</button>
            </div>

            {/* ── Search Panel (bottom sheet) ── */}
            {step === "idle" && (
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1500,
                    transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
                }}>
                    {/* Collapsed pill — show when panel is closed */}
                    {!panelOpen && (
                        <div
                            onClick={() => setPanelOpen(true)}
                            style={{
                                margin: "0 16px 16px",
                                background: "rgba(5,13,26,0.97)", backdropFilter: "blur(24px)",
                                border: "1px solid rgba(212,175,55,0.25)", borderRadius: 18,
                                padding: "14px 18px", cursor: "pointer",
                                boxShadow: "0 -4px 40px rgba(0,0,0,0.6)",
                                display: "flex", alignItems: "center", gap: 12,
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)")}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)")}
                        >
                            <div style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: `linear-gradient(135deg, ${G}22, ${G}08)`,
                                border: `1px solid ${G}33`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <Search size={18} color={G} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>
                                    WHERE TO?
                                </div>
                                <div style={{ color: drop || "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: drop ? 600 : 400 }}>
                                    {drop || "Enter your destination..."}
                                </div>
                            </div>
                            <ChevronUp size={18} color="rgba(255,255,255,0.3)" />
                        </div>
                    )}

                    {/* Expanded panel */}
                    {panelOpen && (
                        <div style={{
                            background: "rgba(5,13,26,0.97)", backdropFilter: "blur(24px)",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "24px 24px 0 0",
                            boxShadow: "0 -16px 64px rgba(0,0,0,0.8)",
                        }}>
                            {/* Handle */}
                            <div style={{ paddingTop: 12, display: "flex", justifyContent: "center" }}>
                                <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.15)" }} />
                            </div>

                            <div style={{ padding: "12px 20px 0" }}>
                                {/* Header */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                                    <div>
                                        <h2 style={{ fontWeight: 900, fontSize: 20, marginBottom: 2 }}>Where to?</h2>
                                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                                            {BASE_VEHICLES_PILL}
                                        </p>
                                    </div>
                                    <button onClick={() => setPanelOpen(false)} style={{
                                        width: 34, height: 34, borderRadius: 10,
                                        background: GLASS_M, border: `1px solid ${GLASS_B}`,
                                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                                    }}>
                                        <ChevronDown size={16} color="rgba(255,255,255,0.5)" />
                                    </button>
                                </div>

                                {/* Location inputs */}
                                <div style={{
                                    background: "rgba(15,28,46,0.8)", borderRadius: 16,
                                    border: "1px solid rgba(212,175,55,0.15)", padding: 14, marginBottom: 14,
                                    position: "relative",
                                }}>
                                    {/* Pickup */}
                                    <div style={{ position: "relative", marginBottom: 10 }}>
                                        <p style={{ color: G, fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
                                            📍 PICKUP
                                        </p>
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 10,
                                            background: pickupFocused ? "rgba(212,175,55,0.07)" : "rgba(255,255,255,0.03)",
                                            borderRadius: 10, padding: "10px 12px",
                                            border: `1.5px solid ${pickupFocused ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.08)"}`,
                                            transition: "all 0.2s",
                                        }}>
                                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: G, boxShadow: `0 0 0 3px ${G}33`, flexShrink: 0 }} />
                                            <input
                                                value={pickup}
                                                onChange={e => { setPickup(e.target.value); setPickupQuery(e.target.value); }}
                                                onFocus={() => setPickupFocused(true)}
                                                onBlur={() => setTimeout(() => setPickupFocused(false), 200)}
                                                placeholder="Your pickup location"
                                                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "white", fontSize: 13, fontWeight: 500 }}
                                            />
                                        </div>
                                        {pickupFocused && (
                                            <LocationSuggestions query={pickupQuery} onSelect={l => selectLocation(l, true)} color={G} />
                                        )}
                                    </div>

                                    {/* Connector */}
                                    <div style={{ marginLeft: 4, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 2, height: 24, background: `linear-gradient(180deg, ${G}, #60A5FA)`, borderRadius: 2, marginLeft: 2 }} />
                                        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>route</span>
                                    </div>

                                    {/* Drop */}
                                    <div style={{ position: "relative" }}>
                                        <p style={{ color: "#60A5FA", fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
                                            🎯 DROP
                                        </p>
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 10,
                                            background: dropFocused ? "rgba(96,165,250,0.07)" : "rgba(255,255,255,0.03)",
                                            borderRadius: 10, padding: "10px 12px",
                                            border: `1.5px solid ${dropFocused ? "rgba(96,165,250,0.4)" : "rgba(255,255,255,0.08)"}`,
                                            transition: "all 0.2s",
                                        }}>
                                            <Search size={13} color={dropFocused ? "#60A5FA" : "#4a6a8a"} style={{ flexShrink: 0 }} />
                                            <input
                                                value={drop}
                                                onChange={e => { setDrop(e.target.value); setDropQuery(e.target.value); }}
                                                onFocus={() => setDropFocused(true)}
                                                onBlur={() => setTimeout(() => setDropFocused(false), 200)}
                                                placeholder="Where are you going?"
                                                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "white", fontSize: 13, fontWeight: 500 }}
                                                autoFocus
                                            />
                                            {drop && <button onClick={() => { setDrop(""); setDropQuery(""); }} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={13} color="#5a7a9a" /></button>}
                                        </div>
                                        {dropFocused && (
                                            <LocationSuggestions query={dropQuery} onSelect={l => selectLocation(l, false)} color="#60A5FA" />
                                        )}
                                    </div>
                                </div>

                                {/* Quick destinations */}
                                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                                    {[
                                        { icon: "🏠", label: "Home", addr: "Koramangala 5th Block" },
                                        { icon: "💼", label: "Work", addr: "MG Road, Bengaluru" },
                                        { icon: "✈️", label: "Airport", addr: "Kempegowda Airport" },
                                    ].map(s => (
                                        <button key={s.label} onClick={() => { setDrop(s.addr); setDropQuery(""); setPanelOpen(true); }} style={{
                                            display: "flex", alignItems: "center", gap: 8,
                                            padding: "8px 12px", borderRadius: 10,
                                            background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)",
                                            cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600,
                                            transition: "all 0.2s",
                                        }}
                                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.1)")}
                                            onMouseLeave={e => (e.currentTarget.style.background = "rgba(212,175,55,0.05)")}
                                        >
                                            <span>{s.icon}</span> {s.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Ride type selector */}
                                {drop && (
                                    <>
                                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                                            Choose Ride Type
                                        </p>
                                        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                                            {RIDE_TYPES.map(r => {
                                                const active = selectedRide === r.id;
                                                return (
                                                    <button
                                                        key={r.id}
                                                        onClick={() => setSelectedRide(r.id)}
                                                        style={{
                                                            flex: 1, padding: "10px 6px", borderRadius: 12, cursor: "pointer",
                                                            background: active ? `${r.color}14` : "rgba(255,255,255,0.03)",
                                                            border: `1.5px solid ${active ? r.color + "66" : "rgba(255,255,255,0.08)"}`,
                                                            transition: "all 0.2s", position: "relative",
                                                        }}
                                                    >
                                                        {r.badge && (
                                                            <div style={{
                                                                position: "absolute", top: -8, right: 4,
                                                                background: r.badge === "Premium" ? r.color : "#60D080",
                                                                color: DARK, fontSize: 8, fontWeight: 900,
                                                                padding: "2px 6px", borderRadius: 999, letterSpacing: 0.5,
                                                            }}>{r.badge}</div>
                                                        )}
                                                        <div style={{ fontSize: 22, marginBottom: 3 }}>{r.emoji}</div>
                                                        <div style={{ color: active ? r.color : "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700, marginBottom: 1 }}>{r.label}</div>
                                                        <div style={{ color: active ? r.color : "rgba(255,255,255,0.3)", fontSize: 10 }}>{r.price}</div>
                                                        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 9 }}>{r.eta}</div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Ride info row */}
                                        <div style={{
                                            display: "flex", gap: 8, marginBottom: 16,
                                            padding: "10px 14px", borderRadius: 12,
                                            background: `${ride.color}08`, border: `1px solid ${ride.color}22`,
                                        }}>
                                            <div style={{ flex: 1, textAlign: "center" }}>
                                                <div style={{ color: ride.color, fontWeight: 800, fontSize: 14 }}>{ride.price}</div>
                                                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>Est. Fare</div>
                                            </div>
                                            <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
                                            <div style={{ flex: 1, textAlign: "center" }}>
                                                <div style={{ color: ride.color, fontWeight: 800, fontSize: 14 }}>{ride.eta}</div>
                                                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>ETA</div>
                                            </div>
                                            <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
                                            <div style={{ flex: 1, textAlign: "center" }}>
                                                <div style={{ color: ride.color, fontWeight: 800, fontSize: 14 }}>{ride.passengers}p</div>
                                                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>Capacity</div>
                                            </div>
                                            {ride.surge && (
                                                <>
                                                    <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
                                                    <div style={{ flex: 1, textAlign: "center" }}>
                                                        <div style={{ color: "#FFA500", fontWeight: 800, fontSize: 12 }}>⚡1.3x</div>
                                                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>Surge</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Book CTA */}
                                        <button
                                            onClick={handleBookRide}
                                            style={{
                                                width: "100%", padding: "16px", borderRadius: 14, border: "none",
                                                background: `linear-gradient(135deg, ${G}, #F0C040)`,
                                                color: DARK, fontWeight: 900, fontSize: 16, cursor: "pointer",
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                                boxShadow: `0 8px 32px ${G}44`,
                                                transition: "transform 0.15s, box-shadow 0.15s",
                                                marginBottom: 24,
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = `0 12px 40px ${G}55`;
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = `0 8px 32px ${G}44`;
                                            }}
                                        >
                                            <Zap size={20} strokeWidth={2.5} />
                                            Book {ride.label} · {ride.price}
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Searching overlay ── */}
            {(step === "searching" || step === "seeking") && (
                <SearchingOverlay onCancel={handleCancel} />
            )}

            {/* ── Driver matched / riding / arrived ── */}
            {(step === "matched" || step === "riding" || step === "arrived") && driver && (
                <DriverCard
                    driver={driver}
                    step={step}
                    onCancel={handleCancel}
                    onArrived={handleCancel}
                />
            )}

            {/* ── Floating action buttons ── */}
            {step === "idle" && (
                <div style={{
                    position: "absolute", right: 16, bottom: panelOpen ? 520 : 100,
                    display: "flex", flexDirection: "column", gap: 10,
                    zIndex: 1400, transition: "bottom 0.4s ease",
                }}>
                    {/* Recenter */}
                    <button
                        onClick={() => {
                            if (userLocation) {
                                // Would trigger map re-center
                            }
                        }}
                        style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: "rgba(5,13,26,0.9)", backdropFilter: "blur(12px)",
                            border: "1px solid rgba(212,175,55,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        }}
                    >
                        <LocateFixed size={20} color={G} />
                    </button>

                    {/* Route toggle */}
                    <button
                        onClick={() => navigate("/book")}
                        style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: "rgba(5,13,26,0.9)", backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        }}
                    >
                        <Route size={20} color="rgba(255,255,255,0.5)" />
                    </button>
                </div>
            )}
        </div>
    );
}

/* helper constant */
const BASE_VEHICLES_PILL = "8 drivers near you · avg 3 min away";
