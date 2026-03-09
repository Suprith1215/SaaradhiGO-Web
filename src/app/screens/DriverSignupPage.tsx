import { useState } from "react";
import { useNavigate } from "react-router";
import {
    ArrowLeft, ChevronRight, CheckCircle, Upload, Camera,
    Shield, Star, TrendingUp, Clock, Zap, Phone
} from "lucide-react";
import logoImage from "figma:asset/25a5bd8011d7696bf02e1d5cc818a54ef634abf4.png";

const G = "#D4AF37";
const DARK = "#050D1A";
const NAVY = "#0F1C2E";
const GLASS = "rgba(255,255,255,0.04)";
const GLASS_B = "rgba(255,255,255,0.09)";

type Step = "welcome" | "details" | "vehicle" | "kyc" | "submitted";

export function DriverSignupPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("welcome");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [showOtp, setShowOtp] = useState(false);
    const [vehicleType, setVehicleType] = useState("mini");
    const [kycDocs, setKycDocs] = useState({ aadhaar: false, licence: false, pan: false, rc: false });

    const vehicleTypes = [
        { id: "bike", icon: "🏍️", name: "Bike / Scooter", earnings: "₹15-25K/mo" },
        { id: "auto", icon: "🛺", name: "Auto Rickshaw", earnings: "₹25-40K/mo" },
        { id: "mini", icon: "🚗", name: "Mini Car (4-seater)", earnings: "₹35-55K/mo" },
        { id: "prime", icon: "🚙", name: "Prime Sedan", earnings: "₹50-80K/mo" },
    ];

    const docs = [
        { id: "aadhaar", icon: "🪪", label: "Aadhaar Card", sub: "Government issued ID proof" },
        { id: "licence", icon: "🚗", label: "Driving Licence", sub: "Valid & in your name" },
        { id: "pan", icon: "📄", label: "PAN Card", sub: "For income tax records" },
        { id: "rc", icon: "📋", label: "RC / Registration Certificate", sub: "Vehicle registration document" },
    ] as const;

    const benefits = [
        { icon: <TrendingUp size={20} />, title: "Earn ₹1,200+ Daily", desc: "Top drivers earn ₹35,000-80,000 per month. Your income grows with every trip." },
        { icon: <Clock size={20} />, title: "Complete Flexibility", desc: "Drive whenever you want — morning shifts, nights, weekends. No fixed hours." },
        { icon: <Zap size={20} />, title: "Instant Payouts", desc: "Money credited to your bank every week. No delays, no complicated processes." },
        { icon: <Shield size={20} />, title: "Fully Insured", desc: "Comprehensive accident coverage for you and your vehicle during every trip." },
        { icon: <Star size={20} />, title: "Rewards & Bonuses", desc: "Completion bonuses, weekend surges, and monthly performance rewards add up fast." },
        { icon: <Phone size={20} />, title: "24/7 Driver Support", desc: "Dedicated driver support line available round the clock for any help you need." },
    ];

    if (step === "submitted") {
        return (
            <div style={{
                minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(180deg, ${DARK}, ${NAVY})`,
                fontFamily: "'Inter',sans-serif", padding: 24
            }}>
                <div style={{
                    maxWidth: 520, width: "100%", background: "rgba(15,28,46,0.8)",
                    borderRadius: 28, border: `1px solid ${GLASS_B}`, padding: "48px 36px", textAlign: "center"
                }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                    <h2 style={{ color: "white", fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Application Submitted!</h2>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
                        Welcome to the SaaradhiGO driver family. Our team will review your documents within <strong style={{ color: G }}>24-48 hours</strong>.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                        {[
                            { label: "KYC Documents", status: "Under Review", color: "#FFAA00" },
                            { label: "Background Check", status: "Scheduled", color: G },
                            { label: "Vehicle Inspection", status: "Pending", color: "rgba(255,255,255,0.35)" },
                        ].map(s => (
                            <div key={s.label} style={{
                                display: "flex", alignItems: "center", gap: 12,
                                background: GLASS, border: `1px solid ${GLASS_B}`,
                                borderRadius: 14, padding: "12px 16px"
                            }}>
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                                <span style={{ color: "white", fontSize: 14, flex: 1, textAlign: "left" }}>{s.label}</span>
                                <span style={{ color: s.color, fontSize: 12, fontWeight: 600 }}>{s.status}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={() => navigate("/")} style={{
                            flex: 1, padding: "14px", borderRadius: 14, border: `1px solid ${GLASS_B}`,
                            background: GLASS, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14
                        }}>← Back Home</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh", background: `linear-gradient(180deg, ${DARK} 0%, ${NAVY} 100%)`,
            fontFamily: "'Inter','Segoe UI',sans-serif", color: "white"
        }}>
            {/* ── TOP NAV ── */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 50,
                display: "flex", alignItems: "center", gap: 16,
                padding: "14px 5vw",
                background: "rgba(5,13,26,0.92)", backdropFilter: "blur(20px)",
                borderBottom: `1px solid ${GLASS_B}`
            }}>
                <button onClick={() => step === "welcome" ? navigate("/") : setStep("welcome")} style={{
                    width: 40, height: 40, borderRadius: 12, background: GLASS,
                    border: `1px solid ${GLASS_B}`, display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer"
                }}>
                    <ArrowLeft size={20} color={G} />
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={logoImage} alt="logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} />
                    <div>
                        <span style={{ fontWeight: 900, fontSize: 16 }}>
                            <span style={{ color: G }}>SAARADHI</span><span style={{ color: "white" }}>GO</span>
                        </span>
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: -2 }}>Driver Partner Portal</p>
                    </div>
                </div>

                {/* Progress steps */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                    {(["welcome", "details", "vehicle", "kyc"] as Step[]).map((s, i) => {
                        const labels = ["Intro", "Details", "Vehicle", "KYC"];
                        const stepOrder = ["welcome", "details", "vehicle", "kyc", "submitted"];
                        const current = stepOrder.indexOf(step);
                        const done = current > i;
                        const active = current === i;
                        return (
                            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{
                                    width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center",
                                    justifyContent: "center", fontSize: 11, fontWeight: 700,
                                    background: done ? G : active ? "rgba(212,175,55,0.2)" : GLASS,
                                    border: `1px solid ${done || active ? G : GLASS_B}`,
                                    color: done ? DARK : active ? G : "rgba(255,255,255,0.3)"
                                }}>
                                    {done ? "✓" : i + 1}
                                </div>
                                <span style={{ fontSize: 11, color: active ? G : done ? "rgba(212,175,55,0.6)" : "rgba(255,255,255,0.25)" }}
                                    className="step-label">{labels[i]}</span>
                                {i < 3 && <div style={{ width: 20, height: 1, background: done ? G : GLASS_B }} />}
                            </div>
                        );
                    })}
                </div>
            </nav>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 5vw" }}>

                {/* ══════ STEP: WELCOME ══════ */}
                {step === "welcome" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="driver-grid">
                        {/* Left */}
                        <div>
                            <span style={{
                                display: "inline-block", padding: "5px 14px", borderRadius: 999, marginBottom: 20,
                                background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)",
                                color: G, fontSize: 12, fontWeight: 700, letterSpacing: 1
                            }}>🚗 DRIVER PARTNER PROGRAM</span>

                            <h1 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
                                Drive. Earn.<br />
                                <span style={{ background: `linear-gradient(135deg, ${G}, #F0C040)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    Grow with SaaradhiGO.
                                </span>
                            </h1>
                            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}>
                                Join thousands of driver partners earning premium income on their schedule. Full flexibility, weekly payouts, and 24/7 support.
                            </p>

                            {/* Stats */}
                            <div style={{ display: "flex", gap: 20, marginBottom: 36, flexWrap: "wrap" }}>
                                {[["₹32K+", "Avg. Monthly"], ["4.8 ⭐", "Driver Rating"], ["48 hrs", "Onboarding"]].map(([v, l]) => (
                                    <div key={l} style={{
                                        padding: "16px 20px", borderRadius: 16,
                                        background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)"
                                    }}>
                                        <p style={{ color: G, fontSize: 20, fontWeight: 800 }}>{v}</p>
                                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{l}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Phone input */}
                            <div style={{ marginBottom: 16 }}>
                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 10 }}>Enter your mobile number to get started</p>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 0,
                                    background: "rgba(15,28,46,0.8)", borderRadius: 14,
                                    border: `1px solid rgba(212,175,55,0.3)`, overflow: "hidden"
                                }}>
                                    <div style={{ padding: "14px 16px", borderRight: `1px solid ${GLASS_B}`, display: "flex", alignItems: "center", gap: 6 }}>
                                        <span style={{ fontSize: 18 }}>🇮🇳</span>
                                        <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>+91</span>
                                    </div>
                                    <input
                                        type="tel" maxLength={10} value={phone}
                                        onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                                        placeholder="10-digit mobile number"
                                        style={{ flex: 1, background: "none", border: "none", outline: "none", padding: "14px 16px", color: "white", fontSize: 15 }}
                                    />
                                </div>
                            </div>

                            {!showOtp ? (
                                <button
                                    onClick={() => { if (phone.length === 10) setShowOtp(true); }}
                                    style={{
                                        width: "100%", padding: "16px", borderRadius: 16, border: "none",
                                        background: phone.length === 10 ? `linear-gradient(135deg, ${G}, #F0C040)` : "rgba(255,255,255,0.08)",
                                        color: phone.length === 10 ? DARK : "rgba(255,255,255,0.3)",
                                        fontSize: 15, fontWeight: 700, cursor: phone.length === 10 ? "pointer" : "not-allowed"
                                    }}
                                >
                                    Send OTP <ChevronRight size={18} style={{ display: "inline" }} />
                                </button>
                            ) : (
                                <>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 12 }}>Enter the 6-digit OTP sent to +91 {phone}</p>
                                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                                        {otp.map((d, i) => (
                                            <input key={i} type="text" inputMode="numeric" maxLength={1} value={d}
                                                onChange={e => {
                                                    const next = [...otp]; next[i] = e.target.value.slice(-1); setOtp(next);
                                                    if (e.target.value && i < 5) (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
                                                }}
                                                id={`otp-${i}`}
                                                style={{
                                                    flex: 1, height: 56, textAlign: "center", fontSize: 20, fontWeight: 700,
                                                    borderRadius: 12, border: d ? `2px solid ${G}` : `1px solid ${GLASS_B}`,
                                                    background: d ? "rgba(212,175,55,0.1)" : GLASS, color: "white", outline: "none"
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setStep("details")}
                                        style={{
                                            width: "100%", padding: "16px", borderRadius: 16, border: "none",
                                            background: `linear-gradient(135deg, ${G}, #F0C040)`,
                                            color: DARK, fontSize: 15, fontWeight: 700, cursor: "pointer"
                                        }}
                                    >
                                        Verify & Continue →
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Right: Benefits */}
                        <div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                {benefits.map((b, i) => (
                                    <div key={i} style={{
                                        background: "rgba(15,28,46,0.7)", border: `1px solid ${GLASS_B}`,
                                        borderRadius: 18, padding: 20,
                                        transition: "all 0.25s",
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = GLASS_B; e.currentTarget.style.transform = "none"; }}
                                    >
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 12, marginBottom: 12,
                                            background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)",
                                            display: "flex", alignItems: "center", justifyContent: "center", color: G
                                        }}>{b.icon}</div>
                                        <p style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{b.title}</p>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.5 }}>{b.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════ STEP: PERSONAL DETAILS ══════ */}
                {step === "details" && (
                    <div style={{ maxWidth: 680, margin: "0 auto" }}>
                        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Personal Details</h2>
                        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>Tell us a bit about yourself to get started.</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            {[
                                { label: "Full Name (as on Aadhaar)", placeholder: "Ramesh Kumar", type: "text" },
                                { label: "Date of Birth", placeholder: "DD/MM/YYYY", type: "text" },
                                { label: "Email Address", placeholder: "ramesh@example.com", type: "email" },
                                { label: "City of Operation", placeholder: "e.g. Bengaluru", type: "text" },
                            ].map(f => (
                                <div key={f.label}>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>{f.label}</p>
                                    <input
                                        type={f.type} placeholder={f.placeholder}
                                        style={{
                                            width: "100%", padding: "14px 16px", borderRadius: 14,
                                            background: "rgba(15,28,46,0.8)", border: `1px solid ${GLASS_B}`,
                                            color: "white", fontSize: 15, outline: "none",
                                            fontFamily: "'Inter',sans-serif"
                                        }}
                                        onFocus={e => e.target.style.borderColor = "rgba(212,175,55,0.4)"}
                                        onBlur={e => e.target.style.borderColor = GLASS_B}
                                    />
                                </div>
                            ))}

                            <div style={{
                                background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)",
                                borderRadius: 16, padding: 18
                            }}>
                                <p style={{ color: G, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>🔒 Your data is safe</p>
                                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, lineHeight: 1.5 }}>
                                    We collect only what's necessary for driver verification. Data is encrypted and never sold to third parties.
                                </p>
                            </div>

                            <button onClick={() => setStep("vehicle")} style={{
                                padding: "17px", borderRadius: 16, border: "none", cursor: "pointer",
                                background: `linear-gradient(135deg, ${G}, #F0C040)`, color: DARK,
                                fontSize: 16, fontWeight: 800
                            }}>
                                Continue to Vehicle Details →
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════ STEP: VEHICLE ══════ */}
                {step === "vehicle" && (
                    <div style={{ maxWidth: 680, margin: "0 auto" }}>
                        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Vehicle Information</h2>
                        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>Select your vehicle type and fill in the details.</p>

                        {/* Vehicle type selector */}
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Vehicle Type</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
                            {vehicleTypes.map(vt => (
                                <button key={vt.id} onClick={() => setVehicleType(vt.id)} style={{
                                    display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                                    borderRadius: 16, cursor: "pointer", textAlign: "left",
                                    background: vehicleType === vt.id ? "rgba(212,175,55,0.08)" : "rgba(15,28,46,0.7)",
                                    border: vehicleType === vt.id ? `2px solid ${G}` : `1px solid ${GLASS_B}`,
                                    transition: "all 0.2s"
                                }}>
                                    <span style={{ fontSize: 30 }}>{vt.icon}</span>
                                    <div>
                                        <p style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{vt.name}</p>
                                        <p style={{ color: G, fontSize: 12 }}>{vt.earnings}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Vehicle fields */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { label: "Make & Model", placeholder: "e.g. Maruti Swift Dzire" },
                                { label: "Registration Number", placeholder: "e.g. KA 05 MC 4892" },
                                { label: "Year of Manufacture", placeholder: "e.g. 2022" },
                                { label: "Vehicle Color", placeholder: "e.g. Pearl White" },
                            ].map(f => (
                                <div key={f.label}>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>{f.label}</p>
                                    <input
                                        placeholder={f.placeholder}
                                        style={{
                                            width: "100%", padding: "14px 16px", borderRadius: 14,
                                            background: "rgba(15,28,46,0.8)", border: `1px solid ${GLASS_B}`,
                                            color: "white", fontSize: 15, outline: "none",
                                            fontFamily: "'Inter',sans-serif"
                                        }}
                                        onFocus={e => e.target.style.borderColor = "rgba(212,175,55,0.4)"}
                                        onBlur={e => e.target.style.borderColor = GLASS_B}
                                    />
                                </div>
                            ))}

                            {/* Vehicle photos */}
                            <div>
                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>Vehicle Photos</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                                    {["Front View", "Side View", "Interior"].map(side => (
                                        <div key={side} style={{
                                            aspectRatio: "1", borderRadius: 14, display: "flex", flexDirection: "column",
                                            alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
                                            background: GLASS, border: "2px dashed rgba(255,255,255,0.1)",
                                            transition: "all 0.2s"
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                                        >
                                            <Camera size={22} color="rgba(255,255,255,0.3)" />
                                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{side}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => setStep("kyc")} style={{
                                padding: "17px", borderRadius: 16, border: "none", cursor: "pointer",
                                background: `linear-gradient(135deg, ${G}, #F0C040)`, color: DARK,
                                fontSize: 16, fontWeight: 800, marginTop: 8
                            }}>
                                Continue to Document Upload →
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════ STEP: KYC ══════ */}
                {step === "kyc" && (
                    <div style={{ maxWidth: 680, margin: "0 auto" }}>
                        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Upload KYC Documents</h2>
                        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Upload clear photos of all required documents.</p>

                        {/* Progress bar */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>Completion</span>
                                <span style={{ color: G, fontSize: 12, fontWeight: 700 }}>{Object.values(kycDocs).filter(Boolean).length}/4 docs</span>
                            </div>
                            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                                <div style={{
                                    height: "100%", borderRadius: 999,
                                    width: `${(Object.values(kycDocs).filter(Boolean).length / 4) * 100}%`,
                                    background: `linear-gradient(90deg, ${G}, #F0C040)`, transition: "width 0.4s"
                                }} />
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                            {docs.map(d => (
                                <div
                                    key={d.id}
                                    onClick={() => setKycDocs(prev => ({ ...prev, [d.id]: !prev[d.id] }))}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
                                        borderRadius: 18, cursor: "pointer",
                                        background: kycDocs[d.id] ? "rgba(212,175,55,0.06)" : "rgba(15,28,46,0.7)",
                                        border: `1px solid ${kycDocs[d.id] ? "rgba(212,175,55,0.3)" : GLASS_B}`,
                                        transition: "all 0.25s"
                                    }}
                                >
                                    <div style={{
                                        width: 52, height: 52, borderRadius: 14, flexShrink: 0, fontSize: 26,
                                        background: kycDocs[d.id] ? "rgba(212,175,55,0.1)" : GLASS,
                                        border: `1px solid ${kycDocs[d.id] ? "rgba(212,175,55,0.25)" : GLASS_B}`,
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>{d.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ color: "white", fontSize: 14, fontWeight: 600 }}>{d.label}</p>
                                        <p style={{ color: kycDocs[d.id] ? "#60D080" : "rgba(255,255,255,0.35)", fontSize: 12 }}>
                                            {kycDocs[d.id] ? "✓ Uploaded successfully" : d.sub}
                                        </p>
                                    </div>
                                    {kycDocs[d.id]
                                        ? <CheckCircle size={22} color="#60D080" />
                                        : <div style={{
                                            width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center",
                                            justifyContent: "center", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)"
                                        }}><Upload size={16} color={G} /></div>
                                    }
                                </div>
                            ))}

                            {/* Selfie */}
                            <div style={{
                                padding: 20, borderRadius: 18,
                                background: "rgba(15,28,46,0.7)", border: `1px solid ${GLASS_B}`
                            }}>
                                <p style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📸 Live Selfie Verification</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <div style={{
                                        width: 64, height: 64, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
                                        border: `2px dashed rgba(212,175,55,0.4)`, display: "flex",
                                        alignItems: "center", justifyContent: "center", background: GLASS, fontSize: 30
                                    }}>😊</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ color: "white", fontSize: 13 }}>Take a live selfie for face verification</p>
                                        <p style={{ color: "#60D080", fontSize: 12 }}>✓ Face match required for security</p>
                                    </div>
                                    <button style={{
                                        padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                                        background: "rgba(212,175,55,0.1)", color: G, fontSize: 12, fontWeight: 700
                                    }}>Take Selfie</button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep("submitted")}
                            style={{
                                width: "100%", padding: "17px", borderRadius: 16, border: "none", cursor: "pointer",
                                background: `linear-gradient(135deg, ${G}, #F0C040)`, color: DARK,
                                fontSize: 16, fontWeight: 800
                            }}
                        >
                            Submit Application for Review →
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        @media (max-width: 768px) {
          .driver-grid { grid-template-columns: 1fr !important; }
          .step-label { display: none; }
        }
      `}</style>
        </div>
    );
}
