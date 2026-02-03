/**
 * Smart Library Management System
 * Object-Oriented Design with Design Patterns
 *
 * Design Patterns Used:
 * 1. Singleton Pattern - LibrarySystem (single instance)
 * 2. Factory Pattern - UserFactory (create different user types)
 * 3. Observer Pattern - NotificationService (notify users of due dates)
 */

// ============================================================
// SUBSYSTEM 1: USER MANAGEMENT
// ============================================================

/**
 * Abstract User class (base class for all users)
 */
class User {
  constructor(id, name, email) {
    if (this.constructor === User) {
      throw new Error("Cannot instantiate abstract class User");
    }
    this.id = id;
    this.name = name;
    this.email = email;
    this.borrowedBooks = [];
    this.notifications = [];
  }

  /**
   * Abstract method - must be implemented by subclasses
   */
  getMaxBorrowLimit() {
    throw new Error("Method 'getMaxBorrowLimit()' must be implemented");
  }

  /**
   * Abstract method - must be implemented by subclasses
   */
  getBorrowDuration() {
    throw new Error("Method 'getBorrowDuration()' must be implemented");
  }

  /**
   * Get user type
   */
  getUserType() {
    throw new Error("Method 'getUserType()' must be implemented");
  }

  /**
   * Add a borrowed book
   */
  addBorrowedBook(transaction) {
    this.borrowedBooks.push(transaction);
  }

  /**
   * Remove a borrowed book
   */
  removeBorrowedBook(bookId) {
    this.borrowedBooks = this.borrowedBooks.filter((t) => t.book.id !== bookId);
  }

  /**
   * Receive notification (Observer Pattern)
   */
  update(message) {
    this.notifications.push({
      message: message,
      timestamp: new Date(),
    });
    console.log(`📧 Notification to ${this.name}: ${message}`);
  }

  /**
   * Get all notifications
   */
  getNotifications() {
    return this.notifications;
  }

  /**
   * Get user info
   */
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      type: this.getUserType(),
      borrowedBooks: this.borrowedBooks.length,
      maxLimit: this.getMaxBorrowLimit(),
    };
  }
}

/**
 * Student class (extends User)
 */
class Student extends User {
  constructor(id, name, email, studentId) {
    super(id, name, email);
    this.studentId = studentId;
  }

  getMaxBorrowLimit() {
    return 3; // Students can borrow up to 3 books
  }

  getBorrowDuration() {
    return 14; // 14 days
  }

  getUserType() {
    return "Student";
  }
}

/**
 * Teacher class (extends User)
 */
class Teacher extends User {
  constructor(id, name, email, department) {
    super(id, name, email);
    this.department = department;
  }

  getMaxBorrowLimit() {
    return 5; // Teachers can borrow up to 5 books
  }

  getBorrowDuration() {
    return 30; // 30 days
  }

  getUserType() {
    return "Teacher";
  }
}

/**
 * Factory Pattern: UserFactory
 * Creates different types of users
 */
class UserFactory {
  static userIdCounter = 1;

  /**
   * Create a user based on type
   */
  static createUser(type, name, email, extraInfo) {
    const userId = `U${String(this.userIdCounter++).padStart(4, "0")}`;

    switch (type.toLowerCase()) {
      case "student":
        return new Student(userId, name, email, extraInfo);
      case "teacher":
        return new Teacher(userId, name, email, extraInfo);
      default:
        throw new Error(`Unknown user type: ${type}`);
    }
  }
}

// ============================================================
// SUBSYSTEM 2: BOOK MANAGEMENT
// ============================================================

/**
 * Book class
 */
class Book {
  static bookIdCounter = 1;

  constructor(title, author, isbn, category) {
    this.id = `B${String(Book.bookIdCounter++).padStart(4, "0")}`;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.category = category;
    this.isAvailable = true;
    this.borrowedBy = null;
  }

