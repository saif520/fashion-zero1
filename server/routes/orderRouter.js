import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  updateOrderAndPaymentStatus,
  deleteOrder,
  searchOrders,
  searchUserOrders,
  cancelOrder
} from '../controllers/orderController.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Create a new order
router.post('/create', isAuthenticated, createOrder);

// Get logged-in user's orders
router.get('/my-orders', isAuthenticated, getUserOrders);

// Get order by id
router.get("/:id", isAuthenticated, getOrderById);

// Search user order
router.get("/my/search", isAuthenticated, searchUserOrders);

// Cancel user order
router.put("/:id/cancel", isAuthenticated, cancelOrder);

// Admin routes
router.get('/admin/orders', isAuthenticated, isAdmin, getAllOrders);
router.put('/admin/order/update/:id', isAuthenticated, isAdmin, updateOrderStatus);
router.put('/admin/order/:id/payment-status', isAuthenticated, isAdmin, updatePaymentStatus);
router.put('/admin/order/update-status/:id',isAuthenticated,isAdmin,updateOrderAndPaymentStatus);
router.get('/admin/search',isAuthenticated,isAdmin,searchOrders);
router.delete('/admin/order/delete/:id', isAuthenticated, isAdmin, deleteOrder);

export default router;