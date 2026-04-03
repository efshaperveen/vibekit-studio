export const navigate = (path) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export const getPath = () => window.location.pathname;



// src/utils/toast.js — Toast notifications
export const toast = {
  show(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    el.innerHTML = `<span style="color:${type==='success'?'var(--green)':type==='error'?'var(--red)':'var(--accent-2)'}">${icon}</span> ${msg}`;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('fade-out');
      setTimeout(() => el.remove(), 300);
    }, 3000);
  },
  success(msg) { this.show(msg, 'success'); },
  error(msg)   { this.show(msg, 'error'); },
  info(msg)    { this.show(msg, 'info'); },
};



// src/utils/auth.js — Auth state helpers
export const auth = {
  getToken: () => localStorage.getItem('vibekit_token'),
  getUser:  () => { try { return JSON.parse(localStorage.getItem('vibekit_user')); } catch { return null; } },
  isLoggedIn: () => !!localStorage.getItem('vibekit_token'),
  save(token, user) {
    localStorage.setItem('vibekit_token', token);
    localStorage.setItem('vibekit_user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('vibekit_token');
    localStorage.removeItem('vibekit_user');
  },
};