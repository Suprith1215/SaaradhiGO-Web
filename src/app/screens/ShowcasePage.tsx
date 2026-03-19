import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Car } from "lucide-react";
import { motion } from "motion/react";
import ShinyText from "../components/ShinyText";
import { Globe } from "../../components/ui/interactive-globe";
import { ParticleCanvas } from "../components/ParticleCanvas";
import { Card3D } from "../components/Card3D";
import logoImage from "../../assets/25a5bd8011d7696bf02e1d5cc818a54ef634abf4.png";

/* ─── Brand Tokens ─── */
const G = "#D4AF37";
const G2 = "#F0C040";
const DARK = "#050D1A";
const NAVY = "#0F1C2E";
const NAVY2 = "#1E3A5F";
const GLASS = "rgba(255,255,255,0.04)";
const GLASS_BORDER = "rgba(255,255,255,0.09)";

/* ─── Smooth-scroll helper ─── */
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ─── Animated counter ─── */
function useCountUp(target: number, duration = 1800, started = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return val;
}

/* ─── Intersection observer hook ─── */
function useVisible(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Stat Card ─── */
function StatCard({ value, label, prefix = "", suffix = "" }: { value: number; label: string; prefix?: string; suffix?: string }) {
  const { ref, visible } = useVisible();
  const count = useCountUp(value, 1600, visible);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <p style={{ color: G, fontSize: 36, fontWeight: 900, lineHeight: 1 }}>
        {prefix}{count}{suffix}
      </p>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 4 }}>{label}</p>
    </div>
  );
}

/* ─── Section title ─── */
function SectionLabel({ tag, title, sub }: { tag: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 56 }}>
      <span style={{
        display: "inline-block", padding: "6px 18px", borderRadius: 999,
        background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.25)",
        color: G, fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
        textTransform: "uppercase", marginBottom: 16
      }}>{tag}</span>
      <h2 style={{
        color: "white", fontSize: "clamp(28px,4vw,44px)", fontWeight: 900,
        lineHeight: 1.15, marginBottom: 14
      }} dangerouslySetInnerHTML={{ __html: title }} />
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 17, maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>{sub}</p>
    </div>
  );
}

/* ─── Gold Button ─── */
function GoldBtn({ children, outline = false, onClick, href }: { children: React.ReactNode; outline?: boolean; onClick?: () => void; href?: string }) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "14px 28px", borderRadius: 12, fontWeight: 700,
    fontSize: 15, cursor: "pointer", textDecoration: "none",
    transition: "all 0.25s ease", border: "none"
  };
  const style: React.CSSProperties = outline
    ? { ...base, background: "transparent", border: `2px solid ${G}`, color: G, backdropFilter: "blur(8px)" }
    : {
      ...base,
      background: `linear-gradient(135deg, rgba(212,175,55,0.85), rgba(240,192,64,0.85))`,
      color: DARK,
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.4)",
      boxShadow: "0 8px 32px rgba(212,175,55,0.25)"
    };

  if (href) return <a href={href} style={style}>{children}</a>;
  return <button style={style} onClick={onClick}>{children}</button>;
}

