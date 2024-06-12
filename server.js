import express from "express";
import cors from "cors";
import path from "path";
import { logger } from "./middleware/LogEvent.js";
import errHandler from "./middleware/errorhandler.js";
import corsOptions from "./config/corsOptions.js";
import authRoute from "./routes/api/auth.js";
import profileRoute from "./routes/api/profile.js";
import chatRoute from "./routes/api/chat.js";
import StudySessionRoute from "./routes/api/studySession.js";
import NotificationRoute from "./routes/api/notification.js";
import settingsRoute from "./routes/api/settings.js";
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3600;

cloudinary.config({
  cloud_name: "dlxovrmtr",
  api_key: process.env.CLOUDINARY_SECRET_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
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
app.set("view engine", "ejs");
// built-in middleware for static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/chats", chatRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/studysession", StudySessionRoute);
app.use("/api/notifications", NotificationRoute);

app.get("/", (req, res) => {
  res.render("breakend", { heading: "Break End!", name: "Qayyum" });
});
app.all("*", (req, res) => {
  res.sendStatus(404);
});

app.use(errHandler);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on PORT`, PORT);
  });
});
