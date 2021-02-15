import { Collection, DeleteWriteOpResultObject, InsertWriteOpResult, MongoClient, UpdateQuery, UpdateWriteOpResult, WithId } from "mongodb";
import { config } from "../config";
import { IChatScheme } from "./mcap.scheme";

export interface IDbConfig {
    connectionString: string;
    name: string;
}

const execute = <TScheme, TResult>(
    dbConfig: IDbConfig,
    collection: string,
    query: (collection: Collection<TScheme>) => Promise<TResult>) => {
    const dbClient = new MongoClient(dbConfig.connectionString);
    return dbClient.connect()
        .then(connection => connection.db(dbConfig.name))
        .then(db => db.collection(collection))
        .then(c => {
            var result = query(c);
            dbClient.close();
            return result;
        });

};

export const mcapDb = {
    chats: {
        getAll: () => {
            return execute<IChatScheme, IChatScheme[]>(config.db, "chats",
                (chats) => chats.find({}).toArray());
        },

        getById: (chatId: number) => {
            return execute<IChatScheme, IChatScheme | null>(config.db, "chats",
                (chats) => chats.findOne({ chatId }));
        },
        add: (items: IChatScheme[]) => {
            return execute<IChatScheme, InsertWriteOpResult<WithId<IChatScheme>>>(config.db, "chats",
                chats => chats.insertMany(items));
        },
        updateOne: (chatId: number, query: UpdateQuery<IChatScheme> | Partial<IChatScheme>) => {
            return execute<IChatScheme, UpdateWriteOpResult>(config.db, "chats",
                chats => chats.updateOne({ chatId }, query));
        },
        deleteOne: (chatId: number) => {
            return execute<IChatScheme, DeleteWriteOpResultObject>(config.db, "chats",
                chats => chats.deleteOne({ chatId }));
        }
    }
};