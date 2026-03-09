import React from "react";
import { Home, Clock, Wallet, User, MapPin } from "lucide-react";

interface BottomNavProps {
  active?: "home" | "rides" | "wallet" | "profile";
  isDriver?: boolean;
}

const GOLD = "#D4AF37";
const INACTIVE = "#4a6080";

export const BottomNav = ({ active = "home", isDriver = false }: BottomNavProps) => {
  const customerTabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "rides", icon: Clock, label: "Rides" },
    { id: "wallet", icon: Wallet, label: "Wallet" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  const driverTabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "rides", icon: MapPin, label: "Trips" },
    { id: "wallet", icon: Wallet, label: "Earnings" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  const tabs = isDriver ? driverTabs : customerTabs;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center justify-around"
      style={{
        height: 80,
        background: "rgba(10, 20, 35, 0.97)",
        borderTop: "1px solid rgba(212,175,55,0.15)",
        backdropFilter: "blur(20px)",
        paddingBottom: 20,
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className="flex flex-col items-center justify-center gap-1"
            style={{ minWidth: 60 }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isActive ? "rgba(212,175,55,0.15)" : "transparent",
              }}
            >
              <Icon
                size={20}
                color={isActive ? GOLD : INACTIVE}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                color: isActive ? GOLD : INACTIVE,
                fontWeight: isActive ? 600 : 400,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