  /**
   * Mark book as borrowed
   */
  borrow(user) {
    if (!this.isAvailable) {
      return false;
    }
    this.isAvailable = false;
    this.borrowedBy = user.id;
    return true;
  }

  /**
   * Mark book as returned
   */
  returnBook() {
    this.isAvailable = true;
    this.borrowedBy = null;
  }

  /**
   * Get book info
   */
  getInfo() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      category: this.category,
      available: this.isAvailable,
      borrowedBy: this.borrowedBy,
    };
  }
}

// ============================================================
// SUBSYSTEM 3: BORROWING SYSTEM
// ============================================================

/**
 * BorrowTransaction class
 */
class BorrowTransaction {
  static transactionIdCounter = 1;

  constructor(user, book) {
    this.id = `T${String(BorrowTransaction.transactionIdCounter++).padStart(4, "0")}`;
    this.user = user;
    this.book = book;
    this.borrowDate = new Date();
    this.dueDate = new Date();
    this.dueDate.setDate(this.dueDate.getDate() + user.getBorrowDuration());
    this.returnDate = null;
    this.isOverdue = false;
  }

  /**
   * Check if transaction is overdue
   */
  checkOverdue() {
    if (!this.returnDate && new Date() > this.dueDate) {
      this.isOverdue = true;
      return true;
    }
    return false;
  }

  /**
   * Complete the transaction (return book)
   */
  completeTransaction() {
    this.returnDate = new Date();
  }

  /**
   * Get transaction info
   */
  getInfo() {
    return {
      id: this.id,
      userId: this.user.id,
      userName: this.user.name,
      bookId: this.book.id,
      bookTitle: this.book.title,
      borrowDate: this.borrowDate.toDateString(),
      dueDate: this.dueDate.toDateString(),
      returnDate: this.returnDate
        ? this.returnDate.toDateString()
        : "Not returned",
      isOverdue: this.isOverdue,
    };
  }
}

// ============================================================
// OBSERVER PATTERN: NOTIFICATION SERVICE
// ============================================================

/**
 * NotificationService (Observer Pattern)
 */
class NotificationService {
  constructor() {
    this.observers = []; // List of users to notify
  }

  /**
   * Register an observer (user)
   */
  subscribe(user) {
    if (!this.observers.includes(user)) {
      this.observers.push(user);
    }
  }

  /**
   * Unregister an observer
   */
  unsubscribe(user) {
    this.observers = this.observers.filter((obs) => obs !== user);
  }

  /**
   * Notify all observers
   */
  notifyAll(message) {
    this.observers.forEach((observer) => {
      observer.update(message);
    });
  }

  /**
   * Notify specific user
   */
  notifyUser(user, message) {
    user.update(message);
  }
}

// ============================================================
// SINGLETON PATTERN: LIBRARY SYSTEM
// ============================================================

/**
 * LibrarySystem (Singleton Pattern)
 * Central system managing users, books, and transactions
 */
class LibrarySystem {
  static instance = null;

  constructor() {
    if (LibrarySystem.instance) {
      return LibrarySystem.instance;
    }

    this.users = [];
    this.books = [];
    this.transactions = [];
    this.activeTransactions = [];
    this.notificationService = new NotificationService();

    LibrarySystem.instance = this;
  }

  /**
   * Get the singleton instance
   */
  static getInstance() {
    if (!LibrarySystem.instance) {
      LibrarySystem.instance = new LibrarySystem();
    }
    return LibrarySystem.instance;
  }

  // ============================================================
  // USER MANAGEMENT
  // ============================================================

  /**
   * Add a user to the library
   */
  addUser(user) {
    this.users.push(user);
    this.notificationService.subscribe(user);
    console.log(
      `✓ User added: ${user.name} (${user.getUserType()}) - ID: ${user.id}`,
    );
    return user;
  }

  /**
   * Find user by ID
   */
  findUserById(userId) {
    return this.users.find((user) => user.id === userId);
  }

  /**
   * Get all users
   */
  getAllUsers() {
    return this.users;
  }

