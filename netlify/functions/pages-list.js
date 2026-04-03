const connectDB = require("./_utils/db");
const Page = require("./_models/Page");
const {
  successResponse,
  errorResponse,
  handleCors,
  authenticateUser,
} = require("./_utils/helpers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleCors();
  if (event.httpMethod !== "GET") return errorResponse("Method not allowed", 405);

  try {
    const authUser = authenticateUser(event);
    if (!authUser) return errorResponse("Login karo pehle", 401);

    await connectDB();

    const pages = await Page.find({ userId: authUser.userId })
      .sort({ updatedAt: -1 })
      .select("title slug status viewCount createdAt updatedAt theme.name"); 

    return successResponse({ pages });
  } catch (error) {
    console.error("Pages list error:", error);
    return errorResponse("Server error", 500);
  }
};