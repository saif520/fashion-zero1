import mongoose from 'mongoose'; 
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { updateProductRating } from '../utils/updateProductRating.js'; // ✅ import the helper
import { Filter } from 'bad-words'; // profanity filter
const filter = new Filter();

// Add or Update Review
export const addOrUpdateReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  if (!productId || !rating) {
    return next(new ErrorHandler('Product ID and rating are required.', 400));
  }

  // Minimum comment length enforcement
  if (comment && comment.trim().length < 10) {
    return next(new ErrorHandler('Comment must be at least 10 characters long.', 400));
  }

  // Profanity check
  if (comment && filter.isProfane(comment)) {
    return next(new ErrorHandler('Comment contains inappropriate language.', 400));
  }

  // Rate limiting: check if review was added recently
  const recentReview = await Review.findOne({
    user: req.user._id,
    product: productId,
    createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // within 5 minutes
  });

  if (recentReview) {
    return next(new ErrorHandler('You can only review this product once every 5 minutes.', 429));
  }

  // Check for existing review
  const existingReview = await Review.findOne({ user: req.user._id, product: productId });

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
    await existingReview.save();
    await updateProductRating(productId);

    return res.status(200).json({ success: true, message: 'Review updated', review: existingReview });
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  });

  await updateProductRating(productId);

  res.status(201).json({ success: true, message: 'Review added', review });
});


// Get reviews for a product
export const getProductReviews = catchAsyncError(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name');

  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// Delete a review (by user or admin)
export const deleteReview = catchAsyncError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) return next(new ErrorHandler('Review not found', 404));

  if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return next(new ErrorHandler('Not authorized to delete this review', 403));
  }
  
  const productId = review.product;

  await Review.findByIdAndDelete(req.params.id);

  await updateProductRating(productId); // ✅ update after deletion

  res.status(200).json({ success: true, message: 'Review deleted' });
});

// Approve or reject review (admin only)
export const moderateReview = catchAsyncError(async (req, res, next) => {
  const { status } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorHandler('Review not found', 404));

  if (!['approved', 'rejected'].includes(status)) {
    return next(new ErrorHandler('Invalid status value', 400));
  }

  review.status = status;
  await review.save();
  await updateProductRating(review.product);

  res.status(200).json({ success: true, message: `Review ${status}`, review });
});

// Get rating breakdown for a product
export const getRatingBreakdown = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  const breakdown = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        rating: "$_id",
        count: 1
      }
    }
  ]);

  // Build a normalized structure for 1–5 stars
  const result = [1, 2, 3, 4, 5].map((star) => ({
    rating: star,
    count: breakdown.find((b) => b.rating === star)?.count || 0
  })).reverse(); // optional: show 5→1

  res.status(200).json({ success: true, breakdown: result });
});