  // ============================================================
  // BOOK MANAGEMENT
  // ============================================================

  /**
   * Add a book to the library
   */
  addBook(book) {
    this.books.push(book);
    console.log(
      `✓ Book added: "${book.title}" by ${book.author} - ID: ${book.id}`,
    );
    return book;
  }

  /**
   * Find book by ID
   */
  findBookById(bookId) {
    return this.books.find((book) => book.id === bookId);
  }

  /**
   * Search books by title
   */
  searchBooksByTitle(title) {
    return this.books.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase()),
    );
  }

  /**
   * Get available books
   */
  getAvailableBooks() {
    return this.books.filter((book) => book.isAvailable);
  }

  /**
   * Get all books
   */
  getAllBooks() {
    return this.books;
  }

  // ============================================================
  // BORROWING SYSTEM
  // ============================================================

  /**
   * Borrow a book
   */
  borrowBook(userId, bookId) {
    const user = this.findUserById(userId);
    const book = this.findBookById(bookId);

    // Validation
    if (!user) {
      console.log(`✗ Error: User ${userId} not found`);
      return false;
    }

    if (!book) {
      console.log(`✗ Error: Book ${bookId} not found`);
      return false;
    }

    if (!book.isAvailable) {
      console.log(`✗ Error: Book "${book.title}" is not available`);
      return false;
    }

    if (user.borrowedBooks.length >= user.getMaxBorrowLimit()) {
      console.log(
        `✗ Error: ${user.name} has reached borrow limit (${user.getMaxBorrowLimit()} books)`,
      );
      return false;
    }

    // Create transaction
    const transaction = new BorrowTransaction(user, book);

    // Update records
    book.borrow(user);
    user.addBorrowedBook(transaction);
    this.transactions.push(transaction);
    this.activeTransactions.push(transaction);

    // Notify user
    this.notificationService.notifyUser(
      user,
      `You have borrowed "${book.title}". Due date: ${transaction.dueDate.toDateString()}`,
    );

    console.log(
      `✓ ${user.name} borrowed "${book.title}" - Due: ${transaction.dueDate.toDateString()}`,
    );
    return true;
  }

  /**
   * Return a book
   */
  returnBook(userId, bookId) {
    const user = this.findUserById(userId);
    const book = this.findBookById(bookId);

    if (!user || !book) {
      console.log(`✗ Error: User or book not found`);
      return false;
    }

    // Find active transaction
    const transaction = this.activeTransactions.find(
      (t) => t.user.id === userId && t.book.id === bookId && !t.returnDate,
    );

    if (!transaction) {
      console.log(`✗ Error: No active borrow record found`);
      return false;
    }

    // Complete transaction
    transaction.completeTransaction();
    book.returnBook();
    user.removeBorrowedBook(bookId);

    // Remove from active transactions
    this.activeTransactions = this.activeTransactions.filter(
      (t) => t.id !== transaction.id,
    );

    // Check if it was overdue
    if (transaction.checkOverdue()) {
      console.log(`⚠️  Book was returned late by ${user.name}`);
      this.notificationService.notifyUser(
        user,
        `Late return fee may apply for "${book.title}"`,
      );
    } else {
      console.log(`✓ ${user.name} returned "${book.title}" on time`);
    }

    return true;
  }

  /**
   * View borrowed books by user
   */
  viewBorrowedBooks(userId) {
    const user = this.findUserById(userId);

    if (!user) {
      console.log(`✗ Error: User ${userId} not found`);
      return [];
    }

    return user.borrowedBooks;
  }

  // ============================================================
  // OVERDUE MANAGEMENT
  // ============================================================

  /**
   * Check for overdue books and notify users
   */
  checkOverdueBooks() {
    console.log("\n🔍 Checking for overdue books...");

    let overdueCount = 0;

    this.activeTransactions.forEach((transaction) => {
      if (transaction.checkOverdue() && !transaction.isOverdue) {
        transaction.isOverdue = true;
        overdueCount++;

        this.notificationService.notifyUser(
          transaction.user,
          `⚠️ OVERDUE: "${transaction.book.title}" was due on ${transaction.dueDate.toDateString()}`,
        );
      }
    });

    if (overdueCount > 0) {
      console.log(`⚠️  Found ${overdueCount} overdue book(s)`);
    } else {
      console.log(`✓ No overdue books`);
    }
  }

  // ============================================================
  // REPORTING
  // ============================================================

  /**
   * Display library statistics
   */
  displayStats() {
    console.log("\n" + "=".repeat(60));
    console.log("LIBRARY SYSTEM STATISTICS");
    console.log("=".repeat(60));
    console.log(`Total Users: ${this.users.length}`);
    console.log(`Total Books: ${this.books.length}`);
    console.log(`Available Books: ${this.getAvailableBooks().length}`);
    console.log(`Active Borrowings: ${this.activeTransactions.length}`);
    console.log(`Total Transactions: ${this.transactions.length}`);
    console.log("=".repeat(60) + "\n");
  }

  /**
   * Display all users
   */
  displayUsers() {
    console.log("\n" + "=".repeat(60));
    console.log("REGISTERED USERS");
    console.log("=".repeat(60));

    this.users.forEach((user) => {
      const info = user.getInfo();
      console.log(
        `${info.id} | ${info.name} (${info.type}) | Borrowed: ${info.borrowedBooks}/${info.maxLimit}`,
      );
    });

    console.log("=".repeat(60) + "\n");
  }

  /**
   * Display all books
   */
  displayBooks() {
    console.log("\n" + "=".repeat(60));
    console.log("LIBRARY CATALOG");
    console.log("=".repeat(60));

    this.books.forEach((book) => {
      const status = book.isAvailable ? "✓ Available" : "✗ Borrowed";
      console.log(`${book.id} | "${book.title}" by ${book.author} | ${status}`);
    });

    console.log("=".repeat(60) + "\n");
  }

  /**
   * Display active transactions
   */
  displayActiveTransactions() {
    console.log("\n" + "=".repeat(60));
    console.log("ACTIVE BORROWINGS");
    console.log("=".repeat(60));

    if (this.activeTransactions.length === 0) {
      console.log("No active borrowings");
    } else {
      this.activeTransactions.forEach((t) => {
        const info = t.getInfo();
        const status = info.isOverdue ? "⚠️ OVERDUE" : "✓ On time";
        console.log(
          `${info.id} | ${info.userName} | "${info.bookTitle}" | Due: ${info.dueDate} | ${status}`,
        );
      });
    }

    console.log("=".repeat(60) + "\n");
  }
}

