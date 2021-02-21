"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
var node_cron_1 = __importDefault(require("node-cron"));
var config_1 = require("./config");
var listing_module_1 = require("./modules/currency/listing.module");
var bot_model_1 = require("./models/bot.model");
var bot = new node_telegram_bot_api_1.default(config_1.config.bot.token, { polling: true });
node_cron_1.default.schedule(config_1.config.cron.timer, function () {
    console.log('running a task');
    listing_module_1.listingModule.track(function (chatId, listings) {
        console.log(listings);
        var tokens = (listings || []).map(function (t) { return t.name; }).join();
        var message = "Recently listed: " + tokens;
        bot.sendMessage(chatId, message);
        console.log('Notification sent: ' + message);
    });
});
bot.onText(/\/l (.+)/, function (msg, match) {
    var chatId = msg.chat.id;
    var commandArg = match ? match[1] : "";
    if (commandArg.startsWith(bot_model_1.ListingCmd.add.name)) {
        var arg = getArg(commandArg, bot_model_1.ListingCmd.add);
        if (!arg)
            return;
        listing_module_1.listingModule.updateListing(chatId, arg);
        return;
    }
    if (commandArg.startsWith(bot_model_1.ListingCmd.rmv.name)) {
        var arg = getArg(commandArg, bot_model_1.ListingCmd.rmv);
        if (!arg)
            return;
        listing_module_1.listingModule.remove(chatId, arg);
        return;
    }
    if (commandArg.startsWith(bot_model_1.ListingCmd.all.name)) {
        var arg = getArg(commandArg, bot_model_1.ListingCmd.all);
        if (!arg)
            return;
        listing_module_1.listingModule.getAll(chatId).then(function (all) {
            bot.sendMessage(chatId, (all || []).join());
        });
        return;
    }
    bot.sendMessage(chatId, "Command " + commandArg + " not support");
});
console.log("started");
function getArg(commandArg, cmdArg) {
    return commandArg.substring(cmdArg.length, commandArg.length);
}
