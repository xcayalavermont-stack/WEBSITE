# Arcadia Consulting Website — Design Spec

Date: 2026-07-16

## Purpose

A brochure-style, multi-page website for Arcadia Consulting, the advisory practice founded by Eliot P.S. Merrill (2024–present). The site's job is to establish credibility with the audience Arcadia serves — management teams, fund sponsors, and boards — by presenting Merrill's 25-year private equity and board-governance record with the same understated authority as the firm's namesake sailboat, *Arcadia* (St. George, ME).

Source of truth for all written content is `background.md` in the project root, including its own corrections (no BankUnited claim; CGP II figures stated as reported/estimated, not fact).

## Visual System

- **Colors** (sampled directly from `Arcadia V2.png`):
  - Primary deep pine-green: `#1E4342`
  - Near-black ink (text, footer depth): `#12201F`
  - Warm ivory (page background): `#F6F1EA`
  - Brass/gold accent (CTAs, dividers, hover states): `#B08D57`
- **Type**: serif display face (Playfair Display or equivalent) for headlines, matching the logo's serif wordmark; humanist sans (Inter or equivalent) for body copy and UI chrome.
- **Motifs**: hairline rules, generous whitespace, restrained layout. No literal nautical clip-art — the boat mark and drone footage carry the nautical identity; everything else reads as boardroom-serious.

## Site Architecture

Static multi-page site, shared header/footer markup across all pages, mobile nav collapses to a hamburger menu.

1. **Home (`index.html`)**
   - Full-bleed looping drone video hero with dark-green gradient overlay, one-line positioning statement, brief intro paragraph, 3-pillar summary (Strategy / Human Capital / Hard Capital & M&A), CTA button to Contact.
2. **About (`about.html`)**
   - Eliot Merrill's career narrative: Carlyle (2001–2025) → Carlyle Global Partners co-head/head → Freeman Spogli & Co. → Dillon Read & Co. → Harvard College (A.B., magna cum laude). NYU Stern adjunct teaching note (FINC-UB 32, Private Equity Finance). A short "why Arcadia" section paired with the close-up shot of the boat's "ARCADIA — St. George, ME" transom, tying the firm's name to the real boat.
3. **Track Record (`track-record.html`)**
   - Table of board seats (Getty Images, Nielsen, AMC Entertainment/Loews, TCW Group, NEP Group, TAMKO, Asplundh, Sciens Building Solutions, Hyundai Glovis, Carlyle BDCs, Trust for Public Land, Citizen Schools).
   - Marquee deals section: Getty Images (2012, $3.3B), CGP launch ($3.6B, 2016), NEP Group, TAMKO.
   - Explicitly excludes BankUnited; CGP II figures framed as reported/estimated per background.md guidance.
4. **Services (`services.html`)**
   - Four advisory pillars expanded from Merrill's own positioning: Strategy, Human Capital, Hard Capital, M&A — each with a short description of what Arcadia does for management teams, funds, and boards through transitions (management changes, acquisitions, divestitures, growth-profile shifts).
5. **Contact (`contact.html`)**
   - Single CTA: "Email Eliot" `mailto:eliot.merrill@me.com` link (no form, no backend).

## Video Treatment

- **Hero clip**: `dji_fly_20260609_102026_41_1781015198306_video (2).mov` (44s source) — reviewed frame samples show a wide, dramatic tracking angle with open sky/negative space in the upper frame, ideal for overlaid headline text. Trimmed to ~12–15s, compressed to H.264 1080p (target ~3–6MB), muted, looping, `autoplay playsinline`. Dark green gradient overlay (`#12201F` → transparent) ensures headline text contrast.
- **Mobile / reduced-motion**: video hero replaced with a static poster frame (extracted still) on small viewports and when `prefers-reduced-motion` is set, to save data and respect accessibility preference.
- **About page**: `dji_fly_20260610_111206_42_1781105848928_video (1).mov` (15s source) — shows the "ARCADIA — St. George, ME" transom nameplate clearly. Trimmed to ~6–8s, compressed the same way, used as a smaller inline visual rather than a full-bleed hero.
- **Source footage**: the 8 raw `.mov`/`.MP4` files stay in the project root untouched as originals; only compressed derivatives are written into the site's `assets/video/` folder.

## Technical Build

- Plain HTML/CSS/vanilla JS. No framework, no build step, no Node dependency required to run the site — open `index.html` or serve statically.
- Shared header/nav/footer duplicated per page (5 pages is small enough that a JS-include layer would add complexity without real benefit).
- Fully responsive: fluid type scale, flexible grid for the track-record table and services cards, hamburger nav under a breakpoint (~768px).
- Accessibility: semantic landmarks (`header`/`nav`/`main`/`footer`), alt text on all imagery, `prefers-reduced-motion` handling for the video hero, sufficient color contrast between ivory/green/ink.
- Hosting-agnostic: works on any static host (Netlify, Vercel static, GitHub Pages, plain file server).

## Out of Scope

- No CMS, no contact form/backend, no analytics, no blog.
- No claims beyond what `background.md` supports as fact (CGP II final size, BankUnited) — anything uncertain is phrased as such or omitted.
