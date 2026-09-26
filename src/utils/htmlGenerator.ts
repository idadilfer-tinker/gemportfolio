import { PortfolioData, Project } from '../types/portfolio';

export function generateHomeHtml(data: PortfolioData): string {
  const { author, projects } = data;

  const projectArticles = projects
    .map((p, idx) => {
      const caseStudyHref = p.hasCaseStudy ? `projects/${p.slug}.html` : '#';
      const mediaLabel = p.homeMedia.label || `assets/home/${p.slug}.jpg`;
      const isVideo = p.homeMedia.type === 'video';

      const mediaMarkup = isVideo
        ? `<video src="${p.homeMedia.url}" playsinline autoplay muted loop preload="metadata" style="width:100%;height:100%;object-fit:cover;display:block;"></video>`
        : `<img src="${p.homeMedia.url}" alt="${escapeHtml(p.homeMedia.alt || p.title)}" loading="lazy" onerror="this.remove()">`;

      const linksMarkup = [
        p.hasCaseStudy ? `<li><a href="${caseStudyHref}">Case study</a></li>` : '',
        p.externalWebsiteUrl ? `<li><a href="${p.externalWebsiteUrl}" target="_blank" rel="noopener">Website</a></li>` : '',
        p.pressUrl ? `<li><a href="${p.pressUrl}" target="_blank" rel="noopener">Press</a></li>` : '',
      ]
        .filter(Boolean)
        .join('\n          ');

      return `    <!-- PROJECT 0${idx + 1}: ${p.title} -->
    <article class="project">
      <a href="${caseStudyHref}">
        <figure class="media" data-label="${escapeHtml(mediaLabel)}">
          ${mediaMarkup}
        </figure>
      </a>
      <div class="copy">
        <h2><a href="${caseStudyHref}">${escapeHtml(p.title)}</a></h2>
        <p class="meta">${escapeHtml(p.meta)}</p>
        <p>${escapeHtml(p.description1)}</p>
        ${p.description2 ? `<p>${escapeHtml(p.description2)}</p>` : ''}
        <ul class="links">
          ${linksMarkup}
        </ul>
      </div>
    </article>`;
    })
    .join('\n\n');

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(author.name)}</title>
<meta name="description" content="${escapeHtml(author.role)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Tinos:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="topbar">
    <a class="name" href="index.html">${escapeHtml(author.name)}</a>
    <nav>
      <a href="index.html" aria-current="page">Work</a>
      <a href="cv.html">CV</a>
      <a href="mailto:${escapeHtml(author.email)}" aria-label="Email">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></svg>
      </a>
      ${
        author.linkedin
          ? `<a href="${author.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4V9.5Z"/></svg>
      </a>`
          : ''
      }
      ${
        author.instagram
          ? `<a href="${author.instagram}" target="_blank" rel="noopener" aria-label="Instagram">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></svg>
      </a>`
          : ''
      }
    </nav>
  </header>

  <section class="intro">
    <p>${escapeHtml(author.intro)}</p>
  </section>

  <main class="reel">
${projectArticles}
  </main>

  <footer>${escapeHtml(author.name)} &copy; <span id="yr">${author.copyrightYear}</span></footer>
