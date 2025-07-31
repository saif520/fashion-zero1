import express from "express";
import {
  addToCart,
  getMyCart,
  updateCartItem,
  removeCartItem,
  moveToWishlist,
} from "../controllers/cartController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, addToCart);
router.get("/get", isAuthenticated, getMyCart);
router.put("/update", isAuthenticated, updateCartItem);
router.delete("/remove", isAuthenticated, removeCartItem);
router.post("/move-to-wishlist",isAuthenticated,moveToWishlist);

export default router;
