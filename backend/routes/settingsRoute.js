import express from "express";
import SettingsModel from "../models/settingsModel.js";

const router = express.Router();

/* ============================
   GET ALL SETTINGS
============================ */
router.get("/", async (req, res) => {
  try {
    let settings = await SettingsModel.findOne();

    if (!settings) {
      settings = await SettingsModel.create({
        deliveryFee: 10,
        kitchenOpen: true
      });
    }

    res.json({
      success: true,
      deliveryFee: settings.deliveryFee,
      kitchenOpen: settings.kitchenOpen
    });

  } catch (error) {
    console.error("Error fetching settings:", error);
    res.json({ success: false, message: "Failed to fetch settings" });
  }
});


/* ============================
   UPDATE DELIVERY FEE
============================ */
router.post("/update-delivery-fee", async (req, res) => {
  try {
    const { deliveryFee } = req.body;

    if (deliveryFee === undefined || isNaN(deliveryFee)) {
      return res.json({ success: false, message: "Invalid delivery fee" });
    }

    let settings = await SettingsModel.findOne();

    if (!settings) {
      settings = await SettingsModel.create({ deliveryFee });
    } else {
      settings.deliveryFee = deliveryFee;
      await settings.save();
    }

    res.json({
      success: true,
      deliveryFee: settings.deliveryFee
    });

  } catch (error) {
    console.error("Error updating settings:", error);
    res.json({ success: false, message: "Failed to update settings" });
  }
});


/* ============================
   SET KITCHEN STATUS (FIXED ✅)
============================ */
router.post("/set-kitchen", async (req, res) => {
  try {
    const { kitchenOpen } = req.body;

    if (typeof kitchenOpen !== "boolean") {
      return res.json({
        success: false,
        message: "Invalid kitchen status"
      });
    }

    let settings = await SettingsModel.findOne();

    if (!settings) {
      settings = await SettingsModel.create({
        deliveryFee: 10,
        kitchenOpen
      });
    } else {
      settings.kitchenOpen = kitchenOpen;
      await settings.save();
    }

    res.json({
      success: true,
      kitchenOpen: settings.kitchenOpen
    });

  } catch (error) {
    console.error("Error setting kitchen:", error);
    res.json({
      success: false,
      message: "Failed to update kitchen status"
    });
  }
});

export default router;