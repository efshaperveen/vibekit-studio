import { getPage, updatePage, publishPage, unpublishPage } from '../utils/api.js';
import { navigate, toast, auth } from '../utils/helpers.js';

let pageData = null;
let saveTimer = null;
let isSaving  = false;
let previewMode = 'desktop';

export function renderEditor() {
  return `
    <div class="editor-shell">
      <!-- TOP BAR -->
      <header class="editor-topbar">
        <button class="btn btn-ghost btn-sm" id="back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Dashboard
        </button>
        <div class="editor-title-area">
          <span id="page-title-display" class="editor-page-title">Loading…</span>
          <span id="save-indicator" class="save-indicator">●</span>
        </div>
        <div class="editor-topbar-actions">
          <div class="preview-toggle" id="preview-toggle">
            <button class="ptoggle active" data-mode="desktop" title="Desktop">🖥</button>
            <button class="ptoggle" data-mode="tablet" title="Tablet">📱</button>
            <button class="ptoggle" data-mode="mobile" title="Mobile">📲</button>
          </div>
          <button class="btn btn-secondary btn-sm" id="publish-btn">Publish</button>
        </div>
      </header>

      <div class="editor-body">
        <!-- LEFT: EDITOR PANELS -->
        <aside class="editor-sidebar" id="editor-sidebar">
          <div class="sidebar-loading" id="sidebar-loading">
            <div class="spinner" style="margin:40px auto"></div>
          </div>
          <div id="sidebar-content" style="display:none">
            <!-- Theme Picker -->
            <div class="sidebar-section">
              <div class="sidebar-section-title">🎨 Theme</div>
              <div class="theme-grid" id="theme-grid">
                ${EDITOR_THEMES.map(t => `
                  <button class="theme-btn" data-theme="${t.id}" title="${t.label}"
                    style="background:${t.bg};border:2px solid transparent"
                    data-accent="${t.accent}">
                    <div style="width:60%;height:4px;background:${t.text};border-radius:2px;opacity:0.6;margin-bottom:3px"></div>
                    <div style="width:35%;height:6px;background:${t.accent};border-radius:2px"></div>
                  </button>
                `).join('')}
              </div>
              <div class="current-theme-label" id="current-theme-label">minimal</div>
            </div>

            <!-- Section Order -->
            <div class="sidebar-section">
              <div class="sidebar-section-title">📐 Sections</div>
              <div class="sections-list" id="sections-list"></div>
            </div>

            <!-- Content Editor (tabs) -->
            <div class="sidebar-section" style="flex:1;display:flex;flex-direction:column">
              <div class="sidebar-section-title">✏️ Content</div>
              <div class="section-tabs" id="section-tabs">
                <button class="stab active" data-section="hero">Hero</button>
                <button class="stab" data-section="features">Features</button>
                <button class="stab" data-section="gallery">Gallery</button>
                <button class="stab" data-section="contact">Contact</button>
              </div>
              <div id="section-editors" class="section-editors"></div>
            </div>
          </div>
        </aside>

        <!-- RIGHT: LIVE PREVIEW -->
        <div class="editor-preview-area">
          <div class="preview-frame-wrap" id="preview-frame-wrap">
            <iframe id="preview-frame" class="preview-frame" title="Page Preview"></iframe>
          </div>
        </div>
      </div>
    </div>

    <style>
      .editor-shell { display:flex; flex-direction:column; height:100vh; overflow:hidden; background:var(--bg); }

      /* TOPBAR */
      .editor-topbar {
        height: 56px;
        background: var(--bg-2);
        border-bottom: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--space-4);
        gap: var(--space-3);
        flex-shrink: 0;
        z-index: 10;
      }
      .editor-title-area { display:flex; align-items:center; gap:var(--space-2); flex:1; justify-content:center; overflow:hidden; }
      .editor-page-title { font-family:var(--font-display); font-weight:700; font-size:0.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:300px; }
      .save-indicator { font-size:0.7rem; transition:all 0.3s; }
      .save-indicator.saved { color:var(--green); }
      .save-indicator.saving { color:var(--yellow); animation:pulse 1s infinite; }
      .save-indicator.unsaved { color:var(--text-3); }
      .editor-topbar-actions { display:flex; align-items:center; gap:var(--space-2); }

      /* PREVIEW TOGGLE */
      .preview-toggle { display:flex; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
      .ptoggle { padding:5px 10px; font-size:0.85rem; transition:all 0.2s; color:var(--text-2); }
      .ptoggle.active { background:var(--accent); color:white; }
      .ptoggle:hover:not(.active) { background:var(--surface-2); }

      /* BODY */
      .editor-body { display:flex; flex:1; overflow:hidden; }

      /* SIDEBAR */
      .editor-sidebar {
        width: 300px;
        min-width: 300px;
        background: var(--bg-2);
        border-right: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .sidebar-section { padding: var(--space-4); border-bottom: 1px solid var(--border); }
      .sidebar-section-title { font-size: 0.72rem; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: var(--space-3); }

      /* THEME GRID */
      .theme-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:var(--space-2); margin-bottom:var(--space-2); }
      .theme-btn { height:44px; border-radius:var(--radius); padding:8px; cursor:pointer; display:flex; flex-direction:column; justify-content:center; transition:all 0.2s; }
      .theme-btn.active { border-color:var(--accent) !important; box-shadow:0 0 0 1px var(--accent); }
      .theme-btn:hover { transform:scale(1.04); }
      .current-theme-label { font-family:var(--font-mono); font-size:0.7rem; color:var(--text-3); }

      /* SECTIONS LIST */
      .sections-list { display:flex; flex-direction:column; gap:var(--space-2); }
      .section-row { display:flex; align-items:center; justify-content:space-between; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:8px 10px; }
      .section-row-name { font-size:0.85rem; font-weight:500; text-transform:capitalize; }
      .section-row-btns { display:flex; gap:4px; }
      .section-row-btns button { padding:2px 6px; border-radius:4px; font-size:0.7rem; background:var(--bg-3); color:var(--text-2); border:none; cursor:pointer; }
      .section-row-btns button:hover { background:var(--surface-2); color:var(--text); }

      /* SECTION TABS */
      .section-tabs { display:flex; border-bottom:1px solid var(--border); margin-bottom:var(--space-3); }
      .stab { flex:1; padding:8px 4px; font-size:0.78rem; font-weight:500; color:var(--text-2); border-bottom:2px solid transparent; transition:all 0.2s; }
      .stab.active { color:var(--accent-2); border-bottom-color:var(--accent); }
      .stab:hover:not(.active) { color:var(--text); }

      /* SECTION EDITORS */
      .section-editors { flex:1; overflow-y:auto; padding-right:4px; }
      .editor-field { margin-bottom:var(--space-3); }
      .editor-field label { display:block; font-size:0.72rem; color:var(--text-3); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:var(--space-1); }
      .editor-field input, .editor-field textarea { width:100%; background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-sm); padding:8px 10px; color:var(--text); font-size:0.85rem; outline:none; font-family:var(--font-body); resize:vertical; transition:border-color 0.2s; }
      .editor-field input:focus, .editor-field textarea:focus { border-color:var(--accent); }
      .feature-card-edit { background:var(--bg-3); border-radius:var(--radius); padding:var(--space-3); margin-bottom:var(--space-2); position:relative; }
      .add-btn { display:flex; align-items:center; justify-content:center; gap:4px; width:100%; padding:8px; border:1px dashed var(--border); border-radius:var(--radius); font-size:0.8rem; color:var(--text-3); cursor:pointer; margin-top:var(--space-2); transition:all 0.2s; }
      .add-btn:hover { border-color:var(--accent); color:var(--accent-2); }
      .remove-btn { position:absolute; top:8px; right:8px; font-size:0.7rem; color:var(--red); cursor:pointer; opacity:0.6; }
      .remove-btn:hover { opacity:1; }

      /* PREVIEW */
      .editor-preview-area { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--bg-3); overflow:auto; padding:var(--space-5); gap:var(--space-3); }
      .preview-label { font-size:0.72rem; color:var(--text-3); font-family:var(--font-mono); }
      .preview-frame-wrap { transition:all 0.4s var(--ease); box-shadow:var(--shadow-lg); border-radius:var(--radius-lg); overflow:hidden; background:#fff; }
      .preview-frame-wrap.desktop { width:100%; max-width:1200px; }
      .preview-frame-wrap.tablet  { width:768px; max-width:100%; }
      .preview-frame-wrap.mobile  { width:375px; max-width:100%; }
      .preview-frame { width:100%; height:600px; border:none; display:block; }

      /* RESPONSIVE */
      @media (max-width:900px) {
        .editor-body { flex-direction:column; }
        .editor-sidebar { width:100%; min-width:unset; max-height:50vh; }
        .editor-preview-area { padding:var(--space-3); }
        .preview-frame-wrap.desktop, .preview-frame-wrap.tablet { width:100%; }
        .editor-page-title { max-width:150px; }
      }
    </style>
  `;
}

