
/**
 * Geocoding using Nominatim (OpenStreetMap)
 */
export async function getCoordinates(place: string): Promise<[number, number]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    throw new Error("Location not found");
  } catch (error) {
    console.error("Geocoding error:", error);
    // Fallback to a default if it's a known city or just throw
    throw error;
  }
}

/**
 * Routing using OSRM API
 */
export async function getRoute(start: [number, number], end: [number, number]) {
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0];
    }
    throw new Error("No route found");
  } catch (error) {
    console.error("Routing error:", error);
    throw error;
  }
}
