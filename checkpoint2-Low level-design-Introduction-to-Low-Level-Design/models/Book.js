// models/Book.js
export class Book {
  constructor(id, title, author, isbn, category, availableCopies = 1) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.category = category;
    this.availableCopies = availableCopies;
    this.totalCopies = availableCopies;
  }

  isAvailable() {
    return this.availableCopies > 0;
  }

  borrow() {
    if (this.isAvailable()) {
      this.availableCopies--;
      return true;
    }
    return false;
  }

  return() {
    if (this.availableCopies < this.totalCopies) {
      this.availableCopies++;
      return true;
    }
    return false;
  }

  getInfo() {
    return `${this.title} by ${this.author} (ISBN: ${this.isbn}) - Available: ${this.availableCopies}/${this.totalCopies}`;
  }
}
