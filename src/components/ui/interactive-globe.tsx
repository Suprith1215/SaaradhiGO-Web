"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback } from "react";

interface GlobeProps {
    className?: string;
    size?: number;
    dotColor?: string;
    arcColor?: string;
    markerColor?: string;
    autoRotateSpeed?: number;
    connections?: { from: [number, number]; to: [number, number] }[];
    markers?: { lat: number; lng: number; label?: string }[];
}

// 17 Indian city names — Fibonacci-lattice spread covers ALL directions of the sphere
const DEFAULT_MARKERS = [
    // Far north
    { lat: 80.0, lng: 0.0, label: "Delhi" },
    { lat: 73.0, lng: 110.0, label: "Chandigarh" },
    { lat: 68.0, lng: -110.0, label: "Jaipur" },
    // Upper mid
    { lat: 47.0, lng: 55.0, label: "Lucknow" },
    { lat: 43.0, lng: -45.0, label: "Surat" },
    { lat: 38.0, lng: 165.0, label: "Bhubaneswar" },
    { lat: 33.0, lng: -160.0, label: "Ahmedabad" },
    // Equatorial belt
    { lat: 12.0, lng: 20.0, label: "Mumbai" },
    { lat: 8.0, lng: 115.0, label: "Nagpur" },
    { lat: 2.0, lng: -70.0, label: "Indore" },
    { lat: -4.0, lng: -165.0, label: "Hyderabad" },
    // Lower mid
    { lat: -28.0, lng: 40.0, label: "Chennai" },
    { lat: -32.0, lng: -30.0, label: "Bengaluru" },
    { lat: -36.0, lng: 130.0, label: "Pune" },
    { lat: -42.0, lng: -130.0, label: "Visakhapatnam" },
    // Far south
    { lat: -62.0, lng: 75.0, label: "Kochi" },
    { lat: -68.0, lng: -60.0, label: "Kolkata" },
];

const DEFAULT_CONNECTIONS: { from: [number, number]; to: [number, number] }[] = [
    { from: [80.0, 0.0], to: [47.0, 55.0] },  // Delhi → Lucknow
    { from: [80.0, 0.0], to: [43.0, -45.0] },  // Delhi → Surat
    { from: [73.0, 110.0], to: [38.0, 165.0] },  // Chandigarh → Bhubaneswar
    { from: [47.0, 55.0], to: [12.0, 20.0] },  // Lucknow → Mumbai
    { from: [43.0, -45.0], to: [2.0, -70.0] },  // Surat → Indore
    { from: [12.0, 20.0], to: [-28.0, 40.0] },  // Mumbai → Chennai
    { from: [8.0, 115.0], to: [-36.0, 130.0] },  // Nagpur → Pune
    { from: [-28.0, 40.0], to: [-32.0, -30.0] },  // Chennai → Bengaluru
    { from: [-32.0, -30.0], to: [-62.0, 75.0] },  // Bengaluru → Kochi
    { from: [-62.0, 75.0], to: [-68.0, -60.0] },  // Kochi → Kolkata
    { from: [-42.0, -130.0], to: [-4.0, -165.0] },  // Visakhapatnam → Hyderabad
    { from: [68.0, -110.0], to: [33.0, -160.0] },  // Jaipur → Ahmedabad
];

function latLngToXYZ(lat: number, lng: number, radius: number): [number, number, number] {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lng + 180) * Math.PI) / 180;
    return [
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
    ];
}

function rotateY(x: number, y: number, z: number, angle: number): [number, number, number] {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [x * cos + z * sin, y, -x * sin + z * cos];
}

function rotateX(x: number, y: number, z: number, angle: number): [number, number, number] {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [x, y * cos - z * sin, y * sin + z * cos];
}

function project(x: number, y: number, z: number, cx: number, cy: number, fov: number): [number, number, number] {
    const scale = fov / (fov + z);
    return [x * scale + cx, y * scale + cy, z];
}

