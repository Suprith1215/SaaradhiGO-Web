import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ─────────────────────────────────────────────
   Fix Leaflet's default icon path issue with Vite
───────────────────────────────────────────────── */
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────────── */
interface MapBackgroundProps {
  height?: number | string;
  showRoute?: boolean;
  showDriverPin?: boolean;
  showDestPin?: boolean;
  onMapReady?: (map: L.Map) => void;
  interactive?: boolean;
  userLat?: number;
  userLng?: number;
  destLat?: number;
  destLng?: number;
  trackedDriverId?: number | null;
  mode?: "idle" | "seeking" | "matched" | "riding";
}

/* ─────────────────────────────────────────────
   Default Koramangala coords
───────────────────────────────────────────────── */
const DEFAULT_CENTER: [number, number] = [12.9352, 77.6245];
const DEST_LOCATION: [number, number] = [12.9716, 77.5946];

const ROUTE_WAYPOINTS: [number, number][] = [
  [12.9352, 77.6245],
  [12.9380, 77.6160],
  [12.9450, 77.6050],
  [12.9530, 77.5980],
  [12.9620, 77.5960],
  [12.9716, 77.5946],
];

/* ─────── NEARBY VEHICLE SPAWNS ─────── */
const BASE_VEHICLES: {
  id: number;
  pos: [number, number];
  type: "car" | "auto" | "bike";
  eta: string;
  rotation: number;
  name: string;
  rating: number;
  price: string;
}[] = [
    { id: 1, pos: [12.9368, 77.6280], type: "car", eta: "3 min", rotation: 225, name: "Ravi K.", rating: 4.9, price: "₹129" },
    { id: 2, pos: [12.9340, 77.6220], type: "auto", eta: "2 min", rotation: 160, name: "Suresh M.", rating: 4.7, price: "₹89" },
    { id: 3, pos: [12.9375, 77.6200], type: "bike", eta: "1 min", rotation: 310, name: "Ajay P.", rating: 4.8, price: "₹49" },
    { id: 4, pos: [12.9330, 77.6270], type: "car", eta: "5 min", rotation: 70, name: "Kiran L.", rating: 4.6, price: "₹149" },
    { id: 5, pos: [12.9360, 77.6310], type: "bike", eta: "4 min", rotation: 190, name: "Mohan D.", rating: 4.9, price: "₹59" },
    { id: 6, pos: [12.9385, 77.6250], type: "auto", eta: "6 min", rotation: 45, name: "Ganesh R.", rating: 4.5, price: "₹99" },
    { id: 7, pos: [12.9310, 77.6300], type: "car", eta: "7 min", rotation: 135, name: "Praveen S.", rating: 4.8, price: "₹169" },
    { id: 8, pos: [12.9395, 77.6175], type: "bike", eta: "2 min", rotation: 265, name: "Vinod T.", rating: 4.7, price: "₹45" },
  ];

/* ─────────────────────────────────────────────
   SVG vehicles — Premium Ola/Uber/Rapido style
   Circular badge with detailed vehicle silhouette
───────────────────────────────────────────────── */

