const connectDB = require("./_utils/db");
const Page = require("./_models/Page");
const ContactSubmission = require("./_models/ContactSubmission");
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

  
    const page = await Page.findOne({ slug, status: "published" });
    if (!page) return errorResponse("Page nahi mili", 404);

  
    const { name, email, message } = JSON.parse(event.body || "{}");

    if (!name || !email || !message) {
      return errorResponse("Naam, email aur message teeno zaroori hain");
    }

  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse("Valid email daalo");
    }

    if (message.trim().length < 10) {
      return errorResponse("Message thoda lamba likho (kam se kam 10 characters)");
    }

  
    await ContactSubmission.create({
      pageId: page._id,
      pageSlug: slug,
      pageOwnerId: page.userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
    });

    return successResponse({
      message: "Tumhara message mil gaya! Hum jaldi reply karenge. 🎉",
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    if (error.name === "ValidationError") {
      return errorResponse(Object.values(error.errors).map(e => e.message).join(", "));
    }
    return errorResponse("Server error", 500);
  }
};