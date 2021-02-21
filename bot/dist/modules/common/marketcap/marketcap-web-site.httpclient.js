"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketcapWebSiteApiHttpClient = void 0;
var axios_1 = __importDefault(require("axios"));
var host = "https://web-api.coinmarketcap.com/v1";
var marketcapWebSiteApi = {
    cryptocurrency: host + "/cryptocurrency"
};
exports.marketcapWebSiteApiHttpClient = {
    getMarketPairs: function (slug, start, limit) {
        if (start === void 0) { start = 1; }
        if (limit === void 0) { limit = 5000; }
        return axios_1.default
            .get(marketcapWebSiteApi.cryptocurrency + "/market-pairs/latest", {
            params: {
                slug: slug,
                start: start,
                limit: limit,
                convert: "USD",
                category: "spot",
                sort: "market_reputation",
                "aux": "num_market_pairs,notice,effective_liquidity,market_score,market_reputation"
            }
        })
            .then(function (response) { return response.data.data; });
    }
};
