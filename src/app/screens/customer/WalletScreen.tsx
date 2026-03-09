import React from "react";
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet, CreditCard } from "lucide-react";
import { BottomNav } from "../../components/BottomNav";

const transactions = [
  { id: 1, type: "debit", desc: "SaaraMini Ride", sub: "Koramangala → Brigade Rd", amount: "₹129", date: "Today 2:30 PM", icon: "🚗" },
  { id: 2, type: "credit", desc: "Money Added", sub: "Via UPI • HDFC Bank", amount: "+₹500", date: "Today 10:00 AM", icon: "💳" },
  { id: 3, type: "credit", desc: "Referral Bonus", sub: "Friend joined SaaradhiGO", amount: "+₹100", date: "Yesterday", icon: "🎁" },
  { id: 4, type: "debit", desc: "SaaraPrime Ride", sub: "HSR → Whitefield", amount: "₹245", date: "Dec 19", icon: "🚙" },
  { id: 5, type: "credit", desc: "Cashback", sub: "Prime membership benefit", amount: "+₹25", date: "Dec 18", icon: "💰" },
  { id: 6, type: "debit", desc: "SaaraBike Ride", sub: "Indiranagar → MG Road", amount: "₹49", date: "Dec 17", icon: "🏍️" },
];

export const WalletScreen = () => {
  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0F1C2E 0%, #1a2d48 100%)",
        paddingTop: 44,
      }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h2
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Wallet
        </h2>
      </div>

      {/* Balance card */}
      <div
        className="mx-4 mb-4"
        style={{
          background: "linear-gradient(135deg, #1a2d48, #0d1f35)",
          borderRadius: 20,
          padding: "20px 20px",
          border: "1px solid rgba(212,175,55,0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -40,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)",
          }}
        />

        <div className="flex items-start justify-between mb-4">
          <div>
            <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>
              Available Balance
            </p>
            <p style={{ color: "#D4AF37", fontSize: 36, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              ₹850
            </p>
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "rgba(212,175,55,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wallet size={22} color="#D4AF37" />
          </div>
        </div>

        {/* Add money */}
        <button
          className="flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #F0C040)",
            borderRadius: 12,
            padding: "10px 20px",
            color: "#0F1C2E",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            border: "none",
          }}
        >
          <Plus size={16} />
          Add Money
        </button>
      </div>

      {/* Quick add amounts */}
      <div className="flex gap-2 px-4 mb-5">
        {["₹100", "₹200", "₹500", "₹1000"].map((amt) => (
          <button
            key={amt}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 10,
              background: "rgba(30,58,95,0.4)",
              border: "1px solid rgba(212,175,55,0.15)",
              color: "#D4AF37",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {amt}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
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
          Transactions
        </p>
        <div className="flex flex-col gap-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: "rgba(10,20,35,0.8)",
                borderRadius: 14,
                border: "1px solid rgba(212,175,55,0.06)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(30,58,95,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {tx.icon}
              </div>
              <div className="flex-1">
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 500, fontFamily: "Inter, sans-serif" }}>
                  {tx.desc}
                </p>
                <p style={{ color: "#3a5a7a", fontSize: 11, fontFamily: "Inter, sans-serif" }}>
                  {tx.sub} • {tx.date}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  style={{
                    color: tx.type === "credit" ? "#22c55e" : "#ff8080",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {tx.type === "credit" ? "+" : "-"}{tx.amount.replace("+", "").replace("-", "")}
                </span>
                {tx.type === "credit" ? (
                  <ArrowDownLeft size={12} color="#22c55e" />
                ) : (
                  <ArrowUpRight size={12} color="#ff8080" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="wallet" />
    </div>
  );
};
