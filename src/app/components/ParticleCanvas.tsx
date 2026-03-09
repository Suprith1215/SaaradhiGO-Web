import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
    pulse: number;
    pulseSpeed: number;
}

interface ParticleCanvasProps {
    particleCount?: number;
    colors?: string[];
    maxConnection?: number;
    style?: React.CSSProperties;
}

export function ParticleCanvas({
    particleCount = 80,
    colors = ["#D4AF37", "#60A5FA", "#A78BFA", "#34D399"],
    maxConnection = 120,
    style = {}
}: ParticleCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animRef = useRef<number>(0);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        const init = () => {
            particlesRef.current = Array.from({ length: particleCount }, () => ({
                x: Math.random() * canvas.offsetWidth,
                y: Math.random() * canvas.offsetHeight,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2.5 + 0.8,
                opacity: Math.random() * 0.6 + 0.2,
                color: colors[Math.floor(Math.random() * colors.length)],
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
            }));
        };

        const hexToRgb = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `${r},${g},${b}`;
        };

        const draw = () => {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            particlesRef.current.forEach((p, i) => {
                // Mouse influence
                const dx = mx - p.x;
                const dy = my - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    p.vx -= (dx / dist) * 0.03;
                    p.vy -= (dy / dist) * 0.03;
                }

                p.pulse += p.pulseSpeed;
                p.x += p.vx;
                p.y += p.vy;

                // Damp velocity
                p.vx *= 0.99;
                p.vy *= 0.99;

                // Add base drift
                if (Math.abs(p.vx) < 0.2) p.vx += (Math.random() - 0.5) * 0.06;
                if (Math.abs(p.vy) < 0.2) p.vy += (Math.random() - 0.5) * 0.06;

                // Bounce
                if (p.x < 0) { p.x = 0; p.vx *= -1; }
                if (p.x > w) { p.x = w; p.vx *= -1; }
                if (p.y < 0) { p.y = 0; p.vy *= -1; }
                if (p.y > h) { p.y = h; p.vy *= -1; }

                // Draw connections
                for (let j = i + 1; j < particlesRef.current.length; j++) {
                    const q = particlesRef.current[j];
                    const ex = p.x - q.x;
                    const ey = p.y - q.y;
                    const ed = Math.sqrt(ex * ex + ey * ey);
                    if (ed < maxConnection) {
                        const alphaFade = 1 - ed / maxConnection;
                        const rgb = hexToRgb(p.color);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(${rgb},${alphaFade * 0.25})`;
                        ctx.lineWidth = alphaFade * 0.8;
                        ctx.stroke();
                    }
                }

                // Draw particle
                const pulseMag = Math.sin(p.pulse) * 0.3 + 0.7;
                const actualOpacity = p.opacity * pulseMag;
                const rgb = hexToRgb(p.color);

                // Glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb},${actualOpacity * 0.08})`;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb},${actualOpacity})`;
                ctx.fill();
            });

            animRef.current = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const handleMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

        resize();
        init();
        draw();

        const ro = new ResizeObserver(() => { resize(); init(); });
        ro.observe(canvas);

        window.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            cancelAnimationFrame(animRef.current);
            ro.disconnect();
            window.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [particleCount, maxConnection]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                pointerEvents: "none",
                ...style
            }}
        />
    );
}