export async function initEditor(pageId) {
  if (!auth.isLoggedIn()) { navigate('/login'); return; }

  document.getElementById('back-btn')?.addEventListener('click', () => navigate('/app'));

  try {
    const { page } = await getPage(pageId);
    pageData = page;
    initEditorWithData();
  } catch (e) {
    toast.error('Page load nahi ho saki: ' + e.message);
    navigate('/app');
  }
}

function initEditorWithData() {
  // Show UI
  document.getElementById('sidebar-loading').style.display = 'none';
  document.getElementById('sidebar-content').style.display = 'flex';
  document.getElementById('sidebar-content').style.flexDirection = 'column';
  document.getElementById('sidebar-content').style.height = '100%';
  document.getElementById('page-title-display').textContent = pageData.title;

  // Publish button
  const pubBtn = document.getElementById('publish-btn');
  updatePublishBtn(pubBtn);
  pubBtn?.addEventListener('click', () => togglePublish(pubBtn));

  // Theme buttons
  initThemePicker();

  // Section order
  renderSectionOrder();

  // Content tabs
  initSectionTabs();
  renderSectionEditor('hero');

  // Preview
  updatePreview();
  initPreviewToggle();

  setSaveIndicator('saved');
}

// ---- THEME ----
function initThemePicker() {
  document.querySelectorAll('.theme-btn').forEach(btn => {
    if (btn.dataset.theme === pageData.theme?.name) btn.classList.add('active');
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pageData.theme = { ...pageData.theme, name: btn.dataset.theme };
      // Update theme from presets
      const preset = EDITOR_THEMES.find(t => t.id === btn.dataset.theme);
      if (preset) {
        pageData.theme.colors = { background: preset.bg, surface: preset.surface, text: preset.text, accent: preset.accent };
        pageData.theme.borderRadius = preset.radius;
      }
      document.getElementById('current-theme-label').textContent = btn.dataset.theme;
      triggerAutoSave();
      updatePreview();
    });
  });
}

