import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';

export const updateProductRating = async (productId) => {
  // Get all reviews for the product
  const reviews = await Review.find({ product: productId });

  const reviewsCount = reviews.length;
  console.log(reviewsCount);
  const avgRating = reviewsCount === 0
    ? 0
    : reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount;

  // Update product's rating and review count
  await Product.findByIdAndUpdate(productId, {
    rating: avgRating.toFixed(1), // Rounded to 1 decimal place
    reviewsCount
  });
};
