 import Product from "../models/productModel.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

// Create a new product
export const createProduct = catchAsyncError(async (req, res, next) => {
  const {
    name, slug, description, brand, category,
    gender, price, discount, material, sizes,
    colors, tags, isFeatured, isNewArrival
  } = req.body;

  if (!name || !slug || !description || !brand || !category || !gender || !price || !material || !sizes || !colors) {
    return next(new ErrorHandler("Please provide all required product fields.", 400));
  }

  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    return next(new ErrorHandler("Product with this slug already exists.", 400));
  }

  const product = await Product.create({
    name,
    slug,
    description,
    brand,
    category,
    gender,
    price,
    discount,
    material,
    sizes,
    colors,
    tags,
    isFeatured,
    isNewArrival,
    admin: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    product
  });
});

// Get all products
export const getAllProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products
  });
});

// ✅ Get a product by ID
export const getProductById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});

// ✅ Get Product by Admin
export const getMyProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find({ admin: req.user._id });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// ✅ Update a product by ID
export const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    product
  });
});

// ✅ Delete a product by ID
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully."
  });
});


export const searchProducts = catchAsyncError(async (req, res, next) => {
  const {
    keyword,
    category,
    brand,
    gender,
    size,
    color,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = req.query;

  let query = {};

  if (keyword) query.name = { $regex: keyword, $options: "i" };
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (gender) query.gender = gender;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // For nested colors.color
  if (color) query["colors.color"] = { $regex: color, $options: "i" };

  // For deeply nested colors.stock.size
  if (size) query["colors.stock.size"] = size;

  const skip = (Number(page) - 1) * Number(limit);
  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const products = await Product.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    total,
    count: products.length,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    products
  });
}); 