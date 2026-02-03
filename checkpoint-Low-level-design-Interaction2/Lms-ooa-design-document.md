# Library Management System (LMS)

## Object-Oriented Analysis & Architectural Modeling

---

## 1. REQUIREMENT ANALYSIS

### 1.1 System Actors

**Primary Actors:**

1. **Librarian** - Manages books, members, and transactions
2. **Member** - Borrows and returns books, searches catalog

**Secondary Actors:** 3. **System Administrator** - Manages system settings and user accounts 4. **Database System** - Stores and retrieves data

### 1.2 Key Use Cases

#### For Librarian:

- UC-001: Add Book to Catalog
- UC-002: Remove Book from Catalog
- UC-003: Update Book Information
- UC-004: Register New Member
- UC-005: Update Member Information
- UC-006: Issue Book to Member
- UC-007: Process Book Return
- UC-008: Generate Reports

#### For Member:

- UC-009: Search Book Catalog
- UC-010: View Borrowed Books
- UC-011: Request Book Reservation
- UC-012: View Account Information
- UC-013: Pay Fines

### 1.3 Functional Requirements

**FR-001:** System shall allow librarians to manage book inventory
**FR-002:** System shall track book availability status
**FR-003:** System shall manage member registration and profiles
**FR-004:** System shall process borrowing transactions
**FR-005:** System shall process return transactions
**FR-006:** System shall calculate fines for overdue books
**FR-007:** System shall support book search by title, author, ISBN, or category
**FR-008:** System shall enforce borrowing limits per member type
**FR-009:** System shall maintain transaction history
**FR-010:** System shall generate library reports

### 1.4 Non-Functional Requirements

**NFR-001:** System shall respond to search queries within 2 seconds
**NFR-002:** System shall support at least 100 concurrent users
**NFR-003:** System shall maintain 99.9% uptime
**NFR-004:** Data shall be backed up daily
**NFR-005:** User authentication shall be secure

---

## 2. SYSTEM ARCHITECTURE DESIGN

### 2.1 Architectural Pattern: Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Web UI      │  │  Desktop UI  │  │  Mobile App  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Book Management  │  │ Member Mgmt      │                │
│  │    Service       │  │    Service       │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Transaction Mgmt │  │ Report Generator │                │
│  │    Service       │  │    Service       │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                        │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   Book DAO       │  │   Member DAO     │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Transaction DAO  │  │   User DAO       │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
│                 ┌────────────────┐                           │
│                 │  Relational DB │                           │
│                 │   (MySQL/      │                           │
│                 │   PostgreSQL)  │                           │
│                 └────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Major System Components

#### 2.2.1 Presentation Layer Components

- **User Interface Controllers**
  - LoginController
  - BookCatalogController
  - TransactionController
  - ReportController

#### 2.2.2 Business Logic Layer Components

- **Service Components**
  - BookManagementService
  - MemberManagementService
  - TransactionService
  - FineCalculationService
  - SearchService
  - ReportService

- **Business Rules**
  - BorrowingRules
  - FineCalculator
  - MemberValidator

#### 2.2.3 Data Access Layer Components

- **Data Access Objects (DAO)**
  - BookDAO
  - MemberDAO
  - TransactionDAO
  - UserDAO
  - FineDAO

### 2.3 Component Interaction Flow

**Example: Issue Book Flow**

```
User Interface → TransactionController → TransactionService →
BookDAO + MemberDAO → Database
```

---

## 3. OBJECT-ORIENTED ANALYSIS (OOA)

### 3.1 Identified Classes

#### Core Entity Classes:

**1. Book**

- Attributes:
  - bookId: String
  - isbn: String
  - title: String
  - author: String
  - publisher: String
  - category: String
  - publicationYear: int
  - numberOfCopies: int
  - availableCopies: int
  - status: BookStatus (enum)
- Methods:
  - getBookDetails()
  - updateAvailability()
  - isAvailable(): boolean
  - decrementCopies()
  - incrementCopies()

**2. Member**

