import { RideStatus, ChatMessage, RideSession } from "./mockRealtime";

// Base WebSocket URL derived from the backend domain
const API_HOST = 'vahango-web-application.onrender.com';
const WS_BASE_URL = `wss://${API_HOST}/ws`;

class SocketService {
    private mainSocket: WebSocket | null = null;
    private tripSocket: WebSocket | null = null;
    private locationSocket: WebSocket | null = null;

    private getAuthToken() {
        const token = localStorage.getItem('access_token');
        if (!token) console.warn("Socket connection attempted without access token.");
        return token;
    }

    // 4.2 Rider Ride Requests
    connectRideRequest(onMessage: (data: any) => void) {
        const token = this.getAuthToken();
        if (!token) return;

        console.log(`[WS] Connecting to ride requests: ${WS_BASE_URL}/ride/request/`);
        this.mainSocket = new WebSocket(`${WS_BASE_URL}/ride/request/?token=${token}`);
        
        this.mainSocket.onopen = () => console.log("[WS] Ride request socket opened");
        
        this.mainSocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("[WS] Received ride message:", data);
                onMessage(data);
            } catch (e) {
                console.error("[WS] Error parsing ride message:", e);
            }
        };

        this.mainSocket.onclose = (e) => console.log("[WS] Main ride socket closed", e.code, e.reason);
        this.mainSocket.onerror = (err) => console.error("[WS] Ride Request Socket Error:", err);
    }

    sendRideRequest(details: {
        pickup_lat: number,
        pickup_lng: number,
        destination_lat: number,
        destination_lng: number,
        distance_km: number,
        duration_min: number,
        vehicle_type: string
    }) {
        if (this.mainSocket && this.mainSocket.readyState === WebSocket.OPEN) {
            const payload = { type: 'ride_request', ...details };
            console.log("[WS] Sending ride request:", payload);
            this.mainSocket.send(JSON.stringify(payload));
        } else {
            console.error("[WS] Cannot send ride request: Socket not open");
        }
    }

    // 4.3 Trip Status Updates
    connectTrip(tripId: string | number, onMessage: (data: any) => void) {
        const token = this.getAuthToken();
        if (!token) return;

        if (this.tripSocket) this.tripSocket.close();

        console.log(`[WS] Connecting to trip ${tripId}: ${WS_BASE_URL}/ride/trip/${tripId}/`);
        this.tripSocket = new WebSocket(`${WS_BASE_URL}/ride/trip/${tripId}/?token=${token}`);
        
        this.tripSocket.onopen = () => console.log(`[WS] Trip socket ${tripId} opened`);
        
        this.tripSocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("[WS] Received trip update:", data);
                onMessage(data);
            } catch (e) {
                console.error("[WS] Error parsing trip message:", e);
            }
        };

        this.tripSocket.onclose = (e) => console.log(`[WS] Trip socket ${tripId} closed`, e.code);
        this.tripSocket.onerror = (err) => console.error(`[WS] Trip Socket Error (${tripId}):`, err);
    }

    sendTripAction(action: 'accept' | 'arrive' | 'start' | 'complete' | 'cancel') {
        if (this.tripSocket && this.tripSocket.readyState === WebSocket.OPEN) {
            const payload = { action };
            console.log("[WS] Sending trip action:", payload);
            this.tripSocket.send(JSON.stringify(payload));
        } else {
            console.error("[WS] Cannot send trip action: Socket not open");
        }
    }

    // 4.1 Drivers Location Tracking
    connectDriverLocation() {
        const token = this.getAuthToken();
        if (!token) return;

        console.log(`[WS] Connecting to driver location: ${WS_BASE_URL}/driver/location/`);
        this.locationSocket = new WebSocket(`${WS_BASE_URL}/driver/location/?token=${token}`);
        
        this.locationSocket.onopen = () => console.log("[WS] Driver location socket opened");
        this.locationSocket.onclose = () => console.log("[WS] Driver location socket closed");
        this.locationSocket.onerror = (err) => console.error("[WS] Location Socket Error:", err);
    }

    updateDriverLocation(lat: number, lng: number) {
        if (this.locationSocket && this.locationSocket.readyState === WebSocket.OPEN) {
            const payload = {
                type: 'location_update',
                latitude: lat,
                longitude: lng
            };
            // No console.log here to avoid spamming the console 
            this.locationSocket.send(JSON.stringify(payload));
        }
    }

    disconnectAll() {
        console.log("[WS] Disconnecting all sockets");
        this.mainSocket?.close();
        this.tripSocket?.close();
        this.locationSocket?.close();
    }
}

export const socketService = new SocketService();
