import React, { useState } from "react";
import { ArrowLeft, ChevronDown, Clock, MapPin, CreditCard } from "lucide-react";

export const ConfirmRide = () => {
  const [payment, setPayment] = useState("wallet");

  const methods = [
    { id: "wallet", icon: "💰", label: "SaaraWallet", balance: "₹850" },
    { id: "upi", icon: "📱", label: "UPI", balance: null },
    { id: "card", icon: "💳", label: "Debit/Credit Card", balance: null },
    { id: "cash", icon: "💵", label: "Cash", balance: null },
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
          Confirm Ride
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {/* Route card */}
        <div
          className="mb-4"
          style={{
            background: "rgba(10,20,35,0.85)",
            borderRadius: 18,
            padding: 16,
            border: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          <div className="flex gap-3">
            {/* Timeline dots */}
            <div className="flex flex-col items-center" style={{ paddingTop: 4 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#D4AF37",
                  boxShadow: "0 0 0 3px rgba(212,175,55,0.25)",
                }}
              />
              <div style={{ flex: 1, width: 2, background: "rgba(212,175,55,0.25)", margin: "4px 0" }} />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#E84040",
                }}
              />
            </div>

            <div className="flex-1">
              <div className="mb-4">
                <p style={{ color: "#5a7a9a", fontSize: 11, fontFamily: "Inter, sans-serif", marginBottom: 2 }}>
                  PICKUP
                </p>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, fontFamily: "Inter, sans-serif" }}>
                  Koramangala 5th Block
                </p>
                <p style={{ color: "#3a5a7a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                  Bengaluru, Karnataka 560095
                </p>
              </div>
              <div>
                <p style={{ color: "#5a7a9a", fontSize: 11, fontFamily: "Inter, sans-serif", marginBottom: 2 }}>
                  DROP
                </p>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, fontFamily: "Inter, sans-serif" }}>
                  Brigade Road
                </p>
                <p style={{ color: "#3a5a7a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                  Bengaluru, Karnataka 560001
                </p>
              </div>
            </div>
          </div>

          {/* ETA & distance */}
          <div
            className="flex gap-3 mt-4"
            style={{
              background: "rgba(212,175,55,0.06)",
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            <div className="flex items-center gap-2">
              <MapPin size={14} color="#D4AF37" />
              <span style={{ color: "#8fa3b8", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
                8.8 km
              </span>
            </div>
            <div
              style={{ width: 1, background: "rgba(255,255,255,0.1)" }}
            />
            <div className="flex items-center gap-2">
              <Clock size={14} color="#D4AF37" />
              <span style={{ color: "#8fa3b8", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
                ~22 min
              </span>
            </div>
            <div
              style={{ width: 1, background: "rgba(255,255,255,0.1)" }}
            />
            <span style={{ color: "#D4AF37", fontSize: 14, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              ₹129
            </span>
          </div>
        </div>

        {/* Vehicle info */}
        <div
          className="flex items-center gap-3 mb-4 p-4"
          style={{
            background: "rgba(10,20,35,0.85)",
            borderRadius: 16,
            border: "1px solid rgba(212,175,55,0.1)",
          }}
        >
          <span style={{ fontSize: 36 }}>🚗</span>
          <div>
            <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
              SaaraMini
            </p>
            <p style={{ color: "#5a7a9a", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
              4 seats • AC • Compact
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span style={{ color: "#FFD700", fontSize: 16 }}>★</span>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
              Arrives in 5 min
            </span>
          </div>
        </div>

        {/* Payment method */}
        <div
          style={{
            background: "rgba(10,20,35,0.85)",
            borderRadius: 16,
            border: "1px solid rgba(212,175,55,0.1)",
            overflow: "hidden",
          }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ color: "#8fa3b8", fontSize: 13, fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Payment Method
            </span>
          </div>
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setPayment(m.id)}
              className="flex items-center gap-3 w-full px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: payment === m.id ? "none" : "2px solid #3a5a7a",
                  background: payment === m.id ? "#D4AF37" : "transparent",
                  boxShadow: payment === m.id ? "0 0 0 3px rgba(212,175,55,0.25)" : "none",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <span style={{ color: "#fff", fontSize: 14, fontFamily: "Inter, sans-serif", flex: 1 }}>
                {m.label}
              </span>
              {m.balance && (
                <span style={{ color: "#D4AF37", fontSize: 13, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  {m.balance}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{ background: "rgba(8,16,28,0.98)", borderTop: "1px solid rgba(212,175,55,0.08)" }}
      >
        <button
          className="w-full"
          style={{
            height: 54,
            borderRadius: 16,
            background: "linear-gradient(135deg, #D4AF37, #F0C040)",
            color: "#0F1C2E",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            border: "none",
          }}
        >
          Confirm & Book Ride
        </button>
      </div>
    </div>
  );
};
