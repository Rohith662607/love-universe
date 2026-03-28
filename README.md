# 🌌 The Universe That Found You

A cinematic, interactive love universe website built for a long-distance relationship.

---

## 🚀 Quick Start — Open Instantly (No Build Required)

Just open `index.html` directly in any browser.

```
love-universe/
└── index.html   ← Double-click this file. That's it.
```

---

## ⚙️ Angular Project Setup

### Prerequisites
- Node.js 20.x
- npm 10.x
- Angular CLI 16.x

### Step 1 — Install Angular CLI
```bash
npm install -g @angular/cli@16
```

### Step 2 — Install dependencies
```bash
cd love-universe-angular
npm install
```

### Step 3 — Install Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### Step 4 — Run development server
```bash
ng serve
```
Open: http://localhost:4200

### Step 5 — Build for production
```bash
ng build --configuration production
```
Output in: `dist/love-universe/`

---

## 📁 Project Structure

```
love-universe-angular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── universe-shell/       ← Main orchestrator (Three.js canvas, cursor, keyboard nav)
│   │   │   ├── loader/               ← Scene 0: Loading screen
│   │   │   ├── beginning/            ← Scene 1: Typewriter mystery intro
│   │   │   ├── bus-moment/           ← Scene 2: The bus seat origin story
│   │   │   ├── our-world/            ← Scene 3: Memory cards grid with modal
│   │   │   ├── distance/             ← Scene 4: LDR emotional section
│   │   │   ├── why-you/              ← Scene 5: Interactive poem stars constellation
│   │   │   ├── hidden-space/         ← Scene 6: Password-protected secret letter
│   │   │   ├── future-universe/      ← Scene 7: Dreams & orbit system
│   │   │   ├── mini-game/            ← Scene 8: Star collector canvas game
│   │   │   ├── final-reveal/         ← Scene 9: Emotional finale with confetti
│   │   │   └── shared/
│   │   │       ├── nav-dots/         ← Scene navigation dots
│   │   │       └── audio-player/     ← Ambient audio toggle
│   │   ├── services/
│   │   │   ├── scene.service.ts      ← Scene state & navigation
│   │   │   ├── data.service.ts       ← All poems, quotes, memories data
│   │   │   ├── audio.service.ts      ← Web Audio API ambient tones
│   │   │   └── effects.service.ts    ← Confetti, heart bursts, particles
│   │   ├── models/
│   │   │   └── universe.models.ts    ← TypeScript interfaces
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── assets/
│   │   └── data/
│   │       └── universe.json         ← All content data
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

---

## 🎮 Navigation

| Action | Result |
|--------|--------|
| `→` or `↓` | Next scene |
| `←` or `↑` | Previous scene |
| Click nav dots (right side) | Jump to scene |
| Click scene buttons | Next scene |

---

## 🔐 Password (Hidden Space — Scene 6)

The password section accepts any of these (all lowercase):
- `love`
- `bus`
- `vizag`
- `forever`
- `heartbeat`
- `mystar`
- `youandme`

**To add your own custom password**, edit `src/app/services/data.service.ts`:
```typescript
passwords: ["yourpassword", "another", ...]
```

---

## 🎮 Easter Eggs

| Trigger | Effect |
|---------|--------|
| Konami Code: `↑↑↓↓←→←→BA` | Secret universe unlocked — hearts + confetti burst |
| Click ♪ button (bottom left) | Toggle ambient music |

---

## 🎨 Customization

### Change poems or quotes
Edit `src/assets/data/universe.json` — all content lives here.

### Change color palette
Edit CSS variables in `src/styles.scss`:
```scss
:root {
  --accent: #e8c9a0;  // warm gold
  --rose:   #c97a8a;  // rose pink
  --gold:   #d4a65a;  // deep gold
  --blue:   #6b9bd1;  // soft blue
}
```

### Add voice notes
In any scene component, add an `<audio>` element:
```html
<audio #voiceNote src="assets/audio/my-voice.mp3" preload="auto"></audio>
<button (click)="voiceNote.play()">▶ Play</button>
```

---

## 🌐 Deployment (Vercel — Recommended)

### Static file (index.html) — Instant deploy
1. Go to [vercel.com](https://vercel.com)
2. Drag and drop the `love-universe/` folder
3. Done ✓

### Angular project — Full deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Build
cd love-universe-angular
ng build --configuration production

# Deploy
vercel dist/love-universe
```

Or connect your GitHub repo to Vercel for automatic deployments.

**Build Settings for Vercel:**
- Build Command: `ng build --configuration production`
- Output Directory: `dist/love-universe`
- Install Command: `npm install`

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `gsap` | Scene transitions, element animations |
| `three` | 3D starfield background |
| `howler` | (Optional) Audio file playback |
| `tailwindcss` | Utility CSS classes |
| `@angular/animations` | Angular animation primitives |

---

## 🎵 Background Music Ideas

Since the site uses Web Audio API for ambient drones, you can also add real music:

1. **Lo-fi beats** — search "lofi love background music" on YouTube, use a royalty-free track
2. **Instrumental Bollywood** — AR Rahman ambient works beautifully
3. **Ocean waves + soft piano** — matches the Vizag shore theme perfectly

Add to `src/assets/audio/ambient.mp3` and wire up in `audio.service.ts`.

---

## ✨ Performance Tips

1. The Three.js canvas uses `pixelRatio: Math.min(devicePixelRatio, 2)` — capped for performance
2. Star count is 2000 — reduce to 1000 on mobile if needed
3. GSAP animations are GPU-accelerated (transform/opacity only)
4. Images are not used — all visuals are CSS/canvas/SVG for fast loading
5. No heavy backend — all data is embedded in the service

---

## ❤️ The Story

This universe was built around a quiet, deep love story:

> *"A bus seat led me to my fate,*  
> *Beside you, time began to wait.*  
> *In every moment since that day,*  
> *You turned my sky from grey to May."*

**9 scenes. 40 poems. One universe. One person.**
