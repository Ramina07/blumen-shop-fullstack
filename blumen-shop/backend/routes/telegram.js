const express = require("express");
const axios = require("axios");
const Order = require("../models/Order");

const router = express.Router();

const BOT_TOKEN = "ТВОЙ_TOKEN_БОТА";

router.post("/", async (req, res) => {

  try {

    const callback = req.body.callback_query;
    if (!callback) return res.sendStatus(200);

    const data = callback.data;
    const [status, orderId] = data.split("_");

    /* меняем статус в MongoDB */

    await Order.findByIdAndUpdate(orderId, { status });

    const chatId = callback.message.chat.id;
    const messageId = callback.message.message_id;
    const callbackId = callback.id;

    let statusText = "Новый";

    if (status === "accepted") statusText = "✅ Принят";
    if (status === "sent") statusText = "🚚 Отправлен";
    if (status === "delivered") statusText = "📦 Доставлен";

    /* обновляем сообщение */

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
      chat_id: chatId,
      message_id: messageId,
      text: `🌸 Заказ\n\nСтатус: ${statusText}`
    });

    /* подтверждаем нажатие кнопки */

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      callback_query_id: callbackId,
      text: "Статус обновлён"
    });

    res.sendStatus(200);

  } catch (err) {

    console.log("telegram error:", err.response?.data || err.message);
    res.sendStatus(200);

  }

});

module.exports = router;