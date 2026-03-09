import { readFileSync, writeFileSync } from 'fs';

let code = readFileSync('src/app/screens/CustomerAuthPage.tsx', 'utf-8');

// Add 3D CSS
code = code.replace(".btn-premium:hover { transform: scale(1.05); box-shadow: 0 10px 40px rgba(212,175,55,0.4); }",
    `.btn-premium:hover {\n    transform: scale(1.05);\n    box-shadow: 0 10px 40px rgba(212,175,55,0.4);\n}\n\n                /* 3D Classes */\n                .perspective-container {\n                    perspective: 2000px;\n                }\n                .card-3d {\n                    transform-style: preserve-3d;\n                    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease;\n                }\n                .card-3d:hover {\n                    transform: rotateX(5deg) rotateY(-10deg) translateZ(20px);\n                    box-shadow: -20px 20px 60px rgba(0,0,0,0.6);\n                }\n                .card-3d-content {\n                    transform: translateZ(40px);\n                    transition: transform 0.6s ease;\n                }\n                .card-3d:hover .card-3d-content {\n                    transform: translateZ(60px);\n                }\n                /* Floating Background Particles */\n                @keyframes float-particle {\n                    0%, 100% { transform: translateY(0) translateX(0); }\n                    50% { transform: translateY(-30px) translateX(20px); }\n                }\n                .particle {\n                    position: absolute;\n                    border-radius: 50%;\n                    pointer-events: none;\n                    animation: float-particle 8s ease-in-out infinite;\n                }`);

// Role Selection Perspective
code = code.replace(
    `                {/* Role Selection Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: 32,
                    marginBottom: 44,
                    animation: "sfi 0.6s ease 0.3s backwards"
                }}>`,
    `                {/* Role Selection Grid */}
                <div className="perspective-container" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: 32,
                    marginBottom: 44,
                    animation: "sfi 0.6s ease 0.3s backwards"
                }}>`);

// Passenger Option
code = code.replace(
    `                    {/* Passenger Option */}
                    <div
                        onClick={() => go("onboarding")}
                        className="glass-card"
                        style={{
                            padding: "48px 32px", borderRadius: 28, border: "2px solid rgba(212,175,55,0.15)",
                            background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,0,0,0.4))",
                            cursor: "pointer", textAlign: "center", position: "relative", overflow: "hidden",
                        }}
                        onMouseEnter={e => {
                            const c = e.currentTarget as HTMLDivElement;
                            c.style.borderColor = G;
                            c.style.background = "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(0,0,0,0.6))";
                            c.style.transform = "translateY(-8px)";
                            c.style.boxShadow = "0 20px 60px rgba(212,175,55,0.15)";
                        }}
                        onMouseLeave={e => {
                            const c = e.currentTarget as HTMLDivElement;
                            c.style.borderColor = "rgba(212,175,55,0.15)";
                            c.style.background = "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,0,0,0.4))";
                            c.style.transform = "translateY(0)";
                            c.style.boxShadow = "none";
                        }}
                    >`,
    `                    {/* Passenger Option */}
                    <div
                        onClick={() => go("onboarding")}
                        className="glass-card card-3d"
                        style={{
                            padding: "48px 32px", borderRadius: 28, border: "2px solid rgba(212,175,55,0.15)",
                            background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,0,0,0.4))",
                            cursor: "pointer", textAlign: "center", position: "relative",
                        }}
                        onMouseEnter={e => {
                            const c = e.currentTarget as HTMLDivElement;
                            c.style.borderColor = G;
                            c.style.background = "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(0,0,0,0.6))";
                        }}
                        onMouseLeave={e => {
                            const c = e.currentTarget as HTMLDivElement;
                            c.style.borderColor = "rgba(212,175,55,0.15)";
                            c.style.background = "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,0,0,0.4))";
                        }}
                    >
                    <div className="card-3d-content">`);

code = code.replace(`                            Enter Player Mode →\n                        </div>\n                    </div>`,
    `                            Enter Player Mode →\n                        </div>\n                    </div>\n                    </div>`);

