// services/LibraryService.js
import { IdGenerator } from '../utils/IdGenerator.js';
import { Validator } from '../utils/Validator.js';

export class LibraryService {
  constructor(eventPublisher) {
    this.books = [];
    this.members = [];
    this.eventPublisher = eventPublisher; // Dependency Injection
  }

  // Book Management
  addBook(book) {
    const validation = Validator.validateBookData(book);
    if (!validation.isValid) {
      throw new Error(`Invalid book data: ${validation.errors.join(', ')}`);
    }

    this.books.push(book);
    
    if (this.eventPublisher) {
      this.eventPublisher.notify('BOOK_ADDED', {
        bookId: book.id,
        title: book.title,
        author: book.author,
        message: `New book added: ${book.title}`
      });
    }

    return book;
  }

  removeBook(bookId) {
    const index = this.books.findIndex(b => b.id === bookId);
    if (index !== -1) {
      const book = this.books.splice(index, 1)[0];
      
      if (this.eventPublisher) {
        this.eventPublisher.notify('BOOK_REMOVED', {
          bookId: book.id,
          title: book.title,
          message: `Book removed: ${book.title}`
        });
      }
      
      return book;
    }
    return null;
  }

  findBookById(bookId) {
    return this.books.find(b => b.id === bookId);
  }

  getAllBooks() {
    return [...this.books];
  }

  // Member Management
  addMember(member) {
    const validation = Validator.validateMemberData(member);
    if (!validation.isValid) {
      throw new Error(`Invalid member data: ${validation.errors.join(', ')}`);
    }

    this.members.push(member);
    
    if (this.eventPublisher) {
      this.eventPublisher.notify('MEMBER_REGISTERED', {
        memberId: member.id,
        name: member.name,
        email: member.email,
        message: `New member registered: ${member.name}`
      });
    }

    return member;
  }

  findMemberById(memberId) {
    return this.members.find(m => m.id === memberId);
  }

  getAllMembers() {
    return [...this.members];
  }

  // Borrowing Management
  borrowBook(memberId, bookId) {
    const member = this.findMemberById(memberId);
    const book = this.findBookById(bookId);

    if (!member) {
      throw new Error('Member not found');
    }

    if (!book) {
      throw new Error('Book not found');
    }

    if (!book.isAvailable()) {
      throw new Error('Book is not available');
    }

    if (!member.canBorrow()) {
      throw new Error('Member has reached borrowing limit');
    }

    book.borrow();
    member.borrowBook(bookId);

    const transactionId = IdGenerator.generateTransactionId();

    if (this.eventPublisher) {
      this.eventPublisher.notify('BOOK_BORROWED', {
        transactionId,
        memberId: member.id,
        memberName: member.name,
        email: member.email,
        bookId: book.id,
        bookTitle: book.title,
        borrowDate: new Date().toISOString(),
        message: `${member.name} borrowed "${book.title}"`
      });
    }

    return { transactionId, member, book };
  }

  returnBook(memberId, bookId) {
    const member = this.findMemberById(memberId);
    const book = this.findBookById(bookId);

    if (!member) {
      throw new Error('Member not found');
    }

    if (!book) {
      throw new Error('Book not found');
    }

    if (!member.returnBook(bookId)) {
      throw new Error('Member has not borrowed this book');
    }

    book.return();

    if (this.eventPublisher) {
      this.eventPublisher.notify('BOOK_RETURNED', {
        memberId: member.id,
        memberName: member.name,
        email: member.email,
        bookId: book.id,
        bookTitle: book.title,
        returnDate: new Date().toISOString(),
        message: `${member.name} returned "${book.title}"`
      });
    }

    return { member, book };
  }

  // Statistics
  getStatistics() {
    const totalBooks = this.books.length;
    const availableBooks = this.books.filter(b => b.isAvailable()).length;
    const borrowedBooks = totalBooks - availableBooks;
    const totalMembers = this.members.length;

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalMembers
    };
  }
}
