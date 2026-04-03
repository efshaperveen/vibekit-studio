// netlify/functions/_models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Schema = blueprint of data
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Naam zaroori hai"],
      trim: true, 
      maxlength: [50, "Naam 50 characters se zyada nahi hona chahiye"],
    },

    email: {
      type: String,
      required: [true, "Email zaroori hai"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Valid email daalo",
      ],
    },

    password: {
      type: String,
      required: [true, "Password zaroori hai"],
      minlength: [6, "Password kam se kam 6 characters ka hona chahiye"],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
