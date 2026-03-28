import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* ================= CREATE RAZORPAY ORDER ================= */

const createRazorpayOrder = async (req, res) => {

  try {

    const { amount } = req.body;

    const options = {
      amount: amount * 100, // paisa
      currency: "INR",
      receipt: "order_rcptid_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order
    });

  } catch (error) {

    console.error("RAZORPAY ORDER ERROR:", error);

    res.status(500).json({
      success: false
    });

  }
};

export { createRazorpayOrder };