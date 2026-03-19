import { useState, useEffect, useCallback } from "react";
import { socketService } from "./socketService";

export type RideStatus = "idle" | "searching" | "accepted" | "arrived" | "riding" | "ended" | "cancelled";

export interface ChatMessage {
    id: string;
    sender: "rider" | "driver";
    text: string;
    timestamp: number;
}

export interface RideSession {
    id: string;
    status: RideStatus;
    pickup: string;
    pickup_lat?: number;
    pickup_lng?: number;
    drop: string;
    dest_lat?: number;
    dest_lng?: number;
    fare: string;
    distance: string;
    eta: string;
    type: string;
    driverId?: string;
    riderId?: string;
    riderName?: string;
    riderAge?: string;
    riderGender?: string;
    messages: ChatMessage[];
}

const STORAGE_KEY = "saaradhi_live_ride";

export function useRideSimulation() {
    const [session, setSession] = useState<RideSession | null>(null);

    const updateSession = useCallback((newSession: RideSession | null) => {
        if (newSession) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
        setSession(newSession);
        window.dispatchEvent(new Event("ride_update"));
    }, []);

    // Handle WebSocket messages
    const onMainMessage = useCallback((data: any) => {
        console.log("WS Main Message:", data);
        if (data.type === "ride.request" && data.ride_details) {
            // This is usually for drivers, but if rider gets it as ack:
            // updateSession({ ...session!, id: data.ride_details.trip_id, status: "searching" });
        }
        
        // If we are matched (backend broadcasts this when driver accepts)
        if (data.type === "trip_update" || data.status === "accepted") {
            const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
            if (current) {
                const updated = { 
                    ...current, 
                    status: data.status || "accepted", 
                    driverId: data.driver_id || data.driver?.id,
                    driverName: data.driver_name || data.driver?.full_name || data.driver?.name,
                    id: data.trip_id || current.id
                };
                updateSession(updated);
                
                // Connect to trip-specific socket if we haven't
                if (updated.id) {
                    socketService.connectTrip(updated.id, onTripMessage);
                }
            }
        }
    }, [updateSession]);

    const onTripMessage = useCallback((data: any) => {
        console.log("WS Trip Message:", data);
        const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (!current) return;

        if (data.type === "trip_update" || data.status) {
            const statusMap: Record<string, RideStatus> = {
                "accepted": "accepted",
                "arriving": "accepted", // UI handles 'matched' state
                "in_progress": "riding",
                "completed": "ended",
                "cancelled": "cancelled"
            };
            
            const newStatus = statusMap[data.status] || data.status;
            updateSession({ ...current, status: newStatus as RideStatus });
        }
        
        if (data.type === "location_update" && data.latitude) {
            // Internal update for driver position if needed
        }
    }, [updateSession]);

    // Initial load and connection
    useEffect(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            setSession(parsed);
            if (parsed.status !== "idle" && parsed.status !== "ended") {
                socketService.connectRideRequest(onMainMessage);
                if (parsed.id) socketService.connectTrip(parsed.id, onTripMessage);
            }
        }

        return () => {
            socketService.disconnectAll();
        };
    }, []);

    const requestRide = (req: Partial<RideSession>) => {
        const newRide: RideSession = {
            id: Date.now().toString(),
            status: "searching",
            pickup: req.pickup || "Unknown",
            drop: req.drop || "Unknown",
            fare: req.fare || "₹0",
            distance: req.distance || "5.0 km",
            eta: req.eta || "3 min",
            type: req.type || "Mini",
            messages: [],
            ...req
        };
        updateSession(newRide);
        
        // Actual Backend Call
        socketService.connectRideRequest(onMainMessage);
        socketService.sendRideRequest({
            pickup_lat: req.pickup_lat || 12.93, // Fallback coords
            pickup_lng: req.pickup_lng || 77.62,
            destination_lat: req.dest_lat || 12.97,
            destination_lng: req.dest_lng || 77.61,
            distance_km: parseFloat(req.distance || "5.0"),
            duration_min: parseInt(req.eta || "15"),
            vehicle_type: (req.type || "car").toLowerCase()
        });
    };

    const setStatus = (status: RideStatus) => {
        if (session) {
            updateSession({ ...session, status });
            // If it's a driver action, we'd send via trip socket
            if (status === "cancelled") socketService.sendTripAction("cancel");
        }
    };

    const cancelRide = () => {
        socketService.sendTripAction("cancel");
        updateSession(null);
    };

    const acceptRide = (driverId: string, tripId?: string) => {
        if (session || tripId) {
            const tid = tripId || session?.id;
            const updated = { ...(session || {}), status: "accepted" as RideStatus, driverId, id: tid } as RideSession;
            updateSession(updated);
            
            if (tid) {
                // Connect and then send accept action
                socketService.connectTrip(tid, onTripMessage);
                // Give it a tiny bit of time to connect
                setTimeout(() => {
                    socketService.sendTripAction("accept");
                }, 500);
            }
        }
    };

    const endRide = () => {
        if (session) {
            updateSession({ ...session, status: "ended" as RideStatus });
            socketService.disconnectAll();
        }
    };

    return {
        session,
        requestRide,
        setStatus,
        cancelRide,
        acceptRide,
        endRide,
        updateSession
    };
}

