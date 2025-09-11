// server/controllers/productController.js
import Product from "../models/productModel.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

// ✅ Create a new product
export const createProduct = catchAsyncError(async (req, res, next) => {
  const {
    name,
    slug,
    description,
    brand,
    category,
    categories,
    gender,
    price,
    discount = 0,
    material,
    sizes,
    colors,
    tags,
    isFeatured,
    isNewArrival,
  } = req.body;

  if (
    !name ||
    !slug ||
    !description ||
    !brand ||
    !category ||
    !gender ||
    !price ||
    !material ||
    !sizes ||
    !colors
  ) {
    return next(
      new ErrorHandler("Please provide all required product fields.", 400)
    );
  }

  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    return next(new ErrorHandler("Product with this slug already exists.", 400));
  }

  // 🔄 Auto calculate finalPrice (rounded to int)
  const finalPrice = Math.floor(
    discount && discount > 0 ? price - (price * discount) / 100 : price
  );

  const product = await Product.create({
    name,
    slug,
    description,
    brand,
    category,       // ✅ primary category
    categories,     // ✅ multiple categories
    gender,
    price,
    discount,
    finalPrice,     // 👈 always backend-calculated
    material,
    sizes,
    colors,
    tags,
    isFeatured,
    isNewArrival,
    admin: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    product,
  });
});

// ✅ Get all products
export const getAllProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
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
    product,
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

  const updates = req.body;

  // 🔄 Always recalc finalPrice on update (rounded to int)
  const newPrice = updates.price ?? product.price;
  const newDiscount = updates.discount ?? product.discount ?? 0;

  updates.finalPrice = Math.floor(
    newDiscount > 0 ? newPrice - (newPrice * newDiscount) / 100 : newPrice
  );

  product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    product,
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
    message: "Product deleted successfully.",
  });
});

// ✅ Search + Filter Products (all-in-one, case insensitive)
export const searchProducts = catchAsyncError(async (req, res, next) => {
  const {
    keyword,
    category,
    categories,
    brand,
    gender,
    size,
    color,
    minPrice,
    maxPrice,
    minDiscount,
    page = 1,
    limit = 100,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  let query = {};

  // 🔍 Keyword search (name, description, brand) - case insensitive
  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { brand: { $regex: keyword, $options: "i" } },
      { "colors.color": { $regex: keyword, $options: "i" } },
      { categories: { $regex: keyword, $options: "i" } }, // ✅ added
    ];
  }

  // 🎯 Filters
  if (category) {
    query.category = { $regex: `^${category}$`, $options: "i" }; // case insensitive
  }

  if (categories) {
    query.categories = { $all: categories.split(",").map((c) => c.trim()) };
  }

  if (brand) {
    query.brand = { $regex: brand, $options: "i" }; // case insensitive
  }

  if (gender) {
    query.gender = { $regex: gender, $options: "i" }; // case insensitive
  }

  if (color) {
    query["colors.color"] = { $regex: color, $options: "i" };
  }

  if (size) {
    query["colors.stock.size"] = size;
  }

  // 💰 Price filter (on finalPrice)
  if (minPrice || maxPrice) {
    query.finalPrice = {};
    if (minPrice) query.finalPrice.$gte = Number(minPrice);
    if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
  }

  // 🎁 Discount filter
  if (minDiscount) {
    query.discount = { $gte: Number(minDiscount) };
  }

  // 📑 Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // 🔒 Safe Sorting (whitelist)
  const allowedSortFields = [
    "createdAt",
    "price",
    "finalPrice",
    "discount",
    "name",
    "rating",
  ];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  // 📦 Fetch products
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
    products,
  });
});
