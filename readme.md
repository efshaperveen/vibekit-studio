# VibeKit Studio 🎨

> **"Generate a theme, build a mini-site, publish it."**

VibeKit Studio is a full-stack web application where users can select a design theme ("vibe"), build a mini-site using a live page builder, and publish it to a public URL — all in under 5 minutes.

---

## 🔗 Links

| | |
|---|---|
| **Live URL** | `https://vibekit-studio.netlify.app` |
| **GitHub** | `https://github.com/YOUR_USERNAME/vibekit-studio` |

---

## 🧪 Test Credentials

Sign up directly via the app — no invite needed.

Or use this pre-created test account:
- **Email:** `test@vibekit.com`
- **Password:** `test123456`

---

## ⚙️ Local Setup (Step by Step)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) — `npm install -g netlify-cli`
- A [MongoDB Atlas](https://mongodb.com/atlas) free account

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/vibekit-studio.git
cd vibekit-studio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
cp .env.example .env
```
Open `.env` and fill in your values:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vibekit
JWT_SECRET=any_long_random_string_here_minimum_32_chars
NODE_ENV=development
```

### 4. MongoDB Atlas Setup
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → create free account
2. Create a **free M0 cluster**
3. Under **Database Access** → Add a database user (username + password)
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Click **Connect** → **Compass** → copy the connection string
6. Replace `<password>` with your DB user password and paste into `.env`

### 5. Run Locally
```bash
netlify dev
```
App runs at: **http://localhost:8888**

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for signing JWT tokens (any random string, min 32 chars) | ✅ Yes |
| `NODE_ENV` | Set to `development` locally, `production` on Netlify | ✅ Yes |

### Setting Env Vars on Netlify (Production)
1. Go to your Netlify dashboard → your site → **Site Settings**
2. Click **Environment Variables** → **Add a variable**
3. Add all three variables above
4. Redeploy the site

---

## 🚀 Deploying to Netlify

### Option A — Netlify CLI (Recommended)
```bash
netlify login
netlify init       # link to a new or existing site
netlify deploy --prod
```

### Option B — GitHub Integration
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Select your repo
4. Build settings are auto-detected from `netlify.toml`
5. Add environment variables in Site Settings
6. Click **Deploy site**

---

## 📁 Project Structure

```
vibekit-studio/
│
├── netlify/
│   └── functions/                  ← Serverless backend (Netlify Functions)
│       ├── _models/
│       │   ├── User.js             ← User schema (bcrypt hashed passwords)
│       │   ├── Page.js             ← Page schema (hero, features, gallery, contact)
│       │   └── ContactSubmission.js← Contact form submissions schema
│       ├── _utils/
│       │   ├── db.js               ← MongoDB connection (singleton pattern)
│       │   ├── helpers.js          ← JWT helpers, response formatters, auth middleware
│       │   └── themes.js           ← 6 theme presets with full design tokens
│       ├── auth-signup.js          ← POST /api/auth/signup
│       ├── auth-login.js           ← POST /api/auth/login
│       ├── auth-logout.js          ← POST /api/auth/logout
│       ├── pages-list.js           ← GET  /api/pages
│       ├── pages-create.js         ← POST /api/pages/create
│       ├── pages-get.js            ← GET  /api/pages/get?id=:id
│       ├── pages-update.js         ← POST /api/pages/update?id=:id
│       ├── pages-publish.js        ← POST /api/pages/publish?id=:id
│       ├── pages-unpublish.js      ← POST /api/pages/unpublish?id=:id
│       ├── pages-duplicate.js      ← POST /api/pages/duplicate?id=:id
│       ├── public-page.js          ← GET  /api/public/page?slug=:slug
│       ├── public-view.js          ← POST /api/public/view?slug=:slug
│       ├── public-contact.js       ← POST /api/public/contact?slug=:slug
│       └── themes-list.js          ← GET  /api/themes
│
├── src/                            ← Frontend (Vanilla JS SPA)
│   ├── index.html                  ← App shell entry point
│   ├── public.html                 ← Standalone public page renderer (/p/:slug)
│   ├── app.js                      ← SPA router
│   ├── styles/
│   │   └── main.css                ← Design system (CSS variables, components)
│   ├── utils/
│   │   ├── api.js                  ← All backend API calls
│   │   └── helpers.js              ← Router, toast notifications, auth state
│   ├── components/
│   │   └── Navbar.js               ← Sticky navbar with mobile hamburger menu
│   └── pages/
│       ├── Landing.js              ← Marketing homepage (/)
│       ├── Auth.js                 ← Login (/login) + Signup (/signup)
│       ├── Dashboard.js            ← Pages list + new page modal (/app)
│       ├── Editor.js               ← Live page builder (/editor/:id)
│       └── PublicPage.js           ← Public page view (legacy, replaced by public.html)
│
├── netlify.toml                    ← Netlify config: build settings + redirects
├── package.json                    ← Dependencies
├── .env.example                    ← Environment variable template
├── .gitignore                      ← Excludes node_modules, .env
└── README.md                       ← This file
```

---

## 📡 API Reference

### Auth Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT token |
| POST | `/api/auth/logout` | ❌ | Logout (client clears token) |

### Pages Endpoints (Login Required)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/pages` | ✅ | List all user's pages |
| POST | `/api/pages/create` | ✅ | Create new page |
| GET | `/api/pages/get?id=:id` | ✅ | Get single page data |
| POST | `/api/pages/update?id=:id` | ✅ | Update page content/theme |
| POST | `/api/pages/publish?id=:id` | ✅ | Publish page (make public) |
| POST | `/api/pages/unpublish?id=:id` | ✅ | Unpublish page (make draft) |
| POST | `/api/pages/duplicate?id=:id` | ✅ | Clone a page |

### Public Endpoints (No Login)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/public/page?slug=:slug` | ❌ | Get published page by slug |
| POST | `/api/public/view?slug=:slug` | ❌ | Increment view count in DB |
| POST | `/api/public/contact?slug=:slug` | ❌ | Submit contact form |

### Other
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/themes` | ❌ | List all 6 theme presets |

---

## 🎨 Theme System

6 complete design presets — each defines a full CSS variable token set:

| Theme ID | Label | Vibe |
|----------|-------|------|
| `minimal` | Minimal / Editorial | Clean white, NYT-inspired |
| `neo-brutal` | Neo-Brutal | Bold borders, raw energy, yellow accents |
| `dark-neon` | Dark / Neon | Cyberpunk black with green glow |
| `pastel` | Pastel / Soft | Dreamy lavender, rounded corners |
| `luxury` | Luxury / Serif | Dark background, gold accents, serif fonts |
| `retro` | Retro / Pixel | 8-bit terminal green, pixel fonts |

Each theme defines: `background`, `surface`, `text`, `accent` colors + heading font + body font + border radius + button style. CSS variables (`--bg`, `--surface`, `--text`, `--accent`, `--radius`) are applied consistently so preview = published, always.

---

## 🔒 Security Implementation

- **Passwords** — hashed with `bcryptjs` (10 salt rounds) before storing; never stored as plain text
- **JWT Auth** — tokens signed with `JWT_SECRET`, expire in 7 days; sent via `Authorization: Bearer <token>` header
- **Ownership enforcement** — every authenticated endpoint checks `page.userId === authUser.userId` server-side
- **Publish/Unpublish** — enforced server-side only; client cannot fake publish status
- **Server-side validation** — all inputs validated in each function before DB operations
- **No secrets in code** — all credentials via Netlify environment variables; `.env` in `.gitignore`
- **No DB credentials in client** — frontend only talks to `/api/*` endpoints; MongoDB URI never exposed

---

## 📱 Responsiveness

Tested and functional at all required breakpoints:

| Viewport | Width | Status |
|----------|-------|--------|
| Mobile | 320px – 480px | ✅ |
| Tablet | 768px – 1024px | ✅ |
| Desktop | 1280px+ | ✅ |

Key responsive features:
- No horizontal scroll at any breakpoint
- Touch targets minimum 44px for all primary actions
- Navigation works without hover (hamburger menu on mobile)
- Modals and forms scroll-safe on mobile
- Layout shifts: 1-col mobile → 2-col tablet → 3-col desktop (features, gallery, theme picker)
- Editor sidebar stacks below preview on mobile
- Typography scales with `clamp()` — never too small on tablet

---

## ✨ Design Extras Implemented

1. **Micro-interactions** — hover/focus/pressed states on all buttons, cards, theme swatches, and inputs; scale + shadow transitions throughout
2. **Subtle animations** — hero section fade-up on page load (staggered with `animation-delay`), card hover lift, toast notification slide-in with bounce easing, modal scale-in
3. **Skeleton loaders** — dashboard shows shimmer skeleton cards while pages are fetching from the API

---

## ⚖️ Tradeoffs + What I'd Improve Next

1. **No image upload — URL-only gallery** — Users paste image URLs instead of uploading files. Would integrate Cloudinary or AWS S3 for direct drag-and-drop upload with automatic resizing and CDN delivery.

2. **No rate limiting** — Any user can make unlimited API calls. Would add Redis-based rate limiting (or `netlify-plugin-rate-limit`) per IP for auth endpoints especially, to prevent brute-force attacks.

3. **Basic auto-save with debounce** — Currently saves 1.2s after the last keystroke. Would upgrade to optimistic updates with conflict resolution (last-write-wins with a version counter) so data is never lost even on slow connections.

4. **No email notifications for contact form** — Submissions are stored in DB but the page owner gets no email alert. Would integrate Resend or SendGrid to send an instant email notification to the page owner when someone fills their contact form.

5. **No custom domain support** — Published pages live at `vibekit.netlify.app/p/slug`. The next major feature would be custom domain mapping (like Webflow/Carrd) so users can point their own domain to their VibeKit page for a fully professional experience.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JavaScript (ES Modules), CSS3 |
| Backend | Netlify Functions (Node.js serverless) |
| Database | MongoDB Atlas via Mongoose |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Hosting | Netlify |
| Fonts | Google Fonts (Syne, DM Sans, DM Mono + theme fonts) |