// Premium car silhouette (top-view, like Uber/Ola)
const CAR_ICON_SVG = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Shadow -->
  <ellipse cx="16" cy="29" rx="9" ry="2.5" fill="rgba(0,0,0,0.4)"/>
  <!-- Body -->
  <rect x="5" y="12" width="22" height="14" rx="4" fill="${color}"/>
  <!-- Cabin/windshield area -->
  <path d="M9 12 L11 5 Q12 3 14 3 L18 3 Q20 3 21 5 L23 12 Z" fill="${color}"/>
  <!-- Windshield -->
  <path d="M11 12 L12.5 6.5 L19.5 6.5 L21 12 Z" fill="rgba(5,15,30,0.85)"/>
  <!-- Side windows -->
  <rect x="5" y="13" width="4" height="6" rx="1" fill="rgba(5,15,30,0.7)"/>
  <rect x="23" y="13" width="4" height="6" rx="1" fill="rgba(5,15,30,0.7)"/>
  <!-- Front headlights -->
  <rect x="6" y="12" width="4" height="2.5" rx="1" fill="#FFFDE0" opacity="0.95"/>
  <rect x="22" y="12" width="4" height="2.5" rx="1" fill="#FFFDE0" opacity="0.95"/>
  <!-- Rear taillights -->
  <rect x="6" y="22" width="3.5" height="2" rx="0.8" fill="#FF4455" opacity="0.9"/>
  <rect x="22.5" y="22" width="3.5" height="2" rx="0.8" fill="#FF4455" opacity="0.9"/>
  <!-- Wheels -->
  <ellipse cx="8" cy="26" rx="3.5" ry="3" fill="#0a1220" stroke="${color}" stroke-width="1.2"/>
  <ellipse cx="24" cy="26" rx="3.5" ry="3" fill="#0a1220" stroke="${color}" stroke-width="1.2"/>
  <ellipse cx="8" cy="26" rx="1.5" ry="1.2" fill="#333"/>
  <ellipse cx="24" cy="26" rx="1.5" ry="1.2" fill="#333"/>
  <!-- Center stripe -->
  <rect x="14.5" y="4" width="3" height="8" rx="1" fill="rgba(255,255,255,0.12)"/>
</svg>`;

// Premium auto-rickshaw silhouette (side-view like Rapido/Ola Auto)
const AUTO_ICON_SVG = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 32" width="36" height="32">
  <!-- Shadow -->
  <ellipse cx="18" cy="30.5" rx="12" ry="2" fill="rgba(0,0,0,0.4)"/>
  <!-- Body roof + canopy -->
  <path d="M6 14 Q7 6 13 5 L28 5 Q32 6 32 12 L32 22 Q32 24 30 24 L8 24 Q6 24 6 22 Z" fill="${color}"/>
  <!-- Open left side (auto style) -->
  <rect x="6" y="14" width="5" height="9" fill="rgba(5,15,30,0.6)" rx="0.5"/>
  <!-- Main windshield -->
  <path d="M13 5.5 L13 13 L30 13 L30 7 Q28 5.5 25 5.5 Z" fill="rgba(5,15,30,0.8)"/>
  <!-- Canopy stripes -->
  <line x1="15" y1="5.5" x2="15" y2="13" stroke="${color}" stroke-width="1.5" opacity="0.4"/>
  <line x1="20" y1="5.5" x2="20" y2="13" stroke="${color}" stroke-width="1.5" opacity="0.4"/>
  <line x1="25" y1="5.5" x2="25" y2="13" stroke="${color}" stroke-width="1.5" opacity="0.4"/>
  <!-- Headlight -->
  <rect x="30" y="14" width="3.5" height="3" rx="1" fill="#FFFDE0" opacity="0.95"/>
  <!-- Rear -->
  <rect x="6" y="17" width="2.5" height="3" rx="0.8" fill="#FF4455" opacity="0.85"/>
  <!-- Wheels -->
  <circle cx="10" cy="25" r="4" fill="#0a1220" stroke="${color}" stroke-width="1.5"/>
  <circle cx="10" cy="25" r="1.8" fill="#2a2a2a"/>
  <circle cx="28" cy="25" r="4" fill="#0a1220" stroke="${color}" stroke-width="1.5"/>
  <circle cx="28" cy="25" r="1.8" fill="#2a2a2a"/>
  <!-- Front fork -->
  <line x1="32" y1="18" x2="32" y2="25" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <!-- Meter box -->
  <rect x="22" y="16" width="6" height="4" rx="1" fill="rgba(5,15,30,0.6)"/>
  <rect x="23" y="17" width="4" height="2" rx="0.5" fill="${color}" opacity="0.4"/>
</svg>`;

