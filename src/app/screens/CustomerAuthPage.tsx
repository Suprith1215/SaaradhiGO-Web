import { useState } from "react";
import { useNavigate } from "react-router";
import { LiquidButton, MetalButton } from "@/components/ui/liquid-glass-button";
import {
    ChevronRight,
    Check,
    MapPin,
    Bell,
    Shield,
    Wallet,
    Star,
    Navigation,
    Gift,
    History,
    ArrowRight,
} from "lucide-react";
import { requestOTP, verifyOTP, updateUserInfo } from "../../services/authService";
import logoImage from "@/assets/25a5bd8011d7696bf02e1d5cc818a54ef634abf4.png";

// Onboarding Images
import rideBookingImg from "../../assets/onboarding/ride_booking.png";
import trackingImg from "../../assets/onboarding/tracking.png";
import paymentImg from "../../assets/onboarding/payment.png";
import chariotIcon from "@/assets/chariot.svg";
import { Globe } from "@/components/ui/interactive-globe";

const G = "#D4AF37";
const DARK = "#050D1A";
const NAVY = "#0F1C2E";
const GLASS = "rgba(255,255,255,0.04)";
const GB = "rgba(255,255,255,0.09)";

const glassBtnStyle = (active: boolean): React.CSSProperties => ({
    width: "100%", height: "56px",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: active ? "linear-gradient(135deg, rgba(212,175,55,0.85), rgba(240,192,64,0.85))" : "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    border: active ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.1)",
    boxShadow: active ? "0 8px 32px rgba(212,175,55,0.25)" : "none",
    color: active ? "#050D1A" : "rgba(255,255,255,0.4)",
    fontSize: "17px", fontWeight: 800, borderRadius: "12px",
    cursor: active ? "pointer" : "not-allowed", transition: "all 0.3s ease"
});

type Screen = "email_login" | "intro" | "role" | "onboarding" | "login" | "otp" | "permissions" | "profile";
type AuthProvider = "phone" | "google" | "apple";

const SLIDES = [
    {
        image: rideBookingImg,
        headline: "Book Your Ride\nin Seconds",
        desc: "Experience seamless ride booking with just a tap. Premium vehicles at your doorstep.",
    },
    {
        image: trackingImg,
        headline: "Live Tracking\nEvery Moment",
        desc: "Track your ride in real-time. Know exactly where your driver is at every step.",
    },
    {
        image: paymentImg,
        headline: "Pay Smart,\nRide Premium",
        desc: "Multiple payment options. Digital wallet, UPI, cards — choose what suits you best.",
    },
];

const WRAP: React.CSSProperties = {
    minHeight: "100vh",
    background: "radial-gradient(circle at 50% 50%, #0a1a35 0%, #050D1A 100%)",
    fontFamily: "'Inter','Segoe UI',sans-serif",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 5vw",
    position: "relative",
    overflowX: "hidden",
};

/** ─────────────────────────────────────
 *  CustomerAuthPage
 * ───────────────────────────────────── */
