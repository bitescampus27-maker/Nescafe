// ================================
// server.js (FINAL CLEAN VERSION - FIXED ROUTES)
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
// IMPORT CORE MODULES
// =====================================

import { connectDB } from "./config/db.js";

// =====================================
// DYNAMIC ROUTE LOADER (FIXES RENDER 404)
// =====================================
async function loadRoutes(app) {
  try {
    console.log("🔄 Loading routes...");
    
    const [
      userRouter,
      foodRouter,
      cartRouter,
      orderRouter,
      paymentRoutes,
      posRoutes,
      settingsRoute,
      reportRoutes,
      categoryRouter,
      couponRouter
    ] = await Promise.all([
      import("./routes/userRoute.js"),
      import("./routes/foodRoute.js"),
      import("./routes/cartRoute.js"),
      import("./routes/orderRoute.js"),
      import("./routes/paymentRoutes.js"),
      import("./routes/posRoutes.js"),
      import("./routes/settingsRoute.js"),
      import("./routes/reportRoutes.js"),
      import("./routes/categoryRoute.js"),
      import("./routes/couponRoute.js")
    ]);

    // ✅ MOUNT ALL ROUTES
    app.use("/api/user", userRouter.default || userRouter);
    app.use("/api/food", foodRouter.default || foodRouter);
    app.use("/api/cart", cartRouter.default || cartRouter);
    app.use("/api/order", orderRouter.default || orderRouter);
    app.use("/api/payment", paymentRoutes.default || paymentRoutes);
    app.use("/api/pos", posRoutes.default || posRoutes);
    app.use("/api/settings", settingsRoute.default || settingsRoute);
    app.use("/api/reports", reportRoutes.default || reportRoutes);
    app.use("/api/categories", categoryRouter.default || categoryRouter);
    app.use("/api/coupon", couponRouter.default || couponRouter);

    console.log("✅ All 10 routes loaded successfully!");
  } catch (error) {
    console.error("❌ Route loading failed:", error.message);
    throw error;
  }
}

// =====================================
// INIT APP
// =====================================

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================
// CORS (PERFECT CONFIG)
// =====================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5500",
      "https://campusbites-nescafe.netlify.app",
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
// HEALTH CHECK (BEFORE ROUTES)
// =====================================

app.get("/", (req, res) => {
  res.json({ 
    message: "API Working — Server Online ✔", 
    timestamp: new Date().toISOString(),
    paymentStatus: "READY",
    routes: [
      "/api/categories",
      "/api/food/list", 
      "/api/user",
      "/api/payment"
    ]
  });
});

// =====================================
// MAIN STARTUP FUNCTION
// =====================================

async function startServer() {
  try {
    console.log("🚀 Starting CampusBite API...");
    
    // ✅ 1. Connect Database
    await connectDB();
    console.log("✅ Database connected!");
    
    // ✅ 2. Load Routes
    await loadRoutes(app);
    
    // ✅ 3. Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
      console.log(`🌐 Health: http://localhost:${PORT}/`);
      console.log(`📱 Webhook: http://localhost:${PORT}/api/payment/webhook`);
      console.log(`✅ Ready for production!`);
    });

    // =====================================
    // 404 HANDLER (AFTER ALL ROUTES)
    // =====================================
    app.use("*", (req, res) => {
      res.status(404).json({ 
        error: "Route not found", 
        available: ["/api/categories", "/api/food/list", "/"] 
      });
    });

  } catch (error) {
    console.error("💥 Startup failed:", error);
    process.exit(1);
  }
}

// =====================================
// START THE SERVER
// =====================================

startServer();