<script>document.getElementById('yr').textContent = new Date().getFullYear();</script>
</body>
</html>`;
}

export function generateCaseStudyHtml(project: Project, data: PortfolioData): string {
  const cs = project.caseStudy;
  const audio = cs.audio;
  const visitLink = project.externalWebsiteUrl
    ? `<a class="visit-link" href="${project.externalWebsiteUrl}" target="_blank" rel="noopener">
      Visit ${project.externalWebsiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
    </a>`
    : '';

  const audioBarHtml = audio.enabled
    ? `<!-- AUDIO BAR -->
<div class="audio-bar">
  <div class="audio-bar-inner">
    <span class="audio-label">${escapeHtml(audio.label || 'Audio description')}</span>
    <div class="audio-controls">
      <button class="audio-btn" id="playBtn" aria-label="Play"></button>
      <button class="audio-btn" id="stopBtn" aria-label="Stop"><svg width="10" height="10" viewBox="0 0 10 10"><rect width="10" height="10" fill="#141314"/></svg></button>
    </div>
    <div class="audio-progress" id="progressTrack"><div class="audio-progress-fill" id="progressFill"></div></div>
    <span class="audio-time" id="timeLabel">0:00 / 0:00</span>
    <button class="read-toggle" id="readToggle">≡ Read as text</button>
  </div>
  <audio id="narrationAudio" preload="metadata" src="${audio.url || `../assets/audio/${project.slug}-narration.mp3`}"></audio>
</div>

<div class="audio-summary" id="audioSummary">
  <div class="audio-summary-inner">
    <div class="audio-summary-label">Transcript</div>
    <div class="audio-summary-hint">Read the full narration as text.</div>
    <div class="transcript">
      <details class="transcript-item" open>
        <summary><span class="t-hint">The challenge</span><span class="t-mark">+</span></summary>
        <div class="transcript-body">${escapeHtml(audio.transcript.challenge)}</div>
      </details>
      <details class="transcript-item">
        <summary><span class="t-hint">My approach</span><span class="t-mark">+</span></summary>
        <div class="transcript-body">${escapeHtml(audio.transcript.approach)}</div>
      </details>
      <details class="transcript-item">
        <summary><span class="t-hint">What I built</span><span class="t-mark">+</span></summary>
        <div class="transcript-body">${escapeHtml(audio.transcript.built)}</div>
      </details>
    </div>
  </div>
</div>`
    : '';

  const renderSectionFigure = (sec: typeof cs.challenge) => {
    const isVideo = sec.media.type === 'video';
    const mediaHtml = isVideo
      ? `<video src="${sec.media.url}" playsinline autoplay muted loop controls style="width:100%;display:block;border-radius:14px;"></video>`
      : `<img src="${sec.media.url}" alt="${escapeHtml(sec.media.alt)}" loading="lazy">`;

    return `<section class="cs-section">
    <p class="cs-section-label">${escapeHtml(sec.label)}</p>
    <h2 class="cs-h2">${escapeHtml(sec.headline)}</h2>
    <p class="cs-cap">${sec.body}</p>
    <figure class="figure">${mediaHtml}</figure>
    ${
      sec.media.caption
        ? `<p class="cap"><b>${escapeHtml(sec.media.screenName || '')}</b>. ${escapeHtml(sec.media.caption)}</p>`
        : ''
    }
  </section>`;
  };

  const metricsHtml = cs.outcome.metrics
    .map(
      (m) => `<div class="cs-metric"><div class="cs-metric-num">${escapeHtml(m.num)}</div><div class="cs-metric-label">${escapeHtml(m.label)}</div></div>`
    )
    .join('\n      ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(project.title)} · Case Study · ${escapeHtml(data.author.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Tinos:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
</head>
<body>

<nav class="back-nav">
  <a class="back-link" href="../index.html">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
    Back to portfolio
  </a>
  <span class="back-nav-title">${escapeHtml(project.title)} · Case Study</span>
  <div class="back-nav-right">
    ${visitLink}
  </div>
</nav>

${audioBarHtml}

<header class="cs-hero">
  <p class="cs-eyebrow">${escapeHtml(cs.eyebrow)}</p>
  <h1 class="cs-title">${escapeHtml(cs.title)}</h1>
  <p class="cs-dek">${escapeHtml(cs.dek)}</p>
  <div class="cs-meta">
    <div><div class="cs-meta-label">Role</div><div class="cs-meta-value">${escapeHtml(cs.meta.role)}</div></div>
    <div><div class="cs-meta-label">Year</div><div class="cs-meta-value">${escapeHtml(cs.meta.year)}</div></div>
    <div><div class="cs-meta-label">Type</div><div class="cs-meta-value">${escapeHtml(cs.meta.type)}</div></div>
    <div><div class="cs-meta-label">Status</div><div class="cs-meta-value">${escapeHtml(cs.meta.status)}</div></div>
  </div>
</header>

<div class="cs-body">
  ${renderSectionFigure(cs.challenge)}
  ${renderSectionFigure(cs.approach)}
  ${renderSectionFigure(cs.built)}

  <section class="cs-section">
    <p class="cs-section-label">Outcome</p>
    <div class="cs-metrics">
      ${metricsHtml}
    </div>
    ${cs.outcome.callout ? `<div class="cs-callout"><p>"${escapeHtml(cs.outcome.callout)}"</p></div>` : ''}
  </section>
</div>

${
  audio.enabled
    ? `<script>
(function(){
  const audio = document.getElementById('narrationAudio');
  const playBtn = document.getElementById('playBtn');
  const stopBtn = document.getElementById('stopBtn');
  const progressTrack = document.getElementById('progressTrack');
  const progressFill = document.getElementById('progressFill');
  const timeLabel = document.getElementById('timeLabel');
  const readToggle = document.getElementById('readToggle');
  const summary = document.getElementById('audioSummary');
  if(!audio || !playBtn) return;

  const PLAY_SVG = '<svg width="11" height="12" viewBox="0 0 11 12"><path d="M1 1L10 6L1 11Z" fill="#141314"/></svg>';
  const PAUSE_SVG = '<svg width="10" height="12" viewBox="0 0 10 12"><rect x="0" width="3" height="12" fill="#141314"/><rect x="7" width="3" height="12" fill="#141314"/></svg>';

  function fmt(t){
    if(!isFinite(t) || t < 0) return '0:00';
    const m = Math.floor(t/60);
    const s = Math.floor(t%60).toString().padStart(2,'0');
    return m+':'+s;
  }
  function setPlaying(isPlaying){
    playBtn.innerHTML = isPlaying ? PAUSE_SVG : PLAY_SVG;
  }
  playBtn.innerHTML = PLAY_SVG;

  playBtn.addEventListener('click', () => {
    if (audio.paused) audio.play(); else audio.pause();
  });
  stopBtn.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    progressFill.style.width = '0%';
    timeLabel.textContent = fmt(0) + ' / ' + fmt(audio.duration);
  });
  progressTrack.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressTrack.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  });
  readToggle.addEventListener('click', () => {
    const open = summary.classList.toggle('open');
    readToggle.classList.toggle('active', open);
    readToggle.textContent = open ? '✕ Hide text' : '≡ Read as text';
  });
  audio.addEventListener('loadedmetadata', () => {
    timeLabel.textContent = fmt(0) + ' / ' + fmt(audio.duration);
  });
  audio.addEventListener('timeupdate', () => {
    const pct = audio.duration ? (audio.currentTime/audio.duration*100) : 0;
    progressFill.style.width = pct + '%';
    timeLabel.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
  });
  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => setPlaying(false));
})();
</script>`
    : ''
}

</body>
</html>`;
}

