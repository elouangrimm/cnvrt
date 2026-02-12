# CnVrt Design Variants

Five distinct redesigns of the CnVrt file converter. All variants share the same `script.js` from the root and only differ in visual styling (HTML + CSS).

## Running

Each design is a static HTML/CSS site that loads `script.js` from the root (`/script.js`). You need a local server with the COOP/COEP headers for FFmpeg to work (SharedArrayBuffer requirement).

### Quick start (any design)

```bash
# Install a simple server (once)
npm i -g serve

# From the project root:
npx serve . --cors -p 3000
```

Then open:
- **Design 1 — Art Deco / Gatsby:** http://localhost:3000/1/
- **Design 2 — Bioluminescent Deep Sea:** http://localhost:3000/2/
- **Design 3 — Newspaper / Editorial Broadsheet:** http://localhost:3000/3/
- **Design 4 — Brutalist Industrial:** http://localhost:3000/4/
- **Design 5 — Cosmic / Celestial:** http://localhost:3000/5/
- **Original:** http://localhost:3000/
- **Terminal Edition:** http://localhost:3000/terminal/

> **Note:** FFmpeg requires `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers. The existing `vercel.json` handles this for Vercel deployments. For local dev, you may need a server that supports custom headers, or use the `--cors` flag.

### Alternative: Python

```bash
python3 -m http.server 3000
```

(FFmpeg may not work without the COOP/COEP headers from Python's built-in server.)

---

## Design Descriptions

### /1 — Art Deco / Gatsby
Deep navy background (#0A1628) with gold (#C9A84C) accents. Poiret One display font (ultra-thin geometric, very era-appropriate) paired with Tenor Sans for body text. Decorative corner ornaments with double-line borders, a conic-gradient sunburst background, and gold divider lines with fade-out gradients. Buttons have a double-border "frame within a frame" effect that inverts gold-on-navy on hover with a warm glow. Diamond-rotated checkboxes. All text is letterspaced and uppercase for that 1920s luxury feel.

### /2 — Bioluminescent Deep Sea
Abyssal black-to-deep-blue gradient background with 12 CSS-animated floating particles in cyan (#00F5D4), magenta (#FF006E), and bioluminescent green (#39FF14). Particles drift upward at varying speeds and sizes. Caustic light ripple overlay shifts gently. Megrim display font gives an alien/underwater vibe, Quicksand (weight 300) for ethereal body text. Rounded pill-shaped buttons with radial glow expansion on hover. Progress bar has a cyan→green gradient. The title pulses with bioluminescent glow.

### /3 — Newspaper / Editorial Broadsheet
Light theme on newsprint cream (#F4ECD8) — the only light-mode design. Abril Fatface for the massive masthead headline, Spectral italic for body copy. Full newspaper masthead with thick/thin ruled lines, dateline (auto-generated current date), edition markers ("EST. 2024", "ON-DEVICE"), and a tagline bar. SVG fractal noise texture overlay simulates aged paper grain. Buttons are solid ink-black with red (#CC0000) hover states. Progress bar is an ultra-thin 3px red line. Footer has double-rule separator. Sepia-tinted image previews.

### /4 — Brutalist Industrial
Black asphalt background with SVG noise texture for concrete grain. Hazard-stripe borders (diagonal yellow/black repeating gradient) at top and bottom edges. Anton display font (tall, narrow, bold) with Fira Mono for utilitarian body text. A "UTILITY CLASS: FILE CONVERSION / V2.0" badge banner. Title has a 3D shadow offset effect. Buttons are solid warning yellow (#FFD600) with thick 3px borders and offset box-shadows that shift on hover (translate + larger shadow). Progress bar uses diagonal hazard-stripe fill pattern. Format buttons explode with yellow fill and shadow on hover. Everything is uppercase, tight-letterspaced, and uncompromisingly raw.

### /5 — Cosmic / Celestial
Deep void (#050510) background with three layers of CSS star fields at different sizes and twinkle speeds, including colored stars (aurora teal and rose). Animated nebula gradients (purple, teal, rose) slowly rotate and scale. A perspective-transformed orbital ring slowly spins (60s cycle). Italiana serif display font with Nunito Sans ultralight body. Title uses a 3-color gradient text fill (white→teal→purple) with drop-shadow glow. Buttons have a shimmer light-sweep effect on hover (pseudo-element sliding across). Checkbox fills with a purple→teal gradient. Progress bar glows with a purple→teal→rose spectrum. Constellation marker (✦) pulses above the title.
