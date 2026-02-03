const Product = require("../models/ProductMongo");

// @desc    Create new product
// @route   POST /api/nosql/products
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;

    const product = await Product.create({
      name,
      price,
      category,
      inStock,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully (MongoDB)",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all products
// @route   GET /api/nosql/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

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
// @route   GET /api/nosql/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/nosql/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, inStock },
      { new: true, runValidators: true },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully (MongoDB)",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/nosql/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully (MongoDB)",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
