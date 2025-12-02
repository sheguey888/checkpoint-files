// MongoDB Script: Analytics Collections Setup
// Database: ecommerce_db
// Purpose: Create pre-aggregated collections for fast analytics queries

use ecommerce_db;

print("📊 Setting up Analytics Collections...\n");

// ============================================
// 1. PRODUCT ANALYTICS COLLECTION
// ============================================

print("📦 Creating Product Analytics Collection...");

db.product_analytics.drop();

db.createCollection("product_analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["product_id", "sku", "period", "metrics"],
      properties: {
        product_id: {
          bsonType: "objectId",
          description: "Reference to product"
        },
        sku: {
          bsonType: "string"
        },
        name: {
          bsonType: "string"
        },
        category: {
          bsonType: "string"
        },
        period: {
          bsonType: "string",
          pattern: "^[0-9]{4}-[0-9]{2}$",
          description: "Period in YYYY-MM format"
        },
        period_start: {
          bsonType: "date"
        },
        period_end: {
          bsonType: "date"
        },
        metrics: {
          bsonType: "object",
          required: ["total_orders", "total_quantity_sold", "total_revenue"],
          properties: {
            total_orders: { bsonType: "int", minimum: 0 },
            total_quantity_sold: { bsonType: "int", minimum: 0 },
            total_revenue: { bsonType: "double", minimum: 0 },
            average_order_value: { bsonType: "double", minimum: 0 },
            unique_customers: { bsonType: "int", minimum: 0 }
          }
        },
        daily_breakdown: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              date: { bsonType: "string" },
              orders: { bsonType: "int" },
              quantity: { bsonType: "int" },
              revenue: { bsonType: "double" }
            }
          }
        },
        top_customers: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              user_id: { bsonType: "objectId" },
              total_spent: { bsonType: "double" },
              order_count: { bsonType: "int" }
            }
          }
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});

// Indexes for product analytics
db.product_analytics.createIndex(
  { period: -1 },
  { name: "idx_period" }
);

db.product_analytics.createIndex(
  { product_id: 1, period: -1 },
  { name: "idx_product_period" }
);

db.product_analytics.createIndex(
  { "metrics.total_revenue": -1 },
  { name: "idx_revenue" }
);

db.product_analytics.createIndex(
  { category: 1, period: -1 },
  { name: "idx_category_period" }
);

db.product_analytics.createIndex(
  { "metrics.total_orders": -1 },
  { name: "idx_orders" }
);

print("✅ Product Analytics collection created with indexes\n");

// ============================================
// 2. SALES ANALYTICS COLLECTION
// ============================================

print("📦 Creating Sales Analytics Collection...");

db.sales_analytics.drop();

db.createCollection("sales_analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["period", "totals"],
      properties: {
        period: {
          bsonType: "string",
          pattern: "^[0-9]{4}-[0-9]{2}$"
        },
        period_start: { bsonType: "date" },
        period_end: { bsonType: "date" },
        totals: {
          bsonType: "object",
          required: ["total_orders", "total_revenue"],
          properties: {
            total_orders: { bsonType: "int", minimum: 0 },
            total_revenue: { bsonType: "double", minimum: 0 },
            total_customers: { bsonType: "int", minimum: 0 },
            average_order_value: { bsonType: "double", minimum: 0 }
          }
        },
        by_category: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              category: { bsonType: "string" },
              orders: { bsonType: "int" },
              revenue: { bsonType: "double" },
              percentage: { bsonType: "double" }
            }
          }
        },
        by_payment_method: {
          bsonType: "array"
        },
        top_products: {
          bsonType: "array",
          maxItems: 100
        },
        daily_trend: {
          bsonType: "array"
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});

// Indexes for sales analytics
db.sales_analytics.createIndex(
  { period: -1 },
  { name: "idx_period", unique: true }
);

db.sales_analytics.createIndex(
  { period_start: 1, period_end: 1 },
  { name: "idx_date_range" }
);

db.sales_analytics.createIndex(
  { "totals.total_revenue": -1 },
  { name: "idx_revenue" }
);

print("✅ Sales Analytics collection created with indexes\n");

// ============================================
// 3. CUSTOMER ANALYTICS COLLECTION
// ============================================

print("📦 Creating Customer Analytics Collection...");

db.customer_analytics.drop();

