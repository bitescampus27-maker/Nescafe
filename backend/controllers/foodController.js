import foodModel from "../models/foodModel.js";
import fs from "fs";

/* ================= ADD FOOD ================= */
const addFood = async (req, res) => {
  try {
    const { name, description, price, category, productType } = req.body;

    if (!req.file) {
      return res.json({
        success: false,
        message: "Image is required",
      });
    }

    if (!productType) {
      return res.json({
        success: false,
        message: "Product type is required",
      });
    }

    // ✅ NORMALIZE TYPE
    const normalizedType =
      String(productType || "")
        .trim()
        .toLowerCase() === "packed"
        ? "Packed"
        : "Unpacked";

    const newFood = new foodModel({
      name,
      description,
      price,
      category,
      productType: normalizedType,
      image: req.file.filename,
      isActive: true,
    });

    await newFood.save();

    res.json({
      success: true,
      message: "Food added successfully",
    });

  } catch (error) {
    console.error("ADD FOOD ERROR:", error);
    res.json({
      success: false,
      message: "Error adding food",
    });
  }
};

/* ================= LIST FOOD ================= */
const listFood = async (req, res) => {
  try {
    const isAdmin = req.query.admin === "true";

    let foods;

    if (isAdmin) {
      foods = await foodModel
        .find({})
        .populate("category")
        .sort({ createdAt: -1 });
    } else {
      foods = await foodModel
        .find({ isActive: true })
        .populate("category")
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      data: foods,
    });

  } catch (error) {
    console.error("LIST FOOD ERROR:", error);
    res.json({
      success: false,
      message: "Error fetching food list",
    });
  }
};

/* ================= REMOVE FOOD ================= */
const removeFood = async (req, res) => {
  try {
    const { id } = req.body;

    const food = await foodModel.findById(id);

    if (!food) {
      return res.json({
        success: false,
        message: "Food not found",
      });
    }

    if (food.image) {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) console.log("Image delete error:", err);
      });
    }

    await foodModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Food removed successfully",
    });

  } catch (error) {
    console.error("REMOVE FOOD ERROR:", error);
    res.json({
      success: false,
      message: "Error removing food",
    });
  }
};

/* ================= UPDATE FOOD ================= */
const updateFood = async (req, res) => {
  try {
    const { id, name, description, price, category, productType } = req.body;

    const food = await foodModel.findById(id);

    if (!food) {
      return res.json({
        success: false,
        message: "Food not found",
      });
    }

    if (req.file) {
      if (food.image) {
        fs.unlink(`uploads/${food.image}`, (err) => {
          if (err) console.log("Image delete error:", err);
        });
      }
      food.image = req.file.filename;
    }

    // ✅ NORMALIZE TYPE
    const normalizedType =
      String(productType || "")
        .trim()
        .toLowerCase() === "packed"
        ? "Packed"
        : "Unpacked";

    food.name = name;
    food.description = description;
    food.price = price;
    food.category = category;
    food.productType = normalizedType;

    await food.save();

    res.json({
      success: true,
      message: "Food updated successfully",
    });

  } catch (error) {
    console.error("UPDATE FOOD ERROR:", error);
    res.json({
      success: false,
      message: "Error updating food",
    });
  }
};

/* ================= TOGGLE FOOD STATUS ================= */
const toggleFoodStatus = async (req, res) => {
  try {
    const { id } = req.body;

    const food = await foodModel.findById(id);

    if (!food) {
      return res.json({
        success: false,
        message: "Food not found",
      });
    }

    food.isActive = !food.isActive;
    await food.save();

    res.json({
      success: true,
      message: `Food ${food.isActive ? "resumed" : "paused"} successfully`,
      isActive: food.isActive,
    });

  } catch (error) {
    console.error("TOGGLE STATUS ERROR:", error);
    res.json({
      success: false,
      message: "Error updating food status",
    });
  }
};

export {
  addFood,
  listFood,
  removeFood,
  updateFood,
  toggleFoodStatus,
};