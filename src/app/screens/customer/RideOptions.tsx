import React, { useState } from "react";
import { ArrowLeft, Users, Clock, ChevronRight, Zap } from "lucide-react";
import { MapBackground } from "../../components/MapBackground";

const rides = [
  {
    id: "bike",
    icon: "🏍️",
    name: "SaaraBike",
    desc: "Quick & affordable",
    eta: "2 min",
    price: "₹49",
    priceNum: 49,
    passengers: 1,
    badge: null,
  },
  {
    id: "auto",
    icon: "🛺",
    name: "SaaraAuto",
    desc: "Classic auto rickshaw",
    eta: "4 min",
    price: "₹89",
    priceNum: 89,
    passengers: 3,
    badge: null,
  },
  {
    id: "mini",
    icon: "🚗",
    name: "SaaraMini",
    desc: "Compact & comfortable",
    eta: "5 min",
    price: "₹129",
    priceNum: 129,
    passengers: 4,
    badge: "Popular",
  },
  {
    id: "prime",
    icon: "🚙",
    name: "SaaraPrime",
    desc: "Premium sedan experience",
    eta: "7 min",
    price: "₹199",
    priceNum: 199,
    passengers: 4,
    badge: "Premium",
  },
];

export const RideOptions = () => {
  const [selected, setSelected] = useState("mini");

  const selectedRide = rides.find((r) => r.id === selected)!;

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ background: "#0d1b2e", paddingTop: 44 }}
    >
      {/* Map top half */}
      <div className="relative" style={{ height: 230 }}>
        <MapBackground height={230} showRoute />

        {/* Back button */}
        <button
          className="absolute top-4 left-4 z-10"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "rgba(10,20,35,0.85)",
            border: "1px solid rgba(212,175,55,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft size={20} color="#D4AF37" />
        </button>

        {/* Route info overlay */}
        <div
          className="absolute bottom-3 left-4 right-4"
          style={{
            background: "rgba(10,20,35,0.9)",
            borderRadius: 12,
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(212,175,55,0.15)",
          }}
        >
          <div className="flex flex-col" style={{ flex: 1 }}>
            <span style={{ color: "#fff", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              📍 Koramangala → Brigade Road
            </span>
          </div>
          <span style={{ color: "#D4AF37", fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
            3.2 km • 12 min
          </span>
        </div>
      </div>

      {/* Bottom panel */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          background: "rgba(8,16,28,0.98)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: "20px 16px 0",
          border: "1px solid rgba(212,175,55,0.1)",
          borderBottom: "none",
          marginTop: -16,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Choose a Ride
          </h3>
          <div
            className="flex items-center gap-1"
            style={{
              background: "rgba(212,175,55,0.1)",
              borderRadius: 8,
              padding: "4px 10px",
            }}
          >
            <Zap size={12} color="#D4AF37" />
            <span style={{ color: "#D4AF37", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              Surge 1.2x
            </span>
          </div>
        </div>

        {/* Ride cards */}
        <div className="flex flex-col gap-3 overflow-y-auto flex-1 pb-20">
          {rides.map((ride) => {
            const isSelected = selected === ride.id;
            return (
              <button
                key={ride.id}
                onClick={() => setSelected(ride.id)}
                className="flex items-center gap-4 text-left"
                style={{
                  background: isSelected ? "rgba(212,175,55,0.1)" : "rgba(30,58,95,0.3)",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: isSelected
                    ? "1.5px solid #D4AF37"
                    : "1px solid rgba(212,175,55,0.1)",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: isSelected ? "rgba(212,175,55,0.15)" : "rgba(20,40,65,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    flexShrink: 0,
                  }}
                >
                  {ride.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                      {ride.name}
                    </span>
                    {ride.badge && (
                      <span
                        style={{
                          background: ride.badge === "Premium" ? "rgba(212,175,55,0.2)" : "rgba(100,200,100,0.15)",
                          color: ride.badge === "Premium" ? "#D4AF37" : "#80d080",
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: 20,
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {ride.badge}
                      </span>
                    )}
                  </div>
                  <span style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                    {ride.desc}
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock size={11} color="#5a7a9a" />
                      <span style={{ color: "#5a7a9a", fontSize: 11, fontFamily: "Inter, sans-serif" }}>
                        {ride.eta}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={11} color="#5a7a9a" />
                      <span style={{ color: "#5a7a9a", fontSize: 11, fontFamily: "Inter, sans-serif" }}>
                        {ride.passengers}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    color: isSelected ? "#D4AF37" : "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {ride.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{
            background: "rgba(8,16,28,0.98)",
            borderTop: "1px solid rgba(212,175,55,0.08)",
          }}
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
              Book {selectedRide.name}
            </span>
            <span style={{ color: "#0F1C2E", fontSize: 18, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              {selectedRide.price} <ChevronRight size={18} style={{ display: "inline" }} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
