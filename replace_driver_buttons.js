import { readFileSync, writeFileSync } from 'fs';

let text = readFileSync('src/app/screens/DriverDashboard.tsx', 'utf-8');

if (!text.includes('LiquidButton')) {
    text = text.replace(/(import .*;\n)+/, (match) => match + 'import { LiquidButton, MetalButton } from "@/components/ui/liquid-glass-button";\n');
}

// "Go Online" Button
text = text.replace(
    /<button onClick=\{\(\) => setOnline\(true\)\} style=\{\{([\s\S]*?)\}\}>Go Online<\/button>/g,
    `<MetalButton variant="success" onClick={() => setOnline(true)} className="px-8 py-3 text-base shadow-lg">Go Online</MetalButton>`
);

// Accept Ride / Decline
text = text.replace(
    /<button onClick=\{\(\) => setRideRequest\(false\)\} style=\{\{([\s\S]*?)cursor: "pointer"\s*\}\}>Decline<\/button>/g,
    `<LiquidButton variant="destructive" onClick={() => setRideRequest(false)} className="flex-1 py-4 text-sm font-bold border border-red-500/30 bg-red-500/10 hover:bg-red-500/20">Decline</LiquidButton>`
);
text = text.replace(
    /<button onClick=\{\(\) => \{ setRideRequest\(false\); setRideState\("navigate"\); \}\} style=\{\{([\s\S]*?)cursor: "pointer"\s*\}\}>✓ Accept Ride<\/button>/g,
    `<MetalButton variant="gold" onClick={() => { setRideRequest(false); setRideState("navigate"); }} className="flex-2 py-4 h-full text-sm font-bold">✓ Accept Ride</MetalButton>`
);

// Arrived at Pickup
text = text.replace(
    /<button onClick=\{\(\) => setRideState\("start"\)\} style=\{\{([\s\S]*?)cursor: "pointer"\s*\}\}>Arrived at Pickup ✓<\/button>/g,
    `<MetalButton variant="gold" onClick={() => setRideState("start")} className="flex-1 py-4 h-full text-sm font-bold">Arrived at Pickup ✓</MetalButton>`
);

// Start Ride
text = text.replace(
    /<button onClick=\{\(\) => setRideState\("live"\)\} style=\{\{([\s\S]*?)cursor: "pointer"\s*\}\}>🚗 Start Ride<\/button>/g,
    `<MetalButton variant="primary" onClick={() => setRideState("live")} className="w-full py-4 h-14 text-base font-bold shadow-lg">🚗 Start Ride</MetalButton>`
);

// Cancel Trip / Complete Ride
text = text.replace(
    /<button style=\{\{([\s\S]*?)cursor: "pointer"\s*\}\}>Cancel Trip<\/button>/g,
    `<LiquidButton variant="destructive" className="flex-1 py-4 text-sm font-bold border border-red-500/30 bg-red-500/10 hover:bg-red-500/20">Cancel Trip</LiquidButton>`
);
text = text.replace(
    /<button onClick=\{\(\) => setRideState\("ended"\)\} style=\{\{([\s\S]*?)cursor: "pointer"\s*\}\}>Complete Ride ✓<\/button>/g,
    `<MetalButton variant="success" onClick={() => setRideState("ended")} className="flex-2 py-4 h-full text-sm font-bold">Complete Ride ✓</MetalButton>`
);

// Ready for next ride
text = text.replace(
    /<button onClick=\{\(\) => \{ setRideState\("idle"\); setRideRequest\(false\); \}\} style=\{\{([\s\S]*?)\}\}>Ready for Next Ride →<\/button>/g,
    `<MetalButton variant="gold" onClick={() => { setRideState("idle"); setRideRequest(false); }} className="w-full py-4 h-14 text-base font-bold shadow-lg">Ready for Next Ride →</MetalButton>`
);

// Simulate request
text = text.replace(
    /<button onClick=\{\(\) => setRideRequest\(true\)\} style=\{\{([\s\S]*?)\}\}>Simulate Request<\/button>/g,
    `<MetalButton variant="success" onClick={() => setRideRequest(true)} className="px-6 py-2 text-xs">Simulate Request</MetalButton>`
);

// Withdraw Now
text = text.replace(
    /<button style=\{\{([\s\S]*?)\}\}>Withdraw Now<\/button>/g,
    `<MetalButton variant="gold" className="px-8 py-3 text-sm shadow-lg">Withdraw Now</MetalButton>`
);

// Emergency SOS
text = text.replace(
    /<button style=\{\{([\s\S]*?)\}\}>SOS<\/button>/g,
    `<LiquidButton variant="destructive" className="px-6 py-3 border border-red-500/50 bg-red-500/20 text-red-500 hover:bg-red-500/40">SOS</LiquidButton>`
);

writeFileSync('src/app/screens/DriverDashboard.tsx', text);
console.log('Driver button remapping Complete');