export function generateStylesCss(): string {
  return `/* ============================================================
   IDA DILFER PORTFOLIO — Stylesheet for GitHub Pages Static Site
   Includes Home Page & Isaac Blankensmith Minimal Case Studies
   ============================================================ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #FDFDFC;
  --fg: #141314;
  --fg2: #4a4642;
  --fg3: #8a857e;
  --accent: #C15A38;
  --accent2: #a8461f;
  --border: #E3DFD7;
  --border2: #EDEAE4;
  --max: 1100px;
  --gutter: clamp(24px, 5vw, 80px);
  --font-body: 'Libre Franklin', system-ui, -apple-system, sans-serif;
  --font-display: 'Tinos', Georgia, serif;
}

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ============================================================
   TOPBAR & INTRO (HOME)
   ============================================================ */
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(253, 253, 252, 0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px var(--gutter);
}

.topbar .name {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 15px;
  color: var(--fg);
  text-decoration: none;
  letter-spacing: -0.01em;
}

.topbar nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.topbar nav a {
  color: var(--fg2);
  text-decoration: none;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  transition: color 0.15s ease;
}

.topbar nav a:hover,
.topbar nav a[aria-current="page"] {
  color: var(--fg);
}

.topbar nav a[aria-current="page"] {
  font-weight: 500;
}

.topbar nav .icon {
  width: 17px;
  height: 17px;
}

.intro {
  max-width: var(--max);
  margin: 0 auto;
  padding: 72px var(--gutter) 48px;
}

.intro p {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.8vw, 2.2rem);
  font-style: italic;
  line-height: 1.35;
  color: var(--fg);
  letter-spacing: -0.01em;
  max-width: 820px;
}

/* ============================================================
   REEL & PROJECT ARTICLES (HOME)
   ============================================================ */
.reel {
  max-width: var(--max);
  margin: 0 auto;
  padding: 0 var(--gutter) 80px;
  display: flex;
  flex-direction: column;
  gap: 72px;
}

.project {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 56px);
  align-items: center;
  padding-bottom: 72px;
  border-bottom: 1px solid var(--border2);
}

.project:last-of-type {
  border-bottom: none;
}

.project .media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: #f4f1ec;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border2);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
}

.project .media:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -10px rgba(20, 19, 20, 0.08);
}

.project .media img,
.project .media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.project .copy h2 {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.project .copy h2 a {
  color: var(--fg);
  text-decoration: none;
  transition: color 0.15s ease;
}

.project .copy h2 a:hover {
  color: var(--accent);
}

.project .copy .meta {
  font-size: 12.5px;
  color: var(--fg3);
  margin-bottom: 18px;
  letter-spacing: 0.02em;
}

.project .copy p {
  font-size: 15px;
  line-height: 1.68;
  color: var(--fg2);
  margin-bottom: 14px;
}

.project .copy .links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 22px;
}

.project .copy .links li a {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--accent);
  text-decoration: none;
  position: relative;
  transition: color 0.15s ease;
}

.project .copy .links li a:hover {
  color: var(--accent2);
  text-decoration: underline;
}

footer {
  max-width: var(--max);
  margin: 0 auto;
  padding: 32px var(--gutter) 48px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--fg3);
}

@media (max-width: 820px) {
  .project {
    grid-template-columns: 1fr;
    gap: 24px;
    padding-bottom: 56px;
  }
}

/* ============================================================
   CASE STUDY TEMPLATE (Isaac Blankensmith minimal style)
   ============================================================ */
.back-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 101;
  height: 60px;
  background: rgba(253, 253, 252, 0.94);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 var(--gutter);
  gap: 16px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--fg2);
  text-decoration: none;
  font-size: 13.5px;
  transition: color 0.18s;
}

.back-link:hover {
  color: var(--fg);
}

.back-link svg {
  width: 16px;
  height: 16px;
}

.back-nav-title {
  font-size: 13px;
  color: var(--fg3);
  font-style: italic;
}

.back-nav-right {
  margin-left: auto;
}

.visit-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  text-decoration: none;
  border: 1px solid rgba(193, 90, 56, 0.35);
  padding: 6px 14px;
  border-radius: 6px;
  transition: background 0.18s;
}

.visit-link:hover {
  background: rgba(193, 90, 56, 0.1);
}

.visit-link svg {
  width: 11px;
  height: 11px;
}

/* Audio bar */
.audio-bar {
  position: sticky;
  top: 60px;
  z-index: 99;
  background: rgba(253, 253, 252, 0.97);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}

.audio-bar-inner {
  max-width: var(--max);
  margin: 0 auto;
  padding: 12px var(--gutter);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.audio-label {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg3);
  white-space: nowrap;
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.audio-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: border-color 0.15s, background 0.15s;
}

.audio-btn:hover {
  border-color: var(--accent2);
}

.audio-progress {
  flex: 1 1 140px;
  min-width: 90px;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.audio-progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0%;
  background: var(--accent);
  border-radius: 2px;
}

.audio-time {
  font-size: 12px;
  color: var(--fg3);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  min-width: 76px;
}

.read-toggle {
  margin-left: auto;
  font-size: 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 7px 14px;
  background: none;
  color: var(--fg2);
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.read-toggle:hover {
  border-color: var(--accent2);
}

.read-toggle.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.audio-summary {
  display: none;
  background: #F5F2EC;
  border-bottom: 1px solid var(--border);
}

.audio-summary.open {
  display: block;
}

.audio-summary-inner {
  max-width: var(--max);
  margin: 0 auto;
  padding: 32px var(--gutter) 40px;
}

.audio-summary-label {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg3);
  margin-bottom: 6px;
}

.audio-summary-hint {
  font-size: 13px;
  color: var(--fg2);
  margin-bottom: 20px;
}

.transcript {
  max-width: 700px;
  border-top: 1px solid var(--border2);
}

.transcript-item {
  border-bottom: 1px solid var(--border2);
}

.transcript-item summary {
  list-style: none;
  cursor: pointer;
  padding: 16px 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.transcript-item summary::-webkit-details-marker {
  display: none;
}

.transcript-item summary .t-hint {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}

.transcript-item summary .t-mark {
  font-size: 18px;
  color: var(--fg3);
  flex: 0 0 auto;
  transition: transform 0.15s;
}

.transcript-item[open] summary .t-mark {
  transform: rotate(45deg);
  color: var(--accent2);
}

.transcript-body {
  padding: 0 2px 20px;
  font-size: 14px;
  line-height: 1.85;
  color: var(--fg2);
  max-width: 660px;
}

/* Case study hero */
.cs-hero {
  padding: 130px var(--gutter) 40px;
  max-width: var(--max);
  margin: 0 auto;
}

.cs-eyebrow {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 18px;
}

.cs-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5.5vw, 4.5rem);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin-bottom: 20px;
}

.cs-dek {
  font-size: clamp(15px, 1.3vw, 18px);
  line-height: 1.6;
  color: var(--fg2);
  max-width: 680px;
  margin-bottom: 40px;
}

.cs-meta {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 24px 0;
  max-width: 860px;
}

.cs-meta-label {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg3);
  margin-bottom: 6px;
}

.cs-meta-value {
  font-size: 14.5px;
  color: var(--fg);
}

@media (max-width: 640px) {
  .cs-meta {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Case study body & sections */
.cs-body {
  max-width: var(--max);
  margin: 0 auto;
  padding: 0 var(--gutter) 80px;
}

.cs-section {
  padding: 56px 0;
  border-bottom: 1px solid var(--border2);
}

.cs-section:last-of-type {
  border-bottom: none;
}

.cs-section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg3);
  margin-bottom: 16px;
}

.cs-h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.6vw, 2.2rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.25;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.cs-cap {
  font-size: 15px;
  line-height: 1.75;
  color: var(--fg2);
  max-width: 660px;
}

.cs-cap b {
  color: var(--fg);
  font-weight: 600;
}

/* Single full-bleed proof image */
.figure {
  margin: 32px 0 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border2);
  background: #f4f1ec;
}

.figure img,
.figure video {
  width: 100%;
  display: block;
}

.cap {
  font-size: 13px;
  color: var(--fg3);
  margin-top: 12px;
  letter-spacing: 0.01em;
  max-width: 760px;
}

.cap b {
  color: var(--fg2);
  font-weight: 600;
}

/* Outcome */
.cs-metrics {
  display: flex;
  gap: 1px;
  background: var(--border2);
  border: 1px solid var(--border2);
  border-radius: 12px;
  overflow: hidden;
  margin-top: 24px;
  flex-wrap: wrap;
}

.cs-metric {
  flex: 1 1 160px;
  background: var(--bg);
  padding: 24px 20px;
}

.cs-metric-num {
  font-family: var(--font-display);
  font-size: 2.2rem;
  color: var(--accent);
  line-height: 1;
}

.cs-metric-label {
  font-size: 12.5px;
  color: var(--fg3);
  margin-top: 8px;
}

.cs-callout {
  margin-top: 28px;
  border-left: 2px solid var(--accent);
  padding: 4px 0 4px 20px;
}

.cs-callout p {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.15rem;
  line-height: 1.5;
  color: var(--fg);
}
`;
}

