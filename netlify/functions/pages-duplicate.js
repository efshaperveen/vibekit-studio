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
  if (event.httpMethod !== "POST")
    return errorResponse("Method not allowed", 405);

  try {
    const authUser = authenticateUser(event);
    if (!authUser) return errorResponse("Login karo pehle", 401);

    await connectDB();

    const pageId = event.queryStringParameters?.id;
    if (!pageId) return errorResponse("Page ID zaroori hai");

    const originalPage = await Page.findById(pageId);
    if (!originalPage) return errorResponse("Page nahi mili", 404);

    if (originalPage.userId.toString() !== authUser.userId) {
      return errorResponse("Ye page tumhari nahi hai", 403);
    }

    let newSlug = `${originalPage.slug}-copy`;
    let counter = 2;
    while (await Page.findOne({ slug: newSlug })) {
      newSlug = `${originalPage.slug}-copy-${counter}`;
      counter++;
    }

    // Original page ka data copy karo
    const duplicatedPage = await Page.create({
      title: `${originalPage.title} (Copy)`,
      slug: newSlug,
      userId: authUser.userId,
      status: "draft",
      theme: originalPage.theme.toObject(),
      sections: originalPage.sections.toObject(),
    });

    return successResponse(
      {
        message: "Page duplicate ho gaya!",
        page: {
          id: duplicatedPage._id,
          title: duplicatedPage.title,
          slug: duplicatedPage.slug,
          status: duplicatedPage.status,
          createdAt: duplicatedPage.createdAt,
        },
      },
      201,
    );
  } catch (error) {
    console.error("Duplicate error:", error);
    return errorResponse("Server error", 500);
  }
};
