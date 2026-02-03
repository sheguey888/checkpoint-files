# Library Management System - Supplementary Diagrams and Examples

## Additional Visual Representations

### Component Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                    LIBRARY MANAGEMENT SYSTEM                    │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              PRESENTATION LAYER                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │   Login UI  │  │  Catalog UI │  │  Admin UI   │     │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │  │
│  └─────────┼─────────────────┼─────────────────┼───────────┘  │
│            │                 │                 │                │
│  ┌─────────┼─────────────────┼─────────────────┼───────────┐  │
│  │         ▼                 ▼                 ▼            │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │          CONTROLLER LAYER                        │   │  │
│  │  │  ┌────────────┐  ┌────────────┐  ┌──────────┐   │   │  │
│  │  │  │   Auth     │  │Transaction │  │  Report  │   │   │  │
│  │  │  │Controller  │  │Controller  │  │Controller│   │   │  │
│  │  │  └─────┬──────┘  └─────┬──────┘  └────┬─────┘   │   │  │
│  │  └────────┼───────────────┼───────────────┼─────────┘   │  │
│  └───────────┼───────────────┼───────────────┼─────────────┘  │
│              │               │               │                 │
│  ┌───────────┼───────────────┼───────────────┼─────────────┐  │
│  │           ▼               ▼               ▼              │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │           BUSINESS LOGIC LAYER                     │ │  │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐   │ │  │
│  │  │  │   Book     │  │   Member   │  │Transaction │   │ │  │
│  │  │  │  Service   │  │  Service   │  │  Service   │   │ │  │
│  │  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘   │ │  │
│  │  │        │                │                │          │ │  │
│  │  │  ┌─────┴────────────────┴────────────────┴─────┐   │ │  │
│  │  │  │         Business Rules & Validators         │   │ │  │
│  │  │  └─────────────────────────────────────────────┘   │ │  │
│  │  └────────┬───────────────┬───────────────┬──────────┘ │  │
│  └───────────┼───────────────┼───────────────┼────────────┘  │
│              │               │               │                │
│  ┌───────────┼───────────────┼───────────────┼────────────┐  │
│  │           ▼               ▼               ▼             │  │
│  │  ┌────────────────────────────────────────────────────┐│  │
│  │  │            DATA ACCESS LAYER (DAO)                 ││  │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐   ││  │
│  │  │  │   Book     │  │   Member   │  │Transaction │   ││  │
│  │  │  │    DAO     │  │    DAO     │  │    DAO     │   ││  │
│  │  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘   ││  │
│  │  └────────┼───────────────┼───────────────┼──────────┘│  │
│  └───────────┼───────────────┼───────────────┼───────────┘  │
│              │               │               │               │
│  ┌───────────┴───────────────┴───────────────┴───────────┐  │
│  │                                                          │  │
│  │           ┌─────────────────────────────┐               │  │
│  │           │      DATABASE LAYER         │               │  │
│  │           │  ┌──────────────────────┐   │               │  │
│  │           │  │   Relational DBMS    │   │               │  │
│  │           │  │  (MySQL/PostgreSQL)  │   │               │  │
│  │           │  └──────────────────────┘   │               │  │
│  │           └─────────────────────────────┘               │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

### Database Schema Design

```sql
-- USERS Table
CREATE TABLE Users (
    user_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('MEMBER', 'LIBRARIAN', 'ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MEMBERS Table
CREATE TABLE Members (
    member_id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    member_type ENUM('STUDENT', 'FACULTY', 'GENERAL') NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    registration_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    borrowing_limit INT NOT NULL,
    current_borrowed INT DEFAULT 0,
    total_fines_paid DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- BOOKS Table
CREATE TABLE Books (
    book_id VARCHAR(20) PRIMARY KEY,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    publisher VARCHAR(100),
    category VARCHAR(50),
    publication_year INT,
    total_copies INT NOT NULL,
    available_copies INT NOT NULL,
    status ENUM('AVAILABLE', 'ISSUED', 'MAINTENANCE', 'REMOVED') NOT NULL,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_isbn (isbn)
);

-- TRANSACTIONS Table
CREATE TABLE Transactions (
    transaction_id VARCHAR(20) PRIMARY KEY,
    member_id VARCHAR(20) NOT NULL,
    book_id VARCHAR(20) NOT NULL,
    librarian_id VARCHAR(20),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('ISSUED', 'RETURNED', 'OVERDUE', 'LOST') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES Members(member_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    INDEX idx_member (member_id),
    INDEX idx_book (book_id),
    INDEX idx_status (status)
);

-- FINES Table
CREATE TABLE Fines (
    fine_id VARCHAR(20) PRIMARY KEY,
    transaction_id VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    payment_date DATE,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id)
);

-- RESERVATIONS Table
CREATE TABLE Reservations (
    reservation_id VARCHAR(20) PRIMARY KEY,
    member_id VARCHAR(20) NOT NULL,
    book_id VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    status ENUM('ACTIVE', 'FULFILLED', 'CANCELLED', 'EXPIRED') NOT NULL,
    expiry_date DATE,
    FOREIGN KEY (member_id) REFERENCES Members(member_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);
```