export function Globe({
    className,
    size = 600,
    dotColor = "rgba(255, 210, 60, ALPHA)",
    arcColor = "rgba(212, 175, 55, 0.6)",
    markerColor = "rgba(255, 220, 80, 1)",
    autoRotateSpeed = 0.002,
    connections = DEFAULT_CONNECTIONS,
    markers = DEFAULT_MARKERS,
}: GlobeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rotYRef = useRef(0.4);
    const rotXRef = useRef(0.3);
    const dragRef = useRef<{ active: boolean; startX: number; startY: number; startRotY: number; startRotX: number; }>
        ({ active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 });
    const animRef = useRef<number>(0);
    const timeRef = useRef(0);
    const dotsRef = useRef<[number, number, number][]>([]);

    useEffect(() => {
        const dots: [number, number, number][] = [];
        const numDots = 1600;
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        for (let i = 0; i < numDots; i++) {
            const theta = (2 * Math.PI * i) / goldenRatio;
            const phi = Math.acos(1 - (2 * (i + 0.5)) / numDots);
            dots.push([
                Math.cos(theta) * Math.sin(phi),
                Math.cos(phi),
                Math.sin(theta) * Math.sin(phi),
            ]);
        }
        dotsRef.current = dots;
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);

        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) * 0.38;
        const fov = 600;

        if (!dragRef.current.active) rotYRef.current += autoRotateSpeed;
        timeRef.current += 0.015;
        const time = timeRef.current;

        ctx.clearRect(0, 0, w, h);

        // Outer atmospheric glow
        const atmoGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.3);
        atmoGrad.addColorStop(0, "rgba(212, 175, 55, 0.06)");
        atmoGrad.addColorStop(0.5, "rgba(212, 175, 55, 0.02)");
        atmoGrad.addColorStop(1, "transparent");
        ctx.fillStyle = atmoGrad;
        ctx.fillRect(0, 0, w, h);

        // Globe base circle with subtle gradient fill
        const globeGrad = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.2, 0, cx, cy, radius);
        globeGrad.addColorStop(0, "rgba(30, 58, 95, 0.25)");
        globeGrad.addColorStop(1, "rgba(5, 13, 26, 0.4)");
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = globeGrad;
        ctx.fill();

        // Globe outline glow
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.18)";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(212, 175, 55, 0.3)";
        ctx.stroke();
        ctx.shadowBlur = 0;

        const ry = rotYRef.current;
        const rx = rotXRef.current;

        // Draw dots with glow
        const dots = dotsRef.current;
        for (let i = 0; i < dots.length; i++) {
            let [x, y, z] = dots[i];
            x *= radius;
            y *= radius;
            z *= radius;
            [x, y, z] = rotateX(x, y, z, rx);
            [x, y, z] = rotateY(x, y, z, ry);

            if (z > 0) continue;

            const [sx, sy] = project(x, y, z, cx, cy, fov);
            // depthAlpha: front dots bright (0.9), back dots dim (0.15)
            const depthAlpha = Math.max(0.15, 0.9 - ((z + radius) / (2 * radius)) * 0.75);
            const dotSize = 1.0 + depthAlpha * 1.2;

            // Glowing dot: glow halo + bright core
            if (depthAlpha > 0.55) {
                // Draw soft glow halo for front-facing dots
                const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, dotSize * 3);
                grd.addColorStop(0, dotColor.replace("ALPHA", (depthAlpha * 0.6).toFixed(2)));
                grd.addColorStop(1, "transparent");
                ctx.beginPath();
                ctx.arc(sx, sy, dotSize * 3, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();
            }

            // Bright dot core
            ctx.beginPath();
            ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = dotColor.replace("ALPHA", depthAlpha.toFixed(2));
            ctx.fill();
        }

        // Draw arcs
        for (const conn of connections) {
            const [lat1, lng1] = conn.from;
            const [lat2, lng2] = conn.to;

            let [x1, y1, z1] = latLngToXYZ(lat1, lng1, radius);
            let [x2, y2, z2] = latLngToXYZ(lat2, lng2, radius);
            [x1, y1, z1] = rotateX(x1, y1, z1, rx);
            [x1, y1, z1] = rotateY(x1, y1, z1, ry);
            [x2, y2, z2] = rotateX(x2, y2, z2, rx);
            [x2, y2, z2] = rotateY(x2, y2, z2, ry);

            if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;

            const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
            const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);

            const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2, midZ = (z1 + z2) / 2;
            const midLen = Math.sqrt(midX * midX + midY * midY + midZ * midZ);
            const arcH = radius * 1.28;
            const [scx, scy] = project((midX / midLen) * arcH, (midY / midLen) * arcH, (midZ / midLen) * arcH, cx, cy, fov);

            ctx.beginPath();
            ctx.moveTo(sx1, sy1);
            ctx.quadraticCurveTo(scx, scy, sx2, sy2);
            ctx.strokeStyle = arcColor;
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 4;
            ctx.shadowColor = "rgba(212,175,55,0.4)";
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Traveling dot
            const t = (Math.sin(time * 1.2 + lat1 * 0.1) + 1) / 2;
            const tx = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * scx + t * t * sx2;
            const ty = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * scy + t * t * sy2;
            ctx.beginPath();
            ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = markerColor;
            ctx.shadowBlur = 8;
            ctx.shadowColor = markerColor;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Draw markers with glowing labels
        for (const marker of markers) {
            let [x, y, z] = latLngToXYZ(marker.lat, marker.lng, radius);
            [x, y, z] = rotateX(x, y, z, rx);
            [x, y, z] = rotateY(x, y, z, ry);

            if (z > radius * 0.1) continue;

            const [sx, sy] = project(x, y, z, cx, cy, fov);

            // Pulse ring
            const pulse = Math.sin(time * 2 + marker.lat) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(sx, sy, 5 + pulse * 5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.15 + pulse * 0.15})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Core marker dot with glow
            ctx.beginPath();
            ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = markerColor;
            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
            ctx.fill();
            ctx.shadowBlur = 0;

            // Label — pushed outward along direction from globe center
            if (marker.label) {
                const dx = sx - cx;
                const dy = sy - cy;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const ox = (dx / dist) * 42;
                const oy = (dy / dist) * 42;
                const lx = sx + ox;
                const ly = sy + oy;

                // Connector line
                ctx.beginPath();
                ctx.moveTo(sx + (dx / dist) * 5, sy + (dy / dist) * 5);
                ctx.lineTo(lx, ly);
                ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
                ctx.lineWidth = 0.8;
                ctx.stroke();

                // Label text — bright yellow, bold
                ctx.font = "bold 13px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255, 215, 0, 0.95)";
                ctx.shadowBlur = 6;
                ctx.shadowColor = "rgba(255, 200, 0, 0.5)";
                ctx.textAlign = dx > 0 ? "left" : "right";
                ctx.fillText(marker.label, lx + (dx > 0 ? 4 : -4), ly + (dy > 0 ? 5 : -2));
                ctx.shadowBlur = 0;
                ctx.textAlign = "left";
            }
        }

        animRef.current = requestAnimationFrame(draw);
    }, [dotColor, arcColor, markerColor, autoRotateSpeed, connections, markers]);

    useEffect(() => {
        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, [draw]);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, startRotY: rotYRef.current, startRotX: rotXRef.current };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragRef.current.active) return;
        rotYRef.current = dragRef.current.startRotY + (e.clientX - dragRef.current.startX) * 0.005;
        rotXRef.current = Math.max(-1, Math.min(1, dragRef.current.startRotX + (e.clientY - dragRef.current.startY) * 0.005));
    }, []);

    const onPointerUp = useCallback(() => { dragRef.current.active = false; }, []);

    return (
        <canvas
            ref={canvasRef}
            className={cn("w-full h-full cursor-grab active:cursor-grabbing", className)}
            style={{ width: size, height: size }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        />
    );
}
