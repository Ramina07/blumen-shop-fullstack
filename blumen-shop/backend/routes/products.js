const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// список товаров
router.get("/", async (req, res) => {
  try {
    const { category, search, sort, limit } = req.query;

    const q = {};
    if (category && category !== "Все") q.category = category;

    if (search) {
      q.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    let cursor = Product.find(q);

    if (sort === "price_asc") cursor = cursor.sort({ price: 1 });
    else if (sort === "price_desc") cursor = cursor.sort({ price: -1 });
    else cursor = cursor.sort({ createdAt: -1 });

    const lim = Math.max(1, Math.min(parseInt(limit || "60", 10), 200));
    const items = await cursor.limit(lim);

    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

// товар по slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;