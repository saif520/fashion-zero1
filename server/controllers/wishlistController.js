import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

// Add to wishlist
export const addToWishlist = catchAsyncError(async (req, res, next) => {
  const { productId } = req.body;

  if (!productId) return next(new ErrorHandler("Product ID is required", 400));

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      items: [{ product: productId }],
    });
  } else {
    const exists = wishlist.items.find(
      item => item.product.toString() === productId
    );

    if (exists) return next(new ErrorHandler("Product already in wishlist", 409));

    wishlist.items.push({ product: productId });
    await wishlist.save();
  }

  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
    wishlist
  });
});

// Get user wishlist
export const getMyWishlist = catchAsyncError(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("items.product");

  res.status(200).json({
    success: true,
    wishlist: wishlist || { items: [] }
  });
});

// Remove from wishlist
export const removeFromWishlist = catchAsyncError(async (req, res, next) => {
  const { productId } = req.body;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return next(new ErrorHandler("Wishlist not found", 404));

  wishlist.items = wishlist.items.filter(
    item => item.product.toString() !== productId
  );

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    wishlist
  });
});


// ✅ Move item from wishlist to cart — with size+stock check
export const moveToCart = catchAsyncError(async (req, res, next) => {
  const { productId, size, quantity } = req.body;

  if (!productId || !size || !quantity) {
    return next(new ErrorHandler("Product ID, size, and quantity are required", 400));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  // Ensure colors and stock exist
  if (!Array.isArray(product.colors) || product.colors.length === 0) {
    return next(new ErrorHandler("Product does not have color/stock data", 500));
  }

  // Flatten and search for stock by size across all colors
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

  // Check wishlist
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return next(new ErrorHandler("Wishlist not found", 404));

  const inWishlist = wishlist.items.find(
    item => item.product.toString() === productId
  );

  if (!inWishlist) {
    return next(new ErrorHandler("Product not found in wishlist", 404));
  }

  // Check cart
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create new cart and add item
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, size, quantity }],
    });
  } else {
    const existingCartItem = cart.items.find(
      item => item.product.toString() === productId && item.size === size
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

      existingCartItem.quantity = totalQuantity; // merge quantity
    } else {
      cart.items.push({ product: productId, size, quantity });
    }

    await cart.save();
  }

  // Remove from wishlist
  wishlist.items = wishlist.items.filter(
    item => item.product.toString() !== productId
  );
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Item moved from wishlist to cart",
    cart,
    wishlist,
  });
});
