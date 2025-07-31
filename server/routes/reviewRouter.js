import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.js';
import {
  addOrUpdateReview,
  getProductReviews,
  deleteReview,
  moderateReview,
  getRatingBreakdown
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', isAuthenticated, addOrUpdateReview); // POST /api/v1/review/
router.get('/product/:productId', getProductReviews); // GET /api/v1/review/product/:productId
router.delete('/:id', isAuthenticated, deleteReview); // DELETE /api/v1/review/:id
router.put('/moderate/:id', isAuthenticated, isAdmin, moderateReview);
router.get("/breakdown/:productId", getRatingBreakdown);



export default router;
