# Deentok — Faith in Every Scroll

Deentok is a responsive, TikTok-inspired Islamic learning and short-video feed for Qur'an recitation, Hadith, nasheed, Seerah of the Sahabah, stories of the Prophets, and beneficial reminders.

## Features
- Responsive feed and category filters
- Search across posts
- Like and save controls
- Community post form with video URL and source/reference notes
- Browser-local persistence for community posts
- Islamic content-source reminders and copyright-conscious contribution prompts

## Tech stack
React 19, TypeScript, Vite, Tailwind CSS, and Lucide icons.

## Run locally
Requires Node.js 20 or a compatible recent Node release.

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Deploying to Vercel
Import this repository in Vercel. The project uses Vite, with `npm run build` as the build command and `dist` as the output directory. No environment variables are required for the browser-only version.

The front end uses `localStorage` for community posts so the static site can run without an external API. Data is stored per browser and is not shared between visitors or devices. The `backend/` directory preserves the original AppDeploy backend implementation, which depends on AppDeploy's SDK and requires that platform's runtime; it is not a standalone Vercel API.

## Content and sources
Deentok is a platform prototype, not a religious authority. Verify Qur'anic translations, Hadith references, Seerah details, and religious rulings against trusted sources. Only share media you own or have permission to publish. Public video URLs may not allow embedding or direct playback.

## Current limitations
- No user accounts, creator profiles, moderation dashboard, or server-side shared feed yet.
- Like and save states are session-local; community posts persist in the current browser only.
- Starter cards are illustrative content cards; add verified, licensed media links for actual playback.
