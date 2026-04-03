const connectDB = require("./_utils/db");
const Page = require("./_models/Page");
const {
  successResponse,
  errorResponse,
  handleCors,
} = require("./_utils/helpers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleCors();
  if (event.httpMethod !== "GET") return errorResponse("Method not allowed", 405);

  try {
    await connectDB();
    const slug = event.queryStringParameters?.slug;
    if (!slug) return errorResponse("Slug zaroori hai");


    const page = await Page.findOne({ slug, status: "published" });

    if (!page) {
      return errorResponse("Page nahi mili ya publish nahi hui hai", 404);
    }

    return successResponse({
      page: {
        id: page._id,
        title: page.title,
        slug: page.slug,
        theme: page.theme,
        sections: page.sections,
        viewCount: page.viewCount,
        publishedAt: page.publishedAt,
      },
    });
  } catch (error) {
    console.error("Public page error:", error);
    return errorResponse("Server error", 500);
  }
};