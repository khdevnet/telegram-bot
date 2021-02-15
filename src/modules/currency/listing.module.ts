import { mcapDb } from '../../database/mcap.dbclient';
import { ITokenItem } from '../../models/token-item.model';

import { marketcapApiHttpClient } from "../common/marketcap/marketcap-api.httpclient";

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

        // marketcapApiHttpClient
        //     .getMap([slug], "untracked")
        //     .then(data => data.forEach(element => {
        //         listings.push(element);
        //         console.log("Token added: " + element.slug);
        //     }));
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
                    if (!chat.listings) return;

                    marketcapApiHttpClient
                        .getMap(chat.listings, "untracked")
                        .then(data => data.filter(item => item.is_active))
                        .then(activeItems => {
                            if (!activeItems.length) return;
                            
                            send(chat.chatId, activeItems);
                        });
                })
            });

    }
};
