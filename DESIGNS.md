# CnVrt Design Variants

Five distinct redesigns of the CnVrt file converter. All variants share the same `script.js` from the root and only differ in visual styling.

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
- **Design 1 — Terminal/Hacker:** http://localhost:3000/1/
- **Design 2 — Glassmorphism/Aurora:** http://localhost:3000/2/
- **Design 3 — Neobrutalism:** http://localhost:3000/3/
- **Design 4 — Minimal Zen:** http://localhost:3000/4/
- **Design 5 — Vaporwave/Retro:** http://localhost:3000/5/
- **Original:** http://localhost:3000/

> **Note:** FFmpeg requires `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers. The existing `vercel.json` handles this for Vercel deployments. For local dev, you may need a server that supports custom headers, or use the `--cors` flag.

### Alternative: Python

```bash
python3 -m http.server 3000
```

(FFmpeg may not work without the COOP/COEP headers from Python's built-in server.)

---

## Design Descriptions

### /1 — Terminal / Hacker
Green-on-black CRT aesthetic. Monospace font (JetBrains Mono), scanline overlay, blinking cursor, `user@cnvrt:~$` prompt styling. Buttons use wire-frame outlines that invert on hover with a green glow.

### /2 — Glassmorphism / Aurora
Frosted glass card floating over animated aurora blobs (purple, pink, cyan). Uses `backdrop-filter: blur()`, rounded corners, soft gradients. Purple accent color. Feels modern, fluid, and translucent.

### /3 — Neobrutalism
Bright cream background with thick black borders, chunky offset box-shadows, and bold playful colors (pink, yellow, blue). Chunky typography (Space Grotesk), each format button changes to a different color on hover. Decorative background shapes.

### /4 — Minimal Zen
Off-white/cream palette with serif typography (Cormorant Garamond). Hairline borders, generous whitespace, muted earth-tone accents. Ultra-thin 2px progress bar. Calm, editorial, and refined.

### /5 — Vaporwave / Retro Synthwave
Deep indigo background with a perspective grid floor and sunset gradient. Neon pink/cyan glowing accents (Orbitron display font). Buttons and text have multi-layer `text-shadow` glow effects. 80s/90s aesthetic.
