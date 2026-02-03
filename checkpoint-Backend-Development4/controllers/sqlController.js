const { pool } = require("../config/mySQL");

// @desc    Create new product
// @route   POST /api/sql/products
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;

    const [result] = await pool.query(
      "INSERT INTO products (name, price, category, inStock) VALUES (?, ?, ?, ?)",
      [name, price, category || "", inStock !== undefined ? inStock : true],
    );

    const [newProduct] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId],
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully (MySQL)",
      data: newProduct[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all products
// @route   GET /api/sql/products
exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query("SELECT * FROM products");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single product
// @route   GET /api/sql/products/:id
exports.getProduct = async (req, res) => {
  try {
    const [products] = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: products[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/sql/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;

    // Check if product exists
    const [existing] = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (price !== undefined) {
      updates.push("price = ?");
      values.push(price);
    }
    if (category !== undefined) {
      updates.push("category = ?");
      values.push(category);
    }
    if (inStock !== undefined) {
      updates.push("inStock = ?");
      values.push(inStock);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(req.params.id);

    await pool.query(
      `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    const [updated] = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    res.status(200).json({
      success: true,
      message: "Product updated successfully (MySQL)",
      data: updated[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/sql/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    // Check if product exists
    const [existing] = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully (MySQL)",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