### Deployment Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│                                                               │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│  │   Web        │   │   Desktop    │   │   Mobile     │    │
│  │   Browser    │   │  Application │   │     App      │    │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘    │
│         │                  │                   │             │
└─────────┼──────────────────┼───────────────────┼─────────────┘
          │                  │                   │
          └──────────────────┴───────────────────┘
                             │
                    HTTPS / REST API
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                            ▼                                  │
│              ┌─────────────────────────┐                     │
│              │   APPLICATION SERVER    │                     │
│              │   ┌─────────────────┐   │                     │
│              │   │  Web Server     │   │                     │
│              │   │  (Node.js/      │   │                     │
│              │   │   Express)      │   │                     │
│              │   └────────┬────────┘   │                     │
│              │            │            │                     │
│              │   ┌────────┴────────┐   │                     │
│              │   │  Business Logic │   │                     │
│              │   │     Services    │   │                     │
│              │   └────────┬────────┘   │                     │
│              └────────────┼────────────┘                     │
│                           │                                   │
│              ┌────────────┴────────────┐                     │
│              │                         │                     │
│              ▼                         ▼                     │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  Cache Server    │      │   File Storage   │            │
│  │   (Redis)        │      │   (Book Images)  │            │
│  └──────────────────┘      └──────────────────┘            │
│                                                              │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               │ Database Connection
                               │
┌──────────────────────────────┼───────────────────────────────┐
│                              ▼                                │
│              ┌────────────────────────────┐                  │
│              │    DATABASE SERVER         │                  │
│              │  ┌──────────────────────┐  │                  │
│              │  │   Primary Database   │  │                  │
│              │  │   (MySQL/PostgreSQL) │  │                  │
│              │  └──────────┬───────────┘  │                  │
│              │             │               │                  │
│              │  ┌──────────┴───────────┐  │                  │
│              │  │   Backup Database    │  │                  │
│              │  │   (Replication)      │  │                  │
│              │  └──────────────────────┘  │                  │
│              └────────────────────────────┘                  │
└───────────────────────────────────────────────────────────────┘
```

### Sample API Endpoints

```javascript
// REST API Endpoint Design

// Authentication
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/register

// Books
GET    /api/books                    // List all books
GET    /api/books/{id}               // Get book details
GET    /api/books/search?q={query}   // Search books
POST   /api/books                    // Add new book (Librarian)
PUT    /api/books/{id}               // Update book (Librarian)
DELETE /api/books/{id}               // Remove book (Librarian)

// Members
GET    /api/members                  // List all members
GET    /api/members/{id}             // Get member details
POST   /api/members                  // Register member (Librarian)
PUT    /api/members/{id}             // Update member (Librarian)
GET    /api/members/{id}/borrowed    // Get borrowed books

// Transactions
GET    /api/transactions             // List all transactions
GET    /api/transactions/{id}        // Get transaction details
POST   /api/transactions/issue       // Issue book (Librarian)
POST   /api/transactions/return      // Return book (Librarian)
GET    /api/transactions/overdue     // Get overdue transactions

// Fines
GET    /api/fines                    // List all fines
GET    /api/fines/{id}               // Get fine details
POST   /api/fines/{id}/pay           // Pay fine

// Reports
GET    /api/reports/circulation      // Circulation report
GET    /api/reports/overdue          // Overdue books report
GET    /api/reports/popular          // Popular books report
```

### Implementation Example - Complete Member Class

```javascript
// Member.js - Complete Implementation

class Member {
  constructor(userId, name, email, memberType) {
    this.memberId = this.generateMemberId();
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.memberType = memberType; // STUDENT, FACULTY, GENERAL
    this.phoneNumber = null;
    this.address = null;
    this.registrationDate = new Date();
    this.expiryDate = this.calculateExpiryDate();
    this.borrowingLimit = this.setBorrowingLimit();
    this.currentBorrowed = 0;
    this.totalFinesPaid = 0.0;
    this.status = "ACTIVE";
  }

