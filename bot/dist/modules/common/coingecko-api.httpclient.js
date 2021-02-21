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
exports.coingeckoApiHttpClient = void 0;
var axios_1 = __importDefault(require("axios"));
var host = "https://api.coingecko.com/api/";
var apis = {
    coins: host + "/v3/coins"
};
var axiosHttpClient = axios_1.default.create();
axiosHttpClient.interceptors.request.use(function (config) {
    config.headers = config.headers || {};
    config.headers = __assign(__assign({}, config.headers), { "X-CMC_PRO_API_KEY": "b8a335e9-a66b-43c1-b345-0aa1e065eb9d" });
    return config;
}, function (error) {
    return Promise.reject(error);
});
exports.coingeckoApiHttpClient = {
    getCoins: function (include_platform) {
        if (include_platform === void 0) { include_platform = true; }
        return axiosHttpClient
            .get(apis.coins + "/list", {
            params: {
                include_platform: include_platform
            }
        })
            .then(function (response) { return response.data; });
    }
};
