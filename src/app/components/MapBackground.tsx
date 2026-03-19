import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ─── Advanced Route Mapping with Geocoding ─── */
interface MapBackgroundProps {
  height?: number | string;
  showRoute?: boolean;
  userLat?: number;
  userLng?: number;
  destLat?: number;
  destLng?: number;
  pickup?: string;
  drop?: string;
  mode?: "idle" | "seeking" | "matched" | "riding";
  externalDrivers?: any[];
  showDriverPin?: boolean;
  showDestPin?: boolean;
  interactive?: boolean;
  trackedDriverId?: string | number | null;
  onRouteInfo?: (info: { distance: string; duration: string; alternateRoutes: number }) => void;
}

const DEFAULT_CENTER: [number, number] = [17.385, 78.486]; // Hyderabad

export const MapBackground: React.FC<MapBackgroundProps> = ({
  height = "100vh",
  showRoute = false,
  userLat,
  userLng,
  destLat,
  destLng,
  pickup,
  drop,
  externalDrivers = [],
  showDriverPin = false,
  showDestPin = false,
  interactive = true,
  onRouteInfo
}) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.LayerGroup | null>(null);
  const [routeLines, setRouteLines] = useState<L.Polyline[]>([]);
  const [coords, setCoords] = useState<{ start: [number, number] | null; end: [number, number] | null }>({
    start: userLat && userLng ? [userLat, userLng] : null,
    end: destLat && destLng ? [destLat, destLng] : null
  });

  // Geocoding Helper
  const geocode = async (query: string): Promise<[number, number] | null> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (e) {
      console.error("Geocoding failed for:", query, e);
    }
    return null;
  };

  // Initialize Map
  useEffect(() => {
    const container = document.getElementById("leaflet-map-container-inner");
    if (!container || map) return;

    const instance = L.map(container, {
      center: DEFAULT_CENTER,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      dragging: interactive,
      scrollWheelZoom: interactive,
      touchZoom: interactive
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap'
    }).addTo(instance);

    const layerGroup = L.layerGroup().addTo(instance);
    setMap(instance);
    setMarkers(layerGroup);

    return () => {
      instance.remove();
    };
  }, [interactive]);

  // Handle String Locations (Hyderabad, Karimnagar, etc.)
  useEffect(() => {
    const resolveLocations = async () => {
      let start: [number, number] | null = userLat && userLng ? [userLat, userLng] : null;
      let end: [number, number] | null = destLat && destLng ? [destLat, destLng] : null;

      if (!start && pickup) {
        start = await geocode(pickup);
      }
      if (!end && drop) {
        end = await geocode(drop);
      }

      setCoords({ start, end });
    };
    resolveLocations();
  }, [userLat, userLng, destLat, destLng, pickup, drop]);

  // Update Markers and Route
  useEffect(() => {
    if (!map || !markers) return;

    markers.clearLayers();
    routeLines.forEach(line => map.removeLayer(line));
    setRouteLines([]);

    const carHtml = `<div style="width:30px; height:30px; background:#D4AF37; border:2px solid black; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px rgba(0,0,0,0.5);">🚗</div>`;
    const userHtml = `<div style="width:40px; height:40px; background:#60A5FA; border:3px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 0 15px #60A5FA;">👤</div>`;
    const destHtml = `<div style="width:40px; height:40px; background:#E84040; border:3px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 0 15px #E84040;">🏁</div>`;

    if (coords.start) {
      L.marker(coords.start, { icon: L.divIcon({ className: "", html: userHtml, iconSize: [40, 40], iconAnchor: [20, 20] }) }).addTo(markers);
      if (!coords.end) map.setView(coords.start, 14, { animate: true });
    }

    if (coords.end && (showDestPin || showRoute)) {
      L.marker(coords.end, { icon: L.divIcon({ className: "", html: destHtml, iconSize: [40, 40], iconAnchor: [20, 20] }) }).addTo(markers);
    }

    externalDrivers.forEach((d) => {
      const pos = d.lat && d.lng ? [d.lat, d.lng] : (d.pos || [0, 0]);
      L.marker(pos as [number, number], { icon: L.divIcon({ className: "", html: carHtml, iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(markers);
    });

    // Handle Route with Alternatives
    const updateRoute = async () => {
        if (showRoute && coords.start && coords.end) {
            try {
                const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords.start[1]},${coords.start[0]};${coords.end[1]},${coords.end[0]}?overview=full&geometries=geojson&alternatives=true`);
                const data = await res.json();
                
                if (data.routes && data.routes.length > 0) {
                  const newLines: L.Polyline[] = [];
                  
                  // Render alternative routes in faint gray
                  data.routes.slice(1).forEach((r: any) => {
                    const c = r.geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);
                    const line = L.polyline(c, { color: "#ffffff", weight: 4, opacity: 0.2, dashArray: "5, 10" }).addTo(map);
                    newLines.push(line);
                  });

                  // Render main route in gold
                  const mainCoords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
                  const mainLine = L.polyline(mainCoords, { color: "#D4AF37", weight: 6, opacity: 0.9 }).addTo(map);
                  newLines.push(mainLine);
                  
                  setRouteLines(newLines);
                  
                  const bounds = L.latLngBounds(mainCoords);
                  map.fitBounds(bounds, { padding: [50, 50] });

                  if (onRouteInfo) {
                    const dist = (data.routes[0].distance / 1000).toFixed(1) + " km";
                    const dura = Math.round(data.routes[0].duration / 60) + " min";
                    onRouteInfo({ distance: dist, duration: dura, alternateRoutes: data.routes.length - 1 });
                  }
                }
            } catch (e) {
                console.error("OSRM failed", e);
            }
        }
    };
    updateRoute();

  }, [map, markers, coords.start, coords.end, showRoute, externalDrivers, showDestPin]);

  return (
    <div style={{ height, width: "100%", position: "relative", background: "#050D1A" }}>
      <div id="leaflet-map-container-inner" style={{ height: "100%", width: "100%" }} />
      {/* Glossy Overlay */}
      <div style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          boxShadow: "inset 0 0 80px rgba(0,0,0,0.6)",
          background: "radial-gradient(circle at center, transparent, rgba(5,13,26,0.3))"
      }} />
    </div>
  );
};