export function CustomerAuthPage() {
    const navigate = useNavigate();
    const [screen, setScreen] = useState<Screen>("login");
    const [introFade, setIntroFade] = useState(false);
    const [slide, setSlide] = useState(0);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [authProvider, setAuthProvider] = useState<AuthProvider>("phone");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [permsGranted, setPermsGranted] = useState<Record<string, boolean>>({});
    const [userRole, setUserRole] = useState<'rider' | 'driver'>("rider");
    const [passengerName, setPassengerName] = useState("");
    const [passengerAge, setPassengerAge] = useState("");
    const [passengerGender, setPassengerGender] = useState("");

    const passengers = JSON.parse(localStorage.getItem('saaradhigo_passengers') || '[]');
    const phoneWithCode = `+91${phone}`;
    const existingPassenger = phone.length === 10 ? passengers.find((p: any) => p.phone_number === phoneWithCode || p.phone_number === phone || p.phone === phone) : null;

    const go = (s: Screen) => setScreen(s);
    const handleLetsGo = () => {
        setIntroFade(true);
        setTimeout(() => go("role"), 480);
    };

    /* ══════════════════════════════════════
         4. LOGIN — Premium Style
       ══════════════════════════════════════ */
    if (screen === "login")
        return (
            <div
                style={{
                    ...WRAP,
                    background:
                        "radial-gradient(circle at 50% 50%, #0a1a35 0%, #050D1A 100%)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0.1,
                        backgroundImage:
                            "radial-gradient(rgba(212,175,55,0.2) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        width: 600,
                        height: 600,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(212,175,55,0.1), transparent 70%)",
                        top: -200,
                        right: -200,
                        pointerEvents: "none",
                    }}
                />

                <div
                    style={{
                        width: "100%",
                        maxWidth: 500,
                        zIndex: 1,
                        animation: "sfi 0.8s ease",
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: 44 }}>
                        <div
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                margin: "0 auto 24px",
                                overflow: "hidden",
                                border: `3px solid ${G}`,
                                boxShadow: `0 0 40px rgba(212,175,55,0.2)`,
                            }}
                        >
                            <img
                                src={logoImage}
                                alt="logo"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <h1
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 36,
                                fontWeight: 900,
                                marginBottom: 8,
                            }}
                        >
                            {existingPassenger ? `Welcome back, ${existingPassenger.full_name || existingPassenger.name || "Rider"}!` : "Get Started"}
                        </h1>
                        <p
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                color: "rgba(255,255,255,0.45)",
                                fontSize: 16,
                            }}
                        >
                            {existingPassenger 
                                ? "Sign in to access your premium ride experience" 
                                : "Enter your phone number to book faster and safer rides."}
                        </p>
                    </div>

                    <div
                        className="glass-card"
                        style={{
                            borderRadius: 28,
                            padding: "40px 32px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.02)",
                            marginBottom: 24,
                        }}
                    >
                        <p
                            style={{
                                color: G,
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: 2,
                                marginBottom: 16,
                            }}
                        >
                            Phone Number
                        </p>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                borderRadius: 16,
                                border: "2px solid rgba(212,175,55,0.2)",
                                marginBottom: 24,
                                overflow: "hidden",
                                background: "rgba(0,0,0,0.3)",
                                transition: "border-color 0.3s ease",
                            }}
                        >
                            <div
                                style={{
                                    padding: "18px 16px",
                                    borderRight: "1px solid rgba(255,255,255,0.08)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <span style={{ fontSize: 20 }}>🇮🇳</span>
                                <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>
                                    +91
                                </span>
                            </div>
                            <input
                                type="tel"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                placeholder="00000 00000"
                                style={{
                                    flex: 1,
                                    background: "none",
                                    border: "none",
                                    outline: "none",
                                    padding: "18px 20px",
                                    color: "white",
                                    fontSize: 18,
                                    fontFamily: "'Inter',sans-serif",
                                    fontWeight: 600,
                                    letterSpacing: 1,
                                }}
                            />
                        </div>

                        <div className="w-full mb-6 relative z-10">
                            <button
                                onClick={async () => { 
                                    if (phone.length === 10) { 
                                        try {
                                            console.log(`[AUTH] Requesting OTP for ${phone} as ${userRole}`);
                                            const response = await requestOTP(`+91${phone}`, userRole);
                                            console.log("[AUTH] OTP Response:", response);
                                            
                                            // Handle various possible response formats
                                            const otpValue = response?.otp || response?.data?.otp;
                                            if (otpValue) {
                                                console.log(`\n=============================\n[TEST] OTP RECEIVED: ${otpValue}\n=============================\n`);
                                                
                                                // Send OTP to the local Vite terminal for easy copy-paste
                                                try {
                                                    await fetch('/__log_otp', {
                                                        method: 'POST',
                                                        body: JSON.stringify({ otp: otpValue })
                                                    });
                                                } catch(err) {}

                                                const otpArray = String(otpValue).split("").slice(0, 6);
                                                while(otpArray.length < 6) otpArray.push("");
                                                setOtp(otpArray);
                                            } else {
                                                console.log("OTP requested! If not shown here, it was sent via SMS.");
                                            }

                                            setAuthProvider("phone"); 
                                            go("otp"); 
                                        } catch (e: any) {
                                            console.error("[AUTH] OTP Request Failed:", e.response?.data || e.message);
                                            console.warn("Falling back to demo mode due to backend error.");
                                            alert(`Backend Error: ${e.response?.data?.message || e.message}\nEntering Demo Mode...`);
                                            
                                            setOtp("123456".split(""));
                                            setAuthProvider("phone"); 
                                            go("otp"); 
                                        }
                                    } 
                                }}
                                disabled={phone.length !== 10}
                                style={glassBtnStyle(phone.length === 10)}
                            >
                                Send Verification OTP →
                            </button>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                marginBottom: 24,
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    height: 1,
                                    background: "rgba(255,255,255,0.08)",
                                }}
                            />
                            <span
                                style={{
                                    color: "rgba(255,255,255,0.25)",
                                    fontSize: 13,
                                    fontWeight: 500,
                                }}
                            >
                                or secure sign in with
                            </span>
                            <div
                                style={{
                                    flex: 1,
                                    height: 1,
                                    background: "rgba(255,255,255,0.08)",
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: 14 }}>
                            <LiquidButton
                                variant="outline"
                                onClick={() => {
                                    setAuthProvider("google");
                                    go("email_login");
                                }}
                                className="flex-1 h-16 rounded-xl gap-3 text-white border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer text-sm font-semibold"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path
                                        fill="#EA4335"
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.90 3.32-2.22 4.18-1.5 1-3.38 1.62-5.62 1.62-4.22 0-7.82-2.88-9.04-6.72l-3.34 2.58C1.529 19.344 6.273 23 11.96 23c3.08 0 5.88-1.02 8.04-2.78 2.32-1.9 3.6-4.7 3.6-8.06 0-.66-.06-1.32-.18-1.96h-11.4v.72z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M3.92 14.52c-.22-.66-.34-1.36-.34-2.08s.12-1.42.34-2.08L.58 7.78C-.22 9.06-.66 10.5-.66 12s.44 2.94 1.24 4.22l3.34-2.7z"
                                    />
                                    <path
                                        fill="#4285F4"
                                        d="M11.96 4.36c1.62 0 3.06.56 4.22 1.66l3.14-3.14C17.36 1.06 14.8 0 11.96 0 6.27 0 1.53 3.66.58 8.64l3.34 2.58c1.22-3.84 4.82-6.72 9.04-6.86z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M11.96 23c5.68 0 10.43-3.08 12.38-7.62l-3.32-2.58c-.9 2.52-3.32 4.32-6.06 4.32-2.8 0-5.22-1.8-6.12-4.32l-3.34 2.58c2.1 3.52 5.86 5.82 10.46 7.62z"
                                    />
                                </svg>
                                Google
                            </LiquidButton>
                            <LiquidButton
                                variant="outline"
                                onClick={() => {
                                    setAuthProvider("apple");
                                    go("email_login");
                                }}
                                className="flex-1 h-16 rounded-xl gap-3 text-white border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer text-sm font-semibold"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M17.05 20.28c-.98.95-2.05 1.88-3.36 1.9-1.28.02-1.7-.76-3.23-.76-1.53 0-2 .74-3.23.78-1.26.04-2.48-.98-3.47-1.93-2-2-3.53-5.63-1.47-9.2C3.33 9.4 5 8.35 6.8 8.3c1.38-.05 2.68.9 3.53.9.84 0 2.44-1.12 4.12-.95 1.7.07 3 1.25 3.82 2.45-2.5 1.5-2.08 4.74.43 5.8-.8 1.93-1.83 3.8-3.65 4.78zM12.92 6.8c.78-1.02 1.3-2.44 1.15-3.8-1.15.05-2.55.8-3.38 1.8-.75.88-1.4 2.34-1.25 3.66 1.3.1 2.6-.64 3.48-1.66z" />
                                </svg>
                                Apple
                            </LiquidButton>
                        </div>
                    </div>

                    <p
                        style={{
                            textAlign: "center",
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 14,
                            lineHeight: 1.6,
                        }}
                    >
                        By continuing, you agree to our{" "}
                        <span
                            style={{
                                color: G,
                                fontWeight: 600,
                                cursor: "pointer",
                                borderBottom: `1px solid ${G}`,
                            }}
                        >
                            Terms of Service
                        </span>{" "}
                        and{" "}
                        <span
                            style={{
                                color: G,
                                fontWeight: 600,
                                cursor: "pointer",
                                borderBottom: `1px solid ${G}`,
                            }}
                        >
                            Privacy Policy
                        </span>
                    </p>
                    <p
                        style={{
                            textAlign: "center",
                            marginTop: 24,
                            color: "rgba(255,255,255,0.4)",
                            fontSize: 16,
                        }}
                    >
                        New to SaaradhiGO?{" "}
                        <span
                            onClick={() => go("role")}
                            style={{
                                color: G,
                                fontWeight: 800,
                                cursor: "pointer",
                                borderBottom: `2px solid ${G}`,
                            }}
                        >
                            Switch Role
                        </span>
                    </p>
                </div>
                <style>{`input::placeholder{color:rgba(255,255,255,0.15)}`}</style>
            </div>
        );

    /* ══════════════════════════════════════
         ROLE SELECTION
       ══════════════════════════════════════ */
    if (screen === "role")
        return (
            <div
                style={{
                    ...WRAP,
                    background:
                        "radial-gradient(circle at 50% 50%, #0a1a35 0%, #050D1A 100%)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0.1,
                        backgroundImage:
                            "radial-gradient(rgba(212,175,55,0.2) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        width: "100%",
                        maxWidth: 480,
                        zIndex: 1,
                        animation: "sfi 0.8s ease",
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: 40 }}>
                        <h1
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 32,
                                fontWeight: 900,
                                marginBottom: 12,
                            }}
                        >
                            Choose Your Path
                        </h1>
                        <p
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                color: "rgba(255,255,255,0.45)",
                                fontSize: 16,
                            }}
                        >
                            Select how you'd like to experience SaaradhiGO
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div
                            onClick={() => { setUserRole("rider"); go("login"); }}
                            className="glass-card"
                            style={{
                                padding: "24px",
                                borderRadius: 24,
                                border: `2px solid ${userRole === "rider" ? G : "rgba(255,255,255,0.08)"}`,
                                background: userRole === "rider" ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.02)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 20,
                                transition: "all 0.3s ease",
                            }}
                        >
                            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                                🚗
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>I'm a Rider</h3>
                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Premium rides at your fingertips</p>
                            </div>
                            {userRole === "rider" && <Check size={24} color={G} />}
                        </div>

                        <div
                            onClick={() => { setUserRole("driver"); go("login"); }}
                            className="glass-card"
                            style={{
                                padding: "24px",
                                borderRadius: 24,
                                border: `2px solid ${userRole === "driver" ? G : "rgba(255,255,255,0.08)"}`,
                                background: userRole === "driver" ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.02)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 20,
                                transition: "all 0.3s ease",
                            }}
                        >
                            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                                👨‍✈️
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>I'm a Driver</h3>
                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Drive and earn on your schedule</p>
                            </div>
                            {userRole === "driver" && <Check size={24} color={G} />}
                        </div>
                    </div>
                </div>
            </div>
        );

    /* ══════════════════════════════════════
         4.5 EMAIL LOGIN
       ══════════════════════════════════════ */
    if (screen === "email_login")
        return (
            <div
                style={{
                    ...WRAP,
                    background:
                        "radial-gradient(circle at 50% 50%, #0a1a35 0%, #050D1A 100%)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0.1,
                        backgroundImage:
                            "radial-gradient(rgba(212,175,55,0.2) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                        pointerEvents: "none",
                    }}
                />

                <div
                    style={{
                        width: "100%",
                        maxWidth: 440,
                        zIndex: 1,
                        animation: "sfi 0.8s ease",
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <div
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 20,
                                margin: "0 auto 20px",
                                background: "rgba(212,175,55,0.08)",
                                border: `3px solid ${G}`,
                                boxShadow: `0 0 40px rgba(212,175,55,0.2)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {authProvider === "google" && (
                                <svg width="40" height="40" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.90 3.32-2.22 4.18-1.5 1-3.38 1.62-5.62 1.62-4.22 0-7.82-2.88-9.04-6.72l-3.34 2.58C1.529 19.344 6.273 23 11.96 23c3.08 0 5.88-1.02 8.04-2.78 2.32-1.9 3.6-4.7 3.6-8.06 0-.66-.06-1.32-.18-1.96h-11.4v.72z" />
                                    <path fill="#FBBC05" d="M3.92 14.52c-.22-.66-.34-1.36-.34-2.08s.12-1.42.34-2.08L.58 7.78C-.22 9.06-.66 10.5-.66 12s.44 2.94 1.24 4.22l3.34-2.7z" />
                                    <path fill="#4285F4" d="M11.96 4.36c1.62 0 3.06.56 4.22 1.66l3.14-3.14C17.36 1.06 14.8 0 11.96 0 6.27 0 1.53 3.66.58 8.64l3.34 2.58c1.22-3.84 4.82-6.72 9.04-6.86z" />
                                    <path fill="#34A853" d="M11.96 23c5.68 0 10.43-3.08 12.38-7.62l-3.32-2.58c-.9 2.52-3.32 4.32-6.06 4.32-2.8 0-5.22-1.8-6.12-4.32l-3.34 2.58c2.1 3.52 5.86 5.82 10.46 7.62z" />
                                </svg>
                            )}
                            {authProvider === "apple" && (
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                    <path d="M17.05 20.28c-.98.95-2.05 1.88-3.36 1.9-1.28.02-1.7-.76-3.23-.76-1.53 0-2 .74-3.23.78-1.26.04-2.48-.98-3.47-1.93-2-2-3.53-5.63-1.47-9.2C3.33 9.4 5 8.35 6.8 8.3c1.38-.05 2.68.9 3.53.9.84 0 2.44-1.12 4.12-.95 1.7.07 3 1.25 3.82 2.45-2.5 1.5-2.08 4.74.43 5.8-.8 1.93-1.83 3.8-3.65 4.78zM12.92 6.8c.78-1.02 1.3-2.44 1.15-3.8-1.15.05-2.55.8-3.38 1.8-.75.88-1.4 2.34-1.25 3.66 1.3.1 2.6-.64 3.48-1.66z" />
                                </svg>
                            )}
                        </div>
                        <h1
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 30,
                                fontWeight: 900,
                                marginBottom: 8,
                            }}
                        >
                            Verify Your Account
                        </h1>
                        <p
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                color: "rgba(255,255,255,0.45)",
                                fontSize: 16,
                            }}
                        >
                            Please enter your email to continue with {authProvider === "google" ? "Google" : "Apple"}
                        </p>
                    </div>

                    <div
                        className="glass-card"
                        style={{
                            borderRadius: 28,
                            padding: "40px 32px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.02)",
                            marginBottom: 24,
                        }}
                    >
                        <p
                            style={{
                                color: G,
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: 2,
                                marginBottom: 16,
                            }}
                        >
                            Email Address
                        </p>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                borderRadius: 16,
                                border: "2px solid rgba(212,175,55,0.2)",
                                marginBottom: 24,
                                overflow: "hidden",
                                background: "rgba(0,0,0,0.3)",
                                transition: "border-color 0.3s ease",
                            }}
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                style={{
                                    flex: 1,
                                    background: "none",
                                    border: "none",
                                    outline: "none",
                                    padding: "18px 20px",
                                    color: "white",
                                    fontSize: 16,
                                    fontFamily: "'Inter',sans-serif",
                                    fontWeight: 600,
                                    letterSpacing: 0.5,
                                }}
                            />
                        </div>

                        <div className="w-full relative z-10">
                            <button
                                onClick={async () => { 
                                    if (email.includes("@")) {
                                        // Since backend only supports phone for now, we simulate OTP for email
                                        alert(`Demo Mode: An OTP has been sent to ${email} (Use 123456)`);
                                        setOtp(["1", "2", "3", "4", "5", "6"]);
                                        go("otp"); 
                                    }
                                }}
                                disabled={!email.includes("@")}
                                style={glassBtnStyle(email.includes("@"))}
                            >
                                Send Verification OTP →
                            </button>
                        </div>
                    </div>

                    <p style={{ textAlign: "center", marginTop: 24 }}>
                        <span
                            onClick={() => go("login")}
                            style={{
                                color: "rgba(255,255,255,0.45)",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 14,
                            }}
                        >
                            ← Back to all sign in options
                        </span>
                    </p>
                </div>
            </div>
        );

    /* ══════════════════════════════════════
         5. OTP VERIFICATION — Premium Redesign
      ══════════════════════════════════════ */
    if (screen === "otp")
        return (
            <div
                style={{
                    ...WRAP,
                    background:
                        "radial-gradient(circle at 50% 50%, #0a1a35 0%, #050D1A 100%)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0.1,
                        backgroundImage:
                            "radial-gradient(rgba(212,175,55,0.2) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                        pointerEvents: "none",
                    }}
                />

                <div
                    style={{
                        width: "100%",
                        maxWidth: 500,
                        zIndex: 1,
                        animation: "sfi 0.8s ease",
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: 44 }}>
                        <div
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                margin: "0 auto 24px",
                                background: "rgba(212,175,55,0.08)",
                                border: `2px solid ${G}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 48,
                            }}
                        >
                            🔐
                        </div>
                        <h1
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 32,
                                fontWeight: 900,
                                marginBottom: 12,
                            }}
                        >
                            Verification Code
                        </h1>
                        <p
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                color: "rgba(255,255,255,0.45)",
                                fontSize: 16,
                                lineHeight: 1.6,
                            }}
                        >
                            We've sent a 6-digit verification code to
                            <br />
                            <span style={{ color: G, fontWeight: 800, fontSize: 18 }}>
                                {authProvider === "phone" ? `+91 ${phone}` : email}
                            </span>
                        </p>
                    </div>

                    <div
                        className="glass-card"
                        style={{
                            borderRadius: 28,
                            padding: "40px 32px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.02)",
                            marginBottom: 24,
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                marginBottom: 32,
                                justifyContent: "center",
                            }}
                        >
                            {otp.map((d, i) => (
                                <input
                                    key={i}
                                    id={`otp-c-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={d}
                                    onChange={(e) => {
                                        const n = [...otp];
                                        n[i] = e.target.value.slice(-1);
                                        setOtp(n);
                                        if (e.target.value && i < 5)
                                            (
                                                document.getElementById(
                                                    `otp-c-${i + 1}`,
                                                ) as HTMLInputElement
                                            )?.focus();
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !otp[i] && i > 0)
                                            (
                                                document.getElementById(
                                                    `otp-c-${i - 1}`,
                                                ) as HTMLInputElement
                                            )?.focus();
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const data = e.clipboardData.getData("text").trim();
                                        if (/^\d{6}$/.test(data)) {
                                            const newOtp = data.split("");
                                            setOtp(newOtp);
                                            (document.getElementById("otp-c-5") as HTMLInputElement)?.focus();
                                        }
                                    }}
                                    style={{
                                        width: 60,
                                        height: 74,
                                        textAlign: "center",
                                        fontSize: 32,
                                        fontWeight: 900,
                                        borderRadius: 16,
                                        border: d
                                            ? `3px solid ${G}`
                                            : "2px solid rgba(255,255,255,0.1)",
                                        background: d ? "rgba(212,175,55,0.1)" : "rgba(0,0,0,0.3)",
                                        color: "white",
                                        outline: "none",
                                        fontFamily: "'Poppins', sans-serif",
                                        transition: "all 0.3s ease",
                                        boxShadow: d ? `0 0 20px rgba(212,175,55,0.15)` : "none",
                                    }}
                                />
                            ))}
                        </div>

                        <div className="w-full mt-2">
                            <button onClick={async () => {
                                try {
                                    const otpString = otp.join("");
                                    if (otpString.length === 6) {
                                        const res = await verifyOTP(`+91${phone}`, otpString);
                                        
                                        // result from authService already handles localStorage for tokens/user
                                        const backendUser = res.user || res.data?.user;
                                        
                                        if (backendUser && (backendUser.full_name || backendUser.name)) {
                                            if (backendUser.role === 'driver') {
                                                navigate("/driver-dashboard");
                                            } else {
                                                navigate("/book");
                                            }
                                        } else {
                                            go("profile");
                                        }
                                    }
                                } catch (e) {
                                    console.error("Critical error during OTP verification", e);
                                    alert("Verification failed. Please check your OTP and try again.");
                                }
                            }} style={glassBtnStyle(otp.join("").length === 6)}>Verify & Continue →</button>
                        </div>
                    </div>

                    <p
                        style={{
                            textAlign: "center",
                            color: "rgba(255,255,255,0.35)",
                            fontSize: 15,
                        }}
                    >
                        Didn't receive the code?{" "}
                        <span
                            onClick={async () => {
                                if (authProvider === "phone" && phone.length === 10) {
                                    try {
                                        const response = await requestOTP(`+91${phone}`, userRole);
                                        const otpValue = response?.otp;
                                        if (otpValue) {
                                            const otpArray = String(otpValue).split("").slice(0, 6);
                                            while(otpArray.length < 6) otpArray.push("");
                                            setOtp(otpArray);
                                            alert("OTP Resent successfully!");
                                        }
                                    } catch(e) {
                                        alert("OTP 123456 (Demo Mode)");
                                        setOtp("123456".split(""));
                                    }
                                } else if (authProvider !== "phone" && email) {
                                    alert("OTP 123456 (Demo Mode Email)");
                                    setOtp("123456".split(""));
                                }
                            }}
                            style={{
                                color: G,
                                cursor: "pointer",
                                fontWeight: 700,
                                borderBottom: `1px solid ${G}`,
                            }}
                        >
                            {authProvider === "phone" ? "Resend via SMS" : "Resend to Email"}
                        </span>{" "}
                        <span style={{ color: "rgba(255,255,255,0.2)", marginLeft: 8 }}>
                            Available Now
                        </span>
                    </p>
                    <p style={{ textAlign: "center", marginTop: 24 }}>
                        <span
                            onClick={() => go(authProvider === "phone" ? "login" : "email_login")}
                            style={{
                                color: "rgba(255,255,255,0.45)",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 14,
                            }}
                        >
                            {authProvider === "phone" ? "Try a different number" : "Try a different email"}
                        </span>
                    </p>
                </div>
            </div>
        );

    /* ══════════════════════════════════════
         PROFILE SETUP 
       ══════════════════════════════════════ */
    if (screen === "profile")
        return (
            <div style={{ ...WRAP }}>
                <div style={{ width: "100%", maxWidth: 500, zIndex: 1, animation: "sfi 0.8s ease" }}>
                    <div style={{ textAlign: "center", marginBottom: 44 }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px", background: "rgba(212,175,55,0.08)", border: `2px solid ${G}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 0 30px rgba(212,175,55,0.15)" }}>
                            👤
                        </div>
                        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 34, fontWeight: 900, marginBottom: 12 }}>Your Profile</h1>
                        <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)", fontSize: 16 }}>Help drivers recognize you</p>
                    </div>

                    <div className="glass-card" style={{ borderRadius: 28, padding: "32px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", marginBottom: 24 }}>
                        <div style={{ marginBottom: 20 }}>
                            <p style={{ color: G, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Full Name</p>
                            <input
                                type="text"
                                value={passengerName}
                                onChange={(e) => setPassengerName(e.target.value)}
                                placeholder="E.g., Priya Sharma"
                                style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "2px solid rgba(212,175,55,0.2)", borderRadius: 16, padding: "16px 20px", color: "white", fontSize: 16, outline: "none", transition: "border-color 0.3s ease" }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: G, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Age</p>
                                <input
                                    type="number"
                                    value={passengerAge}
                                    onChange={(e) => setPassengerAge(e.target.value)}
                                    placeholder="E.g., 25"
                                    min="13" max="100"
                                    style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "2px solid rgba(212,175,55,0.2)", borderRadius: 16, padding: "16px 20px", color: "white", fontSize: 16, outline: "none", transition: "border-color 0.3s ease" }}
                                />
                            </div>
                            <div style={{ flex: 1.5 }}>
                                <p style={{ color: G, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Gender</p>
                                <select
                                    value={passengerGender}
                                    onChange={(e) => setPassengerGender(e.target.value)}
                                    style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "2px solid rgba(212,175,55,0.2)", borderRadius: 16, padding: "16px 20px", color: "white", fontSize: 16, outline: "none", transition: "border-color 0.3s ease", appearance: "none" }}
                                >
                                    <option value="" disabled style={{ color: 'rgba(255,255,255,0.5)' }}>Select...</option>
                                    <option value="male" style={{ background: DARK, color: 'white' }}>Male</option>
                                    <option value="female" style={{ background: DARK, color: 'white' }}>Female</option>
                                    <option value="other" style={{ background: DARK, color: 'white' }}>Other</option>
                                </select>
                            </div>
                        </div>

                        <button 
                            onClick={() => go("permissions")}
                            disabled={!passengerName || !passengerAge || !passengerGender}
                            style={glassBtnStyle(!!passengerName && !!passengerAge && !!passengerGender)}
                        >
                            Continue →
                        </button>
                    </div>
                </div>
            </div>
        );

    /* ══════════════════════════════════════
         6. PERMISSIONS — Professional Update
      ══════════════════════════════════════ */
    const PERMS = [
        {
            id: "location",
            icon: <MapPin size={24} color={G} />,
            title: "Location Access",
            desc: "Essential to pinpoint your pickup and match you with nearby chariots.",
            required: true,
        },
        {
            id: "notifications",
            icon: <Bell size={24} color={G} />,
            title: "Push Notifications",
            desc: "Real-time updates on driver arrival, trip status and exclusive offers.",
            required: false,
        },
        {
            id: "contacts",
            icon: <Shield size={24} color={G} />,
            title: "Safety Contacts",
            desc: "Automatically share your trip details with trusted loved ones.",
            required: false,
        },
    ];

    return (
        <div
            style={{
                ...WRAP,
                background:
                    "radial-gradient(circle at 50% 50%, #0a1a35 0%, #050D1A 100%)",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    opacity: 0.1,
                    backgroundImage:
                        "radial-gradient(rgba(212,175,55,0.2) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(212,175,55,0.06), transparent 70%)",
                    bottom: -250,
                    left: -250,
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    width: "100%",
                    maxWidth: 600,
                    zIndex: 1,
                    animation: "sfi 0.8s ease",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 50 }}>
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            margin: "0 auto 24px",
                            background: "rgba(212,175,55,0.08)",
                            border: `2px solid ${G}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 48,
                            boxShadow: "0 0 30px rgba(212,175,55,0.15)",
                        }}
                    >
                        📍
                    </div>
                    <h1
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: 34,
                            fontWeight: 900,
                            marginBottom: 12,
                        }}
                    >
                        Essential Permissions
                    </h1>
                    <p
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "rgba(255,255,255,0.45)",
                            fontSize: 17,
                            lineHeight: 1.6,
                        }}
                    >
                        Grant these permissions for a seamless and secure experience.
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        marginBottom: 40,
                    }}
                >
                    {PERMS.map((p) => {
                        const granted = permsGranted[p.id];
                        return (
                            <div
                                key={p.id}
                                onClick={() =>
                                    setPermsGranted((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                                }
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 20,
                                    padding: "24px",
                                    borderRadius: 24,
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    background: granted
                                        ? "rgba(212,175,55,0.08)"
                                        : "rgba(255,255,255,0.03)",
                                    border: `1.5px solid ${granted ? G : "rgba(255,255,255,0.08)"}`,
                                    boxShadow: granted
                                        ? "0 10px 30px rgba(212,175,55,0.1)"
                                        : "none",
                                }}
                            >
                                <div
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 16,
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: granted
                                            ? "rgba(212,175,55,0.15)"
                                            : "rgba(255,255,255,0.05)",
                                        border: `1px solid ${granted ? G : "rgba(255,255,255,0.1)"}`,
                                    }}
                                >
                                    {p.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            marginBottom: 4,
                                        }}
                                    >
                                        <p
                                            style={{ color: "white", fontSize: 16, fontWeight: 700 }}
                                        >
                                            {p.title}
                                        </p>
                                        {p.required && (
                                            <span
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: "#FF8080",
                                                    padding: "2px 10px",
                                                    border: "1px solid rgba(255,100,100,0.3)",
                                                    borderRadius: 999,
                                                    background: "rgba(255,100,100,0.05)",
                                                }}
                                            >
                                                Required
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        style={{
                                            color: "rgba(255,255,255,0.4)",
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {p.desc}
                                    </p>
                                </div>
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: granted
                                            ? `linear-gradient(135deg, ${G}, #F0C040)`
                                            : "rgba(255,255,255,0.05)",
                                        border: `2px solid ${granted ? G : "rgba(255,255,255,0.1)"}`,
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    {granted && <Check size={18} color={DARK} strokeWidth={3} />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <button onClick={async () => {
                        const newPassenger = { 
                            phone_number: `+91${phone}`, 
                            phone: phone, 
                            full_name: passengerName,
                            age: passengerAge,
                            gender: passengerGender,
                            registered_at: new Date().toLocaleString() 
                        };
                        const updated = [...passengers.filter((p:any) => p.phone_number !== newPassenger.phone_number), newPassenger];
                        localStorage.setItem('saaradhigo_passengers', JSON.stringify(updated));
                        localStorage.setItem('saaradhigo_current_user', JSON.stringify(newPassenger));
                        
                        try {
                            await updateUserInfo({ full_name: passengerName, gender: passengerGender });
                        } catch(e) {}

                        navigate("/book");
                    }} style={glassBtnStyle(true)}>Enable & Start Journey</button>
                    <button
                        onClick={async () => {
                            const newPassenger = { 
                                phone_number: `+91${phone}`, 
                                phone: phone, 
                                full_name: passengerName,
                                age: passengerAge,
                                gender: passengerGender,
                                registered_at: new Date().toLocaleString() 
                            };
                            const updated = [...passengers.filter((p:any) => p.phone_number !== newPassenger.phone_number), newPassenger];
                            localStorage.setItem('saaradhigo_passengers', JSON.stringify(updated));
                            localStorage.setItem('saaradhigo_current_user', JSON.stringify(newPassenger));
                            
                            try {
                                await updateUserInfo({ full_name: passengerName, gender: passengerGender });
                            } catch(e) {}

                            navigate("/book");
                        }}
                        style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: 16,
                            border: "1.5px solid rgba(255,255,255,0.1)",
                            background: "transparent",
                            color: "rgba(255,255,255,0.45)",
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                        }
                    >
                        Remind Me Later
                    </button>
                </div>
            </div>
        </div>
    );
}
