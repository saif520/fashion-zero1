
import Wishlist from "../models/wishlistModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";


// Add or update item in cart
export const addToCart = catchAsyncError(async (req, res, next) => {
  const { productId, color, size, quantity } = req.body;

  if (!productId || !color || !size || !quantity) {
    return next(new ErrorHandler("Product, color, size, and quantity are required.", 400));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  // ✅ Check for color
  const colorObj = product.colors.find(c => c.color.toLowerCase() === color.toLowerCase());
  if (!colorObj) {
    return next(new ErrorHandler(`Color ${color} is not available for this product`, 400));
  }

  // ✅ Check size inside that color
  const stockForSize = colorObj.stock.find(stockItem => stockItem.size === size);
  if (!stockForSize) {
    return next(new ErrorHandler(`Size ${size} is not available for color ${color}`, 400));
  }

  if (quantity > stockForSize.quantity) {
    return next(
      new ErrorHandler(
        `Only ${stockForSize.quantity} item(s) available in stock for size ${size} and color ${color}`,
        400
      )
    );
  }

  // ✅ Proceed with cart update
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, color, size, quantity }],
    });
  } else {
    const existingItem = cart.items.find(
      item =>
        item.product.toString() === productId &&
        item.color.toLowerCase() === color.toLowerCase() &&
        item.size === size
    );

    if (existingItem) {
      const totalQuantity = existingItem.quantity + quantity;

      if (totalQuantity > stockForSize.quantity) {
        return next(
          new ErrorHandler(
            `Total quantity exceeds stock. Only ${stockForSize.quantity} available for this color/size.`,
            400
          )
        );
      }

      existingItem.quantity = totalQuantity;
    } else {
      cart.items.push({ product: productId, color, size, quantity });
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


// Update item quantity, size, or color
export const updateCartItem = catchAsyncError(async (req, res, next) => {
  const { productId, color, size, newColor, newSize, newQuantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  const item = cart.items.find(
    item =>
      item.product.toString() === productId &&
      item.color.toLowerCase() === color.toLowerCase() &&
      item.size === size
  );
  if (!item) return next(new ErrorHandler("Cart item not found", 404));

  if (newColor) item.color = newColor;
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
  const { productId, color, size } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  const initialLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) =>
      !(
        item.product.toString() === productId &&
        item.color.toLowerCase() === color.toLowerCase() &&
        item.size === size
      )
  );

  if (cart.items.length === initialLength) {
    return next(new ErrorHandler("Cart item not found", 404));
  }

  // 🔑 Important: tell mongoose items array was modified
  cart.markModified("items");
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    cart,
  });
});



// 🔄 Move Item from Cart → Wishlist (with color & size)
export const moveToWishlist = catchAsyncError(async (req, res, next) => {
  const { productId, color, size } = req.body;

  if (!productId || !color || !size) {
    return next(new ErrorHandler("Product ID, color, and size are required.", 400));
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
    (item) =>
      item.product.toString() === productId &&
      item.color.toLowerCase() === color.toLowerCase() &&
      item.size === size
  );

  if (itemIndex === -1) {
    return next(new ErrorHandler("Item not found in cart", 404));
  }

  const cartItem = cart.items[itemIndex];

  // 3. Get or create wishlist
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      items: [{ product: productId, color, size, quantity: cartItem.quantity }],
    });
  } else {
    // Avoid duplicate (productId + color + size)
    const alreadyExists = wishlist.items.some(
      (item) =>
        item.product.toString() === productId &&
        item.color?.toLowerCase() === color.toLowerCase() &&
        item.size === size
    );

    if (!alreadyExists) {
      wishlist.items.push({
        product: productId,
        color,
        size,
        quantity: cartItem.quantity,
      });
    }
  }

  // 4. Remove item from cart
  cart.items.splice(itemIndex, 1);

  // 5. Save both
  await cart.save();
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Item moved to wishlist with color & size",
    cart,
    wishlist,
  });
});
