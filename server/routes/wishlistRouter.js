import express from "express";
import {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
  moveToCart
} from "../controllers/wishlistController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, addToWishlist);
router.get("/my-wishlist", isAuthenticated, getMyWishlist);
router.delete("/remove", isAuthenticated, removeFromWishlist);
router.post("/move-to-cart", isAuthenticated, moveToCart);

export default router;
