const axios = require("axios")
const Order = require("./models/Order")

const BOT_TOKEN = "8388243984:AAFMJtovJDtw7mkLQQOMNkfO_dLn2Z8qyAs"

let offset = 0

async function checkUpdates(){

    try{

        const res = await axios.get(
            `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}`
        )

        const updates = res.data.result

        for(const update of updates){

            offset = update.update_id + 1

            if(update.callback_query){

                const data = update.callback_query.data
                const [status, orderId] = data.split("_")

                await Order.findByIdAndUpdate(orderId,{ status })

                console.log("Статус заказа изменен:", status)

            }

        }

    }catch(err){

        console.log("telegram error:", err.message)

    }

}

setInterval(checkUpdates, 2000)