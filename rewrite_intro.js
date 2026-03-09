const fs = require('fs');
let content = fs.readFileSync('src/app/screens/CustomerAuthPage.tsx', 'utf8');

// Find the start marker (line 84 comment) and the end marker (start of screen === "role")
const startMarker = `    /* ══════════════════════════════════════\n         1. INTRO SPLASH — Centered Premium Layout\n       ══════════════════════════════════════ */`;
const endMarker = `    /* ══════════════════════════════════════\n         2. ROLE SELECTION`;

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1) { console.log('START not found'); process.exit(1); }
if (endIdx === -1) { console.log('END not found'); process.exit(1); }

const newSection = `    /* ══════════════════════════════════════
         1. INTRO SPLASH — Professional Layout matching ShowcasePage
       ══════════════════════════════════════ */
    if (screen === "intro")
        return (
            <div
                style={{
                    minHeight: "100vh",
                    width: "100%",
                    background: "linear-gradient(180deg, #050D1A 0%, #0F1C2E 40%, #1E3A5F 100%)",
                    color: "white",
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflowX: "hidden",
                    opacity: introFade ? 0 : 1,
                    transition: "opacity 0.48s ease",
                }}
            >
                <style>{\`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
                @keyframes sfi { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
                @keyframes logoPulse { 0%,100%{box-shadow:0 0 20px rgba(212,175,55,0.2)} 50%{box-shadow:0 0 50px rgba(212,175,55,0.5)} }
                @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
                @keyframes floatBlob { from{transform:translate(0,0) scale(1)} to{transform:translate(30px,-40px) scale(1.05)} }
                .intro-nav-link { background:none;border:none;color:rgba(255,255,255,0.65);font-size:14px;font-weight:500;cursor:pointer;padding:8px 12px;border-radius:8px;transition:color 0.2s; }
                .intro-nav-link:hover { color:white; }
                .intro-hero-grid { display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center; }
                .intro-features-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px; }
                @media (max-width:900px) {
                    .intro-hero-grid { grid-template-columns:1fr !important;gap:40px !important; }
                    .intro-hero-grid > div:first-child { text-align:center; }
                    .intro-globe-wrap { display:flex;justify-content:center; }
                    .intro-desktop-nav { display:none !important; }
                }
                @media (max-width:600px) {
                    .intro-features-grid { grid-template-columns:1fr 1fr !important; }
                }
                \`}</style>

                {/* ── NAVBAR ── */}
                <header style={{
                    position:"fixed",top:0,left:0,right:0,zIndex:100,
                    padding:"0 5vw",display:"flex",alignItems:"center",
                    justifyContent:"space-between",height:80,
                    background:"rgba(5,13,26,0.85)",backdropFilter:"blur(20px)",
                    borderBottom:"1px solid rgba(255,255,255,0.07)",
                }}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:46,height:46,borderRadius:12,overflow:"hidden",border:\`2px solid \${G}\`,background:"#000",animation:"logoPulse 4s ease-in-out infinite"}}>
                            <img src={logoImage} alt="logo" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                        </div>
                        <div style={{lineHeight:1}}>
                            <div style={{fontWeight:900,fontSize:20,letterSpacing:1}}><span style={{color:G}}>SAARADHI</span>GO</div>
                            <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:3,fontWeight:700,marginTop:2}}>PREMIUM RIDES</div>
                        </div>
                    </div>
                    <nav style={{display:"flex",alignItems:"center",gap:4}} className="intro-desktop-nav">
                        <button className="intro-nav-link" onClick={()=>navigate("/")}>Home</button>
                        <button className="intro-nav-link" onClick={()=>navigate("/")}>Features</button>
                        <button className="intro-nav-link" onClick={()=>navigate("/driver")}>Drive With Us</button>
                        <button className="intro-nav-link" onClick={()=>navigate("/")}>Safety</button>
                        <button onClick={handleLetsGo} style={{marginLeft:8,padding:"10px 24px",borderRadius:12,background:\`linear-gradient(135deg,#F5D060,\${G})\`,color:DARK,fontWeight:700,fontSize:14,border:"none",cursor:"pointer",boxShadow:"0 4px 20px rgba(212,175,55,0.3)"}}>Get Started →</button>
                    </nav>
                </header>

                {/* ── HERO SECTION ── */}
                <section style={{flex:1,minHeight:"100vh",display:"flex",alignItems:"center",padding:"120px 5vw 80px",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,175,55,0.07),transparent 70%)",top:-200,right:-100,pointerEvents:"none",animation:"floatBlob 8s ease-in-out infinite alternate"}} />
                    <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(30,58,95,0.6),transparent 70%)",bottom:-100,left:-100,pointerEvents:"none"}} />
                    <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.025,backgroundImage:"linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",backgroundSize:"60px 60px"}} />

                    <div style={{maxWidth:1280,margin:"0 auto",width:"100%"}}>
                        <div className="intro-hero-grid">
                            {/* LEFT */}
                            <div style={{animation:"fadeUp 0.8s ease forwards"}}>
                                <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:999,marginBottom:28,background:"rgba(212,175,55,0.10)",border:"1px solid rgba(212,175,55,0.25)"}}>
                                    <span style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",display:"inline-block",animation:"pulse 1.8s ease-in-out infinite"}} />
                                    <span style={{color:G,fontSize:12,fontWeight:700,letterSpacing:1}}>NOW LIVE ACROSS INDIA</span>
                                </div>
                                <h1 style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(36px,5vw,64px)",fontWeight:900,lineHeight:1.1,marginBottom:20,color:"white",letterSpacing:"-0.5px"}}>
                                    The Future of<br />
                                    <span style={{background:"linear-gradient(135deg,#D4AF37,#F0C040)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Premium Rides</span><br />
                                    in India.
                                </h1>
                                <p style={{color:"rgba(255,255,255,0.5)",fontSize:18,lineHeight:1.7,marginBottom:36,maxWidth:480}}>
                                    Fast, reliable, and luxurious ride-hailing — inspired by the royal chariot. Your commute, elevated to a new standard.
                                </p>
                                <div style={{marginBottom:52}}>
                                    <MetalButton variant="gold" onClick={handleLetsGo} className="group relative overflow-hidden rounded-full flex items-center gap-4 px-4 pr-6 h-[72px] shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:scale-[1.03]">
                                        <div className="w-14 h-14 flex items-center justify-center overflow-hidden bg-transparent shrink-0">
                                            <img src={chariotIcon} alt="chariot" className="w-[100%] h-[100%] object-contain" style={{filter:"brightness(0)"}} />
                                        </div>
                                        <span className="text-lg md:text-xl font-black tracking-[0.2em] text-[#050D1A] pt-1">LET'S GO</span>
                                        <div className="bg-black/15 rounded-full w-10 h-10 flex items-center justify-center group-hover:translate-x-3 transition-transform duration-300 ease-out shadow-inner">
                                            <ChevronRight size={24} strokeWidth={4} className="text-[#050D1A]" />
                                        </div>
                                    </MetalButton>
                                </div>
                                <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                                    {[{icon:"⭐",text:"4.9 Rating"},{icon:"🛡️",text:"Insured Rides"},{icon:"⚡",text:"10-sec Booking"}].map(b=>(
                                        <div key={b.text} style={{display:"flex",alignItems:"center",gap:6,color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:500}}>
                                            <span style={{fontSize:16}}>{b.icon}</span> {b.text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT: Globe */}
                            <div className="intro-globe-wrap" style={{position:"relative"}}>
                                <Globe size={520}
                                    markers={[
                                        {lat:55.0,lng:37.0,label:"Delhi"},
                                        {lat:20.0,lng:-80.0,label:"Mumbai"},
                                        {lat:35.0,lng:140.0,label:"Kolkata"},
                                        {lat:-30.0,lng:150.0,label:"Chennai"},
                                        {lat:-25.0,lng:-60.0,label:"Bengaluru"},
                                        {lat:50.0,lng:-20.0,label:"Hyderabad"},
                                    ]}
                                    connections={[
                                        {from:[55.0,37.0],to:[20.0,-80.0]},
                                        {from:[55.0,37.0],to:[35.0,140.0]},
                                        {from:[55.0,37.0],to:[50.0,-20.0]},
                                        {from:[20.0,-80.0],to:[-25.0,-60.0]},
                                        {from:[35.0,140.0],to:[-30.0,150.0]},
                                        {from:[-25.0,-60.0],to:[-30.0,150.0]},
                                    ]}
                                />
                            </div>
                        </div>

                        {/* STATS BAND */}
                        <div style={{marginTop:80,paddingTop:48,borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:32,animation:"sfi 0.8s ease 0.5s backwards"}}>
                            {[{value:"50K+",label:"Happy Riders"},{value:"2K+",label:"Driver Partners"},{value:"4.9★",label:"App Rating"},{value:"100+",label:"Cities Launching"},{value:"98%",label:"Satisfaction"}].map(s=>(
                                <div key={s.label} style={{textAlign:"center"}}>
                                    <div style={{color:G,fontSize:32,fontWeight:900,lineHeight:1}}>{s.value}</div>
                                    <div style={{color:"rgba(255,255,255,0.4)",fontSize:12,marginTop:6,letterSpacing:0.5}}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* FEATURE CARDS */}
                        <div style={{marginTop:60,animation:"sfi 0.8s ease 0.7s backwards"}}>
                            <div className="intro-features-grid">
                                {[
                                    {icon:<Shield size={20} color={G}/>,title:"Safe & Secure",desc:"SOS, live tracking & verified drivers"},
                                    {icon:<Navigation size={20} color={G}/>,title:"Instant Booking",desc:"Book in under 10 seconds, anywhere"},
                                    {icon:<Star size={20} color={G}/>,title:"Premium Fleet",desc:"Bike, Auto, Mini & Prime categories"},
                                    {icon:<Wallet size={20} color={G}/>,title:"SaaradhiWallet",desc:"Cashless payments & reward points"},
                                ].map((f,i)=>(
                                    <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"20px 24px",display:"flex",alignItems:"center",gap:16,transition:"all 0.3s ease"}}
                                        onMouseEnter={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background="rgba(255,255,255,0.055)";el.style.borderColor="rgba(212,175,55,0.25)";el.style.transform="translateY(-3px)";}}
                                        onMouseLeave={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background="rgba(255,255,255,0.03)";el.style.borderColor="rgba(255,255,255,0.07)";el.style.transform="translateY(0)";}}
                                    >
                                        <div style={{width:44,height:44,borderRadius:12,background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{f.icon}</div>
                                        <div>
                                            <div style={{fontSize:14,fontWeight:700,color:"white",marginBottom:2}}>{f.title}</div>
                                            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.4}}>{f.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );

`;

const newContent = content.substring(0, startIdx) + newSection + content.substring(endIdx);
fs.writeFileSync('src/app/screens/CustomerAuthPage.tsx', newContent, 'utf8');
console.log('Done! Intro section rewritten successfully.');
console.log('File length:', newContent.length);
