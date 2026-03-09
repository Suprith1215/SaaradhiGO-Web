const fs = require('fs');
let content = fs.readFileSync('src/components/ui/interactive-globe.tsx', 'utf8');

const oldBlock = `// 5 cities at the geographic extremes of India \u2014 maximum spread
const DEFAULT_MARKERS = [
    { lat: 34.10, lng: 74.80, label: "Srinagar" },    // far north
    { lat: 8.50,  lng: 76.95, label: "Trivandrum" },  // far south
    { lat: 22.57, lng: 88.36, label: "Kolkata" },     // far east
    { lat: 19.07, lng: 72.88, label: "Mumbai" },      // far west
    { lat: 28.61, lng: 77.21, label: "Delhi" },       // north-center
];

const DEFAULT_CONNECTIONS: { from: [number, number]; to: [number, number] }[] =
    [
        { from: [34.10, 74.80], to: [28.61, 77.21] },   // Srinagar \u2192 Delhi
        { from: [28.61, 77.21], to: [19.07, 72.88] },   // Delhi \u2192 Mumbai
        { from: [28.61, 77.21], to: [22.57, 88.36] },   // Delhi \u2192 Kolkata
        { from: [19.07, 72.88], to: [8.50,  76.95] },   // Mumbai \u2192 Trivandrum
        { from: [22.57, 88.36], to: [8.50,  76.95] },   // Kolkata \u2192 Trivandrum
    ];`;

const newBlock = `// Exact geographic coordinates for major Indian cities
const DEFAULT_MARKERS = [
    { lat: 28.61, lng: 77.21, label: "Delhi" },
    { lat: 19.07, lng: 72.88, label: "Mumbai" },
    { lat: 13.08, lng: 80.27, label: "Chennai" },
    { lat: 12.97, lng: 77.59, label: "Bengaluru" },
    { lat: 22.57, lng: 88.36, label: "Kolkata" },
    { lat: 17.38, lng: 78.49, label: "Hyderabad" },
];

const DEFAULT_CONNECTIONS: { from: [number, number]; to: [number, number] }[] =
    [
        { from: [28.61, 77.21], to: [19.07, 72.88] },   // Delhi \u2192 Mumbai
        { from: [28.61, 77.21], to: [22.57, 88.36] },   // Delhi \u2192 Kolkata
        { from: [19.07, 72.88], to: [12.97, 77.59] },   // Mumbai \u2192 Bengaluru
        { from: [13.08, 80.27], to: [12.97, 77.59] },   // Chennai \u2192 Bengaluru
        { from: [17.38, 78.49], to: [28.61, 77.21] },   // Hyderabad \u2192 Delhi
        { from: [17.38, 78.49], to: [13.08, 80.27] },   // Hyderabad \u2192 Chennai
    ];`;

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/components/ui/interactive-globe.tsx', content, 'utf8');
    console.log('Done - cities restored to correct Indian cities');
} else {
    console.log('Pattern not found - checking current content...');
    const i = content.indexOf('DEFAULT_MARKERS');
    console.log(content.substring(i, i + 400));
}