  generateMemberId() {
    const prefix = "MEM";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  calculateExpiryDate() {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    return expiry;
  }

  setBorrowingLimit() {
    const limits = {
      STUDENT: 5,
      FACULTY: 10,
      GENERAL: 3,
    };
    return limits[this.memberType] || 3;
  }

  canBorrow() {
    if (this.status !== "ACTIVE") {
      return { allowed: false, reason: "Membership not active" };
    }

    if (new Date() > this.expiryDate) {
      return { allowed: false, reason: "Membership expired" };
    }

    if (this.currentBorrowed >= this.borrowingLimit) {
      return {
        allowed: false,
        reason: `Borrowing limit reached (${this.borrowingLimit})`,
      };
    }

    return { allowed: true };
  }

  incrementBorrowedBooks() {
    if (this.currentBorrowed < this.borrowingLimit) {
      this.currentBorrowed++;
      return true;
    }
    return false;
  }

  decrementBorrowedBooks() {
    if (this.currentBorrowed > 0) {
      this.currentBorrowed--;
      return true;
    }
    return false;
  }

  renewMembership(years = 1) {
    const newExpiry = new Date(this.expiryDate);
    newExpiry.setFullYear(newExpiry.getFullYear() + years);
    this.expiryDate = newExpiry;
    this.status = "ACTIVE";
  }

  addFinePayment(amount) {
    this.totalFinesPaid += amount;
  }

  updateContactInfo(phoneNumber, address) {
    this.phoneNumber = phoneNumber;
    this.address = address;
  }

  getMemberInfo() {
    return {
      memberId: this.memberId,
      name: this.name,
      email: this.email,
      memberType: this.memberType,
      status: this.status,
      registrationDate: this.registrationDate.toISOString(),
      expiryDate: this.expiryDate.toISOString(),
      borrowingLimit: this.borrowingLimit,
      currentBorrowed: this.currentBorrowed,
      availableSlots: this.borrowingLimit - this.currentBorrowed,
      totalFinesPaid: this.totalFinesPaid.toFixed(2),
    };
  }

  toJSON() {
    return this.getMemberInfo();
  }
}

module.exports = Member;
```

### Testing Strategy

```javascript
// Unit Test Example for Member Class

describe("Member Class", () => {
  let student;

  beforeEach(() => {
    student = new Member("U001", "John Doe", "john@example.com", "STUDENT");
  });

  test("should create member with correct properties", () => {
    expect(student.name).toBe("John Doe");
    expect(student.memberType).toBe("STUDENT");
    expect(student.borrowingLimit).toBe(5);
    expect(student.currentBorrowed).toBe(0);
  });

  test("should allow borrowing within limit", () => {
    const result = student.canBorrow();
    expect(result.allowed).toBe(true);
  });

  test("should not allow borrowing when limit reached", () => {
    student.currentBorrowed = 5;
    const result = student.canBorrow();
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("limit reached");
  });

  test("should increment borrowed books correctly", () => {
    const success = student.incrementBorrowedBooks();
    expect(success).toBe(true);
    expect(student.currentBorrowed).toBe(1);
  });

  test("should renew membership correctly", () => {
    const oldExpiry = new Date(student.expiryDate);
    student.renewMembership(1);
    const newExpiry = new Date(student.expiryDate);

    const yearDiff = newExpiry.getFullYear() - oldExpiry.getFullYear();
    expect(yearDiff).toBe(1);
  });
});
```

### Performance Considerations

```javascript
// Indexing Strategy for Database

// 1. Create indexes on frequently queried fields
CREATE INDEX idx_books_title ON Books(title);
CREATE INDEX idx_books_author ON Books(author);
CREATE INDEX idx_books_category ON Books(category);
CREATE INDEX idx_transactions_member ON Transactions(member_id);
CREATE INDEX idx_transactions_status ON Transactions(status);

// 2. Composite indexes for common query patterns
CREATE INDEX idx_transactions_status_date
ON Transactions(status, issue_date);

CREATE INDEX idx_books_category_available
ON Books(category, status, available_copies);

// 3. Full-text search for book catalog
ALTER TABLE Books ADD FULLTEXT(title, author);

// Query optimization example
SELECT b.* FROM Books b
WHERE b.status = 'AVAILABLE'
  AND b.category = 'Science'
  AND b.available_copies > 0
ORDER BY b.title
LIMIT 20;
```

### Security Considerations

```javascript
// Security Implementation Examples

// 1. Password Hashing
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// 2. JWT Authentication
const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    {
      userId: user.userId,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// 3. Role-based Access Control
function authorize(allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: "Access denied",
      });
    }
    next();
  };
}

// Usage in routes
app.post(
  "/api/books",
  authenticate,
  authorize(["LIBRARIAN", "ADMIN"]),
  addBook,
);
```

### Scalability Patterns

```javascript
// 1. Database Connection Pooling
const pool = mysql.createPool({
  host: "localhost",
  user: "library_user",
  password: "password",
  database: "library_db",
  connectionLimit: 10,
  queueLimit: 0,
});

// 2. Caching Strategy
const redis = require("redis");
const client = redis.createClient();

async function getBookWithCache(bookId) {
  // Try cache first
  const cached = await client.get(`book:${bookId}`);
  if (cached) {
    return JSON.parse(cached);
  }

  // If not in cache, get from database
  const book = await BookDAO.findById(bookId);

  // Store in cache for 1 hour
  await client.setex(`book:${bookId}`, 3600, JSON.stringify(book));

  return book;
}

// 3. Pagination for Large Result Sets
function paginateResults(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return {
    limit: limit,
    offset: offset,
  };
}

// Usage
const { limit, offset } = paginateResults(2, 20);
const books = await BookDAO.findAll(limit, offset);
```

---

## Summary

This supplementary document provides:

✓ **Component and Deployment Diagrams** - System architecture visualization
✓ **Database Schema** - Complete table structures with relationships
✓ **API Design** - RESTful endpoint specifications
✓ **Implementation Examples** - Production-ready code samples
✓ **Testing Strategy** - Unit test examples
✓ **Performance Optimization** - Indexing and caching strategies
✓ **Security Patterns** - Authentication and authorization
✓ **Scalability Considerations** - Connection pooling and pagination

These materials complement the main OOA document and provide practical guidance for implementation.
