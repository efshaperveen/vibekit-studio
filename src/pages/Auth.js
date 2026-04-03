import { renderNavbar, initNavbar } from '../components/Navbar.js';
import { login, signup } from '../utils/api.js';
import { navigate, toast, auth } from '../utils/helpers.js';

function authShell(title, subtitle, formHTML, footerHTML) {
  return `
    ${renderNavbar()}
    <main class="page-content page-enter">
      <div class="auth-wrapper">
        <div class="auth-glow"></div>
        <div class="auth-box">
          <div class="auth-header">
            <div class="logo-mark" style="width:44px;height:44px;font-size:1.1rem;border-radius:12px;margin:0 auto var(--space-4)">V</div>
            <h1 class="display-md">${title}</h1>
            <p class="text-muted">${subtitle}</p>
          </div>
          <form id="auth-form" class="auth-form">
            ${formHTML}
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:var(--space-2)" id="submit-btn">
              <span id="btn-text">Continue</span>
              <div class="spinner" id="btn-spinner" style="display:none"></div>
            </button>
          </form>
          <div class="auth-footer">${footerHTML}</div>
        </div>
      </div>
    </main>
    <style>
      .auth-wrapper {
        min-height: calc(100vh - 61px);
        display: grid;
        place-items: center;
        padding: var(--space-6) var(--space-4);
        position: relative;
      }
      .auth-glow {
        position: fixed;
        top: 30%; left: 50%;
        transform: translate(-50%, -50%);
        width: 500px; height: 500px;
        background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
        pointer-events: none;
      }
      .auth-box {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-xl);
        padding: var(--space-7) var(--space-6);
        width: 100%;
        max-width: 420px;
        position: relative;
      }
      .auth-header { text-align: center; margin-bottom: var(--space-6); }
      .auth-header h1 { margin-bottom: var(--space-2); }
      .auth-form { display: flex; flex-direction: column; gap: var(--space-4); }
      .auth-footer { text-align: center; margin-top: var(--space-5); font-size: 0.88rem; color: var(--text-2); }
      .auth-footer a { color: var(--accent-2); text-decoration: underline; text-underline-offset: 3px; }
      .form-error {
        background: rgba(248,113,113,0.1);
        border: 1px solid rgba(248,113,113,0.25);
        border-radius: var(--radius);
        padding: 10px 14px;
        font-size: 0.85rem;
        color: var(--red);
        display: none;
      }
      @media (max-width: 480px) {
        .auth-box { padding: var(--space-6) var(--space-4); }
      }
    </style>
  `;
}

// ---- LOGIN PAGE ----
export function renderLogin() {
  return authShell(
    'Welcome back',
    'Sign in to your VibeKit account',
    `
      <div id="form-error" class="form-error"></div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" id="email" placeholder="you@example.com" required autocomplete="email"/>
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" class="form-input" id="password" placeholder="••••••••" required autocomplete="current-password"/>
      </div>
    `,
    `Don't have an account? <a href="/signup" id="go-signup">Sign up free</a>`
  );
}

export function initLogin() {
  initNavbar();
  document.getElementById('go-signup')?.addEventListener('click', (e) => { e.preventDefault(); navigate('/signup'); });

  document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errEl    = document.getElementById('form-error');
    const btnText  = document.getElementById('btn-text');
    const spinner  = document.getElementById('btn-spinner');

    errEl.style.display = 'none';
    btnText.textContent = 'Signing in…';
    spinner.style.display = 'block';

    try {
      const data = await login({ email, password });
      auth.save(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      navigate('/app');
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
      btnText.textContent = 'Continue';
      spinner.style.display = 'none';
    }
  });
}

// ---- SIGNUP PAGE ----
export function renderSignup() {
  return authShell(
    'Create account',
    'Start building your first mini-site today',
    `
      <div id="form-error" class="form-error"></div>
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input type="text" class="form-input" id="name" placeholder="Rahul Sharma" required autocomplete="name"/>
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" id="email" placeholder="you@example.com" required autocomplete="email"/>
      </div>
      <div class="form-group">
        <label class="form-label">Password <span class="text-muted">(min 6 chars)</span></label>
        <input type="password" class="form-input" id="password" placeholder="••••••••" required autocomplete="new-password" minlength="6"/>
      </div>
    `,
    `Already have an account? <a href="/login" id="go-login">Sign in</a>`
  );
}

export function initSignup() {
  initNavbar();
  document.getElementById('go-login')?.addEventListener('click', (e) => { e.preventDefault(); navigate('/login'); });

  document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name     = document.getElementById('name').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errEl    = document.getElementById('form-error');
    const btnText  = document.getElementById('btn-text');
    const spinner  = document.getElementById('btn-spinner');

    errEl.style.display = 'none';
    btnText.textContent = 'Creating account…';
    spinner.style.display = 'block';

    try {
      const data = await signup({ name, email, password });
      auth.save(data.token, data.user);
      toast.success(`Welcome to VibeKit, ${data.user.name}! 🎉`);
      navigate('/app');
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
      btnText.textContent = 'Continue';
      spinner.style.display = 'none';
    }
  });
}