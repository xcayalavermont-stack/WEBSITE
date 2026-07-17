# Arcadia Consulting Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional, 5-page static website for Arcadia Consulting (Eliot P.S. Merrill), with a compressed drone-video hero on Home and a supporting clip on About, in a dark-green/ivory/brass palette matching the logo.

**Architecture:** Plain HTML/CSS/vanilla JS, no framework, no build step, no Node dependency. Five standalone HTML pages share duplicated header/nav/footer markup and a single `css/style.css` + `js/main.js`. Two source drone clips are compressed with `ffmpeg` into looping background-video assets; the logo PNG is resized with `sips` into a nav logo and favicons.

**Adaptation note (test strategy):** This project has no application logic and intentionally has no test framework or Node dependency (see Global Constraints). "Tests" in this plan are therefore: (a) shell-based structural assertions (`grep`/`test -f`/`ffprobe`) that verify a file exists, contains required markup, or an asset meets its size/duration target, and (b) an explicit manual browser-check instruction for anything visual (layout, color, video playback, responsive behavior, hamburger menu). Every task still ends with a concrete, runnable verification step.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox/grid), vanilla JS (ES5-compatible, no build step), ffmpeg (video transcoding), sips (macOS image resizing), Google Fonts (Playfair Display, Inter) via CDN link tags.

## Global Constraints

- No framework, no build step, no Node dependency required to run the site — open `index.html` or serve statically. (spec: Technical Build)
- Colors: primary deep pine-green `#1E4342`, near-black ink `#12201F`, warm ivory `#F6F1EA`, brass accent `#B08D57`. (spec: Visual System)
- Type: serif display (Playfair Display) for headlines, humanist sans (Inter) for body/UI. (spec: Visual System)
- No literal nautical clip-art; restrained, boardroom-serious layout. (spec: Visual System)
- Hero video source: `dji_fly_20260609_102026_41_1781015198306_video.mov`, used in full (36.7s, per explicit request), H.264 1080p, muted, looping, `autoplay playsinline`, dark-green gradient overlay for text contrast. (spec: Video Treatment, updated post-launch)
- About page video: `dji_fly_20260610_111206_42_1781105848928_video (1).mov`, trimmed ~6–8s, showing the "ARCADIA — St. George, ME" transom, smaller inline visual not full-bleed. (spec: Video Treatment)
- Video hero must fall back to a static poster image on mobile viewports and when `prefers-reduced-motion` is set. (spec: Video Treatment / Technical Build)
- Raw `.mov`/`.MP4` source files stay untouched in the project root; only compressed derivatives go in `assets/video/`. (spec: Video Treatment)
- Written content must follow `background.md` as source of truth, including its corrections: no BankUnited claim; CGP II figures phrased as reported/estimated, not stated as fact. (spec: Purpose / Track Record)
- Contact page mailto address: `eliot.merrill@me.com`. (spec: Site Architecture)
- Accessibility: semantic landmarks, alt text on all imagery, `prefers-reduced-motion` handling, sufficient color contrast. (spec: Technical Build)
- Responsive: fluid type scale, flexible grids, hamburger nav under ~768px. (spec: Technical Build)

---

## Task 1: Process video and image assets

**Files:**
- Create: `assets/video/hero.mp4`
- Create: `assets/img/hero-poster.jpg`
- Create: `assets/video/about-transom.mp4`
- Create: `assets/img/logo.png`
- Create: `assets/img/favicon.png`
- Create: `assets/img/apple-touch-icon.png`

