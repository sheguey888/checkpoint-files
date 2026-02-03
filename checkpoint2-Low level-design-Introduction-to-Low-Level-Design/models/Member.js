// models/Member.js
export class Member {
  constructor(id, name, email, membershipType = 'standard') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.membershipType = membershipType;
    this.borrowedBooks = [];
    this.borrowingHistory = [];
  }

  canBorrow() {
    const limits = {
      standard: 3,
      premium: 5,
      student: 2
    };
    return this.borrowedBooks.length < (limits[this.membershipType] || 3);
  }

  borrowBook(bookId) {
    if (this.canBorrow()) {
      this.borrowedBooks.push({
        bookId,
        borrowDate: new Date()
      });
      return true;
    }
    return false;
  }

  returnBook(bookId) {
    const index = this.borrowedBooks.findIndex(b => b.bookId === bookId);
    if (index !== -1) {
      const borrowed = this.borrowedBooks.splice(index, 1)[0];
      this.borrowingHistory.push({
        ...borrowed,
        returnDate: new Date()
      });
      return true;
    }
    return false;
  }

  getInfo() {
    return `${this.name} (${this.email}) - Type: ${this.membershipType} - Books borrowed: ${this.borrowedBooks.length}`;
  }
}
