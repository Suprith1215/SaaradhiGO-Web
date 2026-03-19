import { useState } from "react";

export default function RideSearch({ onSearch }: { onSearch: (pickup: string, drop: string) => void }) {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const handleSearch = () => {
    onSearch(pickup, drop);
  };

  return (
    <div className="search-box" style={{ 
        position: "absolute", top: 20, left: 20, zIndex: 1000,
        background: "white", padding: 20, borderRadius: 16, width: 340,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)", color: "black"
    }}>
      <h3 style={{ margin: "0 0 15px 0", fontWeight: 800 }}>Search Ride</h3>
      <div style={{ marginBottom: 10 }}>
          <input
            placeholder="Pickup location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginBottom: 10, outline: "none" }}
          />

          <input
            placeholder="Drop location"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginBottom: 15, outline: "none" }}
          />
      </div>

      <button 
        onClick={handleSearch}
        style={{ width: "100%", padding: 14, borderRadius: 8, border: "none", background: "#D4AF37", color: "white", fontWeight: 800, cursor: "pointer" }}
      >
        Find Ride
      </button>
    </div>
  );
}
