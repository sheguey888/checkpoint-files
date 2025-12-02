# Initial NoSQL Database Schema Design

## Overview

This initial design focuses on meeting the core e-commerce requirements:

- Fast product browsing and searching
- Efficient order management
- High write throughput (thousands of transactions per second)
- Data consistency for order status

## Database Choice: MongoDB (Document-based NoSQL)

### Rationale

1. **Flexible Schema**: Products have varying attributes (clothing vs electronics)
2. **Rich Queries**: Support for complex search patterns
3. **Atomic Operations**: Document-level atomicity for order consistency
4. **Horizontal Scaling**: Native sharding support for future growth
5. **Full-Text Search**: Built-in text search for product discovery

## Collections Design

### 1. Users Collection

```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  password_hash: "hashed_password",
  first_name: "John",
  last_name: "Doe",
  phone: "+1234567890",
  addresses: [
    {
      type: "shipping",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      is_default: true
    }
  ],
  created_at: ISODate("2025-01-01T00:00:00Z"),
  updated_at: ISODate("2025-01-01T00:00:00Z")
}
```

**Design Decisions**:

- Embedded addresses for atomic reads/writes
- Email as unique identifier for authentication
- Addresses array supports multiple shipping locations
- Timestamps for audit trail

### 2. Products Collection

```javascript
{
  _id: ObjectId("..."),
  sku: "PROD-12345",
  name: "Wireless Headphones",
  description: "Premium noise-canceling wireless headphones with 30-hour battery life",
  category: "Electronics",
  subcategory: "Audio",
  price: 299.99,
  currency: "USD",
  inventory: {
    quantity: 150,
    warehouse_location: "WH-001",
    reorder_level: 20
  },
  attributes: {
    brand: "TechBrand",
    color: "Black",
    weight: "250g",
    warranty: "2 years"
  },
  images: [
    "https://cdn.example.com/products/12345/main.jpg",
    "https://cdn.example.com/products/12345/side.jpg"
  ],
  ratings: {
    average: 4.5,
    count: 1250
  },
  tags: ["wireless", "bluetooth", "noise-canceling", "premium"],
  created_at: ISODate("2025-01-01T00:00:00Z"),
  updated_at: ISODate("2025-01-01T00:00:00Z"),
  is_active: true
}
```

**Design Decisions**:

- Denormalized inventory for fast reads
- Flexible attributes object for product-specific properties
- Tags array for search optimization
- Pre-calculated ratings for quick display
- `is_active` flag for soft deletes

### 3. Orders Collection

```javascript
{
  _id: ObjectId("..."),
  order_number: "ORD-2025-001234",
  user_id: ObjectId("..."),
  customer_info: {
    email: "user@example.com",
    first_name: "John",
    last_name: "Doe",
    phone: "+1234567890"
  },
  items: [
    {
      product_id: ObjectId("..."),
      sku: "PROD-12345",
      name: "Wireless Headphones",
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
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA"
  },
  payment: {
    method: "credit_card",
    status: "completed",
    transaction_id: "TXN-12345",
    paid_at: ISODate("2025-01-01T10:00:00Z")
  },
  status: "processing",
  status_history: [
    {
      status: "pending",
      timestamp: ISODate("2025-01-01T10:00:00Z"),
      note: "Order placed"
    },
    {
      status: "processing",
      timestamp: ISODate("2025-01-01T10:05:00Z"),
      note: "Payment confirmed"
    }
  ],
  delivery: {
    status: "pending",
    carrier: null,
    tracking_number: null,
    estimated_delivery: ISODate("2025-01-05T00:00:00Z"),
    actual_delivery: null
  },
  created_at: ISODate("2025-01-01T10:00:00Z"),
  updated_at: ISODate("2025-01-01T10:05:00Z")
}
```

**Design Decisions**:

- Embedded customer info for historical accuracy (even if user updates profile)
- Embedded order items with denormalized product details for consistency
- Pre-calculated totals for performance
- Status history array for audit trail
- Separate payment and delivery tracking
- Order-level atomicity ensures consistency

## Indexes

### Users Collection

```javascript
// Unique index for authentication
{
  email: 1;
} // unique

// Query by creation date
{
  created_at: -1;
}
```

### Products Collection

```javascript
// Unique SKU
{ sku: 1 } // unique

// Category browsing
{ category: 1, subcategory: 1 }

// Price range queries
{ price: 1 }

// Full-text search
{ name: "text", description: "text", tags: "text" }

// Active products
{ is_active: 1, category: 1 }

// Inventory management
{ "inventory.quantity": 1 }
```

### Orders Collection

```javascript
// User's order history
{ user_id: 1, created_at: -1 }

// Order lookup
{ order_number: 1 } // unique

// Status filtering
{ status: 1, created_at: -1 }

// Delivery status
{ "delivery.status": 1 }

// Payment status
{ "payment.status": 1 }

// Date range queries
{ created_at: -1 }
```

## Query Patterns

### Common Queries

1. **Product Search**:

```javascript
db.products
  .find({
    $text: { $search: "wireless headphones" },
    is_active: true,
    price: { $gte: 100, $lte: 500 },
  })
  .sort({ "ratings.average": -1 });
```

2. **User Order History**:

```javascript
db.orders
  .find({
    user_id: ObjectId("..."),
  })
  .sort({ created_at: -1 });
```

3. **Order Status Update**:

```javascript
db.orders.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      status: "shipped",
      updated_at: new Date(),
    },
    $push: {
      status_history: {
        status: "shipped",
        timestamp: new Date(),
        note: "Package dispatched",
      },
    },
  }
);
```

4. **Product by Category**:

```javascript
db.products
  .find({
    category: "Electronics",
    is_active: true,
  })
  .sort({ "ratings.average": -1 });
```

5. **Low Inventory Alert**:

```javascript
db.products.find({
  $expr: { $lt: ["$inventory.quantity", "$inventory.reorder_level"] },
});
```

## Scalability Considerations

### Write Throughput

- **Document-level atomicity**: Each order write is atomic
- **No joins**: All order data self-contained
- **Optimistic concurrency**: Version field can be added if needed

### Read Performance

- **Indexes**: Cover common query patterns
- **Denormalization**: Avoid joins for product details in orders
- **Text search**: Native MongoDB full-text search

### Consistency

- **Order atomicity**: All order data updated in single operation
- **Status history**: Maintains audit trail
- **Embedded documents**: Prevent inconsistencies from related data changes

## Trade-offs

### Advantages

✅ Fast reads (no joins needed)
✅ Atomic operations at document level
✅ Flexible schema for varying product types
✅ Full-text search built-in
✅ Simple to understand and maintain

### Limitations

⚠️ Data duplication (product details in orders)
⚠️ No cross-document transactions (MongoDB 4.0+ supports multi-document transactions)
⚠️ Large documents if order items grow significantly
⚠️ Limited analytics capabilities (no aggregations yet)
⚠️ Single-node bottleneck for writes

## Performance Targets

- **Product Search**: < 50ms for 95th percentile
- **Order Creation**: < 100ms for 95th percentile
- **Order Lookup**: < 20ms for 95th percentile
- **User Authentication**: < 30ms for 95th percentile
- **Write Throughput**: 1000+ orders/second per node

## Next Steps (Part 2)

To meet new requirements (analytics and high availability), we will need to:

1. Add sharding for horizontal scalability
2. Configure replica sets for high availability
3. Create analytics collections with pre-aggregated data
4. Implement read replicas for analytics queries
5. Add time-series data for trend analysis
