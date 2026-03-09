import React from "react";
import { MapPin, Search, Bell, Wallet, ChevronRight, Navigation, Star } from "lucide-react";
import { MapBackground } from "../../components/MapBackground";
import { BottomNav } from "../../components/BottomNav";
import { LogoInline } from "../../components/Logo";

export const HomeScreen = () => {
  const services = [
    { icon: "🏍️", label: "Bike", price: "₹49" },
    { icon: "🛺", label: "Auto", price: "₹89" },
    { icon: "🚗", label: "Mini", price: "₹129" },
    { icon: "🚙", label: "Prime", price: "₹199" },
  ];

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: "#0d1b2e", paddingTop: 44 }}
    >
      {/* Map as background */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 500 }}>
        <MapBackground height={500} showDriverPin />
      </div>

      {/* Overlay gradient at bottom of map */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          height: 350,
          background: "linear-gradient(to top, #0d1b2e 40%, transparent 100%)",
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 mb-4">
        <div className="flex items-center gap-2">
          <LogoInline height={28} />
        </div>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "rgba(10,20,35,0.85)",
              border: "1px solid rgba(212,175,55,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={18} color="#D4AF37" />
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "rgba(10,20,35,0.85)",
              border: "1px solid rgba(212,175,55,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 18 }}>👤</span>
          </div>
        </div>
      </div>

      {/* Search/Location bar */}
      <div className="relative z-10 px-4 mb-3">
        <div
          style={{
            background: "rgba(10,20,35,0.92)",
            borderRadius: 16,
            border: "1px solid rgba(212,175,55,0.2)",
            padding: "12px 14px",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#D4AF37",
                boxShadow: "0 0 0 3px rgba(212,175,55,0.25)",
              }}
            />
            <span style={{ color: "#fff", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
              Koramangala, Bengaluru
            </span>
            <Navigation size={14} color="#D4AF37" style={{ marginLeft: "auto" }} />
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />
          <div className="flex items-center gap-3">
            <Search size={16} color="#5a7a9a" />
            <span style={{ color: "#5a7a9a", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
              Where are you going?
            </span>
          </div>
        </div>
      </div>

      {/* Driver icons on map (fake) */}
      <div className="absolute z-5" style={{ top: 140, left: 80 }}>
        <span style={{ fontSize: 22 }}>🏍️</span>
      </div>
      <div className="absolute z-5" style={{ top: 160, left: 220 }}>
        <span style={{ fontSize: 22 }}>🚗</span>
      </div>
      <div className="absolute z-5" style={{ top: 200, left: 150 }}>
        <span style={{ fontSize: 22 }}>🛺</span>
      </div>

      {/* Bottom panel */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{
          background: "rgba(8,16,28,0.97)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: "20px 16px 0",
          border: "1px solid rgba(212,175,55,0.1)",
          borderBottom: "none",
        }}
      >
        {/* Greeting */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              Good Morning
            </p>
            <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
              Arjun Kumar 👋
            </p>
          </div>
          {/* Wallet */}
          <div
            className="flex items-center gap-2"
            style={{
              background: "rgba(212,175,55,0.12)",
              borderRadius: 12,
              padding: "8px 12px",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <Wallet size={16} color="#D4AF37" />
            <span style={{ color: "#D4AF37", fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
              ₹850
            </span>
          </div>
        </div>

        {/* Service cards */}
        <div className="flex gap-3 mb-4">
          {services.map((s) => (
            <button
              key={s.label}
              className="flex-1 flex flex-col items-center"
              style={{
                background: "rgba(30,58,95,0.4)",
                borderRadius: 14,
                padding: "12px 4px",
                border: "1px solid rgba(212,175,55,0.15)",
              }}
            >
              <span style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</span>
              <span style={{ color: "#fff", fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                {s.label}
              </span>
              <span style={{ color: "#D4AF37", fontSize: 11, fontFamily: "Inter, sans-serif" }}>
                {s.price}
              </span>
            </button>
          ))}
        </div>

        {/* Book Ride CTA */}
        <button
          className="w-full flex items-center justify-center gap-2 mb-4"
          style={{
            height: 52,
            borderRadius: 16,
            background: "linear-gradient(135deg, #D4AF37, #F0C040)",
            color: "#0F1C2E",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            border: "none",
          }}
        >
          <span>Book a Ride</span>
          <ChevronRight size={20} />
        </button>

        {/* Promotions banner */}
        <div
          className="flex items-center gap-3 mb-3"
          style={{
            background: "rgba(212,175,55,0.08)",
            borderRadius: 12,
            padding: "10px 12px",
            border: "1px solid rgba(212,175,55,0.15)",
          }}
        >
          <span style={{ fontSize: 18 }}>🎁</span>
          <div className="flex-1">
            <p style={{ color: "#D4AF37", fontSize: 12, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
              First ride FREE!
            </p>
            <p style={{ color: "#5a7a9a", fontSize: 11, fontFamily: "Inter, sans-serif" }}>
              Use code SAARA10 • Valid till midnight
            </p>
          </div>
          <ChevronRight size={16} color="#D4AF37" />
        </div>

        <BottomNav active="home" />
      </div>
    </div>
  );
};
