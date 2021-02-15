import axios from 'axios';
import { IResponse } from '../../../models/response.model';
import { ITokenItem } from '../../../models/token-item.model';

const host = "https://pro-api.coinmarketcap.com/v1";
const marketcapApi = {
    cryptocurrency: `${host}/cryptocurrency`
};

const axiosHttpClient = axios.create();
axiosHttpClient.interceptors.request.use(config => {
    config.headers = config.headers || {};
    config.headers = { ...config.headers, ...{ "X-CMC_PRO_API_KEY": "b8a335e9-a66b-43c1-b345-0aa1e065eb9d" } }
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

export const marketcapApiHttpClient = {

    //https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyInfo
    getMap(symbols: string[], listing_status: string, start: number = 1, limit: number = 5000): Promise<ITokenItem[]> {
        const symbol = symbols && symbols.length ? symbols.join() : null;

        return axiosHttpClient
            .get<IResponse<ITokenItem[]>>(`${marketcapApi.cryptocurrency}/map`,
                {
                    params: {
                        symbol,
                        listing_status,
                        start,
                        limit,
                    }
                })
            .then(response => response.data.data);
    }
};