// SQL table structure defined in config/mySQL.js init function
// This file can contain SQL-specific utility functions if needed

const { pool } = require("../config/mySQL");

class ProductSQL {
  // Helper methods for SQL operations can be added here
  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM products");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }
}

module.exports = ProductSQL;