// ---- SECTION ORDER ----
function renderSectionOrder() {
  const list = document.getElementById('sections-list');
  const order = pageData.sections?.order || ['hero','features','gallery','contact'];
  list.innerHTML = order.map((sec, i) => `
    <div class="section-row">
      <span class="section-row-name">${SECTION_ICONS[sec] || '●'} ${sec}</span>
      <div class="section-row-btns">
        <button onclick="moveSection(${i}, -1)" ${i===0?'disabled':''}>↑</button>
        <button onclick="moveSection(${i}, 1)" ${i===order.length-1?'disabled':''}>↓</button>
      </div>
    </div>
  `).join('');
}

window.moveSection = (idx, dir) => {
  const order = [...(pageData.sections?.order || ['hero','features','gallery','contact'])];
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= order.length) return;
  [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
  pageData.sections.order = order;
  renderSectionOrder();
  triggerAutoSave();
  updatePreview();
};

// ---- CONTENT TABS ----
function initSectionTabs() {
  document.querySelectorAll('.stab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderSectionEditor(tab.dataset.section);
    });
  });
}

function renderSectionEditor(section) {
  const el = document.getElementById('section-editors');
  const data = pageData.sections || {};

  if (section === 'hero') {
    const h = data.hero || {};
    el.innerHTML = `
      <div class="editor-field"><label>Heading</label><input id="h-title" value="${esc(h.title||'')}" placeholder="Welcome to My Page"/></div>
      <div class="editor-field"><label>Subtitle</label><textarea id="h-subtitle" rows="2" placeholder="Short tagline...">${esc(h.subtitle||'')}</textarea></div>
      <div class="editor-field"><label>Button Text</label><input id="h-btn-text" value="${esc(h.buttonText||'')}" placeholder="Get Started"/></div>
      <div class="editor-field"><label>Button URL</label><input id="h-btn-url" value="${esc(h.buttonUrl||'')}" placeholder="https://..."/></div>
    `;
    ['h-title','h-subtitle','h-btn-text','h-btn-url'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        pageData.sections.hero = {
          title: document.getElementById('h-title').value,
          subtitle: document.getElementById('h-subtitle').value,
          buttonText: document.getElementById('h-btn-text').value,
          buttonUrl: document.getElementById('h-btn-url').value,
        };
        triggerAutoSave(); updatePreview();
      });
    });
  }

  else if (section === 'features') {
    const cards = data.features?.cards || [];
    const renderCards = () => {
      el.innerHTML = `
        ${cards.map((c, i) => `
          <div class="feature-card-edit">
            <span class="remove-btn" onclick="removeFeature(${i})">✕</span>
            <div class="editor-field"><label>Title</label><input class="fc-title" data-i="${i}" value="${esc(c.title||'')}"/></div>
            <div class="editor-field"><label>Description</label><textarea class="fc-desc" data-i="${i}" rows="2">${esc(c.description||'')}</textarea></div>
          </div>
        `).join('')}
        ${cards.length < 6 ? `<div class="add-btn" onclick="addFeature()">+ Add Feature Card</div>` : ''}
      `;
      el.querySelectorAll('.fc-title').forEach(inp => inp.addEventListener('input', () => {
        cards[inp.dataset.i].title = inp.value;
        pageData.sections.features = { cards };
        triggerAutoSave(); updatePreview();
      }));
      el.querySelectorAll('.fc-desc').forEach(inp => inp.addEventListener('input', () => {
        cards[inp.dataset.i].description = inp.value;
        pageData.sections.features = { cards };
        triggerAutoSave(); updatePreview();
      }));
    };
    window.addFeature = () => { if (cards.length < 6) { cards.push({ title: 'New Feature', description: 'Description here' }); renderCards(); triggerAutoSave(); updatePreview(); } };
    window.removeFeature = (i) => { if (cards.length > 3) { cards.splice(i,1); renderCards(); triggerAutoSave(); updatePreview(); } else toast.error('Minimum 3 cards required'); };
    renderCards();
  }

  else if (section === 'gallery') {
    const images = [...(data.gallery?.images || [])];
    const renderImgs = () => {
      el.innerHTML = `
        ${images.map((url, i) => `
          <div class="feature-card-edit">
            <span class="remove-btn" onclick="removeImg(${i})">✕</span>
            <div class="editor-field"><label>Image URL ${i+1}</label><input class="img-url" data-i="${i}" value="${esc(url)}" placeholder="https://images.unsplash.com/..."/></div>
          </div>
        `).join('')}
        ${images.length < 8 ? `<div class="add-btn" onclick="addImg()">+ Add Image URL</div>` : ''}
      `;
      el.querySelectorAll('.img-url').forEach(inp => inp.addEventListener('input', () => {
        images[inp.dataset.i] = inp.value;
        pageData.sections.gallery = { images: [...images] };
        triggerAutoSave(); updatePreview();
      }));
    };
    window.addImg = () => { if (images.length<8) { images.push(''); renderImgs(); } };
    window.removeImg = (i) => { if (images.length>3) { images.splice(i,1); pageData.sections.gallery={images:[...images]}; renderImgs(); triggerAutoSave(); updatePreview(); } else toast.error('Minimum 3 images'); };
    renderImgs();
  }

  else if (section === 'contact') {
    const c = data.contact || {};
    el.innerHTML = `
      <div class="editor-field"><label>Section Heading</label><input id="c-heading" value="${esc(c.heading||'Get In Touch')}"/></div>
      <div class="editor-field"><label>Subheading</label><input id="c-sub" value="${esc(c.subheading||'')}"/></div>
      <p class="text-xs text-muted" style="margin-top:var(--space-2)">The contact form (Name, Email, Message) is automatically rendered.</p>
    `;
    ['c-heading','c-sub'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        pageData.sections.contact = { heading: document.getElementById('c-heading').value, subheading: document.getElementById('c-sub').value };
        triggerAutoSave(); updatePreview();
      });
    });
  }
}