// Driver Option Option
code = code.replace(
    `                    {/* Driver Option */}
                    <div
                        onClick={() => navigate("/driver")}
                        className="glass-card"
                        style={{
                            padding: "48px 32px", borderRadius: 28, border: "2px solid rgba(96,180,255,0.15)",
                            background: "linear-gradient(135deg, rgba(96,180,255,0.06), rgba(0,0,0,0.4))",
                            cursor: "pointer", textAlign: "center", position: "relative", overflow: "hidden",
                        }}
                        onMouseEnter={e => {
                            const c = e.currentTarget as HTMLDivElement;
                            c.style.borderColor = "#60B4FF";
                            c.style.background = "linear-gradient(135deg, rgba(96,180,255,0.12), rgba(0,0,0,0.6))";
                            c.style.transform = "translateY(-8px)";
                            c.style.boxShadow = "0 20px 60px rgba(96,180,255,0.1)";
                        }}
                        onMouseLeave={e => {
                            const c = e.currentTarget as HTMLDivElement;
                            c.style.borderColor = "rgba(96,180,255,0.15)";
                            c.style.background = "linear-gradient(135deg, rgba(96,180,255,0.06), rgba(0,0,0,0.4))";
                            c.style.transform = "translateY(0)";
                            c.style.boxShadow = "none";
                        }}
                    >`,
    `                    {/* Driver Option */}
                    <div
                        onClick={() => navigate("/driver")}
                        className="glass-card card-3d"
                        style={{
                            padding: "48px 32px", borderRadius: 28, border: "2px solid rgba(96,180,255,0.15)",
                            background: "linear-gradient(135deg, rgba(96,180,255,0.06), rgba(0,0,0,0.4))",
                            cursor: "pointer", textAlign: "center", position: "relative",
                        }}
                        onMouseEnter={e => {
                            const c = e.currentTarget as HTMLDivElement;
                            c.style.borderColor = "#60B4FF";
                            c.style.background = "linear-gradient(135deg, rgba(96,180,255,0.12), rgba(0,0,0,0.6))";
                        }}
                        onMouseLeave={e => {
                            const c = e.currentTarget as HTMLDivElement;
                            c.style.borderColor = "rgba(96,180,255,0.15)";
                            c.style.background = "linear-gradient(135deg, rgba(96,180,255,0.06), rgba(0,0,0,0.4))";
                        }}
                    >
                    <div className="card-3d-content">`);

code = code.replace(`                            Become a Partner →\n                        </div>\n                    </div>`,
    `                            Become a Partner →\n                        </div>\n                    </div>\n                    </div>`);


// Add floating particles to Role Selection atmospheric decor
code = code.replace(
    `            {/* Atmospheric Decor */}
            <div style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.1, backgroundImage: "radial-gradient(rgba(212,175,55,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%)", top: "-200px", left: "-200px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,180,255,0.06), transparent 70%)", bottom: "-150px", right: "-150px", pointerEvents: "none" }} />`,
    `            {/* Atmospheric Decor & 3D Particles */}
            <div style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.1, backgroundImage: "radial-gradient(rgba(212,175,55,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%)", top: "-200px", left: "-200px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,180,255,0.06), transparent 70%)", bottom: "-150px", right: "-150px", pointerEvents: "none" }} />
            <div className="particle" style={{ width: 15, height: 15, background: '#D4AF37', top: '20%', left: '15%', opacity: 0.5, filter: 'blur(2px)' }} />
            <div className="particle" style={{ width: 25, height: 25, background: '#60B4FF', top: '70%', right: '20%', opacity: 0.3, filter: 'blur(4px)', animationDelay: '2s' }} />
            <div className="particle" style={{ width: 10, height: 10, background: 'white', top: '40%', right: '10%', opacity: 0.6, animationDelay: '4s' }} />`);

writeFileSync('src/app/screens/CustomerAuthPage.tsx', code);
console.log('Done Customer');

let codeDriver = readFileSync('src/app/screens/DriverDashboard.tsx', 'utf-8');
codeDriver = codeDriver.replace(`            {/* NAVBAR */}`,
    `            <style>{\`
                /* 3D Classes */
                .perspective-container { perspective: 2000px; }
                .card-3d { 
                    transform-style: preserve-3d; 
                    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease; 
                }
                .card-3d:hover {
                    transform: rotateX(5deg) rotateY(-5deg) translateZ(10px);
                    box-shadow: -10px 15px 30px rgba(0,0,0,0.4);
                }
                .gcard-glow {
                    transition: all 0.3s ease;
                }
                .gcard-glow:hover {
                    border-color: rgba(212,175,55,0.4) !important;
                    box-shadow: 0 0 20px rgba(212,175,55,0.15);
                }
            \`}</style>
            {/* NAVBAR */}`);

codeDriver = codeDriver.replace(
    `        <div style={{ background: "rgba(15,28,46,0.8)", border: \`1px solid \${GB}\`, borderRadius: 18, ...style }} {...rest}>`,
    `        <div className="gcard-glow" style={{ background: "rgba(15,28,46,0.8)", border: \`1px solid \${GB}\`, borderRadius: 18, ...style }} {...rest}>`);

codeDriver = codeDriver.replace(
    `                                    <GCard key={s.label} style={{ padding: 18 }}>`,
    `                                    <GCard key={s.label} className="card-3d" style={{ padding: 18 }}>`
);
codeDriver = codeDriver.replace(
    `                                    <GCard key={s.label} style={{ padding: 18 }}>`,
    `                                    <GCard key={s.label} className="card-3d" style={{ padding: 18 }}>`
);
codeDriver = codeDriver.replace(
    `                                    <GCard key={s.label} style={{ padding: 18 }}>`,
    `                                    <GCard key={s.label} className="card-3d" style={{ padding: 18 }}>`
);
codeDriver = codeDriver.replace(
    `                                    <GCard key={s.label} style={{ padding: 18 }}>`,
    `                                    <GCard key={s.label} className="card-3d" style={{ padding: 18 }}>`
);

writeFileSync('src/app/screens/DriverDashboard.tsx', codeDriver);
console.log('Done Driver');
