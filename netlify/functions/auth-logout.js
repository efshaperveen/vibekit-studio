const { successResponse, errorResponse, handleCors } = require("./_utils/helpers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleCors();

  if (event.httpMethod !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  return successResponse({ message: "Successfully logout ho gaye" });
};