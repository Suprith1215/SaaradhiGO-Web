import React, { useState } from "react";
import { ArrowLeft, Tag, ChevronRight, Info } from "lucide-react";

export const FareBreakdown = () => {
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);

  const fareItems = [
    { label: "Base Fare", amount: 49, info: "First 2 km" },
    { label: "Distance Charge", amount: 68, info: "6.8 km × ₹10/km" },
    { label: "Platform Fee", amount: 5, info: "Service charges" },
    { label: "GST (5%)", amount: 6, info: "Government tax" },
    { label: "Surge Charge", amount: 12, info: "Peak hour 1.2x", highlight: true },
  ];

  const subtotal = fareItems.reduce((s, i) => s + i.amount, 0);
  const discount = applied ? 30 : 0;
  const total = subtotal - discount;

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
          Fare Breakdown
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Ride summary */}
        <div
          className="flex items-center gap-3 mb-4 p-3"
          style={{
            background: "rgba(212,175,55,0.08)",
            borderRadius: 14,
            border: "1px solid rgba(212,175,55,0.18)",
          }}
        >
          <span style={{ fontSize: 28 }}>🚗</span>
          <div>
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
              SaaraMini
            </p>
            <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              Koramangala → Brigade Road • 8.8 km
            </p>
          </div>
          <span style={{ marginLeft: "auto", color: "#D4AF37", fontSize: 14, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            ₹{total}
          </span>
        </div>

        {/* Fare items */}
        <div
          style={{
            background: "rgba(10,20,35,0.8)",
            borderRadius: 16,
            border: "1px solid rgba(212,175,55,0.1)",
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {fareItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderBottom: i < fareItems.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                background: item.highlight ? "rgba(255,100,100,0.05)" : "transparent",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  style={{
                    color: item.highlight ? "#ff8080" : "#8fa3b8",
                    fontSize: 14,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {item.label}
                </span>
                <Info size={12} color="#3a5a7a" />
              </div>
              <span
                style={{
                  color: item.highlight ? "#ff8080" : "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                +₹{item.amount}
              </span>
            </div>
          ))}

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(212,175,55,0.15)", margin: "0 16px" }} />

          {/* Subtotal */}
          <div className="flex items-center justify-between px-4 py-3">
            <span style={{ color: "#8fa3b8", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
              Subtotal
            </span>
            <span style={{ color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
              ₹{subtotal}
            </span>
          </div>

          {/* Discount */}
          {applied && (
            <div className="flex items-center justify-between px-4 py-2">
              <span style={{ color: "#60d080", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
                Coupon (SAARA30)
              </span>
              <span style={{ color: "#60d080", fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                -₹{discount}
              </span>
            </div>
          )}

          {/* Total */}
          <div
            className="flex items-center justify-between px-4 py-4"
            style={{ background: "rgba(212,175,55,0.06)" }}
          >
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              Total Amount
            </span>
            <span style={{ color: "#D4AF37", fontSize: 20, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              ₹{total}
            </span>
          </div>
        </div>

        {/* Coupon input */}
        <div
          className="flex gap-2 mb-4"
          style={{
            background: "rgba(10,20,35,0.8)",
            borderRadius: 14,
            border: "1px solid rgba(212,175,55,0.15)",
            padding: "4px 4px 4px 14px",
            alignItems: "center",
          }}
        >
          <Tag size={16} color="#D4AF37" />
          <input
            type="text"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
              padding: "12px 8px",
            }}
          />
          <button
            onClick={() => {
              if (coupon === "SAARA30") setApplied(true);
            }}
            style={{
              background: "linear-gradient(135deg, #D4AF37, #F0C040)",
              borderRadius: 10,
              padding: "10px 16px",
              color: "#0F1C2E",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              border: "none",
            }}
          >
            Apply
          </button>
        </div>

        {/* Suggestions */}
        <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif", marginBottom: 6 }}>
          Try: <span style={{ color: "#D4AF37" }}>SAARA30</span>
        </p>
      </div>

      {/* Bottom CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{ background: "rgba(8,16,28,0.98)", borderTop: "1px solid rgba(212,175,55,0.08)" }}
      >
        <button
          className="w-full flex items-center justify-between px-5"
          style={{
            height: 54,
            borderRadius: 16,
            background: "linear-gradient(135deg, #D4AF37, #F0C040)",
            border: "none",
          }}
        >
          <span style={{ color: "#0F1C2E", fontSize: 15, fontFamily: "Inter, sans-serif" }}>
            Continue to Pay
          </span>
          <span style={{ color: "#0F1C2E", fontSize: 18, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
            ₹{total} <ChevronRight size={18} style={{ display: "inline" }} />
          </span>
        </button>
      </div>
    </div>
  );
};
