# Library Management System - Core Components

A modular and reusable Library Management System built with JavaScript ES modules, demonstrating various design patterns and best practices.

## 🏗️ Architecture

The system is organized into the following modules:

```
library-system/
├── models/          # Data models (Book, Member)
├── patterns/        # Design patterns implementations
│   ├── BookFactory.js       # Factory Pattern
│   ├── SearchStrategy.js    # Strategy Pattern
│   └── Observer.js          # Observer Pattern
├── services/        # Business logic
│   └── LibraryService.js
├── utils/           # Utility modules
│   ├── Validator.js
│   └── IdGenerator.js
├── package.json
└── index.js         # Demo application
```

## 🎯 Design Patterns Implemented

### 1. **Factory Pattern** (`patterns/BookFactory.js`)
- Creates different types of books (Fiction, Science, Technology, etc.)
- Centralizes object creation logic
- Supports bulk creation of books

### 2. **Strategy Pattern** (`patterns/SearchStrategy.js`)
- Multiple search strategies: Title, Author, ISBN, Category, Availability
- Allows switching between search algorithms at runtime
- Follows Open/Closed Principle

### 3. **Observer Pattern** (`patterns/Observer.js`)
- Event-driven notification system
- Multiple observers: Email, Log, SMS notifications
- Publishers notify subscribers about library events

## 🔧 Core Components

### Models
- **Book**: Represents a book with borrowing capabilities
- **Member**: Represents library members with borrowing limits

### Services
- **LibraryService**: Main service with dependency injection
  - Book management (add, remove, search)
  - Member management
  - Borrowing and returning operations
  - Statistics tracking

### Utilities
- **Validator**: Input validation for books and members
- **IdGenerator**: Generates unique IDs for entities

## 🚀 Features

✅ ES6 Modules for better code organization
✅ Dependency Injection for testability
✅ Interface-like abstractions
✅ Modular and reusable components
✅ Event-driven architecture
✅ Multiple search strategies
✅ Validation system
✅ Statistics tracking

## 📦 Installation

```bash
cd library-system
npm install
```

## ▶️ Running the Demo

```bash
npm start
```

## 💡 Usage Examples

### Creating Books with Factory Pattern
```javascript
import { BookFactory } from './patterns/BookFactory.js';

const book = BookFactory.createBook('fiction', {
  id: 'BK-001',
  title: '1984',
  author: 'George Orwell',
  isbn: '978-0451524935',
  availableCopies: 3
});
```

### Using Search Strategies
```javascript
import { BookSearchContext, TitleSearchStrategy } from './patterns/SearchStrategy.js';

const searchContext = new BookSearchContext(new TitleSearchStrategy());
const results = searchContext.executeSearch(books, 'Time');
```

### Setting up Observers
```javascript
import { LibraryEventPublisher, EmailNotificationObserver } from './patterns/Observer.js';

const publisher = new LibraryEventPublisher();
const emailObserver = new EmailNotificationObserver();
publisher.subscribe(emailObserver);
```

### Using Library Service with Dependency Injection
```javascript
import { LibraryService } from './services/LibraryService.js';

const libraryService = new LibraryService(eventPublisher);
libraryService.borrowBook(memberId, bookId);
```

## 🎓 Key Concepts Demonstrated

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in different contexts
3. **Testability**: Dependency injection makes testing easier
4. **Extensibility**: New strategies and observers can be added easily
5. **Separation of Concerns**: Clear separation between models, patterns, services, and utilities

## 📝 License

MIT
