import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/app/screens/CustomerAuthPage.tsx', 'utf-8');

// 1. Inject the import statement at the top
if (!content.includes('LiquidButton')) {
    content = content.replace(/(import .*;\n)+/, (match) => match + 'import { LiquidButton, MetalButton } from "@/components/ui/liquid-glass-button";\n');
}

// 2. Replace all btn-premium buttons with MetalButton variant="gold"
// Lets replace the exact instances we know about

content = content.replace(
    /<button\s+className="btn-premium"\s+onClick=\{handleLetsGo\}([\s\S]*?)>\s*LET'S GO →\s*<\/button>/g,
    `<MetalButton variant="gold" onClick={handleLetsGo} className="mb-14 px-12 py-4 shadow-xl text-lg tracking-widest" style={{ animation: "sfi 0.8s ease 0.6s backwards" }}>LET'S GO →</MetalButton>`
);

content = content.replace(
    /<button\s+onClick=\{\(\) => \{ if \(phone\.length === 10\) go\("otp"\); \}\}\s+className=\{phone\.length === 10 \? "btn-premium" : ""\}([\s\S]*?)>\s*Send Verification OTP →\s*<\/button>/g,
    `<div className="w-full mb-6">
        <MetalButton 
            variant={phone.length === 10 ? "gold" : "default"} 
            onClick={() => { if (phone.length === 10) go("otp"); }}
            className="w-full h-14 text-base font-bold shadow-md opacity-100"
            disabled={phone.length !== 10}
            style={{ opacity: phone.length === 10 ? 1 : 0.6, cursor: phone.length === 10 ? "pointer" : "not-allowed" }}
        >
            Send Verification OTP →
        </MetalButton>
    </div>`
);

content = content.replace(
    /<button\s+className="btn-premium"\s+onClick=\{\(\) => go\("permissions"\)\}([\s\S]*?)>\s*Verify & Continue →\s*<\/button>/g,
    `<div className="w-full mt-2">
        <MetalButton variant="gold" onClick={() => go("permissions")} className="w-full h-14 text-base font-bold shadow-md">Verify & Continue →</MetalButton>
    </div>`
);

content = content.replace(
    /<button\s+className="btn-premium"\s+onClick=\{\(\) => navigate\("\/book"\)\}([\s\S]*?)>\s*Enable & Start Journey\s*<\/button>/g,
    `<MetalButton variant="gold" onClick={() => navigate("/book")} className="w-full h-14 text-base font-bold shadow-md">Enable & Start Journey</MetalButton>`
);

// 3. Optional: replace the Skip and Next Journey buttons in onboarding
content = content.replace(
    /<button\s+className="next-journey-btn"\s+onClick=\{([\s\S]*?)}([\s\S]*?)>\s*<span>(.*?)<\/span>\s*<div(.*?)>\s*<ArrowRight(.*?)\/>\s*<\/div>\s*<\/button>/g,
    `<MetalButton variant="gold" onClick={$1} className="w-full h-16 flex justify-between items-center px-6 text-lg tracking-wide rounded-2xl">
        <span>$3</span>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={24} strokeWidth={3} />
        </div>
    </MetalButton>`
);

// 4. Passenger Option / Driver Option fake buttons
content = content.replace(
    /<div className="btn-premium" style={{([^}]+)}}>([^<]+)<\/div>/g,
    `<div className="inline-block"><MetalButton variant="gold" onClick={(e) => { e.stopPropagation(); go("onboarding"); }} className="px-8 py-3">$2</MetalButton></div>`
);

content = content.replace(
    /<div style=\{\{\s*display: "inline-block", padding: "14px 40px", borderRadius: 14,\s*background: "linear-gradient\(135deg, #60B4FF, #3A8EDF\)", color: DARK,\s*fontWeight: 800, fontSize: 16, letterSpacing: "0.02em"\s*\}\}>\s*Become a Partner →\s*<\/div>/g,
    `<div className="inline-block"><MetalButton variant="primary" onClick={(e) => { e.stopPropagation(); navigate("/driver"); }} className="px-8 py-3">Become a Partner →</MetalButton></div>`
);


// 5. Replace 'google' & 'apple' buttons with LiquidButton
content = content.replace(
    /<button style={{([^>]+)Google\s*<\/button>/,
    `<LiquidButton variant="outline" className="flex-1 h-14 rounded-xl gap-2 text-white border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer">\n$1Google\n</LiquidButton>`
);
content = content.replace(
    /<button style={{([^>]+)Apple\s*<\/button>/,
    `<LiquidButton variant="outline" className="flex-1 h-14 rounded-xl gap-2 text-white border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer">\n$1Apple\n</LiquidButton>`
);


writeFileSync('src/app/screens/CustomerAuthPage.tsx', content);
console.log('CustomerAuthPage buttons completely remapped!');
