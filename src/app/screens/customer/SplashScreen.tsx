import React, { useState, useEffect } from "react";
import { Logo } from "../../components/Logo";

export const SplashScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0F1C2E 0%, #0a1220 50%, #1E3A5F 100%)",
      }}
    >
      {/* Background radial glow */}
      <div
        className="absolute"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Stars / particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: "rgba(212,175,55,0.4)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8 + 0.2,
          }}
        />
      ))}

      {/* Logo */}
      <div className="flex flex-col items-center mb-16">
        <Logo size={160} />
        <div className="mt-6 flex flex-col items-center">
          <p
            style={{
              color: "rgba(212,175,55,0.7)",
              fontSize: 13,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            Premium Ride Experience
          </p>
        </div>
      </div>

      {/* Loading bar */}
      <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-3">
        <div
          style={{
            width: 180,
            height: 3,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #D4AF37, #F0C040)",
              borderRadius: 2,
              transition: "width 0.05s linear",
            }}
          />
        </div>
        <p
          style={{
            color: "rgba(212,175,55,0.5)",
            fontSize: 11,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.1em",
          }}
        >
          Loading...
        </p>
      </div>

      {/* Gold corner accents */}
      <div
        className="absolute top-8 left-8"
        style={{
          width: 30,
          height: 30,
          borderTop: "2px solid rgba(212,175,55,0.4)",
          borderLeft: "2px solid rgba(212,175,55,0.4)",
          borderRadius: "4px 0 0 0",
        }}
      />
      <div
        className="absolute top-8 right-8"
        style={{
          width: 30,
          height: 30,
          borderTop: "2px solid rgba(212,175,55,0.4)",
          borderRight: "2px solid rgba(212,175,55,0.4)",
          borderRadius: "0 4px 0 0",
        }}
      />
      <div
        className="absolute bottom-8 left-8"
        style={{
          width: 30,
          height: 30,
          borderBottom: "2px solid rgba(212,175,55,0.4)",
          borderLeft: "2px solid rgba(212,175,55,0.4)",
          borderRadius: "0 0 0 4px",
        }}
      />
      <div
        className="absolute bottom-8 right-8"
        style={{
          width: 30,
          height: 30,
          borderBottom: "2px solid rgba(212,175,55,0.4)",
          borderRight: "2px solid rgba(212,175,55,0.4)",
          borderRadius: "0 0 4px 0",
        }}
      />
    </div>
  );
};
