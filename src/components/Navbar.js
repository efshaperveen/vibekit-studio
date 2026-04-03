import { navigate } from '../utils/helpers.js';
import { auth } from '../utils/helpers.js';
import { logout } from '../utils/api.js';
import { toast } from '../utils/helpers.js';

export function renderNavbar(activePage = 'home') {
  const isLoggedIn = auth.isLoggedIn();
  const user = auth.getUser();

  return `
    <nav class="navbar">
      <div class="navbar-inner">
        <a class="navbar-logo" href="/" data-link>
          <div class="logo-mark">V</div>
          VibeKit
        </a>

        <ul class="navbar-links" id="nav-links">
          ${!isLoggedIn ? `
            <li><a href="/" data-link class="btn btn-ghost btn-sm ${activePage==='home'?'text-accent':''}">Home</a></li>
            <li><a href="/login" data-link class="btn btn-ghost btn-sm">Login</a></li>
            <li><a href="/signup" data-link class="btn btn-primary btn-sm">Get Started</a></li>
          ` : `
            <li><a href="/app" data-link class="btn btn-ghost btn-sm ${activePage==='dashboard'?'text-accent':''}">Dashboard</a></li>
            <li>
              <span class="text-sm text-muted" style="padding:0 8px">
                Hi, ${user?.name?.split(' ')[0] || 'there'} 👋
              </span>
            </li>
            <li>
              <button class="btn btn-ghost btn-sm" id="logout-btn">Logout</button>
            </li>
          `}
        </ul>

        <button class="hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `;
}

export function initNavbar() {
  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logout().catch(() => {});
      auth.clear();
      toast.success('Logout ho gaye!');
      navigate('/');
    });
  }

  // SPA navigation — all [data-link] hrefs
  document.querySelectorAll('[data-link]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks?.classList.remove('open');
      navigate(a.getAttribute('href'));
    });
  });
}