export function generateCvHtml(data: PortfolioData): string {
  const { author } = data;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CV · ${escapeHtml(author.name)}</title>
<meta name="description" content="Curriculum Vitae of ${escapeHtml(author.name)}, ${escapeHtml(author.role)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Tinos:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<style>
.cv-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 100px var(--gutter) 80px;
}
.cv-header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 32px;
  margin-bottom: 40px;
}
.cv-title {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 400;
  margin-bottom: 8px;
}
.cv-subtitle {
  font-size: 15px;
  color: var(--fg2);
}
.cv-section {
  margin-bottom: 48px;
}
.cv-section-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 24px;
}
.cv-item {
  margin-bottom: 28px;
}
.cv-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}
.cv-role {
  font-size: 15px;
  font-weight: 600;
  color: var(--fg);
}
.cv-date {
  font-size: 13px;
  color: var(--fg3);
  font-variant-numeric: tabular-nums;
}
.cv-company {
  font-size: 14px;
  color: var(--fg2);
  margin-bottom: 8px;
}
.cv-desc {
  font-size: 14px;
  color: var(--fg2);
  line-height: 1.6;
}
</style>
</head>
<body>
  <header class="topbar">
    <a class="name" href="index.html">${escapeHtml(author.name)}</a>
    <nav>
      <a href="index.html">Work</a>
      <a href="cv.html" aria-current="page">CV</a>
      <a href="mailto:${escapeHtml(author.email)}" aria-label="Email">Email</a>
    </nav>
  </header>

  <main class="cv-container">
    <div class="cv-header">
      <h1 class="cv-title">${escapeHtml(author.name)}</h1>
      <p class="cv-subtitle">${escapeHtml(author.role)} · London, UK</p>
    </div>

    <section class="cv-section">
      <h2 class="cv-section-title">Experience</h2>
      <div class="cv-item">
        <div class="cv-item-header">
          <div class="cv-role">Founder & Principal Product Designer</div>
          <div class="cv-date">2025 — Present</div>
        </div>
        <div class="cv-company">Oia Health</div>
        <p class="cv-desc">Founded and designed the AI conversational concierge for surgical care across Web and WhatsApp. Designed the zero-form intake pipeline and clinical compliance systems.</p>
      </div>

      <div class="cv-item">
        <div class="cv-item-header">
          <div class="cv-role">Senior Product Designer</div>
          <div class="cv-date">2023 — 2025</div>
        </div>
        <div class="cv-company">VCCP Experience</div>
        <p class="cv-desc">Led health and fintech journeys for Vitality, Pension Buddy, and Cambridge Building Society. Delivered first-ever WCAG 2.1 AA certified experiences and resolved a 40% mobile bounce rate.</p>
      </div>

      <div class="cv-item">
        <div class="cv-item-header">
          <div class="cv-role">Lead Product Designer</div>
          <div class="cv-date">2022 — 2023</div>
        </div>
        <div class="cv-company">Connectd</div>
        <p class="cv-desc">Led tri-sided marketplace design connecting founders, angel syndicates, and advisors. Reduced onboarding drop-off from 58% to 19%.</p>
      </div>
    </section>

    <section class="cv-section">
      <h2 class="cv-section-title">Core Competencies</h2>
      <p class="cv-desc">Product Strategy · 0→1 Design · Systems Architecture · WCAG 2.1 AA Accessibility · Plain Language UX · Conversational UI · Figma Design Systems · Front-end Prototyping.</p>
    </section>
  </main>

  <footer>${escapeHtml(author.name)} &copy; ${author.copyrightYear}</footer>
