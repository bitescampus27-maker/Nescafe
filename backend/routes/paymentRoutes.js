import express from "express";
import { razorpayInstance } from "../config/razorpay.js";
import crypto from "crypto";
import Order from "../models/orderModel.js";

const router = express.Router();

/* ================= CREATE RAZORPAY ORDER ================= */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }

    const options = {
      amount: Math.round(amount * 100), // paisa
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      id: order.id,
      currency: order.currency,
      amount: order.amount
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed"
    });
  }
});

/* ================= VERIFY PAYMENT ================= */
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      address,
      amount
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // ✅ VALID SIGNATURE
    if (expectedSignature === razorpay_signature) {

      const newOrder = await Order.create({
        orderNumber: "CB-" + Math.floor(100000 + Math.random() * 900000), // ✅ FIX

        items,
        address,
        amount,

        paymentMethod: "ONLINE",
        paymentStatus: "PAID",
        status: "CONFIRMED",
        payment: true,

        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id
      });

      console.log("✅ ORDER CREATED:", newOrder._id);

      return res.json({
  success: true,
  orderId: newOrder._id   // ✅ SEND REAL ID
});
    }

    // ❌ INVALID SIGNATURE
    return res.status(400).json({
      success: false,
      message: "Invalid signature"
    });

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
});

/* ================= WEBHOOK (SAFE - LOG ONLY) ================= */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const event = JSON.parse(req.body);

      console.log("📩 Webhook Event:", event.event);

      res.status(200).json({ received: true });

    } catch (error) {
      console.error("❌ WEBHOOK ERROR:", error);
      res.status(400).send("Error");
    }
  }
);

export default router;