import axios from 'axios';
import { IResponse } from '../../../models/response.model';
import { ITokenItem } from '../../../models/token-item.model';

const host = "https://web-api.coinmarketcap.com/v1";
const marketcapWebSiteApi = {
    cryptocurrency: `${host}/cryptocurrency`
};

export const marketcapWebSiteApiHttpClient = {

    getMarketPairs(slug: string, start: number = 1, limit: number = 5000): Promise<ITokenItem> {
        return axios
            .get<IResponse<ITokenItem>>(`${marketcapWebSiteApi.cryptocurrency}/market-pairs/latest`,
                {
                    params: {
                        slug,
                        start,
                        limit,
                        convert: "USD",
                        category: "spot",
                        sort: "market_reputation",
                        "aux": "num_market_pairs,notice,effective_liquidity,market_score,market_reputation"
                    }
                })
            .then(response => response.data.data);
    }
};