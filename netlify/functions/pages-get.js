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

   
    const pageId = event.queryStringParameters?.id;
    if (!pageId) return errorResponse("Page ID zaroori hai");

    const page = await Page.findById(pageId);

    if (!page) return errorResponse("Page nahi mili", 404);

  
    if (page.userId.toString() !== authUser.userId) {
      return errorResponse("Ye page tumhari nahi hai", 403);
    }

    return successResponse({ page });
  } catch (error) {
    console.error("Page get error:", error);
    return errorResponse("Server error", 500);
  }
};