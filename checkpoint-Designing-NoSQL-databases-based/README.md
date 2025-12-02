# NoSQL Database Design for E-Commerce Application

This project demonstrates the design and implementation of a NoSQL database schema for an e-commerce application, with iterations to meet evolving requirements.

## Project Overview

The exercise explores:

- Initial schema design for basic e-commerce functionality
- Refactored schema to support analytics and high availability
- Trade-offs between consistency, availability, and performance (CAP theorem)
- Sharding, replication, and denormalization strategies

## Project Structure

```
checkpoint-Designing-NoSQL-databases-based/
├── README.md                           # This file
├── initial-design/
│   ├── schema.md                       # Initial schema documentation
│   ├── users-collection.js             # Users collection schema
│   ├── products-collection.js          # Products collection schema
│   ├── orders-collection.js            # Orders collection schema
│   ├── indexes.js                      # Index definitions
│   └── sample-data.js                  # Sample data for testing
├── refactored-design/
│   ├── schema.md                       # Refactored schema documentation
│   ├── users-collection.js             # Updated users collection
│   ├── products-collection.js          # Updated products collection
│   ├── orders-collection.js            # Updated orders collection
│   ├── analytics-collection.js         # New analytics collection
│   ├── sharding-config.js              # Sharding configuration
│   ├── replication-config.js           # Replication setup
│   └── sample-data.js                  # Updated sample data
├── design-decisions.md                 # Detailed design rationale
└── reflection-report.md                # Personal reflection (200-300 words)
```

## Technology Choice

**Database**: MongoDB (Document-based NoSQL)

**Rationale**:

- Flexible schema supports varying product attributes
- Rich query capabilities for product search
- Horizontal scalability through sharding
- Strong community and tooling support
- Native support for full-text search
- Aggregation framework for analytics

## Requirements

### Initial Requirements (Part 1)

- ✅ Users can browse and search for products
- ✅ Orders stored with customer info, items, delivery status
- ✅ Support thousands of transactions per second
- ✅ Fast product lookups with full-text search
- ✅ High write throughput for orders
- ✅ Consistency in order status

### New Requirements (Part 2)

- ✅ Large-scale analytical queries for trends and sales
- ✅ High availability and partition tolerance
- ✅ Data distribution across multiple nodes (sharding)
- ✅ Data replication for fault tolerance
- ✅ Pre-aggregated data for fast analytics

## Quick Start

### Prerequisites

- MongoDB 6.0 or higher
- MongoDB Shell (mongosh)

### Initial Design Setup

```bash
# Start MongoDB
mongod --dbpath /data/db

# Initialize initial design
mongosh < initial-design/users-collection.js
mongosh < initial-design/products-collection.js
mongosh < initial-design/orders-collection.js
mongosh < initial-design/indexes.js
mongosh < initial-design/sample-data.js
```

### Refactored Design Setup

```bash
# Configure sharding
mongosh < refactored-design/sharding-config.js

# Configure replication
mongosh < refactored-design/replication-config.js

# Initialize refactored collections
mongosh < refactored-design/users-collection.js
mongosh < refactored-design/products-collection.js
mongosh < refactored-design/orders-collection.js
mongosh < refactored-design/analytics-collection.js
mongosh < refactored-design/sample-data.js
```

## Key Design Decisions

### Initial Design

1. **Document Model**: Chose MongoDB for flexibility and query capabilities
2. **Embedded Documents**: Order items embedded for atomic operations
3. **Indexes**: Created on frequently queried fields (email, product name, order status)
4. **Text Search**: Full-text index on product names and descriptions

### Refactored Design

1. **Sharding**: Hash-based sharding on order_id for even distribution
2. **Replication**: Replica sets with 3 nodes for high availability
3. **Denormalization**: Added analytics collection with pre-aggregated data
4. **Read Replicas**: Separate nodes for analytical queries
5. **TTL Indexes**: Automatic cleanup of old analytics data

## Performance Metrics

### Initial Design

- Product search: ~10-20ms
- Order creation: ~5-10ms
- Order lookup: ~5ms

### Refactored Design

- Product search: ~10-20ms (maintained)
- Order creation: ~5-10ms (maintained)
- Order lookup: ~5ms (maintained)
- Analytics queries: ~100-500ms (vs 5-10s without pre-aggregation)
- Availability: 99.99% (with replica sets)

## Documentation

- **initial-design/schema.md**: Initial schema documentation
- **refactored-design/schema.md**: Refactored schema documentation
- **design-decisions.md**: Detailed design rationale and trade-offs
- **reflection-report.md**: Personal reflection on challenges and learnings

## Testing

Each script includes comments explaining:

- Schema structure and rationale
- Index strategy
- Query patterns
- Performance considerations

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Sharding Guide](https://docs.mongodb.com/manual/sharding/)
- [MongoDB Replication Guide](https://docs.mongodb.com/manual/replication/)
- [CAP Theorem](https://en.wikipedia.org/wiki/CAP_theorem)
