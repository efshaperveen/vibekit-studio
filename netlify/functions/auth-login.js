const connectDB = require("./_utils/db");
const User = require("./_models/User");
const {
  createToken,
  successResponse,
  errorResponse,
  handleCors,
} = require("./_utils/helpers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleCors();

  if (event.httpMethod !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    await connectDB();

    const { email, password } = JSON.parse(event.body || "{}");

    // Validation
    if (!email || !password) {
      return errorResponse("Email aur password dono zaroori hain");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return errorResponse("Email ya password galat hai", 401);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return errorResponse("Email ya password galat hai", 401);
    }

    const token = createToken(user._id.toString());

    return successResponse({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Server error aaya, baad mein try karo", 500);
  }
};
