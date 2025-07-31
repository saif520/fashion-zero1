import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
  searchProducts
} from '../controllers/productController.js';

import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get('/get-all-products', getAllProducts);
router.get('/get-product-by-id/:id',getProductById);
router.get("/search", searchProducts);    
router.get("/get-my-products", isAuthenticated, isAdmin, getMyProducts);
router.post('/create-product',isAuthenticated, isAdmin, createProduct);        // Add isAuthenticated & isAdmin middleware here
router.put('/update-product/:id',isAuthenticated, isAdmin, updateProduct);      // Add isAuthenticated & isAdmin
router.delete('/delete-product/:id', isAuthenticated, isAdmin, deleteProduct);   // Add isAuthenticated & isAdmin

export default router; 