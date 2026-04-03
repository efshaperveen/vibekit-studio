// netlify/functions/_utils/themes.js
//
// YE FILE KYA KARTI HAI:
// Saare 6 theme presets yahan define hain.
// Frontend aur backend dono yahi file use karenge
// taaki preview aur published page bilkul same dikhe.

const THEMES = {
  minimal: {
    name: "minimal",
    label: "Minimal / Editorial",
    description: "Clean, white, NYT-inspired",
    colors: {
      background: "#ffffff",
      surface: "#f9fafb",
      text: "#111827",
      accent: "#6366f1",
      accentText: "#ffffff",
      border: "#e5e7eb",
      muted: "#6b7280",
    },
    fontHeading: "'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    borderRadius: "6px",
    buttonStyle: "solid",
    // CSS extra styles for this theme
    extras: {
      heroBackground: "#f9fafb",
      cardShadow: "0 1px 3px rgba(0,0,0,0.1)",
      navBackground: "#ffffff",
    },
  },

  "neo-brutal": {
    name: "neo-brutal",
    label: "Neo-Brutal",
    description: "Bold borders, raw energy",
    colors: {
      background: "#fff7ed",
      surface: "#ffffff",
      text: "#000000",
      accent: "#facc15",
      accentText: "#000000",
      border: "#000000",
      muted: "#444444",
    },
    fontHeading: "'Space Grotesk', sans-serif",
    fontBody: "'Space Grotesk', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
    borderRadius: "0px",
    buttonStyle: "solid",
    extras: {
      heroBackground: "#facc15",
      cardShadow: "4px 4px 0px #000000",
      navBackground: "#fff7ed",
      cardBorder: "2px solid #000000",
    },
  },

  "dark-neon": {
    name: "dark-neon",
    label: "Dark / Neon",
    description: "Cyberpunk, glowing, night vibes",
    colors: {
      background: "#0a0a0a",
      surface: "#111827",
      text: "#e2e8f0",
      accent: "#00ff88",
      accentText: "#000000",
      border: "#1f2937",
      muted: "#9ca3af",
    },
    fontHeading: "'Orbitron', sans-serif",
    fontBody: "'Rajdhani', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap",
    borderRadius: "4px",
    buttonStyle: "glow",
    extras: {
      heroBackground: "#0d1117",
      cardShadow: "0 0 20px rgba(0,255,136,0.15)",
      navBackground: "rgba(10,10,10,0.95)",
      glowColor: "#00ff88",
    },
  },

  pastel: {
    name: "pastel",
    label: "Pastel / Soft",
    description: "Dreamy, soft, rounded, cozy",
    colors: {
      background: "#fdf4ff",
      surface: "#ffffff",
      text: "#4a4a68",
      accent: "#c084fc",
      accentText: "#ffffff",
      border: "#e9d5ff",
      muted: "#8b8ba8",
    },
    fontHeading: "'Nunito', sans-serif",
    fontBody: "'Nunito', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap",
    borderRadius: "16px",
    buttonStyle: "solid",
    extras: {
      heroBackground: "#f5d0fe",
      cardShadow: "0 4px 20px rgba(192,132,252,0.15)",
      navBackground: "#fdf4ff",
    },
  },

  luxury: {
    name: "luxury",
    label: "Luxury / Serif",
    description: "Gold, dark, premium, editorial",
    colors: {
      background: "#0d0d0d",
      surface: "#1a1a1a",
      text: "#f5f0e8",
      accent: "#d4af37",
      accentText: "#000000",
      border: "#2a2a2a",
      muted: "#9a9080",
    },
    fontHeading: "'Cormorant Garamond', serif",
    fontBody: "'EB Garamond', serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=EB+Garamond:wght@400;500&display=swap",
    borderRadius: "2px",
    buttonStyle: "outline",
    extras: {
      heroBackground: "#111111",
      cardShadow: "0 2px 20px rgba(212,175,55,0.1)",
      navBackground: "#0d0d0d",
      goldAccent: "#d4af37",
    },
  },

  retro: {
    name: "retro",
    label: "Retro / Pixel",
    description: "8-bit, terminal, old-school cool",
    colors: {
      background: "#1a1a2e",
      surface: "#16213e",
      text: "#00ff41",
      accent: "#ff6b6b",
      accentText: "#ffffff",
      border: "#0f3460",
      muted: "#00cc35",
    },
    fontHeading: "'Press Start 2P', monospace",
    fontBody: "'VT323', monospace",
    fontImport: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap",
    borderRadius: "0px",
    buttonStyle: "solid",
    extras: {
      heroBackground: "#0f0f23",
      cardShadow: "0 0 10px rgba(0,255,65,0.2)",
      navBackground: "#0d0d1a",
      scanlines: true, // CSS scanline effect
    },
  },
};

// Helper: Theme name se preset return karo
const getThemePreset = (themeName) => {
  return THEMES[themeName] || THEMES.minimal;
};

// Saare theme names list
const THEME_NAMES = Object.keys(THEMES);

module.exports = { THEMES, getThemePreset, THEME_NAMES };