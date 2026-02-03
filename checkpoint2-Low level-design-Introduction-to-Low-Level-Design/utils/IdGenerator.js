// utils/IdGenerator.js

export class IdGenerator {
  static generateBookId() {
    return `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  static generateMemberId() {
    return `MB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  static generateTransactionId() {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  static generateId(prefix = 'ID') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}
