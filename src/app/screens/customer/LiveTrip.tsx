import React from "react";
import { AlertTriangle, X, Clock, Navigation } from "lucide-react";
import { MapBackground } from "../../components/MapBackground";

export const LiveTrip = () => {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: "#0d1b2e", paddingTop: 44 }}
    >
      {/* Full map */}
      <MapBackground height="100%" showRoute showDriverPin showDestPin />

      {/* Gradient overlays */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: 200, background: "linear-gradient(to bottom, rgba(8,16,28,0.8) 0%, transparent 100%)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 280, background: "linear-gradient(to top, rgba(8,16,28,0.95) 30%, transparent 100%)" }}
      />

      {/* Top status bar */}
      <div
        className="absolute z-20 left-4 right-4"
        style={{ top: 56 }}
      >
        <div
          style={{
            background: "rgba(10,20,35,0.92)",
            borderRadius: 16,
            padding: "12px 16px",
            border: "1px solid rgba(212,175,55,0.2)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: "#D4AF37", fontSize: 13, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                🟢 Ride in Progress
              </p>
              <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                Rajesh Kumar • KA 05 MN 4291
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} color="#D4AF37" />
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                12 min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live car indicator (simulated on map) */}
      <div
        className="absolute z-15"
        style={{ top: "42%", left: "38%", transform: "translate(-50%, -50%)" }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(212,175,55,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #D4AF37",
          }}
        >
          <span style={{ fontSize: 22 }}>🚗</span>
        </div>
      </div>

      {/* Route progress */}
      <div
        className="absolute z-20"
        style={{
          top: 160,
          left: 16,
          right: 16,
          background: "rgba(10,20,35,0.85)",
          borderRadius: 14,
          padding: "10px 14px",
          border: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Navigation size={14} color="#D4AF37" />
          <span style={{ color: "#fff", fontSize: 13, fontFamily: "Inter, sans-serif", flex: 1 }}>
            Heading to Brigade Road
          </span>
          <span style={{ color: "#D4AF37", fontSize: 13, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
            4.2 km left
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
          <div
            style={{
              width: "52%",
              height: "100%",
              background: "linear-gradient(90deg, #D4AF37, #F0C040)",
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      {/* Bottom panel */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30"
        style={{
          background: "rgba(8,16,28,0.98)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: "20px 16px 28px",
          border: "1px solid rgba(212,175,55,0.1)",
          borderBottom: "none",
        }}
      >
        {/* ETA info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              Estimated Arrival
            </p>
            <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              2:45 PM
            </p>
          </div>
          <div className="text-right">
            <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              Fare
            </p>
            <p style={{ color: "#D4AF37", fontSize: 22, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              ₹129
            </p>
          </div>
        </div>

        {/* Destination */}
        <div
          className="flex items-center gap-3 mb-5 p-3"
          style={{
            background: "rgba(30,58,95,0.3)",
            borderRadius: 12,
            border: "1px solid rgba(212,175,55,0.08)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#E84040",
            }}
          />
          <span style={{ color: "#fff", fontSize: 14, fontFamily: "Inter, sans-serif", flex: 1 }}>
            Brigade Road, Bengaluru
          </span>
          <span style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
            4.2 km
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {/* SOS button */}
          <button
            className="flex-1 flex items-center justify-center gap-2"
            style={{
              height: 50,
              borderRadius: 14,
              background: "rgba(220,50,50,0.2)",
              border: "1.5px solid rgba(220,50,50,0.4)",
              color: "#E84040",
              fontSize: 15,
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            <AlertTriangle size={18} />
            SOS
          </button>

          {/* Cancel */}
          <button
            className="flex items-center justify-center gap-2"
            style={{
              height: 50,
              width: 130,
              borderRadius: 14,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#8fa3b8",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
