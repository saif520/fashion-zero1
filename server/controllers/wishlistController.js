
// server/controllers/wishlistController.js
import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

// ➕ Add to wishlist
export const addToWishlist = catchAsyncError(async (req, res, next) => {
  const { productId, color } = req.body;

  if (!productId || !color) {
    return next(new ErrorHandler("Product ID and color are required", 400));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      items: [{ product: productId, color }],
    });
  } else {
    const exists = wishlist.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.color.toLowerCase() === color.toLowerCase()
    );

    if (exists) {
      return next(new ErrorHandler("Product already in wishlist", 409));
    }

    wishlist.items.push({ product: productId, color });
    await wishlist.save();
  }

  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
    wishlist,
  });
});

// 📦 Get my wishlist
export const getMyWishlist = catchAsyncError(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("items.product");

  res.status(200).json({
    success: true,
    wishlist: wishlist || { items: [] },
  });
});

// ❌ Remove from wishlist
export const removeFromWishlist = catchAsyncError(async (req, res, next) => {
  const { productId, color } = req.body;

  if (!productId || !color) {
    return next(new ErrorHandler("Product ID and color are required", 400));
  }

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return next(new ErrorHandler("Wishlist not found", 404));

  wishlist.items = wishlist.items.filter(
    (item) =>
      !(
        item.product.toString() === productId &&
        item.color.toLowerCase() === color.toLowerCase()
      )
  );

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    wishlist,
  });
});

// 🔄 Move item from wishlist → cart (with new size & quantity)
export const moveToCart = catchAsyncError(async (req, res, next) => {
  const { productId, color, size, quantity } = req.body;

  if (!productId || !color || !size || !quantity) {
    return next(new ErrorHandler("Product ID, color, size, and quantity are required", 400));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  // ✅ Ensure stock exists for that color+size
  const colorObj = product.colors.find(
    (c) => c.color.toLowerCase() === color.toLowerCase()
  );
  if (!colorObj) return next(new ErrorHandler(`Color ${color} not available`, 400));

  const stockForSize = colorObj.stock?.find((s) => s.size === size);
  if (!stockForSize) {
    return next(new ErrorHandler(`Size ${size} not available in color ${color}`, 400));
  }

  if (quantity > stockForSize.quantity) {
    return next(
      new ErrorHandler(
        `Only ${stockForSize.quantity} item(s) available in stock for size ${size}`,
        400
      )
    );
  }

  // ✅ Get wishlist
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return next(new ErrorHandler("Wishlist not found", 404));

  const inWishlist = wishlist.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.color.toLowerCase() === color.toLowerCase()
  );
  if (!inWishlist) {
    return next(new ErrorHandler("Product not found in wishlist", 404));
  }

  // ✅ Add to cart
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, color, size, quantity }],
    });
  } else {
    const existingCartItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.color.toLowerCase() === color.toLowerCase() &&
        item.size === size
    );

    if (existingCartItem) {
      const totalQuantity = existingCartItem.quantity + quantity;
      if (totalQuantity > stockForSize.quantity) {
        return next(
          new ErrorHandler(
            `Total quantity exceeds stock. Only ${stockForSize.quantity} available.`,
            400
          )
        );
      }
      existingCartItem.quantity = totalQuantity;
    } else {
      cart.items.push({ product: productId, color, size, quantity });
    }

    await cart.save();
  }

  // ✅ Remove from wishlist
  wishlist.items = wishlist.items.filter(
    (item) =>
      !(
        item.product.toString() === productId &&
        item.color.toLowerCase() === color.toLowerCase()
      )
  );
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Item moved from wishlist to cart with new size & quantity",
    cart,
    wishlist,
  });
});
