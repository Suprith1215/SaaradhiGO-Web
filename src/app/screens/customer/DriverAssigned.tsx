import React from "react";
import { Phone, MessageCircle, Star, Shield, X, ChevronUp } from "lucide-react";
import { MapBackground } from "../../components/MapBackground";

const DRIVER_PHOTO = "https://images.unsplash.com/photo-1604343670513-af01df1260a1?w=120&h=120&fit=crop";

export const DriverAssigned = () => {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: "#0d1b2e", paddingTop: 44 }}
    >
      {/* Map */}
      <div style={{ height: 380 }}>
        <MapBackground height={380} showRoute showDriverPin showDestPin />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          height: 480,
          background: "linear-gradient(to top, #0a1220 45%, transparent 100%)",
        }}
      />

      {/* OTP Badge */}
      <div
        className="absolute z-20"
        style={{
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(212,175,55,0.15)",
          borderRadius: 20,
          padding: "6px 20px",
          border: "1px solid rgba(212,175,55,0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        <span style={{ color: "#D4AF37", fontSize: 13, fontFamily: "Inter, sans-serif", letterSpacing: "0.1em" }}>
          Share OTP to driver →{" "}
        </span>
        <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "Inter, sans-serif", letterSpacing: "0.2em" }}>
          4729
        </span>
      </div>

      {/* Status bar */}
      <div
        className="absolute z-20"
        style={{
          top: 100,
          left: 16,
          right: 16,
          background: "rgba(10,20,35,0.9)",
          borderRadius: 16,
          padding: "12px 16px",
          border: "1px solid rgba(212,175,55,0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p style={{ color: "#D4AF37", fontSize: 13, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
              🚗 Driver is on the way
            </p>
            <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              Arriving in <span style={{ color: "#fff", fontWeight: 600 }}>5 minutes</span>
            </p>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(212,175,55,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 20 }}>🏍️</span>
          </div>
        </div>
      </div>

      {/* Driver panel */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30"
        style={{
          background: "rgba(8,16,28,0.98)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: "20px 16px 24px",
          border: "1px solid rgba(212,175,55,0.12)",
          borderBottom: "none",
        }}
      >
        {/* Drag handle */}
        <div
          className="mx-auto mb-4"
          style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)" }}
        />

        {/* Driver info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={DRIVER_PHOTO}
              alt="Driver"
              style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#22c55e",
                border: "2px solid #0a1220",
              }}
            />
          </div>

          <div className="flex-1">
            <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
              Rajesh Kumar
            </p>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} fill={s <= 4 ? "#D4AF37" : "transparent"} color="#D4AF37" />
              ))}
              <span style={{ color: "#8fa3b8", fontSize: 12, fontFamily: "Inter, sans-serif", marginLeft: 4 }}>
                4.8 (312 rides)
              </span>
            </div>
            <span
              style={{
                background: "rgba(212,175,55,0.1)",
                borderRadius: 6,
                padding: "3px 8px",
                color: "#D4AF37",
                fontSize: 12,
                fontFamily: "Inter, sans-serif",
                border: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              KA 05 MN 4291
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Shield size={16} color="#D4AF37" />
            <span style={{ color: "#D4AF37", fontSize: 10, fontFamily: "Inter, sans-serif" }}>
              Verified
            </span>
          </div>
        </div>

        {/* Vehicle info */}
        <div
          className="flex items-center gap-3 mb-4 p-3"
          style={{
            background: "rgba(30,58,95,0.3)",
            borderRadius: 12,
            border: "1px solid rgba(212,175,55,0.08)",
          }}
        >
          <span style={{ fontSize: 24 }}>🚗</span>
          <div>
            <p style={{ color: "#fff", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
              Maruti Swift Dzire
            </p>
            <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              White • AC • Music system
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2"
            style={{
              height: 50,
              borderRadius: 14,
              background: "rgba(30,58,95,0.5)",
              border: "1px solid rgba(212,175,55,0.2)",
              color: "#fff",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <Phone size={18} color="#D4AF37" />
            Call
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2"
            style={{
              height: 50,
              borderRadius: 14,
              background: "rgba(30,58,95,0.5)",
              border: "1px solid rgba(212,175,55,0.2)",
              color: "#fff",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <MessageCircle size={18} color="#D4AF37" />
            Chat
          </button>
          <button
            className="flex items-center justify-center"
            style={{
              height: 50,
              width: 50,
              borderRadius: 14,
              background: "rgba(220,50,50,0.15)",
              border: "1px solid rgba(220,50,50,0.3)",
            }}
          >
            <X size={20} color="#E84040" />
          </button>
        </div>
      </div>
    </div>
  );
};
