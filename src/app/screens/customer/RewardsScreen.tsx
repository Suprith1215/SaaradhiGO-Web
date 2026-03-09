import React, { useState } from "react";
import { ArrowLeft, Gift, Star, Zap, Trophy, ChevronRight } from "lucide-react";
import { BottomNav } from "../../components/BottomNav";

const G = "#D4AF37";

export const RewardsScreen = () => {
  const [coins] = useState(2450);
  const [level] = useState("Gold");

  const tiers = [
    { name: "Silver", min: 0, max: 1000, color: "#A8A8A8", icon: "🥈" },
    { name: "Gold", min: 1000, max: 3000, color: G, icon: "🥇" },
    { name: "Platinum", min: 3000, max: 6000, color: "#B9F2FF", icon: "💎" },
    { name: "Diamond", min: 6000, max: 10000, color: "#9D84FF", icon: "💠" },
  ];

  const currentTier = tiers.find((t) => t.name === level)!;
  const progress = ((coins - currentTier.min) / (currentTier.max - currentTier.min)) * 100;
  const remaining = currentTier.max - coins;

  const rewards = [
    { title: "Free Ride Coupon", coins: 500, icon: "🚗", value: "₹100 off", available: true },
    { title: "Priority Booking", coins: 800, icon: "⚡", value: "Skip queue", available: true },
    { title: "Airport Transfer Discount", coins: 1200, icon: "✈️", value: "20% off", available: false },
    { title: "Premium Upgrade", coins: 2000, icon: "👑", value: "Free upgrade", available: false },
  ];

  const activities = [
    { action: "Completed 3 rides", coins: "+150", time: "Today", type: "earn" },
    { action: "Redeemed coupon", coins: "-500", time: "Yesterday", type: "spend" },
    { action: "Referral bonus", coins: "+300", time: "Mon", type: "earn" },
    { action: "Weekend bonus", coins: "+200", time: "Sat", type: "earn" },
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
            SaaraRewards
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>Earn & redeem coins</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24" style={{ scrollbarWidth: "none" }}>
        {/* Coins Card */}
        <div
          className="relative rounded-3xl p-5 mb-4 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a3a20, #0d2210)",
            border: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute"
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,175,55,0.08), transparent)",
              right: -40,
              top: -40,
            }}
          />
          <div className="flex items-center justify-between mb-4">
            <div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Your Coin Balance</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-5xl font-black" style={{ color: G }}>
                  {coins.toLocaleString()}
                </span>
                <span style={{ color: "rgba(212,175,55,0.6)", fontSize: 14, marginBottom: 6 }}>coins</span>
              </div>
            </div>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.25)" }}
            >
              <span style={{ fontSize: 32 }}>{currentTier.icon}</span>
            </div>
          </div>

          {/* Tier badge */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="px-3 py-1 rounded-full"
              style={{ background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)" }}
            >
              <span style={{ color: G, fontSize: 12, fontWeight: 700 }}>
                {level} Member
              </span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
              {remaining} coins to Platinum
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 6, background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #D4AF37, #F0C040)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>
              {currentTier.name} ({currentTier.min})
            </span>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>
              Platinum ({currentTier.max})
            </span>
          </div>
        </div>

        {/* Tier Progress */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-white font-semibold mb-3" style={{ fontSize: 14 }}>
            Membership Tiers
          </p>
          <div className="flex items-center gap-2">
            {tiers.map((tier, i) => (
              <div key={tier.name} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                    style={{
                      background: tier.name === level ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
                      border: `2px solid ${tier.name === level ? G : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{tier.icon}</span>
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      color: tier.name === level ? G : "rgba(255,255,255,0.4)",
                      fontWeight: tier.name === level ? 700 : 400,
                    }}
                  >
                    {tier.name}
                  </span>
                </div>
                {i < tiers.length - 1 && (
                  <div
                    className="h-0.5 flex-1 mx-1"
                    style={{
                      background:
                        tiers.findIndex((t) => t.name === level) > i
                          ? G
                          : "rgba(255,255,255,0.08)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rewards to Redeem */}
        <p className="text-white font-semibold mb-3" style={{ fontSize: 14 }}>
          Redeem Rewards
        </p>
        <div className="space-y-3 mb-4">
          {rewards.map((r) => (
            <div
              key={r.title}
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${r.available ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: r.available ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.04)",
                }}
              >
                <span style={{ fontSize: 22 }}>{r.icon}</span>
              </div>
              <div className="flex-1">
                <p
                  className="font-semibold"
                  style={{ color: r.available ? "white" : "rgba(255,255,255,0.4)", fontSize: 14 }}
                >
                  {r.title}
                </p>
                <p style={{ color: r.available ? G : "rgba(255,255,255,0.3)", fontSize: 12 }}>
                  {r.value}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{
                    background: r.available ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${r.available ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <span style={{ fontSize: 11 }}>🪙</span>
                  <span
                    style={{
                      color: r.available ? G : "rgba(255,255,255,0.3)",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {r.coins}
                  </span>
                </div>
                <button
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{
                    background: r.available
                      ? "linear-gradient(135deg, #D4AF37, #A8882A)"
                      : "rgba(255,255,255,0.06)",
                    color: r.available ? "#0F1C2E" : "rgba(255,255,255,0.3)",
                    cursor: r.available ? "pointer" : "not-allowed",
                  }}
                  disabled={!r.available}
                >
                  {r.available ? "Redeem" : "Locked"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <p className="text-white font-semibold mb-3" style={{ fontSize: 14 }}>
          Recent Activity
        </p>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {activities.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{
                borderBottom:
                  i < activities.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    a.type === "earn" ? "rgba(0,200,100,0.1)" : "rgba(255,100,100,0.1)",
                }}
              >
                {a.type === "earn" ? (
                  <Zap size={16} color="#00C864" />
                ) : (
                  <Gift size={16} color="#FF6464" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-white" style={{ fontSize: 13 }}>
                  {a.action}
                </p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{a.time}</p>
              </div>
              <span
                className="font-bold"
                style={{
                  fontSize: 14,
                  color: a.type === "earn" ? "#00C864" : "#FF6464",
                }}
              >
                {a.coins}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
};
