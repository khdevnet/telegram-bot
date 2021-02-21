"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcapDb = void 0;
var mongodb_1 = require("mongodb");
var config_1 = require("../config");
var execute = function (dbConfig, collection, query) {
    var dbClient = new mongodb_1.MongoClient(dbConfig.connectionString);
    return dbClient.connect()
        .then(function (connection) { return connection.db(dbConfig.name); })
        .then(function (db) { return db.collection(collection); })
        .then(function (c) {
        var result = query(c);
        dbClient.close();
        return result;
    });
};
exports.mcapDb = {
    chats: {
        getAll: function () {
            return execute(config_1.config.db, "chats", function (chats) { return chats.find({}).toArray(); });
        },
        getById: function (chatId) {
            return execute(config_1.config.db, "chats", function (chats) { return chats.findOne({ chatId: chatId }); });
        },
        add: function (items) {
            return execute(config_1.config.db, "chats", function (chats) { return chats.insertMany(items); });
        },
        updateOne: function (chatId, query) {
            return execute(config_1.config.db, "chats", function (chats) { return chats.updateOne({ chatId: chatId }, query); });
        },
        deleteOne: function (chatId) {
            return execute(config_1.config.db, "chats", function (chats) { return chats.deleteOne({ chatId: chatId }); });
        }
    }
};
