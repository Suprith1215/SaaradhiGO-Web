import React from "react";
import { MapPin, Bell, MessageSquare, Users } from "lucide-react";

type PermissionType = "location" | "notifications" | "sms" | "contacts";

const permissionData: Record<
  PermissionType,
  {
    icon: React.ReactNode;
    emoji: string;
    title: string;
    subtitle: string;
    description: string;
    benefit: string;
    color: string;
  }
> = {
  location: {
    icon: <MapPin size={32} color="#D4AF37" />,
    emoji: "📍",
    title: "Enable Location",
    subtitle: "We need your location",
    description:
      "SaaradhiGO needs access to your location to find nearby drivers and show accurate pickup points.",
    benefit: "🚗 Find drivers near you instantly",
    color: "rgba(212,175,55,0.15)",
  },
  notifications: {
    icon: <Bell size={32} color="#D4AF37" />,
    emoji: "🔔",
    title: "Enable Notifications",
    subtitle: "Stay updated always",
    description:
      "Get real-time updates about your ride status, driver arrival, and exclusive offers.",
    benefit: "⚡ Never miss a ride update",
    color: "rgba(212,175,55,0.15)",
  },
  sms: {
    icon: <MessageSquare size={32} color="#D4AF37" />,
    emoji: "💬",
    title: "SMS Access",
    subtitle: "Auto-read OTPs",
    description:
      "Allow SaaradhiGO to auto-read OTPs from SMS for faster, seamless login verification.",
    benefit: "🔐 Automatic OTP verification",
    color: "rgba(212,175,55,0.15)",
  },
  contacts: {
    icon: <Users size={32} color="#D4AF37" />,
    emoji: "👥",
    title: "Contacts Access",
    subtitle: "Add emergency contacts",
    description:
      "Share your ride details with loved ones. Add emergency contacts for a safer ride experience.",
    benefit: "🛡️ Enhanced safety features",
    color: "rgba(212,175,55,0.15)",
  },
};

interface PermissionScreenProps {
  type?: PermissionType;
}

export const PermissionScreen = ({ type = "location" }: PermissionScreenProps) => {
  const data = permissionData[type];

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-end overflow-hidden"
      style={{
        background: "rgba(5,12,22,0.7)",
        paddingTop: 44,
      }}
    >
      {/* Blurred background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0F1C2E 0%, #1a2d48 100%)",
          opacity: 0.7,
        }}
      />

      {/* Permission Modal Card */}
      <div
        className="relative w-full"
        style={{
          background: "rgba(10,20,35,0.98)",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          padding: "32px 24px 40px",
          border: "1px solid rgba(212,175,55,0.15)",
          borderBottom: "none",
        }}
      >
        {/* Drag handle */}
        <div
          className="mx-auto mb-6"
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: "rgba(255,255,255,0.12)",
          }}
        />

        {/* Icon */}
        <div
          className="mx-auto mb-5 flex items-center justify-center"
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: data.color,
            border: "1.5px solid rgba(212,175,55,0.3)",
          }}
        >
          <span style={{ fontSize: 36 }}>{data.emoji}</span>
        </div>

        <h2
          className="text-center"
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            marginBottom: 6,
          }}
        >
          {data.title}
        </h2>
        <p
          className="text-center"
          style={{
            color: "#5a7a9a",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            marginBottom: 20,
          }}
        >
          {data.subtitle}
        </p>

        <p
          style={{
            color: "#8fa3b8",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.6,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {data.description}
        </p>

        {/* Benefit badge */}
        <div
          className="flex items-center justify-center gap-2 mb-8"
          style={{
            background: "rgba(212,175,55,0.1)",
            borderRadius: 12,
            padding: "10px 16px",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <span style={{ color: "#D4AF37", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
            {data.benefit}
          </span>
        </div>

        {/* Buttons */}
        <button
          className="w-full mb-3"
          style={{
            height: 52,
            borderRadius: 16,
            background: "linear-gradient(135deg, #D4AF37, #F0C040)",
            color: "#0F1C2E",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            border: "none",
          }}
        >
          Allow Access
        </button>
        <button
          className="w-full"
          style={{
            height: 52,
            borderRadius: 16,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#8fa3b8",
            fontSize: 15,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Not Now
        </button>
      </div>
    </div>
  );
};

// Alias for showcase use
export const PermissionScreens = () => <PermissionScreen type="location" />;