- Attributes:
  - memberId: String
  - name: String
  - email: String
  - phoneNumber: String
  - address: String
  - memberType: MemberType (enum: STUDENT, FACULTY, GENERAL)
  - registrationDate: Date
  - membershipExpiryDate: Date
  - borrowingLimit: int
  - currentBorrowedBooks: int
- Methods:
  - getMemberDetails()
  - canBorrow(): boolean
  - updateMemberInfo()
  - renewMembership()

**3. Transaction**

- Attributes:
  - transactionId: String
  - member: Member
  - book: Book
  - issueDate: Date
  - dueDate: Date
  - returnDate: Date
  - status: TransactionStatus (enum: ISSUED, RETURNED, OVERDUE)
  - fine: double
- Methods:
  - calculateDueDate()
  - processIssue()
  - processReturn()
  - calculateFine()

**4. Librarian**

- Attributes:
  - librarianId: String
  - name: String
  - email: String
  - role: String
- Methods:
  - issueBook()
  - returnBook()
  - addBook()
  - removeBook()
  - registerMember()

**5. Fine**

- Attributes:
  - fineId: String
  - transaction: Transaction
  - amount: double
  - isPaid: boolean
  - paymentDate: Date
- Methods:
  - calculateAmount()
  - markAsPaid()
  - getFineDetails()

**6. Reservation**

- Attributes:
  - reservationId: String
  - member: Member
  - book: Book
  - reservationDate: Date
  - status: ReservationStatus (enum: ACTIVE, FULFILLED, CANCELLED)
- Methods:
  - createReservation()
  - cancelReservation()
  - fulfillReservation()

### 3.2 Class Relationships

**Associations:**

- Member ─── borrows ──→ Book (many-to-many)
- Transaction ──→ Member (many-to-one)
- Transaction ──→ Book (many-to-one)
- Fine ──→ Transaction (one-to-one)
- Reservation ──→ Member (many-to-one)
- Reservation ──→ Book (many-to-one)
- Librarian ─── manages ──→ Transaction (one-to-many)

**Inheritance:**

- User (abstract) ← Member
- User (abstract) ← Librarian
- User (abstract) ← Administrator

---

## 4. UML DIAGRAMS

### 4.1 Use Case Diagram

```
                    Library Management System

    ┌─────────────────────────────────────────────────────┐
    │                                                       │
    │    ┌──────────────────────┐                         │
    │    │   Search Books       │                         │
    │    └──────────────────────┘                         │
    │              ↑                                       │
    │              │                                       │
┌─────────┐   ┌──────────────────────┐                   │
│ Member  │───│   View Borrowed      │                   │
│         │   │      Books           │                   │
└─────────┘   └──────────────────────┘                   │
    │              │                                       │
    │         ┌──────────────────────┐                   │
    │         │  Request Reservation │                   │
    │         └──────────────────────┘                   │
    │                                                       │
    │         ┌──────────────────────┐                   │
    │         │    Pay Fines         │                   │
    │         └──────────────────────┘                   │
    │                                                       │
    │                                                       │
┌──────────┐  ┌──────────────────────┐                   │
│Librarian │──│   Add/Update Book    │                   │
│          │  └──────────────────────┘                   │
└──────────┘                                              │
    │         ┌──────────────────────┐                   │
    │         │  Register Member     │                   │
    │         └──────────────────────┘                   │
    │                                                       │
    │         ┌──────────────────────┐                   │
    │         │    Issue Book        │──────────────┐    │
    │         └──────────────────────┘              │    │
    │                                               │    │
    │         ┌──────────────────────┐             │    │
    │         │    Return Book       │──────────────┤    │
    │         └──────────────────────┘              │    │
    │                                               │    │
    │         ┌──────────────────────┐             │    │
    │         │  Generate Reports    │             │    │
    │         └──────────────────────┘             │    │
    │                                               │    │
    │                               ┌───────────────┴──┐ │
    │                               │  Calculate Fine  │ │
    │                               │    <<include>>   │ │
    │                               └──────────────────┘ │
    │                                                       │
    └─────────────────────────────────────────────────────┘
```

### 4.2 Class Diagram (Simplified)