/* ─── Premium Drive Button (Hero) ─── */
function DriveBtn({ onClick }: { onClick?: () => void }) {
  const [mPos, setMPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMPos({ x, y });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMPos({ x: 0, y: 0 })}
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${G}, ${G2})`,
        color: DARK,
        padding: "18px 42px",
        borderRadius: 20,
        fontWeight: 900,
        fontSize: 20,
        cursor: "pointer",
        border: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        position: "relative",
        boxShadow: `0 15px 35px rgba(212,175,55,0.3)`,
        perspective: "1000px",
        transformStyle: "preserve-3d" as any,
        transition: "box-shadow 0.3s ease"
      }}
      animate={{
        rotateX: mPos.y * -25,
        rotateY: mPos.x * 25,
        scale: mPos.x !== 0 || mPos.y !== 0 ? 1.05 : 1
      }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Driving Car Animation */}
      <motion.div
        animate={{
          x: [-2, 2, -2],
          rotate: [-1, 1, -1]
        }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Car size={26} fill="currentColor" strokeWidth={2.5} />
      </motion.div>

      <span style={{ transform: "translateZ(30px)" }}>Drive in</span>

      {/* Glossy / Light flare */}
      <motion.div
        animate={{ x: ["-180%", "180%"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          transform: "skewX(-25deg) scale(1.5)",
          zIndex: 0
        }}
      />
    </motion.button>
  );
}

export function ShowcasePage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Widget state
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [showPrices, setShowPrices] = useState(false);
  const [modalOpen, setModalOpen] = useState<string | null>(null);

  // ── Modal content dictionary ──
  const MODAL_CONTENT: Record<string, { title: string; body: string }> = {
    about: {
      title: "About SaaradhiGO",
      body: `<p>SaaradhiGO is India's fastest-growing premium ride-hailing platform, founded in 2024 in Bengaluru with a mission to redefine urban mobility. We combine cutting-edge technology with a deep commitment to safety, affordability, and driver welfare.</p><br/>
      <p><strong style="color:#D4AF37">Our Mission:</strong> To make every journey safer, faster, and more dignified — for both riders and drivers.</p><br/>
      <p><strong style="color:#D4AF37">Our Vision:</strong> To be the most trusted mobility platform in South Asia by 2028, operating in 100+ cities.</p><br/>
      <p><strong style="color:#D4AF37">Founded:</strong> 2024 · Bengaluru, India</p>
      <p><strong style="color:#D4AF37">Team:</strong> 200+ passionate professionals across engineering, operations, safety, and design.</p><br/>
      <p>We offer Cars, Autos, Bikes, and Premium vehicles. Our AI-powered matching algorithm connects riders with the nearest verified driver in under 30 seconds.</p>`
    },
    blog: {
      title: "SaaradhiGO Blog",
      body: `<p>Stay up-to-date with the latest news, features, and stories from SaaradhiGO.</p><br/>
      <p><strong style="color:#D4AF37">Latest Posts:</strong></p>
      <div style="margin-top:12px; display:flex; flex-direction:column; gap:14px">
        <div style="border-left:2px solid #D4AF37; padding-left:12px"><strong>Introducing SaaradhiPrime — Luxury rides at ₹199</strong><br/><span style="font-size:12px;color:rgba(255,255,255,0.4)">March 2026</span></div>
        <div style="border-left:2px solid #60A5FA; padding-left:12px"><strong>How we verified 2,000 drivers in 60 days</strong><br/><span style="font-size:12px;color:rgba(255,255,255,0.4)">February 2026</span></div>
        <div style="border-left:2px solid #34D399; padding-left:12px"><strong>SaaradhiGO Safety Report 2025</strong><br/><span style="font-size:12px;color:rgba(255,255,255,0.4)">January 2026</span></div>
        <div style="border-left:2px solid #A78BFA; padding-left:12px"><strong>Expanding to 10 new cities this quarter</strong><br/><span style="font-size:12px;color:rgba(255,255,255,0.4)">December 2025</span></div>
      </div><br/>
      <p>📧 Subscribe: blog@saaradhigo.in</p>`
    },
    partners: {
      title: "Partner with SaaradhiGO",
      body: `<p>We work with businesses, hotels, hospitals, airports, and corporate clients to provide seamless transportation solutions.</p><br/>
      <p><strong style="color:#D4AF37">Partnership Types:</strong></p>
      <ul style="list-style:none; padding:0; margin-top:8px; display:flex; flex-direction:column; gap:10px">
        <li>🏢 <strong>Corporate Accounts</strong> — Managed travel for your employees</li>
        <li>🏨 <strong>Hotel Concierge</strong> — White-label rides for guests</li>
        <li>🏥 <strong>Healthcare</strong> — Priority transport for hospitals</li>
        <li>✈️ <strong>Airport Partners</strong> — Pre-booked airport transfers</li>
        <li>📦 <strong>Delivery Partners</strong> — Last-mile logistics solutions</li>
      </ul><br/>
      <p>📧 Contact us at <strong style="color:#D4AF37">partners@saaradhigo.in</strong> or call <strong>+91 98765 43212</strong></p>`
    },
    privacy: {
      title: "Privacy Policy",
      body: `<p>Last updated: March 2026</p><br/>
      <p>SaaradhiGO Technologies Pvt. Ltd. ("SaaradhiGO", "we", "us") is committed to protecting your personal information and your right to privacy.</p><br/>
      <p><strong style="color:#D4AF37">What we collect:</strong> Name, phone number, email, location data (only during active rides), payment information, and device identifiers.</p><br/>
      <p><strong style="color:#D4AF37">How we use it:</strong> To facilitate bookings, provide driver matching, process payments, improve our services, and ensure safety.</p><br/>
      <p><strong style="color:#D4AF37">We never:</strong> Sell your personal data to third parties, share your location outside of active rides, or retain payment card details on our servers.</p><br/>
      <p><strong style="color:#D4AF37">Data retention:</strong> Trip data is retained for 3 years for legal compliance. Account data is deleted within 30 days of account closure request.</p><br/>
      <p>📧 Privacy queries: privacy@saaradhigo.in</p>`
    },
    terms: {
      title: "Terms of Service",
      body: `<p>Last updated: March 2026</p><br/>
      <p>By using SaaradhiGO, you agree to these terms. Please read them carefully.</p><br/>
      <p><strong style="color:#D4AF37">User Responsibilities:</strong> You must be 18+ to use the platform. You agree to provide accurate information and not misuse the service.</p><br/>
      <p><strong style="color:#D4AF37">Cancellation Policy:</strong> Free cancellation up to 2 minutes after driver assignment. After that, a ₹20–50 cancellation fee applies depending on vehicle type.</p><br/>
      <p><strong style="color:#D4AF37">Payments:</strong> All transactions are processed securely via RazorPay. SaaradhiGO is not liable for failed transactions due to bank issues.</p><br/>
      <p><strong style="color:#D4AF37">Platform Use:</strong> Misuse, fraudulent rides, or driver harassment may result in permanent account suspension.</p><br/>
      <p>📧 Legal queries: legal@saaradhigo.in</p>`
    },
    cookies: {
      title: "Cookie Policy",
      body: `<p>Last updated: March 2026</p><br/>
      <p>SaaradhiGO uses cookies and similar tracking technologies to enhance your experience.</p><br/>
      <p><strong style="color:#D4AF37">Essential Cookies:</strong> Required for the app to function — authentication, session management, security tokens.</p><br/>
      <p><strong style="color:#D4AF37">Analytics Cookies:</strong> Help us understand how users interact with our platform (anonymised). Powered by Firebase Analytics.</p><br/>
      <p><strong style="color:#D4AF37">Preference Cookies:</strong> Remember your saved locations, language, and UI preferences.</p><br/>
      <p><strong style="color:#D4AF37">Marketing Cookies:</strong> Used only with your consent to show personalised offers. You can opt out at any time in Settings → Privacy.</p><br/>
      <p>You can manage cookie preferences in your browser settings or our app settings.</p>`
    },
    licenses: {
      title: "Licenses & Certifications",
      body: `<p>SaaradhiGO operates in full compliance with applicable transport, data protection, and financial regulations.</p><br/>
      <p><strong style="color:#D4AF37">Aggregator License:</strong> Issued under the Motor Vehicles Act, 1988 (Amended 2019) — Karnataka State Transport Authority</p><br/>
      <p><strong style="color:#D4AF37">Data Protection:</strong> Compliant with the Digital Personal Data Protection Act, 2023 (India)</p><br/>
      <p><strong style="color:#D4AF37">Payment Gateway:</strong> PCI-DSS compliant via RazorPay · RBI registered</p><br/>
      <p><strong style="color:#D4AF37">GST Registration:</strong> 29AAFCS1234A1Z5</p><br/>
      <p><strong style="color:#D4AF37">CIN:</strong> U74999KA2024PTC123456</p><br/>
      <p><strong style="color:#D4AF37">Open Source:</strong> SaaradhiGO uses React, Node.js, PostgreSQL, Leaflet, and other OSS libraries under their respective licenses.</p>`
    },
    compliance: {
      title: "Compliance",
      body: `<p>SaaradhiGO is committed to the highest standards of regulatory compliance and ethical business practices.</p><br/>
      <p><strong style="color:#D4AF37">Vehicle Compliance:</strong> All driver vehicles undergo monthly fitness checks. We reject vehicles older than 10 years.</p><br/>
      <p><strong style="color:#D4AF37">Driver Compliance:</strong> Police verification, DL validation, and Aadhaar-linked KYC is mandatory for all drivers before onboarding.</p><br/>
      <p><strong style="color:#D4AF37">Anti-Discrimination:</strong> We have a zero-tolerance policy for driver discrimination on gender, caste, religion, or disability.</p><br/>
      <p><strong style="color:#D4AF37">Surge Transparency:</strong> All surge pricing is disclosed upfront before booking confirmation, per KSTA guidelines.</p><br/>
      <p>📧 Compliance queries: compliance@saaradhigo.in</p>`
    },
    help: {
      title: "Help Center",
      body: `<p>Welcome to the SaaradhiGO Help Center. Find answers to the most common questions about bookings, payments, and safety.</p><br/>
      <p><strong style="color:#D4AF37">🚗 Booking Issues</strong></p>
      <p>If your ride was not confirmed within 5 minutes, it is automatically cancelled and no charge is applied. You can try booking again with a different vehicle category.</p><br/>
      <p><strong style="color:#D4AF37">💳 Payment Issues</strong></p>
      <p>Duplicate charges are reversed within 3–5 working days automatically. If you don't see the refund, contact support with your ride ID.</p><br/>
      <p><strong style="color:#D4AF37">📍 Wrong Route</strong></p>
      <p>If your driver took a significantly longer route, raise a fare dispute within 24 hours via the app under Ride History → Dispute Fare.</p><br/>
      <p><strong style="color:#D4AF37">🔑 Lost Items</strong></p>
      <p>Use the "Lost Item" feature in your recent rides to contact the driver directly via an anonymised call for up to 48 hours after the trip.</p><br/>
      <p>📧 <strong style="color:#D4AF37">help@saaradhigo.in</strong> · ☎ <strong style="color:#D4AF37">+91 98765 43210</strong> (Available 9AM–9PM daily)</p>`
    },
    safety: {
      title: "Safety at SaaradhiGO",
      body: `<p>Safety is our #1 priority. We've built multiple features to ensure you're protected throughout your journey.</p><br/>
      <p><strong style="color:#D4AF37">🛡️ 24/7 Safety Support</strong> — A dedicated team monitoring rides and responding to SOS alerts in real-time.</p><br/>
      <p><strong style="color:#D4AF37">📍 Live Trip Sharing</strong> — Share your ride status with friends and family so they know exactly where you are.</p><br/>
      <p><strong style="color:#D4AF37">👮 Verified Drivers</strong> — Every driver-partner undergoes a rigorous background check and police verification before onboarding.</p><br/>
      <p><strong style="color:#D4AF37">🆘 SOS Button</strong> — Instant connection to local emergency services and our safety response team.</p><br/>
      <p><strong style="color:#D4AF37">😷 Hygiene Standards</strong> — Hand sanitizers and mandatory mask-wearing for all premium categories.</p>`
    },
    careers: {
      title: "Careers",
      body: `<p>Join the team that's building the future of urban mobility in India.</p><br/>
      <p><strong style="color:#D4AF37">Life at SaaradhiGO:</strong> We value innovation, customer-centricity, and speed. We're a remote-first company with hubs in Bengaluru and Hyderabad.</p><br/>
      <p><strong style="color:#D4AF37">Open Positions:</strong></p>
      <ul style="margin-top:8px; display:flex; flex-direction:column; gap:8px">
        <li>Backend Engineer (Node/Go/PostgreSQL)</li>
        <li>Product Manager (Growth)</li>
        <li>City Operations Lead (Chennai)</li>
        <li>UI/UX Designer (Mobile)</li>
      </ul><br/>
      <p>Email your CV to <strong style="color:#D4AF37">careers@saaradhigo.in</strong> to apply.</p>`
    },
    press: {
      title: "Press & Media",
      body: `<p>For media inquiries, interviews, and brand assets.</p><br/>
      <p><strong style="color:#D4AF37">Media Contact:</strong> press@saaradhigo.in</p><br/>
      <p><strong style="color:#D4AF37">SaaradhiGO in the News:</strong></p>
      <ul style="margin-top:8px; display:flex; flex-direction:column; gap:8px">
        <li>"SaaradhiGO hits 1 million rides milestone" — <strong>Tech Today</strong></li>
        <li>"The startup redefining premium cabs in India" — <strong>Financial Express</strong></li>
        <li>"Safety first: The SaaradhiGO approach" — <strong>The Hindu</strong></li>
      </ul><br/>
      <p>Download our <strong style="color:#D4AF37">Media Kit</strong> for high-res logos and executive photos.</p>`
    },
    investors: {
      title: "Investor Relations",
      body: `<p>SaaradhiGO is backed by top-tier venture capital firms committed to sustainable mobility.</p><br/>
      <p><strong style="color:#D4AF37">Our Growth:</strong> Over 200% YoY growth in active users and 150% growth in driver-partners across South India.</p><br/>
      <p><strong style="color:#D4AF37">Current Round:</strong> Series B for expansion into 50+ new tier-2 cities.</p><br/>
      <p>For investment inquiries, please contact our finance team at <strong style="color:#D4AF37">investors@saaradhigo.in</strong></p>`
    },
    "contact-us": {
      title: "Contact Us",
      body: `<p>Need to get in touch? We're available across multiple channels.</p><br/>
      <p><strong style="color:#D4AF37">📧 Support:</strong> support@saaradhigo.in (24/7)</p>
      <p><strong style="color:#D4AF37">📧 Partnerships:</strong> partners@saaradhigo.in</p>
      <p><strong style="color:#D4AF37">📞 Customer Helpline:</strong> +91 98765 43210 (9AM–9PM)</p>
      <p><strong style="color:#D4AF37">📍 Head Office:</strong> Koramangala 5th Block, Bengaluru, KA - 560095</p>`
    },
    "driver-support": {
      title: "Driver Support",
      body: `<p>SaaradhiGO values its driver-partners. We offer dedicated support for all driver-related issues.</p><br/>
      <p><strong style="color:#D4AF37">🚗 Onboarding Help</strong><br/>If your documents are pending verification, call our Driver Helpline: <strong>+91 98765 43213</strong></p><br/>
      <p><strong style="color:#D4AF37">💳 Earnings & Payouts</strong><br/>Weekly payouts every Monday. If you have a payout discrepancy, email <strong>driver-finance@saaradhigo.in</strong></p><br/>
      <p><strong style="color:#D4AF37">🛡 Safety Support</strong><br/>In case of passenger misconduct, use the SOS button in the driver app. Our 24/7 safety team responds in under 60 seconds.</p><br/>
      <p><strong style="color:#D4AF37">📊 Incentives</strong><br/>Complete 15+ rides/day for Gold tier benefits. Check the app's Earnings tab for current incentive schemes.</p><br/>
      <p>📧 driver.support@saaradhigo.in</p>`
    },
    report: {
      title: "Report an Issue",
      body: `<p>Your safety and trust is our top priority. Please report any issue and we will act within 24 hours.</p><br/>
      <p><strong style="color:#D4AF37">How to report in-app:</strong></p>
      <ol style="list-style:decimal; padding-left:20px; margin-top:8px; display:flex; flex-direction:column; gap:8px">
        <li>Open SaaradhiGO app</li>
        <li>Go to Ride History</li>
        <li>Select the ride</li>
        <li>Tap "Report Issue"</li>
        <li>Choose your issue type and describe it</li>
      </ol><br/>
      <p><strong style="color:#D4AF37">Emergency:</strong> If you are in immediate danger, call <strong>112</strong> (India Emergency) or use the SOS button in-app.</p><br/>
      <p><strong style="color:#D4AF37">Report Fraud:</strong> security@saaradhigo.in</p>
      <p><strong style="color:#D4AF37">Report Driver Misconduct:</strong> safety@saaradhigo.in</p>`
    },
    faqs: {
      title: "Frequently Asked Questions",
      body: `<div style="display:flex;flex-direction:column;gap:16px">
        <div><p style="color:#D4AF37;font-weight:700">How do I book a ride?</p><p>Open the app → Enter pickup and drop → Choose vehicle → Confirm. That's it! A driver is assigned in under 30 seconds.</p></div>
        <div><p style="color:#D4AF37;font-weight:700">What payment methods are accepted?</p><p>UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, and SaaradhiWallet in-app credits.</p></div>
        <div><p style="color:#D4AF37;font-weight:700">Can I schedule a ride in advance?</p><p>Yes! Use "Schedule Ride" in the booking screen. Available up to 7 days in advance.</p></div>
        <div><p style="color:#D4AF37;font-weight:700">Is SaaradhiGO available 24/7?</p><p>Yes, our platform operates 24 hours a day, 7 days a week in all active cities.</p></div>
        <div><p style="color:#D4AF37;font-weight:700">How are drivers verified?</p><p>All drivers undergo police verification, DL check, vehicle fitness check, and Aadhaar-linked KYC before their first ride.</p></div>
        <div><p style="color:#D4AF37;font-weight:700">What is the cancellation policy?</p><p>Free cancellation within 2 minutes of driver assignment. A small fee (₹20–₹50) applies after that.</p></div>
      </div>`
    },
  };

  const [isLoadingPrices, setIsLoadingPrices] = useState(false);

  const handleSeePrices = () => {
    if (!pickup || !dropoff) return;
    setIsLoadingPrices(true);
    setTimeout(() => {
      setIsLoadingPrices(false);
      setShowPrices(true);
    }, 800);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Ride", id: "riders" },
    { label: "Drive", id: "drivers" },
    { label: "Business", id: "business" },
    { label: "About", id: "about" },
    { label: "Admin", id: "admin", path: "/admin" },
  ];

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: `linear-gradient(180deg, ${DARK} 0%, ${NAVY} 40%, ${NAVY2} 100%)`,
      minHeight: "100vh",
      color: "white",
      overflowX: "hidden"
    }}>
      {/* ══════════════════════════════════════
          1. NAVBAR
      ══════════════════════════════════════ */}
      < header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5vw",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 80,
        background: scrolled ? "rgba(5,13,26,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? `1px solid ${GLASS_BORDER}` : "none",
        transition: "all 0.35s ease"
      }}>
        {/* Left Side: Logo + Nav */}
        < div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {/* Logo */}
          < div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => scrollTo("hero")}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, overflow: "hidden",
              border: `2px solid ${G}`, background: "#000",
              boxShadow: `0 0 20px rgba(212,175,55,0.2)`
            }}>
              <img src={logoImage} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontWeight: 900, fontSize: 24, letterSpacing: 1.5 }}>
                <ShinyText text="SAARADHI" speed={3} color={G} shineColor="#fff" />
                <ShinyText text="GO" speed={3} color="#fff" shineColor={G} />
              </span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 3, marginTop: 2, fontWeight: 700 }}>PREMIUM RIDES</span>
            </div>
          </div >

          {/* Desktop Nav Links */}
          < nav style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav" >
            {
              navLinks.map(l => (
                <button key={l.id + l.label} 
                  onClick={() => 'path' in l ? navigate((l as any).path) : scrollTo(l.id)} 
                  style={{
                    background: "none", border: "none", color: "white",
                    fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 12px",
                    borderRadius: 999, transition: "background 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >{l.label}</button>
              ))
            }
          </nav >
        </div >

        {/* Right Nav */}
        < nav style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav" >
          <button style={{
            background: "none", border: "none", color: "white",
            fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 12px",
            borderRadius: 999, transition: "background 0.2s", display: "flex", alignItems: "center", gap: 6
          }}
            onClick={() => navigate("/")}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <span>🌐</span> EN
          </button>

          <button style={{
            background: "none", border: "none", color: "white",
            fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 12px",
            borderRadius: 999, transition: "background 0.2s"
          }}
            onClick={() => scrollTo("contact")}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Help
          </button>

          <button style={{
            background: "none", border: "none", color: "white",
            fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 16px",
            borderRadius: 999, transition: "background 0.2s"
          }}
            onClick={() => navigate("/login")}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Log in
          </button>

          <button style={{
            background: "white", border: "none", color: "black",
            fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "10px 16px",
            borderRadius: 999, transition: "background 0.2s", marginLeft: 8
          }}
            onClick={() => navigate("/login")}
            onMouseEnter={e => (e.currentTarget.style.background = "#e2e2e2")}
            onMouseLeave={e => (e.currentTarget.style.background = "white")}
          >
            Sign up
          </button>
        </nav >

        {/* Mobile hamburger */}
        < button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none", border: `1px solid ${GLASS_BORDER}`, borderRadius: 8,
            padding: "8px 12px", color: "white", cursor: "pointer", fontSize: 18,
            display: "none"
          }}
        >☰</button >
      </header >

      {/* Mobile Drawer */}
      {
        mobileOpen && (
          <div style={{
            position: "fixed", top: 80, left: 0, right: 0, zIndex: 99,
            background: "rgba(5,13,26,0.98)", backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${GLASS_BORDER}`, padding: "16px 24px 24px"
          }}>
            {navLinks.map(l => (
              <button key={l.id} onClick={() => { scrollTo(l.id); setMobileOpen(false); }} style={{
                display: "block", width: "100%", textAlign: "left",
                background: "none", border: "none", color: "rgba(255,255,255,0.75)",
                fontSize: 16, fontWeight: 500, padding: "12px 0",
                borderBottom: `1px solid ${GLASS_BORDER}`, cursor: "pointer"
              }}>{l.label}</button>
            ))}
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              <button style={{
                background: "none", border: `2px solid ${G}`, color: G,
                fontSize: 16, fontWeight: 600, cursor: "pointer", padding: "12px",
                borderRadius: 12, transition: "background 0.2s"
              }} onClick={() => { navigate("/login"); setMobileOpen(false); }}>
                Log in
              </button>
              <button style={{
                background: "white", border: "none", color: "black",
                fontSize: 16, fontWeight: 600, cursor: "pointer", padding: "12px",
                borderRadius: 12, transition: "background 0.2s"
              }} onClick={() => { navigate("/login"); setMobileOpen(false); }}>
                Sign up
              </button>
            </div>
          </div>
        )
      }

      {/* ══════════════════════════════════════
          2. HERO SECTION
      ══════════════════════════════════════ */}
      <section id="hero" style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "100px 5vw 60px", position: "relative", overflow: "hidden"
      }}>
        {/* ── Particle Network ── */}
        <ParticleCanvas
          particleCount={70}
          maxConnection={130}
          colors={["#D4AF37", "#60A5FA", "#A78BFA", "#34D399"]}
          style={{ zIndex: 0 }}
        />

        {/* ── Animated gradient mesh ── */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          background: `
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(212,175,55,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 20% 70%, rgba(96,165,250,0.05) 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 85% 80%, rgba(167,139,250,0.04) 0%, transparent 50%)
          `
        }} />

        {/* ── Cinematic orbs ── */}
        <div style={{
          position: "absolute", width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.09), transparent 70%)",
          top: -250, right: -150, pointerEvents: "none", zIndex: 1,
          animation: "floatBlob 10s ease-in-out infinite alternate",
          filter: "blur(40px)"
        }} />
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.07), transparent 70%)",
          bottom: -120, left: -80, pointerEvents: "none", zIndex: 1,
          animation: "floatBlob 14s ease-in-out infinite alternate-reverse",
          filter: "blur(50px)"
        }} />
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.06), transparent 70%)",
          top: "40%", left: "45%", pointerEvents: "none", zIndex: 1,
          animation: "floatBlob 18s ease-in-out infinite alternate",
          filter: "blur(60px)"
        }} />

        {/* ── Grid overlay ── */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          opacity: 0.025,
          backgroundImage: "linear-gradient(rgba(212,175,55,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.8) 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }} />

        <div style={{
          maxWidth: 1200, margin: "0 auto", width: "100%",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
          position: "relative", zIndex: 2
        }} className="hero-grid">
          {/* LEFT: Text */}
          <div style={{ animation: "fadeUp 0.8s ease forwards" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 999, marginBottom: 24,
              background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.25)"
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: G, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
              <span style={{ color: G, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>NOW AVAILABLE IN INDIA</span>
            </div>

            <h1 style={{
              fontSize: "clamp(34px,5vw,62px)", fontWeight: 900,
              lineHeight: 1.1, marginBottom: 20, color: "white"
            }}>
              Ride Smart.<br />
              Ride Safe.<br />
              <span style={{
                background: `linear-gradient(135deg, ${G}, ${G2})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Ride with SaaradhiGO.</span>
            </h1>

            <p style={{
              color: "rgba(255,255,255,0.5)", fontSize: 18, lineHeight: 1.7,
              marginBottom: 36, maxWidth: 480
            }}>
              Fast, reliable, and premium ride-hailing experience — inspired by the royal chariot.
              Your commute, elevated to a luxury standard.
            </p>

            <div style={{
              background: "rgba(15,28,46,0.6)",
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: 24,
              padding: 24,
              marginBottom: 52,
              backdropFilter: "blur(12px)",
              maxWidth: 420
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: "white" }}>Request a ride</h3>

              {!showPrices ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
                  {/* Connecting line */}
                  <div style={{ position: "absolute", left: 20, top: 24, bottom: 76, width: 2, background: "rgba(255,255,255,0.1)", zIndex: 0 }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: "white" }} />
                    <input
                      placeholder="Pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      style={{
                        width: "100%", padding: "16px 16px 16px 44px", borderRadius: 12,
                        background: "rgba(255,255,255,0.06)", border: "none", color: "white", fontSize: 16,
                        outline: "none", boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 10, height: 10, background: "white" }} />
                    <input
                      placeholder="Dropoff location"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      style={{
                        width: "100%", padding: "16px 16px 16px 44px", borderRadius: 12,
                        background: "rgba(255,255,255,0.06)", border: "none", color: "white", fontSize: 16,
                        outline: "none", boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSeePrices}
                    disabled={!pickup || !dropoff || isLoadingPrices}
                    style={{
                      background: pickup && dropoff ? `linear-gradient(135deg, rgba(212,175,55,0.85), rgba(240,192,64,0.85))` : "rgba(255,255,255,0.1)",
                      color: pickup && dropoff ? DARK : "rgba(255,255,255,0.4)",
                      padding: "16px", borderRadius: 12, fontSize: 18, fontWeight: 800,
                      border: pickup && dropoff ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                      boxShadow: pickup && dropoff ? "0 8px 32px rgba(212,175,55,0.25)" : "none",
                      cursor: pickup && dropoff ? "pointer" : "not-allowed",
                      marginTop: 8, transition: "transform 0.2s ease, background 0.2s"
                    }}
                    onMouseOver={(e) => { if (pickup && dropoff) e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseOut={(e) => { if (pickup && dropoff) e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    {isLoadingPrices ? "Searching..." : "See prices"}
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                      <span style={{ color: "white" }}>{pickup}</span> → <span style={{ color: "white" }}>{dropoff}</span>
                    </div>
                    <button onClick={() => setShowPrices(false)} style={{ background: "none", border: "none", color: G, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                  </div>

                  {[
                    { type: "Mini", price: "₹240", time: "4 min", desc: "Affordable, compact rides", img: "🚗" },
                    { type: "Prime Sedans", price: "₹310", time: "6 min", desc: "Top sedans with free Wi-Fi", img: "🚙" },
                    { type: "Auto", price: "₹150", time: "2 min", desc: "No haggling, doorstep pickup", img: "🛺" },
                  ].map((car) => (
                    <div key={car.type} onClick={() => navigate("/login")} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${GLASS_BORDER}`, cursor: "pointer",
                      transition: "background 0.2s, border 0.2s"
                    }}
                      onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = G; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = GLASS_BORDER; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ fontSize: 32 }}>{car.img}</div>
                        <div>
                          <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{car.type} <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500, marginLeft: 6 }}>{car.time}</span></div>
                          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>{car.desc}</div>
                        </div>
                      </div>
                      <div style={{ color: "white", fontWeight: 800, fontSize: 18 }}>{car.price}</div>
                    </div>
                  ))}

                  <button onClick={() => navigate("/login")} style={{
                    background: `linear-gradient(135deg, rgba(212,175,55,0.85), rgba(240,192,64,0.85))`,
                    color: DARK, padding: "16px", borderRadius: 12, fontSize: 18, fontWeight: 800,
                    border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "0 8px 32px rgba(212,175,55,0.25)",
                    cursor: "pointer", marginTop: 12, transition: "transform 0.2s ease"
                  }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    Select & Book
                  </button>
                </motion.div>
              )}
            </div>

            {/* Trust Badges — 3D glass pills */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { icon: "⭐", text: "4.9 Rating", color: "#D4AF37" },
                { icon: "🛡️", text: "Insured Rides", color: "#60D080" },
                { icon: "⚡", text: "10-sec Booking", color: "#60A5FA" },
                { icon: "🔒", text: "Zero Data Sell", color: "#A78BFA" },
              ].map(b => (
                <div key={b.text} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: `rgba(${b.color === "#D4AF37" ? "212,175,55" : b.color === "#60D080" ? "96,208,128" : b.color === "#60A5FA" ? "96,165,250" : "167,139,250"},0.08)`,
                  border: `1px solid ${b.color}30`,
                  borderRadius: 999, padding: "7px 14px",
                  backdropFilter: "blur(12px)",
                  boxShadow: `0 4px 20px ${b.color}10`,
                  color: b.color, fontSize: 12, fontWeight: 700,
                  transition: "transform 0.2s",
                  cursor: "default"
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px) scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
                >
                  <span>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Globe */}
          <div className="igw" style={{ display: "flex", justifyContent: "center" }}>
            <Globe size={520}
              markers={[
                { lat: 80.0, lng: 0.0, label: "Delhi" },
                { lat: 73.0, lng: 110.0, label: "Chandigarh" },
                { lat: 68.0, lng: -110.0, label: "Jaipur" },
                { lat: 47.0, lng: 55.0, label: "Lucknow" },
                { lat: 43.0, lng: -45.0, label: "Surat" },
                { lat: 38.0, lng: 165.0, label: "Bhubaneswar" },
                { lat: 33.0, lng: -160.0, label: "Ahmedabad" },
                { lat: 12.0, lng: 20.0, label: "Mumbai" },
                { lat: 8.0, lng: 115.0, label: "Nagpur" },
                { lat: 2.0, lng: -70.0, label: "Indore" },
                { lat: -4.0, lng: -165.0, label: "Hyderabad" },
                { lat: -28.0, lng: 40.0, label: "Chennai" },
                { lat: -32.0, lng: -30.0, label: "Bengaluru" },
                { lat: -36.0, lng: 130.0, label: "Pune" },
                { lat: -42.0, lng: -130.0, label: "Visakhapatnam" },
                { lat: -62.0, lng: 75.0, label: "Kochi" },
                { lat: -68.0, lng: -60.0, label: "Kolkata" },
              ]}
              connections={[
                { from: [80.0, 0.0], to: [47.0, 55.0] },
                { from: [80.0, 0.0], to: [43.0, -45.0] },
                { from: [73.0, 110.0], to: [38.0, 165.0] },
                { from: [47.0, 55.0], to: [12.0, 20.0] },
                { from: [43.0, -45.0], to: [2.0, -70.0] },
                { from: [12.0, 20.0], to: [-28.0, 40.0] },
                { from: [8.0, 115.0], to: [-36.0, 130.0] },
                { from: [-28.0, 40.0], to: [-32.0, -30.0] },
                { from: [-32.0, -30.0], to: [-62.0, 75.0] },
                { from: [-62.0, 75.0], to: [-68.0, -60.0] },
                { from: [-42.0, -130.0], to: [-4.0, -165.0] },
                { from: [68.0, -110.0], to: [33.0, -160.0] },
              ]}
            />
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════ */}
      {/* ════ STATS BAND — 3D glass cards ════ */}
      <div style={{
        background: "rgba(5,13,26,0.8)",
        backdropFilter: "blur(20px)",
        borderTop: `1px solid rgba(212,175,55,0.15)`,
        borderBottom: `1px solid rgba(212,175,55,0.15)`,
        padding: "40px 5vw",
        position: "relative", overflow: "hidden"
      }}>
        {/* Subtle shimmer line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
          animation: "shimmerLine 3s ease-in-out infinite"
        }} />
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 16
        }}>
          {[
            { value: 50000, label: "Happy Riders", suffix: "+", prefix: "", icon: "👥", color: "#D4AF37" },
            { value: 2000, label: "Driver Partners", suffix: "+", prefix: "", icon: "🚗", color: "#60A5FA" },
            { value: 49, label: "App Rating", suffix: "★", prefix: "4.", icon: "⭐", color: "#F59E0B" },
            { value: 100, label: "Cities Launching", suffix: "+", prefix: "", icon: "🏙️", color: "#34D399" },
            { value: 98, label: "Satisfaction Rate", suffix: "%", prefix: "", icon: "💚", color: "#60D080" },
          ].map((s, i) => (
            <Card3D key={i} glowColor={s.color} style={{
              background: "rgba(255,255,255,0.03)",
              padding: "20px 16px", textAlign: "center"
            }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
              <StatCard value={s.value} label={s.label} suffix={s.suffix} prefix={s.prefix} />
            </Card3D>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          3. HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: "100px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel
            tag="How It Works"
            title='Simple. Fast. <span style="color:#D4AF37">Reliable.</span>'
            sub="Book a ride in under 10 seconds. Three simple steps and you're on your way."
          />

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24
          }}>
            {[
              {
                step: "01", icon: "📍", title: "Request a Ride",
                desc: "Open the app, enter your pickup and drop-off location. Choose your preferred ride category — Bike, Auto, Mini, or Prime.",
                color: "#D4AF37"
              },
              {
                step: "02", icon: "📡", title: "Track in Real-Time",
                desc: "Get instant driver match and live GPS tracking. Watch your driver arrive on the map in real-time.",
                color: "#60B4FF"
              },
              {
                step: "03", icon: "💳", title: "Safe & Secure Payment",
                desc: "Pay via UPI, card, or SaaradhiWallet. Get an instant digital receipt after every ride.",
                color: "#60D080"
              },
            ].map((item, i) => (
              <StepCard key={i} {...item} />
            ))}
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          4. FOR RIDERS
      ══════════════════════════════════════ */}
      <section id="riders" style={{
        padding: "100px 5vw",
        background: "rgba(0,0,0,0.2)"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel
            tag="For Riders"
            title='Everything You Need <span style="color:#D4AF37">In One App</span>'
            sub="Premium features designed to give you the safest and most comfortable ride experience."
          />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20
          }}>
            {[
              { icon: "📡", title: "Live Tracking", desc: "See your driver's real-time location on the map from pickup to drop. Share your ride status with family." },
              { icon: "💰", title: "Transparent Pricing", desc: "No surge surprises. View full fare breakdown before you book — base fare, distance, time, and taxes." },
              { icon: "🛡️", title: "Safety Toolkit", desc: "Emergency SOS, in-app recording, trip sharing, and 24/7 support — ride with total peace of mind." },
              { icon: "🏆", title: "Rewards System", desc: "Earn SaaradhiPoints on every ride. Redeem for free rides, discounts, and exclusive partner offers." },
              { icon: "👛", title: "SaaradhiWallet", desc: "Top up once, ride cashless forever. Enjoy instant payments, refunds, and referral bonuses." },
              { icon: "⭐", title: "Premium Fleet", desc: "Choose from Bike, Auto, Mini, and Prime categories. Clean vehicles, professional drivers." },
            ].map((card, i) => (
              <FeatureCard key={i} {...card} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <GoldBtn onClick={() => navigate("/login")}>
              Create Rider Account →
            </GoldBtn>
            <button onClick={() => navigate("/rider")} style={{
              marginLeft: 14, padding: "14px 28px", borderRadius: 14, fontSize: 14, fontWeight: 700,
              background: GLASS, border: `1px solid ${GLASS_BORDER}`, color: "rgba(255,255,255,0.6)", cursor: "pointer"
            }}>View Rider Dashboard</button>
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          5. FOR DRIVERS
      ══════════════════════════════════════ */}
      <section id="drivers" style={{ padding: "100px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center"
          }} className="drivers-grid">
            {/* Left: Illustration */}
            <div style={{
              background: GLASS, border: `1px solid ${GLASS_BORDER}`, borderRadius: 24,
              padding: 40, textAlign: "center"
            }}>
              <div style={{
                width: 120, height: 120, borderRadius: "50%", margin: "0 auto 24px",
                background: `linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))`,
                border: `2px solid rgba(212,175,55,0.3)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52
              }}>🚗</div>
              <h3 style={{ color: "white", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Earn More. Drive Freely.</h3>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.6 }}>
                Join thousands of driver partners earning premium income on their own schedule.
              </p>

              {/* Earnings Prototype */}
              <div style={{
                marginTop: 28, background: "rgba(212,175,55,0.06)", borderRadius: 16,
                border: "1px solid rgba(212,175,55,0.15)", padding: 20
              }}>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Weekly Earnings Snapshot</p>
                {[
                  { day: "Mon", pct: 72 }, { day: "Tue", pct: 88 }, { day: "Wed", pct: 60 },
                  { day: "Thu", pct: 95 }, { day: "Fri", pct: 100 }, { day: "Sat", pct: 82 }, { day: "Sun", pct: 68 }
                ].map(b => (
                  <div key={b.day} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, width: 28 }}>{b.day}</span>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                      <div style={{ width: `${b.pct}%`, height: "100%", background: `linear-gradient(90deg, ${G}, ${G2})`, borderRadius: 4 }} />
                    </div>
                    <span style={{ color: G, fontSize: 11, width: 36, textAlign: "right" }}>₹{(b.pct * 14).toLocaleString()}</span>
                  </div>
                ))}
                <p style={{ color: G, fontSize: 18, fontWeight: 800, marginTop: 12 }}>₹9,100 avg/week</p>
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <span style={{
                display: "inline-block", padding: "6px 18px", borderRadius: 999,
                background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.25)",
                color: G, fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
                textTransform: "uppercase", marginBottom: 20
              }}>For Driver Partners</span>
              <h2 style={{ color: "white", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 20 }}>
                Be the Captain of<br />
                <span style={{ color: G }}>Your Own Journey</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
                Drive on your terms. Set your schedule, maximize your earnings, and benefit from SaaradhiGO's premium pricing — zero compromise.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 40 }}>
                {[
                  { icon: "💸", title: "Flexible Earnings", desc: "Drive whenever you want, earn as much as you want. No minimum time commitment." },
                  { icon: "📅", title: "Weekly Payouts", desc: "Get paid every week directly to your bank account. No delays, no hassle." },
                  { icon: "🗺️", title: "In-App Navigation", desc: "Smart route optimization built-in. Save fuel, save time, earn more per shift." },
                  { icon: "🎧", title: "24/7 Driver Support", desc: "Our dedicated driver support team is always available — call, chat, or in-app help." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
                    }}>{item.icon}</div>
                    <div>
                      <p style={{ color: "white", fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{item.title}</p>
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <GoldBtn onClick={() => navigate("/driver")}>
                  Join as Driver Partner →
                </GoldBtn>
                <button onClick={() => navigate("/driver-dashboard")} style={{
                  padding: "14px 24px", borderRadius: 14, fontSize: 14, fontWeight: 700,
                  background: GLASS, border: `1px solid ${GLASS_BORDER}`, color: "rgba(255,255,255,0.6)", cursor: "pointer"
                }}>Driver Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          6. SAFETY SECTION
      ══════════════════════════════════════ */}
      <section id="safety" style={{
        padding: "100px 5vw",
        background: "rgba(0,0,0,0.25)",
        borderTop: `1px solid ${GLASS_BORDER}`,
        borderBottom: `1px solid ${GLASS_BORDER}`
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel
            tag="Safety First"
            title='Your Safety is Our <span style="color:#D4AF37">Top Priority</span>'
            sub="Built-in safety features that protect you before, during, and after every ride."
          />

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20
          }}>
            {[
              {
                icon: "🆘", title: "SOS Emergency", color: "#FF6060",
                desc: "One-tap SOS button connects you instantly to emergency services and notifies your emergency contacts with your live location."
              },
              {
                icon: "🛡️", title: "Insurance Protection", color: "#60B4FF",
                desc: "Every SaaradhiGO ride is insured. Comprehensive coverage for riders and drivers during the entire trip duration."
              },
              {
                icon: "📤", title: "Ride Sharing", color: "#60D080",
                desc: "Share your live trip with family or friends in one tap. They can track you in real-time until you reach safely."
              },
              {
                icon: "✅", title: "Verified Drivers", color: G,
                desc: "All driver partners undergo background checks, document verification, and mandatory training before their first ride."
              },
              {
                icon: "🎥", title: "In-Trip Recording", color: "#D080FF",
                desc: "Optional in-app audio recording stored securely in the cloud — available to you and support if ever needed."
              },
              {
                icon: "🔒", title: "Data Privacy", color: "#FF9060",
                desc: "Your personal data is encrypted and never sold. GDPR-compliant infrastructure with zero-compromise privacy policies."
              },
            ].map((item, i) => (
              <SafetyCard key={i} {...item} />
            ))}
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          6.5 VEHICLE FLEET SHOWCASE
      ══════════════════════════════════════ */}
      <section style={{ padding: "100px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel
            tag="Our Fleet"
            title={`Travel in <span style="color:#D4AF37">Style & Comfort</span>`}
            sub="From quick city rides to premium chauffeur experiences — pick the ride that matches your vibe."
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { emoji: "🛵", name: "Bike", tagline: "Beat the traffic", price: "From ₹30", color: "#60B4FF", perks: ["2-min avg pickup", "Best for solo rides", "No parking stress"] },
              { emoji: "🛺", name: "Auto", tagline: "Classic comfort", price: "From ₹60", color: G, perks: ["Open-air cool ride", "Fits 3 passengers", "Zero surge promise"] },
              { emoji: "🚗", name: "Mini", tagline: "Everyday premium", price: "From ₹100", color: "#60D080", perks: ["AC always on", "Fits 4 passengers", "Insured ride"] },
              { emoji: "🚙", name: "Prime", tagline: "Luxury on demand", price: "From ₹200", color: "#D080FF", perks: ["Top-tier sedans", "Dedicated captain", "Airport transfers"] },
            ].map((v) => (
              <VehicleCard key={v.name} {...v} onBook={() => navigate("/login")} />
            ))}
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          6.7 TESTIMONIALS
      ══════════════════════════════════════ */}
      <section style={{ padding: "100px 5vw", background: "rgba(0,0,0,0.2)", borderTop: `1px solid ${GLASS_BORDER}`, borderBottom: `1px solid ${GLASS_BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel
            tag="Rider Stories"
            title={`What Our Riders <span style="color:#D4AF37">Say</span>`}
            sub="Real experiences from thousands of happy riders across India."
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              { name: "Priya Sharma", city: "Delhi", stars: 5, text: "SaaradhiGO is hands down the best cab service I've used. The driver was professional, car was spotless, and the app itself is beautiful. Booked a Prime cab in under 30 seconds!", avatar: "👩" },
              { name: "Arjun Mehta", city: "Mumbai", stars: 5, text: "The transparent pricing sold me. No hidden charges, no surge at peak hour — exactly what I pay is what's shown. Switched from my old app and haven't looked back.", avatar: "👨" },
              { name: "Lakshmi Rao", city: "Bengaluru", stars: 5, text: "As a woman who travels alone at night, the safety features put me at ease. SOS button, live sharing, verified drivers — they've thought of everything.", avatar: "👩‍💼" },
              { name: "Rahul Verma", city: "Hyderabad", stars: 5, text: "Earned ₹12,000 in my first week as a driver partner. Flexible hours, weekly payouts, and the support team is incredibly responsive. Best decision I made this year.", avatar: "🧑" },
              { name: "Sneha Das", city: "Kolkata", stars: 5, text: "The SaaradhiWallet rewards are incredible. I've earned enough points to get 3 free rides this month! Plus the app works seamlessly even on slow networks.", avatar: "👩‍🦱" },
              { name: "Vikram Singh", city: "Chennai", stars: 5, text: "Took a Prime ride to the airport and couldn't believe the quality — bottled water, phone charger, and a driver who knew every shortcut. 10/10.", avatar: "🧓" },
            ].map((t, i) => (
              <TestimonialCard 
                key={`testi-${i}`} 
                name={t.name}
                city={t.city}
                stars={t.stars}
                text={t.text}
                avatar={t.avatar}
              />
            ))}
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          ABOUT OUR APP / COMPANY
      ══════════════════════════════════════ */}
      <section id="about" style={{ padding: "100px 5vw", background: "rgba(0,0,0,0.15)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 80, alignItems: "center" }} className="about-grid">
          {/* Left Visual */}
          <div style={{ position: "relative" }}>
            <div style={{
              width: "100%", height: 500, borderRadius: 28,
              background: `linear-gradient(135deg, rgba(212,175,55,0.06), rgba(5,13,26,0.8))`,
              border: `1px solid rgba(212,175,55,0.15)`,
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20,
              boxShadow: "0 40px 100px rgba(0,0,0,0.5)"
            }}>
              <div style={{ width: 140, height: 140, borderRadius: "50%", background: "#000", border: `3px solid ${G}`, overflow: "hidden", boxShadow: `0 0 40px rgba(212,175,55,0.2)` }}>
                <img src={logoImage} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ color: G, fontSize: 32, fontWeight: 900, letterSpacing: 2 }}>SAARADHI GO</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, fontWeight: 500, letterSpacing: 4 }}>PREMIUM MOBILITY</div>
            </div>

            {/* Overlay stat card */}
            <div style={{
              position: "absolute", bottom: -24, right: -24,
              background: "rgba(15,28,46,0.95)", backdropFilter: "blur(12px)",
              padding: "24px 36px", borderRadius: 20,
              border: `1px solid rgba(212,175,55,0.3)`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
            }}>
              <div style={{ color: G, fontSize: 36, fontWeight: 900 }}>50M+</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600 }}>Kilometers Covered</div>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <span style={{
              display: "inline-block", padding: "6px 18px", borderRadius: 999,
              background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.25)",
              color: G, fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
              textTransform: "uppercase", marginBottom: 20
            }}>About Us</span>

            <h2 style={{
              color: "white", fontSize: "clamp(32px,4vw,48px)", fontWeight: 900,
              lineHeight: 1.15, marginBottom: 24
            }}>
              Redefining Your <span style={{ color: G }}>Daily Commute</span>
            </h2>

            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, lineHeight: 1.7, marginBottom: 24 }}>
              At SaaradhiGO, our mission is to transform the daily commute into an experience of impeccable comfort, absolute safety, and unmatched luxury across India.
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
              Inspired by the mythological royal chariots that provided reliable and majestic transport, we bring the exact same standard of excellence directly to the palms of your hands. Whether you require a quick bike to beat traffic or a premium sedan for client meetings, our elite fleet is strictly maintained and steered by highly-trained professional partners.
            </p>

            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: G, border: `1px solid rgba(212,175,55,0.2)`, fontSize: 20 }}>🛡️</div>
                <div>
                  <div style={{ fontWeight: 700, color: "white", fontSize: 15 }}>Safety Standard</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>Zero compromise</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: G, border: `1px solid rgba(212,175,55,0.2)`, fontSize: 20 }}>💎</div>
                <div>
                  <div style={{ fontWeight: 700, color: "white", fontSize: 15 }}>No Hidden Fees</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>Transparent pricing</div>
                </div>
              </div>
            </div>

            <div>
              <GoldBtn onClick={() => navigate("/login")}>Experience SaaradhiGO →</GoldBtn>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          7. ADMIN DASHBOARD PREVIEW
      ══════════════════════════════════════ */}
      <section id="business" style={{ padding: "100px 5vw", borderTop: `1px solid ${GLASS_BORDER}` }}>

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel
            tag="Operations Dashboard"
            title='Powerful Admin <span style="color:#D4AF37">Command Center</span>'
            sub="A full-featured web dashboard for operations teams — real-time data, analytics, and complete control."
          />

          {/* Dashboard mockup */}
          <div style={{
            borderRadius: 20, overflow: "hidden",
            border: `1px solid ${GLASS_BORDER}`,
            boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.1)`,
          }}>
            {/* Browser chrome */}
            <div style={{
              background: "rgba(5,13,26,0.95)", padding: "12px 20px",
              display: "flex", alignItems: "center", gap: 12,
              borderBottom: `1px solid ${GLASS_BORDER}`
            }}>
              <div style={{ display: "flex", gap: 7 }}>
                {["#FF5F57", "#FFBD2E", "#28C840"].map(c => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 6,
                padding: "5px 12px", fontSize: 12, color: "rgba(255,255,255,0.3)"
              }}>saaradhigo.admin.in/dashboard</div>
              <a href="/admin" style={{
                color: G, fontSize: 12, fontWeight: 700, textDecoration: "none",
                padding: "4px 14px", borderRadius: 6, border: `1px solid rgba(212,175,55,0.35)`
              }}>Open Live →</a>
            </div>

            {/* Dashboard content */}
            <div style={{ background: "#050D1A", display: "flex", minHeight: 420 }}>
              {/* Sidebar */}
              <div style={{
                width: 56, background: "rgba(15,28,46,0.8)", borderRight: `1px solid ${GLASS_BORDER}`,
                display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 20
              }}>
                {["🏠", "🚗", "👤", "💰", "📊", "⚙️"].map(icon => (
                  <div key={icon} style={{
                    width: 36, height: 36, borderRadius: 10, background: GLASS,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer"
                  }}>{icon}</div>
                ))}
              </div>

              {/* Main */}
              <div style={{ flex: 1, padding: 24, overflowX: "auto" }}>
                {/* KPI Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }} className="kpi-grid">
                  {[
                    { label: "Total Revenue", val: "₹6.4L", change: "+18.4%", up: true },
                    { label: "Total Rides", val: "12,840", change: "+12.8%", up: true },
                    { label: "Active Drivers", val: "2,148", change: "+5.2%", up: true },
                    { label: "Avg Rating", val: "4.93", change: "+0.1", up: true },
                  ].map(k => (
                    <div key={k.label} style={{
                      background: GLASS, border: `1px solid ${GLASS_BORDER}`, borderRadius: 14, padding: "14px 16px"
                    }}>
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginBottom: 6 }}>{k.label}</p>
                      <p style={{ color: "white", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{k.val}</p>
                      <span style={{ color: "#60D080", fontSize: 11, fontWeight: 600 }}>{k.change}</span>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }} className="chart-grid">
                  {/* Revenue Chart */}
                  <div style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}`, borderRadius: 14, padding: 16 }}>
                    <p style={{ color: "white", fontWeight: 700, fontSize: 13, marginBottom: 16 }}>Revenue Overview</p>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 80 }}>
                      {[58, 72, 85, 67, 91, 78, 95, 88, 100, 82, 93, 87].map((h, i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                          <div style={{ width: "100%", height: `${h}%`, background: `linear-gradient(180deg, ${G}, rgba(212,175,55,0.3))`, borderRadius: "3px 3px 0 0" }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                        <span key={m} style={{ color: "rgba(255,255,255,0.2)", fontSize: 8 }}>{m}</span>
                      ))}
                    </div>
                  </div>
                  {/* Donut */}
                  <div style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}`, borderRadius: 14, padding: 16 }}>
                    <p style={{ color: "white", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Ride Mix</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <svg width="70" height="70" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke={G} strokeWidth="4" strokeDasharray="44 44" strokeDashoffset="-11" strokeLinecap="round" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#60B4FF" strokeWidth="4" strokeDasharray="29 59" strokeDashoffset="-55" strokeLinecap="round" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#60D080" strokeWidth="4" strokeDasharray="19 69" strokeDashoffset="-84" strokeLinecap="round" />
                      </svg>
                      <div style={{ fontSize: 10, lineHeight: 1.8, color: "rgba(255,255,255,0.5)" }}>
                        <div><span style={{ color: G }}>■</span> Mini 42%</div>
                        <div><span style={{ color: "#60B4FF" }}>■</span> Auto 29%</div>
                        <div><span style={{ color: "#60D080" }}>■</span> Prime 19%</div>
                        <div><span style={{ color: "rgba(255,255,255,0.3)" }}>■</span> Bike 10%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          8. DOWNLOAD APP — 3D CINEMATIC
      ══════════════════════════════════════ */}
      <section id="download" style={{
        padding: "120px 5vw", position: "relative", overflow: "hidden",
        borderTop: "1px solid rgba(212,175,55,0.08)",
      }}>
        {/* Background glow */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 60% at 25% 50%, rgba(212,175,55,0.05) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.06), transparent 70%)", top: "50%", left: -200, transform: "translateY(-50%)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 2 }} className="hero-grid">

          {/* LEFT: 3D Phone */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", animation: "float3D 7s ease-in-out infinite", filter: "drop-shadow(0 60px 80px rgba(0,0,0,0.6)) drop-shadow(0 0 50px rgba(212,175,55,0.1))" }}>

              {/* Phone shell */}
              <div style={{
                width: 272, height: 548,
                borderRadius: 44,
                background: "linear-gradient(160deg, #1c2d3e 0%, #0c1622 40%, #060e1c 100%)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.8), 20px 40px 80px rgba(0,0,0,0.7)",
                position: "relative", overflow: "hidden",
                transform: "perspective(1200px) rotateY(-12deg) rotateX(4deg)",
              }}>
                {/* Left edge highlight */}
                <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 2, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.25), rgba(212,175,55,0.25), transparent)", borderRadius: 2, pointerEvents: "none" }} />

                {/* Dynamic Island */}
                <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 96, height: 28, background: "#030810", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, zIndex: 10 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#111" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.15), rgba(20,50,80,0.9))", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>

                {/* Screen */}
                <div style={{ position: "absolute", inset: 0, background: "#060f1e", borderRadius: "inherit", padding: "58px 0 0", display: "flex", flexDirection: "column" }}>
                  {/* Status bar */}
                  <div style={{ padding: "0 22px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, fontWeight: 700 }}>9:41</span>
                    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                      {[3, 2, 1, 0].map(i => <div key={i} style={{ width: 2.5, height: 3.5 + i * 2, background: i > 0 ? "white" : "rgba(255,255,255,0.3)", borderRadius: 1 }} />)}
                      <div style={{ width: 13, height: 6.5, border: "1.5px solid rgba(255,255,255,0.45)", borderRadius: 2, marginLeft: 3, position: "relative" }}><div style={{ position: "absolute", top: 1, left: 1, width: "65%", height: "calc(100% - 2px)", background: "#4ade80", borderRadius: 1 }} /></div>
                    </div>
                  </div>

                  {/* Greeting */}
                  <div style={{ padding: "10px 18px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 9, fontWeight: 600, letterSpacing: 1.2 }}>GOOD MORNING</div>
                      <div style={{ color: "white", fontSize: 14, fontWeight: 800, marginTop: 2 }}>Where to, Arjun? 👋</div>
                    </div>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #D4AF37, #F0C040)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
                  </div>

                  {/* Search */}
                  <div style={{ margin: "4px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 10, padding: "9px 12px", display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#60A5FA", boxShadow: "0 0 6px #60A5FA" }} />
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>Enter destination...</span>
                    <div style={{ marginLeft: "auto", background: G, borderRadius: 5, padding: "2px 7px" }}><span style={{ color: "#050D1A", fontSize: 8, fontWeight: 900 }}>GO</span></div>
                  </div>

                  {/* Map */}
                  <div style={{ margin: "6px 14px", height: 126, borderRadius: 12, background: "linear-gradient(135deg, #0a1628, #0d1f38)", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(212,175,55,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.07) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                    <div style={{ position: "absolute", top: "38%", left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.07)", transform: "rotate(-6deg)" }} />
                    <div style={{ position: "absolute", top: "62%", left: 0, right: 0, height: 1.5, background: "rgba(255,255,255,0.05)", transform: "rotate(9deg)" }} />
                    {/* User dot */}
                    <div style={{ position: "absolute", top: "44%", left: "33%", transform: "translate(-50%,-50%)" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#60A5FA", boxShadow: "0 0 14px #60A5FA", position: "relative", zIndex: 2 }} />
                      <div style={{ position: "absolute", inset: -7, borderRadius: "50%", background: "rgba(96,165,250,0.12)", animation: "pulse 2s ease-in-out infinite" }} />
                    </div>
                    <div style={{ position: "absolute", top: "28%", left: "54%", fontSize: 14 }}>🚗</div>
                    <div style={{ position: "absolute", bottom: "18%", right: "18%", fontSize: 12 }}>📍</div>
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                      <path d="M 90 70 Q 124 46 158 46" stroke="#D4AF37" strokeWidth="1.5" fill="none" strokeDasharray="4 3" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Ride options */}
                  <div style={{ padding: "4px 14px", display: "flex", gap: 6 }}>
                    {[{ e: "🏍️", n: "Bike", p: "₹49", c: "#A78BFA", a: false }, { e: "🛺", n: "Auto", p: "₹89", c: "#D4AF37", a: true }, { e: "🚗", n: "Mini", p: "₹149", c: "#60A5FA", a: false }].map(r => (
                      <div key={r.n} style={{ flex: 1, borderRadius: 9, padding: "7px 4px", textAlign: "center", background: r.a ? `${r.c}1a` : "rgba(255,255,255,0.04)", border: `1px solid ${r.a ? r.c + "45" : "rgba(255,255,255,0.05)"}` }}>
                        <div style={{ fontSize: 14 }}>{r.e}</div>
                        <div style={{ color: "white", fontSize: 8, fontWeight: 700 }}>{r.n}</div>
                        <div style={{ color: r.c, fontSize: 8, fontWeight: 800 }}>{r.p}</div>
                      </div>
                    ))}
                  </div>

                  {/* Book button */}
                  <div style={{ padding: "6px 14px" }}>
                    <div style={{ background: "linear-gradient(135deg, #D4AF37, #F0C040)", borderRadius: 10, padding: "10px", textAlign: "center", color: "#050D1A", fontWeight: 900, fontSize: 11, boxShadow: "0 6px 20px rgba(212,175,55,0.3)" }}>Confirm Ride ✓</div>
                  </div>

                  {/* Bottom nav */}
                  <div style={{ marginTop: "auto", padding: "10px 26px 18px", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {["🏠", "🗺️", "📋", "👤"].map((ic, idx) => (
                      <div key={ic} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: 15, opacity: idx === 0 ? 1 : 0.3 }}>{ic}</span>
                        {idx === 0 && <div style={{ width: 3, height: 3, borderRadius: "50%", background: G }} />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screen shine */}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(125deg, rgba(255,255,255,0.04) 0%, transparent 40%)", borderRadius: "inherit" }} />
              </div>

              {/* Physical buttons */}
              <div style={{ position: "absolute", right: -4, top: 116, width: 4, height: 48, background: "#162030", borderRadius: "0 3px 3px 0" }} />
              <div style={{ position: "absolute", left: -4, top: 96, width: 4, height: 28, background: "#162030", borderRadius: "3px 0 0 3px" }} />
              <div style={{ position: "absolute", left: -4, top: 138, width: 4, height: 28, background: "#162030", borderRadius: "3px 0 0 3px" }} />

              {/* Shadow beneath */}
              <div style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)", width: 200, height: 36, background: "radial-gradient(ellipse, rgba(0,0,0,0.45), transparent 70%)", filter: "blur(10px)" }} />

              {/* Floating badge: Driver Arrived */}
              <div style={{ position: "absolute", top: 56, right: -60, background: "rgba(6,14,26,0.92)", backdropFilter: "blur(16px)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 12, padding: "9px 13px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 28px rgba(0,0,0,0.5)", animation: "float3D 5s ease-in-out infinite", whiteSpace: "nowrap" }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(96,208,128,0.15)", border: "1px solid rgba(96,208,128,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🚗</div>
                <div>
                  <div style={{ color: "white", fontSize: 9.5, fontWeight: 700 }}>Driver Arrived!</div>
                  <div style={{ color: "#4ade80", fontSize: 8.5, fontWeight: 600 }}>Ravi K. · OTP 4782</div>
                </div>
              </div>

              {/* Floating badge: Points */}
              <div style={{ position: "absolute", bottom: 72, left: -66, background: "rgba(6,14,26,0.92)", backdropFilter: "blur(16px)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 12, padding: "9px 13px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 28px rgba(0,0,0,0.5)", animation: "float3D 7s ease-in-out infinite reverse", whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 16 }}>⭐</span>
                <div>
                  <div style={{ color: "white", fontSize: 9.5, fontWeight: 700 }}>Ride Complete</div>
                  <div style={{ color: G, fontSize: 8.5 }}>+120 SaaradhiPoints</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div style={{ animation: "fadeUp 0.8s ease forwards" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, marginBottom: 20, background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: G, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
              <span style={{ color: G, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>iOS & ANDROID · FREE</span>
            </div>

            <h2 style={{ color: "white", fontSize: "clamp(30px,4vw,52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>
              Your City.<br />
              <span style={{ background: `linear-gradient(135deg, ${G}, #F0C040)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your Ride.</span><br />
              Your Pocket.
            </h2>

            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1.75, marginBottom: 12 }}>
              Get ₹100 off your first <strong style={{ color: "rgba(255,255,255,0.85)" }}>three rides</strong> — no minimum required.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 10, padding: "7px 16px", marginBottom: 36 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Promo code:</span>
              <span style={{ color: G, fontWeight: 900, fontSize: 14, letterSpacing: 2 }}>SAARADHI100</span>
              <span style={{ background: G, color: DARK, fontSize: 9, fontWeight: 900, padding: "2px 8px", borderRadius: 5 }}>COPY</span>
            </div>

            {/* Store buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              {[
                { icon: "🍎", store: "App Store", sub: "Download on the", badge: "4.9★ · Free" },
                { icon: "▶️", store: "Google Play", sub: "Get it on", badge: "4.8★ · Free" },
              ].map(btn => (
                <div key={btn.store}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.borderColor = `rgba(212,175,55,0.4)`; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 50px rgba(0,0,0,0.4), 0 0 20px rgba(212,175,55,0.08)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)"; }}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", cursor: "pointer", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,0.04) 0%, transparent 50%)", pointerEvents: "none" }} />
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{btn.icon}</div>
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 10, fontWeight: 600, marginBottom: 2 }}>{btn.sub}</div>
                    <div style={{ color: "white", fontSize: 17, fontWeight: 800 }}>{btn.store}</div>
                    <div style={{ color: G, fontSize: 10, fontWeight: 700, marginTop: 1 }}>{btn.badge}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
              {[{ icon: "⚡", text: "Instant Booking" }, { icon: "🛡️", text: "SOS Safety" }, { icon: "💎", text: "Earn Rewards" }, { icon: "🔔", text: "Live Updates" }].map(f => (
                <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "6px 14px", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>
                  <span style={{ fontSize: 13 }}>{f.icon}</span>{f.text}
                </div>
              ))}
            </div>

            {/* QR + Rating */}
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 18px" }}>
                {/* Pixel QR */}
                <div style={{ width: 52, height: 52, background: "white", borderRadius: 8, padding: 4, display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 1 }}>
                  {Array.from({ length: 36 }).map((_, i) => {
                    const on = [0, 1, 2, 6, 7, 8, 12, 13, 14, 3, 9, 15, 4, 10, 16, 5, 11, 18, 19, 20, 21, 22, 25, 26, 28, 29, 30, 33, 35].includes(i);
                    return <div key={i} style={{ background: on ? "#050D1A" : "transparent", borderRadius: 1 }} />;
                  })}
                </div>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 10, marginBottom: 2 }}>Scan to download</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 12 }}>Instant Install</div>
                  <div style={{ color: G, fontSize: 10 }}>iOS & Android</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {[1, 2, 3, 4, 5].map(i => <span key={i} style={{ color: G, fontSize: 16 }}>★</span>)}
                  <span style={{ color: "white", fontWeight: 800, fontSize: 15, marginLeft: 2 }}>4.9</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>50,000+ reviews · App Store</div>
                <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 11 }}>#1 in Travel · India</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          9. FOOTER  — FULLY INTERACTIVE
      ══════════════════════════════════════ */}

      {/* ── MODAL SYSTEM ── */}
      {
        modalOpen && (
          <div
            onClick={() => setModalOpen(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px",
              animation: "fadeIn 0.2s ease"
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: "linear-gradient(135deg, #0d1a2e, #060f1e)",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: 24, padding: "40px",
                maxWidth: 640, width: "100%",
                maxHeight: "80vh", overflowY: "auto",
                boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(212,175,55,0.05)",
                position: "relative",
                animation: "fadeUp 0.25s ease"
              }}
            >
              {/* Close */}
              <button
                onClick={() => setModalOpen(null)}
                style={{
                  position: "absolute", top: 20, right: 20,
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)", fontSize: 18, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,175,55,0.15)"; e.currentTarget.style.color = G; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >×</button>

              {/* Title badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 999, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", marginBottom: 20 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: G, display: "inline-block" }} />
                <span style={{ color: G, fontSize: 11, fontWeight: 700, letterSpacing: 1.2 }}>SAARADHIGO</span>
              </div>

              <h2 style={{ color: "white", fontSize: 26, fontWeight: 900, marginBottom: 8 }}>{MODAL_CONTENT[modalOpen]?.title}</h2>
              <div style={{ height: 2, width: 40, background: `linear-gradient(90deg, ${G}, transparent)`, marginBottom: 24, borderRadius: 2 }} />
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.85 }}
                dangerouslySetInnerHTML={{ __html: MODAL_CONTENT[modalOpen]?.body ?? "" }}
              />
            </div>
          </div>
        )
      }

      <footer id="contact" style={{
        background: DARK,
        borderTop: "1px solid rgba(212,175,55,0.08)",
        padding: "72px 5vw 36px",
        position: "relative", overflow: "hidden"
      }}>
        {/* Top shimmer line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.4) 40%, rgba(212,175,55,0.6) 50%, rgba(212,175,55,0.4) 60%, transparent 100%)" }} />

        {/* BG glow */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.04), transparent 70%)", bottom: -200, right: -100, filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>

          {/* Top grid */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 56 }} className="footer-grid">

            {/* ── Brand column ── */}
            <div>
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, overflow: "hidden", border: "1.5px solid rgba(212,175,55,0.35)", background: "#000", boxShadow: "0 0 20px rgba(212,175,55,0.12)" }}>
                  <img src={logoImage} alt="SaaradhiGO Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <span style={{ fontWeight: 900, fontSize: 17 }}>
                    <span style={{ color: G }}>SAARADHI</span><span style={{ color: "white" }}>GO</span>
                  </span>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontWeight: 600, letterSpacing: 1.5, marginTop: 1 }}>PREMIUM RIDES</div>
                </div>
              </div>

              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.75, maxWidth: 240, marginBottom: 24 }}>
                Premium ride-hailing platform redefining mobility in India. Safe, fast, and luxurious.
              </p>

              {/* Social icons */}
              <div style={{ display: "flex", gap: 9, marginBottom: 28 }}>
                {[
                  { icon: "𝕏", label: "Twitter", url: "https://twitter.com/saaradhigo" },
                  { icon: "in", label: "LinkedIn", url: "https://linkedin.com/company/saaradhigo" },
                  { icon: "f", label: "Facebook", url: "https://facebook.com/saaradhigo" },
                  { icon: "◉", label: "Instagram", url: "https://instagram.com/saaradhigo" },
                ].map(s => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" title={s.label}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `rgba(212,175,55,0.12)`; (e.currentTarget as HTMLElement).style.borderColor = `rgba(212,175,55,0.35)`; (e.currentTarget as HTMLElement).style.color = G; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = GLASS; (e.currentTarget as HTMLElement).style.borderColor = GLASS_BORDER; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                    style={{
                      width: 38, height: 38, borderRadius: 10, background: GLASS,
                      border: `1px solid ${GLASS_BORDER}`, display: "flex", alignItems: "center",
                      justifyContent: "center", color: "rgba(255,255,255,0.45)", fontSize: 13,
                      fontWeight: 800, cursor: "pointer", textDecoration: "none",
                      transition: "all 0.25s ease"
                    }}
                  >{s.icon}</a>
                ))}
              </div>

              {/* App badges mini */}
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: "7px 12px", cursor: "pointer" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  <span style={{ fontSize: 16 }}>🍎</span>
                  <div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 8 }}>Download on</div><div style={{ color: "white", fontSize: 11, fontWeight: 700 }}>App Store</div></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: "7px 12px", cursor: "pointer" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  <span style={{ fontSize: 16 }}>▶️</span>
                  <div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 8 }}>Get it on</div><div style={{ color: "white", fontSize: 11, fontWeight: 700 }}>Google Play</div></div>
                </div>
              </div>
            </div>

            {/* ── Company ── */}
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 18, letterSpacing: 0.3 }}>Company</p>
              {[
                { label: "About Us", key: "about" },
                { label: "Careers", key: "careers" },
                { label: "Press Kit", key: "press" },
                { label: "Blog", key: "blog" },
                { label: "Partners", key: "partners" },
              ].map(l => (
                <button key={l.key} onClick={() => setModalOpen(l.key)}
                  style={{ display: "block", background: "none", border: "none", padding: 0, color: "rgba(255,255,255,0.38)", fontSize: 13, textAlign: "left", marginBottom: 12, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = G)}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
                >{l.label}</button>
              ))}
            </div>

            {/* ── Legal ── */}
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 18 }}>Legal</p>
              {[
                { label: "Privacy Policy", key: "privacy" },
                { label: "Terms of Service", key: "terms" },
                { label: "Cookie Policy", key: "cookies" },
                { label: "Licenses", key: "licenses" },
                { label: "Compliance", key: "compliance" },
              ].map(l => (
                <button key={l.key} onClick={() => setModalOpen(l.key)}
                  style={{ display: "block", background: "none", border: "none", padding: 0, color: "rgba(255,255,255,0.38)", fontSize: 13, textAlign: "left", marginBottom: 12, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = G)}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
                >{l.label}</button>
              ))}
            </div>

            {/* ── Support ── */}
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 18 }}>Support</p>
              {[
                { label: "Help Center", key: "help" },
                { label: "Contact Us", key: "contact-us" },
                { label: "Driver Support", key: "driver-support" },
                { label: "Report Issue", key: "report" },
                { label: "FAQs", key: "faqs" },
              ].map(l => (
                <button key={l.key} onClick={() => setModalOpen(l.key)}
                  style={{ display: "block", background: "none", border: "none", padding: 0, color: "rgba(255,255,255,0.38)", fontSize: 13, textAlign: "left", marginBottom: 12, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = G)}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
                >{l.label}</button>
              ))}
            </div>

            {/* ── Contact ── */}
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 18 }}>Contact</p>
              {[
                { icon: "✉", text: "hello@saaradhigo.in", href: "mailto:hello@saaradhigo.in" },
                { icon: "☎", text: "+91 98765 43210", href: "tel:+919876543210" },
                { icon: "◎", text: "Bengaluru, Karnataka,\nIndia — 560001", href: "https://maps.google.com/?q=Bengaluru,India" },
              ].map(c => (
                <a key={c.text} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start", textDecoration: "none", cursor: "pointer" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  <span style={{
                    width: 30, height: 30, borderRadius: 8, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: G, flexShrink: 0, marginTop: 1
                  }}>{c.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-line" }}>{c.text}</span>
                </a>
              ))}

              {/* Support hours */}
              <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: 10, padding: "10px 14px", marginTop: 6 }}>
                <div style={{ color: G, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>SUPPORT HOURS</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>Mon–Sat · 9:00 AM – 9:00 PM<br />Sun · 10:00 AM – 6:00 PM</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), rgba(212,175,55,0.3), rgba(212,175,55,0.2), transparent)", marginBottom: 28 }} />

          {/* Bottom bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
              © 2026 SaaradhiGO Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              {[{ l: "Privacy", k: "privacy" }, { l: "Terms", k: "terms" }, { l: "Cookies", k: "cookies" }].map(item => (
                <button key={item.k} onClick={() => setModalOpen(item.k)}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.28)", fontSize: 12, cursor: "pointer", transition: "color 0.2s", padding: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = G)}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
                >{item.l}</button>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>Made with ♥ for India 🇮🇳</p>
          </div>
        </div>
      </footer>


      {/* ── CSS Animations — PREMIUM ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(212,175,55,0.3); color: #fff; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(212,175,55,0.4); }
          50%       { opacity: 0.7; transform: scale(0.85); box-shadow: 0 0 0 8px rgba(212,175,55,0); }
        }
        @keyframes floatBlob {
          from { transform: translate(0, 0) scale(1) rotate(0deg); }
          to   { transform: translate(40px, -55px) scale(1.08) rotate(5deg); }
        }
        @keyframes float3D {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          33%       { transform: translateY(-12px) rotateX(3deg); }
          66%       { transform: translateY(-6px) rotateX(-2deg); }
        }
        @keyframes shimmerLine {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes rotateGlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.1); }
          50%       { box-shadow: 0 0 40px rgba(212,175,55,0.25), 0 0 80px rgba(212,175,55,0.1); }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(212,175,55,0.3); }
          50%       { text-shadow: 0 0 40px rgba(212,175,55,0.6), 0 0 80px rgba(212,175,55,0.2); }
        }
        @keyframes scanLine {
          0%   { top: -2px; opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }

        /* Globe float */
        .igw { animation: float3D 8s ease-in-out infinite; }

        /* Hero heading glow */
        .hero-title-glow { animation: textGlow 4s ease-in-out infinite; }

        /* Reveal on scroll */
        .reveal { animation: fadeUp 0.7s ease forwards; }

        /* Responsive overrides */
        @media (max-width: 900px) {
          .hero-grid     { grid-template-columns: 1fr !important; }
          .drivers-grid  { grid-template-columns: 1fr !important; }
          .footer-grid   { grid-template-columns: 1fr 1fr !important; }
          .kpi-grid      { grid-template-columns: repeat(2,1fr) !important; }
          .chart-grid    { grid-template-columns: 1fr !important; }
          .desktop-nav   { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .kpi-grid    { grid-template-columns: 1fr 1fr !important; }
        }

        /* Premium scrollbar */
        ::-webkit-scrollbar       { width: 5px; }
        ::-webkit-scrollbar-track { background: #050D1A; }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #D4AF37, #F0C040);
          border-radius: 4px;
        }
      `}</style>
    </div >
  );
}

/* ─── Sub-components ─── */

function StepCard({ step, icon, title, desc, color }: {
  step: string; icon: string; title: string; desc: string; color: string;
  key?: React.Key;
}) {
  return (
    <Card3D glowColor={color} shimmer style={{
      background: "linear-gradient(135deg, rgba(15,28,46,0.9), rgba(5,13,26,0.95))",
      border: "1px solid rgba(255,255,255,0.06)",
      padding: 32, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 10, right: 16, fontSize: 64,
        fontWeight: 900, color: "rgba(255,255,255,0.03)", lineHeight: 1,
        fontFamily: "Georgia, serif", pointerEvents: "none"
      }}>{step}</div>
      <div style={{
        position: "absolute", top: -30, left: -30, width: 100, height: 100,
        borderRadius: "50%", background: `${color}15`, filter: "blur(25px)",
        pointerEvents: "none"
      }} />
      <div style={{
        width: 60, height: 60, borderRadius: 16, marginBottom: 20,
        background: `${color}15`, border: `1px solid ${color}35`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, boxShadow: `0 0 20px ${color}20`,
      }}>{icon}</div>
      <div style={{
        display: "inline-block", padding: "3px 12px", borderRadius: 999, marginBottom: 12,
        background: `${color}15`, color, fontSize: 11, fontWeight: 800, letterSpacing: 1,
        border: `1px solid ${color}30`
      }}>STEP {step}</div>
      <h3 style={{ color: "white", fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{title}</h3>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
    </Card3D>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string; key?: React.Key }) {
  return (
    <Card3D glowColor="#D4AF37" shimmer style={{
      background: "linear-gradient(135deg, rgba(15,28,46,0.85), rgba(5,13,26,0.9))",
      border: "1px solid rgba(255,255,255,0.05)",
      padding: 28, position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0, width: 60, height: 60,
        background: "linear-gradient(225deg, rgba(212,175,55,0.07), transparent)",
        borderBottomLeftRadius: 60, pointerEvents: "none"
      }} />
      <div style={{
        width: 52, height: 52, borderRadius: 14, marginBottom: 16,
        background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, boxShadow: "0 4px 20px rgba(212,175,55,0.1)"
      }}>{icon}</div>
      <h3 style={{ color: "white", fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.65 }}>{desc}</p>
    </Card3D>
  );
}

function SafetyCard({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string; key?: React.Key }) {
  return (
    <Card3D glowColor={color} shimmer style={{
      background: "linear-gradient(135deg, rgba(15,28,46,0.85), rgba(5,13,26,0.9))",
      border: "1px solid rgba(255,255,255,0.05)",
      padding: 28, position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", bottom: 0, right: 0, width: 80, height: 80,
        background: `linear-gradient(225deg, ${color}10, transparent)`,
        borderTopLeftRadius: 80, pointerEvents: "none"
      }} />
      <div style={{
        width: 52, height: 52, borderRadius: 14, marginBottom: 16,
        background: `${color}12`, border: `1px solid ${color}28`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, boxShadow: `0 4px 20px ${color}15`,
      }}>{icon}</div>
      <h3 style={{ color: "white", fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.65 }}>{desc}</p>
    </Card3D>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{title}</p>
      {links.map(l => (
        <a key={l} href="#" style={{
          display: "block", color: "rgba(255,255,255,0.35)", fontSize: 13,
          textDecoration: "none", marginBottom: 10, transition: "color 0.2s"
        }}
          onMouseEnter={e => (e.currentTarget.style.color = G)}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
        >{l}</a>
      ))}
    </div>
  );
}

function VehicleCard({ emoji, name, tagline, price, color, perks, onBook }: {
  emoji: string; name: string; tagline: string; price: string;
  color: string; perks: string[]; onBook: () => void;
  key?: React.Key;
}) {
  return (
    <Card3D glowColor={color} shimmer style={{
      background: "linear-gradient(135deg, rgba(15,28,46,0.9), rgba(5,13,26,0.95))",
      border: "1px solid rgba(255,255,255,0.05)",
      padding: 32, cursor: "pointer", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -40, right: -40, width: 140, height: 140,
        borderRadius: "50%", background: color + "14", filter: "blur(35px)",
        pointerEvents: "none",
      }} />
      <div style={{
        fontSize: 56, marginBottom: 16,
        display: "inline-block",
        filter: `drop-shadow(0 8px 20px ${color}40)`,
      }}>{emoji}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h3 style={{ color: "white", fontSize: 22, fontWeight: 900 }}>{name}</h3>
        <span style={{
          background: color + "20", border: `1px solid ${color}50`,
          color, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999
        }}>{price}</span>
      </div>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 20 }}>{tagline}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {perks.map(p => (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              background: color + "20", border: `1px solid ${color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color, fontWeight: 900
            }}>✓</div>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{p}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onBook}
        onMouseEnter={e => {
          e.currentTarget.style.background = color;
          e.currentTarget.style.color = "#050D1A";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = color;
          e.currentTarget.style.transform = "translateY(0)";
        }}
        style={{
          width: "100%", padding: "12px",
          background: "transparent", border: `1.5px solid ${color}`,
          color, borderRadius: 12, fontWeight: 700, fontSize: 14,
          cursor: "pointer", transition: "all 0.25s ease",
        }}>Book {name} →
      </button>
    </Card3D>
  );
}

function TestimonialCard({ name, city, stars, text, avatar }: {
  name: string; city: string; stars: number; text: string; avatar: string;
  key?: React.Key;
}) {
  return (
    <Card3D glowColor="#D4AF37" shimmer={false} style={{
      background: "linear-gradient(135deg, rgba(15,28,46,0.85), rgba(5,13,26,0.9))",
      border: "1px solid rgba(255,255,255,0.05)",
      padding: 28, position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", top: 10, right: 18,
        fontSize: 80, color: "rgba(212,175,55,0.06)",
        fontFamily: "Georgia, serif", lineHeight: 1,
        pointerEvents: "none", userSelect: "none"
      }}>"</div>
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} style={{ color: G, fontSize: 14 }}>★</span>
        ))}
      </div>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>"{text}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(212,175,55,0.1)",
          border: "2px solid rgba(212,175,55,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, boxShadow: "0 4px 16px rgba(212,175,55,0.15)"
        }}>{avatar}</div>
        <div>
          <p style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{name}</p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 2 }}>Rider · {city}</p>
        </div>
      </div>
    </Card3D>
  );
}


