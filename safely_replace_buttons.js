import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/app/screens/CustomerAuthPage.tsx', 'utf-8');

// The `[\s\S]*?` matches anything inside the button tag until the closing tag/content
content = content.replace(
    /<button[^>]*?>\s*Send Verification OTP →\s*<\/button>/g,
    `    <div className="w-full mb-6 relative z-10">
        <MetalButton 
            variant={phone.length === 10 ? "gold" : "default"} 
            onClick={() => { if (phone.length === 10) go("otp"); }}
            className="w-full h-14 text-base font-bold shadow-md opacity-100"
            style={{ opacity: phone.length === 10 ? 1 : 0.6, cursor: phone.length === 10 ? "pointer" : "not-allowed" }}
        >
            Send Verification OTP →
        </MetalButton>
    </div>`
);

content = content.replace(
    /<button[^>]*?>\s*LET'S GO →\s*<\/button>/g,
    `<MetalButton variant="gold" onClick={handleLetsGo} className="mb-14 px-12 h-16 shadow-xl text-lg font-bold tracking-widest relative z-10" style={{ animation: "sfi 0.8s ease 0.6s backwards" }}>LET'S GO →</MetalButton>`
);

content = content.replace(
    /<button[^>]*?>\s*Verify & Continue →\s*<\/button>/g,
    `<div className="w-full mt-2 relative z-10">
        <MetalButton variant="gold" onClick={() => go("permissions")} className="w-full h-14 text-base font-bold shadow-md">Verify & Continue →</MetalButton>
    </div>`
);

content = content.replace(
    /<button[^>]*?>\s*Enable & Start Journey\s*<\/button>/g,
    `<MetalButton variant="gold" onClick={() => navigate("/book")} className="w-full h-14 text-base font-bold shadow-md">Enable & Start Journey</MetalButton>`
);

// We should also replace the button for skip and Next Journey
// Skip button:
content = content.replace(
    /<button[^>]*?>\s*Skip\s*<\/button>/g,
    `<LiquidButton variant="ghost" onClick={() => go("login")} className="hover:bg-white/10 text-white font-bold opacity-60 hover:opacity-100 transition duration-300">Skip</LiquidButton>`
);

// Google and Apple
content = content.replace(
    /<button[^>]*?>([\s\S]*?)Google\s*<\/button>/g,
    `<LiquidButton variant="outline" className="flex-1 h-16 rounded-xl gap-3 text-white border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer text-sm font-semibold">\n$1Google\n</LiquidButton>`
);
content = content.replace(
    /<button[^>]*?>([\s\S]*?)Apple\s*<\/button>/g,
    `<LiquidButton variant="outline" className="flex-1 h-16 rounded-xl gap-3 text-white border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer text-sm font-semibold">\n$1Apple\n</LiquidButton>`
);

writeFileSync('src/app/screens/CustomerAuthPage.tsx', content);
console.log('CustomerAuthPage buttons finally safely replaced');