db.createCollection("customer_analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "email", "customer_segment", "lifetime_metrics"],
      properties: {
        user_id: {
          bsonType: "objectId"
        },
        email: {
          bsonType: "string"
        },
        customer_segment: {
          enum: ["new", "regular", "high_value", "vip", "at_risk", "churned"],
          description: "Customer segmentation"
        },
        lifetime_metrics: {
          bsonType: "object",
          required: ["total_orders", "total_spent"],
          properties: {
            total_orders: { bsonType: "int", minimum: 0 },
            total_spent: { bsonType: "double", minimum: 0 },
            average_order_value: { bsonType: "double", minimum: 0 },
            first_order_date: { bsonType: "date" },
            last_order_date: { bsonType: "date" },
            days_as_customer: { bsonType: "int", minimum: 0 }
          }
        },
        behavior: {
          bsonType: "object",
          properties: {
            favorite_categories: { bsonType: "array" },
            preferred_payment_method: { bsonType: "string" },
            average_items_per_order: { bsonType: "double" },
            return_rate: { bsonType: "double", minimum: 0, maximum: 1 }
          }
        },
        rfm_score: {
          bsonType: "object",
          properties: {
            recency: { bsonType: "int", minimum: 1, maximum: 5 },
            frequency: { bsonType: "int", minimum: 1, maximum: 5 },
            monetary: { bsonType: "int", minimum: 1, maximum: 5 },
            total: { bsonType: "int", minimum: 3, maximum: 15 }
          }
        },
        updated_at: { bsonType: "date" }
      }
    }
  }
});

// Indexes for customer analytics
db.customer_analytics.createIndex(
  { user_id: 1 },
  { name: "idx_user_id", unique: true }
);

db.customer_analytics.createIndex(
  { customer_segment: 1 },
  { name: "idx_segment" }
);

db.customer_analytics.createIndex(
  { "rfm_score.total": -1 },
  { name: "idx_rfm_score" }
);

db.customer_analytics.createIndex(
  { "lifetime_metrics.total_spent": -1 },
  { name: "idx_total_spent" }
);

db.customer_analytics.createIndex(
  { "lifetime_metrics.last_order_date": -1 },
  { name: "idx_last_order" }
);

print("✅ Customer Analytics collection created with indexes\n");

// ============================================
// 4. CREATE AGGREGATION PIPELINE EXAMPLES
// ============================================

print("📊 Creating Aggregation Pipeline Functions...\n");

// Function to aggregate product analytics
print("Example: Aggregate Product Analytics for Current Month");
print(`
db.orders.aggregate([
  {
    $match: {
      created_at: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      }
    }
  },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.product_id",
      sku: { $first: "$items.sku" },
      name: { $first: "$items.name" },
      total_orders: { $sum: 1 },
      total_quantity_sold: { $sum: "$items.quantity" },
      total_revenue: { $sum: "$items.subtotal" },
      unique_customers: { $addToSet: "$user_id" }
    }
  },
  {
    $project: {
      product_id: "$_id",
      sku: 1,
      name: 1,
      period: { $dateToString: { format: "%Y-%m", date: new Date() } },
      metrics: {
        total_orders: "$total_orders",
        total_quantity_sold: "$total_quantity_sold",
        total_revenue: "$total_revenue",
        average_order_value: { $divide: ["$total_revenue", "$total_orders"] },
        unique_customers: { $size: "$unique_customers" }
      },
      created_at: new Date(),
      updated_at: new Date()
    }
  },
  { $out: "product_analytics" }
]);
`);

// Function to aggregate sales analytics
print("\nExample: Aggregate Sales Analytics");
print(`
db.orders.aggregate([
  {
    $match: {
      created_at: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      }
    }
  },
  {
    $group: {
      _id: null,
      total_orders: { $sum: 1 },
      total_revenue: { $sum: "$totals.total" },
      unique_customers: { $addToSet: "$user_id" }
    }
  },
  {
    $project: {
      _id: 0,
      period: { $dateToString: { format: "%Y-%m", date: new Date() } },
      totals: {
        total_orders: "$total_orders",
        total_revenue: "$total_revenue",
        total_customers: { $size: "$unique_customers" },
        average_order_value: { $divide: ["$total_revenue", "$total_orders"] }
      },
      created_at: new Date(),
      updated_at: new Date()
    }
  }
]);
`);

// ============================================
// 5. TTL INDEXES FOR AUTOMATIC CLEANUP
// ============================================

print("\n🗑️ Creating TTL Indexes for automatic cleanup...");

// Keep product analytics for 24 months
db.product_analytics.createIndex(
  { created_at: 1 },
  { 
    name: "idx_ttl",
    expireAfterSeconds: 63072000  // 24 months in seconds
  }
);

// Keep sales analytics for 36 months
db.sales_analytics.createIndex(
  { created_at: 1 },
  { 
    name: "idx_ttl",
    expireAfterSeconds: 94608000  // 36 months in seconds
  }
);

print("✅ TTL indexes created for automatic data cleanup\n");

// ============================================
// 6. SUMMARY
// ============================================

print("📋 Summary:");
print(`   - Product Analytics: ${db.product_analytics.countDocuments()} documents`);
print(`   - Sales Analytics: ${db.sales_analytics.countDocuments()} documents`);
print(`   - Customer Analytics: ${db.customer_analytics.countDocuments()} documents`);

print("\n✅ Analytics collections setup completed!");
print("\n💡 Next Steps:");
print("   1. Run aggregation pipelines to populate analytics");
print("   2. Schedule periodic updates (e.g., nightly)");
print("   3. Set up change streams for real-time updates");
print("   4. Create views for common analytics queries");
print("   5. Connect BI tools to analytics collections");
