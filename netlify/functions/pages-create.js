const connectDB = require("./_utils/db");
const Page = require("./_models/Page");
const {
  successResponse,
  errorResponse,
  handleCors,
  authenticateUser,
  generateSlug,
} = require("./_utils/helpers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleCors();
  if (event.httpMethod !== "POST") return errorResponse("Method not allowed", 405);

  try {

    const authUser = authenticateUser(event);
    if (!authUser) {
      return errorResponse("Login karo pehle", 401);
    }

    await connectDB();

    const { title, theme } = JSON.parse(event.body || "{}");

    if (!title || title.trim() === "") {
      return errorResponse("Page ka title zaroori hai");
    }

 
    let slug = generateSlug(title);

    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      let counter = 2;
      while (await Page.findOne({ slug: `${slug}-${counter}` })) {
        counter++;
      }
      slug = `${slug}-${counter}`;
    }

 
    const page = await Page.create({
      title: title.trim(),
      slug,
      userId: authUser.userId,
      status: "draft",
      theme: getThemePreset(theme || "minimal"), // Default theme
    });

    return successResponse(
      {
        page: {
          id: page._id,
          title: page.title,
          slug: page.slug,
          status: page.status,
          theme: page.theme,
          sections: page.sections,
          viewCount: page.viewCount,
          createdAt: page.createdAt,
          updatedAt: page.updatedAt,
        },
      },
      201
    );
  } catch (error) {
    console.error("Page create error:", error);
    if (error.name === "ValidationError") {
      return errorResponse(Object.values(error.errors).map(e => e.message).join(", "));
    }
    return errorResponse("Server error", 500);
  }
};

// ============================================================
// THEME PRESETS
// ============================================================
const getThemePreset = (themeName) => {
  const presets = {
    minimal: {
      name: "minimal",
      colors: {
        background: "#ffffff",
        surface: "#f9fafb",
        text: "#111827",
        accent: "#6366f1",
      },
      fontHeading: "Inter",
      fontBody: "Inter",
      borderRadius: "6px",
      buttonStyle: "solid",
    },
    "neo-brutal": {
      name: "neo-brutal",
      colors: {
        background: "#fff7ed",
        surface: "#ffffff",
        text: "#000000",
        accent: "#facc15",
      },
      fontHeading: "Space Grotesk",
      fontBody: "Space Grotesk",
      borderRadius: "0px",
      buttonStyle: "solid",
    },
    "dark-neon": {
      name: "dark-neon",
      colors: {
        background: "#0a0a0a",
        surface: "#1a1a2e",
        text: "#e2e8f0",
        accent: "#00ff88",
      },
      fontHeading: "Orbitron",
      fontBody: "Rajdhani",
      borderRadius: "4px",
      buttonStyle: "glow",
    },
    pastel: {
      name: "pastel",
      colors: {
        background: "#fdf4ff",
        surface: "#ffffff",
        text: "#4a4a68",
        accent: "#c084fc",
      },
      fontHeading: "Nunito",
      fontBody: "Nunito",
      borderRadius: "16px",
      buttonStyle: "solid",
    },
    luxury: {
      name: "luxury",
      colors: {
        background: "#0d0d0d",
        surface: "#1a1a1a",
        text: "#f5f0e8",
        accent: "#d4af37",
      },
      fontHeading: "Cormorant Garamond",
      fontBody: "EB Garamond",
      borderRadius: "2px",
      buttonStyle: "outline",
    },
    retro: {
      name: "retro",
      colors: {
        background: "#1a1a2e",
        surface: "#16213e",
        text: "#00ff41",
        accent: "#ff6b6b",
      },
      fontHeading: "Press Start 2P",
      fontBody: "VT323",
      borderRadius: "0px",
      buttonStyle: "solid",
    },
  };

  return presets[themeName] || presets.minimal;
};