```
┌─────────────────────────┐
│       <<abstract>>      │
│          User           │
├─────────────────────────┤
│ - userId: String        │
│ - name: String          │
│ - email: String         │
├─────────────────────────┤
│ + login()               │
│ + logout()              │
└─────────────────────────┘
          △
          │
    ┌─────┴─────┐
    │           │
┌───────────┐ ┌─────────────┐
│  Member   │ │  Librarian  │
├───────────┤ ├─────────────┤
│-memberId  │ │-librarianId │
│-type      │ │-role        │
│-borrowLmt │ ├─────────────┤
├───────────┤ │+issueBook() │
│+canBorrow()│ │+returnBook()│
└───────────┘ └─────────────┘
     │                │
     │ borrows        │ manages
     │                │
     ▼                ▼
┌──────────────────────────┐
│      Transaction         │
├──────────────────────────┤
│ - transactionId: String  │
│ - member: Member         │
│ - book: Book             │
│ - issueDate: Date        │
│ - dueDate: Date          │
│ - returnDate: Date       │
│ - status: Status         │
├──────────────────────────┤
│ + processIssue()         │
│ + processReturn()        │
│ + calculateFine()        │
└──────────────────────────┘
          │
          │ has
          ▼
┌──────────────────────────┐
│         Fine             │
├──────────────────────────┤
│ - fineId: String         │
│ - amount: double         │
│ - isPaid: boolean        │
├──────────────────────────┤
│ + calculateAmount()      │
│ + markAsPaid()           │
└──────────────────────────┘

┌──────────────────────────┐
│          Book            │
├──────────────────────────┤
│ - bookId: String         │
│ - isbn: String           │
│ - title: String          │
│ - author: String         │
│ - category: String       │
│ - availableCopies: int   │
│ - status: BookStatus     │
├──────────────────────────┤
│ + isAvailable(): boolean │
│ + updateAvailability()   │
│ + getDetails()           │
└──────────────────────────┘
          △
          │ involves
          │
   (Transaction)
```

### 4.3 Sequence Diagram - UC-006: Issue Book to Member

```
Librarian    UI       TransactionService    BookDAO    MemberDAO    Database
    │         │              │                 │           │            │
    │─request─→│              │                 │           │            │
    │  issue  │              │                 │           │            │
    │         │              │                 │           │            │
    │         │──validate────→                 │           │            │
    │         │   input      │                 │           │            │
    │         │              │                 │           │            │
    │         │              │──checkBook──────→           │            │
    │         │              │   availability  │           │            │
    │         │              │                 │           │            │
    │         │              │                 │──query────→            │
    │         │              │                 │           │            │
    │         │              │                 │←──book────│            │
    │         │              │                 │   data    │            │
    │         │              │                 │           │            │
    │         │              │←────book────────│           │            │
    │         │              │     object      │           │            │
    │         │              │                 │           │            │
    │         │              │────checkMember─────────────→│            │
    │         │              │    canBorrow?   │           │            │
    │         │              │                 │           │            │
    │         │              │                 │           │──query────→│
    │         │              │                 │           │            │
    │         │              │                 │           │←──member──│
    │         │              │                 │           │   data     │
    │         │              │                 │           │            │
    │         │              │←────member──────────────────│            │
    │         │              │     object      │           │            │
    │         │              │                 │           │            │
    │         │──validate────│                 │           │            │
    │         │   rules      │                 │           │            │
    │         │              │                 │           │            │
    │         │              │──createTransaction────────→ │            │
    │         │              │                 │           │            │
    │         │              │                 │───────────────insert──→│
    │         │              │                 │           │            │
    │         │              │                 │←──────────────success─│
    │         │              │                 │           │            │
    │         │              │──updateBook─────→           │            │
    │         │              │   availability  │           │            │
    │         │              │                 │           │            │
    │         │              │                 │───────────────update──→│
    │         │              │                 │           │            │
    │         │←──success────│                 │           │            │
    │         │   message    │                 │           │            │
    │         │              │                 │           │            │
    │←confirm─│              │                 │           │            │
    │  issue  │              │                 │           │            │
```

### 4.4 Sequence Diagram - UC-007: Process Book Return

