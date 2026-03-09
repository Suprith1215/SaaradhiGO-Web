const fs = require('fs');
let content = fs.readFileSync('src/app/screens/CustomerAuthPage.tsx', 'utf8');

const newBlock = `
                {/* MAIN CONTENT WRAPPER - full-width true split */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    width: '100%',
                    flex: 1,
                    minHeight: '100vh',
                }}>
                    {/* LEFT PANEL - flush to left edge */}
                    <div style={{
                        flex: '0 0 52%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '60px 48px 60px 7vw',
                        zIndex: 20,
                    }}>
                        {/* STATUS BADGE */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'rgba(212,175,55,0.08)',
                            border: '1px solid rgba(212,175,55,0.25)',
                            borderRadius: 999,
                            padding: '6px 16px',
                            marginBottom: 32,
                            width: 'fit-content',
                            animation: 'sfi 0.6s ease backwards',
                        }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', letterSpacing: 1 }}>Now Live Across India</span>
                        </div>
                        {/* LOGO */}
                        <div style={{
                            width: 110, height: 110,
                            borderRadius: '50%',
                            border: '2px solid #D4AF37',
                            overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: '#000',
                            animation: 'logoPulse 4s ease-in-out infinite',
                            marginBottom: 28,
                            boxShadow: '0 0 40px rgba(212,175,55,0.2)',
                        }}>
                            <img src={logoImage} alt="SaaradhiGO"
                                style={{ width: '160%', height: '160%', objectFit: 'contain', transform: 'translateY(-10%)' }}
                            />
                        </div>
                        {/* HEADLINE */}
                        <h1 style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: 'clamp(34px, 4vw, 66px)',
                            fontWeight: 900,
                            lineHeight: 1.05,
                            marginBottom: 20,
                            animation: 'sfi 0.8s ease 0.1s backwards',
                            letterSpacing: '-1px',
                        }}>
                            The Future of{' '}
                            <span style={{ color: '#D4AF37' }}>Premium Rides</span>
                            <br />in India
                        </h1>
                        {/* DESCRIPTION */}
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'clamp(14px, 1.1vw, 17px)',
                            color: 'rgba(255,255,255,0.5)',
                            maxWidth: 480,
                            lineHeight: 1.75,
                            marginBottom: 40,
                            animation: 'sfi 0.8s ease 0.2s backwards',
                        }}>
                            SaaradhiGO &mdash; A luxury ride-hailing ecosystem inspired by the royal chariot.
                            Seamless booking, premium vehicles, an unforgettable experience.
                        </p>
                        {/* STATS ROW */}
                        <div style={{
                            display: 'flex',
                            gap: 36,
                            marginBottom: 48,
                            animation: 'sfi 0.8s ease 0.35s backwards',
                        }}>
                            {[
                                { value: '50K+', label: 'Happy Riders' },
                                { value: '2K+', label: 'Driver Partners' },
                                { value: '4.9\u2605', label: 'App Rating' },
                                { value: '100+', label: 'Cities Soon' },
                            ].map((s) => (
                                <div key={s.label}>
                                    <div style={{ fontSize: 'clamp(20px, 1.8vw, 28px)', fontWeight: 800, color: 'white', marginBottom: 4 }}>{s.value}</div>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1.5 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                        {/* LET'S GO BUTTON */}
                        <div style={{ animation: 'sfi 0.8s ease 0.5s backwards' }}>
                            <MetalButton
                                variant="gold"
                                onClick={handleLetsGo}
                                className="group relative overflow-hidden rounded-full flex items-center gap-4 px-4 pr-6 h-[72px] shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:scale-[1.03]"
                            >
                                <div className="w-14 h-14 flex items-center justify-center overflow-hidden bg-transparent shrink-0">
                                    <img src={chariotIcon} alt="chariot" className="w-[100%] h-[100%] object-contain drop-shadow-md" style={{ filter: 'brightness(0)' }} />
                                </div>
                                <span className="text-lg md:text-xl font-black tracking-[0.2em] text-[#050D1A] pt-1">LET'S GO</span>
                                <div className="bg-black/15 rounded-full w-10 h-10 flex items-center justify-center group-hover:translate-x-3 transition-transform duration-300 ease-out shadow-inner">
                                    <ChevronRight size={24} strokeWidth={4} className="text-[#050D1A] group-hover:animate-pulse" />
                                </div>
                            </MetalButton>
                        </div>
                    </div>

                    {/* RIGHT PANEL - Globe flush to right */}
                    <div style={{
                        flex: '0 0 48%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '3vw',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <Globe
                            size={570}
                            markers={[
                                { lat: 28.61, lng: 77.21, label: 'Delhi' },
                                { lat: 19.07, lng: 72.88, label: 'Mumbai' },
                                { lat: 13.08, lng: 80.27, label: 'Chennai' },
                                { lat: 12.97, lng: 77.59, label: 'Bengaluru' },
                                { lat: 22.57, lng: 88.36, label: 'Kolkata' },
                                { lat: 17.38, lng: 78.49, label: 'Hyderabad' },
                            ]}
                            connections={[
                                { from: [28.61, 77.21], to: [19.07, 72.88] },
                                { from: [28.61, 77.21], to: [22.57, 88.36] },
                                { from: [19.07, 72.88], to: [12.97, 77.59] },
                                { from: [13.08, 80.27], to: [12.97, 77.59] },
                                { from: [17.38, 78.49], to: [28.61, 77.21] },
                                { from: [17.38, 78.49], to: [13.08, 80.27] },
                            ]}
                        />
                    </div>
                </div>

                {/* FEATURE CARDS`;

// Do the replacement - match old block from MAIN CONTENT WRAPPER comment up to FEATURE CARDS comment
const oldPattern = /\{\/\* MAIN CONTENT WRAPPER \*\/\}[\s\S]*?\{\/\* FEATURE CARDS/;
const newContent = content.replace(oldPattern, newBlock);
if (newContent === content) {
    console.log('REPLACEMENT FAILED - pattern not found');
} else {
    fs.writeFileSync('src/app/screens/CustomerAuthPage.tsx', newContent, 'utf8');
    console.log('Done! Content replaced successfully.');
}
