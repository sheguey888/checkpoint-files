// MongoDB Script: Products Collection Setup
// Database: ecommerce_db
// Collection: products

// Switch to database
use ecommerce_db;

// Drop existing collection (for clean setup)
db.products.drop();

// Create products collection with validation schema
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sku", "name", "price", "currency", "inventory", "created_at"],
      properties: {
        sku: {
          bsonType: "string",
          description: "must be a unique string and is required"
        },
        name: {
          bsonType: "string",
          minLength: 3,
          description: "must be a string at least 3 characters and is required"
        },
        description: {
          bsonType: "string",
          description: "must be a string if provided"
        },
        category: {
          bsonType: "string",
          description: "must be a string"
        },
        subcategory: {
          bsonType: "string",
          description: "must be a string"
        },
        price: {
          bsonType: "double",
          minimum: 0,
          description: "must be a positive number and is required"
        },
        currency: {
          bsonType: "string",
          enum: ["USD", "EUR", "GBP", "JPY"],
          description: "must be a valid currency code"
        },
        inventory: {
          bsonType: "object",
          required: ["quantity"],
          properties: {
            quantity: {
              bsonType: "int",
              minimum: 0,
              description: "must be a non-negative integer"
            },
            warehouse_location: { bsonType: "string" },
            reorder_level: {
              bsonType: "int",
              minimum: 0
            }
          }
        },
        attributes: {
          bsonType: "object",
          description: "flexible object for product-specific attributes"
        },
        images: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        ratings: {
          bsonType: "object",
          properties: {
            average: {
              bsonType: "double",
              minimum: 0,
              maximum: 5
            },
            count: {
              bsonType: "int",
              minimum: 0
            }
          }
        },
        tags: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        created_at: {
          bsonType: "date",
          description: "must be a date and is required"
        },
        updated_at: {
          bsonType: "date"
        },
        is_active: {
          bsonType: "bool",
          description: "indicates if product is available for sale"
        }
      }
    }
  }
});

// Create indexes for optimized queries
// Unique index on SKU
db.products.createIndex(
  { sku: 1 }, 
  { unique: true, name: "idx_sku_unique" }
);

// Compound index for category browsing
db.products.createIndex(
  { category: 1, subcategory: 1 },
  { name: "idx_category_subcategory" }
);

// Index for price range queries
db.products.createIndex(
  { price: 1 },
  { name: "idx_price" }
);

// Full-text search index for product discovery
db.products.createIndex(
  { name: "text", description: "text", tags: "text" },
  { 
    name: "idx_fulltext_search",
    weights: {
      name: 10,
      tags: 5,
      description: 1
    },
    default_language: "english"
  }
);

// Compound index for active products by category
db.products.createIndex(
  { is_active: 1, category: 1, "ratings.average": -1 },
  { name: "idx_active_category_rating" }
);

// Index for inventory management
db.products.createIndex(
  { "inventory.quantity": 1 },
  { 
    name: "idx_inventory_quantity",
    partialFilterExpression: { "inventory.quantity": { $lt: 50 } }
  }
);

// Compound index for popular products
db.products.createIndex(
  { is_active: 1, "ratings.average": -1, "ratings.count": -1 },
  { name: "idx_popular_products" }
);

print("✅ Products collection created successfully");
print("✅ Validation schema applied");
print("✅ Indexes created:");
print("   - Unique index on sku");
print("   - Compound index on category and subcategory");
print("   - Index on price");
print("   - Full-text search index on name, description, and tags");
print("   - Compound index for active products");
print("   - Partial index on low inventory");
print("   - Compound index for popular products");
