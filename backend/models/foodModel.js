import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    // Category reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // ⭐ NEW FIELD: Packed / Unpacked
    productType: {
      type: String,
      required: true,
      enum: ["Packed", "Unpacked"], // ensures only valid values
    },

    // Existing field (pause/resume)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const foodModel =
  mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;