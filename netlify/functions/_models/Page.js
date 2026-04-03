const mongoose = require("mongoose");

// ---- SECTION SCHEMAS ----
const HeroSchema = new mongoose.Schema({
  title: { type: String, default: "Welcome to My Page" },
  subtitle: { type: String, default: "This is my awesome mini-site" },
  buttonText: { type: String, default: "Get Started" },
  buttonUrl: { type: String, default: "#" },
});

const FeatureCardSchema = new mongoose.Schema({
  title: { type: String, default: "Feature Title" },
  description: { type: String, default: "Feature description yahan hogi" },
});

// Features Section — 3-6 feature cards
const FeaturesSchema = new mongoose.Schema({
  // Array of feature cards
  cards: {
    type: [FeatureCardSchema],
    default: [
      { title: "Fast", description: "Lightning fast performance" },
      { title: "Easy", description: "Simple to use interface" },
      { title: "Beautiful", description: "Stunning design out of the box" },
    ],
    validate: {
      validator: function (arr) {
        return arr.length >= 3 && arr.length <= 6;
      },
      message: "Features mein 3 se 6 cards hone chahiye",
    },
  },
});

// Gallery Section — images
const GallerySchema = new mongoose.Schema({
  // Array of image URLs
  images: {
    type: [String],
    default: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800",
    ],
    validate: {
      validator: function (arr) {
        return arr.length >= 3 && arr.length <= 8;
      },
      message: "Gallery mein 3 se 8 images honi chahiye",
    },
  },
});

const ContactSchema = new mongoose.Schema({
  heading: { type: String, default: "Get In Touch" },
  subheading: {
    type: String,
    default: "Fill out the form and I'll get back to you.",
  },
});

// ---- THEME SCHEMA ----

const ThemeSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["minimal", "neo-brutal", "dark-neon", "pastel", "luxury", "retro"],
    default: "minimal",
  },

  colors: {
    background: { type: String, default: "#ffffff" },
    surface: { type: String, default: "#f5f5f5" },
    text: { type: String, default: "#111111" },
    accent: { type: String, default: "#6366f1" },
  },

  // Typography
  fontHeading: { type: String, default: "Inter" },
  fontBody: { type: String, default: "Inter" },

  borderRadius: { type: String, default: "8px" },

  buttonStyle: {
    type: String,
    enum: ["solid", "outline", "glow"],
    default: "solid",
  },
});

// ---- MAIN PAGE SCHEMA ----
const PageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Page title zaroori hai"],
      trim: true,
      maxlength: [100, "Title 100 characters se zyada nahi ho sakta"],
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,

      match: [
        /^[a-z0-9-]+$/,
        "Slug mein sirf letters, numbers aur - allowed hai",
      ],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    // Theme settings
    theme: {
      type: ThemeSchema,
      default: () => ({}),
    },

    sections: {
      order: {
        type: [String],
        default: ["hero", "features", "gallery", "contact"],
      },
      hero: { type: HeroSchema, default: () => ({}) },
      features: { type: FeaturesSchema, default: () => ({}) },
      gallery: { type: GallerySchema, default: () => ({}) },
      contact: { type: ContactSchema, default: () => ({}) },
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.Page || mongoose.model("Page", PageSchema);
