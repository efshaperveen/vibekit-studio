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
  if (event.httpMethod !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const authUser = authenticateUser(event);
    if (!authUser) return errorResponse("Login karo pehle", 401);

    await connectDB();

    const pageId = event.queryStringParameters?.id;
    if (!pageId) return errorResponse("Page ID zaroori hai");

    const page = await Page.findById(pageId);
    if (!page) return errorResponse("Page nahi mili", 404);

    if (page.userId.toString() !== authUser.userId) {
      return errorResponse("Ye page tumhari nahi hai", 403);
    }

    page.status = "published";
    page.publishedAt = new Date();
    await page.save();

    return successResponse({
      message: `Page publish ho gaya! URL: /p/${page.slug}`,
      slug: page.slug,
      status: page.status,
      publishedAt: page.publishedAt,
    });
  } catch (error) {
    console.error("Publish error:", error);
    return errorResponse("Server error", 500);
  }
};