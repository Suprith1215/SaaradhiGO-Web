import React from "react";
import { User, Phone, Mail, Calendar, ChevronRight, Shield, LogOut } from "lucide-react";
import { BottomNav } from "../../components/BottomNav";

export const ProfileScreen = () => {
  const fields = [
    { icon: User, label: "Full Name", value: "Arjun Kumar" },
    { icon: Phone, label: "Phone Number", value: "+91 98765 43210" },
    { icon: Calendar, label: "Date of Birth", value: "15 Aug 1995" },
    { icon: User, label: "Gender", value: "Male" },
    { icon: Mail, label: "Email", value: "arjun.kumar@gmail.com" },
  ];

  const emergencyContacts = [
    { name: "Priya Kumar", relation: "Sister", phone: "+91 98880 12345" },
    { name: "Suresh Kumar", relation: "Father", phone: "+91 97760 98765" },
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
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <h2
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Profile
          </h2>
          <button
            style={{
              color: "#D4AF37",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            Edit
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {/* Avatar card */}
        <div
          className="flex flex-col items-center mb-5 py-5"
          style={{
            background: "rgba(10,20,35,0.85)",
            borderRadius: 20,
            border: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))",
              border: "2px solid #D4AF37",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              marginBottom: 12,
            }}
          >
            👨
          </div>
          <p style={{ color: "#fff", fontSize: 18, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
            Arjun Kumar
          </p>
          <p style={{ color: "#5a7a9a", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
            Member since Jan 2024
          </p>
          <div className="flex gap-4 mt-3">
            <div className="text-center">
              <p style={{ color: "#D4AF37", fontSize: 18, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                48
              </p>
              <p style={{ color: "#3a5a7a", fontSize: 11, fontFamily: "Inter, sans-serif" }}>Rides</p>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
            <div className="text-center">
              <p style={{ color: "#D4AF37", fontSize: 18, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                4.9★
              </p>
              <p style={{ color: "#3a5a7a", fontSize: 11, fontFamily: "Inter, sans-serif" }}>Rating</p>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
            <div className="text-center">
              <p style={{ color: "#D4AF37", fontSize: 18, fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                Gold
              </p>
              <p style={{ color: "#3a5a7a", fontSize: 11, fontFamily: "Inter, sans-serif" }}>Tier</p>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div
          className="mb-4"
          style={{
            background: "rgba(10,20,35,0.85)",
            borderRadius: 16,
            border: "1px solid rgba(212,175,55,0.08)",
            overflow: "hidden",
          }}
        >
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Personal Info
            </p>
          </div>
          {fields.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < fields.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(212,175,55,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={16} color="#D4AF37" />
                </div>
                <div className="flex-1">
                  <p style={{ color: "#3a5a7a", fontSize: 11, fontFamily: "Inter, sans-serif" }}>
                    {f.label}
                  </p>
                  <p style={{ color: "#fff", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
                    {f.value}
                  </p>
                </div>
                <ChevronRight size={16} color="#3a5a7a" />
              </div>
            );
          })}
        </div>

        {/* Emergency contacts */}
        <div
          className="mb-4"
          style={{
            background: "rgba(10,20,35,0.85)",
            borderRadius: 16,
            border: "1px solid rgba(212,175,55,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center gap-2">
              <Shield size={14} color="#D4AF37" />
              <p style={{ color: "#5a7a9a", fontSize: 12, fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Emergency Contacts
              </p>
            </div>
            <button style={{ color: "#D4AF37", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              + Add
            </button>
          </div>
          {emergencyContacts.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < emergencyContacts.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(212,175,55,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                👤
              </div>
              <div className="flex-1">
                <p style={{ color: "#fff", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
                  {c.name}
                </p>
                <p style={{ color: "#3a5a7a", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                  {c.relation} • {c.phone}
                </p>
              </div>
              <ChevronRight size={16} color="#3a5a7a" />
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          className="w-full flex items-center justify-center gap-2"
          style={{
            height: 50,
            borderRadius: 14,
            background: "rgba(220,50,50,0.08)",
            border: "1px solid rgba(220,50,50,0.2)",
            color: "#E84040",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <BottomNav active="profile" />
    </div>
  );
};
