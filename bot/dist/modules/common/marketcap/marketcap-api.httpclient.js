"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketcapApiHttpClient = void 0;
var axios_1 = __importDefault(require("axios"));
var host = "https://pro-api.coinmarketcap.com/v1";
var marketcapApi = {
    cryptocurrency: host + "/cryptocurrency"
};
var axiosHttpClient = axios_1.default.create();
axiosHttpClient.interceptors.request.use(function (config) {
    config.headers = config.headers || {};
    config.headers = __assign(__assign({}, config.headers), { "X-CMC_PRO_API_KEY": "b8a335e9-a66b-43c1-b345-0aa1e065eb9d" });
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
exports.marketcapApiHttpClient = {
    //https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyInfo
    getMap: function (symbols, listing_status, start, limit) {
        if (start === void 0) { start = 1; }
        if (limit === void 0) { limit = 5000; }
        var symbol = symbols && symbols.length ? symbols.join() : null;
        return axiosHttpClient
            .get(marketcapApi.cryptocurrency + "/map", {
            params: {
                symbol: symbol,
                listing_status: listing_status,
                start: start,
                limit: limit,
            }
        })
            .then(function (response) { return response.data.data; });
    }
};