```
Librarian    UI    TransactionService   TransactionDAO   FineService   Database
    │         │            │                  │               │           │
    │─return─→│            │                  │               │           │
    │  book   │            │                  │               │           │
    │         │            │                  │               │           │
    │         │──process───→                  │               │           │
    │         │   return   │                  │               │           │
    │         │            │                  │               │           │
    │         │            │──getTransaction─→│               │           │
    │         │            │                  │               │           │
    │         │            │                  │──query────────→           │
    │         │            │                  │               │           │
    │         │            │                  │←──transaction─│           │
    │         │            │                  │    data       │           │
    │         │            │                  │               │           │
    │         │            │←──transaction────│               │           │
    │         │            │    object        │               │           │
    │         │            │                  │               │           │
    │         │            │──checkOverdue────────────────────→           │
    │         │            │                  │               │           │
    │         │            │                  │               │           │
    │         │            │←────fine─────────────────────────│           │
    │         │            │     amount       │               │           │
    │         │            │                  │               │           │
    │         │            │──updateTransaction──────→        │           │
    │         │            │   (returnDate)   │               │           │
    │         │            │                  │               │           │
    │         │            │                  │───────────────────update─→│
    │         │            │                  │               │           │
    │         │            │──updateBook──────────────────────────────────→│
    │         │            │   availability   │               │           │
    │         │            │                  │               │           │
    │         │←──success──│                  │               │           │
    │         │  (with fine)                  │               │           │
    │         │            │                  │               │           │
    │←display─│            │                  │               │           │
    │  result │            │                  │               │           │
```

### 4.5 State Diagram - Book Object

```
                    ┌──────────────┐
                    │  [Initial]   │
                    └──────┬───────┘
                           │
                           │ Book Added
                           ▼
                    ┌──────────────┐
              ┌────→│  AVAILABLE   │←────┐
              │     └──────┬───────┘     │
              │            │              │
              │            │ Issue Book   │
              │            ▼              │
              │     ┌──────────────┐     │
              │     │   ISSUED     │     │ Return Book
              │     └──────┬───────┘     │
              │            │              │
              │            │ Book Overdue │
              │            ▼              │
              │     ┌──────────────┐     │
              │     │   OVERDUE    │─────┘
              │     └──────┬───────┘
              │            │
              │            │ Book Lost/Damaged
              │            ▼
              │     ┌──────────────┐
              │     │ DAMAGED/LOST │
              │     └──────┬───────┘
              │            │
              │            │ Book Repaired
              │            ▼
              │     ┌──────────────┐
              └─────│ MAINTENANCE  │
                    └──────┬───────┘
                           │
                           │ Book Removed
                           ▼
                    ┌──────────────┐
                    │   REMOVED    │
                    └──────────────┘
```

---

## 5. DATA, FUNCTIONAL, AND BEHAVIORAL MODELING

### 5.1 Data Model (Entity-Relationship Diagram)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    USER     │         │   MEMBER    │         │    BOOK     │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ userId (PK) │         │memberId (PK)│         │ bookId (PK) │
│ name        │         │ userId (FK) │         │ isbn        │
│ email       │         │ memberType  │◇────────│ title       │
│ password    │         │ borrowLimit │  borrows│ author      │
│ role        │         │ regDate     │         │ category    │
└─────────────┘         └─────────────┘         │ copies      │
      △                       │                  │ available   │
      │                       │                  └─────────────┘
      │                       │                         △
      │                       │                         │
      │                       ▼                         │
      │              ┌──────────────────┐               │
      │              │   TRANSACTION    │               │
      │              ├──────────────────┤               │
      │              │ transactionId(PK)│               │
      │              │ memberId (FK)    │◇──────────────┘
      │              │ bookId (FK)      │
      │              │ issueDate        │
      │              │ dueDate          │
      │              │ returnDate       │
      │              │ status           │
      │              └──────────────────┘
      │                       │
┌─────────────┐              │
│  LIBRARIAN  │              ▼
├─────────────┤      ┌──────────────────┐
│librarianId  │      │      FINE        │
│ userId (FK) │      ├──────────────────┤
│ role        │      │ fineId (PK)      │
│ department  │      │ transactionId(FK)│
└─────────────┘      │ amount           │
                     │ isPaid           │
                     │ paymentDate      │
                     └──────────────────┘
