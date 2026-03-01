const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcon(size, maskable = false) {
    const padding = maskable ? Math.round(size * 0.15) : Math.round(size * 0.05);
    const textSize = Math.round((size - padding * 2) * 0.45);
    
    const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1c1917"/>
        <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
              font-family="system-ui, -apple-system, sans-serif" font-weight="800"
              font-size="${textSize}px" fill="#fafaf9" letter-spacing="-1">
            Cn
        </text>
    </svg>`;

    const outputDir = path.join(__dirname, 'icons');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const filename = maskable ? `icon-maskable-${size}.png` : `icon-${size}.png`;
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(outputDir, filename));
    console.log(`Generated ${filename}`);
}

(async () => {
    await generateIcon(192);
    await generateIcon(512);
    await generateIcon(512, true);
    console.log('All icons generated!');
})();
