import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useState, useEffect } from "react";
import { getCoordinates, getRoute } from "../../services/mapService";
import RideSearch from "./RideSearch";
import "leaflet/dist/leaflet.css";

export default function RideMap() {
  const [pickup, setPickup] = useState<[number, number] | null>(null);
  const [drop, setDrop] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [eta, setEta] = useState<string | null>(null);
  const [driver, setDriver] = useState<[number, number]>([17.39, 78.48]);

  const handleSearch = async (pickupPlace: string, dropPlace: string) => {
    try {
        const start = await getCoordinates(pickupPlace);
        const end = await getCoordinates(dropPlace);

        setPickup(start);
        setDrop(end);

        const routeData = await getRoute(start, end);
        const coords = routeData.geometry.coordinates.map((c: any) => [c[1], c[0]]);

        setRoute(coords);
        setEta((routeData.duration / 60).toFixed(1));
    } catch (e) {
        alert("Location not found or routing error");
    }
  };

  // Driver moving toward rider (Simulation)
  useEffect(() => {
    if (pickup) {
      const interval = setInterval(() => {
        setDriver((prev) => [
          prev[0] + (pickup[0] - prev[0]) * 0.02,
          prev[1] + (pickup[1] - prev[1]) * 0.02,
        ]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [pickup]);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <RideSearch onSearch={handleSearch} />

      <MapContainer
        center={[17.385, 78.486]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        {pickup && <Marker position={pickup} />}
        {drop && <Marker position={drop} />}
        {driver && <Marker position={driver} />}

        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>

      {eta && (
        <div style={{
            position: "absolute", bottom: 20, right: 20, zIndex: 1000,
            background: "white", padding: 10, borderRadius: 8, color: "black", fontWeight: 700
        }}>
            ETA: {eta} minutes
        </div>
      )}
    </div>
  );
}
