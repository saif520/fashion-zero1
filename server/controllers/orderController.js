import Order from '../models/orderModel.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { sendEmail } from '../utils/sendEmail.js';
import { User } from '../models/userModel.js';
import Cart from "../models/cartModel.js";

// Create order
// Create order
export const createOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    paymentInfo,
    totalAmount,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHandler("Order must contain at least one item.", 400));
  }

  if (!shippingInfo?.name || !shippingInfo?.phone || !shippingInfo?.pincode || !shippingInfo?.address || !shippingInfo?.city || !shippingInfo?.state) {
    return next(new ErrorHandler("Please provide all required shipping information.", 400));
  }

  if (!/^\d{10}$/.test(shippingInfo.phone)) {
    return next(new ErrorHandler("Invalid phone number. It must be exactly 10 digits.", 400));
  }

  if (!paymentInfo?.method) {
    return next(new ErrorHandler("Payment method is required.", 400));
  }

  if (typeof totalAmount !== "number") {
    return next(new ErrorHandler("Invalid total amount.", 400));
  }


  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingInfo,
    paymentInfo,
    totalAmount,
  });

  // ✅ Clear the user's cart after placing order
  await Cart.findOneAndDelete({ user: req.user._id });

  // ✅ Send confirmation email
  const user = await User.findById(req.user._id);
  await sendEmail({
    email: user.email,
    subject: `Order Confirmation - ${order._id}`,
    message: `
      <h3>Hi ${shippingInfo.name},</h3>
      <p>Thank you for your order!</p>
      <p>Your order <strong>#${order._id}</strong> has been <strong>placed</strong> successfully.</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      <p><strong>Payment Method:</strong> ${paymentInfo.method}</p>
      <p>We’ll update you when the order is processed.</p>
      <br/>
      <p>Shipping Address:</p>
      <p>${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}</p>
      <br/>
      <p>Thank you for shopping with us!</p>
    `,
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully and cart cleared",
    order,
  });
});


// Get user orders
export const getUserOrders = catchAsyncError(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');
  res.status(200).json({ success: true, orders });
});

// Get single order
export const getOrderById = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  .populate('user', 'name email')
  .populate('orderItems.product'); // ✅ Add this line


  if (!order) return next(new ErrorHandler('Order not found', 404));

  res.status(200).json({ success: true, order });
});


// Search Product By User
export const searchUserOrders = catchAsyncError(async (req, res) => {
  const { status, orderId, startDate, endDate, page = 1, limit = 10 } = req.query;

  const query = { user: req.user._id };

  if (status) query.orderStatus = status;

  if (orderId) query._id = orderId;

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const orders = await Order.find(query)
    .populate("orderItems.product")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: orders.length,
    orders
  });
});

// Cancel Order (User)
export const cancelOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'email name');

  if (!order) return next(new ErrorHandler("Order not found", 404));
  if (order.user._id.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized to cancel this order", 403));
  }

  if (order.orderStatus !== "Pending") {
    return next(new ErrorHandler("Only pending orders can be cancelled", 400));
  }

  order.orderStatus = "Cancelled";
  await order.save();

  // Send cancellation email
  await sendEmail({
    email: order.user.email,
    subject: `Order Cancelled - ${order._id}`,
    message: `
      <h3>Hi ${order.user.name},</h3>
      <p>Your order has been successfully <strong>cancelled.</strong></p>
      <p>Order ID: ${order._id}</p>
      <p>Total Amount: ₹${order.totalAmount}</p>
      <br/>
      <p>We hope to see you again soon.</p>
    `,
  });

  res.status(200).json({
    success: true,
    message: "Order cancelled and email sent",
    order,
  });
});


// Admin: Get all orders
export const getAllOrders = catchAsyncError(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  res.status(200).json({ success: true, orders });
});


// Admin: Update order status
// PUT /api/v1/order/admin/update/:id 

export const updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'email name');
  if (!order) return next(new ErrorHandler("Order not found", 404));

  const newStatus = req.body.orderStatus;
  order.orderStatus = newStatus;

  if (newStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();

  await sendEmail({
    email: order.user.email,
    subject: `Order Status Updated - ${order._id}`,
    message: generateEmailMessage(newStatus, order),
  });

  res.status(200).json({
    success: true,
    message: "Order status updated and email sent",
    order,
  });
});

