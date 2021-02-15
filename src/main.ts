import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import { config } from "./config";
import { listingModule } from "./modules/currency/listing.module";
import { marketcapApiHttpClient } from "./modules/common/marketcap/marketcap-api.httpclient";

const bot = new TelegramBot(config.bot.token, { polling: true });

cron.schedule(config.cron.timer, () => {
    console.log('running a task');
    listingModule.track((chatId, listings) => {
        const tokens = (listings || []).map(t => t.name).join();
        const message = `Recently listed: ${tokens}`;
        bot.sendMessage(chatId, message);
        console.log('Notification sent: ' + message);
    });
});


bot.onText(/\/l (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const commandArg = match ? match[1] : "";

    const [command, arg] = commandArg.split(" ");

    if (!command) {
        console.log("command:" + command);
        console.log("arg:" + arg);
        bot.sendMessage(chatId, `Error, command or argument is empty`);
        return;
    }

    switch (command) {
        case "add":
            if (!arg) return;
            listingModule.updateListing(chatId, arg)
            break;

        case "remove":
            if (!arg) return;
            listingModule.remove(chatId, arg)
            break;

        case "all":
            listingModule.getAll(chatId).then(all => {
                bot.sendMessage(chatId, (all || []).join());
            });
            break;

        default:
            bot.sendMessage(chatId, `Command ${command} not support`);
            break;
    }
});
