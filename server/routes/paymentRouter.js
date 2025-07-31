import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create-payment-intent', isAuthenticated, createPaymentIntent);

export default router;