// Premium bike/motorcycle silhouette (side-view like Rapido Bike)
const BIKE_ICON_SVG = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 30" width="38" height="30">
  <!-- Shadow -->
  <ellipse cx="19" cy="29" rx="11" ry="1.8" fill="rgba(0,0,0,0.4)"/>
  <!-- Rear wheel -->
  <circle cx="9" cy="22" r="7" fill="none" stroke="${color}" stroke-width="2.5"/>
  <circle cx="9" cy="22" r="3.5" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.5"/>
  <circle cx="9" cy="22" r="1.5" fill="${color}"/>
  <!-- Front wheel -->
  <circle cx="30" cy="22" r="7" fill="none" stroke="${color}" stroke-width="2.5"/>
  <circle cx="30" cy="22" r="3.5" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.5"/>
  <circle cx="30" cy="22" r="1.5" fill="${color}"/>
  <!-- Frame -->
  <line x1="9" y1="22" x2="20" y2="10" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="20" y1="10" x2="30" y2="22" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <line x1="9" y1="22" x2="20" y2="15" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <line x1="20" y1="15" x2="25" y2="22" stroke="${color}" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  <!-- Engine block -->
  <rect x="14" y="15" width="9" height="7" rx="1.5" fill="${color}" opacity="0.9"/>
  <rect x="15.5" y="16" width="6" height="4" rx="1" fill="rgba(5,15,30,0.6)"/>
  <!-- Seat & rider -->
  <path d="M13 12 Q19 9 24 12" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Handlebars -->
  <line x1="27" y1="11" x2="33" y2="10" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="33" y1="10" x2="33" y2="14" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <!-- Headlight -->
  <ellipse cx="33" cy="16" rx="2.5" ry="2" fill="#FFFDE0" opacity="0.9"/>
  <!-- Rear light -->
  <rect x="6" y="19" width="2" height="2.5" rx="0.5" fill="#FF4455" opacity="0.85"/>
  <!-- Exhaust -->
  <path d="M9 24 Q5 26 3 25" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6"/>
</svg>`;

/* ─────────────────────────────────────────────
   Icon builder — Premium Ola/Rapido/Uber style
   Circular badge with glow + vehicle icon inside
───────────────────────────────────────────────── */
function makePinIcon(
  type: "car" | "auto" | "bike",
  eta: string,
  _rotation: number,
  highlighted = false
): L.DivIcon {
  const colors = { car: "#D4AF37", auto: "#00C9A7", bike: "#B06EF7" };
  const col = colors[type];
  const iconFn = type === "car" ? CAR_ICON_SVG : type === "auto" ? AUTO_ICON_SVG : BIKE_ICON_SVG;
  const vehicleSvg = iconFn(col);
  const encoded = encodeURIComponent(vehicleSvg);

  // Sizes per vehicle
  const iconW = type === "bike" ? 36 : type === "auto" ? 34 : 30;
  const iconH = type === "bike" ? 28 : type === "auto" ? 30 : 30;

  const pulseAnim = highlighted
    ? `animation:sgmap-badge-pulse 1.4s ease-in-out infinite;`
    : "";

  return L.divIcon({
    className: "",
    html: `
      <div style="
        display:flex;flex-direction:column;align-items:center;
        filter:${highlighted ? `drop-shadow(0 0 12px ${col})` : `drop-shadow(0 3px 6px rgba(0,0,0,0.7))`};
      ">
        <!-- Badge circle -->
        <div style="
          width:52px; height:52px; border-radius:50%;
          background:linear-gradient(145deg,#0d1e32,#061020);
          border:2.5px solid ${col};
          box-shadow:0 0 0 1px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06),
            0 4px 20px rgba(0,0,0,0.6)${highlighted ? `, 0 0 24px ${col}88` : ''};
          display:flex; align-items:center; justify-content:center;
          position:relative; ${pulseAnim}
        ">
          <!-- Subtle inner glow -->
          <div style="
            position:absolute; inset:3px; border-radius:50%;
            background:radial-gradient(circle at 40% 35%, ${col}18, transparent 65%);
          "></div>
          <!-- Vehicle icon -->
          <img src="data:image/svg+xml,${encoded}"
            width="${iconW}" height="${iconH}"
            style="position:relative;z-index:1;object-fit:contain;"
          />
          ${highlighted ? `
          <!-- Highlighted ring pulse -->
          <div style="
            position:absolute; inset:-5px; border-radius:50%;
            border:2px solid ${col}66;
            animation:sgmap-ring-expand 1.6s ease-out infinite;
          "></div>` : ''}
        </div>
        <!-- Connector dot -->
        <div style="
          width:3px; height:8px;
          background:linear-gradient(180deg,${col},transparent);
          margin-top:-1px;
        "></div>
        <!-- ETA chip -->
        <div style="
          background:${col};
          color:#050D1A;
          font-size:9.5px; font-weight:900;
          padding:3px 10px; border-radius:20px;
          font-family:'Inter',sans-serif;
          white-space:nowrap;
          box-shadow:0 2px 12px rgba(0,0,0,0.7), 0 0 8px ${col}55;
          letter-spacing:0.5px;
          line-height:1;
        ">${eta}</div>
      </div>`,
    iconSize: [52, 82],
    iconAnchor: [26, 82],
  });
}

/* ─────────────────────────────────────────────
   User "YOU" pin — pulsing GPS dot
───────────────────────────────────────────────── */
const USER_PIN_HTML = `
<div style="
  position:relative;
  width:46px; height:46px;
  display:flex; align-items:center; justify-content:center;