```

### 5.2 Functional Model - Data Flow Diagram (Level 0)

```
                         Library Management System
                    ┌────────────────────────────┐
                    │                            │
    Member ────────→│   1.0 Book Search         │
                    │                            │
                    ├────────────────────────────┤
                    │                            │
    Member ────────→│   2.0 View Account        │
                    │                            │
                    ├────────────────────────────┤
                    │                            │
    Librarian ─────→│   3.0 Manage Books        │────→ Book DB
                    │                            │
                    ├────────────────────────────┤
                    │                            │
    Librarian ─────→│   4.0 Manage Members      │────→ Member DB
                    │                            │
                    ├────────────────────────────┤
                    │                            │
    Librarian ─────→│   5.0 Process             │────→ Transaction DB
                    │       Transactions        │
                    │                            │
                    ├────────────────────────────┤
                    │                            │
    System ────────→│   6.0 Calculate Fines     │────→ Fine DB
                    │                            │
                    ├────────────────────────────┤
                    │                            │
    Admin ─────────→│   7.0 Generate Reports    │←──── All DBs
                    │                            │
                    └────────────────────────────┘
```

### 5.3 Behavioral Model - Activity Diagram (Issue Book Process)

```
                         [Start]
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Librarian requests  │
                 │   to issue book      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Enter Member ID     │
                 │  and Book ID         │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Validate Member     │
                 └──────────┬───────────┘
                            │
                    ┌───────┴───────┐
                    │               │
                Valid?          Invalid
                    │               │
                    ▼               ▼
         ┌──────────────────┐  ┌────────────────┐
         │ Check Book       │  │ Show Error     │
         │ Availability     │  │ Message        │
         └──────┬───────────┘  └────────┬───────┘
                │                       │
        ┌───────┴────────┐              │
        │                │              │
    Available       Not Available       │
        │                │              │
        ▼                ▼              │
┌──────────────┐  ┌─────────────┐      │
│ Check Borrow │  │ Show Error  │      │
│    Limit     │  │   Message   │      │
└──────┬───────┘  └──────┬──────┘      │
       │                 │              │
   ┌───┴────┐           │              │
   │        │           │              │
Within   Exceeded       │              │
Limit                   │              │
   │                    │              │
   ▼                    ▼              ▼
┌──────────────┐  ┌──────────────────────┐
│ Create       │  │                      │
│ Transaction  │  │      [End]           │
└──────┬───────┘  │                      │
       │          └──────────────────────┘
       ▼
┌──────────────┐
│ Update Book  │
│ Availability │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Update Member│
│ Borrow Count │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Generate     │
│ Receipt      │
└──────┬───────┘
       │
       ▼
     [End]
```

---

## 6. ABSTRACTION TO IMPLEMENTATION

### 6.1 Pseudocode Examples

#### 6.1.1 Book Class Implementation

```pseudocode
CLASS Book
    PRIVATE ATTRIBUTES:
        bookId: String
        isbn: String
        title: String
        author: String
        category: String
        totalCopies: Integer
        availableCopies: Integer
        status: BookStatus

    PUBLIC CONSTRUCTOR(isbn, title, author, category, copies):
        this.bookId = generateUniqueId()
        this.isbn = isbn
        this.title = title
        this.author = author
        this.category = category
        this.totalCopies = copies
        this.availableCopies = copies
        this.status = BookStatus.AVAILABLE

    PUBLIC METHOD isAvailable() -> Boolean:
        RETURN this.availableCopies > 0

    PUBLIC METHOD borrowBook() -> Boolean:
        IF this.isAvailable() THEN
            this.availableCopies = this.availableCopies - 1
            IF this.availableCopies == 0 THEN
                this.status = BookStatus.ISSUED
            END IF
            RETURN true
        ELSE
            RETURN false
        END IF

    PUBLIC METHOD returnBook() -> Void:
        this.availableCopies = this.availableCopies + 1
        this.status = BookStatus.AVAILABLE

    PUBLIC METHOD getDetails() -> BookInfo:
        RETURN new BookInfo(this.title, this.author, this.isbn)
