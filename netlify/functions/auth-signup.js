const connectDB = require("./_utils/db");
const User = require("./_models/User");
const {
  createToken,
  successResponse,
  errorResponse,
  handleCors,
} = require("./_utils/helpers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return handleCors();
  }

  if (event.httpMethod !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    await connectDB();

    const { name, email, password } = JSON.parse(event.body || "{}");

    if (!name || !email || !password) {
      return errorResponse("Naam, email aur password zaroori hain");
    }

    if (password.length < 6) {
      return errorResponse("Password kam se kam 6 characters ka hona chahiye");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse("Ye email pehle se registered hai", 409);
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = createToken(user._id.toString());

    return successResponse(
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      201,
    );
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return errorResponse("Ye email pehle se registered hai", 409);
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(messages.join(", "));
    }

    return errorResponse("Server error aaya, baad mein try karo", 500);
  }
};
