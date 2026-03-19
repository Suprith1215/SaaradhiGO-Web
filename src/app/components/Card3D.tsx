import React, { useRef, useState } from "react";

interface Card3DProps {
    children: React.ReactNode;
    glowColor?: string;
    style?: React.CSSProperties;
    className?: string;
    intensity?: number;
    shimmer?: boolean;
    key?: React.Key;
}

export function Card3D({
    children,
    glowColor = "#D4AF37",
    style = {},
    className = "",
    intensity = 15,
    shimmer = true,
}: Card3DProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
    const [hovered, setHovered] = useState(false);
    const [shimmerPos, setShimmerPos] = useState(-100);
    const shimmerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r},${g},${b}`;
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        setTilt({ x: dy * -intensity, y: dx * intensity });
        setLightPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    const onMouseEnter = () => {
        setHovered(true);
        if (shimmer) {
            let pos = -150;
            shimmerRef.current = setInterval(() => {
                pos += 8;
                setShimmerPos(pos);
                if (pos > 250) {
                    clearInterval(shimmerRef.current!);
                    shimmerRef.current = null;
                }
            }, 16);
        }
    };

    const onMouseLeave = () => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
        setLightPos({ x: 50, y: 50 });
        if (shimmerRef.current) clearInterval(shimmerRef.current);
    };

    const rgb = hexToRgb(glowColor);

    return (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={className}
            style={{
                position: "relative",
                transformStyle: "preserve-3d",
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovered ? "scale(1.02)" : "scale(1)"}`,
                transition: hovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                cursor: "default",
                overflow: "hidden",
                borderRadius: 20,
                ...style,
            }}
        >
            {/* Dynamic inner highlight */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(${rgb},${hovered ? 0.12 : 0}), transparent 60%)`,
                    transition: hovered ? "none" : "opacity 0.4s",
                    zIndex: 1,
                    borderRadius: "inherit",
                }}
            />

            {/* Shimmer sweep */}
            {shimmer && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        overflow: "hidden",
                        borderRadius: "inherit",
                        zIndex: 2,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            width: 80,
                            left: shimmerPos + "%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
                            transform: "skewX(-20deg)",
                            transition: "none",
                        }}
                    />
                </div>
            )}

            {/* Glow border on hover */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    border: `1px solid rgba(${rgb},${hovered ? 0.5 : 0.12})`,
                    boxShadow: hovered
                        ? `0 0 0 1px rgba(${rgb},0.15), 0 20px 60px rgba(${rgb},0.15), 0 0 80px rgba(${rgb},0.05) inset`
                        : `0 0 0 1px rgba(${rgb},0.08)`,
                    transition: "all 0.4s ease",
                    pointerEvents: "none",
                    zIndex: 3,
                }}
            />

            {/* Content - lifted in 3D space */}
            <div style={{ position: "relative", zIndex: 4, transform: "translateZ(0px)" }}>
                {children}
            </div>
        </div>
    );
}