">
  <div class="sgmap-pulse-outer" style="
    position:absolute; width:46px; height:46px; border-radius:50%;
    border:2px solid #D4AF37; opacity:0.5;
  "></div>
  <div class="sgmap-pulse-mid" style="
    position:absolute; width:30px; height:30px; border-radius:50%;
    background:rgba(212,175,55,0.12);
  "></div>
  <div style="
    width:20px; height:20px; border-radius:50%;
    background:linear-gradient(135deg,#060e1a,#0e1f36); 
    border:3px solid #D4AF37;
    display:flex; align-items:center; justify-content:center;
    position:relative; z-index:1;
    box-shadow:0 0 16px rgba(212,175,55,0.6);
  ">
    <div style="width:8px;height:8px;border-radius:50%;background:#60A5FA;box-shadow:0 0 8px #60A5FA;"></div>
  </div>
  <div style="
    position:absolute; top:-26px; left:50%;
    transform:translateX(-50%);
    background:linear-gradient(135deg,#D4AF37,#F0C040); color:#050D1A;
    font-size:9px; font-weight:900;
    padding:3px 10px; border-radius:20px;
    font-family:'Inter',sans-serif;
    white-space:nowrap;
    box-shadow:0 3px 10px rgba(212,175,55,0.5);
    letter-spacing:1px;
  ">YOU ARE HERE</div>
</div>`;

const DEST_PIN_HTML = `
<div style="position:relative;width:36px;height:52px;display:flex;flex-direction:column;align-items:center;">
  <svg viewBox="0 0 36 52" width="36" height="52" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="pinGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M18 0 C8.06 0 0 8.06 0 18 C0 31.5 18 52 18 52 C18 52 36 31.5 36 18 C36 8.06 27.94 0 18 0Z"
      fill="#D4AF37" filter="url(#pinGlow)"/>
    <circle cx="18" cy="18" r="10" fill="#050D1A"/>
    <circle cx="18" cy="18" r="5" fill="#D4AF37"/>
    <path d="M15 15 L18 12 L21 15 L21 21 L18 24 L15 21 Z" fill="#050D1A" opacity="0.5"/>
  </svg>
  <div style="
    position:absolute; top:-22px; left:50%; transform:translateX(-50%);
    background:#E84040; color:white;
    font-size:9px; font-weight:900; padding:2px 8px; border-radius:20px;
    font-family:'Inter',sans-serif; white-space:nowrap;
    box-shadow:0 2px 8px rgba(232,64,64,0.5); letter-spacing:0.5px;
  ">DROP</div>
</div>`;

/* ─────────────────────────────────────────────
   Surge zone overlay helper
───────────────────────────────────────────────── */
function addSurgeZones(map: L.Map) {
  const zones: { center: [number, number]; radius: number; surge: string; color: string }[] = [
    { center: [12.9400, 77.6100], radius: 300, surge: "1.8x", color: "#E84040" },
    { center: [12.9280, 77.6200], radius: 200, surge: "1.3x", color: "#FFA500" },
    { center: [12.9450, 77.6300], radius: 250, surge: "1.5x", color: "#FF6B35" },
  ];

  zones.forEach(z => {
    const circle = L.circle(z.center, {
      radius: z.radius,
      color: z.color,
      fillColor: z.color,
      fillOpacity: 0.07,
      weight: 1.5,
      opacity: 0.4,
      dashArray: "6,4",
    }).addTo(map);

    const surgeIcon = L.divIcon({
      className: "",
      html: `<div style="
        background:${z.color}; color:white;
        font-size:10px; font-weight:900;
        padding:3px 8px; border-radius:20px;
        font-family:'Inter',sans-serif;
        box-shadow:0 2px 8px rgba(0,0,0,0.5);
        white-space:nowrap;
        opacity:0.9;
      ">⚡ Surge ${z.surge}</div>`,
      iconSize: [80, 24],
      iconAnchor: [40, 12],
    });
    L.marker(z.center, { icon: surgeIcon }).addTo(map);
  });
}

