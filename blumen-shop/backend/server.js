const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const telegramRoutes = require("./routes/telegram");

const app = express();

/* middleware */

app.use(cors());
app.use(express.json({ limit: "2mb" }));

/* статика фронта */

app.use("/", express.static(path.join(__dirname, "..", "frontend")));

/* API */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

/* telegram callback */

app.use("/telegram", telegramRoutes);

/* health check */

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 5050;

/* запуск сервера */

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Сервер: http://localhost:${port}`);
    });

    /* запускаем telegram polling */

    require("./telegramBot");

  })
  .catch((e) => {
    console.error("❌ Ошибка MongoDB", e.message);
    process.exit(1);
  });