**Interfaces:**
- Produces: `assets/video/hero.mp4` (looping hero background video, ~1920x1080, muted, no audio track), `assets/img/hero-poster.jpg` (1920x1080 still, poster/fallback frame matching the hero video's opening look), `assets/video/about-transom.mp4` (1280x720, ~6-8s, shows "ARCADIA" transom), `assets/img/logo.png` (400x400 nav/footer logo), `assets/img/favicon.png` (32x32), `assets/img/apple-touch-icon.png` (180x180). All later HTML tasks reference these exact paths.

- [ ] **Step 1: Create the assets directory structure**

Run:
```bash
mkdir -p "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE/assets/video" "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE/assets/img" "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE/css" "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE/js"
```
Expected: no output, directories created.

- [ ] **Step 2: Export the compressed hero loop**

Run (from the project root):
```bash
cd "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE"
ffmpeg -y -i "dji_fly_20260609_102026_41_1781015198306_video (2).mov" -ss 10 -t 14 \
  -vf "scale=1920:1080,format=yuv420p" -c:v libx264 -preset slow -crf 26 -an -movflags +faststart \
  assets/video/hero.mp4
```
Expected: ffmpeg completes without error, `assets/video/hero.mp4` exists.

- [ ] **Step 3: Verify hero.mp4 meets size/spec targets**

Run:
```bash
ls -lh assets/video/hero.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 assets/video/hero.mp4
```
Expected: `width=1920`, `height=1080`, `duration` between 13 and 15 seconds, file size roughly 3–8MB. If the file is over ~10MB, re-run Step 2 with `-crf 30` instead of `-crf 26`.

- [ ] **Step 4: Extract the hero poster frame**

Run:
```bash
ffmpeg -y -ss 12 -i "dji_fly_20260609_102026_41_1781015198306_video (2).mov" -frames:v 1 \
  -vf "scale=1920:1080,format=yuvj420p" -q:v 3 assets/img/hero-poster.jpg
```
Expected: `assets/img/hero-poster.jpg` exists.

- [ ] **Step 5: Verify the poster image**

Run:
```bash
test -f assets/img/hero-poster.jpg && echo "poster exists"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of default=noprint_wrappers=1 assets/img/hero-poster.jpg
```
Expected: prints "poster exists", `width=1920`, `height=1080`.

- [ ] **Step 6: Export the About-page transom clip**

Run:
```bash
ffmpeg -y -i "dji_fly_20260610_111206_42_1781105848928_video (1).mov" -ss 5 -t 8 \
  -vf "scale=1280:720,format=yuv420p" -c:v libx264 -preset slow -crf 26 -an -movflags +faststart \
  assets/video/about-transom.mp4
```
Expected: `assets/video/about-transom.mp4` exists.

- [ ] **Step 7: Verify about-transom.mp4**

Run:
```bash
ls -lh assets/video/about-transom.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 assets/video/about-transom.mp4
```
Expected: `width=1280`, `height=720`, `duration` between 7 and 9 seconds, file size a few MB or less.

- [ ] **Step 8: Generate the logo and favicon images from the source PNG**

Run:
```bash
sips -Z 400 "Arcadia V2.png" --out assets/img/logo.png
sips -Z 180 "Arcadia V2.png" --out assets/img/apple-touch-icon.png
sips -Z 32 "Arcadia V2.png" --out assets/img/favicon.png
```
Expected: all three commands report the output image dimensions with no error.

- [ ] **Step 9: Verify the generated images exist**

Run:
```bash
for f in assets/img/logo.png assets/img/apple-touch-icon.png assets/img/favicon.png; do test -f "$f" && echo "$f OK"; done
```
Expected: prints `assets/img/logo.png OK`, `assets/img/apple-touch-icon.png OK`, `assets/img/favicon.png OK`.

- [ ] **Step 10: Manually confirm the visuals look right**

Open `assets/img/hero-poster.jpg`, `assets/img/logo.png` in an image viewer (or Read tool) and play `assets/video/hero.mp4` / `assets/video/about-transom.mp4` in QuickTime. Confirm: the hero poster matches the hero video's first frame look (no jarring cut), the transom clip clearly shows "ARCADIA — St. George, ME", and the logo has no visible artifacts from resizing.

- [ ] **Step 11: Commit**

```bash
git add assets/
git commit -m "Add compressed hero/about video and logo/favicon assets"
```
(If this directory is not yet a git repo, run `git init` first and add all project files in this commit instead.)

---

## Task 2: Build the shared design system (`css/style.css`)

**Files:**
- Create: `css/style.css`

**Interfaces:**
- Produces: CSS custom properties `--color-green`, `--color-ink`, `--color-ivory`, `--color-brass`; utility classes `.container`, `.btn`, `.btn-primary`, `.sr-only`; component classes `.site-header`, `.header-inner`, `.brand`, `.brand-logo`, `.brand-name`, `.brand-sub`, `.nav-toggle`, `.site-nav`, `.nav-cta`, `.hero`, `.hero-media`, `.hero-video`, `.hero-overlay`, `.hero-content`, `.pillars`, `.pillar`, `.section`, `.section-title`, `.table-wrap`, `.track-table`, `.services-grid`, `.service-card`, `.about-media`, `.site-footer`, `.footer-inner`, `.footer-logo`, `.footer-email`. All five page tasks (Tasks 4–8) consume these class names exactly as spelled here.

- [ ] **Step 1: Write the full stylesheet**

Create `css/style.css`:
```css
/* ---- Design tokens ---- */
:root {
  --color-green: #1E4342;
  --color-ink: #12201F;
  --color-ivory: #F6F1EA;
  --color-brass: #B08D57;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --max-width: 1120px;
}

/* ---- Reset ---- */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--color-ivory);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-green);
  margin: 0 0 0.6em;
}
p { margin: 0 0 1em; }
a { color: var(--color-green); }
img { max-width: 100%; display: block; }
.sr-only {
  position: absolute; width: 1px; height: 1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

/* ---- Buttons ---- */
.btn {
  display: inline-block;
  padding: 14px 32px;
  border-radius: 2px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.03em;
  text-decoration: none;
  text-transform: uppercase;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.btn-primary {
  background: var(--color-brass);
  color: var(--color-ink);
}
.btn-primary:hover { background: #9c7a49; }

/* ---- Header / nav ---- */
.site-header {
  background: var(--color-ivory);
  border-bottom: 1px solid rgba(30,67,66,0.12);
  position: relative;
  z-index: 10;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 16px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.brand-logo { width: 40px; height: 40px; }
.brand-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 0.04em;
  color: var(--color-green);
  line-height: 1.1;
}
.brand-sub {
  display: block;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--color-brass);
}
.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 26px;
  height: 18px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.nav-toggle span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--color-green);
}
.site-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}
.site-nav a {
  text-decoration: none;
  color: var(--color-ink);
  font-weight: 500;
  font-size: 15px;
}
.site-nav a[aria-current="page"] { color: var(--color-green); border-bottom: 2px solid var(--color-brass); }
.site-nav a.nav-cta {
  background: var(--color-green);
  color: var(--color-ivory);
  padding: 10px 20px;
  border-radius: 2px;
}

/* ---- Hero ---- */
.hero {
  position: relative;
  height: 92vh;
  min-height: 520px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: var(--color-ink);
}
.hero-media {
  position: absolute;
  inset: 0;
}
.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(18,32,31,0.15) 0%, rgba(18,32,31,0.85) 100%);
}
.hero-content {
  position: relative;
  z-index: 2;
  color: var(--color-ivory);
  padding-bottom: 96px;
}
.hero-content h1 {
  color: var(--color-ivory);
  font-size: clamp(32px, 5vw, 56px);
  max-width: 760px;
}
.hero-content p {
  max-width: 560px;
  font-size: 18px;
  color: rgba(246,241,234,0.88);
}

/* ---- Sections ---- */
.section { padding: 88px 0; }
.section-title {
  font-size: clamp(26px, 3.4vw, 38px);
  margin-bottom: 0.4em;
}
.section-kicker {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-brass);
  margin-bottom: 12px;
  display: block;
}

/* ---- Pillars (Home) ---- */
.pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}
.pillar h3 { font-size: 22px; }
.pillar-rule {
  width: 40px;
  height: 3px;
  background: var(--color-brass);
  margin-bottom: 20px;
  border: none;
}

/* ---- Services grid ---- */
.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}
.service-card {
  background: #fff;
  border: 1px solid rgba(30,67,66,0.12);
  padding: 36px;
}
.service-card h3 { font-size: 22px; }

/* ---- Track record table ---- */
.table-wrap { overflow-x: auto; }
.track-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}
.track-table th, .track-table td {
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(30,67,66,0.15);
  vertical-align: top;
}
.track-table th {
  font-family: var(--font-display);
  color: var(--color-green);
  font-weight: 600;
}

/* ---- About page media ---- */
.about-media {
  border-radius: 2px;
  overflow: hidden;
  margin: 32px 0;
}
.about-media video { width: 100%; height: auto; display: block; }
.about-media figcaption {
  font-size: 14px;
  color: rgba(18,32,31,0.65);
  margin-top: 10px;
  font-style: italic;
}

/* ---- Footer ---- */
.site-footer {
  background: var(--color-ink);
  color: var(--color-ivory);
  padding: 48px 0;
}
.footer-inner {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}
.footer-logo { width: 32px; height: 32px; filter: brightness(0) invert(1); opacity: 0.9; }
.footer-email {
  color: var(--color-ivory);
  text-decoration: underline;
}
.site-footer p { margin: 0; font-size: 14px; color: rgba(246,241,234,0.7); }

/* ---- Responsive ---- */
@media (max-width: 900px) {
  .pillars { grid-template-columns: 1fr; }
  .services-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .nav-toggle { display: flex; }
  .site-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-ivory);
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    border-bottom: 1px solid rgba(30,67,66,0.12);
  }
  .site-nav.is-open { display: flex; }
  .site-nav a {
    width: 100%;
    padding: 16px 24px;
    border-top: 1px solid rgba(30,67,66,0.08);
  }
  .site-nav a.nav-cta { border-radius: 0; }
  .hero-content { padding-bottom: 56px; }
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .hero-video { display: none; }
}
```

- [ ] **Step 2: Verify the stylesheet parses and contains required tokens**

Run:
```bash
cd "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE"
grep -c "color-green" css/style.css
grep -c "prefers-reduced-motion" css/style.css
grep -c "nav-toggle" css/style.css
python3 -c "import re; s=open('css/style.css').read(); assert s.count('{') == s.count('}'), 'unbalanced braces'; print('braces balanced:', s.count('{'))"
```
Expected: non-zero counts for each grep, and `braces balanced: N` with no assertion error.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "Add Arcadia Consulting design system stylesheet"
```

---

## Task 3: Build shared navigation/video behavior (`js/main.js`)

**Files:**
- Create: `js/main.js`

**Interfaces:**
- Consumes: DOM elements with ids `navToggle`, `siteNav`, `heroVideo` (defined by the header/hero markup in Tasks 4–8) and a `<source data-src="...">` child inside `#heroVideo`.
- Produces: mobile nav toggle behavior via the `.is-open` class on `#siteNav`; conditional hero video loading (skips download entirely on narrow viewports or when `prefers-reduced-motion` is set).

- [ ] **Step 1: Write the script**

Create `js/main.js`:
```javascript
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Conditional hero video loading: skip entirely on mobile or reduced-motion
  var video = document.getElementById("heroVideo");
  if (video) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isNarrow = window.matchMedia("(max-width: 768px)").matches;
    if (!reduceMotion && !isNarrow) {
      var source = video.querySelector("source[data-src]");
      if (source) {
        source.src = source.getAttribute("data-src");
        video.load();
        video.play().catch(function () {
          /* autoplay can be blocked; poster image remains visible */
        });
      }
    }
  }
})();
```

- [ ] **Step 2: Verify the script is syntactically valid**

Run:
```bash
cd "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE"
node --check js/main.js && echo "syntax OK"
```
Expected: prints `syntax OK`. (This uses `node` only as a one-off syntax linter — the site itself has no Node dependency to run.)

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "Add nav toggle and conditional hero video loading script"
```

---

## Task 4: Build the Home page (`index.html`)

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `css/style.css`, `js/main.js`, `assets/img/logo.png`, `assets/video/hero.mp4`, `assets/img/hero-poster.jpg`, `assets/img/favicon.png`, `assets/img/apple-touch-icon.png` (all from Task 1–3).

- [ ] **Step 1: Write the page**

Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Arcadia Consulting — Eliot P.S. Merrill</title>
<meta name="description" content="Arcadia Consulting is the advisory practice of Eliot P.S. Merrill, advising management teams, funds, and boards on strategy, human capital, and M&A after 25 years as a private equity investor and public/private company director.">
<link rel="icon" href="assets/img/favicon.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="site-header">
  <div class="container header-inner">
    <a href="index.html" class="brand">
      <img src="assets/img/logo.png" alt="Arcadia Consulting" class="brand-logo">
      <span class="brand-name">ARCADIA<span class="brand-sub">CONSULTING</span></span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="siteNav">
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" id="siteNav">
      <a href="index.html" aria-current="page">Home</a>
      <a href="about.html">About</a>
      <a href="track-record.html">Track Record</a>
      <a href="services.html">Services</a>
      <a href="contact.html" class="nav-cta">Contact</a>
    </nav>
  </div>
</header>

<main>
  <section class="hero">
    <div class="hero-media">
      <video id="heroVideo" class="hero-video" poster="assets/img/hero-poster.jpg" muted loop playsinline preload="none">
        <source data-src="assets/video/hero.mp4" type="video/mp4">
      </video>
      <div class="hero-overlay"></div>
    </div>
    <div class="container hero-content">
      <h1>Patient capital. Proven governance.</h1>
      <p>Arcadia Consulting is the advisory practice of Eliot P.S. Merrill — 25 years as a private equity investor and public and private company director, now advising management teams, funds, and boards through pivotal transitions.</p>
      <a href="contact.html" class="btn btn-primary">Start a Conversation</a>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <span class="section-kicker">How Arcadia Helps</span>
      <h2 class="section-title">Advisory built on 25 years of long-hold value creation</h2>
      <div class="pillars">
        <div class="pillar">
          <hr class="pillar-rule">
          <h3>Strategy</h3>
          <p>Clear-eyed counsel on growth profile, positioning, and long-term value creation — informed by two decades leading long-dated private equity investments.</p>
        </div>
        <div class="pillar">
          <hr class="pillar-rule">
          <h3>Human Capital</h3>
          <p>Guidance through management transitions and leadership changes, drawn from board service across media, industrials, and financial services.</p>
        </div>
        <div class="pillar">
          <hr class="pillar-rule">
          <h3>Hard Capital &amp; M&amp;A</h3>
          <p>Perspective on acquisitions, divestitures, and capital structure decisions from a career spent on both sides of the negotiating table.</p>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container footer-inner">
    <img src="assets/img/logo.png" alt="Arcadia Consulting" class="footer-logo">
    <p>&copy; 2026 Arcadia Consulting. Eliot P.S. Merrill.</p>
    <a href="mailto:eliot.merrill@me.com" class="footer-email">eliot.merrill@me.com</a>
  </div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify required markup is present**

Run:
```bash
cd "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE"
grep -q 'id="heroVideo"' index.html && echo "hero video present"
grep -q 'data-src="assets/video/hero.mp4"' index.html && echo "hero source wired"
grep -q 'mailto:eliot.merrill@me.com' index.html && echo "contact email present"
grep -q 'aria-current="page"' index.html && echo "current nav marked"
python3 -c "
import xml.dom.minidom as m
m.parse('index.html')
print('well-formed XML-ish structure OK')
" 2>&1 | tail -1
```
Expected: prints "hero video present", "hero source wired", "contact email present", "current nav marked". The last check may report an XML parse error because HTML5 isn't strict XML (e.g. unclosed `<meta>`/`<link>`/`<img>` tags) — that's expected and not a failure; only treat it as a problem if the error points at a tag this task actually wrote incorrectly (mismatched or missing closing tag for `<div>`, `<section>`, `<html>`, `<body>`, etc.).

- [ ] **Step 3: Manually verify in a browser**

Run:
```bash
cd "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE"
python3 -m http.server 8080
```
Open `http://localhost:8080/index.html` in a browser. Confirm: the hero video autoplays muted and loops, the headline is legible over the gradient, the three pillar cards display side-by-side on desktop and stack on narrow width, and resizing the browser below ~768px reveals the hamburger menu which opens/closes the nav on click. Stop the server with Ctrl+C when done.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add Arcadia Consulting home page with video hero"
```

---

## Task 5: Build the About page (`about.html`)

**Files:**
- Create: `about.html`

**Interfaces:**
- Consumes: `css/style.css`, `js/main.js`, `assets/img/logo.png`, `assets/video/about-transom.mp4`, `assets/img/favicon.png`, `assets/img/apple-touch-icon.png`.

- [ ] **Step 1: Write the page**

Create `about.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>About Eliot P.S. Merrill — Arcadia Consulting</title>
<meta name="description" content="Eliot P.S. Merrill spent 22 years at The Carlyle Group, co-founding and leading Carlyle Global Partners, before founding Arcadia Consulting in 2024.">
<link rel="icon" href="assets/img/favicon.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="site-header">
  <div class="container header-inner">
    <a href="index.html" class="brand">
      <img src="assets/img/logo.png" alt="Arcadia Consulting" class="brand-logo">
      <span class="brand-name">ARCADIA<span class="brand-sub">CONSULTING</span></span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="siteNav">
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" id="siteNav">
      <a href="index.html">Home</a>
      <a href="about.html" aria-current="page">About</a>
      <a href="track-record.html">Track Record</a>
      <a href="services.html">Services</a>
      <a href="contact.html" class="nav-cta">Contact</a>
    </nav>
  </div>
</header>

<main>
  <section class="section">
    <div class="container">
      <span class="section-kicker">About</span>
      <h1 class="section-title">Eliot P.S. Merrill</h1>
      <p>Eliot P.S. Merrill is a career private equity investor with roughly 25 years of experience — 22 years at The Carlyle Group (2001–2025) and about four years earlier at Freeman Spogli &amp; Co. He joined Carlyle in 2001 and was promoted to Managing Director in the class announced in January 2007, focused on U.S. buyout opportunities in the telecommunications and media sectors.</p>
      <p>In 2014, Carlyle launched Carlyle Global Partners (CGP), its first long-dated private equity fund, and Mr. Merrill became Co-Head alongside Tyler Zachem. Carlyle announced in October 2016 that CGP had raised $3.6 billion, with a mandate to invest alongside owners and management teams for 10 to 15 years — far longer than the industry's typical three-to-five-year hold. A second fund, Carlyle Global Partners II, followed beginning around 2019. In later biographies, Mr. Merrill is described as sole Head of Carlyle Global Partners.</p>
      <p>Among the deals he led or was closely involved in: the 2012 acquisition of Getty Images from Hellman &amp; Friedman for $3.3 billion, where he joined the board; CGP's investment in NEP Group, the outsourced broadcast and live-event production company; and CGP's 2019 investment in TAMKO Building Products.</p>
      <p>His deepest, most citable credential is board governance: across his career he has served as a director of public and private companies spanning media, entertainment, asset management, industrials, and building products. A full list appears on the <a href="track-record.html">Track Record</a> page.</p>
      <p>Before Carlyle, Mr. Merrill was a Principal at Freeman Spogli &amp; Co., a buyout fund, and worked in the Mergers &amp; Acquisitions group at Dillon Read &amp; Co. from 1995 to 1997. He holds an A.B., magna cum laude, from Harvard College. He now teaches as an adjunct professor at NYU Stern, leading FINC-UB 32, Private Equity Finance, in the spring semesters, and serves on the National Board of the Trust for Public Land.</p>
    </div>
  </section>

  <section class="section" style="padding-top:0;">
    <div class="container">
      <span class="section-kicker">The Name</span>
      <h2 class="section-title">Why Arcadia</h2>
      <p>Long before Mr. Merrill founded his advisory practice, Arcadia was the name of his own sailboat, home-ported in St. George, Maine. Sailing runs through his earliest career, too — his first job was as a sail consultant and special-project coordinator at Doyle Sailmakers.</p>
      <figure class="about-media">
        <video controls muted playsinline poster="assets/img/hero-poster.jpg">
          <source src="assets/video/about-transom.mp4" type="video/mp4">
        </video>
        <figcaption>Arcadia, under sail off the coast of Maine.</figcaption>
      </figure>
      <p>The same patience and stewardship a long ocean passage demands is the philosophy behind the firm: durable, long-term thinking over short-term exits — the same instinct that shaped Carlyle Global Partners' decade-plus investment horizons.</p>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container footer-inner">
    <img src="assets/img/logo.png" alt="Arcadia Consulting" class="footer-logo">
    <p>&copy; 2026 Arcadia Consulting. Eliot P.S. Merrill.</p>
    <a href="mailto:eliot.merrill@me.com" class="footer-email">eliot.merrill@me.com</a>
  </div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify required markup and factual guardrails**

Run:
```bash
cd "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE"
grep -q 'assets/video/about-transom.mp4' about.html && echo "transom video present"
grep -qi 'bankunited' about.html && echo "FAIL: BankUnited mentioned" || echo "OK: no BankUnited claim"
grep -q 'aria-current="page"' about.html && echo "current nav marked"
```
Expected: "transom video present", "OK: no BankUnited claim", "current nav marked". If "FAIL: BankUnited mentioned" prints, remove that reference per `background.md`'s explicit correction.

- [ ] **Step 3: Manually verify in a browser**

With the same `python3 -m http.server 8080` running from Task 4, open `http://localhost:8080/about.html`. Confirm the narrative reads cleanly, the transom video plays on click (it's not autoplay — it has visible `controls`), and the nav highlights "About" as current.

- [ ] **Step 4: Commit**

```bash
git add about.html
git commit -m "Add About page with Eliot Merrill's career narrative"
```

---

## Task 6: Build the Track Record page (`track-record.html`)

**Files:**
- Create: `track-record.html`

**Interfaces:**
- Consumes: `css/style.css`, `js/main.js`, `assets/img/logo.png`, `assets/img/favicon.png`, `assets/img/apple-touch-icon.png`.

- [ ] **Step 1: Write the page**

Create `track-record.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Track Record — Arcadia Consulting</title>
<meta name="description" content="Eliot P.S. Merrill's board governance record and marquee private equity transactions, including Getty Images, Nielsen, AMC Entertainment, NEP Group, and TAMKO Building Products.">
<link rel="icon" href="assets/img/favicon.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="site-header">
  <div class="container header-inner">
    <a href="index.html" class="brand">
      <img src="assets/img/logo.png" alt="Arcadia Consulting" class="brand-logo">
      <span class="brand-name">ARCADIA<span class="brand-sub">CONSULTING</span></span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="siteNav">
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" id="siteNav">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="track-record.html" aria-current="page">Track Record</a>
      <a href="services.html">Services</a>
      <a href="contact.html" class="nav-cta">Contact</a>
    </nav>
  </div>
</header>

<main>
  <section class="section">
    <div class="container">
      <span class="section-kicker">Track Record</span>
      <h1 class="section-title">Board governance and marquee transactions</h1>
      <p>Across public and private companies, Mr. Merrill's board service spans media, entertainment, asset management, industrials, and building products.</p>
      <div class="table-wrap">
        <table class="track-table">
          <thead>
            <tr><th>Company</th><th>Business</th><th>Role / Notes</th></tr>
          </thead>
          <tbody>
            <tr><td>Getty Images</td><td>Visual content / media</td><td>Director from the 2012 Carlyle buyout</td></tr>
            <tr><td>The Nielsen Company B.V. / Nielsen Holdings</td><td>Media measurement</td><td>Director (former)</td></tr>
            <tr><td>AMC Entertainment (Holdings / AMCE)</td><td>Cinema exhibition</td><td>Director since January 2008 (former)</td></tr>
            <tr><td>Loews Cineplex Entertainment Corp.</td><td>Cinema exhibition</td><td>Board and audit committee (former)</td></tr>
            <tr><td>TCG BDC, Inc. (now Carlyle Secured Lending)</td><td>Business development company / credit</td><td>Director since 2013; Interim Chairman May 2016–March 2017; resigned 2020</td></tr>
            <tr><td>TCG BDC II, Inc.</td><td>BDC / credit</td><td>Director since October 2017</td></tr>
            <tr><td>TCG BDC III / NF Investment Corp.</td><td>BDC / credit</td><td>Director</td></tr>
            <tr><td>TCW Group</td><td>Asset management</td><td>Director (current)</td></tr>
            <tr><td>NEP Group, Inc.</td><td>Outsourced broadcast production</td><td>Director</td></tr>
            <tr><td>TAMKO Building Products</td><td>Roofing / building materials</td><td>Director from 2019</td></tr>
            <tr><td>Asplundh Tree Expert</td><td>Vegetation management / utility services</td><td>Director</td></tr>
            <tr><td>Sciens Building Solutions</td><td>Fire detection / building systems</td><td>Director (current)</td></tr>
            <tr><td>Medforth Global Healthcare Education</td><td>Medical education</td><td>Director</td></tr>
            <tr><td>Hyundai Glovis</td><td>Logistics (Korea)</td><td>Director</td></tr>
            <tr><td>Content Partners</td><td>Entertainment IP</td><td>Director</td></tr>
            <tr><td>Schoen Klinik</td><td>German specialty hospitals</td><td>Director</td></tr>
            <tr><td>Trust for Public Land</td><td>Nonprofit (parks / conservation)</td><td>National Board director (current)</td></tr>
            <tr><td>Citizen Schools of New York</td><td>Nonprofit (education)</td><td>Director</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0;">
    <div class="container">
      <span class="section-kicker">Marquee Transactions</span>
      <h2 class="section-title">Selected deal leadership</h2>
      <div class="services-grid">
        <div class="service-card">
          <h3>Getty Images (2012)</h3>
          <p>Carlyle and Getty Images management acquired Getty Images from Hellman &amp; Friedman for $3.3 billion. Mr. Merrill was the Carlyle Managing Director quoted on the deal and joined the board.</p>
        </div>
        <div class="service-card">
          <h3>Carlyle Global Partners (2014–2016)</h3>
          <p>Co-founded and helped lead Carlyle's first long-dated private equity fund, which raised $3.6 billion with a mandate to hold investments for 10 to 15 years. A second fund, CGP II, followed beginning around 2019 and is reported by third-party sources at roughly $1.8–1.9 billion.</p>
        </div>
        <div class="service-card">
          <h3>NEP Group (2016 / 2018)</h3>
          <p>CGP made a significant minority investment in 2016 and acquired majority control in 2018. Mr. Merrill has served as an NEP director.</p>
        </div>
        <div class="service-card">
          <h3>TAMKO Building Products (2019)</h3>
          <p>CGP became a long-term strategic minority investor in the asphalt-roofing manufacturer; Mr. Merrill joined TAMKO's board.</p>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container footer-inner">
    <img src="assets/img/logo.png" alt="Arcadia Consulting" class="footer-logo">
    <p>&copy; 2026 Arcadia Consulting. Eliot P.S. Merrill.</p>
    <a href="mailto:eliot.merrill@me.com" class="footer-email">eliot.merrill@me.com</a>
  </div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify required markup and factual guardrails**

Run:
```bash
cd "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE"
grep -qi 'bankunited' track-record.html && echo "FAIL: BankUnited mentioned" || echo "OK: no BankUnited claim"
grep -q '1.8–1.9 billion\|1.8-1.9 billion' track-record.html && echo "OK: CGP II framed as reported/estimated"
grep -c '<tr>' track-record.html
```
Expected: "OK: no BankUnited claim", "OK: CGP II framed as reported/estimated", and the `<tr>` count should be 19 (18 board rows + 1 header row).

- [ ] **Step 3: Manually verify in a browser**

Open `http://localhost:8080/track-record.html`. Confirm the table is readable and horizontally scrollable on narrow viewports instead of breaking the layout, and the deal cards stack to one column below ~900px.

- [ ] **Step 4: Commit**

```bash
git add track-record.html
git commit -m "Add Track Record page with board table and marquee deals"
```

---

## Task 7: Build the Services page (`services.html`)

**Files:**
- Create: `services.html`

**Interfaces:**
- Consumes: `css/style.css`, `js/main.js`, `assets/img/logo.png`, `assets/img/favicon.png`, `assets/img/apple-touch-icon.png`.

- [ ] **Step 1: Write the page**

Create `services.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Services — Arcadia Consulting</title>
<meta name="description" content="Arcadia Consulting advises management teams, funds, and boards on Strategy, Human Capital, Hard Capital, and M&A through transitions such as management changes, acquisitions, divestitures, and shifts in growth profile.">
<link rel="icon" href="assets/img/favicon.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="site-header">
  <div class="container header-inner">
    <a href="index.html" class="brand">
      <img src="assets/img/logo.png" alt="Arcadia Consulting" class="brand-logo">
      <span class="brand-name">ARCADIA<span class="brand-sub">CONSULTING</span></span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="siteNav">
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" id="siteNav">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="track-record.html">Track Record</a>
      <a href="services.html" aria-current="page">Services</a>
      <a href="contact.html" class="nav-cta">Contact</a>
    </nav>
  </div>
</header>

<main>
  <section class="section">
    <div class="container">
      <span class="section-kicker">Services</span>
      <h1 class="section-title">Strategic advisory for management teams, funds, and boards</h1>
      <p>Arcadia Consulting works alongside owners and management teams through the transitions that define long-term value — management changes, acquisitions, divestitures, and shifts in growth profile — drawing on 25 years spent as both an investor and a director.</p>
      <div class="services-grid">
        <div class="service-card">
          <h3>Strategy</h3>
          <p>Counsel on growth profile, market positioning, and long-horizon value creation, informed by leading one of Carlyle's first long-dated private equity funds — built to invest patiently over 10 to 15 years rather than a typical three-to-five-year hold.</p>
        </div>
        <div class="service-card">
          <h3>Human Capital</h3>
          <p>Guidance through leadership and management transitions, drawn from board service across media, entertainment, industrials, and financial services, where governance and management continuity are often the deciding factor in outcomes.</p>
        </div>
        <div class="service-card">
          <h3>Hard Capital</h3>
          <p>Perspective on capital structure, financing, and ownership decisions for companies navigating growth, recapitalization, or a change in strategic direction.</p>
        </div>
        <div class="service-card">
          <h3>M&amp;A</h3>
          <p>Direct experience on both sides of acquisitions and divestitures, including leading the $3.3 billion acquisition of Getty Images and CGP's investments in NEP Group and TAMKO Building Products.</p>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container footer-inner">
    <img src="assets/img/logo.png" alt="Arcadia Consulting" class="footer-logo">
    <p>&copy; 2026 Arcadia Consulting. Eliot P.S. Merrill.</p>
    <a href="mailto:eliot.merrill@me.com" class="footer-email">eliot.merrill@me.com</a>
  </div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify required markup**

Run:
```bash
cd "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE"
grep -c 'service-card' services.html
grep -q 'aria-current="page"' services.html && echo "current nav marked"
```
Expected: `service-card` count of at least 8 (4 opening divs + 4 closing references counted separately is fine, just confirm >0 and page renders 4 cards visually in Step 3), "current nav marked".

- [ ] **Step 3: Manually verify in a browser**

Open `http://localhost:8080/services.html`. Confirm all four service cards render in a 2-column grid on desktop and 1 column on narrow viewports.

- [ ] **Step 4: Commit**

```bash
git add services.html
git commit -m "Add Services page with the four advisory pillars"
```

---

## Task 8: Build the Contact page (`contact.html`)

**Files:**
- Create: `contact.html`

**Interfaces:**
- Consumes: `css/style.css`, `js/main.js`, `assets/img/logo.png`, `assets/img/favicon.png`, `assets/img/apple-touch-icon.png`.

- [ ] **Step 1: Write the page**

Create `contact.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact — Arcadia Consulting</title>
<meta name="description" content="Get in touch with Eliot P.S. Merrill at Arcadia Consulting.">
<link rel="icon" href="assets/img/favicon.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="site-header">
  <div class="container header-inner">
    <a href="index.html" class="brand">
      <img src="assets/img/logo.png" alt="Arcadia Consulting" class="brand-logo">
      <span class="brand-name">ARCADIA<span class="brand-sub">CONSULTING</span></span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="siteNav">
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" id="siteNav">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="track-record.html">Track Record</a>
      <a href="services.html">Services</a>
      <a href="contact.html" class="nav-cta" aria-current="page">Contact</a>
    </nav>
  </div>
</header>

<main>
  <section class="section">
    <div class="container" style="text-align:center; max-width:640px;">
      <span class="section-kicker">Contact</span>
      <h1 class="section-title">Start a conversation</h1>
      <p>Whether you're a management team navigating a transition, a fund evaluating an investment, or a board weighing a strategic decision, Arcadia Consulting welcomes the conversation.</p>
      <p><a href="mailto:eliot.merrill@me.com" class="btn btn-primary">Email Eliot Merrill</a></p>
      <p>Or reach him directly at <a href="mailto:eliot.merrill@me.com">eliot.merrill@me.com</a></p>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container footer-inner">
    <img src="assets/img/logo.png" alt="Arcadia Consulting" class="footer-logo">
    <p>&copy; 2026 Arcadia Consulting. Eliot P.S. Merrill.</p>
    <a href="mailto:eliot.merrill@me.com" class="footer-email">eliot.merrill@me.com</a>
  </div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify required markup**

Run:
```bash
cd "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE"
grep -c 'mailto:eliot.merrill@me.com' contact.html
grep -q 'aria-current="page"' contact.html && echo "current nav marked"
```
Expected: count of at least 3 (button, inline link, footer), "current nav marked".

- [ ] **Step 3: Manually verify in a browser**

Open `http://localhost:8080/contact.html`. Confirm the mailto button opens the default mail client addressed to `eliot.merrill@me.com`, and the layout is centered and readable at both desktop and mobile widths.

- [ ] **Step 4: Commit**

```bash
git add contact.html
git commit -m "Add Contact page with mailto CTA"
```

---

## Task 9: Cross-page consistency check and final polish

**Files:**
- Modify: any of `index.html`, `about.html`, `track-record.html`, `services.html`, `contact.html` (only if Step 1 finds a discrepancy)

**Interfaces:**
- Consumes: all pages and assets produced by Tasks 1–8.

- [ ] **Step 1: Verify every page links to every other page and shares identical nav structure**

Run:
```bash
cd "/Users/xavierayala-vermont/Documents/GitHub/WEBSITE"
for page in index.html about.html track-record.html services.html contact.html; do
  echo "=== $page ==="
  for target in index.html about.html track-record.html services.html contact.html; do
    grep -q "href=\"$target\"" "$page" && echo "  links to $target: OK" || echo "  links to $target: MISSING"
  done
done
```
Expected: every page reports "OK" for all five targets, including itself (the active nav link points to its own page).

- [ ] **Step 2: Verify every page references the stylesheet, script, and favicon consistently**

Run:
```bash
for page in index.html about.html track-record.html services.html contact.html; do
  grep -q 'css/style.css' "$page" || echo "$page MISSING stylesheet link"
  grep -q 'js/main.js' "$page" || echo "$page MISSING script tag"
  grep -q 'assets/img/favicon.png' "$page" || echo "$page MISSING favicon link"
done
echo "check complete"
```
Expected: no "MISSING" lines print before "check complete".

- [ ] **Step 3: Confirm raw source video files were left untouched**

Run:
```bash
ls -la "dji_fly_20260609_102026_41_1781015198306_video (2).mov" "dji_fly_20260610_111206_42_1781105848928_video (1).mov"
```
Expected: both original files still present at their original sizes (13M and 80M respectively, per the original directory listing) — confirming Task 1 only read from them and wrote derivatives to `assets/`.

- [ ] **Step 4: Full manual walkthrough**

With `python3 -m http.server 8080` running from the project root, click through Home → About → Track Record → Services → Contact and back, at both a desktop width (~1440px) and a narrow width (~375px, e.g. via browser dev tools device toolbar). Confirm: no broken links, no layout overflow/horizontal scrollbars on the page body (the track-record table's own horizontal scroll is expected and fine), hamburger menu works on every page, hero video plays only on Home, and colors/typography are consistent site-wide.

- [ ] **Step 5: Commit any fixes found during the walkthrough**

If Steps 1–4 turned up any discrepancy, fix it directly in the affected file(s), then:
```bash
git add -A
git commit -m "Fix cross-page consistency issues found in final review"
```
If nothing needed fixing, skip this commit — there's nothing to commit.

---

## Self-Review Notes

- **Spec coverage:** Visual system (Task 2), 5-page architecture (Tasks 4–8), video treatment incl. mobile/reduced-motion fallback (Tasks 1, 3, 4), technical build constraints — static/no-framework/responsive/accessible (all tasks), factual guardrails from `background.md` (Tasks 5–6, verified explicitly in Step 2 of each). All spec sections are covered.
- **Placeholder scan:** no TBD/TODO markers; all code blocks are complete and copy-pasteable.
- **Type/name consistency:** class names (`.hero-video`, `.site-nav`, `.nav-toggle`, etc.) and element ids (`heroVideo`, `navToggle`, `siteNav`) are identical across `css/style.css`, `js/main.js`, and all five HTML pages — verified by re-reading Task 2/3's Interfaces block against every page's markup.
