const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    occasion: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
    composition: { type: [String], default: [] },
    inStock: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 4.8 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
