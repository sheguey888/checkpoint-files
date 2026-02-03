// index.js
import { Member } from './models/Member.js';
import { BookFactory } from './patterns/BookFactory.js';
import { 
  BookSearchContext, 
  TitleSearchStrategy, 
  AuthorSearchStrategy,
  CategorySearchStrategy,
  AvailabilitySearchStrategy
} from './patterns/SearchStrategy.js';
import {
  LibraryEventPublisher,
  EmailNotificationObserver,
  LogNotificationObserver,
  SMSNotificationObserver
} from './patterns/Observer.js';
import { LibraryService } from './services/LibraryService.js';
import { IdGenerator } from './utils/IdGenerator.js';

console.log('='.repeat(60));
console.log('LIBRARY MANAGEMENT SYSTEM - DEMONSTRATION');
console.log('='.repeat(60));
console.log();

// 1. Setup Observer Pattern - Event Publisher with Observers
console.log('--- Setting up Event Publisher and Observers ---');
const eventPublisher = new LibraryEventPublisher();
const emailObserver = new EmailNotificationObserver();
const logObserver = new LogNotificationObserver();
const smsObserver = new SMSNotificationObserver();

eventPublisher.subscribe(emailObserver);
eventPublisher.subscribe(logObserver);
eventPublisher.subscribe(smsObserver);
console.log('✓ Observers subscribed to event publisher\n');

// 2. Initialize Library Service with Dependency Injection
console.log('--- Initializing Library Service ---');
const libraryService = new LibraryService(eventPublisher);
console.log('✓ Library Service initialized with event publisher\n');

// 3. Factory Pattern - Create Books
console.log('--- Creating Books using Factory Pattern ---');
const fictionBooks = [
  {
    id: IdGenerator.generateBookId(),
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    availableCopies: 3
  },
  {
    id: IdGenerator.generateBookId(),
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0061120084',
    availableCopies: 2
  }
];

const scienceBooks = [
  {
    id: IdGenerator.generateBookId(),
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    isbn: '978-0553380163',
    availableCopies: 2
  }
];

const technologyBooks = [
  {
    id: IdGenerator.generateBookId(),
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    availableCopies: 4
  }
];

// Create books using factory
const createdFictionBooks = BookFactory.createBulkBooks('fiction', fictionBooks);
const createdScienceBooks = BookFactory.createBulkBooks('science', scienceBooks);
const createdTechnologyBooks = BookFactory.createBulkBooks('technology', technologyBooks);

// Add books to library
console.log('\nAdding books to library...');
[...createdFictionBooks, ...createdScienceBooks, ...createdTechnologyBooks].forEach(book => {
  libraryService.addBook(book);
});
console.log();

// 4. Create Members
console.log('--- Registering Members ---');
const member1 = new Member(
  IdGenerator.generateMemberId(),
  'Alice Johnson',
  'alice@example.com',
  'premium'
);

const member2 = new Member(
  IdGenerator.generateMemberId(),
  'Bob Smith',
  'bob@example.com',
  'standard'
);

const member3 = new Member(
  IdGenerator.generateMemberId(),
  'Charlie Brown',
  'charlie@example.com',
  'student'
);

libraryService.addMember(member1);
libraryService.addMember(member2);
libraryService.addMember(member3);
console.log();

// 5. Strategy Pattern - Different Search Strategies
console.log('--- Demonstrating Search Strategies ---');
const searchContext = new BookSearchContext(new TitleSearchStrategy());

console.log('\n1. Search by Title (searching for "Time"):');
let results = searchContext.executeSearch(libraryService.getAllBooks(), 'Time');
results.forEach(book => console.log(`   - ${book.getInfo()}`));

console.log('\n2. Search by Author (searching for "Martin"):');
searchContext.setStrategy(new AuthorSearchStrategy());
results = searchContext.executeSearch(libraryService.getAllBooks(), 'Martin');
results.forEach(book => console.log(`   - ${book.getInfo()}`));

console.log('\n3. Search by Category (searching for "fiction"):');
searchContext.setStrategy(new CategorySearchStrategy());
results = searchContext.executeSearch(libraryService.getAllBooks(), 'fiction');
results.forEach(book => console.log(`   - ${book.getInfo()}`));

console.log('\n4. Search Available Books:');
searchContext.setStrategy(new AvailabilitySearchStrategy());
results = searchContext.executeSearch(libraryService.getAllBooks());
console.log(`   Found ${results.length} available books`);
console.log();

// 6. Borrowing and Returning Books
console.log('--- Borrowing and Returning Operations ---');
const allBooks = libraryService.getAllBooks();

console.log('\n1. Alice borrows "1984":');
try {
  libraryService.borrowBook(member1.id, allBooks[0].id);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
console.log();

console.log('2. Bob borrows "Clean Code":');
try {
  libraryService.borrowBook(member2.id, allBooks[3].id);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
console.log();

console.log('3. Alice returns "1984":');
try {
  libraryService.returnBook(member1.id, allBooks[0].id);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
console.log();

// 7. Display Statistics
console.log('--- Library Statistics ---');
const stats = libraryService.getStatistics();
console.log(`Total Books: ${stats.totalBooks}`);
console.log(`Available Books: ${stats.availableBooks}`);
console.log(`Borrowed Books: ${stats.borrowedBooks}`);
console.log(`Total Members: ${stats.totalMembers}`);
console.log();

// 8. Display Member Information
console.log('--- Member Information ---');
libraryService.getAllMembers().forEach(member => {
  console.log(member.getInfo());
});
console.log();

console.log('='.repeat(60));
console.log('DEMONSTRATION COMPLETE');
console.log('='.repeat(60));