function generateEmailMessage(status, order) {
  switch (status) {
    case "Processing":
      return `
        <h3>Hi ${order.user.name},</h3>
        <p>Your order is now being <strong>processed.</strong></p>
        <p>Order ID: ${order._id}</p>
        <p>We’ll notify you when it ships.</p>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <br/>
        <p>Thank you for shopping with us!</p>
      `;
    case "Shipped":
      return `
        <h3>Hi ${order.user.name},</h3>
        <p>Your order has been <strong>shipped.</strong></p>
        <p>Order ID: ${order._id}</p>
        <p>It’s on the way and will reach you soon.</p>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <br/>
        <p>Thank you for choosing us!</p>
      `;
    case "Delivered":
      const reviewLink = `${process.env.FRONTEND_URL}/review?orderId=${order._id}`;
      return `
        <h3>Hi ${order.user.name},</h3>
        <p>Your order has been <strong>delivered</strong> successfully.</p>
        <p>Order ID: ${order._id}</p>
        <p>We hope you enjoy your purchase!</p>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <br/>
        <p>We’d love to hear your feedback.</p>
        <a href="${reviewLink}" style="display:inline-block;padding:10px 15px;background:#ff3f6c;color:#fff;border-radius:5px;text-decoration:none;">Leave a Review</a>
        <br/><br/>
        <p>Thank you for shopping with us!</p>
      `;
    case "Cancelled":
      return `
        <h3>Hi ${order.user.name},</h3>
        <p>Your order has been cancelled.</p>
        <p>Order ID: ${order._id}</p>
        <p>If you didn’t request this or have questions, please contact support.</p>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <br/>
        <p>We hope to serve you again.</p>
      `;
    default:
      return `
        <h3>Hi ${order.user.name},</h3>
        <p>Your order <strong>#${order._id}</strong> status has been updated to <strong>${status}</strong>.</p>
        <p>Order ID: ${order._id}</p>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <br/>
        <p>Thank you for shopping with us!</p>
      `;
  }
}

// Update payment status
export const updatePaymentStatus = catchAsyncError(async (req, res, next) => {
  const { status, id } = req.body;

  if (!status) return next(new ErrorHandler("Payment status is required", 400));

  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler("Order not found", 404));

  order.paymentInfo.status = status;
  if (id) {
    order.paymentInfo.id = id;
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Payment status updated successfully",
    // paymentInfo: order.paymentInfo,
    order
  });
});


// Update both orderStatus and payment status
export const updateOrderAndPaymentStatus = catchAsyncError(async (req, res, next) => {
  const { orderStatus, paymentStatus, paymentId } = req.body;

  const order = await Order.findById(req.params.id).populate('user', 'email name');
  if (!order) return next(new ErrorHandler("Order not found", 404));

  // Update order status
  if (orderStatus) {
    order.orderStatus = orderStatus;
    if (orderStatus === "Delivered") {
      order.deliveredAt = Date.now();
    }
  }

  // Update payment status
  if (paymentStatus) {
    order.paymentInfo.status = paymentStatus;
  }
  if (paymentId) {
    order.paymentInfo.id = paymentId;
  }

  await order.save();

  // ✅ Send email with review link only if delivered
  let emailMessage = `
    <h3>Hi ${order.user.name},</h3>
    <p>Your order <strong>#${order._id}</strong> has been updated.</p>
    ${orderStatus ? `<p><strong>Order Status:</strong> ${orderStatus}</p>` : ""}
    ${paymentStatus ? `<p><strong>Payment Status:</strong> ${paymentStatus}</p>` : ""}
    <p>Total Amount: ₹${order.totalAmount}</p>
    <br/>
  `;

  if (orderStatus === "Delivered") {
    const reviewLink = `${process.env.FRONTEND_URL}/review?orderId=${order._id}`;
    emailMessage += `
      <p>We hope you enjoy your purchase!</p>
      <p>We’d love to hear your feedback.</p>
      <a href="${reviewLink}" style="display:inline-block;padding:10px 15px;background:#ff3f6c;color:#fff;border-radius:5px;text-decoration:none;">Leave a Review</a>
      <br/><br/>
    `;
  }

  emailMessage += `<p>Thank you for shopping with us!</p>`;

  await sendEmail({
    email: order.user.email,
    subject: `Order Updated - ${order._id}`,
    message: emailMessage,
  });

  res.status(200).json({
    success: true,
    message: "Order and payment status updated successfully",
    order,
  });
});




// GET /api/v1/order/admin/search
export const searchOrders = catchAsyncError(async (req, res, next) => {
  const {
    keyword,            // can match user name, email or order ID
    status,             // filter by orderStatus
    startDate,          // date range filter
    endDate
  } = req.query;

  let query = {};

  if (status) {
    query.orderStatus = status;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Populate user info and search on that
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .lean(); // Convert to plain objects for better filtering

  let filteredOrders = orders;

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filteredOrders = orders.filter(order =>
      order._id.toString().includes(lowerKeyword) ||
      order.user?.name?.toLowerCase().includes(lowerKeyword) ||
      order.user?.email?.toLowerCase().includes(lowerKeyword)
    );
  }

  res.status(200).json({
    success: true,
    count: filteredOrders.length,
    orders: filteredOrders,
  });
});



// Admin: Delete order
export const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return next(new ErrorHandler('Order not found', 404));
  res.status(200).json({ success: true, message: 'Order deleted successfully' });
}); 




