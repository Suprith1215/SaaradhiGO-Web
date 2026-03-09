import React, { useState } from "react";
import { ArrowLeft, Search, MapPin, Home, Briefcase, Clock, X } from "lucide-react";
import { MapBackground } from "../../components/MapBackground";

export const LocationSearch = () => {
  const [query, setQuery] = useState("");

  const recents = [
    { icon: "🏢", name: "Brigade Road, Bengaluru", sub: "Commercial St, 2.3 km", time: "2h ago" },
    { icon: "🏥", name: "Manipal Hospital", sub: "HAL Airport Rd, 5.1 km", time: "Yesterday" },
    { icon: "🛒", name: "Phoenix Marketcity", sub: "Whitefield Rd, 8.4 km", time: "2 days ago" },
    { icon: "🎓", name: "IIM Bangalore", sub: "Bannerghatta Rd, 6.7 km", time: "3 days ago" },
  ];

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0F1C2E 0%, #1a2d48 100%)",
        paddingTop: 44,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 mb-4">
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "rgba(30,58,95,0.5)",
            border: "1px solid rgba(212,175,55,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft size={20} color="#D4AF37" />
        </button>
        <h2
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Set Location
        </h2>
      </div>

      {/* Search inputs */}
      <div className="px-4 mb-4 flex flex-col gap-2">
        {/* Pickup */}
        <div
          className="flex items-center gap-3"
          style={{
            background: "rgba(30,58,95,0.4)",
            borderRadius: 14,
            padding: "12px 14px",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#D4AF37",
              boxShadow: "0 0 0 3px rgba(212,175,55,0.25)",
              flexShrink: 0,
            }}
          />
          <span style={{ color: "#fff", fontSize: 14, fontFamily: "Inter, sans-serif", flex: 1 }}>
            Koramangala, Bengaluru
          </span>
          <MapPin size={16} color="#D4AF37" />
        </div>

        {/* Drop */}
        <div
          className="flex items-center gap-3"
          style={{
            background: "rgba(30,58,95,0.4)",
            borderRadius: 14,
            padding: "12px 14px",
            border: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          <Search size={16} color="#5a7a9a" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Where are you going?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X size={16} color="#5a7a9a" />
            </button>
          )}
        </div>
      </div>

      {/* Map Preview */}
      <div className="mx-4 mb-4" style={{ borderRadius: 16, overflow: "hidden", height: 140 }}>
        <MapBackground height={140} showDriverPin />
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ borderRadius: 16 }}
        >
          <div
            style={{
              background: "rgba(212,175,55,0.9)",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
              color: "#0F1C2E",
              fontWeight: 600,
            }}
          >
            📍 Tap to pin location
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="flex gap-3 px-4 mb-4">
        <button
          className="flex items-center gap-2"
          style={{
            background: "rgba(30,58,95,0.4)",
            borderRadius: 12,
            padding: "10px 16px",
            border: "1px solid rgba(212,175,55,0.15)",
          }}
        >
          <Home size={16} color="#D4AF37" />
          <span style={{ color: "#fff", fontSize: 13, fontFamily: "Inter, sans-serif" }}>Home</span>
        </button>
        <button
          className="flex items-center gap-2"
          style={{
            background: "rgba(30,58,95,0.4)",
            borderRadius: 12,
            padding: "10px 16px",
            border: "1px solid rgba(212,175,55,0.15)",
          }}
        >
          <Briefcase size={16} color="#D4AF37" />
          <span style={{ color: "#fff", fontSize: 13, fontFamily: "Inter, sans-serif" }}>Work</span>
        </button>
      </div>

      {/* Recent locations */}
      <div className="flex-1 px-4 overflow-y-auto">
        <p
          style={{
            color: "#5a7a9a",
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10,
          }}
        >
          Recent Locations
        </p>
        <div className="flex flex-col gap-2">
          {recents.map((r, i) => (
            <button
              key={i}
              className="flex items-center gap-3 w-full text-left"
              style={{
                background: "rgba(30,58,95,0.3)",
                borderRadius: 14,
                padding: "14px",
                border: "1px solid rgba(212,175,55,0.08)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(212,175,55,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 20,
                }}
              >
                {r.icon}
              </div>
              <div className="flex-1">
                <p style={{ color: "#fff", fontSize: 14, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                  {r.name}
                </p>
                <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                  {r.sub}
                </p>
              </div>
              <span style={{ color: "#3a5a7a", fontSize: 11, fontFamily: "Inter, sans-serif" }}>
                {r.time}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
