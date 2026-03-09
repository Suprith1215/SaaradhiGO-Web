import React, { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { Logo } from "../../components/Logo";

export const LoginScreen = () => {
  const [phone, setPhone] = useState("");

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0F1C2E 0%, #1a2d48 100%)",
        paddingTop: 44,
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0"
        style={{
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Logo area */}
      <div className="flex flex-col items-center mt-12 mb-8">
        <Logo size={100} />
        <h1
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: 700,
            marginTop: 16,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Welcome Back
        </h1>
        <p
          style={{
            color: "#5a7a9a",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            marginTop: 4,
          }}
        >
          Sign in to continue
        </p>
      </div>

      {/* Form card */}
      <div
        className="flex-1 mx-4"
        style={{
          background: "rgba(10, 20, 35, 0.9)",
          borderRadius: 24,
          padding: "28px 20px",
          border: "1px solid rgba(212,175,55,0.12)",
        }}
      >
        <p
          style={{
            color: "#7a9abf",
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Phone Number
        </p>

        {/* Phone input with country code */}
        <div
          className="flex items-center gap-2"
          style={{
            background: "rgba(30,58,95,0.4)",
            borderRadius: 12,
            border: "1px solid rgba(212,175,55,0.2)",
            padding: "0 12px",
            marginBottom: 20,
          }}
        >
          <button
            className="flex items-center gap-1 py-3"
            style={{ borderRight: "1px solid rgba(212,175,55,0.15)", paddingRight: 10 }}
          >
            <span style={{ fontSize: 16 }}>🇮🇳</span>
            <span style={{ color: "#fff", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
              +91
            </span>
            <ChevronDown size={14} color="#D4AF37" />
          </button>
          <input
            type="tel"
            placeholder="Enter your number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 15,
              fontFamily: "Inter, sans-serif",
              padding: "14px 8px",
            }}
          />
          <Phone size={18} color="#D4AF37" />
        </div>

        {/* Continue button */}
        <button
          className="w-full"
          style={{
            height: 52,
            borderRadius: 14,
            background: "linear-gradient(135deg, #D4AF37, #F0C040)",
            color: "#0F1C2E",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            border: "none",
            marginBottom: 24,
          }}
        >
          Send OTP
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ color: "#4a6080", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
            or continue with
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Social buttons */}
        <div className="flex flex-col gap-3">
          <button
            className="flex items-center justify-center gap-3 w-full"
            style={{
              height: 50,
              borderRadius: 14,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff",
              fontSize: 15,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <button
            className="flex items-center justify-center gap-3 w-full"
            style={{
              height: 50,
              borderRadius: 14,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff",
              fontSize: 15,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Continue with Apple
          </button>
        </div>

        <p
          className="text-center mt-6"
          style={{
            color: "#4a6080",
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.5,
          }}
        >
          By continuing, you agree to our{" "}
          <span style={{ color: "#D4AF37" }}>Terms of Service</span> and{" "}
          <span style={{ color: "#D4AF37" }}>Privacy Policy</span>
        </p>
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
};
