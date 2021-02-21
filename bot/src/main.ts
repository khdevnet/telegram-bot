import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import { config } from "./config";
import { listingModule } from "./modules/currency/listing.module";
import { ICmdArg, ListingCmd } from "./models/bot.model";


const bot = new TelegramBot(config.bot.token, { polling: true });

cron.schedule(config.cron.timer, () => {
    console.log('running a task');
    listingModule.track((chatId, listings) => {
        console.log(listings);
        const tokens = (listings || []).map(t => t.name).join();
        const message = `Recently listed: ${tokens}`;
        bot.sendMessage(chatId, message);
        console.log('Notification sent: ' + message);
    });
});


bot.onText(/\/l (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const commandArg = match ? match[1] : "";

    if (commandArg.startsWith(ListingCmd.add.name)) {
        const arg = getArg(commandArg, ListingCmd.add);
        if (!arg) return;
        listingModule.updateListing(chatId, arg);
        return;
    }

    if (commandArg.startsWith(ListingCmd.rmv.name)) {
        const arg = getArg(commandArg, ListingCmd.rmv);
        if (!arg) return;
        listingModule.remove(chatId, arg)
        return;
    }


    if (commandArg.startsWith(ListingCmd.all.name)) {
        const arg = getArg(commandArg, ListingCmd.all);
        if (!arg) return;
        listingModule.getAll(chatId).then(all => {
            bot.sendMessage(chatId, (all || []).join());
        });
        return;
    }

    bot.sendMessage(chatId, `Command ${commandArg} not support`);

});

console.log("started");

function getArg(commandArg: string, cmdArg: ICmdArg) {
    return commandArg.substring(cmdArg.length, commandArg.length);
}
