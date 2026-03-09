import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { LogoInline } from "../../components/Logo";

export const OTPScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const t = setInterval(() => setTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0F1C2E 0%, #1a2d48 100%)",
        paddingTop: 44,
      }}
    >
      {/* BG glow */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="flex items-center px-5 pt-4 mb-8">
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
        <div className="ml-auto">
          <LogoInline height={24} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-6 flex-1">
        {/* OTP icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 36 }}>🔐</span>
        </div>

        <h2
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Verify Your Number
        </h2>
        <p
          style={{
            color: "#5a7a9a",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            textAlign: "center",
            lineHeight: 1.5,
            marginBottom: 36,
          }}
        >
          We sent a 6-digit OTP to{" "}
          <span style={{ color: "#D4AF37" }}>+91 98765 43210</span>
        </p>

        {/* OTP boxes */}
        <div className="flex gap-3 mb-8">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              style={{
                width: 50,
                height: 58,
                borderRadius: 14,
                background: digit
                  ? "rgba(212,175,55,0.15)"
                  : "rgba(30,58,95,0.4)",
                border: digit
                  ? "1.5px solid #D4AF37"
                  : "1px solid rgba(212,175,55,0.2)",
                color: "#fff",
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                textAlign: "center",
                outline: "none",
                caretColor: "#D4AF37",
              }}
            />
          ))}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 mb-8">
          {timer > 0 ? (
            <p style={{ color: "#5a7a9a", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
              Resend OTP in{" "}
              <span style={{ color: "#D4AF37", fontWeight: 600 }}>00:{String(timer).padStart(2, "0")}</span>
            </p>
          ) : (
            <button style={{ color: "#D4AF37", fontSize: 14, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
              Resend OTP
            </button>
          )}
        </div>

        {/* Verify button */}
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
          Verify & Proceed
        </button>

        <p
          className="mt-6 text-center"
          style={{
            color: "#4a6080",
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Didn't receive OTP?{" "}
          <span style={{ color: "#D4AF37" }}>Try voice call</span>
        </p>
      </div>
    </div>
  );
};
