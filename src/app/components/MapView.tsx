interface MapViewProps {
  showRoute?: boolean;
  showDrivers?: boolean;
  routeFrom?: string;
  routeTo?: string;
  height?: string;
  zoom?: number;
}

export function MapView({
  showRoute = false,
  showDrivers = false,
  height = '100%',
}: MapViewProps) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <svg
        viewBox="0 0 390 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ background: '#0D1B2A' }}
      >
        {/* Base */}
        <rect width="390" height="600" fill="#0D1B2A" />

        {/* City blocks */}
        <rect x="0" y="0" width="65" height="120" fill="#0E2030" rx="3" />
        <rect x="85" y="0" width="80" height="120" fill="#0E2030" rx="3" />
        <rect x="185" y="0" width="80" height="120" fill="#0E2030" rx="3" />
        <rect x="285" y="0" width="105" height="120" fill="#0E2030" rx="3" />

        <rect x="0" y="140" width="65" height="90" fill="#0E2030" rx="3" />
        <rect x="85" y="140" width="80" height="90" fill="#0E2030" rx="3" />
        <rect x="185" y="140" width="80" height="90" fill="#0E2030" rx="3" />
        <rect x="285" y="140" width="105" height="90" fill="#0E2030" rx="3" />

        <rect x="0" y="250" width="65" height="100" fill="#0E2030" rx="3" />
        <rect x="85" y="250" width="80" height="100" fill="#0E2030" rx="3" />
        <rect x="185" y="250" width="80" height="100" fill="#0E2030" rx="3" />
        <rect x="285" y="250" width="105" height="100" fill="#0E2030" rx="3" />

        <rect x="0" y="370" width="65" height="100" fill="#0E2030" rx="3" />
        <rect x="85" y="370" width="80" height="100" fill="#0E2030" rx="3" />
        <rect x="185" y="370" width="80" height="100" fill="#0E2030" rx="3" />
        <rect x="285" y="370" width="105" height="100" fill="#0E2030" rx="3" />

        <rect x="0" y="490" width="65" height="110" fill="#0E2030" rx="3" />
        <rect x="85" y="490" width="80" height="110" fill="#0E2030" rx="3" />
        <rect x="185" y="490" width="80" height="110" fill="#0E2030" rx="3" />
        <rect x="285" y="490" width="105" height="110" fill="#0E2030" rx="3" />

        {/* Roads - horizontal */}
        <rect x="0" y="120" width="390" height="20" fill="#132130" />
        <rect x="0" y="240" width="390" height="10" fill="#132130" />
        <rect x="0" y="360" width="390" height="10" fill="#132130" />
        <rect x="0" y="480" width="390" height="10" fill="#132130" />

        {/* Roads - vertical */}
        <rect x="65" y="0" width="20" height="600" fill="#132130" />
        <rect x="165" y="0" width="20" height="600" fill="#132130" />
        <rect x="265" y="0" width="20" height="600" fill="#132130" />

        {/* Road center dashes */}
        <line x1="0" y1="130" x2="390" y2="130" stroke="#1E3A52" strokeWidth="1.5" strokeDasharray="18,14" />
        <line x1="75" y1="0" x2="75" y2="600" stroke="#1E3A52" strokeWidth="1.5" strokeDasharray="18,14" />
        <line x1="175" y1="0" x2="175" y2="600" stroke="#1E3A52" strokeWidth="1.5" strokeDasharray="18,14" />
        <line x1="275" y1="0" x2="275" y2="600" stroke="#1E3A52" strokeWidth="1.5" strokeDasharray="18,14" />

        {/* Park/Green area */}
        <rect x="85" y="250" width="80" height="100" fill="#0A2218" rx="3" />
        <circle cx="125" cy="290" r="25" fill="#0D2B1E" opacity="0.7" />
        <circle cx="145" cy="310" r="18" fill="#0D2B1E" opacity="0.7" />

        {/* Water */}
        <path d="M285 370 L390 370 L390 440 L285 440 Z" fill="#0B1E2E" />
        <path d="M285 370 Q320 380 360 370 Q380 365 390 370 L390 440 L285 440 Z" fill="#0C2235" />

        {/* Route path */}
        {showRoute && (
          <>
            <path
              d="M195 520 L195 380 L95 300 L195 200 L300 130"
              stroke="#D4AF37"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="14,10"
              opacity="0.9"
            />
            <path
              d="M195 520 L195 380 L95 300 L195 200 L300 130"
              stroke="#D4AF37"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.15"
            />
            {/* Start pin */}
            <circle cx="195" cy="520" r="8" fill="#D4AF37" />
            <circle cx="195" cy="520" r="14" fill="#D4AF37" opacity="0.25" />
            {/* End pin */}
            <circle cx="300" cy="130" r="8" fill="#D4AF37" />
            <circle cx="300" cy="130" r="14" fill="#D4AF37" opacity="0.25" />
          </>
        )}

        {/* Driver markers */}
        {showDrivers && (
          <>
            <g transform="translate(100, 260)">
              <circle r="16" fill="#1E3A5F" stroke="#D4AF37" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fontSize="14">🚗</text>
            </g>
            <g transform="translate(300, 180)">
              <circle r="16" fill="#1E3A5F" stroke="#D4AF37" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fontSize="14">🚗</text>
            </g>
            <g transform="translate(220, 380)">
              <circle r="16" fill="#1E3A5F" stroke="#D4AF37" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fontSize="14">🚗</text>
            </g>
            <g transform="translate(150, 450)">
              <circle r="16" fill="#1E3A5F" stroke="#D4AF37" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fontSize="14">🛺</text>
            </g>
            <g transform="translate(340, 350)">
              <circle r="16" fill="#1E3A5F" stroke="#D4AF37" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fontSize="14">🏍️</text>
            </g>
          </>
        )}

        {/* Map glow overlay */}
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0" />
          <stop offset="100%" stopColor="#0F1C2E" stopOpacity="0.7" />
        </radialGradient>
        <rect width="390" height="600" fill="url(#mapGlow)" />
      </svg>
    </div>
  );
}
