 import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from './routes/orderRouter.js';
import wishlistRouter from './routes/wishlistRouter.js';
import cartRouter from "./routes/cartRouter.js";
import paymentRouter from './routes/paymentRouter.js';
import { removeUnverifiedAccounts } from "./automation/removeUnverifiedAccounts.js";
import reviewRouter from './routes/reviewRouter.js';

export const app = express();
config({ path: "./config" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product",productRouter);
app.use("/api/v1/order",orderRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/payment", paymentRouter);
app.use('/api/v1/review', reviewRouter);

removeUnverifiedAccounts();
connection();

app.use(errorMiddleware); 