import { renderNavbar, initNavbar } from '../components/Navbar.js';
import { navigate } from '../utils/helpers.js';
import { auth } from '../utils/helpers.js';

export function renderLanding() {
  return `
    ${renderNavbar('home')}
    <main class="page-content page-enter">

      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="hero-bg-grid"></div>
        <div class="hero-glow"></div>
        <div class="container">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-dot-pulse"></span>
              Now in Beta — Build for Free
            </div>
            <h1 class="display-xl hero-title">
              Generate a <span class="gradient-text">vibe.</span><br>
              Build a site.<br>
              Publish it.
            </h1>
            <p class="hero-sub">
              VibeKit Studio lets you pick a design theme, fill in your content,
              and get a beautiful public URL — in under 5 minutes.
            </p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-lg hero-cta" id="hero-cta">
                Create your first page
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <a href="#themes" class="btn btn-secondary btn-lg">See themes</a>
            </div>
            <div class="hero-stats">
              <div class="stat"><span class="stat-num">6</span><span class="stat-label">Vibe Themes</span></div>
              <div class="stat-divider"></div>
              <div class="stat"><span class="stat-num">∞</span><span class="stat-label">Pages</span></div>
              <div class="stat-divider"></div>
              <div class="stat"><span class="stat-num">Free</span><span class="stat-label">Forever</span></div>
            </div>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="how-section">
        <div class="container">
          <div class="section-label">How it works</div>
          <h2 class="display-md" style="margin-bottom:var(--space-7)">Three steps to live</h2>
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-num">01</div>
              <h3>Pick your vibe</h3>
              <p class="text-muted">Choose from 6 stunning design themes — from dark neon to pastel soft.</p>
            </div>
            <div class="step-connector">→</div>
            <div class="step-card">
              <div class="step-num">02</div>
              <h3>Fill your content</h3>
              <p class="text-muted">Add your hero text, features, gallery images, and contact form. Live preview as you type.</p>
            </div>
            <div class="step-connector">→</div>
            <div class="step-card">
              <div class="step-num">03</div>
              <h3>Publish & share</h3>
              <p class="text-muted">Hit publish. Get a public URL instantly. Share it anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- THEMES SHOWCASE -->
      <section class="themes-section" id="themes">
        <div class="container">
          <div class="section-label">Design themes</div>
          <h2 class="display-md">Find your vibe</h2>
          <p class="text-muted text-lg" style="margin:var(--space-3) 0 var(--space-7)">
            Every theme is a complete design system — colors, typography, spacing.
          </p>
          <div class="themes-grid">
            ${THEME_PREVIEWS.map(t => `
              <div class="theme-card" style="--t-bg:${t.bg};--t-surface:${t.surface};--t-text:${t.text};--t-accent:${t.accent}">
                <div class="theme-preview">
                  <div class="tp-nav">
                    <div class="tp-logo" style="background:${t.accent}"></div>
                    <div class="tp-nav-links">
                      <div class="tp-link"></div>
                      <div class="tp-link"></div>
                      <div class="tp-btn" style="background:${t.accent}"></div>
                    </div>
                  </div>
                  <div class="tp-hero">
                    <div class="tp-heading" style="background:${t.text}"></div>
                    <div class="tp-sub" style="background:${t.text};opacity:0.4"></div>
                    <div class="tp-cta" style="background:${t.accent};border-radius:${t.radius}"></div>
                  </div>
                  <div class="tp-cards">
                    ${[1,2,3].map(()=>`<div class="tp-card" style="background:${t.surface};border-radius:${t.radius}"></div>`).join('')}
                  </div>
                </div>
                <div class="theme-info">
                  <span class="theme-name">${t.name}</span>
                  <span class="theme-tag">${t.tag}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- CTA SECTION -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-box">
            <div class="cta-glow"></div>
            <div class="cta-content">
              <h2 class="display-md">Ready to build?</h2>
              <p class="text-muted text-lg">Create your account — it's free. No credit card needed.</p>
              <button class="btn btn-primary btn-lg" id="cta-bottom">
                Start building for free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="container">
          <div class="footer-inner">
            <div class="navbar-logo">
              <div class="logo-mark">V</div>
              VibeKit Studio
            </div>
            <p class="text-muted text-sm">Built for Purple Merit Technologies Assessment</p>
          </div>
        </div>
      </footer>
    </main>

    <style>
      /* HERO */
      .hero-section {
        position: relative;
        min-height: 90vh;
        display: flex;
        align-items: center;
        overflow: hidden;
        padding: var(--space-10) 0 var(--space-9);
      }
      .hero-bg-grid {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(var(--border) 1px, transparent 1px),
                          linear-gradient(90deg, var(--border) 1px, transparent 1px);
        background-size: 40px 40px;
        mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 40%, transparent 100%);
        opacity: 0.5;
      }
      .hero-glow {
        position: absolute;
        top: -200px; left: 50%;
        transform: translateX(-50%);
        width: 600px; height: 600px;
        background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
        pointer-events: none;
      }
      .hero-content {
        position: relative;
        max-width: 780px;
        animation: heroIn 0.8s var(--ease) both;
      }
      @keyframes heroIn {
        from { opacity:0; transform: translateY(30px); }
        to   { opacity:1; transform: translateY(0); }
      }
      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-full);
        padding: 6px 14px;
        font-size: 0.8rem;
        font-weight: 500;
        margin-bottom: var(--space-5);
        color: var(--text-2);
      }
      .badge-dot-pulse {
        width: 7px; height: 7px;
        background: var(--green);
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0%,100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
        50% { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
      }
      .hero-title {
        margin-bottom: var(--space-5);
        animation: heroIn 0.8s 0.1s var(--ease) both;
      }
      .gradient-text {
        background: linear-gradient(135deg, var(--accent) 0%, #c084fc 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .hero-sub {
        font-size: clamp(1rem, 2vw, 1.2rem);
        color: var(--text-2);
        max-width: 540px;
        line-height: 1.7;
        margin-bottom: var(--space-6);
        animation: heroIn 0.8s 0.2s var(--ease) both;
      }
      .hero-actions {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-bottom: var(--space-7);
        flex-wrap: wrap;
        animation: heroIn 0.8s 0.3s var(--ease) both;
      }
      .hero-stats {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        animation: heroIn 0.8s 0.4s var(--ease) both;
      }
      .stat { display: flex; flex-direction: column; gap: 2px; }
      .stat-num { font-family: var(--font-display); font-weight: 800; font-size: 1.5rem; }
      .stat-label { font-size: 0.75rem; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.05em; }
      .stat-divider { width: 1px; height: 36px; background: var(--border); }

      /* HOW IT WORKS */
      .how-section { padding: var(--space-10) 0; }
      .section-label {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--accent-2);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: var(--space-3);
      }
      .steps-grid {
        display: grid;
        grid-template-columns: 1fr auto 1fr auto 1fr;
        gap: var(--space-4);
        align-items: center;
      }
      .step-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        transition: all 0.3s var(--ease);
      }
      .step-card:hover {
        border-color: var(--accent);
        box-shadow: var(--shadow-accent);
        transform: translateY(-4px);
      }
      .step-num {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--accent-2);
        letter-spacing: 0.1em;
        margin-bottom: var(--space-3);
      }
      .step-card h3 { font-size: 1.1rem; margin-bottom: var(--space-2); }
      .step-connector { font-size: 1.5rem; color: var(--text-3); }

      /* THEMES */
      .themes-section { padding: var(--space-9) 0; }
      .themes-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-4);
      }
      .theme-card {
        border-radius: var(--radius-lg);
        overflow: hidden;
        border: 1px solid var(--border);
        transition: all 0.3s var(--ease);
        cursor: pointer;
      }
      .theme-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); border-color: var(--border-hover); }
      .theme-preview {
        background: var(--t-bg);
        padding: 16px;
        height: 180px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .tp-nav { display: flex; align-items: center; justify-content: space-between; }
      .tp-logo { width: 16px; height: 16px; border-radius: 4px; }
      .tp-nav-links { display: flex; align-items: center; gap: 6px; }
      .tp-link { width: 24px; height: 6px; background: var(--t-text); opacity: 0.3; border-radius: 3px; }
      .tp-btn { width: 32px; height: 14px; border-radius: 3px; }
      .tp-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
      .tp-heading { height: 10px; width: 70%; background: var(--t-text); border-radius: 4px; }
      .tp-sub { height: 7px; width: 50%; border-radius: 3px; }
      .tp-cta { height: 18px; width: 80px; }
      .tp-cards { display: flex; gap: 6px; }
      .tp-card { flex: 1; height: 28px; border: 1px solid rgba(255,255,255,0.05); }
      .theme-info { padding: 12px 16px; background: var(--surface); display: flex; justify-content: space-between; align-items: center; }
      .theme-name { font-family: var(--font-display); font-weight: 600; font-size: 0.9rem; }
      .theme-tag { font-size: 0.72rem; color: var(--text-3); font-family: var(--font-mono); }

      /* CTA SECTION */
      .cta-section { padding: var(--space-9) 0 var(--space-10); }
      .cta-box {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-xl);
        padding: var(--space-9) var(--space-8);
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      .cta-glow {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 400px; height: 400px;
        background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
        pointer-events: none;
      }
      .cta-content { position: relative; display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }

      /* FOOTER */
      .footer { border-top: 1px solid var(--border); padding: var(--space-5) 0; }
      .footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3); }

      /* RESPONSIVE */
      @media (max-width: 900px) {
        .themes-grid { grid-template-columns: repeat(2, 1fr); }
        .steps-grid { grid-template-columns: 1fr; }
        .step-connector { display: none; }
      }
      @media (max-width: 600px) {
        .themes-grid { grid-template-columns: 1fr; }
        .hero-section { padding-top: var(--space-8); }
        .hero-actions { flex-direction: column; align-items: flex-start; }
        .hero-actions .btn { width: 100%; justify-content: center; }
        .footer-inner { flex-direction: column; text-align: center; }
      }
    </style>
  `;
}

export function initLanding() {
  initNavbar();

  const goCreate = () => {
    if (auth.isLoggedIn()) navigate('/app');
    else navigate('/signup');
  };

  document.getElementById('hero-cta')?.addEventListener('click', goCreate);
  document.getElementById('cta-bottom')?.addEventListener('click', goCreate);

  // Smooth scroll to themes
  document.querySelector('a[href="#themes"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('themes')?.scrollIntoView({ behavior: 'smooth' });
  });
}

const THEME_PREVIEWS = [
  { name: 'Minimal', tag: 'Editorial', bg: '#ffffff', surface: '#f9fafb', text: '#111827', accent: '#6366f1', radius: '6px' },
  { name: 'Neo-Brutal', tag: 'Bold', bg: '#fff7ed', surface: '#ffffff', text: '#000000', accent: '#facc15', radius: '0px' },
  { name: 'Dark Neon', tag: 'Cyberpunk', bg: '#0a0a0a', surface: '#1a1a2e', text: '#e2e8f0', accent: '#00ff88', radius: '4px' },
  { name: 'Pastel', tag: 'Soft & Dreamy', bg: '#fdf4ff', surface: '#ffffff', text: '#4a4a68', accent: '#c084fc', radius: '16px' },
  { name: 'Luxury', tag: 'Premium', bg: '#0d0d0d', surface: '#1a1a1a', text: '#f5f0e8', accent: '#d4af37', radius: '2px' },
  { name: 'Retro', tag: 'Pixel / 8-bit', bg: '#1a1a2e', surface: '#16213e', text: '#00ff41', accent: '#ff6b6b', radius: '0px' },
];