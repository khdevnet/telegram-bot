const botgram = require("botgram")
const bot = botgram("618906845:AAEbB4nDBfuQftzJEPf5rcIco0ZWmwW_1I8");
bot.command("start", "help", (msg, reply) =>
  reply.text("To schedule an alert, do: /alert <seconds> <text>"))
bot.text(function (msg, reply, next) {
    console.log("Received a text message:", msg.text);
  });