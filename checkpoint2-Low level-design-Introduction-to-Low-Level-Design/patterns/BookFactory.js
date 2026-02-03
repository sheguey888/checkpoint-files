// patterns/BookFactory.js
import { Book } from '../models/Book.js';

export class BookFactory {
  static createBook(type, data) {
    const { id, title, author, isbn, availableCopies } = data;
    
    switch (type.toLowerCase()) {
      case 'fiction':
        return new Book(id, title, author, isbn, 'Fiction', availableCopies);
      
      case 'nonfiction':
        return new Book(id, title, author, isbn, 'Non-Fiction', availableCopies);
      
      case 'science':
        return new Book(id, title, author, isbn, 'Science', availableCopies);
      
      case 'technology':
        return new Book(id, title, author, isbn, 'Technology', availableCopies);
      
      case 'history':
        return new Book(id, title, author, isbn, 'History', availableCopies);
      
      default:
        return new Book(id, title, author, isbn, 'General', availableCopies);
    }
  }

  static createBulkBooks(type, booksData) {
    return booksData.map(data => this.createBook(type, data));
  }
}
