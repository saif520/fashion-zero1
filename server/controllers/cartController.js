import Wishlist from "../models/wishlistModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

// Add or update item in cart
export const addToCart = catchAsyncError(async (req, res, next) => {
  const { productId, size, quantity } = req.body;

  if (!productId || !size || !quantity) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  // ✅ Check for size in stock
  if (!Array.isArray(product.colors) || product.colors.length === 0) {
    return next(new ErrorHandler("Product does not have color/stock data", 500));
  }

  const stockForSize = product.colors
    .flatMap(colorObj => colorObj.stock || [])
    .find(stockItem => stockItem.size === size);

  if (!stockForSize) {
    return next(new ErrorHandler(`Size ${size} is not available for this product`, 400));
  }

  if (quantity > stockForSize.quantity) {
    return next(
      new ErrorHandler(
        `Only ${stockForSize.quantity} item(s) available in stock for size ${size}`,
        400
      )
    );
  }

  // ✅ Proceed with cart update
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, size, quantity }],
    });
  } else {
    const existingItem = cart.items.find(
      item => item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      const totalQuantity = existingItem.quantity + quantity;

      if (totalQuantity > stockForSize.quantity) {
        return next(
          new ErrorHandler(
            `Total quantity exceeds stock. Only ${stockForSize.quantity} available.`,
            400
          )
        );
      }

      existingItem.quantity = totalQuantity;
    } else {
      cart.items.push({ product: productId, size, quantity });
    }

    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    cart,
  });
});


// Get user cart
export const getMyCart = catchAsyncError(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  res.status(200).json({
    success: true,
    cart: cart || { items: [] }
  });
});

// Update item quantity or size
export const updateCartItem = catchAsyncError(async (req, res, next) => {
  const { productId, size, newSize, newQuantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  const item = cart.items.find(
    item => item.product.toString() === productId && item.size === size
  );
  if (!item) return next(new ErrorHandler("Cart item not found", 404));

  if (newSize) item.size = newSize;
  if (newQuantity !== undefined) item.quantity = newQuantity;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart item updated",
    cart
  });
});

// Remove item from cart
export const removeCartItem = catchAsyncError(async (req, res, next) => {
  const { productId, size } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  cart.items = cart.items.filter(
    item => !(item.product.toString() === productId && item.size === size)
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    cart
  });
});

// Move Item from Cart to Wishlist

export const moveToWishlist = catchAsyncError(async (req, res, next) => {
  const { productId, size } = req.body;

  if (!productId || !size) {
    return next(new ErrorHandler("Product ID and size are required.", 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // 1. Get the user's cart
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  // 2. Find the cart item
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (itemIndex === -1) {
    return next(new ErrorHandler("Item not found in cart", 404));
  }

  // 3. Get or create wishlist
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      items: [{ product: productId }],
    });
  } else {
    // Avoid duplicate products in wishlist
    const alreadyExists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (!alreadyExists) {
      wishlist.items.push({ product: productId });
    }
  }

  // 4. Remove item from cart
  cart.items.splice(itemIndex, 1);

  // 5. Save both
  await cart.save();
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Item moved to wishlist",
    cart,
    wishlist,
  });
});