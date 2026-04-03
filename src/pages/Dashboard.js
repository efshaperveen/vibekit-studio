import { renderNavbar, initNavbar } from '../components/Navbar.js';
import { getPages, createPage, duplicatePage } from '../utils/api.js';
import { navigate, toast, auth } from '../utils/helpers.js';

export function renderDashboard() {
  const user = auth.getUser();
  return `
    ${renderNavbar('dashboard')}
    <main class="page-content page-enter">
      <div class="container" style="padding-top:var(--space-7);padding-bottom:var(--space-9)">
        <div class="dash-header">
          <div>
            <h1 class="display-md">Your Pages</h1>
            <p class="text-muted" style="margin-top:var(--space-2)">Create, edit, and publish your mini-sites</p>
          </div>
          <button class="btn btn-primary" id="new-page-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            New Page
          </button>
        </div>

        <div id="pages-area">
          <div class="pages-loading">
            ${[1,2,3].map(() => `
              <div class="page-card-skeleton">
                <div class="skeleton" style="height:20px;width:60%;border-radius:6px"></div>
                <div class="skeleton" style="height:14px;width:30%;border-radius:4px;margin-top:8px"></div>
                <div style="display:flex;gap:8px;margin-top:20px">
                  <div class="skeleton" style="height:32px;width:80px;border-radius:8px"></div>
                  <div class="skeleton" style="height:32px;width:80px;border-radius:8px"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </main>

    <!-- NEW PAGE MODAL -->
    <div id="new-page-modal" style="display:none">
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-5)">
            <h2 style="font-size:1.3rem;font-family:var(--font-display);font-weight:700">Create New Page</h2>
            <button class="btn btn-icon btn-ghost" id="close-modal">✕</button>
          </div>
          <div class="form-group" style="margin-bottom:var(--space-4)">
            <label class="form-label">Page Title</label>
            <input type="text" class="form-input" id="new-page-title" placeholder="My Awesome Portfolio" />
          </div>
          <div class="form-group" style="margin-bottom:var(--space-5)">
            <label class="form-label">Choose a Theme</label>
            <div class="theme-picker" id="theme-picker">
              ${THEMES.map(t => `
                <div class="theme-option ${t.id === 'minimal' ? 'selected' : ''}" data-theme="${t.id}">
                  <div class="theme-swatch" style="background:${t.bg};border:2px solid ${t.id==='minimal'?'var(--accent)':'transparent'}">
                    <div style="width:50%;height:6px;background:${t.text};border-radius:2px;margin-bottom:4px;opacity:0.7"></div>
                    <div style="width:30%;height:8px;background:${t.accent};border-radius:2px"></div>
                  </div>
                  <span class="theme-option-name">${t.label}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div style="display:flex;gap:var(--space-3);justify-content:flex-end">
            <button class="btn btn-secondary" id="cancel-modal">Cancel</button>
            <button class="btn btn-primary" id="create-page-btn">
              <span id="create-btn-text">Create Page</span>
              <div class="spinner" id="create-spinner" style="display:none"></div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <style>
      .dash-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-6);
        flex-wrap: wrap;
        gap: var(--space-4);
      }
      .pages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--space-4);
      }
      .page-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
        transition: all 0.25s var(--ease);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .page-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow); }
      .page-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
      .page-title { font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; line-height: 1.3; }
      .page-slug { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-3); }
      .page-meta { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
      .page-theme-tag {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--text-3);
        background: var(--bg-3);
        padding: 2px 8px;
        border-radius: var(--radius-full);
      }
      .page-card-actions { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: auto; padding-top: var(--space-2); border-top: 1px solid var(--border); }
      .pages-loading { display: flex; flex-direction: column; gap: var(--space-4); }
      .page-card-skeleton {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
      }
      .views-count { font-size: 0.75rem; color: var(--text-3); display: flex; align-items: center; gap: 4px; }

      /* THEME PICKER */
      .theme-picker { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); }
      .theme-option { display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
      .theme-swatch {
        height: 56px;
        border-radius: var(--radius);
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        transition: all 0.2s;
      }
      .theme-option.selected .theme-swatch { border-color: var(--accent) !important; box-shadow: 0 0 0 1px var(--accent); }
      .theme-option-name { font-size: 0.72rem; color: var(--text-2); text-align: center; font-family: var(--font-mono); }

      @media (max-width: 600px) {
        .pages-grid { grid-template-columns: 1fr; }
        .theme-picker { grid-template-columns: repeat(2, 1fr); }
      }
    </style>
  `;
}

export async function initDashboard() {
  if (!auth.isLoggedIn()) { navigate('/login'); return; }
  initNavbar();
  await loadPages();
  initNewPageModal();
}

async function loadPages() {
  const area = document.getElementById('pages-area');
  try {
    const { pages } = await getPages();
    if (!pages || pages.length === 0) {
      area.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📄</div>
          <h3 style="font-family:var(--font-display);font-weight:700">No pages yet</h3>
          <p class="text-muted">Create your first mini-site to get started!</p>
          <button class="btn btn-primary" id="empty-new-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Create your first page
          </button>
        </div>
      `;
      document.getElementById('empty-new-btn')?.addEventListener('click', () => openModal());
      return;
    }

    area.innerHTML = `<div class="pages-grid">${pages.map(pageCard).join('')}</div>`;

    pages.forEach(p => {
      document.getElementById(`edit-${p._id}`)?.addEventListener('click', () => navigate(`/editor/${p._id}`));
      document.getElementById(`dup-${p._id}`)?.addEventListener('click', () => dupPage(p._id));
      document.getElementById(`view-${p._id}`)?.addEventListener('click', () => window.open(`/p/${p.slug}`, '_blank'));
    });
  } catch (e) {
    area.innerHTML = `<div class="empty-state"><p class="text-red">Pages load nahi ho sakeen: ${e.message}</p></div>`;
  }
}

function pageCard(p) {
  const isPublished = p.status === 'published';
  return `
    <div class="page-card">
      <div class="page-card-top">
        <div>
          <div class="page-title">${p.title}</div>
          <div class="page-slug">/p/${p.slug}</div>
        </div>
        <span class="badge ${isPublished ? 'badge-published' : 'badge-draft'} badge-dot">
          ${isPublished ? 'Live' : 'Draft'}
        </span>
      </div>
      <div class="page-meta">
        <span class="page-theme-tag">${p['theme.name'] || p.theme?.name || 'minimal'}</span>
        ${isPublished ? `<span class="views-count">👁 ${p.viewCount || 0} views</span>` : ''}
        <span class="text-xs text-muted">${timeAgo(p.updatedAt)}</span>
      </div>
      <div class="page-card-actions">
        <button class="btn btn-secondary btn-sm" id="edit-${p._id}">
          ✏️ Edit
        </button>
        <button class="btn btn-secondary btn-sm" id="dup-${p._id}">
          ⧉ Clone
        </button>
        ${isPublished ? `<button class="btn btn-secondary btn-sm" id="view-${p._id}">↗ View</button>` : ''}
      </div>
    </div>
  `;
}

async function dupPage(id) {
  try {
    await duplicatePage(id);
    toast.success('Page clone ho gayi!');
    await loadPages();
  } catch (e) {
    toast.error(e.message);
  }
}

function initNewPageModal() {
  const modal = document.getElementById('new-page-modal');
  const openModal = () => { modal.style.display = 'block'; document.getElementById('new-page-title')?.focus(); };

  document.getElementById('new-page-btn')?.addEventListener('click', openModal);
  document.getElementById('close-modal')?.addEventListener('click', () => modal.style.display = 'none');
  document.getElementById('cancel-modal')?.addEventListener('click', () => modal.style.display = 'none');
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') modal.style.display = 'none';
  });

  let selectedTheme = 'minimal';
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.theme-option').forEach(o => {
        o.classList.remove('selected');
        o.querySelector('.theme-swatch').style.borderColor = 'transparent';
      });
      opt.classList.add('selected');
      selectedTheme = opt.dataset.theme;
    });
  });

  document.getElementById('create-page-btn')?.addEventListener('click', async () => {
    const title = document.getElementById('new-page-title').value.trim();
    if (!title) { toast.error('Page ka title daalo!'); return; }
    document.getElementById('create-btn-text').textContent = 'Creating…';
    document.getElementById('create-spinner').style.display = 'block';
    try {
      const { page } = await createPage({ title, theme: selectedTheme });
      toast.success('Page ban gayi!');
      modal.style.display = 'none';
      navigate(`/editor/${page.id}`);
    } catch (e) {
      toast.error(e.message);
      document.getElementById('create-btn-text').textContent = 'Create Page';
      document.getElementById('create-spinner').style.display = 'none';
    }
  });
}

window.openModal = () => document.getElementById('new-page-modal').style.display = 'block';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs/24)}d ago`;
}

const THEMES = [
  { id: 'minimal',    label: 'Minimal',   bg: '#ffffff', text: '#111', accent: '#6366f1' },
  { id: 'neo-brutal', label: 'Neo-Brutal', bg: '#fff7ed', text: '#000', accent: '#facc15' },
  { id: 'dark-neon',  label: 'Dark Neon',  bg: '#0a0a0a', text: '#e2e8f0', accent: '#00ff88' },
  { id: 'pastel',     label: 'Pastel',     bg: '#fdf4ff', text: '#4a4a68', accent: '#c084fc' },
  { id: 'luxury',     label: 'Luxury',     bg: '#0d0d0d', text: '#f5f0e8', accent: '#d4af37' },
  { id: 'retro',      label: 'Retro',      bg: '#1a1a2e', text: '#00ff41', accent: '#ff6b6b' },
];