// MongoDB Script: Sample Data Generation
// Database: ecommerce_db
// Purpose: Populate collections with realistic sample data

// Switch to database
use ecommerce_db;

print("🔄 Inserting sample data...\n");

// ============================================
// 1. INSERT SAMPLE USERS
// ============================================
print("📦 Inserting users...");

const users = [
  {
    email: "john.doe@example.com",
    password_hash: "$2b$10$abcdefghijklmnopqrstuvwxyz123456", // Hashed password
    first_name: "John",
    last_name: "Doe",
    phone: "+1-555-0101",
    addresses: [
      {
        type: "shipping",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
        is_default: true
      },
      {
        type: "billing",
        street: "456 Park Avenue",
        city: "New York",
        state: "NY",
        zip: "10002",
        country: "USA",
        is_default: false
      }
    ],
    created_at: new Date("2024-01-15T10:00:00Z"),
    updated_at: new Date("2024-01-15T10:00:00Z")
  },
  {
    email: "jane.smith@example.com",
    password_hash: "$2b$10$zyxwvutsrqponmlkjihgfedcba654321",
    first_name: "Jane",
    last_name: "Smith",
    phone: "+1-555-0102",
    addresses: [
      {
        type: "shipping",
        street: "789 Oak Lane",
        city: "Los Angeles",
        state: "CA",
        zip: "90001",
        country: "USA",
        is_default: true
      }
    ],
    created_at: new Date("2024-02-20T14:30:00Z"),
    updated_at: new Date("2024-02-20T14:30:00Z")
  },
  {
    email: "mike.johnson@example.com",
    password_hash: "$2b$10$1234567890abcdefghijklmnopqrstuv",
    first_name: "Mike",
    last_name: "Johnson",
    phone: "+1-555-0103",
    addresses: [
      {
        type: "shipping",
        street: "321 Elm Street",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        country: "USA",
        is_default: true
      }
    ],
    created_at: new Date("2024-03-10T09:15:00Z"),
    updated_at: new Date("2024-03-10T09:15:00Z")
  }
];

const insertedUsers = db.users.insertMany(users);
print(`✅ Inserted ${insertedUsers.insertedIds.length} users\n`);

// Store user IDs for reference
const userIds = Object.values(insertedUsers.insertedIds);

// ============================================
// 2. INSERT SAMPLE PRODUCTS
// ============================================
print("📦 Inserting products...");

