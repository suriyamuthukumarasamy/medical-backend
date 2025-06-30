const Product = require("../../product/models/medicine");

//  CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      expiryDate,
      prescriptionRequired,
      price,
      category,
      quantity,
      description,
      image,
    } = req.body;

    // Optional: Basic validation
    if (!name || !brand || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new Product({
      name,
      brand,
      expiryDate,
      prescriptionRequired,
      price,
      category,
      quantity,
      description,
      image,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Product creation failed", error: error.message });
  }
};

//  GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Fetching products failed", error: err.message });
  }
};

// GET PRODUCT BY ID
const getProductsById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};

//  UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    //  Prevent _id from being updated
    const updateData = { ...req.body };
    delete updateData._id;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Product update failed", error: err.message });
  }
};

//  DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

// ✅ EXPORT
module.exports = {
  createProduct,
  getProducts,
  getProductsById,
  updateProduct,
  deleteProduct,
};
