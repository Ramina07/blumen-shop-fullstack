const express = require("express");
const axios = require("axios");
const { auth } = require("../middleware/auth");
const Order = require("../models/Order");

const router = express.Router();

/* ===== TELEGRAM CONFIG ===== */

const BOT_TOKEN = "8388243984:AAFMJtovJDtw7mkLQQOMNkfO_dLn2Z8qyAs";
const CHAT_ID = "-1003782995797";

/* ===== SEND TELEGRAM MESSAGE ===== */

async function sendTelegram(order){

  const itemsText = (order.items || [])
    .map(i => `• ${i.title} x${i.qty}`)
    .join("\n");

  const text =
  "🌸 Новый заказ\n\n" +
  "Заказ: " + order._id + "\n\n" +
  itemsText + "\n\n" +
  "Имя: " + order.customer?.name + "\n" +
  "Телефон: " + order.customer?.phone + "\n\n" +
  "Адрес: " + order.delivery?.address + "\n\n" +
  "Оплата: " + order.payment?.method + "\n\n" +
  "Сумма: " + order.totals?.total + " ₸";

  try{

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{

      chat_id: CHAT_ID,
      text: text,

      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Принять", callback_data: `accepted_${order._id}` },
            { text: "🚚 Отправлен", callback_data: `sent_${order._id}` }
          ],
          [
            { text: "📦 Доставлен", callback_data: `delivered_${order._id}` }
          ]
        ]
      }

    });

  }catch(err){
    console.log("Telegram error:", err.response?.data || err.message);
  }

}

/* ===== CREATE ORDER ===== */

router.post("/", auth, async (req, res) => {

  try{

    const body = req.body || {};

    if (!Array.isArray(body.items) || body.items.length === 0){
      return res.status(400).json({ message: "Корзина пустая" });
    }

    if (!body.customer?.name || !body.customer?.phone){
      return res.status(400).json({ message: "Заполните имя и телефон" });
    }

    if (!body.delivery?.address){
      return res.status(400).json({ message: "Введите адрес доставки" });
    }

    if (!body.payment?.method){
      return res.status(400).json({ message: "Выберите способ оплаты" });
    }

    const order = await Order.create({

      userId: req.user.id,
      items: body.items,
      customer: body.customer,

      delivery: {
        ...body.delivery,
        city: "Уральск"
      },

      payment: {
        method: body.payment.method,
        status: "pending"
      },

      totals: body.totals,
      status: "new"

    });

    /* отправляем заказ в Telegram */

    await sendTelegram(order);

    res.json({
      orderId: order._id.toString()
    });

  }catch(e){

    res.status(500).json({
      message: "Не удалось создать заказ"
    });

  }

});

/* ===== MY ORDERS ===== */

router.get("/my", auth, async (req, res) => {

  const orders = await Order
    .find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json({ orders });

});

module.exports = router;