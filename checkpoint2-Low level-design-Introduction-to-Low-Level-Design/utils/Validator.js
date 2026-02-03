// utils/Validator.js

export class Validator {
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidISBN(isbn) {
    // Simple ISBN validation (ISBN-10 or ISBN-13)
    const isbn10Regex = /^[\d-]{10,13}$/;
    return isbn10Regex.test(isbn.replace(/[-\s]/g, ''));
  }

  static isNotEmpty(value) {
    return value !== null && value !== undefined && value.trim().length > 0;
  }

  static isPositiveNumber(value) {
    return typeof value === 'number' && value > 0;
  }

  static validateBookData(data) {
    const errors = [];

    if (!this.isNotEmpty(data.title)) {
      errors.push('Title is required');
    }

    if (!this.isNotEmpty(data.author)) {
      errors.push('Author is required');
    }

    if (!this.isValidISBN(data.isbn)) {
      errors.push('Invalid ISBN format');
    }

    if (!this.isPositiveNumber(data.availableCopies)) {
      errors.push('Available copies must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateMemberData(data) {
    const errors = [];

    if (!this.isNotEmpty(data.name)) {
      errors.push('Name is required');
    }

    if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    const validTypes = ['standard', 'premium', 'student'];
    if (data.membershipType && !validTypes.includes(data.membershipType)) {
      errors.push('Invalid membership type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