const products = [
  {
    sku: "ELEC-WH-001",
    name: "Premium Wireless Headphones",
    description: "High-quality noise-canceling wireless headphones with 30-hour battery life and premium sound quality",
    category: "Electronics",
    subcategory: "Audio",
    price: 299.99,
    currency: "USD",
    inventory: {
      quantity: 150,
      warehouse_location: "WH-NY-001",
      reorder_level: 20
    },
    attributes: {
      brand: "AudioTech",
      color: "Black",
      weight: "250g",
      warranty: "2 years",
      bluetooth_version: "5.0"
    },
    images: [
      "https://cdn.example.com/products/elec-wh-001/main.jpg",
      "https://cdn.example.com/products/elec-wh-001/side.jpg"
    ],
    ratings: {
      average: 4.5,
      count: 1250
    },
    tags: ["wireless", "bluetooth", "noise-canceling", "premium", "audio"],
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
    is_active: true
  },
  {
    sku: "ELEC-LP-001",
    name: "Ultra-Light Laptop",
    description: "Powerful 14-inch laptop with Intel i7 processor, 16GB RAM, and 512GB SSD. Perfect for professionals on the go",
    category: "Electronics",
    subcategory: "Computers",
    price: 1299.99,
    currency: "USD",
    inventory: {
      quantity: 75,
      warehouse_location: "WH-CA-001",
      reorder_level: 10
    },
    attributes: {
      brand: "TechBook",
      processor: "Intel Core i7",
      ram: "16GB",
      storage: "512GB SSD",
      screen_size: "14 inches",
      weight: "1.2kg",
      warranty: "1 year"
    },
    images: [
      "https://cdn.example.com/products/elec-lp-001/main.jpg"
    ],
    ratings: {
      average: 4.7,
      count: 890
    },
    tags: ["laptop", "computer", "portable", "professional", "intel"],
    created_at: new Date("2024-01-05T00:00:00Z"),
    updated_at: new Date("2024-01-05T00:00:00Z"),
    is_active: true
  },
  {
    sku: "FASH-TS-001",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors",
    category: "Fashion",
    subcategory: "Clothing",
    price: 29.99,
    currency: "USD",
    inventory: {
      quantity: 500,
      warehouse_location: "WH-TX-001",
      reorder_level: 100
    },
    attributes: {
      brand: "EcoWear",
      material: "100% Organic Cotton",
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Black", "Navy", "Gray"],
      care: "Machine wash cold"
    },
    images: [
      "https://cdn.example.com/products/fash-ts-001/white.jpg",
      "https://cdn.example.com/products/fash-ts-001/black.jpg"
    ],
    ratings: {
      average: 4.3,
      count: 2100
    },
    tags: ["t-shirt", "organic", "cotton", "sustainable", "casual"],
    created_at: new Date("2024-01-10T00:00:00Z"),
    updated_at: new Date("2024-01-10T00:00:00Z"),
    is_active: true
  },
  {
    sku: "HOME-CF-001",
    name: "Smart Coffee Maker",
    description: "WiFi-enabled coffee maker with app control. Schedule your brew from anywhere",
    category: "Home",
    subcategory: "Kitchen",
    price: 149.99,
    currency: "USD",
    inventory: {
      quantity: 200,
      warehouse_location: "WH-IL-001",
      reorder_level: 30
    },
    attributes: {
      brand: "BrewMaster",
      capacity: "12 cups",
      features: ["WiFi", "Timer", "Auto-shutoff"],
      warranty: "1 year"
    },
    images: [
      "https://cdn.example.com/products/home-cf-001/main.jpg"
    ],
    ratings: {
      average: 4.4,
      count: 560
    },
    tags: ["coffee", "smart", "kitchen", "wifi", "appliance"],
    created_at: new Date("2024-01-12T00:00:00Z"),
    updated_at: new Date("2024-01-12T00:00:00Z"),
    is_active: true
  },
  {
    sku: "SPORT-SH-001",
    name: "Running Shoes - Pro Series",
    description: "Professional running shoes with advanced cushioning and support. Ideal for long-distance runners",
    category: "Sports",
    subcategory: "Footwear",
    price: 129.99,
    currency: "USD",
    inventory: {
      quantity: 300,
      warehouse_location: "WH-FL-001",
      reorder_level: 50
    },
    attributes: {
      brand: "RunFast",
      sizes: ["7", "8", "9", "10", "11", "12"],
      colors: ["Blue", "Red", "Black"],
      weight: "250g per shoe"
    },
    images: [
      "https://cdn.example.com/products/sport-sh-001/blue.jpg"
    ],
    ratings: {
      average: 4.6,
      count: 1580
    },
    tags: ["running", "shoes", "sports", "fitness", "athletic"],
    created_at: new Date("2024-01-15T00:00:00Z"),
    updated_at: new Date("2024-01-15T00:00:00Z"),
    is_active: true
  }
];

const insertedProducts = db.products.insertMany(products);
print(`✅ Inserted ${insertedProducts.insertedIds.length} products\n`);

// Store product IDs for reference
const productIds = Object.values(insertedProducts.insertedIds);

// ============================================
// 3. INSERT SAMPLE ORDERS
// ============================================
print("📦 Inserting orders...");

