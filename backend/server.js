// ================================
// server.js (FINAL CLEAN VERSION)
// ================================

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// =====================================
// FIX __dirname (ES MODULE SUPPORT)
// =====================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================
// LOAD ENV FILE FROM BACKEND FOLDER
// =====================================

dotenv.config({ path: path.resolve(__dirname, ".env") });

// =====================================
// DEBUG (Remove Later)
// =====================================

console.log("Loaded Faculty Code:", process.env.FACULTY_SECRET_CODE);

// =====================================
// IMPORT ROUTES AFTER ENV LOAD
// =====================================

import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import posRoutes from "./routes/posRoutes.js";
import settingsRoute from "./routes/settingsRoute.js";
import reportRoutes from "./routes/reportRoutes.js";
import categoryRouter from "./routes/categoryRoute.js";
import couponRouter from "./routes/couponRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================
// CORS
// =====================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://campusbites-nescafe.netlify.app",
      "https://campusbite-nescafeadmn.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// =====================================
// STATIC
// =====================================

app.use("/images", express.static(path.join(__dirname, "uploads")));

// =====================================
// ROUTES
// =====================================

app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRoutes);
app.use("/api/pos", posRoutes);
app.use("/api/settings", settingsRoute);
app.use("/api/reports", reportRoutes);
app.use("/api/categories", categoryRouter);
app.use("/api/coupon", couponRouter);

// =====================================
// DATABASE
// =====================================

connectDB();

// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {
  res.send("API Working — Server Online ✔");
});

// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
