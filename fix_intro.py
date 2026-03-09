import sys

with open('src/app/screens/CustomerAuthPage.tsx', encoding='utf-8') as f:
    lines = f.readlines()

# Keep lines before intro (0..83) and from role section onward (362..)
before = lines[:83]   # lines 1-83 (0-indexed: 0-82)
after  = lines[362:]  # from line 363 onward (role section)

new_intro = r"""    /* ══════════════════════════════════════
         1. INTRO SPLASH — Hero layout matching ShowcasePage
       ══════════════════════════════════════ */
    if (screen === "intro")
        return (
            <div style={{
                minHeight: "100vh", width: "100%",
                background: "linear-gradient(180deg,#050D1A 0%,#0F1C2E 45%,#1a2e4a 100%)",
                color: "white", fontFamily: "'Inter','Segoe UI',sans-serif",
                display: "flex", flexDirection: "column",
                position: "relative", overflowX: "hidden",
                opacity: introFade ? 0 : 1, transition: "opacity 0.48s ease",
            }}>
                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
                @keyframes sfi{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
                @keyframes lpulse{0%,100%{box-shadow:0 0 20px rgba(212,175,55,0.2)}50%{box-shadow:0 0 48px rgba(212,175,55,0.5)}}
                @keyframes dotpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}
                @keyframes fblob{from{transform:translate(0,0)}to{transform:translate(28px,-38px)}}
                .inl{background:none;border:none;color:rgba(255,255,255,0.6);font-size:14px;font-weight:500;cursor:pointer;padding:8px 14px;border-radius:8px;transition:color .2s;font-family:Inter,sans-serif;}
                .inl:hover{color:#fff;}
                .ihg{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;}
                .ifg{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;}
                @media(max-width:960px){
                  .ihg{grid-template-columns:1fr!important;gap:36px!important;}
                  .ihg>div:first-child{text-align:center;}
                  .ign{display:none!important;}
                  .igw{display:flex;justify-content:center;}
                }
                @media(max-width:600px){.ifg{grid-template-columns:1fr 1fr!important;}}
                `}</style>

                {/* ── NAVBAR ── */}
                <header style={{
                    position:"fixed",top:0,left:0,right:0,zIndex:100,height:72,
                    padding:"0 5vw",display:"flex",alignItems:"center",justifyContent:"space-between",
                    background:"rgba(5,13,26,0.9)",backdropFilter:"blur(18px)",
                    borderBottom:"1px solid rgba(255,255,255,0.06)",
                }}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:44,height:44,borderRadius:11,overflow:"hidden",border:`2px solid ${G}`,background:"#000",animation:"lpulse 4s ease-in-out infinite",flexShrink:0}}>
                            <img src={logoImage} alt="logo" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        </div>
                        <div>
                            <div style={{fontWeight:900,fontSize:19,letterSpacing:1,lineHeight:1}}><span style={{color:G}}>SAARADHI</span>GO</div>
                            <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:3,fontWeight:700}}>PREMIUM RIDES</div>
                        </div>
                    </div>
                    <nav className="ign" style={{display:"flex",alignItems:"center",gap:2}}>
                        <button className="inl" onClick={()=>navigate("/")}>Home</button>
                        <button className="inl" onClick={()=>navigate("/")}>Features</button>
                        <button className="inl" onClick={()=>navigate("/driver")}>Drive With Us</button>
                        <button className="inl" onClick={()=>navigate("/")}>Safety</button>
                        <button onClick={handleLetsGo} style={{
                            marginLeft:12,padding:"10px 26px",borderRadius:12,
                            background:`linear-gradient(135deg,#F5D060,${G})`,
                            color:DARK,fontWeight:700,fontSize:14,border:"none",cursor:"pointer",
                            boxShadow:"0 4px 20px rgba(212,175,55,0.3)",fontFamily:"Inter,sans-serif",
                        }}>Get Started →</button>
                    </nav>
                </header>

                {/* ── HERO ── */}
                <section style={{flex:1,minHeight:"100vh",display:"flex",alignItems:"center",padding:"104px 5vw 80px",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",width:640,height:640,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,175,55,0.07),transparent 70%)",top:-180,right:-80,pointerEvents:"none",animation:"fblob 9s ease-in-out infinite alternate"}}/>
                    <div style={{position:"absolute",width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(30,58,95,0.55),transparent 70%)",bottom:-80,left:-80,pointerEvents:"none"}}/>
                    <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.02,backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",backgroundSize:"56px 56px"}}/>

                    <div style={{maxWidth:1280,margin:"0 auto",width:"100%"}}>
                        <div className="ihg">
                            {/* LEFT */}
                            <div style={{animation:"sfi 0.8s ease forwards"}}>
                                <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:999,marginBottom:28,background:"rgba(212,175,55,0.10)",border:"1px solid rgba(212,175,55,0.25)"}}>
                                    <span style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",display:"inline-block",animation:"dotpulse 2s ease-in-out infinite"}}/>
                                    <span style={{color:G,fontSize:12,fontWeight:700,letterSpacing:1}}>NOW LIVE ACROSS INDIA</span>
                                </div>
                                <h1 style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(36px,4.5vw,62px)",fontWeight:900,lineHeight:1.1,color:"white",letterSpacing:"-0.5px",margin:"0 0 20px"}}>
                                    The Future of<br/>
                                    <span style={{background:"linear-gradient(135deg,#D4AF37,#F0C040)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Premium Rides</span><br/>
                                    in India.
                                </h1>
                                <p style={{color:"rgba(255,255,255,0.5)",fontSize:17,lineHeight:1.75,margin:"0 0 36px",maxWidth:460}}>
                                    Fast, reliable, and luxurious ride-hailing — inspired by the royal chariot. Your commute, elevated to a new standard.
                                </p>
                                <div style={{marginBottom:48}}>
                                    <MetalButton variant="gold" onClick={handleLetsGo}
                                        className="group relative overflow-hidden rounded-full flex items-center gap-4 px-4 pr-6 h-[68px] shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:scale-[1.03]">
                                        <div className="w-12 h-12 flex items-center justify-center overflow-hidden bg-transparent shrink-0">
                                            <img src={chariotIcon} alt="chariot" className="w-full h-full object-contain" style={{filter:"brightness(0)"}}/>
                                        </div>
                                        <span className="text-lg font-black tracking-[0.2em] text-[#050D1A]">LET'S GO</span>
                                        <div className="bg-black/15 rounded-full w-9 h-9 flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300">
                                            <ChevronRight size={22} strokeWidth={3} className="text-[#050D1A]"/>
                                        </div>
                                    </MetalButton>
                                </div>
                                <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                                    {[{i:"⭐",t:"4.9 Rating"},{i:"🛡️",t:"Insured Rides"},{i:"⚡",t:"10-sec Booking"}].map(b=>(
                                        <div key={b.t} style={{display:"flex",alignItems:"center",gap:7,color:"rgba(255,255,255,0.45)",fontSize:13,fontWeight:500}}>
                                            <span style={{fontSize:15}}>{b.i}</span>{b.t}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT: Globe */}
                            <div className="igw">
                                <Globe size={520}
                                    markers={[
                                        {lat:80.0,lng:0.0,label:"Delhi"},
                                        {lat:73.0,lng:110.0,label:"Chandigarh"},
                                        {lat:68.0,lng:-110.0,label:"Jaipur"},
                                        {lat:47.0,lng:55.0,label:"Lucknow"},
                                        {lat:43.0,lng:-45.0,label:"Surat"},
                                        {lat:38.0,lng:165.0,label:"Bhubaneswar"},
                                        {lat:33.0,lng:-160.0,label:"Ahmedabad"},
                                        {lat:12.0,lng:20.0,label:"Mumbai"},
                                        {lat:8.0,lng:115.0,label:"Nagpur"},
                                        {lat:2.0,lng:-70.0,label:"Indore"},
                                        {lat:-4.0,lng:-165.0,label:"Hyderabad"},
                                        {lat:-28.0,lng:40.0,label:"Chennai"},
                                        {lat:-32.0,lng:-30.0,label:"Bengaluru"},
                                        {lat:-36.0,lng:130.0,label:"Pune"},
                                        {lat:-42.0,lng:-130.0,label:"Visakhapatnam"},
                                        {lat:-62.0,lng:75.0,label:"Kochi"},
                                        {lat:-68.0,lng:-60.0,label:"Kolkata"},
                                    ]}
                                    connections={[
                                        {from:[80.0,0.0],to:[47.0,55.0]},
                                        {from:[80.0,0.0],to:[43.0,-45.0]},
                                        {from:[73.0,110.0],to:[38.0,165.0]},
                                        {from:[47.0,55.0],to:[12.0,20.0]},
                                        {from:[43.0,-45.0],to:[2.0,-70.0]},
                                        {from:[12.0,20.0],to:[-28.0,40.0]},
                                        {from:[8.0,115.0],to:[-36.0,130.0]},
                                        {from:[-28.0,40.0],to:[-32.0,-30.0]},
                                        {from:[-32.0,-30.0],to:[-62.0,75.0]},
                                        {from:[-62.0,75.0],to:[-68.0,-60.0]},
                                        {from:[-42.0,-130.0],to:[-4.0,-165.0]},
                                        {from:[68.0,-110.0],to:[33.0,-160.0]},
                                    ]}
                                />
                            </div>
                        </div>

                        {/* STATS BAND */}
                        <div style={{marginTop:72,paddingTop:40,borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:28,animation:"sfi 0.8s ease 0.4s backwards"}}>
                            {[{v:"50K+",l:"Happy Riders"},{v:"2K+",l:"Driver Partners"},{v:"4.9★",l:"App Rating"},{v:"100+",l:"Cities Launching"},{v:"98%",l:"Satisfaction"}].map(s=>(
                                <div key={s.l} style={{textAlign:"center"}}>
                                    <div style={{color:G,fontSize:30,fontWeight:900,lineHeight:1}}>{s.v}</div>
                                    <div style={{color:"rgba(255,255,255,0.38)",fontSize:12,marginTop:5,letterSpacing:0.5}}>{s.l}</div>
                                </div>
                            ))}
                        </div>

                        {/* FEATURE CARDS */}
                        <div style={{marginTop:52,animation:"sfi 0.8s ease 0.6s backwards"}}>
                            <div className="ifg">
                                {([
                                    {icon:<Shield size={20} color={G}/>,title:"Safe & Secure",desc:"SOS, live tracking & verified drivers"},
                                    {icon:<Navigation size={20} color={G}/>,title:"Instant Booking",desc:"Book in under 10 seconds, anywhere"},
                                    {icon:<Star size={20} color={G}/>,title:"Premium Fleet",desc:"Bike, Auto, Mini & Prime categories"},
                                    {icon:<Wallet size={20} color={G}/>,title:"SaaradhiWallet",desc:"Cashless payments & reward points"},
                                ] as const).map((f,i)=>(
                                    <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px 22px",display:"flex",alignItems:"center",gap:14,transition:"all 0.28s ease"}}
                                        onMouseEnter={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background="rgba(255,255,255,0.055)";el.style.borderColor="rgba(212,175,55,0.22)";el.style.transform="translateY(-3px)";}}
                                        onMouseLeave={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background="rgba(255,255,255,0.03)";el.style.borderColor="rgba(255,255,255,0.07)";el.style.transform="translateY(0)";}}
                                    >
                                        <div style={{width:42,height:42,borderRadius:11,background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.18)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{f.icon}</div>
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

"""

result = before + [new_intro] + after

with open('src/app/screens/CustomerAuthPage.tsx', 'w', encoding='utf-8') as f:
    f.writelines(result)

print('Done! File written successfully.')
print('Total lines:', len(result))
