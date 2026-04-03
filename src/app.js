import { renderLanding, initLanding }           from './pages/Landing.js';
import { renderLogin, initLogin, renderSignup, initSignup } from './pages/Auth.js';
import { renderDashboard, initDashboard }       from './pages/Dashboard.js';
import { renderEditor, initEditor }             from './pages/Editor.js';
import { renderPublicPageShell, initPublicPage } from './pages/PublicPage.js';
import { auth } from './utils/helpers.js';

const app = document.getElementById('app');

// ---- ROUTER ----
async function route() {
  const path = window.location.pathname;
  app.innerHTML = '';

  // /p/:slug — public page
  if (path.startsWith('/p/')) {
    const slug = path.slice(3);
    app.innerHTML = renderPublicPageShell();
    await initPublicPage(slug);
    return;
  }

  // /editor/:id — page editor (protected)
  if (path.startsWith('/editor/')) {
    const id = path.slice(8);
    if (!auth.isLoggedIn()) { window.history.replaceState({},'',' /login'); route(); return; }
    app.innerHTML = renderEditor();
    await initEditor(id);
    return;
  }

  switch (path) {
    case '/':
      app.innerHTML = renderLanding();
      initLanding();
      break;

    case '/login':
      if (auth.isLoggedIn()) { window.history.replaceState({},'','/app'); route(); return; }
      app.innerHTML = renderLogin();
      initLogin();
      break;

    case '/signup':
      if (auth.isLoggedIn()) { window.history.replaceState({},'','/app'); route(); return; }
      app.innerHTML = renderSignup();
      initSignup();
      break;

    case '/app':
      if (!auth.isLoggedIn()) { window.history.replaceState({},'','/login'); route(); return; }
      app.innerHTML = renderDashboard();
      await initDashboard();
      break;

    default:
      app.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:16px;text-align:center;padding:40px">
          <div style="font-size:4rem">404</div>
          <h2 style="font-family:var(--font-display);font-size:1.5rem">Page not found</h2>
          <a href="/" style="color:var(--accent-2)">← Go home</a>
        </div>`;
  }

  // Scroll to top on route change
  window.scrollTo(0, 0);
}

// Listen for navigation
window.addEventListener('popstate', route);

// Initial route
route();