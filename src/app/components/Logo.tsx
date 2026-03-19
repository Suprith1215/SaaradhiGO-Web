import React from "react";
import logoImage from "@/assets/25a5bd8011d7696bf02e1d5cc818a54ef634abf4.png";

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export const Logo = ({ size = 120, showText = false }: LogoProps) => {
  return (
    <div className="flex flex-col items-center">
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={logoImage}
          alt="SaaradhiGO Logo"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {showText && (
        <span
          className="mt-2"
          style={{
            color: "#D4AF37",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: size * 0.18,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          SaaradhiGO
        </span>
      )}
    </div>
  );
};

export const LogoInline = ({ height = 40 }: { height?: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          width: height,
          height: height,
          borderRadius: "50%",
          overflow: "hidden",
          background: "#000",
          flexShrink: 0,
        }}
      >
        <img
          src={logoImage}
          alt="SaaradhiGO"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <span
        style={{
          color: "#D4AF37",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: height * 0.45,
          letterSpacing: "0.1em",
        }}
      >
        SaaradhiGO
      </span>
    </div>
  );
};
