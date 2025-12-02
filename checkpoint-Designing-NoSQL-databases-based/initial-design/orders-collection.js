// MongoDB Script: Orders Collection Setup
// Database: ecommerce_db
// Collection: orders

// Switch to database
use ecommerce_db;

// Drop existing collection (for clean setup)
db.orders.drop();

// Create orders collection with validation schema
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["order_number", "user_id", "customer_info", "items", "totals", "status", "created_at"],
      properties: {
        order_number: {
          bsonType: "string",
          pattern: "^ORD-[0-9]{4}-[0-9]{6}$",
          description: "must match pattern ORD-YYYY-NNNNNN"
        },
        user_id: {
          bsonType: "objectId",
          description: "must be a valid ObjectId and is required"
        },
        customer_info: {
          bsonType: "object",
          required: ["email", "first_name", "last_name"],
          properties: {
            email: { bsonType: "string" },
            first_name: { bsonType: "string" },
            last_name: { bsonType: "string" },
            phone: { bsonType: "string" }
          }
        },
        items: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["product_id", "sku", "name", "quantity", "unit_price", "subtotal"],
            properties: {
              product_id: { bsonType: "objectId" },
              sku: { bsonType: "string" },
              name: { bsonType: "string" },
              quantity: {
                bsonType: "int",
                minimum: 1
              },
              unit_price: {
                bsonType: "double",
                minimum: 0
              },
              subtotal: {
                bsonType: "double",
                minimum: 0
              }
            }
          }
        },
        totals: {
          bsonType: "object",
          required: ["subtotal", "tax", "shipping", "total"],
          properties: {
            subtotal: {
              bsonType: "double",
              minimum: 0
            },
            tax: {
              bsonType: "double",
              minimum: 0
            },
            shipping: {
              bsonType: "double",
              minimum: 0
            },
            discount: {
              bsonType: "double",
              minimum: 0
            },
            total: {
              bsonType: "double",
              minimum: 0
            }
          }
        },
        shipping_address: {
          bsonType: "object",
          required: ["street", "city", "state", "zip", "country"],
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            zip: { bsonType: "string" },
            country: { bsonType: "string" }
          }
        },
        payment: {
          bsonType: "object",
          required: ["method", "status"],
          properties: {
            method: {
              enum: ["credit_card", "debit_card", "paypal", "bank_transfer"],
              description: "must be a valid payment method"
            },
            status: {
              enum: ["pending", "completed", "failed", "refunded"],
              description: "must be a valid payment status"
            },
            transaction_id: { bsonType: "string" },
            paid_at: { bsonType: "date" }
          }
        },
        status: {
          enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
          description: "must be a valid order status"
        },
        status_history: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["status", "timestamp"],
            properties: {
              status: { bsonType: "string" },
              timestamp: { bsonType: "date" },
              note: { bsonType: "string" }
            }
          }
        },
        delivery: {
          bsonType: "object",
          properties: {
            status: {
              enum: ["pending", "in_transit", "delivered", "failed"],
              description: "must be a valid delivery status"
            },
            carrier: { bsonType: "string" },
            tracking_number: { bsonType: "string" },
            estimated_delivery: { bsonType: "date" },
            actual_delivery: { bsonType: "date" }
          }
        },
        created_at: {
          bsonType: "date",
          description: "must be a date and is required"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Create indexes for optimized queries
// Unique index on order_number
db.orders.createIndex(
  { order_number: 1 },
  { unique: true, name: "idx_order_number_unique" }
);

// Compound index for user's order history
db.orders.createIndex(
  { user_id: 1, created_at: -1 },
  { name: "idx_user_orders" }
);

// Index for order status queries
db.orders.createIndex(
  { status: 1, created_at: -1 },
  { name: "idx_status_date" }
);

// Index for delivery status tracking
db.orders.createIndex(
  { "delivery.status": 1, "delivery.estimated_delivery": 1 },
  { name: "idx_delivery_status" }
);

// Index for payment status
db.orders.createIndex(
  { "payment.status": 1, created_at: -1 },
  { name: "idx_payment_status" }
);

// Index for date range queries and analytics
db.orders.createIndex(
  { created_at: -1 },
  { name: "idx_created_at" }
);

// Compound index for user's recent orders
db.orders.createIndex(
  { user_id: 1, status: 1, created_at: -1 },
  { name: "idx_user_status_date" }
);

// Index for tracking number lookups
db.orders.createIndex(
  { "delivery.tracking_number": 1 },
  { 
    name: "idx_tracking_number",
    sparse: true
  }
);

print("✅ Orders collection created successfully");
print("✅ Validation schema applied");
print("✅ Indexes created:");
print("   - Unique index on order_number");
print("   - Compound index on user_id and created_at");
print("   - Compound index on status and created_at");
print("   - Compound index on delivery.status and delivery.estimated_delivery");
print("   - Compound index on payment.status and created_at");
print("   - Index on created_at for date range queries");
print("   - Compound index on user_id, status, and created_at");
print("   - Sparse index on delivery.tracking_number");