// ---- SAVE ----
function triggerAutoSave() {
  setSaveIndicator('unsaved');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(doSave, 1200);
}

async function doSave() {
  if (isSaving) return;
  isSaving = true;
  setSaveIndicator('saving');
  try {
    await updatePage(pageData._id, { sections: pageData.sections, theme: pageData.theme });
    setSaveIndicator('saved');
  } catch (e) {
    setSaveIndicator('unsaved');
    toast.error('Save failed: ' + e.message);
  }
  isSaving = false;
}

function setSaveIndicator(state) {
  const el = document.getElementById('save-indicator');
  if (!el) return;
  el.className = `save-indicator ${state}`;
  el.title = state === 'saved' ? 'All changes saved' : state === 'saving' ? 'Saving…' : 'Unsaved changes';
}

// ---- PUBLISH ----
async function togglePublish(btn) {
  const isPublished = pageData.status === 'published';
  try {
    if (isPublished) {
      await unpublishPage(pageData._id);
      pageData.status = 'draft';
      toast.success('Page unpublish ho gayi');
    } else {
      await publishPage(pageData._id);
      pageData.status = 'published';
      toast.success(`Live! /p/${pageData.slug}`);
    }
    updatePublishBtn(btn);
  } catch (e) { toast.error(e.message); }
}

