const connectDB = require("./_utils/db");
const Page = require("./_models/Page");
const { successResponse, errorResponse, handleCors, authenticateUser } = require("./_utils/helpers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleCors();

  if (!["PUT", "POST"].includes(event.httpMethod)) {
    return errorResponse("Method not allowed", 405);
  }

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

    const updates = JSON.parse(event.body || "{}");

    if (updates.title !== undefined) page.title = updates.title;

    if (updates.sections !== undefined) {
      if (updates.sections.hero)     Object.assign(page.sections.hero,     updates.sections.hero);
      if (updates.sections.features) Object.assign(page.sections.features, updates.sections.features);
      if (updates.sections.gallery)  Object.assign(page.sections.gallery,  updates.sections.gallery);
      if (updates.sections.contact)  Object.assign(page.sections.contact,  updates.sections.contact);
      if (updates.sections.order)    page.sections.order = updates.sections.order;
      page.markModified("sections");
    }

    if (updates.theme !== undefined) {
      Object.assign(page.theme, updates.theme);
      page.markModified("theme");
    }

    await page.save();

    return successResponse({
      message: "Saved ✓",
      page: {
        id: page._id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        theme: page.theme,
        sections: page.sections,
        updatedAt: page.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    return errorResponse("Server error", 500);
  }
};