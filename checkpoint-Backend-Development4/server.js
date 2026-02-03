require("dotenv").config();
const express = require("express");
const connectMongoDB = require("./config/mongoDB");
const { initMySQL } = require("./config/mySQL");

const productNoSQLRoutes = require("./routes/productNoSQLRoutes");
const productSQLRoutes = require("./routes/productSQLRoutes");

const app = express();

// Middleware
app.use(express.json());

// Connect to databases
connectMongoDB();
initMySQL();

// Routes
app.use("/api/nosql/products", productNoSQLRoutes);
app.use("/api/sql/products", productSQLRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Product API with MongoDB & MySQL",
    endpoints: {
      mongodb: "/api/nosql/products",
      mysql: "/api/sql/products",
    },
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("");
  console.log("📦 MongoDB Endpoints:");
  console.log("   POST   /api/nosql/products");
  console.log("   GET    /api/nosql/products");
  console.log("   GET    /api/nosql/products/:id");
  console.log("   PUT    /api/nosql/products/:id");
  console.log("   DELETE /api/nosql/products/:id");
  console.log("");
  console.log("🗄️  MySQL Endpoints:");
  console.log("   POST   /api/sql/products");
  console.log("   GET    /api/sql/products");
  console.log("   GET    /api/sql/products/:id");
  console.log("   PUT    /api/sql/products/:id");
  console.log("   DELETE /api/sql/products/:id");
});