// ============================================================
// TESTING AND DEMONSTRATION
// ============================================================

function runLibrarySystemDemo() {
  console.log("\n" + "█".repeat(60));
  console.log("SMART LIBRARY MANAGEMENT SYSTEM - DEMONSTRATION");
  console.log("█".repeat(60) + "\n");

  // Get singleton instance
  const library = LibrarySystem.getInstance();

  // Verify singleton pattern
  const library2 = LibrarySystem.getInstance();
  console.log(
    `Singleton Pattern Test: ${library === library2 ? "✓ PASSED" : "✗ FAILED"}\n`,
  );

  console.log("--- Step 1: Creating Users (Factory Pattern) ---");
  const student1 = UserFactory.createUser(
    "student",
    "Alice Johnson",
    "alice@university.edu",
    "S12345",
  );
  const student2 = UserFactory.createUser(
    "student",
    "Bob Smith",
    "bob@university.edu",
    "S12346",
  );
  const teacher1 = UserFactory.createUser(
    "teacher",
    "Dr. Carol White",
    "carol@university.edu",
    "Computer Science",
  );
  const teacher2 = UserFactory.createUser(
    "teacher",
    "Prof. David Brown",
    "david@university.edu",
    "Mathematics",
  );

  library.addUser(student1);
  library.addUser(student2);
  library.addUser(teacher1);
  library.addUser(teacher2);

  console.log("\n--- Step 2: Adding Books to Library ---");
  const book1 = new Book(
    "Clean Code",
    "Robert C. Martin",
    "978-0132350884",
    "Programming",
  );
  const book2 = new Book(
    "Design Patterns",
    "Gang of Four",
    "978-0201633612",
    "Software Engineering",
  );
  const book3 = new Book(
    "Introduction to Algorithms",
    "CLRS",
    "978-0262033848",
    "Computer Science",
  );
  const book4 = new Book(
    "The Pragmatic Programmer",
    "Hunt & Thomas",
    "978-0135957059",
    "Programming",
  );
  const book5 = new Book(
    "Refactoring",
    "Martin Fowler",
    "978-0134757599",
    "Software Engineering",
  );
  const book6 = new Book(
    "Code Complete",
    "Steve McConnell",
    "978-0735619678",
    "Programming",
  );

  library.addBook(book1);
  library.addBook(book2);
  library.addBook(book3);
  library.addBook(book4);
  library.addBook(book5);
  library.addBook(book6);

  // Display initial state
  library.displayUsers();
  library.displayBooks();
  library.displayStats();

  console.log("--- Step 3: Borrowing Books ---\n");
  library.borrowBook(student1.id, book1.id);
  library.borrowBook(student1.id, book2.id);
  library.borrowBook(student2.id, book3.id);
  library.borrowBook(teacher1.id, book4.id);
  library.borrowBook(teacher1.id, book5.id);
  library.borrowBook(teacher1.id, book6.id);

  // Display active transactions
  library.displayActiveTransactions();

  console.log("\n--- Step 4: Testing Borrow Limits ---\n");
  library.borrowBook(student1.id, book6.id); // Should fail - already has 2 books
  library.borrowBook(student1.id, book3.id); // Should pass - now has 3 books (limit)

  console.log("\n--- Step 5: View Borrowed Books ---\n");
  const aliceBorrowed = library.viewBorrowedBooks(student1.id);
  console.log(`Alice's borrowed books (${aliceBorrowed.length}):`);
  aliceBorrowed.forEach((t) => {
    console.log(`  - "${t.book.title}" (Due: ${t.dueDate.toDateString()})`);
  });

  console.log("\n--- Step 6: Returning Books ---\n");
  library.returnBook(student1.id, book1.id);
  library.returnBook(student2.id, book3.id);

  library.displayActiveTransactions();

  console.log("--- Step 7: Check for Overdue Books (Observer Pattern) ---");
  library.checkOverdueBooks();

  console.log("\n--- Step 8: View User Notifications ---\n");
  console.log(`Alice's notifications (${student1.notifications.length}):`);
  student1.notifications.forEach((notif, index) => {
    console.log(`  ${index + 1}. ${notif.message}`);
  });

  // Final statistics
  library.displayStats();
  library.displayBooks();

  console.log("\n" + "█".repeat(60));
  console.log("DEMONSTRATION COMPLETED");
  console.log("█".repeat(60) + "\n");

  console.log("Design Patterns Demonstrated:");
  console.log("✓ Singleton Pattern - LibrarySystem (single instance)");
  console.log("✓ Factory Pattern - UserFactory (creates different user types)");
  console.log("✓ Observer Pattern - NotificationService (notifies users)");
  console.log("\nOOP Principles Applied:");
  console.log("✓ Abstraction - Abstract User class");
  console.log("✓ Inheritance - Student and Teacher extend User");
  console.log("✓ Encapsulation - Private data, public methods");
  console.log("✓ Polymorphism - Different user types with same interface\n");
}

// Run the demonstration
runLibrarySystemDemo();

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    User,
    Student,
    Teacher,
    UserFactory,
    Book,
    BorrowTransaction,
    NotificationService,
    LibrarySystem,
  };
}
