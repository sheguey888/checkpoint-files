// patterns/SearchStrategy.js

// Interface-like base class
export class SearchStrategy {
  search(books, query) {
    throw new Error('Search method must be implemented');
  }
}

// Search by title
export class TitleSearchStrategy extends SearchStrategy {
  search(books, query) {
    const lowerQuery = query.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowerQuery)
    );
  }
}

// Search by author
export class AuthorSearchStrategy extends SearchStrategy {
  search(books, query) {
    const lowerQuery = query.toLowerCase();
    return books.filter(book => 
      book.author.toLowerCase().includes(lowerQuery)
    );
  }
}

// Search by ISBN
export class ISBNSearchStrategy extends SearchStrategy {
  search(books, query) {
    return books.filter(book => book.isbn === query);
  }
}

// Search by category
export class CategorySearchStrategy extends SearchStrategy {
  search(books, query) {
    const lowerQuery = query.toLowerCase();
    return books.filter(book => 
      book.category.toLowerCase() === lowerQuery
    );
  }
}

// Search by availability
export class AvailabilitySearchStrategy extends SearchStrategy {
  search(books, query) {
    return books.filter(book => book.isAvailable());
  }
}

// Context class that uses strategies
export class BookSearchContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  executeSearch(books, query) {
    if (!this.strategy) {
      throw new Error('Search strategy not set');
    }
    return this.strategy.search(books, query);
  }
}
