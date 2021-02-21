import { mcapDb } from '../../database/mcap.dbclient';
import { ITokenItem } from '../../models/coingecko.model';
import { coingeckoApiHttpClient } from '../common/coingecko-api.httpclient';


const getListingsByChatId = (chatId: number) => mcapDb.chats.getById(chatId).then(chat => chat?.listings);

export const listingModule = {
    updateListing(chatId: number, slug: string) {
        mcapDb.chats
            .getById(chatId)
            .then(chat => {
                if (!chat) {
                    mcapDb.chats.add([{ chatId, listings: [slug] }]);
                    return;
                }
                chat.listings = [...chat.listings, slug];
                mcapDb.chats.updateOne(chatId, { $set: { listings: chat.listings } });
            });
    },

    remove(chatId: number, slug: string) {
        mcapDb.chats
            .getById(chatId)
            .then(chat => {
                if (chat) {
                    const token = chat.listings.find(t => t === slug);
                    if (token) {
                        chat.listings = chat.listings.filter(t => t !== token);
                        mcapDb.chats.updateOne(chatId, { $set: { listings: chat.listings } });
                    }
                }
            });
    },

    getAll(chatId: number) {
        return getListingsByChatId(chatId);
    },

    track(send: (chatId: number, items: ITokenItem[]) => void) {
        return mcapDb.chats.getAll()
            .then(chats => {
                chats.forEach(chat => {
                    console.log("chat.listings");
                    console.log(chat.listings);
                    if (!chat.listings) return;

                    coingeckoApiHttpClient
                        .getCoins()
                        .then(data => data.filter(item => chat.listings.includes(item.name.toLowerCase())))
                        .then(activeItems => {
                            if (!activeItems.length) return;

                            send(chat.chatId, activeItems);
                        });
                })
            });

    }
};
