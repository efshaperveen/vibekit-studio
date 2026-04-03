const connectDB = require("./_utils/db");
const Page = require("./_models/Page");
const {
  successResponse,
  errorResponse,
  handleCors,
} = require("./_utils/helpers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleCors();
  if (event.httpMethod !== "POST") return errorResponse("Method not allowed", 405);

  try {
    await connectDB();

    const slug = event.queryStringParameters?.slug;
    if (!slug) return errorResponse("Slug zaroori hai");
    const page = await Page.findOneAndUpdate(
      { slug, status: "published" },
      { $inc: { viewCount: 1 } }, 
      { new: true, select: "viewCount" } 
    );

    if (!page) {
      return errorResponse("Page nahi mili", 404);
    }

    return successResponse({
      viewCount: page.viewCount,
    });
  } catch (error) {
    console.error("View count error:", error);
    return errorResponse("Server error", 500);
  }
};