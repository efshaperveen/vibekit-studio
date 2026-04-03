import { getPublicPage, trackView, submitContact } from '../utils/api.js';
import { toast } from '../utils/helpers.js';

export function renderPublicPageShell() {
  return `
    <div id="public-page-root">
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:16px">
        <div class="spinner" style="width:32px;height:32px;border-width:3px"></div>
        <p style="color:var(--text-2);font-size:0.9rem">Loading page…</p>
      </div>
    </div>
  `;
}

export async function initPublicPage(slug) {
  try {
    const { page } = await getPublicPage(slug);
    document.title = `${page.title} — VibeKit`;
    renderPage(page);
    // Track view (fire and forget)
    trackView(slug).catch(() => {});
  } catch (e) {
    document.getElementById('public-page-root').innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:16px;text-align:center;padding:40px">
        <div style="font-size:4rem">🌫️</div>
        <h1 style="font-family:var(--font-display);font-size:2rem">Page Not Found</h1>
        <p style="color:var(--text-2)">This page doesn't exist or hasn't been published yet.</p>
        <a href="/" style="display:inline-block;background:var(--accent);color:white;padding:12px 28px;border-radius:var(--radius);font-weight:600;margin-top:8px">Go Home</a>
      </div>
    `;
  }
}

function renderPage(page) {
  const t      = page.theme || {};
  const colors = t.colors  || {};
  const order  = page.sections?.order || ['hero','features','gallery','contact'];
  const hero    = page.sections?.hero    || {};
  const features= page.sections?.features?.cards || [];
  const images  = page.sections?.gallery?.images || [];
  const contact = page.sections?.contact || {};

  const bg      = colors.background || '#ffffff';
  const surface = colors.surface    || '#f9fafb';
  const text    = colors.text       || '#111827';
  const accent  = colors.accent     || '#6366f1';
  const radius  = t.borderRadius    || '6px';
  const themeName = t.name || 'minimal';

  const fontLinks = {
    'minimal':    `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`,
    'neo-brutal': `<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">`,
    'dark-neon':  `<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap" rel="stylesheet">`,
    'pastel':     `<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet">`,
    'luxury':     `<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=EB+Garamond:wght@400;500&display=swap" rel="stylesheet">`,
    'retro':      `<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">`,
  };

  const fontBody = { minimal:'Inter,sans-serif', 'neo-brutal':'Space Grotesk,sans-serif', 'dark-neon':'Rajdhani,sans-serif', pastel:'Nunito,sans-serif', luxury:'EB Garamond,serif', retro:'VT323,monospace' };
  const fontHead = { minimal:'Inter,sans-serif', 'neo-brutal':'Space Grotesk,sans-serif', 'dark-neon':'Orbitron,sans-serif', pastel:'Nunito,sans-serif', luxury:'Cormorant Garamond,serif', retro:'Press Start 2P,monospace' };

  const sectionHTML = order.map(sec => {
    if (sec === 'hero') return `
      <section class="pub-hero">
        <h1 class="pub-h1">${esc(hero.title || 'Welcome!')}</h1>
        <p class="pub-sub">${esc(hero.subtitle || '')}</p>
        ${hero.buttonText ? `<a href="${esc(hero.buttonUrl||'#')}" class="pub-btn">${esc(hero.buttonText)}</a>` : ''}
      </section>`;

    if (sec === 'features') return `
      <section class="pub-section">
        <h2 class="pub-h2">Features</h2>
        <div class="pub-cards-grid">
          ${features.map(f => `
            <div class="pub-card">
              <div class="pub-card-title">${esc(f.title||'')}</div>
              <div class="pub-card-desc">${esc(f.description||'')}</div>
            </div>`).join('')}
        </div>
      </section>`;

    if (sec === 'gallery') return `
      <section class="pub-section pub-section-alt">
        <h2 class="pub-h2">Gallery</h2>
        <div class="pub-gallery-grid">
          ${images.filter(u=>u).map(url =>
            `<img src="${esc(url)}" class="pub-gallery-img" loading="lazy" onerror="this.style.display='none'" alt=""/>`
          ).join('')}
        </div>
      </section>`;

    if (sec === 'contact') return `
      <section class="pub-section" id="contact-section">
        <h2 class="pub-h2">${esc(contact.heading||'Get In Touch')}</h2>
        <p class="pub-sub" style="margin-bottom:32px">${esc(contact.subheading||'')}</p>
        <form class="pub-form" id="pub-contact-form">
          <input type="text" name="name" placeholder="Your Name" class="pub-input" required/>
          <input type="email" name="email" placeholder="Email Address" class="pub-input" required/>
          <textarea name="message" placeholder="Your message…" class="pub-input pub-textarea" rows="4" required></textarea>
          <button type="submit" class="pub-btn" id="pub-submit-btn">Send Message</button>
          <div id="form-success" style="display:none;color:#34d399;margin-top:8px;font-size:0.9rem">✓ Message sent! We'll get back to you.</div>
          <div id="form-error-pub" style="display:none;color:#f87171;margin-top:8px;font-size:0.9rem"></div>
        </form>
      </section>`;
    return '';
  }).join('');

  const navStyle = themeName === 'dark-neon' ? 'box-shadow:0 0 20px rgba(0,255,136,0.1)' : '';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>${esc(page.title)}</title>
      ${fontLinks[themeName]||fontLinks['minimal']}
      <style>
        :root {
          --bg:${bg};--surface:${surface};--text:${text};--accent:${accent};
          --radius:${radius};--font-body:${fontBody[themeName]||'Inter,sans-serif'};
          --font-head:${fontHead[themeName]||'Inter,sans-serif'};
        }
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:var(--bg);color:var(--text);font-family:var(--font-body);-webkit-font-smoothing:antialiased}
        a{color:inherit;text-decoration:none}
        img{max-width:100%;display:block}

        /* NAV */
        .pub-nav{position:sticky;top:0;z-index:100;background:var(--bg);border-bottom:1px solid rgba(0,0,0,0.08);padding:0 40px;${navStyle}}
        .pub-nav-inner{max-width:1100px;margin:0 auto;height:60px;display:flex;align-items:center;justify-content:space-between}
        .pub-logo{font-family:var(--font-head);font-weight:700;font-size:1.1rem;letter-spacing:-0.02em}
        .pub-views{font-size:0.8rem;opacity:0.5}

        /* HERO */
        .pub-hero{background:var(--surface);padding:clamp(60px,10vw,120px) 40px;text-align:center}
        .pub-h1{font-family:var(--font-head);font-size:clamp(2rem,6vw,4rem);font-weight:800;letter-spacing:-0.03em;margin-bottom:16px;line-height:1.1}
        .pub-sub{font-size:clamp(1rem,2vw,1.2rem);opacity:0.65;max-width:540px;margin:0 auto;line-height:1.7}
        .pub-btn{display:inline-block;background:var(--accent);color:#fff;padding:14px 32px;border-radius:var(--radius);font-weight:700;font-size:1rem;margin-top:32px;border:none;cursor:pointer;font-family:var(--font-body);transition:opacity 0.2s,transform 0.2s}
        .pub-btn:hover{opacity:0.88;transform:translateY(-2px)}
        ${themeName==='neo-brutal'?'.pub-btn{border:2px solid #000;color:#000;box-shadow:3px 3px 0 #000}.pub-btn:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 #000}':''}
        ${themeName==='dark-neon'?'.pub-btn{box-shadow:0 0 20px rgba(0,255,136,0.4)}.pub-btn:hover{box-shadow:0 0 30px rgba(0,255,136,0.6)}':''}
        ${themeName==='luxury'?'.pub-btn{background:transparent;border:1px solid var(--accent);color:var(--accent)}':''}

        /* SECTIONS */
        .pub-section{padding:clamp(48px,8vw,96px) 40px;background:var(--bg)}
        .pub-section-alt{background:var(--surface)}
        .pub-h2{font-family:var(--font-head);font-size:clamp(1.6rem,4vw,2.5rem);font-weight:800;letter-spacing:-0.02em;text-align:center;margin-bottom:clamp(24px,4vw,48px)}

        /* FEATURES */
        .pub-cards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;max-width:1000px;margin:0 auto}
        .pub-card{background:var(--surface);border-radius:var(--radius);padding:28px;border:1px solid rgba(0,0,0,0.07);transition:transform 0.2s,box-shadow 0.2s}
        .pub-card:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(0,0,0,0.12)}
        ${themeName==='neo-brutal'?'.pub-card{border:2px solid #000;box-shadow:4px 4px 0 #000}.pub-card:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #000}':''}
        ${themeName==='dark-neon'?'.pub-card{border-color:rgba(0,255,136,0.15)}.pub-card:hover{box-shadow:0 0 20px rgba(0,255,136,0.1)}':''}
        .pub-card-title{font-family:var(--font-head);font-weight:700;font-size:1.05rem;margin-bottom:10px}
        .pub-card-desc{opacity:0.65;line-height:1.65;font-size:0.92rem}

        /* GALLERY */
        .pub-gallery-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;max-width:1000px;margin:0 auto}
        .pub-gallery-img{width:100%;height:220px;object-fit:cover;border-radius:var(--radius)}

        /* CONTACT FORM */
        .pub-form{max-width:520px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
        .pub-input{padding:13px 16px;border-radius:var(--radius);border:1px solid rgba(0,0,0,0.12);font-size:1rem;font-family:var(--font-body);background:var(--surface);color:var(--text);outline:none;transition:border-color 0.2s}
        .pub-input:focus{border-color:var(--accent)}
        .pub-textarea{resize:vertical}

        /* FOOTER */
        .pub-footer{padding:24px 40px;border-top:1px solid rgba(0,0,0,0.07);text-align:center;font-size:0.8rem;opacity:0.4}

        /* RESPONSIVE */
        @media(max-width:768px){
          .pub-hero,.pub-section{padding-left:20px;padding-right:20px}
          .pub-nav{padding:0 20px}
          .pub-cards-grid,.pub-gallery-grid{grid-template-columns:1fr}
          .pub-gallery-img{height:180px}
        }
        @media(max-width:480px){
          .pub-hero{padding:48px 16px}
          .pub-section{padding:40px 16px}
          .pub-nav{padding:0 16px}
          .pub-btn{width:100%;text-align:center}
        }

        /* ANIMATIONS */
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .pub-hero{animation:fadeUp 0.6s ease}
        .pub-card{animation:fadeUp 0.5s ease both}
      </style>
    </head>
    <body>
      <nav class="pub-nav">
        <div class="pub-nav-inner">
          <div class="pub-logo">${esc(page.title)}</div>
          <div class="pub-views" id="pub-view-count">${page.viewCount || 0} views</div>
        </div>
      </nav>
      ${sectionHTML}
      <footer class="pub-footer">Made with VibeKit Studio</footer>
      <script>
        const slug = ${JSON.stringify(slug)};
        document.getElementById('pub-contact-form')?.addEventListener('submit', async (e) => {
          e.preventDefault();
          const btn = document.getElementById('pub-submit-btn');
          btn.textContent = 'Sending…';
          btn.disabled = true;
          const fd = new FormData(e.target);
          try {
            const res = await fetch('/api/public/contact?slug='+slug, {
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ name:fd.get('name'), email:fd.get('email'), message:fd.get('message') })
            });
            const data = await res.json();
            if (data.success) {
              document.getElementById('form-success').style.display = 'block';
              e.target.reset();
            } else {
              document.getElementById('form-error-pub').textContent = data.error;
              document.getElementById('form-error-pub').style.display = 'block';
            }
          } catch { document.getElementById('form-error-pub').textContent = 'Error sending. Try again.'; document.getElementById('form-error-pub').style.display='block'; }
          btn.textContent = 'Send Message';
          btn.disabled = false;
        });
      <\/script>
    </body>
    </html>
  `;

  // Replace the loading screen with full page
  document.getElementById('public-page-root').outerHTML = html.trim().replace(/^<!DOCTYPE html>[\s\S]*?<body>/, '').replace(/<\/body>[\s\S]*$/, '');
  // Better: replace document entirely
  document.open();
  document.write(html);
  document.close();
}

function esc(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}