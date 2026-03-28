// ================================
// server.js (FINAL CLEAN VERSION)
// ================================

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// =====================================
// FIX __dirname (ES MODULE SUPPORT)
// =====================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================
// LOAD ENV FILE
// =====================================

dotenv.config({ path: path.resolve(__dirname, ".env") });

// =====================================
// IMPORT ROUTES
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
// webhookRoute from "./routes/webhookRoute.js"; // 🔥 REMOVED (duplicate)

// =====================================
// INIT APP
// =====================================

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
      "http://127.0.0.1:5500",
      "https://campusbites-nescafe.netlify.app/",
    ],
    credentials: true,
  })
);

// =====================================
// 🔥 PERFECT MIDDLEWARE ORDER
// =====================================

// ✅ 1. Webhook raw parser (MUST be FIRST)
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

// ✅ 2. Normal JSON for other APIs
app.use(express.json());

// =====================================
// STATIC FILES
// =====================================

app.use("/images", express.static(path.join(__dirname, "uploads")));

// =====================================
// ROUTES (PERFECT ORDER)
// =====================================

app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRoutes);  // ✅ Webhook at /api/payment/webhook
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
// HEALTH CHECK
// =====================================

app.get("/", (req, res) => {
  res.json({ 
    message: "API Working — Server Online ✔", 
    timestamp: new Date().toISOString(),
    paymentStatus: "READY"
  });
});

// =====================================
// 404 HANDLER
// =====================================

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
  console.log(`📱 Webhook ready: http://localhost:${PORT}/api/payment/webhook`);
  console.log(`🔍 Health: http://localhost:${PORT}/`);
});
