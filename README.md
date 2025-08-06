# 🛍️ fashion zero

A modern, fully responsive, and fully functional **fashion website** built with the **MERN stack** (MongoDB, Express, React, Node.js). This platform delivers a seamless and elegant shopping experience tailored specifically for the fashion industry — combining a **stylish user interface**, **advanced product interaction**, and **robust user personalization**.

It includes a comprehensive **Admin Panel** for managing products, orders, users, and reviews — making it ideal for real-world fashion retail operations.

> 💡 This is **not a clone** of any existing site — it has a **unique design and structure** developed from scratch with original styling, UX patterns, and features focused on fashion-first functionality.

## 📁 Project Type

**Frontend | Backend | Fullstack** → ✅ Fullstack

## 🚀 Live Demo

👉 [**fashion zero**](https://fashion-zero-client.onrender.com/)

## Video Walkthrough of the project
<a href="https://youtu.be/2N29GB4qw90?si=gL1B43rYzqPPwf_1">project presentation</a>

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