const orders = [
  {
    order_number: "ORD-2024-000001",
    user_id: userIds[0],
    customer_info: {
      email: "john.doe@example.com",
      first_name: "John",
      last_name: "Doe",
      phone: "+1-555-0101"
    },
    items: [
      {
        product_id: productIds[0],
        sku: "ELEC-WH-001",
        name: "Premium Wireless Headphones",
        quantity: 1,
        unit_price: 299.99,
        subtotal: 299.99
      }
    ],
    totals: {
      subtotal: 299.99,
      tax: 24.00,
      shipping: 10.00,
      discount: 0.00,
      total: 333.99
    },
    shipping_address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA"
    },
    payment: {
      method: "credit_card",
      status: "completed",
      transaction_id: "TXN-2024-001",
      paid_at: new Date("2024-03-15T10:30:00Z")
    },
    status: "delivered",
    status_history: [
      {
        status: "pending",
        timestamp: new Date("2024-03-15T10:30:00Z"),
        note: "Order placed"
      },
      {
        status: "processing",
        timestamp: new Date("2024-03-15T11:00:00Z"),
        note: "Payment confirmed"
      },
      {
        status: "shipped",
        timestamp: new Date("2024-03-16T09:00:00Z"),
        note: "Package dispatched"
      },
      {
        status: "delivered",
        timestamp: new Date("2024-03-18T14:30:00Z"),
        note: "Package delivered"
      }
    ],
    delivery: {
      status: "delivered",
      carrier: "FedEx",
      tracking_number: "FDX123456789",
      estimated_delivery: new Date("2024-03-18T00:00:00Z"),
      actual_delivery: new Date("2024-03-18T14:30:00Z")
    },
    created_at: new Date("2024-03-15T10:30:00Z"),
    updated_at: new Date("2024-03-18T14:30:00Z")
  },
  {
    order_number: "ORD-2024-000002",
    user_id: userIds[1],
    customer_info: {
      email: "jane.smith@example.com",
      first_name: "Jane",
      last_name: "Smith",
      phone: "+1-555-0102"
    },
    items: [
      {
        product_id: productIds[1],
        sku: "ELEC-LP-001",
        name: "Ultra-Light Laptop",
        quantity: 1,
        unit_price: 1299.99,
        subtotal: 1299.99
      },
      {
        product_id: productIds[2],
        sku: "FASH-TS-001",
        name: "Organic Cotton T-Shirt",
        quantity: 2,
        unit_price: 29.99,
        subtotal: 59.98
      }
    ],
    totals: {
      subtotal: 1359.97,
      tax: 108.80,
      shipping: 0.00,
      discount: 50.00,
      total: 1418.77
    },
    shipping_address: {
      street: "789 Oak Lane",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA"
    },
    payment: {
      method: "paypal",
      status: "completed",
      transaction_id: "PP-2024-002",
      paid_at: new Date("2024-04-01T15:20:00Z")
    },
    status: "shipped",
    status_history: [
      {
        status: "pending",
        timestamp: new Date("2024-04-01T15:20:00Z"),
        note: "Order placed"
      },
      {
        status: "processing",
        timestamp: new Date("2024-04-01T16:00:00Z"),
        note: "Payment confirmed"
      },
      {
        status: "shipped",
        timestamp: new Date("2024-04-02T10:00:00Z"),
        note: "Package dispatched"
      }
    ],
    delivery: {
      status: "in_transit",
      carrier: "UPS",
      tracking_number: "UPS987654321",
      estimated_delivery: new Date("2024-04-05T00:00:00Z"),
      actual_delivery: null
    },
    created_at: new Date("2024-04-01T15:20:00Z"),
    updated_at: new Date("2024-04-02T10:00:00Z")
  },
  {
    order_number: "ORD-2024-000003",
    user_id: userIds[2],
    customer_info: {
      email: "mike.johnson@example.com",
      first_name: "Mike",
      last_name: "Johnson",
      phone: "+1-555-0103"
    },
    items: [
      {
        product_id: productIds[3],
        sku: "HOME-CF-001",
        name: "Smart Coffee Maker",
        quantity: 1,
        unit_price: 149.99,
        subtotal: 149.99
      },
      {
        product_id: productIds[4],
        sku: "SPORT-SH-001",
        name: "Running Shoes - Pro Series",
        quantity: 1,
        unit_price: 129.99,
        subtotal: 129.99
      }
    ],
    totals: {
      subtotal: 279.98,
      tax: 22.40,
      shipping: 15.00,
      discount: 0.00,
      total: 317.38
    },
    shipping_address: {
      street: "321 Elm Street",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA"
    },
    payment: {
      method: "credit_card",
      status: "completed",
      transaction_id: "TXN-2024-003",
      paid_at: new Date("2024-11-28T09:45:00Z")
    },
    status: "processing",
    status_history: [
      {
        status: "pending",
        timestamp: new Date("2024-11-28T09:45:00Z"),
        note: "Order placed"
      },
      {
        status: "processing",
        timestamp: new Date("2024-11-28T10:00:00Z"),
        note: "Payment confirmed"
      }
    ],
    delivery: {
      status: "pending",
      carrier: null,
      tracking_number: null,
      estimated_delivery: new Date("2024-12-03T00:00:00Z"),
      actual_delivery: null
    },
    created_at: new Date("2024-11-28T09:45:00Z"),
    updated_at: new Date("2024-11-28T10:00:00Z")
  }
];

const insertedOrders = db.orders.insertMany(orders);
print(`✅ Inserted ${insertedOrders.insertedIds.length} orders\n`);

// ============================================
// 4. DISPLAY SUMMARY
// ============================================
print("\n📊 Database Summary:");
print(`   Users: ${db.users.countDocuments()}`);
print(`   Products: ${db.products.countDocuments()}`);
print(`   Orders: ${db.orders.countDocuments()}`);

print("\n✅ Sample data inserted successfully!");
print("\n💡 Sample Queries:");
print("   - Find active products: db.products.find({is_active: true})");
print("   - Search products: db.products.find({$text: {$search: 'wireless'}})");
print("   - User orders: db.orders.find({user_id: ObjectId('...')})");
print("   - Pending orders: db.orders.find({status: 'processing'})");
