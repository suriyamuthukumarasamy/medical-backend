const Product = require('../../product/models/medicine'); // Make sure path is correct

//  Add New Product (Admin Only)
const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      quantity,
      description,
      image,
      brand,
      expiryDate,
      prescriptionRequired,
    } = req.body;

    //  Check required fields
    if (
      !name || !price || !category || !quantity || !description ||
      !image || !brand || !expiryDate
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    //  Create product
    const product = await Product.create({
      name,
      price,
      category,
      quantity,
      description,
      image,
      brand,
      expiryDate,
      prescriptionRequired,
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    console.error("❌ Add product error:", error.message);
    res.status(500).json({ message: 'Server error while adding product' });
  }
};

//  Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Fetch error:", error.message);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

//  Get Single Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Get by ID error:", error.message);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
};

//  Update Product
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,             //  Return the updated document
        runValidators: true,   // Validate before saving
      }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updated,
    });
  } catch (error) {
    console.error("❌ Update error:", error.message);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error("❌ Delete error:", error.message);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};

//  Export all controllers
module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
