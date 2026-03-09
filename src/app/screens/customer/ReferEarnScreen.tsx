import React, { useState } from "react";
import { ArrowLeft, Copy, Share2, Check, Users, Gift, ChevronRight } from "lucide-react";
import { BottomNav } from "../../components/BottomNav";

const G = "#D4AF37";

export const ReferEarnScreen = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = "ARJUN500";

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referrals = [
    { name: "Priya Sharma", status: "Joined", earned: "₹500", date: "3 days ago", avatar: "P" },
    { name: "Rahul Verma", status: "1st Ride Done", earned: "₹500", date: "1 week ago", avatar: "R" },
    { name: "Sneha Nair", status: "Pending", earned: "₹0", date: "2 weeks ago", avatar: "S" },
  ];

  const steps = [
    { step: "1", title: "Share Code", desc: "Share your unique referral code with friends", icon: "📤" },
    { step: "2", title: "Friend Joins", desc: "Friend downloads app and registers", icon: "👤" },
    { step: "3", title: "First Ride", desc: "Friend completes their first ride", icon: "🚗" },
    { step: "4", title: "Both Earn", desc: "You both get ₹500 in wallet", icon: "💰" },
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
      <div className="px-4 pt-5 pb-3 flex items-center gap-3">
        <button
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ArrowLeft size={20} color="white" />
        </button>
        <div>
          <h2 className="text-white font-bold" style={{ fontSize: 20 }}>
            Refer & Earn
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>Earn ₹500 per referral</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24" style={{ scrollbarWidth: "none" }}>
        {/* Hero Banner */}
        <div
          className="relative rounded-3xl p-5 mb-4 overflow-hidden text-center"
          style={{
            background: "linear-gradient(135deg, #1a2d0a, #0d1f06)",
            border: "1px solid rgba(212,175,55,0.3)",
          }}
        >
          {/* Decorative elements */}
          <div
            className="absolute"
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,175,55,0.06), transparent)",
              left: -60,
              top: -60,
            }}
          />
          <div
            className="absolute"
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,175,55,0.06), transparent)",
              right: -40,
              bottom: -40,
            }}
          />

          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: "rgba(212,175,55,0.1)", border: "2px solid rgba(212,175,55,0.3)" }}
            >
              <span style={{ fontSize: 38 }}>🎁</span>
            </div>
            <h3 className="text-white font-black mb-1" style={{ fontSize: 26 }}>
              Earn <span style={{ color: G }}>₹500</span>
            </h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              For every friend who completes their first ride
            </p>
            <div
              className="mt-3 px-4 py-1.5 rounded-full inline-block"
              style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}
            >
              <span style={{ color: G, fontSize: 12, fontWeight: 600 }}>
                Your friend also gets ₹500!
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Total Referred", value: "3", icon: "👥" },
            { label: "Total Earned", value: "₹1000", icon: "💰" },
            { label: "Pending", value: "₹500", icon: "⏳" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-3 text-center"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <p className="font-black mt-1" style={{ color: G, fontSize: 16 }}>
                {s.value}
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Referral Code */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{
            background: "rgba(212,175,55,0.06)",
            border: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 8 }}>
            Your Referral Code
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="font-black tracking-widest"
                  style={{ color: G, fontSize: 28, letterSpacing: "0.15em" }}
                >
                  {referralCode}
                </span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
              style={{
                background: copied
                  ? "rgba(0,200,100,0.15)"
                  : "linear-gradient(135deg, #D4AF37, #A8882A)",
                color: copied ? "#00C864" : "#0F1C2E",
                border: copied ? "1px solid rgba(0,200,100,0.3)" : "none",
                fontSize: 13,
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Share Button */}
        <button
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl mb-5 font-bold"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #A8882A)",
            color: "#0F1C2E",
            fontSize: 16,
            boxShadow: "0 6px 24px rgba(212,175,55,0.35)",
          }}
        >
          <Share2 size={20} />
          Share Referral Link
        </button>

        {/* How it works */}
        <p className="text-white font-semibold mb-3" style={{ fontSize: 14 }}>
          How It Works
        </p>
        <div className="space-y-2 mb-4">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}
              >
                <span style={{ fontSize: 20 }}>{s.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold" style={{ fontSize: 13 }}>
                  {s.title}
                </p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(212,175,55,0.1)" }}
                >
                  <ChevronRight size={12} color={G} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Referral History */}
        <p className="text-white font-semibold mb-3" style={{ fontSize: 14 }}>
          Referrals ({referrals.length})
        </p>
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {referrals.map((r, i) => (
            <div
              key={r.name}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{
                borderBottom:
                  i < referrals.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                style={{ background: "rgba(212,175,55,0.15)", color: G, fontSize: 16 }}
              >
                {r.avatar}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium" style={{ fontSize: 14 }}>
                  {r.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background:
                        r.status === "1st Ride Done"
                          ? "rgba(0,200,100,0.1)"
                          : r.status === "Pending"
                          ? "rgba(255,170,0,0.1)"
                          : "rgba(212,175,55,0.1)",
                      color:
                        r.status === "1st Ride Done"
                          ? "#00C864"
                          : r.status === "Pending"
                          ? "#FFAA00"
                          : G,
                    }}
                  >
                    {r.status}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{r.date}</span>
                </div>
              </div>
              <div className="text-right">
                <p
                  className="font-bold"
                  style={{ color: r.earned === "₹0" ? "rgba(255,255,255,0.3)" : G, fontSize: 14 }}
                >
                  {r.earned}
                </p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>earned</p>
              </div>
            </div>
          ))}
        </div>

        {/* T&C */}
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textAlign: "center" }}>
          Terms apply. Reward credited within 24hrs of qualifying ride.
        </p>
      </div>

      <BottomNav active="profile" />
    </div>
  );
};
