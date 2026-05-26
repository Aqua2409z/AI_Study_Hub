# AI Study Hub — 3D Login + Orbis Hero

Standalone Vite + React 19 + TypeScript + Tailwind CSS v4 project.

## Requirements
- Node.js 24.15.0
- npm / pnpm / bun

## Run
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Build
```bash
npm run build
npm run preview
```

## Structure
```
src/
  App.tsx                    # Layout: OrbisLanding (left) + LoginPanel (right)
  main.tsx                   # React 19 entry
  styles.css                 # Tailwind v4 + design tokens + animations
  components/
    OrbisLanding.tsx         # Only renders <HeroSection />
    HeroSection.tsx          # Section 1 — Hero video
    Header.tsx               # Top nav (AI Study Hub)
    SocialBtn.tsx            # Glass social icon button
    constants.ts             # HERO_VIDEO + NAV
    LoginPanel.tsx           # 3D animated login panel
    Orb3D.tsx                # Floating orb + rings + orbiting dot
    Field.tsx                # Glass input field
```

Edit any component freely — they're decoupled.
