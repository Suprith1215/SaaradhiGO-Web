import React from "react";
import { CheckCircle, Download, CreditCard, ArrowLeft } from "lucide-react";

export const Payment = () => {
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
          Trip Completed
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {/* Success state */}
        <div className="flex flex-col items-center mb-6">
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(34,197,94,0.15)",
              border: "2px solid rgba(34,197,94,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <CheckCircle size={40} color="#22c55e" />
          </div>
          <h3
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              marginBottom: 6,
            }}
          >
            Trip Completed! 🎉
          </h3>
          <p style={{ color: "#5a7a9a", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
            You reached Brigade Road safely
          </p>
        </div>

        {/* Fare card */}
        <div
          className="mb-4"
          style={{
            background: "rgba(10,20,35,0.9)",
            borderRadius: 18,
            border: "1px solid rgba(212,175,55,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            className="px-5 py-4"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))",
              borderBottom: "1px solid rgba(212,175,55,0.12)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                  Final Fare
                </p>
                <p style={{ color: "#D4AF37", fontSize: 32, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                  ₹129
                </p>
              </div>
              <div className="text-right">
                <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                  Trip Duration
                </p>
                <p style={{ color: "#fff", fontSize: 20, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                  24 min
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="px-5 py-3">
            {[
              { label: "Distance", val: "8.8 km" },
              { label: "Base fare", val: "₹49" },
              { label: "Distance charge", val: "₹68" },
              { label: "Platform fee", val: "₹5" },
              { label: "GST", val: "₹7" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <span style={{ color: "#5a7a9a", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
                  {item.label}
                </span>
                <span style={{ color: "#8fa3b8", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment method used */}
        <div
          className="flex items-center gap-3 mb-4 p-4"
          style={{
            background: "rgba(10,20,35,0.85)",
            borderRadius: 16,
            border: "1px solid rgba(212,175,55,0.1)",
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
            }}
          >
            <CreditCard size={22} color="#D4AF37" />
          </div>
          <div>
            <p style={{ color: "#fff", fontSize: 14, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
              Paid via SaaraWallet
            </p>
            <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              Balance remaining: ₹721
            </p>
          </div>
          <div
            className="ml-auto flex items-center gap-1"
            style={{
              background: "rgba(34,197,94,0.1)",
              borderRadius: 8,
              padding: "4px 10px",
            }}
          >
            <CheckCircle size={12} color="#22c55e" />
            <span style={{ color: "#22c55e", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              Paid
            </span>
          </div>
        </div>

        {/* Download invoice */}
        <button
          className="w-full flex items-center justify-center gap-2"
          style={{
            height: 50,
            borderRadius: 14,
            background: "rgba(30,58,95,0.4)",
            border: "1px solid rgba(212,175,55,0.2)",
            color: "#D4AF37",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <Download size={18} />
          Download Invoice
        </button>
      </div>

      {/* Pay/Done button */}
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
          Rate Your Trip
        </button>
      </div>
    </div>
  );
};