END CLASS
```

#### 6.1.2 Transaction Processing Algorithm

```pseudocode
ALGORITHM ProcessBookIssue(memberId, bookId, librarianId)
INPUT: memberId, bookId, librarianId
OUTPUT: Transaction object or Error

BEGIN
    // Step 1: Validate Member
    member = MemberDAO.findById(memberId)
    IF member == NULL THEN
        THROW Error("Member not found")
    END IF

    // Step 2: Check Borrowing Limit
    IF member.currentBorrowedBooks >= member.borrowingLimit THEN
        THROW Error("Borrowing limit exceeded")
    END IF

    // Step 3: Validate Book
    book = BookDAO.findById(bookId)
    IF book == NULL THEN
        THROW Error("Book not found")
    END IF

    // Step 4: Check Book Availability
    IF NOT book.isAvailable() THEN
        THROW Error("Book not available")
    END IF

    // Step 5: Create Transaction
    transaction = new Transaction()
    transaction.setMember(member)
    transaction.setBook(book)
    transaction.setIssueDate(getCurrentDate())
    transaction.setDueDate(calculateDueDate(member.memberType))
    transaction.setStatus(TransactionStatus.ISSUED)

    // Step 6: Update Book Availability
    book.borrowBook()
    BookDAO.update(book)

    // Step 7: Update Member's Borrowed Count
    member.incrementBorrowedBooks()
    MemberDAO.update(member)

    // Step 8: Save Transaction
    TransactionDAO.save(transaction)

    // Step 9: Generate Receipt
    receipt = generateReceipt(transaction)

    RETURN transaction
END
```

#### 6.1.3 Fine Calculation Algorithm

```pseudocode
ALGORITHM CalculateFine(transaction)
INPUT: Transaction object
OUTPUT: Fine amount (decimal)

BEGIN
    currentDate = getCurrentDate()
    dueDate = transaction.getDueDate()

    // Check if book is overdue
    IF currentDate <= dueDate THEN
        RETURN 0.00
    END IF

    // Calculate days overdue
    daysOverdue = dateDifference(currentDate, dueDate)

    // Get member type for fine rate
    memberType = transaction.getMember().getMemberType()

    // Apply different fine rates based on member type
    CASE memberType OF
        STUDENT:
            finePerDay = 0.50
        FACULTY:
            finePerDay = 0.25
        GENERAL:
            finePerDay = 1.00
    END CASE

    // Calculate total fine
    totalFine = daysOverdue * finePerDay

    // Apply maximum fine cap
    MAX_FINE = 50.00
    IF totalFine > MAX_FINE THEN
        totalFine = MAX_FINE
    END IF

    RETURN totalFine
END
```

### 6.2 Code Snippets (JavaScript)

#### Book Class Implementation

```javascript
class Book {
  constructor(isbn, title, author, category, copies) {
    this.bookId = this.generateId();
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.category = category;
    this.totalCopies = copies;
    this.availableCopies = copies;
    this.status = this.availableCopies > 0 ? "AVAILABLE" : "UNAVAILABLE";
  }

