const getToken = () => localStorage.getItem('vibekit_token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const request = async (url, options = {}) => {
  const res = await fetch(url, { headers: headers(), ...options });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Kuch gadbad ho gayi');
  return data.data;
};

// AUTH
export const signup = (body) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) });
export const login  = (body) => request('/api/auth/login',  { method: 'POST', body: JSON.stringify(body) });
export const logout = ()     => request('/api/auth/logout', { method: 'POST' });

export const getPages      = ()       => request('/api/pages');
export const createPage    = (body)   => request('/api/pages/create',             { method: 'POST', body: JSON.stringify(body) });
export const getPage       = (id)     => request(`/api/pages/get?id=${id}`);
export const updatePage    = (id, b)  => request(`/api/pages/update?id=${id}`,    { method: 'POST',  body: JSON.stringify(b) });
export const publishPage   = (id)     => request(`/api/pages/publish?id=${id}`,   { method: 'POST' });
export const unpublishPage = (id)     => request(`/api/pages/unpublish?id=${id}`, { method: 'POST' });
export const duplicatePage = (id)     => request(`/api/pages/duplicate?id=${id}`, { method: 'POST' });

// PUBLIC
export const getPublicPage = (slug)        => request(`/api/public/page?slug=${slug}`);
export const trackView     = (slug)        => request(`/api/public/view?slug=${slug}`,    { method: 'POST' });
export const submitContact = (slug, body)  => request(`/api/public/contact?slug=${slug}`, { method: 'POST', body: JSON.stringify(body) });

// THEMES
export const getThemes = () => request('/api/themes');