</body>
</html>`;
}

export function generateGitHubActionsWorkflow(): string {
  return `name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;
}

export function generateReadme(data: PortfolioData): string {
  return `# ${data.author.name} — Portfolio & Studio

Static, zero-dependency editorial portfolio and interactive editing studio hosted directly on **GitHub Pages** (no Vercel, Netlify, or paid third-party servers required).

---

## 🌐 Two Ways to Host on GitHub Pages

### Option 1: Direct GitHub Pages Static Site (Zero Build)
Push the raw HTML/CSS files (\`index.html\`, \`styles.css\`, \`projects/*.html\`).
GitHub Pages immediately serves your static site.

### Option 2: Host the Complete Studio Web App Online
Host this interactive editing application online at \`https://<your-username>.github.io\` via GitHub Actions.
1. Push this entire repository to GitHub.
2. In GitHub repository **Settings > Pages > Source**, select **GitHub Actions**.
3. Every time you push to \`main\`, GitHub builds and deploys your portfolio and online editor automatically!

---

## 🚀 How to Host on GitHub Pages (Step-by-Step)

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. If you want your site at \`https://<your-username>.github.io\`, name the repository exactly:
   \`<your-username>.github.io\`
   *(Or give it any repository name like \`portfolio\` to be served at \`https://<your-username>.github.io/portfolio/\`)*.
3. Keep it **Public** so GitHub Pages is free.

### Step 2: Push Your Files
Extract the downloaded ZIP package and upload all files directly into the repository root:
\`\`\`bash
git init
git add .
git commit -m "Launch new portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
\`\`\`

### Step 3: Turn on GitHub Pages
1. In your GitHub repository, click **Settings** (top tab).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment > Source**, select:
   - **Deploy from a branch**
   - Branch: **main** / folder: **/ (root)**
4. Click **Save**.
5. Your portfolio will be live in 1–2 minutes at your GitHub URL!

---

## ⚡ Direct Browser Publishing (No Terminal Needed)
You can also use the **"Publish Live to GitHub"** tab inside the Studio!
1. Generate a GitHub Personal Access Token at [github.com/settings/tokens](https://github.com/settings/tokens) with \`repo\` or \`contents:write\` permissions.
2. Enter your repository name in the Studio.
3. Click **Publish Directly to GitHub**. The app will push your files straight to GitHub without opening a terminal!

---

## 📁 Repository Directory Structure

\`\`\`
.
├── index.html              # Main Home reel page
├── styles.css              # Universal minimal stylesheet
├── cv.html                 # Minimal CV page
├── portfolio-data.json     # Backup data (can be re-imported into Studio)
├── README.md
├── .github/
│   └── workflows/
│       └── deploy.yml      # Automated GitHub Actions builder
├── projects/
${data.projects.map((p) => `│   ├── ${p.slug}.html`).join('\n')}
└── assets/
    ├── home/               # 4:3 images (1200x900px, <500KB)
    ├── projects/           # Case study proof images/videos
    └── audio/              # Spoken voice narration files (.mp3, mono, <3MB)
\`\`\`

---

## 📐 Media Guidelines for Fast GitHub Pages Loading

- **Images**:
  - Home card thumbnails: \`4:3\` aspect ratio (1200×900px recommended), under 500 KB (WebP or compressed JPG).
  - Case study figures: \`16:9\` or \`4:3\` full-bleed images, under 800 KB.
- **Audio**:
  - Narration: MP3, Mono channel, 96–128 kbps speech bit rate (typically ~1.5 MB for 2 minutes).
- **Video**:
  - MP4 (H.264 + AAC) or WebM, under 10 MB for snappy mobile playback.
`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
