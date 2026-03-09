import React from "react";
import { Download, Star, ArrowLeft } from "lucide-react";
import { BottomNav } from "../../components/BottomNav";

const rides = [
  {
    id: "R001",
    date: "Today, 2:30 PM",
    from: "Koramangala",
    to: "Brigade Road",
    fare: "₹129",
    status: "completed",
    type: "SaaraMini",
    icon: "🚗",
    distance: "8.8 km",
    rating: 5,
  },
  {
    id: "R002",
    date: "Yesterday, 9:15 AM",
    from: "HSR Layout",
    to: "Whitefield",
    fare: "₹245",
    status: "completed",
    type: "SaaraPrime",
    icon: "🚙",
    distance: "14.2 km",
    rating: 4,
  },
  {
    id: "R003",
    date: "Dec 18, 6:45 PM",
    from: "MG Road",
    to: "Airport",
    fare: "₹520",
    status: "completed",
    type: "SaaraPrime",
    icon: "🚙",
    distance: "32 km",
    rating: 5,
  },
  {
    id: "R004",
    date: "Dec 16, 3:20 PM",
    from: "Indiranagar",
    to: "Koramangala",
    fare: "₹89",
    status: "cancelled",
    type: "SaaraAuto",
    icon: "🛺",
    distance: "4.5 km",
    rating: 0,
  },
  {
    id: "R005",
    date: "Dec 14, 11:00 AM",
    from: "BTM Layout",
    to: "Electronic City",
    fare: "₹190",
    status: "completed",
    type: "SaaraMini",
    icon: "🚗",
    distance: "11 km",
    rating: 4,
  },
];

export const RideHistory = () => {
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
          Ride History
        </h2>
      </div>

      {/* Summary strip */}
      <div className="flex gap-3 px-4 mb-4">
        {[
          { label: "Total Rides", val: "48" },
          { label: "Distance", val: "312 km" },
          { label: "Spent", val: "₹4,280" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex-1 flex flex-col items-center py-3"
            style={{
              background: "rgba(30,58,95,0.3)",
              borderRadius: 12,
              border: "1px solid rgba(212,175,55,0.1)",
            }}
          >
            <span style={{ color: "#D4AF37", fontSize: 18, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              {s.val}
            </span>
            <span style={{ color: "#5a7a9a", fontSize: 11, fontFamily: "Inter, sans-serif" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Rides list */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="flex flex-col gap-3">
          {rides.map((ride) => (
            <div
              key={ride.id}
              style={{
                background: "rgba(10,20,35,0.85)",
                borderRadius: 16,
                border: "1px solid rgba(212,175,55,0.08)",
                overflow: "hidden",
              }}
            >
              {/* Top row */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <span style={{ fontSize: 24 }}>{ride.icon}</span>
                <div className="flex-1">
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 500, fontFamily: "Inter, sans-serif" }}>
                    {ride.type}
                  </p>
                  <p style={{ color: "#3a5a7a", fontSize: 11, fontFamily: "Inter, sans-serif" }}>
                    {ride.date} • {ride.distance}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                    {ride.fare}
                  </p>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "Inter, sans-serif",
                      color: ride.status === "completed" ? "#22c55e" : "#E84040",
                      background:
                        ride.status === "completed"
                          ? "rgba(34,197,94,0.1)"
                          : "rgba(232,64,64,0.1)",
                      padding: "2px 8px",
                      borderRadius: 20,
                    }}
                  >
                    {ride.status === "completed" ? "Completed" : "Cancelled"}
                  </span>
                </div>
              </div>

              {/* Route */}
              <div className="px-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#D4AF37",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "#8fa3b8", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                    {ride.from}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#E84040",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "#8fa3b8", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                    {ride.to}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {ride.status === "completed" && (
                <div
                  className="flex items-center justify-between px-4 py-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        fill={s <= ride.rating ? "#D4AF37" : "transparent"}
                        color="#D4AF37"
                      />
                    ))}
                  </div>
                  <button
                    className="flex items-center gap-1"
                    style={{ color: "#D4AF37", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                  >
                    <Download size={12} />
                    Invoice
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="rides" />
    </div>
  );
};
