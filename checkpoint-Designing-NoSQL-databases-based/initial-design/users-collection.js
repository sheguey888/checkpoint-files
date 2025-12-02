// MongoDB Script: Users Collection Setup
// Database: ecommerce_db
// Collection: users

// Switch to database
use ecommerce_db;

// Drop existing collection (for clean setup)
db.users.drop();

// Create users collection with validation schema
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password_hash", "first_name", "last_name", "created_at"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "must be a valid email address and is required"
        },
        password_hash: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        first_name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        last_name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        phone: {
          bsonType: "string",
          description: "must be a string if provided"
        },
        addresses: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["type", "street", "city", "state", "zip", "country"],
            properties: {
              type: {
                enum: ["shipping", "billing"],
                description: "must be either shipping or billing"
              },
              street: { bsonType: "string" },
              city: { bsonType: "string" },
              state: { bsonType: "string" },
              zip: { bsonType: "string" },
              country: { bsonType: "string" },
              is_default: { bsonType: "bool" }
            }
          }
        },
        created_at: {
          bsonType: "date",
          description: "must be a date and is required"
        },
        updated_at: {
          bsonType: "date",
          description: "must be a date"
        }
      }
    }
  }
});

// Create indexes
// Unique index on email for authentication
db.users.createIndex({ email: 1 }, { unique: true, name: "idx_email_unique" });

// Index for date-based queries
db.users.createIndex({ created_at: -1 }, { name: "idx_created_at" });

// Compound index for active user queries
db.users.createIndex({ created_at: -1, email: 1 }, { name: "idx_created_email" });

print("✅ Users collection created successfully");
print("✅ Validation schema applied");
print("✅ Indexes created:");
print("   - Unique index on email");
print("   - Index on created_at");
print("   - Compound index on created_at and email");
