# 🛍️ Fullstack Fashion eCommerce Website

A modern, scalable, and full-featured **fashion eCommerce website** built using the **MERN stack** (MongoDB, Express, React, Node.js) with advanced functionality for both users and admins.

## 🚀 Live Demo
(Deploy link here, e.g., Vercel + Render/Netlify + Railway/Heroku)

---

## 🧰 Tech Stack

### 🔹 Frontend:
- React (No TypeScript)
- React Router DOM
- Tailwind CSS or Bootstrap
- Axios
- Stripe (Card payments)
- Toastify (Notifications)
- JWT (with HttpOnly cookie)

### 🔹 Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- Stripe API
- Twilio + Nodemailer (for verification & emails)
- dotenv, bcrypt, cookie-parser, etc.

---

## ✨ Features

### 👤 User Features:
- Register & Login (JWT + HttpOnly Cookie)
- SMS & Email Verification
- Browse Products (by category, search, filters)
- Product Details (with ratings, stock by size/color)
- Add to Cart / Wishlist
- Size & Quantity Selector (Modal-based)
- Checkout (Shipping Info + COD/Card)
- Stripe Payment Integration
- My Orders Page (View, Cancel if Pending)
- Order Details Page
- Leave Product Reviews (Rating + Comment)
- Profile Dropdown (Edit Profile, Logout, etc.)
- Dark Mode Support

### 📦 Admin Features:
- Create / Edit / Delete Products
- Manage Orders & Users (via Postman or DB)
- Moderate Product Reviews

### 💬 Reviews System:
- Submit only after purchase (email link)
- Profanity Filtering
- Min length enforcement
- Moderation (pending, approved, rejected)
- Rating breakdown (stars + percentage bars)

### 📧 Email & Notifications:
- Order status email alerts
- Review reminder after delivery

---

## 📂 Folder Structure

```bash
├── client/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.js
├── server/                # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── server.js
