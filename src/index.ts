import TelegramBot from "node-telegram-bot-api";
import { User } from "node-telegram-bot-api";

class UserNumber {
    constructor(public numb: number, public user: User | undefined) { }
}


const bot = new TelegramBot("", { polling: true });
const usersQueue: UserNumber[] = [];
let counter = 0;


bot.onText(/\/add/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    counter = ++counter;

    const messageUser = msg.from;
    const messageUserName = messageUser ? messageUser.first_name : "unknown";
    usersQueue.push(new UserNumber(counter, msg.from));
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `User ${messageUserName} added to queue with number ${counter}.`);

});

bot.onText(/\/next/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    const chatId = msg.chat.id;
    const messageUser = msg.from ? msg.from : { id: "" };

    bot.getChatAdministrators(chatId).then((admins) => {
        if (admins.find(ad => ad.user.id === messageUser.id && ad.status === "administrator")) {
            const messageUser = usersQueue.shift();
            if (messageUser) {
                const messageUserName = messageUser.user ? messageUser.user.first_name : "unknown";

                // send back the matched "whatever" to the chat
                bot.sendMessage(chatId, messageUserName);
            }
        } else {
            bot.sendMessage(chatId, "You are not admin");
        }
    }).catch(() => bot.sendMessage(chatId, "Error"));
});

bot.onText(/\/count/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `${usersQueue.length}`);

});

