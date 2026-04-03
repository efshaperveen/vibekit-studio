// netlify/functions/_utils/helpers.js
//
// YE FILE KYA KARTI HAI:
// Common helper functions hain jo baar baar use hoti hain.
// 1. JWT token banana aur verify karna
// 2. API response banana (success ya error)
// 3. Request se user verify karna

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// ============================================================
// JWT HELPERS
// JWT (JSON Web Token) ek "pass" hai jo login ke baad milta hai.
// Jab user koi authenticated action kare toh ye pass bhejta hai.
// ============================================================

// Naya JWT token banao
const createToken = (userId) => {
  return jwt.sign(
    { userId }, // Token mein kya store karein
    JWT_SECRET, // Secret key se sign karo
    { expiresIn: "7d" } // 7 din baad expire hoga
  );
};

// Token verify karo — valid hai ya nahi
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // Invalid token
  }
};

// ============================================================
// RESPONSE HELPERS
// Har API response ka same format hoga — consistency ke liye
// ============================================================

// Success response
const successResponse = (data, statusCode = 200) => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      // CORS headers — frontend se API call allow karne ke liye
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
    body: JSON.stringify({
      success: true,
      data,
    }),
  };
};

// Error response
const errorResponse = (message, statusCode = 400) => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
    body: JSON.stringify({
      success: false,
      error: message,
    }),
  };
};

// CORS preflight request handle karo
// Browser pehle OPTIONS request bhejta hai — ye uska jawab hai
const handleCors = () => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
    body: "",
  };
};

// ============================================================
// AUTH MIDDLEWARE
// Request se token nikalo aur user verify karo
// ============================================================
const authenticateUser = (event) => {
  // Token do jagah se aa sakta hai:
  // 1. Authorization header mein: "Bearer <token>"
  // 2. Cookie mein: "token=<token>"

  let token = null;

  // Header se nikalo
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7); // "Bearer " hata ke sirf token lo
  }

  // Cookie se nikalo (agar header mein nahi mila)
  if (!token && event.headers.cookie) {
    const cookies = event.headers.cookie.split(";");
    const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
    if (tokenCookie) {
      token = tokenCookie.split("=")[1].trim();
    }
  }

  if (!token) {
    return null; // Token nahi mila
  }

  const decoded = verifyToken(token);
  return decoded; // { userId: "..." } ya null
};

// ============================================================
// SLUG HELPER
// Title se slug banao — "My Portfolio" → "my-portfolio"
// ============================================================
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Special chars hato
    .replace(/\s+/g, "-") // Spaces ko - se replace karo
    .replace(/-+/g, "-") // Multiple - ko ek - karo
    .substring(0, 50); // Max 50 chars
};

module.exports = {
  createToken,
  verifyToken,
  successResponse,
  errorResponse,
  handleCors,
  authenticateUser,
  generateSlug,
};