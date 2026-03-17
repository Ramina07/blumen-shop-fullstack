const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, min: 1 },
        image: { type: String, default: "" }
      }
    ],

    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true }
    },

    delivery: {
      city: { type: String, default: "Уральск" },
      address: { type: String, required: true },
      comment: { type: String, default: "" },
      date: { type: String, default: "" },
      time: { type: String, default: "" }
    },

    payment: {
      method: { type: String, required: true },
      status: { type: String, enum: ["pending", "paid"], default: "pending" }
    },

    totals: {
      itemsSum: { type: Number, required: true },
      deliveryFee: { type: Number, required: true },
      total: { type: Number, required: true }
    },

    status: {
      type: String,
      enum: ["new", "confirmed", "in_delivery", "done", "canceled"],
      default: "new"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
