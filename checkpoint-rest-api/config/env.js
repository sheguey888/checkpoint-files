const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file in the root directory
const result = dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Check if .env file was loaded successfully
if (result.error) {
  console.error("❌ Error loading .env file:", result.error.message);
  process.exit(1);
}

// Environment configuration object
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || "development",
  },

  // Database configuration
  database: {
    mongodbUri: process.env.MONGODB_URI,
  },
};

module.exports = config;
