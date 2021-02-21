import axios from 'axios';
import { ITokenItem } from '../../models/coingecko.model';

const host = "https://api.coingecko.com/api/";
const apis = {
    coins: `${host}/v3/coins`
};

const axiosHttpClient = axios.create();
axiosHttpClient.interceptors.request.use(config => {
    config.headers = config.headers || {};
    config.headers = { ...config.headers, ...{ "X-CMC_PRO_API_KEY": "b8a335e9-a66b-43c1-b345-0aa1e065eb9d" } }
    return config;
}, error => {
    return Promise.reject(error);
});

export const coingeckoApiHttpClient = {

    getCoins(include_platform: boolean = true): Promise<ITokenItem[]> {
        return axiosHttpClient
            .get<ITokenItem[]>(`${apis.coins}/list`,
                {
                    params: {
                        include_platform
                    }
                })
            .then(response => response.data);
    }
};