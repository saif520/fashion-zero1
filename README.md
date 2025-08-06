# 🛍️ fashion zero

A modern, fully responsive, and fully functional **fashion website** built with the **MERN stack** (MongoDB, Express, React, Node.js). This platform delivers a seamless and elegant shopping experience tailored specifically for the fashion industry — combining a **stylish user interface**, **advanced product interaction**, and **robust user personalization**.

It includes a comprehensive **Admin Panel** for managing products, orders, users, and reviews — making it ideal for real-world fashion retail operations.

> 💡 This is **not a clone** of any existing site — it has a **unique design and structure** developed from scratch with original styling, UX patterns, and features focused on fashion-first functionality.

## 📁 Project Type

**Frontend | Backend | Fullstack** → ✅ Fullstack

## 🚀 Live Demo

👉 [**fashion zero**](https://fashion-zero-client.onrender.com/)

## Video Walkthrough of the project
 👉 <a href="https://youtu.be/2N29GB4qw90?si=gL1B43rYzqPPwf_1">project presentation</a>

 ## ✨ Features

### 👤 User Features:
- Register & Login (JWT + HttpOnly Cookie)
- Phone Call & Email Verification
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

## 🧰 Tech Stack

### 🔹 Frontend:
- React (JavaScript, no TypeScript)
- React Router DOM
- Plain CSS (custom styling)
- Axios (for HTTP requests)
- Stripe (for card payments)
- React Toastify (notifications)
- JWT (stored in HttpOnly cookies for security)

### 🔹 Backend:
- Node.js
- Express.js
- MongoDB (hosted on **MongoDB Atlas**)
- Mongoose (ODM for MongoDB)
- Stripe API (payment gateway)
- Twilio (for phone number verification)
- Nodemailer (for sending emails)
- Multiple utility packages:
  - `dotenv`, `bcrypt`, `cookie-parser`, `cors` and more

---

## 📁 Folder Structure

``bash
root/
├── client/
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── layout/ # Shared layout components (Header, Footer, etc.)
│ │ ├── pages/ # All page-level React components
│ │ ├── services/ # Axios API service functions
│ │ ├── styles/ # CSS files
│ │ ├── utils/ # Utility functions/helpers
│ │ ├── .env # Environment variables for Vite
│ │ ├── .gitignore
│ │ ├── eslint.config.js
│ │ ├── index.html # Main HTML file
│ │ ├── README.md # Frontend-specific README (if any)
│ │ ├── package-lock.json
│ │ ├── package.json
│ │ └── vite.config.js # Vite configuration
│
├── server/ # Backend (Node.js + Express)
│ ├── automation/ # Scripts for automation (e.g. review emails)
│ ├── controllers/ # Request handlers
│ ├── database/ # MongoDB connection setup
│ ├── middlewares/ # Custom Express middlewares
│ ├── models/ # Mongoose models
│ ├── node_modules/
│ ├── routes/ # Express routes
│ ├── utils/ # Utility functions/helpers
│ ├── views/ # Email templates or other views
│ ├── .env # Environment variables
│ ├── .gitignore
│ ├── app.js # App initialization
│ ├── package-lock.json
│ ├── package.json
│ └── server.js # Main server entry point

