import React from "react";

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame = ({ children }: MobileFrameProps) => {
  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: 390,
        height: 844,
        borderRadius: 50,
        background: "#000",
        boxShadow:
          "0 0 0 2px #333, 0 0 0 10px #111, 0 0 0 12px #2a2a2a, 0 40px 100px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Status bar */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
        style={{ height: 44, background: "transparent" }}
      >
        <span className="text-white text-xs font-semibold" style={{ fontSize: 12 }}>
          9:41
        </span>
        {/* Dynamic Island */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-3"
          style={{
            width: 126,
            height: 36,
            background: "#000",
            borderRadius: 20,
          }}
        />
        <div className="flex items-center gap-1">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
            <rect x="0" y="3" width="3" height="9" rx="1" opacity="0.4"/>
            <rect x="4" y="2" width="3" height="10" rx="1" opacity="0.6"/>
            <rect x="8" y="0.5" width="3" height="11.5" rx="1" opacity="0.8"/>
            <rect x="12" y="0" width="3" height="12" rx="1"/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 24 16" fill="white">
            <path d="M12 3C7 3 2.5 5 0 8.5 2.5 12 7 14 12 14s9.5-2 12-5.5C21.5 5 17 3 12 3z" opacity="0.4"/>
            <path d="M12 5C8 5 4.5 6.5 2.5 9 4.5 11.5 8 13 12 13s7.5-1.5 9.5-4C19.5 6.5 16 5 12 5z" opacity="0.7"/>
            <circle cx="12" cy="9" r="3"/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/>
            <rect x="2" y="2" width="17" height="8" rx="2" fill="white"/>
            <path d="M23 4.5V7.5C23.8 7.2 24.5 6.7 24.5 6 24.5 5.3 23.8 4.8 23 4.5z" fill="white" opacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Screen content */}
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 50 }}>
        {children}
      </div>

      {/* Home indicator */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50"
        style={{
          width: 134,
          height: 5,
          background: "rgba(255,255,255,0.4)",
          borderRadius: 3,
        }}
      />
    </div>
  );
};
