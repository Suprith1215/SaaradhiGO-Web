import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { LogoInline } from "../../components/Logo";

const slides = [
  {
    id: 1,
    emoji: "🚗",
    illustration: (
      <div className="flex items-center justify-center" style={{ width: 220, height: 220 }}>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 90 }}>🚗</span>
        </div>
      </div>
    ),
    headline: "Book Your Ride\nin Seconds",
    description:
      "Experience seamless ride booking with just a tap. Premium vehicles at your doorstep.",
  },
  {
    id: 2,
    emoji: "📍",
    illustration: (
      <div className="flex items-center justify-center" style={{ width: 220, height: 220 }}>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 90 }}>🗺️</span>
        </div>
      </div>
    ),
    headline: "Live Tracking\nEvery Moment",
    description:
      "Track your ride in real-time. Know exactly where your driver is at every step.",
  },
  {
    id: 3,
    emoji: "💰",
    illustration: (
      <div className="flex items-center justify-center" style={{ width: 220, height: 220 }}>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 90 }}>💳</span>
        </div>
      </div>
    ),
    headline: "Pay Smart,\nRide Premium",
    description:
      "Multiple payment options. Digital wallet, UPI, cards — choose what suits you best.",
  },
];

interface OnboardingScreenProps {
  initialSlide?: number;
}

export const OnboardingScreen = ({ initialSlide = 0 }: OnboardingScreenProps) => {
  const [current, setCurrent] = useState(initialSlide);

  const slide = slides[current];

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0F1C2E 0%, #1a2d48 100%)",
        paddingTop: 44,
      }}
    >
      {/* Skip button */}
      <div className="absolute top-12 right-5 z-10">
        <button
          style={{
            padding: "6px 16px",
            borderRadius: 20,
            border: "1px solid rgba(212,175,55,0.3)",
            background: "transparent",
            color: "rgba(212,175,55,0.8)",
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Skip
        </button>
      </div>

      {/* Logo top */}
      <div className="px-6 pt-4">
        <LogoInline height={28} />
      </div>

      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center">
        {slide.illustration}
      </div>

      {/* Content card */}
      <div
        style={{
          background: "rgba(10, 20, 35, 0.95)",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          padding: "32px 28px 24px",
          border: "1px solid rgba(212,175,55,0.12)",
          borderBottom: "none",
        }}
      >
        {/* Pagination dots */}
        <div className="flex gap-2 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                height: 4,
                width: i === current ? 28 : 8,
                borderRadius: 2,
                background: i === current ? "#D4AF37" : "rgba(212,175,55,0.25)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        <h2
          style={{
            color: "#fff",
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 12,
            fontFamily: "Inter, sans-serif",
            whiteSpace: "pre-line",
          }}
        >
          {slide.headline}
        </h2>
        <p
          style={{
            color: "#7a9abf",
            fontSize: 15,
            lineHeight: 1.6,
            marginBottom: 32,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {slide.description}
        </p>

        {/* Next button */}
        <button
          onClick={() => setCurrent((c) => Math.min(c + 1, slides.length - 1))}
          className="flex items-center justify-center gap-2 w-full"
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
          {current === slides.length - 1 ? "Get Started" : "Next"}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
