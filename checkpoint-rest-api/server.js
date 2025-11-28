const express = require("express");
const mongoose = require("mongoose");

const config = require("./config/env");

// Import User model
const User = require("./models/User");

const app = express();
const PORT = config.server.port;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection function
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from configuration
    const conn = await mongoose.connect(config.database.mongodbUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    // Exit process with failure code
    process.exit(1);
  }
};

// Connect to database
connectDB();

// ==================== REST API ROUTES ====================

// GET Route - Return all users
app.get("/users", async (req, res) => {
  try {
    console.log("📖 Fetching all users from database...");

    const users = await User.find({});

    res.status(200).json({
      success: true,
      count: users.length,
      message: "Users retrieved successfully",
      data: users,
    });

    console.log(`✅ Successfully returned ${users.length} users`);
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
});

// Get user by id
app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`📖 Fetching user with ID: ${userId}`);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: `No user found with ID: ${userId}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });

    console.log(`✅ Successfully returned user: ${user.name}`);
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
        error: "Please provide a valid user ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error retrieving user",
      error: error.message,
    });
  }
});

// POST Route - Add a new user to the database
app.post("/users", async (req, res) => {
  try {
    console.log("📝 Creating new user with data:", req.body);

    // Use mongoose method to create a new user
    const newUser = await User.create(req.body);

    // Return success response with created user data
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });

    console.log(`✅ Successfully created user: ${newUser.name}`);
  } catch (error) {
    // Handle validation errors and duplicate key errors
    console.error("❌ Error creating user:", error.message);

    if (error.name === "ValidationError") {
      // Return validation error details
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors,
      });
    }

    if (error.code === 11000) {
      // Handle duplicate email error
      return res.status(400).json({
        success: false,
        message: "Email already exists",
        error: "A user with this email already exists",
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
});

// PUT Route - Edit a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`📝 Updating user with ID: ${userId}`);
    console.log("Update data:", req.body);

    // Use mongoose method to find user by ID and update
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    // Check if user was found
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: `No user found with ID: ${userId}`,
      });
    }

    // Return success response with updated user data
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });

    console.log(`✅ Successfully updated user: ${updatedUser.name}`);
  } catch (error) {
    console.error("❌ Error updating user:", error.message);

    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
        error: "Please provide a valid user ID",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors,
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
});

// DELETE Route - Remove a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`🗑️ Deleting user with ID: ${userId}`);

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: `No user found with ID: ${userId}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });

    console.log(`✅ Successfully deleted user: ${deletedUser.name}`);
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);

    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
        error: "Please provide a valid user ID",
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
});

// Root route - API information
app.get("/", (req, res) => {
  res.json({
    message: "🚀 User Management REST API",
    version: "1.0.0",
    endpoints: {
      "GET /users": "Get all users",
      "GET /users/:id": "Get user by ID",
      "POST /users": "Create new user",
      "PUT /users/:id": "Update user by ID",
      "DELETE /users/:id": "Delete user by ID",
    },
    timestamp: new Date().toISOString(),
  });
});

// Handle 404 - Route not found
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error("💥 Unhandled Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error:
      config.server.nodeEnv === "development"
        ? error.message
        : "Something went wrong",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${config.server.nodeEnv}`);
});
