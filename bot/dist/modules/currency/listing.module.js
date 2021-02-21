"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingModule = void 0;
var mcap_dbclient_1 = require("../../database/mcap.dbclient");
var coingecko_api_httpclient_1 = require("../common/coingecko-api.httpclient");
var getListingsByChatId = function (chatId) { return mcap_dbclient_1.mcapDb.chats.getById(chatId).then(function (chat) { return chat === null || chat === void 0 ? void 0 : chat.listings; }); };
exports.listingModule = {
    updateListing: function (chatId, slug) {
        mcap_dbclient_1.mcapDb.chats
            .getById(chatId)
            .then(function (chat) {
            if (!chat) {
                mcap_dbclient_1.mcapDb.chats.add([{ chatId: chatId, listings: [slug] }]);
                return;
            }
            chat.listings = __spreadArrays(chat.listings, [slug]);
            mcap_dbclient_1.mcapDb.chats.updateOne(chatId, { $set: { listings: chat.listings } });
        });
    },
    remove: function (chatId, slug) {
        mcap_dbclient_1.mcapDb.chats
            .getById(chatId)
            .then(function (chat) {
            if (chat) {
                var token_1 = chat.listings.find(function (t) { return t === slug; });
                if (token_1) {
                    chat.listings = chat.listings.filter(function (t) { return t !== token_1; });
                    mcap_dbclient_1.mcapDb.chats.updateOne(chatId, { $set: { listings: chat.listings } });
                }
            }
        });
    },
    getAll: function (chatId) {
        return getListingsByChatId(chatId);
    },
    track: function (send) {
        return mcap_dbclient_1.mcapDb.chats.getAll()
            .then(function (chats) {
            chats.forEach(function (chat) {
                console.log("chat.listings");
                console.log(chat.listings);
                if (!chat.listings)
                    return;
                coingecko_api_httpclient_1.coingeckoApiHttpClient
                    .getCoins()
                    .then(function (data) { return data.filter(function (item) { return chat.listings.includes(item.name.toLowerCase()); }); })
                    .then(function (activeItems) {
                    if (!activeItems.length)
                        return;
                    send(chat.chatId, activeItems);
                });
            });
        });
    }
};