  generateId() {
    return `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  }

  isAvailable() {
    return this.availableCopies > 0;
  }

  borrowBook() {
    if (!this.isAvailable()) {
      return false;
    }
    this.availableCopies--;
    if (this.availableCopies === 0) {
      this.status = "ISSUED";
    }
    return true;
  }

  returnBook() {
    this.availableCopies++;
    this.status = "AVAILABLE";
  }

  getDetails() {
    return {
      id: this.bookId,
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      category: this.category,
      available: this.availableCopies,
      total: this.totalCopies,
      status: this.status,
    };
  }
}
```

#### Transaction Service Implementation

```javascript
class TransactionService {
  constructor(bookDAO, memberDAO, transactionDAO) {
    this.bookDAO = bookDAO;
    this.memberDAO = memberDAO;
    this.transactionDAO = transactionDAO;
  }

  issueBook(memberId, bookId) {
    // Step 1: Validate member
    const member = this.memberDAO.findById(memberId);
    if (!member) {
      throw new Error("Member not found");
    }

    // Step 2: Check borrowing limit
    if (member.currentBorrowedBooks >= member.borrowingLimit) {
      throw new Error("Borrowing limit exceeded");
    }

    // Step 3: Validate book
    const book = this.bookDAO.findById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    // Step 4: Check availability
    if (!book.isAvailable()) {
      throw new Error("Book not available");
    }

    // Step 5: Create transaction
    const transaction = new Transaction(member, book);

    // Step 6: Update book and member
    book.borrowBook();
    member.incrementBorrowedBooks();

    // Step 7: Save changes
    this.bookDAO.update(book);
    this.memberDAO.update(member);
    this.transactionDAO.save(transaction);

    return transaction;
  }

  returnBook(transactionId) {
    // Retrieve transaction
    const transaction = this.transactionDAO.findById(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Calculate fine if overdue
    const fine = this.calculateFine(transaction);

    // Update transaction
    transaction.processReturn();

    // Update book availability
    transaction.book.returnBook();

    // Update member
    transaction.member.decrementBorrowedBooks();

    // Save changes
    this.transactionDAO.update(transaction);
    this.bookDAO.update(transaction.book);
    this.memberDAO.update(transaction.member);

    return { transaction, fine };
  }

  calculateFine(transaction) {
    const currentDate = new Date();
    const dueDate = transaction.dueDate;

    if (currentDate <= dueDate) {
      return 0;
    }

    const daysOverdue = Math.ceil(
      (currentDate - dueDate) / (1000 * 60 * 60 * 24),
    );
    const fineRates = {
      STUDENT: 0.5,
      FACULTY: 0.25,
      GENERAL: 1.0,
    };

    const finePerDay = fineRates[transaction.member.memberType] || 1.0;
    let totalFine = daysOverdue * finePerDay;

    // Apply maximum fine cap
    const MAX_FINE = 50.0;
    return Math.min(totalFine, MAX_FINE);
  }
}
```

---

## 7. DESIGN PRINCIPLES APPLIED

### 7.1 SOLID Principles

**S - Single Responsibility Principle**

- Each class has one responsibility (Book manages book data, Transaction manages borrowing records)

**O - Open/Closed Principle**

- System is open for extension (new member types) but closed for modification

**L - Liskov Substitution Principle**

- Member subclasses (Student, Faculty) can replace base Member class

**I - Interface Segregation Principle**

- Interfaces are specific to client needs (SearchService, TransactionService)

**D - Dependency Inversion Principle**

- High-level modules depend on abstractions (DAOs), not concrete implementations

### 7.2 Design Patterns Applied

1. **DAO Pattern** - Separates data access logic from business logic
2. **Service Layer Pattern** - Encapsulates business logic
3. **Factory Pattern** - Creates different types of members
4. **Singleton Pattern** - Database connection management (optional)

---

## 8. SYSTEM CONSTRAINTS AND ASSUMPTIONS

### 8.1 Constraints

- Maximum 5 books per student
- Maximum 10 books per faculty
- 14-day borrowing period for students
- 30-day borrowing period for faculty
- Maximum fine capped at $50
- Books cannot be issued if member has unpaid fines

### 8.2 Assumptions

- System operates during library hours only
- Internet connectivity is available
- All members are pre-registered
- Books are identified by unique ISBN
- One copy of a book = one database entry with quantity field

---

## 9. CONCLUSION

This Object-Oriented Analysis and Architectural Modeling document provides:

✓ Complete requirement analysis with actors and use cases
✓ Three-tier system architecture design
✓ Comprehensive class identification and modeling
✓ UML diagrams (Use Case, Class, Sequence, State, Activity)
✓ Data, Functional, and Behavioral models
✓ Pseudocode and code examples for implementation

The design follows OOA principles, maintains separation of concerns, and provides a solid foundation for implementation while remaining flexible for future enhancements.

---

**Document Version:** 1.0  
**Date:** February 2026  
**Status:** Complete - Ready for Implementation Phase
