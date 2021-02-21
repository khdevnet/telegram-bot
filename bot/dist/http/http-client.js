"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpClient = void 0;
var axios_1 = __importDefault(require("axios"));
var axiosHttpClient = axios_1.default.create();
axiosHttpClient.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
exports.httpClient = {
    get: function (url, config) {
        return axiosHttpClient.get(url, config);
    }
};
