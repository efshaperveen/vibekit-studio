// netlify/functions/_utils/db.js
// 
// YE FILE KYA KARTI HAI:
// MongoDB se connect karti hai.
// "mongoose" ek library hai jo MongoDB ke saath kaam asaan banati hai.
// Hum ek trick use karte hain — agar connection pehle se bana hai
// toh dobara naya nahi banate (performance ke liye)

const mongoose = require("mongoose");

// MongoDB ka URL .env file se aayega
const MONGODB_URI = process.env.MONGODB_URI;

// Ye variable track karega ki connection bana hai ya nahi
let isConnected = false;

const connectDB = async () => {
  // Agar pehle se connected hai toh kuch mat karo
  if (isConnected) {
    return;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable set nahi hai!");
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      // Ye options best practices hain
      bufferCommands: false,
    });

    isConnected = true;
    console.log("✅ MongoDB se connect ho gaye!");
  } catch (error) {
    console.error("❌ MongoDB connection fail:", error.message);
    throw error;
  }
};

module.exports = connectDB;