const mongoose = require("mongoose");

const ContactSubmissionSchema = new mongoose.Schema(
  {
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      required: true,
    },

    pageSlug: {
      type: String,
      required: true,
    },

    pageOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Form data
    name: {
      type: String,
      required: [true, "Naam zaroori hai"],
      trim: true,
      maxlength: [100, "Naam bahut lamba hai"],
    },

    email: {
      type: String,
      required: [true, "Email zaroori hai"],
      lowercase: true,
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Message zaroori hai"],
      maxlength: [2000, "Message bahut lamba hai"],
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.ContactSubmission ||
  mongoose.model("ContactSubmission", ContactSubmissionSchema);
