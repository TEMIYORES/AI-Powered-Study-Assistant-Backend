import express from "express";
import cors from "cors";
import path from "path";
import { logger } from "./middleware/LogEvent.js";
import errHandler from "./middleware/errorhandler.js";
import rootRouter from "./routes/root.js";
import subdirRouter from "./routes/subdir.js";
import registerRoute from "./routes/api/register.js";
import authRouter from "./routes/api/auth.js";
import refreshRoute from "./routes/api/refreshToken.js";
import logoutRouter from "./routes/api/logout.js";
import storeRouter from "./routes/api/store.js";
import productRouter from "./routes/api/products.js";
import categoryRouter from "./routes/api/categories.js";
import uploadRouter from "./routes/api/uploads.js";
import featuredRouter from "./routes/api/featured.js";
import cartRouter from "./routes/api/cart.js";
import checkoutRouter from "./routes/api/checkout.js";
import orderRouter from "./routes/api/order.js";
import adminRouter from "./routes/api/admin.js";
import corsOptions from "./config/corsOptions.js";
import VerifyJWT from "./middleware/verifyJwt.js";
import cookieParser from "cookie-parser";
import credentials from "./middleware/credentials.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import connectDB from "./config/connectDB.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
import { dirname } from "path";
const __dirname = dirname(__filename);

cloudinary.config({
  cloud_name: "dlxovrmtr",
  api_key: process.env.CLOUDINARY_SECRET_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();
// custom middleware logger
app.use(logger);

// Handle Options credentials check - use before CORS!
// and fetch cookies credentials requirement'
app.use(credentials);
// Cors
app.use(cors(corsOptions));

// Built in middleware to handle urlencoded data
// in other words form-data;
// 'Content-Type': 'application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// built-in middleware for static files
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", rootRouter);
app.use("/api/register", registerRoute);
app.use("/api/auth", authRouter);
app.use("/api/refresh", refreshRoute);
app.use("/api/logout", logoutRouter);
app.use("/api/featured", featuredRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/admin", adminRouter);
app.use(VerifyJWT);
app.use("/api/store", storeRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/orders", orderRouter);
app.use("/subdir", subdirRouter);

app.all("*", (req, res) => {
  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.status(404).json({ error: "404 Not Found" });
  } else {
    res.status(404).type("txt").send("404 Not Found");
  }
});

app.use(errHandler);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on PORT`, PORT);
  });
});