function updatePublishBtn(btn) {
  if (!btn) return;
  if (pageData.status === 'published') {
    btn.className = 'btn btn-danger btn-sm';
    btn.textContent = 'Unpublish';
  } else {
    btn.className = 'btn btn-primary btn-sm';
    btn.textContent = '↗ Publish';
  }
}

// ---- PREVIEW TOGGLE ----
function initPreviewToggle() {
  document.querySelectorAll('.ptoggle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ptoggle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      previewMode = btn.dataset.mode;
      const wrap = document.getElementById('preview-frame-wrap');
      wrap.className = `preview-frame-wrap ${previewMode}`;
    });
  });
}

// ---- PREVIEW ----
function updatePreview() {
  const frame = document.getElementById('preview-frame');
  if (!frame || !pageData) return;
  frame.srcdoc = buildPreviewHTML(pageData);
}

function buildPreviewHTML(page) {
  const t = page.theme || {};
  const colors = t.colors || {};
  const sections = page.sections || {};
  const order = sections.order || ['hero','features','gallery','contact'];
  const hero = sections.hero || {};
  const features = sections.features?.cards || [];
  const images = sections.gallery?.images || [];
  const contact = sections.contact || {};

  const fontMap = {
    'minimal': `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">`,
    'neo-brutal': `<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">`,
    'dark-neon': `<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap" rel="stylesheet">`,
    'pastel': `<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">`,
    'luxury': `<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=EB+Garamond:wght@400;500&display=swap" rel="stylesheet">`,
    'retro': `<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">`,
  };

  const themeName = t.name || 'minimal';
  const radius    = t.borderRadius || '6px';
  const bg        = colors.background || '#fff';
  const surface   = colors.surface    || '#f9f9f9';
  const text      = colors.text       || '#111';
  const accent    = colors.accent     || '#6366f1';

  const sectionHTML = order.map(sec => {
    if (sec === 'hero') return `
      <section style="background:${surface};padding:80px 40px;text-align:center">
        <h1 style="font-size:clamp(2rem,5vw,3.5rem);font-weight:800;margin-bottom:16px;letter-spacing:-0.02em">${esc(hero.title||'Welcome!')}</h1>
        <p style="font-size:1.1rem;opacity:0.7;max-width:520px;margin:0 auto 32px;line-height:1.6">${esc(hero.subtitle||'')}</p>
        ${hero.buttonText ? `<a href="${esc(hero.buttonUrl||'#')}" style="display:inline-block;background:${accent};color:#fff;padding:14px 32px;border-radius:${radius};font-weight:700;font-size:1rem;text-decoration:none">${esc(hero.buttonText)}</a>` : ''}
      </section>
    `;
    if (sec === 'features') return `
      <section style="padding:64px 40px;background:${bg}">
        <h2 style="text-align:center;font-size:2rem;font-weight:800;margin-bottom:40px">Features</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;max-width:900px;margin:0 auto">
          ${features.map(f => `
            <div style="background:${surface};border-radius:${radius};padding:24px;border:1px solid rgba(0,0,0,0.08)">
              <div style="font-weight:700;font-size:1.05rem;margin-bottom:8px">${esc(f.title||'')}</div>
              <div style="opacity:0.6;font-size:0.9rem;line-height:1.6">${esc(f.description||'')}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
    if (sec === 'gallery') return `
      <section style="padding:64px 40px;background:${surface}">
        <h2 style="text-align:center;font-size:2rem;font-weight:800;margin-bottom:40px">Gallery</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;max-width:900px;margin:0 auto">
          ${images.filter(u=>u).map(url => `<img src="${url}" style="width:100%;height:200px;object-fit:cover;border-radius:${radius}" loading="lazy" onerror="this.style.display='none'"/>`).join('')}
        </div>
      </section>
    `;
    if (sec === 'contact') return `
      <section style="padding:64px 40px;background:${bg};text-align:center">
        <h2 style="font-size:2rem;font-weight:800;margin-bottom:12px">${esc(contact.heading||'Contact')}</h2>
        <p style="opacity:0.6;margin-bottom:32px">${esc(contact.subheading||'')}</p>
        <form style="max-width:480px;margin:0 auto;display:flex;flex-direction:column;gap:12px" onsubmit="return false">
          <input placeholder="Your Name" style="padding:12px 16px;border-radius:${radius};border:1px solid rgba(0,0,0,0.15);font-size:1rem;background:${surface};color:${text}"/>
          <input placeholder="Email" type="email" style="padding:12px 16px;border-radius:${radius};border:1px solid rgba(0,0,0,0.15);font-size:1rem;background:${surface};color:${text}"/>
          <textarea placeholder="Message" rows="4" style="padding:12px 16px;border-radius:${radius};border:1px solid rgba(0,0,0,0.15);font-size:1rem;background:${surface};color:${text};resize:vertical"></textarea>
          <button style="background:${accent};color:#fff;padding:12px 24px;border-radius:${radius};border:none;font-weight:700;font-size:1rem;cursor:pointer">Send Message</button>
        </form>
      </section>
    `;
    return '';
  }).join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    ${fontMap[themeName]||fontMap['minimal']}
    <style>*{box-sizing:border-box;margin:0;padding:0}body{background:${bg};color:${text};font-family:${getFontFamily(themeName)}}a{color:inherit}img{max-width:100%}</style>
  </head><body>${sectionHTML}</body></html>`;
}

function getFontFamily(name) {
  const map = { minimal:'Inter,sans-serif', 'neo-brutal':'Space Grotesk,sans-serif', 'dark-neon':'Rajdhani,sans-serif', pastel:'Nunito,sans-serif', luxury:'EB Garamond,serif', retro:'VT323,monospace' };
  return map[name] || 'Inter,sans-serif';
}

function esc(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

const SECTION_ICONS = { hero:'🏠', features:'⭐', gallery:'🖼', contact:'📬' };

const EDITOR_THEMES = [
  { id:'minimal',    label:'Minimal',   bg:'#ffffff', surface:'#f9fafb', text:'#111827', accent:'#6366f1', radius:'6px' },
  { id:'neo-brutal', label:'Neo-Brutal', bg:'#fff7ed', surface:'#ffffff', text:'#000000', accent:'#facc15', radius:'0px' },
  { id:'dark-neon',  label:'Dark Neon',  bg:'#0a0a0a', surface:'#1a1a2e', text:'#e2e8f0', accent:'#00ff88', radius:'4px' },
  { id:'pastel',     label:'Pastel',     bg:'#fdf4ff', surface:'#ffffff', text:'#4a4a68', accent:'#c084fc', radius:'16px' },
  { id:'luxury',     label:'Luxury',     bg:'#0d0d0d', surface:'#1a1a1a', text:'#f5f0e8', accent:'#d4af37', radius:'2px' },
  { id:'retro',      label:'Retro',      bg:'#1a1a2e', surface:'#16213e', text:'#00ff41', accent:'#ff6b6b', radius:'0px' },
];