/* ─────────────────────────────────────────────
   Inject global CSS
───────────────────────────────────────────────── */
function injectCSS() {
  if (document.getElementById("sgmap-style")) return;
  const style = document.createElement("style");
  style.id = "sgmap-style";
  style.textContent = `
    @keyframes sgmap-pulse-outer {
      0%   { transform: scale(1);   opacity: 0.5; }
      70%  { transform: scale(2.0); opacity: 0;   }
      100% { transform: scale(2.0); opacity: 0;   }
    }
    @keyframes sgmap-pulse-mid {
      0%   { transform: scale(1); opacity:0.4; }
      50%  { transform: scale(1.4); opacity:0.1; }
      100% { transform: scale(1); opacity:0.4; }
    }
    @keyframes sgmap-vehicle-glow {
      0%,100% { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.6)); }
      50%      { filter: drop-shadow(0 4px 18px rgba(212,175,55,0.5)); }
    }
    @keyframes sgmap-badge-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(1.05); }
    }
    @keyframes sgmap-ring-expand {
      0%   { transform: scale(1);   opacity: 0.8; }
      100% { transform: scale(1.6); opacity: 0;   }
    }
    @keyframes sgmap-route-dash {
      to { stroke-dashoffset: -30; }
    }
    .sgmap-pulse-outer { animation: sgmap-pulse-outer 2.2s ease-out infinite; }
    .sgmap-pulse-mid   { animation: sgmap-pulse-mid   3s  ease-in-out infinite; }
    .leaflet-container {
      background: #060e1a !important;
      font-family: 'Inter', sans-serif !important;
    }
    .sgmap-tile { filter: brightness(0.88) saturate(0.8) hue-rotate(5deg); }
    .leaflet-control-zoom {
      border: 1px solid rgba(212,175,55,0.3) !important;
      background: rgba(5,13,26,0.9) !important;
      backdrop-filter: blur(12px);
      border-radius: 12px !important;
      overflow: hidden;
    }
    .leaflet-control-zoom a {
      background: transparent !important;
      color: #D4AF37 !important;
      border-bottom: 1px solid rgba(212,175,55,0.2) !important;
      font-size: 16px !important;
      line-height: 32px !important;
      width: 32px !important;
      height: 32px !important;
    }
    .leaflet-control-zoom a:hover {
      background: rgba(212,175,55,0.12) !important;
    }
    .sgmap-popup .leaflet-popup-content-wrapper {
      background: rgba(5,13,26,0.95) !important;
      border: 1px solid rgba(212,175,55,0.3) !important;
      border-radius: 16px !important;
      color: white !important;
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
    }
    .sgmap-popup .leaflet-popup-tip { background: rgba(5,13,26,0.95) !important; }
    .sgmap-popup .leaflet-popup-close-button { color: #D4AF37 !important; }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────────
   Animated route path canvas layer
───────────────────────────────────────────────── */
function addAnimatedRoute(map: L.Map, waypoints: [number, number][]) {
  // Glow shadow
  L.polyline(waypoints, {
    color: "rgba(212,175,55,0.18)",
    weight: 20,
    lineCap: "round",
    lineJoin: "round",
  }).addTo(map);

  // Outer glow
  L.polyline(waypoints, {
    color: "rgba(212,175,55,0.08)",
    weight: 30,
    lineCap: "round",
    lineJoin: "round",
  }).addTo(map);

  // Main route line
  L.polyline(waypoints, {
    color: "#D4AF37",
    weight: 5,
    lineCap: "round",
    lineJoin: "round",
  }).addTo(map);

  // Moving dash animation using SVG trick
  const animPoly = L.polyline(waypoints, {
    color: "rgba(255,255,255,0.8)",
    weight: 5,
    lineCap: "round",
    lineJoin: "round",
    dashArray: "12,18",
    dashOffset: "0",
  }).addTo(map);

  // Animate dash via interval
  let offset = 0;
  const interval = setInterval(() => {
    offset -= 2;
    (animPoly as any).setStyle({ dashOffset: `${offset}` });
  }, 60);

  return { animPoly, interval };
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────── */
export const MapBackground = ({
  height = "100%",
  showRoute = false,
  showDriverPin = false,
  showDestPin = false,
  onMapReady,
  interactive = true,
  userLat,
  userLng,
  destLat,
  destLng,
  trackedDriverId = null,
  mode = "idle",
}: MapBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<{ animPoly: L.Polyline; interval: ReturnType<typeof setInterval> } | null>(null);
  const userPinRef = useRef<L.Marker | null>(null);
  const destPinRef = useRef<L.Marker | null>(null);
  const vehicleMarkersRef = useRef<Map<number, L.Marker>>(new Map());
  const animFrameRef = useRef<number>(0);
  const vehiclePositionsRef = useRef<[number, number][]>(BASE_VEHICLES.map(v => [...v.pos] as [number, number]));

  /* ── Init map ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    injectCSS();

    const center: [number, number] = (userLat && userLng) ? [userLat, userLng] : DEFAULT_CENTER;

    const map = L.map(containerRef.current, {
      center,
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: interactive,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
    });

    /* CartoDB Dark Matter — premium dark map tiles */
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", maxZoom: 20, className: "sgmap-tile" }
    ).addTo(map);

    /* Attribution */
    L.control.attribution({ position: "bottomright", prefix: "" })
      .addAttribution('<span style="color:rgba(255,255,255,0.15);font-size:9px">© CartoDB · OSM</span>')
      .addTo(map);

    /* Surge zones */
    addSurgeZones(map);

    mapRef.current = map;
    onMapReady?.(map);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (routeLayersRef.current) clearInterval(routeLayersRef.current.interval);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* ── Vehicle markers with animation ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old
    vehicleMarkersRef.current.forEach((m: L.Marker) => m.remove());
    vehicleMarkersRef.current.clear();
    cancelAnimationFrame(animFrameRef.current);

    if (!showDriverPin && !showRoute) return;

    // Add vehicle markers
    BASE_VEHICLES.forEach(v => {
      const isTracked = trackedDriverId === v.id;
      const icon = makePinIcon(v.type, v.eta, v.rotation, isTracked);
      const marker = L.marker(v.pos, { icon, zIndexOffset: isTracked ? 1000 : 0 });

      // Popup with driver info
      const colors = { car: "#D4AF37", auto: "#4ECDC4", bike: "#A78BFA" };
      const col = colors[v.type];
      const typeLabel = v.type === "car" ? "🚗 Car" : v.type === "auto" ? "🛺 Auto" : "🏍️ Bike";
      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif;min-width:180px;padding:4px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="width:40px;height:40px;border-radius:50%;background:rgba(212,175,55,0.15);border:2px solid ${col};display:flex;align-items:center;justify-content:center;font-size:20px;">
              ${v.type === "car" ? "🧑" : v.type === "auto" ? "👨" : "🏃"}
            </div>
            <div>
              <div style="font-weight:800;font-size:14px;color:white;">${v.name}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.45);">${typeLabel}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;">
            <div style="text-align:center;background:rgba(255,255,255,0.05);border-radius:8px;padding:6px;">
              <div style="color:${col};font-weight:800;font-size:13px;">${v.eta}</div>
              <div style="color:rgba(255,255,255,0.35);font-size:9px;">ETA</div>
            </div>
            <div style="text-align:center;background:rgba(255,255,255,0.05);border-radius:8px;padding:6px;">
              <div style="color:${col};font-weight:800;font-size:13px;">${v.rating}⭐</div>
              <div style="color:rgba(255,255,255,0.35);font-size:9px;">Rating</div>
            </div>
            <div style="text-align:center;background:rgba(255,255,255,0.05);border-radius:8px;padding:6px;">
              <div style="color:${col};font-weight:800;font-size:13px;">${v.price}</div>
              <div style="color:rgba(255,255,255,0.35);font-size:9px;">Fare</div>
            </div>
          </div>
          <button style="width:100%;padding:8px;background:linear-gradient(135deg,#D4AF37,#F0C040);color:#050D1A;border:none;border-radius:10px;font-weight:800;font-size:13px;cursor:pointer;">
            Book Now ✓
          </button>
        </div>
      `, { className: "sgmap-popup", maxWidth: 220 });

      marker.addTo(map);
      vehicleMarkersRef.current.set(v.id, marker);
    });

    // Animate vehicles
    let t = 0;
    const tick = () => {
      t += 0.004;
      vehicleMarkersRef.current.forEach((marker: L.Marker, id: number) => {
        const base = BASE_VEHICLES.find(v => v.id === id)!;
        const dx = Math.sin(t * 0.8 + id * 1.2) * 0.00015;
        const dy = Math.cos(t * 1.0 + id * 0.9) * 0.00012;
        marker.setLatLng([base.pos[0] + dy, base.pos[1] + dx]);
      });
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [showDriverPin, showRoute, trackedDriverId]);

  /* ── User pin ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    userPinRef.current?.remove();

    if (!showDriverPin) return;

    const center: [number, number] = (userLat && userLng) ? [userLat, userLng] : DEFAULT_CENTER;
    const icon = L.divIcon({ className: "", html: USER_PIN_HTML, iconSize: [46, 72], iconAnchor: [23, 66] });
    userPinRef.current = L.marker(center, { icon, zIndexOffset: 2000 }).addTo(map);
  }, [showDriverPin, userLat, userLng]);

  /* ── Destination pin ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    destPinRef.current?.remove();

    if (!showDestPin) return;

    const dest: [number, number] = (destLat && destLng) ? [destLat, destLng] : DEST_LOCATION;
    const icon = L.divIcon({ className: "", html: DEST_PIN_HTML, iconSize: [36, 52], iconAnchor: [18, 52] });
    destPinRef.current = L.marker(dest, { icon, zIndexOffset: 1500 }).addTo(map);
  }, [showDestPin, destLat, destLng]);

  /* ── Route polyline with animation ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clean up old route
    if (routeLayersRef.current) {
      clearInterval(routeLayersRef.current.interval);
      routeLayersRef.current.animPoly.remove();
      routeLayersRef.current = null;
    }
    // Also clean up old glow polys — done by tracking them
    map.eachLayer((layer: L.Layer) => {
      if ((layer as any)._isRouteLayer) map.removeLayer(layer);
    });

    if (!showRoute) return;

    const waypoints = ROUTE_WAYPOINTS;

    // Glow shadow
    const g1 = L.polyline(waypoints, { color: "rgba(212,175,55,0.15)", weight: 22, lineCap: "round", lineJoin: "round" }).addTo(map);
    const g2 = L.polyline(waypoints, { color: "rgba(212,175,55,0.08)", weight: 32, lineCap: "round", lineJoin: "round" }).addTo(map);
    // Main solid
    const mainPoly = L.polyline(waypoints, { color: "#D4AF37", weight: 5, lineCap: "round", lineJoin: "round" }).addTo(map);
    // Moving dashes
    const animPoly = L.polyline(waypoints, {
      color: "rgba(255,255,255,0.75)",
      weight: 5,
      lineCap: "round",
      lineJoin: "round",
      dashArray: "14,20",
      dashOffset: "0",
    }).addTo(map);

    (g1 as any)._isRouteLayer = true;
    (g2 as any)._isRouteLayer = true;
    (mainPoly as any)._isRouteLayer = true;

    let offset = 0;
    const interval = setInterval(() => {
      offset -= 2;
      (animPoly as any).setStyle({ dashOffset: `${offset}` });
    }, 50);

    routeLayersRef.current = { animPoly, interval };

    map.fitBounds(mainPoly.getBounds(), { padding: [60, 60], animate: true, duration: 1.2 });
  }, [showRoute]);

  /* ── Fit to user when no route ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || showRoute) return;
    const center: [number, number] = (userLat && userLng) ? [userLat, userLng] : DEFAULT_CENTER;
    map.setView(center, 15, { animate: true, duration: 1 });
  }, [showRoute, userLat, userLng]);

  /* ── Mode pulse effect ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || mode !== "seeking") return;

    // Add expanding rings around user location
    const center: [number, number] = (userLat && userLng) ? [userLat, userLng] : DEFAULT_CENTER;
    const rings: L.Circle[] = [];
    const radii = [80, 160, 260];
    radii.forEach((r, i) => {
      const ring = L.circle(center, {
        radius: r,
        color: "#D4AF37",
        fillColor: "#D4AF37",
        fillOpacity: 0.04 - i * 0.01,
        weight: 1,
        opacity: 0.3 - i * 0.07,
        dashArray: "5,8",
      }).addTo(map);
      rings.push(ring);
    });

    return () => rings.forEach(r => r.remove());
  }, [mode, userLat, userLng]);

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      {/* Leaflet container */}
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
      />

      {/* Premium vignette */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(6,14,26,0.55) 100%)",
          borderRadius: "inherit",
          zIndex: 500,
        }}
      />

      {/* Corner gradient accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 80,
        pointerEvents: "none", zIndex: 499,
        background: "linear-gradient(180deg, rgba(6,14,26,0.4) 0%, transparent 100%)",
        borderRadius: "inherit",
      }} />

      {/* Vehicle Legend */}
      {(showDriverPin || showRoute) && (
        <div
          style={{
            position: "absolute", bottom: 14, left: 14,
            display: "flex", gap: 6, flexWrap: "wrap",
            zIndex: 1000,
          }}
        >
          {[
            { col: "#D4AF37", label: "🚗 Car", count: 3 },
            { col: "#4ECDC4", label: "🛺 Auto", count: 2 },
            { col: "#A78BFA", label: "🏍️ Bike", count: 3 },
          ].map(({ col, label, count }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(6,14,26,0.88)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${col}44`,
              borderRadius: 999,
              padding: "4px 12px",
              fontSize: 10, fontWeight: 700, color: col,
              fontFamily: "'Inter',sans-serif",
              boxShadow: `0 2px 10px rgba(0,0,0,0.5), 0 0 8px ${col}22`,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: col, display: "inline-block", boxShadow: `0 0 6px ${col}` }} />
              {label}
              <span style={{ opacity: 0.6 }}>·{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Surge legend */}
      {(showDriverPin || showRoute) && (
        <div style={{
          position: "absolute", bottom: 44, right: 14, zIndex: 1000,
          background: "rgba(6,14,26,0.85)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(232,64,64,0.3)", borderRadius: 10,
          padding: "6px 10px",
          fontFamily: "'Inter',sans-serif",
          fontSize: 10, color: "rgba(255,255,255,0.6)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#E84040", opacity: 0.8 }} />
            <span>Surge zones active</span>
          </div>
        </div>
      )}

      {/* Live indicator */}
      {showDriverPin && (
        <div style={{
          position: "absolute", top: 12, right: 14, zIndex: 1000,
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(6,14,26,0.88)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(212,175,55,0.3)", borderRadius: 20,
          padding: "5px 12px",
          fontFamily: "'Inter',sans-serif", fontSize: 11, color: "#D4AF37", fontWeight: 700,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#4ade80",
            boxShadow: "0 0 8px #4ade80", display: "inline-block",
            animation: "none",
          }} />
          LIVE
        </div>
      )}
    </div>
  );
};
