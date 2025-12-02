// MongoDB Script: Sharding Configuration
// Purpose: Configure sharded cluster for horizontal scalability

// ============================================
// 1. ENABLE SHARDING ON DATABASE
// ============================================

// Connect to mongos (router)
print("🔧 Configuring Sharded Cluster...\n");

// Switch to admin database
use admin;

// Enable sharding on the ecommerce_db database
sh.enableSharding("ecommerce_db");
print("✅ Sharding enabled on ecommerce_db\n");

// ============================================
// 2. SHARD ORDERS COLLECTION
// ============================================

print("📦 Configuring Orders Collection Sharding...");

// Use hashed sharding on _id for even distribution
sh.shardCollection(
  "ecommerce_db.orders",
  { _id: "hashed" },
  false,
  {
    numInitialChunks: 4  // Create 4 initial chunks for better distribution
  }
);

print("✅ Orders collection sharded on _id (hashed)");
print("   - Even distribution of writes");
print("   - Prevents hotspots");
print("   - Optimized for high write throughput\n");

// ============================================
// 3. SHARD PRODUCTS COLLECTION
// ============================================

print("📦 Configuring Products Collection Sharding...");

// Create index on shard key before sharding
use ecommerce_db;
db.products.createIndex({ category: 1 });

// Use range-based sharding on category
sh.shardCollection(
  "ecommerce_db.products",
  { category: 1 },
  false
);

print("✅ Products collection sharded on category (ranged)");
print("   - Co-locates products in same category");
print("   - Optimizes category browsing queries");
print("   - Targeted queries to specific shards\n");

// Optional: Define zones for popular categories
sh.addShardTag("shard0000", "electronics");
sh.addShardTag("shard0001", "fashion");

sh.addTagRange(
  "ecommerce_db.products",
  { category: "Electronics" },
  { category: "Electronics\uffff" },
  "electronics"
);

sh.addTagRange(
  "ecommerce_db.products",
  { category: "Fashion" },
  { category: "Fashion\uffff" },
  "fashion"
);

print("✅ Zone sharding configured for popular categories\n");

// ============================================
// 4. SHARD USERS COLLECTION
// ============================================

print("📦 Configuring Users Collection Sharding...");

// Create index on shard key
db.users.createIndex({ email: "hashed" });

// Use hashed sharding on email
sh.shardCollection(
  "ecommerce_db.users",
  { email: "hashed" },
  false,
  {
    numInitialChunks: 4
  }
);

print("✅ Users collection sharded on email (hashed)");
print("   - Even distribution of user data");
print("   - Fast user lookups");
print("   - Scales with user growth\n");

// ============================================
// 5. SHARD ANALYTICS COLLECTIONS
// ============================================

print("📦 Configuring Analytics Collections Sharding...");

// Product Analytics - shard by product_id and period
db.product_analytics.createIndex({ product_id: 1, period: 1 });
sh.shardCollection(
  "ecommerce_db.product_analytics",
  { product_id: 1, period: 1 },
  false
);
print("✅ Product analytics sharded on product_id and period");

// Sales Analytics - shard by period
db.sales_analytics.createIndex({ period: 1 });
sh.shardCollection(
  "ecommerce_db.sales_analytics",
  { period: 1 },
  false
);
print("✅ Sales analytics sharded on period");

// Customer Analytics - shard by user_id
db.customer_analytics.createIndex({ user_id: "hashed" });
sh.shardCollection(
  "ecommerce_db.customer_analytics",
  { user_id: "hashed" },
  false
);
print("✅ Customer analytics sharded on user_id\n");

// ============================================
// 6. VERIFY SHARDING STATUS
// ============================================

print("📊 Sharding Status:\n");

use admin;
const status = sh.status();

print("Sharded Collections:");
use ecommerce_db;
print("   - orders: " + db.orders.stats().sharded);
print("   - products: " + db.products.stats().sharded);
print("   - users: " + db.users.stats().sharded);
print("   - product_analytics: " + db.product_analytics.stats().sharded);
print("   - sales_analytics: " + db.sales_analytics.stats().sharded);
print("   - customer_analytics: " + db.customer_analytics.stats().sharded);

print("\n✅ Sharding configuration completed successfully!");

// ============================================
// 7. SHARD BALANCER CONFIGURATION
// ============================================

print("\n⚖️ Configuring Shard Balancer...");

use config;

// Configure balancer window (optional - run balancing during off-peak hours)
db.settings.updateOne(
  { _id: "balancer" },
  {
    $set: {
      activeWindow: {
        start: "01:00",  // 1 AM
        stop: "05:00"    // 5 AM
      },
      stopped: false
    }
  },
  { upsert: true }
);

print("✅ Balancer configured to run between 1 AM - 5 AM");

// Set chunk size (default is 64MB, can adjust based on needs)
db.settings.updateOne(
  { _id: "chunksize" },
  { $set: { value: 64 } },
  { upsert: true }
);

print("✅ Chunk size set to 64MB\n");

// ============================================
// 8. MONITORING COMMANDS
// ============================================

print("📝 Useful Monitoring Commands:");
print("   - sh.status() - View cluster status");
print("   - db.collection.getShardDistribution() - Check shard distribution");
print("   - sh.isBalancerRunning() - Check if balancer is running");
print("   - db.currentOp() - View running operations");
print("\n");

print("💡 Best Practices:");
print("   - Monitor chunk distribution regularly");
print("   - Use targeted queries when possible (include shard key)");
print("   - Avoid scatter-gather queries for better performance");
print("   - Keep shard keys immutable");
