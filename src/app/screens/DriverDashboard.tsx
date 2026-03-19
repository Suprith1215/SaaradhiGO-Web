import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { socketService } from "../../services/socketService";
import { LiquidButton, MetalButton } from "@/components/ui/liquid-glass-button";
import {
  Navigation,
  DollarSign,
  Star,
  Phone,
  MessageSquare,
  ArrowLeft,
  Bell,
  Settings,
  ChevronRight,
  TrendingUp,
  Wallet,
  HelpCircle,
  MapPin,
  Clock,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Zap,
  AlertCircle,
  Home,
  Car,
} from "lucide-react";
import logoImage from "@/assets/25a5bd8011d7696bf02e1d5cc818a54ef634abf4.png";
import { useRideSimulation } from "../../services/mockRealtime";
import { ChatOverlay } from "../components/ChatOverlay";
import { MapBackground } from "../components/MapBackground";

const G = "#D4AF37";
const DARK = "#050D1A";
const NAVY = "#0F1C2E";
const GLASS = "rgba(255,255,255,0.04)";
const GB = "rgba(255,255,255,0.09)";

type DTab = "home" | "earnings" | "wallet" | "ratings" | "vehicles" | "support";

interface GCardProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: React.CSSProperties;
}
function GCard({ children, style = {}, ...rest }: GCardProps) {
  return (
    <div
      className="gcard-glow"
      style={{
        background: "rgba(15,28,46,0.8)",
        border: `1px solid ${GB}`,
        borderRadius: 18,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function Badge({
  color,
  bg,
  children,
}: {
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        color,
        background: bg,
      }}
    >
      {children}
    </span>
  );
}

import { getProfile } from "../../services/authService";
import { getEarningsSummary } from "../../services/driverService";

export function DriverDashboard() {
  const navigate = useNavigate();
  const { session, acceptRide, setStatus, endRide, requestRide, cancelRide } = useRideSimulation();
  const [tab, setTab] = useState<DTab>("home");
  const [online, setOnline] = useState(false);
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);
  const [rideState, setRideState] = useState<"idle" | "navigate" | "start" | "live" | "ended">("idle");
  const [optInput, setOptInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [driverProfile, setDriverProfile] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const geoInterval = useRef<any>(null);

  useEffect(() => {
    const loadData = async () => {
        try {
            const [prof, earn] = await Promise.all([getProfile(), getEarningsSummary()]);
            setDriverProfile(prof);
            setEarnings(earn);
            setLoading(false);
        } catch (e) {
            console.error("Failed to load driver data", e);
            // Fallback to local storage for demo
            const localUser = JSON.parse(localStorage.getItem('saaradhigo_current_user') || 'null');
            if (localUser) setDriverProfile(localUser);
            setLoading(false);
        }
    };
    loadData();
  }, []);

  useEffect(() => {
    // Geolocation and Socket handling
    if (online) {
      socketService.connectDriverLocation();
      socketService.connectRideRequest((data) => {
        // useRideSimulation already handles the storage/context, 
        // but we might want local feedback here
        console.log("Driver got request update:", data);
      });

      geoInterval.current = setInterval(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            socketService.updateDriverLocation(pos.coords.latitude, pos.coords.longitude);
          }, (err) => console.warn("Geo error:", err));
        }
      }, 5000); // Update every 5s
    } else {
      socketService.disconnectAll();
      if (geoInterval.current) clearInterval(geoInterval.current);
    }

    return () => {
      if (geoInterval.current) clearInterval(geoInterval.current);
    };
  }, [online]);

  useEffect(() => {
     if (!session || ignoredIds.includes(session.id)) {
         setRideState((prev) => prev === "ended" ? "ended" : "idle");
     } else if (session.status === "accepted") {
         setRideState("navigate");
     } else if (session.status === "arrived") {
         setRideState("start");
     } else if (session.status === "riding") {
         setRideState("live");
     } else if (session.status === "ended") {
         setRideState("ended");
     } else {
         setRideState("idle");
     }
  }, [session, ignoredIds]);

  const hasRequest = online && session?.status === "searching" && !ignoredIds.includes(session.id);

  const TABS: { id: DTab; icon: React.ReactNode; label: string }[] = [
    { id: "home", icon: <Home size={16} />, label: "Dashboard" },
    { id: "earnings", icon: <TrendingUp size={16} />, label: "Earnings" },
    { id: "wallet", icon: <Wallet size={16} />, label: "Wallet" },
    { id: "ratings", icon: <Star size={16} />, label: "Ratings" },
    { id: "vehicles", icon: <Car size={16} />, label: "Vehicles" },
    { id: "support", icon: <HelpCircle size={16} />, label: "Support" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${DARK}, ${NAVY})`,
        fontFamily: "'Inter','Segoe UI',sans-serif",
        color: "white",
      }}
    >
      <style>{`
                /* 3D Classes */
                .perspective-container { perspective: 2000px; }
                .card-3d { 
                    transform-style: preserve-3d; 
                    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease; 
                }
                .card-3d:hover {
                    transform: rotateX(5deg) rotateY(-5deg) translateZ(10px);
                    box-shadow: -10px 15px 30px rgba(0,0,0,0.4);
                }
                .gcard-glow {
                    transition: all 0.3s ease;
                }
                .gcard-glow:hover {
                    border-color: rgba(212,175,55,0.4) !important;
                    box-shadow: 0 0 20px rgba(212,175,55,0.15);
                }
            `}</style>
      {/* NAVBAR */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 5vw",
          background: "rgba(5,13,26,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${GB}`,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <img
            src={logoImage}
            alt="logo"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <span style={{ fontWeight: 900, fontSize: 16 }}>
            <span style={{ color: G }}>SAARADHI</span>GO
          </span>
        </button>
        <span
          style={{
            padding: "3px 12px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            background: "rgba(212,175,55,0.12)",
            border: "1px solid rgba(212,175,55,0.3)",
            color: G,
          }}
        >
          Driver Dashboard
        </span>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 10,
              cursor: "pointer",
              border: `1px solid ${online ? "rgba(96,208,96,0.4)" : GB}`,
              background: online ? "rgba(96,208,96,0.08)" : GLASS,
              transition: "all 0.3s",
            }}
            onClick={() => {
              setOnline(!online);
              if (online) setRideState("idle");
            }}
          >
            {online ? (
              <ToggleRight size={20} color="#60D080" />
            ) : (
              <ToggleLeft size={20} color="rgba(255,255,255,0.3)" />
            )}
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: online ? "#60D080" : "rgba(255,255,255,0.4)",
              }}
            >
              {online ? "Online" : "Offline"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              background: GLASS,
              border: `1px solid ${GB}`,
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(212,175,55,0.2)",
                border: `1px solid ${G}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🧑‍💼
            </div>
            <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
              {driverProfile?.full_name || driverProfile?.name || "Ravi Shankar"}
            </span>
          </div>
        </div>
      </nav>

      {/* RIDE REQUEST POPUP */}
      {hasRequest && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.7)",
            zIndex: 200,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0d1f35, #1a2d48)",
              border: "1px solid rgba(212,175,55,0.35)",
              borderRadius: 28,
              padding: 32,
              maxWidth: 420,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            {/* Timer bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  color: G,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                NEW RIDE REQUEST
              </span>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: `3px solid ${G}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: G,
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                15
              </div>
            </div>

            <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  FARE
                </p>
                <p style={{ color: G, fontSize: 28, fontWeight: 900 }}>
                  {session?.fare || "₹185"}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  DISTANCE
                </p>
                <p style={{ color: "white", fontSize: 20, fontWeight: 700 }}>
                  {session?.distance || "11.2 km"}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  PICKUP
                </p>
                <p style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
                  {session?.eta || "~3 min"}
                </p>
              </div>
            </div>

            <GCard style={{ padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: G,
                    }}
                  />
                  <div
                    style={{
                      width: 1,
                      height: 24,
                      background: "rgba(212,175,55,0.3)",
                    }}
                  />
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#E84040",
                    }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 13,
                      marginBottom: 16,
                    }}
                  >
                    {session?.pickup || "Koramangala, Bengaluru"}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                    {session?.drop || "Brigade Road, MG Road"}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Badge color="#60D080" bg="rgba(96,208,96,0.1)">
                  {session?.type || "SaaraMini"}
                </Badge>
                <Badge
                  color="rgba(255,255,255,0.5)"
                  bg="rgba(255,255,255,0.06)"
                >
                  {session?.riderName ? `${session.riderName}${session.riderAge ? ` • ${session.riderAge}y` : ''}${session.riderGender ? ` • ${session.riderGender.charAt(0).toUpperCase()}` : ''}` : "Rider"} • 4.9★
                </Badge>
              </div>
            </GCard>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => {
                   if (session) cancelRide();
                }}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 14,
                  border: `1px solid rgba(255,100,100,0.3)`,
                  background: "rgba(255,100,100,0.06)",
                  color: "#FF8080",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Decline
              </button>
              <button
                onClick={() => {
                  socketService.sendTripAction('accept');
                  acceptRide(driverProfile?.id || "drv_123");
                }}
                style={{
                  flex: 2,
                  padding: "14px",
                  borderRadius: 14,
                  border: "none",
                  background: `linear-gradient(135deg, ${G}, #F0C040)`,
                  color: DARK,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                ✓ Accept Ride
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "28px 5vw",
          display: "flex",
          gap: 28,
        }}
      >
        {/* SIDEBAR */}
        <aside style={{ width: 200, flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 80 }}>
            <GCard
              style={{ padding: 20, marginBottom: 16, textAlign: "center" }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  margin: "0 auto 10px",
                  background: "rgba(212,175,55,0.15)",
                  border: `2px solid ${G}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                }}
              >
                {driverProfile?.full_name?.[0] || driverProfile?.name?.[0] || "D"}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                {driverProfile?.full_name || driverProfile?.name || "Driver"}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                {driverProfile?.active_vehicle?.model 
                  ? `${driverProfile.active_vehicle.brand} ${driverProfile.active_vehicle.model} (${driverProfile.active_vehicle.vehicle_type})`
                  : driverProfile?.vehicle 
                    ? driverProfile.vehicle 
                    : "No Active Vehicle"}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 11,
                  marginBottom: 8,
                }}
              >
                {driverProfile?.active_vehicle?.vehicle_number || driverProfile?.vehicle_number || "-"}
              </p>
              <Badge color="#60D080" bg="rgba(96,208,96,0.1)">
                4.8 ★ Rating
              </Badge>
            </GCard>

            <GCard style={{ overflow: "hidden", marginBottom: 16 }}>
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "13px 16px",
                    background:
                      tab === t.id ? "rgba(212,175,55,0.08)" : "transparent",
                    borderLeft:
                      tab === t.id ? `3px solid ${G}` : "3px solid transparent",
                    borderTop: "none",
                    borderRight: "none",
                    borderBottom:
                      i < TABS.length - 1 ? `1px solid ${GB}` : "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span
                    style={{
                      color: tab === t.id ? G : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {t.icon}
                  </span>
                  <span
                    style={{
                      color: tab === t.id ? "white" : "rgba(255,255,255,0.45)",
                      fontSize: 13,
                      fontWeight: tab === t.id ? 700 : 400,
                    }}
                  >
                    {t.label}
                  </span>
                </button>
              ))}
            </GCard>

            <GCard style={{ padding: 16 }}>
              {[
                ["Today", `₹${earnings?.today?.amount || "0"}`],
                ["This Week", `₹${earnings?.week?.amount || "0"}`],
                ["This Month", `₹${earnings?.month?.amount || "0"}`],
                ["Rides Today", `${earnings?.today?.count || "0"}`],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}
                  >
                    {l}
                  </span>
                  <span style={{ color: G, fontSize: 13, fontWeight: 700 }}>
                    {v}
                  </span>
                </div>
              ))}
            </GCard>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* ═══ HOME (DRIVER DASHBOARD) ═══ */}
          {tab === "home" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 24,
                }}
              >
                <div>
                  <h1
                    style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}
                  >
                    Good afternoon, {driverProfile?.full_name?.split(' ')[0] || "Driver"}! 👋
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.4)" }}>
                    {online
                      ? "You are Online — waiting for ride requests."
                      : "You are Offline. Go online to start earning."}
                  </p>
                </div>
              </div>

              {/* Online toggle CTA */}
              {!online && (
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.04))",
                    border: "1px solid rgba(212,175,55,0.25)",
                    borderRadius: 20,
                    padding: 24,
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <div style={{ fontSize: 56 }}>🚗</div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}
                    >
                      Ready to earn today?
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                      Go online to receive ride requests in your area.
                    </p>
                  </div>
                  <button
                    onClick={() => setOnline(true)}
                    style={{
                      padding: "14px 28px",
                      borderRadius: 14,
                      border: "none",
                      cursor: "pointer",
                      background: `linear-gradient(135deg, ${G}, #F0C040)`,
                      color: DARK,
                      fontSize: 15,
                      fontWeight: 800,
                    }}
                  >
                    Go Online
                  </button>
                </div>
              )}

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                {[
                  {
                    icon: "💰",
                    label: "Earnings Today",
                    value: `₹${earnings?.today?.amount || "0"}`,
                    color: G,
                    sub: `${earnings?.today?.count || "0"} trips`,
                  },
                  {
                    icon: "⭐",
                    label: "Rating",
                    value: driverProfile?.rating || "5.0",
                    color: G,
                    sub: "Last 30 days",
                  },
                  {
                    icon: "🚗",
                    label: "Trips Today",
                    value: `${earnings?.today?.count || "0"}`,
                    color: "#B9F2FF",
                    sub: "95% acceptance",
                  },
                  {
                    icon: "⏱️",
                    label: "Online Hours",
                    value: `${earnings?.today?.online_hours || "0h"}`,
                    color: "#60D080",
                    sub: "Active Session",
                  },
                ].map((s) => (
                  <GCard
                    key={s.label}
                    className="card-3d"
                    style={{ padding: 18 }}
                  >
                    <div style={{ fontSize: 26, marginBottom: 8 }}>
                      {s.icon}
                    </div>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: 10,
                        marginBottom: 3,
                      }}
                    >
                      {s.label}
                    </p>
                    <p
                      style={{
                        color: s.color,
                        fontSize: 22,
                        fontWeight: 800,
                        marginBottom: 2,
                      }}
                    >
                      {s.value}
                    </p>
                    <p
                      style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}
                    >
                      {s.sub}
                    </p>
                  </GCard>
                ))}
              </div>

              {/* Active ride state */}
              {online && rideState !== "idle" && (
                <div style={{ marginBottom: 24 }}>
                  {/* Driver Mock Map View */}
                  {rideState !== "ended" && (
                    <div style={{
                      position: "relative",
                      height: 260,
                      borderRadius: 20,
                      overflow: "hidden",
                      marginBottom: 16,
                      border: "1px solid rgba(212,175,55,0.25)"
                    }}>
                      <MapBackground
                        mode={rideState === "navigate" || rideState === "start" ? "seeking" : "idle"}
                        showRoute={rideState === "navigate" || rideState === "live"}
                        showDestPin={rideState === "live" || rideState === "navigate"}
                        showDriverPin={true}
                        interactive={false}
                        trackedDriverId={driverProfile ? driverProfile.id : 1}
                        externalDrivers={driverProfile ? [{ ...driverProfile, pos: [12.9368, 77.6280], id: driverProfile.id, rotation: 225 }] : []}
                      />
                      
                      {/* Floating Map Info Overlay */}
                      <div style={{
                        position: "absolute",
                        bottom: 12, left: 12, right: 12, zIndex: 600,
                        background: "rgba(5, 13, 26, 0.85)", backdropFilter: "blur(12px)",
                        padding: "10px 14px", borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex", alignItems: "center", gap: 10
                      }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: rideState === "navigate" ? "#60D080" : "#D4AF37", boxShadow: `0 0 8px ${rideState === "navigate" ? "#60D080" : "#D4AF37"}` }} />
                        <p style={{ color: "white", fontSize: 13, fontWeight: 700 }}>
                          {rideState === "navigate" ? `Navigating to passenger pickup...` :
                           rideState === "start" ? `Arrived! Waiting for passenger...` :
                           `Driving passenger to destination...`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigate to Pickup */}
                  {rideState === "navigate" && (
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(96,208,96,0.08), rgba(96,208,96,0.02))",
                        border: "1px solid rgba(96,208,96,0.25)",
                        borderRadius: 20,
                        padding: 24,
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 16,
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            background: "rgba(96,208,96,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Navigation size={22} color="#60D080" />
                        </div>
                        <div>
                          <p
                            style={{
                              color: "#60D080",
                              fontSize: 12,
                              fontWeight: 700,
                              letterSpacing: 1,
                            }}
                          >
                            NAVIGATE TO PICKUP
                          </p>
                          <p
                            style={{
                              color: "white",
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                          >
                            Heading to {session?.pickup || "Pickup"}
                          </p>
                        </div>
                      </div>
                      <div
                        style={{ display: "flex", gap: 12, marginBottom: 16 }}
                      >
                        <GCard
                          style={{ flex: 1, padding: 14, textAlign: "center" }}
                        >
                          <p
                            style={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: 11,
                            }}
                          >
                            ETA
                          </p>
                          <p
                            style={{ color: G, fontSize: 20, fontWeight: 800 }}
                          >
                            {session?.eta || "3 min"}
                          </p>
                        </GCard>
                        <GCard
                          style={{ flex: 1, padding: 14, textAlign: "center" }}
                        >
                          <p
                            style={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: 11,
                            }}
                          >
                            Fare
                          </p>
                          <p
                            style={{ color: G, fontSize: 20, fontWeight: 800 }}
                          >
                            {session?.fare || "₹185"}
                          </p>
                        </GCard>
                        <GCard
                          style={{ flex: 1, padding: 14, textAlign: "center" }}
                        >
                          <p
                            style={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: 11,
                            }}
                          >
                            Trip
                          </p>
                          <p
                            style={{ color: G, fontSize: 20, fontWeight: 800 }}
                          >
                            {session?.distance || "11.2 km"}
                          </p>
                        </GCard>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            border: `1px solid ${GB}`,
                            background: GLASS,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Phone size={18} color={G} />
                        </button>
                        <button
                          onClick={() => setShowChat(true)}
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            border: `1px solid ${GB}`,
                            background: GLASS,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <MessageSquare size={18} color={G} />
                        </button>
                        <button
                          onClick={() => {
                            socketService.sendTripAction('arrive');
                            setStatus("arrived");
                          }}
                          style={{
                            flex: 1,
                            padding: "14px",
                            borderRadius: 14,
                            border: "none",
                            background: `linear-gradient(135deg, ${G}, #F0C040)`,
                            color: DARK,
                            fontSize: 14,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Arrived at Pickup ✓
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Start Ride */}
                  {rideState === "start" && (
                    <div
                      style={{
                        background: "rgba(30,58,95,0.4)",
                        border: "1px solid rgba(212,175,55,0.25)",
                        borderRadius: 20,
                        padding: 24,
                        marginBottom: 16,
                      }}
                    >
                      <p
                        style={{
                          color: G,
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: 1,
                          marginBottom: 12,
                        }}
                      >
                        VERIFY PASSENGER
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          marginBottom: 20,
                        }}
                      >
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            background: "rgba(212,175,55,0.1)",
                            border: `2px solid ${G}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 26,
                          }}
                        >
                          👨
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 16 }}>
                            {session?.riderName ? `${session.riderName}${session.riderAge ? ` • ${session.riderAge}y` : ''}${session.riderGender ? ` • ${session.riderGender.charAt(0).toUpperCase()}` : ''}` : "Arjun Kumar"}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={11}
                                fill={s <= 4 ? G : "transparent"}
                                color={G}
                              />
                            ))}
                            <span
                              style={{
                                color: "rgba(255,255,255,0.4)",
                                fontSize: 12,
                              }}
                            >
                              4.9 rating
                            </span>
                          </div>
                        </div>
                        <div
                          style={{ marginLeft: "auto", textAlign: "center" }}
                        >
                          <p
                            style={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: 11,
                            }}
                          >
                            OTP
                          </p>
                          <p
                            style={{
                              color: G,
                              fontWeight: 900,
                              fontSize: 24,
                              letterSpacing: 4,
                            }}
                          >
                            4782
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                            socketService.sendTripAction('start');
                            setStatus("riding");
                        }}
                        style={{
                          width: "100%",
                          padding: "15px",
                          borderRadius: 14,
                          border: "none",
                          background: `linear-gradient(135deg, ${G}, #F0C040)`,
                          color: DARK,
                          fontSize: 15,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        🚗 Start Ride
                      </button>
                    </div>
                  )}

                  {/* Live Ride */}
                  {rideState === "live" && (
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(96,208,96,0.06), rgba(96,208,96,0.02))",
                        border: "1px solid rgba(96,208,96,0.25)",
                        borderRadius: 20,
                        padding: 24,
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 16,
                        }}
                      >
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#60D080",
                            animation: "pulse 1.5s infinite",
                          }}
                        />
                        <p
                          style={{
                            color: "#60D080",
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          LIVE — Ride in Progress
                        </p>
                      </div>
                      <div
                        style={{ display: "flex", gap: 14, marginBottom: 20 }}
                      >
                        <GCard
                          style={{ flex: 1, padding: 14, textAlign: "center" }}
                        >
                          <p
                            style={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: 11,
                            }}
                          >
                            FARE
                          </p>
                          <p
                            style={{ color: G, fontSize: 24, fontWeight: 900 }}
                          >
                            {session?.fare || "₹185"}
                          </p>
                        </GCard>
                        <GCard
                          style={{ flex: 1, padding: 14, textAlign: "center" }}
                        >
                          <p
                            style={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: 11,
                            }}
                          >
                            REMAINING
                          </p>
                          <p
                            style={{
                              color: "white",
                              fontSize: 24,
                              fontWeight: 900,
                            }}
                          >
                            {session?.distance || "6.2 km"}
                          </p>
                        </GCard>
                        <GCard
                          style={{ flex: 1, padding: 14, textAlign: "center" }}
                        >
                          <p
                            style={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: 11,
                            }}
                          >
                            ETA
                          </p>
                          <p
                            style={{
                              color: "white",
                              fontSize: 24,
                              fontWeight: 900,
                            }}
                          >
                            {session?.eta || "12m"}
                          </p>
                        </GCard>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          style={{
                            flex: 1,
                            padding: "14px",
                            borderRadius: 14,
                            border: `1px solid ${GB}`,
                            background: GLASS,
                            color: "#FF8080",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Cancel Trip
                        </button>
                        <button
                          onClick={() => {
                              socketService.sendTripAction('complete');
                              endRide();
                          }}
                          style={{
                            flex: 2,
                            padding: "14px",
                            borderRadius: 14,
                            border: "none",
                            background: `linear-gradient(135deg, ${G}, #F0C040)`,
                            color: DARK,
                            fontSize: 14,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Complete Ride ✓
                        </button>
                      </div>
                    </div>
                  )}

                  {/* End Summary */}
                  {rideState === "ended" && (
                    <div style={{ textAlign: "center" }}>
                      <GCard style={{ padding: 32, marginBottom: 16 }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                        <p
                          style={{
                            color: "#60D080",
                            fontWeight: 700,
                            fontSize: 14,
                            marginBottom: 4,
                          }}
                        >
                          Ride Completed!
                        </p>
                        <p
                          style={{
                            color: G,
                            fontSize: 48,
                            fontWeight: 900,
                            marginBottom: 8,
                          }}
                        >
                          ₹185
                        </p>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: 13,
                            marginBottom: 24,
                          }}
                        >
                          Koramangala → Brigade Road • 11.2 km • 34 min
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: 14,
                            justifyContent: "center",
                            marginBottom: 24,
                          }}
                        >
                          {[
                            ["Base Fare", "₹120"],
                            ["Distance", "₹50"],
                            ["Surge", "₹15"],
                          ].map(([l, v]) => (
                            <div key={l} style={{ textAlign: "center" }}>
                              <p
                                style={{
                                  color: G,
                                  fontWeight: 700,
                                  fontSize: 16,
                                }}
                              >
                                {v}
                              </p>
                              <p
                                style={{
                                  color: "rgba(255,255,255,0.35)",
                                  fontSize: 11,
                                }}
                              >
                                {l}
                              </p>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            setRideState("idle");
                            setStatus("idle");
                          }}
                          style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: 14,
                            border: "none",
                            cursor: "pointer",
                            background: `linear-gradient(135deg, ${G}, #F0C040)`,
                            color: DARK,
                            fontSize: 14,
                            fontWeight: 800,
                          }}
                        >
                          Ready for Next Ride →
                        </button>
                      </GCard>
                    </div>
                  )}
                </div>
              )}

              {/* Simulate ride request button (demo) */}
              {online && rideState === "idle" && (
                <div style={{ marginBottom: 24 }}>
                  <GCard
                    style={{
                      padding: 20,
                      border: "1px solid rgba(96,208,96,0.2)",
                      background: "rgba(96,208,96,0.04)",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: "rgba(96,208,96,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Zap size={22} color="#60D080" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            marginBottom: 2,
                          }}
                        >
                          You're Online & Ready
                        </p>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: 13,
                          }}
                        >
                          Waiting for ride requests in your area...
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          requestRide({
                            pickup: "MG Road, Bengaluru",
                            drop: "Indiranagar, Bengaluru",
                            fare: "₹250",
                            distance: "6.5 km",
                            type: "SaaraMini",
                            eta: "~5 min"
                          });
                        }}
                        style={{
                          padding: "10px 18px",
                          borderRadius: 12,
                          border: "none",
                          cursor: "pointer",
                          background: "rgba(96,208,96,0.15)",
                          color: "#60D080",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        Simulate Request
                      </button>
                    </div>
                  </GCard>
                </div>
              )}

              {/* Recent trips */}
              <GCard style={{ overflow: "hidden" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderBottom: `1px solid ${GB}`,
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: 15 }}>Recent Trips</p>
                  <button
                    onClick={() => setTab("earnings")}
                    style={{
                      color: G,
                      fontSize: 12,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    View earnings →
                  </button>
                </div>
                {(earnings?.recent_trips || []).map((t: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 20px",
                      borderBottom: i < (earnings.recent_trips.length - 1) ? `1px solid ${GB}` : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 24,
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(15,28,46,0.8)",
                        borderRadius: 12,
                      }}
                    >
                      {t.icon || "🚗"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          marginBottom: 2,
                        }}
                      >
                        {t.from} → {t.to}
                      </p>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.35)",
                          fontSize: 12,
                        }}
                      >
                        {t.time} • {t.km}
                      </p>
                    </div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#60D080",
                      }}
                    >
                      {t.fare}
                    </p>
                  </div>
                ))}
              </GCard>
            </div>
          )}

          {/* ═══ EARNINGS ═══ */}
          {tab === "earnings" && (
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
                Earnings
              </h1>
              <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
                Your daily, weekly and monthly performance.
              </p>

              {/* Hero */}
              <div
                style={{
                  background: "linear-gradient(135deg, #1a2d48, #0d1f35)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: 24,
                  padding: 32,
                  marginBottom: 20,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: -60,
                    top: -60,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(212,175,55,0.08), transparent)",
                  }}
                />
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 13,
                    marginBottom: 8,
                  }}
                >
                  This Month's Earnings
                </p>
                <p
                  style={{
                    color: G,
                    fontSize: 56,
                    fontWeight: 900,
                    marginBottom: 8,
                  }}
                >
                  ₹32,150
                </p>
                <p style={{ color: "#60D080", fontSize: 13 }}>
                  ↑ 12% vs last month
                </p>
              </div>

              {/* Breakdown */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                {[
                  { label: "Trips", value: "248", icon: "🚗" },
                  { label: "Avg per Trip", value: "₹129", icon: "💰" },
                  { label: "Online Hours", value: "142h", icon: "⏱️" },
                  { label: "Acceptance Rate", value: "94%", icon: "✅" },
                  { label: "Completion Rate", value: "98%", icon: "🏁" },
                  { label: "Surge Earnings", value: "₹4,200", icon: "⚡" },
                ].map((s) => (
                  <GCard
                    key={s.label}
                    style={{ padding: 16, textAlign: "center" }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>
                      {s.icon}
                    </div>
                    <p
                      style={{
                        color: G,
                        fontSize: 20,
                        fontWeight: 800,
                        marginBottom: 2,
                      }}
                    >
                      {s.value}
                    </p>
                    <p
                      style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}
                    >
                      {s.label}
                    </p>
                  </GCard>
                ))}
              </div>

              {/* Daily breakdown */}
              <GCard style={{ overflow: "hidden" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${GB}`,
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: 15 }}>Last 7 Days</p>
                </div>
                {[
                  {
                    day: "Today",
                    trips: 11,
                    earnings: "₹1,240",
                    hours: "6.5h",
                  },
                  {
                    day: "Yesterday",
                    trips: 14,
                    earnings: "₹1,680",
                    hours: "8h",
                  },
                  { day: "Wed", trips: 9, earnings: "₹1,050", hours: "5.5h" },
                  { day: "Tue", trips: 12, earnings: "₹1,380", hours: "7h" },
                  { day: "Mon", trips: 10, earnings: "₹1,150", hours: "6h" },
                ].map((d, i, arr) => (
                  <div
                    key={d.day}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 20px",
                      borderBottom:
                        i < arr.length - 1 ? `1px solid ${GB}` : "none",
                    }}
                  >
                    <p
                      style={{
                        width: 80,
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 13,
                      }}
                    >
                      {d.day}
                    </p>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          height: 6,
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: 999,
                          overflow: "hidden",
                          marginBottom: 4,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(parseInt(d.trips.toString()) / 14) * 100}%`,
                            background: `linear-gradient(90deg, ${G}, #F0C040)`,
                            borderRadius: 999,
                          }}
                        />
                      </div>
                      <p
                        style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}
                      >
                        {d.trips} trips • {d.hours}
                      </p>
                    </div>
                    <p
                      style={{
                        color: "#60D080",
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      {d.earnings}
                    </p>
                  </div>
                ))}
              </GCard>
            </div>
          )}

          {/* ═══ WALLET ═══ */}
          {tab === "wallet" && (
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
                Wallet & Payouts
              </h1>
              <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
                Your earnings, pending payouts, and bank details.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #1a2d48, #0d1f35)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: 22,
                    padding: 24,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: -40,
                      top: -40,
                      width: 160,
                      height: 160,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(212,175,55,0.08), transparent)",
                    }}
                  />
                  <p
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 12,
                      marginBottom: 6,
                    }}
                  >
                    Available for Withdrawal
                  </p>
                  <p
                    style={{
                      color: G,
                      fontSize: 36,
                      fontWeight: 900,
                      marginBottom: 16,
                    }}
                  >
                    ₹8,430
                  </p>
                  <button
                    style={{
                      padding: "12px 24px",
                      borderRadius: 12,
                      border: "none",
                      cursor: "pointer",
                      background: `linear-gradient(135deg, ${G}, #F0C040)`,
                      color: DARK,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    Withdraw Now
                  </button>
                </div>
                <GCard style={{ padding: 24 }}>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 12,
                      marginBottom: 6,
                    }}
                  >
                    Pending Clearance
                  </p>
                  <p
                    style={{
                      color: "white",
                      fontSize: 36,
                      fontWeight: 900,
                      marginBottom: 8,
                    }}
                  >
                    ₹1,240
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: 12,
                      marginBottom: 16,
                    }}
                  >
                    Clears by: Tomorrow 9 AM
                  </p>
                  <Badge color="#FFAA00" bg="rgba(255,170,0,0.1)">
                    ⏳ Pending
                  </Badge>
                </GCard>
              </div>

              <GCard style={{ overflow: "hidden" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${GB}`,
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: 15 }}>
                    Payout History
                  </p>
                </div>
                {[
                  {
                    date: "Dec 22",
                    amount: "₹7,800",
                    status: "Paid",
                    bank: "HDFC ••••4521",
                  },
                  {
                    date: "Dec 15",
                    amount: "₹9,200",
                    status: "Paid",
                    bank: "HDFC ••••4521",
                  },
                  {
                    date: "Dec 8",
                    amount: "₹6,500",
                    status: "Paid",
                    bank: "HDFC ••••4521",
                  },
                  {
                    date: "Dec 1",
                    amount: "₹8,100",
                    status: "Paid",
                    bank: "HDFC ••••4521",
                  },
                ].map((p, i, arr) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 20px",
                      borderBottom:
                        i < arr.length - 1 ? `1px solid ${GB}` : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "rgba(96,208,96,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircle size={20} color="#60D080" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          marginBottom: 2,
                        }}
                      >
                        Weekly Payout
                      </p>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.35)",
                          fontSize: 12,
                        }}
                      >
                        {p.date} • {p.bank}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          color: "#60D080",
                          fontWeight: 700,
                          fontSize: 16,
                          marginBottom: 3,
                        }}
                      >
                        {p.amount}
                      </p>
                      <Badge color="#60D080" bg="rgba(96,208,96,0.1)">
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </GCard>
            </div>
          )}

          {/* ═══ RATINGS ═══ */}
          {tab === "ratings" && (
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
                Ratings Overview
              </h1>
              <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
                Your passenger feedback and performance metrics.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                {/* Overall score */}
                <GCard style={{ padding: 28, textAlign: "center" }}>
                  <p
                    style={{
                      color: G,
                      fontSize: 72,
                      fontWeight: 900,
                      marginBottom: 4,
                    }}
                  >
                    4.8
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 4,
                      marginBottom: 10,
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={20}
                        fill={s <= 4 ? G : "transparent"}
                        color={G}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: 13,
                      marginBottom: 16,
                    }}
                  >
                    Based on 248 reviews
                  </p>
                  <Badge color={G} bg="rgba(212,175,55,0.1)">
                    Top Driver ⭐
                  </Badge>
                </GCard>

                {/* Breakdown */}
                <GCard style={{ padding: 24 }}>
                  <p
                    style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}
                  >
                    Rating Breakdown
                  </p>
                  {[
                    { stars: 5, count: 178, pct: 72 },
                    { stars: 4, count: 54, pct: 22 },
                    { stars: 3, count: 12, pct: 5 },
                    { stars: 2, count: 3, pct: 1 },
                    { stars: 1, count: 1, pct: 0 },
                  ].map((r) => (
                    <div
                      key={r.stars}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ display: "flex", gap: 2, width: 70 }}>
                        {[...Array(r.stars)].map((_, i) => (
                          <Star key={i} size={11} fill={G} color={G} />
                        ))}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          height: 8,
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${r.pct}%`,
                            background: `linear-gradient(90deg, ${G}, #F0C040)`,
                            borderRadius: 999,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 12,
                          width: 30,
                        }}
                      >
                        {r.count}
                      </span>
                    </div>
                  ))}
                </GCard>
              </div>

              {/* Categories */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                {[
                  { label: "Cleanliness", score: "4.9" },
                  { label: "Navigation", score: "4.7" },
                  { label: "Friendliness", score: "4.9" },
                  { label: "Punctuality", score: "4.6" },
                ].map((c) => (
                  <GCard
                    key={c.label}
                    style={{ padding: 16, textAlign: "center" }}
                  >
                    <p
                      style={{
                        color: G,
                        fontSize: 26,
                        fontWeight: 900,
                        marginBottom: 4,
                      }}
                    >
                      {c.score}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                      {c.label}
                    </p>
                  </GCard>
                ))}
              </div>

              <GCard style={{ overflow: "hidden" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${GB}`,
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: 15 }}>
                    Recent Reviews
                  </p>
                </div>
                {[
                  {
                    name: "Arjun K.",
                    rating: 5,
                    comment:
                      "Excellent driver! Very professional and punctual. Car was clean and AC was perfect.",
                    time: "Today",
                  },
                  {
                    name: "Priya S.",
                    rating: 5,
                    comment:
                      "Great experience! Took the best route and was very friendly.",
                    time: "Yesterday",
                  },
                  {
                    name: "Rohan M.",
                    rating: 4,
                    comment:
                      "Good driving, arrived on time. Slightly slow but overall great ride.",
                    time: "Dec 20",
                  },
                ].map((rev, i, arr) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px 20px",
                      borderBottom:
                        i < arr.length - 1 ? `1px solid ${GB}` : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "rgba(212,175,55,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            color: G,
                          }}
                        >
                          {rev.name[0]}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>
                            {rev.name}
                          </p>
                          <div style={{ display: "flex", gap: 2 }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={11}
                                fill={s <= rev.rating ? G : "transparent"}
                                color={G}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span
                        style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      >
                        {rev.time}
                      </span>
                    </div>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}
                    >
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </GCard>
            </div>
          )}

          {/* ═══ VEHICLES ═══ */}
          {tab === "vehicles" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Manage Vehicles</h1>
                  <p style={{ color: "rgba(255,255,255,0.4)" }}>You can add multiple vehicles and switch between them.</p>
                </div>
                <button
                    onClick={() => {
                        const vNum = prompt("Enter Vehicle Number (e.g. KA 05 MC 4892):");
                        const vModel = prompt("Enter Model (e.g. Maruti Swift):");
                        if (vNum && vModel) {
                            // Backend: POST /driver/vehicles/add/
                            const approved = JSON.parse(localStorage.getItem('saaradhigo_approved_drivers') || '[]');
                            if (approved.length > 0) {
                                const driver = approved[approved.length - 1];
                                if (!driver.vehicles) driver.vehicles = [];
                                driver.vehicles.push({
                                    id: Date.now(),
                                    vehicle_number: vNum,
                                    vehicle_type: 'car',
                                    brand: 'Unknown',
                                    model: vModel,
                                    color: 'White',
                                    year: 2024,
                                    capacity: 4
                                });
                                localStorage.setItem('saaradhigo_approved_drivers', JSON.stringify(approved));
                                setDriverProfile({ ...driver });
                                alert("Vehicle added successfully! Admin will review it shortly.");
                            }
                        }
                    }}
                    style={{
                    padding: "12px 20px", borderRadius: 12, border: "none",
                    background: `linear-gradient(135deg, ${G}, #F0C040)`, color: DARK,
                    fontSize: 14, fontWeight: 800, cursor: "pointer"
                }}>+ Add Vehicle</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { id: 1, model: driverProfile?.vehicle || "Toyota Etios", plate: "KA 05 MC 4892", type: "Mini", active: true },
                  ...(driverProfile?.vehicles || [])
                ].map((v: any, idx) => (
                  <GCard key={idx} style={{ padding: 20, border: v.active ? `1px solid ${G}` : `1px solid ${GB}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Car size={24} color={G} />
                      </div>
                      {v.active ? (
                        <Badge color={DARK} bg={G}>ACTIVE</Badge>
                      ) : (
                        <button 
                             onClick={() => alert(`Vehicle ${v.vehicle_number || v.plate} selected as active.`)}
                             style={{ background: "none", border: `1px solid ${GB}`, color: "rgba(255,255,255,0.4)", padding: "4px 10px", borderRadius: 8, fontSize: 11, cursor: "pointer" }}>
                          SET ACTIVE
                        </button>
                      )}
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{v.model}</h3>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 12 }}>{v.vehicle_number || v.plate}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                       <Badge color="white" bg="rgba(255,255,255,0.06)">{v.type || v.vehicle_type || 'Mini'}</Badge>
                       <Badge color="#60D080" bg="rgba(96,208,96,0.1)">Verified</Badge>
                    </div>
                  </GCard>
                ))}
              </div>
              
              {(!driverProfile?.vehicles || driverProfile.vehicles.length === 0) && (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.2)" }}>
                      <p>No additional vehicles registered.</p>
                  </div>
              )}
            </div>
          )}

          {/* ═══ SUPPORT ═══ */}
          {tab === "support" && (
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
                Support Center
              </h1>
              <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
                We're here 24/7 — for any issues or queries.
              </p>

              {/* Quick actions */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                {[
                  {
                    icon: "📞",
                    label: "Call Support",
                    sub: "24/7 Helpline",
                    color: "#60D080",
                  },
                  {
                    icon: "💬",
                    label: "Live Chat",
                    sub: "Avg wait: <2 min",
                    color: G,
                  },
                  {
                    icon: "📧",
                    label: "Email Us",
                    sub: "Reply in 4 hours",
                    color: "#B9F2FF",
                  },
                ].map((a) => (
                  <GCard
                    key={a.label}
                    style={{
                      padding: 20,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e: any) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(212,175,55,0.3)")
                    }
                    onMouseLeave={(e: any) =>
                      (e.currentTarget.style.borderColor = GB)
                    }
                  >
                    <div style={{ fontSize: 32, marginBottom: 10 }}>
                      {a.icon}
                    </div>
                    <p
                      style={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: 14,
                        marginBottom: 4,
                      }}
                    >
                      {a.label}
                    </p>
                    <p
                      style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}
                    >
                      {a.sub}
                    </p>
                  </GCard>
                ))}
              </div>

              {/* FAQs */}
              <GCard style={{ overflow: "hidden", marginBottom: 20 }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${GB}`,
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: 15 }}>
                    Frequently Asked Questions
                  </p>
                </div>
                {[
                  {
                    q: "How are fares calculated?",
                    a: "Fares are based on base rate + distance + time. Surge pricing applies during peak hours.",
                  },
                  {
                    q: "When do I get paid?",
                    a: "Payouts are credited every Monday for the previous week's earnings. Instant withdrawal available for 2% fee.",
                  },
                  {
                    q: "What if a passenger cancels?",
                    a: "You get a cancellation fee if the passenger cancels after you've arrived within 5 minutes of pickup.",
                  },
                  {
                    q: "How do I improve my rating?",
                    a: "Be punctual, keep your car clean, follow the optimal route, and greet passengers politely.",
                  },
                ].map((faq, i, arr) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px 20px",
                      borderBottom:
                        i < arr.length - 1 ? `1px solid ${GB}` : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "rgba(212,175,55,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <HelpCircle size={13} color={G} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            marginBottom: 6,
                          }}
                        >
                          {faq.q}
                        </p>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.45)",
                            fontSize: 13,
                            lineHeight: 1.5,
                          }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </GCard>

              {/* Emergency */}
              <div
                style={{
                  background: "rgba(255,100,100,0.05)",
                  border: "1px solid rgba(255,100,100,0.2)",
                  borderRadius: 18,
                  padding: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div style={{ fontSize: 36 }}>🚨</div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#FF8080",
                      marginBottom: 4,
                    }}
                  >
                    Emergency SOS
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                    In case of an emergency during a ride, tap to alert
                    authorities.
                  </p>
                </div>
                <button
                  style={{
                    padding: "12px 18px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,100,100,0.3)",
                    background: "rgba(255,100,100,0.1)",
                    color: "#FF8080",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  SOS
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`* { box-sizing: border-box; } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      {showChat && <ChatOverlay role="driver" onClose={() => setShowChat(false)} />}
    </div>
  );
}
